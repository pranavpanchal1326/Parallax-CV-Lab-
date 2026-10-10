# React verification — EX-2.2 and retained EX-2.1 record

## EX-2.2 executed checks — 3 October 2026

U02/U03/U04/U05 remain in progress. This addendum supersedes the older open-item list below for wireframes, dashboard/environment/energy concepts and condition replay only.

- `npm run lab:test`: **42/42 passed**, including the prior 25 migration checks. New cases cover disconnected/fresh/stale/invalid observations, explicit zero, unit/value/time errors, freshness boundary, immutable observations, duplicate capture refusal, interruption retention, stored reference computation, older context-free records, malformed persisted context/settings, freshness differences despite identical values, standby upper bounds and booking/active/restricted/essential-service protection.
- `npm run lab:build`: TypeScript and production build passed. Final output: 112 modules; JS 400.90 kB (124.09 kB gzip), CSS 49.73 kB (10.94 kB gzip). These are build sizes, not device performance measurements.
- `npm run check`: existing prototype 65/65, scene 25/25 and spatial 16/16 checks passed; system and phase 1–4 audits completed. Original source hashes: **11/11 unchanged**, with intentional root package-script additions excluded. Machine record: `evidence/ex-2.2-preservation.json`.
- `node design/wireframes/build.cjs`: twelve SVG boards and annotated HTML review generated; browser DOM showed twelve boards and twelve loaded images.

## EX-2.2 rendered walkthroughs

In-app browser on the local Windows host; production build on port 4180. These are targeted checks, not a full accessibility/device audit.

1. Dashboard loaded with distinct equipment, active-session, pending-receipt and zero-connected-source counts. Equipment text disclosure and geometry-derived plan remained present. Opening an already-loaded EX-2.1 tab at the new hash initially showed its old route fallback; reloading loaded the new bundle. This was a stale preview bundle, not lost state.
2. Environment defaulted to no source. Delayed examples showed 900-second age and Stale example; invalid examples showed Invalid reading. Recent examples stayed explicitly simulated. At 09:40, changing the energy interval from 15 to 30 minutes protected the forthcoming B-2040 booking. During a started E01 session, CV-03 and S1-B also prevented proposals; essential services always stayed excluded.
3. E01: prepared, reserved 10:00, checked into CV-03 and started. Captured 20 Hz with recent observations, changed the current scenario to delayed, then captured 3 Hz. Replay retained recent (210 seconds at capture) and stale (1,080 seconds at capture) observations after reload. The signal plates and computed values used stored reference parameters. The final difference table separately showed equal numeric values, differing freshness and differing observation/source records.
4. E01 submission: saved a sample notebook claim, deliberately lost the first acknowledgement, then opened Dashboard. Pending acknowledgements was 1 with a return-to-submission link. Retry yielded the retained receipt and count returned to 0. This is a local example acknowledgement, not a real server submission.
5. E06: prepared, booked 11:00, checked into CV-02, counted the kit and started. Recorded frontal light, interrupted the example feed and recorded a labelled prepared side condition. Replay showed distinct frontal/side illustrations and retained settings/source differences after reload. The final dashboard flagged the interrupted feed and linked to bench recovery.
6. Dashboard, environment and E01 replay inspected at a 320-pixel viewport (305 CSS client pixels after scrollbar): page scroll width matched client width. Night dashboard/replay were captured; wireframes also reflowed without page overflow at this width. Desktop dashboard and wireframe compositions were visually inspected at the default viewport (1,265 CSS client pixels). Wide comparison tables intentionally scroll within labelled keyboard-focusable regions. No physical phone, actual zoom or screen reader was used.
7. Keyboard Enter on the dashboard skip link focused `current-view`. Native labelled selects and quantity controls were exercised. The final production dashboard reported no captured errors/warnings. Selector mismatches during automation were resolved from the DOM; they are not app errors or successful checks.

## EX-2.2 evidence and limits

- `evidence/dashboard-preview.png` and `dashboard-light.png`: final dashboard viewport/full page.
- `evidence/dashboard-320-dark.png`, `conditions-320-dark.png`: narrow night captures from the preceding build, before the added freshness comparison rows/interrupted-feed attention message. They document reflow, not the final copy.
- `evidence/conditions-light.png`: final comparison including freshness/source rows.
- `evidence/wireframes-preview.png`: annotated twelve-board review page.
- `../../planning/EX-2.2_IMPLEMENTATION.md`: rubric contribution, source boundaries and remaining gates.

No participant fieldwork, real inference, connected sensors, metering, physical power control, supplier certification or surveyed-room validation has occurred. Research collection preparation is complete; research itself is open. Remaining deliverables include grounded AI, one-variable rehearsal, the additional consequence walkthrough, complete React/Figma coverage, physical hazard/CCTV/ventilation review, new full automated access scan, manual access/cross-browser/device tests, ten-section report and fifteen-minute presentation. Wireframe SVG text is selectable and the review page supplies annotations; physical printing and Figma import remain untested. Earlier rendered migration checks below remain their dated evidence.

## Retained EX-2.1 initial React migration verification

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
