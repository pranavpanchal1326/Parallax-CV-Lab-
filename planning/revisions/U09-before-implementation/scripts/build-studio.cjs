const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const root = path.resolve(__dirname, "../../..");
const read = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
async function build() {
  const catalog = read("apps/lab-shared/studio-catalog.json");
  const fixtures = read("prototype/fixtures.json"),
    geometry = read("spatial/lab_geometry.json");
  const {
    studioPlateSvg,
    studioSignSvg,
    studioPlanSvg,
    studioEscape: e,
  } = await import(
    pathToFileURL(path.join(root, "apps/lab-shared/studio-graphics.mjs"))
  );
  const target = path.join(root, "apps/lab-web/public/studio");
  fs.mkdirSync(target, { recursive: true });
  const reference = fixtures.experiments.E01.source,
    k = fixtures.kits[fixtures.experiments.E06.kit];
  const kit = [...k.fixed, ...k.portable].flatMap(
    (item) => item.members || [item.id],
  );
  const save = (name, content) =>
    fs.writeFileSync(path.join(target, name), content);
  const paragraphs = (label, value) => `<h3>${e(label)}</h3><p>${e(value)}</p>`;
  let html = "",
    md =
      "# PARALLAX / U08 art and physical reference\n\nAuthored vector compositions and conceptual proposals · 3 October 2026. No installation, actual acquisition, surveillance coverage or occupied-room performance is certified. Operational records remain in their original workflows.\n\n";
  for (const p of catalog.artPlates) {
    save(`${p.file}.svg`, studioPlateSvg(p.kind, reference, kit));
    html += `<section id="${p.file}"><p class="kicker">${p.file}</p><h2>${e(p.title)}</h2><figure><img src="${p.file}.svg" alt="${e(p.equivalent)}"><figcaption>${e(p.source)}</figcaption></figure>${paragraphs("Visual job", p.job)}${paragraphs("Text reference", p.equivalent)}${paragraphs("Scale and use", p.scale)}<p><a href="${p.file}.svg">Full-size vector master</a> · <a href="../index.html#${e(p.route)}">Related workflow</a></p></section>`;
    md += `## ${p.file} / ${p.title}\n\n${p.job}\n\nText reference: ${p.equivalent}\n\nSource: ${p.source}\n\nScale: ${p.scale}\n\n[Vector master](${p.file}.svg) · [Related workflow](../index.html#${p.route})\n\n`;
  }
  save("ART-08-20Hz.svg", studioPlateSvg("pixel", reference, kit, 20, 0));
  const layers = [...new Set(catalog.physicalStudies.map((p) => p.layer))];
  for (const layer of layers)
    save(`plan-${layer}.svg`, studioPlanSvg(geometry, layer));
  for (const p of catalog.physicalStudies) {
    const anchors = p.anchors.map((id) => {
      let a = geometry.openings.find((a) => a.id === id);
      if (a) return `${id}: ${a.name}, ${a.wall} wall ${a.from}–${a.to} m`;
      a = geometry.zones.find((a) => a.id === id);
      if (a) return `${id}: ${a.name}, x ${a.x}, y ${a.y}, ${a.w} × ${a.d} m`;
      a = [...geometry.safety, ...geometry.services].find((a) => a.id === id);
      if (a) return `${id}: ${a.label}, x ${a.x}, y ${a.y} m`;
      a = geometry.furniture.find((a) => a.id === id);
      if (a) return `${id}: ${a.type}, x ${a.x}, y ${a.y}, ${a.w} × ${a.d} m`;
      a = geometry.turning_circles.find((a) => a.id === id);
      if (a) return `${id}: centre ${a.cx}, ${a.cy} m; radius ${a.r} m`;
      a = geometry.accessible_clear_floors.find((a) => a.id === id);
      if (a)
        return `${id}: ${a.station} approach, x ${a.x}, y ${a.y}, ${a.w} × ${a.d} m`;
      throw new Error(`Unknown physical anchor ${id}`);
    });
    html += `<section><p class="kicker">${p.id}</p><h2>${e(p.title)}</h2><figure><img src="plan-${p.layer}.svg" alt="P4-D concept geometry. Exact anchors follow in text."><figcaption>P4-D concept / north-west origin / x east, y south / assumed 10 × 7 m</figcaption></figure>${paragraphs("Proposal", p.proposal)}${paragraphs("Review owner", p.owner)}${paragraphs("Before physical use", p.review)}${paragraphs("Accessible fallback", p.fallback)}<h3>Exact anchors</h3><ul>${anchors.map((a) => `<li>${e(a)}</li>`).join("")}</ul><a href="plan-${p.layer}.svg">Full-size plan</a></section>`;
    md += `## ${p.id} / ${p.title}\n\nProposal: ${p.proposal}\n\nOwner: ${p.owner}\n\nBefore physical use: ${p.review}\n\nFallback: ${p.fallback}\n\nAnchors (P4-D concept, NW origin; x east/y south):\n\n${anchors.map((a) => "- " + a).join("\n")}\n\n[Full-size plan](plan-${p.layer}.svg)\n\n`;
  }
  for (const s of catalog.signStudies) {
    save(`${s.id}.svg`, studioSignSvg(s));
    html += `<section><p class="kicker">${s.id} / ${s.anchor}</p><h2>${e(s.title)}</h2><figure><img src="${s.id}.svg" alt="${e(s.title + ". " + s.detail)}"><figcaption>P7-A family / concept sign study</figcaption></figure><p>${e(s.detail)}</p><p>${e(s.job)}</p><p>Review size, placement and approved content before installation.</p><a href="${s.id}.svg">Full-size sign master</a></section>`;
    md += `## ${s.id} / ${s.title}\n\n${s.detail}\n\nAnchor: ${s.anchor} · P7-A family / P4-D destination\n\n${s.job}\n\nReview size, placement and approved content before installation.\n\n[Vector master](${s.id}.svg)\n\n`;
  }
  const sampleRows = [3, 20].map((rate) => {
    const count = rate * reference.durationS + 1;
    return `${rate} Hz = ${count} samples including both endpoints. For v = A sin(2πft), display = (v + A)/(2A). A = ${reference.amplitudeV} V, f = ${reference.frequencyHz} Hz, duration ${reference.durationS} s. Generated model, not calibrated luminance.`;
  });
  md +=
    "## Interactive study equivalent\n\n" +
    sampleRows.join("\n\n") +
    "\n\n[20 Hz static master](ART-08-20Hz.svg) · Both masters select sample 0. No autoplay.\n\nART-07 is a reusable visual master; the final report and deck follow in U10. Optional AR/voice remain future extensions.\n";
  save("reference.md", md);
  save(
    "index.html",
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PARALLAX / U08 reference packet</title><style>:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f3f0e7;color:#202129;font:17px/1.7 Arial,sans-serif}main{max-width:1160px;padding:32px 24px;margin:auto}h1,h2{font-family:Georgia,serif;line-height:1.16;font-weight:400}h1{font-size:clamp(38px,6vw,72px)}h2{font-size:clamp(28px,4vw,42px)}h3,.kicker{font-size:14px}a{color:#343fc6}a:focus-visible,summary:focus-visible{outline:3px solid #343fc6;outline-offset:4px}section{border-top:1px solid #202129;padding-top:24px;margin-top:48px}figure{margin:24px 0;border:1px solid #aaa79f}img{display:block;width:100%;height:auto}figcaption{padding:12px;font-size:14px}p,li{overflow-wrap:anywhere}nav{display:flex;flex-wrap:wrap;gap:16px}details{margin-block:20px}summary{cursor:pointer;min-height:44px}body.text-only img{display:none}@media print{section{break-before:page}nav,button,details{display:none}}button{font:inherit;min-height:44px;background:#f3f0e7;color:#202129;border:1px solid;padding:8px 12px}</style></head><body><main><p class="kicker">PARALLAX / U08 / 03 OCT 2026</p><h1>Make the science visible.</h1><p>Authored vector compositions, readable signs and physical proposals. Text equivalents and source labels accompany every figure. Room P4-D is conceptual; actual installation and occupied-room performance remain unvalidated.</p><nav aria-label="Reference navigation"><a href="../index.html#/studio">Return to the studio</a><a href="reference.md">Markdown reference</a><a href="ART-08-20Hz.svg">20 Hz master</a></nav><details><summary>Read the packet without images</summary><p>All figure meanings remain in the accompanying text.</p><button type="button" onclick="document.body.classList.toggle('text-only');this.textContent=document.body.classList.contains('text-only')?'Show figures':'Hide figures'">Hide figures</button></details>${html}<section><h2>Interactive study equivalent</h2>${sampleRows.map((p) => `<p>${e(p)}</p>`).join("")}<p>Both exported masters select sample 0. No autoplay. ART-07 is a reusable visual master; the final report and deck follow in U10. Optional AR/voice remain future extensions.</p></section></main></body></html>`,
  );
  save(
    "manifest.json",
    JSON.stringify(
      {
        phase: "U08",
        plates: catalog.artPlates.map((p) => p.file),
        signs: catalog.signStudies.map((s) => s.id),
        layers,
        reference,
        kit,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    "U08: 10 art SVGs, 6 sign SVGs, 5 canonical plan SVGs and HTML/Markdown text packet generated.",
  );
}
build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
