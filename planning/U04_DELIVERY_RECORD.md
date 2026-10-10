# U04 · Smart dashboard and sustainability

3 October 2026 · complete for the local demonstrator and designer-reviewed physical proposal. AI remains U06. This record supersedes older statements that leave these local U04 deliverables partial; actual sensors, circuits, site approval and supplier verification are conditional deployment work.

The task is to understand work in progress, identify unreliable context, inspect energy consequences and review the five assignment sustainability requirements. The existing Atlas+ paper/ink design, resource identities, evidence rules and P4-D geometry are retained.

## Delivered and reviewed

| Requirement | Working evidence | Boundary |
|---|---|---|
| Task-focused dashboard | `#/dashboard`: equipment exceptions, active sessions, pending acknowledgements, today's upcoming reservations, canonical plan, source context and gapped lighting-energy summary | Occupancy is record-derived; zero actual sensor connections |
| Source provenance and freshness | `#/environment`: six selectable scenarios, source IDs, C1 position, units, quality, observation/receipt times, age and recovery | Connected-in-example, disconnected and reading-missing are distinct; five-minute policy is illustrative |
| Frozen observations | Environment selection creates records once; dashboard and new captures use those same records; advancing lab actions can age them | Reload resets source selection; saved captures retain original records; recovery does not rewrite evidence |
| Energy periods and gaps | Two period choices, complete/gapped interval sets, latest average W, known-interval kWh and covered minutes; inspectable SIM-POWER-v1 interval ledger | Authored average loads, not instantaneous meter readings; partial-period total stays unknown; no interpolation or measured savings |
| Standby consequences | Restricted, unlocated, active, reserved, unmapped and essential groups excluded; eligible group has three manual checks and explicit simulation confirmation | No hardware command, authorization or saved approval; changed records/interval/group invalidate review |
| Five physical sustainability requirements | [Specification](U04_SUSTAINABILITY_SPECIFICATION.md), [printable sheet](../design/U04_SUSTAINABILITY_SHEET.html), in-app sheet and packaged standalone HTML | Designer-reviewed proposal, not surveyed/installed/procured/certified provision |
| Manual safety and sustainability | Independent safety route, posted-procedure fallback, source/ventilation escalation and equipment recovery links | Sensor examples do not certify safe air or clear restrictions; detailed new CCTV/hazard/signage art remains U08 |

SUS-01–05 cover efficient lighting, natural ventilation, smart power, recyclable furniture and green materials. Each specifies physical anchors, owner, trade-off, required evidence and acceptance. W1/COL daylight and C1 repeatability are resolved as separate proposed lighting decisions; D1/D2 are exits, not assumed cross-ventilation. Repair/disassembly and product-specific claims remain evidence requirements. No numerical environmental threshold or certification has been invented.

One source, `apps/lab-web/src/data/sustainability.ts`, produces both UI and printable/specification artifacts through `node apps/lab-web/scripts/build-u04-sheet.cjs`; build packages `sustainability-sheet.html`. The sheet is usable without the edition server, React, AI, 3D or hardware. S09 HSE CO₂ guidance and S10 UCL LEAF were rechecked on 3 October 2026; they inform context, not local compliance or product approval.

## Verification

- 68 React tests pass, including nine U04 cases for disconnected/missing context, retained observation age/recovery, gapped period integration, zero/invalid power, interval integrity, proportional durations, protected/unmapped standby and today's dashboard reservation. Existing immutable-capture, active-session, booking-overlap and public-privacy checks continue to pass.
- TypeScript and production build pass. The existing large, on-demand axe diagnostic chunk warning remains; normal views do not load that QA chunk.
- Original root checks pass: prototype 65/65, scene 25/25, spatial 16/16, component/system and early-phase checks. U02 integrity 852/852; U03 preservation verifies all 11 original protected source hashes.
- [Browser evidence](../apps/lab-web/evidence/u04-browser-review.json) records six source scenarios, recovery, confirmation gating, interval protection/invalidation, complete/gapped energy and keyboard section focus. Environment and dashboard light/night scans have no confirmed axe violations; color-contrast remains incomplete because of the retained grain/background.
- Designer review covered 320, 768 and 1366 CSS px layouts. The document stays within its viewport; the narrow energy table uses a labelled keyboard-focusable local scroll region. Section jumps focus their target below sticky navigation. Native selectors, checkboxes and details retain keyboard controls.
- Full screen-reader, actual browser zoom, cross-browser, performance and deployed physical review are not claimed; broader technical/access verification remains U09.

## Preservation and next work

Pre-edit source/tests and authority records are retained in `revisions/U04-before-implementation/`. Original prototype, geometry, scene assets and research sources are unchanged. New physical artifacts are additive; the original project landing page is retained. No external services, provider keys, messages or device commands were introduced.

U05 owns the remaining scientific rehearsal/consequence experiences. U06 owns grounded AI and its evaluation. U07–U10 remain governed by the phase tracker. No participant studies are planned under U02-R2; local user/site outcomes remain unmeasured.
