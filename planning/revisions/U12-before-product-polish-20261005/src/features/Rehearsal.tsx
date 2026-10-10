import { useState } from "react";
import { downloadJson } from "../components/ExportFallback";
import { Link, useParams, useSearchParams } from "react-router";
import { useLab } from "../app/context";
import { experiments } from "../data/fixtures";
import {
  SignalArt,
  VisionArt,
  signalSamples,
} from "../components/ExperimentArt";
import {
  createRehearsalRun,
  defaultReference,
  rehearsalRates,
  sampledAlias,
  validSignalReference,
  type RehearsalRun,
  type LightPosition,
} from "../domain/rehearsal";
import type { SignalReference } from "../domain/conditions";
import type { ExperimentId } from "../domain/types";
import {
  readRehearsal,
  rehearsalKey,
  retainRehearsalBeforeReset,
  restorePreviousRehearsal,
  saveRehearsal,
} from "../data/rehearsalPersistence";

export const exportRehearsal = downloadJson;
const download = exportRehearsal;

export function Rehearsal() {
  const { exp } = useParams();
  const [params] = useSearchParams();
  const { state } = useLab();
  if (exp !== "E01" && exp !== "E06")
    return (
      <>
        <h1>Rehearsal unavailable.</h1>
        <Link to="/">Return to Today</Link>
      </>
    );
  const from = params.get("from");
  const capture = from
    ? state.sessions[exp].captures.find((c) => c.id === from)
    : undefined;
  if (
    from &&
    (!capture?.context ||
      (exp === "E01" && !validSignalReference(capture.context.reference)))
  )
    return (
      <>
        <h1>Retained context unavailable.</h1>
        <p>
          This record cannot supply a usable rehearsal reference. No current
          fixture has been substituted for missing historical context.
        </p>
        <Link className="pbtn" to={`/${exp}/conditions`}>
          Return to recorded conditions
        </Link>
        <Link className="pbtn" to={`/${exp}/rehearsal`}>
          Start an independent fixture rehearsal
        </Link>
      </>
    );
  const reference =
    exp === "E01" ? capture?.context?.reference || defaultReference() : null;
  const sourceLabel = capture
    ? `Retained ${capture.id} · method ${capture.context!.methodRevision}`
    : `Teaching fixture · method ${experiments[exp].methodRevision}`;
  const heldSettings =
    capture?.context?.settings || experiments[exp].settings || {};
  return (
    <RehearsalWorkspace
      key={`${exp}:${from || "fixture"}`}
      exp={exp}
      reference={reference}
      sourceLabel={sourceLabel}
      heldSettings={heldSettings}
    />
  );
}

function RehearsalWorkspace({
  exp,
  reference,
  sourceLabel,
  heldSettings,
}: {
  exp: ExperimentId;
  reference: SignalReference | null;
  sourceLabel: string;
  heldSettings: Record<string, string>;
}) {
  const [loaded] = useState(() => {
    try {
      return readRehearsal(window.localStorage, exp);
    } catch {
      return {
        run: null,
        raw: null,
        warning: "Storage is unavailable; rehearsal can continue in memory.",
      };
    }
  });
  const [run, setRun] = useState<RehearsalRun | null>(loaded.run);
  const [prediction, setPrediction] = useState(loaded.run?.prediction || "");
  const [parameter, setParameter] = useState<number | LightPosition>(
    loaded.run?.parameter ?? (exp === "E01" ? 3 : "side"),
  );
  const [reflection, setReflection] = useState(loaded.run?.reflection || "");
  const [expectedRaw, setExpectedRaw] = useState(loaded.raw);
  const [message, setMessage] = useState(
    loaded.warning ||
      (loaded.run
        ? "Restored a saved rehearsal. Its prediction, reference and result remain as recorded."
        : "Write a prediction, choose one variable, then run the rehearsal."),
  );
  const [saved, setSaved] = useState(!!loaded.run);
  const pendingChange =
    !!run &&
    (run.parameter !== parameter ||
      run.prediction !== prediction.trim() ||
      run.sourceLabel !== sourceLabel);
  const resultReference = run?.reference || reference;
  const alias =
    run && exp === "E01"
      ? sampledAlias(run.parameter as number, run.reference!)
      : null;

  const start = () => {
    try {
      setRun(
        createRehearsalRun(
          exp,
          parameter,
          prediction,
          reference,
          sourceLabel,
          new Date().toISOString(),
          heldSettings,
        ),
      );
      setReflection("");
      setSaved(false);
      setMessage(
        "Rehearsal computed. Your prediction is retained with this run; compare the result and write your reflection. It has not been saved yet.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The rehearsal could not run. Your inputs remain.",
      );
    }
  };
  const save = () => {
    if (!run) return;
    try {
      const update = saveRehearsal(
        window.localStorage,
        exp,
        { ...run, reflection },
        expectedRaw,
      );
      setMessage(
        update.warning ||
          "Rehearsal saved in this browser, separate from experimental evidence and the notebook.",
      );
      if (!update.warning) {
        setExpectedRaw(update.raw);
        setRun({ ...run, reflection });
        setSaved(true);
      }
    } catch {
      setMessage(
        "Storage is unavailable. Your rehearsal remains in memory; export it before leaving.",
      );
    }
  };
  return (
    <>
      <p className="ed-kicker">{exp} · independent rehearsal</p>
      <h1>
        Change one variable.
        <br />
        <em>Keep your reasoning.</em>
      </h1>
      <p className="pull">{experiments[exp].question}</p>
      <p className="msg">
        {exp === "E01"
          ? "Generated sine model; no acquisition device is connected."
          : "Two authored lighting illustrations; no camera, ray-tracing or detector calculation is running here."}{" "}
        Rehearsal does not change bookings, physical setup, notebook claims or
        recorded evidence.
      </p>
      {exp === "E06" && (
        <p>
          <Link to="/scene/rehearsal">
            Rehearse camera framing with the existing Scene Studio geometry
            model →
          </Link>
        </p>
      )}
      <div className="rehearsal-layout">
        <section className="rehearsal-controls">
          <h2>1. Predict before comparing</h2>
          <div className="field">
            <label htmlFor="rehearsal-prediction">
              What do you expect, and why?
            </label>
            <textarea
              id="rehearsal-prediction"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            />
          </div>
          <h2>2. Change one variable</h2>
          <div className="field">
            <label htmlFor="rehearsal-parameter">
              {exp === "E01"
                ? "Candidate sampling rate"
                : "Candidate light position"}
            </label>
            <select
              id="rehearsal-parameter"
              value={parameter}
              onChange={(e) =>
                setParameter(
                  exp === "E01"
                    ? Number(e.target.value)
                    : (e.target.value as LightPosition),
                )
              }
            >
              {exp === "E01" ? (
                rehearsalRates.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate} Hz
                  </option>
                ))
              ) : (
                <>
                  <option value="front">Frontal light · L1 on, L2 off</option>
                  <option value="side">Side light · L2 on, L1 off</option>
                </>
              )}
            </select>
          </div>
          <p className="small">
            Source for the next run: {sourceLabel}.{" "}
            {reference &&
              `${reference.id} · ${reference.frequencyHz} Hz · ${reference.amplitudeV} V · ${reference.durationS} s.`}
          </p>
          <button
            className="pbtn primary"
            disabled={!prediction.trim()}
            onClick={start}
          >
            {run ? "Run another rehearsal" : "Run rehearsal"}
          </button>
          <p role="status">{message}</p>
          {pendingChange && (
            <p className="msg warn">
              Inputs have changed. The result below still belongs to the
              previous run; run again to compare the new choice.
            </p>
          )}
        </section>
        <section
          className="rehearsal-result"
          aria-labelledby="rehearsal-result-title"
        >
          <h2 id="rehearsal-result-title">
            3. Compare under the declared model
          </h2>
          {!run ? (
            <div className="panel">
              <h3>Result follows your prediction</h3>
              <p>
                Baseline: {exp === "E01" ? "20 Hz sampling" : "frontal light"}.
                The result is revealed when you run the candidate. No rehearsal
                result has been recorded yet.
              </p>
              {exp === "E01" ? (
                <SignalArt rate={20} source={reference!} />
              ) : (
                <VisionArt side={false} />
              )}
            </div>
          ) : (
            <>
              <p className="small">
                Run{" "}
                {new Date(run.runAt).toLocaleTimeString("en-GB", {
                  timeZone: "Asia/Kolkata",
                })}{" "}
                · {run.sourceLabel} ·{" "}
                {saved ? "saved rehearsal" : "unsaved rehearsal"}
              </p>
              <blockquote>
                <p>
                  <strong>Your prediction.</strong> {run.prediction}
                </p>
              </blockquote>
              <div className="rehearsal-pair">
                <figure>
                  <figcaption>
                    Baseline · {exp === "E01" ? "20 Hz" : "frontal light"}
                  </figcaption>
                  {exp === "E01" ? (
                    <SignalArt rate={20} source={resultReference!} />
                  ) : (
                    <VisionArt side={false} />
                  )}
                </figure>
                <figure>
                  <figcaption>
                    Candidate ·{" "}
                    {exp === "E01"
                      ? `${run.parameter} Hz`
                      : `${run.parameter} light`}
                  </figcaption>
                  {exp === "E01" ? (
                    <SignalArt
                      rate={run.parameter as number}
                      source={resultReference!}
                    />
                  ) : (
                    <VisionArt side={run.parameter === "side"} />
                  )}
                </figure>
              </div>
              {alias ? (
                <>
                  <p>
                    <strong>{alias.sampleCount} samples</strong> over{" "}
                    {run.reference!.durationS} s, including t = 0. Candidate
                    interval: 1/{run.parameter} s.
                  </p>
                  <p>
                    {alias.atBoundary
                      ? "This rate is exactly twice the reference frequency. With this zero-phase sine, the samples fall on zero crossings; this boundary example does not recover the waveform shape."
                      : alias.aliased
                        ? `The dashed ${alias.frequencyHz.toFixed(3)} Hz alias has the same sample values under this ideal sine model; it does not establish the original signal uniquely.`
                        : "The candidate resolves this known reference in the ideal model. That is not evidence about an unknown physical signal or device bandwidth."}
                  </p>
                  <p className="small">
                    Held constant: reference frequency, amplitude, phase (zero)
                    and duration. y[n] = A sin(2π f n / fs). Dashed alias uses f
                    − fs round(f/fs). This model omits noise, acquisition timing
                    error and anti-alias filtering.
                  </p>
                  <details>
                    <summary>Read candidate sample values</summary>
                    <div
                      className="scroll"
                      role="region"
                      tabIndex={0}
                      aria-label="Rehearsal sample values"
                    >
                      <table className="led">
                        <thead>
                          <tr>
                            <th scope="col">Time (s)</th>
                            <th scope="col">Value (V)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {signalSamples(
                            run.parameter as number,
                            run.reference!,
                          ).map((p) => (
                            <tr key={p.t}>
                              <td>{p.t.toFixed(3)}</td>
                              <td>{p.value.toFixed(3)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </>
              ) : (
                <>
                  <p>
                    {run.parameter === "side"
                      ? "The authored side-light image shows longer shadows and differently lit faces; the scene objects and annotation boxes remain the same."
                      : "The candidate repeats frontal light. This control condition repeats the illustration; a difference is not implied."}
                  </p>
                  <p className="small">
                    Held constant in the authored scenario: scene and camera
                    placement. Retained settings:{" "}
                    {Object.entries(run.heldSettings)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" · ") || "not recorded"}
                    . These are recorded settings, not measured equivalence; the
                    illustration does not compute their effects. The
                    illustrations do not model real irradiance, lens response,
                    noise or detection accuracy.
                  </p>
                </>
              )}
            </>
          )}
        </section>
      </div>
      {run && (
        <section className="panel rehearsal-reflection">
          <h2>4. Reflect in your own words</h2>
          <p>
            What changed, what stayed fixed, and what can this result support?
            Name one limitation. Rehearsal notes are separate from your
            experimental notebook.
          </p>
          <div className="field">
            <label htmlFor="rehearsal-reflection">Your reflection</label>
            <textarea
              id="rehearsal-reflection"
              value={reflection}
              onChange={(e) => {
                setReflection(e.target.value);
                setSaved(false);
              }}
            />
          </div>
          <div className="acts">
            <button
              className="pbtn primary"
              disabled={!reflection.trim()}
              onClick={save}
            >
              Save rehearsal reflection
            </button>
            <button
              className="pbtn"
              onClick={() =>
                download(
                  JSON.stringify({ ...run, reflection }, null, 2),
                  `parallax-${exp}-rehearsal.json`,
                )
              }
            >
              Export rehearsal
            </button>
          </div>
        </section>
      )}
      <details>
        <summary>Saved record and recovery</summary>
        <button
          className="pbtn"
          onClick={() => {
            try {
              const restored = restorePreviousRehearsal(
                window.localStorage,
                exp,
                crypto.randomUUID(),
              );
              if (!restored.run) {
                setMessage(restored.warning!);
                return;
              }
              if (run && !saved)
                download(
                  JSON.stringify({ ...run, reflection }, null, 2),
                  `parallax-${exp}-unsaved-rehearsal.json`,
                );
              setRun(restored.run);
              setPrediction(restored.run.prediction);
              setParameter(restored.run.parameter);
              setReflection(restored.run.reflection);
              setExpectedRaw(restored.raw);
              setSaved(true);
              setMessage(
                "Previous saved rehearsal restored; current stored data was archived first.",
              );
            } catch {
              setMessage(
                "Restore is unavailable. Your current rehearsal is retained in memory.",
              );
            }
          }}
        >
          Restore previous saved rehearsal
        </button>
        <button
          className="pbtn"
          onClick={() => {
            try {
              download(
                window.localStorage.getItem(`${rehearsalKey(exp)}:previous`) ||
                  "null",
                `parallax-${exp}-recovery-rehearsal.json`,
              );
            } catch {
              setMessage("Recovery data is unavailable.");
            }
          }}
        >
          Export previous recovery record
        </button>
        <p className="small">
          Prediction and reflection remain in memory until explicitly saved.
          Saving uses a separate browser key; another tab's changed record is
          not overwritten. A fresh start retains the saved raw record under a
          recovery key first.
        </p>
        <div className="acts">
          <button
            className="pbtn"
            onClick={() => {
              try {
                download(
                  window.localStorage.getItem(rehearsalKey(exp)) || "null",
                  `parallax-${exp}-retained-rehearsal.json`,
                );
              } catch {
                setMessage(
                  "Stored data is unavailable; export the current run above if present.",
                );
              }
            }}
          >
            Export retained saved record
          </button>
          <button
            className="pbtn"
            onClick={() => {
              let warning: string | null;
              try {
                warning = retainRehearsalBeforeReset(
                  window.localStorage,
                  exp,
                  crypto.randomUUID(),
                );
              } catch {
                warning =
                  "Storage is unavailable. Export your current work before starting fresh.";
              }
              if (warning) {
                setMessage(warning);
                return;
              }
              if (run && !saved) {
                download(
                  JSON.stringify({ ...run, reflection }, null, 2),
                  `parallax-${exp}-unsaved-rehearsal.json`,
                );
              }
              setRun(null);
              setPrediction("");
              setReflection("");
              setExpectedRaw(null);
              setSaved(false);
              setMessage(
                "Fresh rehearsal started. Previous saved data was retained in a recovery copy; an unsaved result was exported if present.",
              );
            }}
          >
            Start a fresh rehearsal
          </button>
        </div>
      </details>
      <div className="acts">
        <Link className="pbtn" to={`/${exp}/prepare`}>
          ← Return to preparation
        </Link>
        <Link className="pbtn" to={`/${exp}/conditions`}>
          Inspect recorded conditions
        </Link>
        <Link className="pbtn primary" to={`/${exp}/bench`}>
          Continue through the normal bench →
        </Link>
      </div>
      <p className="small">
        The bench retains the approved example conditions. Additional sampling
        rates remain rehearsal-only; running this preview does not complete
        preparation or create an evidence record. <Link to={`/assistant?guide=${exp}`}>Read the reviewed experiment guide</Link> for source-based help.
      </p>
    </>
  );
}
