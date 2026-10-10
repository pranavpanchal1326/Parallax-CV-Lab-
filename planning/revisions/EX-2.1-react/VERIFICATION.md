# EX-2.1 initial React migration verification

3 October 2026 · U01 complete for the preservation baseline; U03 parity in progress.

## Executed checks

- `npm test` in this directory: 25 tests passed. Cases cover immutable owned drafts, deterministic repeated transitions, retained failed-save/short-note state, lost-acknowledgement retry, frozen submitted notebook, complete-kit reservation/conflict, station normalization, quantities/occupancy, both receipts, generated signal samples, camera fallback, restriction/privacy, interrupted verification, missing-item recovery and persistence failure/schema boundaries.
- `npm run build`: TypeScript check and production Vite build passed. Production JavaScript: 376.37 KB raw / 117.58 KB gzip; CSS: 47.12 KB raw / 10.45 KB gzip. These are build sizes, not load-time/device-performance measurements. Optional fonts use the existing Google Fonts import and fallback stack.
- Existing root `npm run check`: passed before and after implementation. Prototype 65/65, scene 25/25, spatial 16/16, design-system and earlier audit validators. Final output: `evidence/legacy-checks.txt`.
- SHA-256 comparison: eleven preserved prototype, design-token/edition and geometry files are unchanged. Root `package.json` intentionally gains separate React scripts/description. Baseline manifest: `../../planning/revisions/EX-2.1-baseline/manifest.json`.
- Sources formatted with pinned Prettier 3.6.2 through npm exec; formatting does not modify original prototype/design sources.

## Rendered walkthroughs

In-app browser, local Windows host. Device/browser version and assistive technology are not recorded; no cross-browser or screen-reader claim is made.

1. E01: preparation, full-kit booking at 10:00, CV-03 arrival, session start, both generated runs, notebook failed save with retained text, successful save, lost acknowledgement, retry producing EX-SUB-2042, session close. Today displayed seven completed steps.
2. E06: preparation, refused 10:00 clash with B-2040 and 11:00 alternative, B-2041 reservation, loose `cv2` check-in, counted manifest, frontal illustration, camera interruption, prepared side-light recovery, saved claim, EX-SUB-2041 receipt. Return refused missing quantities; returned camera/lights/tripod and closed with CAL-01 follow-up FU-2041. Technician locating action restored availability.
3. Technician: reported ISS-0417, availability classification, C1-CAM-only restriction, recorded repair, interrupted verification, release refused, verification pass then release. Public notice disappeared after release.
4. Public DOM after restriction: no ISS-0417, private example detail or Activity control; equipment consequence remained visible. This verifies a demonstrator presentation projection, not deployed authentication or server authorization.
5. Reload retained the React example history. A second tab changing the same React record caused the first tab to pause saving and expose recovery controls. The test change was reverted; reloading restored the current record. This is browser conflict detection, not multi-user transactional allocation.
6. Keyboard activation of the skip link focused `current-view` without changing the hash route. Enter activated technician navigation. Action failures focused their feedback; removal of the submit/check-in action retained useful success focus. These are targeted keyboard checks, not a complete keyboard audit.
7. Today inspected at approximately 870 and 1280 CSS px; Today and return inspected at 320 px. Measured page widths matched the available client widths after fixing header overflow (855/855, 1265/1265 and 305/305 including the browser scrollbar). Night edition inspected at 320 px. Every inspected return quantity input had an associated label.
8. Fresh production load at `http://localhost:4180/apps/lab-web/dist/index.html` rendered Today, scientific illustrations and the geometry-driven plan. The fresh production tab reported no captured errors/warnings. Earlier development edits had caused context replacement errors; contexts/hooks and reducer were extracted from the provider's refresh boundary before this final build. Do not describe the complete development log as error-free.

## Corrections during verification

- Removed private shared feedback, activity, reset/export and persistence controls from the public view.
- Scoped navigation feedback clearing/focus before paint to avoid erasing a fast subsequent action's result.
- Submitted notebooks remain read-only; the new draft action rejects editing a submitted revision.
- Restriction action follows the selected classification's restrictive intent.
- Restored existing serif hierarchy and corrected inherited masthead widths/order.
- Added explicit accessible step names when narrow layouts hide their visual labels.
- Retained the mathematically matching alias overlay alongside the reference and samples.
- Storage errors remain visible; incompatible records are retained until an explicit fresh-example action. Export controls exist, but download completion was not exercised in this walkthrough.

## Evidence and remaining gates

- `evidence/react-preview.png`: final production Today viewport.
- `evidence/today-light.png`: inspected light composition with completed example sessions.
- `evidence/today-320-dark.png`: narrow night edition.
- Original Today: `../../planning/revisions/EX-2.1-baseline/today-before.png`.

Full visual/interaction parity is open. Rich original compositions, the fixed action dock, detailed fault tracking, original map bridge, broader faculty/mobile flows and any intentional composition changes require a reviewed coverage ledger before cutover. The React app does not write the legacy map projection. Existing reference pages remain on the original edition server.

Actual participant research, twelve wireframes, dashboard/sensor/energy concepts, immutable condition replay, real AI, new art, operational backend, measured-room review, manual screen-reader/200% zoom, new automated accessibility scan, broader browser/device timing, report and presentation remain open. Existing scripts and rendered checks do not substitute for these deliverables.
