import { experiments } from "../data/fixtures";
import type { SignalReference } from "./conditions";
import type { ExperimentId } from "./types";

export const rehearsalRates = [3, 4, 8, 20] as const;
export type LightPosition = "front" | "side";
export type RehearsalExperiment = ExperimentId | "E12";
export interface RehearsalRun {
  version: 1;
  experiment: RehearsalExperiment;
  prediction: string;
  reflection: string;
  parameter: number | LightPosition;
  reference: SignalReference | null;
  sourceLabel: string;
  runAt: string;
  heldSettings: Record<string, string>;
}

export function validSignalReference(value: unknown): value is SignalReference {
  if (!value || typeof value !== "object") return false;
  const r = value as SignalReference;
  return (
    typeof r.id === "string" &&
    r.id.length > 0 &&
    [r.frequencyHz, r.amplitudeV, r.durationS].every(
      (v) => Number.isFinite(v) && v > 0,
    ) &&
    r.durationS <= 30
  ); // Bound rendered sample counts for a local teaching rehearsal.
}

export function sampledAlias(rate: number, reference: SignalReference) {
  if (
    !rehearsalRates.includes(rate as (typeof rehearsalRates)[number]) ||
    !validSignalReference(reference)
  )
    throw new Error("Choose a supported rate and a usable retained reference.");
  const signedHz =
    reference.frequencyHz - rate * Math.round(reference.frequencyHz / rate);
  return {
    signedHz,
    frequencyHz: Math.abs(signedHz),
    sampleCount: Math.floor(rate * reference.durationS) + 1,
    atBoundary: Math.abs(rate - 2 * reference.frequencyHz) < 1e-9,
    aliased: Math.abs(signedHz) !== reference.frequencyHz,
  };
}

export function createRehearsalRun(
  experiment: RehearsalExperiment,
  parameter: number | LightPosition,
  prediction: string,
  reference: SignalReference | null,
  sourceLabel: string,
  runAt: string,
  heldSettings: Record<string, string> = {},
): RehearsalRun {
  if (!prediction.trim())
    throw new Error("Write a prediction before running the rehearsal.");
  if (!Number.isFinite(Date.parse(runAt)))
    throw new Error("A valid rehearsal timestamp is required.");
  if (experiment === "E01") sampledAlias(parameter as number, reference!);
  else if (experiment === "E12") {
    if (![18, 40, 90].includes(parameter as number))
      throw new Error("Choose a supported field of view.");
  } else if (
    experiment !== "E06" ||
    (parameter !== "front" && parameter !== "side")
  )
    throw new Error("Choose frontal or side light.");
  return structuredClone({
    version: 1,
    experiment,
    prediction: prediction.trim(),
    reflection: "",
    parameter,
    reference: experiment === "E01" ? reference : null,
    sourceLabel,
    runAt,
    heldSettings,
  });
}

export function validRehearsalRun(
  value: unknown,
  experiment: RehearsalExperiment,
): value is RehearsalRun {
  if (!value || typeof value !== "object") return false;
  const r = value as RehearsalRun;
  if (
    r.version !== 1 ||
    r.experiment !== experiment ||
    typeof r.prediction !== "string" ||
    !r.prediction.trim() ||
    typeof r.reflection !== "string" ||
    typeof r.sourceLabel !== "string" ||
    typeof r.runAt !== "string" ||
    !Number.isFinite(Date.parse(r.runAt)) ||
    !r.heldSettings ||
    typeof r.heldSettings !== "object" ||
    Array.isArray(r.heldSettings) ||
    Object.values(r.heldSettings).some((v) => typeof v !== "string")
  )
    return false;
  return experiment === "E01"
    ? validSignalReference(r.reference) &&
        rehearsalRates.includes(r.parameter as (typeof rehearsalRates)[number])
    : experiment === "E12"
      ? r.reference === null && [18, 40, 90].includes(r.parameter as number)
      : r.reference === null &&
        (r.parameter === "front" || r.parameter === "side");
}

export function defaultReference(): SignalReference {
  return structuredClone(experiments.E01.source!);
}
