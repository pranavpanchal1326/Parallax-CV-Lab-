# P7-A review — complete system design

Date: 2 October 2026. Canonical file: `QaLr3W9rzW1WGhkDeHx9WF`. Page: `2108:62`.

## Visual review

Every view was exported and inspected after build: cover, T1–T7, F1–F6, M1–M9, W1–W3, S1, S2. Captures are in `design/figma-build/phase-07/view-*.png`.

Repairs made during review:
- Staff navigation labels wrapped at fixed widths; destinations and search copy now hug.
- Status chips stretched in some rows; they now hug their labels.
- Booking blocks in the T2 availability lane clipped their labels; widened.
- T3 timeline rail was broken between events; it is now continuous with event spacing.
- T4 axis labels did not reach the lane end; distributed edge to edge.
- F1 rotation slot sub-labels clipped; shortened to “capture”.
- M1 date conflicted with the ISS-0417 timeline; corrected to Thu 1 Oct with “Check-in open”.
- W1 artwork was hidden: a bound paint lost its opacity. The veil now uses layer opacity. Same lesson applied to the T7 scrim.
- W2 availability colours and a copy typo corrected; F6 removed an unrelated student reference.
- S2 furniture offset and hidden zone labels corrected; S1/S2 overlap resolved.
- Storage location renamed to STO-1 across 12 text nodes to match P4-D geometry.

## Structural review

- 28 roots, 132 reactions, all destinations on this page, all roots reachable from the cover.
- 150 instances, 0 unresolved. 405 raw SVG paints bound to PH5 semantic variables; 4 open-path black fills removed; 8 SVG labels restyled to PH5/Data.
- No placeholders, top-level overlaps, or disabled actions with destinations.

## Preservation

- Phase 5 base ledger: 40/40 owners, 87/87 variants resolve.
- Phase 6: 28/28 roots remain on `2089:42`; no Phase 6 node was edited (one evidence group was cloned, not moved).
- Project index history preserved as `2129:1103` before the row-07 update.

## Open validation

- Faculty and technician task tests (triage, re-plan, attendance correction, assessment).
- Mobile tests: QR versus typed ID, offline comprehension, wrong-lab asset.
- Wall display legibility at the intended distance; signage review against local accessibility, Braille and safety rules.
- Notification policy, concurrency merge, inventory and calibration storage in an implementation.
- Real calibration data before any parameter values are shown as measured.
