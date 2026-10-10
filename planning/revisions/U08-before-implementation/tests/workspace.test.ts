import { describe, it, expect } from "vitest";
import { initialState, transition } from "../src/domain/adapter";
import {
  workspace,
  validWorkspace,
  assetZone,
  criteria,
  type ReviewRevision,
} from "../src/domain/workspace";
import {
  validState,
  readState,
  readRecovery,
  retainBeforeReset,
  REACT_STORAGE_KEY,
  RESET_RECOVERY_KEY,
} from "../src/data/persistence";
import { fixtures, experiments, kits } from "../src/data/fixtures";
import type { LabState, Command } from "../src/domain/types";

const apply = (s: LabState, c: Command) => transition(s, c).state;
function submitted() {
  let s = initialState();
  experiments.E01.prepare.forEach((_, index) => {
    s = apply(s, { type: "prepare", exp: "E01", index, checked: true });
  });
  s = apply(s, { type: "reserve", exp: "E01", slot: "10:00" });
  s = apply(s, {
    type: "check-in",
    exp: "E01",
    station: experiments.E01.station,
  });
  kits[experiments.E01.kit].portable.forEach((i) => {
    s = apply(s, { type: "kit-item", exp: "E01", item: i.id, quantity: i.qty });
  });
  s = apply(s, { type: "start", exp: "E01" });
  experiments.E01.evidence.forEach((e) => {
    s = apply(s, { type: "capture", exp: "E01", evidence: e.id });
  });
  s = apply(s, {
    type: "save-note",
    exp: "E01",
    text: "The generated sample values support this comparison, but do not constitute measured equipment performance.",
  });
  return apply(s, { type: "submit", exp: "E01" });
}
function reviewed(revision: ReviewRevision, s = initialState()) {
  criteria.forEach((_, criterion) => {
    s = apply(s, {
      type: "review-draft",
      revision,
      criterion,
      decision: "Revise",
      comment: `Notebook passage §2 / illustration ILL-L2-v1: criterion ${criterion + 1} needs an evidence-limited claim.`,
    });
  });
  return s;
}
describe("faculty records and frozen publication", () => {
  it("creates the optional extension only through an explicit action", () => {
    const s = initialState(),
      before = structuredClone(s);
    expect(workspace(s).attendance.station).toBe("CV-04");
    expect(s).toEqual(before);
    expect(s.workspace).toBeUndefined();
    expect(validState(s)).toBe(true);
  });
  it("retains attendance draft and refuses an unexplained correction", () => {
    let s = apply(initialState(), {
      type: "workspace-draft",
      key: "attendance-reason",
      value: "Desk label transcribed incorrectly",
    });
    const next = transition(s, {
      type: "attendance-correct",
      station: "CV-03",
      reason: " ",
      expected: 0,
    });
    expect(next.result.code).toBe("reason");
    expect(next.state).toEqual(s);
    s = apply(s, {
      type: "attendance-correct",
      station: "CV-03",
      reason: workspace(s).drafts["attendance-reason"],
      expected: 0,
    });
    expect(workspace(s).attendance.history[0]).toMatchObject({
      from: "CV-04",
      to: "CV-03",
      actor: "Faculty",
    });
    expect(s.sessions).toEqual(initialState().sessions);
  });
  it("rejects stale attendance writes and preserves the original and latest correction", () => {
    const s = apply(initialState(), {
      type: "attendance-correct",
      station: "CV-03",
      reason: "Verified desk label",
      expected: 0,
    });
    const next = transition(s, {
      type: "attendance-correct",
      station: "CV-02",
      reason: "Old tab correction",
      expected: 0,
    });
    expect(next.result.code).toBe("stale");
    expect(next.state).toEqual(s);
  });
  it("retains an older review when new evidence arrives and blocks stale publication", () => {
    const old = reviewed("EVID-E06-r03"),
      s = apply(old, { type: "evidence-arrived" });
    const next = transition(s, {
      type: "feedback-publish",
      revision: "EVID-E06-r03",
      expected: 1,
    });
    expect(next.result.code).toBe("changed-revision");
    expect(workspace(s).reviews["EVID-E06-r03"]).toEqual(
      workspace(old).reviews["EVID-E06-r03"],
    );
    expect(s.sessions).toEqual(old.sessions);
  });
  it("refuses incomplete feedback even if a preview was opened", () => {
    expect(
      transition(initialState(), {
        type: "feedback-publish",
        revision: "EVID-E06-r03",
        expected: 0,
      }).result.code,
    ).toBe("review-incomplete");
  });
  it("publishes a snapshot once and refuses replacement of published feedback", () => {
    const s = apply(reviewed("EVID-E06-r03"), {
      type: "feedback-publish",
      revision: "EVID-E06-r03",
      expected: 0,
    });
    const twice = transition(s, {
      type: "feedback-publish",
      revision: "EVID-E06-r03",
      expected: 1,
    });
    expect(twice.result.repeated).toBe(true);
    expect(twice.state).toEqual(s);
    const edit = transition(s, {
      type: "review-draft",
      revision: "EVID-E06-r03",
      criterion: 0,
      comment: "Replacement",
    });
    expect(edit.result.code).toBe("published");
    expect(edit.state).toEqual(s);
    expect(validState(s)).toBe(true);
  });
  it("requires the current committed record revision before publishing", () => {
    const s = apply(reviewed("EVID-E06-r03"), {
      type: "attendance-correct",
      station: "CV-03",
      reason: "Example reason",
      expected: 0,
    });
    expect(
      transition(s, {
        type: "feedback-publish",
        revision: "EVID-E06-r03",
        expected: 0,
      }).result.code,
    ).toBe("stale");
  });
});
describe("asset and calibration boundaries", () => {
  it("records a movement without changing availability, occupancy or scientific records", () => {
    const s = initialState();
    s.resources["C1-CAM"].restriction = "RST-0417";
    const next = transition(s, {
      type: "asset-move",
      asset: "C1-CAM",
      to: "STO",
      reason: "Awaiting repair",
      expected: 0,
    });
    expect(next.result.ok).toBe(true);
    expect(assetZone(next.state, "C1-CAM")).toBe("STO");
    expect(next.state.resources).toEqual(s.resources);
    expect(next.state.sessions).toEqual(s.sessions);
    expect(workspace(next.state).moves[0]).toMatchObject({
      from: "C1",
      to: "STO",
      actor: "Technician",
    });
    expect(validState(next.state)).toBe(true);
  });
  it("prevents fixed-resource, missing-item, active-hold and stale movement records", () => {
    expect(
      transition(initialState(), {
        type: "asset-move",
        asset: "CV-02",
        to: "STO",
        reason: "Move",
        expected: 0,
      }).result.code,
    ).toBe("fixed-resource");
    const missing = initialState();
    missing.resources["CAL-01"].located = false;
    expect(
      transition(missing, {
        type: "asset-move",
        asset: "CAL-01",
        to: "STO",
        reason: "Move",
        expected: 0,
      }).result.code,
    ).toBe("not-located");
    const held = initialState();
    held.sessions.E06.checkedIn = true;
    held.bookings.push({
      id: "B-example",
      mine: true,
      exp: "E06",
      who: "You",
      day: "Example",
      slot: "10:00",
      status: "Confirmed",
      resources: ["C1-CAM"],
    });
    expect(
      transition(held, {
        type: "asset-move",
        asset: "C1-CAM",
        to: "STO",
        reason: "Move",
        expected: 0,
      }).result.code,
    ).toBe("in-use");
    const moved = apply(initialState(), {
      type: "asset-move",
      asset: "C1-CAM",
      to: "STO",
      reason: "Repair",
      expected: 0,
    });
    expect(
      transition(moved, {
        type: "asset-move",
        asset: "C1-CAM",
        to: "C1",
        reason: "Return",
        expected: 0,
      }).result.code,
    ).toBe("stale");
  });
  it("cannot record incomplete calibration or release an asset through calibration", () => {
    let s = initialState();
    s.resources["C1-CAM"].restriction = "RST-0417";
    expect(
      transition(s, {
        type: "calibration-record",
        reason: "No measured metric supplied",
        expected: 0,
      }).result.code,
    ).toBe("calibration-incomplete");
    for (let i = 0; i < 4; i++) s = apply(s, { type: "calibration-view" });
    s = apply(s, {
      type: "calibration-record",
      reason:
        "Example review only; actual calibration and institution-owned fitness decision needed.",
      expected: 0,
    });
    expect(s.resources["C1-CAM"].restriction).toBe("RST-0417");
    expect(workspace(s).calibration[0].id).toBe("CALREC-C1-r02");
    expect(transition(s, { type: "calibration-view" }).result.code).toBe(
      "frozen",
    );
    expect(validState(s)).toBe(true);
  });
});
describe("no silent replacement and recovery copies", () => {
  it("freezes evidence and saved claims after a student receipt", () => {
    const s = submitted();
    expect(s.sessions.E01.receipt).toBeTruthy();
    for (const command of [
      {
        type: "save-note",
        exp: "E01",
        text: "A changed claim with more than forty characters to bypass the input limit.",
      },
      { type: "capture", exp: "E01", evidence: experiments.E01.evidence[0].id },
    ] as Command[]) {
      const next = transition(s, command);
      expect(next.result.code).toBe("frozen");
      expect(next.state).toEqual(s);
    }
  });
  it("keeps the repair and closed issue immutable", () => {
    let s = apply(initialState(), {
      type: "report",
      asset: "C1-CAM",
      symptom: fixtures.fault.symptoms[0],
      detail: "Test",
    });
    s = apply(s, {
      type: "repair",
      issue: fixtures.fault.issue,
      text: "Cable replaced",
    });
    const overwrite = transition(s, {
      type: "repair",
      issue: fixtures.fault.issue,
      text: "Different repair",
    });
    expect(overwrite.result.code).toBe("recorded");
    expect(overwrite.state).toEqual(s);
    s = apply(s, { type: "release", issue: fixtures.fault.issue });
    expect(
      transition(s, {
        type: "verify",
        issue: fixtures.fault.issue,
        outcome: "pass",
      }).result.code,
    ).toBe("closed");
    expect(
      transition(s, {
        type: "report",
        asset: "C1-CAM",
        symptom: "New fault",
        detail: "",
      }).result.code,
    ).toBe("scenario-complete");
  });
  it("defers a report as a draft and clears its pending state only after a successful local report", () => {
    let s = apply(initialState(), {
      type: "workspace-draft",
      key: "issue-detail",
      value: "Feed stopped. Earlier capture retained.",
    });
    s = apply(s, { type: "report-defer" });
    expect(s.issues).toHaveLength(0);
    s = apply(s, {
      type: "report",
      asset: "C1-CAM",
      symptom: fixtures.fault.symptoms[0],
      detail: workspace(s).drafts["issue-detail"],
    });
    expect(workspace(s).pendingReport).toBe(false);
    expect(s.issues).toHaveLength(1);
    const duplicate = transition(s, {
      type: "report",
      asset: "C1-CAM",
      symptom: "Retry",
      detail: "Duplicate",
    });
    expect(duplicate.result.code).toBe("duplicate");
    expect(duplicate.state).toEqual(s);
  });
  it("reads additive records without modifying old records and rejects malformed nested records", () => {
    const s = apply(initialState(), {
      type: "workspace-draft",
      key: "issue-detail",
      value: "Retained",
    });
    expect(validWorkspace(s.workspace)).toBe(true);
    const invalid = structuredClone(s);
    invalid.workspace!.reviews["EVID-E06-r03"].comments = [];
    expect(validState(invalid)).toBe(false);
    const raw = JSON.stringify({ schemaVersion: 1, state: invalid }),
      storage = {
        getItem: () => raw,
        setItem: () => {
          throw new Error("Should not write on read");
        },
      };
    expect(readState(storage).warning).toContain("incompatible");
    expect(raw).toBe(JSON.stringify({ schemaVersion: 1, state: invalid }));
  });
  it("retains both current work and an incompatible saved record before explicit reset", () => {
    const records = new Map<string, string>([
      [REACT_STORAGE_KEY, "original incompatible record"],
    ]);
    const port = {
      getItem: (k: string) => records.get(k) || null,
      setItem: (k: string, v: string) => {
        records.set(k, v);
      },
    };
    const s = submitted();
    expect(retainBeforeReset(port, s, "test-stamp")).toBeNull();
    expect(JSON.parse(records.get(RESET_RECOVERY_KEY)!).retained).toBe(
      "original incompatible record",
    );
    expect(records.get(REACT_STORAGE_KEY)).toBe("original incompatible record");
    expect(readRecovery(port)).toEqual(s);
  });
  it("refuses reset when a recovery write fails", () => {
    const port = {
      getItem: () => null,
      setItem: () => {
        throw new Error("Quota");
      },
    };
    expect(retainBeforeReset(port, submitted(), "test")).toContain(
      "not performed",
    );
  });
});
