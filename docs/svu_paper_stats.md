# SVU Statistical Fact-Brief for the Two Papers

**Generated:** 2026-07-05, computed directly from `svu_persons_harmed.csv` (541 rows) and `svu_episodes_summary.csv` (576 episodes) with Python (stdlib `csv`). No number below is estimated or carried over from earlier documents; the death/violence audit was verified row-by-row against `consequence_detail`, `notes`, and `quote_or_scene`.

**Person-level analysis set:** 541 raw rows minus 5 `actually_guilty` rows = **n = 536** innocent (or partially-involved-but-innocent-of-the-accusation) persons. Excluded rows: svu_s03_e19 (Thomas 'Bird' Gordon); svu_s03_e19 (Judge Walter Thornburg); svu_s06_e20 (Gabriel Duvall (initial questioning)); svu_s12_e03 (Bill Harris (initially)); svu_s12_e12 (Orville Underwood).

**Episode-level denominators:** all 576 episodes. `has_false_suspect` has three values (Y / N / Maybe); every episode rate is reported two ways: Y-only, and Y+Maybe.

---

## A. FLAGSHIP PAPER TABLES (SVU-only)

### A1. Episode-level rates (denominator = 576 episodes)

| Flag | Y | Maybe | Y-only rate | Y+Maybe rate |
|---|---|---|---|---|
| has_false_suspect | 344 | 15 | 344/576 = 59.7% | 359/576 = 62.3% |
| has_public_exposure | 300 | 11 | 300/576 = 52.1% | 311/576 = 54.0% |
| needs_deep_review | 16 | — | 16/576 = 2.8% | — |

`has_public_exposure` also contains 3 `N/A` values (missing-transcript episodes). All 15 `has_false_suspect = Maybe` episodes include the 4 missing-transcript episodes (S14E01, S14E02, S15E01, S17E01); the Maybe set is where the coder could not commit either way.

### A2. Consequence-severity distribution (n = 536)

| Severity | Definition | n | % |
|---|---|---|---|
| 1 | private/low-level harm | 62 | 11.6% |
| 2 | public exposure, no formal sanction | 140 | 26.1% |
| 3 | material sanction / serious fallout | 221 | 41.2% |
| 4 | life-altering or death | 113 | 21.1% |

Mean severity **2.72**; severity 3–4: **334/536 = 62.3%**; severity 4 alone: 113/536 = 21.1%.

### A3. Innocence-status distribution (n = 536; 5 `actually_guilty` rows excluded)

| innocence_status | n | % |
|---|---|---|
| proven_innocent | 442 | 82.5% |
| strongly_implied_innocent | 51 | 9.5% |
| partially_involved | 43 | 8.0% |

`partially_involved` rows (guilty of something else, innocent of the accused offense) are retained per the controlled-vocabulary definition.

### A4. accusation_origin distribution (controlled field, normalized; n = 536)

| accusation_origin | n | % |
|---|---|---|
| squad_inference | 295 | 55.0% |
| victim_ID | 95 | 17.7% |
| fabrication | 66 | 12.3% |
| witness_misID | 41 | 7.6% |
| tech_db_error | 26 | 4.9% |
| coerced_interview | 12 | 2.2% |
| unknown | 1 | 0.2% |

**Normalization applied:** raw field contained out-of-vocabulary `victim_misID` (n=4) and `third_party` (n=1). Row inspection: all 4 `victim_misID` rows (S12E15 flight passenger, S16E13 Jerome Jones, S20E09 Peter Stone, S21E05 Mohammed Sayeed) are cases where **the victim herself/himself identified the wrong person**, which is exactly the documented definition of `victim_ID` ("victim names or identifies the person") — folded into `victim_ID` (91+4 = 95). The 1 `third_party` row (S17E17 Sister Nina Kelly, discredited to the squad by her monsignor) matches `witness_misID` ("third party points to the person") — folded into `witness_misID` (40+1 = 41).

**Tag-vs-field reconciliation (the "wrong_ID 323" claim):** the free-form `wrong_ID` *tag* appears on 323 of 541 raw rows (323 of the 536 innocent rows). It is NOT the same thing as a misidentification origin: among the 323 innocent `wrong_ID`-tagged rows, the controlled `accusation_origin` is `squad_inference` 195 (60.4%), `victim_ID` 68 (21.1%), `witness_misID` 31 (9.6%), `tech_db_error` 19 (5.9%), `fabrication` 8 (2.5%), `coerced_interview` 2 (0.6%). In other words, the tag mostly marks "the squad had the wrong person" as an episode outcome — 195 of its uses sit on top of `squad_inference` origins — whereas the controlled field records **who first pointed the finger**. On the controlled field, the squad's own inference dominates (295/536 = 55.0%), and genuine victim misidentification is 95/536 = 17.7%. Papers should cite the field, not the tag.

### A5. Exposure channel and who-told distributions (n = 536)

| exposure_channel | n | % |    | exposure_who_told | n | % |
|---|---|---|---|---|---|---|
| police_only | 147 | 27.4% |    | squad | 468 | 87.3% |
| workplace | 146 | 27.2% |    | victim | 25 | 4.7% |
| family | 92 | 17.2% |    | third_party | 20 | 3.7% |
| media | 87 | 16.2% |    | media | 17 | 3.2% |
| multiple | 20 | 3.7% |    | unknown | 6 | 1.1% |
| school | 20 | 3.7% |    |  | |  |
| legal | 14 | 2.6% |    |  | |  |
| church | 5 | 0.9% |    |  | |  |
| unknown | 3 | 0.6% |    |  | |  |
| online | 2 | 0.4% |    |  | |  |

Exposure spread beyond law enforcement (channel ≠ police_only/unknown) for 386/536 = 72.0% of persons; the squad itself is the discloser (`exposure_who_told = squad`) in 468/536 = 87.3% of all cases.

### A6. consequence_category distribution (n = 536)

| consequence_category | n | % |
|---|---|---|
| multiple | 207 | 38.6% |
| legal | 156 | 29.1% |
| social | 59 | 11.0% |
| work | 47 | 8.8% |
| physical | 42 | 7.8% |
| family | 25 | 4.7% |

### A7. police_conduct_threat distribution (n = 536)

| police_conduct_threat | n | % |
|---|---|---|
| none | 255 | 47.6% |
| verbal_threat | 110 | 20.5% |
| coercive_tactic | 69 | 12.9% |
| multiple | 56 | 10.4% |
| insult_degradation | 46 | 8.6% |

**Any threat/coercion** (verbal_threat + coercive_tactic + insult_degradation + multiple): **281/536 = 52.4%**.

### A8. police_apology (n = 536)

| police_apology | n | % |
|---|---|---|
| none | 493 | 92.0% |
| partial | 32 | 6.0% |
| formal | 9 | 1.7% |
| unknown | 2 | 0.4% |

**Blank/unknown handling:** the raw 541-row file contains 2 blank `police_apology` cells and 2 `unknown`. Both blanks sit on `actually_guilty` rows and drop out with the exclusion; the 2 `unknown` rows (both svu_s20_e21, the unnamed Italian parents) remain and are treated as *not* an apology in rate calculations (they are also excluded from nothing else). Any-apology rate (partial+formal): **41/536 = 7.6%**; formal only: 9/536 = 1.7%.

**Apology-by-severity gradient (SVU-only):**

| Severity | n | any apology | rate | formal |
|---|---|---|---|---|
| 1 | 62 | 0 | 0.0% | 0 |
| 2 | 140 | 9 | 6.4% | 2 |
| 3 | 221 | 12 | 5.4% | 1 |
| 4 | 113 | 20 | 17.7% | 6 |

**Apology × threat crosstab (SVU-only):**

| Group | n | any apology | rate |
|---|---|---|---|
| threatened/coerced | 281 | 22 | 7.8% |
| not threatened | 255 | 19 | 7.5% |

Detectives who threatened or coerced the innocent person are essentially no more likely to apologize than those who did not; apology tracks catastrophe (severity), not misconduct.

### A9. VERIFIED DEATH / PHYSICAL-HARM AUDIT (row-level, corrects the draft)

**The draft's claim of "31 murders, 21 suicides, and 25 assaults or vigilante attacks" does not survive row-level verification.** Verified SVU-only counts (n = 536 innocent persons):

| Category | Verified count |
|---|---|
| Murdered / killed as a consequence of the accusation | **21** (of which **2 in custody**: Russell Ramsay S02E08, Manny Montero S15E13) |
| Completed suicides | **9** |
| Other accusation-linked death (overdose while suspected: Leon Tate S03E04) | **1** |
| **Total dead** | **30** (murder+suicide); **31** counting the Tate overdose |
| Suicide attempts, survived (structured field) | **7** (+1 notes-only: Kevin Wright S12E21) |
| Non-fatal physical assaults / vigilante attacks / shootings (structured field) | **27** (+3 notes-only) |

Deaths occur in **30 distinct episodes = 5.2% of all 576** (S04E21 contains two deaths, one murder and one suicide). Among the 31 dead, police apologize (partial or formal) in **6** cases.

Where the draft's numbers came from: naive keyword matching on `consequence_detail`/`tags` counts non-death strings as deaths — e.g., `arrested_for_wrong_murder`, `accused_of_murder`, `suicide_attempt`, `suicide_watch`, `assisted_suicide`, `family_murdered`, `mother_sister_murdered_while_wrongly_imprisoned`, and `suspected_then_cleared_by_death`. "21 suicides" is roughly completed suicides + attempts + suicide-adjacent strings; "31 murders" absorbs murder-*accusation* strings.

#### A9a. Murdered / killed (every qualifying row)

| Episode | Person | consequence_detail (verbatim) | Verdict |
|---|---|---|---|
| svu_s01_e12 | Sonya Pietrovicz (nightclub singer) | `murdered` | **Murdered** — Murdered by the actual killer while under false suspicion. |
| svu_s02_e08 | Russell Ramsay | `arrested, perp_walk, charged, incarcerated_at_rikers, beaten_and_raped_by_inmates, murdered` | **Murdered (in custody)** — Falsely accused via the sex-offender registry; beaten, raped, and murdered by inmates at Rikers. |
| svu_s03_e01 | Evan Ramsey | `arrested, perp_walk, public_confrontation_with_wife, case_dismissed_then_murdered` | **Murdered** — Cleared when fabrication exposed; days later shot dead by daughter Jody in a confrontation (framed on-screen as accidental during the confrontation). |
| svu_s04_e05 | Peter Sipes (aka Gregory Rossovitch) | `murdered` | **Murdered** — Murdered. |
| svu_s04_e21 | Joe Cappilla | `murdered` | **Murdered** — Murdered (brother Eddie dies by suicide in the same episode). |
| svu_s06_e15 | Dr. Derek Tanner | `public_questioning_at_work, arrested, murdered` | **Murdered** — Publicly questioned at work, arrested, then murdered. |
| svu_s09_e08 | Mike Kona (MMA fighter) | `murdered` | **Murdered** — Murdered. |
| svu_s09_e19 | Father Alberto | `shot_and_killed` | **Murdered** — Shot and killed. |
| svu_s10_e02 | Eric Byers (17-year-old stepbrother) | `murdered` | **Murdered** — 17-year-old stepbrother, murdered. |
| svu_s10_e06 | Joshua Michael Galli (Josh) | `murdered` | **Murdered** — Murdered. |
| svu_s15_e03 | Mehcad Carter | `murdered` | **Murdered** — Murdered. |
| svu_s15_e09 | Gene Fierstein (deceased victim of false rape accusation) | `relationship_stress_with_fiancee_reputation_damage_then_murdered` | **Murdered** — Falsely accused of rape as part of a premeditated murder scheme; murdered by his accuser, who was convicted of first-degree murder. |
| svu_s15_e13 | Manny Montero | `public_arrest_in_neighborhood, interrogation_coercion, held_in_custody, relationship_destroyed, murdered_in_pr` | **Murdered (in custody)** — Partially involved (froze, did not participate); agreed to testify and was murdered in Rikers. |
| svu_s16_e13 | Jerome Jones (Brooklyn Jerome Jones, one of Prospect Park Three) | `murdered` | **Murdered** — Kidnapped, tortured, and murdered by the victim's father after release — a vigilante killing. |
| svu_s17_e05 | Terrence Reynolds | `murdered` | **Murdered** — Murdered. |
| svu_s18_e10 | Trey Franklin (victim, deceased) | `murdered` | **Murdered** — Murdered. |
| svu_s19_e07 | Greg Harvey | `murdered` | **Murdered** — Murdered. |
| svu_s20_e13 | Douglas Moore (father) | `murdered` | **Murdered** — Murdered. |
| svu_s20_e20 | Mr. Quentin Dreyfus (drama teacher) | `murdered` | **Murdered** — Drama teacher, murdered. |
| svu_s22_e10 | Lonnie Liston | `fired, surveillance, parole_violation_threat, tortured_murdered_by_vigilantes` | **Murdered** — Fired, surveilled, threatened with parole violation, then tortured and murdered. |
| svu_s26_e19 | Father Alberto | `murdered` | **Murdered** — Murdered. Same character as S09E19 (revisited storyline); counted as a separate person-row — a cross-episode dedup would reduce unique lives by 1. |

#### A9b. Completed suicides

| Episode | Person | consequence_detail (verbatim) | Verdict |
|---|---|---|---|
| svu_s02_e06 | Mark Nash | `arrested, remanded_without_bail, coerced_medication, suicide` | **Suicide** — Remanded without bail, coerced medication; suicide. |
| svu_s04_e21 | Eddie Cappilla | `suicide` | **Suicide** — Suicide (brother Joe murdered in same episode). |
| svu_s05_e04 | Larry Tauber | `suicide` | **Suicide** — Suicide. |
| svu_s05_e18 | Mariel Plummer (ACS social worker) | `arrested, fired, pension_loss, media_crucifixion, threatening_calls, suicide` | **Suicide** — ACS worker; arrested, fired, pension lost, media pile-on; suicide after a further confrontation. |
| svu_s07_e13 | Joel Mayder | `suicide` | **Suicide** — Suicide. |
| svu_s08_e15 | Laura Kozlowski (mother) | `suicide` | **Suicide** — Suicide. |
| svu_s09_e17 | Dr. Francis Slifkin | `suicide` | **Suicide** — Suicide. |
| svu_s12_e02 | Edwin Adelson | `arrested, perp_walk, media_outing, assaulted_in_custody, public_arraignment, suicide` | **Suicide** — Framed via planted files; arrested, perp-walked, media-outed, assaulted in police custody by an officer, then died by suicide. |
| svu_s26_e22 | Anthony Fierro | `suicide` | **Suicide** — Suicide. |
| svu_s03_e04 | Leon Tate | `public_questioning_at_work, arrested, charged_then_dropped, reputation_damage, death_by_overdose` | **Other death (overdose)** — Died of a drug overdose while wrongly suspected of serial murders; mother blames police for his death. Not a murder and not coded as suicide — reported as a separate line, not in the murder/suicide counts. |

#### A9c. Suicide attempts (survived) — counted separately, never as deaths

| Episode | Person | consequence_detail (verbatim) | Verdict |
|---|---|---|---|
| svu_s08_e14 | Charlotte Truex (daughter) | `suicide_attempt` | **Suicide attempt** — Minor interrogated without counsel; slit her wrist immediately after coerced confession. Survived. |
| svu_s11_e21 | Frank Sullivan | `arrested,charged_then_dropped,family_alienation,suicide_attempt,imprisoned_pretrial` | **Suicide attempt** — Arrested, charged then dropped; suicide attempt. Survived; received one of the 9 formal apologies. |
| svu_s13_e04 | Gabriel Thomas | `arrested_in_front_of_family_arraigned_remanded_suicide_attempt` | **Suicide attempt** — Arrested in front of family, remanded; suicide attempt. Survived. |
| svu_s13_e21 | Joanne Parsons | `arrested_perp_walk_home_searched_suicide_attempt_reputation_destroyed` | **Suicide attempt** — Arrested, perp-walked, home searched; suicide attempt. Survived. |
| svu_s15_e16 | Cedric Jones | `arrested, perp_walk, interrogation_coercion, held_overnight, suicide_attempt, career_ending_injury` | **Suicide attempt** — Partially involved (guilty of assault, innocent of hate-crime framing); suicide attempt plus career-ending injury. Survived. |
| svu_s18_e17 | Ronald Fleming | `interrogation_coercion, suicide_attempt, arrested` | **Suicide attempt** — Coerced in interrogation; suicide attempt. Survived. |
| svu_s24_e15 | Dr. Pence Humphreys | `arrested_charged_then_cleared_suicide_attempt` | **Suicide attempt** — Arrested, charged then cleared; suicide attempt. Survived. |
| svu_s12_e21 | Kevin Wright | `public_confrontation_family_conflict_prior_wrongful_SO_registration` | **Suicide attempt (notes-verified only)** — `consequence_detail` does not record it, but `notes` state he attempted suicide by jumping from a roof during the police pursuit; hospitalized. Counted separately because it is not in the structured field. |

#### A9d. Non-fatal physical assaults / vigilante attacks / shootings

| Episode | Person | consequence_detail (verbatim) | Verdict |
|---|---|---|---|
| svu_s01_e09 | Ray Gunther (the Parkway Rapist) | `arrested_charged_then_dropped_plus_assault` | **Police violence (flagged)** — `consequence_detail` says "plus_assault"; notes/quote show a violent arrest in a motel room. Coded here as force during arrest — flag as ambiguous (could be read as an assault charge). |
| svu_s02_e02 | David Hamoud | `assaulted` | **Police violence** — Tackled by police in a mistaken-identity stop. |
| svu_s02_e04 | Randall McKenna (stepfather) | `public_questioning_at_work, assaulted by Denny resulting in critical condition with cerebral hemorrhage` | **Third-party attack** — Beaten into critical condition (cerebral hemorrhage, possible permanent disability) by Denny Corea, who believed the false accusation. |
| svu_s03_e02 | Eric Plummer (aka Norman Webber) | `wrongful_conviction_7years_beaten_raped_tortured_in_prison` | **In-custody violence** — Wrongfully convicted; beaten, raped, and tortured over 7 years in prison. Survived (later became a perpetrator). |
| svu_s03_e11 | Erin Sena | `assaulted` | **Third-party attack** — Visible facial injury; notes say beaten to keep quiet, "consequence of being suspected/questioned." |
| svu_s04_e04 | Roger Pomerantz | `assaulted` | **Third-party attack** — Attacked at the precinct by the actual killer shouting "Murderer! I'll kill you!" |
| svu_s04_e13 | Willie Angel | `shot_paralyzed_wrongfully_imprisoned_25_years` | **Police shooting** — Shot by officers and paralyzed, then framed with a drop gun; 25 years wrongful imprisonment. |
| svu_s05_e11 | Michael Baxter | `arrested, convicted, imprisoned_10_years, shot_by_police, separated_from_son, public_stigma` | **Police shooting** — 10 years wrongfully imprisoned on a false victim ID; shot by police during the hostage/escape standoff. Survived. |
| svu_s05_e15 | Brian Coyle (Shannon's brother) | `assaulted_by_mother_public_humiliation` | **Family violence** — Assaulted by his mother amid the accusation; public humiliation. |
| svu_s06_e05 | Joseph Eglee (Cadet) | `chased_into_traffic_hospitalized` | **Pursuit injury** — Cadet chased into traffic and hospitalized as fallout from the accusation. |
| svu_s07_e06 | Mr. Buggesi (elderly neighbor) | `vigilante_attack` | **Vigilante attack** — Elderly neighbor, vigilante attack. |
| svu_s08_e17 | Reverend Jeb Curtis | `media_perp_walk_public_humiliation_shot_by_wife` | **Family shooting** — Shot by his wife, who believed the false confession; survived. |
| svu_s09_e02 | Dan (Rachel's boyfriend) | `assaulted_by_victim_father` | **Third-party attack** — Assaulted by the victim's father. |
| svu_s09_e18 | PJ Bartlett (son) | `assaulted` | **Third-party attack** — Thrown through a window (ambulance required) in a family fight detectives deliberately provoked. |
| svu_s11_e13 | Larry Luft (Babs Duffy's boyfriend) | `shot_by_police` | **Police shooting** — Shot by a protective-detail officer who mistook him for the rapist; gunshot wound and concussion. |
| svu_s13_e19 | Henry Brazecki | `arrested, publicly_accused, vigilante_attack, broken_hand, hospitalization, reputation_damage` | **Vigilante attack** — Vigilante attack, broken hand, hospitalization. |
| svu_s13_e19 | Andy Chen | `arrested, public_questioning_at_work, media_outing, vigilante_attack, civil_rights_lawsuit` | **Vigilante attack** — Media-named as "the West Soho rapist" (innocent of the serial rapes), beaten by five vigilantes on camera. |
| svu_s13_e21 | Rick Simms | `forced_resignation_fired_arrested_perp_walk_wife_left_reputation_ruined` | **Staged attack** — Beaten in a staged gay-bashing arranged by the accuser's father. |
| svu_s14_e13 | Coach Alexei Belyakov | `stabbed_in_testicles_ice_pick` | **Third-party attack** — Stabbed in the testicles with an ice pick — life-threatening injury from the false perception of abuse. |
| svu_s15_e11 | Yusef Barre | `shot_paralyzed` | **Police shooting** — Shot by Det. Amaro on the mistaken belief he was armed; paralyzed. |
| svu_s18_e17 | Congressman Luke Bolton | `public_reputation_damage, online_pileon, media_exposure, physical_attack_on_family` | **Shooting** — Framed congressman; shot at a restaurant as the episode ends (survival implied but injury on-screen). |
| svu_s19_e04 | Max Rivera | `assaulted` | **Third-party attack** — Beaten by fellow students after agreeing to testify: scratched cornea, three fractured bones. |
| svu_s21_e15 | Luna Prasada (CEO of We-B-Well) | `perp_walk, arrested, charged, public_humiliation, media_pileon, assaulted_in_jail, company_takeover, career_de` | **In-custody violence** — Framed CEO; sexually assaulted by inmates while jailed without bail. |
| svu_s22_e07 | Danny Gonzalez | `arrested,shot_at,media_outing,charged_then_dropped` | **Shooting (flagged)** — `shot_at` by the actual perpetrator to silence him; the field does not confirm a wound — flag. |
| svu_s23_e10 | Darko Povic | `shot_by_accomplice` | **Third-party shooting** — Shot by his white-supremacist accomplice for talking to police; hospitalized. |
| svu_s26_e13 | Eddie Soto | `vigilante_attack` | **Vigilante attack** — Vigilante attack. |
| svu_s26_e21 | Derek Rhodes (Atlas's biological father) | `assaulted` | **Family attack** — Beaten with a baseball bat by his son (the actual perpetrator); hospitalized. |
| svu_s11_e13 | Sharon Harris (victim's girlfriend) | `arrested` | **Crowd attack (notes-verified only)** — Notes: physically attacked by the crowd after the second rape; structured detail records only the arrest. |
| svu_s10_e20 | Ethan Morse | `public_confrontation_multiple_witnesses` | **Altercation (notes-verified only)** — Notes: physical altercation at the station with the actual abuser; detail field records only public confrontation. |
| svu_s13_e09 | Marc Rajic | `hunted_by_police, hidden_by_family, neighborhood_fear, vigilante_threat, reputation_damage` | **Attempted vigilante burning (notes-verified only)** — Notes: Nadia Grey attempted to burn him alive with gasoline; detail field records only `vigilante_threat`. |

#### A9e. Keyword-trap rows explicitly EXCLUDED from the audit

| Episode | Person | Why excluded |
|---|---|---|
| svu_s01_e04 | Travis Hall | `suspected_then_cleared_by_death` — he OD'd a week BEFORE the crime; death precedes and is unrelated to the accusation. |
| svu_s01_e04 | Officer Peter Francis Ridley | `arrested_for_wrong_murder` — keyword "murder" but nobody dies of the accusation. |
| svu_s21_e06 | Carlos Hernandez | `mother_sister_murdered_while_wrongly_imprisoned` — his family was murdered while he was wrongfully imprisoned 16 years; he survived. |
| svu_s18_e17 | Mr. Lee (Coral Dragon restaurant owner) | `death_threats, armed_confrontation` — threats and an armed intrusion at his restaurant, but no one is shown physically harmed. |

### A10. role_in_plot and accused_of distributions (n = 536)

| role_in_plot | n | % | mean sev | % sev 4 |
|---|---|---|---|---|
| initial_suspect | 210 | 39.2% | 2.98 | 28.6% |
| red_herring | 180 | 33.6% | 2.44 | 13.9% |
| family_member | 80 | 14.9% | 2.67 | 23.8% |
| colleague | 24 | 4.5% | 2.38 | 4.2% |
| other | 23 | 4.3% | 2.78 | 13.0% |
| community_member | 19 | 3.5% | 2.95 | 26.3% |

| accused_of (normalized) | n | % |
|---|---|---|
| rape | 324 | 60.4% |
| assault | 66 | 12.3% |
| CSA | 45 | 8.4% |
| sex_crime_vague | 43 | 8.0% |
| other | 30 | 5.6% |
| kidnapping | 7 | 1.3% |
| murder | 4 | 0.7% |
| DV | 4 | 0.7% |
| trafficking | 4 | 0.7% |
| harassment | 3 | 0.6% |
| CP | 2 | 0.4% |
| arson | 2 | 0.4% |
| child_abandonment | 1 | 0.2% |
| terrorism | 1 | 0.2% |

Spelling variants folded into `kidnapping`: `kidnap` (1), `kidnapping/child_abduction` (2), `kidnapping/child abduction` (1). `murder` (4), `kidnapping`, `arson`, `terrorism`, `child_abandonment` are out-of-vocabulary values the tagger introduced; they are kept as-is (relabeled only for spelling).

### A11. Severity crosstabs

**Severity × accusation_origin (normalized; n = 536):**

| Origin | n | sev1 | sev2 | sev3 | sev4 | mean | % sev 3–4 | % sev 4 |
|---|---|---|---|---|---|---|---|---|
| squad_inference | 295 | 46 | 95 | 111 | 43 | 2.51 | 52.2% | 14.6% |
| victim_ID | 95 | 4 | 17 | 50 | 24 | 2.99 | 77.9% | 25.3% |
| fabrication | 66 | 2 | 8 | 28 | 28 | 3.24 | 84.8% | 42.4% |
| witness_misID | 41 | 7 | 14 | 17 | 3 | 2.39 | 48.8% | 7.3% |
| tech_db_error | 26 | 2 | 6 | 10 | 8 | 2.92 | 69.2% | 30.8% |
| coerced_interview | 12 | 1 | 0 | 5 | 6 | 3.33 | 91.7% | 50.0% |
| unknown | 1 | 0 | 0 | 0 | 1 | 4.00 | 100.0% | 100.0% |

**Severity × exposure_channel (the media multiplier, SVU-only; n = 536):**

| Channel | n | sev1 | sev2 | sev3 | sev4 | mean | % sev 4 |
|---|---|---|---|---|---|---|---|
| police_only | 147 | 59 | 34 | 41 | 13 | 2.05 | 8.8% |
| workplace | 146 | 0 | 55 | 69 | 22 | 2.77 | 15.1% |
| family | 92 | 0 | 33 | 41 | 18 | 2.84 | 19.6% |
| media | 87 | 0 | 12 | 35 | 40 | 3.32 | 46.0% |
| multiple | 20 | 0 | 0 | 14 | 6 | 3.30 | 30.0% |
| school | 20 | 0 | 4 | 12 | 4 | 3.00 | 20.0% |
| legal | 14 | 0 | 0 | 6 | 8 | 3.57 | 57.1% |
| church | 5 | 0 | 2 | 1 | 2 | 3.00 | 40.0% |
| unknown | 3 | 3 | 0 | 0 | 0 | 1.00 | 0.0% |
| online | 2 | 0 | 0 | 2 | 0 | 3.00 | 0.0% |

Media exposure carries a 46.0% severity-4 rate vs 8.8% when the case stays police-only — a **5.2×** multiplier (SVU-only).

### A12. Persons harmed per season

| Season | Episodes | Persons harmed | Persons/episode |
|---|---|---|---|
| 1 | 22 | 18 | 0.82 |
| 2 | 21 | 38 | 1.81 |
| 3 | 23 | 25 | 1.09 |
| 4 | 25 | 33 | 1.32 |
| 5 | 25 | 35 | 1.40 |
| 6 | 23 | 27 | 1.17 |
| 7 | 22 | 18 | 0.82 |
| 8 | 22 | 23 | 1.05 |
| 9 | 19 | 36 | 1.89 |
| 10 | 22 | 27 | 1.23 |
| 11 | 24 | 29 | 1.21 |
| 12 | 24 | 22 | 0.92 |
| 13 | 23 | 29 | 1.26 |
| 14 | 24 | 20 | 0.83 |
| 15 | 24 | 15 | 0.62 |
| 16 | 23 | 14 | 0.61 |
| 17 | 23 | 16 | 0.70 |
| 18 | 21 | 17 | 0.81 |
| 19 | 24 | 15 | 0.62 |
| 20 | 24 | 18 | 0.75 |
| 21 | 20 | 6 | 0.30 |
| 22 | 16 | 8 | 0.50 |
| 23 | 22 | 9 | 0.41 |
| 24 | 22 | 13 | 0.59 |
| 25 | 13 | 8 | 0.62 |
| 26 | 22 | 14 | 0.64 |
| 27 | 3 | 3 | 1.00 |
| **Total** | **576** | **536** | **0.93** |

### A13. Top 25 tags (free-form field; n = 536 persons, multi-tag)

| Tag | n |  | Tag | n |
|---|---|---|---|---|
| wrong_ID | 323 |  | family_member | 30 |
| public_confrontation | 277 |  | charged_then_dropped | 29 |
| arrested | 143 |  | cop | 28 |
| ruined_at_work | 142 |  | red_herring | 27 |
| fabricated_claim | 114 |  | db_error | 22 |
| coerced_confession | 102 |  | murdered | 22 |
| ruined_in_family | 93 |  | teacher | 22 |
| media_outing | 89 |  | school_alert | 19 |
| witness_recant | 79 |  | vigilante_attack | 16 |
| perp_walk | 74 |  | interrogation_coercion | 15 |
| teen | 51 |  | doctor | 14 |
| ruined_physically | 44 |  | immigrant | 13 |
| custody_dispute | 40 |  |  |  |

### A14. Qualitative pulls (verbatim from the dataset)

#### Threat/coercion quotes (`police_conduct_quote`, verbatim, truncated at ~400 chars)

- **svu_s12_e02 — Edwin Adelson** (`multiple`, severity 4): "STABLER: 'Edwin-connecticut, maryland, now new york. Three strikes, you're out.' BENSON: 'Kind of like why you were in a maryland police station In 2002. Hmm? Forcible fondling of a nine-year-old.' STABLER: 'Yeah, and what were you reading, lolita? Get your juices flowing before you attacked mandy?' BENSON: 'Yeah, and all the while you're being a perv...Your pretty, pregnant wife is out there Shop"
- **svu_s22_e10 — Lonnie Liston** (`multiple`, severity 4): "Fin to Lonnie: 'Better hope she shows up. Alive.' / 'Yeah, every con's got a stir-bug story. But you need another one.' / 'You don't have a job anymore. And if I were you, I wouldn't go out there.' / 'Look, Black teen with a white girlfriend? The jury would never believe me.' Fin: 'Uh-huh. Look, man, we get it, all right? Ceranda's your type... Young, cute, white. You know, you try to hit on her, "
- **svu_s01_e12 — Katya Ivanova (sex worker)** (`verbal_threat`, severity 3): "Detective Benson threatens Katya: 'We know you're illegal... if you're not at our office by 9:00 a.m., Immigration will be at your house by 9:05. That I can personally guarantee you.' Later: 'You have the right to remain silent. You are under arrest...' Benson also insults her: 'Who are you? some sex machine with a cash register between her legs? Or maybe you're just too afraid to get involved... "
- **svu_s03_e06 — Roger Berry** (`multiple`, severity 4): "Hawk to Roger: 'You're going back to jail, and this time I'm gonna see to it they strap you down and put a needle in your arm... I saved your sorry ass so you can die my way. My way!' Earlier (18 years ago): 'I put Roger in the box and I grilled him over and over and over, till I convinced myself he'd been in those apartments. I fed him every detail of the case. And then I told him that if he sign"
- **svu_s07_e20 — Mia Bixton** (`coercive_tactic`, severity 3): "BLAINE to Mia (minor, age 14): 'Tell us the truth, and it counts in your favor. It counts a lot... once your mother shows up, the lawyers show up. And then truth time is over... whatever you say has to be put in the book. And once it's there, it's on your record forever... This is your chance. Tell the truth now. And the fact it's your first offense, you'll get off... You'll get immunity.'"
- **svu_s10_e19 — Ashlee Walker** (`coercive_tactic`, severity 4): "Stabler: 'You murdered your baby and you stuffed her body in your trunk.' Benson: 'We will find where you put her.' Cabot tricks her: 'If my mom had've found out... You were only thinking of yourself... You were afraid you would be blamed.' Ashlee: 'I must have hit her so hard, I killed my baby.' Cabot: 'No, you didn't... Sierra died from measles.'"
- **svu_s21_e06 — Carlos Hernandez** (`verbal_threat`, severity 4): "Detective Monte and the DA told me if I didn't confess, that I'd get the sayonara syringe. Man, I was 18. I didn't have no mommy no more to help me."
- **svu_s04_e02 — Frank Barbarossa (personal trainer/lover)** (`multiple`, severity 3): "Detectives threaten: 'We got your DNA to match to the rape kit. That alone will get you 12-and-a-half to 25 years of personal training at Attica. Of course there's a murder conviction. That's another 25-to-life. Your parole officer hasn't even been born yet.' Also: 'The jury sees you, the schmuck trainer to the rich and famous. You're jealous, you want what they have.'"
- **svu_s23_e07 — Country Jones** (`multiple`, severity 3): "We're tearing apart your restaurant, we're tearing apart your car. [...] You have three months left on your parole, right? You lied to us, and that's enough to send you back to a South Carolina prison. [...] Detectives show graphic photos of mummified bodies: 'They were butchered. Organs removed, brains pulled out of their skulls, dried and preserved like beef jerky.' Country responds: 'No, no, no"
- **svu_s04_e15 — Ron Crowley** (`multiple`, severity 3): "Detective Bishop physically restrains Crowley, shoves him against desk. Bishop: 'The woman you raped and murdered.' Crowley: 'Wait a minute. You got the wrong guy!' Bishop: 'She found out about you, Ronnie, what a sick little worm you are. So you killed her!' Bishop had to be removed by Captain Cragen. Later Crowley says: 'I'll be better when I smack a lawsuit on that guy's ass. Did you see that?'"

#### Every formal police apology in the dataset (9 rows, 8 unique persons)

- **svu_s01_e13 — Stephanie Mulroney** (severity 4, accused of rape): Judge: 'Remand the defendant to the Department of Corrections.' Lawyer to press: 'Judge Abrams' decision to remand was simply wrong-headed.' Captain Cragen to Stephanie: 'I was wrong, Miss Mulroney. Please accept my apologies to your family.'
- **svu_s01_e15 — Stephanie Mulroney** (severity 4, accused of rape): Arraignment scene with press. Mrs. Mulroney: 'Staggered. It's simply beyond me how...' Rumsey: 'Judge Abrams' decision to remand was simply wrong-headed.' Judge dismisses case after Pruitt confession. Captain to Stephanie: 'I was wrong, Ms. Mulroney. Please accept my apologies to your family.'
- **svu_s03_e01 — Evan Ramsey** (severity 4, accused of rape): Court: 'Case dismissed. Mr. Ramsey, you're free to go with the court's apology.' Wife confronts him outside court: 'Wasn't I enough? I trusted you! You disgust me!' Medical records show Megan is a virgin; sodium amytal therapy implanted false memories.
- **svu_s07_e14 — Varla (homeless woman)** (severity 2, accused of child_abandonment): Detectives publicly confront Varla on the street outside coffee shop: 'You threw him away.' Varla protests: 'No, he's inside me.' Medical exam proves she has pseudocyesis (phantom pregnancy), not real pregnancy. Detective acknowledges: 'Detective... you don't have to do that. Varla hasn't recently been pregnant.'
- **svu_s11_e01 — Victor Tate** (severity 4, accused of rape): Stabler to Tate: 'I made a mistake, victor. I wanted to tell you myself. We arrested katie harris' rapist today... You'll be a free man soon.' Later, Tate responds: 'I told you I didn't! Many times ago! And then my life just stopped! Lost my woman, my friends! Hell, my mother barely knows me!'
- **svu_s11_e21 — Frank Sullivan** (severity 4, accused of arson): Frank arrested at crime scene: 'Frank sullivan, you're under arrest for the murders of kedzie sullivan and faye sullivan.' Daughter Emily screams in court: 'Liar! I hate you! I hope you rot in prison!' Frank attempts suicide by cutting wrists in interrogation. ADA Marlowe later apologizes: 'I am so sorry.'
- **svu_s13_e10 — Vicki Harris** (severity 2, accused of other): AMARO: 'Vicki Harris, you're under arrest for prostitution.' Later explained: 'Look, your daughter's not actually under arrest. That was the only way to get her out of there. She's a victim.'
- **svu_s13_e17 — Omar Pena** (severity 4, accused of rape): Detective Benson: 'I forced a false confession... I broke him.' Judge: 'This court sincerely apologizes and will not allow you to be incarcerated for one minute longer... You're a free man, sir.'
- **svu_s17_e09 — Stephen Lomatin (auxiliary officer)** (severity 3, accused of rape): Defense attorney Lisa Hassler questions Lomatin on the stand: 'You'd often spoken with Hector, isn't that right?' 'How friendly?' 'Did you resent it when SVU Sergeant John Munch interrogated you about this case?' 'How long have you been taking anti-psychotic drugs?' 'Did you murder Hector Rodriguez?' Lomatin responds: 'I will no

Note: Stephanie Mulroney receives formal apologies in two episodes (S01E13 and S01E15 — a continuing storyline), so the 9 formal-apology rows cover 8 unique persons.

#### Severity-4 case vignettes (`quote_or_scene`, verbatim, truncated)

- **svu_s02_e08 — Russell Ramsay** (arrested, perp_walk, charged, incarcerated_at_rikers, beaten_and_raped_by_inmates, murdere): "Ramsay repeatedly insists 'I never raped nobody' and 'It was a date. I met her at a bar. She gave me her room key.' At Rikers: 'You gotta help me... I can't sleep, all right? I gotta stay awake at night so I don't get ambushed... I can't look at a guy without getting jumped.' Later revealed: 'Russell Ramsay was attacked at Rikers. He was beaten and raped. He was killed.'"
- **svu_s12_e02 — Edwin Adelson** (arrested, perp_walk, media_outing, assaulted_in_custody, public_arraignment, suicide): "Weber hacked Adelson's computer and planted rape images to frame him. Adelson arrested at home in front of pregnant wife Louise. Dialogue: BENSON: 'Edwin adelson... You're under arrest.' Wife: 'Edwin!' Later assaulted in custody by Officer McCutcheon. Media perp walk shown. Commits suicide by jumping in front of train after arraignment/bail. Final revelation: BENSON to Weber: '"
- **svu_s15_e03 — Mehcad Carter** (murdered): "Two victims identify Mehcad from photos as their rapist. His cell phone GPS 'puts him in the West 80s every night that rapist hit.' Parents confirm he was out those nights. SVU pursues him as serial rapist. Media covers the case. Jolene shoots him, claiming self-defense against a rapist. He dies in surgery. Later proven innocent when Willie Taylor arrested and linked to all rap"
- **svu_s16_e13 — Jerome Jones (Brooklyn Jerome Jones, one of Prospect Park Three)** (murdered): "Jenna accuses Jerome after he tries to return her purse: 'Then arrest him! He attacked me... He raped me!' SVU arrests Jerome in front of pizza shop customers and employees. Security footage proves Jerome was in bathroom less than 90 seconds with door ajar, physically impossible to have raped her. DNA proves Dr. Neil Alexander (uncle) was actual rapist. Jenna later admits: 'I t"
- **svu_s21_e06 — Carlos Hernandez** (arrested, charged, imprisoned_16_years, mother_sister_murdered_while_wrongly_imprisoned, s): "Carlos to Carisi: 'Man, I don't know who killed them. All I know is that Ricky and me didn't do it, I swear. I could never hurt my mommy or little Jacinta.' ... 'Monte and the DA told me if I didn't confess, that I'd get the sayonara syringe.' Judge at vacatur: 'Carlos Hernandez, I apologize on behalf of the state of New York for your wrongful imprisonment that has cost you 16 "
- **svu_s21_e15 — Luna Prasada (CEO of We-B-Well)** (perp_walk, arrested, charged, public_humiliation, media_pileon, assaulted_in_jail, company): "Luna arrested in court: 'Get your hands off of me! This is not justice. This is insanity!' Media presence at perp walk. Later Luna describes jail assault: 'The other inmates held me down, and I heard somebody say, Oh, yeah, she needs to know what it's like to be raped by another woman.' Press coverage: 'the harder they fall... male serial predators get more respect than this.'"

---

## B. LONGITUDINAL PAPER TABLES (SVU-only, by era)

Eras (by production season): **pre-#MeToo = S1–18** (aired 1999–spring 2017), **#MeToo era = S19–21** (fall 2017–2020), **post-2020 = S22–27**. `air_date` is blank in the dataset, so era assignment is by season number.

### B1. False-suspect episode rate by era (both denominators)

| Era | Episodes | Y | Maybe | Y-only rate | Y+Maybe rate |
|---|---|---|---|---|---|
| S1–18 pre-#MeToo (1999–spring 2017) | 410 | 269 | 12 | 269/410 = 65.6% | 281/410 = 68.5% |
| S19–21 #MeToo era (2017–2020) | 68 | 34 | 2 | 34/68 = 50.0% | 36/68 = 52.9% |
| S22–27 post-2020 | 98 | 41 | 1 | 41/98 = 41.8% | 42/98 = 42.9% |

**Per-season series (episodes; false-suspect Y; Maybe; Y-only %; Y+Maybe %; persons harmed; persons/ep; any-threat % of persons):**

| Season | Eps | FS=Y | FS=Maybe | Y-only | Y+Maybe | Persons | Persons/ep | Any-threat % (n) |
|---|---|---|---|---|---|---|---|---|
| 1 | 22 | 11 | 5 | 50.0% | 72.7% | 18 | 0.82 | 66.7% (18) |
| 2 | 21 | 16 | 0 | 76.2% | 76.2% | 38 | 1.81 | 50.0% (38) |
| 3 | 23 | 18 | 0 | 78.3% | 78.3% | 25 | 1.09 | 52.0% (25) |
| 4 | 25 | 15 | 0 | 60.0% | 60.0% | 33 | 1.32 | 63.6% (33) |
| 5 | 25 | 19 | 0 | 76.0% | 76.0% | 35 | 1.40 | 60.0% (35) |
| 6 | 23 | 16 | 1 | 69.6% | 73.9% | 27 | 1.17 | 51.9% (27) |
| 7 | 22 | 11 | 0 | 50.0% | 50.0% | 18 | 0.82 | 44.4% (18) |
| 8 | 22 | 18 | 0 | 81.8% | 81.8% | 23 | 1.05 | 60.9% (23) |
| 9 | 19 | 16 | 0 | 84.2% | 84.2% | 36 | 1.89 | 63.9% (36) |
| 10 | 22 | 18 | 0 | 81.8% | 81.8% | 27 | 1.23 | 55.6% (27) |
| 11 | 24 | 18 | 0 | 75.0% | 75.0% | 29 | 1.21 | 58.6% (29) |
| 12 | 24 | 17 | 0 | 70.8% | 70.8% | 22 | 0.92 | 68.2% (22) |
| 13 | 23 | 16 | 1 | 69.6% | 73.9% | 29 | 1.26 | 51.7% (29) |
| 14 | 24 | 13 | 2 | 54.2% | 62.5% | 20 | 0.83 | 55.0% (20) |
| 15 | 24 | 13 | 2 | 54.2% | 62.5% | 15 | 0.62 | 26.7% (15) |
| 16 | 23 | 12 | 0 | 52.2% | 52.2% | 14 | 0.61 | 14.3% (14) |
| 17 | 23 | 11 | 1 | 47.8% | 52.2% | 16 | 0.70 | 37.5% (16) |
| 18 | 21 | 11 | 0 | 52.4% | 52.4% | 17 | 0.81 | 29.4% (17) |
| 19 | 24 | 13 | 2 | 54.2% | 62.5% | 15 | 0.62 | 26.7% (15) |
| 20 | 24 | 15 | 0 | 62.5% | 62.5% | 18 | 0.75 | 38.9% (18) |
| 21 | 20 | 6 | 0 | 30.0% | 30.0% | 6 | 0.30 | 50.0% (6) |
| 22 | 16 | 6 | 1 | 37.5% | 43.8% | 8 | 0.50 | 87.5% (8) |
| 23 | 22 | 9 | 0 | 40.9% | 40.9% | 9 | 0.41 | 77.8% (9) |
| 24 | 22 | 8 | 0 | 36.4% | 36.4% | 13 | 0.59 | 23.1% (13) |
| 25 | 13 | 5 | 0 | 38.5% | 38.5% | 8 | 0.62 | 87.5% (8) |
| 26 | 22 | 12 | 0 | 54.5% | 54.5% | 14 | 0.64 | 35.7% (14) |
| 27 | 3 | 1 | 0 | 33.3% | 33.3% | 3 | 1.00 | 100.0% (3) |

### B2. Persons harmed per episode, B3. conditional severity, and B7. apology rate, by era

| Era | Episodes | Persons | Persons/ep | Mean sev | % sev 3–4 (n) | % sev 4 | Any-apology rate |
|---|---|---|---|---|---|---|---|
| S1–18 pre-#MeToo (1999–spring 2017) | 410 | 442 | 1.08 | 2.67 | 60.0% (265/442) | 20.1% | 34/442 = 7.7% |
| S19–21 #MeToo era (2017–2020) | 68 | 39 | 0.57 | 3.05 | 82.1% (32/39) | 30.8% | 2/39 = 5.1% |
| S22–27 post-2020 | 98 | 55 | 0.56 | 2.84 | 67.3% (37/55) | 21.8% | 5/55 = 9.1% |

### B4. Police threat/coercion (any) by era and by season

| Era | n persons | Any threat | Rate |
|---|---|---|---|
| S1–18 pre-#MeToo (1999–spring 2017) | 442 | 235 | 53.2% |
| S19–21 #MeToo era (2017–2020) | 39 | 14 | 35.9% |
| S22–27 post-2020 | 55 | 32 | 58.2% |

**Three-season blocks (the dip and rebound):**

| Seasons | n persons | Any-threat rate |
|---|---|---|
| S1–3 | 81 | 44/81 = 54.3% |
| S4–6 | 95 | 56/95 = 58.9% |
| S7–9 | 77 | 45/77 = 58.4% |
| S10–12 | 78 | 47/78 = 60.3% |
| S13–15 | 64 | 30/64 = 46.9% |
| S16–18 | 47 | 13/47 = 27.7% |
| S19–21 | 39 | 14/39 = 35.9% |
| S22–24 | 30 | 17/30 = 56.7% |
| S25–27 | 25 | 15/25 = 60.0% |

**Precise shape of the mid-2010s dip and post-2020 rebound:** the threat/coercion rate ranges 44–68% per season across S1–S14, then the dip begins at **S15 (26.7%, 4/15)** and bottoms out across **S16–18 at 27.7% (13/47)**, with S16 the single lowest season (14.3%). The five lowest single seasons overall are S16 (14%), S24 (23%), S15 (27%), S19 (27%), S18 (29%) — note S24 (23.1%) is an isolated low inside the rebound era. Recovery is only partial in S19–21 (35.9%), then the rate rebounds to **56.7% in S22–24 and 60.0% in S25–27**, back at early-Stabler-era levels. Per-season values are in the B1 table (last column); season cell sizes after S14 are small (3–20 persons/season), so use the 3-season blocks for inference.

### B5. accusation_origin mix by era (normalized; column % within era)

| Origin | S1–18 pre-#MeToo (1999–spring 2017) | S19–21 #MeToo era (2017–2020) | S22–27 post-2020 |
|---|---|---|---|
| squad_inference | 253 (57.2%) | 16 (41.0%) | 26 (47.3%) |
| victim_ID | 67 (15.2%) | 12 (30.8%) | 16 (29.1%) |
| fabrication | 56 (12.7%) | 7 (17.9%) | 3 (5.5%) |
| witness_misID | 35 (7.9%) | 2 (5.1%) | 4 (7.3%) |
| tech_db_error | 23 (5.2%) | 0 (0.0%) | 3 (5.5%) |
| coerced_interview | 7 (1.6%) | 2 (5.1%) | 3 (5.5%) |
| unknown | 1 (0.2%) | 0 (0.0%) | 0 (0.0%) |
| **n** | **442** | **39** | **55** |

Post-#MeToo shift: `victim_ID` (victim identifies the wrong person) moves 15.2% → 30.8% → 29.1%, and `fabrication` (knowingly false claim) 12.7% → 17.9% → 5.5% across the three eras. Era n's for S19–21 and S22–27 are small (39 and 55); treat percentage swings under ~10 points as noise.

### B6. Exposure-channel mix by era (column % within era)

| Channel | S1–18 pre-#MeToo (1999–spring 2017) | S19–21 #MeToo era (2017–2020) | S22–27 post-2020 |
|---|---|---|---|
| police_only | 126 (28.5%) | 8 (20.5%) | 13 (23.6%) |
| workplace | 125 (28.3%) | 7 (17.9%) | 14 (25.5%) |
| family | 77 (17.4%) | 6 (15.4%) | 9 (16.4%) |
| media | 66 (14.9%) | 13 (33.3%) | 8 (14.5%) |
| multiple | 17 (3.8%) | 1 (2.6%) | 2 (3.6%) |
| school | 14 (3.2%) | 4 (10.3%) | 2 (3.6%) |
| legal | 9 (2.0%) | 0 (0.0%) | 5 (9.1%) |
| church | 4 (0.9%) | 0 (0.0%) | 1 (1.8%) |
| unknown | 3 (0.7%) | 0 (0.0%) | 0 (0.0%) |
| online | 1 (0.2%) | 0 (0.0%) | 1 (1.8%) |
| **n** | **442** | **39** | **55** |

Media+online share: 67/442 = 15.2% pre-#MeToo → 13/39 = 33.3% in S19–21 → 9/55 = 16.4% post-2020.

### B8. accused_of mix by era (normalized; column % within era)

| accused_of | S1–18 pre-#MeToo (1999–spring 2017) | S19–21 #MeToo era (2017–2020) | S22–27 post-2020 |
|---|---|---|---|
| rape | 255 (57.7%) | 28 (71.8%) | 41 (74.5%) |
| assault | 61 (13.8%) | 3 (7.7%) | 2 (3.6%) |
| CSA | 36 (8.1%) | 3 (7.7%) | 6 (10.9%) |
| sex_crime_vague | 39 (8.8%) | 3 (7.7%) | 1 (1.8%) |
| other | 26 (5.9%) | 1 (2.6%) | 3 (5.5%) |
| kidnapping | 6 (1.4%) | 1 (2.6%) | 0 (0.0%) |
| murder | 4 (0.9%) | 0 (0.0%) | 0 (0.0%) |
| DV | 4 (0.9%) | 0 (0.0%) | 0 (0.0%) |
| trafficking | 4 (0.9%) | 0 (0.0%) | 0 (0.0%) |
| harassment | 2 (0.5%) | 0 (0.0%) | 1 (1.8%) |
| CP | 2 (0.5%) | 0 (0.0%) | 0 (0.0%) |
| arson | 2 (0.5%) | 0 (0.0%) | 0 (0.0%) |
| child_abandonment | 1 (0.2%) | 0 (0.0%) | 0 (0.0%) |
| terrorism | 0 (0.0%) | 0 (0.0%) | 1 (1.8%) |
| **n** | **442** | **39** | **55** |

### B9. Chi-square tests (Pearson; critical values df=2: 5.991 at α=.05, 9.210 at α=.01)

| Test | Table | χ² | df | Significance | Min expected cell |
|---|---|---|---|---|---|
| Era × has_false_suspect (Y vs not-Y; episode-level, N=576) | [[269, 141], [34, 34], [41, 57]] | 21.61 | 2 | p < .01 | 27.4 |
| Era × has_false_suspect (Y+Maybe vs N; episode-level, N=576) | [[281, 129], [36, 32], [42, 56]] | 25.11 | 2 | p < .01 | 25.6 |
| Era × severity (3–4 vs 1–2; person-level, n=536) | [[265, 177], [32, 7], [37, 18]] | 8.09 | 2 | p < .05 | 14.7 |
| Era × any police threat/coercion (person-level, n=536) | [[235, 207], [14, 25], [32, 23]] | 5.10 | 2 | n.s. (p > .05) | 18.6 |

Expected-cell adequacy: the smallest expected cell across the four tests is 14.7 — all well above 5, so the χ² approximation is valid for every test. Tables are ordered [pre, #MeToo, post-2020] × [yes, no]. Note the era × threat test pools the S16–18 dip into the pre-era; the U-shape in B4 is sharper than this pooled test suggests.

---

## C. DATA NOTES FOR METHODS SECTIONS

1. **Exclusions.** 5 of 541 person-rows are coded `actually_guilty` and are excluded from every person-level statistic (svu_s03_e19 Thomas 'Bird' Gordon; svu_s03_e19 Judge Walter Thornburg; svu_s06_e20 Gabriel Duvall (initial questioning); svu_s12_e03 Bill Harris (initially); svu_s12_e12 Orville Underwood), leaving n = 536. `partially_involved` rows (n = 43) are retained: the controlled vocabulary defines them as innocent of the accused offense.

2. **Vocabulary normalizations.** (a) `accusation_origin`: 4 out-of-vocab `victim_misID` rows folded into `victim_ID` (each is a victim misidentifying the accused, the documented meaning of `victim_ID`); 1 `third_party` row folded into `witness_misID` (a third party pointing the finger). (b) `accused_of`: spelling variants `kidnap`, `kidnapping/child_abduction`, `kidnapping/child abduction` folded into `kidnapping`; undocumented values (`murder` n=4, `kidnapping`, `arson`, `terrorism`, `child_abandonment`) retained as-is and disclosed.

3. **The five defective episodes.** S14E01, S14E02, S15E01, S17E01 had empty source transcripts; the tagger returned `has_false_suspect = Maybe`, `needs_deep_review = Y`, and zero person-rows for all four — they therefore deflate Y-only episode rates and contribute 4 of the 15 Maybe episodes, but add nothing to person-level statistics. S06E09 ("Weak") had a non-English (Greek-character) transcript yet still produced a summary and 1 person-row (Thomas Mathers, has_false_suspect = Y); that row should be treated as lower-confidence and is a candidate for manual re-verification. All five are flagged `needs_deep_review = Y` in the episode file.

4. **Blank/unknown fields.** `police_apology`: 2 blanks in the raw file both sit on excluded `actually_guilty` rows; after exclusion the field has 2 `unknown` values (both svu_s20_e21), treated as non-apologies. `air_date` is blank throughout, so all longitudinal analysis uses season number. `has_public_exposure` contains 3 `N/A` episode values (missing transcripts).

5. **Maybe-denominator sensitivity.** 15/576 episodes carry `has_false_suspect = Maybe` (including the 4 transcriptless episodes); by season they fall as S1: 5, S6: 1, S13: 1, S14: 2, S15: 2, S17: 1, S19: 2, S22: 1. Every episode-level rate is therefore reported under both treatments; the overall false-suspect rate moves from 59.7% (Y-only) to 62.3% (Y+Maybe), a 2.6-point spread. Era-level spreads: pre-#MeToo +2.9 pts, S19–21 +2.9 pts, S22–27 +1.0 pts; single seasons move up to 22.7 pts (S1, with 5 Maybe episodes). Conclusions in B hold under both treatments (B9 reports χ² both ways).

6. **Tag-vs-field reconciliation.** The public-facing claim "wrong_ID is the leading cause (323/541)" counts the free-form `wrong_ID` *tag*, which marks any episode outcome of "they had the wrong person" and co-occurs mostly with `squad_inference` origins (195/323 of innocent tagged rows). The controlled `accusation_origin` field — which records who first pointed the finger — puts `squad_inference` first at 295/536 = 55.0%, with victim identification (`victim_ID`, including the 4 folded `victim_misID` rows) at 95/536 = 17.7% and `witness_misID` at 41/536. Both numbers are true of different fields; the papers should lead with the controlled field and mention the tag only as a robustness footnote.

7. **Death-count discipline.** Free-text `consequence_detail` is a keyword trap: strings like `arrested_for_wrong_murder`, `suicide_watch`, `suicide_attempt`, `assisted_suicide`, `family_murdered`, `mother_sister_murdered_while_wrongly_imprisoned`, and `suspected_then_cleared_by_death` match death keywords without being deaths of the accused person. Every figure in A9 was verified row-by-row against `consequence_detail`, `notes`, and `quote_or_scene`; three additional harms exist only in `notes` (not the structured field) and are listed separately, never merged into headline counts. One probable duplicate person exists (Father Alberto, S09E19 and S26E19 — a revisited storyline): person-level counts treat the two rows as two harmed persons; "unique lives" claims should subtract 1.

8. **Coverage.** SVU coverage is a census: all 576 episodes of S1–S27 (S27 partial at 3 episodes — the season was airing at collection time), coded by claude-sonnet-4-5 from full transcripts (source: subslikescript.com). Model self-reported `confidence` is `high` on ~97% of rows and should be treated as uncalibrated; a stratified human-validation pass (prioritizing the A9 death rows) is recommended before publication.

