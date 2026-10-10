import { useState } from "react";
import { Link } from "react-router";
import { useCommands, useLab } from "../app/context";
import { selectors } from "../domain/adapter";
import { fixtures, experiments, experimentIds } from "../data/fixtures";
import {
  criteria,
  reviewRevisions,
  workspace,
  type Judgement,
  type ReviewRevision,
} from "../domain/workspace";
import { ExperimentArt, VisionArt } from "../components/ExperimentArt";

export function Faculty() {
  const { state } = useLab();
  const blocked = selectors.kitStatus(state, fixtures, "KIT-C1-v1")
    .blockers as string[];
  return (
    <>
      <p className="ed-kicker">
        Faculty · teaching plan
      </p>
      <h1>
        Prepare the next <em>investigation.</em>
      </h1>
      <p className="pull">
        Seeing and sampling · Tuesday 6 October, 10:00–12:00 · six pairs, two
        methods, one shared plan.
      </p>
      <nav className="task-links" aria-label="Faculty operating references"><Link to="/operations">Operations desk · scheduling, method changes & owners</Link></nav>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <div className="section-head">
            <h2>Each pair visits both stations.</h2>
            <span className="small">20 minute rotations · example plan</span>
          </div>
          {blocked.length > 0 ? (
            <div className="msg warn">
              <strong>C1 rotation has a resource shortfall.</strong>
              <p>
                {blocked.join(", ")} unavailable in the current React example.
                The S1 rotation remains separate; no booking is moved
                automatically.
              </p>
              <Link className="pbtn" to="/tech">
                Inspect the fault and return records
              </Link>
            </div>
          ) : (
            <p className="msg good">
              The capture kit has no availability blockers in this example. This
              is a readiness check, not a new reservation.
            </p>
          )}
          <div
            className="scroll"
            tabIndex={0}
            role="region"
            aria-label="Teaching rotation plan"
          >
            <table className="led rotation">
              <caption>EX-TS-07 · original P7-A teaching fixture</caption>
              <thead>
                <tr>
                  <th scope="col">Rotation</th>
                  {["10:00", "10:20", "10:40", "11:00", "11:20", "11:40"].map(
                    (t) => (
                      <th scope="col" key={t}>
                        {t}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    C1 · E06
                    <br />
                    <small>B-2047</small>
                  </th>
                  {[1, 2, 3, 4, 5, 6].map((p) => (
                    <td key={p} className="rotation-capture">
                      P{p}
                      <small>Capture</small>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">
                    S1 · E01
                    <br />
                    <small>B-2048</small>
                  </th>
                  {[4, 5, 6, 1, 2, 3].map((p) => (
                    <td key={p} className="rotation-signal">
                      P{p}
                      <small>Sampling</small>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="small">
            P7-A teaching dates and cohort are prepared examples. Availability
            above comes from this React session; the plan does not create
            authoritative teaching bookings.
          </p>
          <h2 className="cap2">Assigned methods</h2>
          {experimentIds.map((exp) => (
            <article className="method-row" key={exp}>
              <div className="method-art">
                <ExperimentArt exp={exp} />
              </div>
              <div>
                <code>
                  {exp} · {experiments[exp].methodRevision}
                </code>
                <h3>{experiments[exp].title}</h3>
                <p>{experiments[exp].question}</p>
                <Link to={`/${exp}/prepare`}>
                  Read the student preparation →
                </Link>
              </div>
            </article>
          ))}
        </section>
        <aside className="workspace-aside">
          <h2>Gaps, not grades.</h2>
          <p>
            Prepared cohort snapshot · 08:40, 6 October. May be stale; these
            numbers do not represent local students.
          </p>
          <dl className="readiness-list">
            {[
              ["Safety briefing confirmed", 12],
              ["Both methods read", 11],
              ["Preparation question answered", 9],
            ].map(([label, n]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  <strong>{n} of 12</strong>
                  <meter
                    value={Number(n)}
                    min={0}
                    max={12}
                    aria-label={String(label)}
                  />
                </dd>
              </div>
            ))}
          </dl>
          <div className="action-stack">
            <Link className="pbtn primary" to="/faculty/attendance">
              Open attendance and corrections
            </Link>
            <Link className="pbtn" to="/faculty/assessment">
              Review submitted evidence
            </Link>
            <Link className="pbtn quiet" to="/map">
              Check zones and equipment
            </Link>
          </div>
          <p className="small">
            Role previews demonstrate workflows. They do not authenticate staff
            or set course policy.
          </p>
        </aside>
      </div>
    </>
  );
}

export function Attendance() {
  const { state } = useLab(),
    w = workspace(state),
    dispatch = useCommands();
  const [expected, setExpected] = useState(w.revision);
  const station = w.drafts["attendance-station"] || "CV-03",
    reason = w.drafts["attendance-reason"] || "";
  const draft = (key: string, value: string) =>
    dispatch({
      type: "command",
      command: { type: "workspace-draft", key, value },
    });
  return (
    <>
      <p className="ed-kicker">Faculty · attendance</p>
      <h1>
        Correct the record.
        <br />
        <em>Keep the original.</em>
      </h1>
      <Link to="/faculty">← Teaching plan</Link>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <h2>ATT-0712 · pair P4 / STU-0147</h2>
          <p className="small">
            Prepared scenario identity only. This correction never changes the
            student's actual React booking or check-in.
          </p>
          <dl className="record-settings">
            <div>
              <dt>Original recorded station</dt>
              <dd>CV-04</dd>
            </div>
            <div>
              <dt>Current corrected station</dt>
              <dd>{w.attendance.station}</dd>
            </div>
            <div>
              <dt>Assigned station in teaching plan</dt>
              <dd>CV-03</dd>
            </div>
          </dl>
          <h2>Correction history</h2>
          <ol className="activity-lines">
            <li>
              <code>08:40 · original P7-A example</code>
              <p>STU-0147 recorded at CV-04.</p>
            </li>
            {w.attendance.history.map((h, i) => (
              <li key={i}>
                <code>
                  {h.time} · {h.actor}
                </code>
                <p>
                  {h.from} → {h.to}
                </p>
                <p>{h.reason}</p>
              </li>
            ))}
          </ol>
        </section>
        <aside className="workspace-aside">
          <h2>Reasoned correction</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "command",
                command: {
                  type: "attendance-correct",
                  station,
                  reason,
                  expected,
                },
              });
            }}
          >
            <div className="field">
              <label htmlFor="att-station">Correct station</label>
              <select
                id="att-station"
                value={station}
                onChange={(e) => draft("attendance-station", e.target.value)}
              >
                {fixtures.resources
                  .filter((r) => r.id.startsWith("CV-"))
                  .map((r) => (
                    <option key={r.id}>{r.id}</option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="att-reason">Why is the correction needed?</label>
              <textarea
                id="att-reason"
                required
                value={reason}
                aria-describedby="att-help"
                onChange={(e) => draft("attendance-reason", e.target.value)}
              />
              <p id="att-help" className="small">
                Your draft is retained across views. Actor, time and the
                original station are recorded with the correction.
              </p>
            </div>
            <button className="pbtn primary">Record example correction</button>
            {expected !== w.revision && (
              <p className="small">
                The record has changed. Read its current value, then{" "}
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setExpected(w.revision)}
                >
                  reopen this form with the current revision
                </button>
                .
              </p>
            )}
          </form>
        </aside>
      </div>
    </>
  );
}

export function Assessment() {
  const { state } = useLab(),
    dispatch = useCommands(),
    w = workspace(state);
  const [revision, setRevision] = useState<ReviewRevision>(w.newestEvidence);
  const [preview, setPreview] = useState(false);
  const [expected, setExpected] = useState(w.revision);
  const review = w.reviews[revision],
    published = w.published.find((p) => p.revision === revision);
  const newer = revision !== w.newestEvidence;
  const update = (
    criterion: number,
    change: { decision?: Judgement; comment?: string },
  ) =>
    dispatch({
      type: "command",
      command: { type: "review-draft", revision, criterion, ...change },
    });
  return (
    <>
      <p className="ed-kicker">
        Faculty · assessment
      </p>
      <h1>
        Evidence first.
        <br />
        <em>Judgement with a reason.</em>
      </h1>
      <p className="pull">
        Review four criteria against a named revision. Drafts remain private in
        this local role preview; publication creates a frozen feedback record.
      </p>
      {newer && (
        <div className="msg warn">
          <strong>A newer example revision has arrived.</strong>
          <p>
            {revision} and its review are retained. Publishing is blocked until
            you review {w.newestEvidence}.
          </p>
          <button
            className="pbtn"
            onClick={() => {
              setRevision(w.newestEvidence);
              setPreview(false);
              setExpected(w.revision);
            }}
          >
            Open the newer evidence revision
          </button>
        </div>
      )}
      <div className="workspace-layout assessment-layout">
        <section className="workspace-primary">
          <div className="section-head">
            <h2>Frozen evidence · {revision}</h2>
            <select
              aria-label="Evidence revision to review"
              value={revision}
              onChange={(e) => {
                setRevision(e.target.value as ReviewRevision);
                setPreview(false);
                setExpected(w.revision);
              }}
            >
              {reviewRevisions
                .filter(
                  (r) => r === reviewRevisions[0] || w.newestEvidence === r,
                )
                .map((r) => (
                  <option key={r}>{r}</option>
                ))}
            </select>
          </div>
          <div className="comparison">
            <figure className="evidence-plate">
              <VisionArt side={false} />
              <figcaption>ILL-L1-v1 · frontal reference</figcaption>
            </figure>
            <figure className="evidence-plate">
              <VisionArt side />
              <figcaption>ILL-L2-v1 · side light</figcaption>
            </figure>
          </div>
          <p className="small">
            ILL-L1-v1 / ILL-L2-v1 · prepared illustrations, not measured
            detector results. This P7-A assessment fixture is separate from the
            student's React notebook.
          </p>
          <h2>Notebook passage §2</h2>
          <blockquote className="evidence-quote">
            {revision === reviewRevisions[0]
              ? "Under side light the expected object is still outlined, but its edge on the shadowed side is drawn from the frontal reference, not from what L2 shows. The side-light condition proves the detector loses the object."
              : "The prepared drawings suggest that lighting may affect visible evidence. They do not measure detection performance. A controlled capture and comparison would be needed to test that claim."}
          </blockquote>
          <dl className="record-settings">
            <div>
              <dt>Method</dt>
              <dd>E06 · method r01</dd>
            </div>
            <div>
              <dt>Illustration settings</dt>
              <dd>1/120 s · 0 dB · 40% light · camera fixed</dd>
            </div>
            <div>
              <dt>Source boundary</dt>
              <dd>Prepared drawing; no accuracy score</dd>
            </div>
          </dl>
          <h2 className="cap2">Student submissions in this React session</h2>
          {experimentIds.some((exp) => state.sessions[exp].receipt) ? (
            <ul className="evidence-summary">
              {experimentIds
                .filter((exp) => state.sessions[exp].receipt)
                .map((exp) => (
                  <li key={exp}>
                    <Link to={`/${exp}/submit`}>
                      {state.sessions[exp].receipt} ·{" "}
                      {experiments[exp].revision}
                    </Link>{" "}
                    · claim and capture context retained
                  </li>
                ))}
            </ul>
          ) : (
            <p>
              No student receipts yet. The prepared review scenario above can be
              explored independently.
            </p>
          )}
          <button
            className="pbtn quiet"
            disabled={w.newestEvidence === reviewRevisions[1]}
            onClick={() =>
              dispatch({
                type: "command",
                command: { type: "evidence-arrived" },
              })
            }
          >
            Demonstrate a newer example revision arriving
          </button>
        </section>
        <aside className="workspace-aside">
          <div className="section-head">
            <h2>Criterion review</h2>
            <span className="small">
              {published ? "Published · frozen" : "Draft · private"}
            </span>
          </div>
          {criteria.map((c, i) => (
            <fieldset className="criterion" key={c}>
              <legend>
                {i + 1}. {c}
              </legend>
              <div className="field">
                <label htmlFor={`judge-${i}`}>
                  Judgement for {c.toLowerCase()}
                </label>
                <select
                  id={`judge-${i}`}
                  disabled={!!published}
                  value={review.decisions[i]}
                  onChange={(e) =>
                    update(i, { decision: e.target.value as Judgement })
                  }
                >
                  {["Unreviewed", "Meets", "Revise", "Not found"].map((j) => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={`comment-${i}`}>
                  Evidence or passage and feedback
                </label>
                <textarea
                  id={`comment-${i}`}
                  disabled={!!published}
                  value={review.comments[i]}
                  onChange={(e) => update(i, { comment: e.target.value })}
                />
              </div>
            </fieldset>
          ))}
          {!published && (
            <button
              className="pbtn primary"
              onClick={() => {
                setPreview(true);
                setExpected(w.revision);
              }}
            >
              Preview feedback before publishing
            </button>
          )}
          {preview && !published && (
            <section className="feedback-preview" aria-label="Feedback preview">
              <h3>Publish against {revision}</h3>
              <p>
                This creates an example record in this browser. No student
                message or grade is sent.
              </p>
              <ol>
                {criteria.map((c, i) => (
                  <li key={c}>
                    <strong>
                      {c} · {review.decisions[i]}
                    </strong>
                    <p>{review.comments[i] || "No comment yet."}</p>
                  </li>
                ))}
              </ol>
              <button
                className="pbtn primary"
                onClick={() =>
                  dispatch({
                    type: "command",
                    command: { type: "feedback-publish", revision, expected },
                  })
                }
              >
                Publish example feedback
              </button>
              <button className="pbtn quiet" onClick={() => setPreview(false)}>
                Keep as a draft
              </button>
            </section>
          )}
          {published && (
            <p className="msg good">
              {published.id} · {published.time} · {published.actor}. Published
              feedback for {revision} is retained and cannot be overwritten.
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
