# 2026-07-05_audit_transcript_groundtruth

Agent final report, extracted from session transcript agent-a5d1f8d10db9cc598.jsonl (archived alongside as .raw.jsonl).

---

All verification complete. Here is the full ground-truth report.

---

# TASK 1 — QUOTE VERIFICATION AGAINST TRANSCRIPTS

Method: quotes split on ellipses into segments; matched against the claimed episode's transcript after normalizing case/whitespace/punctuation/curly quotes. Note: these transcripts carry no speaker labels, so **no speaker attribution in either paper is transcript-verifiable** (Benson/Fin/Tutuola/Stabler attributions are plausible but unprovable from this source).

| # | Quote (paper, episode) | Verdict | Transcript wording / discrepancy |
|---|---|---|---|
| 1 | Ramsay "I gotta stay awake at night so I don't get ambushed... I can't look at a guy without getting jumped." (S02E08) | **VERBATIM** (both segments) | — |
| 2 | "Russell Ramsay was attacked at Rikers. He was beaten and raped. He was killed." (S02E08) | **VERBATIM** | — |
| 3 | "We know you're illegal... if you're not at our office by 9:00 a.m., Immigration will be at your house by 9:05. That I can personally guarantee you." (S01E12) | **NEAR** (trivial) | Transcript: "Look, we know you're illegal. We're not Vice. We don't care how much undeclared income you have or how many gifts you've received, **but** if you're not at our office by 9:00 a.m., lmmigration will be at your house by 9:05. That I can personally guarantee you." Ellipsis is legitimate; the second segment drops the leading "but." Speaker (paper: Benson) unverifiable. |
| 4 | Mia Bixton "Tell us the truth, and it counts in your favor. It counts a lot... once your mother shows up, the lawyers show up. And then truth time is over." (S07E20) | **VERBATIM** (both segments) | — |
| 5 | Roger Berry "I put Roger in the box and I grilled him over and over and over, till I convinced myself he'd been in those apartments. I fed him every detail of the case." (S03E06) | **VERBATIM** | — |
| 6 | Liston "You don't have a job anymore. And if I were you, I wouldn't go out there." (S22E10) | **VERBATIM** | Transcript has "**Oh,** you don't have a job anymore." — leading interjection omitted; acceptable excerpt. Speaker (paper: Tutuola) unverifiable. |
| 7 | Hernandez "Detective Monte and the DA told me if I didn't confess, that I'd get the sayonara syringe. Man, I was 18. I didn't have no mommy no more to help me." (S21E06) | **NEAR** | Transcript: "Then why'd you fess up? / **Because Monte** and the DA told me if I didn't confess, that I'd get the sayonara syringe. Man, I was 18. I didn't have no mommy no more to help me." Paper inserts "Detective" (he is called "Detective Monte" elsewhere in the episode) and drops "Because." Longitudinal's "telling Carisi" framing not verifiable from transcript. |
| 8 | Ashlee Walker "I must have hit her so hard, I killed my baby." (S10E19) | **VERBATIM** | — |
| 9 | ADA "No, you didn't... Sierra died from measles." (S10E19) | **VERBATIM** (both segments) | — |
| 10 | Barbarossa "We got your DNA to match to the rape kit. That alone will get you 12-and-a-half to 25 years of personal training at Attica... Your parole officer hasn't even been born yet." (S04E02) | **VERBATIM** (both segments) | — |
| 11 | Cragen "I was wrong, Miss Mulroney. Please accept my apologies to your family." (S01E13) | **NEAR + data artifact** | Transcript: "I was wrong, Miss Mulroney. / **— All right.** / Please accept my apologies to your family." A reply ("All right") is spliced out without ellipsis. **Bigger problem: S01E13's transcript is not 'Disrobed' at all — it is a second subtitle rip of 'Entitled' (S01E15)** (see Task 2/3 corruption findings). The "same apology in two episodes" claim rests on a duplicated transcript, not a two-episode storyline. |
| 12 | Same line (S01E15) | **NEAR** | Transcript: "I was wrong, **Ms.** Mulroney. All right. Please accept my apologies to your family." ("Ms." vs "Miss"; same spliced "All right.") |
| 13 | Stabler "I made a mistake, Victor. I wanted to tell you myself" (S11E01) | **VERBATIM** | — |
| 14 | Tate "And then my life just stopped! Lost my woman, my friends! Hell, my mother barely knows me!" (S11E01) | **VERBATIM** | — |
| 15 | Benson "I forced a false confession... I broke him" (S13E17) | **NEAR — order reversed + wrong setting** | Both clauses are verbatim but in the **opposite order**: "…I told him that he was going away no matter what. **I broke him.** / You were doing your job. / **I forced a false confession.**" And the scene is a **private conversation, not a courtroom confession** — the flagship's "Benson confesses in court" is wrong. The courtroom scene contains only the judge: "this court sincerely apologizes" (paper's "court's sincere apology" is supported). |
| 16 | Jerome Jones victim: "Then arrest him! He attacked me... He raped me!" (S16E13) | **NEAR — resequenced** | Transcript order: "Please! **He attacked me.** / — Hey, you lying! / — Put your hands up. / I'm trying to help you, okay? / **Then arrest him! He raped me!**" The paper moves "He attacked me" after "Then arrest him," reversing the actual sequence. |
| 17 | Adelson "Three strikes, you're out" (S12E02) | **VERBATIM** | — |
| 18 | Adelson "what were you reading, Lolita? Get your juices flowing before you attacked Mandy?" (S12E02) | **VERBATIM** | — |
| 19 | Fin "Better hope she shows up. Alive." (S22E10) | **VERBATIM** | Speaker unverifiable (unlabeled). |
| 20 | Country Jones paraphrase (S23E07): tearing apart restaurant/car; lie enough to send him back to South Carolina prison, three months on parole | **SUPPORTED** | Transcript: "We're tearing apart your restaurant, we're tearing apart your car." and "But you have three months left on your parole, right? You lied to us, and that's enough to send you back to a South Carolina prison." |

**Bottom line for Task 1:** no confabulated quotes. 13 verbatim, 6 near (worst offenses: the reversed Pena clauses plus the false "in court" setting; the resequenced Jerome Jones lines; the spliced Mulroney apology), 1 paraphrase supported. The S01E13 Mulroney citation cites a corrupted transcript.

---

# TASK 2 — DEFINITIVE DEATH/INJURY ADJUDICATION

## Critical new finding: nine episodes carry the WRONG transcript (duplicates of other episodes)

Full-text similarity across all 576 transcripts (difflib ratios 0.93–0.999 vs 0.01–0.04 for unrelated pairs) shows these slots contain another episode's script:

| Corrupted slot | Actually contains | Evidence | Duplicate person-rows created |
|---|---|---|---|
| S01E13 'Disrobed' | 'Entitled' (S01E15), different rip | Mulroney×28, ratio 0.32 (two subtitle rips of same episode), no 'Disrobed' content | Stephanie Mulroney |
| S02E11 'Abuse' | 'Consent' (S02E10) | ratio 0.9986; frat/sorority/campus markers | Harry, Joe Templeton, Hank Ludlow |
| S02E18 'Manhunt' | 'Parasites' (S02E19) | ratio 0.9994; mail-order/Latvia/dentist markers | Brad Stanton, Pam Stanton, Matt Sloane, Paul Amis, George Burton, "Dentist (unnamed)" |
| S04E10 'Resilience' | 'Grief' (S04E23) | ratio 0.9271 (two rips); Eno/Randall/Sirett in both | Karl Sirett |
| S05E04 'Loss' | 'Game' (S06E14) | ratio 0.9983; Tauber×28 | Larry Tauber |
| S05E14 'Ritual' | 'Rescue' (S12E10) | ratio 0.9980; Calvin/Vivian markers | none (0 rows — but note: identical text yielded 0 rows here vs 3 rows at S12E10, an instrument-reliability red flag) |
| S08E11 'Burned' | 'Chasing Theo' (S18E08) | ratio 0.9978; Theo×98 | Gabriel Norton |
| S09E19 'Cold' | 'Play with Fire Part 2' (S26E19) | ratio 0.9988; Carisi/Velasco/Alberto markers | Miguel Pinto, **Father Alberto** |
| S11E09 'Perverted' | 'Cornered' (S26E08) | ratio 0.9987; Carisi×26 | none (0 rows both) |

Consequences: (a) **Father Alberto dies once, in S26E19; the "storyline the show revisits (S09E19, S26E19)" in both papers is a transcript-duplication artifact** — the real 'Cold' (S09E19) was never coded; (b) Larry Tauber's suicide belongs to S06E14 'Game', not S05E04 'Loss' (and the same text was coded twice with contradictory severities: 4 vs 1); (c) the papers' "five episodes had defective source text" undercounts — **14 episodes are defective** (4 empty, 1 encoding-damaged, 9 wrong-transcript). Additionally, **145 transcripts are truncated at exactly 32,767 characters (the Excel cell limit)** — see Task 3a.

## Named adjudications

| Case | Verdict | Reason |
|---|---|---|
| Ricky Torres S21E06 | **COUNT — other accusation-linked death** | Structured detail `died_of_AIDS_shortly_after_release`; notes attribute to wrongful imprisonment; transcript: "HIV? Full-blown AIDS. **He caught that while inside.**" Coerced at 15, served 15 years, died before exoneration. |
| Dr. Archibald Newlands S05E05 | **COUNT — murdered** | Notes: "murdered execution-style before trial… direct consequence of false rape accusation." Transcript: "Newlands got killed around 9:00" and "**The honey rapist reads about the trial, whacks him**" — the false-rape prosecution is what prompted the real rapist to kill him. |
| Dr. Matt Spevak S05E23 | **EXCLUDE — separate causal chain** | Structured detail is only `arrested`; notes say "murdered by actual killer while being framed" — Emma killed him to complete her frame ("Matt was dead two hours before Emma called 911"). The accusation and the murder are parallel products of the killer's scheme; the accusation did not cause the death. (Contrast Fierstein, whose structured detail says `…then_murdered` and whose notes attribute the murder to the accusation scheme — kept, flagged as the weakest murder inclusion.) |
| Robert Logan S05E03 | **Real attempt, but EXCLUDE from accusation-caused attempts** | Transcript confirms wrist-slitting ("He sliced deep enough to have the hospital admit him") — but detectives discover it **on first contact**, when they arrive to pick him up; he could not yet have known he was accused. Not attributable to the accusation. |
| Dr. Colin Bennett S18E15 | **EXCLUDE — not an attempt** | Transcript: Benson finds him holding a gun ("You don't need that gun either… My work was my life"). Contemplation interrupted; no attempt. (His harm also stems from blackmail, not an accusation.) |
| Kevin Wright S12E21 | **COUNT — attempt (structured, not notes-only)** | `suicide_attempt` is in his **tags** (the flagship's "notes-only" label is wrong). Transcript: rooftop scene — "I have cleansed myself. And now… I'm gonna fly." / "Kevin! What were you trying to do?" — attempt during pursuit as rape suspect; committed to Bellevue. |
| Aidan Connor S05E15 | **EXCLUDE — ideation only** | Transcript: "I **wish** I'd just used my father's gun on myself." No attempt. |
| Javier Vega S05E21 | **EXCLUDE — no attempt shown** | Episode ends with daughter presenting a note: "I think he's **going to** kill himself." Threat/note only; heroin relapse is his physical harm (already in structured detail). |
| Jeb Curtis S08E17 | **COUNT — non-fatal shooting** | "Reverend Curtis took two rounds to the gut. He's touch and go" — survives (final scene alive, forgiving his wife). Shot by wife who believed the accusation. |
| Sean Roberts S18E02 | **COUNT — non-fatal (prison rape)** | Transcript: "I know what it's like to be raped! I went in when I was 18, 140 pounds. What do you think happened to me?" Wrongful conviction 16 years earlier; guilty of the present-day murder but innocent of the original rape, which is what the row measures. |
| Joseph Eglee S06E05 | **COUNT — non-fatal (mob violence)** | Transcript: named in the paper as suspect, "they chased him into the street, and straight into a car"; "still unconscious… He's stable." |
| Danny Gonzalez S22E07 | **COUNT as non-fatal attack; police-shooting incident #5, but NOT a wounding** | Transcript: "Take one more step, and I'll shoot!… Shots fired… You're lucky you didn't have two bullets in your chest." Det. Moldovan fired and missed; Gonzalez's injuries were a dog bite. Count 4 wounded-by-police + 1 fired-upon = 5 police-shooting incidents (plus Reynolds, killed by police, under murders). |
| Mrs. Guarana S15E17 | **EXCLUDE entirely** | Coder's own notes: "This is not a false accusation case per se" — she was never accused; she was raped in retaliation for her husband's debts. Row fails the North Star criteria; flag as dataset inclusion error. |
| Luke Bolton S18E17 | **COUNT — non-fatal shooting** | Transcript ending: gunman at the restaurant "saw the Congressman with his daughter… So he shot him." He is shot (outcome not shown; not codeable as death). Structured detail says `physical_attack_on_family`; notes + transcript pin the shooting on Bolton himself. |
| Marc Rajic S13E09 | **COUNT — notes-only non-fatal (attempted immolation)** | Transcript: "Nadia Grey just tried to set Marc Rajic on fire. She doused him with gasoline through the window. Tried to spark him." Unharmed; structured field records only `vigilante_threat`. |
| Doug Loveless S12E19 | **EXCLUDED stays excluded** | He *is* murdered by Jerry Bullard — but the coder's notes explicitly say the murder "occurs in a different causal chain" (investigation exposed his con, not the false assault accusation). Fails the attribution rule. Worth a footnote as an investigation-caused death. |
| Jean Dussault S01E08 | **EXCLUDED stays** | OD'd in Canada before the investigation reached him; prior deportation predates accusation. |
| Travis Hall S01E04 | **EXCLUDED stays** | Transcript: "Because he OD'd a week before she was killed." Death precedes the crime itself. |
| Peter Ridley S01E04 | **EXCLUDED stays** | `arrested_for_wrong_murder` — alive; keyword trap. |
| Restaurant owner (Mr. Lee) S18E17 | **EXCLUDED from injuries** | Death threats, armed intrusion, business losses — no on-screen injury to him. |
| Hernandez family S21E06 | **EXCLUDED stays** | Mother/sister murdered while Carlos was imprisoned; not the accused person; Carlos survives. |

## FINAL DEFINITIVE NUMBERS

| Category | Count | Delta vs flagship |
|---|---|---|
| Murdered/killed as consequence of accusation | **21 unique persons** (22 CSV rows; S09E19 Alberto row is a duplicate-transcript artifact) — 2 in custody (Ramsay, Montero); 1 killed by police (Reynolds) | Same total as flagship's 21, but composition differs: **+Newlands, −Father Alberto duplicate** |
| Completed suicides | **9** (1 in custody: E. Cappilla) | Same 9; Tauber reattributed S05E04→S06E14 |
| Other accusation-linked deaths | **2** (Leon Tate S03E04 OD while suspected — weakest causal link, retain with caveat; **Ricky Torres S21E06 AIDS — new**) | +1 |
| **Total dead** | **32 unique persons** (33 rows as coded) | flagship 31 → **32** |
| Distinct episodes with a death | **31 true episodes** (32 as-coded slots; S04E21 has two deaths) = **31/576 = 5.4%** (as-coded 5.6%) | flagship "30 episodes / 5.2%" wrong either way |
| Apologies among the dead | **5 unique persons** = 5/32 (15.6%): Evan Ramsey (formal), Leon Tate, Father Alberto, Lonnie Liston, Laura Kozlowski (partial). 6/33 as-coded rows. Newlands and Torres: none. | flagship "6 of 31" counts the Alberto duplicate |
| Suicide attempts (survived) | **8**, all structured: Charlotte Truex S08E14, Frank Sullivan S11E21, Kevin Wright S12E21, Gabriel Thomas S13E04, Joanne Parsons S13E21, Cedric Jones S15E16, Ronald Fleming S18E17, Pence Humphreys S24E15. Excluded: Logan, Connor, Vega, Bennett (above) and Ashlee Walker (notes say "implied"; nothing in transcript). | Same total 8, but Wright is structured, not notes-only |
| Non-fatal assaults/vigilante attacks/shootings | **28 structured-supported + 3 notes-only = 31** | flagship 27+3=30; +Bolton |
| Police shootings (non-fatal) | **4 wounded** (Willie Angel S04E13, Michael Baxter S05E11, Larry Luft S11E13, Yusef Barre S15E11) **+ 1 fired-upon-missed** (Gonzalez S22E07) = 5 incidents; plus 1 fatal (Reynolds S17E05, under murders) | flagship's "4" = wounded only |

**Complete murdered list (21):** Sonya Pietrovicz S01E12; Russell Ramsay S02E08 (custody); Evan Ramsey S03E01; Peter Sipes S04E05; Joe Cappilla S04E21; **Archibald Newlands S05E05**; Derek Tanner S06E15; Mike Kona S09E08; Eric Byers S10E02; Joshua Galli S10E06; Mehcad Carter S15E03; Gene Fierstein S15E09 (weakest inclusion — accuser-as-killer); Manny Montero S15E13 (custody; "My executioners took care of Manny"); Jerome Jones S16E13; Terrence Reynolds S17E05 (shot 35× by police); Trey Franklin S18E10; Greg Harvey S19E07; Douglas Moore S20E13; Quentin Dreyfus S20E20; Lonnie Liston S22E10; Father Alberto S26E19 (once).

**Suicides (9):** Mark Nash S02E06; Eddie Cappilla S04E21 (custody); Larry Tauber S06E14 (as-coded S05E04); Mariel Plummer S05E18; Joel Mayder S07E13; Laura Kozlowski S08E15; Francis Slifkin S09E17; Edwin Adelson S12E02; Anthony Fierro S26E22.

**Complete non-fatal attack list (28 structured):** Hamoud S02E02; McKenna S02E04; Barrera S02E05; E. Plummer S03E02; Sena S03E11; Pomerantz S04E04; Angel S04E13; Baxter S05E11; Coyle S05E15; Eglee S06E05; Buggesi S07E06; Curtis S08E17; Dan S09E02; Haver S09E16; Bartlett S09E18; Luft S11E13; Brazecki S13E19; Chen S13E19; Belyakov S14E13; Barre S15E11; Roberts S18E02; Bolton S18E17; Rivera S19E04; Prasada S21E15; Gonzalez S22E07; Povic S23E10; Soto S26E13; Rhodes S26E21. **Notes-only (3):** Sharon Harris S11E13 (attacked by crowd); Father Chris Shea S14E10 (beaten by vigilantes); Marc Rajic S13E09 (attempted immolation). **Additional exclusions from attack counts:** Welker S03E05 (harms predate accusation), Bleyer S09E10 (seizure, not attack), Hingham S11E19 (psychiatric commitment, not attack), McCain S06E05 / Corea S02E04 (they were the attackers), Gunther S01E09 ("assault" = violent arrest, no third-party attack), Cedric Jones's injury (product of his suicide attempt — counted there), Underwood S12E12 (actually_guilty, outside n=536).

---

# TASK 3 — DIAGNOSTICS

## 3a. Transcript length by season (words in `text`)

Era means: **S1–18 = 5,682** (5,738 excluding the 4 empty transcripts), **S19–21 = 5,381**, **S22–27 = 5,662**. Season means range 5,150–6,022 with no downward era trend (S26 = 5,827 > S1 = 5,320). **Later-era transcripts are NOT systematically shorter — the "retreat" cannot be a transcript-thinning artifact.**

The real length artifact runs the other way: **145/576 transcripts (25.2%) are truncated at exactly 32,767 characters — the Excel cell limit** — and 138 of those 145 are in S1–18 (33.7% of the era) vs 2 in S19–21 and 5 in S22–27. A third of early-era episodes are missing their final acts (where reveals, deaths, and apologies land), which if anything **undercounts early-era harm and apologies and makes the documented decline conservative** — but it must be disclosed, and it may bias early-era apology/death detection downward.

## 3b. Unique-person estimate

- Total rows: **541**; actually_guilty excluded: **5** → analysis set **536** person-episode rows (confirmed).
- **15 rows are transcript-duplication artifacts** (same episode text coded under two slots): Mulroney S01E13; Harry, Templeton, Ludlow S02E11; Stanton, P. Stanton, Sloane, Amis, Burton, "Dentist (unnamed)" S02E18; Sirett S04E10; Tauber S05E04; Norton S08E11; Pinto + Alberto S09E19 → **521 distinct person-episode measurements**.
- Genuine cross-episode recurring persons (same person, different real episodes): Nick Amaro ×3 (S14E17/S15E24/S16E03), Elliot Stabler ×2 (S08E14/S12E23), Brian Cassidy ×2 (S14E17/S19E14), Ed Tucker ×2 (S17E17/S17E18), Simon Marsden ×3 (S08E16/S08E19/S13E16), Stephen Lomatin ×2 (S14E05/S17E09) → 8 further rows are repeat persons.
- **Estimated unique persons ≈ 513.**
- The two "known pairs" in my brief resolve as: Stephanie Mulroney S01E13+S01E15 = **transcript artifact, not a two-episode arc**; Father Alberto S09E19+S26E19 = **transcript artifact, not a revisited storyline** (the papers' framing of both is wrong).

## 3c. Persons per flagged episode by era (has_false_suspect = Y; qualifying rows only)

| Era | Y episodes | Persons in Y eps | Mean persons/Y-episode | Y episodes with 0 qualifying person rows |
|---|---|---|---|---|
| S1–18 | 269 | 440 | **1.64** | 13 (4.8%) — S01E02, S02E14, S03E19, S06E13, S10E08, S10E12, S11E06, S12E03, S12E12, S13E07, S15E12, S16E15, S16E22 |
| S19–21 | 34 | 39 | **1.15** | 4 (11.8%) — S19E08, S19E22, S20E06, S21E20 |
| S22–27 | 41 | 55 | **1.34** | 3 (7.3%) — S23E04, S23E13, S26E16 |

Within flagged episodes, person density falls only 1.64→1.15→1.34 (vs the halving of the episode flag itself), and zero-person Y-episodes rise from 4.8% to 11.8% (#MeToo era) before easing to 7.3% — a **mild harm-threshold-censoring signal in S19–21 (on 4 of 34 episodes)**, but the retreat is overwhelmingly carried by the episode-level flag, not by censored person rows. Sanity note: 2 qualifying persons sit in Maybe-flagged episodes (Ron Polikoff S06E08, Mavis Summers S15E22); none in N episodes.

**Headline for the revision:** quotes are sound (fix the Pena "in court" framing, the Pena clause order, the Jerome Jones sequence, and the Mulroney splice); the death table becomes 21 murdered + 9 suicides + 2 other = **32 dead across 31 episodes (5.4%)**, apologies 5/32; and both papers must disclose the newly found source corruption — 9 wrong-transcript episodes (killing the Alberto "revisit" and the two-episode Mulroney apology) and the 32,767-character truncation affecting a third of pre-#MeToo transcripts.