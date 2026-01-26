/**
 * Episode Table Component
 *
 * Paginated data table displaying episode list.
 * Shows season, episode number, title, and status badges.
 * Rows are clickable to navigate to episode detail page.
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Season</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Episode</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                False Suspect?
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                Public Exposure?
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                Review Needed?
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
                <td className="px-4 py-3 text-sm text-slate-700">{episode.season}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{episode.episode_number}</td>
                <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                  {episode.episode_title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeClass(
                      episode.has_false_suspect
                    )}`}
                  >
                    {episode.has_false_suspect}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeClass(
                      episode.has_public_exposure
                    )}`}
                  >
                    {episode.has_public_exposure}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${getBadgeClass(
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
