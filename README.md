# Law & Order Franchise False Accusation Research

An interactive React dashboard and research dataset exploring false accusation patterns across the Law & Order franchise: 576 SVU episodes (541 documented persons harmed) and 314 original Law & Order episodes (429 persons harmed) — 890 episodes and 970 persons in total, spanning 1990-2026.

## Live Demo

Deployed automatically via Vercel when changes are pushed to main.

## Features

### Dashboard (`/`)
- Project overview and research introduction
- Key statistics: episodes analyzed, persons harmed, false suspect rate, public exposure rate
- Severity distribution donut chart (green/yellow/orange/red scale)
- Accusation types horizontal bar chart
- Persons harmed by season trend chart
- Key findings summary

### Analysis (`/analysis`)
- **Police Conduct Section**: Threat types distribution, apology outcomes, threats vs apologies correlation
- **Accusation Origin Section**: How people became suspects, who exposed them, origin vs severity
- **Consequences Section**: Exposure channels, consequence categories
- **Interactive Correlation Tool**: Select any two variables to explore relationships

### Episodes Browser (`/episodes`)
- Searchable/filterable table of all 576 episodes
- Filters: Season (1-27), false suspect status, public exposure status, review needed
- Paginated results (25 per page)
- Click any row to view episode details

### Episode Detail (`/episodes/:id`)
- Episode metadata and summary
- Data quality warnings for episodes needing review
- Expandable cards for each person harmed showing full details

### Story, Insights & Visualizations (`/story`, `/insights`, `/visualizations`)
- Narrative presentation mode, exportable insight summaries, and additional charts

### Law & Order Mirror Site (`/lo/*`)
- Full parallel site for the original Law & Order dataset (314 episodes, 429 persons)
- Same page structure: dashboard, analysis, episodes, story, insights, visualizations
- Pages live in `src/pages/lo/`, data hooks in `src/hooks/useLoData.ts`

## Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router v6
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (auto-deploy from GitHub)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Root layout with navbar
│   ├── Navbar.tsx       # Top navigation
│   ├── StatCard.tsx     # Metric display card
│   ├── ChartCard.tsx    # Chart container wrapper
│   ├── EpisodeTable.tsx # Paginated episode list
│   ├── PersonCard.tsx   # Expandable person details
│   ├── CorrelationChart.tsx  # Dynamic stacked bar chart
│   └── FilterPanel.tsx  # Episode filter controls
├── pages/               # Route page components
│   ├── Dashboard.tsx    # Home page (/)
│   ├── Analysis.tsx     # Analysis page (/analysis)
│   ├── Episodes.tsx     # Episode browser (/episodes)
│   └── EpisodeDetail.tsx # Episode detail (/episodes/:id)
├── hooks/
│   └── useData.ts       # Data access hooks and TypeScript interfaces
├── utils/
│   ├── formatters.ts    # Display formatting functions
│   └── correlations.ts  # Cross-tabulation computation
├── data/                # JSON data files (converted from CSV)
│   ├── episodes.json    # 576 episode records
│   └── persons.json     # 541 person records
├── App.tsx              # Router configuration
├── main.tsx             # React entry point
└── index.css            # Tailwind imports
```

## Data Model

### Episode Fields
| Field | Description |
|-------|-------------|
| `custom_id` | Unique ID (e.g., `svu_s01_e01`) |
| `season` | Season number (1-27) |
| `episode_number` | Episode within season |
| `episode_title` | Episode title |
| `has_false_suspect` | Y/N/Maybe |
| `has_public_exposure` | Y/N/Maybe |
| `needs_deep_review` | Y/N (data quality flag) |
| `summary` | Episode narrative summary |

### Person Fields
| Field | Description |
|-------|-------------|
| `person_label` | Character name/description |
| `role_in_plot` | initial_suspect, red_herring, family_member, etc. |
| `accused_of` | rape, CSA, assault, murder, etc. |
| `innocence_status` | proven_innocent, strongly_implied_innocent, partially_involved |
| `accusation_origin` | victim_ID, witness_misID, squad_inference, tech_db_error, fabrication |
| `exposure_channel` | media, workplace, family, police_only, multiple |
| `consequence_severity` | 1-4 scale (see below) |
| `police_conduct_threat` | none, verbal_threat, coercive_tactic, insult_degradation, multiple |
| `police_apology` | none, partial, formal |

### Severity Scale
| Level | Color | Description |
|-------|-------|-------------|
| 1 | Green | Low harm - private suspicion, quickly cleared |
| 2 | Yellow | Public exposure - workplace/family learned |
| 3 | Orange | Material sanction - arrested, fired, lost custody |
| 4 | Red | Life-altering/death - prison, murder, suicide |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Sources

The dashboard analyzes CSV datasets (repo root) converted to JSON (`src/data/`):

| Show | Episodes | Persons | Raw JSONL |
|------|----------|---------|-----------|
| SVU | `svu_episodes_summary.csv` → `episodes.json` | `svu_persons_harmed.csv` → `persons.json` | `svu_analysis_complete_fixed.jsonl` |
| Law & Order | `lo_episodes_summary.csv` → `lo_episodes.json` | `lo_persons_harmed.csv` → `lo_persons.json` | `lo_analysis_complete.jsonl` |

Episode transcripts were sourced from subslikescript.com and analyzed with the Anthropic Batch API (Claude Sonnet 4.5) using the tagging methodology documented in `SVU_False_Accusation_Project_Documentation.md`. The original L&O batch project (scripts, tagging prompt, batch files) lives at `~/Desktop/LO`.

## Research & Publication Materials

- `SVU_False_Accusation_Project_Documentation.md` — full methodology, tagging prompt, and results summary
- `SVU_False_Accusation_Academic_Paper.docx` — academic paper draft (SVU-only study)
- `svu_publication_guide.md`, `lo_publication_guide.md`, `lo_standalone_publication_guide.md`, `franchise_combined_publication_guide.md` — publication and dissemination strategy guides
- `docs/` — working documents (analysis findings, papers roadmap)

## Key Findings

- **59.7%** of SVU episodes and **72.3%** of L&O episodes contain false suspects
- **~60%** of persons harmed suffer severity 3-4 consequences (arrest, job loss, death)
- Police apologize in under **2%** of cases on both shows (SVU 1.8%, L&O 1.6%)
- **970** individuals documented as falsely accused and harmed across the franchise
- The franchise portrays false accusation roughly **10x** more often than real-world wrongful conviction estimates (~6%)

## License

Research data and visualization for academic purposes.
