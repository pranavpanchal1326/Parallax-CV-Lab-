import { useMemo, useState } from "react";
import { Link } from "react-router";
import { StateContext, useLab } from "../app/context";
import { LabPlan } from "../components/LabPlan";
import { fixtures } from "../data/fixtures";
import { buildFaultStory, faultConsequences } from "../domain/faultStory";
import { clockLabel, exampleTime } from "../domain/observations";
import type { LabState } from "../domain/types";

export function PublicConsequence({ state }: { state: LabState }) {
  const { notices } = faultConsequences(state);
  return (
    <div
      className="public-consequence"
      role="region"
      aria-label="Public projection only"
    >
      <h3>Public display</h3>
      {notices.length ? (
        notices.map((n) => (
          <p key={n.asset}>
            <strong>{n.asset}</strong> · {n.text}
          </p>
        ))
      ) : (
        <p>No camera restriction notice in this sandbox projection.</p>
      )}
      <p className="small">
        Only the permitted equipment consequence. No reporter, issue, booking,
        repair detail or student evidence is included.
      </p>
    </div>
  );
}

export function FaultWalkthrough() {
  const { state: operational } = useLab();
  const frames = useMemo(buildFaultStory, []);
  const [index, setIndex] = useState(0);
  const [stageListOpen, setStageListOpen] = useState(false);
  const frame = frames[index],
    state = frame.state;
  const consequences = faultConsequences(state);
  const issue = state.issues.find((i) => i.id === fixtures.fault.issue);
  const session = state.sessions.E06;
  const captured = session.captures[0];
  const facultyCapture = consequences.bookings.find((b) => b.id === "B-2047")!;
  const facultySignal = consequences.bookings.find((b) => b.id === "B-2048")!;
  const go = (next: number) => {
    setIndex(next);
    // The stage heading is stable; announce progress and preserve the controls' focus.
  };
  return (
    <>
      <p className="ed-kicker">
        Fault walkthrough · practice sandbox
      </p>
      <h1>
        Follow one interruption.
        <br />
        <em>See each consequence.</em>
      </h1>
      <p className="pull">C1-CAM → KIT-C1-v1 → the work depending on it.</p>
      <p className="msg">
        This authored scenario commits the existing domain rules to an
        independent fixture state. Controls replay sandbox snapshots; your
        operational session, bookings, evidence and technician records remain
        unchanged. No real notification or device action is sent.
      </p>
      <div className="fault-story-layout">
        <nav
          className="fault-story-stages"
          data-open={stageListOpen}
          aria-label="Walkthrough stages"
        >
          <button
            className="pbtn stage-list-toggle"
            aria-expanded={stageListOpen}
            aria-controls="fault-stage-list"
            onClick={() => setStageListOpen(!stageListOpen)}
          >
            Choose a stage · {index + 1} of {frames.length}
          </button>
          <ol id="fault-stage-list">
            {frames.map((f, i) => (
              <li key={f.id}>
                <button
                  className="pbtn quiet"
                  aria-current={i === index ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {f.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <section
          className="fault-story-main"
          aria-labelledby="fault-stage-title"
        >
          <p className="ed-kicker">
            Stage {index + 1} / {frames.length}
          </p>
          <h2 id="fault-stage-title">{frame.title}</h2>
          <p>{frame.explanation}</p>
          <p>
            <strong>Who acts next:</strong> {frame.owner}. {frame.next}
          </p>
          <p role="status">
            Stage {index + 1}: {frame.title}.{" "}
            {frame.result.ok
              ? "Sandbox step recorded."
              : `Expected refusal: ${frame.result.message}`}
          </p>
          <div className="acts">
            <button
              className="pbtn"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              Previous stage
            </button>
            <button
              className="pbtn primary"
              disabled={index === frames.length - 1}
              onClick={() => go(index + 1)}
            >
              Next stage
            </button>
            <button
              className="pbtn quiet"
              disabled={index === 0}
              onClick={() => go(0)}
            >
              Restart walkthrough
            </button>
          </div>
          <div className="fault-resource-anchor">
            <div>
              <p className="ed-kicker">One named resource</p>
              <h3>C1-CAM</h3>
              <p>{consequences.camera.label}</p>
              <p className="small">
                {consequences.occupancy.label}. Availability and occupancy
                remain separate.
              </p>
              <p>
                {issue
                  ? `${issue.id} · ${issue.status}`
                  : "No issue record yet."}
              </p>
            </div>
            <StateContext.Provider
              value={{ state, result: null, sequence: index, command: null }}
            >
              <LabPlan contextLabel="Independent sandbox projection." />
            </StateContext.Provider>
          </div>
          <div className="consequence-ledger">
            <article>
              <p className="ed-kicker">Student / saved work</p>
              <h3>
                {session.interrupted
                  ? "Feed interrupted; evidence retained"
                  : "Session feed available in example"}
              </h3>
              <p>
                {captured.id} · {captured.label} · {session.captures.length}{" "}
                retained condition. The walkthrough never replaces this record.
              </p>
              <p className="small">
                Student next action:{" "}
                {session.interrupted
                  ? "Use the named report/recovery path; any prepared illustration remains labelled."
                  : "Continue the normal capture or handover task."}
              </p>
            </article>
            <article>
              <p className="ed-kicker">Complete kit / reservations</p>
              <h3>
                {consequences.captureKit.ok
                  ? "Capture kit available"
                  : "Capture kit has a blocker"}
              </h3>
              <p>
                {consequences.captureKit.blockers.join(" · ") ||
                  "No capture-kit availability blockers."}
              </p>
              <p>
                Signal kit:{" "}
                {consequences.signalKit.ok
                  ? "available independently"
                  : "has separate blockers"}
                .
              </p>
              <p className="small">
                Reservations are affected through their actual camera
                dependency; a light or unrelated station is not automatically
                restricted.
              </p>
            </article>
            <article>
              <p className="ed-kicker">Faculty / rotation plan</p>
              <h3>
                {facultyCapture.affected
                  ? "Capture rotation needs review"
                  : "Capture rotation has no camera blocker"}
              </h3>
              <p>
                B-2047 · C1 capture:{" "}
                {facultyCapture.affected ? "affected" : "not affected"}.<br />
                B-2048 · S1 sampling:{" "}
                {facultySignal.affected ? "affected" : "not affected"}.
              </p>
              <p className="small">
                Faculty next action: inspect the shortfall and publish a
                reviewed alternative if needed. This walkthrough creates no new
                timetable or automatic rebooking.
              </p>
            </article>
            <PublicConsequence state={state} />
          </div>
          <details>
            <summary>Read affected booking dependencies</summary>
            <div
              className="scroll"
              tabIndex={0}
              role="region"
              aria-label="Sandbox booking consequences"
            >
              <table className="led">
                <thead>
                  <tr>
                    <th scope="col">Booking</th>
                    <th scope="col">Example window</th>
                    <th scope="col">Consequence</th>
                  </tr>
                </thead>
                <tbody>
                  {consequences.bookings.map((b) => (
                    <tr key={b.id}>
                      <th scope="row">{b.id}</th>
                      <td>
                        {b.day} · {b.slot}
                      </td>
                      <td>
                        {b.affected
                          ? `Affected by ${b.by.join(", ")}`
                          : "No availability blocker"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <details>
            <summary>Read committed sandbox history and evidence</summary>
            <p className="small">
              Only this independent sandbox. The operational session still has{" "}
              {operational.log.length} activity records and{" "}
              {operational.sessions.E06.captures.length} E06 captures.
            </p>
            <ol>
              {issue?.history.map((h, i) => (
                <li key={i}>
                  {h.time} · {h.actor} · {h.text}
                </li>
              )) || <li>No issue history yet.</li>}
            </ol>
            <p>
              Retained evidence: {captured.id}, method{" "}
              {captured.context?.methodRevision}, geometry{" "}
              {captured.context?.geometryRevision}. This is an illustration; no
              hardware capture occurred.
            </p>
          </details>
        </section>
      </div>
      <div className="acts">
        <Link className="pbtn" to="/E06/prepare">
          Return to E06 preparation
        </Link>
        <Link className="pbtn" to="/dashboard">
          Operational dashboard
        </Link>
        <Link className="pbtn" to="/tech">
          Technician task and current records
        </Link>
      </div>
    </>
  );
}
