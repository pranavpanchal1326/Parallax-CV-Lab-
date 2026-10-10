# PARALLAX — Composition development, revision D

This extends Atlas+ with task-specific compositions. The P5-B Figma upgrade now implements native studies for the lab atlas, reservation/conflict, vision/device recovery, notebook/save recovery, signal/sampling comparison, 2D plan/asset index and mobile asset recovery. [Open the composed showcase](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2072-1569). The original Phase 3 studies are preserved. Remaining surfaces and complete application behavior remain contracts for subsequent production.

## Shared invariants

Preserve the lab identity, computing IDs, capture C1, signal bench S1, role permissions and evidence provenance. Express the task through composition while keeping common control behaviour predictable. Core actions must work without 3D.

Use warm paper for reading, graphite for instruments, ultramarine for actions and chartreuse sparingly for annotation. Reserve status colours for status. Scientific imagery retains its original appearance. Tables and plots carry units and captions.

## Distinct surfaces

| Surface | Composition | Main artifact | Primary action | Narrow-screen transformation |
|---|---|---|---|---|
| Lab atlas | Asymmetric room folio and asset index | Plan with matching physical IDs | Find compatible setup | Asset list before optional plan |
| Experiment library | Large selected investigation and numbered catalogue | Method, prerequisites and kits | Prepare experiment | Investigation followed by catalogue |
| Booking | Time canvas and fixed manifest | Linked room, kit and workstation availability | Reserve complete setup | Day agenda and manifest summary |
| Preparation | Sequential protocol and equipment manifest | Checked prerequisites and method steps | Confirm readiness | Ordered protocol and expandable kit |
| Signal instrument | Wide plot, aligned controls, compact run ledger | Trace, units, sample rate, provenance | Record run | Plot with local scrolling; controls below |
| Vision instrument | Image stage, settings rail and contact strip | Capture and labelled derived detections | Capture frame | Image, settings, frame strip |
| Compare results | Aligned A/B planes and difference commentary | Paired outputs with matched scales | Save comparison | Stacked A/B with repeated captions |
| Lab notebook | Manuscript pages, provenance margin, revision rail | Reasoning linked to immutable run IDs | Save evidence revision | Reading column with inline provenance |
| Faculty review | Evidence reading area and assessment rail | Evidence, rubric and feedback | Record assessment | Evidence followed by rubric |
| Technician workbench | Asset register and service dossier | Fault, booking impact, repair history | Resolve with verification | Fault list and one dossier |
| Public exhibition | Approved project image and editorial narrative | Authorised student investigation | Explore approved project | Image and caption, then narrative |

## Purposeful art

The atlas uses offset viewpoints to explain space. Booking uses time as its structure. Instruments use measurement. The notebook uses arguments and citations. The exhibition uses a project story. Do not reuse a hero-and-card skeleton across them.

The signal-to-pixel motif can appear as the overhead installation, a static exhibition divider and an atlas-view transition. It must not obscure traces, imply fake computation or distract from errors.

## Components with complete behaviour

- Setup manifest: quantities, compatibility explanations, unavailable items, alternative setup/time and final reservation summary.
- Asset identity: stable ID, location, state label and service history; same ID on signage and UI.
- Trace viewer: axes, units, legend, zoom reset, accessible data summary and linked settings record.
- Capture stage: frame metadata, permission error, disconnected device, missing calibration and saved-frame confirmation.
- Evidence block: raw/derived distinction, input links, method/model version, timestamp, run ID and annotation.
- Review action: permissions, validation explanation and retained drafts on failure.
- Navigation: visible focus, current destination, predictable back behaviour and manual ID lookup beside QR.
- 3D preview: explicit load, progress, failure recovery, reset camera and equivalent 2D/list content.

## Freeze criteria

1. Can the user name the purpose in five seconds without decorative copy?
2. Does the domain artifact receive more attention than navigation or ornament?
3. Can keyboard and narrow-screen users complete preparation, booking and evidence saving?
4. Can users recover from unavailable equipment or disconnected cameras without losing work?
5. Are example values labelled and unresolved research claims kept as hypotheses?
6. Is each composition task-driven while shared controls remain predictable?

Participant testing and team signoff remain open. Internal visual judgment cannot close those gates.
