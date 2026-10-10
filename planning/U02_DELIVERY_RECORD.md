# PARALLAX — U02 delivery record

U02-R2 · 3 October 2026 · phase: secondary research and design evidence.

**U02 is complete under the user-agreed secondary-research-only scope.** The user explicitly excluded interviews and participant studies. No local interviews, surveys, participant usability sessions or field observations will be conducted. Reviewed web evidence, critical synthesis, design-artifact analysis and designer walkthroughs form the methodology. [Scope and report-ready statement](../research/U02_DESK_RESEARCH_METHOD.md). Local user behaviour, learning and physical conditions remain unverified limitations.

## Delivered and reviewable

| Deliverable | Evidence | State |
|---|---|---|
| Fourteen reviewed sources | [Register](../research/U02_SOURCE_REGISTER.md), reading depth, locators, limitations and exclusions | Delivered; abstract/partial/unread-correction boundaries explicit |
| Research synthesis | [Six ranked tensions, jobs, persona/empathy refinements, journey, service ownership, roadmap and measurements](../research/U02_RESEARCH_SYNTHESIS.md) | Delivered as researcher interpretation; local frequency unknown |
| All twelve hypotheses | [Assumption review and possible counterevidence](../research/U02_HYPOTHESIS_REVIEW.md) | Delivered; unvalidated local assumptions, not pending interviews |
| Twenty original requirements | [CSV traceability](../research/U02_TRACEABILITY.csv) | Delivered; source gaps and implementation boundaries visible |
| Eight product decisions | [Chosen/alternative/rationale/revisit record](../research/U02_DESIGN_DECISIONS.md) | Delivered; no participant preference asserted |
| Fifteen wireframes | [Review page](../design/wireframes/index.html), selectable SVGs and source annotations | Twelve original layouts preserved; three supplementary operational boards added |
| Flagship storyboard | [Seven illustrated frames and three recovery branches](../research/U02_FLAGSHIP_STORYBOARD.md) | Authored scenario using dated Figma and React evidence |
| AI design brief | Synthesis and D-U02-06 | Hint-first/manual-source modes, context, failure and evaluation defined; real inference remains U06 |
| Designer evaluation | [Fifteen desk walkthrough checks](../research/U02_DESK_REVIEW.md) | Structural review and implementation limits; no participant outcomes |
| Historical collection plan | [Unrun protocol](../research/collection-pack/README.md), empty participant CSVs | Excluded from execution; retained for provenance |
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

- **848/848 integrity checks passed**, including 316 local links/assets and all 11 preserved legacy/design/geometry source hashes. [Archived R1 result](revisions/U02-R1-before-scope-change/research/evidence/u02-integrity.json).
- **Root checks passed:** prototype 65/65, scene 25/25, spatial 16/16, design-system source/contrast checks and the existing Phase 1–4 audit. These verify their stated scopes, not participant outcomes or physical certification.
- Browser rendered all seven storyboard assets and all fifteen wireframe SVGs. A WF13 source link opened the matching S02 entry and browser back returned to the faculty board.
- Research desktop width 855 CSS pixels had no page overflow. Wireframe desktop width 1265 had no overflow. At the 320-pixel viewport both pages had 305-pixel content width/scroll width: no page-level horizontal overflow. Three research tables scroll inside keyboard-focusable labelled regions.
- Keyboard Enter on the skip link moved to `#main` and focused the main landmark. Full screen-reader, device, printed-page and applicable-WCAG-AA validation remain unrun.
- Corrected a two-pixel mobile navigation overflow, duplicate source-label wording and E01/E06 closure copy. No React/domain behaviour changed; its existing EX-2.2 tests were not rerun for this documentation-only increment.

[Browser measurements](../research/evidence/u02-browser-review.json) · [Desktop research screenshot](../research/evidence/u02-research-desktop.jpg) · [320px research screenshot](../research/evidence/u02-research-320.jpg) · [Story screenshot](../research/evidence/u02-story-desktop.jpg) · [Wireframes desktop](../research/evidence/u02-wireframes-desktop.jpg) · [Wireframes 320px](../research/evidence/u02-wireframes-320.jpg).

## Revised completion gate — passed within agreed scope

**R2 verification:** 852/852 current integrity checks passed, including 317 local links/assets, unchanged source-register records and all 11 preserved source hashes. The current scope, tracker and rendered review are checked against the desk-only contract. Root prototype, design-system, scene, spatial and existing audit checks passed again. [Current integrity result](../research/evidence/u02-integrity.json).

The revised review rendered the complete status, fourteen sources, fifteen wireframes and desk-research methodology. All seven storyboard images loaded. Desktop width 1265 and narrow content width 305 (320-pixel viewport) matched page scroll width, with no page-level horizontal overflow. [R2 browser record](../research/evidence/u02-r2-browser-review.json) · [R2 desktop screenshot](../research/evidence/u02-r2-desktop.jpg) · [R2 narrow screenshot](../research/evidence/u02-r2-320.jpg). These are technical/document checks, not participant outcomes.

- [x] Source register has provenance, reading-depth labels and limitations.
- [x] Critical synthesis separates external findings from local assumptions.
- [x] Twelve assumptions and twenty requirements have traceable design rationale and coverage.
- [x] Fifteen wireframes, eight decisions and seven storyboard frames are reviewable.
- [x] Designer checks and technical/browser evidence are distinguished from participant research.
- [x] Methodology and report wording disclose the absence of primary research.
- [x] Interview/recruitment/participant-session gates are excluded rather than left overdue.

User Research is presented as secondary research with critical synthesis and transparent limitations. The assignment rubric is unchanged; no claim of participant validation or guaranteed excellent marks is made. The assumed room and operational policies remain concept boundaries; a real installation would require qualified review outside this U02 desk-research scope.

## Next implementation handoff

Carry D-U02-03 into remaining U05 experiences, D-U02-06 into U06 grounding/evaluation and D-U02-04/D-U02-08 into U07 ownership/policy. Add WF13–WF15 to the React coverage ledger rather than equating new wireframes with parity. U09 uses designer/technical checks; no participant collection is scheduled. The report should cite this revision as secondary research, distinguish authored scenarios from empirical findings and state the unmeasured local/user/site outcomes.

## Scope revision record

U02-R1 is preserved in [the pre-change archive](revisions/U02-R1-before-scope-change/planning/U02_DELIVERY_RECORD.md). R2 changes methodology/completion gates without turning excluded fieldwork into completed fieldwork. Existing source context/access labels and technical limitations are retained. Rebuilds use `research/build-u02.cjs`; the R1 updater is retired to prevent old gates reappearing.
