const fs = require("node:fs");
const path = require("node:path");
const {
  deskRunbooks,
  operatingOwners,
} = require("../src/data/operationsRunbooks.ts");
const out = path.join(__dirname, "../public");
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const heading = "PARALLAX · U07 operating reference";
const options = [
  [
    "Manual reference + local prototype",
    "Essential reference and domain rehearsal",
    "Guide owner, local source and browser recovery; no authoritative shared records",
  ],
  [
    "Local guide Q&A",
    "Cited public-guide passages",
    "Ollama/model availability and source review; evidence remains browser-only",
  ],
  [
    "Shared operational records",
    "Cross-user allocation, permissions and acknowledgements",
    "Institutional identity, approved policy, durable transactions, backup and reconciliation; not delivered by the browser exercise",
  ],
  [
    "Registered device integration",
    "Actual observations and controlled acquisition",
    "Approved source registration, measured units/times, installation/calibration and maintenance; not delivered by simulated sensor views",
  ],
];
const costs = [
  "Sensors and meters",
  "Installation, electrical and network review",
  "Calibration and source validation",
  "Furniture, finishes and wayfinding maintenance",
  "Asset production and document updates",
  "Hosting, persistent storage, backup and monitoring",
  "AI runtime / local power / model and source maintenance",
  "Staff training, support, handover and absence cover",
  "Equipment replacement, accessibility review and recovery rehearsals",
];
const intro =
  "Local designer-reviewed demonstrator. Staff roles are previews; institutional policy/identity systems remain the authority for real operation. No participant or site-owner review is claimed. Use this reference with the same action rules and source labels as the interface.";
let markdown = `# ${heading}\n\n3 October 2026 · ${intro}\n\n## Owners and absence cover\n\n`;
for (const o of operatingOwners)
  markdown += `### ${o.task}\n\nOwner: ${o.owner}. Backup: ${o.backup}.\n\nRecord: ${o.record}. Existing local route: ${o.route}.\n\n`;
for (const r of deskRunbooks)
  markdown += `## ${r.title}\n\nSymptom: ${r.symptom}\n\nPreserve: ${r.preserve}\n\nOwner: ${r.owner}\n\nDiagnostics: ${r.diagnostic}\n\nRecovery: ${r.recovery}\n\nVerify: ${r.verify}\n\n`;
markdown +=
  "## Operating options\n\n| Option | Benefit | Dependency / boundary |\n|---|---|---|\n" +
  options.map((row) => "| " + row.join(" | ") + " |").join("\n") +
  "\n\n## Unpriced cost and operating-effort categories\n\n";
markdown +=
  costs
    .map(
      (c) =>
        `- ${c}: owner, effort, supplier/site evidence and price remain unconfirmed.`,
    )
    .join("\n") +
  "\n\nNo procurement recommendation, price, metered saving or operational approval is implied. Before a pilot, assign the reconciliation owner and authoritative record, approve retention/access, test backup and transaction recovery, and confirm qualified staff coverage. Avoid double entry without a reconciliation plan.\n";
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${heading}</title><style>body{margin:0;background:#f3f0e7;color:#202129;font:17px/1.65 system-ui,sans-serif}main{max-width:980px;margin:auto;padding:40px 24px}h1,h2{font-family:Georgia,serif;font-weight:400;line-height:1.2}h1{font-size:42px}h2{font-size:28px;border-top:1px solid #68686c;padding-top:24px}h3{font-size:19px}dt{font-weight:600}dd{margin:8px 0 18px}article{margin-bottom:32px}a{color:#293ac5}table{border-collapse:collapse;width:100%;font-size:15px}th,td{text-align:left;border-bottom:1px solid #aaa;padding:14px;vertical-align:top}.table-wrap{overflow:auto}table{min-width:650px}.small{font-size:14px}.k{font:12px/1.5 monospace;text-transform:uppercase;letter-spacing:.1em}button{font:inherit;padding:10px 18px;background:none;border:1px solid #68686c;cursor:pointer}@media print{body{background:white;color:black;font-size:11pt}main{padding:0;max-width:none}.actions{display:none}article{break-inside:avoid}h2{break-after:avoid}table{min-width:0;font-size:9pt}.table-wrap{overflow:visible}a{color:inherit}}</style><main><p class="k">U07 · local operating reference · 3 October 2026</p><h1>Know what to preserve.<br>Know who acts next.</h1><p>${escape(intro)}</p><div class="actions"><a href="./index.html#/operations">Return to operations desk</a> · <a href="./operations-runbook.md">Markdown copy</a> · <button onclick="window.print()">Print this reference</button></div><h2>Owners and absence cover</h2>${operatingOwners.map((o) => `<article><h3>${escape(o.task)}</h3><p><b>Owner:</b> ${escape(o.owner)}<br><b>Backup:</b> ${escape(o.backup)}</p><p>${escape(o.record)}</p></article>`).join("")}${deskRunbooks
  .map(
    (r) =>
      `<article><h2>${escape(r.title)}</h2><dl>${[
        ["Symptom", r.symptom],
        ["Preserve", r.preserve],
        ["Responsible owner", r.owner],
        ["Diagnostic evidence", r.diagnostic],
        ["Permitted recovery", r.recovery],
        ["Verify", r.verify],
      ]
        .map(([k, v]) => `<dt>${k}</dt><dd>${escape(v)}</dd>`)
        .join("")}</dl></article>`,
  )
  .join(
    "",
  )}<h2>Operating options</h2><div class="table-wrap" role="region" aria-label="Operating options comparison" tabindex="0"><table><caption>Benefit and added responsibility</caption><thead><tr><th scope="col">Option</th><th scope="col">Benefit</th><th scope="col">Dependency / boundary</th></tr></thead><tbody>${options.map((row) => `<tr>${row.map((c, i) => (i === 0 ? `<th scope="row">${escape(c)}</th>` : `<td>${escape(c)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div><h2>Unpriced cost and operating-effort categories</h2><ul>${costs.map((c) => `<li>${escape(c)}: owner, effort, supplier/site evidence and price remain unconfirmed.</li>`).join("")}</ul><p>No procurement recommendation, price, metered saving or operational approval is implied. Before a pilot, assign the reconciliation owner and authoritative record, approve retention/access, test backup and transaction recovery, and confirm qualified staff coverage. Avoid double entry without a reconciliation plan.</p></main></html>`;
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "operations-runbook.md"), markdown);
fs.writeFileSync(path.join(out, "operations-runbook.html"), html);
console.log(
  `U07 reference: ${deskRunbooks.length} recovery runbooks, ${operatingOwners.length} owners, four operating options and nine unpriced categories generated from the UI source.`,
);
