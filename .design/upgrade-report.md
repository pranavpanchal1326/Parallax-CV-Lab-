# PARALLAX improvement record — P4-D

User-authorised scope: fix the audited defects, strengthen professional/artistic presentation, and preserve existing work.

## What changed

1. Preserved P4-C geometry, scripts, renders, report and GLB under `spatial/revisions/P4-C/`.
2. Rotated CV-04 and gave it a dedicated approach floor outside the spine. Corrected camera-to-subject geometry to 2.05 m. Enlarged the collaboration table and corrected schematic control heights.
3. Rebuilt the technical model. Added a separate detailed studio scene, editable Blender source and GLB with original room/furniture IDs retained.
4. Added purposeful materials, wall typography, acoustic battens, meaningful illustrative instrument screens, recognisable signal equipment, camera supports and schematic safety devices. The installation remains an explicitly labelled candidate.
5. Built a local editorial review with before/revised comparison, geometry-driven SVG plan, area schedule, optional 3D loading, keyboard model controls and static alternatives.
6. Added composition contracts for eleven task families rather than repeating one page skeleton.
7. Replaced conflicting spatial figures and blanket compliance language; updated the project brief and master-blueprint authority note.

## Verification performed

- Blender 5.2.2 LTS generated the current simplified model, detailed GLB, editable scene and two studio renders. Both new views were visually inspected.
- `node spatial/validate-upgrade.cjs`: 16 geometric/export checks passed. Evidence is `spatial/exports/upgrade-validation.json`.
- In-app browser loaded the local detailed GLB and showed the complete room. Representative material separation, cutaway walls and the room composition were inspected against the render.
- Arrow-key model control and reset were exercised. Before/revised switching was exercised with pointer and Enter; pressed states updated.
- Tested viewport overrides at 320 and 640 px, plus the default desktop viewport. The initial narrow overflow was corrected; final measured body width equals viewport width (305 / 305, 625 / 625 and 1265 / 1265 CSS px after scrollbar space).
- Both presentation images loaded in the browser. Error/warning console inspection returned an empty list during the checked session.
- Saved `design/review-desktop.jpg`. Keyboard focus indication was visible during comparison testing.

These are targeted checks, not a complete accessibility or cross-browser certification. Actual 200% browser zoom, screen-reader coverage, WebGL failure simulation and low-end-device performance have not been verified.

## Boundaries

The local review is not the full lab operations application. Figma was not modified. There is no invented fieldwork, institutional approval or participant-test completion. Site-specific building suitability, real device compatibility, calibrated optics, photometry, acoustic performance and suspension engineering remain open.

Run `node design/serve-review.cjs` from the root and open http://127.0.0.1:4173. The server binds only to localhost. The optional pinned viewer library requires internet access; core review content does not.

The geometry script `upgrade_geometry.cjs` records the bounded P4-D edit. The older audit script understands the explicit approach rectangle, while its original evidence JSON is retained as historical P4-C evidence.
