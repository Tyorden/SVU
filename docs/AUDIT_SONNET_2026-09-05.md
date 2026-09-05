# AUDIT (Sonnet, subagent #169d) - svu_flagship_paper_v2.tex and svu_metoo_longitudinal_v2.tex - 2026-09-05

Auditor: a smaller/different model than the one that drafted these papers. Report only; no .tex/.md file
touched except this one. Both files compiled clean: `tectonic --keep-logs` gave 0 errors on each (flagship
26 pages, longitudinal 18 pages; only harmless overfull/underfull hbox warnings, listed below). Word counts
computed with `pandoc -t plain` (strips LaTeX commands) and cross-checked with a second tool; details under
Venue Fit. Numbers were traced against docs/svu_paper_stats_v2.md (the number authority), the September 4
validation addendum inside it, docs/VALIDATION_RESULTS_2026-09-04.md, and docs/VALIDATION_ANCHORS_2026-09-04.md.

**Overall verdict up front:** these are not dishonest manuscripts. The disclosure paragraphs, the source
corruption story, the death-audit adjudication, and the Section 3.7/Limitations treatment of the blind
AI-AI reliability study are all unusually careful for a project with no human validation. The core problem
is distributional, not an absence of honesty: the hedges exist, but they are concentrated in Methods and
Limitations while Results and the Abstract state person-level numbers as flat fact. A referee or a reader
who does not read every section will come away more certain than the project's own reliability study
supports. Neither paper is ready to submit as-is: each has at least one anonymity defect and at least one
number that its own governing documents say should not be re-cited without a further check.

---

## Part 1: svu_flagship_paper_v2.tex ("Collateral Damage as Narrative Convention")

### BLOCKING (2)

**B1. A named formal-apology vignette rests on a row the number authority says not to cite again.**
Quote (Section 4.7): "Frank Sullivan (S11E21) receives his from an ADA after he slits his wrists in an
interrogation room."
Problem: svu_paper_stats_v2.md's own reliability addendum states plainly: "Contested formal-apology rows
(bear on the '8 formal apologies' figure, A8): Frank Sullivan S11E21 (original formal; re-coder found none
on the page) and Mark Dobbins S06E11... Settle by human read before citing the count again." The flagship
paper cites the count again, in a named narrative vignette, with zero disclosure that this specific row is
disputed. Of the eight formal apologies in 567 episodes (the rarest, most quotable accountability datapoint
in the study), one quarter are now contested by the paper's own second coder. "Dobbins" and "contest" do
not appear anywhere in the manuscript (grep-verified).
Proposed fix: either (a) drop Sullivan from the named list and substitute an uncontested row (six of the
eight are unchallenged), or (b) keep him but add a footnote/clause: "one of the eight, S11E21, is disputed
by the blind re-coding (Section 3.7) and awaits a third read." Also add one sentence to Limitations naming
both contested rows (Sullivan S11E21, Dobbins S06E11) so the 1.5% formal-apology rate itself carries a
stated error bar of roughly one row in eight.

**B2. Double-anonymization is not implemented, and the self-citation leaks more than the byline does.**
Quote (page 1 byline): "Tyler Satchel Orden Independent researcher Contact: tylerorden@gmail.com."
Quote (References): "Orden, T. (in preparation). The retreat of the false accusation plot in Law & Order:
SVU, 1999-2026. Manuscript."
Problem: Crime, Media, Culture is double-anonymized (Sage). The byline is the obvious leak (already flagged
by the prior readiness audit and presumably deferred to a final anonymization pass). The self-citation is
a subtler and, for a determined reviewer, a more effective leak: it gives the exact, matching title of the
sibling in-preparation manuscript. A reviewer who searches that title, or who later reviews the companion
paper for Television & New Media, can connect the two and the author. This citation appears four more times
in-text ("Orden, in preparation") beyond the reference entry itself.
Proposed fix: at the anonymization pass, replace every instance with "a companion manuscript (details
withheld for review)" or the journal's specified self-citation convention (Sage guidance typically wants
"Author, in preparation" with the title omitted), and do the same on the longitudinal side for its citation
of this paper.

### MAJOR (5)

**M1. The single worst-reliability field in the whole study underlies an unhedged headline distribution.**
Quote (Section 4.2): "Of the 521 persons, 429 (82.3%) are proven innocent on screen... 49 (9.4%) are
strongly implied innocent; 43 (8.3%) are partially involved."
Problem: innocence_status is the lowest-kappa field measured (0.134 SVU-only, 0.100 pooled, "slight"),
lower even than the disclosing-party field the paper does flag inline elsewhere. VALIDATION_RESULTS section 5
names this exact split ("the innocence-status split and 43 partially_involved") as a headline claim resting
on a 0.13 field. Section 4.2 gives none of that context; Limitations mentions the field only inside a long
comma-separated list, without connecting it back to this specific sentence.
Proposed fix: add a one-clause caveat at first use, e.g., "(the proven/implied/partially-involved split is
the least reliable field measured across coders, kappa 0.13; Section 3.7)," or move the finer three-way
split to a note and lead with only the innocent-vs-partially-involved distinction, which is definitionally
closer to binary and likely more stable.

**M2. The Limitations' defense of the apology gradient conflates systematic bias with measured noise.**
Quote (Section 6): "A single instrument also means any interpretive bias it carries is applied uniformly
across all episodes. Uniform bias leaves comparisons between categories intact, the media multiplier and
the apology gradient among them."
Quote (same section, closing): "Its internal gradient, apology tracking severity and ignoring conduct, is
the part of the finding I would stake something on."
Problem: this argument is valid for a consistent, one-directional offset in a single coding run (e.g., "this
coder always rates severity half a point low"), which does leave internal comparisons intact. It is not
valid for the actual problem the reliability study measured, which is noisy disagreement between two
independent applications of the rubric (police_apology raw kappa 0.327, consequence_severity unweighted
0.381). Noise attenuates and adds spurious variance to within-corpus gradients; it does not leave them safely
untouched the way a constant offset would. The paper uses the bias argument to reassure the reader about
exactly the finding ("I would stake something on") that the noise-based reliability numbers should make the
least confident about.
Proposed fix: separate the two claims explicitly. Keep the uniform-bias point for genuinely single-run
concerns (e.g., where the instrument sets its severity thresholds), and add a distinct, honest sentence
acknowledging that the reliability check measures noise, not bias, and that noise does not offer the same
protection to the apology gradient.

**M3. Reference style does not match the venue's expected format, unresolved from the prior audit.**
Evidence: flagship references use APA-style formatting throughout, e.g. "Bernabo, L. (2022). Copaganda and
post-Floyd TVPD... Journal of Communication, 72(4), 488-496." The program's own venue research (cited in the
prior readiness audit, docs/SUBMIT_READINESS_2026-09-04.md item h.3) identifies SAGE Harvard as the expected
Crime, Media, Culture style, which differs in punctuation (no comma before initials, no parenthetical year,
colon not comma before page range). This was flagged in July and is still unaddressed in the v2 files (v2's
edits were confined to the reliability content, not reference formatting).
Proposed fix: run the three-entry spot check the prior audit specified against a current CMC article before
submission, or confirm via a live fetch of the author instructions (blocked by Cloudflare as of Sept 4; try
again from a browser session).

**M4. Selective inline reliability-flagging creates an unwarranted hierarchy of trust.**
Quote (Section 3.5): "The most exposed number in this article is the 83.9% squad share of disclosure, which
aggregates hundreds of such attributions."
Problem: this is the only person-level headline number flagged inline, at the point where it is first used,
with its own kappa cited (0.10). Every other person-level statistic in Section 4 (severity 62.4%, origin
54.5%, conduct 53.0%, apology 7.5%/1.5%, innocence-status split) rests on comparably low or lower kappas but
gets no equivalent inline flag; a reader naturally infers the unflagged numbers are on firmer ground, which
is not true (innocence_status at 0.13 is worse than disclosing_party's 0.10 only marginally, and several
others sit in between).
Proposed fix: add a single boilerplate sentence at the top of Section 4 ("Results"), before 4.1: "Field-level
reliability for the person-level statistics below is reported in full in Section 3.7 and ranges from slight
(kappa 0.10-0.20) to moderate (0.45-0.51); the discussion below flags the specific numbers this ranking most
and least affects." This costs one paragraph and removes the need to litigate trust number-by-number.

**M5. Death/injury audit language reads as more independently verified than it is.**
Quote (Table 9 note): "Every count below was verified record by record, and every borderline case was ruled
on by name."
Problem: this is true and the underlying work (Section 3.5, Section 4.8) is genuinely careful, but "verified"
without qualification can be misread as a second, independent check. Limitations later discloses, correctly,
that the AI-AI reliability study's sampling frame specifically excluded most of the 32 death rows and the 8
apology rows, so this stratum has had no second-coder check at all, blind or otherwise; the rigor described
is a single pipeline's internal row-by-row audit against its own free-text fields.
Proposed fix: change "verified" to "internally re-verified against the source transcripts and free-text
fields (Section 3.5); this stratum was not part of the blind second-coding sample (Section 6)" at first use
in 3.5 or in the Table 9 note itself.

### MINOR (4)

**m1.** Byline still reads "Manuscript prepared July 2026," dating the draft; flagged by the prior audit
(should-fix #4) and still present.
**m2.** Abstract's opening claim, "one of the most durable fictions about policing ever broadcast in the
United States," remains uncited/unhedged; flagged by the prior audit (should-fix #1) and still present.
**m3.** Model identifier inconsistency across the two papers: "claude-sonnet-4-5-20250929" here vs.
"claude-sonnet-4-5" in the longitudinal paper; flagged by the prior audit (should-fix #2) and still present.
**m4.** Reference-list entry "Hust, S. J. T., et al. (2015)" uses "et al." inside the reference list itself
rather than the full author list, which both APA and SAGE Harvard require (absent an unusually long author
list, which this is not known to be).

### COSMETIC (2)

**c1.** Compile warnings unchanged from the pre-v2 file: one 12.9pt overfull hbox (a long table row/caption
near lines 1059-1079) and two underfull hboxes; harmless for the eventual Word/PDF submission but worth a
manual line-break check.
**c2.** The National Registry of Exonerations URL reference lacks an "Available at:" lead-in, which SAGE
Harvard style (if confirmed, see M3) would want.

**Flagship severity counts: BLOCKING 2, MAJOR 5, MINOR 4, COSMETIC 2 (13 total).**

---

## Part 2: svu_metoo_longitudinal_v2.tex ("The Retreat of the False Accusation Plot")

### BLOCKING (1)

**B1. Same anonymity defect as the flagship, plus its own full-title self-citation.**
Quote (byline): "Tyler Satchel Orden Independent researcher tylerorden@gmail.com."
Quote (References): "Orden, T. In preparation. 'Collateral Damage as Narrative Convention: False Accusation
and Its Costs Across 27 Seasons of Law & Order: Special Victims Unit.' Manuscript."
Problem and fix: identical to flagship B2. This paper's leak is arguably worse in one respect: it quotes the
sibling paper's exact title inside quotation marks in the reference list, which is the most search-friendly
form the leak could take.

### MAJOR (4)

**M1. Word count and abstract length sit at the cap with no real margin, and different tools disagree
by hundreds of words.**
Evidence: `pandoc -t plain` on the full .tex gives exactly 7,499 words against the 7,500-including-references
cap (1 word of headroom); the abstract, measured from the compiled PDF text, is exactly 150 words against the
150-word cap (0 words of headroom; a second, cruder count gave 149). Converting the same file to .docx and
counting with macOS `textutil` (closer to what a reviewer's Word count would show) gives 7,109 words, a
390-word swing from the pandoc figure. The true Microsoft Word "Review > Word Count" figure, which is what
the journal actually enforces, has still not been checked (the prior audit flagged this exact gap on 09-04
and it remains open for the v2 file).
Proposed fix: do not treat any script's count as authoritative this close to the cap. Open the .docx in
actual Microsoft Word, run Review > Word Count including footnotes, and cut to a real margin (recommend
targeting <=7,300 words and <=145 in the abstract) rather than the current zero-margin figures.

**M2. The abstract states three person-level findings as unhedged fact, with no room left to hedge them.**
Quote (Abstract): "Surviving plots grew harsher in Seasons 19-21 (severe outcomes 60.0% to 82.1%; p = .018,
suggestive), victim-identification origins roughly doubled, and depicted police coercion of innocents
rebounded after 2020."
Problem: the severity claim at least carries its own statistical hedge ("suggestive"). The origin-doubling
and coercion-rebound claims carry none, even though the paper's own Limitations names exactly these three
findings as resting on fields the second coder did not reproduce reliably (origin kappa 0.45, any-threat
0.37). Given M1, there is no free word budget left in the abstract to add a hedge clause without cutting
something else.
Proposed fix: cut one clause to make room, e.g. compress "Both the backlash and the reform accounts fail on
the genre's flagship" and use the savings for a short parenthetical after the three findings, such as "(AI-
coded; reliability in Methods)." Alternatively, keep the abstract's headline claim exclusively episode-level
(the retreat itself, kappa 0.47, the paper's most defensible number) and move the three person-level findings
into softer descriptive language without specific percentages, deferring exact figures to the tables.

**M3. Reference style differs from the flagship's, and neither has been confirmed against a live venue page.**
Evidence: this paper uses Chicago author-date style throughout (e.g., "Bernabo, L. 2022. 'Copaganda and
Post-Floyd TVPD...' Journal of Communication 72 (4): 488-496," no comma before the year), while the flagship
paper uses APA-style punctuation for the same references. That is fine if the two venues genuinely require
different styles, but the prior audit could not verify either journal's live author-instructions page
(Cloudflare 403 on both, as of Sept 4) and this remains unverified today.
Proposed fix: same as flagship M3, confirmed against Television & New Media's current guidance.

**M4. The wide table still overflows the text width, unresolved from the prior audit.**
Evidence: tectonic reports a 26.15pt overfull hbox in table alignment (now at lines 1046-1057, previously
1111-1126 in the pre-v2 file) — same table, same defect, carried through the word-count rewrite. This will
likely still be an oversized table when converted to the required Word format.
Proposed fix: transpose or split the offending table (the accusation-origin-by-era or threat-by-season-block
table) before generating the submission .docx, as the prior audit already suggested.

### MINOR (3)

**m1.** Same "Hust, S. J. T., et al. 2015" reference-list abbreviation issue as the flagship paper.
**m2.** Model identifier "claude-sonnet-4-5" here is undated, versus the flagship's dated
"claude-sonnet-4-5-20250929" (paired with flagship m3).
**m3.** Uncited factual claim: "It is the longest-running primetime live-action series in American
television" (Section 2.1) has no citation; easy to source (a trade-press or Guinness citation) or hedge as
"widely reported as."

### COSMETIC (2)

**c1.** Minor underfull/overfull hbox warnings at compile (5.3pt, 1.0pt), harmless.
**c2.** Page count dropped from 20 (pre-v2) to 18 pages despite added reliability content, consistent with
the word-count tightening described in the build log; no action needed, noted only for completeness.

**Longitudinal severity counts: BLOCKING 1, MAJOR 4, MINOR 3, COSMETIC 2 (10 total).**

---

## Number-source check (task item 2)

I traced roughly 48 numbers in the flagship paper and 25 in the longitudinal paper against
docs/svu_paper_stats_v2.md (tables A1-A14, B1-B10, and the reconciliation table E), well past the requested
sample of 25 per paper, covering every table, the abstract, and several in-text figures (the death audit
list, the reliability kappas, the reconciliation of the wrong_ID tag against accusation_origin, the
truncation and transcript-length figures). Every number checked traced correctly to its stated source row,
including figures that are easy to get subtly wrong (521 vs. 513 unique persons used correctly in context
each time; 377/72.4% "beyond law enforcement" vs. 379/72.7% "beyond police_only" kept distinct and both
correct; the 8-vs-9 formal apology correction stated accurately apart from finding B1 above). I found zero
numeric transcription errors in either paper. This is a genuinely well-verified pair of manuscripts on pure
arithmetic and sourcing; the problems here are about framing and disclosure, not fabrication or miscopying.

## Methods honesty and disclosure paragraph (task item 3)

Both Acknowledgments sections satisfy the house AI-disclosure standard as written: first person throughout
("I revised and verified," "I take full responsibility," "All analytic decisions... are mine"), a plain
drafting-clause disclosure, and, most importantly, the retracted non-Anthropic-model promise is stated
plainly rather than quietly dropped: flagship reads "An earlier draft promised that the cross-check would
use a non-Anthropic model; it did not, and a check by a human coder or by a model from another developer
remains undone." Longitudinal reads equivalently. This is a clear improvement over what the prior audit
would have seen in the pre-v2 files, and I have no finding against it. The contamination-exclusion,
wrong-transcript, and truncation disclosures in Method are detailed, specific, and (per the number check
above) accurate.

## Anonymity (task item 4)

Both papers fail double-anonymization as currently written: full name and email in the body byline (page 1
of each), and reciprocal full-title self-citation of the sibling in-preparation manuscript (flagship BLOCKING
2, longitudinal BLOCKING 1, above). No other identity leaks found: no dashboard/repo URL, no GitHub link, no
"svu.vercel.app" string (present in the pre-v2 docx per the prior audit but not in either v2 .tex). This is
expected to be resolved at a dedicated anonymization pass per the existing workflow
(docs/SUBMIT_READINESS_2026-09-04.md section h); flagging it here mainly to note the self-citation vector,
which a generic name/URL grep will not catch.

## Venue fit and format (task item 5)

- Word counts: flagship not word-capped per the assignment; longitudinal is capped at 7,500 including
  references and currently measures 7,499 by pandoc-plain and 7,109 by textutil-on-docx (see M1 above). This
  is the most concrete, actionable finding in the format category: the true count must be checked in Word
  itself before submission, with margin cut in either direction found closer to 7,300.
- Abstract length: longitudinal abstract is exactly 150 words against a 150-word cap (zero margin).
- Reference style: the two papers use two different citation systems (APA-style vs. Chicago author-date);
  each may be correct for its own venue, but this is unverified since July (Cloudflare blocks both journals'
  author-instruction pages) and should be the first thing checked once a live browser session is available.
- Both compile with 0 errors; only long-table overfull-hbox warnings remain, one of which (the longitudinal
  table at M4) is large enough (26pt) to likely misbehave in the Word conversion too.

## Argument quality for a media-studies referee (task item 6)

The narrative-convention thesis is adequately supported by episode-level evidence alone: the 59.4%/62.1%
false-suspect prevalence rate (flagship) and the 65.3% to 50.0% to 41.8% era retreat (longitudinal) both rest
on the has_false_suspect flag, the one field with a defensible (moderate, kappa 0.47) cross-coder agreement.
A referee could accept "false accusation plots are common, and their frequency changed across eras" on that
evidence alone.

Where both papers lean on person-level detail they can no longer fully trust: the flagship's central moral
claim (accountability failure: apology tracks catastrophe, not conduct, Section 5.2) rests on
consequence_severity (weighted kappa 0.51, its best person-level field) crossed with police_apology (raw
kappa 0.33), and the disclosure claim (squad tells the world 83.9% of the time) rests on the worst field in
the study (who_told, kappa 0.10). The longitudinal's three secondary findings (severity paradox, origin
shift, coercion U-shape, Sections 4.2-4.4) are exactly the three the paper's own Limitations names as
resting on unreliable fields. Both papers already say this in Limitations; my finding (M2/M4 above) is that
the rhetorical weight given to these claims in the Abstract and Discussion is not adjusted to match, and in
one place (flagship's "uniform bias" argument, M2) the paper makes an affirmative case for trusting a
person-level finding that does not hold up on inspection.

## Restructuring proposal: how to make these as strong as possible with no human validation

1. **Move a caveat-forward sentence to the top of Results, not just the end of Methods and Limitations.**
   Both papers currently state the reliability numbers once in Method (3.7 / the Reliability subsection) and
   again in Limitations, with the entire Results section in between reporting person-level numbers as flat
   fact. Add one sentence at the start of Section 4 in each paper: "The episode-level flag below is
   moderately reliable across independent AI coders (kappa 0.47); the person-level statistics that follow
   range from slight to moderate reliability (kappa 0.10-0.51) and are best read as one coder's consistent
   application of a fixed rubric, not a cross-validated estimate." This costs two sentences total and would
   have preempted M4 above.

2. **Make the abstract's headline number episode-level, and demote specific person-level percentages to
   softer descriptive language in the abstract only** (the body and tables keep full precision). For the
   flagship: lead with 59.4%/62.1% and the episode-kappa; state severity, disclosure, and apology findings
   in the abstract without decimal precision ("most falsely accused persons suffer a material sanction or
   worse," "detectives are usually the ones who make the accusation spread," "an apology follows only rarely
   and tracks catastrophe, not conduct") and move the decimals to the body, where the reliability caveat is
   already adjacent. For the longitudinal, this also solves the word-cap problem (M1/M2 together): removing
   two or three specific percentages from the 150-word abstract both frees words for a short reliability
   flag and reduces the appearance of false precision at the one place readers weight most heavily.

3. **Person census as a clearly labeled secondary section, not a footnote inside Limitations.** The task's
   suggested structure (episode-level headline, person census as an appendix with its own reliability stated)
   is close to what the flagship already does structurally (Tables 1-2 are episode/aggregate, Tables 3-9 are
   person-level detail), but nothing marks the transition. Insert a one-line section header or subtitle at
   Table 3, e.g. "4.2-4.8 Person-level detail (field reliability 0.10-0.51; see Section 3.7)," so a reader
   skimming headers alone gets the framing even without reading prose.

4. **Fix the two contested-row issues before they are re-cited a third time.** Both the Sullivan/Dobbins
   formal-apology dispute (flagship B1) and, more generally, any other named vignette drawn from a row this
   study's own addendum flags as contested, should get a one-clause disclosure or be swapped for an
   uncontested example. This is the cheapest fix in this report relative to its risk: a referee who cross-
   reads the deposited validation materials (which the paper commits to depositing on OSF) will find the
   contradiction immediately.

5. **Reconcile the "uniform bias" defense (flagship M2).** Either remove the sentence connecting it to the
   apology gradient specifically, or add the noise/bias distinction explicitly. This is a two-sentence fix
   that closes a real logical gap a statistically literate reviewer (increasingly likely, given how heavily
   both papers lean on inter-rater statistics) would catch.

6. **Unify small cross-paper inconsistencies** (model identifier dating, reference style, the both-papers
   Hust et al. abbreviation) in one pass across both files together, since they are the same fix applied
   twice.

## What the previous readiness audit (docs/SUBMIT_READINESS_2026-09-04.md) missed

1. **It audited the wrong (superseded) files.** SUBMIT_READINESS_2026-09-04.md reviewed
   papers/svu_flagship_paper.tex and svu_metoo_longitudinal.tex, whose last content edit was 2026-07-12; the
   validation study and the *_v2.tex rewrite happened later the same day it is dated (2026-09-04 23:33 PDT
   per docs/PAPER_BUILD_LOG.md). Every finding in that audit about the "promise sentences" for a future human
   validation, the Methods 3.5 language, and the Acknowledgments disclosure describes text that no longer
   exists in the current files. A reader today could mistake it for post-rewrite guidance; it should carry a
   superseded/stale-version note, or be re-run against *_v2.tex.
2. Because it audited pre-rewrite text, it could not and did not evaluate whether the new reliability content
   (Section 3.7, the expanded Limitations) matches the strength of claims elsewhere in the paper. That whole
   category of finding (this report's B1/M1/M2/M4 in the flagship, M2 in the longitudinal) postdates it by
   construction.
3. Its anonymity check was a generic name/URL grep ("Orden"/"Tyorden"/"vercel" hit counts); it did not
   surface the specific and more dangerous leak of citing the sibling manuscript by its exact full title.
4. It flagged, but left open, the exact word-count ambiguity this audit resolved concretely: it wrote "the
   Word-count of the actual .docx with references (measured on the .md only)" as an untested item. This audit
   converted the file and measured a 390-word swing between two counting tools, which turns that open item
   into an urgent, quantified one.
5. It did not connect the reliability study's field-by-field kappa table (which did not exist in July) to
   specific sentences in the manuscripts, e.g. the innocence_status split being the single worst-performing
   field in the whole study while carrying no in-text caveat (M1 above).
6. It did not catch the Sullivan/Dobbins contested formal-apology rows, because that contest was discovered
   during the September 4 validation study, after the July audit.

## Verdicts

**Flagship (Crime, Media, Culture):** Not ready to submit. Numbers are clean and the disclosure paragraph is
honest and compliant. Before Tyler's read-aloud pass: fix B1 (Sullivan vignette) and plan the anonymization
pass to cover the self-citation vector (B2), not just the byline. The MAJOR items (innocence_status caveat,
the uniform-bias argument, reference style, selective inline flagging, "verified" wording) are all prose-
level fixes that do not require new data or a rewrite of the argument.

**Longitudinal (Television & New Media):** Not ready to submit. Same anonymity gap. The word-count and
abstract-length margins are the most urgent items: verify in actual Microsoft Word before doing anything
else, since a cap violation is an instant desk-reject risk that has nothing to do with the paper's substance.
Once real margin exists, use it to add the reliability flag the abstract currently has no room for.

**Total findings: flagship 13 (2 BLOCKING, 5 MAJOR, 4 MINOR, 2 COSMETIC); longitudinal 10 (1 BLOCKING, 4
MAJOR, 3 MINOR, 2 COSMETIC).**
