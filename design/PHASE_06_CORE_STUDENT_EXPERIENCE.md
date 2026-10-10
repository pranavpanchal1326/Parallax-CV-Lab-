# Phase 6 — PARALLAX core student experience / P6-A

Built and reviewed: 2 October 2026. Direction: Atlas+ development baseline.

[Open the native Figma journey cover](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2089-1400). Page `2089:42`: **Phase 6 · Student Journey — P6-A**. The page has 27 product views and one editorial journey cover. Two presentation starting points open the cover or experiment library.

The student design prototype carries a selected investigation from preparation through reservation, arrival, analysis, evidence review, submission and session closure. Vision and signal have their own manifests, methods, evidence and receipt identities. Eight recovery branches keep the relevant prepared context visible.

## Composition and craft

The visual language remains task-specific: a room-led atlas for orientation, a time canvas for reservations, dark scientific stages for analysis, manuscript compositions for reasoning, a frozen revision sheet for submission and a receipt for closure. A warm paper field, restrained blue actions and shared native controls connect these compositions. Serif questions interrupt the display rhythm where interpretation matters; monospace text identifies assets, units and revisions.

The cover combines the existing P4-D room render, a journey sequence, two editable native screen previews and an explicit boundary between prepared evidence and measured outcomes. The room image remains a content asset within native Figma layout; the interface text, controls, diagrams, plots and manifests remain editable. Interactive 3D refinement belongs to Phase 8.

Existing C03 actions, C07 experiment identity, C11 readiness and PH5B navigation variants are reused as instances. Existing PH5 semantic paint bindings and typography remain in use. There is no new competing token system.

## Primary pathways

| Stage | Vision / E06 | Signal / E01 |
|---|---|---|
| Preparation | Controlled frontal/side-light comparison; KIT-C1-v1 | Known generated 2 Hz reference; KIT-S1-v1 |
| Reservation | B-2041; C1 and CV-02; complete camera kit | B-2042; S1-B and CV-03; generated reference |
| Arrival | Match CV-02 and the capture zone | Match S1-B and CV-03 |
| Instrument | Illustrated camera scene with retained exposure/gain/light settings | Generated 20 Hz and 3 Hz samples on the same 0–1 s reference |
| Notebook | Lighting source and annotation provenance remain distinct | Source, sampling rates, run identities and claim boundary stay attached |
| Review | EVID-E06-r03; frozen prepared revision | EVID-E01-r03; frozen prepared revision |
| Receipt | EX-SUB-2041, following EX-REQ-2041 | EX-SUB-2042, following EX-REQ-2042 |
| Closure | Portable kit return and fixed-resource check | Bench and workstation clearing instructions |

The vision route is cover → library → preparation → reservation → arrival → workbench → notebook → revision review → receipt → kit return → atlas.

The signal route is cover → library → preparation → reservation → arrival → 20 Hz instrument → 3 Hz comparison → notebook → revision review → receipt → atlas.

## Recovery contract

| Trigger | Prepared context retained | Recovery destination |
|---|---|---|
| Calibration target missing | Selected experiment, complete manifest and missing CAL-01 | Preparation after example verification |
| Reservation conflict | Existing six-resource fixture and compatible 11:00 slot | Reservation |
| Wrong workstation | B-2041, expected CV-02 and capture setup | Correct workstation arrival |
| Camera interruption | Exposure 1/120 s, gain 0 dB, light intensity 40%, illustrated scene | Workbench or prepared condition |
| Save failure | Vision note and ILL-L1-v1 / ILL-L2-v1 source identities | Vision notebook |
| Vision acknowledgement missing | EVID-E06-r03 and EX-REQ-2041 | Matching vision receipt after example retry |
| Signal acknowledgement missing | EVID-E01-r03 and EX-REQ-2042 | Matching signal receipt after example retry |
| Return target missing | CAL-01 at 0 of 1, submission receipt and remaining return quantities | Complete kit return after example resolution |

Disabled actions have visible explanations and no navigation destination. Missing acknowledgements do not claim confirmed submission. Missing return items prevent the prepared close-session action. A designed technician follow-up record does not send a message.

## Evidence integrity

Vision overlays are illustrative annotations. ILL-L1-v1 and ILL-L2-v1 identify the prepared frontal/side-light drawings; no detection confidence or measured accuracy is invented. Both conditions preserve the same reference arrangement and settings context.

Signal plots use y(t) = sin(4πt) V over 0–1 s, with ±1 V amplitude. Samples are generated at 20 Hz and 3 Hz. Both plots retain matching time and voltage axes. Sparse samples demonstrate ambiguity for a known reference; this does not estimate an unknown physical signal. REF-2HZ-v1 is a generated input, not a booked acquisition device.

KIT-C1-v1 includes CV-02 ×1, C1-CAM ×1, LGT-01 ×2 (C1-L1/C1-L2), TRP-04 ×1, CAL-01 ×1 and the C1 capture area. The return sheet distinguishes four portable groups from two fixed resources. Stable manifests and revision identities are recorded in `figma-build/phase-06/journey-contracts.json`.

## Verification and preservation

- All 27 product views are reachable from the cover.
- Both primary routes and all eight recovery paths have the expected native Figma destinations.
- Native audit reports no detected content bounds overflow, overlapping root views, unbound solid paints, unresolved instances, broken destinations, destinations outside the Phase 6 view set, placeholders or active destinations on disabled action instances.
- The two cover previews preserve source copy and scaled typography. Their 96 scaled text overrides are intentional exceptions documented by the audit.
- Nineteen text bounds were tightened after structural review: protocol markers and terminal time-axis labels. Their copy, scientific values and font choices were retained.
- New compositions, changed instruments/notebooks and the project index were reviewed from native exports. Existing reused compositions retain the previously reviewed P5-B geometry.
- All 40 original family owners and 87 original variant IDs resolve. All 11 P5-B composition roots remain on page `2045:22` with their recorded dimensions.
- The earlier project index is preserved as `2101:42`, **History / Index before P6-A**. The active index links to Phase 6 and identifies it as **PROTOTYPE BUILT**.

The audit checks native structure and reaction graphs. It is not participant research or a manual prototype usability test. Zero detected bounds issues is not a full accessibility assessment.

## Delivery boundary and next work

P6-A supplies prepared desktop design states and clickable transitions. Figma does not implement persistent drafts, server submissions, device acquisition, authentication or inventory transactions. Those behaviors are implementation contracts illustrated here. Search, equipment and safety navigation still belong to the remaining system design scope.

Phase 7 completes the faculty and technician workflows, mobile task views, signage and wall display, using the same asset/session identities. Phase 8 refines 3D interactions and fallbacks. Phase 9 joins the wider prototype and performs accessibility, participant task checks and revision. Phase 10 assembles the report, presentation, source handoff and rehearsed demonstration.

Current review evidence: `.design/phase-06-review.md`. Native ID ledger and builder history: `figma-build/phase-06/README.md`, `phase-06-state.json` and `native-audit.json`. Do not rerun builder sections over the populated page.
