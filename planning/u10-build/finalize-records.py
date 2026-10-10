from pathlib import Path
import json, csv
root=Path(__file__).resolve().parents[2]
def update(rel,changes):
    p=root/rel;s=p.read_text(encoding='utf-8')
    for a,b in changes:s=s.replace(a,b)
    p.write_text(s,encoding='utf-8')
update('planning/EXCELLENCE_EXECUTION_PHASES.md',[
 ('In progress — dated audit and bounded fixes; participant sessions excluded','Local technical/designer refinement delivered — U09-R1; fourteen scenarios reconciled; full external access/device checks remain open; participant sessions excluded'),
 ('Planned; drafting starts before this final gate','Local submission draft delivered — U10-R1: report, deck, notes, evidence, clean source handoff and recorded backup; 900-second technical traversal complete; human rehearsal and team declaration external'),
 ('Grounded AI follows in U06. Historical milestone','Grounded AI-L1 is delivered in U06. Historical milestone'),
 ('U09 technical/designer validation is next.','U09 technical/designer refinement is delivered; external access/device checks remain explicit.'),
 ('U09 validation/refinement is next. Shared operational transactions','U09 local refinement and U10 submission draft are delivered. Shared operational transactions'),
 ('Broader U09 access/performance validation and U10 submission documents remain subsequent gates.','Full external U09 access/device checks and human presentation rehearsal remain open; see the current delivery records.')])
p=root/'planning/EXCELLENCE_EXECUTION_PHASES.md';s=p.read_text(encoding='utf-8');s=s.replace('## First executed milestone','**Current U09/U10 authority:** [U09 local refinement](U09_DELIVERY_RECORD.md), [fourteen scenarios](U09_SCENARIO_LEDGER.md), [U10 delivery](U10_DELIVERY_RECORD.md) and [submission entry](../submission/index.html). Fresh source/test/build checks and rendered artifacts are delivered. [External checks](../submission/EXTERNAL_CHECKS.md) remain unperformed and are not marked as passes.\n\n## First executed milestone',1);p.write_text(s,encoding='utf-8')
update('apps/lab-web/README.md', [('U09 validation/refinement and U10 submission are tracked','U09 local refinement and U10 submission draft are delivered and tracked'),('Type/build, 138 React tests, 16 server tests and U02–U08 integrity checks pass.','Type/build, 139 React tests, 16 server tests and U02–U09 integrity checks pass.'),('U09 broadens validation.','U09 fixes and retests are indexed in `../../submission/EVIDENCE_INDEX.md`; external access/device checks remain explicit.')])
for rel in ['planning/REMAINING_WORK_REVIEW.md','.design/review-report.md']:
 p=root/rel;s=p.read_text(encoding='utf-8');s+='\n\n## Current closure — 4 October 2026\n\nThe confirmed typed-input, edition-copy and stale-scan findings are repaired; exact-text export recovery and copied-scene lifecycle ownership are implemented. Current local retests, source preservation, fourteen-scenario reconciliation and submission artifacts are in `planning/U09_DELIVERY_RECORD.md`, `planning/U10_DELIVERY_RECORD.md` and `submission/EVIDENCE_INDEX.md`. This earlier audit remains historical before evidence. Full external access/device checks, human rehearsal and team facts remain explicit rather than claimed complete.\n';p.write_text(s,encoding='utf-8')
p=root/'design/figma-build/README.md';s=p.read_text(encoding='utf-8');s=s.replace('Current review: **P6-A','Current handoff: [U10-R1 board 2159:102](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2159-102), added to the existing Start page on 4 October 2026. It links the current local packet and retained phase designs. Five prior index frames and all existing design pages remain preserved. Actual board/node IDs and screenshot are in `u10-current-index.json` and `../../apps/lab-web/evidence/u09-final/figma-current-index.png`.\n\nHistorical Phase 6 review: **P6-A',1);p.write_text(s,encoding='utf-8')
(root/'submission/presentation-validation.json').write_bytes((root/'planning/u10-build/presentation-final-validation.json').read_bytes())
old=root/'submission/PARALLAX-Presentation.pptx'
if old.exists():old.rename(root/'planning/u10-build/first-reviewed-deck.pptx')
update('planning/u10-build/build-deck.mjs',[("final:out+'/PARALLAX-Presentation.pptx'","final:out+'/PARALLAX-Presentation-Final.pptx'")])
update('planning/u10-build/build-report.py', [('[157,40,307]','[157,50,297]')])
print('Current records reconciled; historical audits preserved; older unlinked deck moved to review history.')
