import { describe, expect, it } from "vitest";
import { fixtures, experiments, kits } from "../src/data/fixtures";
import { initialState, selectors, transition } from "../src/domain/adapter";
import {
  readState,
  writeState,
  validState,
  REACT_STORAGE_KEY,
} from "../src/data/persistence";
import { signalSamples } from "../src/components/ExperimentArt";
import type { Command, ExperimentId, LabState } from "../src/domain/types";

function apply(state: LabState, command: Command) {
  return transition(state, command).state;
}
function prepare(exp: ExperimentId, state = initialState()) {
  experiments[exp].prepare.forEach((_, index) => {
    state = apply(state, { type: "prepare", exp, index, checked: true });
  });
  return state;
}
function start(exp: ExperimentId) {
  let state = apply(prepare(exp), {
    type: "reserve",
    exp,
    slot: exp === "E06" ? "11:00" : "10:00",
  });
  state = apply(state, {
    type: "check-in",
    exp,
    station: experiments[exp].station,
  });
  kits[experiments[exp].kit].portable.forEach((i) => {
    state = apply(state, {
      type: "kit-item",
      exp,
      item: i.id,
      quantity: i.qty,
    });
  });
  return apply(state, { type: "start", exp });
}
function ready(exp: ExperimentId) {
  let state = start(exp);
  experiments[exp].evidence.forEach((e) => {
    state = apply(state, { type: "capture", exp, evidence: e.id });
  });
  return apply(state, {
    type: "save-note",
    exp,
    text: "These example conditions support a comparison, with limitations that require actual measurement.",
  });
}
function restrict() {
  let state = apply(start("E06"), {
    type: "report",
    asset: "C1-CAM",
    symptom: fixtures.fault.symptoms[0],
    detail: "Example fault details",
  });
  state = apply(state, {
    type: "triage",
    issue: fixtures.fault.issue,
    classification: fixtures.fault.classifications.find((c) => c.restrict)!.id,
  });
  return apply(state, { type: "restrict", issue: fixtures.fault.issue });
}
function freeze(value: unknown) {
  if (value && typeof value === "object") {
    Object.freeze(value);
    Object.values(value).forEach(freeze);
  }
}

describe("immutable migration and preserved failure states", () => {
  it("does not mutate React-owned input or fixture records", () => {
    const state = prepare("E06"),
      before = structuredClone(state),
      fixtureBefore = structuredClone(fixtures);
    freeze(state);
    const next = transition(state, {
      type: "reserve",
      exp: "E06",
      slot: "11:00",
    });
    expect(next.result.ok).toBe(true);
    expect(state).toEqual(before);
    expect(fixtures).toEqual(fixtureBefore);
    expect(next.state).not.toBe(state);
  });
  it("is deterministic under repeated Strict Mode reducer calculations", () => {
    const state = prepare("E06"),
      command = { type: "reserve", exp: "E06", slot: "11:00" } as const;
    expect(transition(state, command)).toEqual(transition(state, command));
    expect(transition(state, command).state.log).toHaveLength(1);
  });
  it("retains the failed-save draft without claiming it was saved", () => {
    const text =
      "The changed light direction affects the illustration; this is not a measured detector result.";
    const { state, result } = transition(start("E06"), {
      type: "save-note",
      exp: "E06",
      text,
      failSave: true,
    });
    expect(result.code).toBe("save-failed");
    expect(state.sessions.E06.note).toBe(text);
    expect(state.sessions.E06.noteSaved).toBeNull();
    expect(selectors.evidenceGaps(state, fixtures, "E06")).toContain(
      "The notebook claim has not been saved",
    );
  });
  it("retains a short claim for editing without creating a saved claim", () => {
    const next = transition(start("E01"), {
      type: "save-note",
      exp: "E01",
      text: "A draft.",
    });
    expect(next.result.code).toBe("too-short");
    expect(next.state.sessions.E01.note).toBe("A draft.");
    expect(next.state.sessions.E01.noteSaved).toBeNull();
  });
  it("retains pending acknowledgement and returns one stable receipt on retry", () => {
    const pending = transition(ready("E06"), {
      type: "submit",
      exp: "E06",
      dropAck: true,
    });
    expect(pending.result.code).toBe("no-ack");
    expect(pending.state.sessions.E06.ackPending).toBe(true);
    expect(pending.state.sessions.E06.receipt).toBeNull();
    const confirmed = transition(pending.state, { type: "submit", exp: "E06" });
    expect(confirmed.result.receipt).toBe("EX-SUB-2041");
    const retry = transition(confirmed.state, { type: "submit", exp: "E06" });
    expect(retry.result.repeated).toBe(true);
    expect(retry.state.log).toEqual(confirmed.state.log);
  });
  it("keeps edits separate from the last saved claim", () => {
    const state = apply(ready("E01"), {
      type: "draft-note",
      exp: "E01",
      text: "This changed draft is not the previously saved notebook revision.",
    });
    expect(state.sessions.E01.noteSaved).not.toBe(state.sessions.E01.note);
    expect(transition(state, { type: "submit", exp: "E01" }).result.code).toBe(
      "incomplete",
    );
  });
  it("keeps a submitted notebook frozen when the new draft action is invoked", () => {
    const submitted = apply(ready("E01"), { type: "submit", exp: "E01" });
    const next = transition(submitted, {
      type: "draft-note",
      exp: "E01",
      text: "An attempted post-submission change.",
    });
    expect(next.result.code).toBe("frozen");
    expect(next.state.sessions.E01).toEqual(submitted.sessions.E01);
  });
});

describe("complete kits and experiment parity", () => {
  it("refuses reservation before preparation", () =>
    expect(
      transition(initialState(), { type: "reserve", exp: "E06", slot: "11:00" })
        .result.code,
    ).toBe("not-prepared"));
  it("names the taken slot and compatible alternative without partial allocation", () => {
    const previous = prepare("E06");
    const next = transition(previous, {
      type: "reserve",
      exp: "E06",
      slot: "10:00",
    });
    expect(next.result.code).toBe("conflict");
    expect(next.result.alternative).toBe("11:00");
    expect(next.state).toEqual(previous);
  });
  it("holds the complete vision kit under the existing booking identity", () => {
    const state = apply(prepare("E06"), {
      type: "reserve",
      exp: "E06",
      slot: "11:00",
    });
    expect(selectors.myBooking(state, "E06")?.id).toBe("B-2041");
    expect(selectors.myBooking(state, "E06")?.resources).toEqual(
      selectors.kitResourceIds(fixtures, "KIT-C1-v1"),
    );
  });
  it("rejects a wrong station and accepts the existing cv2 normalization", () => {
    const state = apply(prepare("E06"), {
      type: "reserve",
      exp: "E06",
      slot: "11:00",
    });
    expect(
      transition(state, { type: "check-in", exp: "E06", station: "CV-03" })
        .result.code,
    ).toBe("wrong-station");
    expect(
      transition(state, { type: "check-in", exp: "E06", station: "cv2" }).state
        .sessions.E06.station,
    ).toBe("CV-02");
  });
  it("refuses incomplete equipment and distinguishes occupancy from availability", () => {
    let state = apply(prepare("E06"), {
      type: "reserve",
      exp: "E06",
      slot: "11:00",
    });
    state = apply(state, { type: "check-in", exp: "E06", station: "CV-02" });
    expect(transition(state, { type: "start", exp: "E06" }).result.code).toBe(
      "kit-incomplete",
    );
    expect(selectors.availability(state, "C1-CAM").state).toBe("bookable");
    expect(selectors.occupancy(state, fixtures, "C1-CAM").state).toBe("in-use");
  });
  it.each(["E06", "E01"] as const)(
    "submits and closes %s with original identities and quantities",
    (exp) => {
      let state = apply(ready(exp), { type: "submit", exp });
      expect(state.sessions[exp].receipt).toBe(experiments[exp].receipt);
      kits[experiments[exp].kit].portable.forEach((i) => {
        state = apply(state, {
          type: "return-item",
          exp,
          item: i.id,
          quantity: i.qty,
        });
      });
      const closed = transition(state, { type: "close", exp });
      expect(closed.result.ok).toBe(true);
      expect(closed.state.sessions[exp].closed).toBe(true);
      expect(
        selectors.occupancy(closed.state, fixtures, experiments[exp].station)
          .state,
      ).toBe("free");
    },
  );
  it("prevents overwriting captured evidence", () => {
    const state = ready("E06");
    const next = transition(state, {
      type: "capture",
      exp: "E06",
      evidence: "ILL-L1-v1",
    });
    expect(next.result.code).toBe("duplicate");
    expect(next.state.sessions.E06.captures).toEqual(
      state.sessions.E06.captures,
    );
  });
  it("uses the exact generated reference for rendered sample values", () => {
    expect(signalSamples(20)).toHaveLength(21);
    expect(signalSamples(3)).toHaveLength(4);
    for (const p of signalSamples(3))
      expect(p.value).toBeCloseTo(-Math.sin(2 * Math.PI * p.t), 12);
    expect(signalSamples(20)[5].value).toBeCloseTo(0, 12);
  });
});

describe("cross-role fault and recovery parity", () => {
  it("keeps recorded evidence when the example camera stops", () => {
    const original = apply(start("E06"), {
      type: "capture",
      exp: "E06",
      evidence: "ILL-L1-v1",
    });
    const stopped = apply(original, { type: "interrupt-camera" });
    expect(stopped.sessions.E06.captures).toEqual(
      original.sessions.E06.captures,
    );
    expect(
      transition(stopped, {
        type: "capture",
        exp: "E06",
        evidence: "ILL-L2-v1",
      }).result.code,
    ).toBe("camera-offline");
    const recovery = transition(stopped, {
      type: "capture",
      exp: "E06",
      evidence: "ILL-L2-v1",
      prepared: true,
    });
    expect(recovery.result.ok).toBe(true);
    expect(recovery.state.sessions.E06.usedPrepared).toBe(true);
  });
  it("scopes the restriction to C1-CAM and omits private data in notices", () => {
    const state = restrict();
    expect(state.resources["C1-CAM"].restriction).toBe("RST-0417");
    expect(state.resources["C1-L1"].restriction).toBeNull();
    expect(
      state.bookings
        .filter((b) => selectors.bookingImpact(state, b).affected)
        .map((b) => b.id),
    ).toContain("B-2047");
    expect(selectors.kitStatus(state, fixtures, "KIT-S1-v1").ok).toBe(true);
    const publicJSON = JSON.stringify(selectors.publicNotices(state));
    for (const privateValue of [
      "ISS-0417",
      "B-2041",
      "Example fault details",
      "reporter",
    ])
      expect(publicJSON).not.toContain(privateValue);
  });
  it("does not release a restriction after interrupted verification", () => {
    const state = apply(restrict(), {
      type: "repair",
      issue: fixtures.fault.issue,
      text: "Example repair under report conditions.",
    });
    const interrupted = transition(state, {
      type: "verify",
      issue: fixtures.fault.issue,
      outcome: "interrupted",
    });
    expect(interrupted.result.code).toBe("interrupted");
    expect(interrupted.state.issues[0].status).toBe(
      "Open: verification interrupted",
    );
    expect(
      transition(interrupted.state, {
        type: "release",
        issue: fixtures.fault.issue,
      }).result.code,
    ).toBe("not-verified");
    const verified = apply(interrupted.state, {
      type: "verify",
      issue: fixtures.fault.issue,
      outcome: "pass",
    });
    const released = transition(verified, {
      type: "release",
      issue: fixtures.fault.issue,
    });
    expect(released.result.ok).toBe(true);
    expect(released.state.resources["C1-CAM"].restriction).toBeNull();
  });
  it("restores missing equipment only through the recorded return follow-up", () => {
    const state = start("E06");
    expect(transition(state, { type: "close", exp: "E06" }).result.code).toBe(
      "return-incomplete",
    );
    const closed = apply(state, {
      type: "close",
      exp: "E06",
      withFollowUp: true,
    });
    expect(closed.sessions.E06.followUp).toBe("FU-2041");
    expect(selectors.availability(closed, "CAL-01").state).toBe("unknown");
    const located = apply(closed, { type: "locate", exp: "E06" });
    expect(located.sessions.E06.followUpClosed).toBe(true);
    expect(selectors.availability(located, "CAL-01").state).toBe("bookable");
  });
});

describe("isolated, versioned persistence", () => {
  it("round-trips the submitted state without writing the legacy key", () => {
    const records = new Map<string, string>([
      ["parallax-proto-state", "legacy untouched"],
    ]);
    const storage = {
      getItem: (key: string) => records.get(key) || null,
      setItem: (key: string, value: string) => {
        records.set(key, value);
      },
    };
    const state = apply(ready("E06"), { type: "submit", exp: "E06" });
    expect(writeState(storage, state)).toBeNull();
    expect(readState(storage).state).toEqual(state);
    expect(records.get("parallax-proto-state")).toBe("legacy untouched");
    expect(validState(state)).toBe(true);
  });
  it("retains incompatible saved records and reports recovery instead of silently replacing them", () => {
    const raw = JSON.stringify({ schemaVersion: 999, state: initialState() });
    let writes = 0;
    const storage = {
      getItem: () => raw,
      setItem: () => {
        writes++;
      },
    };
    expect(readState(storage).warning).toMatch(/incompatible/);
    expect(writes).toBe(0);
    expect(storage.getItem()).toBe(raw);
  });
  it("rejects malformed nested data before rendering", () => {
    const state = initialState();
    delete (state.sessions.E06 as Partial<typeof state.sessions.E06>).captures;
    expect(validState(state)).toBe(false);
  });
  it("reports unavailable and quota-limited storage without claiming a save", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(readState(storage).warning).toMatch(/could not be read/);
    expect(writeState(storage, initialState())).toMatch(/save failed/);
  });
  it("uses a separate schema key", () =>
    expect(REACT_STORAGE_KEY).not.toBe("parallax-proto-state"));
});
