import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useLab } from "../app/context";
import { experiments } from "../data/fixtures";
import { recordedDifferences } from "../domain/conditions";
import {
  SignalArt,
  VisionArt,
  signalSamples,
} from "../components/ExperimentArt";
import { ObservationPanel } from "./SmartLab";
import type { ExperimentId } from "../domain/types";

export function Conditions() {
  const { exp: route } = useParams();
  const { state } = useLab();
  const [selectedRecord, setSelectedRecord] = useState(0);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  useEffect(() => {
    setSelectedRecord(0);
    setSelectedField(null);
  }, [route]);
  if (route !== "E01" && route !== "E06")
    return (
      <>
        <h1>Experiment unavailable.</h1>
        <Link to="/">Return to Today</Link>
      </>
    );
  const exp = route as ExperimentId;
  const captures = state.sessions[exp].captures;
  const differences =
    captures.length >= 2 ? recordedDifferences(captures[0], captures[1]) : [];
  const inspected = differences.find((row) => row.field === selectedField);
  return (
    <>
      <p className="ed-kicker">{exp} · evidence provenance</p>
      <h1>
        Replay the conditions.
        <br />
        <em>Keep the context.</em>
      </h1>
      <p className="pull">{experiments[exp].title}</p>
      <p>
        Recorded context is retained with each capture. Changing the environment
        example cannot rewrite it. Replay presents a stored condition; it does
        not reproduce a physical experiment.
      </p>
      {!!captures.length && (
        <div className="acts" role="group" aria-label="Inspect retained condition">
          {captures.map((capture, index) => (
            <button
              className="pbtn"
              key={capture.id}
              aria-pressed={selectedRecord === index}
              onClick={() => setSelectedRecord(index)}
            >
              Inspect {capture.label} · record {index + 1}
            </button>
          ))}
        </div>
      )}
      {!!captures.length && (
        <p className="msg" role="status">
          Selected record:{" "}
          {captures[Math.min(selectedRecord, captures.length - 1)].id}. Its
          stored source, settings and resource state are highlighted below;
          selection changes no evidence.
        </p>
      )}
      {!captures.length && (
        <div className="panel">
          <h2>No condition recorded yet</h2>
          <p>
            Prepare, book and start your session, then record a condition at the
            bench.
          </p>
          <Link className="pbtn primary" to={`/${exp}/prepare`}>
            Prepare {exp} →
          </Link>
        </div>
      )}
      <div className="condition-records">
        {captures.map((capture, index) => {
          const context = capture.context;
          const rate = Number(
            /^(\d+(?:\.\d+)?) Hz$/.exec(capture.settings.sampleRate || "")?.[1],
          );
          return (
            <section
              className="panel retained-condition"
              data-selected={index === selectedRecord}
              key={capture.id}
            >
              <p className="ed-kicker">
                Record {index + 1} · {capture.id}
              </p>
              <h2>{capture.label}</h2>
              <p>
                {capture.time} · {capture.source}
              </p>
              {context ? (
                <>
                  <p className="small">
                    Method {context.methodRevision} · fixture{" "}
                    {context.fixtureRevision} · geometry{" "}
                    {context.geometryRevision}
                    <br />
                    Recorded{" "}
                    {new Date(context.recordedAt).toLocaleTimeString("en-GB", {
                      timeZone: "Asia/Kolkata",
                    })}{" "}
                    IST
                  </p>
                  <p>{context.detail}</p>
                  {exp === "E01" &&
                  context.reference &&
                  Number.isFinite(rate) &&
                  rate > 0 ? (
                    <>
                      <SignalArt rate={rate} source={context.reference} />
                      <details>
                        <summary>
                          Computed values from the retained reference
                        </summary>
                        <div
                          className="scroll"
                          role="region"
                          tabIndex={0}
                          aria-label={`Samples for ${capture.id}`}
                        >
                          <table className="led">
                            <thead>
                              <tr>
                                <th scope="col">Time (s)</th>
                                <th scope="col">Amplitude (V)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {signalSamples(rate, context.reference).map(
                                (p) => (
                                  <tr key={p.t}>
                                    <td>{p.t.toFixed(3)}</td>
                                    <td>{p.value.toFixed(3)}</td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </>
                  ) : exp === "E06" ? (
                    <>
                      <VisionArt side={capture.id === "ILL-L2-v1"} />
                      <p className="small">
                        Illustration reconstructed from the retained condition
                        identifier; no image was captured by hardware.
                      </p>
                    </>
                  ) : (
                    <p className="msg warn">
                      No usable retained reference for a computed replay.
                    </p>
                  )}
                  <dl className="record-settings">
                    {Object.entries(context.settings).map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3>Environment at capture</h3>
                  {context.observations.length ? (
                    <ObservationPanel
                      observations={context.observations}
                      evaluatedAt={context.recordedAt}
                    />
                  ) : (
                    <p>
                      Environment context was not recorded. No observations have
                      been inferred.
                    </p>
                  )}
                  <details>
                    <summary>Resource state at capture</summary>
                    <ul>
                      {context.resources.map((r) => (
                        <li key={r.id}>
                          {r.id} ·{" "}
                          {r.restriction
                            ? `restriction ${r.restriction}`
                            : "no restriction recorded"}{" "}
                          · {r.located ? "located" : "location not confirmed"}
                        </li>
                      ))}
                    </ul>
                  </details>
                </>
              ) : (
                <p className="msg warn">
                  This older capture has no retained method, environment or
                  geometry context. Its original settings remain available
                  below; current fixtures have not been substituted.
                </p>
              )}
              {!context && (
                <dl className="record-settings">
                  {Object.entries(capture.settings).map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {context && (
                <Link
                  className="pbtn"
                  to={`/${exp}/rehearsal?from=${encodeURIComponent(capture.id)}`}
                >
                  Rehearse from this retained context →
                </Link>
              )}
            </section>
          );
        })}
      </div>
      {captures.length >= 2 && (
        <section className="smart-section">
          <h2>What changed between the conditions?</h2>
          <p>
            Recorded differences describe the example. They do not establish
            causation or measured detector performance.
          </p>
          {inspected && (
            <div className="msg" role="status">
              <strong>Inspecting {inspected.field}.</strong>{" "}
              {inspected.comparable
                ? `${captures[0].label}: ${inspected.a}. ${captures[1].label}: ${inspected.b}. ${inspected.changed ? "This recorded field differs. What other conditions could limit your interpretation?" : "This recorded value agrees. Which other fields differ?"}`
                : "At least one record lacks this context. What additional record would make the comparison supportable?"}{" "}
              This comparison cannot establish causation.
            </div>
          )}
          <div
            className="scroll"
            role="region"
            tabIndex={0}
            aria-label="Recorded condition differences"
          >
            <table className="led">
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  <th scope="col">{captures[0].label}</th>
                  <th scope="col">{captures[1].label}</th>
                  <th scope="col">Comparison</th>
                </tr>
              </thead>
              <tbody>
                {differences.map((row) => (
                  <tr
                    key={row.field}
                    data-selected={selectedField === row.field}
                  >
                    <th scope="row">
                      <button
                        className="pbtn quiet"
                        aria-pressed={selectedField === row.field}
                        onClick={() => setSelectedField(row.field)}
                      >
                        Inspect {row.field}
                      </button>
                    </th>
                    <td>{row.a}</td>
                    <td>{row.b}</td>
                    <td>
                      {!row.comparable
                        ? "Context missing; not comparable"
                        : row.changed
                          ? "Different"
                          : "Same recorded value"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <div className="acts">
        <Link className="pbtn" to={`/${exp}/bench`}>
          ← Return to bench
        </Link>
        <Link className="pbtn primary" to={`/${exp}/notebook`}>
          Write your own interpretation →
        </Link>
      </div>
    </>
  );
}
