# PARALLAX · U07 operating reference

3 October 2026 · Local designer-reviewed demonstrator. Staff roles are previews; institutional policy/identity systems remain the authority for real operation. No participant or site-owner review is claimed. Use this reference with the same action rules and source labels as the interface.

## Owners and absence cover

### Open and close a booked investigation

Owner: Student / session supervisor. Backup: Faculty / lab lead.

Record: Confirmed applicable booking, station, kit, evidence and return record. Existing local route: /bookings.

### Publish methods and handle session changes

Owner: Faculty method owner. Backup: Lab lead.

Record: Method revision, effective scope and existing-session decision. Existing local route: /faculty.

### Attendance and evidence review

Owner: Faculty. Backup: Designated teaching lead.

Record: Append-only correction or frozen feedback revision. Existing local route: /faculty/attendance.

### Equipment condition, location and release

Owner: Technician. Backup: Lab lead; keep restriction if qualified owner is unavailable.

Record: Restriction, movement, repair and completed verification. Existing local route: /tech.

### Maintain guide sources and review AI flags

Owner: Guide owner + application maintainer. Backup: Faculty for content; use manual fallback for service outage.

Record: Published source revision and explicit local-review record. Existing local route: /assistant.

## A complete kit is already allocated

Symptom: A request overlaps a held resource or required space.

Preserve: Keep the request intention and existing allocation. Create no partial kit hold.

Owner: Scheduling owner / faculty

Diagnostics: Request ID, interval, manifest, method/resource revision and conflict code.

Recovery: Review a freshly checked alternative and create a new request for that different intention. A scheduling exception cannot release restricted equipment.

Verify: Exactly one valid allocation holds each overlapping resource; both lights and required space remain in the same allocation.

## The acknowledgement did not arrive

Symptom: An action may have committed, but its response is unknown.

Preserve: Keep the original request ID and exact content. Do not announce a confirmed result to the requester.

Owner: Requester, then application support / scheduling owner

Diagnostics: Request ID, operation category, result code and relevant record revision. Do not copy notebook text into diagnostics.

Recovery: Look up or retry the same identity. A changed intention gets a new request. Offline browser storage cannot prove a remote commit.

Verify: The same request resolves to the same receipt/booking ID, with no duplicate allocation or audit event.

## A booking draft reconnects

Symptom: The requested slot was available when drafted; another allocation may exist now.

Preserve: Retain the date, interval, experiment and draft. Mark it unconfirmed.

Owner: Requester and scheduling owner

Diagnostics: Draft intention plus current source/resource revisions; no invented server acknowledgement.

Recovery: Revalidate against the current allocation at commit time. Explain any conflict and show a current alternative.

Verify: A taken interval is not overwritten. Only a newly checked valid allocation can confirm.

## A method changes during work

Symptom: The current publication differs from the session's recorded method revision.

Preserve: Retain raw evidence, saved claims, original method revision and prior policy decisions.

Owner: Faculty method owner; lab lead if unavailable

Diagnostics: Recorded method revision, current policy version, effective scope and explicit existing-session rule.

Recovery: The responsible owner chooses an applicable transition. Pause for review or explicitly retain the recorded exercise method; record the reason. Equipment restrictions remain independent.

Verify: New bookings do not use a withdrawn method. Existing evidence is byte-for-byte unchanged; the student's next step and owner are visible.

## A browser write fails or another tab changes the record

Symptom: Save fails, or the raw saved version no longer matches the form's baseline.

Preserve: Keep the current in-memory draft and original stored text. Never overwrite a competing version silently.

Owner: Record author; application support for repeat failures

Diagnostics: Storage/error category and affected local key/revision, without personal notes.

Recovery: Export current and retained versions. Reconcile explicitly. Archive the prior raw record before replacement; failed archival blocks replacement.

Verify: The original remains readable or exportable. No 'saved' label appears after a failed write.

## A camera fault or interrupted verification

Symptom: Required equipment is restricted, missing, or verification has not completed.

Preserve: Keep fault/repair history and previously captured evidence.

Owner: Technician; lab lead if absent

Diagnostics: Affected component, restriction revision, repair/verification outcome and complete-kit consequences.

Recovery: Use the existing technician verification/release workflow. A repair note or withdrawn notice does not release a restriction. Preserve public privacy.

Verify: Capture-kit eligibility, bookings and permitted public consequence agree. Unrelated signal equipment remains separate.

## The local assistant or source is unavailable

Symptom: Ollama fails, the source changes, or an answer cannot be verified.

Preserve: Keep the question and readable source. Do not insert a generated claim into the notebook.

Owner: Application maintainer and guide owner

Diagnostics: Model/source revision, failure category and latency; explicit flags only, no covert conversational scoring.

Recovery: Read the labelled guide, cancel or retry explicitly, and review a revised source. Local flags are not a staff notification.

Verify: The source and task remain usable, and no unavailable/private record is invented.

## An observation is stale or the 3D model fails

Symptom: A reading is disconnected/out of order, or the optional model cannot load.

Preserve: Retain source/observation times, evidence context, task selection and reasoning draft.

Owner: Source maintainer / application support; faculty for task impact

Diagnostics: Source age/quality or model-load error; no assumption that normal-looking data prove safety.

Recovery: Use the current provenance label or task-equivalent plan/list/text. Keep simulation, illustration and measured evidence distinct.

Verify: Old data do not appear fresh. The accessible reference gives the same relevant task facts without requiring the model.

## Operating options

| Option | Benefit | Dependency / boundary |
|---|---|---|
| Manual reference + local prototype | Essential reference and domain rehearsal | Guide owner, local source and browser recovery; no authoritative shared records |
| Local guide Q&A | Cited public-guide passages | Ollama/model availability and source review; evidence remains browser-only |
| Shared operational records | Cross-user allocation, permissions and acknowledgements | Institutional identity, approved policy, durable transactions, backup and reconciliation; not delivered by the browser exercise |
| Registered device integration | Actual observations and controlled acquisition | Approved source registration, measured units/times, installation/calibration and maintenance; not delivered by simulated sensor views |

## Unpriced cost and operating-effort categories

- Sensors and meters: owner, effort, supplier/site evidence and price remain unconfirmed.
- Installation, electrical and network review: owner, effort, supplier/site evidence and price remain unconfirmed.
- Calibration and source validation: owner, effort, supplier/site evidence and price remain unconfirmed.
- Furniture, finishes and wayfinding maintenance: owner, effort, supplier/site evidence and price remain unconfirmed.
- Asset production and document updates: owner, effort, supplier/site evidence and price remain unconfirmed.
- Hosting, persistent storage, backup and monitoring: owner, effort, supplier/site evidence and price remain unconfirmed.
- AI runtime / local power / model and source maintenance: owner, effort, supplier/site evidence and price remain unconfirmed.
- Staff training, support, handover and absence cover: owner, effort, supplier/site evidence and price remain unconfirmed.
- Equipment replacement, accessibility review and recovery rehearsals: owner, effort, supplier/site evidence and price remain unconfirmed.

No procurement recommendation, price, metered saving or operational approval is implied. Before a pilot, assign the reconciliation owner and authoritative record, approve retention/access, test backup and transaction recovery, and confirm qualified staff coverage. Avoid double entry without a reconciliation plan.
