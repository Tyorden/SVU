# 2026-07-05_findings_page_builder

Agent final report, extracted from session transcript agent-a0a27bbd6a59595b9.jsonl (archived alongside as .raw.jsonl).

---

Done. The Findings page is built, wired, and verified.

## Files changed
- **`/Users/tylerorden/Desktop/SVU/src/pages/Findings.tsx`** (new) — the /findings page with all six sections: hero + methodology box (n=536 exclusion rule, July 2026, note that Episodes/Analysis show the full 541 rows), the Corrected Death Audit (StatCards + row-audited harm breakdown chart, with an amber note explaining why keyword matching overcounts and why those numbers are hard-coded), the Apology Gradient (severity-colored bar chart + 4 StatCards incl. threatened 7.8% vs unthreatened 7.5%), the Media Multiplier (sorted severity-4-by-channel chart with media highlighted, 5.2x computed at runtime, legal's n=14 caveated), Who Points the Finger (normalized origin chart + wrong_ID tag reconciliation note), and the Era Story (4 charts with consistent era colors: false-suspect rate, persons/episode, conditional severity 3–4, and the coercion U-shape by 3-season blocks).
- **`/Users/tylerorden/Desktop/SVU/src/App.tsx`** — added lazy `Findings` import and `/findings` route (same React.lazy + Suspense pattern), plus route-list comment.
- **`/Users/tylerorden/Desktop/SVU/src/components/Navbar.tsx`** — "Findings" link after Analysis in both desktop and mobile menus, rendered only on the SVU side (`!isLO`) since no `/lo/findings` route exists.

## Design decisions
- All field-based stats compute at runtime from `persons.json`/`episodes.json` with the paper's rules (`innocence_status !== 'actually_guilty'`; `victim_misID → victim_ID`; `third_party → witness_misID`). Only the death-audit counts and the two chi-square results are hard-coded, each labeled "verified/audited July 2026."
- Visual style matches existing pages exactly: ChartCard/StatCard, indigo accent, existing chart hex colors, `getSeverityColor` for the gradient chart, same section headers, grids, and mobile breakpoints. Era colors (indigo/violet/orange) are consistent across all four era charts, and names (not color alone) carry identity everywhere.

## Verification
- **Runtime vs stats file:** I ran an independent Node script applying the page's exact filter/normalization against the JSON — every number matched `docs/svu_paper_stats.md` exactly (n=536; severity 62/140/221/113; apology gradient 0.0/6.4/5.4/17.7 with overall 41/536=7.6% and formal 9=1.7%; threatened 7.8% vs 7.5%; media 46.0% vs police-only 8.8%; origins 295/95/66/41/26/12/1; wrong_ID 323 with 195 on squad_inference; era rates 65.6/50.0/41.8, 1.08/0.57/0.56, 60.0/82.1/67.3; coercion blocks including the 27.7% S16–18 bottom and 56.7%/60.0% rebound). **No discrepancies — nothing needed resolution.**
- `npx tsc --noEmit` passes (one fix required: Recharts Tooltip generic inference breaks when combining `formatter` + `labelFormatter`, resolved by loosening the labelFormatter param types).
- `npm run build` succeeds; Findings ships as its own lazy chunk (`Findings-C96v3-pC.js`, 5.4 kB gzip).
- `vite preview` + curl: `/findings` → 200, `/` → 200; preview server stopped afterward.
- No commits made; `index.html`, docs/, papers/, and /lo pages untouched.