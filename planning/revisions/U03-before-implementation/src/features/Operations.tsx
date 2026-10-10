import { useState } from "react";
import { useCommands, useLab } from "../app/context";
import { fixtures } from "../data/fixtures";
import { selectors } from "../domain/adapter";
import { EquipmentList } from "./StudentJourney";

export function Operations() {
  const { state } = useLab();
  const dispatch = useCommands();
  const [detail, setDetail] = useState("");
  const [repair, setRepair] = useState("");
  const [symptom, setSymptom] = useState(fixtures.fault.symptoms[0]);
  const issue = selectors.openIssue(state);
  return (
    <>
      <p className="ed-kicker">Technician · role preview · example records</p>
      <h1>
        Follow the <em>fault.</em>
      </h1>
      <p className="pull">
        One equipment record, with its consequences visible across the lab.
      </p>
      {issue ? (
        <div className="split">
          <section className="panel">
            <h2>
              {issue.id} · {issue.asset}
            </h2>
            <p className="tag info">{issue.status}</p>
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
                  value={repair}
                  onChange={(event) => setRepair(event.target.value)}
                />
              </div>
              <button className="pbtn">Record repair</button>
            </form>
            <div className="acts">
              <button
                className="pbtn"
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
                onChange={(event) => setSymptom(event.target.value)}
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
                onChange={(event) => setDetail(event.target.value)}
              />
            </div>
            <button className="pbtn primary">Report example fault</button>
          </form>
        </section>
      )}
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
  const notices = selectors.publicNotices(state);
  return (
    <>
      <p className="ed-kicker">Public display · example records</p>
      <h1>
        The lab, <em>at a glance.</em>
      </h1>
      <p className="pull">Equipment notices and orientation.</p>
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
    </>
  );
}
