# PARALLAX remaining-work review

**Historical review.** The [4 October deep audit](REMAINING_WORK_AUDIT_2026-10-04.md) supersedes this backlog. U02 uses the agreed secondary-research-only methodology; participant recruitment and usability studies below are not active tasks. Dashboard, wireframes, sustainability, local AI and U03–U08 delivery now exist. Keep this record for chronology.

Reviewed 3 October 2026. Sources: assignment DOCX, phase records, execution brief, decisions, test plan, and a current capture of the demonstrator's Today screen. This is a project completeness review with a focused screen check, not a new audit of every flow or an accessibility certification.

## Interpretation of the brief

- Smart Lab Dashboard, wireframes, the ten-section report, and the 15-minute presentation are explicit deliverables.
- Smart features are introduced with “innovative ideas such as”. The document does not explicitly require eight separately implemented technologies. A coherent subset can demonstrate innovation; instructor expectations remain unconfirmed.
- Sustainability explicitly includes lighting, natural ventilation, smart power, recyclable furniture, and green materials. An energy screen alone does not cover this section.
- The deadline is 5 August with no year. Team size is three. Neither actual deadline nor team composition is established by this review.

## Focused screen check

1. Today / student overview — healthy foundation for a dashboard. Current capture shows experiment progress, the lab plan, and bookable/in-use counts. It does not show the proposed environment or energy experience. Captured evidence: `.design/completeness-review/01-today.png`. This is a viewport capture; lower page content was checked through the visible accessibility tree, not a full-page screenshot.

## Work to close

| Priority | Gap or verification need | Concrete evidence of completion |
|---|---|---|
| Essential | Submission report and presentation | Ten named report sections, references and appendices; a rehearsed 15-minute presentation with prototype demonstration and fallback recording |
| Essential | Actual research | Consented student/faculty/technician notes, coded insights, updated personas/journey, and traced design decisions; keep unvalidated assumptions labelled |
| Essential | Participant usability validation | Run core tasks and fault recovery; record unaided/assisted/failed outcomes, observations, changes and a focused re-test |
| Essential | Wireframes | Approximately 8–12 key desktop/mobile views with hierarchy and flow annotations, including an important exception; label reconstructions from final screens honestly |
| Essential | Smart Lab Dashboard | Extend Today or staff overview with upcoming sessions, occupancy, equipment restrictions, environment/energy summary and actionable alerts; preserve role visibility boundaries |
| Essential | Sensor and energy experience | Normal, alert and stale/offline examples, units, observation source/time, missing-data treatment, and an alert-to-technician workflow; all sample values labelled |
| Essential | Sustainability design | Annotated lighting/circuit and ventilation concept; repairable/recyclable furniture and finish schedule with supporting product evidence when available; explain controlled-capture light/glare tradeoffs |
| Essential | Safety coverage | CCTV placement/privacy concept, ventilation and hazard indicators, public safety information, escalation and physical fallback; qualified review remains a deployment dependency |
| Essential | Physical feasibility evidence | Room and inventory assumptions, dimensioned plan, capacities and rotation model, chair movement/service access, door/window and cable-routing concepts; show unresolved constraints explicitly |
| Essential | Technology Stack and implementation boundary | Diagram showing actual HTML/CSS/JS, Three.js, Figma, Blender and localStorage work, plus proposed backend/auth/device services distinctly; no claim that demonstrator role tabs enforce access |
| High | Accessibility and device validation | Screen-reader pass, actual browser zoom, another relevant browser, phone and low-end device timing; record issues and remedies rather than claiming blanket compliance |
| High | Coverage and submission handoff | Requirement-to-artifact matrix with designed/simulated/connected/tested status, current Figma index listing Phase 9, consistent revision links, runnable source instructions and tested assessor entry point |
| Useful innovation | Assistant and full digital manual | Equipment-specific question with approved-manual citation, version and safety boundary; uncertainty and staff escalation; structured method, setup, troubleshooting and references |
| Optional extension | AR/voice/simulated twin | One task-driven concept and fallback if selected; show why it helps. The state-linked map is a simulated twin foundation, not live IoT integration |
| Product maturity | Success criteria and operational ownership | Proposed metrics for booking, equipment finding, setup mistakes and fault resolution; alert owner, acknowledgement/escalation path, and release verification; validate institution-owned rules |

## Recommended smart feature package

Reuse the established design system and records:

1. Smart Lab Dashboard using existing availability and session records.
2. Energy and Environment detail with units, sources and sample-data labels.
3. Sensor offline/alert state leading to the existing technician thread.
4. Equipment-specific assistant/manual view with citation and escalation.

Use the state-linked Lab Map as supporting simulated spatial context. Add one AR setup overlay only if scope permits. Avoid adding eight disconnected technology demonstrations.

## Order of work

1. Create the coverage matrix and report/deck skeleton; arrange research and test sessions immediately.
2. Produce wireframes for the essential missing experiences.
3. Build the small connected smart package, safety concepts and sustainability sheet.
4. Run participant tasks, revise and re-test the most consequential findings.
5. Complete accessibility/device checks, report, presentation, Figma index and source handoff.
6. Rehearse to fifteen minutes and verify all submission links plus the demonstration fallback.

Research collection and report drafting can proceed alongside design work. Final conclusions should reflect collected evidence rather than precede it.

Existing fault propagation, acknowledgement recovery, missing-kit handling, public/private visibility and typed-ID fallbacks are strengths to preserve. Their existence does not remove the need to validate new smart-feature states or actual institutional policies.


## Current closure — 4 October 2026

The confirmed typed-input, edition-copy and stale-scan findings are repaired; exact-text export recovery and copied-scene lifecycle ownership are implemented. Current local retests, source preservation, fourteen-scenario reconciliation and submission artifacts are in `planning/U09_DELIVERY_RECORD.md`, `planning/U10_DELIVERY_RECORD.md` and `submission/EVIDENCE_INDEX.md`. This earlier audit remains historical before evidence. Full external access/device checks, human rehearsal and team facts remain explicit rather than claimed complete.
