# CODING PROTOCOL — blind re-coding, 2026-09-04 (written fresh by the re-coder before coding)
Re-coder: Claude Fable 5.1 (subagent #162). Original coder: claude-sonnet-4-5-20250929 (Jan 2026 batch).
The re-coder applies the SAME codebook (controlled vocabulary and definitions restated below from the
SVU and L&O tagging prompts) with its own procedure. It never sees the original codes.

## Procedure per episode
1. Read the whole transcript file once, start to end. Note the transcript may stop mid-episode
   (Excel cap at 32,767 characters): code only what is on the page; if the resolution is cut off, say
   so in recoder_notes and lower confidence.
2. List every person who is accused, suspected, questioned as a suspect, arrested, charged or
   publicly named for the crime under investigation (or a related crime) at any point.
3. For each, decide the innocence trajectory from the text alone: proven_innocent,
   strongly_implied_innocent, partially_involved, or actually_guilty. Exclude actually_guilty.
   Exclude any person whose innocence is left genuinely open at the end of the text.
4. Apply the three inclusion conditions: (i) innocent or strongly implied innocent (partially_involved
   only when the accusation's harm clearly outweighs the unrelated wrongdoing); (ii) public exposure
   beyond a private police interview (workplace, school, family, media, church/community, online,
   courtroom, political) OR a physical/violent consequence; (iii) the harm follows from the
   accusation. A person questioned privately with no spread and no material harm is NOT a row.
   Being accused or questioned in front of coworkers, family, students, press or a courtroom counts
   as exposure (severity at least 2) even when no job loss or arrest follows.
5. Fill every controlled field for each included person; pick the PRIMARY channel/category/origin
   when several apply (the first public target for exposure_channel; the worst harm domain for
   consequence_category; the first pointing finger for accusation_origin).
6. Episode flags: has_false_suspect = Y if at least one person is later cleared (even if not a row
   because there was no exposure); Maybe if the clearance is ambiguous; N otherwise.
   has_public_exposure = Y if any row's exposure_channel is not police_only/unknown; N if no row
   or only police_only; Maybe if exposure is suggested but not shown. needs_deep_review = Y if
   many fields are unknown/low or the transcript is cut before the resolution matters.
7. Write one JSON line and append it with add.py (which validates the vocabulary and refuses
   duplicates) BEFORE opening the next transcript.

## Controlled vocabulary (same as the original codebook)
innocence_status: proven_innocent | strongly_implied_innocent | partially_involved | actually_guilty (excluded)
role_in_plot: initial_suspect | red_herring | family_member | colleague | community_member | other;
  L&O adds witness | defendant
accused_of (SVU): rape | CSA | harassment | CP | DV | trafficking | assault | sex_crime_vague | other
  (kidnapping and murder occur in SVU plots too; use the value the plot supports, and if it is off the
  SVU list write it literally, e.g. murder, kidnapping)
accused_of (L&O): murder | manslaughter | assault | attempted_murder | kidnapping | rape | sexual_assault |
  CSA | harassment | robbery | burglary | theft | fraud | embezzlement | extortion | racketeering |
  conspiracy | drug_trafficking | weapons_trafficking | corruption | perjury | obstruction | bribery |
  arson | DV | stalking | terrorism | hate_crime | other
accusation_origin: victim_ID | witness_misID | squad_inference | coerced_interview | tech_db_error |
  fabrication | unknown; L&O adds prosecutorial_theory
exposure_channel: workplace | school | family | media | church | online | police_only | unknown;
  L&O adds courtroom | political | community (church folds into community for L&O)
exposure_who_told: squad | victim | third_party | media | unknown; L&O adds prosecution | defense
consequence_category: work | family | legal | physical | social | multiple; L&O adds political | financial
consequence_severity: 1 private/low-level; 2 public exposure without formal sanction; 3 material
  sanction or serious fallout (arrest, suspension, firing, indictment, breakup/divorce, custody,
  eviction, concrete online losses); 4 life-altering or death (suicide, murder, severe injury,
  wrongful conviction/imprisonment, permanent child removal, deportation, career-ending loss)
screen_evidence: on_screen | stated | implied | off_screen
confidence: high | medium | low
police_conduct_threat: none | verbal_threat | coercive_tactic | insult_degradation | multiple
police_apology: none | partial | formal | unknown
L&O only: prosecutorial_conduct: none | overreach | misconduct | zealous_but_fair | dropped_appropriately;
  prosecutorial_apology: none | partial | formal | unknown
consequence_detail: short free text (snake_case), not scored.

## Output line (one per episode)
{"custom_id": "...", "has_false_suspect": "Y|N|Maybe", "has_public_exposure": "Y|N|Maybe",
 "needs_deep_review": "Y|N", "summary": "1-2 sentences", "person_rows": [ { "person_label": "...",
 "role_in_plot", "accused_of", "innocence_status", "accusation_origin", "exposure_channel",
 "exposure_who_told", "consequence_category", "consequence_detail", "consequence_severity",
 "police_conduct_threat", "police_apology", "screen_evidence", "confidence",
 ("prosecutorial_conduct", "prosecutorial_apology" for L&O), "quote_or_scene": "short quote" } ],
 "recoder_notes": "truncation / ambiguity notes"}

## Decision conventions fixed in advance (so they are not invented case by case)
- A person cleared by the discovery of the real perpetrator is proven_innocent; cleared by the
  squad moving on without stated proof is strongly_implied_innocent.
- Arrest or being booked/arraigned = severity 3 (legal). Charges dropped after arrest stays 3.
- Held overnight or interrogated aggressively with nobody outside told = police_only, not a row,
  unless a physical/violent consequence occurs.
- A perp walk or press naming = media; a search of a home/office with family or coworkers present
  = family/workplace via squad.
- Threat field takes the worst detective conduct toward THAT person; sarcasm alone is none;
  "we know you did it" is verbal_threat; lying about evidence or promises is coercive_tactic;
  "pervert/scum" is insult_degradation.
- Apology: "sorry for your trouble"/"misunderstanding" = partial; an explicit acknowledgment that
  the accusation was wrong = formal.
- When unsure between two adjacent severities, take the lower one.
