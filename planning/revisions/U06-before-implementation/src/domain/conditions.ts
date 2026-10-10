import geometry from "../../../../spatial/lab_geometry.json";
import { fixtures, experiments } from "../data/fixtures";
import {
  exampleTime,
  validObservation,
  observationStatus,
  clockLabel,
  metricNames,
  type Observation,
} from "./observations";
import type { Capture, ExperimentId, LabState } from "./types";

export interface SignalReference {
  id: string;
  frequencyHz: number;
  amplitudeV: number;
  durationS: number;
}
export interface ConditionSnapshot {
  schemaVersion: 1;
  experiment: ExperimentId;
  evidence: string;
  methodRevision: string;
  fixtureRevision: string;
  geometryRevision: string;
  recordedAt: string;
  condition: string;
  detail: string;
  evidenceOrigin: "illustrative" | "generated" | "prepared illustration";
  settings: Record<string, string>;
  observations: Observation[];
  reference: SignalReference | null;
  resources: { id: string; restriction: string | null; located: boolean }[];
}
export function makeSnapshot(
  state: LabState,
  exp: ExperimentId,
  capture: Capture,
  observations: Observation[],
): ConditionSnapshot {
  const experiment = experiments[exp];
  const evidence = experiment.evidence.find((e) => e.id === capture.id)!;
  const booking = state.bookings.find((b) => b.mine && b.exp === exp);
  return structuredClone({
    schemaVersion: 1,
    experiment: exp,
    evidence: capture.id,
    methodRevision: experiment.methodRevision,
    fixtureRevision: fixtures.revision,
    geometryRevision: geometry.meta.revision,
    recordedAt: exampleTime(state.minute),
    condition: capture.label,
    detail: evidence.detail || "",
    evidenceOrigin:
      exp === "E01"
        ? "generated"
        : capture.source.startsWith("Prepared")
          ? "prepared illustration"
          : "illustrative",
    settings: capture.settings,
    observations: observations.filter(validObservation),
    reference: experiment.source || null,
    resources: (booking?.resources || []).map((id) => ({
      id,
      ...state.resources[id],
    })),
  });
}
export function validSnapshot(
  value: unknown,
  exp: ExperimentId,
  evidenceId: string,
): value is ConditionSnapshot {
  if (!value || typeof value !== "object") return false;
  const s = value as ConditionSnapshot;
  if (
    s.schemaVersion !== 1 ||
    s.experiment !== exp ||
    s.evidence !== evidenceId
  )
    return false;
  for (const field of [
    "methodRevision",
    "fixtureRevision",
    "geometryRevision",
    "recordedAt",
    "condition",
    "detail",
  ] as const)
    if (typeof s[field] !== "string") return false;
  if (
    !Number.isFinite(Date.parse(s.recordedAt)) ||
    !["illustrative", "generated", "prepared illustration"].includes(
      s.evidenceOrigin,
    )
  )
    return false;
  if (
    !s.settings ||
    typeof s.settings !== "object" ||
    Array.isArray(s.settings) ||
    Object.values(s.settings).some((v) => typeof v !== "string")
  )
    return false;
  if (!Array.isArray(s.observations) || !s.observations.every(validObservation))
    return false;
  if (
    !Array.isArray(s.resources) ||
    s.resources.some(
      (r) =>
        !r ||
        typeof r.id !== "string" ||
        typeof r.located !== "boolean" ||
        !(r.restriction === null || typeof r.restriction === "string"),
    )
  )
    return false;
  if (
    s.reference !== null &&
    (!s.reference ||
      typeof s.reference.id !== "string" ||
      ![
        s.reference.frequencyHz,
        s.reference.amplitudeV,
        s.reference.durationS,
      ].every(Number.isFinite) ||
      s.reference.frequencyHz <= 0 ||
      s.reference.amplitudeV <= 0 ||
      s.reference.durationS <= 0)
  )
    return false;
  return true;
}

export interface Difference {
  field: string;
  a: string;
  b: string;
  changed: boolean;
  comparable: boolean;
}
export function recordedDifferences(a: Capture, b: Capture): Difference[] {
  const row = (field: string, first: string, second: string): Difference => ({
    field,
    a: first,
    b: second,
    changed: first !== second,
    comparable: first !== "Not recorded" && second !== "Not recorded",
  });
  const values = [
    row("Condition", a.label, b.label),
    row("Evidence source", a.source, b.source),
  ];
  const keys = [
    ...new Set([...Object.keys(a.settings), ...Object.keys(b.settings)]),
  ];
  keys.forEach((key) =>
    values.push(
      row(
        key,
        a.settings[key] ?? "Not recorded",
        b.settings[key] ?? "Not recorded",
      ),
    ),
  );
  values.push(
    row(
      "Method revision",
      a.context?.methodRevision ?? "Not recorded",
      b.context?.methodRevision ?? "Not recorded",
    ),
  );
  for (const field of [
    "fixtureRevision",
    "geometryRevision",
    "evidenceOrigin",
    "recordedAt",
  ] as const)
    values.push(
      row(
        field,
        a.context?.[field] ?? "Not recorded",
        b.context?.[field] ?? "Not recorded",
      ),
    );
  const reference = (capture: Capture) =>
    capture.context?.reference
      ? `${capture.context.reference.id} · ${capture.context.reference.frequencyHz} Hz · ${capture.context.reference.amplitudeV} V · ${capture.context.reference.durationS} s`
      : "Not recorded";
  values.push(row("Generated reference", reference(a), reference(b)));
  const resourceIds = [
    ...new Set([
      ...(a.context?.resources.map((r) => r.id) || []),
      ...(b.context?.resources.map((r) => r.id) || []),
    ]),
  ];
  for (const id of resourceIds) {
    const status = (capture: Capture) => {
      const r = capture.context?.resources.find((x) => x.id === id);
      return r
        ? `${r.restriction || "No restriction recorded"} · ${r.located ? "located" : "location unknown"}`
        : "Not recorded";
    };
    values.push(row(`Resource ${id}`, status(a), status(b)));
  }
  values.push(
    row(
      "Condition detail",
      a.context?.detail ?? "Not recorded",
      b.context?.detail ?? "Not recorded",
    ),
  );
  for (const metric of ["temperature", "co2", "illuminance"] as const) {
    const format = (capture: Capture) => {
      const o = capture.context?.observations.find((x) => x.metric === metric);
      return o?.value === null || !o
        ? "Not recorded"
        : `${o.value} ${o.unit} · ${o.quality} · simulated`;
    };
    values.push(row(metric, format(a), format(b)));
    const freshness = (capture: Capture) => {
      const o = capture.context?.observations.find((x) => x.metric === metric);
      if (!o || !capture.context) return "Not recorded";
      const status = observationStatus(o, capture.context.recordedAt);
      return `${status.label}${status.ageSeconds === null ? "" : ` · ${status.ageSeconds} seconds old at capture`}`;
    };
    const timestamp = (capture: Capture) => {
      const o = capture.context?.observations.find((x) => x.metric === metric);
      return o?.observedAt
        ? `${o.observedAt} · ${clockLabel(o.observedAt, true)} IST · ${o.id} · ${o.source}`
        : "Not recorded";
    };
    values.push(
      row(`${metricNames[metric]} freshness`, freshness(a), freshness(b)),
    );
    values.push(
      row(`${metricNames[metric]} observation`, timestamp(a), timestamp(b)),
    );
    const received = (capture: Capture) =>
      capture.context?.observations.find((x) => x.metric === metric)
        ?.receivedAt || "Not recorded";
    const connection = (capture: Capture) =>
      capture.context?.observations.find((x) => x.metric === metric)
        ?.connection || "Not recorded";
    values.push(
      row(`${metricNames[metric]} received`, received(a), received(b)),
      row(`${metricNames[metric]} connection`, connection(a), connection(b)),
    );
  }
  return values;
}
