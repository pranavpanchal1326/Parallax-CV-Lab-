import { useState } from "react";
import { Link } from "react-router";
import { useCommands, useLab } from "../app/context";
import { workspace } from "../domain/workspace";
import { fixtures, experiments, experimentIds } from "../data/fixtures";
import { selectors } from "../domain/adapter";

export function Bookings() {
  const { state } = useLab();
  return (
    <>
      <p className="ed-kicker">Student · bookings</p>
      <h1>
        Your next <em>session.</em>
      </h1>
      {experimentIds.map((exp) => {
        const b = selectors.myBooking(state, exp);
        return (
          <article className="booking-row" key={exp}>
            <div>
              <code>
                {exp} · {b?.id || "Not reserved"}
              </code>
              <h2>{experiments[exp].title}</h2>
              {b ? (
                <p>
                  {b.day} · {b.slot} · {experiments[exp].station} · {b.status}
                </p>
              ) : (
                <p>Prepare and reserve the complete kit before arriving.</p>
              )}
              {b && selectors.bookingImpact(state, b).affected && (
                <p className="msg warn">
                  Affected by {selectors.bookingImpact(state, b).by.join(", ")}.
                  Evidence already recorded is retained.
                </p>
              )}
            </div>
            <Link
              className="pbtn"
              to={`/${exp}/${b ? (state.sessions[exp].closed ? "return" : "arrive") : "prepare"}`}
            >
              {b ? "Open session" : "Start preparation"} →
            </Link>
          </article>
        );
      })}
      <Link to="/map">Find stations on the lab plan →</Link>
      <p><Link to="/operations">Rehearse allocation conflicts and request recovery →</Link></p>
    </>
  );
}

export function MobileLookup() {
  const { state } = useLab(),
    dispatch = useCommands(),
    w = workspace(state);
  const [lookup, setLookup] = useState<string | null>(null);
  const resource = fixtures.resources.find((r) => r.id === lookup);
  return (
    <>
      <p className="ed-kicker">On-site companion</p>
      <h1>
        One printed ID.
        <br />
        <em>The right record.</em>
      </h1>
      <div className="mobile-workspace">
        <p>
          Read the station or equipment label. You can type its ID without
          camera permission.
        </p>
        <p className="small">
          Camera scanning is a concept in this build. The typed route is fully
          usable; no camera or microphone is opened.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLookup(
              (w.drafts.lookup || "").trim().toUpperCase().replace(/\s+/g, ""),
            );
          }}
        >
          <div className="field">
            <label htmlFor="lookup">Station or asset ID</label>
            <input
              id="lookup"
              type="text"
              autoCapitalize="characters"
              autoComplete="off"
              required
              value={w.drafts.lookup || ""}
              aria-describedby="lookup-help"
              onChange={(e) => {
                setLookup(null);
                dispatch({
                  type: "command",
                  command: {
                    type: "workspace-draft",
                    key: "lookup",
                    value: e.target.value,
                  },
                });
              }}
            />
            <p id="lookup-help" className="small">
              Examples: CV-02, C1-CAM, CAL-01. IDs must belong to PARALLAX.
            </p>
          </div>
          <button className="pbtn primary">Find the record</button>
        </form>
        {lookup !== null && (
          <section
            className={`lookup-result ${resource ? "" : "msg warn"}`}
            role="status"
          >
            {resource ? (
              <>
                <code>{resource.id}</code>
                <h2>{resource.name}</h2>
                <p>
                  {selectors.availability(state, resource.id).label} ·{" "}
                  {selectors.occupancy(state, fixtures, resource.id).label}
                </p>
                <Link className="pbtn" to={`/assets/${resource.id}`}>
                  Open this asset record
                </Link>
              </>
            ) : (
              <>
                <h2>
                  {lookup === "SPL-CAM-03"
                    ? "This belongs to the Speech Lab."
                    : "No matching record in this lab."}
                </h2>
                <p>
                  Check the printed label and lab name. No booking, check-in or
                  fault report has been created.
                </p>
              </>
            )}
          </section>
        )}
        <div className="action-stack">
          <Link className="pbtn" to="/bookings">
            My bookings and check-in
          </Link>
          <Link className="pbtn" to="/mobile/report">
            Report a camera problem
          </Link>
          <Link className="pbtn quiet" to="/map">
            Browse every asset
          </Link>
        </div>
      </div>
    </>
  );
}

export function MobileReport() {
  const { state } = useLab(),
    dispatch = useCommands(),
    w = workspace(state);
  const [offline, setOffline] = useState(false);
  const issue = state.issues.find(
    (i) => i.asset === "C1-CAM" && i.status !== "Closed",
  );
  const draft = (key: string, value: string) =>
    dispatch({
      type: "command",
      command: { type: "workspace-draft", key, value },
    });
  return (
    <>
      <p className="ed-kicker">On-site companion · C1-CAM report</p>
      <h1>
        Describe the problem.
        <br />
        <em>Keep the draft.</em>
      </h1>
      <div className="mobile-workspace">
        {w.pendingReport && (
          <div className="msg warn">
            <strong>DRAFT-ISS-local-01 · not submitted</strong>
            <p>
              Stored as an example draft in this browser. Retry after reviewing
              the detail; no operational report has been sent.
            </p>
          </div>
        )}
        {issue && (
          <div className="msg info">
            <strong>{issue.id} is already open.</strong>
            <p>
              Repeated reports are refused. The saved draft remains available.
            </p>
            <Link to="/tech">Follow the existing issue →</Link>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "command",
              command: offline
                ? { type: "report-defer" }
                : {
                    type: "report",
                    asset: "C1-CAM",
                    symptom:
                      w.drafts["issue-symptom"] || fixtures.fault.symptoms[0],
                    detail: w.drafts["issue-detail"] || "",
                  },
            });
          }}
        >
          <div className="field">
            <label htmlFor="mobile-symptom">What did you observe?</label>
            <select
              id="mobile-symptom"
              value={w.drafts["issue-symptom"] || fixtures.fault.symptoms[0]}
              onChange={(e) => draft("issue-symptom", e.target.value)}
            >
              {fixtures.fault.symptoms.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="mobile-detail">Detail (optional)</label>
            <textarea
              id="mobile-detail"
              value={w.drafts["issue-detail"] || ""}
              onChange={(e) => draft("issue-detail", e.target.value)}
            />
          </div>
          <details className="more">
            <summary>Try report recovery</summary>
            <label className="check">
              <input
                type="checkbox"
                checked={offline}
                onChange={(e) => setOffline(e.target.checked)}
              />
              Demonstrate unavailable connection: keep as a local draft
            </label>
          </details>
          <button className="pbtn primary">
            {offline
              ? "Keep example report as a draft"
              : w.pendingReport
                ? "Retry the example report"
                : "Create example report"}
          </button>
        </form>
        <p className="small">
          Connection failure is a deliberate scenario control. Nothing is sent
          to a server; local storage availability is reported separately below.
        </p>
        <Link to="/mobile">← Asset lookup</Link>
      </div>
    </>
  );
}
