import { useState } from "react";
import { Link, useParams } from "react-router";
import { fixtures, kits } from "../data/fixtures";
import { selectors } from "../domain/adapter";
import { assetZone, workspace } from "../domain/workspace";
import { useCommands, useLab } from "../app/context";
import { LabPlan } from "../components/LabPlan";
import { EquipmentOverview } from "./StudentJourney";
import { LinkedMap } from "../components/LinkedMap";

export function LabMap() {
  const { state } = useLab();
  return (
    <>
      <p className="ed-kicker">
        Shared lab map
      </p>
      <h1>
        Find your place.
        <br />
        <em>Read its condition.</em>
      </h1>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <LabPlan />
          <details className="data-note">
            <summary>How to read this plan</summary>
            <p>
              Availability and occupancy are separate. A bookable station may
              already be in use. This plan is derived from the canonical
              geometry; the 10 × 7 m room remains an assumed envelope.
            </p>
          </details>
          <EquipmentOverview />
        </section>
        <aside className="workspace-aside">
          <h2>Equipment index</h2>
          <ul className="resource-index">
            {fixtures.resources.map((r) => (
              <li key={r.id}>
                <Link to={`/assets/${r.id}`}>
                  <code>{r.id}</code>
                  <span>{r.name}</span>
                </Link>
                <small>
                  {assetZone(state, r.id)} ·{" "}
                  {selectors.availability(state, r.id).label}
                </small>
              </li>
            ))}
          </ul>
          <a className="pbtn quiet" href="/design/phase-08/lab-map.html">
            Open original map reference ↗
          </a>
        </aside>
      </div>
      <LinkedMap />
      <p><Link to="/studio">Explore art, wayfinding and physical references →</Link></p>
    </>
  );
}

export function Asset() {
  const { asset = "" } = useParams(),
    { state } = useLab(),
    dispatch = useCommands(),
    w = workspace(state);
  const [expected, setExpected] = useState(w.revision);
  const resource = fixtures.resources.find((r) => r.id === asset);
  const draft = (key: string, value: string) =>
    dispatch({
      type: "command",
      command: { type: "workspace-draft", key, value },
    });
  if (!resource)
    return (
      <>
        <h1>Asset not found.</h1>
        <p>The printed ID must belong to this lab.</p>
        <Link className="pbtn" to="/mobile">
          Look up another ID
        </Link>
      </>
    );
  const membership = Object.entries(kits).filter(([, k]) =>
    [...k.fixed, ...k.portable].some(
      (i) => i.id === asset || i.members?.includes(asset),
    ),
  );
  const moves = w.moves.filter((m) => m.asset === asset);
  return (
    <>
      <p className="ed-kicker">
        Asset passport · {resource.kind}
      </p>
      <h1>
        {asset}
        <br />
        <em>{resource.name}</em>
      </h1>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <dl className="record-settings">
            <div>
              <dt>Availability</dt>
              <dd>{selectors.availability(state, asset).label}</dd>
            </div>
            <div>
              <dt>Occupancy</dt>
              <dd>{selectors.occupancy(state, fixtures, asset).label}</dd>
            </div>
            <div>
              <dt>Recorded zone</dt>
              <dd>
                {assetZone(state, asset)} ·{" "}
                {state.resources[asset].located
                  ? "located in example"
                  : "location unknown"}
              </dd>
            </div>
          </dl>
          <h2>Kit membership and consequences</h2>
          {membership.map(([id, k]) => (
            <div className="ledger-row" key={id}>
              <div>
                <code>{id}</code>
                <h3>{k.name}</h3>
              </div>
              <p>
                {selectors.kitStatus(state, fixtures, id).ok
                  ? "No availability blockers"
                  : `Unavailable: ${selectors.kitStatus(state, fixtures, id).blockers.join(", ")}`}
              </p>
            </div>
          ))}
          <p className="small">
            A movement record never lifts a restriction or restores a missing
            item. Those decisions stay on the fault and return records.
          </p>
          <h2>Movement history</h2>
          <ol className="activity-lines">
            <li>
              <code>Initial record · {resource.zone}</code>
              <p>Original zone assignment; no invented movement date.</p>
            </li>
            {moves.map((m, i) => (
              <li key={i}>
                <code>
                  {m.time} · {m.actor}
                </code>
                <p>
                  {m.from} → {m.to}
                </p>
                <p>{m.reason}</p>
              </li>
            ))}
          </ol>
          <h2>Related fault records</h2>
          {state.issues.filter((i) => i.asset === asset).length ? (
            state.issues
              .filter((i) => i.asset === asset)
              .map((issue, i) => (
                <article className="ledger-row" key={i}>
                  <div>
                    <Link to="/tech">{issue.id}</Link>
                    <p>{issue.symptom}</p>
                  </div>
                  <p>{issue.status}</p>
                </article>
              ))
          ) : (
            <p>No fault record for this asset in the current example.</p>
          )}
        </section>
        <aside className="workspace-aside">
          <h2>Next action</h2>
          <div className="action-stack">
            <Link className="pbtn" to="/tech">
              Open technician queue
            </Link>
            {asset === "C1-CAM" && (
              <Link className="pbtn" to={`/assets/${asset}/calibration`}>
                Open calibration record
              </Link>
            )}
            <Link className="pbtn quiet" to="/map">
              Back to plan and equipment list
            </Link>
          </div>
          {resource.kind.startsWith("Portable") && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch({
                  type: "command",
                  command: {
                    type: "asset-move",
                    asset,
                    to: w.drafts["move-zone"] || "STO",
                    reason: w.drafts["move-reason"] || "",
                    expected,
                  },
                });
              }}
            >
              <h2>Record a movement</h2>
              <div className="field">
                <label htmlFor="move-zone">Destination zone</label>
                <select
                  id="move-zone"
                  value={w.drafts["move-zone"] || "STO"}
                  onChange={(e) => draft("move-zone", e.target.value)}
                >
                  {Object.entries(fixtures.zones).map(([id, name]) => (
                    <option value={id} key={id}>
                      {id} · {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="move-reason">Reason for moving</label>
                <textarea
                  id="move-reason"
                  required
                  value={w.drafts["move-reason"] || ""}
                  onChange={(e) => draft("move-reason", e.target.value)}
                />
              </div>
              <p className="small">
                Active session holds and missing items prevent movement. Actor,
                time and the previous zone are preserved.
              </p>
              <button className="pbtn primary">Record example movement</button>
              {expected !== w.revision && (
                <p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setExpected(w.revision)}
                  >
                    Review the latest record and reopen the form
                  </button>
                </p>
              )}
            </form>
          )}
        </aside>
      </div>
    </>
  );
}

export function Calibration() {
  const { asset } = useParams(),
    { state } = useLab(),
    dispatch = useCommands(),
    w = workspace(state);
  const [expected, setExpected] = useState(w.revision);
  if (asset !== "C1-CAM")
    return (
      <>
        <h1>No calibration method for this asset.</h1>
        <Link to="/map">Return to equipment</Link>
      </>
    );
  return (
    <>
      <p className="ed-kicker">Technician · C1-CAM calibration</p>
      <h1>
        Keep calibration <em>traceable.</em>
      </h1>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <h2>CALREC-C1-r01 · preserved reference</h2>
          <p>
            Original reference record. No measured RMS value is supplied to
            this demonstrator. The record is not replaced by this review.
          </p>
          <h2>
            CALREC-C1-r02 ·{" "}
            {w.calibration.length ? "Recorded example" : "Draft example"}
          </h2>
          <p className="calibration-count">
            {w.calibrationViews}
            <span> / 15 planned reference views</span>
          </p>
          <progress
            value={w.calibrationViews}
            max={15}
            aria-label="Planned calibration example views"
          />
          <p>
            Planar target CAL-01 · method CAL-M-01 v1. The scenario starts with
            11 views, as specified in the design.
          </p>
          <button
            className="pbtn"
            disabled={w.calibrationViews === 15 || !!w.calibration.length}
            onClick={() =>
              dispatch({
                type: "command",
                command: { type: "calibration-view" },
              })
            }
          >
            Add a planned example view
          </button>
          <p className="small">
            This exercises the record workflow. No camera frame is captured, no
            error metric is calculated and no device is calibrated.
          </p>
          {w.calibration.map((c) => (
            <section className="msg good" key={c.id}>
              <h2>{c.id}</h2>
              <p>
                {c.time} · {c.actor} · {c.views} planned example views
              </p>
              <p>{c.reason}</p>
            </section>
          ))}
          <Link to="/assets/C1-CAM">← Camera passport</Link>
        </section>
        <aside className="workspace-aside">
          <h2>Fitness for use needs a review.</h2>
          <p>
            RMS reprojection error describes a particular set of views and
            resolution. This build supplies no universal pass threshold.
          </p>
          <p>
            Recording a calibration review does not release a restricted camera.
            Fault verification and release are separate.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({
                type: "command",
                command: {
                  type: "calibration-record",
                  reason: w.drafts["calibration-reason"] || "",
                  expected,
                },
              });
            }}
          >
            <div className="field">
              <label htmlFor="cal-reason">Review note and limitations</label>
              <textarea
                id="cal-reason"
                required
                disabled={!!w.calibration.length}
                value={w.drafts["calibration-reason"] || ""}
                onChange={(e) =>
                  dispatch({
                    type: "command",
                    command: {
                      type: "workspace-draft",
                      key: "calibration-reason",
                      value: e.target.value,
                    },
                  })
                }
              />
            </div>
            <button className="pbtn primary" disabled={!!w.calibration.length}>
              Record example review
            </button>
            {expected !== w.revision && (
              <button
                type="button"
                className="text-button"
                onClick={() => setExpected(w.revision)}
              >
                Reopen with current revision
              </button>
            )}
          </form>
          <Link to="/tech">Open fault verification →</Link>
        </aside>
      </div>
    </>
  );
}
