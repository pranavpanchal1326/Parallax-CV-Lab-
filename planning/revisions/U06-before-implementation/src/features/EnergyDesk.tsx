import { useState } from "react";
import { useLab } from "../app/context";
import { energyGroups, previewStandby } from "../domain/energy";
import { exampleEnergyPeriod, summarizeEnergy } from "../domain/energyPeriod";
import { clockLabel, exampleTime } from "../domain/observations";

export function EnergyPeriodDesk() {
  const [minutes, setMinutes] = useState(60);
  const [gaps, setGaps] = useState(true);
  const start = exampleTime(600), end = exampleTime(600 + minutes);
  return <section className="smart-section" aria-labelledby="energy-period-title">
    <h2 id="energy-period-title" tabIndex={-1}>Power and energy are different records</h2>
    <p>Authored interval averages for 1 October 2026, {clockLabel(start)}–{clockLabel(end)} IST. These are simulated loads, not a connected meter or measured savings.</p>
    <div className="smart-controls">
      <div className="field"><label htmlFor="energy-period">Example period</label>
        <select id="energy-period" value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
          <option value={30}>10:00–10:30 IST · 30 minutes</option><option value={60}>10:00–11:00 IST · 60 minutes</option>
        </select>
      </div>
      <div className="field"><label htmlFor="energy-coverage">Example data coverage</label>
        <select id="energy-coverage" value={gaps ? "gaps" : "complete"} onChange={e => setGaps(e.target.value === "gaps")}>
          <option value="gaps">One missing interval</option><option value="complete">All modelled intervals available</option>
        </select>
      </div>
    </div>
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Energy by equipment group">
      <table className="smart-table"><caption>Simulated source SIM-POWER-v1 · known intervals only</caption>
        <thead><tr><th scope="col">Group / mapped resources</th><th scope="col">Latest interval average</th><th scope="col">Energy in known intervals</th><th scope="col">Coverage</th></tr></thead>
        <tbody>{energyGroups.map(group => {
          const intervals = exampleEnergyPeriod(group.id, minutes, gaps), result = summarizeEnergy(intervals, start, end);
          return <tr key={group.id}><th scope="row">{group.label}<small>{group.resources.join(" · ") || "Circuit map unavailable"}</small></th>
            <td>{intervals[3].watts === null ? "Unknown W" : `${intervals[3].watts} W`}<small>{clockLabel(intervals[3].start, true)}–{clockLabel(end, true)} IST</small></td>
            <td>{result.knownKWh === null ? "Unknown kWh" : `${result.knownKWh.toFixed(4)} kWh`}<small>{result.complete ? "Complete modelled period" : "Period total unknown"}</small></td>
            <td>{result.coveredMinutes} / {result.periodMinutes} minutes<small>{group.protected ? "Protected; no source" : result.complete ? "Simulated" : "Gap retained"}</small></td></tr>;
        })}</tbody>
      </table>
    </div>
    <details><summary>Inspect interval sources and calculation</summary>
      <p>Sum average watts × interval hours ÷ 1,000 for valid known intervals. Missing or invalid intervals contribute no known energy; they are not assumed to consume zero. No interpolation, whole-period extrapolation or savings comparison is made.</p>
      {energyGroups.filter(g => !g.protected).map(g => <div key={g.id}><h3>{g.label}</h3><p className="small">{g.basis}</p><ul>{exampleEnergyPeriod(g.id, minutes, gaps).map(i => <li key={i.start}>{clockLabel(i.start, true)}–{clockLabel(i.end, true)} IST · {i.watts === null ? "Missing" : `${i.watts} W average · simulated`} · {i.quality}</li>)}</ul></div>)}
    </details>
  </section>;
}

const checks = [
  "I checked for ongoing acquisition and dependencies outside the booking records.",
  "Work is saved and the asset-specific standby / warm-up instructions have been reviewed.",
  "The proposed group excludes essential services and unverified circuits.",
];

function StandbyReview({ groupId, minutes }: { groupId: string; minutes: number }) {
  const { state } = useLab();
  const group = energyGroups.find(g => g.id === groupId)!;
  const preview = previewStandby(state, group, minutes);
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [confirmed, setConfirmed] = useState(false);
  return <div className="panel standby-review">
    <h3>Human review · {group.label}</h3>
    <p>Next {minutes} minutes from {clockLabel(exampleTime(state.minute))} IST on 1 October 2026. This is a local rehearsal; checking these items does not establish real safety approval.</p>
    <fieldset><legend>Checks outside the automatic preview</legend>{checks.map((label, index) => <label className="review-check" key={label}><input type="checkbox" checked={checked[index]} onChange={e => { setChecked(current => current.map((v, i) => i === index ? e.target.checked : v)); setConfirmed(false); }} />{label}</label>)}</fieldset>
    <button className="pbtn primary" disabled={!preview.eligible || !checked.every(Boolean) || confirmed} onClick={() => setConfirmed(true)}>Confirm standby simulation</button>
    <p className="small">All three checks are required. A changed lab record, group or interval clears this review.</p>
    <p role="status">{confirmed ? `Simulation confirmed for ${group.label}. No device command was sent; no savings were measured. This review is not saved on reload.` : "Awaiting human review. No device command has been sent."}</p>
  </div>;
}

export function StandbyDesk() {
  const { state } = useLab();
  const [minutes, setMinutes] = useState(15);
  const [selected, setSelected] = useState<string | null>(null);
  return <section className="smart-section" aria-labelledby="standby-title">
    <h2 id="standby-title" tabIndex={-1}>Booking-aware standby preview</h2>
    <p>Calculate an illustrative upper bound on avoided energy, then review dependencies. No meter, switch or automatic action is connected.</p>
    <div className="field"><label htmlFor="standby-duration">Preview interval</label><select id="standby-duration" value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
      {[15, 30, 60].map(m => <option key={m} value={m}>Next {m} minutes</option>)}
    </select></div>
    <div className="energy-grid">{energyGroups.map(group => {
      const preview = previewStandby(state, group, minutes);
      return <article className="panel" key={group.id}><h3>{group.label}</h3><p className="observation-state">{preview.eligible ? "Available for human review" : "Protected from proposal"}</p>
        {preview.maxAvoidedKWh !== null && <p className="energy-number">≤ {preview.maxAvoidedKWh.toFixed(3)} <span>kWh modelled upper bound</span></p>}
        <p className="small">{group.basis}</p>
        {preview.reasons.length > 0 && <ul>{preview.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>}
        {preview.eligible && <><p className="small">Nominal watts × {minutes}/60 hours ÷ 1,000. Assumes the entire load is avoided; real load and standby consumption are unknown.</p><button className="pbtn" aria-pressed={selected === group.id} onClick={() => setSelected(selected === group.id ? null : group.id)}>{selected === group.id ? "Close review" : `Review ${group.label.toLowerCase()}`}</button></>}
      </article>;
    })}</div>
    {selected && previewStandby(state, energyGroups.find(g => g.id === selected)!, minutes).eligible && <StandbyReview key={`${selected}:${minutes}:${JSON.stringify(state)}`} groupId={selected} minutes={minutes} />}
    {selected && !previewStandby(state, energyGroups.find(g => g.id === selected)!, minutes).eligible && <p className="msg warn" role="status">The selected group is now protected. Its previous review is cleared; inspect the reasons above.</p>}
    <p className="small">Restrictions, active sessions and overlapping example reservations are excluded; energy previews conservatively protect 60-minute booking windows. Essential services are always excluded. A physical installation needs surveyed circuits, measured loads and approved asset-specific operating rules.</p>
  </section>;
}
