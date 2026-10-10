import { Link } from "react-router";
import geometry from "../../../../spatial/lab_geometry.json";
import { sustainabilityDecisions } from "../data/sustainability";
import { LabPlan } from "../components/LabPlan";

export function SustainabilitySheet() {
  const landmarks = [...geometry.zones, ...geometry.openings, ...geometry.furniture].map(l => ({ id: l.id, name: "name" in l ? l.name : `${l.type} · geometry P4-D` }));
  return <section className="smart-section" id="physical-sheet" aria-labelledby="physical-title" tabIndex={-1}>
    <p className="ed-kicker">Physical design sheet</p>
    <div className="smart-heading"><h2 id="physical-title">Design for a longer useful life.</h2><a className="pbtn" href="sustainability-sheet.html" target="_blank" rel="noreferrer">Open printable sheet ↗</a></div>
    <p>Five assignment requirements, specific decisions and an owner for each. This is a designer-reviewed proposal for the assumed 10 × 7 m room; site measurements, supplier claims and institutional approvals remain unverified.</p>
    <div className="sustainability-plan"><LabPlan /><div><h3>Physical anchors</h3><p>W1 · south operable window, x 4.4–6.2 m.<br />C1 · controlled capture, north-east.<br />COL · collaboration beside W1.<br />SPN · 1.5 m circulation spine.<br />CV-04 · accessible workstation approach.</p><Link to="/safety" state={{ from: "/environment" }}>Read safety landmarks and manual fallback →</Link></div></div>
    <div className="sustainability-schedule">{sustainabilityDecisions.map(decision => <article key={decision.id}>
      <div><p className="ed-kicker">{decision.id} · {decision.topic}</p><h3>{decision.title}</h3><p className="small">{decision.status}</p><p className="small">Owner: {decision.owner}</p></div>
      <div><p>{decision.specification}</p><p><strong>Trade-off.</strong> {decision.tradeoff}</p>
        <details><summary>Evidence and acceptance · {decision.id}</summary><p><strong>Required evidence.</strong> {decision.evidence}</p><p><strong>Acceptance.</strong> {decision.acceptance}</p><ul>{decision.geometry.map(id => <li key={id}><code>{id}</code> · {landmarks.find(l => l.id === id)?.name || id}</li>)}</ul>
          {decision.id === "SUS-04" && <Link to="/assets/CV-04">Inspect the workstation lifecycle record →</Link>}
        </details>
      </div>
    </article>)}</div>
    <div className="panel"><h3>Manual operation and fallback</h3><p>Window position, occupied-room conditions and asset operating instructions must be checked by staff. Missing, stale or invalid observations cannot authorise operation or clear equipment restrictions. Use approved posted procedures when the app or network is unavailable; the safety view is an orientation concept.</p><Link to="/tech">Equipment issue and technician recovery →</Link></div>
    <p className="small">Design context: <a href="https://www.hse.gov.uk/ventilation/using-co2-monitors.htm">S09 · HSE CO₂ guidance</a> treats monitoring as broad ventilation context, not proof of safe air. <a href="https://www.ucl.ac.uk/about/sustainability/campaigns-and-initiatives/leaf-laboratory-efficiency-assessment-framework">S10 · UCL LEAF</a> informs the resource-use approach. These sources do not certify this room or its products. Specifications and acceptance criteria above are PARALLAX design inferences.</p>
  </section>;
}
