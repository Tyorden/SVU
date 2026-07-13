# 2026-07-04_new_analyses_explorer

Agent final report, extracted from session transcript agent-a0c038b3f2ca9ffc6.jsonl (archived alongside as .raw.jsonl).

---

Done. Wrote `/Users/tylerorden/Desktop/SVU/docs/new_analyses.md` (new file; nothing else modified, no commits). All numbers computed from the CSVs with stdlib Python, excluding the 17 `actually_guilty` rows (final n = 536 SVU / 417 L&O / 953 combined), with row-level manual verification of every death claim.

Top findings:

1. **Detectives are the #1 source of false accusations**: `squad_inference` is the leading origin on both shows — 58.2% combined (555/953). This corrects the existing "wrong_ID leads" headline, which counts a tag, not the origin field.
2. **SVU retreated from false-accusation plots post-#MeToo; the L&O revival leaned in**: SVU false-suspect episodes fell 65.6% → 50.0% → 41.8% across eras and persons-per-episode halved (1.08 → 0.56), but conditional severity rose (82.1% sev 3–4 in S19–21). Revival L&O went the other way: 80.0% of episodes vs 71.3% in the original run.
3. **42 innocent people die** (31 murdered incl. 3 in custody, 11 suicides); 5.0% of all SVU episodes end with an innocent accused dead; police apologize in 6 of 42 deaths (1 formal). Both L&O suicides are cops.
4. **Apology gradient**: 0.0% apology at severity 1 (n=115) rising to 12.5% at severity 4 (n=184); threats don't change apology odds. L&O police: 1.4%, zero formal — but **L&O prosecutors apologize 6.7% with 10 formal apologies**, and the innocent `defendant` role is the franchise's worst position (54.4% sev-4, n=57).
5. **Fabrication is ~4x deadlier than misidentification** (42.9% vs 11.0% sev-4), and **media exposure is a 6.5x severity-4 multiplier** vs police-only (44.6% vs 6.8%); a perp walk carries a 58.3% sev-4 rate.
6. **Counterintuitive pair**: on L&O, threatened suspects fare *better* than non-threatened ones (9.4% vs 25.0% sev-4) — coercion and catastrophe belong to different acts of the show; and SVU's coercion depiction rebounded to 57–60% post-2020 after a 27.7% mid-2010s low, the opposite of a "reformed post-2020 copaganda" story.
7. Child-related accusations are the most destructive (CSA 42.0% sev-4 vs murder 14.9%; teachers 36.7%, custody disputes 40.0%); the immigrant-tagged group got 0 apologies in 33 cases.

The doc also includes a 10-item ranked further-work list (human validation of the uncalibrated 97%-"high"-confidence rows first, then an NRE real-world join) and 9 data-quality observations (schema drift between the two runs' CSVs, vocab drift, L&O's 23.6% deep-review rate and 5 missing seasons, keyword traps that inflate death counts, and a probable duplicate person across episodes).