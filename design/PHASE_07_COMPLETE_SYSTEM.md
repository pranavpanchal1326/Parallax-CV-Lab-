# Phase 7 — PARALLAX complete system / P7-A

Built and reviewed: 2 October 2026. Direction: Atlas+ development baseline (unchanged).

[Open the Phase 7 cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2129-704). Page `2108:62`: **Phase 7 · Complete System — P7-A**. The page holds 28 views and boards plus two new component sets. Five presentation starting points open the cover, the technician thread, the faculty session, the mobile companion and the wall display.

Phase 6 designed the student journey. Phase 7 designs everyone else who touches the same lab — faculty, technicians, people on a phone, visitors reading a wall, and anyone reading a sign — using the same asset, booking, kit and evidence identities.

## The organising idea: one fault, every view

A single fixture fault, **ISS-0417 on C1-CAM**, starts where Phase 6 left it (P6-A 14 · Device recovery) and travels through every role:

| Step | Role | What happens | Views |
|---|---|---|---|
| 1 | Student | Reports the camera interruption at the station | P6 14 · M5 |
| 2 | Mobile | An offline report stays visibly pending, never “sent” | M6 |
| 3 | Technician | Classifies the symptom, restricts only C1-CAM, previews booking impact | T1 → T2 → T3 |
| 4 | Faculty | Sees the C1 rotation shortfall and chooses a re-plan option | F2 |
| 5 | Public | Wall and hang tag show a notice without names or fault detail | W2 · S-05 |
| 6 | Technician | Repairs, verifies under report conditions, or keeps the issue open | T4 · T6 |
| 7 | Everyone | Release restores B-2047 and B-2049; plan and bookings agree again | F1 · M4 |

The cover’s visibility matrix states what each audience sees and never sees about ISS-0417.

## Views

**Technician (P25 / P26)** — T1 console with a consequence ladder (safety → availability → quality → comfort) and resource impact; T2 triage with scoped restriction and a Mon–Fri availability preview; T3 asset passport with actor/time/reason movement history; T4 repair, continuity verification and release; T5 calibration record with a pinhole-model illustration, 11 of 15 reference captures, example parameters and institution-owned fitness policy; T6 verification interrupted (issue stays open); T7 concurrent-update dialog.

**Faculty (P27 / P28)** — F1 session workspace with a 6 × 20 min rotation planner, allocation check, template publishing state, zone preview and readiness shown as gaps rather than scores; F2 resource shortfall with three re-plan options and a student-notice preview; F3 booking-based attendance with a correction that keeps history (ATT-0712); F4 assessment with the reused P6 evidence pair, anchored comments and a four-criterion rubric where “not found” differs from poor performance; F5 newer revision requiring an explicit choice; F6 publish preview separating the student view from staff-only notes.

**Mobile (P31, 390 × 844)** — M1 Today, M2 Scan, M3 manual ID entry when camera access is off, M4 asset record (student-safe restriction status), M5 quick report, M6 offline pending, M7 asset from another lab, M8 station check-in, M9 technician on-site record. Four primary destinations per role; every camera action has a typed-ID alternative.

**Wall display (P32, 1920 × 1080)** — W1 now in the lab, W2 public equipment notice, W3 offline with last update and hidden notices. Large type, a clock, the P4-D room render as ambient artwork, no names or results.

**Physical** — S1 signage family S-01 door, S-02 zone blade, S-03 station label, S-04 asset tag, S-05 restriction hang tag, S-06 safety point, each with size and scale; S2 places every sign on the P4-D plan from `spatial/lab_geometry.json`, keeping the 1.5 m spine clear.

## System craft

- New components: **PH7 / Staff navigation** (Faculty/Technician × active tab, derived from PH5B navigation with a role chip) and **PH7 / Mobile tab bar** (icon + label + marker bar, so state is not colour-only).
- Reused: C03 actions, C06 status labels, PH5 semantic and geometry variables, PH5/PH5B text styles, the P6 evidence artwork and the P4-D render. No competing token system.
- All raw SVG artwork colours (405 paints) were bound to PH5 semantic variables; SVG labels use PH5/Data.
- Storage naming follows P4-D geometry: kit bay **STO-1**.

## Verification and preservation

- 28 roots; all reachable from the cover. 79 action/index links and 53 navigation-tab links; no broken destinations.
- No unresolved instances, unbound solid paints, unstyled text, placeholders, overlapping roots or disabled actions with destinations.
- Phase 5 base ledger intact: 40/40 family owners and 87/87 variant IDs. All 28 Phase 6 roots remain on page `2089:42`. Phase 6 was not edited.
- Project index: row 07 now reads **PROTOTYPE BUILT** and links to the cover. The previous index is preserved as `2129:1103`, **History / Index before P7-A**.

## Delivery boundary

All staff, attendance, calibration values, timings and messages are prepared examples continuing P6-A identities. Figma does not implement persistence, notification delivery, concurrency merging, inventory transactions or device acquisition. Sign dimensions, heights, Braille and pictograms need local accessibility and safety review. Participant and accessibility testing belong to Phase 9.

Records: `figma-build/phase-07/` (state ledger, contracts, helpers, review captures). Review: `../.design/phase-07-review.md`. Next: Phase 8 — refined 3D, Lab Map, Scene Studio and fallbacks.
