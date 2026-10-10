const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const hash = (file) =>
  crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, file)))
    .digest("hex");
const json = (file) => JSON.parse(read(file));
const catalog = json("apps/lab-shared/studio-catalog.json"),
  browser = json("apps/lab-web/evidence/u08-browser-review.json"),
  fixtures = json("prototype/fixtures.json");
const baseline = json(
  "planning/revisions/U08-before-implementation/manifest.json",
);
const allowed = new Set([
  "apps/lab-web/src/main.tsx",
  "apps/lab-web/src/styles/app.css",
  "apps/lab-web/src/features/Safety.tsx",
  "apps/lab-web/src/features/Assets.tsx",
]);
let unchanged = 0;
for (const row of baseline.files)
  if (hash(row.path) === row.sha256) unchanged++;
  else assert.ok(allowed.has(row.path), `Unexpected source change ${row.path}`);
assert.equal(unchanged, 57);
assert.equal(catalog.artPlates.length, 9);
assert.equal(catalog.signStudies.length, 6);
assert.equal(catalog.physicalStudies.length, 6);
const expected = [
  ...catalog.artPlates.map((p) => p.file),
  "ART-08-20Hz",
  ...catalog.signStudies.map((s) => s.id),
  ...new Set(catalog.physicalStudies.map((p) => "plan-" + p.layer)),
];
assert.equal(expected.length, 21);
const packet = read("apps/lab-web/public/studio/index.html"),
  markdown = read("apps/lab-web/public/studio/reference.md");
for (const name of expected) {
  const file = "studio/" + name + ".svg";
  assert.equal(
    read("apps/lab-web/public/" + file),
    read("apps/lab-web/dist/" + file),
  );
  const row = browser.art.find((a) => a.file === name + ".svg");
  assert.ok(row && !row.hasParseError && row.craftReviewed, name);
  assert.ok(
    fs.statSync(
      path.join(root, "apps/lab-web/evidence/u08-art/" + name + ".png"),
    ).size > 5000,
  );
}
for (const p of catalog.artPlates) {
  assert.ok(packet.includes(p.file));
  assert.ok(markdown.includes(p.equivalent));
  assert.ok(markdown.includes(p.source));
}
for (const p of catalog.physicalStudies) {
  assert.ok(markdown.includes(p.proposal));
  assert.ok(markdown.includes(p.review));
  assert.ok(markdown.includes(p.owner));
  for (const id of p.anchors) assert.ok(markdown.includes(id + ":"));
}
for (const s of catalog.signStudies) {
  assert.ok(markdown.includes(s.detail));
  assert.ok(markdown.includes(s.job));
}
const manifest = json("apps/lab-web/public/studio/manifest.json");
const fingerprints = json("apps/lab-web/evidence/u08-art-manifest.json");
assert.equal(fingerprints.artifacts.length, 23);
for (const row of fingerprints.sourceFiles) assert.equal(hash(row.file), row.sha256);
for (const row of fingerprints.artifacts) {
  assert.equal(hash("apps/lab-web/public/studio/" + row.file), row.sha256);
  assert.equal(hash("apps/lab-web/dist/studio/" + row.file), row.sha256);
  if (row.renderSha256) assert.equal(hash("apps/lab-web/evidence/u08-art/" + row.file.replace(".svg", ".png")), row.renderSha256);
}
assert.deepEqual(manifest.reference, fixtures.experiments.E01.source);
assert.equal(manifest.reference.id, "REF-2HZ-v1");
assert.deepEqual(manifest.kit, [
  "CV-02",
  "C1",
  "C1-CAM",
  "C1-L1",
  "C1-L2",
  "TRP-04",
  "CAL-01",
]);
assert.ok(browser.audits.length >= 9);
assert.ok(browser.audits.every((a) => a.violations.length === 0));
assert.ok(browser.reflow.length >= 12);
assert.ok(browser.reflow.every((r) => r.document <= r.viewport));
for (const width of [320, 768, 1366])
  assert.ok(browser.reflow.some((r) => r.viewport === width));
assert.equal(browser.applicationConsole.length, 0);
assert.ok(
  browser.svgViewerControl.some((r) => r.message.includes("'animation'")),
);
assert.ok(
  browser.standaloneSvgConsole.every((r) => r.message.includes("'animation'")),
);
const check = (name) => {
  const row = browser.checks.find((r) => r.name === name);
  assert.ok(row, `Missing check ${name}`);
  return row;
};
assert.equal(
  check("safety baseline preserved with optional reference link")
    .sameOriginalText,
  true,
);
assert.equal(
  check("safety baseline preserved with optional reference link")
    .originalLandmarks,
  11,
);
assert.equal(check("20 Hz selected sample and full text table").rows, 22);
assert.match(
  check("20 Hz selected sample and full text table").status,
  /0.951 V.*0.100 s.*0.976/,
);
assert.equal(check("missing figures recover in isolated copy").messages, 3);
assert.equal(check("missing figures recover in isolated copy").choices, true);
assert.equal(check("independent packet text mode").visibleFigures, 0);
assert.ok(
  check("independent packet images and source sections").images.every(
    (i) => i.loaded,
  ),
);
assert.equal(
  check("independent packet images and source sections").sections,
  22,
);
for (const p of catalog.artPlates)
  assert.equal(check("studio selection " + p.file).loaded, true);
for (const route of [
  "dashboard",
  "environment",
  "map",
  "bookings",
  "E01/rehearsal",
  "E06/conditions",
  "walkthrough",
  "operations",
  "assistant",
]) {
  const row = check("preserved route /" + route);
  assert.equal(row.renderError, false);
  assert.match(row.activity, /Activity · 0/);
}
console.log(
  "U08 integrity: 57/61 tracked files byte-identical; 4 scoped links/route/style changes; 21 rendered vector masters; 9 clean automated scans; 12 reflow checks; preserved previous routes and isolated image recovery. Standalone SVG viewer limitation retained.",
);
