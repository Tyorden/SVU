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
 * - Key findings summary
 * - About section explaining the research
 */

import { useMemo } from 'react'
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
import { getSeverityColor, formatSeverity } from '../utils/formatters'

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
        name: `${severity}: ${formatSeverity(severity)}`,
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

  const accusationTypeData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const type = p.accused_of || 'unknown'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
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
          subtitle="Seasons 1-27"
          color="blue"
        />
        <StatCard
          title="Persons Harmed"
          value={stats.totalPersons}
          subtitle="Falsely accused individuals"
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
            <BarChart data={accusationTypeData} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={75} />
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
                <li key={s.severity}>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getSeverityColor(s.severity) }}
                  />
                  {formatSeverity(s.severity)}: {s.value} cases ({((s.value / stats.totalPersons) * 100).toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">About This Research</h3>
        <p className="text-sm text-indigo-800">
          This analysis documents instances where characters in Law & Order: SVU are falsely
          accused, wrongly suspected, or publicly exposed as perpetrators of crimes they did not
          commit. The data tracks the origins of accusations, police conduct during investigations,
          channels of public exposure, and ultimate consequences for those harmed. The goal is to
          understand patterns in how false accusations are portrayed in this influential television
          series.
        </p>
      </div>
    </div>
  )
}
