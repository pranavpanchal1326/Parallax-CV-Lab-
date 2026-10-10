import { Link, useLocation } from "react-router";
import geometry from "../../../../spatial/lab_geometry.json";
import { LabPlan } from "../components/LabPlan";

export function Safety() {
  const location = useLocation();
  const from =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/")
      ? location.state.from
      : "/";
  return (
    <>
      <p className="ed-kicker">
        Safety orientation · geometry P4-D · concept only
      </p>
      <h1>
        Know the landmarks.
        <br />
        <em>Keep the routes clear.</em>
      </h1>
      <p className="msg warn">
        This assumed room and its safety positions are design examples, not an
        approved emergency plan. Actual procedures, equipment suitability and
        installation require institutional confirmation.
      </p>
      <div className="workspace-layout">
        <section className="workspace-primary">
          <LabPlan safety />
          <h2>Exit landmarks</h2>
          <p>
            D1 · west wall entry / D2 · east wall exit. Positions come from the
            canonical P4-D geometry.
          </p>
          <h2>Equipment landmarks</h2>
          <ul className="resource-index">
            {geometry.safety.map((s) => (
              <li key={s.id}>
                <code>{s.id}</code> · {s.label}
                <small>
                  Plan x {s.x} m · y {s.y} m
                </small>
              </li>
            ))}
          </ul>
        </section>
        <aside className="workspace-aside">
          <h2>Orientation and access</h2>
          <p>
            CV-04 has a dedicated approach floor; TC-1 marks a planned turning
            space. The circulation spine stays distinct from teaching furniture.
          </p>
          <p>
            Use posted local procedures in an actual lab. This application does
            not call responders, operate emergency power-off or certify an
            installation.
          </p>
          <Link className="pbtn" to={from}>
            Return to the previous task
          </Link>
          <h2>Related records</h2>
          <p><Link to="/studio">Art and physical-reference studio →</Link></p>
          <Link to="/environment">Environment and ventilation concepts →</Link>
          <p className="small">
            Sensor examples and energy previews cannot determine whether a room
            is safe.
          </p>
        </aside>
      </div>
    </>
  );
}
