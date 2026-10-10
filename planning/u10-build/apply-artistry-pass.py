"""Source edits for the artistry pass: dashboard interval chart, smart-features overview,
signal-rule motif asset. Idempotent."""
import math
from pathlib import Path

web = Path(__file__).resolve().parents[2] / 'apps/lab-web'


def edit(rel, marker, old, new):
    p = web / rel
    s = p.read_bytes().decode('utf-8')
    if marker in s:
        return
    assert s.count(old) == 1, (rel, old[:70], s.count(old))
    p.write_bytes(s.replace(old, new).encode('utf-8'))


# --- signal rule: one period of the 2 Hz reference with eight samples; tiles horizontally ---
W, H, N = 240, 28, 8
pts = ' '.join(f'{x:.1f},{H / 2 - 9 * math.sin(2 * math.pi * x / W):.2f}' for x in [i * 4 for i in range(W // 4 + 1)])
dots = ''.join(f'<circle cx="{(k + .5) * W / N:.1f}" cy="{H / 2 - 9 * math.sin(2 * math.pi * (k + .5) / N):.2f}" r="2.1"/>' for k in range(N))
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       f'<polyline points="{pts}" fill="none" stroke="#8a8f98" stroke-width="0.9" opacity="0.7"/>'
       f'<g fill="#5f70e6">{dots}</g></svg>')
assets = web / 'src/assets'
assets.mkdir(exist_ok=True)
(assets / 'signal-rule.svg').write_text(svg, encoding='utf-8', newline='\n')

# --- dashboard components ---
edit('src/features/SmartLab.tsx', 'function IntervalChart',
     'export function Dashboard() {',
     '''function IntervalChart({ intervals }: { intervals: PowerInterval[] }) {
  const max = Math.max(...intervals.map((i) => i.watts ?? 0), 1);
  const slot = 96, base = 78, top = 10;
  return (
    <svg
      className="interval-chart"
      viewBox={`0 0 ${slot * intervals.length} 104`}
      role="img"
      aria-label={`Average power in ${intervals.length} example intervals: ${intervals.map((i) => `${clockLabel(i.start, true)} ${i.watts === null ? "missing" : `${i.watts} watts`}`).join(", ")}.`}
    >
      <line x1="0" x2={slot * intervals.length} y1={base} y2={base} className="interval-axis" />
      {intervals.map((interval, index) => {
        const height = interval.watts === null ? base - top : ((interval.watts / max) * (base - top));
        return (
          <g key={interval.start} transform={`translate(${index * slot + 8} 0)`}>
            <rect
              className={interval.watts === null ? "interval-gap" : "interval-bar"}
              x="0"
              y={base - height}
              width={slot - 16}
              height={height}
            />
            <text className="interval-value" x={(slot - 16) / 2} y={base - height - 5} textAnchor="middle">
              {interval.watts === null ? "gap" : `${interval.watts} W`}
            </text>
            <text className="interval-time" x={(slot - 16) / 2} y={base + 16} textAnchor="middle">
              {clockLabel(interval.start)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const smartFeatures: { name: string; status: "Working" | "Simulated" | "Partly" | "Concept"; text: string; to?: string }[] = [
  { name: "Digital experiment manual", status: "Working", text: "The question, the kit and a safety check before every session.", to: "/E01/prepare" },
  { name: "Equipment lookup by label", status: "Working", text: "Type the printed ID to open the record. Camera scanning is a concept.", to: "/mobile" },
  { name: "AI assistant", status: "Working", text: "A local model answers from reviewed guides and shows its source.", to: "/assistant" },
  { name: "Digital twin", status: "Working", text: "One geometry drives the live plan and the optional 3D model.", to: "/map" },
  { name: "Equipment health", status: "Working", text: "A fault restricts the asset everywhere until a recorded verification.", to: "/tech" },
  { name: "IoT sensors", status: "Simulated", text: "Example readings with their source and age. No hardware is connected.", to: "/environment" },
  { name: "Smart energy monitoring", status: "Simulated", text: "Interval energy and a booking-aware standby preview.", to: "/environment" },
  { name: "AR / VR learning", status: "Partly", text: "A 3D scene rehearsal runs in the browser. Headset AR is a concept.", to: "/scene/rehearsal" },
  { name: "Voice assistant", status: "Concept", text: "Proposed for hands-busy bench work. Not built in this prototype." },
];

function SmartFeatures() {
  return (
    <section className="smart-section" aria-labelledby="smart-features-title">
      <div className="smart-heading">
        <h2 id="smart-features-title">Smart features, and how real each one is</h2>
      </div>
      <ul className="feature-grid">
        {smartFeatures.map((feature) => (
          <li key={feature.name}>
            <span className={`tag ${feature.status === "Working" ? "ok" : feature.status === "Concept" ? "warn" : "info"}`}>
              {feature.status}
            </span>
            <h3>{feature.to ? <Link to={feature.to}>{feature.name}</Link> : feature.name}</h3>
            <p>{feature.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Dashboard() {''')
edit('src/features/SmartLab.tsx', '<IntervalChart',
     '''<span>kWh in known simulated intervals · {lightingEnergy.coveredMinutes}/60 minutes covered</span></p>''',
     '''<span>kWh in known simulated intervals · {lightingEnergy.coveredMinutes}/60 minutes covered</span></p>
        <IntervalChart intervals={exampleEnergyPeriod("lighting", 60, true)} />''')
edit('src/features/SmartLab.tsx', '<SmartFeatures />',
     '      <section className="smart-section sustainability-teaser">',
     '      <SmartFeatures />\n      <section className="smart-section sustainability-teaser">')
edit('src/features/SmartLab.tsx', 'type PowerInterval',
     'import { exampleEnergyPeriod, summarizeEnergy } from "../domain/energyPeriod";',
     'import { exampleEnergyPeriod, summarizeEnergy, type PowerInterval } from "../domain/energyPeriod";')
print('artistry pass applied')
