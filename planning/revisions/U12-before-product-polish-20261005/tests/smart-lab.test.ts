import { describe, expect, it } from "vitest";
import {
  exampleTime,
  freshnessSeconds,
  observationStatus,
  scenarioObservations,
  validObservation,
} from "../src/domain/observations";
import { energyGroups, previewStandby } from "../src/domain/energy";
import { initialState, transition } from "../src/domain/adapter";
import { fixtures, experiments, kits } from "../src/data/fixtures";
import { validState } from "../src/data/persistence";
import { recordedDifferences, validSnapshot } from "../src/domain/conditions";
import { signalSamples } from "../src/components/ExperimentArt";
import type { Command, ExperimentId, LabState } from "../src/domain/types";

function started(exp: ExperimentId) {
  let state = initialState();
  const apply = (command: Command) => {
    const next = transition(state, command);
    expect(next.result.ok).toBe(true);
    state = next.state;
  };
  experiments[exp].prepare.forEach((_, index) =>
    apply({ type: "prepare", exp, index, checked: true }),
  );
  apply({ type: "reserve", exp, slot: exp === "E06" ? "11:00" : "10:00" });
  apply({ type: "check-in", exp, station: experiments[exp].station });
  kits[experiments[exp].kit].portable.forEach((i) =>
    apply({ type: "kit-item", exp, item: i.id, quantity: i.qty }),
  );
  apply({ type: "start", exp });
  return state;
}

describe("observation provenance and freshness", () => {
  const at = exampleTime(660);
  it.each([
    ["disconnected", "unknown"],
    ["fresh", "fresh"],
    ["delayed", "stale"],
    ["invalid", "invalid"],
  ] as const)("%s stays %s", (scenario, expected) => {
    const observations = scenarioObservations(scenario, at);
    expect(observations.every(validObservation)).toBe(true);
    expect(observations.map((o) => observationStatus(o, at).state)).toEqual([
      expected,
      expected,
      expected,
    ]);
  });
  it("accepts an explicit zero without treating it as missing", () => {
    const o = { ...scenarioObservations("fresh", at)[2], value: 0 };
    expect(observationStatus(o, at).state).toBe("fresh");
  });
  it("rejects unit mismatches, nonfinite values and future/out-of-order timestamps", () => {
    const o = scenarioObservations("fresh", at)[0];
    expect(validObservation({ ...o, unit: "ppm" })).toBe(false);
    expect(validObservation({ ...o, value: NaN })).toBe(false);
    expect(
      observationStatus({ ...o, observedAt: exampleTime(661) }, at).state,
    ).toBe("invalid");
    expect(
      observationStatus({ ...o, receivedAt: exampleTime(661) }, at).state,
    ).toBe("invalid");
    expect(
      observationStatus({ ...o, receivedAt: exampleTime(650) }, at).state,
    ).toBe("invalid");
    expect(observationStatus(o, "not-a-time").state).toBe("invalid");
  });
  it("uses observation age, with a defined boundary and missing timestamps", () => {
    const o = scenarioObservations("fresh", at)[0];
    const boundary = new Date(
      Date.parse(at) - freshnessSeconds * 1000,
    ).toISOString();
    expect(observationStatus({ ...o, observedAt: boundary }, at).state).toBe(
      "fresh",
    );
    expect(
      observationStatus(
        { ...o, observedAt: new Date(Date.parse(boundary) - 1).toISOString() },
        at,
      ).state,
    ).toBe("stale");
    expect(observationStatus({ ...o, observedAt: null }, at).state).toBe(
      "unknown",
    );
  });
});

describe("immutable recorded conditions", () => {
  it("retains captured observations despite later changes and duplicate requests", () => {
    const start = started("E06");
    const observations = scenarioObservations(
      "fresh",
      exampleTime(start.minute),
    );
    const capture = transition(start, {
      type: "capture",
      exp: "E06",
      evidence: "ILL-L1-v1",
      observations,
    });
    const original = structuredClone(capture.state.sessions.E06.captures[0]);
    observations[0].value = 99;
    expect(capture.state.sessions.E06.captures[0]).toEqual(original);
    const retry = transition(capture.state, {
      type: "capture",
      exp: "E06",
      evidence: "ILL-L1-v1",
      observations,
    });
    expect(retry.result.code).toBe("duplicate");
    expect(retry.state.sessions.E06.captures[0]).toEqual(original);
    const interrupted = transition(capture.state, {
      type: "interrupt-camera",
    }).state;
    expect(interrupted.sessions.E06.captures[0]).toEqual(original);
    expect(start.sessions.E06.captures).toEqual([]);
  });
  it("keeps method/reference provenance and computes from a retained reference", () => {
    const state = transition(started("E01"), {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-03",
    }).state;
    const c = state.sessions.E01.captures[0];
    expect(c.context?.methodRevision).toBe(experiments.E01.methodRevision);
    expect(c.context?.fixtureRevision).toBe(fixtures.revision);
    expect(c.context?.reference?.id).toBe("REF-2HZ-v1");
    expect(validSnapshot(c.context, "E01", c.id)).toBe(true);
    expect(validState(state)).toBe(true);
    const revised = {
      id: "retained-example",
      frequencyHz: 1,
      amplitudeV: 2,
      durationS: 2,
    };
    expect(signalSamples(4, revised)).toHaveLength(9);
    expect(signalSamples(4, revised)[1].value).toBeCloseTo(2);
    expect(
      validSnapshot(
        { ...c.context, reference: { ...revised, amplitudeV: 0 } },
        "E01",
        c.id,
      ),
    ).toBe(false);
  });
  it("accepts older captures without silently inventing missing context", () => {
    const state = transition(started("E01"), {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-03",
    }).state;
    delete state.sessions.E01.captures[0].context;
    expect(validState(state)).toBe(true);
    expect(state.sessions.E01.captures[0].context).toBeUndefined();
    expect(
      recordedDifferences(
        state.sessions.E01.captures[0],
        state.sessions.E01.captures[0],
      ).find((r) => r.field === "Method revision")?.a,
    ).toBe("Not recorded");
  });
  it("rejects wrong experiment/evidence context and malformed persisted records", () => {
    const state = transition(started("E01"), {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-03",
    }).state;
    const context = state.sessions.E01.captures[0].context!;
    for (const invalid of [
      { ...context, evidence: "wrong" },
      { ...context, experiment: "E06" },
      { ...context, observations: [{}] },
      { ...context, resources: [{}] },
      { ...context, recordedAt: "invalid" },
    ]) {
      const malformed = structuredClone(state);
      malformed.sessions.E01.captures[0].context = invalid as typeof context;
      expect(validState(malformed)).toBe(false);
    }
  });
  it("distinguishes identical readings observed at different ages in the comparison", () => {
    const startedState = started("E01");
    const first = transition(startedState, {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-20",
      observations: scenarioObservations(
        "fresh",
        exampleTime(startedState.minute),
      ),
    }).state;
    const second = transition(first, {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-03",
      observations: scenarioObservations("delayed", exampleTime(first.minute)),
    }).state;
    const captures = second.sessions.E01.captures;
    const rows = recordedDifferences(captures[0], captures[1]);
    expect(rows.find((r) => r.field === "temperature")?.changed).toBe(false);
    expect(rows.find((r) => r.field === "Temperature freshness")?.changed).toBe(
      true,
    );
    expect(
      rows.find((r) => r.field === "Temperature observation")?.changed,
    ).toBe(true);
  });
  it("rejects malformed legacy labels/settings while retaining valid old captures", () => {
    const state = transition(started("E01"), {
      type: "capture",
      exp: "E01",
      evidence: "EX-RUN-03",
    }).state;
    delete state.sessions.E01.captures[0].context;
    expect(validState(state)).toBe(true);
    state.sessions.E01.captures[0].settings = {
      sampleRate: {},
    } as unknown as Record<string, string>;
    expect(validState(state)).toBe(false);
  });
});

describe("standby proposal boundaries", () => {
  const lighting = energyGroups.find((g) => g.id === "lighting")!;
  function empty() {
    const s = initialState();
    s.bookings = [];
    s.minute = 600;
    return s;
  }
  it("calculates an upper bound only when the group is available for review", () => {
    const state = empty(),
      before = structuredClone(state);
    expect(previewStandby(state, lighting, 15)).toEqual({
      eligible: true,
      reasons: [],
      maxAvoidedKWh: 0.03,
    });
    expect(state).toEqual(before);
    expect(previewStandby(state, lighting, 0).eligible).toBe(false);
    expect(previewStandby(state, lighting, 61).eligible).toBe(false);
  });
  it("protects essential services, unknown power and restricted equipment", () => {
    const state = empty();
    expect(previewStandby(state, energyGroups[3], 15).maxAvoidedKWh).toBeNull();
    expect(
      previewStandby(state, { ...lighting, nominalWatts: null }, 15).eligible,
    ).toBe(false);
    state.resources["C1-L1"].restriction = "RST-example";
    expect(previewStandby(state, lighting, 15).eligible).toBe(false);
  });
  it("protects a booking before it becomes occupied and an active session after the slot", () => {
    const state = empty();
    state.bookings.push({
      id: "B-energy",
      day: "Thu 1 Oct",
      slot: "10:10",
      resources: ["C1-L1"],
      who: "Example",
      status: "Confirmed",
    });
    expect(previewStandby(state, lighting, 15).reasons.join(" ")).toContain(
      "B-energy",
    );
    const active = started("E06");
    active.minute = 900;
    expect(previewStandby(active, lighting, 15).reasons.join(" ")).toContain(
      "active session",
    );
  });
  it("does not block a closed or nonoverlapping booking, and refuses unresolved times", () => {
    const state: LabState = empty();
    state.bookings.push({
      id: "B-later",
      day: "Thu 1 Oct",
      slot: "12:00",
      resources: ["C1-L1"],
      who: "Example",
      status: "Confirmed",
    });
    expect(previewStandby(state, lighting, 15).eligible).toBe(true);
    state.bookings[0].slot = "unresolved";
    expect(previewStandby(state, lighting, 15).eligible).toBe(false);
    state.bookings[0].status = "Closed";
    expect(previewStandby(state, lighting, 15).eligible).toBe(true);
  });
});
