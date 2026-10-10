# Figma build record — PARALLAX

Current handoff: [U10-R1 board 2159:102](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2159-102), added to the existing Start page on 4 October 2026. It links the current local packet and retained phase designs. Five prior index frames and all existing design pages remain preserved. Actual board/node IDs and screenshot are in `u10-current-index.json` and `../../apps/lab-web/evidence/u09-final/figma-current-index.png`.

Historical Phase 6 review: **P6-A student journey prototype**, built directly in the same canonical file on 2 October 2026. [Open Phase 6](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2089-1400). Separate page `2089:42` has 27 linked product views and an editable journey cover. Two student pathways and eight recovery branches pass link checks. The earlier 40-family / 87-variant library and 11 P5-B compositions remain present. Sources, IDs, contracts, captures and scope are in `phase-06/README.md`, `phase-06-state.json` and `native-audit.json`; the human handoff is `../PHASE_06_CORE_STUDENT_EXPERIENCE.md`. Task testing and application integration remain open.

Previous review: **P5-B composition upgrade**, built directly in the same file on 2 October 2026. [Open the editorial showcase](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2072-1569). The original 40-family / 87-variant library is preserved; 11 task-specific native views, four navigation variants and representative prototype transitions were added. Active Phase 4 drawings and renders now match the existing P4-D source, with the previous six boards preserved in a history section. Scope, returned IDs, final screenshots and checks are in `revision-p5-b/REVIEW.md`, `revision-state.json`, `native-audit.json` and `spatial-audit.json`. The P5-A records below remain the earlier library handoff.

Phase 5 was built directly in the canonical file on 2 October 2026 after reconnection. [Open the review cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2047-1355). Separate page `2045:22` has all 40 representative families, 87 variants, 151 review instances, 64 variables and nine text styles across seven boards. Previous pages were preserved.

`p5-native-state.json` records actual IDs, family owners, review boards, execution results and scope. `p5-final-audit.json` records post-render inspection. Screenshots are in `screenshots/`; `p5-final-2.png` through `p5-final-6.png` contain the latest state-copy and anatomy repairs. `p5-spectrum-final.png` records the invisible-fill cleanup. `p5-board-0.png` and `p5-board-1.png` record the cover and token specimens. Initial captures are historical failure evidence.

The `p5-*.body.js` sections and `p5-native.helpers.js` are executed builder sources. They depend on token/contracts/geometry data injected during the recorded build. Refinements reference returned native IDs. They are **not an idempotent sync command**; inspect the populated page and ledger before continuing. Earlier `phase-05-foundations.js` five-family preparation was superseded and was not executed.

Scope: `../PHASE_05_DESIGN_SYSTEM.md`. Interactive local specimens: `../system/index.html`. P5-B adds representative linked Figma study paths; target variant breadth, shared-library publishing, complete journeys and institutional integrations remain subsequent work.

## Earlier Phase 2 record

Target file: https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF (page `Phase 2 · Research & Experience`).
Component IDs used by the scripts: Tag `3:14`, Note `3:45`, Flow node `3:61`, Sheet header `3:62`.

| Sheet | Status | Position (x, y) |
|---|---|---|
| 00 Cover & Index | Built | 0, 0 |
| 01 Research Plan | Built | 2080, 0 |
| 02 Assumption Map | Built | 4160, 0 |
| 03 Personas | Built | 6240, 0 |
| 04 Empathy Maps | Built · reviewed | 8320, 0 |
| 05 Journeys & Service Blueprint | Built · reviewed | 0, 3800 |
| 06 Problem → Requirements | Built · reviewed | 2080, 3800 |
| 07 Information Architecture | Built · reviewed | 4160, 3800 |
| 08 User Flows | Built · reviewed | 6240, 3800 |
| 09 Signal Decision & Phase Gate | Built · reviewed | 8320, 3800 |

All nine sheets are built in the student-account copy. The original gmail-owned file (pHYpJXqlaHOSAs1Q6kmzIu) stops at Sheet 04 and is superseded.
Content source for every sheet: `research/PHASE_02_RESEARCH_AND_EXPERIENCE.md`.
