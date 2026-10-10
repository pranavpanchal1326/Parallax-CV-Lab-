# U02 wireframe set — revision WF-2

3 October 2026 · fifteen low-fidelity screens + three design alternatives.

Open `index.html` through the existing review server (`/design/wireframes/index.html`). Individual SVGs can be imported into Figma or printed. Each has a task, hierarchy, failure state, transition, research question and an honest implementation status. `boards.json` is the editable structure; run `node design/wireframes/build.cjs` to rebuild the SVGs and review page.

These are **retrospectively reconstructed wireframes and new extension wireframes**, produced after the original high-fidelity work. Do not claim they were an earlier research-led iteration. They show structural intent and review questions; they are not a second clickable product or user test result. The live prototype links are review shortcuts, not interactions inside the wireframe itself.

The set covers Today, preparation, complete-kit conflict, mobile arrival, bench provenance, condition comparison, notebook interpretation, pending acknowledgement, operations dashboard, environment/energy, technician restrictions and plan/list fallback. Fault states appear alongside the success hierarchy rather than in separate decoration-only boards.

Three alternatives document design choices with unmeasured user preference: task-first navigation plus a separate overview; contextual AI help beside source material; attention-first dashboard versus equal-weight metrics. The assistant alternative remains a concept. No AI inference or participant preference is claimed.

## Acceptance

Fifteen diagrams exist with distinct layouts, selectable text, annotations and linked review questions. Desktop/narrow browser review and print stylesheet are part of EX-2.2 verification. Actual printing, Figma import and participant comprehension remain untested. [Secondary-research methodology](../../research/U02_DESK_RESEARCH_METHOD.md) is the active scope. DR01–DR15 are designer checks, not participant tasks; no interview/test session is planned.


## U02-R1 research annotations

WF08 wording now correctly separates E01 fixed-bench closure from E06 portable-kit return. Its geometry and route are preserved; the pre-edit source remains in the U02 revision archive.

WF-2 preserves the original twelve layouts and adds WF13 cohort readiness, WF14 attendance correction and WF15 asset movement. Every board links sources (or explicitly lacks a direct source), decisions, requirements and an evidence boundary. [Research edition](../research-u02/index.html) supplies the reviewed rationale. Rebuild in order: `node research/build-u02.cjs`, then `node design/wireframes/build.cjs`.

Supplementary operational boards are structural concepts/reconstructions of original requirements, not new React implementations. The original twelve were reviewed in EX-2.2; this revision's review belongs in the [delivery record](../../planning/U02_DELIVERY_RECORD.md). Actual printing, Figma import and participant comprehension remain untested.
