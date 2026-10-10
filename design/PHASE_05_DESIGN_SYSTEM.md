# Phase 5 — PARALLAX design system / P5-A library + P5-B compositions

Date: 2 October 2026. Direction: **Atlas+ development baseline**. Local component laboratory and native Figma representative library built and reviewed.

Current review: [P5-B editorial showcase](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2072-1569). Following comparison with the earlier research and creative-direction boards, 11 native task-specific views and four navigation variants were added on page `2045:22`. Existing 40 family owners and 87 variant IDs are preserved. Composed views include room-led orientation, compatible/conflicting reservations, vision and signal instruments, evidence reasoning, device/save recovery, 2D asset lookup and mobile asset identity. Representative click paths are linked; complete institutional journeys remain open. See `figma-build/revision-p5-b/REVIEW.md` and `revision-state.json` for current scope and evidence. The library specification below describes the retained P5-A foundation.


Subsequent delivery: P6-A now connects the core student journeys on a separate Figma page while retaining this library and the P5-B source compositions. See [Phase 6](PHASE_06_CORE_STUDENT_EXPERIENCE.md). The Phase 5 build and validation records below remain the foundation handoff.

## Scope and authority

The next agreed phase is tokens, components, controls, motion and scientific-viewer patterns. This edition carries forward the documented Atlas+ identity and all 40 blueprint component contracts. It builds local representative specimens, not the entire institutional application or every target variant.

The reconnected Figma connector successfully read and wrote the canonical student-account file. The separate page **Phase 5 · Design System — P5-A** contains 40 editable component families, 87 native variants, 151 review instances and seven review boards. The five earlier pages were preserved. Local P4-D geometry is unchanged, and its current studio render is included in the new 3D frame component.

[Open the native Figma review](https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF?node-id=2047-1355). Page ID: `2045:22`. This delivers representative component coverage, rather than every target variant or a complete journey prototype.

## Current artifacts

| Artifact | Purpose |
|---|---|
| `system/index.html` | Browser component laboratory |
| `system/token-source.json` | Authoritative token values and role definitions |
| `system/tokens.json`, `tokens.css` | Generated interchange and CSS aliases |
| `system/components.json` | All 40 contracts extracted from the master blueprint |
| `system/system.css` | Layout, composition, controls and responsive behaviour |
| `system/system.js` | Representative specimens and local interactions |
| `system/validation.json` | Source-coverage and token-contrast results |
| `figma-build/p5-native-state.json` | Executed native build ledger, actual IDs and review links |
| `figma-build/p5-final-audit.json` | Native inventory and post-render audit |
| `figma-build/p5-*.body.js`, `p5-native.helpers.js` | Executed builder sections and refinement source |
| `figma-build/screenshots/` | Rendered native boards and targeted final checks |
| `figma-build/phase-05-foundations.js`, `system/figma-body.js.txt` | Earlier five-family preparation, superseded by the full native build |
| `system/build.cjs`, `prepare-figma.cjs`, `validate.cjs` | Reproduction and validation |

Current preview: http://127.0.0.1:4174/design/system/index.html.

## Visual direction

- Warm paper supports preparation, catalogue and reading.
- Dark graphite supports signal and image viewers, with separate high-contrast trace and warning tokens.
- Ultramarine identifies actions and active navigation. Red belongs to restrictions and errors.
- Familjen Grotesk supplies display hierarchy; DM Sans supplies controls and body; JetBrains Mono supplies identifiers; Newsreader italic is reserved for editorial moments.
- The opening waveform is mathematically generated evidence illustration. The component area is a working index and specimen bench. The composition section explains distinct time, measurement and manuscript structures.
- No global dark-theme switch is introduced. Instrument styling is scoped to instruments.

Fonts load through Google Fonts with local fallback families. The page does not need a JavaScript framework or a build dependency. A disconnected environment uses fallback fonts and local component content.

## Token architecture

Primitive values feed semantic aliases. CSS includes primitive definitions plus semantic references, so a controlled source change updates dependent roles. The Figma build uses separate PH5 collections rather than altering experimental PH3 study modes.

| Role | Value | Purpose |
|---|---|---|
| canvas | #F4F1E9 | Reading/preparation canvas |
| text | #20232B | Primary text |
| action | #3346D3 | Main actions |
| success | #1C7148 | Positive state with a written label |
| danger | #B42318 | Restriction and error |
| instrument | #151922 | Scientific viewer background |
| trace | #6EE7C5 | Reference trace |
| instrument warning | #F2C14E | Sample points / labelled caution |

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 px. Control radius: 4 px. Dialog radius: 8 px. Feedback: 120 ms; state change: 180 ms; dialog: 220 ms; future camera continuity: 400 ms. Longer motion values are specifications for subsequent journeys, not a claim that every animation is built.

Reduced-motion CSS covers pseudo-elements as well as elements. The local preference removes the animated loading marker. There is no autoplay audio or automatic room orbit.

## Component coverage

| IDs | Family | Local specimen coverage |
|---|---|---|
| C01–C06 | Shared shell, heading, action, search, filters, status | Navigation, save-feedback states, inventory search/filter, named states |
| C07–C11 | Experiments, equipment, booking, summary, manifest | Domain content, compatibility conflict, complete setup selection, kit checklist |
| C12–C16 | Map, 3D frame, hotspot, setup diagram, stage navigation | Static room alternative, optional room-study link, disclosure, camera diagram, protocol stages |
| C17–C20 | Parameters, input, recording, history | Generated sample-rate control, source labels, recording-state demonstration, fixture ledger |
| C21–C26 | Scientific viewers and metrics | Waveform/table, analytic spectrum illustration, synthetic image/overlay, matched comparisons, honest depth-data empty state |
| C27–C29 | Annotation, evidence, save | Local annotation, manuscript evidence and nonpersistent save feedback |
| C30–C35 | Fault, maintenance, rubric, notice, safety, table | Local fault specimen, repair checklist, example rubric selection, fault impact, conceptual safety boundaries, sorting |
| C36–C40 | Confirmation, empty, loading/error, provenance, media | Native modal, recovery states, source metadata, local reduced-motion preference |

All 40 contracts retain their target anatomy, variants, behaviour, constraints and acceptance criteria. Those lists describe the destination, not blanket implementation completion. Multiple-channel signal analysis, FFT/spectrogram computation, real depth capture, file parsing, authenticated roles and persistent evidence belong to subsequent implementation/integration work.

## Scientific integrity

The reference is a known 2 Hz sine with ±1 V amplitude over 0–1 s. The sample-rate control chooses uniform generated samples from 3–40 Hz. Exactly 4 Hz can land on zero crossings in this example; being exactly twice the reference frequency is not represented as a reliable reconstruction.

The spectrum specimen is an analytic line illustration, not an FFT. Vision specimens use drawn geometric objects, with clearly labelled illustrative overlays. Example recording and save states do not capture or persist data. No biometric or automatic attendance mechanism is introduced.

## Representative interaction states

The review selector exposes ready, loading, empty, recoverable-error and permission-limited specimens. Each state retains the selected component. Generated sample-rate settings survive error recovery in the same page session.

Booking is fixture-based but compatibility-aware: the 10:00 camera-kit restriction prevents confirmation even if another row is available. Selecting 11:00 updates the resource set. A dialog repeats the complete selected manifest before a local demonstration confirmation.

The modal starts with the safe review action, cycles keyboard focus within its controls, closes with Escape and returns focus to its trigger. Restricted and disabled controls have visible explanations.

Specimen notes and faults are volatile local demonstrations. Switching specimens or reloading can discard them. Persistent draft preservation is a Phase 6 journey requirement, not supplied by this development catalogue.

## Responsive rules

- Wide: editorial opening and scientific stage side by side; component index alongside specimen.
- Medium: reduced margins and index width; content wraps without whole-page horizontal scrolling.
- Compact: opening and stage stack; component index becomes a bounded scroll area; controls and contracts stack.
- Timelines and wide data tables keep local horizontal scrolling because they are two-dimensional artifacts. The surrounding page reflows.
- Forms retain 16 px text at compact widths. Keyboard focus and native semantic controls are part of the common control contract.

## Validation evidence

`node design/system/validate.cjs` verifies 40 unique IDs, complete contract sections and a specimen case for each. All **14 token contrast pairs pass their assigned thresholds**. This is a token calculation, not a full accessibility certificate.

Browser checks are recorded separately in `.design/phase-05-review.md`. They include all 40 specimen loads, representative interactions, recovery, keyboard modal behaviour, reduced motion and width checks. Screen-reader and cross-browser coverage remain open.

## Executed native Figma build

Discovery inspected existing research components, experimental PH3 study collections, pages and available libraries. No shared library was added to this file. Existing PH2 spacing primitives were reused through aliases; PH3 comparison modes were preserved. Four isolated PH5 collections contain 64 variables, including 33 aliases, with explicit scopes and web code syntax. Nine PH5 text styles use verified fonts.

| Board | Native node ID | Content |
|---|---|---|
| 5A Identity & foundations | `2047:1355` | Atlas+ identity, artwork, delivery map |
| 5A.2 Token & type specimens | `2047:1416` | Palette, semantic roles, type and spacing |
| 5B Core controls | `2045:284` | C01–C06 |
| 5C Preparation & space | `2048:555` | C07–C16, current P4-D render and vector plan |
| 5D Scientific measurement | `2049:1014` | C17–C24, editable vector evidence illustrations |
| 5E Evidence & reasoning | `2049:1455` | C25–C29, notebook and save/recovery patterns |
| 5F Operations & recovery | `2050:1282` | C30–C40, technician and recovery patterns |

Review boards use instances of native main components. All 87 built variants appear in the boards; component owners are arranged separately on the same page. Labels, tables, traces, controls and floor-plan geometry remain editable. The current room render is a raster image inside an editable native frame; it is not an interactive 3D scene in Figma.

Post-render repairs corrected horizontal auto-layout sizing, per-variant title defaults, separate busy-action labels, slider anatomy, map zone keys and plot-edge labels. The final audit reports zero unbound solid paints, unstyled native text, content overflow, top-level overlap, missing component spacing bindings or missing component radius bindings. Radius bindings are checked on all four corner fields, which is how Figma represents the shared corner-radius assignment.

All seven boards were visually inspected; affected examples were checked again after repairs. Native fixtures are static design states without wired journey interactions. Keyboard and reduced-motion behaviour described above were tested in the local HTML catalogue, not through a Figma prototype. No published shared library or Code Connect mapping is claimed; the source catalogue is static HTML without eligible framework component exports.

Use `p5-native-state.json` and inspect the live canvas before continuing. Builder sections are execution records, not an idempotent sync command. Do not rerun them over the populated destination.

## Reproduce

```powershell
node design/system/build.cjs
node design/system/prepare-figma.cjs
node design/system/validate.cjs
$env:PARALLAX_REVIEW_PORT='4174'
node design/serve-review.cjs
```

If the preview port is already serving this project, reuse it. The server binds to localhost. Edit `token-source.json`, then regenerate; generated outputs should not become a competing source.

## Gate and next phase

Local P5-A representative controls and the native Figma library are ready for Phase 6 exploratory production. Final creative freeze remains dependent on critique/task testing. Broader target variants, shared-library publishing, complete page compositions and wired prototype journeys remain separate work.

Phase 6 should connect experiment preparation, complete-kit booking, readiness, generated signal/vision demonstrations, comparison, notebook and submission review. That work must include persistent drafts, meaningful recovery and stable evidence revisions; it should use these components while preserving the different page compositions.
