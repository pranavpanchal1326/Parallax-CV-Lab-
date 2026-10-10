# PARALLAX EX-2.2 — smart context and design evidence

3 October 2026 · second upgrade milestone · local demonstrator.

## What is implemented

The React app now has a recognisable Smart Lab Dashboard, an environment/sustainability detail page and E01/E06 recorded-condition views. Existing student, technician and public journeys remain in place; the original demonstrator remains available. U01 preservation is complete for the migration baseline. U02, U03, U04 and U05 are in progress; none is declared wholly complete by this increment.

The dashboard derives equipment restrictions, active sessions and pending acknowledgements from the existing React state rather than storing duplicate counters. A pending receipt has a route back to the same submission request. The plan uses canonical geometry P4-D and separate availability/occupancy. Sensor connections are explicitly zero. Role navigation is a prototype preview, not authentication.

The environment desk demonstrates disconnected, recent, delayed and invalid readings for temperature, CO₂ and illuminance. Each has an ID, zone, unit, source, quality, observation time and receipt time. A five-minute freshness rule is an illustrative policy, not a certified room threshold. Scenario timestamps are generated at review against the fixed example clock; no historical feed or hardware integration exists. The current selection resets on reload; stored observations remain with captures.

Energy previews use nominal-load assumptions and an explicit interval to calculate an upper bound. Restricted/unlocated resources, active or checked-in sessions and overlapping example bookings prevent a proposal. A conservative 60-minute slot is used only for energy previews. Essential services are excluded. There is no meter, remote power command or physical automation. No measured energy savings are claimed.

All five sustainability requirements have visible concept entries: lighting, natural ventilation, smart power, recyclable furniture and green materials. Each identifies evidence still required. The ledger does not substitute for supplier documentation, daylight measurements, facilities review or procurement.

New captures retain method, fixture and geometry revisions, settings, condition/source, timestamp, selected observations, resource state and a generated reference where applicable. Adapter cloning preserves the prior record; duplicate capture attempts cannot rewrite context. Signal replay uses retained reference parameters. Vision plates are reconstructed illustrations, with no detector accuracy or camera image implied. Older EX-2.1 captures remain accepted without invented context; malformed optional context is refused by persistence validation while the browser record is retained.

Twelve distinct low-fidelity SVG boards document hierarchy, transitions, recovery and test questions. They are honestly marked as retrospective reconstruction or new extension work. Three alternatives record navigation, contextual AI placement and dashboard hierarchy decisions. AI placement is a concept only. The collection pack supplies a neutral interview script, existing-plan tasks plus four smart-feature tasks, consent/storage preparation and three header-only CSVs. Actual participants remain zero.

## Rubric contribution and remaining evidence

| Criterion | Added evidence | Gate still open |
|---|---|---|
| User Research (10) | Neutral collection protocol, pseudonymised templates, traceable findings structure | Actual consented research, synthesis, revised personas/journey and re-test |
| Problem Analysis (10) | Wireframe tasks/recovery and test questions; consequences tied to existing rules | Real evidence supporting priorities and hypothesis changes |
| Space Planning (15) | Dashboard reuses the canonical scaled geometry and text equipment list | Measured site, validated physical clearance/service/safety review |
| UI Design (15) | Twelve wireframes, dashboard, environment and comparison views | Broader React/Figma coverage, participant-tested hierarchy and remaining detailed states |
| UX Design (15) | Explicit sources, unknown states, recovery routes and immutable context | Full manual access/device testing and observed comprehension |
| Innovation & Smart Features (10) | Simulated sensor provenance, standby boundaries and condition replay | Grounded AI, further rehearsal/consequence experiences; hardware/voice/AR scope remains explicit |
| Accessibility & Safety (10) | Labelled native inputs, plan/list and table alternatives, missing/invalid states, protected energy boundary | Screen-reader/zoom/cross-browser checks; physical hazard, CCTV and ventilation specifications/review |
| Prototype & Demonstration (10) | Working React routes, retained records and checked recovery | Complete coverage ledger, full demo rehearsal and clean-device launch |
| Presentation & Documentation (5) | This implementation record, linked evidence and reproducible run commands | Assignment's ten-section report, fifteen-minute presentation and submission package |

The rubric names and marks do not provide official excellent-band descriptors. This table describes evidence contributions, not guaranteed marks. Adding feature count alone cannot close research or safety gates.

## Review surfaces

Run `npm start` from the root and build with `npm run lab:build`.

- React: `http://localhost:4180/apps/lab-web/dist/index.html#/dashboard`
- Environment: `#/environment`; record conditions via each experiment's Bench.
- Wireframes: `http://localhost:4180/design/wireframes/index.html`
- Source/limitations: `../apps/lab-web/README.md` and `../apps/lab-web/VERIFICATION.md`.
- Collection: `../research/collection-pack/README.md`.

Before extension, 22 React source/config/test/documentation files were preserved under `revisions/EX-2.1-react/` with SHA-256 hashes. Original prototype/design/geometry source preservation is checked against the EX-2.1 baseline; root package script additions are intentionally excluded from the unchanged-source claim.

## Next delivery boundary

Grounded AI needs approved local source records, explicit context and missing-source/error/evaluation states before provider connection. Continue the coverage ledger and scientific rehearsal alongside actual research collection. Deadline year, actual team composition, access to participants and measured site remain unresolved. Their absence does not prevent local implementation, but the final report must disclose them until confirmed.
