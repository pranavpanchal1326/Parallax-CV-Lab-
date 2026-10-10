import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StateContext } from "../src/app/context";
import { initialState, transition } from "../src/domain/adapter";
import { WallDisplay } from "../src/features/Operations";
import { fixtures } from "../src/data/fixtures";

it("public display renders only the allowed notices even when private session, issue and faculty records exist", () => {
  let s = initialState();
  s.sessions.E06.note = "PRIVATE_STUDENT_CLAIM";
  s = transition(s, {
    type: "report",
    asset: "C1-CAM",
    symptom: fixtures.fault.symptoms[0],
    detail: "PRIVATE_REPAIR_DETAIL",
  }).state;
  s = transition(s, {
    type: "triage",
    issue: fixtures.fault.issue,
    classification: fixtures.fault.classifications.find((c) => c.restrict)!.id,
  }).state;
  s = transition(s, { type: "restrict", issue: fixtures.fault.issue }).state;
  s = transition(s, {
    type: "workspace-draft",
    key: "attendance-reason",
    value: "PRIVATE_ATTENDANCE_REASON",
  }).state;
  s = transition(s, {
    type: "review-draft",
    revision: "EVID-E06-r03",
    criterion: 0,
    comment: "PRIVATE_FACULTY_REVIEW",
  }).state;
  const html = renderToStaticMarkup(
    <StateContext.Provider
      value={{ state: s, result: null, sequence: 0, command: null }}
    >
      <WallDisplay />
    </StateContext.Provider>,
  );
  expect(html).toContain("C1-CAM");
  expect(html).toContain("cannot be booked for now");
  for (const secret of [
    "PRIVATE_STUDENT_CLAIM",
    "PRIVATE_REPAIR_DETAIL",
    "PRIVATE_ATTENDANCE_REASON",
    "PRIVATE_FACULTY_REVIEW",
    "ISS-0417",
    "ATT-0712",
    "STU-0147",
    "B-2047",
  ])
    expect(html).not.toContain(secret);
});
