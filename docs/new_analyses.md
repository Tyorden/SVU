# New Analyses: False Accusations Across the Law & Order Franchise

**Date:** 2026-07-04
**Data:** `svu_persons_harmed.csv` (541 rows), `lo_persons_harmed.csv` (429 rows), `svu_episodes_summary.csv` (576 eps), `lo_episodes_summary.csv` (314 eps)
**Filtering:** Unless stated otherwise, all person-level analyses **exclude `actually_guilty` rows** (5 SVU, 12 L&O), leaving **n = 536 (SVU)** and **n = 417 (L&O)**, combined **n = 953**. Rows coded `partially_involved` (43 SVU, 25 L&O) are **retained** because the controlled vocabulary defines them as innocent of the accused offense. All numbers below were computed directly from the CSVs with Python (stdlib `csv`); nothing is estimated.

---

## 1. Top 10 New Findings

### Finding 1 — The detectives themselves are the #1 source of false accusations, on both shows

`squad_inference` (the squad's own theory: pattern match, proximity, prior record) is the leading `accusation_origin` in **both** series:

| Show | squad_inference | share of innocent persons |
|---|---|---|
| SVU | 295 | 55.0% (n=536) |
| L&O | 260 | 62.4% (n=417) |
| Combined | 555 | **58.2%** (n=953) |

Victim misidentification (`victim_ID`, 91 SVU / 8 L&O) and witness misidentification (40 / 63) are far behind. Note this **corrects a framing in the existing headline findings**: "wrong_ID leads SVU origins" comes from the `wrong_ID` *tag* (which bundles victim + witness IDs); on the actual controlled `accusation_origin` field, the police's own inference dominates.

**Interpretation:** In the franchise's own telling, the machine that generates wrongful accusations is mostly the police investigation itself — not lying victims, not faulty eyewitnesses. Combined with the near-zero apology rate (Finding 4), the shows depict a system that manufactures most of its own errors and almost never acknowledges them.

**Use:** Paper (central thesis-level stat); dashboard headline stat; social post ("58% of the time, the false accusation started inside the squad room").

---

### Finding 2 — After #MeToo, SVU quietly retreated from false-accusation plots; the 2022 L&O revival leaned in

SVU episode-level rate of `has_false_suspect = Y`, by era (era = season blocks; SVU S19 premiered fall 2017, S22 premiered Nov 2020):

| Era | Episodes w/ false suspect | Persons harmed / episode |
|---|---|---|
| Pre-#MeToo (S1–18, 1999–2017) | 269/410 = **65.6%** | 442/410 = **1.08** |
| Post-#MeToo (S19–21, 2017–2020) | 34/68 = **50.0%** | 39/68 = **0.57** |
| Post-2020 (S22–27) | 41/98 = **41.8%** | 55/98 = **0.56** |

The wrongly-accused-character density **halved** after 2017. But the surviving cases got *harsher*: mean severity rose 2.67 → 3.05 → 2.84, and % severity 3–4 went 60.0% → 82.1% → 67.3% (n = 442 / 39 / 55).

Meanwhile the L&O revival (S21–23, 2022+) moved the **opposite** way from original-run L&O: false-suspect episodes 80.0% (28/35) vs 71.3% (199/279), persons/episode 1.69 vs 1.28 — though with lower severity (mean 2.47 vs 2.64, %sev4 11.9% vs 17.9%; n = 59 vs 358).

**Interpretation:** SVU appears to have consciously reduced "the accuser was wrong/lying" storylines in the believe-survivors era while raising the dramatic stakes when it does use them (fewer throwaway red herrings, more catastrophic wrongful arrests). The revival L&O, built around courtroom ambiguity, doubled down on them. This is a measurable editorial-line shift, not vibes.

**Use:** Paper (core longitudinal result); dashboard era-toggle; strong r/dataisbeautiful line chart ("SVU stopped telling false-accusation stories after #MeToo").

---

### Finding 3 — 42 innocent people die, and police apologize in 6 of those 42 cases

Row-level verification of `consequence_detail` (removing false keyword matches like "accused of murder," "suicide_watch," "assisted_suicide," "family_murdered"):

| Show | Murdered/killed | Suicide | Total dead | Suicide attempts (survived) |
|---|---|---|---|---|
| SVU | 21 | 9 | **30** | 7 |
| L&O | 10 | 2 | **12** | 1 |
| Combined | 31 | 11 | **42** | 8 |

- **5.0% of all SVU episodes (29/576)** and 3.8% of L&O episodes (12/314) end with an innocent accused person dead.
- Among the 42 deaths, police apologize (partial or formal) **6 times (14.3%)**; exactly **1** formal apology.
- 3 of the SVU deaths occur **in custody** (Russell Ramsay beaten, raped, and murdered at Rikers S02E08; Edwin Adelson S12E02; Manny Montero murdered in prison S15E13).
- Both L&O suicides are **law-enforcement officers** (Deputy Robbie Linz S19E05; Officer Nick Riley S22E14).
- SVU vigilante-related harm: 17 rows tagged vigilante vs 4 in L&O — public exposure on SVU gets people hunted.

**Interpretation:** Roughly one in twenty SVU hours ends with a wrongly accused person dead, and the narrative almost never closes the loop with accountability. The "murdered in custody" subset is a particularly dark, uncounted trope.

**Use:** Paper (body-count table); social post ("SVU has killed 30 innocent suspects; police apologized 6 times across 42 franchise deaths"); dashboard "memorial wall" feature listing the 42.

---

### Finding 4 — The apology gradient: police only apologize once your life is destroyed

Combined shows (n=953), any apology (partial+formal) by consequence severity:

| Severity | n | Apology rate |
|---|---|---|
| 1 (private harm) | 115 | **0.0%** (0) |
| 2 (public exposure) | 265 | 3.8% (10) |
| 3 (material sanction) | 389 | 3.6% (14) |
| 4 (life-altering/death) | 184 | **12.5%** (23) |

Baselines: combined any-apology 4.93% (47/953); formal 0.94% (9/953 — all 9 on SVU). SVU any-apology 7.6% (41/536) vs L&O **1.4%** (6/417, zero formal). Whether the person was threatened/coerced barely changes apology odds (SVU: 7.8% threatened vs 7.5% not).

**Interpretation:** Apology is written as a response to catastrophe, not to misconduct — detectives who threatened someone are no more likely to apologize than those who didn't. And SVU detectives are ~5x more apologetic than original-flavor L&O cops, who essentially never apologize.

**Use:** Paper (accountability section); viral-friendly bar chart; dashboard stat tile ("0 apologies for the 115 lowest-severity cases").

---

### Finding 5 — Fabricated accusations are ~4x deadlier than misidentifications

Comparing mechanism tags/origins (combined, n=953):

| Mechanism | n | Mean severity | % severity 4 |
|---|---|---|---|
| `wrong_ID` tag | 484 | 2.52 | **11.0%** |
| `coerced_confession` tag | 161 | 3.01 | 31.1% |
| `fabricated_claim` tag | 163 | 3.26 | **42.9%** |

Same story on the controlled origin field: `fabrication` hits 42.4% sev-4 on SVU (n=66) and 46.9% on L&O (n=32), vs 14.6%/14.2% for `squad_inference` and 7.5%/7.9% for `witness_misID`. `coerced_interview` origin is small but brutal (SVU n=12, 50.0% sev-4).

**Interpretation:** The shows treat honest mistakes as recoverable and deliberate lies as annihilating. Dramatically coherent — but it means the franchise's most vivid, memorable false-accusation stories are the statistically rarest kind in reality (knowingly false reports), which is exactly the viral-clip selection bias the project footer discusses.

**Use:** Paper (mechanism × severity cross-tab); social post; pairs perfectly with an NRE real-world comparison (Section 2, item 2).

---

### Finding 6 — The media multiplier: press exposure carries a 6.5x severity-4 rate vs. quiet investigations

`exposure_channel` vs outcomes (combined, n≥18 channels):

| Channel | n | Mean severity | % sev 4 |
|---|---|---|---|
| police_only | 263 | 1.96 | **6.8%** |
| workplace | 250 | 2.68 | 12.0% |
| family | 118 | 2.80 | 18.6% |
| courtroom (L&O) | 85 | 3.18 | 29.4% |
| media | 139 | 3.35 | **44.6%** |
| legal | 18 | 3.39 | 44.4% |

The `perp_walk` tag (n=108) is the single strongest severity marker in the dataset: mean 3.57, **58.3% severity 4**, yet it also has an elevated apology rate (16.7%) — consistent with Finding 4's "apologize only after catastrophe" pattern. `media_outing` (n=146): mean 3.38, 45.9% sev-4.

**Interpretation:** In-universe, the harm engine isn't the interrogation — it's publicity. Once cameras or a perp walk enter the story, the odds of a life-altering outcome jump from ~7% to ~45–58%. The shows are, in effect, a 30-year argument against pre-conviction publicity.

**Use:** Paper (exposure mechanics); dashboard filter; social post ("A perp walk on L&O is a near-coin-flip death/ruin sentence").

---

### Finding 7 — The L&O threat paradox: coerced suspects fare *better* on L&O, worse on SVU

Police threats/coercion (`police_conduct_threat` ≠ none/unknown) vs outcomes:

| Show | Group | n | Mean severity | % sev 3–4 | % sev 4 |
|---|---|---|---|---|---|
| L&O | threatened | 223 | 2.48 | 51.6% | **9.4%** |
| L&O | not threatened | 192 | 2.76 | 63.5% | **25.0%** |
| SVU | threatened | 281 | 2.74 | 65.8% | 18.5% |
| SVU | not threatened | 255 | 2.69 | 58.4% | 23.9% |

L&O also *threatens more overall*: 53.5% of innocent persons face threats/coercion (223/417) vs SVU 52.4% (281/536) — nearly identical — but L&O's coercion is concentrated on early-cleared suspects, while its worst outcomes (trial, death) happen to people the cops treated politely.

**Interpretation:** Counterintuitive and structural: on L&O the precinct browbeating happens in act one to people who get cleared, while the catastrophic harm lands in the courtroom half of the show where detectives aren't the antagonists. Coercion and catastrophe are handled by *different institutions* on L&O — which motivates Finding 8.

**Use:** Paper (show-structure comparison); good "wait, what?" social stat.

---

### Finding 8 — On L&O, prosecutors apologize 5x more than police — and being an innocent *defendant* is the worst position in the franchise

L&O-only fields (n=417):

- **Prosecutorial apology:** 6.7% (28/417), including **10 formal** apologies.
- **Police apology:** 1.4% (6/417), **0 formal**.
- `prosecutorial_conduct = overreach`: n=51, mean severity **3.37** (vs 2.18 when conduct is `none`, n=234).
- Role `defendant` (a role that only exists in L&O's trial structure): n=57, mean severity **3.54**, **54.4% severity 4**, police apology 1.8%.

For comparison, the worst SVU role is `initial_suspect` (n=210, mean 2.98, 28.6% sev-4), while `red_herring` suspects get off lightest on both shows (SVU n=180, 13.9% sev-4; L&O n=93, 5.4%).

**Interpretation:** The franchise assigns moral accountability by institution: DAs on L&O own their errors on the record (10 formal apologies) while detectives never do (0). And once an innocent person crosses from "suspect" to "defendant," their sev-4 odds triple — the trial itself is depicted as the most dangerous thing that can happen to an innocent person.

**Use:** Paper (institutional-accountability section — arguably the most publishable novel result); dashboard cross-show comparison panel.

---

### Finding 9 — Child-related accusations are the most destructive accusation type, and teachers absorb the worst of it

Combined shows (overall baseline: mean severity 2.67, 19.3% sev-4, n=953):

| Slice | n | Mean severity | % sev 4 |
|---|---|---|---|
| Accused of CSA | 50 | 3.12 | **42.0%** |
| Accused of rape | 339 | 2.78 | 22.1% |
| Accused of murder | 308 | 2.57 | 14.9% |
| Tag `custody_dispute` | 40 | 3.12 | **40.0%** |
| Tag `teacher` | 30 | 3.17 | **36.7%** |
| Tag `teen` (accused is a teenager) | 51 | 3.00 | 29.4% |
| Tag `immigrant` | 33 | 2.64 | 15.2% — but **0.0% apology rate** |
| Tag `doctor` | 27 | 2.74 | 22.2% |

Small-n curiosity: `clergy` (n=8) has a 37.5% sev-4 rate but also the highest apology rate of any group (37.5%, vs 4.9% baseline).

**Interpretation:** A false CSA accusation is coded as nearly twice as destructive as a false murder accusation. Occupations built on trust with children (teachers, coaches) take severity far above baseline, and accusations weaponized inside custody disputes are among the deadliest recurring devices. The immigrant subgroup's 0-for-33 apology rate is a quiet, ugly detail.

**Use:** Paper (who-gets-harmed demographics); social post ("Falsely accused of murder on L&O: 15% chance of ruin. Falsely accused of touching a child: 42%").

---

### Finding 10 — SVU's depiction of coercive policing dipped mid-2010s, then came back *stronger* after 2020

Share of innocent persons facing police threats/coercion, SVU, 3-season blocks:

| Seasons | n | Threat/coercion rate |
|---|---|---|
| S1–3 | 81 | 54.3% |
| S4–6 | 95 | 58.9% |
| S7–9 | 77 | 58.4% |
| S10–12 | 78 | 60.3% |
| S13–15 | 64 | 46.9% |
| S16–18 | 47 | **27.7%** |
| S19–21 | 39 | 35.9% |
| S22–24 | 30 | 56.7% |
| S25–27 | 25 | 60.0% |

**Interpretation:** The gentlest-cop period is S16–18 (~2014–2017), then the threat rate snaps back to Stabler-era levels (57–60%) *after* 2020 — the opposite of what a post-George-Floyd "reformed copaganda" hypothesis predicts. One reading: later seasons re-introduced aggressive interrogation as a thing the show critiques rather than endorses; the tagging can't distinguish endorsement from critique (flagged in Section 2). Either way, on-screen coercion of innocent people did not decline post-2020 — it doubled off its mid-2010s low.

**Use:** Paper (strongest counterintuitive longitudinal result); r/dataisbeautiful U-curve chart.

**Bonus micro-finding (spotlight effect):** Episodes with exactly one wrongly accused person treat them far worse than multi-suspect episodes — SVU single-accused mean severity 2.93 / 30.3% sev-4 (n=185) vs 2.61 / 16.2% in multi-accused episodes (n=351); L&O 2.82 / 22.2% (n=99) vs 2.55 / 15.4% (n=318). Narrative attention is itself a risk factor.

---

## 2. Further Analyses Worth Doing (Ranked)

1. **Human validation of a stratified sample (highest priority).** Model self-reported `confidence` is `high` for 97% of rows (524/541 SVU, 401/429 L&O) — that is uncalibrated. Hand-check ~50 rows stratified by severity and show, prioritizing all 42 death rows and the 74 L&O `needs_deep_review` episodes (23.6% of L&O vs 2.8% of SVU). Every headline above should carry a validated error bar before publication.
2. **Join with the National Registry of Exonerations.** Compare the fiction's origin distribution (58.2% squad_inference, 10.3% fabrication) against real contributing factors (NRE: mistaken ID, perjury/false accusation, official misconduct rates by crime type). The "fiction vs. reality gap" table is the paper's likely money chart. Needs external data download and category mapping.
3. **Complete L&O coverage before publishing longitudinal L&O claims.** Seasons 10, 12, 14, 15, 18 are absent entirely; seasons 9 (6 eps), 13 (1), 17 (1), 21 (9), 23 (4) are partial. The original-vs-revival comparison (Finding 2) is real but the original-run denominator is a transcript-availability sample, not the full run.
4. **Race/gender coding of the accused.** `person_label`/`notes` often contain enough (e.g., "Mehcad Carter," "immigrant" tags) but systematic coding needs a re-pass (LLM + human spot check) or an episode-wiki join. Question: do the 31 murdered innocents and 17 SVU vigilante victims skew nonwhite/male?
5. **Endorsement vs. critique framing.** Finding 10's post-2020 coercion rebound can't distinguish "show glorifies coercion" from "show depicts coercion critically." A second tagging pass on `police_conduct_quote` + surrounding scene (is the conduct challenged by another character?) would resolve the most important interpretive ambiguity in the dataset.
6. **Detective-level attribution.** Which recurring character issues the threats and the apologies (Stabler vs. Benson vs. Rollins; Briscoe vs. Logan)? `police_conduct_quote` exists but speaker attribution needs a transcript re-pass. High viral potential ("Stabler's apology rate").
7. **Exact air-date mapping + showrunner eras.** `air_date` is blank throughout; joining IMDb/Wikipedia air dates would replace season-block eras with true dates and enable clean Baer/Leight/Graziano showrunner segmentation.
8. **Within-episode timing.** Does the falsely accused person appear as the act-one or act-three suspect, and does earlier accusation predict lighter severity (the red-herring discount, Finding 8)? Needs scene/act position extraction from transcripts.
9. **Inter-model reliability.** Re-run a 50-episode sample through a different model with the same prompt; compute agreement (kappa) on severity and origin. Cheap (~$2) and makes the methodology section defensible.
10. **Control corpus.** Same pipeline on a non-L&O procedural (e.g., CSI, Criminal Minds) to establish whether these rates are franchise-specific or genre-wide.

---

## 3. Data Quality Observations

1. **Schema drift between the two runs.** SVU persons CSV has `preexisting_allegation`, `accusation_mode`, `audience_present`; L&O instead has `prosecutorial_conduct`, `prosecutorial_apology`. None of these five fields are in the project documentation's schema. Cross-show comparisons must stick to the shared columns.
2. **Controlled-vocabulary drift.** Out-of-vocab `accusation_origin` values appear: `victim_misID` (4 SVU + 1 L&O), `third_party` (1 SVU), `prosecutorial_theory` (22 L&O), `defense_attorney` (1 L&O). `accused_of` has undocumented values (`murder` — 308 L&O rows plus 4 SVU; `kidnapping`, `arson`, `terrorism`, `conspiracy`) and inconsistent spellings (`kidnap`, `kidnapping/child_abduction`, `kidnapping/child abduction`). Normalize before publication.
3. **`actually_guilty` rows persist despite prompt exclusion rules:** 5 SVU + 12 L&O. All analyses above exclude them; any downstream consumer of the raw CSVs must too.
4. **Free-text `consequence_detail` is a keyword-matching trap.** Naive matching inflates the death count from 42 to ~59: "arrested_for_wrong_murder," "suicide_watch," "assisted_suicide," "mother_sister_murdered_while_wrongly_imprisoned" (his family died, he didn't), "family_murdered." Every death-count claim in this doc was verified row-by-row.
5. **L&O coverage is a transcript-availability sample, not a census.** 314 of ~456 original-run+revival episodes; 5 seasons missing entirely, 5 partial (see Section 2.3). Season-level L&O trends are unreliable; era aggregates are directionally OK but should be caveated.
6. **`needs_deep_review` asymmetry:** 74/314 L&O episodes (23.6%) vs 16/576 SVU (2.8%) — the L&O transcripts are markedly lower quality, and its `confidence` field is even blank on some rows (e.g., lo_s01_e01 person 1).
7. **Minor field hygiene:** `police_apology` contains 2 blank and 2 `unknown` values (SVU); `has_false_suspect = Maybe` exists only in SVU (15 eps) — denominator choices change episode-rate stats by up to ~2.6 points; `air_date` is empty everywhere.
8. **Possible duplicate persons across episodes:** "Father Alberto" appears in both svu_s09_e19 (`shot_and_killed`) and svu_s26_e19 (`murdered`) — likely a revisited storyline; person-level counts treat these as two harmed persons. A cross-episode dedup pass (name + role match) is warranted before any "unique lives harmed" claim.
9. **Documentation headline vs. field reality:** the documented "wrong_ID is the leading cause (323/541)" is a *tag*-level count; the controlled `accusation_origin` field says `squad_inference` leads (Finding 1). Both are true statements about different fields, but the public-facing framing should be reconciled.
