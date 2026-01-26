/**
 * Person Card Component
 *
 * Expandable card showing details about a falsely accused individual.
 * Collapsed view shows name, role, accusation, and severity badge.
 * Expanded view reveals full details: innocence status, exposure info,
 * police conduct, quotes, tags, and notes.
 *
 * Severity is color-coded:
 * - Green (1): Low harm
 * - Yellow (2): Public exposure
 * - Orange (3): Material sanction
 * - Red (4): Life-altering/death
 */

import { useState } from 'react'
import type { Person } from '../hooks/useData'
import {
  formatSeverity,
  getSeverityBgClass,
  formatRole,
  formatAccusedOf,
  formatAccusationOrigin,
  formatThreatType,
  formatApology,
  formatExposureChannel,
} from '../utils/formatters'

interface PersonCardProps {
  person: Person
}

export default function PersonCard({ person }: PersonCardProps) {
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
