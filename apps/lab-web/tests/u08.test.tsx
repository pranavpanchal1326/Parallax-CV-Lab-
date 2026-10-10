import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { ArtStudio } from "../src/features/ArtStudio";
import {
  artPlates,
  physicalStudies,
  signStudies,
  studioReference,
  studioKit,
  studioGeometry,
  anchorRecord,
} from "../src/data/studio";
import {
  studioSamples,
  studioPlateSvg,
  studioSignSvg,
  studioPlanSvg,
} from "../../lab-shared/studio-graphics.mjs";
import { signalSamples } from "../src/components/ExperimentArt";

describe("U08 source-linked studio", () => {
  it("names the actual canonical signal source and interval", () => {
    expect(studioReference).toMatchObject({
      id: "REF-2HZ-v1",
      frequencyHz: 2,
      amplitudeV: 1,
      durationS: 1,
    });
    for (const kind of ["entrance", "pixel", "signal-story", "report"]) {
      expect(artPlates.find((p) => p.kind === kind)!.source).toContain(
        studioReference.id,
      );
    }
    expect(artPlates.find((p) => p.kind === "entrance")!.equivalent).toContain(
      "four samples over one second",
    );
  });
  it.each([3, 20])("keeps the existing scientific samples at %i Hz", (rate) => {
    const before = JSON.stringify(studioReference);
    const old = signalSamples(rate, studioReference),
      rows = studioSamples(studioReference, rate);
    expect(rows).toHaveLength(rate * studioReference.durationS + 1);
    rows.forEach((r, i) => {
      expect(r.t).toBe(old[i].t);
      expect(r.value).toBeCloseTo(old[i].value, 12);
      expect(r.display).toBeCloseTo((r.value + 1) / 2, 12);
      expect(r.display).toBeGreaterThanOrEqual(0);
      expect(r.display).toBeLessThanOrEqual(1);
    });
    expect(rows[0].display).toBe(0.5);
    expect(rows.at(-1)!.t).toBe(studioReference.durationS);
    expect(JSON.stringify(studioReference)).toBe(before);
  });
  it("keeps the signed alias through every low-rate sample", () => {
    const alias = 2 - 3 * Math.round(2 / 3);
    expect(alias).toBe(-1);
    studioSamples(studioReference, 3).forEach((r) =>
      expect(Math.sin(2 * Math.PI * alias * r.t)).toBeCloseTo(r.value, 12),
    );
    expect(studioPlateSvg("pixel", studioReference, studioKit)).toContain(
      "dashed gold: -1 Hz alias",
    );
  });
  it.each([0, 5, NaN, Infinity])("rejects unsupported rate %s", (rate) =>
    expect(() => studioSamples(studioReference, rate)).toThrow(),
  );
  it("rejects malformed and unbounded models", () => {
    for (const reference of [
      null,
      { ...studioReference, amplitudeV: 0 },
      { ...studioReference, frequencyHz: NaN },
      { ...studioReference, durationS: -1 },
      { ...studioReference, durationS: 300 },
    ])
      expect(() => studioSamples(reference, 3)).toThrow();
  });
  it("clamps a selected sample to the exported model endpoints", () => {
    expect(
      studioPlateSvg("pixel", studioReference, studioKit, 3, -2),
    ).toContain("Sample 0 / 3");
    expect(
      studioPlateSvg("pixel", studioReference, studioKit, 20, 500),
    ).toContain("Sample 20 / 20");
  });
  it("retains every complete capture kit identity, including both lights", () => {
    expect(studioKit).toEqual([
      "CV-02",
      "C1",
      "C1-CAM",
      "C1-L1",
      "C1-L2",
      "TRP-04",
      "CAL-01",
    ]);
    const plate = studioPlateSvg("equipment", studioReference, studioKit);
    studioKit.forEach((id) => expect(plate).toContain(id));
    expect(plate).not.toContain("LGT-01");
  });
  it("locates every physical/sign destination in preserved geometry", () => {
    [
      ...physicalStudies.flatMap((p) => p.anchors),
      ...signStudies.map((s) => s.anchor),
    ].forEach((id) => expect(anchorRecord(id), id).toBeDefined());
    expect(anchorRecord("invented")).toBeUndefined();
    expect(anchorRecord("W1")!.position).toBe("S wall · 4.4–6.2 m");
  });
  it("does not move geometry or draw unverified surveillance coverage", () => {
    const before = JSON.stringify(studioGeometry);
    const svg = studioPlanSvg(studioGeometry, "cctv");
    expect(svg).toContain("CCTV-1");
    expect(svg).toContain("CCTV-2");
    expect(svg).toContain("C1-CAM");
    expect(svg).toContain("no coverage cones drawn");
    physicalStudies.forEach((p) => studioPlanSvg(studioGeometry, p.layer));
    expect(JSON.stringify(studioGeometry)).toBe(before);
    expect(() => studioPlanSvg(studioGeometry, "guaranteed-safe")).toThrow();
  });
  it("keeps restriction signage limited to public equipment consequences", () => {
    const sign = studioSignSvg(signStudies.find((s) => s.id === "S-05")!);
    expect(sign).toContain("Capture kit unavailable");
    for (const privateTerm of [
      "student",
      "Pair A",
      "diagnostic note",
      "fault narrative",
      "handover",
    ])
      expect(sign).not.toContain(privateTerm);
  });
  it("escapes text in self-contained vector exports", () => {
    const sign = studioSignSvg({
      ...signStudies[0],
      title: '<script>alert("x")</script>&',
    });
    expect(sign).toContain("&lt;script&gt;");
    expect(sign).not.toContain("<script");
    artPlates.forEach((p) => {
      const svg = studioPlateSvg(p.kind, studioReference, studioKit);
      expect(svg).toContain("<title");
      expect(svg).toContain("<desc");
      expect(svg).not.toMatch(
        /<script|<foreignObject|<image|(?:src|href)="https?:\/\//,
      );
    });
  });
  it("renders independently of operational providers with every text boundary", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/studio?plate=ART-08"]}>
        <ArtStudio />
      </MemoryRouter>,
    );
    expect(html).toContain("Sample 0:");
    expect(html).toContain("No autoplay");
    expect(html).toContain("not calibrated luminance");
    expect(html).toContain("Before physical use");
    expect(html).toContain("Show text references only");
    expect(html).not.toContain("Reset React example");
  });
  it("falls back to a known plate for an unknown query", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/studio?plate=unknown"]}>
        <ArtStudio />
      </MemoryRouter>,
    );
    expect(html).toContain("ART-01 / From signal to understanding");
  });
});
