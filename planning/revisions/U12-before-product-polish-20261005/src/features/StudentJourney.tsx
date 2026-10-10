import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useCommands, useLab } from "../app/context";
import {
  fixtures,
  experiments,
  experimentIds,
  kits,
  type KitItem,
} from "../data/fixtures";
import { selectors } from "../domain/adapter";
import type { ExperimentId } from "../domain/types";
import {
  ExperimentArt,
  SignalArt,
  VisionArt,
  signalSamples,
} from "../components/ExperimentArt";
import { LabPlan } from "../components/LabPlan";
import { useEnvironment } from "../app/environmentContext";

const steps = [
  "prepare",
  "reserve",
  "arrive",
  "bench",
  "notebook",
  "submit",
  "return",
] as const;
const labels = [
  "Prepare",
  "Reserve",
  "Arrive",
  "Bench",
  "Notebook",
  "Submit",
  "Return",
];
function completed(
  state: ReturnType<typeof useLab>["state"],
  exp: ExperimentId,
) {
  const s = state.sessions[exp];
  return [
    state.prepared[exp].every(Boolean),
    !!selectors.myBooking(state, exp),
    s.started,
    experiments[exp].evidence.every((e) =>
      s.captures.some((c) => c.id === e.id),
    ),
    !!s.noteSaved && s.noteSaved === s.note,
    !!s.receipt,
    s.closed,
  ];
}
const itemName = (i: KitItem) =>
  i.name || fixtures.resources.find((r) => r.id === i.id)?.name || i.id;

export function EquipmentList() {
  const { state } = useLab();
  return (
    <div
      className="scroll"
      tabIndex={0}
      role="region"
      aria-label="Equipment availability and occupancy"
    >
      <table className="led">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Item</th>
            <th scope="col">Availability</th>
            <th scope="col">Occupancy</th>
          </tr>
        </thead>
        <tbody>
          {fixtures.resources.map((r) => (
            <tr key={r.id}>
              <th scope="row">
                <Link to={`/assets/${r.id}`}>
                  <code>{r.id}</code>
                </Link>
              </th>
              <td>{r.name}</td>
              <td>{selectors.availability(state, r.id).label}</td>
              <td>{selectors.occupancy(state, fixtures, r.id).label}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Today() {
  const { state } = useLab();
  const notices = selectors.publicNotices(state);
  const available = fixtures.resources.filter(
    (r) => selectors.availability(state, r.id).state === "bookable",
  ).length;
  const inUse = fixtures.resources.filter(
    (r) => selectors.occupancy(state, fixtures, r.id).state === "in-use",
  ).length;
  return (
    <>
      <p className="ed-kicker">
        Student workspace
      </p>
      <h1>
        Today in <em>the lab.</em>
      </h1>
      <nav className="task-links" aria-label="Student quick tasks">
        <Link to="/E01/rehearsal">Rehearse a sampling choice</Link>
        <Link to="/bookings">My bookings</Link>
        <Link to="/mobile">Look up an asset</Link>
        <Link to="/map">Find a station</Link>
        <Link to="/assistant">Ask a project guide</Link>
      </nav>
      {notices.map((n) => (
        <p className="msg warn" key={n.asset}>
          <strong>{n.asset}</strong> · {n.text}
        </p>
      ))}
      <div className="cards">
        {experimentIds.map((exp) => {
          const e = experiments[exp],
            b = selectors.myBooking(state, exp),
            session = state.sessions[exp];
          const count = completed(state, exp).filter(Boolean).length;
          const next = !b
            ? "prepare"
            : session.closed
              ? "return"
              : session.receipt
                ? "return"
                : session.started
                  ? "bench"
                  : "arrive";
          const affected = b && selectors.bookingImpact(state, b).affected;
          return (
            <article className="xcard" key={exp}>
              <div className="thumb">
                <ExperimentArt exp={exp} />
              </div>
              <div className="body">
                <p className="k">
                  {exp} · {e.strand} · {e.duration}
                </p>
                <h2>{e.title}</h2>
                <div
                  className="meter"
                  role="img"
                  aria-label={`${count} of 7 steps completed`}
                >
                  {steps.map((step, i) => (
                    <i
                      key={step}
                      className={completed(state, exp)[i] ? "on" : ""}
                    />
                  ))}
                </div>
                <p className="small">
                  {b
                    ? `${b.id} · ${b.slot} · ${affected ? "Affected" : b.status}`
                    : `${count} of 7 steps`}
                </p>
                <Link className="pbtn primary" to={`/${exp}/${next}`}>
                  {!b ? "Start" : session.closed ? "Review" : "Continue"}
                  <span className="vh">: {exp}</span>{" "}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <section className="split" aria-labelledby="lab-now">
        <div>
          <h2 className="cap2" id="lab-now">
            The lab right now
          </h2>
          <LabPlan />
        </div>
        <div className="lab-status">
          <dl>
            <div>
              <dt>Bookable</dt>
              <dd>{available}</dd>
            </div>
            <div>
              <dt>In use</dt>
              <dd>{inUse}</dd>
            </div>
            <div>
              <dt>Restricted</dt>
              <dd>
                {
                  fixtures.resources.filter(
                    (r) =>
                      selectors.availability(state, r.id).state ===
                      "restricted",
                  ).length
                }
              </dd>
            </div>
            <div>
              <dt>Not located</dt>
              <dd>
                {
                  fixtures.resources.filter(
                    (r) =>
                      selectors.availability(state, r.id).state === "unknown",
                  ).length
                }
              </dd>
            </div>
          </dl>
          <p className="small">
            Availability and occupancy are separate facts. Counts describe this
            example session.
          </p>
          <Link className="ed-link" to="/tech">
            Equipment operations →
          </Link>
        </div>
      </section>
      <details className="more">
        <summary>Equipment list</summary>
        <EquipmentList />
      </details>
    </>
  );
}

function Manifest({ exp }: { exp: ExperimentId }) {
  const { state } = useLab();
  const kit = kits[experiments[exp].kit];
  return (
    <ul className="kit" aria-label={`Manifest ${experiments[exp].kit}`}>
      {[...kit.fixed, ...kit.portable].map((i) => {
        const statuses = (i.members || [i.id]).map((id) =>
          selectors.availability(state, id),
        );
        return (
          <li key={i.id}>
            <span className="q">×{i.qty}</span>
            <b>
              <code>{i.id}</code>
            </b>
            <span className="nm">{itemName(i)}</span>
            <span className="small">
              {statuses.find((s) => s.state !== "bookable")?.label ||
                "Bookable"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function StudentJourney() {
  const { scenario, observations } = useEnvironment();
  const params = useParams();
  const exp = params.exp as ExperimentId;
  const step = params.step as (typeof steps)[number];
  const { state } = useLab();
  const dispatch = useCommands();
  const [station, setStation] = useState("");
  const [failSave, setFailSave] = useState(false);
  const [dropAck, setDropAck] = useState(false);
  useEffect(() => {
    setStation("");
    setFailSave(false);
    setDropAck(false);
  }, [exp]);
  if (!experimentIds.includes(exp) || !steps.includes(step))
    return (
      <>
        <h1>That step is unavailable.</h1>
        <Link to="/">Return to Today</Link>
      </>
    );
  const e = experiments[exp],
    session = state.sessions[exp],
    b = selectors.myBooking(state, exp),
    kit = kits[e.kit];
  const done = completed(state, exp),
    index = steps.indexOf(step);
  const open = [
    true,
    true,
    !!b,
    session.checkedIn,
    session.started,
    session.started,
    session.checkedIn,
  ];
  const send = (
    command: Parameters<typeof dispatch>[0] & { type: "command" },
  ) => dispatch(command);
  return (
    <>
      <p className="ed-kicker">
        {exp} · {e.strand} · Step {index + 1} of 7
      </p>
      <h1>
        {step === "prepare"
          ? e.title
          : step === "reserve"
            ? "Reserve the whole kit."
            : step === "arrive"
              ? `Check in at ${e.station}.`
              : step === "bench"
                ? "Record the comparison."
                : step === "notebook"
                  ? "Make a claim with evidence."
                  : step === "submit"
                    ? "Review this revision."
                    : "Return and close."}
      </h1>
      <nav className="stepper" aria-label={`Steps for ${exp}`}>
        <ol>
          {steps.map((s, i) => (
            <li
              key={s}
              data-s={
                s === step
                  ? "now"
                  : done[i]
                    ? "done"
                    : open[i]
                      ? "open"
                      : "locked"
              }
            >
              {open[i] ? (
                <Link
                  to={`/${exp}/${s}`}
                  aria-label={`${labels[i]}${done[i] ? " (complete)" : ""}`}
                  aria-current={s === step ? "step" : undefined}
                >
                  <span className="mk" aria-hidden="true">
                    {done[i] ? "✓" : i + 1}
                  </span>
                  <span className="lb">{labels[i]}</span>
                  <span className="vh">{done[i] ? " (complete)" : ""}</span>
                </Link>
              ) : (
                <span className="off">
                  <span className="mk" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="lb">{labels[i]}</span>
                  <span className="vh"> (not available yet)</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {!open[index] ? (
        <p className="msg warn">
          Complete the earlier steps first.{" "}
          <Link to={`/${exp}/${b ? "arrive" : "prepare"}`}>
            Return to {b ? "arrival" : "preparation"}
          </Link>
          .
        </p>
      ) : (
        <>
          {step === "prepare" && (
            <>
              <p className="pull">{e.question}</p>
              <div className="acts">
                <Link className="pbtn" to={`/${exp}/rehearsal`}>
                  Predict and rehearse one variable →
                </Link>
                <Link className="pbtn quiet" to={`/assistant?guide=${exp}`}>
                  Ask the {exp} project guide →
                </Link>
                {exp === "E06" && (
                  <Link className="pbtn" to="/walkthrough">
                    Explore the fault consequences
                  </Link>
                )}
              </div>
              <div className="split">
                <section>
                  <h2 className="cap2">Your kit · {e.kit}</h2>
                  <Manifest exp={exp} />
                  <p className="small">{e.evidenceKind}</p>
                </section>
                <section>
                  <h2 className="cap2">Confirm before reserving</h2>
                  <fieldset>
                    <legend className="vh">
                      Preparation checklist for {exp}
                    </legend>
                    {e.prepare.map((text, i) => (
                      <label className="check" key={text}>
                        <input
                          type="checkbox"
                          checked={state.prepared[exp][i]}
                          onChange={(event) =>
                            send({
                              type: "command",
                              command: {
                                type: "prepare",
                                exp,
                                index: i,
                                checked: event.target.checked,
                              },
                            })
                          }
                        />
                        <span>{text}</span>
                      </label>
                    ))}
                  </fieldset>
                </section>
              </div>
            </>
          )}
          {step === "reserve" &&
            (b ? (
              <section className="ticket">
                <p className="ed-kicker">Example booking confirmed</p>
                <p className="big">{b.id}</p>
                <p className="when">
                  {b.day} · {b.slot} · {e.station}
                </p>
                <Manifest exp={exp} />
              </section>
            ) : (
              <div className="split">
                <section>
                  <h2 className="cap2">Pick a time</h2>
                  <ul className="slots">
                    {fixtures.slots.map((slot) => {
                      const status = selectors.slotStatus(
                        state,
                        fixtures,
                        exp,
                        slot,
                      );
                      return (
                        <li className="slot" key={slot}>
                          <b>{slot}</b>
                          <span
                            className={`tag ${status.state === "free" ? "ok" : status.state === "taken" ? "warn" : "bad"}`}
                          >
                            {status.state === "free"
                              ? "Free"
                              : status.state === "taken"
                                ? "Taken"
                                : "Kit unavailable"}
                          </span>
                          <span className="small">{status.reason}</span>
                          <button
                            className={`pbtn ${status.state === "free" ? "primary" : ""}`}
                            onClick={() =>
                              send({
                                type: "command",
                                command: { type: "reserve", exp, slot },
                              })
                            }
                          >
                            Reserve
                            <span className="vh">
                              {" "}
                              {slot} for {exp}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <section>
                  <h2 className="cap2">One booking holds all of this</h2>
                  <Manifest exp={exp} />
                </section>
              </div>
            ))}
          {step === "arrive" && (
            <div className="split even">
              <section className="panel">
                <h2>1. Station</h2>
                <LabPlan />
                {session.checkedIn ? (
                  <p className="tag ok">Checked in · {session.station}</p>
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      send({
                        type: "command",
                        command: { type: "check-in", exp, station },
                      });
                    }}
                  >
                    <div className="field">
                      <label htmlFor="station">
                        Type the ID on the desk label
                      </label>
                      <input
                        id="station"
                        className="big"
                        value={station}
                        onChange={(event) => setStation(event.target.value)}
                        placeholder={e.station}
                        autoComplete="off"
                        autoCapitalize="characters"
                      />
                    </div>
                    <button className="pbtn primary">Check in</button>
                  </form>
                )}
              </section>
              <section className="panel">
                <h2>2. Kit</h2>
                {kit.portable.length ? (
                  <ul className="kit">
                    {kit.portable.map((i) => (
                      <li key={i.id}>
                        <label htmlFor={`count-${i.id}`}>
                          <b>
                            <code>{i.id}</code>
                          </b>
                          <br />
                          {itemName(i)}
                        </label>
                        <span className="cnt">
                          <input
                            id={`count-${i.id}`}
                            type="number"
                            min="0"
                            max={i.qty}
                            disabled={session.started}
                            value={session.kit[i.id] || 0}
                            onChange={(event) =>
                              send({
                                type: "command",
                                command: {
                                  type: "kit-item",
                                  exp,
                                  item: i.id,
                                  quantity: Number(event.target.value),
                                },
                              })
                            }
                          />{" "}
                          of {i.qty}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <Manifest exp={exp} />
                    <p>Nothing portable to count.</p>
                  </>
                )}
                <div className="acts">
                  {session.started ? (
                    <span className="tag ok">Session started</span>
                  ) : (
                    <button
                      className="pbtn primary"
                      onClick={() =>
                        send({
                          type: "command",
                          command: { type: "start", exp },
                        })
                      }
                    >
                      Start session
                    </button>
                  )}
                </div>
              </section>
            </div>
          )}
          {step === "bench" && (
            <>
              <p className="pull">{e.question}</p>
              <p className="msg">{e.evidenceKind}</p>
              <p className="small">
                New captures retain the current environment example and method
                revision. <Link to="/environment">Environment: {scenario}</Link>{" "}
                ·{" "}
                <Link to={`/${exp}/conditions`}>
                  Review recorded conditions
                </Link>
                {" · "}
                <Link to={`/${exp}/rehearsal`}>Independent rehearsal</Link>
              </p>
              <div className="comparison">
                {e.evidence.map((ev, i) => {
                  const recorded = session.captures.find((c) => c.id === ev.id);
                  return (
                    <section className="evidence-plate" key={ev.id}>
                      <h2>{ev.label}</h2>
                      {exp === "E06" ? (
                        <VisionArt side={i === 1} />
                      ) : (
                        <SignalArt rate={ev.rateHz} />
                      )}
                      <p>
                        <code>{ev.id}</code> · {ev.detail}
                      </p>
                      {recorded ? (
                        <p className="tag ok">
                          Recorded · {recorded.time} · {recorded.source}
                        </p>
                      ) : (
                        <button
                          className="pbtn primary"
                          onClick={() =>
                            send({
                              type: "command",
                              command: {
                                type: "capture",
                                exp,
                                evidence: ev.id,
                                observations,
                                prepared: exp === "E06" && session.interrupted,
                              },
                            })
                          }
                        >
                          Record {ev.label}
                          {exp === "E06" && session.interrupted
                            ? " as a prepared condition"
                            : ""}
                        </button>
                      )}
                      {exp === "E01" && (
                        <details>
                          <summary>Computed sample values</summary>
                          <table className="led">
                            <thead>
                              <tr>
                                <th scope="col">Time (s)</th>
                                <th scope="col">Amplitude (V)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {signalSamples(ev.rateHz!).map((p) => (
                                <tr key={p.t}>
                                  <td>{p.t.toFixed(3)}</td>
                                  <td>{p.value.toFixed(3)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </details>
                      )}
                    </section>
                  );
                })}
              </div>
              {exp === "E06" && !session.receipt && !session.closed && (
                <details className="more">
                  <summary>Demonstrate a camera interruption</summary>
                  <p>
                    Already-recorded evidence is retained. The remaining
                    condition can use a labelled prepared illustration.
                  </p>
                  <button
                    className="pbtn"
                    onClick={() =>
                      send({
                        type: "command",
                        command: { type: "interrupt-camera" },
                      })
                    }
                  >
                    Stop the example feed
                  </button>
                </details>
              )}
            </>
          )}
          {step === "notebook" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send({
                  type: "command",
                  command: {
                    type: "save-note",
                    exp,
                    text: session.note,
                    failSave,
                  },
                });
                setFailSave(false);
              }}
            >
              <p className="pull">
                Describe what the evidence supports and what it cannot
                establish.
              </p>
              <div className="field">
                <label htmlFor="claim">Notebook claim · {e.revision}</label>
                <textarea
                  id="claim"
                  disabled={!!session.receipt}
                  value={session.note}
                  onChange={(event) =>
                    send({
                      type: "command",
                      command: {
                        type: "draft-note",
                        exp,
                        text: event.target.value,
                      },
                    })
                  }
                />
                <span className="hint">
                  At least 40 characters.{" "}
                  {session.noteSaved === session.note && session.noteSaved
                    ? "Claim saved."
                    : "Claim has unsaved changes."}
                </span>
              </div>
              <button className="pbtn primary" disabled={!!session.receipt}>
                Save claim
              </button>
              {!session.receipt && (
                <details className="more">
                  <summary>Save recovery demo</summary>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={failSave}
                      onChange={(event) => setFailSave(event.target.checked)}
                    />
                    Make the next claim save fail
                  </label>
                </details>
              )}
            </form>
          )}
          {step === "submit" && (
            <>
              <p className="pull">
                {e.revision} · request {e.request}
              </p>
              <ul className="evidence-summary">
                {session.captures.map((c) => (
                  <li key={c.id}>
                    <code>{c.id}</code> · {c.source} · {c.time}
                    <br />
                    {Object.entries(c.settings)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" · ")}
                  </li>
                ))}
              </ul>
              <p>{session.noteSaved || "No saved notebook claim yet."}</p>
              {session.receipt ? (
                <p className="msg good">
                  <strong>Submitted · {session.receipt}</strong>
                </p>
              ) : (
                <>
                  <p className="small">
                    {session.ackPending
                      ? "Acknowledgement pending. Retry the same request; submission is not confirmed."
                      : "Review all required evidence and the saved claim before submitting."}
                  </p>
                  <button
                    className="pbtn primary"
                    onClick={() => {
                      send({
                        type: "command",
                        command: { type: "submit", exp, dropAck },
                      });
                      setDropAck(false);
                    }}
                  >
                    {session.ackPending
                      ? "Retry the same request"
                      : "Submit revision"}
                  </button>
                  <details className="more">
                    <summary>Acknowledgement recovery demo</summary>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={dropAck}
                        onChange={(event) => setDropAck(event.target.checked)}
                      />
                      Lose the first acknowledgement
                    </label>
                  </details>
                </>
              )}
            </>
          )}
          {step === "return" && (
            <>
              <p className="pull">
                {session.closed
                  ? "Session closed. The evidence remains available."
                  : "Match the return against the same manifest."}
              </p>
              {kit.portable.length ? (
                <ul className="kit">
                  {kit.portable.map((i) => (
                    <li key={i.id}>
                      <label htmlFor={`return-${i.id}`}>
                        <code>{i.id}</code> · {itemName(i)}
                      </label>
                      <span className="cnt">
                        <input
                          id={`return-${i.id}`}
                          type="number"
                          min="0"
                          max={i.qty}
                          disabled={session.closed}
                          value={session.returned[i.id] || 0}
                          onChange={(event) =>
                            send({
                              type: "command",
                              command: {
                                type: "return-item",
                                exp,
                                item: i.id,
                                quantity: Number(event.target.value),
                              },
                            })
                          }
                        />{" "}
                        of {i.qty}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No portable items to return.</p>
              )}
              {session.followUp && (
                <p className="msg warn">
                  Return follow-up · {session.followUp} ·{" "}
                  {session.followUpClosed
                    ? "Located and closed"
                    : "Open; missing items remain unavailable"}
                </p>
              )}
              {!session.closed && (
                <div className="acts">
                  <button
                    className="pbtn primary"
                    onClick={() =>
                      send({ type: "command", command: { type: "close", exp } })
                    }
                  >
                    Close session
                  </button>
                  <button
                    className="pbtn"
                    onClick={() =>
                      send({
                        type: "command",
                        command: { type: "close", exp, withFollowUp: true },
                      })
                    }
                  >
                    Close with a return follow-up
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
      <nav className="journey-actions" aria-label="Previous and next step">
        <Link className="pbtn" to={index ? `/${exp}/${steps[index - 1]}` : "/"}>
          ← {index ? labels[index - 1] : "Today"}
        </Link>
        {index < 6 ? (
          <Link className="pbtn primary" to={`/${exp}/${steps[index + 1]}`}>
            {labels[index + 1]} →
          </Link>
        ) : (
          <Link className="pbtn" to="/">
            Today →
          </Link>
        )}
      </nav>
    </>
  );
}
