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
import { CONSEQUENCE_SEVERITY, NORTH_STAR_CRITERIA, DATA_QUALITY_ISSUES, FUTURE_ANALYSIS } from '../utils/definitions'

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
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">SVU False Accusation Analysis</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl">
          This dashboard explores patterns of false accusations and wrongful suspicion in Law &
          Order: SVU, analyzing 576 episodes across 27 seasons to understand how innocent people
          are depicted as suspects and the consequences they face.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
      <section className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Methodology: Who Was Counted?</h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            {NORTH_STAR_CRITERIA.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {NORTH_STAR_CRITERIA.criteria.map((criterion, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <h4 className="font-medium text-slate-800 text-sm sm:text-base">{criterion.title}</h4>
                </div>
                <p className="text-xs text-slate-600">{criterion.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Severity Scale Legend */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Severity Scale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(CONSEQUENCE_SEVERITY).map(([level, data]) => (
              <div
                key={level}
                className="rounded-lg p-3 sm:p-4 border-l-4"
                style={{ borderLeftColor: data.color, backgroundColor: `${data.color}10` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: data.color }}
                  />
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">Level {level}: {data.label}</span>
                </div>
                <p className="text-xs text-slate-600">{data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <ChartCard title="Consequence Severity Distribution" subtitle="How harmed were the falsely accused?">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
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
            <BarChart data={accusationTypeData} layout="vertical" margin={{ left: 80, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 9 }} width={75} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <ChartCard title="Persons Harmed by Season" subtitle="Distribution across 27 seasons">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={personsBySeason} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="season" tick={{ fontSize: 8 }} interval={0} angle={-45} textAnchor="end" height={40} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Key Findings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-2 text-sm sm:text-base">Data Coverage</h4>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
              <li>• {falseSuspectByReview.reviewed} episodes with confirmed false suspects</li>
              <li>• {falseSuspectByReview.needsReview} episodes flagged for deeper review</li>
              <li>• Average of {(stats.totalPersons / stats.falseSuspectEpisodes).toFixed(1)} persons harmed per episode with false suspects</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-2 text-sm sm:text-base">Severity Breakdown</h4>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
              {severityData.map(s => (
                <li key={s.severity} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getSeverityColor(s.severity) }}
                  />
                  <span>{formatSeverity(s.severity)}: {s.value} ({((s.value / stats.totalPersons) * 100).toFixed(0)}%)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Data Quality Section */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-3 sm:mb-4">Data Quality Notes</h3>
          <p className="text-xs sm:text-sm text-amber-800 mb-4">
            Five episodes had data quality issues that may affect analysis accuracy. These episodes
            are flagged with "needs_deep_review" and may require manual verification.
          </p>
          <div className="bg-white rounded-lg border border-amber-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-amber-100">
                <tr>
                  <th className="text-left px-3 sm:px-4 py-2 font-medium text-amber-900">Episode</th>
                  <th className="text-left px-3 sm:px-4 py-2 font-medium text-amber-900">Issue</th>
                </tr>
              </thead>
              <tbody>
                {DATA_QUALITY_ISSUES.map((issue, i) => (
                  <tr key={i} className="border-t border-amber-100">
                    <td className="px-3 sm:px-4 py-2 font-medium text-amber-800 whitespace-nowrap">{issue.episode}</td>
                    <td className="px-3 sm:px-4 py-2 text-amber-700">{issue.issue}</td>
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

      {/* Future Analysis Section */}
      <section className="mb-6 sm:mb-8">
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">{FUTURE_ANALYSIS.title}</h3>
          <p className="text-xs sm:text-sm text-purple-800 mb-4">
            {FUTURE_ANALYSIS.note}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {FUTURE_ANALYSIS.categories.map((category, i) => (
              <div key={i} className="bg-white rounded-lg border border-purple-200 p-3 sm:p-4">
                <h4 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                  {category.icon === 'badge' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {category.icon === 'users' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {category.icon === 'layers' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {category.icon === 'chart' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {category.title}
                </h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-1.5">
                      <span className="text-purple-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-purple-100 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-purple-900 mb-1 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why These Weren't Included
            </h4>
            <p className="text-xs text-purple-800">
              {FUTURE_ANALYSIS.dataLimitation}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-indigo-900 mb-2">About This Research</h3>
        <p className="text-xs sm:text-sm text-indigo-800 mb-4">
          This analysis documents instances where characters in Law & Order: SVU are falsely
          accused, wrongly suspected, or publicly exposed as perpetrators of crimes they did not
          commit. The data tracks the origins of accusations, police conduct during investigations,
          channels of public exposure, and ultimate consequences for those harmed.
        </p>
        <div className="text-xs sm:text-sm text-indigo-700 space-y-2">
          <p><strong>Key Research Question:</strong> How often does SVU portray innocent people being harmed by false accusations, and what are the patterns in terms of severity, exposure channels, and outcomes?</p>
          <p><strong>Processing:</strong> All 576 episode transcripts were analyzed using Claude (Anthropic) with a standardized tagging methodology to ensure consistent categorization.</p>
        </div>
      </div>
    </div>
  )
}
