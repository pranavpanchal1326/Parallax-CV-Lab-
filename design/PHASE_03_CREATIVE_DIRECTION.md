# Phase 3 — Creative Direction

Date: 2 October 2026, Asia/Calcutta.
Status: three studies built and critiqued; **Direction v1 "Atlas+" recommended**, pending team critique and five-second tests (M7) before freezing (G05.15).
Figma: https://www.figma.com/design/QaLr3W9rzW1WGhkDeHx9WF — page `Phase 3 · Creative Direction`.

## Method

- Three studies on identical content (D05): E06 lighting experiment, booking B-2041, fault ISS-118, captures C1–C7.
- Six frames per study (18 total): P01 entry · P06 booking · P06 failure state (camera restricted) · P12 workbench · P14 results · P31 mobile companion.
- One shared layout skeleton (G02.04); studies differ only in tokens, type, radius and identity artwork.
- All colours are variables in `PH3 · Study tokens`, one mode per study (Atlas, Theatre, Manuscript) plus `Atlas+`.
- Limit: no users have tested the studies. Scores are designer judgement plus measured contrast.

## The studies

| Study | Concept | Type (display · UI · data) | Radius | Identity artwork |
|---|---|---|---|---|
| A Perception Atlas | Ivory pages, ultramarine action, isometric architecture | Familjen Grotesk · DM Sans · JetBrains Mono | 4 | Isometric 10 × 7 m cutaway with zone IDs |
| B Optical Theatre | Dark capture stage, luminous framing | Sora · Inter · Geist Mono | 10 | Field-of-view cone and corner brackets |
| C Signal Manuscript | Scholarly notebook, serif and hairlines | Newsreader · Manrope · IBM Plex Mono | 0 | Annotated sampled waveform with footnotes |

## Measured contrast (WCAG 2.2, computed from token values)

| Pair | Atlas | Theatre | Manuscript |
|---|---:|---:|---:|
| ink / bg | 13.92 | 16.80 | 16.49 |
| ink2 / bg | 6.04 | 8.50 | 7.33 |
| ink3 / surface | 4.97 | 5.61 | 5.52 |
| onAccent / accent | 7.10 | 10.67 | 5.33 |
| accent / bg | 6.29 | 12.69 | 5.10 |
| danger / dangerSoft | 5.30 | 5.68 | 5.66 |
| warn / warnSoft | 4.85 | 7.84 | 5.09 |
| ok / okSoft | **4.43 ✗** | 7.88 | 5.32 |
| instInk / instBg | 15.83 | 17.75 | 14.94 |
| accent ↔ instBg (detection labels) | **2.48 ✗** | 13.41 | **3.16 ✗** |
| warn ↔ instBg (missed markers) | **2.97 ✗** | 12.07 | **2.73 ✗** |

## Weighted critique (designer judgement, 1–5)

| Criterion | Weight | Atlas | Theatre | Manuscript |
|---|---:|---:|---:|---:|
| Task comprehension | 3 | 5 | 4 | 4 |
| Accessibility (measured + semantic) | 3 | 4 | 4 | 3 |
| Relevance to a physical–digital lab | 2 | 5 | 4 | 3 |
| Originality | 2 | 3 | 4 | 5 |
| Extends to signage, plan and 3D | 2 | 5 | 3 | 3 |
| Production effort (5 = easiest) | 1 | 4 | 4 | 3 |
| **Total (of 65)** | | **57** | **50** | **46** |

## Findings

- F1 Atlas: brand blue fails on dark instrument viewers (2.48, 2.97). Fixable with instrument tokens.
- F2 Manuscript: red accent collides with danger red; selection, detections and the primary CTA read as errors on P06, P14, P31. Structural.
- F3 Theatre: every pair passes; dark UI is a poor fit for booking, long reading and lit-room signage.
- F4 Atlas: success text 4.43:1 — one step darker green reaches 4.99:1.
- F5 All: the shared skeleton carried three characters; identity can live in tokens (de-risks Phase 5).
- F6 Atlas: the isometric cutaway doubles as Lab Map, signage key and 3D blockout reference.

## Decision — Direction v1 "Atlas+"

- Keep (Atlas): light UI surfaces, ultramarine actions, Familjen Grotesk / DM Sans / JetBrains Mono, isometric spatial identity, radius 4, underline navigation.
- Borrow (Theatre): dark instrument surfaces; `instAccent` #6EE7C5 (11.64:1 on instBg), `instWarn` #F2C14E (10.48:1); field-of-view language for Scene Studio.
- Borrow (Manuscript): Newsreader italic for editorial moments only (brief intros, case studies, pull quotes); numbered evidence notes.
- Reject: red brand accent; dark theme as global UI; decorative motifs on dense operational screens.
- Fixes in mode `Atlas+`: ok → #1C7148 (4.99:1); instAccent and instWarn as above. Proven on P12 and P14 in section "Direction v1".

## Showcase (Sheet 3C)

Presentation board for Direction v1: P12 in a laptop frame and P31 in a phone frame, a strip of P01, P06 failure and P14, the live Atlas+ colour tokens with hex values, type specimens and four principles. These are presentation copies; source frames stay in the "Direction v1 — Atlas+" section.

## Before freezing (Phase 3 exit)

- [ ] Team critique of the 18 frames using the six criteria.
- [ ] Five-second tests (M7): can participants name the next action on P06 and P12 in each study?
- [x] Extend Atlas+ to P01, P06, P06 failure and P31 frames — done 2 Oct 2026; all 12 audited pairs pass AA (lowest 4.85:1), no residual brand-accent paints in instrument viewers.
- [ ] Record the sign-off date and freeze tokens (G05.15).
