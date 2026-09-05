# SUBMIT READINESS — the two SVU manuscripts — 2026-09-04

Auditor: Claude Fable 5.1, subagent #159 (papers-shelf audit). Read-only on the manuscripts: no .tex/.md edited.
Manuscripts (both pandoc-generated from the .md masters; last content commit cd30a7e 2026-07-12 23:11):
- A. /Users/tylerorden/Desktop/SVU/papers/svu_flagship_paper.tex — "Collateral Damage as Narrative Convention: False Accusation and Its Costs Across 27 Seasons of Law & Order: Special Victims Unit" -> Crime, Media, Culture (Sage; double-anonymized).
- B. /Users/tylerorden/Desktop/SVU/papers/svu_metoo_longitudinal.tex — "The Retreat of the False Accusation Plot in Law & Order: SVU, 1999-2026" -> Television & New Media (Sage; Word only; 7,500-word cap incl. references).
Number authority: /Users/tylerorden/Desktop/SVU/docs/svu_paper_stats_v2.md. Gate record: docs/PAPER_BUILD_LOG.md "Remaining gates (as of 2026-07-13)"; docs/VERIFICATION_INDEX.md 2026-09-04 line.

## (a) Compile check
Scratch: /private/tmp/claude-501/-Users-tylerorden-Desktop-SVU/2b6a75c5-654e-4357-957c-ab65c6d4af4a/scratchpad/papers/SVU_flagship/ and SVU_metoo/ · tectonic (only engine on this machine).
- A: 0 errors · 25 pages · 1 overfull hbox (12.9 pt, lines 1023-1042, a long table caption/row) · 2 underfull · 0 undefined.
- B: 0 errors · 20 pages · 5 overfull (5.3 pt lines 989-990; 1.0 pt line 999; 26.15 pt x3 "in alignment" at lines 1111-1126 — one wide table overruns the text width by 26 pt in the PDF) · 1 underfull · 0 undefined.
Neither venue takes the PDF (A: PDF/Word via SAGE Track — either; B: Word ONLY), so the LaTeX build is a check, not the artifact. The .docx files (Jul 12) are the submission base for B.

## (b) Claims-audit currency
The last content edit is 2026-07-12 (external-review fixes). Audits: the six-agent audit (2026-07-05, replication of ~380 values, ground-truth transcript audit) and the external review (2026-07-12) both PREDATE or EQUAL the last edit; no claims audit is dated after Jul 12. Spot-check today (10 claims per paper, all against svu_paper_stats_v2.md):
A (flagship abstract): 567 episodes / 521 person-records (PASS); 59.4% = 337/567 and 62.1% = 352/567 (PASS); 62.4% severity 3-4 = 325/521 (PASS); 32 deaths = 21 murdered + 9 suicides + 2 other (PASS, rows verified list); 54.5% squad_inference (284) (PASS); 53.0% = 276/521 any threat/coercion (PASS); 83.9% = 318/379 squad discloser (PASS); 7.5% = 39/521 any apology, 1.5% = 8/521 formal (PASS); 0.0% at severity 1 (0/60) vs 16.4% at severity 4 (18/110) (PASS); 45.3% media-exposed severity 4 vs 8.5% police_only (PASS). 10/10.
B (longitudinal abstract): 65.3% / 50.0% / 41.8% by era (262/401, 34/68, 41/98) (PASS); chi-square(2, N=567) = 20.89, p = .000029 (PASS); 1.06 / 0.57 / 0.56 persons per episode (PASS); 60.0% -> 82.1% -> 67.3% severe (PASS); p = .018 (chi2 8.06) (PASS); victim_ID 15.5% -> 30.8% (PASS); coercion U-shape 27.7% (S16-18) -> 56.7% (S22-24) and 60.0% (PASS); pooled coercion p = .071 (PASS); 521/567 (PASS); Season 21 break (per-season table) (PASS). 10/10.

## (c) Number-source check (abstracts)
Every number in both abstracts traces to svu_paper_stats_v2.md (above). PASS. Note the registry flag (RESULTS_PHRASING_REGISTRY A20 Part E): 890/970 are raw README totals, not number-authority figures — neither abstract uses them (good); the dashboard row for the flagship says "500+ episodes", fine.

## (d) AI-disclosure paragraph
Both present, in the Acknowledgments, first person, house-form: A (lines 1307-1317) "Claude (Anthropic) performed the episode coding ... as the measurement instrument ... and drafted the manuscript text under my direction, which I revised and verified ... I take full responsibility ... the same model family coded the data and drafted the text, which is a further reason the planned validation cross-check uses a non-Anthropic model." B (lines 806-817) same two-role structure. Both disclose drafting (truth gate satisfied as written, before or after the rewrite). Methods sections also name claude-sonnet-4-5 as the coder (A line 328; B line 325). For a double-anonymized Sage submission the Acknowledgments move to the title page (dashboard standing rule) — but the Methods-level instrument disclosure stays in the body (it is method, not identity).

## (e) Anonymity / identity
Both venues double-anonymized (Sage). Current files are NOT anonymized: author block "Tyler Satchel Orden Independent researcher tylerorden@gmail.com" on the first page (A line 69-70; B line 69); "Orden"/"Tyorden"/"vercel" hits: A = 6, B = 4 (author block, self-references, dashboard URL). No anonymizer script exists in the SVU repo (dashboard card says reuse the MathProofs make_submission.py pattern). Steps 5-6 below.

## (f) Venue live check (rule 23)
Attempted 2026-09-04 17:55 PDT: https://journals.sagepub.com/author-instructions/CMC and .../TVN -> HTTP 403 (Cloudflare) on WebFetch AND on a browser-UA curl. UNVERIFIED today. The record of truth remains docs/papers_roadmap.md venue table (Sage publisher AI policy fetched Jul 2026; CMC journal page 403'd then too; TVNM "Word only, 7,500 words including references" from the dashboard card / Jul 19 sweep). Tyler must read both author-instruction pages in a browser on submission day and confirm: CMC word limit and reference style (SAGE Harvard), TVNM 7,500-incl-refs cap and Word-only rule, ORCID requirement, and whether either journal has a journal-level preprint carve-out.
Delta: none recordable (no fetch). Flag: two of the program's venues could not be machine-verified since July.

## (g) What blocks submission (one line)
The ~90-episode human validation study (PAPER_BUILD_LOG gate 1, non-negotiable, neither run nor waived; DOC_AUDIT B3) — then Tyler's read-aloud/rewrite pass, anonymization, and the Sage portals; B additionally needs the cut to 7,500 words including references (the .md is 8,390 words INCLUDING its reference list and tables text — count the Word file, not the .md).

## (h) SUBMIT STEPS
STEP 0 (BLOCKING, both papers) — the validation study, or its waiver.
0a. Decide: say "svu validation" (Claude designs the coding sheet: stratified ~90-episode sample with all 32 death rows and the 8 formal-apology rows forced in; speaker-attribution task; agreement statistics plan) or "waive svu validation" with your reasoning (Claude writes the dated waiver line into /Users/tylerorden/Desktop/MathProofs/control/PROGRAM_LEDGER.md and strikes the gate in /Users/tylerorden/Desktop/SVU/docs/PAPER_BUILD_LOG.md with a dated note).
0b. If run: code the sheet (30-40 h per papers_roadmap.md §5) -> tell Claude "validation coded" -> Claude computes Krippendorff's alpha / kappa per variable into /Users/tylerorden/Desktop/SVU/docs/svu_paper_stats_v2.md (appended, dated) and drafts the reliability paragraph for Methods 3.5 (you rewrite it).
Paper A (flagship -> Crime, Media, Culture)
1. Rewrite/read-aloud pass on /Users/tylerorden/Desktop/SVU/papers/svu_flagship_paper.md (the master; the .tex/.docx/.pdf are regenerated from it). Lead with the cultural/narrative argument (CMC cautions against largely quantitative papers); keep every number, table, quotation and citation verbatim; add the reliability paragraph from 0b.
2. Regenerate the formats: in Terminal run
   `cd /Users/tylerorden/Desktop/SVU/papers && pandoc svu_flagship_paper.md -o svu_flagship_paper.docx && pandoc svu_flagship_paper.md -s -o svu_flagship_paper.tex && tectonic svu_flagship_paper.tex && pdfinfo svu_flagship_paper.pdf | grep Pages`
3. References to SAGE Harvard: open the .docx -> compare three entries against a 2025 CMC article's reference list (author-date; journal titles italic; "Available at:" for URLs) -> fix punctuation in the .md and re-run step 2.
4. Get an ORCID if you do not have one: https://orcid.org/register (5 min; it serves every journal after).
5. Anonymize (no script exists — do it on the .docx): open svu_flagship_paper.docx in Word -> delete the author line and contact line on page 1 -> cut the Acknowledgments section (it moves to the title page) -> replace every "svu.vercel.app" / repository mention with "[dashboard URL withheld for review]" -> File > Info > Inspect Document > remove Document Properties and Personal Information -> Save As svu_flagship_paper_anonymized.docx.
6. Verify zero leaks: in Terminal run
   `cd /Users/tylerorden/Desktop/SVU/papers && python3 -c "import zipfile,re;x=zipfile.ZipFile('svu_flagship_paper_anonymized.docx').read('word/document.xml').decode();print(re.findall('Orden|Tyorden|tylerorden|vercel',x))"`
   Expected: `[]`.
7. Title page: create svu_flagship_title_page.docx with: title; "Tyler Satchel Orden, Independent Researcher, Los Angeles, CA, USA; tylerorden@gmail.com; ORCID ..."; Funding: none; Conflicts: none; Data availability: "Coding dataset, codebook and statistics brief: svu.vercel.app and the public repository (URLs on request during review)"; then paste the Acknowledgments paragraph (lines 1307-1317 of the .tex, the AI disclosure) verbatim.
8. Portal: https://mc.manuscriptcentral.com/cmc (SAGE Track for CMC — confirm the exact URL on the journal's author-instructions page, which the fetcher could not read) -> Create Account -> Author Center -> Start New Submission -> Article type: Original Research Article -> upload svu_flagship_paper_anonymized.docx as Main Document, svu_flagship_title_page.docx as Title Page -> wizard: double-anonymized YES; funding NONE; conflicts NONE; AI-use question: "Generative AI (Claude, Anthropic) was used as the coding instrument and for drafting assistance; fully disclosed on the title page and in Methods." -> Submit.
9. Log: dated line in /Users/tylerorden/Desktop/SVU/docs/PAPER_BUILD_LOG.md and /Users/tylerorden/Desktop/MathProofs/control/PROGRAM_LEDGER.md. Then tell Claude "svu flagship submitted".
Paper B (longitudinal -> Television & New Media)
1. Rewrite pass on /Users/tylerorden/Desktop/SVU/papers/svu_metoo_longitudinal.md WHILE CUTTING to 7,500 words INCLUDING references: the .md is 8,390 words with references and table text; target <= 7,300 in the .md so the Word count with refs lands under the cap. Abstract <= 150 words (currently ~330 words: cut it to half — see (i)).
2. Regenerate Word only: `cd /Users/tylerorden/Desktop/SVU/papers && pandoc svu_metoo_longitudinal.md -o svu_metoo_longitudinal.docx` -> open in Word -> Review > Word Count (include footnotes) — must read <= 7,500 -> check every table is an editable Word table (not an image), headings styled, no pandoc artifacts.
3. Anonymize the .docx exactly as A steps 5-6 (file svu_metoo_longitudinal_anonymized.docx; the python check must print `[]`).
4. Title page .docx as A step 7 with the B Acknowledgments paragraph (lines 806-817 of the .tex).
5. ORCID REQUIRED (have it from A step 4).
6. Portal: SAGE Track for TVNM (URL from the journal's author-instructions page; https://mc.manuscriptcentral.com/tvnm is the conventional form — confirm) -> submit the anonymized .docx + title page .docx; SAGE Harvard references; same wizard answers as A.
7. Log both files as in A step 9; then tell Claude "svu retreat submitted".

## (i) Improvement suggestions (report-only; no edits made)
BLOCKING
1. Validation-study gate (both papers): Methods 3.5 of A says "The validation study therefore includes speaker attribution as a named task: human raters will re-attribute..." and B's Limitations says "the planned human validation pass is a requirement for confidence, not a formality." Both papers promise a study that has not been run. Either run it and replace these with results ("A human validation on N episodes gave alpha = ... per variable"), or waive with a ledger line and rewrite both sentences as an explicit limitation ("No human validation study accompanies this analysis; the agreement statistics a reader would want are not available, and every rate here should be read as an instrument reading pending that check.").
2. B abstract length: ~330 words vs the TVNM 150-word cap (dashboard card). Replacement: keep sentences 1 (framing), the era shares with the chi-square, the S21 break sentence, the severity spike sentence, and the last sentence; drop the persons-per-episode, victim_ID and coercion U-shape figures from the abstract (they stay in the body).
3. B length: 8,390 words in the .md including references vs 7,500 cap including references — a real cut of roughly 900+ words before the rewrite can be "into the cap".
should-fix
1. A: the abstract's "62.4% of persons reach severity 3 or 4" and Methods' "521 person-episode records" are correct, but the flagship's opening sentence "one of the most durable fictions about policing ever broadcast" is an evaluative claim without a citation; add the run-length fact (27 seasons, 1999-2026, longest-running US primetime live-action series) with a source, or cut "most durable".
2. Both: Methods name "claude-sonnet-4-5-20250929" (A) vs "claude-sonnet-4-5" (B) — use the dated identifier in both.
3. B: overfull alignment 26 pt at lines 1111-1126 (a table wider than the text). Irrelevant to the Word artifact, but the same table will be wide in Word: split or transpose it.
4. A: "Manuscript prepared July 2026" line — remove for submission (dates the draft).
cosmetic
1. Both .tex are pandoc output with `\author{}` empty and the author typeset as body text; if a PDF is ever needed for review, set the author in the pandoc metadata instead.

UNTESTED AGAINST: live CMC and TVNM author pages (403 today; unread since July); the Word-count of the actual .docx with references (measured on the .md only); Sage's current AI-policy page text (Jul 2026 version on file); the L&O corpus repair (gate 3, optional for these two papers).
