/**
 * Analysis Page (/analysis)
 *
 * Interactive data exploration with multiple chart sections:
 *
 * 1. Police Conduct Analysis
 *    - Threat types distribution
 *    - Apology outcomes
 *    - Threats vs apologies correlation
 *
 * 2. Accusation Origin Analysis
 *    - How people became suspects
 *    - Who exposed them
 *    - Origin vs severity correlation
 *
 * 3. Consequences Analysis
 *    - Exposure channels
 *    - Consequence categories
 *
 * 4. Interactive Correlation Tool
 *    - Select any X and Y variable from dropdowns
 *    - Dynamic stacked bar chart updates
 *    - Suggested correlation buttons for quick exploration
 */

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { usePersons } from '../hooks/useData'
import ChartCard from '../components/ChartCard'
import CorrelationChart from '../components/CorrelationChart'
import {
  CORRELATION_VARIABLES,
  type CorrelationVariable,
} from '../utils/correlations'
import { getSeverityColor } from '../utils/formatters'

export default function Analysis() {
  const persons = usePersons()
  const [xVariable, setXVariable] = useState<CorrelationVariable>('police_conduct_threat')
  const [yVariable, setYVariable] = useState<CorrelationVariable>('severity')

  const threatData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      counts[threat] = (counts[threat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const apologyData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const apology = p.police_apology || 'none'
      counts[apology] = (counts[apology] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const threatVsApologyData = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      const apology = p.police_apology || 'none'
      if (!matrix[threat]) matrix[threat] = {}
      matrix[threat][apology] = (matrix[threat][apology] || 0) + 1
    })
    return Object.entries(matrix).map(([threat, apologies]) => ({
      threat,
      none: apologies['none'] || 0,
      partial: apologies['partial'] || 0,
      formal: apologies['formal'] || 0,
    }))
  }, [persons])

  const originData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const origin = p.accusation_origin || 'unknown'
      counts[origin] = (counts[origin] || 0) + 1
    })
    return Object.entries(counts)
      .map(([origin, count]) => ({ origin, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const exposureWhoData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const who = p.exposure_who_told || 'unknown'
      counts[who] = (counts[who] || 0) + 1
    })
    return Object.entries(counts)
      .map(([who, count]) => ({ who, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const originSeverityData = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {}
    persons.forEach(p => {
      const origin = p.accusation_origin || 'unknown'
      const sev = p.consequence_severity || 'unknown'
      if (!matrix[origin]) matrix[origin] = {}
      matrix[origin][sev] = (matrix[origin][sev] || 0) + 1
    })
    return Object.entries(matrix).map(([origin, severities]) => ({
      origin,
      '1': severities['1'] || 0,
      '2': severities['2'] || 0,
      '3': severities['3'] || 0,
      '4': severities['4'] || 0,
    }))
  }, [persons])

  const exposureChannelData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const channel = p.exposure_channel || 'unknown'
      counts[channel] = (counts[channel] || 0) + 1
    })
    return Object.entries(counts)
      .map(([channel, count]) => ({ channel, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const consequenceCategoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const cat = p.consequence_category || 'unknown'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [persons])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analysis</h1>
        <p className="text-slate-600 mt-2">
          Explore correlations and patterns in the false accusation data.
        </p>
      </div>

      {/* Police Conduct Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Police Conduct Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Threat Types" subtitle="How did police conduct themselves?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Apology Outcomes" subtitle="Did police apologize?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apologyData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={55} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Threats vs Apologies"
          subtitle="Did threatening behavior lead to more or fewer apologies?"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={threatVsApologyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="threat" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="none" stackId="a" fill="#ef4444" name="No Apology" />
              <Bar dataKey="partial" stackId="a" fill="#eab308" name="Partial Apology" />
              <Bar dataKey="formal" stackId="a" fill="#22c55e" name="Formal Apology" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Accusation Origin Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Accusation Origin Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartCard title="How People Became Suspects" subtitle="Origin of accusations">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="origin" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Who Exposed Them" subtitle="Source of public exposure">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureWhoData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="who" type="category" tick={{ fontSize: 11 }} width={75} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Accusation Origin vs Severity"
          subtitle="Which accusation sources led to worse outcomes?"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={originSeverityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="origin" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="1" stackId="a" fill={getSeverityColor('1')} name="Severity 1" />
              <Bar dataKey="2" stackId="a" fill={getSeverityColor('2')} name="Severity 2" />
              <Bar dataKey="3" stackId="a" fill={getSeverityColor('3')} name="Severity 3" />
              <Bar dataKey="4" stackId="a" fill={getSeverityColor('4')} name="Severity 4" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Consequences Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Consequences Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Exposure Channels" subtitle="How were accusations made public?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureChannelData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} width={75} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Consequence Categories" subtitle="Types of harm experienced">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consequenceCategoryData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={75} />
                <Tooltip />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Interactive Correlation Tool */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Interactive Correlation Tool
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                X-Axis Variable
              </label>
              <select
                value={xVariable}
                onChange={e => setXVariable(e.target.value as CorrelationVariable)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CORRELATION_VARIABLES.map(v => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Y-Axis Variable (Stacked)
              </label>
              <select
                value={yVariable}
                onChange={e => setYVariable(e.target.value as CorrelationVariable)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CORRELATION_VARIABLES.map(v => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-96">
            <CorrelationChart persons={persons} xVariable={xVariable} yVariable={yVariable} />
          </div>
        </div>
      </section>

      {/* Suggested Correlations */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          Suggested Correlations to Explore
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { x: 'police_conduct_threat', y: 'police_apology', insight: 'Did threats lead to more/fewer apologies?' },
            { x: 'accusation_origin', y: 'severity', insight: 'Which accusation sources led to worse outcomes?' },
            { x: 'exposure_channel', y: 'severity', insight: 'Which exposure types caused most harm?' },
            { x: 'accused_of', y: 'police_conduct_threat', insight: 'Were certain crime types met with more threats?' },
            { x: 'role_in_plot', y: 'severity', insight: 'Did initial suspects fare worse than red herrings?' },
            { x: 'season', y: 'severity', insight: 'Has severity changed over the show\'s run?' },
          ].map(({ x, y, insight }) => (
            <button
              key={`${x}-${y}`}
              onClick={() => {
                setXVariable(x as CorrelationVariable)
                setYVariable(y as CorrelationVariable)
                window.scrollTo({ top: document.querySelector('.h-96')?.getBoundingClientRect().top ?? 0, behavior: 'smooth' })
              }}
              className="text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <p className="text-sm font-medium text-slate-800">{insight}</p>
              <p className="text-xs text-slate-500 mt-1">
                {CORRELATION_VARIABLES.find(v => v.value === x)?.label} vs{' '}
                {CORRELATION_VARIABLES.find(v => v.value === y)?.label}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
