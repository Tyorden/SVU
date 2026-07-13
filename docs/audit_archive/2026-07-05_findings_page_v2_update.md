# 2026-07-05_findings_page_v2_update

Agent final report, extracted from session transcript agent-a4e0f1351f1611c58.jsonl (archived alongside as .raw.jsonl).

---

All verification complete (the background task "failure" is just the pkill terminating the preview server, exit 144 as expected).

## Summary

All changes were confined to `/Users/tylerorden/Desktop/SVU/src/pages/Findings.tsx`.

**1. Phantom-row exclusion added to the runtime filter.** New `CORRUPTED_EPISODE_IDS` set (the 9 wrong-transcript episodes, matched by `custom_id`, e.g. `svu_s01_e13`) is applied alongside the existing `actually_guilty` exclusion; vocab normalizations unchanged. A fail-safe logs a `console.warn` if the filtered set is not n=521 (`EXPECTED_N`). A parallel `validEpisodes` filter drops the 9 corrupted episodes from the episode-level denominator (576 → 567) used by the era charts.

**2. Methodology box updated:** n=521 = 541 − 5 `actually_guilty` − 15 rows from 9 episodes with duplicate transcripts (July 2026 audit); 567-episode denominator; the 145 truncated transcripts (Excel 32,767-char limit, mostly S1-18) disclosed as a known source limitation; note that Episodes/Analysis pages still show the full raw dataset.

**3. Death audit updated to final adjudicated numbers:** 32 deaths across 31 episodes (5.4% of 576); 21 murdered (2 in custody; 1 killed by police, Reynolds S17E05); 9 suicides; 2 other deaths (Tate overdose, Torres AIDS after wrongful imprisonment); 8 survived suicide attempts; 31 non-fatal attacks (28 structured + 3 notes-only, incl. 4 police woundings + 1 fired-upon); apologies in 5 of 32 death cases. Labeled "row-level adjudicated against the source transcripts (July 2026)".

**4. Chi-square annotations updated:** false-suspect chi-square(2)=20.89, p<.001, N=567; severity chi-square(2)=8.06, p=.018; added coercion pooled chi-square(2)=5.30, p=.071 n.s. to the U-shape chart. Era rates render at runtime as 65.3%/50.0%/41.8% (verified against the JSON with the episode filter). Persons/episode text corrected to 1.06/0.57/0.56.

**5. Runtime-vs-stats-file check (verified against persons.json with the new filter):** n=521 exact; squad_inference 284 = 54.5%; any apology 39 = 7.5%; sev-4 apology 18/110 = 16.4%; media 45.3% (39/86) vs police_only 8.5% (12/142); any-threat 276 = 53.0%; exposure beyond police 72.4% — all match svu_paper_stats_v2.md. **One real discrepancy found and fixed:** the media multiplier was computed from the display-rounded rates (45.3/8.5 = 5.3x); it now uses unrounded proportions ((39/86)/(12/142) = 5.366 → 5.4x), matching the stats file.

**6. Ordering claim:** the page never claimed workplace or police_only as the single modal channel (runtime counts 143 vs 142), so nothing to remove; the origin-section text updated 55.0% → 54.5% and 17.7% → 18.0%, and "536" → "521".

**Verification:** `npx tsc --noEmit` passes clean; `npm run build` succeeds; `vite preview` + `curl /findings` returns 200. No commits made; no other files touched.