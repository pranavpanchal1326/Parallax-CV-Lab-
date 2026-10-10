# P6-A review — core student design prototype

Date: 2 October 2026. Canonical file: `QaLr3W9rzW1WGhkDeHx9WF`. Page: `2089:42`.

The native Figma student prototype is built. This review covers visual composition, native layout bounds, component resolution, prepared evidence consistency and reaction destinations. It does not substitute for participant testing or a running lab application.

## Visual review

Native exports were reviewed for the room-led cover; experiment library; vision and signal preparation; missing calibration target; signal booking; arrival and wrong-station states; signal notebook; vision and signal revision reviews; both acknowledgement failures; both receipts; kit return and missing-target return. Revised vision/device states and the signal instruments, vision notebook and save-recovery views were also inspected. Captures are in `design/figma-build/phase-06/view-*.png`.

The compositions retain Atlas+ hierarchy and task-specific layouts. Instrument illustrations use a dark stage, reasoning uses manuscript typography and revision sheets preserve readable provenance beside the evidence. All new page-level views reuse the shared navigation and action language. The room render is content within native composition.

The first structural pass identified nineteen text-bound violations. Protocol-marker text used an 80 px default inside a 48 px column; final time-axis labels extended nine pixels outside their chart. Bounds were corrected without changing copy or scientific values. A later index export exposed white text on a mint status tag; the text now uses the existing built-state dark green binding.

## Structural and route review

The post-repair native audit reports empty issue arrays for overflow, root overlap, unbound solid paints, unstyled non-preview text, unresolved instances, broken destinations, cross-view-set destinations, placeholders and navigable disabled action instances.

All 27 product views are reachable from the cover. Ten graph checks pass: two primary pathways and eight recovery branches. The 217 destination-bearing reactions include shared navigation and cover previews; this count is not a count of unique tasks or a usability score. Both cover previews retain matching source text and proportional type size.

Two Figma presentation starting points are recorded: `2089:1400` (journey cover) and `2089:1401` (experiment library). Final root names use ordered, readable stage labels.

## Preservation

The exact base-family ledger was checked: all 40 original owner IDs and 87 original variant IDs resolve, with no missing IDs or changed variant parents. A component-set-only count would omit standalone families and include later navigation variants; the base ledger is the preservation authority.

All 11 P5-B root views remain on their original page with their recorded dimensions. Phase 6 adapted ten copies on a new page; it did not replace those sources. The pre-update active project index is preserved as `2101:42`.

## Open validation

- Participant preparation, arrival and submission task tests.
- Manual prototype click/scroll usability checks and recovery comprehension.
- Keyboard, focus, screen-reader, zoom, reduced-motion and mobile validation in implementation.
- Persistent draft recovery and stable revision storage.
- Submission reconciliation and duplicate prevention on an actual backend.
- Confirmed room, equipment quantities, institutional policies and physical calibration records.
- Device/API acquisition and scientific evaluation using a real dataset.

These remain explicit in the brief and Phase 6 handoff. Phase 7 can proceed with the remaining system design while retaining these gates.
