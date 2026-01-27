/**
 * Filter Panel Component
 *
 * Control panel for filtering the episodes list.
 * Responsive design with grid layout on mobile.
 * Provides dropdowns and search functionality for:
 * - Text search (title and summary)
 * - Season filter (1-27)
 * - False suspect status (Y/N/Maybe)
 * - Public exposure status (Y/N/Maybe)
 * - Review needed status (Y/N)
 * - Severity level (1-4) - filters by persons in episode
 * - Police conduct threat type - filters by persons in episode
 */

interface FilterOption {
  value: string
  label: string
}

interface FilterPanelProps {
  seasonFilter: string
  setSeasonFilter: (value: string) => void
  falseSuspectFilter: string
  setFalseSuspectFilter: (value: string) => void
  publicExposureFilter: string
  setPublicExposureFilter: (value: string) => void
  reviewFilter: string
  setReviewFilter: (value: string) => void
  severityFilter: string
  setSeverityFilter: (value: string) => void
  threatFilter: string
  setThreatFilter: (value: string) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
}

const seasonOptions: FilterOption[] = [
  { value: '', label: 'All Seasons' },
  ...Array.from({ length: 27 }, (_, i) => ({
    value: String(i + 1),
    label: `Season ${i + 1}`,
  })),
]

const yesNoOptions: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
  { value: 'Maybe', label: 'Maybe' },
]

const reviewOptions: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'Y', label: 'Needs Review' },
  { value: 'N', label: 'Reviewed' },
]

const severityOptions: FilterOption[] = [
  { value: '', label: 'All' },
  { value: '1', label: 'Level 1 (Low)' },
  { value: '2', label: 'Level 2 (Public)' },
  { value: '3', label: 'Level 3 (Material)' },
  { value: '4', label: 'Level 4 (Life-Altering)' },
]

const threatOptions: FilterOption[] = [
  { value: '', label: 'All' },
  { value: 'none', label: 'None' },
  { value: 'verbal_threat', label: 'Verbal Threats' },
  { value: 'coercive_tactic', label: 'Coercive Tactics' },
  { value: 'insult_degradation', label: 'Insults/Degradation' },
  { value: 'multiple', label: 'Multiple' },
]

export default function FilterPanel({
  seasonFilter,
  setSeasonFilter,
  falseSuspectFilter,
  setFalseSuspectFilter,
  publicExposureFilter,
  setPublicExposureFilter,
  reviewFilter,
  setReviewFilter,
  severityFilter,
  setSeverityFilter,
  threatFilter,
  setThreatFilter,
  searchTerm,
  setSearchTerm,
}: FilterPanelProps) {
  const selectClass =
    'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Row 1: Search and basic filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Search - full width on mobile */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={selectClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Season</label>
          <select
            value={seasonFilter}
            onChange={e => setSeasonFilter(e.target.value)}
            className={selectClass}
          >
            {seasonOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">False Suspect?</label>
          <select
            value={falseSuspectFilter}
            onChange={e => setFalseSuspectFilter(e.target.value)}
            className={selectClass}
          >
            {yesNoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Exposure?</label>
          <select
            value={publicExposureFilter}
            onChange={e => setPublicExposureFilter(e.target.value)}
            className={selectClass}
          >
            {yesNoOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Review</label>
          <select
            value={reviewFilter}
            onChange={e => setReviewFilter(e.target.value)}
            className={selectClass}
          >
            {reviewOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Person-level filters (severity and threats) */}
      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Severity Level</label>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className={selectClass}
          >
            {severityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Police Conduct</label>
          <select
            value={threatFilter}
            onChange={e => setThreatFilter(e.target.value)}
            className={selectClass}
          >
            {threatOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
