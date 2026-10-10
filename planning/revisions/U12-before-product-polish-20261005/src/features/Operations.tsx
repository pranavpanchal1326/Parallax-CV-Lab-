import { Link } from "react-router";
import { useState } from "react";
import { workspace } from "../domain/workspace";
import { useCommands, useLab } from "../app/context";
import { fixtures } from "../data/fixtures";
import { selectors } from "../domain/adapter";
import { EquipmentList } from "./StudentJourney";

export function Operations() {
  const { state } = useLab();
  const dispatch = useCommands();
  const w = workspace(state);
  const detail = w.drafts["issue-detail"] || "",
    repair = w.drafts.repair || "",
    symptom = w.drafts["issue-symptom"] || fixtures.fault.symptoms[0];
  const draft = (key: string, value: string) =>
    dispatch({
      type: "command",
      command: { type: "workspace-draft", key, value },
    });
  const issue = selectors.openIssue(state);
  return (
    <>
      <p className="ed-kicker">Technician</p>
      <h1>
        Follow the <em>fault.</em>
      </h1>
      <p className="pull">
        One equipment record, with its consequences visible across the lab.
      </p>
      <nav className="task-links" aria-label="Technician tasks">
        <Link to="/operations">Operations desk & handover</Link>
        <Link to="/walkthrough">Rehearse fault consequences</Link>
        <Link to="/assets/C1-CAM">Camera passport</Link>
        <Link to="/assets/C1-CAM/calibration">Calibration</Link>
        <Link to="/map">Equipment and map</Link>
        <Link to="/mobile/report">On-site report</Link>
      </nav>
      {issue ? (
        <div className="split">
          <section className="panel">
            <h2>
              {issue.id} · {issue.asset}
            </h2>
            <p className="tag info">{issue.status}</p>
            <ol className="fault-stages" aria-label="Fault stages">
              {[
                "Reported",
                "Classified",
                "Restricted if required",
                "Repair recorded",
                "Verification recorded",
                "Released",
              ].map((stage, i) => (
                <li key={stage}>
                  <span>{i + 1}</span>
                  {stage}
                </li>
              ))}
            </ol>
            <p>{issue.symptom}</p>
            <p>{issue.detail}</p>
            <fieldset>
              <legend>Classify what is at risk</legend>
              {fixtures.fault.classifications.map((c) => (
                <label className="check" key={c.id}>
                  <input
                    type="radio"
                    name="classification"
                    checked={issue.classification === c.id}
                    onChange={() =>
                      dispatch({
                        type: "command",
                        command: {
                          type: "triage",
                          issue: issue.id,
                          classification: c.id,
                        },
                      })
                    }
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </fieldset>
            <p className="small">
              Affected if restricted:{" "}
              {selectors.previewImpact(state, issue.asset).join(", ") ||
                "No open bookings"}
              .
            </p>
            {fixtures.fault.classifications.find(
              (c) => c.id === issue.classification,
            )?.restrict && (
              <button
                className="pbtn"
                onClick={() =>
                  dispatch({
                    type: "command",
                    command: { type: "restrict", issue: issue.id },
                  })
                }
              >
                Apply restriction to {issue.asset}
              </button>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                dispatch({
                  type: "command",
                  command: { type: "repair", issue: issue.id, text: repair },
                });
              }}
            >
              <div className="field">
                <label htmlFor="repair">Repair record</label>
                <textarea
                  id="repair"
                  required
                  disabled={!!issue.repair}
                  value={issue.repair?.text || repair}
                  onChange={(event) => draft("repair", event.target.value)}
                />
              </div>
              <button className="pbtn" disabled={!!issue.repair}>
                Record repair
              </button>
              {issue.repair && (
                <p className="small">
                  {issue.repair.id} is retained. Continue to verification; this
                  repair cannot be replaced.
                </p>
              )}
            </form>
            <div className="acts">
              <button
                className="pbtn"
                disabled={!issue.repair}
                onClick={() =>
                  dispatch({
                    type: "command",
                    command: {
                      type: "verify",
                      issue: issue.id,
                      outcome: "interrupted",
                    },
                  })
                }
              >
                Interrupt verification
              </button>
              <button
                className="pbtn"
                disabled={!issue.repair}
                onClick={() =>
                  dispatch({
                    type: "command",
                    command: {
                      type: "verify",
                      issue: issue.id,
                      outcome: "pass",
                    },
                  })
                }
              >
                Record verification pass
              </button>
              <button
                className="pbtn primary"
                disabled={
                  !issue.classification ||
                  (!!issue.restriction && !issue.verification)
                }
                onClick={() =>
                  dispatch({
                    type: "command",
                    command: { type: "release", issue: issue.id },
                  })
                }
              >
                Release and close
              </button>
            </div>
            {issue.restriction && !issue.verification && (
              <p className="small">
                Release requires a recorded verification. An interrupted check
                keeps the issue and restriction open.
              </p>
            )}
            {!issue.classification && (
              <p className="small">
                Classify the issue before closing its record.
              </p>
            )}
          </section>
          <section>
            <h2 className="cap2">Issue history</h2>
            <ol className="activity-lines">
              {issue.history.map((entry, i) => (
                <li key={i}>
                  <code>{entry.time}</code> · {entry.actor}
                  <p>{entry.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : (
        <section className="panel">
          <h2>Report a problem on C1-CAM</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch({
                type: "command",
                command: { type: "report", asset: "C1-CAM", symptom, detail },
              });
            }}
          >
            <div className="field">
              <label htmlFor="symptom">What you observed</label>
              <select
                id="symptom"
                value={symptom}
                onChange={(event) => draft("issue-symptom", event.target.value)}
              >
                {fixtures.fault.symptoms.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="detail">Detail (optional)</label>
              <textarea
                id="detail"
                value={detail}
                onChange={(event) => draft("issue-detail", event.target.value)}
              />
            </div>
            <button
              className="pbtn primary"
              disabled={state.issues.some((i) => i.status === "Closed")}
            >
              Report example fault
            </button>
            {state.issues.some((i) => i.status === "Closed") && (
              <p>
                This example fault is closed. Its history is retained below.
                Start a fresh example to repeat the scenario.
              </p>
            )}
          </form>
        </section>
      )}
      {state.issues
        .filter((i) => i.status === "Closed")
        .map((i, n) => (
          <section className="closed-record" key={n}>
            <h2>{i.id} · closed history</h2>
            <p>
              {i.asset} · {i.symptom}
            </p>
            <ol className="activity-lines">
              {i.history.map((h, k) => (
                <li key={k}>
                  <code>
                    {h.time} · {h.actor}
                  </code>
                  <p>{h.text}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      {selectors.openFollowUps(state).map((f) => (
        <section className="panel" key={f.id}>
          <h2>{f.id} · Missing-item follow-up</h2>
          <button
            className="pbtn"
            onClick={() =>
              dispatch({
                type: "command",
                command: { type: "locate", exp: f.exp as "E06" | "E01" },
              })
            }
          >
            Record item located
          </button>
        </section>
      ))}
      <h2 className="cap2">Resource consequences</h2>
      <EquipmentList />
    </>
  );
}

export function WallDisplay() {
  const { state } = useLab();
  const current = selectors.publicNotices(state);
  const time = `${String(Math.floor(state.minute / 60) % 24).padStart(2, "0")}:${String(state.minute % 60).padStart(2, "0")}`;
  const [held, setHeld] = useState<{
    notices: typeof current;
    time: string;
  } | null>(null);
  const notices = held?.notices || current;
  return (
    <>
      <p className="ed-kicker">Public display</p>
      <h1>
        The lab, <em>at a glance.</em>
      </h1>
      <p className="pull">Equipment notices and orientation.</p>
      <p className={held ? "msg warn" : "small"} role="status">
        {held
          ? `Delayed display demonstration · retained example snapshot at ${held.time}. Notices may have changed; check the current lab record.`
          : `Example projection. No live operational feed.`}
      </p>
      {notices.length ? (
        notices.map((n) => (
          <section className="msg warn" key={n.asset}>
            <h2>{n.asset}</h2>
            <p>{n.text}</p>
          </section>
        ))
      ) : (
        <p className="msg good">No equipment restriction notices.</p>
      )}
      <p>
        Computing · CMP / Controlled capture · C1 / Signal bench · S1 / Kit
        storage · STO
      </p>
      <p className="small">
        This public projection omits private issue, booking and notebook
        records. No connected sensor readings are available in this build.
      </p>
      <details className="more">
        <summary>Display recovery demonstration</summary>
        <button
          className="pbtn"
          onClick={() => setHeld(held ? null : { notices: current, time })}
        >
          {held
            ? "Resume current example projection"
            : "Demonstrate a delayed display"}
        </button>
      </details>
    </>
  );
}
