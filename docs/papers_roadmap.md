# Publication Roadmap: Law & Order Franchise False Accusation Research

**Prepared:** July 4, 2026 · **Updated:** July 5, 2026 (see Addendum)
**Author of record for all papers:** Tyler Satchel Orden, Independent Researcher
**Datasets:** SVU (576 episodes, 541 persons), original L&O (314 episodes, 429 persons), combined (890 episodes, 970 persons, 1990-2026)

---

## ADDENDUM (July 5, 2026): Policy news and the SVU-first track

**1. Venue AI policy resolved in Tyler's favor.** Tyler contacted the candidate journals directly; all confirmed privately that AI may draft the manuscript in first person, provided the prose does not read as AI-generated. This moves every venue to effective Mode B. Consequences:
- The rewrite-from-memory requirement is lifted for journal submissions; the human-voice style law (guide Parts 2-3: no AI tells, banned words, varied rhythm) remains binding since "must not sound like AI" is now the explicit acceptance condition.
- Keep the private correspondence on file per the guide Part 7; acknowledgments must still disclose Claude's drafting role accurately.
- SocArXiv's public ban on verbatim AI prose still stands for PREPRINTS. Options: post preprints to the OSF project page itself rather than SocArXiv, or hold preprints until the prose passes Tyler's own revision. Decide per paper.

**2. SVU-only papers unblocked.** The L&O transcript-truncation re-run blocks only the franchise-wide papers. The SVU dataset is complete (576/576 episodes, 2.8% deep-review rate), so SVU-only papers proceed immediately. Two are now drafted in `papers/`:
- `papers/svu_flagship_paper.md` — "Collateral Damage as Narrative Convention" (SVU flagship, revived from the docx with corrected statistics; target Crime, Media, Culture)
- `papers/svu_metoo_longitudinal.md` — the era analysis (retreat post-#MeToo, severity paradox, coercion U-shape; target Television & New Media)

The franchise flagship (Paper 2 below) remains the long-term centerpiece and still requires the L&O re-run; the SVU flagship supersedes the "do not submit the SVU docx separately" advice below, which was written when the franchise paper was the only flagship. The methods/validation paper (Paper 1 below) is unchanged and still gates on the validation study.

**3. Statistics corrected.** `docs/svu_paper_stats.md` is now the single source of truth for all SVU numbers. Key corrections vs the old docx: n=536 after excluding actually_guilty rows; verified deaths are 21 murdered + 9 suicides + 1 overdose (the docx's "31 murders, 21 suicides" was keyword-inflated); squad_inference leads normalized origins at 55.0%; any-apology rate is 7.6% (41/536) with formal apologies at 1.7% (9 cases).

---

## 1. Executive Recommendation

Write **three papers, in this order**. Kill or fold the other seven brainstormed concepts.

| # | Paper | Target venue (primary) | Backup | Submit |
|---|-------|------------------------|--------|--------|
| 1 | **Methods/validation paper**: "LLM-Assisted Content Analysis at Scale: Coding 890 Episodes of Television for $30" | *Computational Communication Research* (no APC, free) | *Communication Methods and Measures* (Taylor & Francis) | Month 4 |
| 2 | **Flagship franchise paper**: "False Accusation as Narrative Convention: 970 Persons Harmed Across 890 Episodes of the Law & Order Franchise" | *Crime, Media, Culture* (Sage, no fee) | *Journal of Criminal Justice and Popular Culture* (free, email submission) | Month 6-7 |
| 3 | **(Optional) Prosecutor/courtroom paper** (L&O only): "Order in the Court: Prosecutorial Overreach, Courtroom Exposure, and Wrongful Conviction in Law & Order" | *Journal of Criminal Justice and Popular Culture* | *Law & Society Review* (Cambridge, stretch) | Month 10+, only after 1-2 are under review or accepted |

**Why this order.** The single biggest reviewer objection to every one of these papers is the same: "an LLM did your coding; where is the reliability evidence?" The validation study (human coding of ~90 episodes, agreement statistics) answers that objection once. Publishing it first, as its own methods paper with a SocArXiv preprint, converts the flagship's weakest section into a one-line citation. Methods papers also get cited disproportionately, which matters for an independent researcher building credibility from zero. The flagship then leads with substance instead of self-defense.

**Realistic timeline** (nights-and-weekends pace): Months 1-2 data repair + validation coding + OSF deposit. Months 3-4 methods paper written and submitted, preprint posted. Months 5-7 flagship written and submitted. First decisions arrive months 7-12 (expect at least one revise-and-resubmit each). Both in print: 12-18 months from today. Paper 3 is a 2027 decision.

**Total out-of-pocket cost: roughly $20-40** (re-running the L&O batch with full transcripts). Every recommended venue is either free to publish in (subscription model) or diamond open access with no APC. No venue below requires an institutional affiliation.

---

## 2. Paper Details

### Paper 1: The Methods/Validation Paper

- **Working title:** "LLM-Assisted Content Analysis at Scale: A Validated Workflow for Coding 890 Episodes of Television Drama"
- **Thesis:** A controlled-vocabulary system prompt plus the Anthropic Batch API produces episode- and person-level codings of full TV transcripts that agree with human coders at conventionally acceptable levels (Krippendorff's alpha reported per variable), at roughly $30 and 28 hours of machine time for 890 episodes, versus an estimated 1,500+ hours of human coding. The paper documents the prompt architecture, the North Star inclusion criteria, failure modes (transcript truncation, JSON wrapping, missing transcripts), and a replicable validation protocol.
- **Dataset(s):** Both. The substantive findings appear only as worked examples; the validation study is the contribution.
- **Key numbers:** 890 episodes; ~$27-30 total API cost; 576 + 314 requests; 0 batch errors on the SVU run; 5 SVU episodes with transcript defects; 60.8% L&O transcript truncation (or its post-repair figure); the alpha/kappa values from the new validation study; 970 person-rows extracted.
- **Primary venue:** *Computational Communication Research* (Amsterdam University Press, journal.computationalcommunication.org). Diamond OA: **no submission fee, no APC**, CC-BY, authors keep copyright. Full papers up to 9,000 words (or a 4,000-word research note if you want speed). APA 7, anonymized submission, Word/LibreOffice fine initially, LaTeX/Quarto after acceptance. Community-owned journal out of the ICA Computational Methods division; methodologically sophisticated reviewers who will engage with LLM coding on the merits. Independent researchers: no affiliation requirement found.
- **Backup venue:** *Communication Methods and Measures* (Taylor & Francis). Subscription journal, no mandatory APC. Higher prestige, slower, more competitive.
- **AI policy / Mode:** CCR has no journal-level AI policy on its submissions page as of July 4, 2026 → **Mode C, treat as Mode B** (disclose everything). T&F backup: **Mode B**, disclosure statement with tool name, version, use, and reason required in Methods or Acknowledgments.
- **Prerequisite work:** the entire validation study (Section 5). Fix the L&O truncation problem first; validating truncated codings would bake the flaw into the record.
- **Effort:** validation coding 30-40 hours; analysis of agreement 5-10 hours; writing under the rewrite-from-memory workflow roughly 8-12 evenings for ~8,000 words. Call it 2 months part-time after data repair.
- **Preprint:** post to SocArXiv on submission. CCR is open access and community-run; preprinting is unproblematic (mark as not explicitly stated on their site; their submissions page is silent on preprints).

### Paper 2: The Flagship Franchise Paper

- **Working title:** "False Accusation as Narrative Convention: 970 Persons Harmed Across 890 Episodes of the Law & Order Franchise, 1990-2026"
- **Thesis:** Across 36 years and two flagship series, wrongful accusation of the innocent is not a dramatic exception but a structural storytelling convention: roughly two-thirds of episodes feature a falsely accused person, about 60% of those persons suffer severity 3-4 harm, and police apologize in under 2% of cases regardless of show, era, or crime type. The franchise gets the *causes* of false accusation roughly right (mirroring National Registry of Exonerations patterns) while inflating the *frequency* by an order of magnitude and erasing accountability.
- **This paper absorbs four brainstormed concepts as sections, not separate papers:**
  - the copaganda/franchise framing (framing + discussion),
  - the crime-type comparison (murder/squad-inference/courtroom for L&O vs. rape/wrong-ID/workplace for SVU) as the core comparative results section,
  - the 1.7% accountability constant as the headline discussion finding,
  - a longitudinal trend figure (persons harmed per season, 1990-2026) as one results subsection.
- **Key numbers:** 890 episodes, 970 persons; false-accusation episode rates 72.3% (L&O) vs 59.7% (SVU), ~64% combined; severity 3-4: 57.8% vs 62.5%; apology rates 1.6% vs 1.8% (~1.7% combined); accusation origin split: squad inference 62% (L&O) vs wrong ID ~60% (SVU); exposure split: courtroom 21% (L&O) vs workplace 27% (SVU); fiction ~64% vs real-world wrongful conviction estimates ~6% (Loeffler et al. 2019); NRE mistaken-ID and misconduct comparisons.
- **Reuse:** the existing `SVU_False_Accusation_Academic_Paper.docx` (abstract, intro, lit review) becomes raw material for this paper's intro and literature sections. Do not also submit an SVU-only version anywhere; see Section 3.
- **Primary venue:** *Crime, Media, Culture* (Sage). Subscription journal: **no submission fee, no mandatory APC** (open access optional, not required). Critical criminology/media audience that will value the copaganda contribution without demanding audience-effects data. Sage journals accept independent researchers; the ScholarOne affiliation field takes "Independent Researcher."
- **Backup venue:** *Journal of Criminal Justice and Popular Culture* (jcjpc.org). Free, open access, exact topical fit, email submission (Word, APA, double-spaced, research articles to 40 pages), explicitly does not require institutional affiliation, ~12-week review. Lower prestige but a near-certain home if CMC declines. Second backup: *Television & New Media* (Sage, same publisher policy).
- **AI policy / Mode:** Sage publisher policy (verified, see table): generative AI content affecting methodology/analysis/results **must be disclosed at submission**; assistive language polishing needs no disclosure; undisclosed generative use is grounds for rejection at any stage → **Mode B**. Note: the CMC journal-specific page returned HTTP 403 to automated fetch, so journal-level deviations are **unverified**; re-check by hand on submission day per the writing guide's staleness rule. JCJPC: no AI policy anywhere on its guidelines page → **Mode C, treat as Mode B**.
- **Prerequisite work:** everything in Section 5, especially L&O transcript repair and the validation study; ideally cite Paper 1's preprint/acceptance for reliability.
- **Effort:** 50-70 hours. Comparative stats and figures are largely done; the heavy lift is the literature engagement (Bernabo 2022; Kim; Rackstraw 2023; Gerbner cultivation tradition; NRE/Innocence Project data) and Tyler's prose under the rewrite workflow (roughly 10-14 evenings for a ~10,000-word manuscript).
- **Preprint:** allowed. Sage's archiving policy (verified) permits posting the original submission version to any open repository at any time; JoC-style "no preprints" carve-outs exist at some journals, so confirm CMC's own page manually before posting. Post to SocArXiv at submission time.

### Paper 3 (Optional): The Prosecutor/Courtroom Paper

- **Working title:** "Order in the Court: Prosecutorial Overreach, Courtroom Exposure, and Wrongful Conviction in Law & Order"
- **Thesis:** L&O's split format makes the legal process itself a harm mechanism: 90 innocent people (21%) exposed through courtroom proceedings, 46 wrongful convictions, and 52 cases of prosecutorial overreach against only 3 coded as misconduct. The show frames aggressive prosecution as heroic zeal, and acquittal does not restore what accusation destroyed.
- **This paper absorbs three brainstormed concepts:** prosecutor conduct, courtroom exposure, and wrongful conviction. Written separately they would be transparent salami slices of the same 429-person dataset.
- **Dataset:** L&O only (the prosecutorial variables do not exist for SVU).
- **Key numbers:** 429 persons; prosecutorial conduct distribution (236 none / 81 dropped appropriately / 55 zealous-but-fair / 52 overreach / 3 misconduct); 90 courtroom-exposed; 119 `public_trial` tags; 47 `indicted`; 46 wrongful convictions vs 3,500+ real exonerations (NRE); 53.8% police threats/coercion; 1.6% apology.
- **Venue:** *Journal of Criminal Justice and Popular Culture* primary (free, Mode C→B, indie-friendly). *Law & Society Review* (Cambridge) as the ambitious alternative: Cambridge policy (verified at publisher level) requires AI use to be declared and bars AI authorship → **Mode B**; LSR is subscription-based with optional OA, but journal-specific fees/policy **unverified**; check before targeting.
- **Timing:** do not start until Papers 1 and 2 are at least under review. If reviews of Paper 2 are hostile to the dataset, this paper inherits the problem; if favorable, this becomes an easy follow-on.
- **Effort:** 30-40 hours, mostly writing; the analysis is descriptive.

---

## 3. Papers NOT to Write (and why)

| Brainstormed concept | Verdict | Reason |
|---|---|---|
| SVU-only flagship (the existing docx draft) | **Fold into Paper 2** | Strictly dominated by the franchise paper; publishing both is salami-slicing that reviewers of the second will notice. Harvest its intro/lit review. |
| Accountability / "1.7%" paper | **Fold into Paper 2** | It is one (excellent) statistic plus qualitative color. A discussion section, not a paper. As a standalone it invites the fatal review: "this is a finding, not a study." |
| Crime-type comparison (murder vs. rape) | **Fold into Paper 2** | This comparison IS the flagship's analytical core. Splitting it out would gut Paper 2. |
| Cultivation paper | **Do not write (now)** | Cultivation claims require audience data (surveys, viewing measures). Content analysis alone cannot support "viewers learn X," and communication reviewers enforce this distinction ruthlessly. Revisit only as a future collaboration with someone who runs surveys. Use cultivation theory as framing in Paper 2's discussion, with claims kept strictly at the level of message content. |
| Longitudinal paper | **Fold into Paper 2 as one figure/subsection** | Underpowered standalone: L&O is missing seasons (10, 12, 14, 15, 18), air dates are incomplete, and era effects are confounded with show mix. A trends figure inside the flagship extracts the value without the exposure. |
| Wrongful conviction paper | **Fold into Paper 3** | 46 cases is thin for a standalone; strong as a section. |
| Courtroom exposure paper | **Fold into Paper 3** | Same dataset, same 429 people, same discussion partners as the prosecutor angle. |

Net effect: ~10 concepts become 3 papers with zero overlapping results. Each paper has a distinct dataset scope (validation subsample / combined franchise / L&O legal-process variables), which is the clean answer if any editor asks how the papers differ.

---

## 4. Verified Venue Policy Table

All policies checked July 4, 2026 via the venues'/publishers' own pages unless marked unverified. Re-verify on submission day (writing guide Part 8: venue-policy staleness).

| Venue | Publisher | AI/LLM policy (as verified today) | Mode | Fees | Indie-OK | Preprints | Source |
|---|---|---|---|---|---|---|---|
| *Computational Communication Research* | Amsterdam UP (community-owned) | No AI policy found on submissions page | **C → treat as B** | None (no APC, no sub fee) | Yes | Not stated; OA journal, low risk | journal.computationalcommunication.org/about/submissions |
| *Crime, Media, Culture* | Sage | Publisher policy: generative AI affecting methodology/analysis/results must be disclosed at submission; assistive AI (grammar/structure) exempt; AI cannot be a co-author; undisclosed use = rejection risk at any stage. Journal page 403'd: journal-level deltas **unverified** | **B** | None (subscription; OA optional) | Yes | Original submission version may be posted to any open repo anytime (Sage archiving policy); confirm CMC has no journal-specific preprint carve-out | sagepub.com/journals/publication-ethics-policies/artificial-intelligence-policy; sagepub.com/journals/permissions/sages-author-archiving-and-re-use-guidelines |
| *Journal of Criminal Justice and Popular Culture* | Independent (jcjpc.org) | No AI policy anywhere in submission guidelines | **C → treat as B** | None | Yes (explicitly no affiliation requirement) | No policy; effectively unrestricted | jcjpc.org/take-action |
| *Journal of Communication* | Oxford UP / ICA | Journal instructions silent; OUP publisher policy requires disclosure in cover letter AND Methods/Acknowledgments, with tool, version, location of use, justification, and validation steps; AI cannot author | **B** (strict disclosure) | None for standard publication; OA optional and costly without institutional deal | Yes | Explicitly allowed: authors retain right to post Author's Original Version; must add DOI after acceptance | academic.oup.com/joc/pages/General_Instructions; academic.oup.com/pages/for-authors (OUP AI pages) |
| *Communication Methods and Measures* | Taylor & Francis | Publisher policy: any generative AI use must be acknowledged in Methods or Acknowledgments with tool name, version, how and why used | **B** | None mandatory | Yes | T&F generally allows AOV preprints; journal-level **unverified** | taylorandfrancis.com/our-policies/ai-policy/ |
| *Law & Society Review* | Cambridge UP | Publisher policy: AI use must be declared and explained like any tool/method; AI cannot be listed as author; authors accountable for AI outputs | **B** | Journal-specific fees **unverified** (Cambridge OA journals can carry APCs; check before targeting) | Yes | Cambridge generally preprint-friendly; journal-level **unverified** | cambridge.org publishing-ethics pages |
| **SocArXiv** (preprints) | SocOpen / OSF | Explicit AI policy: **verbatim AI-generated text is unacceptable**; machine-assisted data analysis is acceptable **with disclosure**; bans for undisclosed LLM-generated content | **A for prose** (disclosure required for analysis) | Free | Yes (any OSF account) | n/a | socopen.org/ai-policy/; socopen.org/moderation-policy/ |

**The decisive detail:** SocArXiv, the natural preprint home, bans verbatim AI-generated prose outright. Since every paper should be preprinted there, **write all three papers to Mode A prose standards** (Tyler writes every sentence via rewrite-from-memory) even though the journals themselves are Mode B/C. This makes one manuscript valid everywhere and makes the disclosure statement simple and true.

No venue above charges a mandatory fee, and none restricts submission to affiliated academics. Use "Independent Researcher" plus city in affiliation fields, and register an ORCID before the first submission (free, expected by all these systems).

---

## 5. Prerequisites Checklist (in order)

**Data repair (before anything else)**
- [ ] Re-run the original-L&O batch with the truncation problem fixed (chunk long transcripts or raise max tokens). 60.8% truncated transcripts is the one flaw a competent reviewer can kill both papers with, and it likely *undercounts* harm. Cost: ~$15-25, one weekend.
- [ ] Attempt to source transcripts for missing L&O seasons (10, 12, 14, 15, 18). If unobtainable, the flagship reports coverage honestly (314 of ~456 episodes) and frames it as a limitation.
- [ ] Manually supplement the 5 defective SVU episodes (S14E01, S14E02, S15E01, S17E01, S06E09) from episode wikis, or exclude them explicitly.
- [ ] Filter `actually_guilty` rows (5 SVU, 12 L&O) into an exclusions file; report the filter in Methods.
- [ ] Compile air dates per episode (Wikipedia episode lists) to enable the longitudinal figure.

**Validation study (the gate for Papers 1 and 2; reviewers at CCR and CMC will demand it; JCJPC probably would not, but do it anyway)**
- [ ] Draw a stratified random sample of ~90 episodes (55 SVU / 35 L&O, stratified by era), per the guides' 50-100 recommendation. 90 gives comfortable CIs on episode-level flags.
- [ ] Tyler codes all 90 blind to Claude's output, using the identical codebook (the system prompt IS the codebook; extract it into a standalone codebook PDF for the OSF deposit).
- [ ] Strongly recommended: recruit one additional human coder for a 30-episode subset to establish human-human agreement as the benchmark (a friend is fine; name and credit them). Human-LLM agreement alone is publishable; human-human + human-LLM is bulletproof.
- [ ] Compute Krippendorff's alpha (and % agreement) at two levels: episode flags (has_false_suspect, has_public_exposure) and person-level variables (innocence_status, accusation_origin, exposure_channel, consequence_severity). Report per variable, not one pooled number.
- [ ] Adjudicate disagreements, document error patterns (this becomes Paper 1's most interesting section).

**Open science infrastructure**
- [ ] Create an OSF project: both CSVs, the JSONL, the system prompt/codebook, validation coding sheets, analysis scripts, and a README. Check transcript copyright: deposit the *derived codings*, not the transcripts themselves (transcripts from subslikescript.com are not Tyler's to redistribute).
- [ ] Register ORCID.
- [ ] SocArXiv preprints at each submission, updated with DOIs on acceptance.

**Per-submission mechanical pass (from the writing guide)**
- [ ] Part 6 audit (em-dash grep, banned-word scan, negation scan, non-ASCII check).
- [ ] Re-fetch the venue's author guidelines on submission day; reclassify Mode if changed.
- [ ] Reread the acknowledgment against what actually happened (Part 8: acknowledgment rot).

---

## 6. Human-Voice Workflow Application

Global posture: **all prose to Mode A standard** (because of SocArXiv's verbatim-AI-text ban), with **Mode B-style disclosure** of Claude's analytic and support roles (because Sage/OUP/T&F/Cambridge require disclosure of generative AI that affects methodology, analysis, or results, and here the LLM literally is the measurement instrument).

**Claude produces (all papers):** outlines; per-section fact-briefs; every table and figure; all descriptive statistics and agreement statistics; reference formatting and citation verification against primary sources; the mechanical audit; critique-without-rewriting passes on Tyler's drafts. These are audited artifacts, not prose, per Part 4 step 1.

**Tyler writes:** every sentence, via rewrite-from-memory (read brief, close file, write cold, fact-check the delta). Order per Part 4: results/methods core first, then discussion, intro, abstract last. Budget from the guide's calibration (two evenings per 5 pages): Paper 1 ~8-12 evenings, Paper 2 ~10-14, Paper 3 ~8-10.

**A distinction to keep sharp in the Methods sections:** Claude-as-instrument (the batch coding of 890 episodes) is not "AI-assisted writing" and belongs in Methods as the measurement procedure, fully specified (model ID claude-sonnet-4-5-20250929, exact prompt in the appendix/OSF, batch dates, cost). Claude-as-assistant (structure, tables, reference checking, critique) belongs in the Acknowledgments. Keeping these in separate sections keeps every venue's policy satisfied by construction.

**Draft acknowledgment text (Part 7 pattern, Mode A variant, adapted; Tyler should rewrite in his own words before use):**

> Episode coding was performed with Claude (Anthropic; model claude-sonnet-4-5-20250929) via the Anthropic Batch API, as described in Section [N], and validated against human coding as reported in Section [M]. Claude also assisted with study design, produced the tables and descriptive statistics, and checked the bibliographic references against their sources; all prose in this article is my own. I validated every reported figure against the underlying data and take full responsibility for the content. [If a second coder helped:] I thank [Name] for independent validation coding.

For OUP or T&F venues, mirror the same content in the cover letter (OUP asks for tool, version, location of use, justification, and validation steps at submission).

---

## 7. Timeline at a Glance

| Month | Milestone |
|---|---|
| 1 | L&O re-run with full transcripts; data repairs; air dates; OSF project skeleton |
| 2 | Validation coding (90 episodes); agreement analysis; second-coder subset if recruited |
| 3-4 | Paper 1 written (rewrite workflow); SocArXiv preprint; submit to CCR |
| 5-7 | Paper 2 written, reusing SVU docx intro/lit-review material; preprint; submit to Crime, Media, Culture |
| 7-12 | Reviews arrive; revise-and-resubmit cycles; JCJPC fallback for Paper 2 if CMC rejects |
| 10+ | Decide on Paper 3 based on Paper 2's reception |

The social-media, YouTube, and podcast tracks in the three existing guides are compatible with this roadmap but should wait until the OSF deposit and at least one preprint are live, so every viral post links to a citable artifact.
