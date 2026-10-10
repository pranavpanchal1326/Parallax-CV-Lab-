import type { ExperimentId } from "../domain/types";
import { experiments } from "../data/fixtures";
import type { SignalReference } from "../domain/conditions";

export function VisionArt({ side = true }: { side?: boolean }) {
  const faces = side
    ? ["#9BA4B4", "#4A5261", "#7B8494", "#3D4553", "#565E6C"]
    : ["#C9D0DC", "#B4BCCB", "#C2C9D6", "#AEB6C4", "#B9C1CE"];
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={`Prepared illustration: ${side ? "side light, long shadows to the right" : "frontal light, short shadows"}. Annotation boxes are illustrative.`}
    >
      <rect width="320" height="180" fill="#151922" />
      <rect y="142" width="320" height="38" fill="#202936" />
      {side ? (
        <g fill="#05070A">
          <path d="M118 142L196 142L172 128L118 128Z" />
          <path d="M190 142L276 142L250 130L190 130Z" />
          <path d="M262 142L318 142L300 134L262 134Z" />
        </g>
      ) : (
        <g fill="#05070A">
          <ellipse cx="88" cy="143" rx="34" ry="4" />
          <ellipse cx="168" cy="143" rx="24" ry="4" />
          <ellipse cx="244" cy="143" rx="22" ry="4" />
        </g>
      )}
      <rect x="58" y="92" width="52" height="50" fill={faces[0]} />
      <rect x="110" y="92" width="10" height="50" fill={faces[1]} />
      <rect x="148" y="78" width="40" height="64" fill={faces[2]} />
      <rect x="174" y="78" width={side ? 14 : 0} height="64" fill={faces[3]} />
      <ellipse
        cx="168"
        cy="78"
        rx="20"
        ry="6"
        fill={side ? "#B4BCCB" : "#DDE2EB"}
      />
      <path d="M224 142L244 100L264 142Z" fill={faces[4]} />
      <g fill="none" stroke="#6EE7C5" strokeWidth="1.2" strokeDasharray="4 3">
        <rect x="54" y="88" width="70" height="58" />
        <rect x="144" y="68" width="48" height="78" />
        <rect x="220" y="96" width="48" height="50" />
      </g>
      <text x="9" y="18" fill="#BDC7D9" fontSize="9" fontFamily="monospace">
        {side ? "ILL-L2-v1 · SIDE" : "ILL-L1-v1 · FRONT"} · ILLUSTRATION
      </text>
    </svg>
  );
}

export function signalSamples(
  rate: number,
  source: SignalReference = experiments.E01.source!,
) {
  return Array.from(
    { length: Math.floor(rate * source.durationS) + 1 },
    (_, n) => ({
      t: n / rate,
      value:
        source.amplitudeV *
        Math.sin((2 * Math.PI * source.frequencyHz * n) / rate),
    }),
  );
}
export function SignalArt({
  rate = 3,
  source = experiments.E01.source!,
}: {
  rate?: number;
  source?: SignalReference;
}) {
  const path = Array.from(
    { length: 201 },
    (_, n) =>
      `${n ? "L" : "M"}${20 + n * 1.4},${88 - 50 * Math.sin((2 * Math.PI * source.frequencyHz * source.durationS * n) / 200)}`,
  ).join(" ");
  const alias =
    source.frequencyHz - rate * Math.round(source.frequencyHz / rate);
  const aliasPath = Array.from(
    { length: 201 },
    (_, n) =>
      `${n ? "L" : "M"}${20 + n * 1.4},${88 - 50 * Math.sin((2 * Math.PI * alias * source.durationS * n) / 200)}`,
  ).join(" ");
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={`Generated ${source.frequencyHz} Hz, ${source.amplitudeV} volt sine reference over ${source.durationS} seconds, sampled at ${rate} Hz. This is computed, not device data.`}
    >
      <rect width="320" height="180" fill="#151922" />
      <path
        d="M20 38V138H300M20 88H300"
        stroke="#BDC7D9"
        strokeOpacity=".3"
        fill="none"
      />
      <path d={path} fill="none" stroke="#BDC7D9" strokeWidth="1.4" />
      {Math.abs(alias) !== source.frequencyHz && (
        <path
          d={aliasPath}
          fill="none"
          stroke="#F2C14E"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
      )}
      {signalSamples(rate, source).map(({ t, value }) => (
        <g key={t}>
          <line
            x1={20 + (t / source.durationS) * 280}
            x2={20 + (t / source.durationS) * 280}
            y1="88"
            y2={88 - (value / source.amplitudeV) * 50}
            stroke="#6EE7C5"
            strokeOpacity=".55"
          />
          <circle
            cx={20 + (t / source.durationS) * 280}
            cy={88 - (value / source.amplitudeV) * 50}
            r="3"
            fill="#6EE7C5"
          />
        </g>
      ))}
      <g fill="#BDC7D9" fontSize="9" fontFamily="monospace">
        <text x="20" y="18">
          {source.id} · GENERATED · {rate} Hz SAMPLES
        </text>
        <text x="20" y="154">
          0 s
        </text>
        <text x="282" y="154">
          {source.durationS} s
        </text>
        <text x="1" y="40">
          {source.amplitudeV} V
        </text>
        {Math.abs(alias) !== source.frequencyHz && (
          <text x="20" y="170" fill="#F2C14E">
            DASHED: {Math.abs(alias)} Hz ALIAS · SAME SAMPLE VALUES
          </text>
        )}
      </g>
    </svg>
  );
}
export const ExperimentArt = ({ exp }: { exp: ExperimentId }) =>
  exp === "E06" ? <VisionArt /> : <SignalArt />;
