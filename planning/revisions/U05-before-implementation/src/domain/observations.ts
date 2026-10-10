export type Metric = "temperature" | "co2" | "illuminance";
export type Scenario = "disconnected" | "unknown" | "fresh" | "delayed" | "invalid" | "offline";
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
  connection?: "connected-example" | "disconnected";
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
  unknown: "Connected example · reading missing",
  fresh: "Recent example readings",
  delayed: "Delayed example readings",
  invalid: "Invalid example readings",
  offline: "Disconnected example · last reading retained",
};
export function exampleTime(minute: number): string {
  return new Date(
    Date.parse("2026-10-01T00:00:00+05:30") + minute * 60_000,
  ).toISOString();
}
export function clockLabel(time: string, seconds = false): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" as const } : {}),
  }).format(new Date(time));
}
export function validObservation(value: unknown): value is Observation {
  if (!value || typeof value !== "object") return false;
  const o = value as Observation;
  const units = { temperature: "°C", co2: "ppm", illuminance: "lx" };
  if (
    !Object.hasOwn(units, o.metric) ||
    o.unit !== units[o.metric] ||
    o.origin !== "simulated" ||
    o.zone !== "C1"
  )
    return false;
  if (o.connection !== undefined && !["connected-example", "disconnected"].includes(o.connection)) return false;
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
  if (o.quality === "invalid")
    return { state: "invalid", label: "Invalid reading", ageSeconds: null };
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
  const missing = disconnected || scenario === "unknown";
  const age = scenario === "delayed" || scenario === "offline" ? 15 * 60_000 : 30_000;
  return (["temperature", "co2", "illuminance"] as Metric[]).map(
    (metric, index) => ({
      id: `SIM-C1-${metric}-01`,
      metric,
      value: missing ? null : [23.5, 640, 420][index],
      unit: ["°C", "ppm", "lx"][index] as Observation["unit"],
      origin: "simulated",
      zone: "C1",
      source: `Demo fixture · ${metric}`,
      observedAt: missing ? null : new Date(reference - age).toISOString(),
      receivedAt: missing ? null : new Date(reference - (scenario === "offline" ? age - 5_000 : 0)).toISOString(),
      connection: disconnected || scenario === "offline" ? "disconnected" : "connected-example",
      quality: missing
        ? "unavailable"
        : scenario === "invalid"
          ? "invalid"
          : "valid",
    }),
  );
}
