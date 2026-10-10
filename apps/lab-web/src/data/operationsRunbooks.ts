export const deskRunbooks = [
  {
    id: "booking-conflict",
    title: "A complete kit is already allocated",
    symptom: "A request overlaps a held resource or required space.",
    preserve:
      "Keep the request intention and existing allocation. Create no partial kit hold.",
    owner: "Scheduling owner / faculty",
    diagnostic:
      "Request ID, interval, manifest, method/resource revision and conflict code.",
    recovery:
      "Review a freshly checked alternative and create a new request for that different intention. A scheduling exception cannot release restricted equipment.",
    verify:
      "Exactly one valid allocation holds each overlapping resource; both lights and required space remain in the same allocation.",
  },
  {
    id: "missing-ack",
    title: "The acknowledgement did not arrive",
    symptom: "An action may have committed, but its response is unknown.",
    preserve:
      "Keep the original request ID and exact content. Do not announce a confirmed result to the requester.",
    owner: "Requester, then application support / scheduling owner",
    diagnostic:
      "Request ID, operation category, result code and relevant record revision. Do not copy notebook text into diagnostics.",
    recovery:
      "Look up or retry the same identity. A changed intention gets a new request. Offline browser storage cannot prove a remote commit.",
    verify:
      "The same request resolves to the same receipt/booking ID, with no duplicate allocation or audit event.",
  },
  {
    id: "offline-booking",
    title: "A booking draft reconnects",
    symptom:
      "The requested slot was available when drafted; another allocation may exist now.",
    preserve:
      "Retain the date, interval, experiment and draft. Mark it unconfirmed.",
    owner: "Requester and scheduling owner",
    diagnostic:
      "Draft intention plus current source/resource revisions; no invented server acknowledgement.",
    recovery:
      "Revalidate against the current allocation at commit time. Explain any conflict and show a current alternative.",
    verify:
      "A taken interval is not overwritten. Only a newly checked valid allocation can confirm.",
  },
  {
    id: "withdrawn-method",
    title: "A method changes during work",
    symptom:
      "The current publication differs from the session's recorded method revision.",
    preserve:
      "Retain raw evidence, saved claims, original method revision and prior policy decisions.",
    owner: "Faculty method owner; lab lead if unavailable",
    diagnostic:
      "Recorded method revision, current policy version, effective scope and explicit existing-session rule.",
    recovery:
      "The responsible owner chooses an applicable transition. Pause for review or explicitly retain the recorded exercise method; record the reason. Equipment restrictions remain independent.",
    verify:
      "New bookings do not use a withdrawn method. Existing evidence is byte-for-byte unchanged; the student's next step and owner are visible.",
  },
  {
    id: "storage",
    title: "A browser write fails or another tab changes the record",
    symptom:
      "Save fails, or the raw saved version no longer matches the form's baseline.",
    preserve:
      "Keep the current in-memory draft and original stored text. Never overwrite a competing version silently.",
    owner: "Record author; application support for repeat failures",
    diagnostic:
      "Storage/error category and affected local key/revision, without personal notes.",
    recovery:
      "Export current and retained versions. Reconcile explicitly. Archive the prior raw record before replacement; failed archival blocks replacement.",
    verify:
      "The original remains readable or exportable. No 'saved' label appears after a failed write.",
  },
  {
    id: "equipment",
    title: "A camera fault or interrupted verification",
    symptom:
      "Required equipment is restricted, missing, or verification has not completed.",
    preserve: "Keep fault/repair history and previously captured evidence.",
    owner: "Technician; lab lead if absent",
    diagnostic:
      "Affected component, restriction revision, repair/verification outcome and complete-kit consequences.",
    recovery:
      "Use the existing technician verification/release workflow. A repair note or withdrawn notice does not release a restriction. Preserve public privacy.",
    verify:
      "Capture-kit eligibility, bookings and permitted public consequence agree. Unrelated signal equipment remains separate.",
  },
  {
    id: "assistant",
    title: "The local assistant or source is unavailable",
    symptom:
      "Ollama fails, the source changes, or an answer cannot be verified.",
    preserve:
      "Keep the question and readable source. Do not insert a generated claim into the notebook.",
    owner: "Application maintainer and guide owner",
    diagnostic:
      "Model/source revision, failure category and latency; explicit flags only, no covert conversational scoring.",
    recovery:
      "Read the labelled guide, cancel or retry explicitly, and review a revised source. Local flags are not a staff notification.",
    verify:
      "The source and task remain usable, and no unavailable/private record is invented.",
  },
  {
    id: "observation-model",
    title: "An observation is stale or the 3D model fails",
    symptom:
      "A reading is disconnected/out of order, or the optional model cannot load.",
    preserve:
      "Retain source/observation times, evidence context, task selection and reasoning draft.",
    owner: "Source maintainer / application support; faculty for task impact",
    diagnostic:
      "Source age/quality or model-load error; no assumption that normal-looking data prove safety.",
    recovery:
      "Use the current provenance label or task-equivalent plan/list/text. Keep simulation, illustration and measured evidence distinct.",
    verify:
      "Old data do not appear fresh. The accessible reference gives the same relevant task facts without requiring the model.",
  },
] as const;
export const operatingOwners = [
  {
    task: "Open and close a booked investigation",
    owner: "Student / session supervisor",
    backup: "Faculty / lab lead",
    record:
      "Confirmed applicable booking, station, kit, evidence and return record",
    route: "/bookings",
  },
  {
    task: "Publish methods and handle session changes",
    owner: "Faculty method owner",
    backup: "Lab lead",
    record: "Method revision, effective scope and existing-session decision",
    route: "/faculty",
  },
  {
    task: "Attendance and evidence review",
    owner: "Faculty",
    backup: "Designated teaching lead",
    record: "Append-only correction or frozen feedback revision",
    route: "/faculty/attendance",
  },
  {
    task: "Equipment condition, location and release",
    owner: "Technician",
    backup: "Lab lead; keep restriction if qualified owner is unavailable",
    record: "Restriction, movement, repair and completed verification",
    route: "/tech",
  },
  {
    task: "Maintain guide sources and review AI flags",
    owner: "Guide owner + application maintainer",
    backup: "Faculty for content; use manual fallback for service outage",
    record: "Published source revision and explicit local-review record",
    route: "/assistant",
  },
] as const;
