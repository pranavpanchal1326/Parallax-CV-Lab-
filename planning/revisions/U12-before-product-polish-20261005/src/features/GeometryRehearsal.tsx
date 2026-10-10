import { useState } from "react";
import { Link } from "react-router";
import { createRehearsalRun, type RehearsalRun } from "../domain/rehearsal";
import {
  readRehearsal,
  rehearsalKey,
  retainRehearsalBeforeReset,
  restorePreviousRehearsal,
  saveRehearsal,
} from "../data/rehearsalPersistence";
import { exportRehearsal } from "./Rehearsal";

const heldSettings = {
  geometry: "P4-D",
  model: "P8-A Scene Studio",
  distance: "2.05 m",
  lateral: "0 m",
  height: "1.57 m",
  pan: "0°",
  tilt: "−19°",
  objects: "01 BOX · 02 CYLINDER · 03 EXPECTED OBJECT",
  measurement:
    "320 × 180 object-ID rendering; plan approximation when WebGL is unavailable",
};
export function GeometryRehearsal() {
  const [loaded] = useState(() => {
    try {
      return readRehearsal(window.localStorage, "E12");
    } catch {
      return {
        run: null,
        raw: null,
        warning: "Storage unavailable; export work before leaving.",
      };
    }
  });
  const [run, setRun] = useState<RehearsalRun | null>(loaded.run);
  const [prediction, setPrediction] = useState(loaded.run?.prediction || "");
  const [reflection, setReflection] = useState(loaded.run?.reflection || "");
  const [field, setField] = useState(Number(loaded.run?.parameter || 18));
  const [baseline, setBaseline] = useState(false);
  const [planOnly, setPlanOnly] = useState(false);
  const [expectedRaw, setExpectedRaw] = useState(loaded.raw);
  const [message, setMessage] = useState(
    loaded.warning ||
      (loaded.run
        ? "Restored saved reasoning and fixed geometry settings. The declared model recomputes its view; no physical image was recorded."
        : "Predict before revealing a candidate geometry view."),
  );
  const frameField = baseline || !run ? 40 : Number(run.parameter);
  const framePath = `${import.meta.env.BASE_URL}scene-rehearsal/index.html?fov=${frameField}${planOnly ? "&webgl=off" : ""}${new URLSearchParams(window.location.search).get("qa") === "1" ? "&qa=1" : ""}`;
  const changed =
    run && (field !== run.parameter || prediction.trim() !== run.prediction);
  return (
    <>
      <p className="ed-kicker">
        E12 · Scene Studio geometry rehearsal
      </p>
      <h1>
        Predict the frame.
        <br />
        <em>Keep the scene fixed.</em>
      </h1>
      <p className="pull">
        How does field of view change what fits in the camera image?
      </p>
      <p className="msg">
        The existing Scene Studio model computes object visibility from
        conceptual P4-D geometry. This is separate from E06's lighting
        illustrations: geometric visibility does not establish detector
        accuracy, real lens behaviour or a safe physical setup.
      </p>
      <div className="rehearsal-layout">
        <section className="rehearsal-controls">
          <h2>1. Predict</h2>
          <div className="field">
            <label htmlFor="geometry-prediction">
              Geometry prediction and reason
            </label>
            <textarea
              id="geometry-prediction"
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
            />
          </div>
          <h2>2. Change field of view</h2>
          <div className="field">
            <label htmlFor="geometry-field">
              Candidate horizontal field of view
            </label>
            <select
              id="geometry-field"
              value={field}
              onChange={(e) => setField(Number(e.target.value))}
            >
              <option value={18}>18° · narrow</option>
              <option value={40}>40° · repeat baseline</option>
              <option value={90}>90° · wide</option>
            </select>
          </div>
          <button
            className="pbtn primary"
            disabled={!prediction.trim()}
            onClick={() => {
              setRun(
                createRehearsalRun(
                  "E12",
                  field,
                  prediction,
                  null,
                  "Scene Studio · P8-A / P4-D",
                  new Date().toISOString(),
                  heldSettings,
                ),
              );
              setReflection("");
              setBaseline(false);
              setMessage(
                "Candidate revealed under the fixed model. Compare with the baseline, then record a limitation. Save or export before leaving.",
              );
            }}
          >
            Run geometry rehearsal
          </button>
          <p role="status">{message}</p>
          {changed && (
            <p className="msg warn">
              Inputs changed; the displayed candidate still belongs to the
              retained run. Run again to apply them.
            </p>
          )}
          <details>
            <summary>Fixed model settings</summary>
            <dl className="record-settings">
              {Object.entries(heldSettings).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </details>
        </section>
        <section className="rehearsal-result">
          <h2>3. Inspect the model consequence</h2>
          {run && (
            <blockquote>
              <strong>Your prediction.</strong> {run.prediction}
            </blockquote>
          )}
          <p>
            {baseline || !run
              ? "Baseline · 40°"
              : `Candidate · ${run.parameter}°`}{" "}
            · same scene, camera position, height, pan and tilt.
          </p>
          <div className="acts">
            <button
              className="pbtn"
              disabled={!run || baseline}
              onClick={() => setBaseline(true)}
            >
              Show 40° baseline
            </button>
            <button
              className="pbtn"
              disabled={!run || !baseline}
              onClick={() => setBaseline(false)}
            >
              Show retained candidate
            </button>
            <button
              className="pbtn"
              aria-pressed={planOnly}
              onClick={() => setPlanOnly(!planOnly)}
            >
              {planOnly
                ? "Use 3D when available"
                : "Use plan-only approximation"}
            </button>
          </div>
          <p className="small">
            Use Scene, Camera and Interpretation inside the model. The text
            interpretation names clipping and occlusion; the plan remains
            available without pointer dragging or WebGL. Plan-only results are
            angular approximations, not 3D measurements. Rendering at 320 × 180
            gives model-dependent visible fractions; it does not measure a
            physical camera.
          </p>
          <iframe
            key={framePath}
            className="geometry-rehearsal-frame"
            src={framePath}
            title={`Fixed Scene Studio ${frameField} degree model${planOnly ? "; plan-only approximation" : ""}`}
          />
        </section>
      </div>
      {run && (
        <section className="panel">
          <h2>4. Reflect</h2>
          <p>
            Name the supported framing relationship and one limitation. These
            notes retain the chosen model settings and reasoning; they are not
            experimental evidence or a frozen image.
          </p>
          <div className="field">
            <label htmlFor="geometry-reflection">Geometry reflection</label>
            <textarea
              id="geometry-reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>
          <div className="acts">
            <button
              className="pbtn primary"
              disabled={!reflection.trim()}
              onClick={() => {
                try {
                  const update = saveRehearsal(
                    window.localStorage,
                    "E12",
                    { ...run, reflection },
                    expectedRaw,
                  );
                  setMessage(
                    update.warning ||
                      "Geometry reasoning saved separately in this browser. The model view is recomputed from the retained settings.",
                  );
                  if (!update.warning) {
                    setExpectedRaw(update.raw);
                    setRun({ ...run, reflection });
                  }
                } catch {
                  setMessage(
                    "Saving unavailable; current work remains in memory. Export it before leaving.",
                  );
                }
              }}
            >
              Save geometry reflection
            </button>
            <button
              className="pbtn"
              onClick={() =>
                exportRehearsal(
                  JSON.stringify({ ...run, reflection }, null, 2),
                  "parallax-E12-geometry-rehearsal.json",
                )
              }
            >
              Export geometry rehearsal
            </button>
          </div>
        </section>
      )}
      <details>
        <summary>Geometry record and recovery</summary>
        <p className="small">
          A fresh start archives stored data before clearing it. Another tab's
          changed record is never silently overwritten. Export reads the
          retained raw record, including data that could not be parsed.
        </p>
        <div className="acts">
          <button
            className="pbtn"
            onClick={() => {
              try {
                exportRehearsal(
                  window.localStorage.getItem(rehearsalKey("E12")) || "null",
                  "parallax-E12-retained.json",
                );
              } catch {
                setMessage(
                  "Stored data is unavailable; export the current run if present.",
                );
              }
            }}
          >
            Export retained geometry record
          </button>
          <button
            className="pbtn"
            onClick={() => {
              try {
                const warning = retainRehearsalBeforeReset(
                  window.localStorage,
                  "E12",
                  crypto.randomUUID(),
                );
                if (warning) {
                  setMessage(warning);
                  return;
                }
                if (run)
                  exportRehearsal(
                    JSON.stringify({ ...run, reflection }, null, 2),
                    "parallax-E12-current.json",
                  );
                setRun(null);
                setPrediction("");
                setReflection("");
                setExpectedRaw(null);
                setMessage(
                  "Fresh geometry rehearsal started; stored data retained in a recovery copy and the current run exported if present.",
                );
              } catch {
                setMessage(
                  "Recovery unavailable. Current work remains in memory; export it before leaving.",
                );
              }
            }}
          >
            Start fresh geometry rehearsal
          </button>
          <button
            className="pbtn"
            onClick={() => {
              try {
                const restored = restorePreviousRehearsal(
                  window.localStorage,
                  "E12",
                  crypto.randomUUID(),
                );
                if (!restored.run) {
                  setMessage(restored.warning!);
                  return;
                }
                if (run)
                  exportRehearsal(
                    JSON.stringify({ ...run, reflection }, null, 2),
                    "parallax-E12-current.json",
                  );
                setRun(restored.run);
                setPrediction(restored.run.prediction);
                setField(Number(restored.run.parameter));
                setReflection(restored.run.reflection);
                setExpectedRaw(restored.raw);
                setMessage(
                  "Previous geometry reasoning restored; current stored data archived first.",
                );
              } catch {
                setMessage(
                  "Restore unavailable; current work remains in memory.",
                );
              }
            }}
          >
            Restore previous geometry rehearsal
          </button>
        </div>
      </details>
      <div className="acts">
        <Link className="pbtn" to="/E06/rehearsal">
          E06 lighting illustration
        </Link>
        <Link className="pbtn" to="/E06/prepare">
          Return through normal preparation
        </Link>
        <a className="pbtn" href="/design/phase-08/scene-studio.html">
          Original unrestricted Scene Studio ↗
        </a>
      </div>
      <p className="small">
        All changes stay in rehearsal. No physical setting is transferred
        automatically. Save is guarded against another tab's changed record;
        export remains available. <Link to="/assistant?guide=GEOMETRY">Read the camera geometry guide</Link> for source-based help.
      </p>
    </>
  );
}
