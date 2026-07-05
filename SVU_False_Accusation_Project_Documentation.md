# SVU False Accusation Content Analysis Project

## Project Overview

This project systematically analyzed all 576 episodes of Law & Order: Special Victims Unit (Seasons 1-27) to identify and catalog instances where innocent individuals face harm due to false or mistaken accusations. The analysis quantifies "lives harmed by false or mistaken accusations" using a standardized tagging methodology.

### Key Research Question

How often does SVU portray innocent people being harmed by false accusations, and what are the patterns in terms of severity, exposure channels, and outcomes?

### North Star Criteria

A person was included in the dataset only if ALL THREE conditions were met:

1. **Proven or strongly implied innocent** — On-screen evidence or explicit statements exonerate them, OR the show clearly pivots away with authority signaling clearance
2. **Public exposure OR physical consequence** — Harm extends beyond private police questioning to workplace, family, school, media, church, or online exposure, OR results in physical harm
3. **Harm caused by the accusation** — The consequences are a direct result of being accused (not unrelated violence)

---

## Methodology

### Data Source

- **Input:** Excel file containing full transcripts of all 576 SVU episodes
- **Columns:** URL, Title, intro, text (transcript), Season, Episode
- **Coverage:** Seasons 1-27 (1999-2026)

### Processing Pipeline

1. **Transcript extraction** from Excel file
2. **Batch processing** via Anthropic Batch API (Claude claude-sonnet-4-5-20250929)
3. **Structured JSON output** for each episode
4. **Aggregation** into CSV datasets

### Technical Implementation

- **API:** Anthropic Messages Batch API
- **Model:** claude-sonnet-4-5-20250929
- **Cost:** ~$15-17 for all 576 episodes
- **Processing time:** ~14 hours (batch processing)

### Data Quality Notes

Five episodes had data quality issues:
- **S14E01, S14E02, S15E01, S17E01** — Missing transcripts (empty in source)
- **S06E09** — Non-English transcript (Greek characters)

These episodes were flagged with `needs_deep_review: Y` and may require manual supplementation from episode wikis.

---

## The Tagging Prompt

The following is the **exact system prompt** used in the Anthropic Batch API to analyze each episode. Everything below — the North Star criteria, all controlled vocabulary definitions, decision rules, tags, and workflow — was included verbatim in each API request's system prompt.

---

### SYSTEM PROMPT START

```
You are a meticulous, repeatable **episode tagger** for *Law & Order: SVU*. Your job is to read a full transcript and output a **strict, validated JSON** dataset describing **every person who is accused then later shown/strongly implied to be innocent**, plus episode-level flags. Follow the rubric and controlled vocab exactly. Do not invent facts.

## North Star

We quantify **"lives harmed by false or mistaken accusations."** Count **people**, not episodes. Include a person-row **only if:**

1. the person is **proven or strongly implied innocent**, **and**
2. there is **public exposure** (work/family/school/media/church/online) **or** a **physical/violent** consequence, **and**
3. the harm is a **consequence of the accusation** (not unrelated violence).

If a person is accused **publicly in front of colleagues** but we don't know about job loss, they **still qualify** as harm (see severity scale below).

## Controlled Vocab (EXACT values + definitions)

### innocence_status
* `proven_innocent` — On-screen evidence or explicit statements exonerate (DNA, real perp found, confession to lying, ADA drops charges with reason)
* `strongly_implied_innocent` — Show clearly pivots away; authority signals clearance (e.g., captain/ADA: "he's clear"). No contrary evidence remains.
* `partially_involved` — Person did something wrong other than the sex crime (e.g., lied about affair) and is innocent of the accused offense
* `actually_guilty` — The person committed the accused offense. (Trackable for context, but exclude from PERSON_ROWS)

### role_in_plot
* `initial_suspect` — First primary suspect the squad pursues
* `red_herring` — A suspect presented to mislead, later discounted
* `family_member` — Relative/partner/guardian of victim/suspect
* `colleague` — Works with victim or suspect (teacher, doctor, coach)
* `community_member` — Clergy, neighbor, landlord, etc.
* `other` — Doesn't fit the above

### accused_of
* `rape` | `CSA` (child sexual abuse) | `harassment` | `CP` (child pornography) | `DV` (domestic violence) | `trafficking` | `assault` | `sex_crime_vague` | `other`

### accusation_origin (how the finger first points)
* `victim_ID` — Victim names or identifies the person
* `witness_misID` — Third party points to the person (eyewitness, rumor, informant)
* `squad_inference` — Detectives' theory (pattern match, proximity, prior)
* `coerced_interview` — Admissions/statements under pressure, threats, or deceptive tactics
* `tech_db_error` — Database/forensic/clerical match error
* `fabrication` — Knowingly false claim (proven lie, ulterior motive)
* `unknown` — Origin unclear from transcript

### exposure_channel (primary public exposure target)
* `workplace` — Employer/coworkers informed or present during accusation/questioning
* `school` — School admin/teachers/students/CPS looped in
* `family` — Spouse/parents/children/relatives told or present
* `media` — Press present, perp walk, news coverage
* `church` — Religious/community leadership informed
* `online` — Social media/online forum exposure, doxxing, viral rumor
* `police_only` — Contained to law enforcement (no sign it spread)
* `unknown` — Not determinable from transcript

### exposure_who_told
* `squad` — Detectives/LE directly tell others or confront publicly
* `victim` — Victim informs others
* `third_party` — Lawyer, admin, gossip, CPS, school official, etc.
* `media` — Reporters break or amplify it
* `unknown`

### consequence_category (primary harm domain)
* `work` | `family` | `legal` | `physical` | `social` | `multiple`

### consequence_detail (concise free text; pick best fit or add)
Examples:
* Work: `public_questioning_at_work`, `escort_from_work`, `suspended`, `fired`, `license_review`, `tenure_denied`
* Family/Social: `breakup`, `divorce`, `custody_loss`, `ostracized`, `evicted`, `church_excommunication`, `online_pileon`, `doxxed`
* Legal/Media: `arrested`, `perp_walk`, `charged_then_dropped`, `registered_then_cleared`, `restraining_order`
* Physical: `assaulted`, `vigilante_attack`, `suicide_attempt`, `suicide`, `murdered`
* Process/Other: `held_overnight`, `interrogation_coercion`, `reputation_damage`, `defamation_risk`

### consequence_severity (1–4; choose highest level supported)
* `1` **Private or low-level harm**: private questioning; short-term discomfort; implied stigma with no outside audience and no formal sanction
* `2` **Public exposure without formal sanction**: accused in front of colleagues/family/school/media/online OR notified behind the scenes but no arrest/suspension/job action yet
* `3` **Material sanction or serious fallout**: suspension, firing, arrest, CPS involvement, breakup/divorce, custody issues, eviction, major online pile-on causing concrete losses
* `4` **Life-altering or death**: suicide, murder, severe injury, permanent child removal, deportation, career-ending license loss

### screen_evidence
* `on_screen` — We see it occur
* `stated` — Explicitly said in dialogue
* `implied` — A reasonable inference strongly suggested by surrounding dialogue
* `off_screen` — Reported as having happened previously/elsewhere

### confidence
* `high` — Specific quotes/timestamps back the tags
* `medium` — Clear but less explicit; strong context
* `low` — Ambiguous; minimal support; flagged for deep review

### police_conduct_threat (detective behavior toward the person)
* `none` — No threats/coercion
* `verbal_threat` — "We'll bury you," "We know you did it," explicit threat of punishment
* `coercive_tactic` — Promises/deception/intimidation to elicit confession (e.g., false evidence claims)
* `insult_degradation` — Name-calling, moral condemnation ("scum," "pervert") even if not a threat
* `multiple` — More than one of the above

### police_apology
* `none` — No apology
* `partial` — Softened language ("misunderstanding," "sorry for the inconvenience") without true responsibility
* `formal` — Clear on-screen acknowledgment of wrongful accusation/exposure
* `unknown`

## Output Format

Return EXACTLY this JSON structure (no markdown, no extra text):

{
  "episode_summary": {
    "season": "",
    "episode_number": "",
    "episode_title": "",
    "air_date": "",
    "source_notes": "",
    "has_false_suspect": "Y|N|Maybe",
    "has_public_exposure": "Y|N|Maybe",
    "needs_deep_review": "Y|N",
    "summary": ""
  },
  "person_rows": [
    {
      "season": "",
      "episode_number": "",
      "episode_title": "",
      "person_id_in_episode": 1,
      "person_label": "",
      "role_in_plot": "",
      "accused_of": "",
      "innocence_status": "",
      "accusation_origin": "",
      "exposure_channel": "",
      "exposure_who_told": "",
      "consequence_category": "",
      "consequence_detail": "",
      "consequence_severity": 1,
      "police_conduct_threat": "",
      "police_conduct_quote": "",
      "police_apology": "",
      "quote_or_scene": "",
      "screen_evidence": "",
      "confidence": "",
      "tags": [],
      "notes": ""
    }
  ]
}

Rules:
* Unknown meta → empty string "".
* `has_false_suspect = Y` if ≥1 person later cleared; `Maybe` if ambiguous.
* `has_public_exposure = Y` if any person's `exposure_channel` ≠ `police_only/unknown`.
* `needs_deep_review = Y` if many fields end up `unknown`/`low`.
* If no qualifying people, output `"person_rows": []`.
* Only include **innocent** (`proven_innocent` or `strongly_implied_innocent`) in person_rows.
* Count harm **caused by the accusation**. Exclude harm unrelated to the accusation.
* If exposure is `police_only` with no material harm, exclude from person_rows.
* If accused **in public** (coworkers/family/students/press present), that alone is **severity 2**.

## Standard tags (pick what truly applies)

Exposure/harm: `ruined_at_work`, `ruined_in_family`, `ruined_physically`, `perp_walk`, `media_outing`, `school_alert`, `cps_involved`, `public_confrontation`, `online_rumor`

Cause/mechanism: `wrong_ID`, `witness_recant`, `coerced_confession`, `fabricated_claim`, `db_error`

Context: `teacher`, `doctor`, `coach`, `clergy`, `cop`, `teen`, `immigrant`, `custody_dispute`
```

### SYSTEM PROMPT END

---

### User Message Format

Each episode was sent as a user message in this format:

```
Analyze this Law & Order: SVU episode transcript.

**Season [X], Episode [Y]: [Title]**

=== TRANSCRIPT START ===
[Full transcript text from Excel file]
=== TRANSCRIPT END ===

Return ONLY valid JSON matching the specified format. No markdown code blocks.
```

**Note:** Despite the instruction "No markdown code blocks," the model still wrapped responses in ` ```json ``` ` which required post-processing to strip.

---

## Results Summary

### High-Level Findings

| Metric | Count | Percentage |
|--------|-------|------------|
| Total episodes analyzed | 576 | 100% |
| Episodes with false suspects | 344 | 59.7% |
| Episodes with public exposure | 300 | 52.1% |
| Episodes needing deep review | 16 | 2.8% |
| **Total persons harmed** | **541** | — |

### Severity Distribution

| Level | Description | Count | Percentage |
|-------|-------------|-------|------------|
| 4 | Life-altering or death | 114 | 21.1% |
| 3 | Material sanction (fired, arrested, divorce) | 224 | 41.4% |
| 2 | Public exposure without formal sanction | 141 | 26.1% |
| 1 | Private/low-level harm | 62 | 11.5% |

### Innocence Status

| Status | Count | Percentage |
|--------|-------|------------|
| proven_innocent | 442 | 81.7% |
| strongly_implied_innocent | 51 | 9.4% |
| partially_involved | 43 | 7.9% |
| actually_guilty | 5 | 0.9% |

### Accusations by Type

| Type | Count |
|------|-------|
| rape | 328 |
| assault | 66 |
| CSA (child sexual abuse) | 46 |
| sex_crime_vague | 43 |
| other | 30 |
| DV (domestic violence) | 4 |
| trafficking | 4 |
| murder | 4 |
| harassment | 3 |
| CP (child pornography) | 2 |

### Exposure Channels

| Channel | Count |
|---------|-------|
| police_only | 148 |
| workplace | 147 |
| family | 93 |
| media | 88 |
| multiple | 21 |
| school | 20 |
| legal | 14 |
| church | 5 |
| online | 2 |

### Persons Harmed by Season

| Season | Count | | Season | Count |
|--------|-------|-|--------|-------|
| 1 | 18 | | 15 | 15 |
| 2 | 38 | | 16 | 14 |
| 3 | 27 | | 17 | 16 |
| 4 | 33 | | 18 | 17 |
| 5 | 35 | | 19 | 15 |
| 6 | 28 | | 20 | 18 |
| 7 | 18 | | 21 | 6 |
| 8 | 23 | | 22 | 8 |
| 9 | 36 | | 23 | 9 |
| 10 | 27 | | 24 | 13 |
| 11 | 29 | | 25 | 8 |
| 12 | 24 | | 26 | 14 |
| 13 | 29 | | 27 | 3 |
| 14 | 20 | | | |

### Most Common Tags

| Tag | Count | Description |
|-----|-------|-------------|
| wrong_ID | 323 | Misidentification by victim or witness |
| public_confrontation | 279 | Accused in front of others |
| arrested | 144 | Taken into custody |
| ruined_at_work | 142 | Professional consequences |
| fabricated_claim | 114 | Knowingly false accusation |
| coerced_confession | 102 | Confession under pressure |
| ruined_in_family | 93 | Family/relationship consequences |
| media_outing | 90 | Press coverage of accusation |
| witness_recant | 79 | Witness later changed story |
| perp_walk | 74 | Public arrest/walk of shame |
| teen | 51 | Accused person was a teenager |
| ruined_physically | 44 | Physical harm from accusation |
| custody_dispute | 40 | Accusation tied to custody battle |

---

## Output Files

### svu_episodes_summary.csv

Episode-level data for all 576 episodes:
- `custom_id` — Identifier (e.g., svu_s01_e01)
- `season`, `episode_number`, `episode_title`
- `has_false_suspect` — Y/N/Maybe
- `has_public_exposure` — Y/N/Maybe
- `needs_deep_review` — Y/N
- `summary` — Brief plot summary

### svu_persons_harmed.csv

Person-level data for all 541 individuals meeting North Star criteria:
- Episode identifiers
- `person_label` — Name/description
- `role_in_plot` — initial_suspect, red_herring, family_member, etc.
- `accused_of` — Type of accusation
- `innocence_status` — How innocence was established
- `accusation_origin` — How they came to be accused
- `exposure_channel` — Where the accusation spread
- `consequence_severity` — 1-4 scale
- `consequence_detail` — Specific harm
- `police_conduct_threat` — Detective behavior
- `police_apology` — Whether police apologized
- `tags` — Searchable keywords
- `notes` — Additional context

### svu_analysis_complete_fixed.jsonl

Raw JSON output for all episodes, one JSON object per line.

---

## Interpretation Guidelines

### What This Data Shows

1. **Nearly 60% of SVU episodes** feature at least one person who is suspected/accused and later cleared
2. **Over half of episodes** involve public exposure of an innocent person
3. **The majority of harm is severe** — 62.5% at severity level 3 or 4
4. **Wrong identification is the leading cause** — appearing in 323 of 541 cases
5. **Workplace exposure is most common** after police-only interactions

> **Correction (July 5, 2026):** Point 4 counts the `wrong_ID` *tag*, which marks any misidentification element in a case. The controlled `accusation_origin` *field* tells a different story: `squad_inference` (detectives' own theories) is the leading origin at 55.0% of the 536 qualifying persons; 195 of the 323 wrong_ID tags sit on squad_inference-origin rows. Later keyword-level claims derived from `consequence_detail` (e.g., death counts) were also found to be inflated by keyword matching. The verified, publication-grade statistics live in `docs/svu_paper_stats.md`, which supersedes the results tables in this document wherever they disagree.

### What This Data Does NOT Show

1. The data does not capture suspects who are guilty
2. Episodes without transcripts (4 episodes) may be underrepresented
3. The analysis relies on transcript text only — visual/tonal cues may be missed
4. "police_only" exposure (148 cases) means no qualifying public harm was documented, but these individuals still experienced accusation

### Limitations

- Transcript quality varies; some episodes had encoding issues
- Air dates were not consistently available in the source data
- Some nuanced cases may be categorized differently by human reviewers
- The model occasionally included `actually_guilty` persons (5 cases) which should be filtered for most analyses

---

## Execution Workflow

### Original Files Created

The following files were generated to run the batch analysis:

| File | Size | Purpose |
|------|------|---------|
| `svu_batch_input.jsonl` | 23 MB | All 576 API requests with embedded transcripts |
| `submit_batch.py` | 2 KB | Script to upload JSONL and start batch |
| `check_and_download.py` | 5 KB | Script to monitor status and download results |
| `redownload_full.py` | 6 KB | Script to re-fetch full results and parse properly |
| `merge_results.py` | 6 KB | Script to generate CSVs and statistics |
| `fix_and_merge.py` | 5 KB | Script to strip markdown from JSON responses |
| `requirements.txt` | 18 B | Python dependency (`anthropic>=0.39.0`) |
| `flagged_episodes.txt` | 427 B | List of 5 episodes with data quality issues |
| `README.md` | 4 KB | Setup and usage instructions |

### How the Scripts Worked

**1. `svu_batch_input.jsonl`**
- Generated by extracting all 576 transcripts from the Excel file
- Each line is a complete API request containing:
  - `custom_id`: Episode identifier (e.g., `svu_s01_e01`)
  - `params.model`: `claude-sonnet-4-5-20250929`
  - `params.system`: The full tagging prompt
  - `params.messages`: The transcript with episode metadata
- Transcripts were embedded directly — no external file references needed

**2. `submit_batch.py`**
- Loaded the JSONL file and counted requests
- Prompted for confirmation before spending API credits
- Called `client.messages.batches.create(requests=requests)`
- Saved batch ID to `batch_info_[id].json` for later retrieval

**3. `check_and_download.py`**
- Retrieved batch status via `client.messages.batches.retrieve(batch_id)`
- Showed progress (succeeded/errored/processing counts)
- When status = "ended", streamed results via `client.messages.batches.results(batch_id)`
- Saved raw results to JSONL file

**4. `redownload_full.py`**
- Re-fetched complete results from API (batch results available for 29 days)
- Stripped markdown code blocks (` ```json `) from responses
- Parsed JSON and extracted episode summaries + person rows
- Generated final CSV files

### Execution Timeline

```
Jan 25, 2026 06:44 UTC  — Batch submitted (576 requests)
Jan 25, 2026 20:31 UTC  — Batch completed (~14 hours)
                        — All 576 succeeded, 0 errors
```

### Errors Encountered and Fixes

**Error 1: SDK API Method**
```
AttributeError: 'Anthropic' object has no attribute 'batches'
```
- **Cause:** Initial script used `client.batches.create()` 
- **Fix:** Changed to `client.messages.batches.create()`

**Error 2: Mac Python Environment**
```
error: externally-managed-environment
```
- **Cause:** Modern macOS restricts system-wide pip installs
- **Fix:** Created virtual environment:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  pip install anthropic
  ```

**Error 3: JSON Parse Failures (576 errors initially)**
```
parse_error: "Expecting value: line 1 column 1 (char 0)"
```
- **Cause:** Model wrapped JSON responses in markdown code blocks (` ```json ... ``` `)
- **Initial symptom:** `merge_results.py` showed 0 episodes parsed, 576 errors
- **Diagnosis:** Examined raw content — valid JSON was present but wrapped
- **Fix:** Created `redownload_full.py` with `extract_json()` function to strip markdown:
  ```python
  def extract_json(text):
      text = text.strip()
      if text.startswith("```json"):
          text = text[7:]
      if text.endswith("```"):
          text = text[:-3]
      return text.strip()
  ```

**Error 4: Truncated Content**
- **Cause:** Initial download script truncated response content when saving
- **Symptom:** Only 112 of 576 episodes parsed after first fix attempt
- **Fix:** `redownload_full.py` re-fetched full content directly from API

### Final Cleanup

After successful extraction, intermediate files were deleted:

**Deleted (no longer needed):**
- `svu_batch_input.jsonl` — 23MB input file (already processed)
- `svu_batch_results_*.jsonl` — Raw API output (superseded)
- `svu_analysis_complete.jsonl` — Broken version (before fix)
- `svu_analysis_fixed.jsonl` — Intermediate attempt
- `svu_processing_errors.json` — Old error log
- `svu_remaining_errors.json` — Old error log
- `submit_batch.py` — Submission script (done)
- `check_and_download.py` — Download script (done)
- `redownload_full.py` — Re-download script (done)
- `merge_results.py` — Merge script (done)
- `fix_and_merge.py` — Fix script (done)
- `requirements.txt` — Dependencies (done)
- `README.md` — Old instructions
- `flagged_episodes.txt` — Info captured in this doc
- `venv/` — Virtual environment folder

**Kept (final deliverables):**
- `svu_persons_harmed.csv` — 541 falsely accused persons
- `svu_episodes_summary.csv` — 576 episode summaries
- `svu_analysis_complete_fixed.jsonl` — Raw JSON for re-analysis
- `batch_info_msgbatch_01VPbVGXpvSdsnZwngRxDQ3U.json` — Batch reference

### Cleanup Commands Used

```bash
cd ~/Downloads/svu_batch_package

# Delete scripts and intermediate files
rm -f submit_batch.py check_and_download.py redownload_full.py merge_results.py fix_and_merge.py
rm -f requirements.txt README.md flagged_episodes.txt
rm -f svu_batch_input.jsonl svu_batch_results_*.jsonl
rm -f svu_analysis_complete.jsonl svu_processing_errors.json svu_remaining_errors.json svu_analysis_fixed.jsonl

# Delete virtual environment
rm -rf venv
```

### Final File Location

After cleanup, the folder was moved to Desktop:

```bash
mv ~/Downloads/svu_batch_package ~/Desktop/SVU
```

**Final location:** `~/Desktop/SVU/`

**Contents:**
- `svu_persons_harmed.csv` — 541 falsely accused persons (709 KB)
- `svu_episodes_summary.csv` — 576 episode summaries (359 KB)
- `svu_analysis_complete_fixed.jsonl` — Raw JSON for re-analysis (1.5 MB)
- `batch_info_msgbatch_01VPbVGXpvSdsnZwngRxDQ3U.json` — Batch reference

---

## Replication

To re-run this analysis or process additional episodes:

### Required Files

1. `svu_batch_input.jsonl` — All 576 API requests (must regenerate from Excel)
2. `submit_batch.py` — Batch submission script
3. `check_and_download.py` — Status check and download script
4. `redownload_full.py` — Full re-download with proper parsing

### Commands

```bash
# Setup
python3 -m venv venv
source venv/bin/activate
pip install anthropic

# Set API key
export ANTHROPIC_API_KEY='sk-ant-...'

# Submit batch (~$15-17)
python submit_batch.py

# Check status (repeat until "ended")
python check_and_download.py

# Download and parse results (handles markdown stripping)
python redownload_full.py
```

### Key Lessons for Future Runs

1. **Always use virtual environment on Mac** — `python3 -m venv venv`
2. **Model may wrap JSON in markdown** — Always strip ` ```json ` wrappers
3. **Batch results persist 29 days** — Can re-download if parsing fails
4. **Use `client.messages.batches`** — Not `client.batches`

---

## Contact & Attribution

This analysis was conducted using Claude (Anthropic) with a custom tagging prompt designed for systematic content analysis of false accusation narratives in television procedural dramas.

Date completed: January 25, 2026
