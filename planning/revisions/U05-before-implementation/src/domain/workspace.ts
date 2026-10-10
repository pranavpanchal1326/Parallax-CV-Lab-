import { fixtures } from "../data/fixtures";
import type { DomainResult, LabState } from "./types";

export const criteria = [
  "Controlled method",
  "Evidence provenance",
  "Claim within evidence",
  "Limitations stated",
] as const;
export const reviewRevisions = ["EVID-E06-r03", "EVID-E06-r04"] as const;
export type ReviewRevision = (typeof reviewRevisions)[number];
export type Judgement = "Unreviewed" | "Meets" | "Revise" | "Not found";
export interface Review {
  decisions: Judgement[];
  comments: string[];
}
export interface Workspace {
  version: 1;
  revision: number;
  drafts: Record<string, string>;
  attendance: {
    station: string;
    history: {
      from: string;
      to: string;
      reason: string;
      time: string;
      actor: string;
    }[];
  };
  newestEvidence: ReviewRevision;
  reviews: Record<ReviewRevision, Review>;
  published: {
    id: string;
    revision: ReviewRevision;
    review: Review;
    time: string;
    actor: string;
  }[];
  moves: {
    asset: string;
    from: string;
    to: string;
    reason: string;
    time: string;
    actor: string;
  }[];
  calibration: {
    id: string;
    views: number;
    reason: string;
    time: string;
    actor: string;
  }[];
  calibrationViews: number;
  pendingReport: boolean;
}
export type WorkspaceCommand =
  | { type: "workspace-draft"; key: string; value: string }
  | {
      type: "attendance-correct";
      station: string;
      reason: string;
      expected: number;
    }
  | {
      type: "review-draft";
      revision: ReviewRevision;
      criterion: number;
      decision?: Judgement;
      comment?: string;
    }
  | { type: "evidence-arrived" }
  | { type: "feedback-publish"; revision: ReviewRevision; expected: number }
  | {
      type: "asset-move";
      asset: string;
      to: string;
      reason: string;
      expected: number;
    }
  | { type: "calibration-view" }
  | { type: "calibration-record"; reason: string; expected: number }
  | { type: "report-defer" | "report-delivered" };

// P7-A prepared teaching/assessment scenarios are distinct from the student's React records.
// The optional extension is created only by an explicit action; old sessions are never backfilled.
export function emptyWorkspace(): Workspace {
  const review = (): Review => ({
    decisions: criteria.map(() => "Unreviewed"),
    comments: criteria.map(() => ""),
  });
  return {
    version: 1,
    revision: 0,
    drafts: {},
    attendance: { station: "CV-04", history: [] },
    newestEvidence: reviewRevisions[0],
    reviews: { "EVID-E06-r03": review(), "EVID-E06-r04": review() },
    published: [],
    moves: [],
    calibration: [],
    calibrationViews: 11,
    pendingReport: false,
  };
}
export const workspace = (s: LabState): Workspace =>
  s.workspace || emptyWorkspace();
export function assetZone(s: LabState, asset: string): string {
  return (
    workspace(s)
      .moves.filter((m) => m.asset === asset)
      .at(-1)?.to ||
    fixtures.resources.find((r) => r.id === asset)?.zone ||
    "Unknown"
  );
}
const draftKeys = [
  "issue-detail",
  "issue-symptom",
  "repair",
  "attendance-reason",
  "attendance-station",
  "move-reason",
  "move-zone",
  "calibration-reason",
  "lookup",
] as const;
const isText = (x: unknown): x is string => typeof x === "string";
const isObject = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const stamp = (x: unknown) =>
  isObject(x) && isText(x.time) && isText(x.actor) && isText(x.reason);
const validReview = (x: unknown): x is Review =>
  isObject(x) &&
  Array.isArray(x.decisions) &&
  x.decisions.length === 4 &&
  x.decisions.every((d) =>
    ["Unreviewed", "Meets", "Revise", "Not found"].includes(d),
  ) &&
  Array.isArray(x.comments) &&
  x.comments.length === 4 &&
  x.comments.every(isText);
export function validWorkspace(x: unknown): x is Workspace {
  if (
    !isObject(x) ||
    x.version !== 1 ||
    !Number.isSafeInteger(x.revision) ||
    Number(x.revision) < 0 ||
    !isObject(x.drafts) ||
    !Object.entries(x.drafts).every(
      ([k, v]) =>
        draftKeys.includes(k as (typeof draftKeys)[number]) && isText(v),
    )
  )
    return false;
  if (
    !isObject(x.attendance) ||
    !/^CV-0[1-6]$/.test(String(x.attendance.station)) ||
    !Array.isArray(x.attendance.history) ||
    !x.attendance.history.every(
      (h) => stamp(h) && /^CV-0[1-6]$/.test(h.from) && /^CV-0[1-6]$/.test(h.to),
    )
  )
    return false;
  const reviews = x.reviews;
  if (
    !reviewRevisions.includes(x.newestEvidence as ReviewRevision) ||
    !isObject(reviews) ||
    !reviewRevisions.every((r) => validReview(reviews[r]))
  )
    return false;
  if (
    !Array.isArray(x.published) ||
    !x.published.every(
      (p) =>
        isObject(p) &&
        isText(p.id) &&
        isText(p.time) &&
        isText(p.actor) &&
        reviewRevisions.includes(p.revision as ReviewRevision) &&
        validReview(p.review),
    ) ||
    new Set(x.published.map((p) => p.revision)).size !== x.published.length
  )
    return false;
  if (
    !Array.isArray(x.moves) ||
    !x.moves.every(
      (m) =>
        stamp(m) &&
        fixtures.resources.some(
          (r) => r.id === m.asset && r.kind.startsWith("Portable"),
        ) &&
        Object.hasOwn(fixtures.zones, m.from) &&
        Object.hasOwn(fixtures.zones, m.to),
    )
  )
    return false;
  if (
    !Array.isArray(x.calibration) ||
    x.calibration.length > 1 ||
    !x.calibration.every(
      (c) => stamp(c) && c.id === "CALREC-C1-r02" && c.views === 15,
    )
  )
    return false;
  return (
    Number.isInteger(x.calibrationViews) &&
    Number(x.calibrationViews) >= 11 &&
    Number(x.calibrationViews) <= 15 &&
    typeof x.pendingReport === "boolean"
  );
}
export function workspaceTransition(
  s: LabState,
  command: WorkspaceCommand,
): DomainResult {
  const w = structuredClone(workspace(s));
  const fail = (code: string, message: string): DomainResult => ({
    ok: false,
    code,
    message,
  });
  const time = () =>
    `${String(Math.floor(s.minute / 60) % 24).padStart(2, "0")}:${String(s.minute % 60).padStart(2, "0")}`;
  const commit = (
    actor: string,
    action: string,
    ref: string,
    reason: string,
  ) => {
    w.revision++;
    s.minute += 3;
    s.log.push({
      n: s.log.length + 1,
      time: time(),
      actor,
      action,
      ref,
      reason,
    });
  };
  if ("expected" in command && command.expected !== w.revision)
    return fail(
      "stale",
      "This record changed after the form opened. Your draft is retained. Review the current record and reopen the form before retrying.",
    );
  switch (command.type) {
    case "workspace-draft":
      if (!draftKeys.includes(command.key as (typeof draftKeys)[number]))
        return fail("unknown-draft", "This draft field is not supported.");
      w.drafts[command.key] = command.value;
      break;
    case "attendance-correct": {
      if (!/^CV-0[1-6]$/.test(command.station))
        return fail("station", "Choose a computing station in this lab.");
      if (!command.reason.trim())
        return fail(
          "reason",
          "Explain the correction; the original check-in will remain in the history.",
        );
      if (command.station === w.attendance.station)
        return fail(
          "unchanged",
          "The attendance record already has this station.",
        );
      const from = w.attendance.station;
      commit(
        "Faculty",
        "Corrected example attendance",
        "ATT-0712",
        command.reason.trim(),
      );
      w.attendance.history.push({
        from,
        to: command.station,
        reason: command.reason.trim(),
        time: time(),
        actor: "Faculty",
      });
      w.attendance.station = command.station;
      break;
    }
    case "review-draft": {
      if (w.published.some((p) => p.revision === command.revision))
        return fail(
          "published",
          "Published feedback is frozen. Review another evidence revision to create new feedback.",
        );
      if (
        !reviewRevisions.includes(command.revision) ||
        !Number.isInteger(command.criterion) ||
        command.criterion < 0 ||
        command.criterion >= 4
      )
        return fail("criterion", "Choose an existing review criterion.");
      if (
        command.decision &&
        !["Unreviewed", "Meets", "Revise", "Not found"].includes(
          command.decision,
        )
      )
        return fail("decision", "Choose a supported judgement.");
      const r = w.reviews[command.revision];
      if (command.decision) r.decisions[command.criterion] = command.decision;
      if (command.comment !== undefined)
        r.comments[command.criterion] = command.comment;
      break;
    }
    case "evidence-arrived":
      if (w.newestEvidence === reviewRevisions[1])
        return { ok: true, repeated: true };
      w.newestEvidence = reviewRevisions[1];
      commit(
        "System",
        "Received prepared example revision",
        "EVID-E06-r04",
        "Scenario trigger; existing reviews and student records retained",
      );
      break;
    case "feedback-publish": {
      if (!reviewRevisions.includes(command.revision))
        return fail("revision", "Choose an existing evidence revision.");
      if (w.published.some((p) => p.revision === command.revision))
        return { ok: true, repeated: true };
      if (command.revision !== w.newestEvidence)
        return fail(
          "changed-revision",
          "A newer evidence revision arrived. The previous review is retained. Open the new revision and review it before publishing.",
        );
      const review = w.reviews[command.revision];
      if (
        review.decisions.includes("Unreviewed") ||
        review.comments.some((c) => !c.trim())
      )
        return fail(
          "review-incomplete",
          "Review all four criteria and name the evidence or notebook passage in each comment.",
        );
      commit(
        "Faculty",
        "Published example feedback",
        command.revision,
        "Local role preview only; no message or grade sent",
      );
      w.published.push({
        id: `FB-2041-${w.published.length + 1}`,
        revision: command.revision,
        review: structuredClone(review),
        time: time(),
        actor: "Faculty",
      });
      break;
    }
    case "asset-move": {
      const resource = fixtures.resources.find((r) => r.id === command.asset);
      if (!resource?.kind.startsWith("Portable"))
        return fail(
          "fixed-resource",
          "Only portable equipment can have a movement record.",
        );
      if (!Object.hasOwn(fixtures.zones, command.to))
        return fail("zone", "Choose a known lab zone.");
      if (!s.resources[command.asset].located)
        return fail(
          "not-located",
          "Resolve the missing-item follow-up before recording a movement.",
        );
      const inUse = Object.entries(s.sessions).some(
        ([exp, ses]) =>
          ses.checkedIn &&
          !ses.closed &&
          s.bookings.some(
            (b) =>
              b.mine && b.exp === exp && b.resources.includes(command.asset),
          ),
      );
      if (inUse)
        return fail(
          "in-use",
          "This asset is held by an active session. Close the session before moving it.",
        );
      const from = assetZone(s, command.asset);
      if (from === command.to)
        return fail("unchanged", "The asset is already recorded in this zone.");
      if (!command.reason.trim())
        return fail("reason", "Give a reason for the movement.");
      commit(
        "Technician",
        "Recorded example asset movement",
        command.asset,
        command.reason.trim(),
      );
      w.moves.push({
        asset: command.asset,
        from,
        to: command.to,
        reason: command.reason.trim(),
        time: time(),
        actor: "Technician",
      });
      break;
    }
    case "calibration-view":
      if (w.calibration.length)
        return fail(
          "frozen",
          "The calibration example is recorded and cannot be edited.",
        );
      if (w.calibrationViews === 15) return { ok: true, repeated: true };
      w.calibrationViews++;
      break;
    case "calibration-record":
      if (w.calibration.length) return { ok: true, repeated: true };
      if (w.calibrationViews !== 15 || !command.reason.trim())
        return fail(
          "calibration-incomplete",
          "Complete the 15 planned example views and enter the review note.",
        );
      commit(
        "Technician",
        "Recorded example calibration review",
        "CALREC-C1-r02",
        command.reason.trim(),
      );
      w.calibration.push({
        id: "CALREC-C1-r02",
        views: w.calibrationViews,
        reason: command.reason.trim(),
        time: time(),
        actor: "Technician",
      });
      break;
    case "report-defer":
      w.pendingReport = true;
      break;
    case "report-delivered":
      w.pendingReport = false;
      break;
  }
  s.workspace = w;
  return { ok: true };
}
