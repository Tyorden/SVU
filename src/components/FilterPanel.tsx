/**
 * Filter Panel Component
 *
 * Control panel for filtering the episodes list.
 * Provides dropdowns and search functionality for:
 * - Text search (title and summary)
 * - Season filter (1-27)
 * - False suspect status (Y/N/Maybe)
 * - Public exposure status (Y/N/Maybe)
 * - Review needed status (Y/N)
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

export default function FilterPanel({
  seasonFilter,
  setSeasonFilter,
  falseSuspectFilter,
  setFalseSuspectFilter,
  publicExposureFilter,
  setPublicExposureFilter,
  reviewFilter,
  setReviewFilter,
  searchTerm,
  setSearchTerm,
}: FilterPanelProps) {
  const selectClass =
    'px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
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
          <label className="block text-xs font-medium text-slate-500 mb-1">Public Exposure?</label>
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
          <label className="block text-xs font-medium text-slate-500 mb-1">Review Status</label>
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
    </div>
  )
}
