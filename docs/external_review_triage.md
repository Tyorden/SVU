# External Review Triage: What's Needed vs What's Not

**Date:** July 12, 2026. An external reviewer read both papers in full (scores: flagship 7/10, longitudinal 6.5/10 as submitted, both "+~2 points if validated"). Their findings track our six-agent audit almost exactly, with several new points. This document is the authoritative to-do triage.

**Verdict summary:** Not acceptable as-is anywhere; clearly acceptable with revisions. The path is known and finite.

---

## 1. ALREADY HANDLED (no action)

| Item | Status |
|---|---|
| Census design, named-row specificity, transparency culture | Reviewer calls these the papers' core strengths — preserve through revisions |
| Timing honesty (S21 break, three rivals named) | Reviewer calls it Paper 2's best feature |
| Apology gradient framing | "Single best finding across both papers" — untouched |
| AI disclosure in acknowledgments | "Exactly what current journal policies want" — do not lose in revision |
| OSF copyright concern | Already our position: deposit coded records + codebook only, never the scraped transcripts |
| Transcript corruption discovery + corrected analysis set | Done (n=521, v2 stats) |

## 2. TEXT FIXES — APPLIED July 12 (this session)

| Fix | Paper | What changed |
|---|---|---|
| Apology-truncation direction | Flagship | Truncation is conservative for prevalence floors but can INFLATE the apology deficit (apologies live in final scenes; 33.7% of S1-18 transcripts lose endings). Limitations no longer waves this off; the within-dataset gradient is flagged as the robust version of the finding |
| Origin finding reframed as context | Flagship | "Squad inference leads" is partly definitional in a detective show; moral weight moved to severity, disclosure behavior, apology deficit |
| Pretraining-contamination caveat | Flagship | Model may recognize episodes and import fandom knowledge; named limitation |
| Speaker-attribution fragility promoted | Flagship | No speaker labels in transcripts; conduct/disclosure/apology fields are attribution-dependent; 83.9% disclosure flagged as most exposed number; validation commits to checking attribution |
| Fabrication claim vs noise rule | Longitudinal | 13.1%→5.5% is a 7.6-point swing, under the paper's own ~10-point noise threshold; argument now hangs on victim_ID doubling (15.2%→30.8%, above threshold) alone |
| Title overclaim | Longitudinal | Retitled: "The Retreat of the False Accusation Plot in Law & Order: SVU, 1999-2026"; abstract aligned; flagship cross-reference updated |

## 3. REQUIRED BEFORE SUBMISSION — TYLER'S LABOR (non-negotiable)

**3.1 The validation study.** The reviewer: "Krippendorff-style reliability isn't a nice-to-have in content analysis, it's the admission ticket." Updated spec incorporating their additions:
- 150-200 records (upgraded from 90 episodes), stratified, prioritizing severity, police conduct, and apology fields
- ALL 32 death rows and all 8 formal apologies (named in docs/svu_paper_stats_v2.md)
- **NEW: specifically check speaker attribution** (was the threat/disclosure/apology actually from police?) — the transcripts carry no speaker labels, so this is the instrument's most fragile inference
- Agreement statistics per variable (Krippendorff's alpha), disagreements adjudicated and error patterns documented
- Optional but strong: second human coder on a 30-episode subset

**3.2 Personal voice pass.** Read both papers aloud, revise by ear, keep your fingerprint.

## 4. REQUIRED BEFORE SUBMISSION — CHEAP, CLAUDE CAN DO ON REQUEST

**4.1 Repair the corpus and re-run the batch (~$20, one weekend).** The reviewer's sharpest new point: "your own affordability argument makes the exclusion look like a choice, not a constraint." Re-collect transcripts without the Excel 32,767-char cap (subslikescript or equivalent), fix the 9 corrupted slots, re-run all 576 episodes, re-generate the stats. Kills the truncation limitation entirely (it currently contaminates 25% of the corpus, concentrated in the era supplying 82% of records) AND the apology-deficit uncertainty from 2 above. Needs Tyler's go-ahead for API spend + scraping.

**4.2 Air-date join (~2 hours).** Wikipedia episode lists → air dates for all 576 episodes. Converts era blocks to event time, enables showrunner segmentation, directly addresses the S21 rivals. Reviewer: "leaving a two-hour data join as future work looks like avoidance."

**4.3 Metadata-stripped recode (Paper 2's load-bearing robustness check, ~$5).** Re-code a stratified subsample with season/episode/title removed from the prompt; compare era contrasts. If the severity spike survives blind coding, the era-correlated-drift objection dies. Reviewer: "must be in the paper, not in future work."

**4.4 Changepoint analysis on the per-season series.** Let the data locate the break at S21 formally instead of narratively. Small statistical add.

## 5. HIGH-VALUE OPTIONS (strengthen, not strictly required)

| Item | Effort | Value |
|---|---|---|
| Production-side triangulation for Paper 2: Warren Leight interviews, the Squadroom podcast, trade press on SVU's post-2020 choices | A few hours of research | TVNM reviewers will ask why the paper theorizes about a writers' room it never looked at; even one Leight quote on story selection is direct evidence for/against "deletion" |
| Comparison corpus: one season of another procedural (or the existing 314-episode L&O data as genre baseline) | L&O data already exists | Converts "SVU does this" into "SVU does this more/less than the genre" |
| Gender coding of the accused (inferable from names/pronouns in transcripts) | One re-pass or scripted heuristic + spot check | Reviewers will ask why gender wasn't coded when the data supports it |
| Coder self-consistency re-run (~$17) and cross-model check (~$2) | Trivial | Preempts reliability objections cheaply |

## 6. EXPLICITLY NOT NEEDED

| Item | Why not |
|---|---|
| LaTeX for initial submissions | All target venues take Word; CCR's template is post-acceptance only (.tex files exist anyway in papers/) |
| Full demographic/race coding before submission | Flagged as future work in both papers; gender-only is the cheap subset worth doing (see 5) |
| SocArXiv preprints | Its verbatim-AI-prose ban stands; OSF project page instead |
| Rewriting the papers' voice/structure further | The audits fixed the mechanical and structural tells; what remains is Tyler's personal pass, not more machine editing |
| Depositing transcripts anywhere | Rights problem; coded records + codebook only |
| More statistical tests on Paper 1 | It's a census description; the companion carries the inferential apparatus |

## 7. SEQUENCING (reviewer's priority order, adopted)

1. Human validation subsample with agreement stats, including speaker attribution (Tyler)
2. Repair + re-code the corpus (Claude, on go-ahead: ~$20)
3. Metadata-stripped recode for Paper 2 (Claude, on go-ahead: ~$5)
4. Air-date join (Claude, free)
5. ~~Fabrication/noise-rule fix + Paper 2 retitle~~ DONE July 12
6. ~~Origin reframe in Paper 1~~ DONE July 12
7. Paper 2 waits for Paper 1's submission (its method leans on the companion citation; reviewers dislike load-bearing cites they can't read)

**Venue note added by reviewer:** Journal of Broadcasting & Electronic Media is a third credible target for the flagship (most demanding on reliability); JCJPC softest landing; CMC best copaganda fit.

## 8. WEBSITE STATUS

Unaffected. The review's objections are publication-rigor issues (validation, inference discipline, framing), not data-accuracy issues. The live /findings page presents descriptive statistics from the corrected set with the corruption disclosure, makes no "worse outcomes" or fabrication-extinction claims, and already labels the death audit as adjudicated. If/when the corpus re-run (4.1) happens, the site data files get regenerated the same way the stats did.
