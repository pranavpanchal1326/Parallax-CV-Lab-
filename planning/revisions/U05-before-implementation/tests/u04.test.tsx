import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Dashboard, ObservationPanel } from "../src/features/SmartLab";
import { MemoryRouter } from "react-router";
import { StateContext } from "../src/app/context";
import { EnvironmentContext } from "../src/app/environmentContext";
import { exampleTime, observationStatus, scenarioObservations, validObservation } from "../src/domain/observations";
import { exampleEnergyPeriod, summarizeEnergy } from "../src/domain/energyPeriod";
import { energyGroups, previewStandby } from "../src/domain/energy";
import { initialState } from "../src/domain/adapter";

describe("U04 observation failure and recovery", () => {
  const at = exampleTime(600);
  it("distinguishes missing connected readings from no connected source in rendered content", () => {
    const unknown = renderToStaticMarkup(<ObservationPanel observations={scenarioObservations("unknown", at)} evaluatedAt={at} />);
    const disconnected = renderToStaticMarkup(<ObservationPanel observations={scenarioObservations("disconnected", at)} evaluatedAt={at} />);
    expect(unknown).toContain("Source connected in example only");
    expect(disconnected).toContain("Source disconnected");
    expect(unknown).toContain("Reading unavailable");
    expect(disconnected).not.toContain("Recent example");
  });
  it("retains stale offline records and recovers with a new source observation", () => {
    const offline = scenarioObservations("offline", at), retained = structuredClone(offline);
    expect(offline.every(validObservation)).toBe(true);
    expect(observationStatus(offline[0], at).state).toBe("stale");
    expect(offline[0].connection).toBe("disconnected");
    expect(offline[0].receivedAt).not.toBe(at);
    expect(observationStatus(scenarioObservations("fresh", at)[0], at).state).toBe("fresh");
    expect(offline).toEqual(retained);
  });
  it("a retained recent source becomes stale when the review clock advances", () => {
    const record = scenarioObservations("fresh", at)[0], time = record.observedAt;
    expect(observationStatus(record, exampleTime(606)).state).toBe("stale");
    expect(record.observedAt).toBe(time);
    expect(observationStatus({ ...record, quality: "invalid", value: null }, at).state).toBe("invalid");
  });
});

describe("U04 period energy accounting", () => {
  const start = exampleTime(600), end = exampleTime(660);
  it("integrates watts over valid bounded intervals without filling gaps", () => {
    const gapped = summarizeEnergy(exampleEnergyPeriod("lighting", 60, true), start, end);
    expect(gapped.knownKWh).toBeCloseTo(0.081);
    expect(gapped.coveredMinutes).toBe(45);
    expect(gapped.complete).toBe(false);
    const full = summarizeEnergy(exampleEnergyPeriod("lighting", 60, false), start, end);
    expect(full.knownKWh).toBeCloseTo(0.1035);
    expect(full.complete).toBe(true);
    expect(summarizeEnergy(exampleEnergyPeriod("protected", 60, false), start, end).knownKWh).toBeNull();
  });
  it("zero is known, absent and invalid intervals leave period energy unknown", () => {
    const intervals = [{ start, end, watts: 0, quality: "valid" as const }];
    expect(summarizeEnergy(intervals, start, end).knownKWh).toBe(0);
    expect(summarizeEnergy([{ ...intervals[0], quality: "invalid" }], start, end).complete).toBe(false);
    expect(summarizeEnergy([], start, end).knownKWh).toBeNull();
    expect(summarizeEnergy([{ ...intervals[0], watts: NaN }], start, end).knownKWh).toBeNull();
  });
  it("refuses overlapping, reversed and out-of-period intervals instead of double counting", () => {
    const intervals = exampleEnergyPeriod("lighting", 60, false);
    expect(() => summarizeEnergy([...intervals, intervals[0]], start, end)).toThrow();
    expect(() => summarizeEnergy(intervals, end, start)).toThrow();
    expect(() => summarizeEnergy([{ ...intervals[0], start: exampleTime(599) }], start, end)).toThrow();
    expect(() => summarizeEnergy([{ ...intervals[0], end: "invalid" }], start, end)).toThrow();
  });
  it("shorter modelled periods have proportionally less energy and unchanged coverage", () => {
    const short = summarizeEnergy(exampleEnergyPeriod("computing", 30, true), start, exampleTime(630));
    const long = summarizeEnergy(exampleEnergyPeriod("computing", 60, true), start, end);
    expect(short.knownKWh).toBeCloseTo(long.knownKWh! / 2);
    expect(short.coveredMinutes / short.periodMinutes).toBe(0.75);
  });
});

it("standby refuses unverified mapping, invalid power and malformed booking times without mutating records", () => {
  const state = initialState(); state.bookings = []; state.minute = 600;
  const before = structuredClone(state), group = energyGroups[0];
  expect(previewStandby(state, { ...group, resources: [] }, 15).eligible).toBe(false);
  expect(previewStandby(state, { ...group, resources: ["unmapped"] }, 15).eligible).toBe(false);
  for (const nominalWatts of [-1, NaN, Infinity]) expect(previewStandby(state, { ...group, nominalWatts }, 15).eligible).toBe(false);
  expect(state).toEqual(before);
  state.bookings.push({ id: "B-invalid-time", day: "Thu 1 Oct", slot: "25:99", resources: group.resources, status: "Confirmed", who: "Example" });
  expect(previewStandby(state, group, 15).eligible).toBe(false);
});

it("dashboard exposes today's reservation and unavailable context without inferring headcount", () => {
  const state = initialState();
  const html = renderToStaticMarkup(<MemoryRouter><StateContext.Provider value={{ state, result: null, sequence: 0, command: null }}><EnvironmentContext.Provider value={{ scenario: "disconnected", setScenario: () => {}, refresh: () => {}, observations: scenarioObservations("disconnected", exampleTime(state.minute)) }}><Dashboard /></EnvironmentContext.Provider></StateContext.Provider></MemoryRouter>);
  expect(html).toContain("B-2040");
  expect(html).toContain("Reservation-derived, not a sensor headcount");
  expect(html).toContain("Environmental context is unavailable or unreliable");
  expect(html).toContain("Period total unknown");
});
