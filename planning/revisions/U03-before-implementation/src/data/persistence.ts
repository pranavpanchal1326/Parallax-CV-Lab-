import { initialState } from "../domain/adapter";
import type { LabState } from "../domain/types";
import { validSnapshot } from '../domain/conditions';

export const REACT_STORAGE_KEY = "parallax-react-state-v1";
export const SCHEMA_VERSION = 1;
export interface ReadResult {
  state: LabState;
  warning: string | null;
}
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

// Validate the fixed fixture shape without accepting arbitrary, executable or legacy records.
export function validState(value: unknown): value is LabState {
  if (!value || typeof value !== "object") return false;
  const baseline = initialState();
  const candidate = value as LabState;
  if (
    candidate.revision !== baseline.revision ||
    !Number.isFinite(candidate.minute)
  )
    return false;
  if (
    !Array.isArray(candidate.bookings) ||
    !Array.isArray(candidate.issues) ||
    !Array.isArray(candidate.log)
  )
    return false;
  if (!candidate.resources || !candidate.sessions || !candidate.prepared)
    return false;
  for (const key of Object.keys(baseline.resources)) {
    const r = candidate.resources[key];
    if (
      !r ||
      typeof r.located !== "boolean" ||
      !(r.restriction === null || typeof r.restriction === "string")
    )
      return false;
  }
  for (const exp of ["E06", "E01"] as const) {
    const session = candidate.sessions[exp];
    const prep = candidate.prepared[exp];
    if (
      !session ||
      !Array.isArray(prep) ||
      prep.length !== baseline.prepared[exp].length ||
      prep.some((x) => typeof x !== "boolean")
    )
      return false;
    for (const k of [
      "checkedIn",
      "started",
      "interrupted",
      "usedPrepared",
      "ackPending",
      "closed",
    ] as const)
      if (typeof session[k] !== "boolean") return false;
    if (
      typeof session.note !== "string" ||
      !(session.noteSaved === null || typeof session.noteSaved === "string")
    )
      return false;
    for (const k of ["station", "receipt", "followUp"] as const)
      if (!(session[k] === null || typeof session[k] === "string"))
        return false;
    for (const k of ["kit", "returned"] as const)
      if (
        !session[k] ||
        Object.values(session[k]).some((x) => !Number.isFinite(x) || x < 0)
      )
        return false;
    if (
      !Array.isArray(session.captures) ||
      session.captures.some(
        (c) =>
          !c ||
          typeof c.id !== "string" ||
          typeof c.label !== "string" ||
          typeof c.time !== "string" ||
          typeof c.source !== "string" ||
          !c.settings ||
          typeof c.settings !== "object" ||
          Array.isArray(c.settings) ||
          Object.values(c.settings).some(v => typeof v !== 'string'),
      )
    )
      return false;
  }
  for (const exp of ['E06', 'E01'] as const) {
    if (candidate.sessions[exp].captures.some(c => c.context !== undefined && !validSnapshot(c.context, exp, c.id))) return false;
  }
  if (
    candidate.bookings.some(
      (b) =>
        !b ||
        typeof b.id !== "string" ||
        typeof b.status !== "string" ||
        typeof b.slot !== "string" ||
        !Array.isArray(b.resources) ||
        b.resources.some((id) => !(id in baseline.resources)),
    )
  )
    return false;
  if (
    candidate.issues.some(
      (i) =>
        !i ||
        typeof i.id !== "string" ||
        !(i.asset in baseline.resources) ||
        typeof i.status !== "string" ||
        !Array.isArray(i.history),
    )
  )
    return false;
  if (
    candidate.log.some(
      (l) =>
        !l ||
        typeof l.n !== "number" ||
        typeof l.action !== "string" ||
        typeof l.ref !== "string",
    )
  )
    return false;
  return true;
}

export function readState(storage: StoragePort): ReadResult {
  try {
    const raw = storage.getItem(REACT_STORAGE_KEY);
    if (!raw) return { state: initialState(), warning: null };
    const record = JSON.parse(raw);
    if (record.schemaVersion === SCHEMA_VERSION && validState(record.state))
      return { state: record.state, warning: null };
    return {
      state: initialState(),
      warning:
        "The saved React record is incompatible. It has been retained; this session is temporary. Export the retained record before starting a new saved session.",
    };
  } catch {
    return {
      state: initialState(),
      warning:
        "Browser storage could not be read. This session remains in memory; your actions are not saved between visits.",
    };
  }
}

export function writeState(
  storage: StoragePort,
  state: LabState,
): string | null {
  try {
    storage.setItem(
      REACT_STORAGE_KEY,
      JSON.stringify({ schemaVersion: SCHEMA_VERSION, state }),
    );
    return null;
  } catch {
    return "Browser save failed. Your work is retained in this tab; keep it open or export a copy.";
  }
}
