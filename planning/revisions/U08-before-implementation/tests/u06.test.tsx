import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import knowledge from "../../lab-shared/assistant-knowledge.json";
import { Assistant } from "../src/features/Assistant";
import { defaultReference, sampledAlias } from "../src/domain/rehearsal";
import { signalSamples } from "../src/components/ExperimentArt";

describe("U06 guide contract",()=>{
  const guide=knowledge.guides.find(g=>g.id==="E01" && g.state==="published")!;
  it("numeric guide facts match the preserved teaching calculations",()=>{
    const reference=defaultReference();
    expect(reference.frequencyHz).toBe(2);
    expect(sampledAlias(3,reference)).toMatchObject({frequencyHz:1, signedHz:-1});
    for (const [rate,count] of [[3,4],[8,9],[20,21]]) expect(signalSamples(rate,reference)).toHaveLength(count);
    expect(signalSamples(4,reference).every(s=>Math.abs(s.value)<1e-12)).toBe(true);
    expect(guide.sections.find(s=>s.id==="E01-boundary")?.text).toContain("zero within numerical precision");
  });
  it("unpublished guide revisions contain no body for the offline bundle",()=>{
    expect(knowledge.guides.filter(g=>g.state!=="published").every(g=>g.sections.length===0)).toBe(true);
  });
  it("the offline reader keeps published sources visible and generation unavailable",()=>{
    const html=renderToStaticMarkup(<MemoryRouter initialEntries={["/assistant?guide=E06"]}><Assistant/></MemoryRouter>);
    expect(html).toContain("Bundled offline copy");
    expect(html).toContain("prepared illustrations");
    expect(html).toContain("Browser evidence, notebook entries and private records are not included");
    expect(html).toContain("Readable without AI");
  });
});
