# Blind re-coding reliability study: results (2026-09-04)

Pre-registration: docs/VALIDATION_ANCHORS_2026-09-04.md (sections 0-8, written before any re-coding).
Data and code: docs/validation_2026-09-04/ (sample.py, sample.json, replacements.json, CODING_PROTOCOL.md,
add.py, recoded.jsonl, agreement.py, agreement_results.json, disagreements.md, adjudications.json, PROGRESS.md).
Verify: `cd /Users/tylerorden/Desktop/SVU/docs/validation_2026-09-04 && python3 agreement.py && echo OK`
(pure Python 3, deterministic, exit 0; the numbers below are copied from agreement_results.json).

## 0. What this study is and is not (plain statement)

The two manuscripts promised a human validation of the AI coding. No human coded anything here. Instead a
second AI coder (Claude Fable 5.1, a different model generation from the original claude-sonnet-4-5-20250929)
re-coded a random 90-episode sample from the same source transcripts, blind to the original codes, using a
fresh protocol that restates the documented codebook. Agreement between the two coders was then computed.
This measures repeatability of the instrument across two AI coders, one of them reading a re-stated rubric.
It does not measure truth. A person the two coders agree on can still be wrong; a person they disagree on is
not thereby wrong. The human validation named in both papers remains undone and stays a limitation.

## 1. Sample design (as pre-registered; draw record in the anchors doc)

- 90 scored episodes = 60 SVU + 30 L&O, drawn with random.Random(20260904).sample over sorted ids within
  strata, proportional allocation with a minimum per stratum. SVU strata (production-season eras): S1-18 = 42,
  S19-21 = 7, S22-27 = 11. L&O strata: S1-9 = 18, S11-20 = 9, S21-23 = 3.
- SVU frame = 576 rows minus the 9 stats_v2 wrong-transcript episodes minus 5 no-source episodes minus 57
  episodes whose codes the re-coder had glimpsed during orientation (contamination exclusion, listed in the
  anchors doc section 2c) = 505 of the 567-episode primary denominator. L&O frame = 313 (lo_s01_e01 excluded
  for the same reason).
- One replacement was drawn per the pre-registered rule: svu_s07_e15 ("Manipulated") carries the S10E07
  ("Wildlife") transcript byte-for-byte in the source workbook, a TENTH wrong-transcript episode not in the
  stats_v2 list of nine. It was coded as read, flagged, kept out of primary scoring, and replaced by
  svu_s05_e17 ("Mean") from the same stratum (replacements.json). 41 of the 90 transcripts end at the 32,767
  character Excel cap; the codebook's needs_deep_review flag was used where the cut hid the resolution.
- Kill criteria: K1 (source insufficiency) not triggered; K2 (blindness breach) not triggered; K3 (coverage)
  91 of 91 ids coded (90 scored + the flagged duplicate).

## 2. Blind protocol as executed

Each transcript was extracted by sample.py to a scratchpad directory outside the repository (copyright), read
one at a time, and one JSON judgment was appended to recoded.jsonl by add.py (which validates vocabulary and
refuses duplicates) before the next transcript was opened. No command in the coding phase read the original
code files, the CSVs, svu_paper_stats_v2.md beyond the frame rules already noted in the anchors doc, or
papers/*. agreement.py exits 2 without opening the originals unless every scored id is already in
recoded.jsonl; its first successful run (2026-09-04 23:20 PDT, PROGRESS.md checkpoint) was the unblinding
moment. Person matching after unblinding was automatic (shared name token, one-to-one); no hand matches were
needed (all 52 pairs are verifiably the same person; match log in disagreements.md section D).

Two limits on blindness are on the record. (1) The re-coder is an AI whose pretraining almost certainly
includes SVU episode recaps; like the original coder it may recognize episodes. (2) The orientation reads that
forced the 57-episode frame exclusion removed most of the paper's 32 death rows and 8 formal-apology rows from
the sampling frame, so this study says little about those priority strata (the papers' own stated priority
sample for the human study).

## 3. Results: SVU-only (paper-facing; 60 episodes) and pooled (90 episodes)

Percent agreement, Cohen's kappa (unweighted), 95% cluster-bootstrap CI over episodes (B = 2000, seed
20260904, percentile), Landis and Koch band. Normalizations applied to both sides as in stats_v2
(victim_misID to victim_ID; third_party origin to witness_misID; kidnap spellings to kidnapping); original
rows coded actually_guilty (1 in the sample, lo_s05_e16) dropped to match the stats_v2 analysis set.

### 3.1 Episode level (unit = episode)

| field | SVU % agree | SVU kappa [CI] | band | pooled % agree | pooled kappa [CI] | band |
|---|---|---|---|---|---|---|
| has_false_suspect | 73.3 | 0.467 [0.267, 0.662] | moderate | 73.3 | 0.471 [0.312, 0.627] | moderate |
| has_public_exposure | 73.3 | 0.470 [0.241, 0.694] | moderate | 74.4 | 0.495 [0.321, 0.664] | moderate |
| needs_deep_review | 91.7 | 0.000 (original flagged 0 of 60) | none | 83.3 | -0.091 [-0.134, -0.038] | none |

### 3.2 Person inclusion (unit = episode)

| statistic | SVU | pooled |
|---|---|---|
| persons: original / re-coded / matched | 59 / 51 / 35 | 92 / 74 / 52 |
| found by original only / re-coder only | 24 / 16 | 40 / 22 |
| Jaccard overlap [CI] | 0.467 [0.337, 0.600] | 0.456 [0.364, 0.561] |
| per-episode person count, exact agreement [CI] | 60.0% [48.3, 71.7] | 58.9% [47.8, 68.9] |
| per-episode person count, within 1 | 88.3% | 86.7% |
| episodes where both coders found 0 persons | 18 of 60 | 25 of 90 |

### 3.3 Person level (unit = matched person pair; SVU n = 35, pooled n = 52)

| field | SVU % | SVU kappa [CI] | band | pooled % | pooled kappa [CI] | band |
|---|---|---|---|---|---|---|
| innocence_status | 60.0 | 0.134 [-0.065, 0.334] | slight | 61.5 | 0.100 [-0.054, 0.255] | slight |
| role_in_plot | 37.1 | 0.197 [0.013, 0.385] | slight | 44.2 | 0.227 [0.067, 0.397] | fair |
| accused_of | 31.4 | 0.178 [0.058, 0.302] | slight | 50.0 | 0.368 [0.204, 0.531] | fair |
| accusation_origin | 60.0 | 0.446 [0.230, 0.678] | moderate | 61.5 | 0.411 [0.202, 0.619] | moderate |
| exposure_channel | 57.1 | 0.477 [0.290, 0.660] | moderate | 46.2 | 0.368 [0.219, 0.520] | fair |
| exposure_who_told | 68.6 | 0.096 [-0.077, 0.404] | slight | 69.2 | 0.187 [-0.020, 0.425] | slight |
| consequence_category | 57.1 | 0.455 [0.232, 0.678] | moderate | 50.0 | 0.363 [0.174, 0.529] | fair |
| consequence_severity (unweighted) | 60.0 | 0.381 [0.104, 0.623] | fair | 59.6 | 0.353 [0.127, 0.556] | fair |
| consequence_severity (linear-weighted) | | 0.509 [0.265, 0.705] | moderate | | 0.457 [0.251, 0.623] | moderate |
| police_conduct_threat | 48.6 | 0.271 [0.068, 0.476] | fair | 44.2 | 0.204 [0.038, 0.371] | slight |
| police_apology | 85.7 | 0.327 [0.000, 0.484] | fair | 88.5 | 0.297 [-0.011, 0.484] | fair |
| screen_evidence | 88.6 | 0.278 [-0.088, 0.785] | fair | 88.5 | 0.347 [-0.056, 0.727] | fair |
| confidence | 34.3 | 0.000 | none | 46.2 | 0.000 | none |
| derived: any_threat | 68.6 | 0.370 [0.088, 0.653] | fair | 63.5 | 0.280 [0.050, 0.511] | fair |
| derived: any_apology | 94.3 | 0.718 [0.000, 1.000] | substantial | 96.2 | 0.729 [0.000, 1.000] | substantial |
| derived: severe (3-4) | 74.3 | 0.469 [0.108, 0.753] | moderate | 75.0 | 0.451 [0.143, 0.698] | moderate |
| derived: media_or_online | 91.4 | 0.624 [0.000, 1.000] | substantial | 88.5 | 0.437 [-0.074, 0.809] | moderate |
| derived: beyond_police_only | 80.0 | 0.146 [-0.116, 0.523] | slight | 82.7 | 0.127 [-0.083, 0.446] | slight |
| L&O only: prosecutorial_conduct (n = 17) | | | | 58.8 | 0.422 [0.143, 0.683] | moderate |
| L&O only: prosecutorial_apology (n = 17) | | | | 76.5 | 0.000 | none |

Kappa of exactly 0.000 with a degenerate CI means one coder used a single category (confidence: original
"high" on every matched SVU row; needs_deep_review: original never flagged a sampled SVU episode). The two
"substantial" derived binaries are rare events (2 to 4 positives among 35 pairs), so their bootstrap CIs span
[0, 1] and the point estimates should not be leaned on.

### 3.4 The flagged duplicate-transcript episode (not scored)

svu_s07_e15 original codes: has_false_suspect N, has_public_exposure N, 0 person rows. Re-coder, reading the
same (S10E07 "Wildlife") text: Y, N, 1 row (Gots Money). The original's own svu_s10_e07 row also codes Gots
Money, so the original coder read the same text two ways in two cells.

## 4. Applying the pre-registered decision rule

Rule (anchors section 5): any field with kappa below 0.61 (point estimate, SVU-only) is named in Limitations
as a low-reliability field, and headline claims resting on it are flagged where they appear. Fields below
0.61 in the SVU-only set: both episode flags (0.47), and every person-level field except the two rare-event
derived binaries (any_apology 0.72, media_or_online 0.62, both with CIs reaching 0). Person inclusion itself
(Jaccard 0.47) is below the threshold. Under the rule the papers must say: episode-level presence of a
false-suspect plot is moderately reliable across the two AI coders; the person-level record is not reliable
at the level of individual fields; the person census differs by roughly half its rows between coders.

Headline claims and the field they rest on (SVU kappa): the 59.4% false-suspect episode rate (0.47); the
521-person census and 0.92 persons per episode (Jaccard 0.47; per-episode count exact 60%, within one 88%);
the 83.9% squad share of disclosure (who_told 0.10); the 53.0% any-threat rate (0.37 derived, 0.27 raw); the
severity distribution and 62.4% severe (0.51 weighted, 0.47 derived); the origin mix and 54.5% squad
inference (0.45); the media multiplier (channel 0.48, media_or_online 0.62); the 7.5% any-apology rate (0.72
derived, 0.33 raw); the innocence-status split and 43 partially_involved (0.13).

## 5. What the disagreements are made of (from adjudications.json; every one is listed in disagreements.md)

62 episode-level disagreements, 62 unmatched persons (40 original-only, 22 re-coder-only), and 52 matched
pairs with at least one field difference. Six systematic sources account for most of them:

1. Inclusion threshold. The re-coder omitted police-only clearances with no material harm (Cooper Davis
   S24E16, Red Washington S23E19, Gordon Franks S25E01, Sean Riggs S12E14, Mr. Lathan and Rob Canotti S04E19,
   Rob Fisher S13E14, and others). The codebook includes them (148 police_only rows in the corpus). This is a
   protocol difference and accounts for a large share of the 40 original-only persons.
2. partially_involved applied literally. The re-coder used it for any in-plot wrongdoing (Conklin, Butler,
   Shea, Talcott, Stark, Leon, Gots Money, Banks, Nicholas Waring); the original coded most of these
   proven_innocent, and conversely excluded some cleared suspects who were guilty of something else (Ross and
   Rivera S19E04, Dutton, Locke, Jimmy Rose, Shawn, Dr. Brown), which the re-coder's own rule also excluded
   in L&O. The category boundary is under-specified in the codebook.
3. Vocabulary labels. role_in_plot: original "red_herring" for most cleared suspects, re-coder
   initial_suspect/family_member/colleague. accused_of: original defaulted to "rape"/"csa" in SVU episodes
   where the person was suspected of a killing (Vega, Lemcke, Harry Baker, Agnes Linsky, Croft, Cal Markham,
   Gots Money, Butler, Leon); re-coder used the specific offense. exposure_channel: original used "multiple"
   (21 rows in the corpus) and "legal" (14), neither in the documented vocabulary.
4. Calibration. Original confidence is "high" on every matched SVU row; the re-coder used "medium" by
   default. This field carries no information about agreement.
5. Two accusation moments in one row. Several persons are accused twice (by the squad, then by a victim or
   in court); the single-row design forces a choice of origin, channel and who_told (Tom Harrigan, Ramirez,
   Vega, Talcott, Carmen Vasquez).
6. Scoping of series regulars and edge cases. The re-coder coded Benson twice (S15E21, S19E01), the original
   excluded protagonists; both coded some posthumous or victim-as-accused edge cases the codebook does not
   address (McKinnon, Page Ferguson, Andrea Blake, Ana Kapic, Billy Baker, Janis Donovan).

Direct factual disagreements needing a third (human) read: Paul Davies S21E20 (original: falsely accused;
re-coder: guilty on the page), Jackie Madden S05E25 (re-coder: accused at work; original: no one), Frank
Sullivan S11E21 (original: formal apology, one of the paper's 8; re-coder: none), Mark Dobbins S06E11
(re-coder: formal apology, quoted; original: none), Vega S05E21 and Lomatin S14E05 (formal vs partial), the
Shea S14E10 apology (formal vs partial). Two of these touch the paper's formal-apology count of 8.

## 6. Implications for the number authority (svu_paper_stats_v2.md)

No number in stats_v2 changes: this study does not alter the original data. Three items are added there by
addendum: (a) the agreement statistics above; (b) svu_s07_e15 as a tenth wrong-transcript episode, which if
adopted takes the primary episode denominator from 567 to 566 (S7 era, pre-#MeToo) and removes no person rows
(the original S07E15 record has none); (c) the two formal-apology rows now contested (Sullivan S11E21 present
in the original, Dobbins S06E11 absent), to be settled by a human read before the "8 formal apologies" figure
is used again.

## 7. Recommended manuscript language (implemented in papers/*_v2.tex)

Report the study as a blind AI-AI re-coding reliability check; give the episode-level kappas and the
person-level range; state that the person census is not field-reliable across coders; name the low-kappa
fields in Limitations; keep the human validation as undone future work; update the disclosure paragraph
(the cross-check used a later model of the same family, not a non-Anthropic model as previously planned).

## 8. Files

- docs/VALIDATION_ANCHORS_2026-09-04.md (pre-registration + draw record + results addendum)
- docs/validation_2026-09-04/agreement_results.json (all statistics, match log, unmatched persons)
- docs/validation_2026-09-04/disagreements.md (every disagreement with both codes and adjudication note)
- docs/validation_2026-09-04/adjudications.json (the notes, keyed)
- docs/validation_2026-09-04/recoded.jsonl (91 blind judgments, 75 person rows)
- papers/svu_flagship_paper_v2.tex, papers/svu_metoo_longitudinal_v2.tex (originals untouched)

## 9. Manuscript v2 build record (2026-09-04 23:43 PDT)

- papers/svu_flagship_paper_v2.tex: 10,406 -> 10,965 words (pandoc plain; new section 3.7 and expanded Limitations); tectonic 0 errors, 26 pages.
- papers/svu_metoo_longitudinal_v2.tex: 8,266 -> 7,499 words incl. references; abstract 280 -> 150 words; tectonic 0 errors, 18 pages. Cuts: abstract compressed; Introduction paragraphs 1-5 tightened; Background 2.1 paragraphs 1-3, 2.2 paragraphs 1-3, 2.3 paragraphs 1-3 and 2.4 compressed; Method "Eras" and "Analysis and inference" tightened; Discussion 5.1 paragraphs 1-3 tightened and the truncation-bias paragraph removed (duplicated in Limitations), 5.2 paragraphs 1-3 tightened, 5.3 paragraphs 1-3 tightened, 5.4 compressed; Limitations paragraphs 1 and 3 tightened; Section 7 compressed; Acknowledgments tightened. No number, table or reference was removed.
- Compiled in the scratchpad only (double-anon rule: no PDFs added to papers/).
