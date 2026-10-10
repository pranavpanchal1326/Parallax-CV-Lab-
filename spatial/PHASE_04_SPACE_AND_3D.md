# Phase 4 — Physical plan and 3D foundation

Current revision: **P4-D**, 2 October 2026. Scope: a labelled 10 × 7 m conceptual envelope.

Geometry and export checks pass. Site survey, equipment verification and qualified building review remain open. Prior geometry, scripts, renders and report are preserved in `spatial/revisions/P4-C/`.

## Authoritative geometry

`spatial/lab_geometry.json` drives current Blender models and the local review plan. Units: metres; origin north-west; x east and y south. Blender negates y; glTF exports use y up.

| Zone | Current area / m² | Original target / m² |
|---|---:|---:|
| Computing CMP | 24.96 | 24 |
| Kit storage STO | 3.12 | included in faculty |
| Controlled capture C1 | 10.92 | 10 |
| Circulation spine SPN | 15.00 | 12 |
| Faculty FAC | 3.20 | 6 with storage |
| Collaboration COL | 7.04 | 10 |
| Signal bench S1 | 5.76 | 8 |
| **Total** | **70.00** | **70** |

The programme trades collaboration and bench area for a continuous 1.5 m spine. It does not establish approved occupancy. Simultaneous use, equipment service access and chair movement need full-scale review.

## Corrections in P4-D

- CV-04 turns toward the west wall, with its user on the east. A dedicated 1.2 × 0.9 m approach rectangle at x 0.8, y 2.6 has zero overlap with furniture or the spine. The render leaves it empty rather than placing a chair there.
- Camera centre moves to (7.50, 1.90). Object-stage centre moves to (9.55, 1.90), producing a genuine 2.05 m camera-to-subject distance. Camera-to-backdrop is 2.35 m. The axis now records its actual subject plane.
- Object stage is 0.6 × 1.0 m; kit suitability remains an inventory question. Its east edge meets the backdrop face without footprint overlap.
- Collaboration table grows to 2.4 × 0.8 m. Four conceptual seats are arranged at 0.6 m centres. Dynamic pullback and comfort are not certified by footprint checks.
- Emergency controls are modelled around their recorded 1.1 m mounting centres. Safety markers in the foundation model remain schematic.
- CV-04 power/data points move beneath the rotated workstation. Service routing is conceptual; flush fittings are assumed.

## Presentation craft

`render_studio.py` adds procedural geometry to the common room source: five-star chair bases, armrests, monitor supports, keyboards, camera tripod legs and lens, framed softboxes, a calibration checker target, illustrative oscilloscopes and generators, cabinet seams, acoustic battens and typographic identity.

Material direction: porcelain work surfaces, graphite frames, warm ash for discussion, ultramarine upholstery and restrained phosphor accents. Example screen traces are artwork, not real experiment data. Acoustic performance, finish durability and lighting performance have not been calculated.

The signal-to-pixel installation remains candidate CAND04. Its lowest fins are above 2.5 m in this model. Suspension, structural loading, fire performance, maintenance and glare need design development; this is not a construction detail.

## Deliverables and reproduction

| Output | Purpose |
|---|---|
| `renders/studio_iso.png` | Current presentation isometric, 1800 × 1250 |
| `renders/studio_eye.png` | Current eye-level study, 1800 × 1050 |
| `renders/blockout_iso.png`, `blockout_entry.png` | Simplified geometry references |
| `exports/lab_studio.blend` | Editable presentation scene, before text conversion |
| `exports/lab_studio.glb` | Detailed browser model |
| `exports/lab_blockout.glb` | Lightweight technical model |
| `exports/upgrade-validation.json` | Geometry/export evidence |
| `../design/review.html` | Editorial review, comparison, plan and optional 3D |

Run from the project root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup -P spatial/blender/build_blockout.py
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup -P spatial/blender/render_studio.py -- iso
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup -P spatial/blender/render_studio.py -- eye
node spatial/validate-upgrade.cjs
node design/serve-review.cjs
```

Preview: http://127.0.0.1:4173. The optional viewer library loads from a pinned CDN version when requested. Plan, comparison and renders do not depend on it.

## Verification

`node spatial/validate-upgrade.cjs`: **16 / 16 pass**. Checks cover area, bounds, furniture footprints, dedicated approach intersections, spine clearance, camera target/distance, GLB structure, budget and furniture IDs.

| Export | Triangles | Bytes | Mesh nodes |
|---|---:|---:|---:|
| Technical blockout | 1,260 | 151,456 | 105 |
| Detailed studio | 46,172 | 2,601,516 | 722 |

Both are below the existing 150,000-triangle / 5 MB limits. A file budget does not prove runtime performance on a student's phone.

Current tests supersede the previous unqualified “24/24 compliance checks” statement. This is a geometric fit result, not statutory certification. Historical P4-C audit evidence remains available to explain the corrected defects.

## Native Figma synchronization — 2 October 2026

The canonical file is accessible again. Active boards 4A–4F now use the P4-D room source and current studio/blockout renders. Three native plan layers were checked against all 17 furniture footprints and current power/data points. The equipment schedule, camera axis, separate CV-04 approach and geometry/export counts were corrected. All six earlier P4-C boards remain in history section `2064:173`; the active board IDs are preserved.

[Open the synchronized floor plan](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2031-1054). Native evidence and screenshots: `../design/figma-build/revision-p5-b/spatial-audit.json` and `final-2031-1054.png`. No local room geometry was changed during this synchronization.

## Remaining gates

- Actual room survey: doors, windows, columns and services.
- Equipment inventory, lens/FOV selection and calibration trial.
- Qualified accessibility, electrical, fire, ventilation and occupancy reviews.
- Student/faculty/technician research and task testing.
- Dimensioned CAD deliverable and final review approval.

Sources in `research/STANDARDS_AND_SOURCES.md` remain a reference list. This revision does not independently recertify their applicability.
