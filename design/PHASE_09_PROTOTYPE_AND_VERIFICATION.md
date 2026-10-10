# Phase 9 — PARALLAX prototype and verification / P9-A

Built and checked: 3 October 2026.

Run it: `node design/serve-review.cjs 4180`, then open http://127.0.0.1:4180/prototype/. Checks: `node prototype/validate.cjs`.

Phases 6 to 8 produced linked Figma screens and two working 3D pages. Each was correct on its own, but nothing carried a change from one view to the next. Phase 9 adds a runnable demonstrator in which the student journey, the equipment fault and the availability views all read and write one set of records, then checks it by script, keyboard and automated accessibility rules.

No student, teacher or technician has used it. The participant sessions are planned in `research/PHASE_09_TEST_PLAN.md` and have not been run.

## 1. The decision: a web demonstrator beside the Figma prototype (G30.12)

The blueprint left open whether the prototype would be Figma-only. Figma cannot change a record: a fault reported on one frame does not alter another. The assignment's prototype criterion (G29.09) and the workflow acceptance in blueprint §34 both need that. So the Figma pages stay the visual record, and `prototype/` is the behaving one. It is recorded as decision D11.

## 2. What the demonstrator covers

| Blueprint item | In the demonstrator |
|---|---|
| G26.11 complete-kit booking | One booking holds every item of KIT-C1-v1 or KIT-S1-v1; a taken slot names the clash and offers 11:00 |
| G26.11 vision evidence (E06) | Two lighting conditions recorded with exposure, gain and light; shown as illustrations, never as camera output |
| G26.11 signal evidence (E01) | y(t) = sin(4πt) V sampled at 20 Hz and 3 Hz, computed in the browser; the 1 Hz alias is drawn through the 3 Hz samples |
| G26.11 submission | Frozen revision, one request identity, receipt EX-SUB-2041 or EX-SUB-2042 |
| G26.11 fault exception | ISS-0417 on C1-CAM: report, classify, restrict, repair, verify, release |
| W01 exceptions | Booking conflict, device failure that keeps saved evidence, incomplete evidence returned to review |
| W02 exceptions | Unknown cause stays open, affected bookings shown, quality-level fault does not restrict |
| W03 kit return | Quantities against the same manifest; a missing CAL-01 raises FU-2041 and blocks the kit until located |
| G23.15 propagation | Equipment list, kit manifest, time slots, bookings, technician console, wall display and the Lab Map all derive from the same state |
| P7 visibility matrix | The wall display names the equipment only: no issue, person, booking or cause |

Identities are the ones already used in Figma (B-2041, EVID-E06-r03, RST-0417, and so on). The validator compares them with the Phase 6 and Phase 7 contract files.

Views: Today, seven steps per experiment (Prepare, Reserve, Arrive, Bench, Notebook, Submit, Return), Report a problem, Technician console and issue, Wall display, Record and limits. A side column lists each change as it happens, with actor, example time, reference and reason.

The Lab Map (`design/phase-08/lab-map.html`) now reads the demonstrator's state when one exists in the browser, says so in its footnote, and sends "Book" to the demonstrator. Without a session it shows the Phase 8 prepared examples as before.

## 3. How it is built

- `prototype/store.js` holds every rule as a plain function over a plain object. Availability, occupancy, booking impact and public notices are derived, never stored twice.
- `prototype/fixtures.json` holds the example records.
- `prototype/app.js` renders views from the state. Native links, buttons, inputs and forms only; no framework and no dependencies (89 KB in five files).
- State is kept in this browser's `localStorage`. "Start again" clears it.
- Page chrome follows the edition layer; product controls use the Phase 5 tokens and the 4 px control radius.

Three exceptions cannot happen without real hardware or a server: the camera stopping, a failed save and a lost acknowledgement. Each has a labelled "Demonstration control" beside the step it affects.

## 4. Checks run

| Check | Result | What it is not |
|---|---|---|
| `node prototype/validate.cjs` | 65 of 65 pass across eleven task scripts (T00–T10) | Rule checks, not people |
| Keyboard, vision route to the fault report | Completed with Tab, Space, Enter and typing: checklist, conflict, reserve, wrong station, check-in, kit count, start, record, stop, report, classify, restrict | Remaining steps were activated by script on native controls |
| axe-core 4.10.2, WCAG 2.0–2.2 A and AA plus best practice | 128 runs: 29 fault and recovery states and 20 routes at 1024 px, 15 routes at 320 px, each in the light and night editions. No violations after two fixes | Automated rules find a minority of accessibility problems |
| Reflow at 320 px (WCAG 1.4.10; equals 400% zoom at 1280 px) | No horizontal page scroll on 15 routes; tables scroll inside labelled, focusable regions | Not tested with browser zoom on a physical small screen |
| Target size (WCAG 2.5.8) | All controls at least 24 × 24 px after one fix | |
| Lab Map and Scene Studio keyboard pass (open from Phase 8) | Search and Enter open the first match; 17 plan items take focus and respond to Space; Escape clears; twelve labelled Scene Studio controls keep focus while the explanation updates | Screen reader not run |
| Existing validators | System, Phase 8 (25 of 25), spatial and Phase 1–4 audit all still pass | |

Blueprint §36 status after this phase: Q02 journey integrity, Q04 operational credibility and Q11 "fixture changes propagate" and "recovery states are demonstrated" are now met by the demonstrator. Q07 "keyboard users can complete booking and comparison" is met for booking; "screen-reader and zoom testing is documented" is met only for reflow. Q09 "tests expose real usability issues" is not met.

## 5. Findings and revisions

Eight defects were found by these checks and fixed. Details are in `.design/phase-09-review.md`.

| # | Found by | Finding | Severity | Revision |
|---|---|---|---|---|
| R1 | Keyboard | Leaving a quantity field dropped focus to the top of the page | Critical for keyboard users | Re-render waits for focus to land; focus is kept |
| R2 | Walk-through | A missing CAL-01 blocked new reservations but existing bookings still read "Confirmed" | Major (records disagreed) | Bookings holding an unlocated item are marked affected; technician can locate it and close FU-2041 |
| R3 | axe | Signal bench skipped a heading level | Moderate | Plot titles are level 2 |
| R4 | axe | Wide tables could not be scrolled by keyboard | Serious | Scroll regions are focusable and named |
| R5 | Measurement | Checkboxes were 22 px | Minor | 24 px |
| R6 | Walk-through | A blocked step kept its address while showing another step | Minor | Address is corrected to the step shown |
| R7 | Walk-through | Lab Map kept Phase 8 notes ("ISS-0417", "FU-2041") after the state said otherwise | Major (stale claim) | State-dependent notes are rewritten from the state |
| R8 | Walk-through | Issue history ran actor and action together | Minor | Spacing fixed |

## 5b. P9-B — visual and navigation pass (3 October 2026)

P9-A explained itself in paragraphs and tables. P9-B keeps every rule and identifier and changes only how the screens are drawn and moved through. P9-A is preserved in `design/revisions/P9-A-pre-visual/`.

- **Navigation.** A seven-step stepper with icons and done, current and locked states; a fixed Back / Next dock on every step, where Next says why it is locked; role tabs with open-item counts; the activity log is a panel opened from the bar, with the latest change shown in one line.
- **Pictures in place of prose.** Today shows two experiment cards with their illustration and progress, then a floor plan drawn from `spatial/lab_geometry.json` with status as shape and colour, and four counts. The equipment table is one click away as the list view.
- **Kit as cards.** Manifest, count-in and return use the same icon cards; time slots are three large blocks, the taken one hatched; a confirmed booking is a ticket.
- **Evidence.** Notebook, review and receipt show thumbnails of what was recorded; readiness is a two-line checklist.
- **Technician.** A five-stage tracker, one action panel for the current stage, classification as four choice cards, the asset highlighted on the plan and the affected bookings beside it. History folds away.
- **Copy.** Ledes and explanatory paragraphs removed or cut to one line; checklist wording shortened.

Re-checked after the pass: 65 of 65 rule checks; axe-core 154 runs (33 states and 20 routes at 1280 px, 18 routes at 320 px, a 6-route re-run after the last CSS fixes, both editions), no violations; no horizontal overflow and no control under 24 px at 320 px; no focused control hidden by the dock. Found and fixed during the pass: experiment cards and the dock overflowed at 320 px, and a focused control could sit under the dock.

## 6. Limits

- No participant, screen-reader, cross-browser or low-end device testing has been done. The 3.3 MB room model has not been timed on a slow laptop or phone.
- No camera, signal source, booking system, account or server is connected. Nothing is submitted anywhere.
- One student and one technician are modelled. Faculty re-planning, attendance correction, assessment, the mobile companion and signage remain Figma designs from Phase 7.
- Example times advance three minutes per action and are not a schedule.
- The restriction rule marks every open booking that holds the asset, so today's B-2040 and the reporter's own B-2041 are flagged as well as B-2047 and B-2049 named in the Phase 7 record.
- Figma was not changed in this phase; its project index does not yet list Phase 9.
- The exit gate asks for critical failures resolved and limits documented. The critical failure found (R1) is resolved; failures that only people can reveal are still unknown.

## 7. Next

Run the sessions in `research/PHASE_09_TEST_PLAN.md` and log what they change. Phase 10 assembles the report, presentation, source handoff and the rehearsed demonstration; the six-minute demonstration (G29.13) can follow the route in section 7 of the test plan.

Records: `prototype/validation.json`, `.design/phase-09-review.md`. Pages changed in this phase are preserved in `design/revisions/P9-pre/`.
