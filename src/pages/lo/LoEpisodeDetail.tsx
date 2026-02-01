/**
 * Law & Order Episode Detail Page (/lo/episodes/:id)
 *
 * Detailed view of a single Law & Order episode and all persons harmed.
 *
 * Content:
 * - Episode metadata (season, episode number, title)
 * - Status badges (false suspect, public exposure)
 * - Data quality warning if needs_deep_review
 * - Episode summary text
 * - List of all persons harmed with expandable inline cards
 *   (includes prosecutorial_conduct and prosecutorial_apology fields
 *   specific to Law & Order)
 *
 * URL parameter: id (episode custom_id, e.g., "lo_s01_e01")
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLoEpisode, useLoPersonsByEpisode } from '../../hooks/useLoData'
import type { LoPerson } from '../../hooks/useLoData'
import {
  formatSeverity,
  getSeverityBgClass,
  formatRole,
  formatAccusedOf,
  formatAccusationOrigin,
  formatThreatType,
  formatApology,
  formatExposureChannel,
  formatProsecutorialConduct,
  formatProsecutorialApology,
} from '../../utils/formatters'

function LoPersonCard({ person }: { person: LoPerson }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-900">{person.person_label}</h4>
            <p className="text-sm text-slate-500 mt-1">
              {formatRole(person.role_in_plot)} &bull; Accused of {formatAccusedOf(person.accused_of)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getSeverityBgClass(
                person.consequence_severity
              )}`}
            >
              Severity {person.consequence_severity}: {formatSeverity(person.consequence_severity)}
            </span>
            <span className="text-slate-400">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-slate-500">Innocence Status</p>
              <p className="text-slate-800">{formatRole(person.innocence_status)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Accusation Origin</p>
              <p className="text-slate-800">{formatAccusationOrigin(person.accusation_origin)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Exposure Channel</p>
              <p className="text-slate-800">{formatExposureChannel(person.exposure_channel)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Who Exposed</p>
              <p className="text-slate-800">{formatRole(person.exposure_who_told)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Police Conduct</p>
              <p className="text-slate-800">{formatThreatType(person.police_conduct_threat)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Police Apology</p>
              <p className="text-slate-800">{formatApology(person.police_apology)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Prosecutorial Conduct</p>
              <p className="text-slate-800">{formatProsecutorialConduct(person.prosecutorial_conduct)}</p>
            </div>
            <div>
              <p className="font-medium text-slate-500">Prosecutorial Apology</p>
              <p className="text-slate-800">{formatProsecutorialApology(person.prosecutorial_apology)}</p>
            </div>
            <div className="col-span-2">
              <p className="font-medium text-slate-500">Consequence</p>
              <p className="text-slate-800">
                {person.consequence_category}: {person.consequence_detail}
              </p>
            </div>
            {person.tags && (
              <div className="col-span-2">
                <p className="font-medium text-slate-500">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {person.tags.split(';').map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {person.quote_or_scene && (
              <div className="col-span-2">
                <p className="font-medium text-slate-500">Notable Scene</p>
                <p className="text-slate-700 italic text-sm mt-1 bg-slate-50 p-3 rounded">
                  "{person.quote_or_scene}"
                </p>
              </div>
            )}
            {person.police_conduct_quote && (
              <div className="col-span-2">
                <p className="font-medium text-slate-500">Police Conduct Quote</p>
                <p className="text-slate-700 italic text-sm mt-1 bg-red-50 p-3 rounded">
                  "{person.police_conduct_quote}"
                </p>
              </div>
            )}
            {person.notes && (
              <div className="col-span-2">
                <p className="font-medium text-slate-500">Notes</p>
                <p className="text-slate-600 text-sm mt-1">{person.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function LoEpisodeDetail() {
  const { id } = useParams<{ id: string }>()
  const episode = useLoEpisode(id || '')
  const persons = useLoPersonsByEpisode(id || '')

  if (!episode) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-slate-900">Episode Not Found</h1>
        <p className="text-slate-600 mt-2">The requested Law & Order episode could not be found.</p>
        <Link
          to="/lo/episodes"
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
        to="/lo/episodes"
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
              This episode is flagged for deeper review. Data may be incomplete or require
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
              <LoPersonCard key={`${person.custom_id}-${person.person_id_in_episode}-${index}`} person={person} />
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
          to="/lo/episodes"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          ← All Episodes
        </Link>
        <Link
          to="/lo/analysis"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          View Analysis →
        </Link>
      </div>
    </div>
  )
}
