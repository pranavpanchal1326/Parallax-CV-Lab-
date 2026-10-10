const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, value) => fs.writeFileSync(path.join(root, name), value);
const prefix = 'design/figma-build/phase-06/';
const audit = JSON.parse(read(prefix + 'native-audit.json'));
const final = JSON.parse(read(prefix + 'finalization-result.json'));
for (const frame of audit.frames) frame.name = final.frames.find(x => x.id === frame.id).name;
audit.flowStartingPoints = final.flowStartingPoints;
audit.finalization = 'Only frame names and page flow-start metadata changed after geometry/reaction audit.';
write(prefix + 'native-audit.json', JSON.stringify(audit, null, 2) + '\n');
let helper = read(prefix + 'composition.helpers.js');
const replacements = [
  ["txt(num,index,'Heading','action');", "txt(num,index,'Heading','action',48);"],
  ["[duration+' s',x1-35,208,60]", "[duration+' s',x1-35,208,51]"],
  ["['GEN-2HZ','Generated reference','included']", "['REF-2HZ-v1','Generated reference','included']"]
];
for (const [from, to] of replacements) {
  if (!helper.includes(from) && !helper.includes(to)) throw new Error('Helper source changed: ' + from);
  helper = helper.replace(from, to);
}
write(prefix + 'composition.helpers.js', helper);
let brief = read('.design/brief.md');
brief = brief.replace(/^Current build:.*$/m, 'Current build: P6-A core student design prototype built in the canonical Figma file on 2 October 2026. A separate Phase 6 page connects 27 product views through vision and signal journeys, including eight recovery branches and example submission receipts. The original 40-family / 87-variant library and all 11 P5-B compositions remain present. Current handoff: `design/PHASE_06_CORE_STUDENT_EXPERIENCE.md` and `design/figma-build/phase-06/phase-06-state.json`. Phase 7 completes faculty, technician, mobile, signage and wall-display design. Participant testing, persistent application behavior and device integration remain open.');
const phase6 = '\n## Phase 6 status\n\nP6-A is built as a desktop student design prototype on Figma page `2089:42`. The room-led cover, experiment preparation, compatible reservations, arrival, instrument comparisons, notebooks, revision review, receipts and return states are linked. Two main routes and eight recovery paths pass structural link checks; all 27 product views are reachable. New compositions and revised study views were visually inspected. Project-index history `2101:42` preserves the previous status. See `design/PHASE_06_CORE_STUDENT_EXPERIENCE.md` and `.design/phase-06-review.md`. The data is prepared example content; participant/task testing and backend persistence are pending.\n\n';
if (!brief.includes('## Phase 6 status')) brief = brief.replace('## Phase 5 status', phase6 + '## Phase 5 status');
write('.design/brief.md', brief);
let record = read('design/figma-build/README.md');
record = record.replace('Current review: **P5-B composition upgrade**', 'Previous review: **P5-B composition upgrade**');
const current = '\nCurrent review: **P6-A student journey prototype**, built directly in the same canonical file on 2 October 2026. [Open Phase 6](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2089-1400). Separate page `2089:42` has 27 linked product views and an editable journey cover. Two student pathways and eight recovery branches pass link checks. The earlier 40-family / 87-variant library and 11 P5-B compositions remain present. Sources, IDs, contracts, captures and scope are in `phase-06/README.md`, `phase-06-state.json` and `native-audit.json`; the human handoff is `../PHASE_06_CORE_STUDENT_EXPERIENCE.md`. Task testing and application integration remain open.\n';
if (!record.includes('**P6-A student journey prototype**')) record = record.replace(/^(#.*\r?\n)/, '$1' + current);
write('design/figma-build/README.md', record);
let p5 = read('design/PHASE_05_DESIGN_SYSTEM.md');
const handoff = '\nSubsequent delivery: P6-A now connects the core student journeys on a separate Figma page while retaining this library and the P5-B source compositions. See [Phase 6](PHASE_06_CORE_STUDENT_EXPERIENCE.md). The Phase 5 build and validation records below remain the foundation handoff.\n\n';
if (!p5.includes('Subsequent delivery: P6-A')) p5 = p5.replace('## Scope and authority', handoff + '## Scope and authority');
write('design/PHASE_05_DESIGN_SYSTEM.md', p5);
console.log(JSON.stringify({updated: ['native-audit.json', 'composition.helpers.js', '.design/brief.md', 'design/figma-build/README.md', 'design/PHASE_05_DESIGN_SYSTEM.md']}));
