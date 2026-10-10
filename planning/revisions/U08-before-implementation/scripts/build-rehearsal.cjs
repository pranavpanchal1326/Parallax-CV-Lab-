// Preserve the validated Scene Studio calculation; constrain only its rehearsal controls.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../../..");
const target = path.join(root, "apps/lab-web/public/scene-rehearsal");
fs.mkdirSync(target, { recursive: true });
let html = fs.readFileSync(
  path.join(root, "design/phase-08/scene-studio.html"),
  "utf8",
);
html = html
  .replace('src="../theme.js"', 'src="/design/theme.js"')
  .replace(/href="assets\//g, 'href="/design/phase-08/assets/')
  .replace('href="../edition.css"', 'href="/design/edition.css"')
  .replace(/\.\/node_modules\/three\//g, "/design/phase-08/node_modules/three/")
  .replace('src="assets/scene-studio.js"', 'src="model.js"')
  .replace(
    /<header[\s\S]*?<\/header>/,
    '<header class="shell mast"><span class="mast-brand">PARALLAX · fixed geometry rehearsal</span></header>',
  )
  .replace('href="#presets"', 'href="#h-cam"')
  .replace("Skip to presets", "Skip to model views")
  .replace(
    "Positions are measured in C1, so a setting can be reproduced at the real tripod.",
    "Only horizontal field of view differs from the 40° baseline. P4-D is conceptual geometry; no physical setup is changed or validated.",
  )
  .replace(
    "EVIDENCE SNAPSHOTS · THIS SESSION ONLY",
    "MODEL ONLY · NO EVIDENCE CAPTURE",
  )
  .replace(
    "</head>",
    "<style>.controls,.snaps{display:none}.st-head h1{font-size:32px}.st-wrap{padding-top:24px}</style></head>",
  );
fs.writeFileSync(path.join(target, "index.html"), html);
let model = fs.readFileSync(
  path.join(root, "design/phase-08/assets/scene-studio.js"),
  "utf8",
);
model = model.replace(
  "'../../spatial/lab_geometry.json'",
  "'/spatial/lab_geometry.json'",
);
model = model.replace(
  "and every preset still works.",
  "and the React field-of-view choices still work.",
);
// Allowlisted query and held constants: keep original approximation/WebGL algorithms unchanged.
const begin = model.indexOf("for (const c of CONTROLS) if (q.has(c.key))");
const end = model.indexOf("let lastChanged", begin);
if (begin < 0 || end < 0)
  throw new Error("Scene Studio query contract changed");
model =
  model.slice(0, begin) +
  "P = { ...DEFAULT, fov: [18, 40, 90].includes(Number(q.get('fov'))) ? Number(q.get('fov')) : 40 };\n" +
  model.slice(end);
model += `
// Hide and disable every mutable model control. The React parent chooses the single variable.
for (const control of document.querySelectorAll('.controls input,.controls button')) control.disabled = true;
document.querySelector('#h-cam').tabIndex = -1;
`;
fs.writeFileSync(path.join(target, "model.js"), model);
console.log(
  "U05 fixed-field-of-view Scene Studio generated; original geometry calculations retained.",
);
