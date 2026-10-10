import fixture from "../../../../prototype/fixtures.json";
import type { ExperimentId } from "../domain/types";

export const fixtures = fixture;
export const experimentIds: ExperimentId[] = ["E06", "E01"];
export interface Experiment {
  title: string;
  strand: string;
  question: string;
  methodRevision: string;
  kit: string;
  station: string;
  booking: string;
  session: string;
  revision: string;
  request: string;
  receipt: string;
  prepare: string[];
  duration: string;
  evidenceKind: string;
  settings?: Record<string, string>;
  source?: {
    id: string;
    formula: string;
    frequencyHz: number;
    amplitudeV: number;
    durationS: number;
  };
  evidence: { id: string; label: string; detail?: string; rateHz?: number }[];
}
export const experiments = fixture.experiments as Record<
  ExperimentId,
  Experiment
>;
export interface KitItem {
  id: string;
  qty: number;
  name?: string;
  members?: string[];
}
export const kits = fixture.kits as Record<
  string,
  { name: string; fixed: KitItem[]; portable: KitItem[] }
>;
