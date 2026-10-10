// Authored vector studies. Inputs come from the preserved project fixtures/geometry.
export const studioEscape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = studioEscape;
const ink = "#202129",
  paper = "#f3f0e7",
  dark = "#151922",
  trace = "#6ee7c5",
  muted = "#bdc7d9",
  blue = "#343fc6";
const text = (x, y, value, size = 22, fill = ink, extra = "") =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${e(value)}</text>`;
const line = (x1, y1, x2, y2, stroke = ink, extra = "") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
export function studioSamples(reference, rate) {
  if (
    ![3, 20].includes(rate) ||
    !reference ||
    !Number.isFinite(reference.amplitudeV) ||
    reference.amplitudeV <= 0 ||
    !Number.isFinite(reference.frequencyHz) ||
    reference.frequencyHz <= 0 ||
    !Number.isFinite(reference.durationS) ||
    reference.durationS <= 0 ||
    rate * reference.durationS > 200
  )
    throw new Error("Unsupported studio model");
  return Array.from(
    { length: Math.floor(rate * reference.durationS) + 1 },
    (_, index) => {
      const t = index / rate,
        value =
          reference.amplitudeV *
          Math.sin(2 * Math.PI * reference.frequencyHz * t);
      return {
        index,
        t,
        value,
        display: (value + reference.amplitudeV) / (2 * reference.amplitudeV),
      };
    },
  );
}
function shell(title, source, body, height = 900) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="${height}" viewBox="0 0 1280 ${height}" role="img" aria-labelledby="title desc"><title id="title">${e(title)}</title><desc id="desc">${e(source)}. Authored conceptual/reference artwork; text equivalent accompanies this plate.</desc><rect width="1280" height="${height}" fill="${paper}"/><g font-family="Arial, sans-serif">${text(58, 52, "PARALLAX / AUTHORED REFERENCE", 15, ink, 'letter-spacing="2"')}${line(58, 74, 1222, 74, ink)}${text(58, 150, title, 48, ink, 'font-family="Georgia, serif"')}${body}${line(58, height - 78, 1222, height - 78, ink)}${text(58, height - 43, source, 16)}${text(1222, height - 18, "CONCEPT REFERENCE", 14, ink, 'text-anchor="end"')}</g></svg>`;
}
function waveform(reference, rate, x, y, w, h, active = -1, pixels = false) {
  const samples = studioSamples(reference, rate),
    mid = y + h / 2,
    amplitude = h * 0.32,
    compact = w < 250;
  const plot = (frequency) =>
    Array.from(
      { length: 401 },
      (_, n) =>
        `${n ? "L" : "M"}${(x + (w * n) / 400).toFixed(2)} ${(mid - amplitude * Math.sin((2 * Math.PI * frequency * reference.durationS * n) / 400)).toFixed(2)}`,
    ).join(" ");
  const alias =
    reference.frequencyHz - rate * Math.round(reference.frequencyHz / rate);
  return `<rect x="${x - 24}" y="${y - 40}" width="${w + 48}" height="${h + (pixels ? 160 : 110)}" fill="${dark}"/>${line(x, y, x, y + h, muted)}${line(x, mid, x + w, mid, muted, 'stroke-opacity=".25"')}${line(x, y + h, x + w, y + h, muted)}<path d="${plot(reference.frequencyHz)}" fill="none" stroke="${muted}" stroke-width="2.5"/>${Math.abs(alias) !== reference.frequencyHz ? `<path d="${plot(alias)}" fill="none" stroke="#f2c14e" stroke-width="2.5" stroke-dasharray="8 6"/>` : ""}${samples.map((s) => `${line(x + (w * s.t) / reference.durationS, mid, x + (w * s.t) / reference.durationS, mid - (amplitude * s.value) / reference.amplitudeV, trace, 'stroke-opacity=".65"')}<circle cx="${x + (w * s.t) / reference.durationS}" cy="${mid - (amplitude * s.value) / reference.amplitudeV}" r="${s.index === active ? 9 : 5}" fill="${trace}"${s.index === active ? ' stroke="white" stroke-width="3"' : ""}/>`).join("")}${text(x, y - 15, compact ? `${rate} Hz samples` : `${reference.frequencyHz} Hz / ${rate} Hz samples / ${reference.amplitudeV} V`, compact ? 14 : 18, muted)}${text(x, y + h + 32, "0 s", 17, muted)}${text(x + w, y + h + 32, `${reference.durationS} s`, 17, muted, 'text-anchor="end"')}${text(x + 6, mid - amplitude, `+${reference.amplitudeV} V`, compact ? 11 : 15, muted)}${text(x + 6, mid + amplitude, `−${reference.amplitudeV} V`, compact ? 11 : 15, muted)}${!pixels ? text(x, y + h + 58, Math.abs(alias) !== reference.frequencyHz ? `Dashed: ${alias} Hz alias` : "No folded alias", compact ? 12 : 17, "#f2c14e") : text(x, y + h + 105, Math.abs(alias) !== reference.frequencyHz ? `Grey: reference · mint: samples · dashed gold: ${alias} Hz alias` : "Grey: reference · mint: samples", 17, muted)}${pixels ? samples.map((s, i) => `<rect x="${x + (i * w) / samples.length}" y="${y + h + 49}" width="${w / samples.length - 3}" height="38" fill="${trace}" fill-opacity="${s.display.toFixed(4)}" stroke="${i === active ? "white" : muted}" stroke-width="${i === active ? 3 : 1}"/>`).join("") : ""}`;
}
function vision(x, y, w, side) {
  return `<g transform="translate(${x} ${y}) scale(${w / 320})"><rect width="320" height="180" fill="${dark}"/><rect y="142" width="320" height="38" fill="#202936"/>${side ? '<path d="M118 142H196L172 128H118ZM190 142H276L250 130H190ZM262 142H318L300 134H262Z" fill="#05070a"/>' : '<ellipse cx="88" cy="143" rx="34" ry="4" fill="#05070a"/><ellipse cx="168" cy="143" rx="24" ry="4" fill="#05070a"/><ellipse cx="244" cy="143" rx="22" ry="4" fill="#05070a"/>'}<rect x="58" y="92" width="52" height="50" fill="${side ? "#9ba4b4" : "#c9d0dc"}"/><rect x="110" y="92" width="10" height="50" fill="${side ? "#4a5261" : "#b4bccb"}"/><rect x="148" y="78" width="40" height="64" fill="${side ? "#7b8494" : "#c2c9d6"}"/><rect x="174" y="78" width="${side ? 14 : 0}" height="64" fill="${side ? "#3d4553" : "#aeb6c4"}"/><ellipse cx="168" cy="78" rx="20" ry="6" fill="${side ? "#b4bccb" : "#dde2eb"}"/><path d="M224 142L244 100L264 142Z" fill="${side ? "#565e6c" : "#b9c1ce"}"/><g fill="none" stroke="${trace}" stroke-width="1.2" stroke-dasharray="4 3"><rect x="54" y="88" width="70" height="58"/><rect x="144" y="68" width="48" height="78"/><rect x="220" y="96" width="48" height="50"/></g>${text(12, 22, side ? "ILL-L2-v1 / SIDE" : "ILL-L1-v1 / FRONT", 11, muted)}</g>`;
}
function fault(x, y, width = 1050) {
  const nodes = ["C1-CAM", "KIT-C1-v1", "E06 session", "Public consequence"],
    labels = [
      "Component restricted",
      "Whole kit unavailable",
      "Use labelled fallback",
      "Equipment fact only",
    ];
  return nodes
    .map((node, i) => {
      const px = x + (i * width) / 4;
      return `<rect x="${px}" y="${y}" width="${width / 4 - 28}" height="130" fill="${i === 0 ? dark : "none"}" stroke="${ink}"/>${text(px + 14, y + 42, node, 23, i === 0 ? trace : ink)}${text(px + 14, y + 80, labels[i], 16, i === 0 ? muted : ink)}${i < 3 ? line(px + width / 4 - 25, y + 62, px + width / 4 - 4, y + 62, blue, 'stroke-width="3"') : ""}`;
    })
    .join("");
}
function equipmentGlyph(id, x, y) {
  const forms = {
    "CV-02":
      '<rect x="38" y="24" width="180" height="82"/><path d="M128 106v20m-44 0h88"/>',
    C1: '<path d="M50 125V20h158v105m-158-16h158M67 20v89m124-89v89" stroke-dasharray="5 3"/><path d="M93 87h70"/>',
    "C1-CAM":
      '<rect x="61" y="40" width="140" height="72"/><circle cx="132" cy="76" r="27"/><path d="M77 40V28h44v12"/>',
    "C1-L1": '<path d="M91 22h74l24 28-24 28H91L67 50Zm37 56v48m-35 0h70"/>',
    "C1-L2": '<path d="M91 22h74l24 28-24 28H91L67 50Zm37 56v48m-35 0h70"/>',
    "TRP-04":
      '<path d="M105 22h47v16h-47Zm23 16v18m0 0-55 73m55-73 55 73m-55-73v73"/>',
    "CAL-01":
      '<rect x="58" y="24" width="144" height="96"/><path d="M58 56h144M58 88h144M94 24v96m36-96v96m36-96v96"/>',
  };
  return `<g transform="translate(${x} ${y})" fill="none" stroke="${trace}" stroke-width="3">${forms[id] || '<rect x="80" y="32" width="100" height="70"/>'}</g>`;
}
export function studioPlateSvg(
  kind,
  reference,
  kit = [],
  rate = 3,
  active = 0,
) {
  let body = "",
    title = "",
    source = "";
  switch (kind) {
    case "entrance":
      title = "From signal to understanding";
      source = "ART-01 / REF-2HZ-v1 / generated identity study";
      body =
        waveform(reference, 3, 100, 280, 1080, 300, -1, true) +
        text(58, 744, "Signal & Computer Vision Lab", 32) +
        text(
          58,
          784,
          "Continuous reference. Discrete samples. A question worth investigating.",
          22,
        );
      break;
    case "pixel":
      title = "A sample becomes a pixel";
      source = "ART-08 / REF-2HZ-v1 / discrete mathematical display model";
      {
        const samples = studioSamples(reference, rate),
          index = Math.max(0, Math.min(samples.length - 1, Math.trunc(active))),
          s = samples[index];
        body =
          waveform(reference, rate, 100, 280, 1080, 300, index, true) +
          text(
            58,
            728,
            `Sample ${index} / ${samples.length - 1}   t = ${s.t.toFixed(3)} s   v = ${s.value.toFixed(3)} V`,
            25,
          ) +
          text(
            58,
            774,
            `Display = (v + A) / (2A) = ${s.display.toFixed(3)} · not calibrated luminance`,
            21,
          );
        break;
      }
    case "atlas":
      title = "Read the conditions, keep the evidence";
      source = "ART-03 / ILL-L1-v1 + ILL-L2-v1 / prepared illustration atlas";
      body =
        vision(58, 246, 554, false) +
        vision(666, 246, 554, true) +
        text(58, 214, "A / FRONTAL ILLUSTRATION", 18) +
        text(666, 214, "B / SIDE-LIGHT ILLUSTRATION", 18) +
        text(58, 610, "Same framing. Same illustrative objects.", 30) +
        text(
          58,
          666,
          "Changed condition: authored light/shadow treatment.",
          23,
        ) +
        text(58, 710, "C1-CAM / C1-L1 / C1-L2 / CV-02 / KIT-C1-v1", 21) +
        text(
          58,
          761,
          "No camera frames, detector results or measured causal effect.",
          22,
        );
      break;
    case "installation":
      title = "A rhythm above the room";
      source = "ART-02 / ARTWORK-CAND04 / schematic assembly study";
      body = text(58, 213, "ANALOGUE FINS → DISCRETE LIGHT MODULES", 18);
      for (let i = 0; i < 23; i++) {
        const z = Math.sin((2 * Math.PI * i) / 22);
        body += `<path d="M${100 + i * 44} 350v${150 + 65 * z}l22 -16V334Z" fill="${i > 13 ? trace : dark}" stroke="${ink}"/>`;
      }
      body +=
        line(82, 330, 1168, 330, ink, 'stroke-width="8"') +
        text(58, 611, "01 / Separate support frame", 27) +
        text(
          58,
          664,
          "02 / Removable fins and independently replaceable modules",
          25,
        ) +
        text(
          58,
          715,
          "03 / Maintenance, suspension, glare and fire review required",
          25,
        ) +
        text(
          58,
          766,
          "SPN overhead candidate · no mounting loads or fabrication dimensions",
          21,
        );
      break;
    case "signal-story":
    case "vision-story": {
      const signal = kind === "signal-story";
      title = signal
        ? "Predict before sampling"
        : "Change the light, own the interpretation";
      source = signal
        ? "ART-04 / E01 / REF-2HZ-v1 / authored learning sequence"
        : "ART-04 / E06 / prepared illustrations / authored learning sequence";
      const steps = ["Predict", "Prepare", "Observe", "Compare", "Reflect"];
      for (let i = 0; i < 5; i++) {
        const x = 58 + i * 242;
        body +=
          text(x, 228, `0${i + 1}`, 18, blue) + text(x, 272, steps[i], 32);
        if (i === 0 || i === 1 || i === 4) {
          body += `<rect x="${x}" y="320" width="218" height="218" fill="${dark}"/>`;
          if (i === 0)
            body +=
              text(
                x + 109,
                422,
                "?",
                86,
                trace,
                'text-anchor="middle" font-family="Georgia,serif"',
              ) + text(x + 18, 501, "STATE A PREDICTION", 13, muted);
          if (i === 1)
            body +=
              text(x + 18, 367, signal ? "KIT-S1-v1" : "KIT-C1-v1", 25, trace) +
              text(x + 18, 412, "Match every member", 16, muted) +
              line(x + 18, 443, x + 196, 443, muted) +
              text(x + 18, 488, "Then check readiness", 16, muted);
          if (i === 4)
            body +=
              text(x + 18, 364, "Observation", 19, trace) +
              line(x + 18, 381, x + 196, 381, muted) +
              text(x + 18, 421, "Interpretation", 19, trace) +
              line(x + 18, 438, x + 196, 438, muted) +
              text(x + 18, 479, "Limit of the reference", 16, muted) +
              line(x + 18, 500, x + 196, 500, muted);
        } else if (signal) {
          const rr = i === 3 ? 20 : 3;
          body += waveform(reference, rr, x + 24, 352, 164, 116, -1, false);
        } else body += vision(x, 320, 218, i === 3);
        body += text(
          x,
          589,
          signal
            ? [
                "State a sampling idea",
                "Match KIT-S1-v1",
                "3 Hz samples",
                "20 Hz samples",
                "Write your reasoning",
              ][i]
            : [
                "State a light prediction",
                "Match the complete kit",
                "Frontal illustration",
                "Side-light illustration",
                "Own the interpretation",
              ][i],
          17,
        );
      }
      body +=
        text(
          58,
          716,
          "Prediction → setup → observation → comparison → supported reflection",
          25,
        ) +
        text(
          58,
          768,
          "Generated/illustrative references do not replace the physical experiment.",
          22,
        );
      break;
    }
    case "equipment":
      title = "Every part belongs to the kit";
      source = "ART-05 / KIT-C1-v1 / schematic identity plate";
      body = text(
        58,
        214,
        "COMPLETE MANIFEST / NOT A CURRENT AVAILABILITY RECORD",
        18,
      );
      kit.forEach((id, i) => {
        const x = 58 + (i % 4) * 304,
          y = 262 + Math.floor(i / 4) * 236;
        body += `<rect x="${x}" y="${y}" width="260" height="140" fill="${dark}"/>${equipmentGlyph(id, x, y)}${text(x, y + 181, id, 29)}`;
      });
      body += text(
        58,
        771,
        "Schematic forms; both individual lights remain required.",
        22,
      );
      break;
    case "wayfinding":
      title = "One vocabulary from door to return";
      source = "ART-06 / S-01–S-06 / P7-A sign family";
      {
        const names = [
            "S-01 / Entrance",
            "S-02 / Zone",
            "S-03 / Station",
            "S-04 / Asset",
            "S-05 / Restriction",
            "S-06 / Safety",
          ],
          copy = [
            "PARALLAX",
            "C1 · Capture",
            "CV-02",
            "C1-CAM",
            "Kit unavailable",
            "FE-1 · Landmark",
          ];
        names.forEach((name, i) => {
          const x = 58 + (i % 3) * 406,
            y = 242 + Math.floor(i / 3) * 248;
          body +=
            line(x, y, x + 358, y, ink, 'stroke-width="3"') +
            text(x, y + 37, name, 18) +
            text(x, y + 93, copy[i], 34) +
            text(
              x,
              y + 144,
              i === 4
                ? "Equipment consequence only"
                : "Concept sign / review before installation",
              17,
            );
        });
        body += text(
          58,
          777,
          "Exact IDs connect the room, task and readable fallback.",
          22,
        );
        break;
      }
    case "report":
      title = "Evidence first, interpretation second";
      source =
        "ART-07 / reusable report + presentation master / prepared references";
      body =
        waveform(reference, 3, 100, 270, 666, 230) +
        text(837, 247, "FIGURE / SOURCE", 18, blue) +
        text(837, 299, "01 / Generated signal", 23) +
        text(837, 352, "2 Hz reference", 22) +
        text(837, 395, "3 Hz sampling", 22) +
        text(837, 445, `${reference.durationS} second interval`, 22) +
        text(837, 519, "No measured data", 22) +
        fault(58, 633, 1164);
      break;
    default:
      throw new Error("Unknown authored plate");
  }
  return shell(title, source, body);
}
export function studioSignSvg(sign) {
  const danger = sign.id === "S-05";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" viewBox="0 0 1200 440" role="img"><title>${e(sign.id + " / " + sign.title)}</title><desc>${e(sign.job)} Concept sign study, not installed or approved signage.</desc><rect width="1200" height="440" fill="${paper}"/><rect width="18" height="440" fill="${danger ? "#8f391d" : blue}"/><g font-family="Arial, sans-serif">${text(58, 62, `${sign.id} / ${sign.anchor} / CONCEPT SIGN STUDY`, 18)}${text(58, 170, sign.title, 64, ink, 'font-family="Georgia, serif"')}${text(58, 258, sign.detail, 30)}${line(58, 320, 1142, 320, ink)}${text(58, 382, "Readable ID first · review size, placement and approved content before installation", 21)}</g></svg>`;
}
export function studioPlanSvg(geometry, layer) {
  if (
    ![
      "orientation",
      "emergency",
      "cctv",
      "ventilation",
      "installation",
    ].includes(layer)
  )
    throw new Error("Unknown physical layer");
  const sx = 74,
    sy = 228,
    scale = 92,
    project = (x, y) => [sx + x * scale, sy + y * scale];
  let body = "";
  for (const z of geometry.zones) {
    const [x, y] = project(z.x, z.y);
    body += `<rect x="${x}" y="${y}" width="${z.w * scale}" height="${z.d * scale}" fill="${z.id === "SPN" ? "#e7e4d5" : "none"}" stroke="#a5a59e"/>`;
  }
  for (const f of geometry.furniture) {
    const [x, y] = project(f.x, f.y);
    body += `<rect x="${x}" y="${y}" width="${f.w * scale}" height="${f.d * scale}" fill="#dedfd6" stroke="#888d88"/>`;
  }
  for (const z of geometry.zones) {
    const [x, y] = project(z.x, z.y);
    const tx =
      z.id === "SPN"
        ? x + z.w * scale * 0.6
        : z.id === "CMP"
          ? x + z.w * scale * 0.5
          : x + 8;
    body += text(
      tx,
      y + z.d * scale - 14,
      z.id,
      18,
      ink,
      'paint-order="stroke" stroke="' + paper + '" stroke-width="4"',
    );
  }
  for (const floor of geometry.accessible_clear_floors) {
    const [x, y] = project(floor.x, floor.y);
    body += `<rect x="${x}" y="${y}" width="${floor.w * scale}" height="${floor.d * scale}" fill="none" stroke="${blue}" stroke-width="2" stroke-dasharray="6 4"/>${text(x + 8, y + 20, floor.id, 14, blue)}`;
  }
  for (const circle of geometry.turning_circles) {
    const [x, y] = project(circle.cx, circle.cy);
    body += `<circle cx="${x}" cy="${y}" r="${circle.r * scale}" fill="none" stroke="${blue}" stroke-width="2" stroke-dasharray="6 4"/>${text(x, y + 5, circle.id, 17, blue, 'text-anchor="middle"')}`;
  }
  const [right, bottom] = project(
    geometry.meta.room.width,
    geometry.meta.room.depth,
  );
  body += `<rect x="${sx}" y="${sy}" width="${right - sx}" height="${bottom - sy}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  for (const o of geometry.openings) {
    if (o.wall === "S") {
      const [a, b] = project(o.from, geometry.meta.room.depth);
      body +=
        line(a, b, a + (o.to - o.from) * scale, b, blue, 'stroke-width="8"') +
        text(a, b + 30, o.id, 20);
    } else {
      const [x, y] = project(
        o.wall === "W" ? 0 : geometry.meta.room.width,
        o.from,
      );
      body +=
        line(x, y, x, y + (o.to - o.from) * scale, blue, 'stroke-width="8"') +
        text(o.wall === "W" ? x - 47 : x + 12, y + 45, o.id, 20);
    }
  }
  const points =
    layer === "emergency"
      ? geometry.safety.filter((p) => p.type !== "cctv")
      : layer === "cctv"
        ? geometry.safety.filter((p) => p.type === "cctv")
        : layer === "ventilation"
          ? geometry.services.filter((p) =>
              ["supply", "extract"].includes(p.type),
            )
          : [];
  for (const p of points) {
    const [x, y] = project(p.x, p.y);
    body += `<circle cx="${x}" cy="${y}" r="9" fill="${layer === "emergency" ? "#8f391d" : blue}" stroke="${paper}" stroke-width="2"/>`;
    const west = p.x < 5,
      tx = west ? x + 18 : x - 18;
    body += text(
      tx,
      p.id === "CCTV-1" ? y + 24 : y - 12,
      p.id,
      17,
      ink,
      `text-anchor="${west ? "start" : "end"}"`,
    );
  }
  if (layer === "cctv") {
    const cam = geometry.furniture.find((f) => f.id === "C1-CAM");
    const [x, y] = project(cam.x + cam.w / 2, cam.y + cam.d / 2);
    body += `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="${dark}"/>${text(x + 18, y + 5, "C1-CAM", 18)}`;
  }
  body +=
    text(1064, 256, "P4-D", 24) +
    text(1064, 299, "10 × 7 m", 21) +
    text(1064, 351, "NW origin", 18) +
    text(1064, 390, "x east", 18) +
    text(1064, 427, "y south", 18) +
    text(1064, 507, "Concept", 21) +
    text(1064, 544, "positions", 21) +
    text(1064, 609, "No new", 18) +
    text(1064, 647, "footprints", 18);
  const note =
    layer === "cctv"
      ? "Camera coverage and privacy policy unverified; no coverage cones drawn."
      : layer === "ventilation"
        ? "Terminal markers show concept positions, not measured airflow."
        : layer === "installation"
          ? "SPN stays a circulation zone. Overhead mounting requires qualified review."
          : "Existing landmarks and clear floors retained. This is not an approved emergency plan.";
  body +=
    text(58, 954, note, 21) +
    text(
      58,
      997,
      "Use the accompanying anchor list, source labels and responsible review owner.",
      20,
    );
  return shell(
    `${layer === "cctv" ? "CCTV" : layer[0].toUpperCase() + layer.slice(1)} / physical reference`,
    "Canonical P4-D geometry / concept only",
    body,
    1100,
  );
}
