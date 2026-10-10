import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  artPlates,
  physicalStudies,
  signStudies,
  anchorRecord,
  studioGeometry,
  studioKit,
  studioReference,
} from "../data/studio";
import {
  studioPlateSvg,
  studioSamples,
} from "../../../lab-shared/studio-graphics.mjs";

const asset = (name: string) => `${import.meta.env.BASE_URL}studio/${name}`;
function ReferenceImage({
  src,
  alt,
  textOnly,
}: {
  src: string;
  alt: string;
  textOnly: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (textOnly)
    return (
      <p className="studio-image-message">
        Text reference selected. The figure’s meaning and source appear below.
      </p>
    );
  if (failed)
    return (
      <p role="status" className="studio-image-message">
        Figure unavailable. Its text reference and source remain available
        below.
      </p>
    );
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

export function ArtStudio() {
  const [params, setParams] = useSearchParams();
  const plate =
    artPlates.find((p) => p.file === params.get("plate")) || artPlates[0];
  const [textOnly, setTextOnly] = useState(false);
  const [rate, setRate] = useState(3);
  const [sample, setSample] = useState(0);
  const [physicalId, setPhysicalId] = useState(physicalStudies[0].id);
  const [signId, setSignId] = useState(signStudies[0].id);
  const physical = physicalStudies.find((p) => p.id === physicalId)!;
  const sign = signStudies.find((s) => s.id === signId)!;
  const samples = studioSamples(studioReference, rate);
  const selected = samples[sample];
  const image =
    plate.kind === "pixel"
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(studioPlateSvg("pixel", studioReference, studioKit, rate, sample))}`
      : asset(`${plate.file}.svg`);
  return (
    <div className="art-studio">
      <p className="ed-kicker">Art & physical reference</p>
      <h1>
        Make the science <em>visible.</em>
      </h1>
      <p className="studio-lead">
        Scientific compositions, readable signs and source-linked room studies.
      </p>
      <nav className="studio-jump" aria-label="Studio sections">
        {[
          ["studio-art", "Art plates"],
          ["studio-physical", "Physical studies"],
          ["studio-signs", "Sign family"],
          ["studio-packet", "Reference packet"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => {
              event.preventDefault();
              const section = document.getElementById(id);
              section?.focus();
              section?.scrollIntoView({ block: "start" });
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      <p className="studio-boundary">
        Generated and illustrative references · concept room P4-D · operational
        records stay in their existing workflows.
      </p>
      <label className="studio-text-toggle">
        <input
          type="checkbox"
          checked={textOnly}
          onChange={(e) => setTextOnly(e.target.checked)}
        />{" "}
        Show text references only
      </label>

      <section
        className="studio-section"
        id="studio-art"
        tabIndex={-1}
        aria-labelledby="studio-art-title"
      >
        <div className="studio-heading">
          <h2 id="studio-art-title">01 / Art plates</h2>
          <span>Nine compositions · eight art subjects</span>
        </div>
        <label htmlFor="studio-plate">Choose a composition</label>
        <select
          id="studio-plate"
          value={plate.file}
          onChange={(e) => {
            const next = new URLSearchParams(params);
            next.set("plate", e.target.value);
            setParams(next, { replace: true });
          }}
        >
          {artPlates.map((p) => (
            <option key={p.file} value={p.file}>
              {p.file} · {p.title}
            </option>
          ))}
        </select>
        <figure className="studio-figure">
          <ReferenceImage
            key={image}
            src={image}
            alt={`${plate.file}: ${plate.title}. ${plate.equivalent}`}
            textOnly={textOnly}
          />
          <figcaption>
            <strong>
              {plate.file} / {plate.title}
            </strong>
            <span>{plate.source}</span>
          </figcaption>
        </figure>
        {plate.kind === "pixel" && (
          <div className="studio-sample-controls">
            <div>
              <label htmlFor="studio-rate">Sampling rate</label>
              <select
                id="studio-rate"
                value={rate}
                onChange={(e) => {
                  setRate(Number(e.target.value));
                  setSample(0);
                }}
              >
                <option value={3}>
                  3 Hz · {studioSamples(studioReference, 3).length} samples
                </option>
                <option value={20}>
                  20 Hz · {studioSamples(studioReference, 20).length} samples
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="studio-sample">Inspect sample</label>
              <select
                id="studio-sample"
                value={sample}
                onChange={(e) => setSample(Number(e.target.value))}
              >
                {samples.map((s) => (
                  <option key={s.index} value={s.index}>
                    {s.index} · {s.t.toFixed(3)} s
                  </option>
                ))}
              </select>
            </div>
            <p role="status" aria-live="polite">
              Sample {sample}: {selected.value.toFixed(3)} V at{" "}
              {selected.t.toFixed(3)} s → display value{" "}
              {selected.display.toFixed(3)}. No autoplay.
            </p>
            <details>
              <summary>Read all sample values and the mapping</summary>
              <p>
                For amplitude A = {studioReference.amplitudeV} V, display = (v +
                A) / (2A). This is a decorative display model, not calibrated
                luminance.
              </p>
              <div className="studio-table-wrap">
                <table>
                  <caption>
                    {rate} Hz generated samples · {studioReference.frequencyHz}{" "}
                    Hz ideal reference
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Sample</th>
                      <th scope="col">Time (s)</th>
                      <th scope="col">Value (V)</th>
                      <th scope="col">Display</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samples.map((s) => (
                      <tr key={s.index}>
                        <th scope="row">{s.index}</th>
                        <td>{s.t.toFixed(3)}</td>
                        <td>{s.value.toFixed(3)}</td>
                        <td>{s.display.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        )}
        <div className="studio-explanation">
          <div>
            <h3>The visual job</h3>
            <p>{plate.job}</p>
            <h3>Text reference</h3>
            <p>{plate.equivalent}</p>
          </div>
          <div>
            <h3>Scale and use</h3>
            <p>{plate.scale}</p>
            <p>
              <a
                href={asset(`${plate.file}.svg`)}
                target="_blank"
                rel="noreferrer"
              >
                Open vector master ↗
              </a>
              {plate.kind === "pixel" && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={asset("ART-08-20Hz.svg")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    20 Hz master ↗
                  </a>
                </>
              )}
            </p>
            {plate.kind === "pixel" && (
              <p className="small">
                Masters use sample 0; the on-screen figure follows your
                selection.
              </p>
            )}
            <Link className="pbtn" to={plate.route}>
              Continue in the related workflow →
            </Link>
          </div>
        </div>
        {plate.kind === "installation" && (
          <details>
            <summary>View the preserved P8-B installation render</summary>
            <figure className="studio-figure">
              <ReferenceImage
                src="/spatial/renders/phase-08b/R10_sculpture.png"
                alt="Existing ARTWORK-CAND04 segmented-fin concept above the circulation spine, from the original P8-B render."
                textOnly={textOnly}
              />
              <figcaption>
                Existing R10 sculpture render · preserved reference; mounting
                and clearances unverified.
              </figcaption>
            </figure>
          </details>
        )}
      </section>

      <section
        className="studio-section"
        id="studio-physical"
        tabIndex={-1}
        aria-labelledby="studio-physical-title"
      >
        <div className="studio-heading">
          <h2 id="studio-physical-title">02 / Physical studies</h2>
          <span>Six proposals · canonical anchors</span>
        </div>
        <label htmlFor="studio-study">Choose a physical study</label>
        <select
          id="studio-study"
          value={physicalId}
          onChange={(e) => setPhysicalId(e.target.value)}
        >
          {physicalStudies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} · {p.title}
            </option>
          ))}
        </select>
        <figure className="studio-figure">
          <ReferenceImage
            key={physical.layer}
            src={asset(`plan-${physical.layer}.svg`)}
            alt={`${physical.title}. Canonical concept geometry: ${physical.anchors.join(", ")}. Anchor positions and review boundaries follow below.`}
            textOnly={textOnly}
          />
          <figcaption>
            <strong>
              {physical.id} / {physical.title}
            </strong>
            <span>
              P4-D · assumed 10 × 7 m room · no new footprint or coverage claim
            </span>
          </figcaption>
        </figure>
        <div className="studio-explanation">
          <div>
            <h3>Design proposal</h3>
            <p>{physical.proposal}</p>
            <h3>Accessible fallback</h3>
            <p>{physical.fallback}</p>
          </div>
          <div>
            <h3>Review owner</h3>
            <p>{physical.owner}</p>
            <h3>Before physical use</h3>
            <p>{physical.review}</p>
            <a
              href={asset(`plan-${physical.layer}.svg`)}
              target="_blank"
              rel="noreferrer"
            >
              Open full-size plan ↗
            </a>
          </div>
        </div>
        <details>
          <summary>Read the exact anchor positions</summary>
          <p>
            Concept origin: north-west; x east, y south. Positions are source
            coordinates, not a site survey.
          </p>
          <ul className="studio-anchor-list">
            {physical.anchors.map((id) => {
              const a = anchorRecord(id);
              return (
                <li key={id}>
                  <strong>
                    {id} · {a?.label}
                  </strong>
                  <span>
                    {a?.position} · {a?.source}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
        <p className="studio-related">
          <Link to="/safety">Safety orientation →</Link>
          <Link to="/environment">Environment and sustainability →</Link>
          <Link to="/map">Operational map →</Link>
        </p>
      </section>

      <section
        className="studio-section"
        id="studio-signs"
        tabIndex={-1}
        aria-labelledby="studio-signs-title"
      >
        <div className="studio-heading">
          <h2 id="studio-signs-title">03 / Sign family</h2>
          <span>S-01–S-06 · readable identity first</span>
        </div>
        <label htmlFor="studio-sign">Choose a sign study</label>
        <select
          id="studio-sign"
          value={signId}
          onChange={(e) => setSignId(e.target.value)}
        >
          {signStudies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} · {s.title}
            </option>
          ))}
        </select>
        <figure className="studio-figure">
          <ReferenceImage
            key={signId}
            src={asset(`${sign.id}.svg`)}
            alt={`${sign.id}: ${sign.title}. ${sign.detail}. Concept sign study.`}
            textOnly={textOnly}
          />
          <figcaption>
            <strong>
              {sign.id} / {sign.anchor}
            </strong>
            <span>
              Existing sign family · placement, size and approved content need
              local review.
            </span>
          </figcaption>
        </figure>
        <h3>{sign.title}</h3>
        <p>{sign.detail}</p>
        <p>{sign.job}</p>
        <a href={asset(`${sign.id}.svg`)} target="_blank" rel="noreferrer">
          Open sign vector master ↗
        </a>
      </section>

      <section
        className="studio-section"
        id="studio-packet"
        tabIndex={-1}
        aria-labelledby="studio-packet-title"
      >
        <div className="studio-heading">
          <h2 id="studio-packet-title">04 / Take the reference with you</h2>
        </div>
        <p>
          The static packet includes every composition, sign, proposal, source
          and text equivalent. It works without AI, camera access or the
          interactive studio.
        </p>
        <p className="studio-related">
          <a
            className="pbtn"
            href={asset("index.html")}
            target="_blank"
            rel="noreferrer"
          >
            Open printable reference packet ↗
          </a>
          <a href={asset("reference.md")}>Read the Markdown source</a>
        </p>
        <p className="small">
          ART-07 is a reusable visual master. The final submission report and
          presentation follow in U10. Optional AR and voice remain future
          extensions.
        </p>
        <p className="small">
          Room source: {studioGeometry.meta.revision}. Physical installation,
          products and occupied-room performance are unvalidated.
        </p>
      </section>
    </div>
  );
}
