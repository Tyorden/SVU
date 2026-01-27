/**
 * Episode Table Component
 *
 * Paginated data table displaying episode list.
 * Responsive: Card view on mobile, table on desktop.
 * Rows/cards are clickable to navigate to episode detail page.
 *
 * Status badges color coding:
 * - Green: Yes (Y)
 * - Gray: No (N)
 * - Yellow: Maybe
 */

import { useNavigate } from 'react-router-dom'
import type { Episode } from '../hooks/useData'

interface EpisodeTableProps {
  episodes: Episode[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function EpisodeTable({
  episodes,
  currentPage,
  totalPages,
  onPageChange,
}: EpisodeTableProps) {
  const navigate = useNavigate()

  const getBadgeClass = (value: string) => {
    switch (value) {
      case 'Y':
        return 'bg-green-100 text-green-700'
      case 'N':
        return 'bg-slate-100 text-slate-600'
      case 'Maybe':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Mobile Card View */}
      <div className="sm:hidden">
        {episodes.map(episode => (
          <div
            key={episode.custom_id}
            onClick={() => navigate(`/episodes/${episode.custom_id}`)}
            className="p-3 border-b border-slate-100 active:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs text-slate-500">
                  S{episode.season} E{episode.episode_number}
                </span>
                <h3 className="text-sm font-medium text-slate-900 leading-tight">
                  {episode.episode_title}
                </h3>
              </div>
              <svg
                className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span
                className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${getBadgeClass(
                  episode.has_false_suspect
                )}`}
              >
                Suspect: {episode.has_false_suspect}
              </span>
              <span
                className={`inline-block px-1.5 py-0.5 text-xs font-medium rounded ${getBadgeClass(
                  episode.has_public_exposure
                )}`}
              >
                Exposure: {episode.has_public_exposure}
              </span>
              {episode.needs_deep_review === 'Y' && (
                <span className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-700">
                  Needs Review
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">S</th>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">Ep</th>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">Title</th>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">
                Suspect
              </th>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">
                Exposure
              </th>
              <th className="text-left px-3 lg:px-4 py-3 text-xs lg:text-sm font-semibold text-slate-600">
                Review
              </th>
            </tr>
          </thead>
          <tbody>
            {episodes.map(episode => (
              <tr
                key={episode.custom_id}
                onClick={() => navigate(`/episodes/${episode.custom_id}`)}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-slate-700">{episode.season}</td>
                <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-slate-700">{episode.episode_number}</td>
                <td className="px-3 lg:px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-slate-900 font-medium">
                  {episode.episode_title}
                </td>
                <td className="px-3 lg:px-4 py-2.5 lg:py-3">
                  <span
                    className={`inline-block px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs font-medium rounded ${getBadgeClass(
                      episode.has_false_suspect
                    )}`}
                  >
                    {episode.has_false_suspect}
                  </span>
                </td>
                <td className="px-3 lg:px-4 py-2.5 lg:py-3">
                  <span
                    className={`inline-block px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs font-medium rounded ${getBadgeClass(
                      episode.has_public_exposure
                    )}`}
                  >
                    {episode.has_public_exposure}
                  </span>
                </td>
                <td className="px-3 lg:px-4 py-2.5 lg:py-3">
                  <span
                    className={`inline-block px-1.5 lg:px-2 py-0.5 lg:py-1 text-xs font-medium rounded ${getBadgeClass(
                      episode.needs_deep_review === 'Y' ? 'Y' : 'N'
                    )}`}
                  >
                    {episode.needs_deep_review === 'Y' ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-xs sm:text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPageChange(currentPage - 1)
              }}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPageChange(currentPage + 1)
              }}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
