# Phase 8 — PARALLAX 3D & interaction / P8-A

Built and reviewed: 2 October 2026.

[Open the Phase 8 cover in Figma](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2140-314) · page `2131:82` **Phase 8 · 3D & Interaction — P8-A**.
Working prototypes: `node design/serve-review.cjs 4180`, then open http://127.0.0.1:4180/design/phase-08/.

Phase 8 turns the P4-D room model into three things people can use: renders that explain the space, a Lab Map that finds resources, and a Scene Studio that teaches what a camera can see. All three come from `spatial/lab_geometry.json`.

## 1. Refined renders (G17 shot list)

`spatial/blender/render_phase8.py` builds on `render_studio.py` without editing it. It adds the Phase 7 physical system to the shared model: S-02 zone headers (CMP, C1, S1), S-03 station plates, the W wall display beside D1, and an optional S-05 restriction tag on C1-CAM. Eye-level shots also get a ceiling, luminaires and full-height south and west walls; isometric and plan shots keep the open cutaway. A P4 artefact was fixed: the demonstration display title faced the wall.

| Shot | Purpose |
|---|---|
| R01 entry | Spatial identity from D1, zone signs overhead |
| R02 iso cutaway | Every zone, sculpture above the spine |
| R03 student eye | Seated view at CV-05 |
| R04 capture | Camera, L1/L2, stage and CAL-01 on the 2.05 m axis |
| R05 signal bench | S1 with illustrative instruments |
| R06 collaboration | Shared table and demonstration display |
| R07 storage | STO-1 kit bays beside the computing aisle |
| R08 plan base | Base for services and circulation overlays |
| R04 / R02 restricted | Same views with the Phase 7 RST-0417 tag |

Cycles on OptiX (RTX 5060 Laptop), 128 samples, denoised, AgX. Full PNGs in `spatial/renders/phase-08/`; 1600 px JPEGs in `design/phase-08/renders/`. Equipment forms remain illustrative.

## 2. Interactive model with resource IDs (G15.04, G15.07)

`render_phase8.py -- export` writes `spatial/exports/lab_interactive.glb`: 43 nodes, each named by its resource ID (CV-01…CV-06, C1-CAM, CAL-01, S1-B, STO-1, ZONE-*, SAFETY-*, SIGN-*). 69,052 triangles, 3.31 MB, within the 150,000 / 5 MB budget. The detailed presentation model `lab_studio.glb` is unchanged.

## 3. Lab Map (P10) — `design/phase-08/lab-map.html`

- Plan first. The 3D model loads only when requested, after WebGL2 detection, with its size stated.
- One searchable list, a focusable SVG plan and the 3D model share the same IDs. Enter opens the first match; `?id=C1-CAM` deep-links.
- Every fact appears in an HTML drawer. Availability and occupancy are separate labelled facts with a timestamp and a stale state.
- Five named viewpoints, reset, and a camera-follow toggle; reduced motion jumps instead of animating.
- Review states: normal, stale, model fails to load, WebGL unavailable. Failures return to the plan without losing the selection.
- Portable items without plan geometry (CAL-01) show a dashed home position rather than disappearing.

## 4. Scene Studio (P13 / E12) — `design/phase-08/scene-studio.html`

- Scene, camera image and interpretation side by side, with a top-view plan that is also the full no-WebGL fallback.
- Six numeric controls (distance, sideways, height, pan, tilt, horizontal FOV) in metres and degrees, measured in C1, so a setting can be reproduced at the tripod.
- Presets: frontal (2.05 m as built), occlusion example, side 45°, wide 90°, narrow 18°, and an impossible position behind the partition, explained.
- Visibility is measured, not guessed: each object is rendered alone and in the full scene as an object-ID image (320 × 180). Occlusion, in-frame fraction and the occluding object come from those pixels.
- The explanation names cause and effect, e.g. “Changing the sideways offset uncovered part of 03 EXPECTED OBJECT (now 47% visible).”
- Snapshots keep settings, image and explanation together and are labelled simulation. Settings can be shared as a link.
- Objects 01 BOX, 02 CYLINDER and 03 EXPECTED OBJECT match the P6 vision illustrations.

## 5. Figma

Ten roots: cover with the shot gallery, restriction comparison and the G15/G16 contract; Lab Map L1–L4 (plan, 3D, failure, mobile); Scene Studio S1–S5 (frontal, occlusion, impossible position, no WebGL, mobile). They reuse the student navigation, C03 actions, C06 status labels, the P7 plan drawing and the P7 mobile tab bar. A new scoped collection, **PH8 · Illustration / P8-A** (14 colour variables), binds the greys of the scientific redraws, so every paint on the page is bound without flattening the shading. Fifty-two texts inside scaled plan and camera previews keep their scaled sizes as documented preview exceptions, the same rule as P6.

## Verification and preservation

- `node design/phase-08/validate.cjs`: **19 / 19 pass**. It checks that map resources exist as GLB nodes and in the geometry or declared homes, the budgets, the viewpoints and the RST-0417 state.
- Browser checks of both prototypes at desktop and mobile widths, with all review states. No console errors.
- Figma: 20 prototype links and 12 navigation links, no broken destinations, overlaps or unresolved bindings.
- Preserved: P5 40/40 families and 87/87 variants; P6 28 roots; P7 28 roots and 132 reactions. The project index row 08 now reads PROTOTYPE BUILT; the previous index is kept as `2141:1831`.

## P8-B — visual upgrade (same geometry, new craft)

P8-A stays as the record: `spatial/renders/phase-08/`, `design/phase-08/renders/` and `design/phase-08/index-p8a.html` are unchanged. P8-B adds:

- **Look development** — `spatial/blender/render_phase8b.py` rebuilds the identical P8-A scene, then changes only materials, light, lens and post. All procedural, no downloaded textures: terrazzo floors (noise + Voronoi chips, clear-coated), plaster walls, quarter-sawn ash with fibre noise, clear-coat HPL desks, graphite metal, woven fabric seats with sheen, lacquered fins and glowing phosphor samples. Multiple-scattering physical sky; a low warm sun through W1; a cool fill and rim for the isometric view on a graphite reflective plinth; light reflections suppressed in the plinth; depth of field on close shots; compositor glare on emissives only. Two plants and notebooks are illustrative props kept outside every clearance zone.
- **New shots that complete G17** — **H01** hero down the spine at golden hour; **R09** KIT-C1-v1 laid out from above with every part labelled by ID (G17.09); **R10** the signal-to-pixel sculpture as the fins become glowing samples (G17.10); plus a restricted R04.
- **A01 orbit animation** (G17.11) — slow 8 s orbit of the isometric model, used as the hub hero with a pause control (WCAG 2.2.2) and no autoplay under reduced motion.
- **A03 signal → pixel, live** (G17.13) — `assets/signal-pixel.js`: a 2 Hz reference sampled at a user-chosen rate. The dashed curve is the exact alias, sin(2π·(F − k·fs)·t + φ), so it passes through every sample; the validator checks this to 1e-9.
- **Lab Map 3D** — environment lighting, AgX tone mapping, soft shadows, graphite stage, availability halos (shape + colour), real `<button>` ID pins with declutter and tooltips, eased camera moves, a gentle pulse on the selection and sculpture (off under reduced motion), and a toggle to hide pins and halos.
- **Scene Studio** — spot lights at the L1/L2 softbox positions with soft shadows, clear-coated objects, environment reflections, a translucent field-of-view pyramid. Measured values are unchanged by the visual upgrade (frontal 365 / 367 / 167 px).
- **Hub** — `design/phase-08/index.html`: video hero, live A03, prototype cards, a keyboard-operable full-screen gallery, a P8-A ↔ P8-B comparison slider, the R09 kit story and the contract table.

Defects found and fixed during P8-B: bloom haloing on white walls (threshold per shot), ghost disc reflections in the plinth, washed interior exposure, two poorly framed hero shots, a "camo" ash grain (band direction), A03's alias curve missing the samples, A03 blank after pause or resize, and a fallback-path crash in Scene Studio when WebGL is momentarily unavailable.

## Boundaries

Scene Studio simulates geometry only: no lens distortion, exposure, sensor noise or detector. Lab Map states are prepared examples, not a live twin. Figma camera images are vector redraws of prototype output; L2 uses the R02 render as a representative 3D frame. Participant, keyboard, screen-reader and low-end device testing belong to Phase 9.

Records: `figma-build/phase-08/` (state, review captures). Review: `../.design/phase-08-review.md`.
