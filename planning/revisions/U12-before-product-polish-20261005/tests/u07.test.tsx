import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { StateContext } from "../src/app/context";
import { initialState } from "../src/domain/adapter";
import { OperationsDesk } from "../src/features/OperationsDesk";
import {
  MemoryDeskRepository,
  createDeskState,
  fullManifest,
  publicDeskProjection,
  sessionApplicability,
  transitionDesk,
  validDeskState,
  type DeskCommand,
  type DeskState,
} from "../src/domain/operationsDesk";
import {
  operationsKey,
  readDesk,
  saveDesk,
} from "../src/data/operationsPersistence";

let serial = 0;
const id = () => `test-request-${++serial}`;
const booking = (
  extra: Partial<Extract<DeskCommand, { type: "reserve" }>> = {},
): Extract<DeskCommand, { type: "reserve" }> => ({
  id: id(),
  type: "reserve",
  experiment: "E06",
  day: "2026-10-06",
  start: 600,
  end: 660,
  policyVersion: 1,
  resourceRevision: 0,
  ...extra,
});
const memory = () => {
  const records = new Map<string, string>();
  return {
    records,
    getItem: (k: string) => records.get(k) ?? null,
    setItem: (k: string, v: string) => {
      records.set(k, v);
    },
  };
};
describe("U07 complete-kit repository", () => {
  it("simultaneous overlapping requests confirm only one complete allocation", async () => {
    const repo = new MemoryDeskRepository();
    const [a, b] = await Promise.all([
      repo.execute(booking(), "pairA"),
      repo.execute(booking(), "pairB"),
    ]);
    expect(a.code).toBe("confirmed");
    expect(b.code).toBe("conflict");
    const s = repo.snapshot();
    expect(s.allocations).toHaveLength(1);
    expect(s.allocations[0].resources).toEqual(fullManifest("E06"));
    expect(s.allocations[0].resources).toContain("C1-L1");
    expect(s.allocations[0].resources).toContain("C1-L2");
    expect(s.events).toHaveLength(1);
    expect(b.alternative).toEqual({ day: "2026-10-06", start: 660, end: 720 });
  });
  it("checks time intervals rather than matching start labels", async () => {
    const repo = new MemoryDeskRepository();
    await repo.execute(booking({ end: 720 }), "pairA");
    const b = await repo.execute(booking({ start: 660, end: 720 }), "pairB");
    expect(b.code).toBe("conflict");
    expect(b.alternative?.start).toBe(720);
  });
  it("adjacent intervals and separate days can both commit", async () => {
    const repo = new MemoryDeskRepository();
    expect((await repo.execute(booking(), "pairA")).ok).toBe(true);
    expect(
      (await repo.execute(booking({ start: 660, end: 720 }), "pairB")).ok,
    ).toBe(true);
    expect(
      (await repo.execute(booking({ day: "2026-10-07" }), "pairB")).ok,
    ).toBe(true);
    expect(repo.snapshot().allocations).toHaveLength(3);
  });
  it("the independent signal kit does not clash with capture", async () => {
    const repo = new MemoryDeskRepository();
    const results = await Promise.all([
      repo.execute(booking(), "pairA"),
      repo.execute(booking({ experiment: "E01" }), "pairB"),
    ]);
    expect(results.every((r) => r.ok)).toBe(true);
    expect(repo.snapshot().allocations).toHaveLength(2);
  });
  it("same request after lost delivery returns the same booking and event", async () => {
    const repo = new MemoryDeskRepository();
    const c = booking();
    const original = await repo.execute(c, "pairA");
    const repeated = await repo.execute(c, "pairA");
    expect(repeated.recordId).toBe(original.recordId);
    expect(repeated.repeated).toBe(true);
    expect(repo.lookup(c.id, "pairA")?.recordId).toBe(original.recordId);
    expect(repo.snapshot().events).toHaveLength(1);
  });
  it("request identity cannot be reused for changed content or another actor", async () => {
    const repo = new MemoryDeskRepository();
    const c = booking();
    await repo.execute(c, "pairA");
    expect(
      (await repo.execute({ ...c, start: 660, end: 720 }, "pairA")).code,
    ).toBe("request-conflict");
    expect((await repo.execute(c, "pairB")).code).toBe("request-conflict");
    expect(repo.lookup(c.id, "pairB")).toBeUndefined();
  });
  it("copies input and snapshots at the repository boundary", async () => {
    const repo = new MemoryDeskRepository();
    const c = booking();
    const promise = repo.execute(c, "pairA");
    c.start = 840;
    c.end = 900;
    await promise;
    expect(repo.snapshot().allocations[0].start).toBe(600);
    const copy = repo.snapshot();
    copy.allocations[0].resources.length = 0;
    expect(repo.snapshot().allocations[0].resources).toHaveLength(7);
  });
  it("an offline intention reconnects to current allocation rather than overwriting", async () => {
    const repo = new MemoryDeskRepository();
    const draft = booking();
    expect(repo.lookup(draft.id, "pairA")).toBeUndefined();
    await repo.execute(booking(), "pairB");
    expect((await repo.execute(draft, "pairA")).code).toBe("conflict");
    expect(repo.snapshot().allocations).toHaveLength(1);
  });
  it("current restriction version invalidates an older request; fresh request still respects restriction", async () => {
    const repo = new MemoryDeskRepository();
    const draft = booking();
    await repo.execute(
      {
        id: id(),
        type: "restrict-camera",
        expected: 0,
        reason: "Prepared camera fault needs verification",
      },
      "technician",
    );
    expect((await repo.execute(draft, "pairA")).code).toBe("stale-context");
    expect(
      (await repo.execute(booking({ resourceRevision: 1 }), "pairA")).code,
    ).toBe("restricted");
    expect(
      (
        await repo.execute(
          booking({ experiment: "E01", resourceRevision: 1 }),
          "pairA",
        )
      ).ok,
    ).toBe(true);
  });
  it("invalid dates, partial client manifests and arbitrary roles cannot enter a command", () => {
    const s = createDeskState();
    for (const c of [
      booking({ day: "2026-02-30" }),
      booking({ end: 600 }),
      booking({ start: 500, end: 560 }),
      { ...booking(), resources: ["C1-CAM"] },
      { ...booking(), role: "faculty" },
    ]) {
      const t = transitionDesk(s, c, "pairA");
      expect(t.result.code).toBe("invalid-command");
      expect(t.state).toBe(s);
    }
  });
  it("a rejected request has no allocation or committed event", async () => {
    const repo = new MemoryDeskRepository();
    await repo.execute(booking(), "faculty");
    expect(repo.snapshot().allocations).toHaveLength(0);
    expect(repo.snapshot().events).toHaveLength(0);
    expect(repo.snapshot().requests).toHaveLength(1);
  });
});
describe("U07 applicability, ownership and projection", () => {
  const withdraw = (
    s: DeskState,
    rule: "recorded-method" | "pause-for-review" = "pause-for-review",
  ) =>
    transitionDesk(
      s,
      {
        id: id(),
        type: "withdraw-method",
        experiment: "E06",
        expected: s.revision,
        existingSessions: rule,
        reason: "Prepared method needs faculty review",
      },
      "faculty",
    );
  it("withdrawal blocks new bookings while retaining exact existing evidence", () => {
    const before = createDeskState();
    const after = withdraw(before).state;
    expect(after.sessions).toEqual(before.sessions);
    expect(after.policies.E06.version).toBe(2);
    expect(
      transitionDesk(after, booking({ policyVersion: 2 }), "pairA").result.code,
    ).toBe("method-withdrawn");
    expect(sessionApplicability(after, after.sessions[0]).allowed).toBe(false);
    expect(sessionApplicability(after, after.sessions[0]).nextOwner).toBe(
      "Faculty method owner",
    );
  });
  it("explicit retained-method decision remains subordinate to equipment restriction", () => {
    const s = withdraw(createDeskState(), "recorded-method").state;
    expect(sessionApplicability(s, s.sessions[0]).allowed).toBe(true);
    const restricted = transitionDesk(
      s,
      {
        id: id(),
        type: "restrict-camera",
        expected: s.revision,
        reason: "Verification remains incomplete",
      },
      "technician",
    ).state;
    expect(
      sessionApplicability(restricted, restricted.sessions[0]).allowed,
    ).toBe(false);
    expect(restricted.sessions).toEqual(s.sessions);
  });
  it("a technician cannot withdraw methods and a student cannot publish or hand over staff records", () => {
    const s = createDeskState();
    expect(
      transitionDesk(
        s,
        {
          id: id(),
          type: "withdraw-method",
          experiment: "E06",
          expected: 0,
          existingSessions: "pause-for-review",
          reason: "Review the prepared method",
        },
        "technician",
      ).result.code,
    ).toBe("wrong-owner");
    expect(
      transitionDesk(
        s,
        {
          id: id(),
          type: "handover",
          expected: 0,
          owner: "technician",
          topic: "equipment",
          note: "Prepared fault needs verification",
          due: "Before capture",
        },
        "pairA",
      ).result.code,
    ).toBe("wrong-owner");
  });
  it("staff commands compare the record revision and retain the draft on a conflict", () => {
    const s = withdraw(createDeskState()).state;
    const t = transitionDesk(
      s,
      {
        id: id(),
        type: "handover",
        expected: 0,
        owner: "faculty",
        topic: "method",
        note: "Review the retained illustration method",
        due: "Before next class",
      },
      "faculty",
    );
    expect(t.result.code).toBe("stale-record");
    expect(t.state.handovers).toHaveLength(0);
  });
  it("handover needs a responsible next owner and explicit acceptance by that owner", async () => {
    const repo = new MemoryDeskRepository();
    const base = {
      id: id(),
      type: "handover" as const,
      expected: 0,
      owner: "technician" as const,
      topic: "equipment" as const,
      note: "Keep the camera restricted until verification",
      due: "Before next capture",
    };
    const result = await repo.execute(base, "faculty");
    expect(repo.snapshot().handovers[0].status).toBe("awaiting-acceptance");
    expect(
      (
        await repo.execute(
          {
            id: id(),
            type: "accept-handover",
            expected: 1,
            handoverId: result.recordId!,
          },
          "faculty",
        )
      ).code,
    ).toBe("wrong-owner");
    await repo.execute(
      {
        id: id(),
        type: "accept-handover",
        expected: 1,
        handoverId: result.recordId!,
      },
      "technician",
    );
    expect(repo.snapshot().handovers[0].status).toBe("accepted");
    expect(repo.snapshot().handovers[0].note).toBe(base.note);
  });
  it("a method handover cannot be assigned to the equipment owner", () => {
    expect(
      transitionDesk(
        createDeskState(),
        {
          id: id(),
          type: "handover",
          expected: 0,
          owner: "technician",
          topic: "method",
          note: "Review the outdated method",
          due: "Before class",
        },
        "faculty",
      ).result.code,
    ).toBe("wrong-next-owner");
  });
  it("public notices require a supporting condition and its owner", () => {
    const s = createDeskState();
    expect(
      transitionDesk(
        s,
        {
          id: id(),
          type: "publish-notice",
          expected: 0,
          kind: "method-review",
          experiment: "E06",
        },
        "faculty",
      ).result.code,
    ).toBe("unsupported-notice");
    expect(publicDeskProjection(s).notices).toHaveLength(0);
  });
  it("public projection omits private notes, identities, request IDs and evidence", () => {
    let s = withdraw(createDeskState()).state;
    s = transitionDesk(
      s,
      {
        id: id(),
        type: "handover",
        expected: s.revision,
        owner: "faculty",
        topic: "method",
        note: "PRIVATE-EXERCISE-DETAIL needs review",
        due: "Before class",
      },
      "faculty",
    ).state;
    s = transitionDesk(
      s,
      {
        id: id(),
        type: "publish-notice",
        expected: s.revision,
        kind: "method-review",
        experiment: "E06",
      },
      "faculty",
    ).state;
    const publicValue = JSON.stringify(publicDeskProjection(s));
    expect(publicValue).toContain("E06 method is under review");
    for (const secret of [
      "PRIVATE-EXERCISE-DETAIL",
      "OP-HANDOVER",
      "OP-SESSION",
      "OP-CAPTURE",
      "prepared example",
      "test-request",
    ])
      expect(publicValue).not.toContain(secret);
  });
  it("withdrawing a notice preserves history and the underlying condition", () => {
    let s = withdraw(createDeskState()).state;
    s = transitionDesk(
      s,
      {
        id: id(),
        type: "publish-notice",
        expected: s.revision,
        kind: "method-review",
        experiment: "E06",
      },
      "faculty",
    ).state;
    const n = s.notices[0];
    s = transitionDesk(
      s,
      {
        id: id(),
        type: "withdraw-notice",
        expected: s.revision,
        noticeId: n.id,
      },
      "faculty",
    ).state;
    expect(publicDeskProjection(s).notices).toHaveLength(0);
    expect(s.notices[0].state).toBe("withdrawn");
    expect(s.policies.E06.state).toBe("withdrawn");
    expect(s.events).toHaveLength(3);
  });
});
describe("U07 persistence and recovery", () => {
  it("blocked storage access still returns a usable in-memory exercise", () => {
    const loaded = readDesk(() => {
      throw new Error("Storage access denied");
    });
    expect(loaded.blocked).toBe(true);
    expect(loaded.raw).toBeNull();
    expect(loaded.state).toEqual(createDeskState());
    expect(loaded.warning).toContain("could not be read");
  });
  it("rapid same-revision saves preserve each prior raw record", () => {
    const port = memory();
    const first = saveDesk(port, createDeskState(), null);
    const rejected = transitionDesk(
      createDeskState(),
      booking(),
      "faculty",
    ).state;
    const second = saveDesk(port, rejected, first.raw);
    expect(second.ok).toBe(true);
    expect(saveDesk(port, createDeskState(), second.raw).ok).toBe(true);
    const archives = [...port.records.entries()].filter(([key]) =>
      key.startsWith(operationsKey + ":archive:"),
    );
    expect(archives).toHaveLength(2);
    expect(archives.map(([, value]) => value)).toEqual([first.raw, second.raw]);
  });
  it("only explicit save creates the separate exercise record", () => {
    const port = memory();
    expect(readDesk(port).raw).toBeNull();
    expect(port.records.size).toBe(0);
    expect(saveDesk(port, createDeskState(), null).ok).toBe(true);
    expect([...port.records.keys()]).toEqual([operationsKey]);
    expect(readDesk(port).blocked).toBe(false);
  });
  it("saved committed and rejected requests restore without a false revision-only equality", () => {
    const port = memory();
    const s = transitionDesk(createDeskState(), booking(), "faculty").state;
    expect(s.revision).toBe(0);
    expect(validDeskState(s)).toBe(true);
    expect(saveDesk(port, s, null).ok).toBe(true);
    expect(readDesk(port).state.requests).toHaveLength(1);
  });
  it("malformed stored text survives reading and is archived before explicit replacement", () => {
    const port = memory();
    port.setItem(operationsKey, "malformed-original");
    const loaded = readDesk(port);
    expect(loaded.blocked).toBe(true);
    expect(port.getItem(operationsKey)).toBe("malformed-original");
    expect(saveDesk(port, loaded.state, loaded.raw).ok).toBe(true);
    expect(
      [...port.records.entries()].some(
        ([k, v]) =>
          k.startsWith(operationsKey + ":archive:") &&
          v === "malformed-original",
      ),
    ).toBe(true);
  });
  it("competing saved raw values refuse overwrite", () => {
    const port = memory();
    const baseline = saveDesk(port, createDeskState(), null);
    port.setItem(operationsKey, "a competing raw version");
    expect(saveDesk(port, createDeskState(), baseline.raw).ok).toBe(false);
    expect(port.getItem(operationsKey)).toBe("a competing raw version");
  });
  it("failed archive blocks replacement of the previous record", () => {
    const port = memory();
    const saved = saveDesk(port, createDeskState(), null);
    const failing = {
      getItem: port.getItem,
      setItem: (key: string, value: string) => {
        if (key.includes(":archive:")) throw new Error("quota");
        port.setItem(key, value);
      },
    };
    const next = transitionDesk(createDeskState(), booking(), "pairA").state;
    expect(saveDesk(failing, next, saved.raw).ok).toBe(false);
    expect(port.getItem(operationsKey)).toBe(saved.raw);
  });
  it("maximum-length valid notes remain saveable", () => {
    const t = transitionDesk(
      createDeskState(),
      {
        id: id(),
        type: "handover",
        expected: 0,
        owner: "technician",
        topic: "equipment",
        note: "x".repeat(1500),
        due: "Before capture",
      },
      "faculty",
    );
    expect(t.result.ok).toBe(true);
    expect(validDeskState(t.state)).toBe(true);
  });
  it("corrupt allocations, duplicate overlap and changed evidence are rejected on load", () => {
    const s = transitionDesk(createDeskState(), booking(), "pairA").state;
    const partial = structuredClone(s);
    partial.allocations[0].resources = ["C1-CAM"];
    expect(validDeskState(partial)).toBe(false);
    const doubled = structuredClone(s);
    doubled.allocations.push({ ...doubled.allocations[0], id: "OTHER" });
    expect(validDeskState(doubled)).toBe(false);
    const altered = structuredClone(s);
    altered.sessions[0].captured[0].text = "Rewritten evidence";
    expect(validDeskState(altered)).toBe(false);
  });
  it("renders an explicit local boundary and the current primary state is not changed", () => {
    const s = initialState();
    const baseline = structuredClone(s);
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <StateContext.Provider
          value={{ state: s, result: null, command: null, sequence: 0 }}
        >
          <OperationsDesk />
        </StateContext.Provider>
      </MemoryRouter>,
    );
    expect(html).toContain("independent prepared ledger");
    expect(html).toContain("not authentication");
    expect(html).toContain("No shared repository is connected");
    expect(s).toEqual(baseline);
  });
});
