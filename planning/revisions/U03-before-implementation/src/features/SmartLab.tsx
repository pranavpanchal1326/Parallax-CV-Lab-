import { useState } from 'react';
import { Link } from 'react-router';
import { useLab } from '../app/context';
import { useEnvironment } from '../app/environmentContext';
import { fixtures, experimentIds, experiments } from '../data/fixtures';
import { selectors } from '../domain/adapter';
import { clockLabel, exampleTime, metricNames, observationStatus, scenarioNames, scenarioObservations, type Observation, type Scenario } from '../domain/observations';
import { energyGroups, previewStandby } from '../domain/energy';
import { LabPlan } from '../components/LabPlan';
import { EquipmentList } from './StudentJourney';

export function ObservationPanel({ observations, evaluatedAt }: { observations: Observation[]; evaluatedAt: string }) {
  return <div className="observation-grid">{observations.map(o => {
    const status = observationStatus(o, evaluatedAt);
    return <article className="observation" key={o.metric}>
      <h3>{metricNames[o.metric]}</h3>
      <p className="observation-value">{o.value === null ? '—' : o.value}<span>{o.value === null ? 'No source' : o.unit}</span></p>
      <p className={`observation-state state-${status.state}`}>{status.label} · simulated</p>
      <p className="small">Observed {o.observedAt ? clockLabel(o.observedAt) : 'unavailable'} IST<br />Received {o.receivedAt ? clockLabel(o.receivedAt) : 'unavailable'} IST</p>
      {status.ageSeconds !== null && <p className="small">Age at review: {Math.round(status.ageSeconds)} seconds</p>}
      <details><summary>Source and quality</summary><p><code>{o.id}</code> · zone {o.zone}</p><p>{o.source} · quality: {o.quality}</p></details>
    </article>;
  })}</div>;
}

function ScenarioControl() {
  const { scenario, setScenario } = useEnvironment();
  return <div className="field"><label htmlFor="environment-example">Environment demonstration</label>
    <select id="environment-example" value={scenario} onChange={e => setScenario(e.target.value as Scenario)}>
      {(Object.keys(scenarioNames) as Scenario[]).map(s => <option key={s} value={s}>{scenarioNames[s]}</option>)}
    </select><p className="small">No hardware is connected. Changing this example affects new captures only. Selection resets on reload; captured observations remain in the session record.</p>
  </div>;
}

export function Dashboard() {
  const { state } = useLab();
  const { scenario } = useEnvironment();
  const at = exampleTime(state.minute);
  const restricted = fixtures.resources.filter(r => selectors.availability(state, r.id).state === 'restricted');
  const active = experimentIds.filter(exp => state.sessions[exp].started && !state.sessions[exp].closed);
  const pending = experimentIds.filter(exp => state.sessions[exp].ackPending && !state.sessions[exp].receipt);
  const interrupted = active.filter(exp => state.sessions[exp].interrupted);
  const notices = selectors.publicNotices(state);
  return <>
    <p className="ed-kicker">Operations overview · {fixtures.clock.today} · {clockLabel(at)} IST example clock</p>
    <div className="smart-heading"><h1>Smart Lab <em>Dashboard.</em></h1><Link className="pbtn" to="/environment">Environment & energy ↗</Link></div>
    <p className="pull">A room, its resources, and the work in progress.</p>
    <div className="smart-metrics" aria-label="Current example state">
      <article><span className="cap2">Equipment restrictions</span><strong>{restricted.length}</strong><p>Availability, independent of occupancy.</p></article>
      <article><span className="cap2">Active student sessions</span><strong>{active.length}</strong><p>Started sessions awaiting closure.</p></article>
      <article><span className="cap2">Pending acknowledgements</span><strong>{pending.length}</strong><p>Receipt required before completion.</p></article>
      <article><span className="cap2">Sensor connections</span><strong>0</strong><p>Demonstration readings only.</p></article>
    </div>
    <div className="smart-columns">
      <section className="panel"><h2>Needs attention</h2>
        {!notices.length && !pending.length && !interrupted.length && <p>No restriction, interrupted feed or pending receipt in this example. Environmental suitability has not been assessed.</p>}
        {notices.map(n => <div className="msg warn" key={n.asset}><p><strong>{n.asset}</strong> · {n.text}</p><Link to="/tech">Review equipment issue →</Link></div>)}
        {pending.map(exp => <div className="msg warn" key={exp}><p>{exp} · submission acknowledgement pending.</p><Link to={`/${exp}/submit`}>Return to submission →</Link></div>)}
        {interrupted.map(exp => <div className="msg warn" key={exp}><p>{exp} · example feed interrupted. Recorded evidence is retained.</p><Link to={`/${exp}/bench`}>Review recovery at the bench →</Link></div>)}
        <h3>Sessions in progress</h3>
        {!active.length && <p>No started student session.</p>}
        {active.map(exp => <p key={exp}><Link to={`/${exp}/bench`}>{exp} · {experiments[exp].title}</Link><br /><span className="small">{state.sessions[exp].station} · {state.sessions[exp].captures.length} evidence records · {state.sessions[exp].interrupted ? 'feed interrupted' : 'session open'}</span></p>)}
        <Link className="pbtn" to="/">Open student journey →</Link>
      </section>
      <section className="panel"><h2>The room in context</h2><LabPlan />
        <p className="small">Geometry P4-D · assumed 10 × 7 m envelope. Resource markers use this local session. This is a spatial status projection; room surveying and live sensing remain open.</p>
        <details><summary>Read the equipment list</summary><EquipmentList /></details>
      </section>
    </div>
    <section className="smart-section"><div className="smart-heading"><h2>Environment observations</h2><Link to="/environment">Inspect source & assumptions →</Link></div>
      <ObservationPanel observations={scenarioObservations(scenario, at)} evaluatedAt={at} />
      <p className="small">Freshness uses a five-minute demonstration policy. These readings do not certify room safety or control ventilation.</p>
    </section>
    <section className="smart-section sustainability-teaser"><p className="ed-kicker">Designing for a longer life</p><h2>Less idle power.<br /><em>More useful equipment.</em></h2><p>Review booking-aware standby proposals, daylight, ventilation and repairable materials together.</p><Link className="pbtn" to="/environment">Explore the sustainability ledger →</Link></section>
  </>;
}

export function Environment() {
  const { state } = useLab();
  const { scenario } = useEnvironment();
  const [minutes, setMinutes] = useState(15);
  const at = exampleTime(state.minute);
  return <>
    <p className="ed-kicker">Environment & sustainability · concept demonstrator</p>
    <h1>Understand the room.<br /><em>Before changing it.</em></h1>
    <p className="pull">Every observation has a source. Every energy proposal has a boundary.</p>
    <section className="panel"><h2>Observation desk</h2><ScenarioControl /><ObservationPanel observations={scenarioObservations(scenario, at)} evaluatedAt={at} />
      <p className="small">Example clock: {clockLabel(at)} IST on 1 October 2026. Scenario timestamps are regenerated at review; this is not a historical sensor feed. A capture retains the selected records. Five-minute freshness is an example policy; room thresholds require institution approval and calibrated sensors.</p></section>
    <section className="smart-section"><h2>Booking-aware standby preview</h2><p>Calculate an illustrative upper bound on avoided energy. There is no meter, power switch or automatic action connected.</p>
      <div className="field"><label htmlFor="standby-duration">Preview interval</label><select id="standby-duration" value={minutes} onChange={e => setMinutes(Number(e.target.value))}><option value={15}>Next 15 minutes</option><option value={30}>Next 30 minutes</option><option value={60}>Next 60 minutes</option></select></div>
      <div className="energy-grid">{energyGroups.map(group => {
        const preview = previewStandby(state, group, minutes);
        return <article className="panel" key={group.id}><h3>{group.label}</h3>
          <p className="observation-state">{preview.eligible ? 'Available for human review' : 'Protected from proposal'}</p>
          {preview.maxAvoidedKWh !== null && <p className="energy-number">≤ {preview.maxAvoidedKWh.toFixed(3)} <span>kWh modelled</span></p>}
          <p className="small">{group.basis}</p>
          {!!preview.reasons.length && <ul>{preview.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>}
          {preview.eligible && <p>Nominal watts × {minutes}/60 hours ÷ 1,000. Assumes the entire nominal load could be avoided; standby consumption and real load are unknown.</p>}
        </article>;
      })}</div>
      <p className="small">Preview protects restrictions, active sessions and overlapping example bookings. A conservative 60-minute slot is assumed for energy previews. Essential services are always excluded. A real installation needs surveyed circuits, measured loads, role-controlled approval and a physical safety design.</p>
    </section>
    <section className="smart-section"><h2>Sustainability design ledger</h2><p>These decisions extend the existing spatial concept. Evidence status is shown for each decision.</p>
      <div className="sustainability-grid">
        <article><span className="ed-kicker">01 · Lighting</span><h3>Daylight before additional load</h3><p>Use the south operable window in geometry P4-D; investigate glare, lighting uniformity and the capture bench’s controlled conditions before zoning dimmable task lighting.</p><p className="small">Concept · daylight and illuminance survey required.</p></article>
        <article><span className="ed-kicker">02 · Natural ventilation</span><h3>A visible ventilation decision</h3><p>Show CO₂ provenance alongside window status and a facilities escalation path. Natural ventilation suitability depends on outdoor air, room use and specialist review.</p><p className="small">Concept · no window actuator or air-quality approval.</p></article>
        <article><span className="ed-kicker">03 · Smart power</span><h3>Protect work before standby</h3><p>The preview above checks resource state and booking overlap. Metering should establish a baseline before savings are claimed.</p><p className="small">Working simulation · zero measured savings.</p></article>
        <article><span className="ed-kicker">04 · Recyclable furniture</span><h3>Repair and disassemble</h3><p>Specify modular worktops, replaceable panels and mechanically joined frames. Record material composition, supplier take-back and maintenance instructions per item.</p><p className="small">Specification proposal · supplier verification required.</p></article>
        <article><span className="ed-kicker">05 · Green materials</span><h3>Procure with evidence</h3><p>Compare durable low-emission finishes, recycled-content claims and end-of-life routes. Require product evidence and cleanability checks against actual lab use.</p><p className="small">Specification proposal · no purchased or certified materials.</p></article>
      </div>
    </section>
    <Link className="pbtn" to="/dashboard">← Smart Lab Dashboard</Link>
  </>;
}
