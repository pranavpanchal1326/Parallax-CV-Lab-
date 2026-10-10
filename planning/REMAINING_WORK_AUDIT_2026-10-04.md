# PARALLAX — deep remaining-work audit

Reviewed **4 October 2026**, Asia/Calcutta. User request: check deeply what remains without degrading existing work. Current authority: the U01–U10 upgrade tracker, current source/build, the assignment DOCX, U02–U08 delivery records and bounded fresh technical/browser checks. Original phases 01–10 are separate from upgrade phases U01–U10.

**U01–U08 are delivered within their documented local/desk/concept scopes. U09 and U10 remain unfinished.** The current application is healthy under the checks executed here. This is not final submission approval, production readiness, a formal accessibility certification or participant validation.

The earlier [remaining-work review](REMAINING_WORK_REVIEW.md) describes an older revision. Its participant-research tasks, dashboard gaps and wireframe gaps are superseded by the user's desk-only research decision and subsequent delivery records. Do not use it as today's backlog.

## What is delivered

| Upgrade | Current delivered scope | Boundary to preserve |
|---|---|---|
| U01 | Preserved originals, identities, geometry and rule/authority contracts | Operational services were not connected by preservation |
| U02 | Fourteen reviewed sources, synthesis, methodology, traceability, fifteen wireframes and storyboard | Secondary research; no participant studies or local user-outcome claims |
| U03 | React student/staff/mobile/public parity, recovery, persistent drafts and linked map | Local records and prepared roles; no institutional authentication or grade delivery |
| U04 | Smart dashboard, six source scenarios, retained provenance, W/kWh gap ledger, reviewed standby simulation and five sustainability proposals | No connected sensors, measured savings or physical/product certification |
| U05 | Retained condition replay, one-variable scientific rehearsals, fixed-geometry model and ten-stage fault story | Declared generated/illustrative models; no inferred physical accuracy or measured learning |
| U06 | Real local Ollama AI-L1 guide support with citations, lifecycle/refusal/cancel/manual paths and evaluated cases | Public project guides only; no browser/student context or operational tools |
| U07 | Independent complete-kit allocation/retry/offline/policy/handover/publication exercise, eight runbooks and ownership/effort options | Serialized local exercise; no shared authoritative database or actual staff approval |
| U08 | Nine authored compositions, ten art masters, six signs, five plan layers, studio controls and text packets | Conceptual geometry and physical proposals; optional AR/voice remain outside delivery |

Authoritative status: [phase tracker](EXCELLENCE_EXECUTION_PHASES.md). Each row's detailed evidence and limitations remain in its delivery record. Existing entrypoints and models were preserved.

## Fresh checking performed

| Check | Actual result | Limit |
|---|---|---|
| `npm run check` | Pass: prototype 65/65, scene 25/25, spatial 16/16; forty component IDs, fourteen token contrast pairs and earlier audit checks | Geometric/token/rule checks do not certify real installations or rendered accessibility |
| `npm run lab:test` | **138/138**, nine test files | Unit/domain/static-render checks; not a complete end-to-end browser suite |
| `npm run assistant:test` | **16/16** | Controlled service/adaptor tests; not sixteen new live inference calls |
| TypeScript `tsc --noEmit` | Pass | Type correctness only |
| Production Vite build in a separate dated audit directory | Pass; **43/43 output files byte-identical to active `dist`** | Existing generated public assets were used; active preview/build was not replaced |
| U02–U08 validators | All pass; U02 852/852, eleven protected original hashes; U08 57 unchanged tracked files/four previously allowed U08 changes | Prior rendered/evaluation records are integrity-checked; they were not all newly rerun |
| Current rendered routes | Dashboard plus 25 additional route visits, including student, staff, mobile, public, rehearsal, assistant, operations and studio | Default/restored states; lazy views were checked after their headings appeared |
| Reflow | Seven key views at actual 320-pixel viewport; document width 305 pixels, no page overflow | One desktop browser viewport; not a physical phone or actual zoom test |
| Fresh axe checks | Eight scans; **zero confirmed violations** | Contrast remains incomplete, principally because of textured backgrounds; manual access checks remain open |
| Fault/recovery walkthrough | All ten sandbox stages replayed; restriction/verification/release text retained; primary `Activity · 0` throughout | Independent authored sandbox, not a real incident |
| Geometry unavailable path | Explicit plan-only mode retained top-view, object interpretation and approximation labels | No GPU/device performance or repeated-mount resource measurement |
| Local AI | Provider ready with `llama3.2:3b`; one fresh 3 Hz alias question returned E01 revision 01 / `E01-alias` | Existing 39/39 evaluation with 27 live calls remains historical evidence; full evaluation was not rerun |
| Console | No captured normal-app warnings/errors in this audit tab | Prior standalone SVG viewer issue remains documented separately |
| Production dependency advisory check | `npm audit --omit=dev --json`: zero known vulnerabilities | Registry advisory result for production dependencies only; not application security certification |
| Current Markdown/build HTML links | 284 local Markdown references, including the new audit reports, and 70 built HTML `src`/`href` targets resolve in applicable source/build context | Nine generated-public Markdown links resolve in copied `dist`, rather than the source template directory; external URLs/fragments and live Figma were not reverified |

[Technical inspection and source hashes](../apps/lab-web/evidence/u09-audit/technical-inspection.json) · [browser summary](../apps/lab-web/evidence/u09-audit/browser-summary.json) · [route receipts](../apps/lab-web/evidence/u09-audit/routes.json) · [fresh axe summary](../apps/lab-web/evidence/u09-audit/axe-summary.json) · [assignment text extraction](../apps/lab-web/evidence/u09-audit/assignment-text.txt).

The audit wrote reports/evidence and a separate build copy. It did not edit product source, active `dist`, original geometry, scientific models, guides or domain rules. No primary save/reset/restore or staff command was executed. The browser viewport was reset and temporary audit tabs closed.

## Confirmed findings to address

| ID | Priority | Evidence/current behavior | Correction and acceptance |
|---|---|---|---|
| REM-01 | U09 · medium | Mobile typed-ID fallback field is **13.3333 px text and 21.2 px tall at 320 px**. `Mobile.tsx` omits the `type` attribute; inherited CSS styles explicit `input[type=text]`, so this field misses the intended 16 px/44 px control styling. [Capture](../apps/lab-web/evidence/u09-audit/mobile-field.png), [measurements](../apps/lab-web/evidence/u09-audit/mobile-field.json). | Add explicit text type or narrowly include default text inputs in the existing field rule. Recheck computed size, keyboard focus, lookup behavior and narrow layout. No Safari auto-zoom failure or WCAG failure is claimed from this desktop measurement. |
| REM-02 | U09/U10 · medium | Current UI still says `PARALLAX · U07`; geometry rehearsal still says `AI follows in U06`. README's opening/status paragraphs and historical tracker prose lag later delivery notes. The old remaining-work review still lists now-excluded participant work as essential. | Give current status one unambiguous authority, label historical prose locally, and update obsolete product copy. Preserve dated evidence and local/integration limits. |
| REM-03 | U09 · low, QA only | `AccessReview` retains the previous scan after hash navigation. The assistant route receipt displayed a dashboard scan until an explicit rescan. The hash is also read after the asynchronous scan. | Clear or visibly mark reports stale on route changes; capture the scan's starting route and reject/label results if navigation intervenes. Reproduce with dashboard scan → another route. No normal-product result is affected. |
| REM-04 | U10 · essential handoff | Root `npm start` opens the original edition. Its index points to the preserved legacy prototype and historical participant plan; it does not expose the latest React U01–U08 work as a clear current assessor entry. Figma build README still names P6-A as current; original Phase 9 record says the Figma index was not updated. | Add a current submission launcher/index with direct links to React, original baseline, source/design evidence, report/deck and fallback. Reconcile the actual Figma index after inspecting it. Keep original entrypoints available; no silent cutover. |

No confirmed task-blocking regression or primary-state loss was found in the inspected states. This does not close checks that were not run. See the [structured design review](../.design/review-report.md) for source locations and the scoped verdict.

## Fourteen system scenarios reconciled

**Ten have current passing local technical support, three need a bounded additional check/reconciliation, and one remains open.** “Covered locally” means the relevant current tests passed and identified implementation/evidence exists; it is not fourteen freshly rerun end-to-end scenarios, shared-service validation or user comprehension proof.

| ID | Scenario | Existing implementation/evidence | Audit status and precise remaining work |
|---|---|---|---|
| SYS-01 | Competing complete-kit requests | U07 `MemoryDeskRepository`; concurrent/interval/whole-manifest tests, including both lights | Covered locally. Document the serialized local boundary; database competition is conditional integration work |
| SYS-02 | Submission committed, acknowledgement lost | Migration `dropAck` test retains pending state, then one stable receipt and no duplicate log | Covered locally. Include both E01/E06 browser recovery in final consolidated walkthrough; actual grade/server delivery remains unconnected |
| SYS-03 | Retained A versus changed context/method | Snapshot includes method/fixture/geometry/reference/settings/observation times; U04/U05 replay tests; U07 preserves existing evidence on policy withdrawal | Covered locally. Connect the evidence references explicitly; U07's independent method-policy exercise must not be presented as changing the primary student's method source |
| SYS-04 | Assistant gets unsupported browser evidence | Server rejects arbitrary/private/live-context fields and questions; no record tool exists | Covered locally. AI-L2 remains outside current scope |
| SYS-05 | Late/out-of-order observations | Source-age freshness and impossible-timestamp tests; frozen delayed/offline scenarios | **Partial.** Test a deterministic older-after-newer sequence or explicitly mark stream-ingestion ordering unimplemented. Timestamp validation within a record does not prove multi-message ordering |
| SYS-06 | Method withdrawn during existing session | U07 versioned pause/retained-method policy, named faculty owner, exact evidence retention and restriction precedence | Covered locally. Institution-owned approval and actual shared method publication remain conditional |
| SYS-07 | Practice fault while primary session exists | U05 independent snapshots; isolation test; fresh ten-stage walkthrough with primary activity unchanged | Covered locally. Retain explicit sandbox labels |
| SYS-08 | Technician verification interrupted | Original rules/migration/U05 tests preserve restriction through repair/interruption/refused early release; fresh stage 7/8 review | Covered locally. Add this to the final cross-view scenario receipt |
| SYS-09 | Offline booking meets now-taken slot | U07 drafts revalidate against current allocation; conflict rather than overwrite; request/actor identity retained | Covered locally. No actual network synchronization is claimed |
| SYS-10 | Assistant/model/3D unavailable | Provider failure tests, bundled publication-unchecked guide, list/plan alternatives; fresh explicit geometry plan fallback | **Partial.** Complete manual keyboard/screen-reader and cross-browser/device fallback walkthrough; record supported equivalence and approximation limits |
| SYS-11 | Standby affects active dependency | U04/smart-lab tests protect bookings, started sessions, essential services, unknown loads and restricted equipment | Covered locally. Actual circuit/device switching and measured savings remain outside delivery |
| SYS-12 | Public projection after private event | Public allowlists and field-exclusion tests; U05/U07 public projections; fresh public default view | Covered locally. Include final private-event→public receipt and link it to privacy assertions |
| SYS-13 | Compare two conditions, identify difference/uncertainty/next action | Retained comparison fields, source/missing-context labels, student-authored reasoning and signature scenes | **Partial under desk-only scope.** Complete a scripted designer walkthrough that checks visibility of these three elements. Student comprehension/learning is unmeasured and must remain a limitation, not a participant task |
| SYS-14 | Repeated React scene mount/unmount | Map parent removes its message listener; iframe scenes isolate ownership; original 3D module exposes detach/dispose | **Open.** Record repeated mount/unmount/hide/show behavior and resource/state trends. Scene Studio has a continuous `requestAnimationFrame` loop with no explicit visibility pause; map disposal does not itself establish cleanup of all loaded geometries/materials. Source risk is not a measured leak |

Sources: [migration tests](../apps/lab-web/tests/migration.test.ts), [smart-lab tests](../apps/lab-web/tests/smart-lab.test.ts), [U04 tests](../apps/lab-web/tests/u04.test.tsx), [U05 tests](../apps/lab-web/tests/u05.test.tsx), [U07 tests](../apps/lab-web/tests/u07.test.tsx), [assistant tests](../apps/lab-server/tests/assistant.test.mjs), [fresh fault frames](../apps/lab-web/evidence/u09-audit/fault-frames.json). Scenario definitions remain in blueprint section 32.

## U09 work still required

1. Fix REM-01/02/03 with preserved before/after evidence and focused retests. This audit itself is report-only.
2. Finish the consolidated fourteen-scenario record: initial state, source revision, actions, expected/actual outcomes, evidence and local/conditional boundaries. Close SYS-05/10/13/14 appropriately rather than claiming every integration exists.
3. Run manual keyboard traversal, visible-focus checks, status/error announcements, actual browser zoom, screen-reader review and a second relevant browser/device. Complete manual contrast over textured surfaces and iframe controls. No participant recruitment is needed for technical checks.
4. Measure cold usable load, already-loaded route transitions, at least thirty representative local interactions and optional 3D frame/resource behavior under stated device/network conditions. File estimates are not these measurements. Current initial JS is 143,461 bytes when gzip-estimated, including preloaded runtime chunks; the review server does not actually send gzip encoding. The large axe chunk is QA-only and loaded explicitly.
5. Verify print pagination and completed disk downloads where exports are part of the demonstration. Previous U05/U07 download completion was not confirmed even though serialization/visible JSON/recovery paths worked.
6. Recheck the standalone SVG viewer limitation in the intended assessment browser, or document the reviewed embedded-image/HTML packet path as the supported presentation. Prior minimal SVG control supports a browser-integration explanation, not a proven exact cause.
7. Resolve confirmed consequential findings, retain the findings/retest log and write the final U09 verdict. The checks above remain open; do not mark U09 complete based on unit tests alone.

## U10 submission work still required

The assignment explicitly requires a ten-section report and fifteen-minute presentation. Current blueprint/report plans and phase delivery records are supporting material, not the final submission. The local inventory found no submission directory, finished report, PDF or slide deck. The only non-history DOCX is the assignment. The existing MP4 is the room orbit, not an E01/E06/AI/fault demonstration backup. Editable Blender source exists.

| Required item | Existing material to reuse | What remains |
|---|---|---|
| Introduction | Execution brief and product premise | Write the final lab/user/scope introduction |
| Problem Analysis | U02 synthesis, hypotheses, decisions and traceability | Assemble evidence/assumption→requirement→solution→validation argument |
| User Research | Reviewed register, method, roles/empathy/journeys | Present secondary-only research and its limits; no invented participants |
| UI/UX Methodology | Alternatives, annotated wireframes, technical/design reviews | Explain actual chronology, review method and revisions |
| Design Process | Tokens, Figma records, service map, art and trade-offs | Select and narrate decisions using actual evidence |
| Wireframes | Fifteen boards and annotated source record | Include selected readable flows/exceptions with truthful origin labels |
| Final Prototype | React U03–U08 plus preserved originals | Include current routes, normal/recovery story, AI and integration boundaries |
| Floor Plan | P4-D dimensioned geometry, exports, signs/safety/sustainability | Assemble the scaled 70 m² concept and disclose survey/capacity/services limits |
| Technology Stack | React/TypeScript/Vite/domain/storage/Three.js/Ollama sources | Show actual architecture and launch requirements separately from proposals |
| Conclusion | Final U09 findings and declared limitations | State only supported outcomes and next development |
| References/evidence appendix | Sources, hashes, receipts and phase records | One current requirement/rubric index with working links and revisions |
| Fifteen-minute presentation | Blueprint's 15-minute segment plan and existing visual assets | Produce an editable deck, speaker notes and actual timed rehearsal |
| Backup demonstration | Room film, screenshots, static packets, offline guides | Record the complete selected route/failure sequence and provide matching static fallback |
| Assessor/source handoff | Pinned dependency lockfile, Blender source, Figma records, README commands | Create clean launch/index/package; test from a clean assessor start; update actual Figma index; record real contributions |

Actual deadline year and team membership remain unconfirmed. The assignment says 5 August and three students. Do not invent dates, names or contribution claims while drafting.

## Rubric readiness

| Criterion | Weight | Current evidence and remaining gate |
|---|---:|---|
| User Research | 10 | Strong desk-research package; final report integration and honest limitation disclosure required |
| Problem Analysis | 10 | Traceability/decisions exist; consolidate the final argument and validation links |
| Space Planning | 15 | Dimensioned concept/geometry/renders/proposals exist; final floor-plan narrative, whole-class/rotation assumptions and qualified-review boundaries must be explicit |
| UI Design | 15 | Wireframes/high-fidelity/React views exist; close the confirmed control/status issues and index required family coverage |
| UX Design | 15 | Rule tests and designer review exist; consolidated U09 task/recovery walkthrough and revision evidence remain; no measured user outcomes |
| Innovation & Smart Features | 10 | Local smart simulations and real AI-L1 exist; final demo/evaluation evidence and scope labels required |
| Accessibility & Safety | 10 | Technical scans, fallbacks and conceptual safety sheets exist; manual contrast/access/browser/device checks remain |
| Prototype & Demonstration | 10 | Working local prototype and passing regressions; clean launch, complete scenario receipts and backup rehearsal remain |
| Presentation & Documentation | 5 | Final report, deck, evidence index and timed rehearsal **not delivered** |

These are evidence assessments, not predicted marks. The rubric is unchanged by the research-scope decision.

## Conditional work, not mandatory new prototype scope

Shared authenticated bookings, institutional authorization/grades/policies, actual sensor/meter acquisition, equipment/circuit control, site survey/safety/material approvals, AI-L2–L4, live QR recognition, AR/VR and voice remain separate integrations. Local diagrams and prepared actors must not be described as those services. Real installation needs applicable institutional/qualified owner review, but none is fabricated or added as a new participant-study obligation.

The brief introduces smart technologies as examples (“such as”); it does not explicitly demand eight separately implemented technologies. Optional feature expansion should not displace unfinished U09/U10 essentials. Primary participant research is excluded by the agreed scope.

**Recommended order:** complete U09's focused fixes and technical evidence, then assemble/rehearse U10 from the existing work. Preserve the dashboard, sustainability, scientific models, local Ollama behavior, operations exercise, art and original baseline throughout.
