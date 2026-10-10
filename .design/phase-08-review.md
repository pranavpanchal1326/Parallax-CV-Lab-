# P8-A review — 3D & interaction

Date: 2 October 2026.

## Renders

Test renders at 16 samples exposed these problems, all fixed before the final 128-sample pass:
- Interior shots looked into a grey void because there was no ceiling. Eye-level shots now have a ceiling, luminaires and full-height S/W walls.
- The S-02 code band faced the wall; the S1 header text sat over its band. Both corrected.
- R04 was blocked first by a softbox, then by the C1 partition. The camera now sits inside C1's south-east corner looking back along the axis.
- R05 and R07 were framed too tightly; raised and pulled back.
- The demonstration display title was mirrored, an artefact inherited from P4. Rotated to face the room.
- Interior lighting was reduced after the first pass looked washed out.

The export first produced fragmented sign nodes (`SIGN-S-02-code.001`…). The grouping was corrected: 43 clean resource nodes.

A PowerShell 5 text round-trip mangled UTF-8 characters in `resources.json` and `render_phase8.py`; both were repaired by reversing the mis-decode. Later edits used the editor tool only.

## Prototypes (browser-verified)

- Lab Map: search → select → drawer; deep link; 3D load from the GLB with highlight; named views; stale, model-failure and no-WebGL states. No console errors.
- The 3D Capture viewpoint first sat outside the east wall; moved inside the spine.
- Scene Studio: the camera image was solid mint because the camera rendered its own body. Helpers moved to a separate render layer.
- The explanation said “all visible” for a 30%-hidden object, said “disappear” without saying why, and used “moved behind” when an object was being uncovered. All three are now worded from the change in visible fraction and its cause.
- Object 03 moved to z 2.22 so the frontal preset matches the P6 illustration. The occlusion preset was recomputed so camera, cylinder and expected object are collinear (99% hidden).
- The impossible position now states the limit in the headline and disables snapshots.
- Mobile: tabs work; overlay labels are clamped inside the frame.
- Validator found CAL-01 missing from the plan geometry. Fixed by declaring a home position in data, drawn dashed on the plan — the P4 geometry was not edited.
- Port 4173 was occupied by an older server that serves CSS as `application/octet-stream`. `serve-review.cjs` now takes a port argument; the review uses 4180.

## Figma

- L1: the 96 px identity wrapped in the drawer, and chips and buttons overflowed. Changed to the Page style with stacked facts and actions.
- S1: the interpretation headline was too large and the chips squeezed names. Fixed.
- S2/S3: some freshly bound paints in cloned nodes rendered black even server-side. Repaired by copying known-good bound paints, then confirmed by a server render.
- Binding raw illustration paints dropped the 14% wedge opacity; restored.
- A copied link pointed L2 to itself; self-links removed before wiring.
- Final: 165 raw paints bound (PH5 semantic + PH8 illustration), 0 unresolved, 0 overlaps, 0 broken links.

## P8-B review (visual upgrade)

Honest critique of P8-A that drove P8-B: flat white materials, washed even lighting, low contrast, no hero image, G17 shots R09/R10 and animations A01/A03 missing, basic browser 3D without environment light or labels.

Look-dev iterations (half-res, 24 samples) before the final 160-sample batch:
1. Isometric haloed and showed ghost discs → glare threshold raised for ortho shots, area lights hidden from glossy rays, vignette removed.
2. Interiors washed → interior exposure −0.55, luminaires and panels reduced, sky 0.35.
3. Hero framed a black partition in the foreground → camera moved to the west end of the spine. R10 missed the fins → reframed to catch the last fins and first samples together.
4. Ash grain read as zigzag camouflage in R06 → band direction across the board, lower distortion, fibre overlay. The running batch was stopped so the animation would not inherit the flaw; affected shots were re-rendered.
5. R09 manifest accent line crossed the text → moved left of the list.

Browser checks: Lab Map 3D loads with 17 pins, halos and shadows; deep link highlights C1-CAM; pins declutter. Scene Studio camera image now lit from the softbox positions, measurements unchanged. A03: alias error < 1e-9; paused frame persists after resize. Scene Studio fallback crash (missing camera label) fixed.

## Open validation (Phase 9)

- Task tests: find-and-book via list vs plan vs 3D; Scene Studio explanation comprehension (“explain the effect of a viewpoint change”).
- Keyboard and screen-reader pass on both prototypes; 200% zoom; reduced motion.
- Low-end laptop and phone performance for the 3.3 MB model.
- Real camera intrinsics and a physical capture to compare against the simulation.
