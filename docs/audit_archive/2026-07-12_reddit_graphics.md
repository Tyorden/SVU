# 2026-07-12_reddit_graphics

Agent final report, extracted from session transcript agent-a3d8ac0f342842616.jsonl (archived alongside as .raw.jsonl).

---

All done. Everything was rendered, visually inspected (two rounds — first pass caught footer overflow, a doubled 0.0% label, and two annotation collisions, all fixed), and cross-checked against `docs/svu_paper_stats_v2.md`. Nothing was committed.

## Files (all in /Users/tylerorden/Desktop/SVU/graphics/)

| File | Dimensions | Size |
|---|---|---|
| the_retreat.png | 2100 × 1240 | 205 KB |
| apology_gradient.png | 1800 × 1240 | 164 KB |
| media_multiplier.png | 2000 × 1320 | 165 KB |
| the_death_toll.png | 2000 × 1280 | 148 KB |
| who_points_the_finger.png | 2000 × 1240 | 162 KB |
| make_charts.py | regenerating script (matplotlib only) | |
| README.md | one [OC] title + paste-ready first comment per chart | |

All PNGs are 200 dpi, light background, with the consistent credit footer (subslikescript.com · Claude batch analysis, human-audited · n=521 · github.com/Tyorden/SVU) baked into every image.

## Numbers used per chart (all from v2, for your verification)

1. **the_retreat** — per-season Y-only rates from §B1: 47.6, 73.7, 78.3, 58.3, 78.3, 69.6, 50.0, 81.0, 83.3, 81.8, 78.3, 70.8, 69.6, 54.2, 54.2, 52.2, 47.8, 52.4, 54.2, 62.5, **30.0**, 37.5, 40.9, 36.4, 38.5, 54.5, 33.3. Era means 65.3 / 50.0 / 41.8; S21 break annotated; S27 flagged "3 eps aired"; footer notes 567-episode corrected base and χ²=20.89, p<.001.
2. **apology_gradient** — 0.0% (0/60), 6.6% (9/136), 5.6% (12/215), 16.4% (18/110); caption: threatened 8.0% (22/276) vs not-threatened 6.9% (17/245); overall 7.5%, formal 1.5% (8/521).
3. **media_multiplier** — sev-4 rates with n in axis labels: legal 57.1 (14), media 45.3 (86), multiple 33.3 (18), church 25.0 (4), family 20.0 (90), school 20.0 (20), workplace 15.4 (143), police_only 8.5 (142), online/unknown 0.0 (2 each). 5.4× bracket (45.3 vs 8.5); small-n (<25) bars de-emphasized with caveat; "dramaturgical, not causal" per spec §2.11.
4. **the_death_toll** — 21 murdered (2 in custody, 1 by police), 9 suicides, 2 other (overdose; AIDS after wrongful prison) = 32 dead / 31 episodes = 5.4% of 576 (title: "1 in every 18 episodes", 576/31≈18.6); secondary: 8 survived attempts, 31 non-fatal attacks (28+3); footer: row-level adjudicated, 5/32 apologized to.
5. **who_points_the_finger** — squad_inference 54.5% (284), victim_ID 18.0% (94), fabrication 12.7% (66), witness_misID 7.5% (39), tech_db_error 4.8% (25), coerced_interview 2.3% (12), unknown 0.2% (1); annotation: victim+witness combined 25.5%.

## Dataviz-skill adaptations

- **Validator unavailable:** the bundled skill's `references/` and `scripts/` directories are empty in this install (no `validate_palette.js`), so per "compute, don't eyeball" I wrote an equivalent computed check into `make_charts.py` (`validate_palettes()`, runs on every regeneration): sequential-ramp WCAG-luminance monotonicity and minimum step separation, dark-end contrast 7.4:1, highlight-blue contrast 5.2:1, highlight-vs-neutral luminance separation ≥2:1. All PASS. CVD safety rests on lightness separation (single-hue ramp; highlight-vs-gray designs), not hue pairs.
- **Interaction layer skipped:** static PNGs for Reddit have no hover/tooltip surface; direct labels on every mark substitute for tooltips.
- **Dark mode skipped:** deliverable is explicitly light-background Reddit PNGs.
- Everything else followed spec: finding-stating titles, sequential one-hue ramp for severity, fixed highlight color, no legends (single-series/direct-labeled), recessive grid, text in ink tokens never series color, subtle era bands, small-n de-emphasis.