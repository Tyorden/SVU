# SVU False Accusation Data Visualization

An interactive React dashboard to explore false accusation patterns in Law & Order: SVU across 576 episodes and 541 documented persons harmed.

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

The dashboard analyzes data from two CSV files that were converted to JSON:
- `svu_episodes_summary.csv` → `src/data/episodes.json`
- `svu_persons_harmed.csv` → `src/data/persons.json`

## Key Findings

- **59.7%** of episodes contain false suspects
- **52.1%** of episodes have public exposure of innocent people
- **541** individuals documented as falsely accused or harmed
- Severity distribution shows significant cases of life-altering consequences

## License

Research data and visualization for academic purposes.
