# Phase 4 — Physical Plan and 3D Foundation

Date: 2 October 2026, Asia/Calcutta. Geometry revision P4-C (official HG 2021 text applied; 24 / 24 checks pass). Sources: `research/STANDARDS_AND_SOURCES.md`.
Figma: https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF — page `Phase 4 · Space & 3D Foundation`.
Status: conceptual plan and blockout complete; exit gate met for a **labelled conceptual envelope**. A measured room (A02, A03) and qualified reviews are still required before any room-specific claim.

## One source of truth

`spatial/lab_geometry.json` (metres, x east / y south) drives everything:

| Output | Produced by |
|---|---|
| Sheet 4A programme and 12 fit checks | Computed in Figma from the geometry |
| Sheet 4B general arrangement 1:50 (layered) | Drawn in Figma from the geometry |
| Sheet 4C safety/services and circulation overlays | Clones of 4B with layers toggled |
| `spatial/renders/blockout_iso.png`, `blockout_entry.png` | `spatial/blender/build_blockout.py` (Blender 5.2.2 LTS, EEVEE) |
| `spatial/exports/lab_blockout.glb` + `blockout_stats.json` | Same script |

Rebuild the 3D outputs:

```
blender -b --factory-startup -P spatial/blender/build_blockout.py
```

## Layout (10 × 7 m conceptual envelope)

| Zone | Fitted | Blueprint target | Difference |
|---|---:|---:|---:|
| CMP Computing · CV-01–06 | 26.24 | 24 | +2.24 |
| C1 Controlled capture | 11.48 | 10 | +1.48 |
| S1 Signal bench | 6.12 | 8 | −1.88 |
| COL Collaboration & demo | 7.48 | 10 | −2.52 |
| FAC + STO Faculty + kit storage | 6.68 | 6 | +0.68 |
| SPN Circulation spine | 12.00 | 12 | 0.00 |
| **Total** | **70.00** | **70** | |

Why it differs: two seated rows with an accessible 1.2 m aisle need 4.1 m of depth; that depth comes from COL and S1.

Key decisions: kit storage bay doubles as a visual and light buffer between screens and the capture zone; C1 has no windows; entry (D1, west) and second exit (D2, east) both open outward onto a 1.2 m spine; faculty desk faces the room for supervision.

## Concept renders (Sheet 4F)

`spatial/blender/render_hero.py` reuses the geometry section of `build_blockout.py`, then adds chairs, lit screens, area lighting, bevels and the candidate signal-to-pixel ceiling sculpture (CAND04). Cycles, 96 spp, denoised, AgX.

```
blender -b --factory-startup -P spatial/blender/render_hero.py -- iso
blender -b --factory-startup -P spatial/blender/render_hero.py -- eye
```

Outputs `spatial/renders/hero_iso.png` (2400 × 1470) and `hero_eye.png` (2400 × 1350). Concept renders only; the blockout (Sheet 4D) stays the technical reference.

## Revision P4-C (current)

| Zone | Fitted m² | Target |
|---|---:|---:|
| CMP | 24.96 | 24 |
| C1 | 10.92 | 10 |
| S1 | 5.76 | 8 |
| COL | 7.04 | 10 |
| FAC + STO | 6.32 | 6 |
| SPN | 15.00 | 12 |
| Total | 70.00 | 70 |

- Spine 1.2 → 1.5 m (HG 2021 4.4.1(2)); computing aisle 1.2 → 1.0 m (HG 2021 4.4.1(4), office areas ≥ 0.9 m).
- FI-1 closed: S1 bench 0.6 m deep → user zone 1.0 m.
- FI-2 closed: kit bays open west into the computing aisle with 0.9 m clear (row A shifted 0.3 m west); blackout partition on the C1 side — no circulation through capture.
- Sockets at desk level 0.9 m; EPO and call points 1.1 m; all controls ≥ 0.61 m from corners (HG 2021 4.15).
- Export: 1 272 triangles, 152 844 bytes, 106 mesh objects.
- 24 of 24 compliance and fit checks pass (Sheet 4A). CV-04 clear floor space is conditional (450 mm overlaps the spine, which keeps 1050 mm).

## Standards review (P4-B, superseded)

- Checks now cite NBC 2016 Part 4, IS 2190, HG 2021 and EN 12464-1; 18 of 20 pass (Sheet 4A).
- Added: design occupant load 18 (4.0 m²/person), exit capacity 306, door height 2100 ≥ 2000, dead-end aisle 5.4 ≤ 6 m, extinguisher reach 6.8 ≤ 15 m.
- Changed: desks 750 mm; CV-04 accessible station; door threshold 1000 mm (NBC); extinguisher top 1.0 m.
- Added lighting specification (Sheet 4A §C).

## Fit checks (computed, P4-A baseline)

| Check | Result |
|---|---|
| Zones sum to room | 70.00 / 70.00 ✓ |
| Spine width | 1.20 m ✓ |
| Computing aisle | 1.20 m ✓ |
| Access gap into aisle | 1.00 m ✓ |
| Door clear widths | 1.00 m ✓ |
| Row B seats stay out of spine | ✓ |
| Ø1500 turning circle clear | ✓ |
| C1 camera to backdrop | 2.05 m ✓ (marginal) |
| C1 no daylight | ✓ |
| S1 bench user zone | 0.95 m ▲ (1.00 recommended) |
| Kit bay front clearance with tripod deployed | 0.50 m ▲ |
| Longest route to nearest exit | ≈ 10.8 m (conservative) ✓ |

Thresholds are planning assumptions, not a compliance claim (G12.15).

## Fit issues and mitigations

- FI-1 S1 user zone 950 mm → shallower 0.6 m bench or shift spine 50 mm north, then re-test.
- FI-2 Tripod blocks kit bays → tripod park position at C1 south, or turn bays onto the spine.
- FI-3 Collaboration under target → stand-up demos at spine edge; display already wall-mounted.
- FI-4 Peak occupancy ≈ 17 (≈ 4.1 m²/person) → confirm occupancy load and exit count (A05).

## Export test (G25)

| Measure | Result | Budget |
|---|---:|---:|
| Format | glTF 2.0 binary, header and length valid | — |
| Triangles | 1 224 | 150 000 |
| File size | 147 392 bytes (144 KB) | 5 MB |
| Mesh objects / materials | 102 / 13 | — |
| Asset IDs preserved as node names | CV-01…06, C1-*, S1-B, FE-* | G15.07 |

Pending: load the GLB in the chosen browser viewer (CAND08) and check materials (G15.13).

## Still needs the real world

- A02/A03 measured room, doors, windows, columns, services.
- A04 real equipment inventory and footprints.
- A05 occupancy load and exit count.
- G12.15 fire, electrical and accessibility review.
- A08 dimensioned CAD export route.
