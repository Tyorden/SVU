# Revision Specification: Audit Fixes for Both SVU Papers

**Date:** July 5, 2026. Compiled from four independent audits (replication, hostile peer review, prose/human-voice, citation verification). This spec drives the revision pass; the death-audit final numbers come from the transcript-adjudication report and are inserted at revision time.

Papers: `papers/svu_flagship_paper.md` (F), `papers/svu_metoo_longitudinal.md` (L).

---

## 1. NUMBER CORRECTIONS (replication audit)

1.1 **[F, CRITICAL] Death audit is incomplete.** Rebuild §4.8 and Table 9 from the adjudication report's final numbers (Torres S21E06 in; Newlands S05E05 adjudicated; Spevak S05E23 adjudicated; suicide attempts include Logan S05E03 and Bennett S18E15; Kevin Wright's attempt is in tags, not notes-only; Connor/Vega named as ideation-only exclusions; non-fatal count rebuilt with Curtis/Roberts/Eglee/Gonzalez/Guarana/Bolton adjudicated; Loveless and Dussault added to the named-exclusions list). Update every downstream mention: abstract, §1 headline, §5.1, §7, episode count, % of 576, apologies-among-deaths. Present the audit as it now is: rule-driven, every borderline named with its ruling. This strengthens the paper; say plainly that an earlier pass missed rows and the rules were tightened.

1.2 **[L, MAJOR] §5.3 "triple the rate"** → the true ratio is 2.1x (58.2% vs 27.7%); per-episode dose 1.7x. Say "roughly double."

1.3 **[F, MAJOR] The 87.3% publicity claim.** 468/536 is the raw `exposure_who_told=squad` share, but 141 of those are police_only rows. Among the 389 persons exposed beyond the precinct, the squad disclosed in 327 (84.1%; 61.0% of all 536). Fix §4.5 and §5.3 (and the abstract if it carries the publicity framing): squad is the discloser in 84.1% of cases where the accusation actually spread.

1.4 **[L, MINOR] air_date claim**: 121 of 576 episodes in the raw JSONL carry air dates (mostly early seasons); the analysis CSVs have none. Reword "blank throughout" accordingly; season blocks remain the design.

1.5 **[L, MINOR]** Season-cell range after S14 is 3–18 (not "3 to 20"; 20 is S14 itself).

1.6 **[F, MINOR]** Hernandez: `mother_sister_murdered_while_wrongly_imprisoned` is in consequence_detail; the tag variant is `mother_and_sister_murdered`. Fix the wording.

---

## 2. LOGIC / METHODS FIXES (hostile review)

2.1 **[L, BLOCKER B3] The timing story.** The per-season series contradicts a fall-2017 break: S19 = 54.2% and S20 = 62.5% sit at/above the late pre-era plateau (S14–18: 47.8–54.2%); the drop is Season 21 (30.0%), Warren Leight's first season back, ending in COVID shutdown. Required changes:
- Make the per-season series the primary evidence in §4.1; state plainly that the break lands at Season 21, not at the S18/S19 boundary.
- Promote the Leight-return and COVID-production explanations from aside to live rival hypotheses alongside the #MeToo account; the honest claim is that the retreat arrives within the #MeToo era but two years into it, and the era blocks cannot separate movement effects from showrunner and pandemic effects.
- Rewrite abstract, intro ¶3, §5.1, and §7 to drop any "the show responded to October 2017" causal timing; keep the defensible claim (the configuration of the show changed across the #MeToo boundary; both backlash and reform predictions fail regardless of which driver dominates).
- Retitle: replace "after #MeToo" framing with era-neutral phrasing. New title: "Fewer Accusations, Worse Outcomes: The Retreat of the False Accusation Plot in Law & Order: SVU, 1999–2026". Fix "the density halved at the #MeToo boundary" (§4.1) — false at the boundary.

2.2 **[Both, BLOCKER B4] Inference philosophy contradiction.** F says "no significance tests" for a census; L runs chi-squares. Align: L keeps the tests but adds an explicit two-to-three-sentence justification in §3 (the stochastic-authorship/superpopulation view: each season is one draw from the writers'-room process; the tests guard against reading noise in small cells) AND a clustering caveat (persons cluster within episodes; person-level tests are indicative, episode-level tests are primary). F softens its §3.6 sentence: proportions without tests for the census description, noting the companion uses tests for era contrasts under an explicitly stated stochastic-process view. Report exact p-values in L: chi2=21.61 p=.00002; 25.11 p<.001; 8.09 p=.018; 5.10 p=.078. Add a one-sentence multiple-comparison note (four planned tests, results unchanged under any correction for the two significant ones... verify: .018*4=.072 Bonferroni — the severity test does NOT survive Bonferroni; say so honestly: "the severity contrast would not survive a Bonferroni correction across the four tests; I treat it as suggestive").

2.3 **[L, BLOCKER B5] Severity-paradox censoring rival.** The inclusion rule censors on harm (a person needs exposure/physical consequence to be a row). A reformed show that kept suspecting but stopped exposing would mechanically produce fewer rows at higher conditional severity. Add this as a named rival to "deletion" in §5.1, and use the discriminating evidence from the adjudication report (persons-per-flagged-episode by era; episodes flagged Y with zero person rows by era). Present deletion and reform-censoring as both live, with whatever the numbers support.

2.4 **[Both, from B1] Validation honesty upgrade.** Add to both papers' limitations: the measured instruction-violation signal on checkable fields (5 prohibited actually_guilty rows, out-of-vocabulary origin values, undocumented accused_of values, markdown fences despite instruction) implies nonzero error on uncheckable fields; the planned validation study is therefore a requirement for confidence, not a formality. F should also drop "the instrument could never drift" overstatement (batch independence prevents sequential contamination, not stochastic variance).

2.5 **[Both, from B2] Quote verification.** Implement the adjudication report's quote verdicts: keep VERBATIM quotes; for NEAR quotes, replace with the transcript's actual wording; for NOT FOUND quotes, remove or replace with a verified quote. Then add one sentence to each Method: all quoted dialogue was verified against the source transcripts.

2.6 **[Both, M1] Unit of analysis.** Rename: rows are person-episodes. Report both counts (536 person-episodes; unique persons from the dedup in the adjudication report). Fix "541 harmed persons" phrasing in F abstract and wherever the unit is named.

2.7 **[L, M2] Era-differential coder bias limitation.** The coder saw season/episode metadata and carries pretraining knowledge of SVU and #MeToo; drift could be era-correlated, which is the axis the paper measures. Add to limitations with the proposed test (re-code a subsample with metadata stripped).

2.8 **[L, M3] Transcript-thinning check.** Insert the words-per-episode-by-season result from the adjudication report: if later-era transcripts are not systematically shorter, say the retreat is not a transcript artifact; if they are, add as limitation.

2.9 **[L, M4] U-shape epistemic status.** One hedge, stated once: exploratory, pooled test n.s., block pattern sharp. Abstract and §7 must match §4.4's caveat (currently §7 un-hedges). Remove the untested "statistically indistinguishable from the Stabler-era plateau" phrasing or mark it descriptive.

2.10 **[L, M5] Bound the "worse outcomes" claim.** The above-noise severity rise is S19–21 (82.1%, n=39); post-2020 (67.3%) is within the paper's own noise rule vs 60.0%. Abstract/discussion phrase: severity rose sharply during the #MeToo-era seasons and settled at a level no milder than baseline. Keep title's "Worse Outcomes" tied to that window explicitly in the abstract.

2.11 **[F, M6] Media multiplier reframing.** Exposure channel and severity are co-authored by the same scripts; narrative prominence is a confound. Reframe §4.5/§5.3 from causal ("publicity is the accelerant") to dramaturgical (the show pairs media exposure with catastrophe), with one sentence naming the confound. Keep the 5.2x number.

2.12 **[Both, M7] Cultivation verb discipline.** Swap absorption/teaching verbs for exposure/availability verbs outside the explicitly disclaimed passages: F §1 "has absorbed" → encounters; F §5.4 "teaches two miscalibrations" → makes available / rehearses; F §7 "civic education" → soften; L §5.4 "plausibly cultivated exactly the skepticism" → rephrase as exposure claim. Keep each paper's one explicit message-system disclaimer; stop whipsawing.

2.13 **[L, M8] False-report vs false-suspect funnel.** L §5.4 currently conflates SVU's suspect base rate with Lisak's false-report rate. Apply F's funnel language: a false suspect (mostly squad-generated) is not a false report; the Lisak comparison holds only for the fabrication subset.

2.14 **[Both, M9] Cross-paper alignment.** F §5.1 "wounds them just as badly" vs L "worse outcomes": align F's sentence to "no milder, and during the #MeToo-era seasons measurably worse (see companion)". Fix the companion-citation titles in both directions to the actual working titles.

2.15 **[Both, M10] Vignette exclusivity.** Assign: F keeps Hernandez, Adelson, Prasada, Byers, Ramsey/Ramsay, Jones; L keeps Liston, Soto, Fierro, Alberto-revisit, Harvey. Remove the duplicated showcase usages (esp. Liston's "Better hope she shows up. Alive" and Hernandez "sayonara syringe" — each appears in exactly one paper after revision). Cut F §5.1's era commentary to two sentences (it currently publishes L's headline series).

2.16 **[L, M11] Self-containment.** Add the codebook essentials to L (a compact Method paragraph: North Star criteria, the severity scale anchors, origin vocabulary) plus "the full codebook accompanies the submission as supplementary material" in both papers.

2.17 **[Both, M12] Missing literature.** Add, with these verified details:
- Krippendorff, K. (2019). Content Analysis: An Introduction to Its Methodology (4th ed.). Sage. [cite in Method re reliability norms]
- Neuendorf, K. A. (2017). The Content Analysis Guidebook (2nd ed.). Sage.
- Gilardi, F., Alizadeh, M., & Kubli, M. (2023). ChatGPT outperforms crowd workers for text-annotation tasks. PNAS, 120(30), e2305016120.
- Törnberg, P. (2024). Large language models outperform expert coders... — cite cautiously as: Törnberg, P. (2023). ChatGPT-4 outperforms experts and crowd workers in annotating political Twitter messages with zero-shot learning. arXiv:2304.06588. Mark [VERIFY] if used beyond this detail.
- Ziems, C., Held, W., Shaikh, O., Chen, J., Zhang, Z., & Yang, D. (2024). Can large language models transform computational social science? Computational Linguistics, 50(1), 237–291.
- Cuklanz, L. M. (2000). Rape on Prime Time: Television, Masculinity, and Sexual Violence. University of Pennsylvania Press.
- Projansky, S. (2001). Watching Rape: Film and Television in Postfeminist Culture. NYU Press.
- Hust, S. J. T., et al. (2015). Law & Order, CSI, and NCIS: The association between exposure to crime drama franchises, rape myth acceptance, and sexual consent negotiation among college students. Journal of Health Communication, 20(12), 1369–1381. [Use in F §5.4 and L §5.4: audience studies of SVU exist and complicate straight-line message-to-belief readings — Hust et al. found SVU exposure associated with lower rape-myth acceptance; reception can diverge from message system.]
Placement: LLM-annotation cites in the Method (the validation norms exist and the study is positioned within them); Krippendorff/Neuendorf in Method; Cuklanz 2000/Projansky in the SVU/genre lit paragraphs; Hust in discussion.
2.18 **[L, M13] Bernabo/Color of Change split.** Bernabo (2022) documents varied 2020–21 responses, not a softening prediction; let Color of Change carry the reform prescription and cite Bernabo for the varied-response finding, both places it occurs (§2.3, §5.3).

2.19 **[F, M14] Tag counts demoted.** §4.2's tag paragraph (teenagers, cops, teachers, doctors, immigrants): mark the tags as coder-generated free vocabulary, unaudited; counts are indicative, not audited claims.

2.20 **[F, M15] Deep-review honesty.** One sentence: the 16 flagged episodes have not yet been individually re-reviewed; 4 are the transcriptless ones; the rest are queued for the validation pass.

2.21 **[Both, minor batch]** Fix: the ordinal-mean note (report medians alongside 2.72 / 2.67→3.05 or add "treating the scale as interval for summary only"); L "replicates" → "persists"; L S25–27 tail fragility note (S27 is 3 episodes); F 62.3% coincidence sentence (episode rate Y+Maybe vs severity share — flag the coincidence); F "Related," sentence opener; F "leakage occurred" → name the actor; L "the eras index" garden path; L "Nothing else in the dataset moves this early" contradicts the S15 coercion dip — fix to acknowledge; circularity sentence in both acknowledgments (Claude coded the data and drafted the text; a non-Anthropic model is planned for the validation cross-check); F data availability → "deposited with the OSF project at submission" (planned); F codebook internal conflict note (Rules line vs partially_involved vocabulary — name it as a documented instrument defect).

---

## 3. PROSE FIXES (human-voice audit)

3.1 **[L, CRITICAL] The broken sentence.** §5.2: "accusers do lie on this show anymore only rarely; accusers err." Rewrite by ear.

3.2 **[Both] Break the closure metronome.** Keep the three best section-ending aphorisms per paper (suggested F: "That is the complete list," the match/accelerant line [rewritten per 1.3], "What follows it, on SVU, is the next case."; suggested L: "Its brand was belief.", "it is the blocks I trust", the final two-sentence close). Every other section ends on its last plain fact, mid-register. Cut or flatten the listed epigrams (F: lines at §2.2, §2.3, §4.2, §4.4, §5.1 x2, §5.3, §5.4; L: §4.1, §4.2, §4.3, §4.4, §5.1, §5.4).

3.3 **[Both] Price each number once.** Delete F intro headline-stats paragraph (keep only the death-audit sentence) and F's table recitals in §4.3, §4.4, §4.5, §4.6, §4.7 (one finding sentence per table). Delete L intro ¶3's full-precision recital (keep the frame and one-clause versions); trim §4.4's five-value whipsaw recital to the two anchor values plus pointer to Table 4 note; cut §4.3's remaining-categories loop-close; cut L §7 ¶1 (fifth thesis statement).

3.4 **[Both] Desynchronize the twins.** Rephrase one member of each shared-idiom pair: "more or less continuously", "was airing at collection time", "guilty of something else and innocent of the accused offense", the 97%-confidence sentence, the four-limb question mold. Break the shared case-listing frames: F §4.6's five "In SxxEyy, X verbs Y" sentences and §4.8's five "Name (code) is [passive]" sentences get varied openings; same for L §4.2's two three-packs. Vary 2-3 of the eight "apologizes to" frames in F §4.7.

3.5 **[Both] Tics.** Reduce "exactly/precisely" to ≤2 per paper, "genuinely" to ≤1, kill "definitively", "for the first time with precision", "relentlessly", "comfortably above", one of the two "honest" self-certifications in L and "the honest position" collision in F. Cut metadiscourse announcements to ≤2 per paper ("deserves defense/mention/a hearing", "worth naming", "wants explaining").

3.6 **[Both] Structure.** Allow 2-3 single-sentence paragraphs where content earns it (F: orphan "This study counts."). L results headings: break the "The X" template (rename at least two, e.g., §4.5). F: trim §2.2's duplicated copaganda point; consolidate §3.2/3.3/3.5's triple instrument-defense to one statement each; cut §4.6 block quotes from five to the two strongest (keeping quote-verification verdicts in mind); trim §4.8's assault paragraph, keep the deaths roll call. L: §4.4 hedge once; §5.4 cut the second "curriculum" paragraph by half.

3.7 **[Both] Read-aloud stumble list.** Fix all 20 listed stumbles (10 per paper) from the prose audit: F abstract bookkeeping sentence, "never yet quantified" tail, "reproduced verbatim" list parse, 55-word §1 sentence, "domain is most often plural", Belyakov prepositional stack, nested parenthetical at §4.8 total, "Related," opener, "leakage occurred", 28-word subject sentence; L broken sentence, Alberto parenthetical capsize, person-vs-baseline category slip, 60-word Method sentence, gerund-subject sentence, "the eras index", "coincidence in the other direction", Ferguson appositive ambiguity, four-limb 80-word sentence, "comfortably above conventional adequacy thresholds".

3.8 **[F] Title.** Drop "A Systematic Content Analysis of" template: "Collateral Damage as Narrative Convention: False Accusation and Its Costs Across 27 Seasons of Law & Order: Special Victims Unit".

---

## 4. CITATION FIXES (verification audit)

4.1 **[F] Dowler (2003) rewrite:** crime-drama viewing was weakly linked to fear of crime and NOT related to perceived police effectiveness in Dowler's own conclusion (bivariate direction negative). Fix the sentence to what the study found.
4.2 **[F] Kort-Butler & Sittner Hartshorn (2011) rewrite:** crime dramas predicted death-penalty support via a path not mediated by fear; nonfiction crime programming eroded system support via fear. Fix the findings clause AND the in-text surname (Sittner Hartshorn).
4.3 **[L] Manne 2018 → 2017** (reference list + both in-text).
4.4 **[F] Karakatsanis:** "popularized the term" (not coined/named), and the book targets news coverage — drop "and entertainment alike" or qualify.
4.5 **[F] NRE URL** → exonerationregistry.org.
4.6 **[Both] Eschholz et al.:** keep 2004 but verify against PDF masthead at venue-conversion time (journal archive says 2003) — add no change now, note for submission checklist.
4.7 **[Both] Align companion citations:** L cites the flagship as "One Per Episode: The Anatomy of..." — replace with the flagship's actual title; F's forward reference to the companion uses L's actual title.

---

## 4B. SOURCE-CORRUPTION DISCOVERY (transcript ground-truth audit, July 5) — SUPERSEDES PARTS OF SECTIONS 1-2

The transcript audit found the source Excel itself is corrupted in ways the coding inherited:

- **9 episodes carry the wrong transcript** (duplicate of another episode's script): S01E13 (contains S01E15 'Entitled'), S02E11 (S02E10), S02E18 (S02E19), S04E10 (S04E23), S05E04 (S06E14), S05E14 (S12E10), S08E11 (S18E08), S09E19 (S26E19), S11E09 (S26E08). These created **15 phantom person-rows** (Mulroney S01E13; Harry/Templeton/Ludlow S02E11; the six S02E18 rows; Sirett S04E10; Tauber S05E04; Norton S08E11; Pinto+Alberto S09E19).
- Consequences for claims: Father Alberto dies ONCE (S26E19; the S09E19 "revisit" is an artifact — both papers currently say otherwise); the Mulroney two-episode apology is an artifact (one apology, 'Entitled', coded twice); Tauber's suicide belongs to S06E14; defective source episodes number **14** (4 empty + 1 encoding + 9 wrong-transcript), not 5.
- **145/576 transcripts (25.2%) truncated at exactly 32,767 characters** (Excel cell limit); 138 of 145 in S1-18 (33.7% of that era) vs 2 (S19-21) and 5 (S22-27). Direction: undercounts early-era harm/apologies → the documented decline is conservative; must be disclosed in both papers' Method/Limitations.
- Transcript length by season shows NO downward era trend (era means 5,682 / 5,381 / 5,662 words) → the retreat is not transcript thinning; L §M3 gets this affirmative sentence.
- Unique persons: 536 person-episode rows − 15 artifacts = **521 distinct measurements**; 8 further rows are genuinely recurring persons (Amaro x3, Stabler x2, Cassidy x2, Tucker x2, Marsden x3, Lomatin x2) → **~513 unique persons**.
- Death audit FINAL (supersedes §1.1 numbers): **21 murdered** (incl. Newlands; Alberto once; 2 in custody; 1 killed by police: Reynolds S17E05), **9 suicides**, **2 other deaths** (Tate overdose; Torres AIDS) = **32 dead across 31 episodes (5.4% of 576)**; apologies among the dead **5/32**; suicide attempts **8** (all structured; Wright is tags not notes-only; Logan/Bennett/Connor/Vega/Walker excluded with named reasons); non-fatal attacks **28 structured + 3 notes-only** (Bolton added; Guarana excluded entirely as a dataset inclusion error — she was never accused; police shootings: 4 wounded + 1 fired-upon + 1 fatal under murders).
- Harm-censoring discriminator (B5): within Y-flagged episodes, persons/episode fall 1.64 → 1.15 → 1.34 and zero-person Y-episodes rise 4.8% → 11.8% → 7.3% — a mild censoring signal in S19-21 on 4 of 34 episodes; the retreat is overwhelmingly carried by the episode-level flag. Use these numbers in L §5.1.
- Quote fixes: Pena/Benson S13E17 clause order is reversed in the transcript AND the scene is a private conversation, not a courtroom confession (only the judge's apology is in court) — fix the flagship's framing; Jerome Jones S16E13 victim lines resequenced — restore transcript order; Mulroney apology has a spliced-out reply ("All right.") — quote cleanly; Hernandez quote starts "Because Monte..." not "Detective Monte..."; Liston quote has leading "Oh,". Speaker attributions are NOT transcript-verifiable (no speaker labels) — where a speaker is named, soften to what the scene supports or keep only if uncontroversial from context.
- **ALL analyses in both papers move to the corrected analysis set (n=521; 9 corrupted episodes flagged/excluded at episode level)** per the recompute report (svu_paper_stats_v2). The papers narrate this as a strength: the audit found source corruption that a naive pipeline would never catch, and the findings survive it.

## 5. VERIFICATION AFTER REVISION

- Re-run mechanical audits (em/en dash, banned words, negation, wrap-ups) — zero hits required.
- Re-check every changed number against the adjudication report and svu_paper_stats.md (death-audit numbers now come from the adjudication report, which supersedes svu_paper_stats.md's Section A9).
- Verify no [VERIFY] tags remain.
- Cross-paper grep: shared idioms from 3.4 no longer identical.
- Word counts: F target ≤ 8,000 body after cuts; L target ≤ 6,300.
