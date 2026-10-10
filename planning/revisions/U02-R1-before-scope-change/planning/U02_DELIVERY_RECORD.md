# PARALLAX — U02 delivery record

U02-R1 · 3 October 2026 · phase: research and design evidence.

**The public desk-research and design package is delivered. Full U02 remains open for local participant validation.** The user authorised using web information; we completed the work that public evidence and the existing project can support. No consented local interviews, surveys, observations or room measurements have occurred.

## Delivered and reviewable

| Deliverable | Evidence | State |
|---|---|---|
| Fourteen reviewed sources | [Register](../research/U02_SOURCE_REGISTER.md), reading depth, locators, limitations and exclusions | Delivered; abstract/partial/unread-correction boundaries explicit |
| Research synthesis | [Six ranked tensions, jobs, persona/empathy refinements, journey, service ownership, roadmap and measurements](../research/U02_RESEARCH_SYNTHESIS.md) | Delivered as researcher interpretation; local frequency unknown |
| All twelve hypotheses | [Review and disconfirming evidence](../research/U02_HYPOTHESIS_REVIEW.md) | Delivered; all local statuses remain open |
| Twenty original requirements | [CSV traceability](../research/U02_TRACEABILITY.csv) | Delivered; source gaps and implementation boundaries visible |
| Eight product decisions | [Chosen/alternative/rationale/revisit record](../research/U02_DESIGN_DECISIONS.md) | Delivered; no participant preference asserted |
| Fifteen wireframes | [Review page](../design/wireframes/index.html), selectable SVGs and source annotations | Twelve original layouts preserved; three supplementary operational boards added |
| Flagship storyboard | [Seven illustrated frames and three recovery branches](../research/U02_FLAGSHIP_STORYBOARD.md) | Authored scenario using dated Figma and React evidence |
| AI design brief | Synthesis and D-U02-06 | Hint-first/manual-source modes, context, failure and evaluation defined; real inference remains U06 |
| Local collection handoff | [Protocol and seventeen total task IDs](../research/collection-pack/README.md), empty participant CSVs | Prepared, not run; distinct discovery and usability rounds |
| Rendered research edition | [Research review](../design/research-u02/index.html) | Links the sources, story, decisions and requirement coverage |

## Preservation

The pre-edit legacy research/standards records and original board data/generator are retained in `revisions/U02-pre-web/`. Historical evidence is preserved with dated addenda. The original twelve wireframe block layouts remain unchanged; source annotations are added. WF08 copy is corrected to distinguish E01 fixed-bench closure from E06 portable-kit return, as the original E01 receipt and domain already specify. The three additional boards close previously uncovered structure for cohort readiness, attendance correction and asset movement. They do not claim new React implementations.

This increment changes research/design documentation and review surfaces. It does not change product state, scientific fixtures, geometry or the React/legacy domain implementation. No participant findings are inserted into collection CSVs. New static review assets reuse existing project imagery and edition typography.

## Verification

Run in order from the workspace root:

```text
node research/build-u02.cjs
node research/update-u02.cjs
node design/wireframes/build.cjs
node research/validate-u02.cjs
npm run check
```

The integrity check validates source/hypothesis/decision/requirement references, all fifteen board annotations, original layout preservation, storyboard assets, internal review links/anchors and header-only participant CSVs. The root checks guard the original demonstrators and geometry. Browser review evidence and actual results are recorded below after verification.

### Recorded results — U02-R1

- **848/848 integrity checks passed**, including 316 local links/assets and all 11 preserved legacy/design/geometry source hashes. [Machine-readable result](../research/evidence/u02-integrity.json).
- **Root checks passed:** prototype 65/65, scene 25/25, spatial 16/16, design-system source/contrast checks and the existing Phase 1–4 audit. These verify their stated scopes, not participant outcomes or physical certification.
- Browser rendered all seven storyboard assets and all fifteen wireframe SVGs. A WF13 source link opened the matching S02 entry and browser back returned to the faculty board.
- Research desktop width 855 CSS pixels had no page overflow. Wireframe desktop width 1265 had no overflow. At the 320-pixel viewport both pages had 305-pixel content width/scroll width: no page-level horizontal overflow. Three research tables scroll inside keyboard-focusable labelled regions.
- Keyboard Enter on the skip link moved to `#main` and focused the main landmark. Full screen-reader, device, printed-page and applicable-WCAG-AA validation remain unrun.
- Corrected a two-pixel mobile navigation overflow, duplicate source-label wording and E01/E06 closure copy. No React/domain behaviour changed; its existing EX-2.2 tests were not rerun for this documentation-only increment.

[Browser measurements](../research/evidence/u02-browser-review.json) · [Desktop research screenshot](../research/evidence/u02-research-desktop.jpg) · [320px research screenshot](../research/evidence/u02-research-320.jpg) · [Story screenshot](../research/evidence/u02-story-desktop.jpg) · [Wireframes desktop](../research/evidence/u02-wireframes-desktop.jpg) · [Wireframes 320px](../research/evidence/u02-wireframes-320.jpg).

## Participant-dependent completion gate

- [ ] Collect consented discovery accounts and real local artefacts; record actual recruitment/access limitations.
- [ ] Observe real preparation/evidence/handover practice and confirm attendance/booking/training ownership.
- [ ] Run neutral usability tasks with the prepared pilot; keep assistance and contradictory evidence.
- [ ] Replace/revise hypothesis persona attributes and journey stages only where collected notes support them.
- [ ] Link actual findings to changed requirements/screens and re-test critical issues.
- [ ] Confirm E01/E06 curriculum fit and AI learning criteria with faculty.
- [ ] Survey room/routes/lighting and obtain qualified physical, ventilation, hazard/CCTV and shutdown-policy review in the appropriate physical phase.

No source can close these local gates on its own. The User Research rubric now has a substantial secondary foundation, but cannot honestly be labelled excellent/validated. U02 also strengthens Problem Analysis, UI/UX and presentation evidence; full marks depend on the remaining research, implementation, safety and submission work.

## Next implementation handoff

Carry D-U02-03 into remaining U05 experiences, D-U02-06 into U06 grounding/evaluation and D-U02-04/D-U02-08 into U07 ownership/policy. Add WF13–WF15 to the React coverage ledger rather than equating new wireframes with parity. Keep U02 participant collection active alongside implementation. The report should cite this revision as desk research, distinguish authored scenarios from real sessions and state the current limitations.
