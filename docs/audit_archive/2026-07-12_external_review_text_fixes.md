# 2026-07-12_external_review_text_fixes

Agent final report, extracted from session transcript agent-a00bfa0e1f4ca4841.jsonl (archived alongside as .raw.jsonl).

---

All six fixes applied, audits clean, derivatives regenerated, nothing committed.

## Edits made, per fix

**Flagship** (`/Users/tylerorden/Desktop/SVU/papers/svu_flagship_paper.md`)

1. **Apology-truncation honesty** (three spots). §3.1: "because it censors endings... it can only undercount early-era harm and acknowledgment" → split claim: "For prevalence and harm the direction is conservative... those counts are floors, the death audit included. For apology the same missingness cuts the other way... the 92.1% no-apology rate may be partly inflated, with the extra uncertainty concentrated in the early era," plus the planned repair/re-code and the point that the Section 4.7 gradient survives because "endings lost without regard to content thin every cell alike... a protection the marginal rate does not have." Limitations §6: "early-era harm and apology counts are therefore best read as undercounts" → same directional split. Closing wave-off "None of these limitations, I think, threatens the central proportions" → "Most of the central proportions survive these limitations comfortably... The marginal apology rate is the exception... I flag it rather than defend it." (Used v2's exact 92.1%, not the review's 92.5%.)

2. **Origin reframed as context.** §4.4, after the 54.5% lead finding: added "Some of that share is definitional. A detective procedural runs on detectives generating suspects... I read the field as context, locating where error enters the story... the indictment sits in... severity, disclosure, and apology," keeping the North Star point ("each of these 284 inferences produced public exposure or violence"). §5.4: appended "a majority the genre's structure partly guarantees." §7: "whose inference starts most false accusations and whose disclosure habits accompany the worst damage" → "their inference starts most false accusations, which a detective show partly guarantees, and, less forgivably, their disclosure habits accompany the worst damage while their apologies almost never arrive."

3. **Pretraining contamination.** New Limitation Fourth: "the instrument may know the show... could in principle recognize an episode and import outside knowledge, who really did it, how the hour is remembered," with the companion's metadata-stripped recode named as the test. "Six limitations" → "Seven"; old Fourth/Fifth/Sixth renumbered.

4. **Speaker attribution promoted.** §3.5: expanded the buried sentence into a passage naming the three attribution-dependent fields (police conduct, disclosing party, apology), flagging "The most exposed number in this article is the 83.9% squad share of disclosure," and committing the validation study to a named speaker-attribution check. §4.5: appended to the 83.9%/61.0% sentence: "a figure that leans on inferred speaker attribution in unlabeled transcripts more heavily than any other in this article (Section 3.5)."

**Longitudinal** (`/Users/tylerorden/Desktop/SVU/papers/svu_metoo_longitudinal.md`)

5. **Fabrication vs noise rule.** §4.3: "a collapse to 5.5%... the post-2020 fabrication drop is the second-largest movement" → "The victim-identification doubling clears the paper's ten-point noise rule... it is the finding. The fabrication decline, at 7.6 points from baseline, sits inside the noise band... I report it as consistent with the same editorial turn and build nothing on it"; "after 2020 it almost never locates the error in a liar" → "the noise band withholds judgment on that half." §5.2: "the fabricator is nearly extinct at 5.5%" → "The fabricator's slide to 5.5% points the same way but stays inside the noise band, so the argument rests on the doubling alone"; "accusers now rarely lie. They err" → "accusers err." §5.4: both fabrication-decline mentions demoted to point-estimate-within-noise phrasing. Abstract contains no fabrication claim, so no change needed there.

6. **Retitle.** Title → "The Retreat of the False Accusation Plot in Law & Order: SVU, 1999-2026". Abstract: "settled at 67.3%, no milder than baseline" → "settled at 67.3% after 2020, within the noise band of baseline (... an era-bounded spike rather than a durable shift)". No other in-text uses of the old title existed. Flagship reference entry updated to the new title, and one flagship cross-claim aligned: "during the #MeToo-era seasons measurably worse" → "with a suggestive spike toward worse during the #MeToo-era seasons."

## Audits
- Em/en dash, banned-word, and negation-structure greps: zero hits in both files.
- Number check: every headline value greps identically against `docs/svu_paper_stats_v2.md` (59.4/62.1/62.4/54.5/53.0/87.1/83.9/61.0/92.1/7.5/1.5/16.4/45.3/8.5, era series 65.3→50.0→41.8, 60.0→82.1→67.3, 15.5→30.8→29.1, 13.1→17.9→5.5, chi-squares 20.89/8.06/5.30, p .018/.071, truncation 145/25.2%/138/33.7%). The only new number is 7.6 (13.1 − 5.5), arithmetic on existing values. Diff-level scan confirms no existing figure changed.

## Regenerated
`svu_flagship_paper.docx`, `svu_flagship_paper.tex`, `svu_metoo_longitudinal.docx`, `svu_metoo_longitudinal.tex` in `/Users/tylerorden/Desktop/SVU/papers/` via pandoc. No git commit made.