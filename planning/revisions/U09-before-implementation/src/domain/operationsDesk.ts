import { experiments, kits } from "../data/fixtures";
import type { ExperimentId } from "./types";

export const operationActors = {
  pairA: { name: "Pair A · prepared example", role: "student" },
  pairB: { name: "Pair B · prepared example", role: "student" },
  faculty: { name: "Faculty · role preview", role: "faculty" },
  technician: { name: "Technician · role preview", role: "technician" },
} as const;
export type ActorId = keyof typeof operationActors;
export type RequestStatus = "confirmed" | "rejected";
export interface Allocation {
  id: string;
  requestId: string;
  actor: ActorId;
  experiment: ExperimentId;
  day: string;
  start: number;
  end: number;
  resources: string[];
  methodRevision: string;
  policyVersion: number;
  createdRevision: number;
}
export interface Policy {
  experiment: ExperimentId;
  version: number;
  methodRevision: string;
  state: "published" | "withdrawn";
  owner: "faculty";
  existingSessions: "recorded-method" | "pause-for-review";
  reason: string;
  effectiveDay: string;
  reviewBy: string;
}
export interface DeskEvent {
  id: string;
  revision: number;
  actor: ActorId;
  action: string;
  target: string;
  reason: string;
}
export interface Handover {
  id: string;
  owner: "faculty" | "technician";
  backup: "lab-lead";
  topic: "method" | "equipment" | "acknowledgement";
  note: string;
  status: "awaiting-acceptance" | "accepted";
  due: string;
  createdRevision: number;
  acceptedRevision?: number;
  acceptedBy?: ActorId;
}
export interface Notice {
  id: string;
  kind: "method-review" | "equipment-restriction";
  experiment?: ExperimentId;
  asset?: string;
  sourceVersion: number;
  state: "published" | "withdrawn";
  createdRevision: number;
}
export interface DeskResult {
  ok: boolean;
  code: string;
  message: string;
  recordId?: string;
  alternative?: { day: string; start: number; end: number };
  resources?: string[];
  repeated?: boolean;
}
export interface DeskState {
  version: 1;
  revision: number;
  source: "U07 independent exercise";
  policies: Record<ExperimentId, Policy>;
  resourceRevision: number;
  restricted: string[];
  allocations: Allocation[];
  events: DeskEvent[];
  handovers: Handover[];
  notices: Notice[];
  sessions: {
    id: string;
    experiment: ExperimentId;
    methodRevision: string;
    captured: { id: string; source: string; text: string }[];
  }[];
  requests: {
    id: string;
    fingerprint: string;
    actor: ActorId;
    result: DeskResult;
  }[];
}
export type DeskCommand =
  | {
      id: string;
      type: "reserve";
      experiment: ExperimentId;
      day: string;
      start: number;
      end: number;
      policyVersion: number;
      resourceRevision: number;
    }
  | {
      id: string;
      type: "withdraw-method";
      experiment: ExperimentId;
      expected: number;
      existingSessions: Policy["existingSessions"];
      reason: string;
    }
  | { id: string; type: "restrict-camera"; expected: number; reason: string }
  | {
      id: string;
      type: "handover";
      expected: number;
      owner: Handover["owner"];
      topic: Handover["topic"];
      note: string;
      due: string;
    }
  | {
      id: string;
      type: "accept-handover";
      expected: number;
      handoverId: string;
    }
  | {
      id: string;
      type: "publish-notice";
      expected: number;
      kind: Notice["kind"];
      experiment?: ExperimentId;
      asset?: string;
    }
  | { id: string; type: "withdraw-notice"; expected: number; noticeId: string };

export function createDeskState(): DeskState {
  const policy = (experiment: ExperimentId): Policy => ({
    experiment,
    version: 1,
    methodRevision: experiments[experiment].methodRevision,
    state: "published",
    owner: "faculty",
    existingSessions: "recorded-method",
    reason: "Prepared exercise method; not institutional approval",
    effectiveDay: "2026-10-06",
    reviewBy: "2026-10-06 17:00 IST",
  });
  return {
    version: 1,
    revision: 0,
    source: "U07 independent exercise",
    policies: { E01: policy("E01"), E06: policy("E06") },
    resourceRevision: 0,
    restricted: [],
    allocations: [],
    events: [],
    handovers: [],
    notices: [],
    requests: [],
    sessions: [
      {
        id: "OP-SESSION-E06",
        experiment: "E06",
        methodRevision: experiments.E06.methodRevision,
        captured: [
          {
            id: "OP-CAPTURE-01",
            source: "Prepared illustration",
            text: "Compare the visible side-light shadow with the frontal illustration.",
          },
        ],
      },
    ],
  };
}
export const fullManifest = (experiment: ExperimentId): string[] => {
  const kit = kits[experiments[experiment].kit];
  return [...kit.fixed, ...kit.portable].flatMap(
    (item) => item.members || [item.id],
  );
};
export const timeLabel = (minute: number) =>
  `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
export const overlap = (
  a: { day: string; start: number; end: number },
  b: { day: string; start: number; end: number },
) => a.day === b.day && a.start < b.end && b.start < a.end;
const goodDay = (day: unknown): day is string =>
  typeof day === "string" &&
  /^2026-\d{2}-\d{2}$/.test(day) &&
  (() => {
    try {
      return new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
    } catch {
      return false;
    }
  })();
const text = (value: unknown, minimum = 1) =>
  typeof value === "string" &&
  value.trim().length >= minimum &&
  value.length <= 1500;
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const roles = (id: unknown): id is ActorId =>
  typeof id === "string" && Object.hasOwn(operationActors, id);
const experiment = (id: unknown): id is ExperimentId =>
  id === "E01" || id === "E06";
const integer = (v: unknown): v is number =>
  Number.isSafeInteger(v) && Number(v) >= 0;

export function validDeskCommand(value: unknown): value is DeskCommand {
  if (
    !object(value) ||
    typeof value.id !== "string" ||
    !/^[a-zA-Z0-9-]{8,80}$/.test(value.id)
  )
    return false;
  const fields: Record<string, string[]> = {
    reserve: [
      "id",
      "type",
      "experiment",
      "day",
      "start",
      "end",
      "policyVersion",
      "resourceRevision",
    ],
    "withdraw-method": [
      "id",
      "type",
      "experiment",
      "expected",
      "existingSessions",
      "reason",
    ],
    "restrict-camera": ["id", "type", "expected", "reason"],
    handover: ["id", "type", "expected", "owner", "topic", "note", "due"],
    "accept-handover": ["id", "type", "expected", "handoverId"],
    "publish-notice": ["id", "type", "expected", "kind", "experiment", "asset"],
    "withdraw-notice": ["id", "type", "expected", "noticeId"],
  };
  const allowed = fields[String(value.type)];
  if (!allowed || Object.keys(value).some((k) => !allowed.includes(k)))
    return false;
  if (value.type === "reserve")
    return (
      experiment(value.experiment) &&
      goodDay(value.day) &&
      integer(value.start) &&
      integer(value.end) &&
      value.start >= 540 &&
      value.end <= 1020 &&
      value.end > value.start &&
      [60, 120].includes(value.end - value.start) &&
      integer(value.policyVersion) &&
      integer(value.resourceRevision)
    );
  if (!integer(value.expected)) return false;
  switch (value.type) {
    case "withdraw-method":
      return (
        experiment(value.experiment) &&
        ["recorded-method", "pause-for-review"].includes(
          String(value.existingSessions),
        ) &&
        text(value.reason, 8)
      );
    case "restrict-camera":
      return text(value.reason, 8);
    case "handover":
      return (
        ["faculty", "technician"].includes(String(value.owner)) &&
        ["method", "equipment", "acknowledgement"].includes(
          String(value.topic),
        ) &&
        text(value.note, 8) &&
        text(value.due, 4) &&
        String(value.due).length <= 100
      );
    case "accept-handover":
      return text(value.handoverId);
    case "publish-notice":
      return (
        (value.kind === "method-review" &&
          experiment(value.experiment) &&
          value.asset === undefined) ||
        (value.kind === "equipment-restriction" &&
          value.asset === "C1-CAM" &&
          value.experiment === undefined)
      );
    case "withdraw-notice":
      return text(value.noticeId);
    default:
      return false;
  }
}
const conflicts = (
  s: DeskState,
  c: Extract<DeskCommand, { type: "reserve" }>,
) => {
  const resources = fullManifest(c.experiment);
  return [
    ...new Set(
      s.allocations
        .filter((b) => overlap(b, c))
        .flatMap((b) => b.resources.filter((r) => resources.includes(r))),
    ),
  ];
};
export function checkedAlternative(
  s: DeskState,
  c: Extract<DeskCommand, { type: "reserve" }>,
) {
  if (
    s.policies[c.experiment].state !== "published" ||
    fullManifest(c.experiment).some((r) => s.restricted.includes(r))
  )
    return undefined;
  const duration = c.end - c.start;
  for (let start = c.start + 60; start + duration <= 1020; start += 60) {
    const attempt = { ...c, start, end: start + duration };
    if (!conflicts(s, attempt).length)
      return { day: c.day, start, end: start + duration };
  }
  return undefined;
}
export function transitionDesk(
  previous: DeskState,
  untrusted: unknown,
  actor: ActorId,
): { state: DeskState; result: DeskResult } {
  const fail = (
    code: string,
    message: string,
    extra: Partial<DeskResult> = {},
  ) => ({ ok: false, code, message, ...extra });
  if (!roles(actor) || !validDeskCommand(untrusted))
    return {
      state: previous,
      result: fail(
        "invalid-command",
        "Choose a supported exercise action and keep all required fields.",
      ),
    };
  const c = untrusted;
  const fingerprint = JSON.stringify(
    Object.keys(c)
      .sort()
      .map((key) => [key, (c as unknown as Record<string, unknown>)[key]]),
  );
  const old = previous.requests.find((r) => r.id === c.id);
  if (old)
    return {
      state: previous,
      result:
        old.fingerprint === fingerprint && old.actor === actor
          ? { ...old.result, repeated: true }
          : fail(
              "request-conflict",
              "This request ID already belongs to different content or an actor. Use a new request for a new intention.",
            ),
    };
  if (previous.requests.length >= 80)
    return {
      state: previous,
      result: fail(
        "exercise-limit",
        "This exercise reached its 80-request limit. Export it before starting a fresh exercise.",
      ),
    };
  const state = structuredClone(previous);
  const record = (result: DeskResult) => {
    state.requests.push({
      id: c.id,
      fingerprint,
      actor,
      result: structuredClone(result),
    });
    return { state, result };
  };
  const commit = (action: string, target: string, reason: string) => {
    state.revision++;
    state.events.push({
      id: `OP-EVENT-${state.revision}`,
      revision: state.revision,
      actor,
      action,
      target,
      reason,
    });
  };
  const role = operationActors[actor].role;
  if (c.type === "reserve") {
    if (role !== "student")
      return record(
        fail(
          "wrong-owner",
          "Only a prepared student actor makes this exercise booking request.",
        ),
      );
    const policy = state.policies[c.experiment];
    if (policy.state !== "published")
      return record(
        fail(
          "method-withdrawn",
          "This method is withdrawn for new exercise bookings. Ask the method owner for a published applicable method.",
        ),
      );
    if (
      c.policyVersion !== policy.version ||
      c.resourceRevision !== state.resourceRevision
    )
      return record(
        fail(
          "stale-context",
          "Method or resource conditions changed. Review them, then create a new booking intention.",
        ),
      );
    const resources = fullManifest(c.experiment);
    const blocked = resources.filter((r) => state.restricted.includes(r));
    if (blocked.length)
      return record(
        fail(
          "restricted",
          "A required component is restricted. No part of this kit was allocated.",
          { resources: blocked },
        ),
      );
    const clash = conflicts(state, c);
    if (clash.length)
      return record(
        fail(
          "conflict",
          "The interval overlaps an existing complete-kit allocation. No partial hold was created.",
          { resources: clash, alternative: checkedAlternative(state, c) },
        ),
      );
    const id = `OP-BOOKING-${state.allocations.length + 1}`;
    commit(
      "Complete kit allocated",
      id,
      "Final interval, manifest, method and restriction check inside the local exercise transition",
    );
    state.allocations.push({
      id,
      requestId: c.id,
      actor,
      experiment: c.experiment,
      day: c.day,
      start: c.start,
      end: c.end,
      resources,
      methodRevision: policy.methodRevision,
      policyVersion: policy.version,
      createdRevision: state.revision,
    });
    return record({
      ok: true,
      code: "confirmed",
      message:
        "Complete kit allocated in this independent exercise. This is not a real lab reservation.",
      recordId: id,
    });
  }
  if (role === "student")
    return record(
      fail(
        "wrong-owner",
        "This exercise action belongs to the designated staff actor; role previews are not account permissions.",
      ),
    );
  if (c.expected !== state.revision)
    return record(
      fail(
        "stale-record",
        "The exercise record changed. Keep your draft, review the current version and use a new request.",
      ),
    );
  switch (c.type) {
    case "withdraw-method": {
      if (role !== "faculty")
        return record(
          fail(
            "wrong-owner",
            "The method owner handles publication and existing-session applicability.",
          ),
        );
      const p = state.policies[c.experiment];
      if (p.state === "withdrawn")
        return record(
          fail(
            "unchanged",
            "This method is already withdrawn in the exercise.",
          ),
        );
      p.version++;
      p.state = "withdrawn";
      p.existingSessions = c.existingSessions;
      p.reason = c.reason.trim();
      commit("Method withdrawn", c.experiment, c.reason.trim());
      return record({
        ok: true,
        code: "method-withdrawn",
        message:
          "New exercise bookings are blocked. Recorded evidence and method revisions remain; the chosen existing-session rule is explicit.",
      });
    }
    case "restrict-camera":
      if (role !== "technician")
        return record(
          fail(
            "wrong-owner",
            "A technician owns this equipment restriction exercise.",
          ),
        );
      if (state.restricted.includes("C1-CAM"))
        return record(fail("unchanged", "The camera is already restricted."));
      state.restricted.push("C1-CAM");
      state.resourceRevision++;
      commit("Resource restricted", "C1-CAM", c.reason.trim());
      return record({
        ok: true,
        code: "restricted",
        message:
          "C1-CAM is restricted in the exercise. Existing allocations remain recorded; eligibility changes separately. Signal equipment is unaffected.",
      });
    case "handover": {
      const responsible = c.topic === "equipment" ? "technician" : "faculty";
      if (c.owner !== responsible)
        return record(
          fail(
            "wrong-next-owner",
            `This ${c.topic} handover needs its ${responsible} owner. Keep the note and correct the next owner.`,
          ),
        );
      const id = `OP-HANDOVER-${state.handovers.length + 1}`;
      commit("Handover recorded", id, c.note.trim());
      state.handovers.push({
        id,
        owner: c.owner,
        backup: "lab-lead",
        topic: c.topic,
        note: c.note.trim(),
        status: "awaiting-acceptance",
        due: c.due.trim(),
        createdRevision: state.revision,
      });
      return record({
        ok: true,
        code: "handover-recorded",
        message:
          "Handover retained in this exercise. The next owner has not accepted it yet; no staff notification was sent.",
        recordId: id,
      });
    }
    case "accept-handover": {
      const h = state.handovers.find((h) => h.id === c.handoverId);
      if (!h)
        return record(fail("missing-handover", "Choose an existing handover."));
      if (role !== h.owner)
        return record(
          fail(
            "wrong-owner",
            "Only the named next-owner actor can accept this exercise handover.",
          ),
        );
      if (h.status === "accepted")
        return record(fail("unchanged", "This handover is already accepted."));
      commit(
        "Handover accepted",
        h.id,
        "Named owner accepted the exercise responsibility",
      );
      h.status = "accepted";
      h.acceptedBy = actor;
      h.acceptedRevision = state.revision;
      return record({
        ok: true,
        code: "handover-accepted",
        message:
          "The named owner accepted this exercise handover. Its original note and due condition remain.",
      });
    }
    case "publish-notice": {
      const policy = c.experiment ? state.policies[c.experiment] : undefined;
      if (
        c.kind === "method-review" &&
        (role !== "faculty" || policy?.state !== "withdrawn")
      )
        return record(
          fail(
            "unsupported-notice",
            "A method-review notice needs a withdrawn method and its faculty owner.",
          ),
        );
      if (
        c.kind === "equipment-restriction" &&
        (role !== "technician" || !state.restricted.includes("C1-CAM"))
      )
        return record(
          fail(
            "unsupported-notice",
            "A camera notice needs the actual exercise restriction and technician owner.",
          ),
        );
      const sourceVersion = policy?.version || state.resourceRevision;
      if (
        state.notices.some(
          (n) =>
            n.state === "published" &&
            n.kind === c.kind &&
            n.experiment === c.experiment &&
            n.sourceVersion === sourceVersion,
        )
      )
        return record(
          fail(
            "unchanged",
            "That consequence already has a published exercise notice.",
          ),
        );
      const id = `OP-NOTICE-${state.notices.length + 1}`;
      commit(
        "Public consequence published",
        id,
        "Only allowlisted consequence fields; private reason and person omitted",
      );
      state.notices.push({
        id,
        kind: c.kind,
        ...(c.experiment ? { experiment: c.experiment } : {}),
        ...(c.asset ? { asset: c.asset } : {}),
        sourceVersion,
        state: "published",
        createdRevision: state.revision,
      });
      return record({
        ok: true,
        code: "notice-published",
        message:
          "The allowed consequence is published in the exercise preview only. No operational wall or external notification was changed.",
      });
    }
    case "withdraw-notice": {
      const n = state.notices.find((n) => n.id === c.noticeId);
      if (!n)
        return record(
          fail("missing-notice", "Choose a published exercise notice."),
        );
      if (role !== (n.kind === "method-review" ? "faculty" : "technician"))
        return record(
          fail(
            "wrong-owner",
            "The notice's responsible owner must withdraw it.",
          ),
        );
      if (n.state === "withdrawn")
        return record(fail("unchanged", "The notice is already withdrawn."));
      commit(
        "Public notice withdrawn",
        n.id,
        "Publication history retained; underlying equipment/method condition unchanged",
      );
      n.state = "withdrawn";
      return record({
        ok: true,
        code: "notice-withdrawn",
        message:
          "The public notice is withdrawn. Its history and underlying restriction or method state remain.",
      });
    }
  }
}
export function sessionApplicability(
  s: DeskState,
  session: DeskState["sessions"][number],
) {
  const policy = s.policies[session.experiment];
  const restricted = fullManifest(session.experiment).filter((r) =>
    s.restricted.includes(r),
  );
  const methodPermitted =
    policy.state === "published" ||
    policy.existingSessions === "recorded-method";
  return {
    allowed: methodPermitted && !restricted.length,
    recordedRevision: session.methodRevision,
    currentPolicyVersion: policy.version,
    restricted,
    nextOwner: restricted.length
      ? "Technician"
      : !methodPermitted
        ? "Faculty method owner"
        : "Student under the recorded exercise method",
    evidenceRetained: session.captured.length,
  };
}
export function publicDeskProjection(s: DeskState) {
  return {
    revision: s.revision,
    source: s.source,
    notices: s.notices
      .filter((n) => n.state === "published")
      .map((n) => ({
        consequence:
          n.kind === "method-review"
            ? `${n.experiment} method is under review. Contact faculty before a new session.`
            : "C1-CAM is restricted. The complete capture kit is unavailable.",
        subject: n.experiment || n.asset || "",
        sourceVersion: n.sourceVersion,
      })),
  };
}
export interface DeskRepository {
  snapshot(): DeskState;
  execute(command: DeskCommand, actor: ActorId): Promise<DeskResult>;
  lookup(id: string, actor: ActorId): DeskResult | undefined;
}
// Serialised in one browser instance. This is a training repository, not a shared database.
export class MemoryDeskRepository implements DeskRepository {
  private current: DeskState;
  private tail: Promise<void> = Promise.resolve();
  constructor(state = createDeskState()) {
    this.current = structuredClone(state);
  }
  snapshot() {
    return structuredClone(this.current);
  }
  lookup(id: string, actor: ActorId) {
    const r = this.current.requests.find(
      (r) => r.id === id && r.actor === actor,
    );
    return r ? structuredClone(r.result) : undefined;
  }
  execute(command: DeskCommand, actor: ActorId): Promise<DeskResult> {
    const captured = structuredClone(command);
    const task = this.tail.then(() => {
      const updated = transitionDesk(this.current, captured, actor);
      this.current = updated.state;
      return structuredClone(updated.result);
    });
    this.tail = task.then(
      () => {},
      () => {},
    );
    return task;
  }
}

export function validDeskState(value: unknown): value is DeskState {
  if (
    !object(value) ||
    value.version !== 1 ||
    value.source !== "U07 independent exercise" ||
    !integer(value.revision) ||
    !integer(value.resourceRevision) ||
    !object(value.policies)
  )
    return false;
  const p = value.policies as Record<string, Record<string, unknown>>;
  if (
    !["E01", "E06"].every(
      (id) =>
        object(p[id]) &&
        p[id].experiment === id &&
        integer(p[id].version) &&
        p[id].version >= 1 &&
        p[id].methodRevision ===
          experiments[id as ExperimentId].methodRevision &&
        ["published", "withdrawn"].includes(String(p[id].state)) &&
        p[id].owner === "faculty" &&
        ["recorded-method", "pause-for-review"].includes(
          String(p[id].existingSessions),
        ) &&
        text(p[id].reason) &&
        goodDay(p[id].effectiveDay) &&
        text(p[id].reviewBy),
    )
  )
    return false;
  if (
    !Array.isArray(value.restricted) ||
    !value.restricted.every((r) => r === "C1-CAM") ||
    new Set(value.restricted).size !== value.restricted.length
  )
    return false;
  if (
    !Array.isArray(value.allocations) ||
    !value.allocations.every(
      (b) =>
        object(b) &&
        text(b.id) &&
        text(b.requestId) &&
        roles(b.actor) &&
        operationActors[b.actor].role === "student" &&
        experiment(b.experiment) &&
        goodDay(b.day) &&
        integer(b.start) &&
        integer(b.end) &&
        b.end > b.start &&
        b.start >= 540 &&
        b.end <= 1020 &&
        [60, 120].includes(b.end - b.start) &&
        b.methodRevision === experiments[b.experiment].methodRevision &&
        integer(b.policyVersion) &&
        integer(b.createdRevision) &&
        b.createdRevision <= Number(value.revision) &&
        Array.isArray(b.resources) &&
        JSON.stringify(b.resources) ===
          JSON.stringify(fullManifest(b.experiment)),
    )
  )
    return false;
  const allocations = value.allocations as unknown as Allocation[];
  if (
    new Set(allocations.map((b) => b.id)).size !== allocations.length ||
    allocations.some((a, i) =>
      allocations
        .slice(i + 1)
        .some(
          (b) =>
            overlap(a, b) && a.resources.some((r) => b.resources.includes(r)),
        ),
    )
  )
    return false;
  if (
    !Array.isArray(value.events) ||
    value.events.length !== value.revision ||
    !value.events.every(
      (e, i) =>
        object(e) &&
        e.id === `OP-EVENT-${i + 1}` &&
        e.revision === i + 1 &&
        roles(e.actor) &&
        text(e.action) &&
        text(e.target) &&
        text(e.reason),
    )
  )
    return false;
  if (
    !Array.isArray(value.handovers) ||
    !value.handovers.every(
      (h) =>
        object(h) &&
        text(h.id) &&
        ["faculty", "technician"].includes(String(h.owner)) &&
        h.backup === "lab-lead" &&
        ["method", "equipment", "acknowledgement"].includes(String(h.topic)) &&
        text(h.note, 8) &&
        text(h.due, 4) &&
        ["awaiting-acceptance", "accepted"].includes(String(h.status)) &&
        integer(h.createdRevision) &&
        h.createdRevision <= Number(value.revision) &&
        (h.status !== "accepted" ||
          (roles(h.acceptedBy) &&
            operationActors[h.acceptedBy].role === h.owner &&
            integer(h.acceptedRevision) &&
            h.acceptedRevision <= Number(value.revision))),
    )
  )
    return false;
  if (
    !Array.isArray(value.notices) ||
    !value.notices.every(
      (n) =>
        object(n) &&
        text(n.id) &&
        ["published", "withdrawn"].includes(String(n.state)) &&
        integer(n.sourceVersion) &&
        integer(n.createdRevision) &&
        n.createdRevision <= Number(value.revision) &&
        ((n.kind === "method-review" &&
          experiment(n.experiment) &&
          n.asset === undefined &&
          p[n.experiment].state === "withdrawn" &&
          p[n.experiment].version === n.sourceVersion) ||
          (n.kind === "equipment-restriction" &&
            n.asset === "C1-CAM" &&
            n.experiment === undefined &&
            value.restricted instanceof Array &&
            value.restricted.includes("C1-CAM") &&
            n.sourceVersion === value.resourceRevision)),
    )
  )
    return false;
  if (
    !Array.isArray(value.sessions) ||
    JSON.stringify(value.sessions) !==
      JSON.stringify(createDeskState().sessions)
  )
    return false;
  return (
    Array.isArray(value.requests) &&
    value.requests.length <= 80 &&
    new Set(value.requests.map((r) => (object(r) ? r.id : null))).size ===
      value.requests.length &&
    value.requests.every(
      (r) =>
        object(r) &&
        text(r.id) &&
        typeof r.fingerprint === "string" &&
        r.fingerprint.length > 0 &&
        r.fingerprint.length <= 5000 &&
        roles(r.actor) &&
        object(r.result) &&
        typeof r.result.ok === "boolean" &&
        text(r.result.code) &&
        text(r.result.message),
    )
  );
}
