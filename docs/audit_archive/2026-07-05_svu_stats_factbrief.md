# 2026-07-05_svu_stats_factbrief

Agent final report, extracted from session transcript agent-a5fc58ecd4198df1e.jsonl (archived alongside as .raw.jsonl).

---

**File written and verified: `/Users/tylerorden/Desktop/SVU/docs/svu_paper_stats.md`** (555 lines, sections A/B/C as specified; only file created, no commits). All numbers computed from the raw CSVs with stdlib Python; person-level n = 536 after excluding the 5 `actually_guilty` rows.

**Corrected death-audit headline (the draft's "31 murders, 21 suicides, 25 assaults" is wrong):**
- **21 murdered/killed** as a consequence of the accusation — **2 in custody** (Russell Ramsay S02E08 at Rikers; Manny Montero S15E13 at Rikers). Note: the prior cross-show audit's third "in-custody death," Edwin Adelson S12E02, was assaulted in custody but died by **suicide** — reclassified.
- **9 completed suicides**, plus **1 other accusation-linked death** (Leon Tate S03E04, overdose while wrongly suspected) → **30 dead** (31 counting Tate). Deaths occur in 30 distinct episodes = 5.2% of all 576; police apologize in only 6 of the 31 death cases.
- **7 suicide attempts** (survived; structured field) + 1 notes-only (Kevin Wright S12E21) — never counted as deaths.
- **27 non-fatal assaults/vigilante attacks/shootings** (structured field; incl. 4 police shootings, 3 in-custody violence) + 3 notes-only. Every qualifying row is listed with episode id, person, verbatim `consequence_detail`, and verdict; 4 keyword-trap rows are explicitly excluded with reasons (e.g., `arrested_for_wrong_murder`, `mother_sister_murdered_while_wrongly_imprisoned`).
- One duplicate person flagged: Father Alberto appears in both S09E19 and S26E19 (revisited storyline) — "unique lives" claims should subtract 1.

**Era trend headlines (S1–18 / S19–21 / S22–27):**
- False-suspect episode rate: **65.6% → 50.0% → 41.8%** (Y-only); 68.5% → 52.9% → 42.9% (Y+Maybe). χ² = 21.61 (Y-only) / 25.11 (Y+Maybe), df=2, both p < .01.
- Persons harmed/episode: **1.08 → 0.57 → 0.56**; but conditional severity rose: % sev 3–4 **60.0% → 82.1% → 67.3%** (χ² = 8.09, p < .05).
- Any police threat/coercion: 53.2% → 35.9% → 58.2% by era (pooled χ² = 5.10, n.s.), but the U-shape is sharp at block level: dip begins S15 (26.7%), bottom S16–18 = **27.7%** (S16 lowest at 14.3%), rebound to **56.7% (S22–24) and 60.0% (S25–27)**.
- Post-#MeToo origin mix shift: `victim_ID` 15.2% → 30.8% → 29.1%; `fabrication` 12.7% → 17.9% → 5.5%; media exposure spiked to 33.3% in S19–21 then fell back.

**Other key flagship numbers:** severity distribution 62/140/221/113 (mean 2.72); `squad_inference` leads normalized origins at 295/536 = 55.0% (vs the "wrong_ID 323" tag-level claim — reconciled precisely in A4/C6: 195 of 323 wrong_ID tags sit on squad_inference origins); apology rate 41/536 = 7.6% (9 formal) with a 0.0% → 6.4% → 5.4% → 17.7% severity gradient and no apology difference by threat status (7.8% vs 7.5%); media-channel sev-4 rate 46.0% vs 8.8% police-only (5.2× multiplier). Vocab normalizations documented (4 `victim_misID` → `victim_ID` after row inspection; 1 `third_party` → `witness_misID`). A14 contains 10 verbatim threat quotes, all 9 formal-apology cases, and 6 severity-4 vignettes with episode ids.