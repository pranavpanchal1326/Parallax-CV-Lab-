import * as legacy from "../../../../prototype/store.js";
import { fixtures } from "../data/fixtures";
import { makeSnapshot } from "./conditions";
import { workspaceTransition } from "./workspace";
import type { Booking, Command, DomainResult, Issue, LabState } from "./types";

export const selectors = {
  ...legacy,
  myBooking: (state: LabState, exp: string): Booking | undefined =>
    legacy.myBooking(state, exp),
  openIssue: (state: LabState): Issue | undefined => legacy.openIssue(state),
  publicNotices: (state: LabState): { asset: string; text: string }[] =>
    legacy.publicNotices(state, fixtures),
};
export const initialState = (): LabState =>
  structuredClone(legacy.createState(fixtures)) as unknown as LabState;

// Legacy rules own this draft; React-owned input remains untouched, including on error.
export function transition(
  previous: LabState,
  command: Command,
): { state: LabState; result: DomainResult } {
  const state = structuredClone(previous);
  if (
    [
      "workspace-draft",
      "attendance-correct",
      "review-draft",
      "evidence-arrived",
      "feedback-publish",
      "asset-move",
      "calibration-view",
      "calibration-record",
      "report-defer",
      "report-delivered",
    ].includes(command.type)
  ) {
    return {
      state,
      result: workspaceTransition(
        state,
        command as import("./workspace").WorkspaceCommand,
      ),
    };
  }
  // Submitted evidence and claims form one frozen revision, even through direct commands.
  if (
    (command.type === "capture" || command.type === "save-note") &&
    state.sessions[command.exp].receipt
  ) {
    return {
      state,
      result: {
        ok: false,
        code: "frozen",
        message:
          "The submitted revision is frozen. Its evidence and notebook cannot be replaced.",
      },
    };
  }
  if ("issue" in command) {
    const issue = state.issues.find((i) => i.id === command.issue);
    if (issue?.status === "Closed" && command.type !== "release")
      return {
        state,
        result: {
          ok: false,
          code: "closed",
          message:
            "This issue is closed; its repair and verification history are retained.",
        },
      };
    if (command.type === "repair" && issue?.repair)
      return {
        state,
        result: {
          ok: false,
          code: "recorded",
          message:
            "The repair record already exists. Continue to verification; the original repair is retained.",
        },
      };
  }
  if (
    command.type === "report" &&
    state.issues.some(
      (i) => i.id === fixtures.fault.issue && i.status === "Closed",
    )
  )
    return {
      state,
      result: {
        ok: false,
        code: "scenario-complete",
        message:
          "This example fault scenario is complete. Its history is retained; start a fresh example to repeat it.",
      },
    };
  let result: DomainResult;
  switch (command.type) {
    case "prepare":
      result = legacy.setPrepared(
        state,
        fixtures,
        command.exp,
        command.index,
        command.checked,
      );
      break;
    case "reserve":
      result = legacy.reserve(state, fixtures, command.exp, command.slot);
      break;
    case "check-in":
      result = legacy.checkIn(state, fixtures, command.exp, command.station);
      break;
    case "kit-item":
      result = legacy.verifyKitItem(
        state,
        fixtures,
        command.exp,
        command.item,
        command.quantity,
      );
      break;
    case "return-item":
      result = legacy.returnItem(
        state,
        fixtures,
        command.exp,
        command.item,
        command.quantity,
      );
      break;
    case "start":
      result = legacy.startSession(state, fixtures, command.exp);
      break;
    case "capture":
      result = legacy.capture(state, fixtures, command.exp, command.evidence, {
        prepared: !!command.prepared,
      });
      if (result.ok) {
        const capture = state.sessions[command.exp].captures.find(
          (c) => c.id === command.evidence,
        )!;
        capture.context = makeSnapshot(
          state,
          command.exp,
          capture,
          command.observations || [],
        );
      }
      break;
    case "save-note":
      result = legacy.saveNote(state, fixtures, command.exp, command.text, {
        failSave: !!command.failSave,
      });
      break;
    case "draft-note":
      if (state.sessions[command.exp].receipt)
        result = {
          ok: false,
          code: "frozen",
          message:
            "The submitted revision is frozen. Its notebook claim cannot be edited.",
        };
      else {
        state.sessions[command.exp].note = command.text;
        result = { ok: true };
      }
      break;
    case "submit":
      result = legacy.submit(state, fixtures, command.exp, {
        dropAck: !!command.dropAck,
      });
      break;
    case "close":
      result = legacy.closeSession(state, fixtures, command.exp, {
        withFollowUp: !!command.withFollowUp,
      });
      break;
    case "interrupt-camera":
      result = legacy.interruptCamera(state);
      break;
    case "report":
      result = legacy.reportIssue(state, fixtures, command);
      if (result.ok && state.workspace) state.workspace.pendingReport = false;
      break;
    case "triage":
      result = legacy.triage(
        state,
        fixtures,
        command.issue,
        command.classification,
      );
      break;
    case "restrict":
      result = legacy.applyRestriction(state, fixtures, command.issue);
      break;
    case "repair":
      result = legacy.recordRepair(
        state,
        fixtures,
        command.issue,
        command.text,
      );
      break;
    case "verify":
      result = legacy.verify(state, fixtures, command.issue, command.outcome);
      break;
    case "release":
      result = legacy.release(state, fixtures, command.issue);
      break;
    case "locate":
      result = legacy.locateItem(state, fixtures, command.exp);
      break;
    default:
      result = {
        ok: false,
        code: "unknown-command",
        message: "This action is not supported.",
      };
  }
  return { state, result };
}
