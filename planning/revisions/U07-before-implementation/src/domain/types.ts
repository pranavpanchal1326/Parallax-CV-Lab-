import type { ConditionSnapshot } from "./conditions";
import type { Observation } from "./observations";
import type { Workspace, WorkspaceCommand } from "./workspace";
export type ExperimentId = "E06" | "E01";
export interface Booking {
  id: string;
  mine?: boolean;
  exp?: ExperimentId;
  who: string;
  day: string;
  slot: string;
  kit?: string;
  resources: string[];
  status: string;
  label?: string;
}
export interface Capture {
  id: string;
  label: string;
  time: string;
  settings: Record<string, string>;
  source: string;
  context?: ConditionSnapshot;
}
export interface Session {
  checkedIn: boolean;
  station: string | null;
  kit: Record<string, number>;
  started: boolean;
  interrupted: boolean;
  usedPrepared: boolean;
  captures: Capture[];
  note: string;
  noteSaved: string | null;
  ackPending: boolean;
  receipt: string | null;
  returned: Record<string, number>;
  closed: boolean;
  followUp: string | null;
  followUpClosed?: boolean;
}
export interface Issue {
  id: string;
  asset: string;
  symptom: string;
  detail: string;
  reporter: string;
  booking: string | null;
  status: string;
  classification: string | null;
  restriction: string | null;
  repair: { id: string; text: string } | null;
  verification: { id: string; text: string } | null;
  history: { time: string; actor: string; text: string }[];
}
export interface LabState {
  workspace?: Workspace;
  revision: string;
  minute: number;
  prepared: Record<ExperimentId, boolean[]>;
  resources: Record<string, { restriction: string | null; located: boolean }>;
  bookings: Booking[];
  sessions: Record<ExperimentId, Session>;
  issues: Issue[];
  log: {
    n: number;
    time: string;
    actor: string;
    action: string;
    ref: string;
    reason: string;
  }[];
}
export interface DomainResult {
  ok: boolean;
  code?: string;
  message?: string;
  alternative?: string | null;
  booking?: string;
  receipt?: string;
  repeated?: boolean;
  gaps?: string[];
}
export type Command =
  | WorkspaceCommand
  | { type: "prepare"; exp: ExperimentId; index: number; checked: boolean }
  | { type: "reserve"; exp: ExperimentId; slot: string }
  | { type: "check-in"; exp: ExperimentId; station: string }
  | {
      type: "kit-item" | "return-item";
      exp: ExperimentId;
      item: string;
      quantity: number;
    }
  | { type: "start" | "locate"; exp: ExperimentId }
  | {
      type: "capture";
      exp: ExperimentId;
      evidence: string;
      prepared?: boolean;
      observations?: Observation[];
    }
  | { type: "save-note"; exp: ExperimentId; text: string; failSave?: boolean }
  | { type: "draft-note"; exp: ExperimentId; text: string }
  | { type: "submit"; exp: ExperimentId; dropAck?: boolean }
  | { type: "close"; exp: ExperimentId; withFollowUp?: boolean }
  | { type: "interrupt-camera" }
  | { type: "report"; asset: string; symptom: string; detail: string }
  | { type: "triage"; issue: string; classification: string }
  | { type: "restrict" | "release"; issue: string }
  | { type: "repair"; issue: string; text: string }
  | { type: "verify"; issue: string; outcome: "pass" | "interrupted" };
