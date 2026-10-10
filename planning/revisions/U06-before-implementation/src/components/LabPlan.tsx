import geometry from "../../../../spatial/lab_geometry.json";
import { useLab } from "../app/context";
import { selectors } from "../domain/adapter";
import { fixtures } from "../data/fixtures";

export function LabPlan({
  safety = false,
  contextLabel = "React session state.",
}: {
  safety?: boolean;
  contextLabel?: string;
}) {
  const { state } = useLab();
  const { width, depth } = geometry.meta.room;
  return (
    <figure className="lab-plan">
      <svg
        viewBox={`-.2 -.2 ${width + 0.4} ${depth + 0.4}`}
        role="img"
        aria-label={
          safety
            ? "Conceptual safety landmarks from geometry P4-D. Every landmark is listed below as text. Not an approved emergency plan."
            : "Conceptual 10 by 7 metre floor plan from geometry revision P4-D. Equipment availability is listed below as text."
        }
      >
        {geometry.zones.map((z) => (
          <g key={z.id}>
            <rect className="pz" x={z.x} y={z.y} width={z.w} height={z.d} />
            <text
              className="pzl"
              x={z.x + 0.1}
              y={z.y + (["CMP", "STO"].includes(z.id) ? z.d - 0.13 : 0.28)}
            >
              {z.id}
            </text>
          </g>
        ))}
        {geometry.furniture.map((f) => {
          const known = fixtures.resources.some((r) => r.id === f.id);
          const status = known
            ? selectors.availability(state, f.id).state
            : null;
          const inUse =
            known &&
            selectors.occupancy(state, fixtures, f.id).state === "in-use";
          const x = f.x + f.w - 0.2,
            y = f.y + f.d / 2;
          return (
            <g key={f.id}>
              <rect className="pf" x={f.x} y={f.y} width={f.w} height={f.d} />
              {f.w > 1 && known && (
                <text className="pl" x={f.x + 0.08} y={y + 0.05}>
                  {f.id}
                </text>
              )}
              {status === "restricted" ? (
                <path
                  className="plan-restricted"
                  d={`M${x} ${y - 0.1}l.1 .2h-.2Z`}
                />
              ) : status === "unknown" ? (
                <circle className="plan-unknown" cx={x} cy={y} r=".09" />
              ) : (
                known && (
                  <circle
                    className={inUse ? "plan-use" : "plan-free"}
                    cx={x}
                    cy={y}
                    r=".09"
                  />
                )
              )}
            </g>
          );
        })}
        <rect className="wall" width={width} height={depth} />
        {safety &&
          geometry.safety.map((s) => (
            <g key={s.id}>
              <circle className="safety-point" cx={s.x} cy={s.y} r=".1" />
              <text
                className="safety-label"
                x={s.x < 5 ? s.x + 0.15 : s.x - 0.8}
                y={s.y - 0.08}
              >
                {s.id}
              </text>
            </g>
          ))}
        {geometry.openings
          .filter((o) => o.type === "door")
          .map((o, i) => (
            <line
              className="door"
              key={i}
              x1={o.wall === "W" ? 0 : width}
              x2={o.wall === "W" ? 0 : width}
              y1={o.from}
              y2={o.to}
            />
          ))}
      </svg>
      <figcaption>
        Geometry P4-D · assumed envelope, not a surveyed room. {contextLabel}
      </figcaption>
    </figure>
  );
}
