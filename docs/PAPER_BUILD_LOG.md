# BUILD LOG — the SVU/L&O false-accusation papers

**Convention (keep this log alive):** every future session that touches this project APPENDS a dated entry at the bottom covering its stage (ideation / data / coding / drafting / audit / revision / validation / submission / dissemination), the agents run, what was caught, what changed, and artifacts written. Never rewrite history; correct in a newer entry. Full agent reports: `docs/audit_archive/` (curated final reports in git; raw transcripts local-only). Reusable methodology: `~/Desktop/WritingWithClaude/adversarial-paper-pipeline.md`.

---

## Phase 0 — Data (January 2026)
All 576 SVU episode transcripts (and later 314 L&O) coded via the Anthropic Batch API (claude-sonnet-4-5) against a fixed North Star rubric; ~$15-17, ~14h. Full methodology + the exact prompt: `SVU_False_Accusation_Project_Documentation.md`.

## Phase 1 — Foundation session (2026-07-04)
Three parallel agents: site optimizer (initial JS 2,155kB -> ~180kB, SEO head), new-analyses explorer (10 computed findings incl. the tag-vs-field correction: squad_inference, not wrong_ID, leads origins), papers strategist (10 paper ideas -> 3, venue AI policies verified). L&O raw data recovered from ~/Desktop/LO; everything committed to the (public) repo.

## Phase 2 — Papers drafted (2026-07-05)
Stats fact-brief agent first (single source of truth; corrected the docx's keyword-inflated death counts), then two writer agents under the human-voice style law. Flagship ("Collateral Damage as Narrative Convention") + longitudinal (post-#MeToo era analysis).

## Phase 3 — The six-agent audit (2026-07-05) — the round that changed everything
Replication (~380 values recomputed from raw CSVs), hostile peer review, prose/human-voice critique, citation verification (36 refs web-checked; Dowler and Kort-Butler mischaracterizations caught), transcript ground-truth verification, full recompute.

**The ground-truth agent's discovery:** the source Excel itself was corrupted — NINE episodes carried the wrong transcript (duplicates of other episodes; full-text similarity audit), creating 15 phantom person-rows including the "Father Alberto revisit" (an artifact, cited in both papers at the time), and 145/576 transcripts truncate at Excel's 32,767-character cell limit (a third of pre-#MeToo episodes missing final acts). No CSV-level audit could have found this; only comparing against the source could.

**Consequences executed same day:** full re-analysis at n=521/567 (v2 stats; no finding flipped, both episode-level chi-squares held at p<.001, the media multiplier strengthened to 5.4x); death audit adjudicated row-by-row to 32 deaths/31 episodes; every quote verified verbatim against transcripts (zero confabulated; several corrected to exact wording, incl. the Pena clauses which were reversed and misattributed to a courtroom); the longitudinal paper's timing claim honestly relocated to Season 21 (its own per-season table contradicted a fall-2017 break — Leight's return and COVID promoted to live rivals; retitled); one consolidated revision agent applied the ~40-item spec (`docs/revision_spec.md`); site /findings synced to the corrected set.

## Phase 4 — External review + dissemination assets (2026-07-12)
An outside AI review scored the papers 7/10 and 6.5/10 as-submitted; its claims were verified against the drafts before acting (all held). Text fixes applied (apology-truncation direction split, origin-as-context, fabrication-vs-noise-rule, second retitle to "The Retreat of the False Accusation Plot..."); triage in `docs/external_review_triage.md`. Reddit graphics (5 PNGs, dataviz-skill palette validation, credit footers) + TikTok scripts (verified numbers, honesty guardrails) built; both hold until the OSF deposit exists.

## Catch ledger (what the audits actually earned, this project)
- Source corruption (9 wrong transcripts, 145 truncations) — ground-truth agent
- Keyword-inflated death counts (naive 59 -> verified 32) — stats + adjudication agents
- Tag-vs-field headline error (wrong_ID vs squad_inference) — analysis agent
- Longitudinal causal-timing contradiction (S21, not fall 2017) — hostile reviewer
- Two citation mischaracterizations (Dowler, Kort-Butler) + 1 wrong year (Manne) — citation agent
- Phantom two-episode apology and phantom revisited-death storyline — ground-truth agent
- A broken de-negation sentence, the closure-aphorism metronome, twin-paper shared idioms — prose agent
- Reversed/misattributed quotes vs transcripts — ground-truth agent
- Operator's own bugs (stale figure after silent script crash; naive greps defeated by TeX line-wrap) — main-session verification discipline

## Remaining gates (as of 2026-07-13)
1. Tyler's ~90-episode validation study (speaker attribution included; the 32 death rows + 8 formal apologies are the priority sample) — the one non-negotiable before submission.
2. Tyler's read-aloud voice pass on both manuscripts.
3. On go-ahead: corpus repair + re-run (~$20, kills the truncation limitation), metadata-stripped recode (~$5), air-date join (free).
4. OSF deposit + ORCID; then the social kit fires.

<!-- APPEND NEW ENTRIES BELOW THIS LINE -->
