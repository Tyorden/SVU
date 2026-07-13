# 2026-07-05_recompute_v2_stats

Agent final report, extracted from session transcript agent-a851d89fe4aeb932d.jsonl (archived alongside as .raw.jsonl).

---

The file is written. I ran a final spot-check of hand-transcribed values against the script output — all consistent. No other files were modified and nothing was committed.

## Confirmation

**`/Users/tylerorden/Desktop/SVU/docs/svu_paper_stats_v2.md` is written** — a complete recomputation of every v1 table (Sections A and B) on the corrected set (n = 521 persons; 567 episodes primary / 576 reference), plus the adjudicated death audit (all 32 dead rows and 8 attempt rows verified to exist in the CSV and match — 32/32, 31 episodes, 5/32 apologies, exactly as spec §4B), a harm-censoring discriminator table, updated data notes, a source-quality section (14 defective episodes by type; 145 truncated transcripts computed directly from the Downloads Excel: 138 pre-era / 2 S19–21 / 5 post), and a 50-row reconciliation table.

## Reconciliation highlights (v1 → v2)

| Statistic | v1 | v2 | Why |
|---|---|---|---|
| Person-level n | 536 | **521** | 15 phantom rows |
| Episode base | 576 | **567** primary | 9 wrong-transcript episodes |
| False-suspect rate (Y / Y+M) | 59.7% / 62.3% | **59.4% / 62.1%** (337, 352/567) | episode exclusion |
| squad_inference share | 55.0% | **54.5%** (284/521) | phantoms |
| who_told = squad | 87.3% | **87.1%** (454/521); among spread cases 84.1% → **83.9%** (318/379); 61.0%-of-all unchanged | phantoms |
| Media multiplier | 5.2× | **5.4×** (45.3% vs 8.5%) — stronger | phantoms |
| Formal apologies | 9 rows / 8 unique | **8 rows / 8 unique** — Mulroney S01E13 confirmed phantom; the "two-episode apology" is an artifact | phantom |
| Any threat | 52.4% | **53.0%** (276/521) | phantoms |
| Sev-4 apology rate | 17.7% | **16.4%** (18/110) | 2 apologized phantoms dropped |
| Pre-era FS rate | 65.6% | **65.3%** (262/401) | 7 of 9 corrupted eps were Y, all pre-era |
| Deaths | 30–31, 6 apologies | **32 dead / 31 episodes (5.4% of 576, 5.5% of 567), 5/32 apologies** | adjudication (Newlands in, Alberto once, Tauber→S06E14, Torres in) |
| Attempts / non-fatal | 7+1 / 27+3 | **8 structured / 28+3** (Wright via tags; Sean Roberts S18E02 in; Guarana out) | adjudication |
| χ² era×FS Y-only / Y+M | 21.61 / 25.11 | **20.89 (p=.000029) / 24.45 (p=.000005)** at N=567 | episode exclusion |
| χ² era×severity | 8.09, p=.018 | **8.06, p=.018** — still fails Bonferroni (.071); "suggestive" wording stands | phantoms |
| χ² era×threat | 5.10, p=.078 n.s. | **5.30, p=.071 n.s.** | phantoms |
| Censoring discriminator | spec: 1.64/1.15/1.34; 4.8%/11.8%/7.3% | exact corrected: **1.62/1.15/1.34; 5.0%/11.8%/7.3%** (spec used uncorrected pre denominator) | both |
| wrong_ID tag | 323 | **309** (185 on squad_inference) | phantoms |
| Sev 3–4 / mean | 62.3% / 2.72 | **62.4% / 2.72** (median 3) | phantoms |

## Direction / significance verdict

**No finding flips direction and no test changes significance status.** Both episode-level chi-squares stay at p < .001; the severity test stays at p = .018 (still Bonferroni-fragile, exactly as spec §2.2 already words it); the threat test stays n.s. (moved .078 → .071, toward but not across .05). The 54.5% squad_inference share still leads its distribution by 36.5 points. Two watch-items for the papers: (1) the only rank change anywhere — workplace (143) now edges police_only (142) as modal exposure channel by one row, so neither version should claim an ordering; (2) v1's flagged 62.3%=62.3% coincidence becomes 62.1% vs 62.4% — adjacent, no longer identical, so soften that flag. The media multiplier (5.4×) and Season-1 threat rate (70.6%) are the only values that got stronger after correction.