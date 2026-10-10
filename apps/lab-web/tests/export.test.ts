import { afterEach, expect, it, vi } from "vitest";
import { downloadJson } from "../src/components/ExportFallback";

afterEach(() => {vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers();});
it("keeps the exact export in both the readable fallback and download without changing data", async () => {
  vi.useFakeTimers();
  const dispatchEvent = vi.fn(), click = vi.fn(), link = {href: "", download: "", click};
  vi.stubGlobal("window", {dispatchEvent});
  vi.stubGlobal("document", {createElement: () => link});
  let blob: Blob | undefined;
  vi.spyOn(URL, "createObjectURL").mockImplementation(value => {blob = value as Blob; return "blob:test-export";});
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const payload = '{"schemaVersion":1,"note":"Retained A: 3 Hz → −1 Hz","unknown":null}';
  downloadJson(payload, "retained.json");
  expect(dispatchEvent.mock.calls[0][0].detail).toEqual({text: payload, name: "retained.json"});
  expect(await blob!.text()).toBe(payload); expect(blob!.type).toBe("application/json");
  expect(link.download).toBe("retained.json"); expect(click).toHaveBeenCalledTimes(1);
  expect(revoke).not.toHaveBeenCalled(); vi.advanceTimersByTime(1000); expect(revoke).toHaveBeenCalledWith("blob:test-export");
});
