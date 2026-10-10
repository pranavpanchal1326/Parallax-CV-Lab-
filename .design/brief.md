# PARALLAX Project Design Brief

**Current implementation, U03 / 3 October 2026:** local React functional parity is complete. Student and operational role flows, mobile recovery, linked map, safety and revision/persistence integrity are implemented; original entrypoints and scientific/domain source are retained. [Delivery](../planning/U03_DELIVERY_RECORD.md), [coverage](../apps/lab-web/PARITY.md) and [implementation review](u03-report.md) supersede older open-parity statements below. 59 React tests, build, root regressions and U02 integrity pass. Broader access/performance checks stay U09; U04/U05 partial, AI U06 and report/deck U10 not complete. No measured "10×" gain or score guarantee is claimed.

**Current research scope, U02-R2 / 3 October 2026:** U02 is complete using secondary research, design-artifact analysis and designer walkthroughs. No local interviews, surveys, participant usability sessions or field observations will be conducted. [Methodology](../research/U02_DESK_RESEARCH_METHOD.md) supersedes the historical primary-research plans below. Local personas/behaviour and room/policy conditions remain unvalidated assumptions; U09 uses designer and technical checks.


Updated: 2 October 2026, Asia/Calcutta.
Upgrade execution update: 3 October 2026, EX-2.1.
Latest implementation: EX-2.2 — dashboard, environment/energy, immutable condition replay, twelve annotated wireframes and a research collection pack. See `../planning/EX-2.2_IMPLEMENTATION.md` and the dated React verification addendum. Actual research, AI, live sensing, further signature experiences, full parity and submission documents remain open; the dated EX-2.1 paragraph below records the earlier milestone.
Status: Phase 1 design baseline established; site and submission facts pending confirmation.

Execution authorised — ten upgrade phases U01–U10 are tracked in `../planning/EXCELLENCE_EXECUTION_PHASES.md`. U01 preservation baseline is complete; U03 React parity is in progress in `../apps/lab-web/`. Both student routes and technician/public projections have an initial implementation over the unchanged legacy rules. Twenty-five migration tests, type/build, root checks and targeted rendered recovery/reflow/public-projection checks passed; see `../apps/lab-web/VERIFICATION.md`. Original prototype/design/geometry sources are retained and hash-checked. Full UI parity, research, wireframes, AI, smart integrations/art, report and presentation remain open. Earlier paragraphs below describe their dated specification/build revisions.

Upgrade specification, 3 October 2026 — the user requested a consolidated product/AI/art blueprint and React direction. `../PARALLAX_EXCELLENCE_BLUEPRINT.md` now specifies the upgrade: React + TypeScript + Vite, preservation of the current domain rules and retained-error states, contextual AI with approved sources, condition snapshots, purposeful art, and evidence gates for the rubric. This is a planning artifact; no application migration, AI integration, artwork generation, research session or new runtime verification is claimed. Existing phase evidence remains authoritative for what is built.

Deeper system/product revision, EX-2.0 — the same blueprint now adds explicit record authority, atomic shared reservations, duplicate requests and lost acknowledgements, operation-specific offline recovery, versioned policies, AI context/integration levels, three scientific signature experiences, support ownership and cost modelling, fourteen acceptance scenarios, and four preservation baselines. Read sections 26, 30 and 33 first. EX-1.0 is preserved in `../planning/revisions/PARALLAX_EXCELLENCE_BLUEPRINT_EX-1.0.md`. This revision changes the specification only; the application, geometry, Figma and research evidence remain unchanged.

Navigation and copy pass P9-C, 3 October 2026 — every edition page (contents, Parts 02–08 and the written-record reader) now has one fixed dock from `design/edition.js`: previous part, a jump menu built from the page's own sections with a progress meter, next part. Long deks were cut on nine pages, four persona profiles on the research page fold behind a disclosure (opened automatically for print), and the contents page shows a thumbnail per illustrated part (three new crops in `figma-build/thumbs/part-0*.jpg`). No figures, data, tokens or geometry changed. axe-core: no violations on nine pages in both editions; no overflow at 320 px (two older overflows from long file paths were fixed). Lab Map and Scene Studio are tool layouts and do not carry the dock. Previous pages: `design/revisions/P9-C-pre-visual/`.

Visual pass P9-B, 3 October 2026 — the demonstrator was redrawn for less text and easier navigation (stepper, fixed Back/Next dock, floor plan from `lab_geometry.json`, icon kit cards, evidence thumbnails, technician tracker, activity panel). Rules and identifiers unchanged; 65 of 65 checks and 154 axe runs clean. P9-A preserved in `design/revisions/P9-A-pre-visual/`.

Current build: P9-A prototype and verification, 3 October 2026 — `prototype/` is a runnable demonstrator (no dependencies, served by `design/serve-review.cjs` at `/prototype/`) in which the student journey for E06 and E01, the ISS-0417 fault thread, the kit return, the wall display and the Lab Map share one state (`store.js` rules over `fixtures.json`, kept in localStorage). `node prototype/validate.cjs` passes 65 of 65 scripted task checks; axe-core 4.10.2 reports no violations over 128 runs (states and routes, both editions, 1024 px and 320 px); the vision route was completed by keyboard up to the restriction. Eight defects were found and fixed. Not done: participant sessions (plan in `research/PHASE_09_TEST_PLAN.md`), screen-reader and cross-browser passes, device timing; faculty and mobile flows are not in the demonstrator; Figma is unchanged. Handoff: `design/PHASE_09_PROTOTYPE_AND_VERIFICATION.md`; review: `.design/phase-09-review.md`. Phase 10 assembles the report, presentation, source handoff and rehearsed demonstration.

Presentation pass, 3 October 2026 — "Edition" layer: every local page now shares one printed-magazine language (`design/edition.css` + `edition.js`): paper, ink, hairline rules, Newsreader headlines, one ultramarine spot colour, graphite reserved for instrument plates; no gradients, glass or pill controls. New contents page `design/index.html` (server root redirects there) links Phases 00–08. Light and night editions on every page (`?theme=light|dark` forces one for a visit). Tokens, component specimens, geometry, data and JS behaviour are unchanged; all four validators still pass. Fixed in passing: root-URL 404s, cyclic CSS variables that broke Scene Studio in the light theme, the unpositioned 3D opt-in prompt in Lab Map, the collapsed render gallery grid, clipped/overlapping floor-plan labels, and an unpausable ticker. The previous pages are preserved in `design/revisions/P8-C-pre-edition/`. Not done: cross-browser, screen-reader and participant testing (Phase 9); Figma is not synchronised with this pass.

Second edition pass, 3 October 2026 — Parts 06 and 07 are now illustrated local pages built from the Figma captures already in `design/figma-build/`: `design/journey.html` (27 student views in seven stages, eight recovery states flagged; views 05–08 are shown from their P5-B source frames because no P6 capture exists locally) and `design/complete.html` (the ISS-0417 fault thread, the visibility table, and technician, faculty, mobile, wall and signage views). Both use a shared full-size viewer (`plates.css`, `plates.js`). `design/read.html?doc=<key>` typesets the written records (whitelisted keys only) with a section index and previous/next links; the contents page and masthead link to all of it. These pages show captures, not live Figma; nothing in Figma was changed.

Third edition pass, 3 October 2026 — `journey.html` gains a route map (inline SVG: vision and signal lines, shared stops, eight dashed recovery branches; each stop links to its screen). Plates now load web-size copies from `design/figma-build/thumbs/` and open the original capture full size; `#v-<id>` scrolls to a plate and `#view-<id>` opens it. `system/index.html` shows the five Figma review boards 5B–5F (5A and 5A.2 have no final capture on disk). The contents page previews each part beside the list. Print rules added to `edition.css`. An axe-core 4.10 run (WCAG 2.0–2.2 A/AA and best-practice rules) over all nine pages in both themes reported no violations after fixes: Lab Map plan `role="img"` hid its 17 buttons from assistive technology (now `group`), a dark-theme selected index item at 1.04:1 contrast, a skipped heading level, nested `aside` landmarks and duplicate table region names. Automated rules only; no screen-reader or participant testing.

Fourth edition pass, 3 October 2026 — Parts 02 and 03 are now illustrated pages generated from their records, so every figure on them is parsed from the Markdown rather than retyped: `design/research.html` (assumption map of H01–H12, six persona hypotheses, three empathy maps, journey map J1, six problems with their requirements, methods M1–M7; a banner states that no fieldwork has been done) and `design/direction.html` (three studies set in their documented typefaces, a contrast dot plot of the eleven measured pairs, the weighted critique with totals recomputed and checked against the record, findings, the Atlas+ decision and the exit checklist). The three-series chart palette was run through a colour-vision validator for both themes and uses shape as well as colour. Neither page shows Figma frames: no captures of the Phase 2 or Phase 3 boards exist on disk. The masthead now carries ten destinations and switches to two rows at 1420 px. axe-core re-run on all eleven pages at desktop and phone width in both themes: no violations after fixes (unlabelled-role cells, a skipped heading, and scroll regions that could not be reached by keyboard on three pages).

Previous build: P8-B visual upgrade on 2 October 2026 — procedural look development, physical sky and sun, new H01/R09/R10 shots, A01 orbit animation, live A03 signal→pixel, upgraded 3D in both prototypes and a new hub; P8-A kept as the record. Before that, P8-A 3D & interaction built on 2 October 2026 — 10 Cycles renders (R01–R08 + restricted variants), a 43-node resource-ID interactive model, working Lab Map and Scene Studio prototypes in `design/phase-08/` (validator 19/19), and Figma page `2131:82` with 10 roots. Handoff: `design/PHASE_08_3D_AND_INTERACTION.md`. Phase 9 connects the prototype and runs accessibility and task tests.

Previous build: P7-A complete system design built in the canonical Figma file on 2 October 2026. Page `2108:62` adds 7 technician, 6 faculty, 9 mobile, 3 wall-display views and 2 signage boards, joined by one cross-role fault thread (ISS-0417 on C1-CAM). P6-A (27 student views), the 40-family / 87-variant library and all 11 P5-B compositions remain intact. Current handoff: `design/PHASE_07_COMPLETE_SYSTEM.md` and `design/figma-build/phase-07/phase-07-state.json`. Phase 8 refines 3D, Lab Map, Scene Studio and fallbacks. Participant testing, persistent application behavior and device integration remain open.

## Purpose

Design a complete physical and digital experience for the Signal and Computer Vision Lab in a 70 m² engineering laboratory.
Students should prepare, reserve a compatible setup, run an experiment, interpret evidence, and present their findings.
Faculty and technicians should be able to schedule teaching, review attendance, manage equipment, and resolve faults.

## Authority and source order

1. The user's explicit requirements and corrections.
2. The assignment brief in `Final Year Project Assignment.docx`.
3. Confirmed research, room measurements, and institutional policies.
4. Decisions recorded in `planning/PHASE_01_EXECUTION_BRIEF.md`.
5. The master proposal in `PARALLAX_DESIGN_BLUEPRINT.md`.

The master blueprint is a specification library, not evidence that its proposed features have been built.
Treat its colours, type sizes, resource counts, room shape, and project name as candidates.
Phase 3 selects the art direction after actual visual studies.

## Confirmed requirements

- Selected subject: Signal and Computer Vision Lab.
- Available area: 70 m².
- Physical and digital user experience both belong in the submission.
- User wants an artistic, distinctive, professional system with purposeful variation across pages.
- User wants 3D included.
- User requested a master blueprint of at least 2,000 lines; that artifact exists.
- User accepted a ten-phase approach and requested execution of Phase 1.
- Assignment includes personas, empathy map, journey map, floor plan, wireframes, high-fidelity UI, prototype, equipment layout, and signage.
- Assignment includes a report and a 15-minute presentation.
- Recommended tools are options; no requirement to use every listed application.

## Users and pressures

These are role hypotheses until tested.

- Student: needs appropriate equipment, understandable preparation, and reliable evidence saving.
- Faculty: needs resource-aware schedules, attendance visibility, and evidence-based assessment.
- Technician: needs precise asset identity, fault context, complete kit returns, and maintenance history.
- Administrator: needs accurate access and resource definitions.
- Visitor: needs orientation and approved public information.

## Primary jobs

- Discover an experiment and understand its prerequisites.
- Reserve its space, workstation, devices, and required accessories together.
- Find the physical setup through a matching zone and asset identifier.
- Verify readiness and record attendance through booking-based check-in.
- Capture signal or image data with its settings.
- Compare results with readable units, provenance, and limitations.
- Record reasoning and submit a stable evidence revision.
- Report faults that affect subsequent reservations.
- Track asset location, movement, service, and return.
- Publish an approved investigation without revealing private material.

## Critical demonstrators

- Vision: object detection under changing lighting, blueprint E06.
- Signal: sampling and aliasing or noise filtering, E01/E02; choose in Phase 2.
- Spatial: Scene Studio camera geometry, E12.
- Exception: a camera-kit fault restricts availability and suggests another time or setup.
- Faculty: correct attendance and review evidence.
- Technician: inspect asset movement and resolve a fault with verification.

## Brand and artistic intent

- Working name: PARALLAX.
- Working concept: a living atlas of perception.
- Character: expressive, precise, curious, composed.
- Composition follows the task: spatial atlas, time canvas, instrument, notebook, or exhibition.
- Signature artwork may use an original signal-to-pixel sculpture and offset viewpoints.
- Scientific evidence preserves its original appearance and context.
- Writing uses clear verbs, useful labels, and truthful states.
- Each page can have a distinct focal composition while sharing control behaviour.

## Explicit anti-goals

- Uniform dashboard cards used as the default for every page.
- Decorative charts with invented metrics.
- Colour or motion used as the sole explanation of state.
- An impressive render concealing an unresolved floor plan.
- A 3D interaction required to complete booking or read instructions.
- Facial recognition attendance introduced without a real requirement.
- Simulated processing or sensor data described as live.
- Fabricated interviews, test results, or environmental savings.
- Large numbers of disconnected screens presented as a complete prototype.
- Locking the palette before comparing visual studies.

## Evidence and content

- Use stable IDs for zones, assets, kits, bookings, captures, processing runs, and submissions.
- An output refers to its inputs, settings, algorithm/model version, and timestamp.
- A calibration record refers to its approved method and evidence.
- A booking manifest includes required accessory quantities.
- Attendance belongs to a teaching session, with an authorised correction history.
- Asset tracking records location changes with actor, time, and reason.
- Demonstration records are labelled as examples.
- Public project material includes only authorised evidence.

## Physical constraints

- 10 × 7 m is a provisional modelling envelope, not a measured room.
- Six shared stations are a planning option, not an approved occupancy.
- Zone allocations total 70 m² but do not yet prove furniture fit.
- Actual door, window, column, service, and equipment geometry remain unknown.
- Accessibility, electrical, fire, ventilation, and occupancy decisions need appropriate local review.
- Technical plans and render geometry must share one source model.

## Digital and 3D requirements

- Desktop supports full preparation and scientific analysis.
- Mobile supports QR/manual ID lookup, booking, check-in, short instructions, and fault reporting.
- Wall display is a separately approved read-only experience.
- Keyboard, focus, text resizing, clear validation, and reduced motion belong in core design.
- Essential 3D actions have list, text, or 2D alternatives.
- Heavy models are optional and load after core content.
- Scientific plots include scales, units, captions, and accessible summaries.
- Live hardware integration is conditional on actual device APIs and permissions.

## Tools and existing assets

- Existing project artifacts: assignment DOCX and master Markdown blueprint.
- Phase 2 Figma file is documented. Local room models, renders and a browser review now exist. No production lab application or participant research dataset is verified.
- The gmail Starter account was capped at 3 pages and limited MCP calls. The student-account file (QaLr3W9rzW1WGhkDeHx9WF) was verified on 2 Oct 2026 to allow more than 3 pages.
- Blender 5.2.2 LTS executable verified at `C:/Program Files/Blender Foundation/Blender 5.2/blender.exe`.
- Figma account authentication and file-specific editing verified through the reconnected connector; Phase 5 native components and variables were successfully written and inspected.
- Canva account search succeeded; no PARALLAX design was returned.
- Design and 3D skills are available; external provider credentials are not implied by installation.
- No Meshy/Tripo external tool was exposed in the current tool inventory check.
- CAD route is unresolved; AutoCAD/FreeCAD was not found in the narrow installation check.
- Prefer one canonical design file and one canonical room model.

## Open facts

- Submission date and year.
- Existing-room versus hypothetical-room status.
- Room dimensions and fixed geometry.
- Equipment inventory and institutional policies.
- Canonical Figma destination is accessible and editable; institutional reviewers and permissions remain to be defined.
- Actual research participants and permission to observe the lab.


## Phase 9 status

P9-A is built. G30.12 is resolved as D11: the Figma pages remain the visual record and `prototype/` is the behaving demonstrator. It covers G26.11 (complete-kit booking, vision and signal evidence, submission, fault exception), W01–W03 with their exceptions, and the P7 visibility rule for the wall display. The Lab Map reads the demonstrator state when one exists. The exit gate (critical failures resolved, limits documented) is met for what scripts, keyboard and automated rules can find; what only participants can reveal is still unknown.

## Phase 8 status

P8-A is built. `spatial/blender/render_phase8.py` adds the P7 signs and wall display to the shared model and renders the G17 shot list on GPU; `lab_interactive.glb` names every node by resource ID (69k triangles, 3.3 MB). `design/phase-08/lab-map.html` is plan-first with optional 3D, separate availability/occupancy, staleness and failure states. `scene-studio.html` measures visibility from an object-ID render, with presets, an explained impossible position, snapshots and a no-WebGL plan approximation. three.js 0.170.0 is vendored locally. Figma page `2131:82` ([cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2140-314)) holds L1–L4 and S1–S5 plus the render board; index history `2141:1831`. Simulation and example data are labelled; testing is Phase 9. Review: `.design/phase-08-review.md`.

## Phase 7 status

P7-A is built on Figma page `2108:62` ([cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2129-704)). Technician console, triage/restriction, asset passport, repair/verification, calibration record and two exceptions; faculty workspace, shortfall re-plan, attendance correction, assessment, changed revision and publish preview; nine mobile screens; three wall-display states; signage family S-01–S-06 and a wayfinding plan on P4-D geometry. New components: PH7 / Staff navigation and PH7 / Mobile tab bar. 28 roots reachable from the cover; 132 reactions, none broken; 40/87 library and 28 P6 roots verified intact. Index history `2129:1103` preserves the previous status. See `design/PHASE_07_COMPLETE_SYSTEM.md` and `.design/phase-07-review.md`. Data are prepared examples; staff/participant testing, sign compliance review and implementation remain pending.

## Phase 6 status

P6-A is built as a desktop student design prototype on Figma page `2089:42`. The room-led cover, experiment preparation, compatible reservations, arrival, instrument comparisons, notebooks, revision review, receipts and return states are linked. Two main routes and eight recovery paths pass structural link checks; all 27 product views are reachable. New compositions and revised study views were visually inspected. Project-index history `2101:42` preserves the previous status. See `design/PHASE_06_CORE_STUDENT_EXPERIENCE.md` and `.design/phase-06-review.md`. The data is prepared example content; participant/task testing and backend persistence are pending.

## Phase 5 status

P5-A is a local Atlas+ component laboratory with representative specimens for all 40 blueprint component contracts, semantic tokens, responsive compositions and five review states. Fourteen assigned contrast pairs and source coverage checks pass. Browser review is recorded in `.design/phase-05-review.md`; delivery scope and open gates are in `design/PHASE_05_DESIGN_SYSTEM.md`.

The reconnected Figma connector built and reviewed the additive page `Phase 5 · Design System — P5-A` (`2045:22`). It contains all 40 representative component families, 87 native variants, 151 review instances, 64 variables and nine text styles across seven review boards. Previous pages are preserved. Native layout, state-copy, paints, spacing and radius bindings were inspected and repaired; all built variants are shown. Actual IDs and evidence are in `design/figma-build/p5-native-state.json` and `p5-final-audit.json`. These are design specimens, not a wired full journey or live hardware integration. [Open Phase 5](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2047-1355). Local preview: http://127.0.0.1:4174/design/system/index.html.

## Phase 4 status

Phase 4 is now geometry P4-D. Dedicated CV-04 floor space no longer overlaps the 1.5 m spine; camera-to-subject distance is 2.05 m. Current models and studio renders are generated from spatial/lab_geometry.json. Sixteen geometric/export checks pass; this is not a compliance certification. See spatial/PHASE_04_SPACE_AND_3D.md. Local review: design/review.html. Prior P4-C source and outputs remain preserved.

## Phase 3 status

Phase 3 (Creative Direction) built 2 October 2026 on page "Phase 3 · Creative Direction" — see `design/PHASE_03_CREATIVE_DIRECTION.md`.
Recommended Direction v1 "Atlas+": Atlas foundation, Theatre instrument tokens, Manuscript editorial type. Not frozen until team critique and five-second tests (M7).

## Phase 2 record

Phase 2 is in progress (opened 2 October 2026).
- Content source: `research/PHASE_02_RESEARCH_AND_EXPERIENCE.md` (all ten sections complete as hypotheses).
- Canonical design file: https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF
  - Page "Phase 2 · Research & Experience": Sheets 00–09 complete.
  - Page "Foundations · Tokens & Components": research-document variables, 12 text styles, Tag / Note / Flow node / Sheet header components.
  - Sheets 05 Journeys & service blueprint, 06 Problem → requirements, 07 IA, 08 User flows, 09 Signal decision & gate built 2 Oct 2026 (student-account copy; the gmail original stops at Sheet 04).
- Signal demonstrator recommendation: E01 Sampling and aliasing (curriculum fit open).
- Fieldwork (M1–M7) has not started; every insight remains a hypothesis.

