# SVU Statistical Fact-Brief v2 — Corrected Analysis Set (Post Source-Corruption Audit)

**Generated:** 2026-07-05, computed directly from `svu_persons_harmed.csv` (541 raw rows) and `svu_episodes_summary.csv` (576 episodes) with Python (stdlib `csv` + `math`). **Supersedes `svu_paper_stats.md` (v1) in full.** Every number below was recomputed from the CSVs on the corrected analysis set; nothing was carried over from v1. The death audit reproduces the FINAL adjudicated numbers from `docs/revision_spec.md` §4B (which supersede v1 §A9); each named row was verified to exist in the CSV and match.

## The correction

The transcript ground-truth audit (spec §4B) found that **9 episodes in the source Excel carry the wrong transcript** — a duplicate of another episode's script:

| Corrupted episode | Actually contains | Phantom person-rows created |
|---|---|---|
| S01E13 "Disrobed" | S01E15 "Entitled" | Stephanie Mulroney (1) |
| S02E11 "Abuse" | S02E10 | Harry (homeless man), Joe Templeton, Hank Ludlow (3) |
| S02E18 "Manhunt" | S02E19 | Dr. Brad Stanton, Pam Stanton, Matt Sloane, Paul Amis, Dentist (unnamed), George Burton (6) |
| S04E10 "Resilience" | S04E23 | Karl Sirett (1) |
| S05E04 "Loss" | S06E14 | Larry Tauber (1) |
| S05E14 "Ritual" | S12E10 | none |
| S08E11 "Burned" | S18E08 | Gabriel Norton (1) |
| S09E19 "Cold" | S26E19 | Miguel Pinto, Father Alberto (2) |
| S11E09 "Perverted" | S26E08 | none |

All 15 phantom rows were verified present in the raw CSV and none is `actually_guilty` (no overlap with the 5 guilty exclusions). None of the 9 corrupted episodes was flagged `needs_deep_review` by the coder — the corruption was invisible to the instrument's own quality flag and was caught only by the ground-truth audit.

**Person-level analysis set:** 541 raw rows − 5 `actually_guilty` (svu_s03_e19 Thomas 'Bird' Gordon; svu_s03_e19 Judge Walter Thornburg; svu_s06_e20 Gabriel Duvall (initial questioning); svu_s12_e03 Bill Harris (initially); svu_s12_e12 Orville Underwood) − 15 phantom rows = **n = 521** person-episode rows. Vocabulary normalizations as in v1: `victim_misID` (4 rows, all surviving) → `victim_ID`; `third_party` (1 row, surviving) → `witness_misID`; `kidnap`/`kidnapping/child_abduction` spelling variants → `kidnapping`.

**Episode-level denominators:** the 9 corrupted episodes' flags describe a *different episode's* content, so they are excluded from the **primary denominator: 567 episodes**. The original 576 base is reported alongside for reference. **Recommendation: cite the 567-base numbers as primary in both papers**; the 576-base numbers exist only to show the correction's size. All 9 corrupted episodes fall in S1–18, so only the pre-#MeToo era shrinks (410 → 401 episodes).

**Unique persons:** 521 person-episode rows; 8 further rows are genuinely recurring persons across episodes (Amaro ×3, Stabler ×2, Cassidy ×2, Tucker ×2, Marsden ×3, Lomatin ×2, per spec §4B) → **~513 unique persons**. (Justin Sharp additionally carries two rows *within* one episode, S06E19 — two distinct accusations — which the person-episode unit intentionally counts separately.) With the S09E19 Father Alberto row removed as a phantom, Alberto dies **once** (S26E19); no cross-episode dedup for him is needed anymore.

---

## A. FLAGSHIP PAPER TABLES (SVU-only)

### A1. Episode-level rates (primary denominator = 567; reference = 576)

**Primary (corrected, 567 episodes):**

| Flag | Y | Maybe | Y-only rate | Y+Maybe rate |
|---|---|---|---|---|
| has_false_suspect | 337 | 15 | 337/567 = 59.4% | 352/567 = 62.1% |
| has_public_exposure | 295 | 11 | 295/567 = 52.0% | 306/567 = 54.0% |
| needs_deep_review | 16 | — | 16/567 = 2.8% | — |

**Reference (original 576 base):** has_false_suspect Y 344/576 = 59.7%, Y+Maybe 359/576 = 62.3%; has_public_exposure Y 300/576 = 52.1%, Y+Maybe 311/576 = 54.0%; needs_deep_review 16/576 = 2.8%.

Of the 9 excluded corrupted episodes, 7 were flagged `has_false_suspect = Y` and 5 `has_public_exposure = Y`; none was `Maybe` and none `needs_deep_review = Y`. All 15 `Maybe` episodes survive the correction (including the 4 transcriptless episodes S14E01, S14E02, S15E01, S17E01). `has_public_exposure` retains 3 `N/A` values (missing transcripts).

**Coincidence flag (v1 §2.21):** v1 noted the Y+Maybe episode rate (62.3%) coincided with the severity-3–4 person share (62.3%). On the corrected set the two values are 62.1% (352/567) and 62.4% (325/521) — still adjacent, no longer identical. Keep the "coincidence in the other direction" flag but update the values.

### A2. Consequence-severity distribution (n = 521)

| Severity | Definition | n | % |
|---|---|---|---|
| 1 | private/low-level harm | 60 | 11.5% |
| 2 | public exposure, no formal sanction | 136 | 26.1% |
| 3 | material sanction / serious fallout | 215 | 41.3% |
| 4 | life-altering or death | 110 | 21.1% |

Mean severity **2.72** (median 3; scale treated as interval for the mean only); severity 3–4: **325/521 = 62.4%**; severity 4 alone: 110/521 = 21.1%.

### A3. Innocence-status distribution (n = 521)

| innocence_status | n | % |
|---|---|---|
| proven_innocent | 429 | 82.3% |
| strongly_implied_innocent | 49 | 9.4% |
| partially_involved | 43 | 8.3% |

All 43 `partially_involved` rows survive the correction (none was a phantom); they are retained per the controlled-vocabulary definition (guilty of something else, innocent of the accused offense).

### A4. accusation_origin distribution (controlled field, normalized; n = 521)

| accusation_origin | n | % |
|---|---|---|
| squad_inference | 284 | 54.5% |
| victim_ID | 94 | 18.0% |
| fabrication | 66 | 12.7% |
| witness_misID | 39 | 7.5% |
| tech_db_error | 25 | 4.8% |
| coerced_interview | 12 | 2.3% |
| unknown | 1 | 0.2% |

**Normalization:** the 4 out-of-vocabulary `victim_misID` rows (S12E15, S16E13, S20E09, S21E05) and the 1 `third_party` row (S17E17) all survive the phantom exclusion; folded into `victim_ID` (90+4 = 94) and `witness_misID` (38+1 = 39) exactly as in v1. Phantom removal took −11 from squad_inference, −1 victim_ID, −2 witness_misID, −1 tech_db_error.

**Tag-vs-field reconciliation (the "wrong_ID" claim):** the free-form `wrong_ID` *tag* appears on 323 of 541 raw rows but on **309 of the 521** corrected innocent rows. Among those 309, the controlled `accusation_origin` is `squad_inference` 185 (59.9%), `victim_ID` 67 (21.7%), `witness_misID` 29 (9.4%), `tech_db_error` 18 (5.8%), `fabrication` 8 (2.6%), `coerced_interview` 2 (0.6%). The conclusion is unchanged: the tag mostly marks "the squad had the wrong person" as an outcome, sitting on top of `squad_inference` origins; the controlled field records who first pointed the finger, and the squad's own inference still dominates it (284/521 = 54.5%). Papers cite the field, not the tag.

### A5. Exposure channel and who-told distributions (n = 521)

| exposure_channel | n | % |    | exposure_who_told | n | % |
|---|---|---|---|---|---|---|
| workplace | 143 | 27.4% |    | squad | 454 | 87.1% |
| police_only | 142 | 27.3% |    | victim | 25 | 4.8% |
| family | 90 | 17.3% |    | third_party | 20 | 3.8% |
| media | 86 | 16.5% |    | media | 17 | 3.3% |
| school | 20 | 3.8% |    | unknown | 5 | 1.0% |
| multiple | 18 | 3.5% |    |  |  |  |
| legal | 14 | 2.7% |    |  |  |  |
| church | 4 | 0.8% |    |  |  |  |
| unknown | 2 | 0.4% |    |  |  |  |
| online | 2 | 0.4% |    |  |  |  |

Note: `workplace` (143) now edges out `police_only` (142) as the modal channel — a rank swap from v1, where police_only led 147 to 146. The two remain statistically indistinguishable; do not build a claim on the ordering.

Exposure spread beyond law enforcement (channel ≠ police_only/unknown) for **377/521 = 72.4%** of persons.

**The 87.3% correction (spec §1.3), recomputed at n = 521:**
- Raw `exposure_who_told = squad` share: **454/521 = 87.1%** (this is the corrected version of v1's 87.3% = 468/536). 136 of those 454 are `police_only` rows — cases that never left the precinct.
- Among the **379/521 = 72.7%** of persons exposed beyond police_only (channel ≠ police_only), the squad is the discloser in **318/379 = 83.9%**, which is **318/521 = 61.0%** of all persons.
- Paper wording: the squad is the discloser in **83.9% of the cases where the accusation actually spread** (v1-corrected value was 84.1%; the 61.0%-of-all share is unchanged to one decimal).

### A6. consequence_category distribution (n = 521)

| consequence_category | n | % |
|---|---|---|
| multiple | 204 | 39.2% |
| legal | 152 | 29.2% |
| social | 57 | 10.9% |
| work | 45 | 8.6% |
| physical | 40 | 7.7% |
| family | 23 | 4.4% |

### A7. police_conduct_threat distribution (n = 521)

| police_conduct_threat | n | % |
|---|---|---|
| none | 245 | 47.0% |
| verbal_threat | 108 | 20.7% |
| coercive_tactic | 68 | 13.1% |
| multiple | 55 | 10.6% |
| insult_degradation | 45 | 8.6% |

**Any threat/coercion** (verbal_threat + coercive_tactic + insult_degradation + multiple): **276/521 = 53.0%** (v1: 52.4% — the phantoms were disproportionately non-threatened rows).

### A8. police_apology (n = 521)

| police_apology | n | % |
|---|---|---|
| none | 480 | 92.1% |
| partial | 31 | 6.0% |
| formal | 8 | 1.5% |
| unknown | 2 | 0.4% |

Any-apology rate (partial+formal): **39/521 = 7.5%**; formal only: **8/521 = 1.5%**. The 2 `unknown` rows (both svu_s20_e21, the unnamed Italian parents) are treated as non-apologies, as in v1.

**Formal apologies: 8 rows, 8 unique persons (verified).** The Mulroney S01E13 formal-apology row was one of the 15 phantoms — S01E13's cell contained S01E15 'Entitled', so the single 'Entitled' apology was coded twice. v1's "9 rows / 8 unique persons" becomes **8 rows / 8 unique persons**, and the "two-episode continuing-storyline apology" claim in the papers is an artifact and must be cut. The 8: Stephanie Mulroney (S01E15), Evan Ramsey (S03E01), Varla (S07E14), Victor Tate (S11E01), Frank Sullivan (S11E21), Vicki Harris (S13E10), Omar Pena (S13E17), Stephen Lomatin (S17E09).

**Apology-by-severity gradient (n = 521):**

| Severity | n | any apology | rate | formal |
|---|---|---|---|---|
| 1 | 60 | 0 | 0.0% | 0 |
| 2 | 136 | 9 | 6.6% | 2 |
| 3 | 215 | 12 | 5.6% | 1 |
| 4 | 110 | 18 | 16.4% | 5 |

The gradient survives intact: apology tracks catastrophe. Severity-4 any-apology drops from v1's 17.7% (20/113) to 16.4% (18/110) because two of the phantoms were apologized-to severity-4 rows (Mulroney S01E13 formal; Alberto S09E19 partial).

**Apology × threat crosstab (n = 521):**

| Group | n | any apology | rate |
|---|---|---|---|
| threatened/coerced | 276 | 22 | 8.0% |
| not threatened | 245 | 17 | 6.9% |

Same reading as v1: detectives who threatened or coerced are essentially no more likely to apologize than those who did not (1.1-point gap).

### A9. DEATH / PHYSICAL-HARM AUDIT — FINAL ADJUDICATED NUMBERS (from spec §4B; verified row-by-row, not re-adjudicated)

These are the transcript-adjudication report's final numbers as fixed in spec §4B, which supersede v1 §A9. Every named person below was verified to have a matching row in `svu_persons_harmed.csv` (32/32 dead, 8/8 attempts found; episode IDs and apology codes match).

| Category | Final count |
|---|---|
| Murdered / killed (incl. Newlands; Alberto once; 2 in custody; 1 killed by police: Reynolds S17E05) | **21** |
| Completed suicides | **9** |
| Other accusation-linked deaths (Tate overdose S03E04; Torres AIDS-after-wrongful-imprisonment S21E06) | **2** |
| **Total dead** | **32**, across **31 distinct episodes** (S04E21 has two deaths) = **31/576 = 5.4%** of all episodes; **31/567 = 5.5%** of the corrected base |
| Apologies (partial or formal) among the 32 dead | **5/32** |
| Suicide attempts, survived | **8** (all structured; Kevin Wright's is in `tags`, not notes-only) |
| Non-fatal assaults / vigilante attacks / shootings | **28 structured + 3 notes-only** |

**The 21 murdered (all rows verified):** Sonya Pietrovicz S01E12; Russell Ramsay S02E08 (in custody); Evan Ramsey S03E01; Peter Sipes S04E05; Joe Cappilla S04E21; **Dr. Archibald Newlands S05E05** (added by adjudication — `murdered` sits in `tags`, not `consequence_detail`, which is why the earlier pass missed it); Dr. Derek Tanner S06E15; Mike Kona S09E08; Eric Byers S10E02; Joshua Galli S10E06; Mehcad Carter S15E03; Gene Fierstein S15E09; Manny Montero S15E13 (in custody); Jerome Jones S16E13; Terrence Reynolds S17E05 (killed by police); Trey Franklin S18E10; Greg Harvey S19E07; Douglas Moore S20E13; Quentin Dreyfus S20E20; Lonnie Liston S22E10; Father Alberto **S26E19 only** (the S09E19 row is a phantom — Alberto dies once; both papers' "revisited storyline / two deaths" framing is an artifact and must be cut).

**The 9 suicides (all rows verified):** Mark Nash S02E06; Eddie Cappilla S04E21; Mariel Plummer S05E18; **Larry Tauber — adjudicated to S06E14** (the S05E04 "Loss" cell contains S06E14's script; the suicide belongs to S06E14, where Tauber's genuine row exists; the S05E04 row is the phantom); Joel Mayder S07E13; Laura Kozlowski S08E15; Dr. Francis Slifkin S09E17; Edwin Adelson S12E02; Anthony Fierro S26E22.

**The 2 other deaths (verified):** Leon Tate S03E04 (overdose while wrongly suspected); Ricardo 'Ricky' Torres S21E06 (coerced false testimony at 15, imprisoned 15 years, contracted HIV in prison, died of AIDS shortly after release).

**Apologies among the dead (5/32, verified from the rows):** Evan Ramsey S03E01 (formal); Laura Kozlowski S08E15 (partial); Leon Tate S03E04 (partial); Lonnie Liston S22E10 (partial); Father Alberto S26E19 (partial). v1's 6/31 included the phantom Alberto S09E19 partial.

**The 8 suicide attempts (all structured; rows verified):** Charlotte Truex S08E14; Frank Sullivan S11E21; **Kevin Wright S12E21** (`suicide_attempt` is in his `tags` — structured, not notes-only as v1 had it); Gabriel Thomas S13E04; Joanne Parsons S13E21; Cedric Jones S15E16; Ronald Fleming S18E17; Dr. Pence Humphreys S24E15. **Named exclusions per adjudication (rows verified present; not re-adjudicated here):** Robert Logan S05E03, Dr. Colin Bennett S18E15, Aidan Connor S05E15, Prof. Javier Vega S05E21, Ashlee Walker S10E19.

**Non-fatal attacks: 28 structured + 3 notes-only.** v1's 27 structured rows are retained (incl. Bolton S18E17, adjudicated in) plus **Sean Roberts S18E02** (`imprisoned_16_years_repeatedly_raped_in_prison` — in-custody violence, adjudicated in), = 28. Notes-only (3): Sharon Harris S11E13, Ethan Morse S10E20, Marc Rajic S13E09. **Guarana S15E17 is excluded entirely** (dataset inclusion error — she was never accused; retaliation victim, not a suspect). Police shootings decompose as: **4 wounded** (Angel S04E13, Baxter S05E11, Luft S11E13, Barre S15E11), **1 fired-upon** (Gonzalez S22E07), **1 fatal** (Reynolds S17E05, counted under murders). Named death-audit exclusions carried from v1 plus adjudication: Travis Hall S01E04, Officer Ridley S01E04, Carlos Hernandez S21E06 (family murdered; he survived), Mr. Lee S18E17, **Doug Loveless S12E19** and **Jean Dussault S01E08** (added to the exclusions list; both rows verified present — their death-keyword tags refer to other people's deaths / a pre-accusation overdose), **Dr. Matt Spevak S05E23** (adjudicated: murdered by his twin and framed posthumously — the death precedes the accusation and is not a consequence of it).

### A10. role_in_plot and accused_of distributions (n = 521)

| role_in_plot | n | % | mean sev | % sev 4 |
|---|---|---|---|---|
| initial_suspect | 205 | 39.3% | 2.98 | 28.8% |
| red_herring | 172 | 33.0% | 2.44 | 13.4% |
| family_member | 78 | 15.0% | 2.68 | 24.4% |
| colleague | 24 | 4.6% | 2.38 | 4.2% |
| other | 23 | 4.4% | 2.78 | 13.0% |
| community_member | 19 | 3.6% | 2.95 | 26.3% |

| accused_of (normalized) | n | % |
|---|---|---|
| rape | 316 | 60.7% |
| assault | 65 | 12.5% |
| CSA | 45 | 8.6% |
| sex_crime_vague | 39 | 7.5% |
| other | 30 | 5.8% |
| kidnapping | 6 | 1.2% |
| murder | 4 | 0.8% |
| trafficking | 4 | 0.8% |
| DV | 3 | 0.6% |
| harassment | 3 | 0.6% |
| CP | 2 | 0.4% |
| arson | 2 | 0.4% |
| child_abandonment | 1 | 0.2% |
| terrorism | 1 | 0.2% |

Spelling folds and out-of-vocabulary retention exactly as v1 (one `kidnapping` variant and one `DV` row were phantoms).

### A11. Severity crosstabs

**Severity × accusation_origin (normalized; n = 521):**

| Origin | n | sev1 | sev2 | sev3 | sev4 | mean | % sev 3–4 | % sev 4 |
|---|---|---|---|---|---|---|---|---|
| squad_inference | 284 | 45 | 92 | 107 | 40 | 2.50 | 51.8% | 14.1% |
| victim_ID | 94 | 4 | 17 | 49 | 24 | 2.99 | 77.7% | 25.5% |
| fabrication | 66 | 2 | 8 | 28 | 28 | 3.24 | 84.8% | 42.4% |
| witness_misID | 39 | 6 | 13 | 17 | 3 | 2.44 | 51.3% | 7.7% |
| tech_db_error | 25 | 2 | 6 | 9 | 8 | 2.92 | 68.0% | 32.0% |
| coerced_interview | 12 | 1 | 0 | 5 | 6 | 3.33 | 91.7% | 50.0% |
| unknown | 1 | 0 | 0 | 0 | 1 | 4.00 | 100.0% | 100.0% |

**Severity × exposure_channel (the media multiplier; n = 521):**

| Channel | n | sev1 | sev2 | sev3 | sev4 | mean | % sev 4 |
|---|---|---|---|---|---|---|---|
| workplace | 143 | 0 | 53 | 68 | 22 | 2.78 | 15.4% |
| police_only | 142 | 58 | 33 | 39 | 12 | 2.04 | 8.5% |
| family | 90 | 0 | 32 | 40 | 18 | 2.84 | 20.0% |
| media | 86 | 0 | 12 | 35 | 39 | 3.31 | 45.3% |
| school | 20 | 0 | 4 | 12 | 4 | 3.00 | 20.0% |
| multiple | 18 | 0 | 0 | 12 | 6 | 3.33 | 33.3% |
| legal | 14 | 0 | 0 | 6 | 8 | 3.57 | 57.1% |
| church | 4 | 0 | 2 | 1 | 1 | 2.75 | 25.0% |
| unknown | 2 | 2 | 0 | 0 | 0 | 1.00 | 0.0% |
| online | 2 | 0 | 0 | 2 | 0 | 3.00 | 0.0% |

**Media multiplier: 45.3% severity-4 under media exposure (39/86) vs 8.5% police-only (12/142) = 5.4×** (v1: 5.2×; the corrected value is slightly *stronger*). Keep the dramaturgical (not causal) framing per spec §2.11.

### A12. Persons harmed per season (episode denominators exclude the corrupted episode(s) in that season)

| Season | Episodes | Persons harmed | Persons/episode |
|---|---|---|---|
| 1 | 21 | 17 | 0.81 |
| 2 | 19 | 29 | 1.53 |
| 3 | 23 | 25 | 1.09 |
| 4 | 24 | 32 | 1.33 |
| 5 | 23 | 34 | 1.48 |
| 6 | 23 | 27 | 1.17 |
| 7 | 22 | 18 | 0.82 |
| 8 | 21 | 22 | 1.05 |
| 9 | 18 | 34 | 1.89 |
| 10 | 22 | 27 | 1.23 |
| 11 | 23 | 29 | 1.26 |
| 12 | 24 | 22 | 0.92 |
| 13 | 23 | 29 | 1.26 |
| 14 | 24 | 20 | 0.83 |
| 15 | 24 | 15 | 0.62 |
| 16 | 23 | 14 | 0.61 |
| 17 | 23 | 16 | 0.70 |
| 18 | 21 | 17 | 0.81 |
| 19 | 24 | 15 | 0.62 |
| 20 | 24 | 18 | 0.75 |
| 21 | 20 | 6 | 0.30 |
| 22 | 16 | 8 | 0.50 |
| 23 | 22 | 9 | 0.41 |
| 24 | 22 | 13 | 0.59 |
| 25 | 13 | 8 | 0.62 |
| 26 | 22 | 14 | 0.64 |
| 27 | 3 | 3 | 1.00 |
| **Total** | **567** | **521** | **0.92** |

Seasons touched by the correction: S1 (−1 episode, −1 person), S2 (−2 eps, −9 persons), S4 (−1, −1), S5 (−2, −1), S8 (−1, −1), S9 (−1, −2), S11 (−1, 0). Season 2's persons/episode falls from v1's 1.81 to 1.53 — the largest single-season change; S9 remains the densest season (1.89).

### A13. Top tags (free-form field; n = 521 persons, multi-tag)

| Tag | n |  | Tag | n |
|---|---|---|---|---|
| wrong_ID | 309 |  | charged_then_dropped | 29 |
| public_confrontation | 269 |  | family_member | 29 |
| ruined_at_work | 141 |  | cop | 28 |
| arrested | 141 |  | red_herring | 27 |
| fabricated_claim | 111 |  | teacher | 22 |
| coerced_confession | 99 |  | murdered | 21 |
| ruined_in_family | 93 |  | db_error | 20 |
| media_outing | 88 |  | school_alert | 19 |
| witness_recant | 79 |  | vigilante_attack | 16 |
| perp_walk | 71 |  | immigrant | 13 |
| teen | 51 |  | interrogation_coercion | 13 |
| ruined_physically | 43 |  | doctor | 13 |
| custody_dispute | 40 |  |  |  |

Tags remain coder-generated free vocabulary, unaudited (spec §2.19); counts are indicative. Note the `murdered` tag (21) now happens to equal the adjudicated murder count — a coincidence of offsetting errors (the tag both misses deaths recorded elsewhere, e.g. detail-only rows, and includes non-victim deaths), not a validation.

### A14. Qualitative pulls — status after correction

- **Threat/coercion quote pulls (v1 list of 10):** none sits on a phantom row; all remain usable. Apply the spec §4B quote fixes where quoted in the papers (Hernandez quote begins "Because Monte..."; Liston quote has a leading "Oh,"; Pena/Benson S13E17 clause order reversed and the confession scene is private, not in court; Jerome Jones S16E13 victim lines resequenced; speaker attributions are not transcript-verifiable).
- **Formal-apology pulls:** the S01E13 Mulroney entry is a phantom (duplicate coding of 'Entitled'); the list is now the 8 rows in §A8. The Mulroney apology quote itself has a spliced-out reply ("All right.") — quote cleanly.
- **Severity-4 vignettes (v1 list of 6):** none sits on a phantom row; all remain usable subject to the vignette-exclusivity assignments in spec §2.15.

---

## B. LONGITUDINAL PAPER TABLES (SVU-only, by era)

Eras by production season: **pre-#MeToo = S1–18** (1999–spring 2017), **#MeToo era = S19–21** (fall 2017–2020), **post-2020 = S22–27**. All 9 corrupted episodes fall in S1–18, so only the pre-era denominators change (episodes 410 → 401; persons 442 → 427).

### B1. False-suspect episode rate by era (primary = corrected 567 base)

**Primary (corrected):**

| Era | Episodes | Y | Maybe | Y-only rate | Y+Maybe rate |
|---|---|---|---|---|---|
| S1–18 pre-#MeToo | 401 | 262 | 12 | 262/401 = 65.3% | 274/401 = 68.3% |
| S19–21 #MeToo era | 68 | 34 | 2 | 34/68 = 50.0% | 36/68 = 52.9% |
| S22–27 post-2020 | 98 | 41 | 1 | 41/98 = 41.8% | 42/98 = 42.9% |

**Reference (576 base):** pre 269/410 = 65.6% (Y+M 68.5%); S19–21 and S22–27 identical to primary. The era gradient is essentially untouched by the correction (pre-era rate moves 0.3 points).

**Per-season series (corrected denominators; episodes with the corrupted episode(s) removed from S1, S2, S4, S5, S8, S9, S11):**

| Season | Eps | FS=Y | FS=Maybe | Y-only | Y+Maybe | Persons | Persons/ep | Any-threat % (n) |
|---|---|---|---|---|---|---|---|---|
| 1 | 21 | 10 | 5 | 47.6% | 71.4% | 17 | 0.81 | 70.6% (17) |
| 2 | 19 | 14 | 0 | 73.7% | 73.7% | 29 | 1.53 | 55.2% (29) |
| 3 | 23 | 18 | 0 | 78.3% | 78.3% | 25 | 1.09 | 52.0% (25) |
| 4 | 24 | 14 | 0 | 58.3% | 58.3% | 32 | 1.33 | 62.5% (32) |
| 5 | 23 | 18 | 0 | 78.3% | 78.3% | 34 | 1.48 | 61.8% (34) |
| 6 | 23 | 16 | 1 | 69.6% | 73.9% | 27 | 1.17 | 51.9% (27) |
| 7 | 22 | 11 | 0 | 50.0% | 50.0% | 18 | 0.82 | 44.4% (18) |
| 8 | 21 | 17 | 0 | 81.0% | 81.0% | 22 | 1.05 | 59.1% (22) |
| 9 | 18 | 15 | 0 | 83.3% | 83.3% | 34 | 1.89 | 67.6% (34) |
| 10 | 22 | 18 | 0 | 81.8% | 81.8% | 27 | 1.23 | 55.6% (27) |
| 11 | 23 | 18 | 0 | 78.3% | 78.3% | 29 | 1.26 | 58.6% (29) |
| 12 | 24 | 17 | 0 | 70.8% | 70.8% | 22 | 0.92 | 68.2% (22) |
| 13 | 23 | 16 | 1 | 69.6% | 73.9% | 29 | 1.26 | 51.7% (29) |
| 14 | 24 | 13 | 2 | 54.2% | 62.5% | 20 | 0.83 | 55.0% (20) |
| 15 | 24 | 13 | 2 | 54.2% | 62.5% | 15 | 0.62 | 26.7% (15) |
| 16 | 23 | 12 | 0 | 52.2% | 52.2% | 14 | 0.61 | 14.3% (14) |
| 17 | 23 | 11 | 1 | 47.8% | 52.2% | 16 | 0.70 | 37.5% (16) |
| 18 | 21 | 11 | 0 | 52.4% | 52.4% | 17 | 0.81 | 29.4% (17) |
| 19 | 24 | 13 | 2 | 54.2% | 62.5% | 15 | 0.62 | 26.7% (15) |
| 20 | 24 | 15 | 0 | 62.5% | 62.5% | 18 | 0.75 | 38.9% (18) |
| 21 | 20 | 6 | 0 | 30.0% | 30.0% | 6 | 0.30 | 50.0% (6) |
| 22 | 16 | 6 | 1 | 37.5% | 43.8% | 8 | 0.50 | 87.5% (8) |
| 23 | 22 | 9 | 0 | 40.9% | 40.9% | 9 | 0.41 | 77.8% (9) |
| 24 | 22 | 8 | 0 | 36.4% | 36.4% | 13 | 0.59 | 23.1% (13) |
| 25 | 13 | 5 | 0 | 38.5% | 38.5% | 8 | 0.62 | 87.5% (8) |
| 26 | 22 | 12 | 0 | 54.5% | 54.5% | 14 | 0.64 | 35.7% (14) |
| 27 | 3 | 1 | 0 | 33.3% | 33.3% | 3 | 1.00 | 100.0% (3) |

**Timing story (spec §2.1) — unchanged by the correction:** S19 (54.2%) and S20 (62.5%) still sit at/above the late-pre-era plateau (S14–18: 47.8–54.2% Y-only); the break is still Season 21 (30.0%). The corrected per-season values move only in S1 (50.0→47.6), S2 (76.2→73.7), S4 (60.0→58.3), S5 (76.0→78.3), S8 (81.8→81.0), S9 (84.2→83.3), S11 (75.0→78.3) — none of them near the S18/S19 boundary.

### B2/B3/B7. Persons per episode, conditional severity, and apology rate, by era (corrected)

| Era | Episodes | Persons | Persons/ep | Mean sev (median) | % sev 3–4 (n) | % sev 4 | Any-apology rate |
|---|---|---|---|---|---|---|---|
| S1–18 pre-#MeToo | 401 | 427 | 1.06 | 2.67 (3) | 60.0% (256/427) | 20.1% | 32/427 = 7.5% |
| S19–21 #MeToo era | 68 | 39 | 0.57 | 3.05 (3) | 82.1% (32/39) | 30.8% | 2/39 = 5.1% |
| S22–27 post-2020 | 98 | 55 | 0.56 | 2.84 (3) | 67.3% (37/55) | 21.8% | 5/55 = 9.1% |

(576-base reference: pre-era persons/ep = 427/410 = 1.04.) The severity-paradox values are almost untouched: mean 2.67 → 3.05 → 2.84 and 60.0% → 82.1% → 67.3% survive to the decimal shown. The per-episode dose ratio for the "roughly double" claim (spec §1.2) is 1.06/0.57 = **1.9×** pre vs #MeToo era (v1: 1.08/0.57 = 1.9× as well after rounding; "roughly double" stands).

### B4. Police threat/coercion (any) by era and by 3-season block (n = 521)

| Era | n persons | Any threat | Rate |
|---|---|---|---|
| S1–18 pre-#MeToo | 427 | 230 | 53.9% |
| S19–21 #MeToo era | 39 | 14 | 35.9% |
| S22–27 post-2020 | 55 | 32 | 58.2% |

| Seasons | n persons | Any-threat rate |
|---|---|---|
| S1–3 | 71 | 41/71 = 57.7% |
| S4–6 | 93 | 55/93 = 59.1% |
| S7–9 | 74 | 44/74 = 59.5% |
| S10–12 | 78 | 47/78 = 60.3% |
| S13–15 | 64 | 30/64 = 46.9% |
| S16–18 | 47 | 13/47 = 27.7% |
| S19–21 | 39 | 14/39 = 35.9% |
| S22–24 | 30 | 17/30 = 56.7% |
| S25–27 | 25 | 15/25 = 60.0% |

Shape unchanged: per-season rate ranges 44–71% across S1–S14 (S1 rises to 70.6% after the correction — its lone phantom was a non-threatened row), dip begins S15 (26.7%), bottom S16–18 (27.7%), partial recovery S19–21 (35.9%), rebound S22–24 (56.7%) and S25–27 (60.0%). The five lowest single seasons are still S16 (14.3%), S24 (23.1%), S15/S19 (26.7%), S18 (29.4%). **The spec §1.2 ratio for the papers: 58.2% (S22–27) vs 27.7% (S16–18) = 2.1× — unchanged** (both cells contain no phantom rows). Season cells after S14 are 3–18 persons; use the blocks for inference.

### B5. accusation_origin mix by era (normalized; column % within era)

| Origin | S1–18 (n=427) | S19–21 (n=39) | S22–27 (n=55) |
|---|---|---|---|
| squad_inference | 242 (56.7%) | 16 (41.0%) | 26 (47.3%) |
| victim_ID | 66 (15.5%) | 12 (30.8%) | 16 (29.1%) |
| fabrication | 56 (13.1%) | 7 (17.9%) | 3 (5.5%) |
| witness_misID | 33 (7.7%) | 2 (5.1%) | 4 (7.3%) |
| tech_db_error | 22 (5.2%) | 0 (0.0%) | 3 (5.5%) |
| coerced_interview | 7 (1.6%) | 2 (5.1%) | 3 (5.5%) |
| unknown | 1 (0.2%) | 0 (0.0%) | 0 (0.0%) |

Post-#MeToo shift unchanged: `victim_ID` 15.5% → 30.8% → 29.1%; `fabrication` 13.1% → 17.9% → 5.5%. Small-era caveat stands (n = 39 / 55).

### B6. Exposure-channel mix by era (column % within era)

| Channel | S1–18 (n=427) | S19–21 (n=39) | S22–27 (n=55) |
|---|---|---|---|
| workplace | 122 (28.6%) | 7 (17.9%) | 14 (25.5%) |
| police_only | 121 (28.3%) | 8 (20.5%) | 13 (23.6%) |
| family | 75 (17.6%) | 6 (15.4%) | 9 (16.4%) |
| media | 65 (15.2%) | 13 (33.3%) | 8 (14.5%) |
| multiple | 15 (3.5%) | 1 (2.6%) | 2 (3.6%) |
| school | 14 (3.3%) | 4 (10.3%) | 2 (3.6%) |
| legal | 9 (2.1%) | 0 (0.0%) | 5 (9.1%) |
| church | 3 (0.7%) | 0 (0.0%) | 1 (1.8%) |
| unknown | 2 (0.5%) | 0 (0.0%) | 0 (0.0%) |
| online | 1 (0.2%) | 0 (0.0%) | 1 (1.8%) |

Media+online share: 66/427 = **15.5%** pre → 13/39 = 33.3% (S19–21) → 9/55 = 16.4% (post-2020). (v1 pre value: 15.2%.)

### B8. accused_of mix by era (normalized; column % within era)

| accused_of | S1–18 (n=427) | S19–21 (n=39) | S22–27 (n=55) |
|---|---|---|---|
| rape | 247 (57.8%) | 28 (71.8%) | 41 (74.5%) |
| assault | 60 (14.1%) | 3 (7.7%) | 2 (3.6%) |
| CSA | 36 (8.4%) | 3 (7.7%) | 6 (10.9%) |
| sex_crime_vague | 35 (8.2%) | 3 (7.7%) | 1 (1.8%) |
| other | 26 (6.1%) | 1 (2.6%) | 3 (5.5%) |
| kidnapping | 5 (1.2%) | 1 (2.6%) | 0 (0.0%) |
| murder | 4 (0.9%) | 0 (0.0%) | 0 (0.0%) |
| trafficking | 4 (0.9%) | 0 (0.0%) | 0 (0.0%) |
| DV | 3 (0.7%) | 0 (0.0%) | 0 (0.0%) |
| harassment | 2 (0.5%) | 0 (0.0%) | 1 (1.8%) |
| CP | 2 (0.5%) | 0 (0.0%) | 0 (0.0%) |
| arson | 2 (0.5%) | 0 (0.0%) | 0 (0.0%) |
| child_abandonment | 1 (0.2%) | 0 (0.0%) | 0 (0.0%) |
| terrorism | 0 (0.0%) | 0 (0.0%) | 1 (1.8%) |

### B9. Chi-square tests (Pearson, df = 2; exact p = exp(−χ²/2); tables ordered [pre, #MeToo, post-2020] × [yes, no])

**Primary (corrected denominators):**

| Test | Table | χ² | df | Exact p | Min expected cell |
|---|---|---|---|---|---|
| Era × has_false_suspect (Y vs not-Y; episode-level, N=567) | [[262, 139], [34, 34], [41, 57]] | **20.89** | 2 | **p = .000029** | 27.6 |
| Era × has_false_suspect (Y+Maybe vs N; episode-level, N=567) | [[274, 127], [36, 32], [42, 56]] | **24.45** | 2 | **p = .000005** | 25.8 |
| Era × severity (3–4 vs 1–2; person-level, n=521) | [[256, 171], [32, 7], [37, 18]] | **8.06** | 2 | **p = .018** | 14.7 |
| Era × any police threat/coercion (person-level, n=521) | [[230, 197], [14, 25], [32, 23]] | **5.30** | 2 | **p = .071 (n.s.)** | 18.3 |

**Reference (576-base episode tests):** Y-only χ² = 21.61, p = .000020; Y+Maybe χ² = 25.11, p = .000004 (v1's published values, confirmed).

**Significance verdicts — all four unchanged from v1:** the two episode-level era tests remain significant at any conventional level; the severity test remains p < .05 uncorrected but **still does not survive Bonferroni across the four planned tests** (.018 × 4 = .071 — spec §2.2's "suggestive" language stands verbatim, since the corrected p rounds to the same .018); the threat test remains non-significant (p = .071 vs v1's p = .078 — it moved *toward* significance but does not cross it; no wording change needed beyond the exact p). Smallest expected cell across all tests = 14.7, well above 5.

### B10. Harm-censoring discriminator (spec §2.3 / §4B), corrected set

Within `has_false_suspect = Y` episodes (corrected: corrupted episodes excluded):

| Era | Y-episodes | Person-rows in Y-episodes | Persons per Y-episode | Zero-person Y-episodes | % zero |
|---|---|---|---|---|---|
| S1–18 pre-#MeToo | 262 | 425 | **1.62** | 13 | **5.0%** |
| S19–21 #MeToo era | 34 | 39 | **1.15** | 4 | **11.8%** |
| S22–27 post-2020 | 41 | 55 | **1.34** | 3 | **7.3%** |

(Two further pre-era persons sit in `Maybe`-flagged episodes — Ron Polikoff S06E08, Mavis Summers S15E22 — so era persons ÷ Y-episodes gives 427/262 = 1.63; the table counts rows physically located in Y-episodes.) Spec §4B quoted 1.64 → 1.15 → 1.34 and 4.8% → 11.8% → 7.3% from the adjudication report, which used the uncorrected pre-era denominator (269 Y-episodes); the exact corrected values are **1.62 → 1.15 → 1.34** and **5.0% → 11.8% → 7.3%**. The reading is identical: a mild censoring signal in S19–21 resting on 4 of 34 episodes; the retreat is overwhelmingly carried by the episode-level flag, and L §5.1 should use the corrected values.

---

## C. DATA NOTES FOR METHODS SECTIONS (v2)

1. **Exclusions.** 5 `actually_guilty` rows (unchanged from v1) plus the 15 phantom rows from the 9 wrong-transcript episodes → n = 521 person-episode rows. `partially_involved` (n = 43) retained. Unique persons ≈ 513 after cross-episode dedup (8 recurring-person rows, spec §4B).
2. **Vocabulary normalizations.** Identical to v1 and all affected rows survive: `victim_misID` (4) → `victim_ID`; `third_party` (1) → `witness_misID`; kidnapping spelling folds; out-of-vocabulary `accused_of` values retained and disclosed.
3. **Defective source episodes: 14** (not v1's 5): 4 empty transcripts (S14E01, S14E02, S15E01, S17E01 — coded `Maybe`, zero person-rows), 1 non-English encoding (S06E09 "Weak", Greek characters — 1 low-confidence person-row retained, flagged for manual re-verification), and **9 wrong-transcript episodes** (this file's headline correction — excluded from the primary episode denominator; their 15 person-rows dropped). The 4 empty + 1 encoding episodes remain in the 567 denominator, as in v1's treatment.
4. **Blank/unknown fields.** Unchanged: 2 blank `police_apology` cells sit on excluded `actually_guilty` rows; 2 `unknown` (svu_s20_e21) treated as non-apologies; `air_date` absent from the analysis CSVs (121/576 raw JSONL rows carry air dates, spec §1.4), so era assignment is by season number; 3 `N/A` `has_public_exposure` values.
5. **Maybe-denominator sensitivity (corrected).** All 15 `Maybe` episodes survive (by season: S1: 5, S6: 1, S13: 1, S14: 2, S15: 2, S17: 1, S19: 2, S22: 1). Overall false-suspect rate moves 59.4% (Y-only) → 62.1% (Y+Maybe), a 2.7-point spread; era spreads: pre +3.0 pts, S19–21 +2.9 pts, S22–27 +1.0 pts. Conclusions hold under both treatments (B9 reports χ² both ways).
6. **Tag-vs-field reconciliation.** `wrong_ID` tag: 309/521 corrected innocent rows (323/541 raw); 185 of the 309 sit on `squad_inference` origins. The controlled field puts `squad_inference` first at 284/521 = 54.5%. Lead with the field; tag as robustness footnote only.
7. **Death-count discipline.** All headline death/harm numbers now come from the transcript-adjudication report as fixed in spec §4B (§A9 above), verified row-by-row against the CSV but **not re-adjudicated** here. The keyword-trap warning stands, with two additions: deaths can hide in `tags` when `consequence_detail` omits them (Newlands S05E05), and phantom rows can duplicate deaths across episodes (Tauber, Alberto).
8. **Coverage & confidence.** Census of all 576 aired episodes S1–S27 (S27 partial at 3 episodes, airing at collection time), coded by claude-sonnet-4-5 from subslikescript.com transcripts; primary analysis excludes the 9 wrong-transcript episodes (567). Self-reported `confidence` is `high` on 506/521 = 97.1% of corrected rows (uncalibrated). The planned human-validation pass remains a requirement, not a formality (spec §2.4).

---

## D. SOURCE QUALITY (quantified from `~/Downloads/Law and Order SVU all Transcripts.xlsx`, read with openpyxl)

**Defective episodes: 14 of 576 (2.4%), by type:**

| Defect type | n | Episodes | Handling |
|---|---|---|---|
| Wrong transcript (duplicate of another episode) | 9 | S01E13, S02E11, S02E18, S04E10, S05E04, S05E14, S08E11, S09E19, S11E09 | Excluded from primary episode denominator; 15 person-rows dropped |
| Empty transcript | 4 | S14E01, S14E02, S15E01, S17E01 | Retained as `Maybe`/zero-person (deflate Y-only rates); confirmed 0-length in the Excel |
| Non-English encoding (Greek) | 1 | S06E09 | Retained; 1 person-row flagged low-confidence |

**Truncation at the Excel cell limit:** **145/576 transcripts (25.2%) are exactly 32,767 characters** — the Excel cell cap — meaning their endings are cut off. By era: **138 in S1–18 (33.7% of that era's 410 episodes), 2 in S19–21 (2.9% of 68), 5 in S22–27 (5.1% of 98)**. Direction of bias: truncation censors late-episode content (resolutions, apologies, final-scene harms) almost exclusively in the *pre*-#MeToo era, so it can only **undercount early-era harm and apologies — the documented decline is therefore conservative**. This must be disclosed in both papers' Method/Limitations.

**Transcript thinning check (spec §2.8/§4B):** transcript length by season shows no downward era trend (era mean words 5,682 / 5,381 / 5,662 per the audit) — the retreat is not a transcript artifact; L §M3 gets this affirmative sentence.

---

## E. RECONCILIATION TABLE — every headline number that changes v1 → v2

Rule used: person-level numbers recomputed at n = 521; episode-level at N = 567 primary. "Why" codes: **P** = 15 phantom person-rows removed; **E** = 9 corrupted episodes removed from denominator; **A** = adjudication-report final numbers (spec §4B) superseding v1 §A9.

| # | Statistic | v1 | v2 | Why |
|---|---|---|---|---|
| 1 | Person-level n | 536 | **521** | P |
| 2 | Episode denominator (primary) | 576 | **567** (576 kept as reference) | E |
| 3 | False-suspect episodes, Y | 344 (59.7%) | **337/567 = 59.4%** | E |
| 4 | False-suspect episodes, Y+Maybe | 359 (62.3%) | **352/567 = 62.1%** | E |
| 5 | Public-exposure episodes, Y | 300 (52.1%) | **295/567 = 52.0%** (Y+M 306 = 54.0%) | E |
| 6 | Severity 3–4 share | 334/536 = 62.3% | **325/521 = 62.4%** | P |
| 7 | Severity 4 share | 113/536 = 21.1% | **110/521 = 21.1%** | P (unchanged at 1 dp) |
| 8 | Mean severity | 2.72 | **2.72** (median 3) | P (unchanged) |
| 9 | squad_inference origin share | 295/536 = 55.0% | **284/521 = 54.5%** | P — still first by 36.5 points; no flip |
| 10 | victim_ID origin share | 95/536 = 17.7% | **94/521 = 18.0%** | P |
| 11 | fabrication origin share | 66/536 = 12.3% | **66/521 = 12.7%** | P |
| 12 | wrong_ID tag count (innocent rows) | 323 | **309** | P |
| 13 | exposure_who_told = squad (raw share) | 468/536 = 87.3% | **454/521 = 87.1%** | P |
| 14 | Persons exposed beyond police_only | 389 | **379/521 = 72.7%** | P |
| 15 | Squad discloser among exposed-beyond | 327/389 = 84.1% | **318/379 = 83.9%** (61.0% of all — unchanged) | P |
| 16 | Exposure beyond LE (≠ police_only/unknown) | 386/536 = 72.0% | **377/521 = 72.4%** | P |
| 17 | Modal exposure channel | police_only 147 (workplace 146) | **workplace 143 (police_only 142)** — rank swap, 1-row margin; do not build a claim on ordering | P |
| 18 | Any threat/coercion | 281/536 = 52.4% | **276/521 = 53.0%** | P |
| 19 | Any apology | 41/536 = 7.6% | **39/521 = 7.5%** | P |
| 20 | Formal apologies | 9 rows / 8 unique (1.7%) | **8 rows / 8 unique (8/521 = 1.5%)** — Mulroney S01E13 was a phantom duplicate of the single 'Entitled' apology; the "two-episode apology" claim is an artifact | P |
| 21 | Severity-4 any-apology rate | 20/113 = 17.7% | **18/110 = 16.4%** (formal at sev 4: 6 → 5) | P |
| 22 | Apology × threat gap | 7.8% vs 7.5% | **8.0% vs 6.9%** — same reading (no meaningful gap) | P |
| 23 | Media multiplier (sev-4: media vs police_only) | 46.0% vs 8.8% = 5.2× | **45.3% (39/86) vs 8.5% (12/142) = 5.4×** — slightly stronger | P |
| 24 | Persons per episode (overall) | 536/576 = 0.93 | **521/567 = 0.92** | P+E |
| 25 | Season 2 persons/episode | 1.81 | **1.53** (29/19) — largest single-season change | P+E |
| 26 | Pre-era episodes / persons | 410 / 442 | **401 / 427** | P+E |
| 27 | Pre-era false-suspect rate (Y-only) | 269/410 = 65.6% | **262/401 = 65.3%** (Y+M 68.5% → 68.3%) | E |
| 28 | Pre-era persons/episode | 1.08 | **1.06** (dose ratio vs S19–21 still ≈1.9×, "roughly double" stands) | P+E |
| 29 | Pre-era mean sev / % 3–4 / % 4 | 2.67 / 60.0% / 20.1% | **2.67 / 60.0% (256/427) / 20.1%** — unchanged | P |
| 30 | Pre-era any-apology | 34/442 = 7.7% | **32/427 = 7.5%** | P |
| 31 | Pre-era any-threat | 235/442 = 53.2% | **230/427 = 53.9%** | P |
| 32 | Threat blocks S1–3 / S4–6 / S7–9 | 54.3% / 58.9% / 58.4% | **57.7% (41/71) / 59.1% (55/93) / 59.5% (44/74)** | P |
| 33 | 2.1× threat ratio (S22–27 vs S16–18) | 58.2% vs 27.7% | **58.2% vs 27.7% — unchanged** (no phantoms in either cell) | — |
| 34 | Pre-era media+online share | 67/442 = 15.2% | **66/427 = 15.5%** | P |
| 35 | Pre-era squad_inference share (B5) | 57.2% | **56.7%** | P |
| 36 | χ² era × FS (Y-only) | 21.61, p = .00002 | **20.89, p = .000029** (N=567) — still p < .001 | E |
| 37 | χ² era × FS (Y+Maybe) | 25.11, p < .001 | **24.45, p = .000005** (N=567) — still p < .001 | E |
| 38 | χ² era × severity 3–4 | 8.09, p = .018 | **8.06, p = .018** (n=521) — still p < .05; still fails Bonferroni (.018 × 4 = .071); "suggestive" wording stands | P |
| 39 | χ² era × any-threat | 5.10, p = .078 (n.s.) | **5.30, p = .071 (n.s.)** (n=521) — still n.s.; moved toward but not across .05 | P |
| 40 | Total dead | 30–31 (21 murder + 9 suicide + 1 overdose) | **32 = 21 murdered + 9 suicides + 2 other (Tate overdose, Torres AIDS)** | A (Newlands in, Alberto once, Tauber→S06E14, Torres in) |
| 41 | Death episodes / % of episodes | 30 eps = 5.2% of 576 | **31 eps = 5.4% of 576; 5.5% of 567** | A |
| 42 | Apologies among the dead | 6/31 | **5/32** (phantom Alberto S09E19 partial dropped) | A+P |
| 43 | Suicide attempts | 7 structured + 1 notes-only | **8 structured** (Wright's attempt is in `tags`) | A |
| 44 | Non-fatal attacks | 27 structured + 3 notes-only | **28 structured + 3 notes-only** (Sean Roberts S18E02 in; Guarana excluded as inclusion error) | A |
| 45 | Alberto deaths | 2 (S09E19 + S26E19), dedup −1 | **1 (S26E19 only)** — S09E19 row is a phantom; "revisit" framing is an artifact | P |
| 46 | Defective source episodes | 5 | **14** (4 empty + 1 encoding + 9 wrong-transcript) | E |
| 47 | Unique persons | "536; dedup −1 (Alberto)" | **521 person-episode rows; ~513 unique persons** (8 recurring-person rows) | P+A |
| 48 | Confidence = high | ~97% | **506/521 = 97.1%** | P |
| 49 | Y+Maybe rate vs severity-3–4 "coincidence" | 62.3% = 62.3% (identical) | **62.1% vs 62.4%** (adjacent, not identical — soften the coincidence flag) | P+E |
| 50 | Harm-censoring discriminator | (spec §4B: 1.64/1.15/1.34; 4.8%/11.8%/7.3%) | **1.62/1.15/1.34 persons per Y-episode; 5.0%/11.8%/7.3% zero-person Y-episodes** (corrected pre-era denominator, 262 Y-episodes) | E+P |

**Direction/significance check (verified, none flips):** every v1 finding survives the correction with its direction intact — the era retreat (65.3% → 50.0% → 41.8%), the severity paradox (2.67 → 3.05 → 2.84; 60.0% → 82.1% → 67.3%), the threat U-shape, the origin shift, the media-era spike, the apology gradient, and the squad's dominance of both origins (54.5%) and disclosure (87.1% raw / 83.9% among spread cases). Both significant chi-squares remain significant at p < .001; the severity test remains p = .018 (suggestive after Bonferroni, exactly as spec §2.2 words it); the threat test remains non-significant. The only rank change anywhere is the workplace/police_only channel swap (row 17), which was within one row in v1 and remains within one row now. The 5.4× media multiplier and 70.6% Season-1 threat rate are the only corrected values that got *stronger* rather than weaker.
