# SVU False-Accusation Dataset: r/dataisbeautiful Graphics

Five publication-ready PNGs (light background, ~2000px wide, 200 dpi).
Every number is from `docs/svu_paper_stats_v2.md` (the corrected, post
source-corruption-audit analysis set). Regenerate all five with:

```
python3 graphics/make_charts.py    # requires matplotlib
```

Shared methodology (for all first comments): I pulled transcripts for all 576
Law & Order: SVU episodes (1999–2026) from subslikescript.com, then used
Claude (Anthropic) batch analysis to code every falsely accused person per
episode (identity, accusation origin, exposure channel, consequence severity
1–4, police conduct, apology), followed by a human audit. A transcript
ground-truth audit found 9 source files carried the wrong episode's
transcript; those episodes and their 15 phantom person-rows are excluded,
leaving n = 521 falsely accused persons on a corrected 567-episode base. The
death audit was adjudicated row-by-row against the source transcripts. Code
and data: github.com/Tyorden/SVU · Charts: matplotlib.

---

## 1. the_retreat.png

**Suggested [OC] title:**
[OC] For 20 years, ~2 in 3 Law & Order: SVU episodes featured a falsely
accused person. Season 21 (2019–20) broke the pattern.

**First comment (paste-ready):**
> **Data source:** All 576 SVU episode transcripts (1999–2026) via
> subslikescript.com. **Tools:** Claude (Anthropic) batch analysis for
> episode coding, human-audited; chart in matplotlib.
> **Methodology:** Every episode was coded for whether it features a person
> falsely accused of the episode's crime (definite cases only shown). 9
> episodes with corrupted source transcripts are excluded (567-episode base).
> **Key finding:** The false-accusation storyline averaged 65.3% of episodes
> pre-#MeToo (S1–18), fell to 50.0% in S19–21, and 41.8% in S22–27: the
> sharp break is Season 21 (2019–20) at 30.0%, not Season 19, i.e. two full
> seasons *after* #MeToo broke. Era differences: χ² = 20.89, p < .001.
> Full write-up and data: github.com/Tyorden/SVU

## 2. apology_gradient.png

**Suggested [OC] title:**
[OC] On SVU, police apologize to the falsely accused when the outcome is
catastrophic (16.4%): almost never otherwise, and their own misconduct
doesn't change the odds

**First comment (paste-ready):**
> **Data source:** All 576 SVU episode transcripts (1999–2026) via
> subslikescript.com. **Tools:** Claude (Anthropic) batch analysis,
> human-audited; matplotlib.
> **Methodology:** n = 521 falsely accused persons; each coded for
> consequence severity (1 private harm → 4 life-altering/death), any police
> apology (partial or formal), and police conduct (threats/coercion).
> **Key finding:** Apology rates by severity run 0.0% → 6.6% → 5.6% → 16.4%.
> Apology tracks catastrophe, not conduct: persons the police threatened or
> coerced were apologized to at 8.0% (22/276) vs 6.9% (17/245) for everyone
> else. Overall apology rate 7.5%; formal apologies 1.5% (8 of 521).
> Full write-up and data: github.com/Tyorden/SVU

## 3. media_multiplier.png

**Suggested [OC] title:**
[OC] On SVU, a false accusation that reaches the media is 5.4× more likely
to end in a ruined life or death than one that stays inside the precinct

**First comment (paste-ready):**
> **Data source:** All 576 SVU episode transcripts (1999–2026) via
> subslikescript.com. **Tools:** Claude (Anthropic) batch analysis,
> human-audited; matplotlib.
> **Methodology:** n = 521 falsely accused persons, each coded for the
> channel through which the accusation became public and for consequence
> severity; chart shows the share reaching severity 4 (life-altering or
> death) per channel. Small channels (legal n=14, church n=4, multiple n=18,
> school n=20, online/unknown n=2) are shown but de-emphasized.
> **Key finding:** Media exposure: 45.3% severity-4 (39/86) vs police-only
> 8.5% (12/142): a 5.4× multiplier. Dramaturgical association within the
> show's writing, not a causal estimate.
> Full write-up and data: github.com/Tyorden/SVU

## 4. the_death_toll.png

**Suggested [OC] title:**
[OC] 32 innocent people die after being falsely accused on Law & Order: SVU
, roughly 1 in every 18 episodes

**First comment (paste-ready):**
> **Data source:** All 576 SVU episode transcripts (1999–2026) via
> subslikescript.com. **Tools:** Claude (Anthropic) batch analysis,
> human-audited; matplotlib.
> **Methodology:** Every death and violent attack against a falsely accused
> person was adjudicated row-by-row against the source transcripts (not just
> keyword-matched): 21 murdered (2 in custody, 1 killed by police), 9
> suicides, 2 other accusation-linked deaths (an overdose; AIDS contracted
> during 15 years of wrongful imprisonment) = 32 dead across 31 distinct
> episodes (5.4% of all 576). Plus 8 survived suicide attempts and 31
> non-fatal attacks (28 structured + 3 notes-only).
> **Key finding:** Only 5 of the 32 dead ever received any police apology.
> Full write-up and data: github.com/Tyorden/SVU

## 5. who_points_the_finger.png

**Suggested [OC] title:**
[OC] Who falsely accuses people on SVU? In 54.5% of cases it's the
detectives' own inference: victims and witnesses combined account for
about a quarter

**First comment (paste-ready):**
> **Data source:** All 576 SVU episode transcripts (1999–2026) via
> subslikescript.com. **Tools:** Claude (Anthropic) batch analysis,
> human-audited; matplotlib.
> **Methodology:** n = 521 falsely accused persons; each coded on a
> controlled vocabulary for who first pointed the finger (accusation
> origin). Distribution: squad inference 54.5% (284), victim identification
> 18.0% (94), deliberate fabrication 12.7% (66), witness misidentification
> 7.5% (39), tech/database error 4.8% (25), coerced interview 2.3% (12),
> unknown 0.2% (1).
> **Key finding:** The squad's own theory of the case: not victim error ,
> drives most false accusations on the show; all victim + witness
> misidentification combined is 25.5%, less than half the squad's share.
> Full write-up and data: github.com/Tyorden/SVU

---

**Posting notes:** r/dataisbeautiful requires the data source and tools in a
comment on [OC] posts: the blocks above satisfy that. The source/tool
credit is also baked into each image footer so it survives re-shares.
