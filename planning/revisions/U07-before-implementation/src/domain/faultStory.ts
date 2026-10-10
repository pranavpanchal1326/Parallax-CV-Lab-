import { fixtures, experiments, kits } from "../data/fixtures";
import { initialState, selectors, transition } from "./adapter";
import type { Command, DomainResult, LabState } from "./types";

export interface FaultFrame {
  id: string;
  title: string;
  owner: string;
  explanation: string;
  next: string;
  state: LabState;
  result: DomainResult;
}

// The story uses the production transition rules on an independent authored fixture.
// No operational dispatch, storage writer or real device action is available here.
export function buildFaultStory(): FaultFrame[] {
  let state = initialState();
  const commit = (command: Command) => {
    const update = transition(state, command);
    state = update.state;
    return update.result;
  };
  const prepare = experiments.E06.prepare.map(
    (_, index): Command => ({
      type: "prepare",
      exp: "E06",
      index,
      checked: true,
    }),
  );
  const setup: Command[] = [
    ...prepare,
    { type: "reserve", exp: "E06", slot: "11:00" },
    { type: "check-in", exp: "E06", station: experiments.E06.station },
    ...kits[experiments.E06.kit].portable.map(
      (i): Command => ({
        type: "kit-item",
        exp: "E06",
        item: i.id,
        quantity: i.qty,
      }),
    ),
    { type: "start", exp: "E06" },
    { type: "capture", exp: "E06", evidence: "ILL-L1-v1" },
  ];
  for (const command of setup) {
    const result = commit(command);
    if (!result.ok)
      throw new Error(`Fault story setup failed: ${result.message}`);
  }
  const frames: FaultFrame[] = [
    {
      id: "ready",
      title: "Before interruption",
      owner: "Student",
      explanation:
        "E06 has a complete kit and one retained illustrative condition. This independent authored session is ready for the fault rehearsal.",
      next: "Observe the camera-feed interruption.",
      state: structuredClone(state),
      result: { ok: true },
    },
  ];
  const stages: {
    id: string;
    title: string;
    owner: string;
    explanation: string;
    next: string;
    command: Command;
    expected: string | true;
  }[] = [
    {
      id: "interrupted",
      title: "Feed interrupted",
      owner: "Student",
      explanation:
        "Acquisition stops; the retained condition remains. A feed interruption alone does not create a technician restriction or a public notice.",
      next: "Report the named camera and recorded symptom.",
      command: { type: "interrupt-camera" },
      expected: true,
    },
    {
      id: "reported",
      title: "Report created",
      owner: "Technician",
      explanation:
        "ISS-0417 records a symptom for C1-CAM. Reporting alone does not declare a diagnosis or restrict the kit.",
      next: "Classify what the reported fault puts at risk.",
      command: {
        type: "report",
        asset: "C1-CAM",
        symptom: fixtures.fault.symptoms[0],
        detail:
          "Authored rehearsal: example capture feed interrupted; existing evidence retained.",
      },
      expected: true,
    },
    {
      id: "classified",
      title: "Risk classified",
      owner: "Technician",
      explanation:
        "A restricting classification identifies which camera-dependent bookings would be affected. A classification and an applied restriction are separate actions.",
      next: "Apply the scoped camera restriction.",
      command: {
        type: "triage",
        issue: fixtures.fault.issue,
        classification: fixtures.fault.classifications.find((c) => c.restrict)!
          .id,
      },
      expected: true,
    },
    {
      id: "restricted",
      title: "Restriction propagated",
      owner: "Technician + faculty",
      explanation:
        "Only C1-CAM is restricted. The complete capture kit and its bookings become unavailable; the S1 signal kit and B-2048 stay separate. The public display receives only the permitted consequence.",
      next: "Investigate and record the example repair; faculty reviews affected rotations.",
      command: { type: "restrict", issue: fixtures.fault.issue },
      expected: true,
    },
    {
      id: "repaired",
      title: "Repair recorded",
      owner: "Technician",
      explanation:
        "A repair record describes the intervention. It is not a verification and cannot clear the restriction.",
      next: "Attempt verification under the report conditions.",
      command: {
        type: "repair",
        issue: fixtures.fault.issue,
        text: fixtures.fault.repairText,
      },
      expected: true,
    },
    {
      id: "verification-interrupted",
      title: "Verification interrupted",
      owner: "Technician",
      explanation:
        "Verification remains unresolved. The useful failure record is retained; the issue, camera restriction and booking consequences remain.",
      next: "Review why an early release must be refused.",
      command: {
        type: "verify",
        issue: fixtures.fault.issue,
        outcome: "interrupted",
      },
      expected: "interrupted",
    },
    {
      id: "release-refused",
      title: "Early release refused",
      owner: "Technician",
      explanation:
        "The same release rule used in the technician console refuses to clear a restricted asset without recorded verification.",
      next: "Complete and record verification before release.",
      command: { type: "release", issue: fixtures.fault.issue },
      expected: "not-verified",
    },
    {
      id: "verified",
      title: "Verification recorded",
      owner: "Technician",
      explanation:
        "The authored verification pass is recorded. The restriction still needs an explicit release action; no device or facility has been tested by this rehearsal.",
      next: "Release the verified restriction and close the issue.",
      command: { type: "verify", issue: fixtures.fault.issue, outcome: "pass" },
      expected: true,
    },
    {
      id: "released",
      title: "Released after verification",
      owner: "Student + faculty",
      explanation:
        "Release restores the eligible bookings and clears the public restriction notice. Existing evidence and the technician history remain; bookings are not moved automatically.",
      next: "Compare the restored projections or return to your task.",
      command: { type: "release", issue: fixtures.fault.issue },
      expected: true,
    },
  ];
  for (const stage of stages) {
    const result = commit(stage.command);
    if (stage.expected === true ? !result.ok : result.code !== stage.expected)
      throw new Error(`Fault story stage failed: ${stage.id}`);
    frames.push({ ...stage, state: structuredClone(state), result });
  }
  return frames;
}

export function faultConsequences(state: LabState) {
  return {
    camera: selectors.availability(state, "C1-CAM"),
    occupancy: selectors.occupancy(state, fixtures, "C1-CAM"),
    captureKit: selectors.kitStatus(state, fixtures, "KIT-C1-v1"),
    signalKit: selectors.kitStatus(state, fixtures, "KIT-S1-v1"),
    bookings: state.bookings.map((b) => ({
      id: b.id,
      day: b.day,
      slot: b.slot,
      ...selectors.bookingImpact(state, b),
    })),
    notices: selectors.publicNotices(state),
  };
}
