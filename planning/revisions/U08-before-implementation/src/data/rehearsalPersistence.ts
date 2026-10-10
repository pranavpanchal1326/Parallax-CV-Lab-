import {
  validRehearsalRun,
  type RehearsalRun,
  type RehearsalExperiment,
} from "../domain/rehearsal";

export const rehearsalKey = (exp: RehearsalExperiment) =>
  `parallax-rehearsal-v1:${exp}`;
export function readRehearsal(
  storage: Pick<Storage, "getItem">,
  exp: RehearsalExperiment,
) {
  try {
    const raw = storage.getItem(rehearsalKey(exp));
    if (!raw) return { run: null, raw, warning: null };
    const parsed: unknown = JSON.parse(raw);
    if (!validRehearsalRun(parsed, exp))
      throw new Error("Unsupported rehearsal record");
    return { run: parsed, raw, warning: null };
  } catch {
    return {
      run: null,
      raw: null,
      warning:
        "The saved rehearsal could not be read. It is retained; export it or explicitly start a fresh rehearsal. Current work can continue in memory.",
    };
  }
}

export function saveRehearsal(
  storage: Pick<Storage, "getItem" | "setItem">,
  exp: RehearsalExperiment,
  run: RehearsalRun,
  expectedRaw: string | null,
) {
  if (!validRehearsalRun(run, exp))
    return {
      raw: expectedRaw,
      warning: "The rehearsal record is invalid and was not saved.",
    };
  try {
    if (storage.getItem(rehearsalKey(exp)) !== expectedRaw)
      return {
        raw: expectedRaw,
        warning:
          "Another record exists or another tab changed this rehearsal. Your current work is retained in memory; export it before reloading or start fresh with a retained backup.",
      };
    const raw = JSON.stringify(run);
    storage.setItem(rehearsalKey(exp), raw);
    return { raw, warning: null };
  } catch {
    return {
      raw: expectedRaw,
      warning:
        "Saving is unavailable. Your rehearsal remains in memory; export it before leaving this page.",
    };
  }
}

export function retainRehearsalBeforeReset(
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">,
  exp: RehearsalExperiment,
  backupId: string,
) {
  try {
    const raw = storage.getItem(rehearsalKey(exp));
    if (raw !== null) {
      storage.setItem(`${rehearsalKey(exp)}:recovery:${backupId}`, raw);
      storage.setItem(`${rehearsalKey(exp)}:previous`, raw);
    }
    storage.removeItem(rehearsalKey(exp));
    return null;
  } catch {
    return "A recovery copy could not be saved. The stored rehearsal was not intentionally cleared; export your current work before starting fresh.";
  }
}

export function restorePreviousRehearsal(
  storage: Pick<Storage, "getItem" | "setItem">,
  exp: RehearsalExperiment,
  backupId: string,
) {
  try {
    const previous = storage.getItem(`${rehearsalKey(exp)}:previous`);
    if (!previous || !validRehearsalRun(JSON.parse(previous), exp))
      return {
        run: null,
        raw: null,
        warning:
          "No usable previous saved rehearsal is available. Any raw recovery record remains available for export.",
      };
    const current = storage.getItem(rehearsalKey(exp));
    if (current !== null)
      storage.setItem(`${rehearsalKey(exp)}:recovery:${backupId}`, current);
    storage.setItem(rehearsalKey(exp), previous);
    return {
      run: JSON.parse(previous) as RehearsalRun,
      raw: previous,
      warning: null,
    };
  } catch {
    return {
      run: null,
      raw: null,
      warning:
        "Restore failed. Current work remains in memory; export it before leaving.",
    };
  }
}
