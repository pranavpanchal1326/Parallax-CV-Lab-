import { useEffect, useRef, useState } from "react";
import { downloadJson } from "../components/ExportFallback";
import { Link } from "react-router";
import { useLab } from "../app/context";
import { experiments, fixtures } from "../data/fixtures";
import { selectors } from "../domain/adapter";
import {
  MemoryDeskRepository,
  createDeskState,
  fullManifest,
  operationActors,
  publicDeskProjection,
  sessionApplicability,
  timeLabel,
  type ActorId,
  type DeskCommand,
  type DeskResult,
  type Handover,
  type Policy,
} from "../domain/operationsDesk";
import {
  operationsKey,
  readDesk,
  saveDesk,
} from "../data/operationsPersistence";
import { deskRunbooks, operatingOwners } from "../data/operationsRunbooks";

const exportRecord = downloadJson;
const requestId = () => crypto.randomUUID();
export function OperationsDesk() {
  const { state: operational } = useLab();
  const [tab, setTab] = useState<
    "allocation" | "method" | "handover" | "save" | "runbooks"
  >("allocation");
  const [loaded] = useState(() =>
    typeof window === "undefined"
      ? { state: createDeskState(), raw: null, warning: null, blocked: false }
      : readDesk(() => window.localStorage),
  );
  const [repository, setRepository] = useState(
    () => new MemoryDeskRepository(loaded.state),
  );
  const [desk, setDesk] = useState(() => repository.snapshot());
  const [actor, setActor] = useState<ActorId>("pairA");
  const [experiment, setExperiment] = useState<"E01" | "E06">("E06");
  const [day, setDay] = useState("2026-10-06");
  const [start, setStart] = useState(600);
  const [duration, setDuration] = useState(60);
  const [delivery, setDelivery] = useState("normal");
  const [lastRequest, setLastRequest] = useState<{
    command: DeskCommand;
    actor: ActorId;
  }>();
  const [result, setResult] = useState<DeskResult>();
  const [lookupId, setLookupId] = useState("");
  const [ack, setAck] = useState("Ready. The result of each action appears here.");
  const [queued, setQueued] = useState<{
    command: Extract<DeskCommand, { type: "reserve" }>;
    actor: ActorId;
  }>();
  const [raw, setRaw] = useState<string | null>(loaded.raw);
  const [warning, setWarning] = useState(
    loaded.warning ||
      "Exercise changes are in memory until you explicitly save a snapshot.",
  );
  const [previousExercise, setPreviousExercise] = useState<{
    state: ReturnType<MemoryDeskRepository["snapshot"]>;
    pending: typeof queued;
    request: typeof lastRequest;
  }>();
  const [busy, setBusy] = useState(false);
  const [policyReason, setPolicyReason] = useState("");
  const [existingRule, setExistingRule] = useState<
    Policy["existingSessions"] | ""
  >("");
  const [equipmentReason, setEquipmentReason] = useState("");
  const [handoverNote, setHandoverNote] = useState("");
  const [nextOwner, setNextOwner] = useState<Handover["owner"]>("technician");
  const [topic, setTopic] = useState<Handover["topic"]>("equipment");
  const [due, setDue] = useState("Before the next capture session");
  const mounted = useRef(true);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mounted.current = true;
    const changed = (event: StorageEvent) => {
      if (event.key === operationsKey)
        setWarning(
          "Another tab changed the saved exercise. Export this version and the retained version before reconciling; saving will refuse a competing write.",
        );
    };
    window.addEventListener("storage", changed);
    return () => {
      mounted.current = false;
      window.removeEventListener("storage", changed);
    };
  }, []);
  const projection = publicDeskProjection(desk);
  const snapshotSaved =
    raw === JSON.stringify({ schemaVersion: 1, state: desk });
  const command = (type: string, fields: Record<string, unknown>) =>
    ({ id: requestId(), type, ...fields }) as DeskCommand;
  const sync = () => {
    if (mounted.current) setDesk(repository.snapshot());
  };
  async function execute(c: DeskCommand, as = actor, lost = false) {
    setBusy(true);
    setLastRequest({ command: c, actor: as });
    try {
      const next = await repository.execute(c, as);
      if (!mounted.current) return;
      sync();
      if (lost) {
        setResult(undefined);
        setAck(
          "Acknowledgement unknown in this exercise. The request may have committed. Resolve the same request ID before claiming confirmation.",
        );
      } else {
        setResult(next);
        setAck(
          next.ok
            ? "Acknowledged in the local exercise repository."
            : "Request rejected in the local exercise repository.",
        );
      }
      setTimeout(() => feedback.current?.focus(), 0);
    } finally {
      if (mounted.current) setBusy(false);
    }
  }
  function reserve(event: React.FormEvent) {
    event.preventDefault();
    const c: Extract<DeskCommand, { type: "reserve" }> = {
      id: requestId(),
      type: "reserve",
      experiment,
      day,
      start,
      end: start + duration,
      policyVersion: desk.policies[experiment].version,
      resourceRevision: desk.resourceRevision,
    };
    setLastRequest({ command: c, actor });
    if (delivery === "offline") {
      setQueued({ command: c, actor });
      setResult(undefined);
      setAck(
        "Offline request draft retained in this tab. No booking was confirmed or sent to a real service.",
      );
      return;
    }
    void execute(c, actor, delivery === "lost");
  }
  async function compete() {
    setBusy(true);
    setResult(undefined);
    const base = {
      type: "reserve" as const,
      experiment,
      day,
      start,
      end: start + duration,
      policyVersion: desk.policies[experiment].version,
      resourceRevision: desk.resourceRevision,
    };
    const first = { ...base, id: requestId() },
      second = { ...base, id: requestId() };
    const responses = await Promise.all([
      repository.execute(first, "pairA"),
      repository.execute(second, "pairB"),
    ]);
    if (!mounted.current) return;
    sync();
    setLastRequest({ command: second, actor: "pairB" });
    setResult(responses[1]);
    setAck(
      `Concurrent exercise results: Pair A ${responses[0].code}; Pair B ${responses[1].code}. The local repository serialises the final checks.`,
    );
    setBusy(false);
    setTimeout(() => feedback.current?.focus(), 0);
  }
  function save() {
    let update;
    try {
      update = saveDesk(window.localStorage, desk, raw);
    } catch {
      update = {
        ok: false,
        raw,
        message:
          "Browser storage is unavailable. Export the current exercise before leaving.",
      };
    }
    setWarning(update.message);
    if (update.ok) setRaw(update.raw);
  }
  function fresh() {
    exportRecord(
      JSON.stringify(
        { schemaVersion: 1, state: desk, pending: queued, lastRequest },
        null,
        2,
      ),
      "parallax-operations-before-restart.json",
    );
    setPreviousExercise({
      state: repository.snapshot(),
      pending: queued,
      request: lastRequest,
    });
    const next = new MemoryDeskRepository();
    setRepository(next);
    setDesk(next.snapshot());
    setResult(undefined);
    setLastRequest(undefined);
    setQueued(undefined);
    setAck(
      "Fresh in-memory exercise. The prior ledger is retained for this tab's restore action; the previously saved browser snapshot remains until an explicit, archived save.",
    );
  }
  return (
    <>
      <p className="ed-kicker">
        Operations desk · practice exercise
      </p>
      <h1>
        Keep the next shift <em>informed.</em>
      </h1>
      <p className="ops-intro">
        A complete allocation, a clear owner and a traceable next step. Rehearse
        the decision before connecting an operational service.
      </p>
      <details className="data-note">
        <summary>About this practice desk</summary>
        <p>
          This desk uses an independent prepared ledger. Bookings, staff actors,
          policies and notices are exercises; your student evidence, current
          bookings and equipment records stay unchanged. No real
          notification or power/device action is sent.
        </p>
      </details>
      <nav
        className="lab-tabs ops-tabs"
        aria-label="Operations desk sections"
        data-active={tab}
      >
        {(
          [
            ["allocation", "Allocation"],
            ["method", "Method changes"],
            ["handover", "Handover & notices"],
            ["save", "Record"],
            ["runbooks", "Owners & runbooks"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            aria-pressed={tab === key}
            onClick={() => {
              setTab(key);
              window.requestAnimationFrame(() =>
                document.getElementById(`ops-${key}`)?.focus({
                  preventScroll: true,
                }),
              );
            }}
          >
            {label}
          </button>
        ))}
      </nav>
      <div
        ref={feedback}
        tabIndex={-1}
        className={`ops-feedback ${result && !result.ok ? "msg warn" : "msg"}`}
        role="status"
        aria-label="Exercise request result"
      >
        <p>{ack}</p>
        {result && (
          <>
            <p>
              <strong>{result.code}</strong> · {result.message}
            </p>
            {result.recordId && (
              <p>
                Exercise record: <code>{result.recordId}</code>
              </p>
            )}
            {result.resources && (
              <p>
                Affected required components:{" "}
                {result.resources.join(", ")}
              </p>
            )}
            {result.alternative && (
              <p>
                Freshly checked alternative: {result.alternative.day} ·{" "}
                {timeLabel(result.alternative.start)}–
                {timeLabel(result.alternative.end)}. It remains
                unreserved.
              </p>
            )}
          </>
        )}
        {lastRequest && (
          <p className="small">
            Stable request <code>{lastRequest.command.id}</code> ·{" "}
            {operationActors[lastRequest.actor].name}
          </p>
        )}
      </div>
      <div className="ops-identity">
        <div>
          <label htmlFor="ops-actor">Prepared exercise actor</label>
          <select
            id="ops-actor"
            disabled={busy}
            value={actor}
            onChange={(e) => setActor(e.target.value as ActorId)}
          >
            {Object.entries(operationActors).map(([id, a]) => (
              <option value={id} key={id}>
                {a.name}
              </option>
            ))}
          </select>
          <p className="small">
            These actors test responsibility rules. Selecting a preview is not
            authentication or an account permission.
          </p>
        </div>
        <div>
          <p className="ed-kicker">Exercise record</p>
          <p>
            <strong>Revision {desk.revision}</strong> ·{" "}
            {desk.allocations.length} complete allocations
          </p>
          <p className="small">
            {snapshotSaved
              ? "This exercise revision is saved in this browser."
              : "Current exercise changes are not saved."}{" "}
            No shared repository is connected.
          </p>
        </div>
      </div>
      <section
        id="ops-allocation"
        className="ops-section"
        tabIndex={-1}
        aria-labelledby="ops-allocation-title"
      >
        <p className="ed-kicker">01 · final conflict check</p>
        <h2 id="ops-allocation-title">Allocate the whole kit.</h2>
        <div className="ops-workspace">
          <div className="ops-controls">
            <form onSubmit={reserve}>
              <label htmlFor="ops-experiment">Experiment</label>
              <select
                id="ops-experiment"
                disabled={busy}
                value={experiment}
                onChange={(e) => setExperiment(e.target.value as "E01" | "E06")}
              >
                <option value="E06">E06 · Capture kit</option>
                <option value="E01">E01 · Signal kit</option>
              </select>
              <label htmlFor="ops-day">Exercise date</label>
              <input
                id="ops-day"
                type="date"
                min="2026-01-01"
                max="2026-12-31"
                required
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
              <label htmlFor="ops-start">Start time · IST</label>
              <select
                id="ops-start"
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
              >
                {[600, 660, 840].map((t) => (
                  <option key={t} value={t}>
                    {timeLabel(t)}
                  </option>
                ))}
              </select>
              <label htmlFor="ops-duration">Duration</label>
              <select
                id="ops-duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={60}>60 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
              <label htmlFor="ops-delivery">Delivery scenario</label>
              <select
                id="ops-delivery"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
              >
                <option value="normal">Normal acknowledgement</option>
                <option value="lost">
                  Response deliberately lost after commit
                </option>
                <option value="offline">Offline draft only</option>
              </select>
              <p className="small">
                Exercise window 09:00–17:00. Final checks use interval overlap,
                current policy and component restrictions. A drawn free slot is
                not a reservation.
              </p>
              <button
                className="pbtn primary"
                disabled={busy || (delivery === "offline" && !!queued)}
              >
                Request exercise allocation
              </button>
            </form>
            <button
              className="pbtn quiet"
              disabled={busy}
              onClick={() => void compete()}
            >
              Compete Pair A & Pair B for this interval
            </button>
            <details>
              <summary>Required component manifest</summary>
              <p>{experiments[experiment].kit}</p>
              <ul>
                {fullManifest(experiment).map((r) => (
                  <li key={r}>
                    <code>{r}</code>
                  </li>
                ))}
              </ul>
              <p>
                Both physical lights, space and station commit together. No
                client-provided partial manifest is accepted.
              </p>
            </details>
          </div>
          <div className="ops-ledger">
            {lastRequest && (
              <div className="ops-actions">
                <button
                  className="pbtn"
                  disabled={busy}
                  onClick={() => {
                    const found = repository.lookup(
                      lastRequest.command.id,
                      lastRequest.actor,
                    );
                    setResult(found);
                    setAck(
                      found
                        ? "The original request resolved in the exercise repository."
                        : "No committed result is recorded for this request. An offline draft is still unconfirmed.",
                    );
                  }}
                >
                  Resolve the original request
                </button>
                <button
                  className="pbtn"
                  disabled={busy}
                  onClick={() =>
                    void execute(lastRequest.command, lastRequest.actor)
                  }
                >
                  Retry the exact request
                </button>
              </div>
            )}
            {queued && (
              <div className="msg warn">
                <h3>Offline draft · unconfirmed</h3>
                <p>
                  {queued.command.experiment} · {queued.command.day} ·{" "}
                  {timeLabel(queued.command.start)}–
                  {timeLabel(queued.command.end)}. The drafted policy/resource
                  versions remain attached. A new normal request does not erase
                  this draft.
                </p>
                <button
                  className="pbtn"
                  disabled={busy}
                  onClick={() => {
                    const draft = queued;
                    setQueued(undefined);
                    void execute(draft.command, draft.actor);
                  }}
                >
                  Reconnect & revalidate draft
                </button>
              </div>
            )}
            {desk.requests.length > 0 && (
              <details className="ops-lookup">
                <summary>Recover a retained request after reload</summary>
                <p className="small">
                  Results remain in an explicitly saved snapshot. Look up the
                  original ID as its prepared actor; this lookup creates no
                  allocation. Unsaved drafts remain unconfirmed.
                </p>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const found = repository.lookup(lookupId.trim(), actor);
                    setLastRequest(undefined);
                    setResult(found);
                    setAck(
                      found
                        ? `Retained request ${lookupId.trim()} resolved for ${operationActors[actor].name}.`
                        : `No retained result for request ${lookupId.trim()} and this actor. Confirmation remains unknown.`,
                    );
                    setTimeout(() => feedback.current?.focus(), 0);
                  }}
                >
                  <label htmlFor="ops-lookup-id">Original request ID</label>
                  <input
                    id="ops-lookup-id"
                    required
                    maxLength={80}
                    value={lookupId}
                    onChange={(event) => setLookupId(event.target.value)}
                  />
                  <button className="pbtn" disabled={busy}>
                    Look up retained request
                  </button>
                </form>
                <ul>
                  {desk.requests.map((request) => (
                    <li key={request.id}>
                      <code>{request.id}</code> ·{" "}
                      {operationActors[request.actor].name}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <h3>Complete allocations in this exercise</h3>
            {desk.allocations.length ? (
              <div
                className="scroll"
                role="region"
                aria-label="Exercise allocation ledger"
                tabIndex={0}
              >
                <table className="led">
                  <thead>
                    <tr>
                      <th scope="col">Record / pair</th>
                      <th scope="col">Interval · IST</th>
                      <th scope="col">Kit / method</th>
                      <th scope="col">Components</th>
                    </tr>
                  </thead>
                  <tbody>
                    {desk.allocations.map((b) => (
                      <tr key={b.id}>
                        <th scope="row">
                          {b.id}
                          <small>{operationActors[b.actor].name}</small>
                        </th>
                        <td>
                          {b.day}
                          <br />
                          {timeLabel(b.start)}–{timeLabel(b.end)}
                        </td>
                        <td>
                          {b.experiment}
                          <br />
                          method {b.methodRevision}
                          <br />
                          policy v{b.policyVersion}
                        </td>
                        <td>
                          {b.resources.length} held together
                          <details>
                            <summary>Inspect components</summary>
                            {b.resources.map((r) => (
                              <p key={r}>
                                <code>{r}</code>
                              </p>
                            ))}
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="ops-empty">
                No exercise allocations. Try simultaneous requests or retain an
                offline draft.
              </p>
            )}
            <p className="small">
              Allocation, occupancy, equipment condition and method
              applicability are separate facts. This exercise allocates time; it
              does not check in a person, start equipment or prove readiness.
            </p>
          </div>
        </div>
      </section>
      <section
        id="ops-method"
        tabIndex={-1}
        className="ops-section"
        aria-labelledby="ops-method-title"
      >
        <p className="ed-kicker">02 · publication versus recorded revision</p>
        <h2 id="ops-method-title">Preserve the work when a method changes.</h2>
        <div className="ops-workspace">
          <div className="ops-controls">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!existingRule) return;
                void execute(
                  command("withdraw-method", {
                    experiment: "E06",
                    expected: desk.revision,
                    existingSessions: existingRule,
                    reason: policyReason,
                  }),
                );
              }}
            >
              <p className="small">
                E06 method owner: Faculty role preview. Scope: the independent
                teaching exercise. U06 guides and student methods are unchanged.
              </p>
              <label htmlFor="ops-existing-rule">
                Treatment of the existing exercise session
              </label>
              <select
                id="ops-existing-rule"
                required
                value={existingRule}
                onChange={(e) =>
                  setExistingRule(
                    e.target.value as Policy["existingSessions"] | "",
                  )
                }
              >
                <option value="">Choose an explicit transition</option>
                <option value="pause-for-review">
                  Pause further exercise work for faculty review
                </option>
                <option value="recorded-method">
                  Retain the recorded exercise method
                </option>
              </select>
              <label htmlFor="ops-policy-reason">
                Reason for withdrawal and applicability decision
              </label>
              <textarea
                id="ops-policy-reason"
                rows={3}
                minLength={8}
                maxLength={1500}
                required
                value={policyReason}
                onChange={(e) => setPolicyReason(e.target.value)}
              />
              <button
                className="pbtn"
                disabled={busy || desk.policies.E06.state === "withdrawn"}
              >
                Withdraw E06 method in this exercise
              </button>
            </form>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void execute(
                  command("restrict-camera", {
                    expected: desk.revision,
                    reason: equipmentReason,
                  }),
                );
              }}
            >
              <label htmlFor="ops-equipment-reason">
                Equipment restriction reason · technician owner
              </label>
              <textarea
                id="ops-equipment-reason"
                rows={3}
                minLength={8}
                maxLength={1500}
                required
                value={equipmentReason}
                onChange={(e) => setEquipmentReason(e.target.value)}
              />
              <button
                className="pbtn"
                disabled={busy || desk.restricted.includes("C1-CAM")}
              >
                Restrict camera in this exercise
              </button>
              <p className="small">
                A method exception cannot bypass this condition. Use the
                existing technician verification/release workflow for
                operational examples.
              </p>
            </form>
          </div>
          <div>
            <dl className="ops-policy-facts">
              {Object.values(desk.policies).map((p) => (
                <div key={p.experiment}>
                  <dt>
                    {p.experiment} · {p.state} · policy v{p.version}
                  </dt>
                  <dd>
                    Method {p.methodRevision} · Faculty owner
                    <br />
                    Effective exercise date {p.effectiveDay}
                    <br />
                    Review by {p.reviewBy}
                    <br />
                    {p.state === "withdrawn"
                      ? p.reason
                      : "Prepared method publication; not institutional approval."}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="small">
              Scope: all new allocations in this independent exercise. Dates are
              prepared policy metadata; no clock, automatic expiry or
              institutional approval is simulated.
            </p>
            {desk.sessions.map((session) => {
              const a = sessionApplicability(desk, session);
              return (
                <article className="ops-retained" key={session.id}>
                  <h3>{session.id} · retained evidence</h3>
                  <p>
                    Recorded method {a.recordedRevision}; current policy v
                    {a.currentPolicyVersion}.
                  </p>
                  <p>
                    <strong>
                      {a.allowed
                        ? "May continue under the exercise rule"
                        : "Further exercise work paused"}
                    </strong>{" "}
                    · next owner: {a.nextOwner}.
                  </p>
                  <p>
                    {desk.policies[session.experiment].state === "withdrawn"
                      ? `Chosen rule: ${desk.policies[session.experiment].existingSessions}. Saved evidence is retained.`
                      : "The published exercise method applies."}
                  </p>
                  {session.captured.map((c) => (
                    <blockquote key={c.id}>
                      <code>
                        {c.id} · {c.source}
                      </code>
                      <p>{c.text}</p>
                    </blockquote>
                  ))}
                  {a.restricted.length > 0 && (
                    <p className="msg warn">
                      Restricted components: {a.restricted.join(", ")}. A
                      retained method does not grant equipment access.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section
        id="ops-handover"
        tabIndex={-1}
        className="ops-section"
        aria-labelledby="ops-handover-title"
      >
        <p className="ed-kicker">
          03 · owner, acceptance and permitted consequence
        </p>
        <h2 id="ops-handover-title">Hand over the next action.</h2>
        <div className="ops-workspace">
          <div className="ops-controls">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void execute(
                  command("handover", {
                    expected: desk.revision,
                    owner: nextOwner,
                    topic,
                    note: handoverNote,
                    due,
                  }),
                );
              }}
            >
              <label htmlFor="ops-topic">Handover topic</label>
              <select
                id="ops-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value as Handover["topic"])}
              >
                <option value="equipment">Equipment condition</option>
                <option value="method">Method applicability</option>
                <option value="acknowledgement">Missing acknowledgement</option>
              </select>
              <label htmlFor="ops-next-owner">Named next owner</label>
              <select
                id="ops-next-owner"
                value={nextOwner}
                onChange={(e) =>
                  setNextOwner(e.target.value as Handover["owner"])
                }
              >
                <option value="technician">Technician</option>
                <option value="faculty">Faculty method owner</option>
              </select>
              <label htmlFor="ops-due">Due condition</label>
              <input
                id="ops-due"
                required
                maxLength={100}
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
              <label htmlFor="ops-handover-note">
                Preserved fact and next action
              </label>
              <textarea
                id="ops-handover-note"
                minLength={8}
                maxLength={1500}
                rows={4}
                required
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
              />
              <p className="small">
                Use prepared exercise facts. Keep personal information out. If
                the named owner is absent, escalate to the lab lead; a record
                alone does not prove acceptance.
              </p>
              <button className="pbtn primary" disabled={busy}>
                Record exercise handover
              </button>
            </form>
            <div className="ops-actions">
              <button
                className="pbtn"
                disabled={busy}
                onClick={() =>
                  void execute(
                    command("publish-notice", {
                      expected: desk.revision,
                      kind: "method-review",
                      experiment: "E06",
                    }),
                  )
                }
              >
                Publish E06 method consequence
              </button>
              <button
                className="pbtn"
                disabled={busy}
                onClick={() =>
                  void execute(
                    command("publish-notice", {
                      expected: desk.revision,
                      kind: "equipment-restriction",
                      asset: "C1-CAM",
                    }),
                  )
                }
              >
                Publish camera consequence
              </button>
            </div>
          </div>
          <div>
            {desk.handovers.length ? (
              desk.handovers.map((h) => (
                <article className="ops-handover-record" key={h.id}>
                  <p className="ed-kicker">
                    {h.id} · {h.status}
                  </p>
                  <h3>
                    {h.topic} → {h.owner}
                  </h3>
                  <p>{h.note}</p>
                  <p className="small">
                    Due: {h.due} · backup: lab lead · created at exercise
                    revision {h.createdRevision}
                    {h.acceptedRevision
                      ? ` · accepted at revision ${h.acceptedRevision}`
                      : ""}
                  </p>
                  <button
                    className="pbtn"
                    disabled={busy || h.status === "accepted"}
                    onClick={() =>
                      void execute(
                        command("accept-handover", {
                          expected: desk.revision,
                          handoverId: h.id,
                        }),
                      )
                    }
                  >
                    Accept {h.id} as the selected actor
                  </button>
                </article>
              ))
            ) : (
              <p className="ops-empty">
                No handover recorded. Record a fact, next owner and due
                condition; then exercise acceptance with that owner's actor.
              </p>
            )}
            <section
              className="ops-public"
              role="region"
              aria-label="Allowlisted public exercise projection"
            >
              <p className="ed-kicker">
                Public preview · exercise revision {projection.revision}
              </p>
              <h3>Only the permitted consequence.</h3>
              {projection.notices.length ? (
                projection.notices.map((n, i) => (
                  <p key={i}>
                    <strong>{n.subject}</strong> · {n.consequence}
                    <br />
                    <span className="small">
                      Source version {n.sourceVersion}
                    </span>
                  </p>
                ))
              ) : (
                <p>No published exercise consequences.</p>
              )}
              <p className="small">
                The projection contains no actor, request, booking, handover
                note, private reason or evidence. It does not change the
                operational wall display.
              </p>
            </section>
            {desk.notices.map((n) => (
              <div className="ops-notice-history" key={n.id}>
                <p>
                  {n.id} · {n.kind} · {n.state} · source v{n.sourceVersion}
                </p>
                {n.state === "published" && (
                  <button
                    className="pbtn quiet"
                    disabled={busy}
                    onClick={() =>
                      void execute(
                        command("withdraw-notice", {
                          expected: desk.revision,
                          noticeId: n.id,
                        }),
                      )
                    }
                  >
                    Withdraw {n.id} publication
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="ops-save"
        tabIndex={-1}
        className="ops-section"
        aria-labelledby="ops-save-title"
      >
        <h2 id="ops-save-title">Keep a reviewable record.</h2>
        <p role="status">{warning}</p>
        <div className="ops-actions">
          <button className="pbtn" disabled={busy} onClick={save}>
            {loaded.blocked && raw !== null
              ? "Archive retained text & save exercise"
              : "Save exercise snapshot"}
          </button>
          <button
            className="pbtn quiet"
            onClick={() =>
              exportRecord(
                JSON.stringify(
                  {
                    schemaVersion: 1,
                    state: desk,
                    pending: queued,
                    lastRequest,
                  },
                  null,
                  2,
                ),
                "parallax-operations-exercise.json",
              )
            }
          >
            Export current exercise
          </button>
          {raw !== null && (
            <button
              className="pbtn quiet"
              onClick={() =>
                exportRecord(raw, "parallax-operations-retained.json")
              }
            >
              Export retained saved text
            </button>
          )}
          <button className="pbtn quiet" disabled={busy} onClick={fresh}>
            Export & start a fresh in-memory exercise
          </button>
        </div>
        {previousExercise && (
          <button
            className="pbtn quiet"
            disabled={busy}
            onClick={() => {
              const current = {
                state: repository.snapshot(),
                pending: queued,
                request: lastRequest,
              };
              const restored = new MemoryDeskRepository(previousExercise.state);
              setRepository(restored);
              setDesk(restored.snapshot());
              setPreviousExercise(current);
              setQueued(previousExercise.pending);
              setLastRequest(previousExercise.request);
              setResult(undefined);
              setAck(
                "Previous in-memory ledger restored; no saved snapshot was replaced.",
              );
            }}
          >
            Restore previous in-memory ledger
          </button>
        )}
        <details className="ops-export">
          <summary>Review exportable exercise JSON</summary>
          <pre tabIndex={0}>
            {JSON.stringify(
              { schemaVersion: 1, state: desk, pending: queued, lastRequest },
              null,
              2,
            )}
          </pre>
        </details>
        <p className="small">
          Saving archives the prior raw snapshot first and refuses a competing
          write or failed archive. This key is separate from all student
          records. Pending request drafts are included in export; they are not
          confirmed and are not restored automatically on reload.
        </p>
        <details>
          <summary>
            Exercise audit · {desk.events.length} committed events
          </summary>
          {desk.events.length ? (
            <ol className="activity-lines">
              {desk.events.map((e) => (
                <li key={e.id}>
                  <code>
                    {e.id} · revision {e.revision} ·{" "}
                    {operationActors[e.actor].name}
                  </code>
                  <p>
                    {e.action} · {e.target}
                  </p>
                  <span>{e.reason}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p>No committed exercise events.</p>
          )}
          <p>
            Diagnostics are action category, result code, request identity and
            exercise revision. This is not participant research or an assessment
            of learning.
          </p>
        </details>
      </section>
      <section
        id="ops-runbooks"
        tabIndex={-1}
        className="ops-section"
        aria-labelledby="ops-runbooks-title"
      >
        <p className="ed-kicker">04 · responsibility and recovery</p>
        <h2 id="ops-runbooks-title">A named owner for each recovery.</h2>
        <div className="ops-workspace">
          <div>
            <p>
              The primary session remains an example record. Institutional
              reservations, attendance, maintenance and policy systems remain
              the authority for any actual lab. Pilot reconciliation needs a
              named owner; this desk creates no second operational register.
            </p>
            <dl className="ops-owners">
              {operatingOwners.map((o) => (
                <div key={o.task}>
                  <dt>{o.task}</dt>
                  <dd>
                    <strong>{o.owner}</strong>
                    <p>
                      Backup: {o.backup}
                      <br />
                      Record: {o.record}
                    </p>
                    <Link to={o.route}>Open the existing local workflow →</Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="ops-current">
            <h3>Current example · read only here</h3>
            {(["E06", "E01"] as const).map((exp) => (
              <p key={exp}>
                <strong>{exp}</strong> ·{" "}
                {selectors.kitStatus(
                  operational,
                  fixtures,
                  experiments[exp].kit,
                ).ok
                  ? "No availability blockers in this example"
                  : "Required equipment unavailable in this example"}
              </p>
            ))}
            <p>
              Operational activity: {operational.log.length}. Exercise requests
              use a separate ledger.
            </p>
            <Link to="/bookings">Read current local bookings →</Link>
            <br />
            <Link to="/assets/C1-CAM">
              Read camera location and maintenance →
            </Link>
            <p className="small">
              Calibration examples and observations do not automatically prove
              fitness, safety or readiness.
            </p>
          </div>
        </div>
        <div className="ops-runbook-list">
          {deskRunbooks.map((r) => (
            <details key={r.id}>
              <summary>{r.title}</summary>
              <dl>
                <div>
                  <dt>Symptom</dt>
                  <dd>{r.symptom}</dd>
                </div>
                <div>
                  <dt>Preserve</dt>
                  <dd>{r.preserve}</dd>
                </div>
                <div>
                  <dt>Responsible owner</dt>
                  <dd>{r.owner}</dd>
                </div>
                <div>
                  <dt>Diagnostic evidence</dt>
                  <dd>{r.diagnostic}</dd>
                </div>
                <div>
                  <dt>Permitted recovery</dt>
                  <dd>{r.recovery}</dd>
                </div>
                <div>
                  <dt>Verify</dt>
                  <dd>{r.verify}</dd>
                </div>
              </dl>
            </details>
          ))}
        </div>
        <p>
          <a href={`${import.meta.env.BASE_URL}operations-runbook.html`}>
            Open the printable operating reference →
          </a>
        </p>
      </section>
    </>
  );
}
