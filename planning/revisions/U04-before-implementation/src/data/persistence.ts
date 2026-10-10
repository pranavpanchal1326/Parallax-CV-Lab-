import { initialState } from "../domain/adapter";
import type { LabState } from "../domain/types";
import { validSnapshot } from "../domain/conditions";
import { validWorkspace } from "../domain/workspace";

export const REACT_STORAGE_KEY = "parallax-react-state-v1";
export const SCHEMA_VERSION = 1;
export const RESET_RECOVERY_KEY = "parallax-react-last-reset";
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
  if (candidate.workspace !== undefined && !validWorkspace(candidate.workspace))
    return false;
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
        typeof session[k] !== "object" ||
        Array.isArray(session[k]) ||
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
          Object.values(c.settings).some((v) => typeof v !== "string"),
      )
    )
      return false;
  }
  for (const exp of ["E06", "E01"] as const) {
    if (
      candidate.sessions[exp].captures.some(
        (c) => c.context !== undefined && !validSnapshot(c.context, exp, c.id),
      )
    )
      return false;
  }
  if (
    candidate.bookings.some(
      (b) =>
        !b ||
        typeof b.id !== "string" ||
        typeof b.status !== "string" ||
        typeof b.slot !== "string" ||
        !Array.isArray(b.resources) ||
        b.resources.some((id) => !Object.hasOwn(baseline.resources, id)),
    )
  )
    return false;
  if (
    candidate.issues.some(
      (i) =>
        !i ||
        typeof i.id !== "string" ||
        !Object.hasOwn(baseline.resources, i.asset) ||
        typeof i.status !== "string" ||
        typeof i.symptom !== "string" ||
        typeof i.detail !== "string" ||
        typeof i.reporter !== "string" ||
        !Array.isArray(i.history) ||
        i.history.some(
          (h) =>
            !h ||
            typeof h.time !== "string" ||
            typeof h.actor !== "string" ||
            typeof h.text !== "string",
        ) ||
        [i.repair, i.verification].some(
          (r) =>
            r !== null &&
            (!r || typeof r.id !== "string" || typeof r.text !== "string"),
        ),
    )
  )
    return false;
  if (
    candidate.log.some(
      (l) =>
        !l ||
        typeof l.n !== "number" ||
        typeof l.action !== "string" ||
        typeof l.ref !== "string" ||
        typeof l.time !== "string" ||
        typeof l.actor !== "string" ||
        typeof l.reason !== "string",
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

export function retainBeforeReset(
  storage: StoragePort,
  current: LabState,
  stamp: string,
): string | null {
  try {
    const recovery = JSON.stringify({
      schemaVersion: SCHEMA_VERSION,
      state: current,
      retained: storage.getItem(REACT_STORAGE_KEY),
    });
    // Keep each explicit reset recoverable, including an incompatible saved record.
    storage.setItem(`parallax-react-recovery-${stamp}`, recovery);
    storage.setItem(RESET_RECOVERY_KEY, recovery);
    return null;
  } catch {
    return "Reset was not performed because a recovery copy could not be saved. Export this session and the retained record first; your current work is unchanged.";
  }
}
export function readRecovery(storage: StoragePort): LabState | null {
  try {
    const raw = storage.getItem(RESET_RECOVERY_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    return record.schemaVersion === SCHEMA_VERSION && validState(record.state)
      ? record.state
      : null;
  } catch {
    return null;
  }
}
