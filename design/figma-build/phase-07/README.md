# P7-A — native complete-system build record

Built in Figma on 2 October 2026. [Open the cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2129-704). Page `2108:62`, **Phase 7 · Complete System — P7-A**.

| File | Purpose |
|---|---|
| `phase-07-state.json` | Canonical page, component and view IDs, starting points, validation and limits |
| `system-contracts.json` | Fixture identities for the fault thread, teaching session, assessment, mobile, display and signage |
| `helpers.js` | Shared composition helpers prepended to each view body (PH5 tokens, styles, C03/C06 reuse) |
| `mobile.helpers.js` | 390 × 844 mobile shell helpers using PH7 / Mobile tab bar |
| `view-*.png` | Reviewed native exports for all 28 roots |

Conventions: roots are named `P7-A / KEY · Title`; any action or index row named `… → KEY` was wired to that root by the wiring pass. The scripts recorded here are **not idempotent** — do not rerun view bodies over the populated page; inspect the live page and make bounded edits.

Human handoff: `../../PHASE_07_COMPLETE_SYSTEM.md`. Review: `../../../.design/phase-07-review.md`. Next phase: 8.
