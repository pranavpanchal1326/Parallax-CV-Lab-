export type Metric = "temperature" | "co2" | "illuminance";
export type Scenario = "disconnected" | "fresh" | "delayed" | "invalid";
export interface Observation {
  id: string;
  metric: Metric;
  value: number | null;
  unit: "°C" | "ppm" | "lx";
  origin: "simulated";
  zone: "C1";
  source: string;
  observedAt: string | null;
  receivedAt: string | null;
  quality: "valid" | "invalid" | "unavailable";
}
export type ObservationState = "fresh" | "stale" | "invalid" | "unknown";
export const freshnessSeconds = 300; // Demonstration policy only, not an institutional threshold.
export const metricNames: Record<Metric, string> = {
  temperature: "Temperature",
  co2: "CO₂",
  illuminance: "Illuminance",
};
export const scenarioNames: Record<Scenario, string> = {
  disconnected: "No connected source",
  fresh: "Recent example readings",
  delayed: "Delayed example readings",
  invalid: "Invalid example readings",
};
export function exampleTime(minute: number): string {
  return new Date(
    Date.parse("2026-10-01T00:00:00+05:30") + minute * 60_000,
  ).toISOString();
}
export function clockLabel(time: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(time));
}
export function validObservation(value: unknown): value is Observation {
  if (!value || typeof value !== "object") return false;
  const o = value as Observation;
  const units = { temperature: "°C", co2: "ppm", illuminance: "lx" };
  if (
    !(o.metric in units) ||
    o.unit !== units[o.metric] ||
    o.origin !== "simulated" ||
    o.zone !== "C1"
  )
    return false;
  if (
    typeof o.id !== "string" ||
    typeof o.source !== "string" ||
    !["valid", "invalid", "unavailable"].includes(o.quality)
  )
    return false;
  if (
    !(
      o.value === null ||
      (typeof o.value === "number" && Number.isFinite(o.value))
    )
  )
    return false;
  for (const key of ["observedAt", "receivedAt"] as const)
    if (
      !(
        o[key] === null ||
        (typeof o[key] === "string" && Number.isFinite(Date.parse(o[key]!)))
      )
    )
      return false;
  return true;
}
export function observationStatus(
  o: Observation,
  evaluatedAt: string,
): { state: ObservationState; label: string; ageSeconds: number | null } {
  if (!validObservation(o))
    return { state: "invalid", label: "Invalid record", ageSeconds: null };
  if (
    o.value === null ||
    o.quality === "unavailable" ||
    !o.observedAt ||
    !o.receivedAt
  )
    return { state: "unknown", label: "No reading", ageSeconds: null };
  const observed = Date.parse(o.observedAt),
    received = Date.parse(o.receivedAt),
    at = Date.parse(evaluatedAt);
  const ageSeconds = (at - observed) / 1000;
  if (
    !Number.isFinite(at) ||
    o.quality === "invalid" ||
    observed > received ||
    received > at ||
    ageSeconds < 0
  )
    return { state: "invalid", label: "Invalid reading", ageSeconds: null };
  return ageSeconds > freshnessSeconds
    ? { state: "stale", label: "Stale example", ageSeconds }
    : { state: "fresh", label: "Recent example", ageSeconds };
}
export function scenarioObservations(
  scenario: Scenario,
  evaluatedAt: string,
): Observation[] {
  const reference = Date.parse(evaluatedAt);
  const disconnected = scenario === "disconnected";
  const age = scenario === "delayed" ? 15 * 60_000 : 30_000;
  return (["temperature", "co2", "illuminance"] as Metric[]).map(
    (metric, index) => ({
      id: `SIM-C1-${metric}-01`,
      metric,
      value: disconnected ? null : [23.5, 640, 420][index],
      unit: ["°C", "ppm", "lx"][index] as Observation["unit"],
      origin: "simulated",
      zone: "C1",
      source: `Demo fixture · ${metric}`,
      observedAt: disconnected ? null : new Date(reference - age).toISOString(),
      receivedAt: disconnected ? null : evaluatedAt,
      quality: disconnected
        ? "unavailable"
        : scenario === "invalid"
          ? "invalid"
          : "valid",
    }),
  );
}
