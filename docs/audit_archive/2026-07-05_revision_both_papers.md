# 2026-07-05_revision_both_papers

Agent final report, extracted from session transcript agent-a17ee0599f9db9989.jsonl (archived alongside as .raw.jsonl).

---

Both manuscripts are fully revised in place. No other files touched, no commits made.

## FLAGSHIP (papers/svu_flagship_paper.md)

**Word count** (body = §1-§7 prose, tables/notes/refs excluded): 7,789 before → **7,990** after (target ≤8,000; with abstract: 8,087 → 8,297; whole file 9,691 → 10,122, growth is references + tables).

**Five most consequential changes:**
1. Full migration to the corrected analysis set (n=521 persons, 567-episode primary base) with a new §3.1 corruption narrative: 9 wrong-transcript cells (row-i assumption failed silently, caught only by ground-truth audit; none drew the deep-review flag), 145/576 transcripts truncated at Excel's 32,767-char cap (138 in S1-18 = 33.7%, bias direction stated), 14 defective episodes total.
2. §4.8/Table 9 rebuilt to the adjudicated death audit: 21 murdered + 9 suicides + 2 other = 32 dead across 31 episodes (5.4% of 576 / 5.5% of 567), apologies 5/32, 8 attempts, 28+3 non-fatal, 4+1+1 police shootings; every borderline named (Newlands in via tags, Tauber moved to S06E14, Spevak/Loveless/Dussault/Guarana out, Alberto dies once — "revisit" framing removed).
3. The 87.3% publicity claim replaced with the conditional version: squad discloses in 83.9% of the 379 cases that spread beyond the precinct (61.0% of all); media multiplier reframed dramaturgically at 5.4x (45.3% vs 8.5%); no workplace/police_only ordering claim.
4. Formal apologies corrected to 8 rows/8 persons with the Mulroney double-coding narrated as an audit catch; Pena passage fixed to transcript clause order ("I broke him" then "I forced a false confession"), private scene, judge's in-court apology; all retained quotes verified verbatim against the source Excel (Hernandez "Because Monte...", Jones sequence restored, Mulroney quoted without the splice).
5. New title (template dropped), Dowler and Kort-Butler & Sittner Hartshorn findings corrected, Karakatsanis softened to news-focused "popularized," NRE URL fixed, seven new references added (Krippendorff, Neuendorf, Gilardi, Törnberg arXiv, Ziems, Cuklanz 2000, Projansky, Hust), companion cited under L's new title, validation-honesty and truncation limitations added, circularity sentence in acknowledgments.

## LONGITUDINAL (papers/svu_metoo_longitudinal.md)

**Word count**: 6,484 before → **6,247** after (target ≤6,300; with abstract: 6,700 → 6,537).

**Five most consequential changes:**
1. Timing restructure (spec 2.1): new per-season Table 1 as primary evidence; break stated plainly at Season 21 (S19 54.2%, S20 62.5% at/above the S14-18 plateau); Leight return and COVID promoted to live rivals in abstract, intro, §5.1, §7; new title; "density halved at the boundary" removed.
2. Reform-censoring added as a named rival in §5.1 with the discriminator (1.62 → 1.15 → 1.34 persons per flagged episode; 5.0% → 11.8% → 7.3% zero-person flagged episodes; 4 of 34), plus the truncation-conservatism defense of the retreat.
3. All numbers on corrected denominators: 65.3/50.0/41.8, χ² 20.89 (p=.000029) and 24.45 (p=.000005), severity 8.06 p=.018 kept "suggestive" with the Bonferroni sentence, coercion 5.30 p=.071 n.s.; inference justified (superpopulation + clustering caveat); "triple" → roughly double (2.1x, 1.7x per episode); "worse outcomes" bounded to S19-21 in abstract and §4.2.
4. Vignette exclusivity: Hernandez/Prasada/Adelson/Jones moved out (Torres and Carter now carry §4.2/§4.3); Liston kept with transcript-verified quotes ("Oh, you don't have a job anymore"); Alberto single-death; broken sentence rewritten ("accusers now rarely lie. They err.").
5. Compact Method upgrades: corruption + truncation disclosure, transcript-thinning affirmative check (5,682/5,381/5,662 words), codebook essentials, air_date fix (121/576), 3-18 season cells, quote-verification sentence, era-correlated coder-bias limitation with the metadata-stripped re-code test, funnel discipline and Hust in §5.4, Bernabo/Color of Change split, Manne 2017.

## Fixes not applied as literally written (all superseded, with reasons)
- Spec 1.3's 84.1% and spec 2.2's χ² values (21.61/25.11/8.09/5.10) → replaced by v2's corrected-set values (83.9%; 20.89/24.45/8.06/5.30), per v2's explicit supersession.
- Spec 1.1's "attempts include Logan and Bennett" → superseded by §4B's final adjudication, which excludes both by name; §4B implemented.
- Spec 2.15's "Alberto-revisit" for L → the revisit no longer exists post-audit; L keeps Alberto's single S26E19 death.
- §4B's discriminator figures (1.64/4.8%) → v2's corrected-denominator 1.62/5.0% used, as v2 directs.
- Hust et al. reference kept as "et al." exactly as spec 2.17 supplied (full author list not given; not invented) — submission-checklist item, like the Eschholz 2004 date (spec 4.6, deliberately unchanged).

## Self-audit results (spec §5)
- Em/en dashes, banned-word regex, negation patterns, "In conclusion/summary": **zero hits both papers**. No [VERIFY] tags. Only non-ASCII is the "ö" in Törnberg.
- Stale v1 numbers: only two survivors, both deliberate: F's narration of the early draft's "31 murders, 21 suicides" keyword-trap error and the "nine formal-apology rows" correction story; L's Table 1 shows 52.4% as Season 18's genuine per-season rate (11/21).
- Tics: exactly/precisely F=2, L=2; genuinely 1 each; definitively/relentlessly/"comfortably above"/"for the first time with precision" all gone; shared twin idioms now appear in at most one paper each.
- Every changed number was verified against svu_paper_stats_v2.md, and all seven quote fixes (Pena, Jones, Mulroney, Hernandez, Liston x2, Ivanova, Tate, Ramsay) were checked directly against the transcript Excel; protected passages (Ramsay opening, "This study counts.", extended keyword-trap confession, "it is the blocks I trust", "Its brand was belief.", both closes) are intact.