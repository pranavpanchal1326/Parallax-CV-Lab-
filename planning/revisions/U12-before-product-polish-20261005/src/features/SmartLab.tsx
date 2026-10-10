import { Link } from "react-router";
import { useLab } from "../app/context";
import { useEnvironment } from "../app/environmentContext";
import { fixtures, experimentIds, experiments } from "../data/fixtures";
import { selectors } from "../domain/adapter";
import {
  clockLabel,
  exampleTime,
  metricNames,
  observationStatus,
  scenarioNames,
  type Observation,
  type Scenario,
} from "../domain/observations";
import { EnergyPeriodDesk, StandbyDesk } from "./EnergyDesk";
import { SustainabilitySheet } from "./Sustainability";
import { exampleEnergyPeriod, summarizeEnergy } from "../domain/energyPeriod";
import { LabPlan } from "../components/LabPlan";
import { EquipmentList } from "./StudentJourney";

export function ObservationPanel({
  observations,
  evaluatedAt,
}: {
  observations: Observation[];
  evaluatedAt: string;
}) {
  return (
    <div className="observation-grid">
      {observations.map((o) => {
        const status = observationStatus(o, evaluatedAt);
        return (
          <article className="observation" key={o.metric}>
            <h3>{metricNames[o.metric]}</h3>
            <p className="observation-value">
              {o.value === null ? "—" : o.value}
              <span>{o.value === null ? "Reading unavailable" : o.unit}</span>
            </p>
            <p className={`observation-state state-${status.state}`}>
              {status.label} · simulated
            </p>
            <p className="small">{o.connection === "disconnected" ? "Source disconnected" : o.connection === "connected-example" ? "Source connected in example only" : "Connection not recorded"}</p>
            <p className="small">{o.connection === "disconnected" ? "Check the source with the technician; retained values cannot establish current conditions." : status.state === "fresh" ? "Recent context only; equipment restrictions and manual checks still apply." : "Use the approved manual checks and request a source review; suitability is unknown."}</p>
            <p className="small">
              Observed {o.observedAt ? clockLabel(o.observedAt, true) : "unavailable"}{" "}
              IST
              <br />
              Received {o.receivedAt
                ? clockLabel(o.receivedAt, true)
                : "unavailable"}{" "}
              IST
            </p>
            {status.ageSeconds !== null && (
              <p className="small">
                Age at review: {Math.round(status.ageSeconds)} seconds
              </p>
            )}
            <details>
              <summary>Source and quality</summary>
              <p>
                <code>{o.id}</code> · zone {o.zone}
              </p>
              <p>
                {o.source} · quality: {o.quality}
              </p>
              <p className="small">Example position: C1 capture zone. No physical sensor, calibration record or approved suitability threshold. Temperature and CO₂ provide context; illuminance may matter to the capture method.</p>
            </details>
          </article>
        );
      })}
    </div>
  );
}

function ScenarioControl() {
  const { scenario, setScenario, refresh } = useEnvironment();
  return (
    <div className="field">
      <label htmlFor="environment-example">Environment demonstration</label>
      <select
        id="environment-example"
        value={scenario}
        onChange={(e) => setScenario(e.target.value as Scenario)}
      >
        {(Object.keys(scenarioNames) as Scenario[]).map((s) => (
          <option key={s} value={s}>
            {scenarioNames[s]}
          </option>
        ))}
      </select>
      <p className="small">
        No hardware is connected. Selection resets on reload; existing captures retain their original source records.
      </p>
      <button className="pbtn" onClick={refresh}>Recover with a recent example</button>
      <p role="status" className="small">Selected: {scenarioNames[scenario]}. Dashboard and new captures use these same records.</p>
    </div>
  );
}

export function Dashboard() {
  const { state } = useLab();
  const { observations } = useEnvironment();
  const at = exampleTime(state.minute);
  const restricted = fixtures.resources.filter(
    (r) => selectors.availability(state, r.id).state === "restricted",
  );
  const active = experimentIds.filter(
    (exp) => state.sessions[exp].started && !state.sessions[exp].closed,
  );
  const pending = experimentIds.filter(
    (exp) => state.sessions[exp].ackPending && !state.sessions[exp].receipt,
  );
  const interrupted = active.filter((exp) => state.sessions[exp].interrupted);
  const notices = selectors.publicNotices(state);
  const contextUnavailable = observations.some(o => o.connection === "disconnected" || observationStatus(o, at).state !== "fresh");
  const lightingEnergy = summarizeEnergy(exampleEnergyPeriod("lighting", 60, true), exampleTime(600), exampleTime(660));
  const upcoming = state.bookings.filter(b => b.day === fixtures.clock.today.replace(/ \d{4}$/, "") && b.status !== "Closed" && /^\d{2}:\d{2}/.test(b.slot) && Number(b.slot.slice(0, 2)) * 60 + Number(b.slot.slice(3, 5)) >= state.minute).sort((a, b) => a.slot.localeCompare(b.slot));
  return (
    <>
      <p className="ed-kicker">
        Operations overview
      </p>
      <div className="smart-heading">
        <h1>
          Smart Lab <em>Dashboard.</em>
        </h1>
        <Link className="pbtn" to="/environment">
          Environment & energy ↗
        </Link>
      </div>
      <p className="pull">A room, its resources, and the work in progress.</p>
      <div className="smart-metrics" role="region" aria-label="Current example state">
        <article>
          <span className="cap2">Equipment restrictions</span>
          <strong>{restricted.length}</strong>
          <p>Availability, independent of occupancy.</p>
        </article>
        <article>
          <span className="cap2">Active student sessions</span>
          <strong>{active.length}</strong>
          <p>Started sessions awaiting closure.</p>
        </article>
        <article>
          <span className="cap2">Pending acknowledgements</span>
          <strong>{pending.length}</strong>
          <p>Receipt required before completion.</p>
        </article>
        <article>
          <span className="cap2">Sensor connections</span>
          <strong>0</strong>
          <p>Demonstration readings only.</p>
        </article>
      </div>
      <div className="smart-columns">
        <section className="panel">
          <h2>Needs attention</h2>
          {contextUnavailable && <div className="msg warn"><p>Environmental context is unavailable or unreliable. Equipment availability does not establish suitable room conditions.</p><Link to="/environment">Review source status and manual fallback →</Link></div>}
          {!notices.length && !pending.length && !interrupted.length && !contextUnavailable && (
            <p>
              No restriction, interrupted feed or pending receipt in this
              example. Environmental suitability has not been assessed.
            </p>
          )}
          {notices.map((n) => (
            <div className="msg warn" key={n.asset}>
              <p>
                <strong>{n.asset}</strong> · {n.text}
              </p>
              <Link to="/tech">Review equipment issue →</Link>
            </div>
          ))}
          {pending.map((exp) => (
            <div className="msg warn" key={exp}>
              <p>{exp} · submission acknowledgement pending.</p>
              <Link to={`/${exp}/submit`}>Return to submission →</Link>
            </div>
          ))}
          {interrupted.map((exp) => (
            <div className="msg warn" key={exp}>
              <p>
                {exp} · example feed interrupted. Recorded evidence is retained.
              </p>
              <Link to={`/${exp}/bench`}>Review recovery at the bench →</Link>
            </div>
          ))}
          <h3>Sessions in progress</h3>
          {!active.length && <p>No started student session.</p>}
          {active.map((exp) => (
            <p key={exp}>
              <Link to={`/${exp}/bench`}>
                {exp} · {experiments[exp].title}
              </Link>
              <br />
              <span className="small">
                {state.sessions[exp].station} ·{" "}
                {state.sessions[exp].captures.length} evidence records ·{" "}
                {state.sessions[exp].interrupted
                  ? "feed interrupted"
                  : "session open"}
              </span>
            </p>
          ))}
          <h3>Upcoming reservations</h3>
          {!upcoming.length && <p>No upcoming reservation in this example day.</p>}
          {upcoming.map(b => <p key={b.id}><Link to="/bookings">{b.slot} IST · {b.id}</Link><br /><span className="small">{b.resources.join(" · ")} · {b.status}. Reservation-derived, not a sensor headcount.</span></p>)}
          <Link className="pbtn" to="/">
            Open student journey →
          </Link>
        </section>
        <section className="panel">
          <h2>The room in context</h2>
          <LabPlan />
          <p className="small">
            Geometry P4-D · assumed 10 × 7 m envelope. Resource markers use this
            local session. This is a spatial status projection; room surveying
            and live sensing remain open.
          </p>
          <details>
            <summary>Read the equipment list</summary>
            <EquipmentList />
          </details>
        </section>
      </div>
      <section className="smart-section">
        <div className="smart-heading">
          <h2>Environment observations</h2>
          <Link to="/environment">Inspect source & assumptions →</Link>
        </div>
        <ObservationPanel
          observations={observations}
          evaluatedAt={at}
        />
        <p className="small">
          Freshness uses a five-minute demonstration policy. These readings do
          not certify room safety or control ventilation.
        </p>
      </section>
      <section className="smart-section panel">
        <div className="smart-heading"><h2>Energy context · capture lighting</h2><Link to="/environment">Inspect periods and standby consequences →</Link></div>
        <p className="energy-number">{lightingEnergy.knownKWh?.toFixed(3)} <span>kWh in known simulated intervals · {lightingEnergy.coveredMinutes}/60 minutes covered</span></p>
        <p className="small">Fixed 10:00–11:00 example period. Period total unknown because of a gap. Essential services have no power source and are excluded from standby; measured savings are unknown.</p>
      </section>
      <section className="smart-section sustainability-teaser">
        <p className="ed-kicker">Designing for a longer life</p>
        <h2>
          Less idle power.
          <br />
          <em>More useful equipment.</em>
        </h2>
        <p>
          Review booking-aware standby proposals, daylight, ventilation and
          repairable materials together.
        </p>
        <Link className="pbtn" to="/environment">
          Explore the sustainability ledger →
        </Link>
      </section>
    </>
  );
}

export function Environment() {
  const { state } = useLab();
  const { observations } = useEnvironment();
  const at = exampleTime(state.minute);
  return <>
    <p className="ed-kicker">Environment & sustainability</p>
    <h1>Understand the room.<br /><em>Before changing it.</em></h1>
    <p className="pull">Every observation has a source. Every energy proposal has a boundary.</p>
    <nav className="smart-controls" aria-label="Environment sections">{[["observation-desk", "Observations"], ["energy-period-title", "Energy period"], ["standby-title", "Standby review"], ["physical-sheet", "Physical design sheet"]].map(([id, label]) => <button className="pbtn quiet" key={id} onClick={() => { const target = document.getElementById(id); target?.scrollIntoView({ block: "start", behavior: "instant" }); target?.focus({ preventScroll: true }); }}>{label}</button>)}</nav>
    <section className="panel" id="observation-desk" tabIndex={-1}>
      <h2>Observation desk</h2><ScenarioControl />
      <ObservationPanel observations={observations} evaluatedAt={at} />
      <p className="small">Review clock: {clockLabel(at)}. Source records stay fixed until a new example is selected or recovered. Normal local lab actions advance the example clock, so retained records can age. Five-minute freshness is a demonstration policy; hardware and approved room thresholds are absent.</p>
      <Link to="/safety" state={{ from: "/environment" }}>Manual safety and ventilation fallback →</Link>
    </section>
    <EnergyPeriodDesk /><StandbyDesk /><SustainabilitySheet />
    <Link className="pbtn" to="/dashboard">← Smart Lab Dashboard</Link>
  </>;
}
