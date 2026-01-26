/**
 * Episode Detail Page (/episodes/:id)
 *
 * Detailed view of a single episode and all persons harmed.
 *
 * Content:
 * - Episode metadata (season, episode number, title)
 * - Status badges (false suspect, public exposure)
 * - Data quality warning if needs_deep_review
 * - Episode summary text
 * - List of all persons harmed with expandable cards
 *
 * URL parameter: id (episode custom_id, e.g., "svu_s01_e01")
 */

import { useParams, Link } from 'react-router-dom'
import { useEpisode, usePersonsByEpisode } from '../hooks/useData'
import PersonCard from '../components/PersonCard'

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>()
  const episode = useEpisode(id || '')
  const persons = usePersonsByEpisode(id || '')

  if (!episode) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Episode Not Found</h1>
        <p className="text-slate-600 mt-2">The requested episode could not be found.</p>
        <Link
          to="/episodes"
          className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Episodes
        </Link>
      </div>
    )
  }

  const getBadgeClass = (value: string) => {
    switch (value) {
      case 'Y':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'N':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'Maybe':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div>
      <Link
        to="/episodes"
        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4"
      >
        ← Back to Episodes
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500">
              Season {episode.season}, Episode {episode.episode_number}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{episode.episode_title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getBadgeClass(
                episode.has_false_suspect
              )}`}
            >
              False Suspect: {episode.has_false_suspect}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getBadgeClass(
                episode.has_public_exposure
              )}`}
            >
              Public Exposure: {episode.has_public_exposure}
            </span>
          </div>
        </div>

        {episode.needs_deep_review === 'Y' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ This episode is flagged for deeper review. Data may be incomplete or require
              validation.
            </p>
          </div>
        )}

        <div className="prose prose-slate max-w-none">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Episode Summary</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{episode.summary}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Persons Harmed ({persons.length})
        </h2>
        {persons.length > 0 ? (
          <div className="space-y-4">
            {persons.map((person, index) => (
              <PersonCard key={`${person.custom_id}-${index}`} person={person} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-6 text-center">
            <p className="text-slate-600">
              No persons harmed were documented for this episode.
            </p>
            {episode.has_false_suspect === 'N' && (
              <p className="text-sm text-slate-500 mt-2">
                This episode was identified as not containing false suspects.
              </p>
            )}
            {episode.has_false_suspect === 'Maybe' && (
              <p className="text-sm text-slate-500 mt-2">
                This episode may contain false suspects but has not been fully analyzed.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Link
          to="/episodes"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          ← All Episodes
        </Link>
        <Link
          to="/analysis"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          View Analysis →
        </Link>
      </div>
    </div>
  )
}
