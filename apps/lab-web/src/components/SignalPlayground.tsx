import { useState } from "react";
import { Link } from "react-router";
import { defaultReference, rehearsalRates, sampledAlias } from "../domain/rehearsal";

// The lab's first idea, playable in five seconds. Uses the same reference and alias calculation as
// the E01 rehearsal; nothing here is a measurement.
export function SignalPlayground() {
  const reference = defaultReference();
  const [rate, setRate] = useState<(typeof rehearsalRates)[number]>(3);
  const result = sampledAlias(rate, reference);
  const width = 640, height = 220, pad = 28, mid = height / 2, amp = 74;
  const x = (t: number) => pad + (t / reference.durationS) * (width - 2 * pad);
  const curve = (hz: number) =>
    Array.from({ length: 161 }, (_, i) => {
      const t = (i / 160) * reference.durationS;
      return `${x(t).toFixed(1)},${(mid - amp * Math.sin(2 * Math.PI * hz * t)).toFixed(1)}`;
    }).join(" ");
  const samples = Array.from({ length: result.sampleCount }, (_, n) => {
    const t = n / rate;
    return { t, y: mid - amp * Math.sin(2 * Math.PI * reference.frequencyHz * t) };
  });
  const reading = result.atBoundary
    ? "Every sample lands on zero. At exactly twice the frequency the samples cannot tell you the wave is there."
    : result.aliased
      ? `These ${result.sampleCount} samples also fit a ${result.frequencyHz} Hz wave. Sampled this slowly, the ${reference.frequencyHz} Hz signal looks like something else.`
      : `${result.sampleCount} samples follow the ${reference.frequencyHz} Hz wave. Fast enough to keep its shape.`;
  return (
    <section className="playground" aria-labelledby="playground-title">
      <div className="playground-copy">
        <p className="ed-kicker">Try it in five seconds</p>
        <h2 id="playground-title">How fast must you sample?</h2>
        <p>
          The line is a {reference.frequencyHz} Hz signal lasting one second.
          Choose how many times per second to measure it.
        </p>
        <div className="playground-rates" role="group" aria-label="Sampling rate">
          {rehearsalRates.map((value) => (
            <button
              key={value}
              className="pbtn"
              aria-pressed={rate === value}
              onClick={() => setRate(value)}
            >
              {value} Hz
            </button>
          ))}
        </div>
        <p className="playground-reading" role="status">
          {reading}
        </p>
        <Link className="ed-link" to="/E01/rehearsal">
          Predict and compare in the full rehearsal →
        </Link>
      </div>
      <figure className="playground-plate">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`A ${reference.frequencyHz} hertz sine over one second with ${result.sampleCount} samples at ${rate} hertz. ${reading}`}
        >
          <line className="pg-axis" x1={pad} x2={width - pad} y1={mid} y2={mid} />
          <polyline className="pg-wave" points={curve(reference.frequencyHz)} />
          {result.aliased && !result.atBoundary && (
            <polyline className="pg-alias" points={curve(result.signedHz)} />
          )}
          {samples.map((s) => (
            <g key={s.t}>
              <line className="pg-stem" x1={x(s.t)} x2={x(s.t)} y1={mid} y2={s.y} />
              <circle className="pg-dot" cx={x(s.t)} cy={s.y} r="5" />
            </g>
          ))}
          <text className="pg-label" x={pad} y={height - 8}>0 s</text>
          <text className="pg-label" x={width - pad} y={height - 8} textAnchor="end">1 s</text>
        </svg>
        <figcaption>
          <span data-k="wave">Signal</span>
          <span data-k="dot">Samples</span>
          {result.aliased && !result.atBoundary && <span data-k="alias">What the samples suggest</span>}
          <em>Generated model, not a measurement.</em>
        </figcaption>
      </figure>
    </section>
  );
}
