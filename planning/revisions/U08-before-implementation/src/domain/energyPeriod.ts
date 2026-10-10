import { energyGroups } from "./energy";
import { exampleTime } from "./observations";

// Each value is an authored average over one bounded interval, not a meter reading.
export interface PowerInterval {
  start: string;
  end: string;
  watts: number | null;
  quality: "valid" | "invalid" | "missing";
}
export function exampleEnergyPeriod(group: string, minutes: number, gaps: boolean): PowerInterval[] {
  const watts = energyGroups.find(g => g.id === group)?.nominalWatts ?? null;
  return [0, 1, 2, 3].map(index => ({
    start: exampleTime(600 + index * minutes / 4),
    end: exampleTime(600 + (index + 1) * minutes / 4),
    watts: watts === null || (gaps && index === 1) ? null : watts * [0.8, 0.75, 0.9, 1][index],
    quality: watts === null || (gaps && index === 1) ? "missing" : "valid",
  }));
}
export function summarizeEnergy(intervals: PowerInterval[], start: string, end: string) {
  const from = Date.parse(start), to = Date.parse(end);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) throw new Error("Invalid energy period");
  let knownMs = 0, knownKWh = 0, previousEnd = from;
  for (const interval of intervals) {
    const a = Date.parse(interval.start), b = Date.parse(interval.end);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a || a < previousEnd || a < from || b > to)
      throw new Error("Energy intervals must be ordered, nonoverlapping and inside the review period");
    previousEnd = b;
    if (interval.quality !== "valid" || interval.watts === null || !Number.isFinite(interval.watts) || interval.watts < 0) continue;
    knownMs += b - a;
    knownKWh += interval.watts * (b - a) / 3_600_000 / 1000;
  }
  return {
    knownKWh: knownMs ? knownKWh : null,
    coveredMinutes: knownMs / 60_000,
    periodMinutes: (to - from) / 60_000,
    complete: knownMs === to - from,
  };
}
