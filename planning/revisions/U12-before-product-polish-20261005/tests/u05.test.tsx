import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { StateContext } from "../src/app/context";
import { signalSamples } from "../src/components/ExperimentArt";
import { recordedDifferences } from "../src/domain/conditions";
import { buildFaultStory, faultConsequences } from "../src/domain/faultStory";
import { initialState } from "../src/domain/adapter";
import {
  createRehearsalRun,
  defaultReference,
  sampledAlias,
  validRehearsalRun,
  validSignalReference,
} from "../src/domain/rehearsal";
import {
  readRehearsal,
  rehearsalKey,
  retainRehearsalBeforeReset,
  restorePreviousRehearsal,
  saveRehearsal,
} from "../src/data/rehearsalPersistence";
import { PublicConsequence } from "../src/features/FaultWalkthrough";
import { Rehearsal } from "../src/features/Rehearsal";

const stamp = "2026-10-03T05:00:00.123Z";
function run() {
  return {
    ...createRehearsalRun(
      "E01",
      3,
      "Expect ambiguous samples",
      defaultReference(),
      "Teaching fixture",
      stamp,
    ),
    reflection:
      "The alias fits these samples; it does not identify the original.",
  };
}
function storage() {
  const records = new Map<string, string>();
  return {
    records,
    getItem: (key: string) => records.get(key) ?? null,
    setItem: (key: string, value: string) => {
      records.set(key, value);
    },
    removeItem: (key: string) => {
      records.delete(key);
    },
  };
}

describe("U05 bounded scientific rehearsal", () => {
  it.each([3, 4, 8, 20])(
    "uses an alias with the same sample values at %s Hz",
    (rate) => {
      const reference = defaultReference(),
        alias = sampledAlias(rate, reference);
      for (const point of signalSamples(rate, reference))
        expect(point.value).toBeCloseTo(
          reference.amplitudeV *
            Math.sin(2 * Math.PI * alias.signedHz * point.t),
          10,
        );
      expect(alias.sampleCount).toBe(signalSamples(rate, reference).length);
    },
  );
  it("makes the exact Nyquist boundary explicit for the zero-phase reference", () => {
    expect(sampledAlias(4, defaultReference()).atBoundary).toBe(true);
    expect(signalSamples(4).every((p) => Math.abs(p.value) < 1e-12)).toBe(true);
    expect(sampledAlias(3, defaultReference()).frequencyHz).toBe(1);
    expect(sampledAlias(8, defaultReference()).aliased).toBe(false);
  });
  it("retains a changed reference and settings without consulting a later fixture", () => {
    const ref = {
        ...defaultReference(),
        frequencyHz: 1.5,
        amplitudeV: 2,
        durationS: 2,
      },
      settings = { exposure: "retained" };
    const recorded = createRehearsalRun(
      "E01",
      8,
      "Predict finer samples",
      ref,
      "Retained CAP",
      stamp,
      settings,
    );
    ref.frequencyHz = 9;
    settings.exposure = "changed";
    expect(recorded.reference?.frequencyHz).toBe(1.5);
    expect(recorded.heldSettings.exposure).toBe("retained");
    expect(sampledAlias(8, recorded.reference!).sampleCount).toBe(17);
    expect(validRehearsalRun(recorded, "E01")).toBe(true);
  });
  it("refuses missing predictions, unsupported choices and unsafe references", () => {
    expect(() =>
      createRehearsalRun("E01", 3, "  ", defaultReference(), "fixture", stamp),
    ).toThrow();
    expect(() => sampledAlias(7, defaultReference())).toThrow();
    for (const durationS of [0, NaN, Infinity, 31])
      expect(validSignalReference({ ...defaultReference(), durationS })).toBe(
        false,
      );
    expect(() =>
      createRehearsalRun("E06", 3, "Predict", null, "fixture", stamp),
    ).toThrow();
    expect(validRehearsalRun({ ...run(), heldSettings: { x: 2 } }, "E01")).toBe(
      false,
    );
    expect(validRehearsalRun(run(), "E06")).toBe(false);
  });
  it("records the E06 choice as an illustration without a computed signal reference", () => {
    const record = createRehearsalRun(
      "E06",
      "side",
      "Expect longer shadows",
      null,
      "Illustration",
      stamp,
      { camera: "fixed" },
    );
    expect(record.reference).toBeNull();
    expect(validRehearsalRun(record, "E06")).toBe(true);
    expect(record.reflection).toBe("");
  });
  it("accepts only bounded geometry fields and preserves held camera settings", () => {
    for (const field of [18, 40, 90]) {
      const record = createRehearsalRun(
        "E12",
        field,
        "Predict clipping",
        null,
        "P8-A / P4-D",
        stamp,
        { distance: "2.05 m" },
      );
      expect(validRehearsalRun(record, "E12")).toBe(true);
      const store = storage();
      expect(saveRehearsal(store, "E12", record, null).warning).toBeNull();
      expect(readRehearsal(store, "E12").run?.heldSettings.distance).toBe(
        "2.05 m",
      );
    }
    expect(() =>
      createRehearsalRun("E12", 150, "Predict", null, "model", stamp),
    ).toThrow();
    expect(validRehearsalRun({ ...run(), experiment: "E12" }, "E12")).toBe(
      false,
    );
  });
  it("refuses to substitute a current fixture for missing retained context", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/E01/rehearsal?from=missing"]}>
        <StateContext.Provider
          value={{
            state: initialState(),
            result: null,
            sequence: 0,
            command: null,
          }}
        >
          <Routes>
            <Route path="/:exp/rehearsal" element={<Rehearsal />} />
          </Routes>
        </StateContext.Provider>
      </MemoryRouter>,
    );
    expect(html).toContain("Retained context unavailable");
    expect(html).not.toContain("Generated 2 Hz");
  });
});

describe("U05 saved rehearsal isolation and recovery", () => {
  it("round-trips separately from operational records", () => {
    const store = storage(),
      record = run();
    store.setItem("parallax-react-session", "original");
    const saved = saveRehearsal(store, "E01", record, null);
    expect(saved.warning).toBeNull();
    expect(readRehearsal(store, "E01").run).toEqual(record);
    expect(store.getItem("parallax-react-session")).toBe("original");
    expect([...store.records.keys()]).toEqual([
      "parallax-react-session",
      rehearsalKey("E01"),
    ]);
  });
  it("refuses concurrent writes and preserves malformed saved data", () => {
    const store = storage();
    store.setItem(rehearsalKey("E01"), "not-json");
    expect(readRehearsal(store, "E01").warning).toBeTruthy();
    expect(saveRehearsal(store, "E01", run(), null).warning).toContain(
      "Another record",
    );
    expect(store.getItem(rehearsalKey("E01"))).toBe("not-json");
    store.setItem(rehearsalKey("E01"), JSON.stringify(run()));
    expect(saveRehearsal(store, "E01", run(), "old").warning).toBeTruthy();
  });
  it("retains raw records before reset and restores the previous run", () => {
    const store = storage(),
      first = JSON.stringify(run());
    store.setItem(rehearsalKey("E01"), first);
    expect(retainRehearsalBeforeReset(store, "E01", "one")).toBeNull();
    expect(store.getItem(rehearsalKey("E01"))).toBeNull();
    expect(store.getItem(`${rehearsalKey("E01")}:recovery:one`)).toBe(first);
    const second = JSON.stringify({ ...run(), parameter: 8 });
    store.setItem(rehearsalKey("E01"), second);
    expect(restorePreviousRehearsal(store, "E01", "two").run).toEqual(run());
    expect(store.getItem(`${rehearsalKey("E01")}:recovery:two`)).toBe(second);
    expect(store.getItem(rehearsalKey("E01"))).toBe(first);
  });
  it("refuses reset or restore when the backup cannot be written", () => {
    const store = storage(),
      raw = JSON.stringify(run());
    store.setItem(rehearsalKey("E01"), raw);
    store.setItem(`${rehearsalKey("E01")}:previous`, raw);
    const unavailable = {
      ...store,
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(retainRehearsalBeforeReset(unavailable, "E01", "no")).toBeTruthy();
    expect(
      restorePreviousRehearsal(unavailable, "E01", "no").warning,
    ).toBeTruthy();
    expect(saveRehearsal(unavailable, "E01", run(), raw).warning).toContain(
      "Saving is unavailable",
    );
    expect(store.getItem(rehearsalKey("E01"))).toBe(raw);
  });
});

describe("U05 committed fault consequences", () => {
  it("preserves restriction through repair, interrupted verification and premature release", () => {
    const frames = buildFaultStory();
    expect(frames).toHaveLength(10);
    for (const id of [
      "restricted",
      "repaired",
      "verification-interrupted",
      "release-refused",
      "verified",
    ])
      expect(
        frames.find((f) => f.id === id)!.state.resources["C1-CAM"].restriction,
      ).toBeTruthy();
    expect(
      frames.find((f) => f.id === "verification-interrupted")!.result.code,
    ).toBe("interrupted");
    expect(frames.find((f) => f.id === "release-refused")!.result.code).toBe(
      "not-verified",
    );
    expect(frames.at(-1)!.state.resources["C1-CAM"].restriction).toBeNull();
  });
  it("uses actual dependencies across later windows and leaves the signal kit separate", () => {
    const frames = buildFaultStory(),
      affected = faultConsequences(frames[4].state);
    expect(affected.captureKit.ok).toBe(false);
    expect(affected.signalKit.ok).toBe(true);
    for (const id of ["B-2047", "B-2049"])
      expect(affected.bookings.find((b) => b.id === id)?.affected).toBe(true);
    expect(affected.bookings.find((b) => b.id === "B-2048")?.affected).toBe(
      false,
    );
    expect(
      faultConsequences(frames.at(-1)!.state).bookings.every(
        (b) => !b.affected,
      ),
    ).toBe(true);
  });
  it("keeps retained evidence and independent snapshots throughout the story", () => {
    const operational = initialState(),
      before = structuredClone(operational),
      frames = buildFaultStory();
    for (const frame of frames)
      expect(frame.state.sessions.E06.captures).toEqual(
        frames[0].state.sessions.E06.captures,
      );
    frames[4].state.sessions.E06.captures[0].label = "Changed in one snapshot";
    expect(frames[0].state.sessions.E06.captures[0].label).not.toBe(
      "Changed in one snapshot",
    );
    expect(operational).toEqual(before);
  });
  it("projects only permitted public consequences", () => {
    const state = buildFaultStory()[4].state,
      html = renderToStaticMarkup(<PublicConsequence state={state} />);
    expect(html).toContain("C1-CAM");
    for (const privateValue of [
      "ISS-0417",
      "B-2047",
      "Authored rehearsal: example capture",
      state.issues[0].reporter,
      state.sessions.E06.captures[0].id,
    ])
      expect(html).not.toContain(privateValue);
    expect(
      faultConsequences(buildFaultStory().at(-1)!.state).notices,
    ).toHaveLength(0);
  });
});

describe("U05 condition comparison boundaries", () => {
  it("marks missing historical context as not comparable and leaves captures intact", () => {
    const capture = buildFaultStory()[0].state.sessions.E06.captures[0],
      legacy = structuredClone(capture),
      before = structuredClone(capture);
    delete legacy.context;
    const rows = recordedDifferences(capture, legacy);
    expect(rows.find((r) => r.field === "geometryRevision")?.comparable).toBe(
      false,
    );
    expect(
      rows.find((r) => r.field === "Generated reference")?.comparable,
    ).toBe(false);
    expect(capture).toEqual(before);
  });
  it("compares source, geometry and subsecond retained timestamps explicitly", () => {
    const capture = buildFaultStory()[0].state.sessions.E06.captures[0],
      changed = structuredClone(capture);
    changed.context!.geometryRevision = "different geometry";
    changed.context!.recordedAt = stamp;
    const rows = recordedDifferences(capture, changed);
    expect(rows.find((r) => r.field === "geometryRevision")?.changed).toBe(
      true,
    );
    expect(rows.find((r) => r.field === "recordedAt")?.b).toBe(stamp);
    expect(rows.find((r) => r.field === "fixtureRevision")?.comparable).toBe(
      true,
    );
  });
});
