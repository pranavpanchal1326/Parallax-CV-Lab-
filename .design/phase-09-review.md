# P9-A review — prototype and verification

Date: 3 October 2026. Demonstrator: `prototype/`. Record: `design/PHASE_09_PROTOTYPE_AND_VERIFICATION.md`.

## What was checked, and how

- **Rules.** `node prototype/validate.cjs` replays eleven task scripts through `store.js`: T00 identities against the P6-A and P7-A contracts, T01 vision end to end, T02 signal end to end with the alias mathematics, T03 booking conflict, T04 wrong station, T05 the full ISS-0417 thread, T06 reserving against a restriction, T07 a fault that does not restrict, T08 save failure and missing acknowledgement, T09 short kit return and follow-up, T10 storage round trip and page structure. 65 of 65 pass.
- **Browser walk-through.** Both experiments from Today to a closed session, the fault thread including an interrupted verification, the wall display, and the Lab Map reading the same state. No console errors.
- **Keyboard.** Real key presses for the vision route up to the technician's restriction. Later steps were activated by script on the same native buttons and forms.
- **axe-core 4.10.2.** Final sweep after all fixes: 98 runs at 1024 px (29 states and 20 routes, two editions) and 30 runs at 320 px. No violations.
- **Reflow and targets at 320 px.** No horizontal page scroll; no control under 24 × 24 px.
- **Phase 8 prototypes.** Keyboard structure of the Lab Map and Scene Studio.

## Defects found and fixed

1. **Focus lost after a quantity field (R1).** Typing a count and pressing Tab re-rendered the view during the blur, so focus fell to the document. A keyboard user would have had to tab from the top after every field. The render now runs after focus has landed and restores it by id.
2. **Missing item did not reach existing bookings (R2).** After closing with CAL-01 at 0 of 1, KIT-C1-v1 could not be reserved, but B-2047 and B-2049 still read "Confirmed". `bookingImpact` now includes unlocated items, the technician console shows FU-2041 with an "item found" action, and two checks were added to T09.
3. **Heading level skipped on the signal bench (R3, axe `heading-order`).** Plot titles were level 3 directly under the page title. They are level 2; the demonstration-control labels are no longer headings.
4. **Wide tables unreachable by keyboard (R4, axe `scrollable-region-focusable`).** Appeared once a status cell grew ("Affected · CAL-01"). Each scroll wrapper is now focusable with its own name.
5. **Checkbox targets 22 px (R5).** Raised to 24 px.
6. **Blocked step kept the wrong address (R6).** Opening `#/E01/bench` before reserving showed Prepare with the Bench address. The address is replaced with the step shown.
7. **Lab Map notes went stale (R7).** With the demonstrator's state applied, C1-CAM could read "Bookable" above a note about ISS-0417. Notes that depend on state are now written from the state; physical notes (CV-04's approach space) are kept.
8. **Issue history spacing (R8).** Actor and action were joined ("StudentReported").

A false alarm is recorded so it is not chased again: the first night-edition sweep reported the masthead links at 2.76:1. The Browser pane was hidden, so the 0.18 s colour transition never advanced after the theme was switched by script. With transitions disabled the same links pass.

## P9-B visual and navigation pass

Asked for: less text, more visual, easier to navigate, nothing degraded. Changed presentation only (`index.html`, `proto.css`, `app.js` views, checklist wording in `fixtures.json`); `store.js` and `validate.cjs` untouched, 65 of 65 still pass. P9-A kept in `design/revisions/P9-A-pre-visual/`.

Defects found while checking the new screens, all fixed: experiment cards forced a 340 px column at 320 px; the dock's Next button ran off a 320 px screen; a control taking focus could sit under the fixed dock (now scrolled clear); slot status tags stretched full width; the page heading showed a focus ring after script navigation.

axe-core after the pass: 154 runs, no violations. Still not done: participant, screen-reader and cross-browser checks.

## P9-C navigation and copy pass on the other pages

Same request applied to the rest of the edition. These pages were already illustrated, so the work was navigation and trimming, not new artwork.

- Shared dock in `design/edition.js` and `edition.css`: previous part, section menu with meter, next part. Sections are read from each page, so no page needed new markup. Escape closes the menu and returns focus; a focused control is scrolled clear of the dock; the dock is hidden in print.
- Copy: 30 paragraphs shortened across nine pages. Honesty notes (no fieldwork, prepared examples, designer's own scores) were kept.
- Research: profile rows for PA–PD fold under a disclosure; quote and context stay visible. All disclosures open before printing.
- Contents: a thumbnail for each illustrated part; descriptions cut to one line.

Checked: axe-core on nine pages in both editions, no violations; 320 px, no overflow. Found and fixed: the dock's section label overflowed at 320 px on three pages; long file paths forced a 344 px layout on the research page and the reader (older defect). Not fixed: `review.html` scrolls 9 px sideways at 320 px, as it did before this pass.

## Preservation

- Files changed outside `prototype/`: the masthead on eleven pages (one added link), `design/phase-08/assets/lab-map.js` (additive), `design/serve-review.cjs` (also reads `PORT`), `design/index.html` and `design/read.html`. Originals are in `design/revisions/P9-pre/`.
- `resources.json`, the geometry, tokens, components and all Figma pages are unchanged. The four earlier validators pass.

## Open validation

- Participant sessions for G28.01–G28.08 (plan written, none run).
- Screen reader passes (NVDA and VoiceOver) on the demonstrator, Lab Map and Scene Studio.
- Browser zoom at 200% and 400% on a physical display; Firefox and Safari.
- Timing the 3.3 MB room model on a low-end laptop and a phone (G25.10).
- Faculty and mobile flows are not in the demonstrator.
- Figma project index does not list Phase 9.
