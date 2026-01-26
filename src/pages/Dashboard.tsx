/**
 * Dashboard Page (/)
 *
 * Home page showing overview of the SVU false accusation analysis.
 *
 * Content:
 * - Project introduction text
 * - Key statistics cards (episodes, persons harmed, rates)
 * - Severity distribution donut chart
 * - Accusation types horizontal bar chart
 * - Persons harmed by season bar chart
 * - Methodology section
 * - Data quality section
 * - Key findings summary
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStats, usePersons, useEpisodes } from '../hooks/useData'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import { getSeverityColor, formatSeverity, formatAccusedOf } from '../utils/formatters'
import { CONSEQUENCE_SEVERITY, NORTH_STAR_CRITERIA, DATA_QUALITY_ISSUES } from '../utils/definitions'

export default function Dashboard() {
  const stats = useStats()
  const persons = usePersons()
  const episodes = useEpisodes()

  const severityData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const sev = p.consequence_severity || 'unknown'
      counts[sev] = (counts[sev] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([key]) => ['1', '2', '3', '4'].includes(key))
      .map(([severity, count]) => ({
        name: `${formatSeverity(severity)}`,
        value: count,
        severity,
      }))
      .sort((a, b) => Number(a.severity) - Number(b.severity))
  }, [persons])

  const personsBySeason = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const season = p.season || 'unknown'
      counts[season] = (counts[season] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([season, count]) => ({
        season: `S${season}`,
        count,
      }))
      .sort((a, b) => Number(a.season.slice(1)) - Number(b.season.slice(1)))
  }, [persons])

  // Accusation types with formatted labels
  const accusationTypeData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const type = p.accused_of || 'unknown'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({
        type: formatAccusedOf(type),
        count,
        raw: type,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [persons])

  const falseSuspectByReview = useMemo(() => {
    let needsReview = 0
    let reviewed = 0
    episodes.forEach(e => {
      if (e.has_false_suspect === 'Y') {
        if (e.needs_deep_review === 'Y') needsReview++
        else reviewed++
      }
    })
    return { needsReview, reviewed }
  }, [episodes])

  // Episodes with data quality issues
  const episodesNeedingReview = useMemo(() => {
    return episodes.filter(e => e.needs_deep_review === 'Y')
  }, [episodes])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">SVU False Accusation Analysis</h1>
        <p className="text-slate-600 mt-2 max-w-3xl">
          This dashboard explores patterns of false accusations and wrongful suspicion in Law &
          Order: SVU, analyzing 576 episodes across 27 seasons to understand how innocent people
          are depicted as suspects and the consequences they face.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Episodes Analyzed"
          value={stats.totalEpisodes}
          subtitle="Seasons 1-27 (1999-2026)"
          color="blue"
        />
        <StatCard
          title="Persons Harmed"
          value={stats.totalPersons}
          subtitle="Individuals falsely accused"
          color="red"
        />
        <StatCard
          title="False Suspect Rate"
          value={`${stats.falseSuspectRate}%`}
          subtitle={`${stats.falseSuspectEpisodes} episodes`}
          color="yellow"
        />
        <StatCard
          title="Public Exposure Rate"
          value={`${stats.publicExposureRate}%`}
          subtitle={`${stats.publicExposureEpisodes} episodes`}
          color="purple"
        />
      </div>

      {/* Methodology Section */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Methodology: Who Was Counted?</h3>
          <p className="text-sm text-slate-600 mb-4">
            {NORTH_STAR_CRITERIA.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NORTH_STAR_CRITERIA.criteria.map((criterion, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="font-medium text-slate-800">{criterion.title}</h4>
                </div>
                <p className="text-xs text-slate-600">{criterion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Severity Scale Legend */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Severity Scale</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(CONSEQUENCE_SEVERITY).map(([level, data]) => (
              <div
                key={level}
                className="rounded-lg p-4 border-l-4"
                style={{ borderLeftColor: data.color, backgroundColor: `${data.color}10` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: data.color }}
                  />
                  <span className="font-semibold text-slate-800">Level {level}: {data.label}</span>
                </div>
                <p className="text-xs text-slate-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Consequence Severity Distribution" subtitle="How harmed were the falsely accused?">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {severityData.map((entry) => (
                  <Cell key={entry.severity} fill={getSeverityColor(entry.severity)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Accusation Types" subtitle="What were people falsely accused of?">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accusationTypeData} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={115} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <ChartCard title="Persons Harmed by Season" subtitle="Distribution across 27 seasons">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={personsBySeason}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Data Coverage</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• {falseSuspectByReview.reviewed} episodes with confirmed false suspects</li>
              <li>• {falseSuspectByReview.needsReview} episodes flagged for deeper review</li>
              <li>• Average of {(stats.totalPersons / stats.falseSuspectEpisodes).toFixed(1)} persons harmed per episode with false suspects</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2">Severity Breakdown</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {severityData.map(s => (
                <li key={s.severity} className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getSeverityColor(s.severity) }}
                  />
                  <span>{formatSeverity(s.severity)}: {s.value} cases ({((s.value / stats.totalPersons) * 100).toFixed(1)}%)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Data Quality Section */}
      <section className="mb-8">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Data Quality Notes</h3>
          <p className="text-sm text-amber-800 mb-4">
            Five episodes had data quality issues that may affect analysis accuracy. These episodes
            are flagged with "needs_deep_review" and may require manual verification.
          </p>
          <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-amber-900">Episode</th>
                  <th className="text-left px-4 py-2 font-medium text-amber-900">Issue</th>
                </tr>
              </thead>
              <tbody>
                {DATA_QUALITY_ISSUES.map((issue, i) => (
                  <tr key={i} className="border-t border-amber-100">
                    <td className="px-4 py-2 font-medium text-amber-800">{issue.episode}</td>
                    <td className="px-4 py-2 text-amber-700">{issue.issue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {episodesNeedingReview.length > 5 && (
            <p className="text-xs text-amber-700 mt-3">
              Additionally, {episodesNeedingReview.length - 5} other episodes are flagged for review
              due to ambiguous or incomplete tagging.{' '}
              <Link to="/episodes?review=Y" className="underline hover:text-amber-900">
                View all flagged episodes
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* About Section */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">About This Research</h3>
        <p className="text-sm text-indigo-800 mb-4">
          This analysis documents instances where characters in Law & Order: SVU are falsely
          accused, wrongly suspected, or publicly exposed as perpetrators of crimes they did not
          commit. The data tracks the origins of accusations, police conduct during investigations,
          channels of public exposure, and ultimate consequences for those harmed.
        </p>
        <div className="text-sm text-indigo-700">
          <p className="mb-2"><strong>Key Research Question:</strong> How often does SVU portray innocent people being harmed by false accusations, and what are the patterns in terms of severity, exposure channels, and outcomes?</p>
          <p><strong>Processing:</strong> All 576 episode transcripts were analyzed using Claude (Anthropic) with a standardized tagging methodology to ensure consistent categorization.</p>
        </div>
      </div>
    </div>
  )
}
