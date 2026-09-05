# VALIDATION ANCHORS (pre-registration) — blind re-coding reliability study, SVU / L&O coding
Written 2026-09-04 22:3x PDT by subagent #162 (Claude Fable 5.1) BEFORE any episode was re-coded.
Append-only. Anything decided after the re-coding starts is a dated addendum below the line "RESULTS
ADDENDA", never an edit above it.

## 0. What this is and what it is not (plain statement for Tyler)
Both manuscripts promise a ~90-episode HUMAN validation of the AI coding (PAPER_BUILD_LOG gate 1). A
human validation cannot be run by Claude: the point of that study is a second, independent, human
judgment, and no amount of AI work produces one. The main session therefore chose the honest
alternative that CAN be run today: an INDEPENDENT BLIND RE-CODING RELIABILITY STUDY. A second AI
coder (this agent, Claude Fable 5.1, a different model from the original claude-sonnet-4-5-20250929)
re-codes a random 90-episode sample from the same source transcripts the original run used, without
seeing the original codes, following a freshly written protocol that restates the same codebook.
Agreement between the two coders is then measured field by field (percent agreement, Cohen's kappa,
bootstrap 95% CI). This measures the REPEATABILITY of the instrument reading, not its truth. It does
not validate the coding against a human standard and the papers will say so: human validation
remains a limitation and future work. Both coders are Anthropic models, so this is also not a
cross-vendor check; the manuscripts' disclosure sentence about a "non-Anthropic model" cross-check
is rewritten to say that check has not been done.

## 1. Source material (checked before writing this file)
- SVU: /Users/tylerorden/Downloads/Law and Order SVU all Transcripts.xlsx, Sheet1, columns URL, Title,
  intro, text, Season, Episode. 576 episode rows (S1 22, S2 21, S3 23, S4 25, S5 25, S6 23, S7 22,
  S8 22, S9 19, S10 22, S11 24, S12 24, S13 23, S14 24, S15 24, S16 23, S17 23, S18 21, S19 24, S20 24,
  S21 20, S22 16, S23 22, S24 22, S25 13, S26 22, S27 3). 4 rows have empty text (S14E01, S14E02, S15E01,
  S17E01). 147 rows sit at or near the 32,767-character Excel cell cap (truncated endings). This is
  the exact input the January 2026 batch run read (SVU_False_Accusation_Project_Documentation.md,
  "Data Source"), so the re-coder sees the same text the original coder saw, truncation included.
- L&O: /Users/tylerorden/Desktop/LO/lo_batch_input.jsonl, 314 request bodies, each carrying the full
  user message "Analyze this Law & Order episode transcript ... === TRANSCRIPT START === ... END ===".
  No transcript body under 2,000 characters. This is byte-for-byte what the L&O batch run read.
- Sufficiency verdict: SUFFICIENT. The kill criterion "only the original coded output exists" is
  not met. The re-coder reads transcripts, never the coded output.
- Codebook: the SVU system prompt in SVU_False_Accusation_Project_Documentation.md ("The Tagging
  Prompt") and the L&O prompt at /Users/tylerorden/Desktop/LO/tagging_prompt.txt. The re-coding uses the
  SAME controlled vocabulary (a reliability study measures whether the same rubric is applied the
  same way); the PROCEDURE and wording of the protocol are written fresh (CODING_PROTOCOL.md).
- Known codebook gap: the SVU output data carry three person-level fields (preexisting_allegation,
  accusation_mode, audience_present) that the documented SVU prompt does not define. Their
  definitions are not on record, so they are NOT re-coded (neither manuscript uses them; only
  docs/new_analyses.md mentions them).

## 2. Sampling design (fixed before drawing)
- Sample size 90 = 60 SVU + 30 L&O. Rule: the two manuscripts are SVU-only, so SVU takes two thirds;
  L&O is included because the program's dataset and dashboard report both series. Paper-facing
  statistics are reported for the SVU 60 alone AND for the pooled 90.
- SVU frame (episodes eligible to be drawn): the 576 workbook episodes MINUS
  (a) the 9 wrong-transcript episodes excluded from the papers' 567 denominator (S01E13, S02E11,
      S02E18, S04E10, S05E04, S05E14, S08E11, S09E19, S11E09);
  (b) the 5 episodes with no usable source text (S14E01, S14E02, S15E01, S17E01 empty; S06E09 Greek
      encoding);
  (c) CONTAMINATION EXCLUSIONS: every episode about which this agent saw episode-level coded
      information while reading the orientation documents (the death-audit rows, guilty exclusions,
      phantom-row table, normalization rows, and the first JSONL record). A blind re-code of these is
      impossible for this coder, so they are removed from the frame and listed here in full:
      S01E01, S01E04, S01E08, S01E12, S01E15, S02E08, S02E10, S02E19, S03E01, S03E04, S03E19, S04E05,
      S04E13, S04E21, S04E23, S05E05, S05E11, S05E23, S06E14, S06E15, S06E19, S06E20, S09E08, S10E02,
      S10E06, S10E20, S11E13, S12E03, S12E10, S12E12, S12E15, S12E19, S13E09, S13E17, S15E03, S15E09,
      S15E11, S15E13, S15E17, S16E13, S17E05, S17E17, S18E02, S18E08, S18E10, S18E17, S19E07, S20E09,
      S20E13, S20E20, S20E21, S21E05, S21E06, S22E07, S22E10, S26E08, S26E19.
      Consequence, stated plainly: the 32 death rows and the 8 formal-apology rows that the build log
      named as the priority sample are mostly in this list and are NOT in this study. They were
      already adjudicated row-by-row against the transcripts in July 2026 (stats_v2 §A9); a blind
      re-code of them by this coder is not possible. That is a limitation of this study, recorded here.
- SVU strata (the papers' eras): pre-#MeToo S1-18; #MeToo era S19-21; post-2020 S22-27. Allocation
  of the 60 proportional to frame stratum size, largest-remainder rounding, minimum 5 per stratum.
- L&O frame: the 314 coded episodes MINUS lo_s01_e01 (its person-row count was seen during
  orientation). Strata by run: seasons 1-9 (1990s), seasons 11-20 (2000s), seasons 21-23 (revival).
  Allocation of the 30 proportional, largest remainder, minimum 3 per stratum.
- Random draw: Python random.Random(20260904), random.sample over the SORTED custom_id list of each
  stratum. A replacement list of 5 further episodes per stratum is drawn in the same call; a sampled
  episode is replaced (next unused replacement in its stratum, logged) only if its transcript turns
  out to be empty, non-English, or a different show's script. Script: sample.py in
  docs/validation_2026-09-04/ (deterministic; re-running reproduces sample.json byte for byte).
- Truncated transcripts stay in the frame: both coders read the same truncated text.

## 3. Fields re-coded and the comparison unit
Episode level (unit = episode, all 90): has_false_suspect (Y/N/Maybe), has_public_exposure (Y/N/Maybe).
Person inclusion (unit = episode): the set of qualifying persons. Reported as (i) per-episode
person-count exact agreement, (ii) pooled Jaccard overlap of matched persons, (iii) counts of
persons found by only one coder.
Person level (unit = matched person pair): innocence_status, role_in_plot, accused_of,
accusation_origin, exposure_channel, exposure_who_told, consequence_category, consequence_severity
(1-4), police_conduct_threat, police_apology, screen_evidence, confidence; L&O only:
prosecutorial_conduct, prosecutorial_apology. Derived binaries the papers actually use:
any_threat (police_conduct_threat != none), any_apology (police_apology in partial/formal),
severe (severity 3-4), media_or_online exposure. Free-text fields (consequence_detail, quotes, tags,
notes) are recorded but not scored.
Vocabulary normalizations applied to BOTH sides before scoring, exactly as stats_v2 does:
victim_misID -> victim_ID; third_party (as an origin) -> witness_misID; kidnap spellings -> kidnapping.
Person matching rule (applied after unblinding, by script then by hand): within an episode, an
original row and a re-coded row match if they share a surname or first name (case-insensitive
token match) or, for unnamed persons, the same role descriptor; one-to-one; residual ambiguous
cases are adjudicated by hand and every hand match is listed in the results file.

## 4. Statistics (pre-declared)
- Percent agreement per field.
- Cohen's kappa (unweighted) per field; for consequence_severity also linear-weighted kappa.
  Kappa is reported as undefined (percent only) when both coders use one category.
- 95% CI: cluster bootstrap over EPISODES (resample the 90, or the 60 SVU, with replacement; B = 2000;
  seed 20260904; percentile interval). Pure-Python implementation, deterministic, exit 0.
- Reported for SVU-only (paper-facing) and pooled (SVU + L&O).
- Every disagreement listed with both codes and a one-line adjudication note. The original data
  files are NOT changed by adjudication; notes are for the reader.

## 5. Interpretation bands (pre-declared; Landis and Koch 1977 labels)
kappa >= 0.81 strong ("almost perfect"); 0.61-0.80 substantial; 0.41-0.60 moderate; 0.21-0.40
fair; <= 0.20 slight or none. Decision rule for the manuscripts: any field with kappa below 0.61
(point estimate) is named in Limitations as a low-reliability field, and any headline claim resting
on it is flagged in the text where it appears. Percent agreement is reported alongside because
several fields are highly skewed (kappa is depressed by prevalence).

## 6. Blind protocol (how the original codes stay out of the re-coder's context)
1. sample.py writes sample.json (ids and strata only) and extracts each sampled transcript to
   /private/tmp/claude-501/-Users-tylerorden-Desktop-SVU/2b6a75c5-654e-4357-957c-ab65c6d4af4a/scratchpad/validation/transcripts/<custom_id>.txt
   (scratchpad, not the repo: transcripts are copyrighted and the repo is public). The header of
   each file carries only series, season, episode and title, which the original coder also had.
2. The re-coder reads ONE transcript per Bash call (cat of that file) and appends ONE JSON line to
   docs/validation_2026-09-04/recoded.jsonl before opening the next transcript. No command in the
   re-coding phase reads svu_analysis_complete_fixed.jsonl, lo_analysis_complete.jsonl, any
   *_persons_harmed.csv, *_episodes_summary.csv, svu_paper_stats_v2.md, or papers/*.
3. agreement.py refuses to run (exit 2) unless recoded.jsonl holds all 90 sampled ids; only then
   does it open the original files. The unblinding moment is therefore the first agreement.py run,
   and the git history / file mtimes show recoded.jsonl complete before that run.
4. Orientation reads that already exposed episode-level information are handled by frame exclusion
   (section 2c), not by pretending they did not happen.
5. If context compaction happens mid-run, PROGRESS.md in the validation folder is the resume point;
   it never contains original codes.

## 7. Kill criteria
- K1 (source insufficiency): if the source files above could not be read, or a sampled transcript
  were the only material and the coded output had to be consulted, STOP and report. Status: not
  triggered (section 1).
- K2 (blindness breach): if an original code for a sampled episode enters the re-coder's context
  before its line is written, that episode is dropped from the scored set and replaced from the
  replacement list; the breach is logged in PROGRESS.md and in the results file.
- K3 (coverage): fewer than 90 episodes coded is reported as such, never padded.

## 8. Outputs
docs/validation_2026-09-04/: sample.py, sample.json, CODING_PROTOCOL.md, PROGRESS.md, recoded.jsonl,
agreement.py, agreement_results.json, disagreements.md; docs/VALIDATION_RESULTS_2026-09-04.md; dated
addenda to svu_paper_stats_v2.md, PAPER_BUILD_LOG.md, VERIFICATION_INDEX.md; papers/*_v2.tex.

---
RESULTS ADDENDA (dated, append-only; nothing above this line changes after the draw)
- 2026-09-04 22:30 PDT DRAW RECORD (sample.py run twice, sample.json md5 710da4d224db3ad22676b7255f24347c both times).
  Frame sizes: SVU pre 350, #MeToo 61, post 94 (505 eligible of 567); L&O 1990s 185, 2000s 93,
  revival 35 (313 of 314). Allocation: SVU 42/7/11 = 60; L&O 18/9/3 = 30. 41 of the 90 sampled
  transcripts sit at the Excel cap (truncated endings), same text both coders read. Transcripts
  extracted to the scratchpad (120 files incl. replacements). Re-coding starts now.

## RESULTS ADDENDUM (2026-09-04 23:33 PDT)
All 91 ids coded blind (90 scored + svu_s07_e15 flagged as a duplicate transcript and replaced by svu_s05_e17 per section 2). Unblinding = first agreement.py run at 23:20 PDT after the PROGRESS.md "ALL 91 CODED" checkpoint. Results: docs/VALIDATION_RESULTS_2026-09-04.md. SVU-only: has_false_suspect kappa 0.467 [0.267, 0.662], has_public_exposure 0.470 [0.241, 0.694]; person Jaccard 0.467 [0.337, 0.600]; person-level kappas 0.096 (who_told) to 0.509 (severity, weighted); derived any_apology 0.718 and media_or_online 0.624 with CIs [0, 1]. Decision rule (section 5) applied: all raw fields named as low-reliability in the v2 manuscripts. Kill criteria K1-K3 not triggered. No hand person-matches were needed (52 automatic pairs, all verified the same person). Deviation log: none from sections 2-6; one addition, the tenth wrong-transcript episode (svu_s07_e15) was discovered during coding and handled by the pre-registered replacement rule.
