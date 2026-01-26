/**
 * Analysis Page (/analysis)
 *
 * Interactive data exploration with multiple chart sections:
 *
 * 1. Key Insights Section (new)
 *    - Severity trend over time
 *    - Role in plot comparison
 *    - Physical harm breakdown
 *
 * 2. Police Conduct Analysis
 *    - Threat types distribution
 *    - Apology outcomes
 *    - Threats vs apologies correlation
 *
 * 3. Accusation Origin Analysis
 *    - How people became suspects
 *    - Who exposed them
 *    - Origin vs severity correlation
 *
 * 4. Consequences Analysis
 *    - Exposure channels
 *    - Consequence categories
 *
 * 5. Interactive Correlation Tool
 *    - Clickable questions that auto-set variables
 *    - Select any X and Y variable from dropdowns
 *    - Dynamic stacked bar chart updates
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
  LineChart,
  Line,
} from 'recharts'
import { usePersons } from '../hooks/useData'
import ChartCard from '../components/ChartCard'
import CorrelationChart from '../components/CorrelationChart'
import {
  CORRELATION_VARIABLES,
  type CorrelationVariable,
} from '../utils/correlations'
import {
  getSeverityColor,
  formatThreatType,
  formatApology,
  formatAccusationOrigin,
  formatExposureWho,
  formatExposureChannel,
  formatConsequenceCategory,
  formatSeverity,
  formatRole,
} from '../utils/formatters'
import {
  POLICE_CONDUCT_THREAT,
  POLICE_APOLOGY,
  ACCUSATION_ORIGIN,
  EXPOSURE_WHO_TOLD,
  EXPOSURE_CHANNEL,
  CONSEQUENCE_SEVERITY,
} from '../utils/definitions'

export default function Analysis() {
  const persons = usePersons()
  const [xVariable, setXVariable] = useState<CorrelationVariable>('police_conduct_threat')
  const [yVariable, setYVariable] = useState<CorrelationVariable>('severity')

  // === NEW: Key Insights Data ===

  // Average severity by season (trend line)
  const severityBySeason = useMemo(() => {
    const seasonData: Record<number, { total: number; sum: number }> = {}
    persons.forEach(p => {
      const season = parseInt(p.season)
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(season) && !isNaN(sev)) {
        if (!seasonData[season]) seasonData[season] = { total: 0, sum: 0 }
        seasonData[season].total++
        seasonData[season].sum += sev
      }
    })
    return Object.entries(seasonData)
      .map(([season, data]) => ({
        season: `S${season}`,
        avgSeverity: parseFloat((data.sum / data.total).toFixed(2)),
        count: data.total,
      }))
      .sort((a, b) => parseInt(a.season.slice(1)) - parseInt(b.season.slice(1)))
  }, [persons])

  // Severity by role in plot
  const severityByRole = useMemo(() => {
    const roleData: Record<string, { total: number; sum: number }> = {}
    persons.forEach(p => {
      const role = p.role_in_plot || 'unknown'
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(sev)) {
        if (!roleData[role]) roleData[role] = { total: 0, sum: 0 }
        roleData[role].total++
        roleData[role].sum += sev
      }
    })
    return Object.entries(roleData)
      .map(([role, data]) => ({
        role: formatRole(role),
        avgSeverity: parseFloat((data.sum / data.total).toFixed(2)),
        count: data.total,
      }))
      .sort((a, b) => b.avgSeverity - a.avgSeverity)
  }, [persons])

  // Apology rate by threat type
  const apologyByThreat = useMemo(() => {
    const data: Record<string, { total: number; gotApology: number }> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      const apology = p.police_apology || 'none'
      if (!data[threat]) data[threat] = { total: 0, gotApology: 0 }
      data[threat].total++
      if (apology === 'partial' || apology === 'formal') {
        data[threat].gotApology++
      }
    })
    return Object.entries(data)
      .map(([threat, d]) => ({
        threat: formatThreatType(threat),
        apologyRate: parseFloat(((d.gotApology / d.total) * 100).toFixed(1)),
        count: d.total,
      }))
      .sort((a, b) => b.apologyRate - a.apologyRate)
  }, [persons])

  // Physical harm breakdown
  const physicalHarmData = useMemo(() => {
    const counts: Record<string, number> = {
      'Murdered': 0,
      'Suicide': 0,
      'Assaulted': 0,
      'Vigilante Attack': 0,
      'Other Physical': 0,
    }
    persons.forEach(p => {
      const detail = (p.consequence_detail || '').toLowerCase()
      const tags = (p.tags || '').toLowerCase()
      if (detail.includes('murder') || tags.includes('murdered')) counts['Murdered']++
      else if (detail.includes('suicide') || tags.includes('suicide')) counts['Suicide']++
      else if (detail.includes('vigilante')) counts['Vigilante Attack']++
      else if (detail.includes('assault') || tags.includes('assault')) counts['Assaulted']++
      else if (p.consequence_category === 'physical' || tags.includes('ruined_physically')) counts['Other Physical']++
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // Severity by accusation origin
  const severityByOrigin = useMemo(() => {
    const originData: Record<string, { total: number; sum: number }> = {}
    persons.forEach(p => {
      const origin = p.accusation_origin || 'unknown'
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(sev) && origin !== 'unknown') {
        if (!originData[origin]) originData[origin] = { total: 0, sum: 0 }
        originData[origin].total++
        originData[origin].sum += sev
      }
    })
    return Object.entries(originData)
      .filter(([_, data]) => data.total >= 5) // Only show origins with 5+ cases
      .map(([origin, data]) => ({
        origin: formatAccusationOrigin(origin),
        avgSeverity: parseFloat((data.sum / data.total).toFixed(2)),
        count: data.total,
      }))
      .sort((a, b) => b.avgSeverity - a.avgSeverity)
  }, [persons])

  // Severity by who exposed
  const severityByWhoExposed = useMemo(() => {
    const whoData: Record<string, { total: number; sum: number }> = {}
    persons.forEach(p => {
      const who = p.exposure_who_told || 'unknown'
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(sev) && who !== 'unknown') {
        if (!whoData[who]) whoData[who] = { total: 0, sum: 0 }
        whoData[who].total++
        whoData[who].sum += sev
      }
    })
    return Object.entries(whoData)
      .map(([who, data]) => ({
        who: formatExposureWho(who),
        avgSeverity: parseFloat((data.sum / data.total).toFixed(2)),
        count: data.total,
      }))
      .sort((a, b) => b.avgSeverity - a.avgSeverity)
  }, [persons])

  // Most common tags
  const topTags = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    persons.forEach(p => {
      if (p.tags) {
        p.tags.split(';').forEach(tag => {
          const t = tag.trim()
          if (t) tagCounts[t] = (tagCounts[t] || 0) + 1
        })
      }
    })
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({
        tag: tag.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [persons])

  // === Existing chart data with formatted labels ===

  const threatData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      counts[threat] = (counts[threat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({ type: formatThreatType(type), count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const apologyData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const apology = p.police_apology || 'none'
      counts[apology] = (counts[apology] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({ type: formatApology(type), count }))
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
      threat: formatThreatType(threat),
      'No Apology': apologies['none'] || 0,
      'Partial Apology': apologies['partial'] || 0,
      'Formal Apology': apologies['formal'] || 0,
    }))
  }, [persons])

  const originData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const origin = p.accusation_origin || 'unknown'
      counts[origin] = (counts[origin] || 0) + 1
    })
    return Object.entries(counts)
      .map(([origin, count]) => ({ origin: formatAccusationOrigin(origin), count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const exposureWhoData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const who = p.exposure_who_told || 'unknown'
      counts[who] = (counts[who] || 0) + 1
    })
    return Object.entries(counts)
      .map(([who, count]) => ({ who: formatExposureWho(who), count }))
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
      origin: formatAccusationOrigin(origin),
      [formatSeverity('1')]: severities['1'] || 0,
      [formatSeverity('2')]: severities['2'] || 0,
      [formatSeverity('3')]: severities['3'] || 0,
      [formatSeverity('4')]: severities['4'] || 0,
    }))
  }, [persons])

  const exposureChannelData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const channel = p.exposure_channel || 'unknown'
      counts[channel] = (counts[channel] || 0) + 1
    })
    return Object.entries(counts)
      .map(([channel, count]) => ({ channel: formatExposureChannel(channel), count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  const consequenceCategoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const cat = p.consequence_category || 'unknown'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([category, count]) => ({ category: formatConsequenceCategory(category), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [persons])

  // Questions for the correlation tool
  const correlationQuestions = [
    {
      question: 'Do verbal threats lead to fewer apologies?',
      x: 'police_conduct_threat' as CorrelationVariable,
      y: 'police_apology' as CorrelationVariable,
      insight: 'Verbal threats have the LOWEST apology rate at 2.7%',
    },
    {
      question: 'Are fabricated accusations more severe?',
      x: 'accusation_origin' as CorrelationVariable,
      y: 'severity' as CorrelationVariable,
      insight: 'Fabricated claims average 3.24 severity vs 2.51 for squad inference',
    },
    {
      question: 'Do initial suspects fare worse than red herrings?',
      x: 'role_in_plot' as CorrelationVariable,
      y: 'severity' as CorrelationVariable,
      insight: 'Initial suspects average 2.98 severity vs 2.44 for red herrings',
    },
    {
      question: 'When victims expose, is it more severe?',
      x: 'exposure_who_told' as CorrelationVariable,
      y: 'severity' as CorrelationVariable,
      insight: 'Victim exposure averages 3.31 severity vs 2.67 for squad',
    },
    {
      question: 'Has severity increased over time?',
      x: 'season' as CorrelationVariable,
      y: 'severity' as CorrelationVariable,
      insight: 'Average severity rose from 2.61 (S1-9) to 2.93 (S19-27)',
    },
    {
      question: 'Which crime types get media exposure?',
      x: 'accused_of' as CorrelationVariable,
      y: 'exposure_channel' as CorrelationVariable,
      insight: 'Child-related accusations have higher media exposure rates',
    },
    {
      question: 'Do certain crime types get more police threats?',
      x: 'accused_of' as CorrelationVariable,
      y: 'police_conduct_threat' as CorrelationVariable,
      insight: 'Explore which accusation types face more aggressive police conduct',
    },
    {
      question: 'How does innocence status affect outcomes?',
      x: 'innocence_status' as CorrelationVariable,
      y: 'severity' as CorrelationVariable,
      insight: 'Compare outcomes for proven innocent vs strongly implied',
    },
  ]

  const handleQuestionClick = (q: typeof correlationQuestions[0]) => {
    setXVariable(q.x)
    setYVariable(q.y)
    // Scroll to correlation tool
    document.getElementById('correlation-tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Analysis</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Explore correlations and patterns in the false accusation data.
        </p>
      </div>

      {/* Terminology Reference */}
      <section className="mb-6 sm:mb-8">
        <details className="bg-white rounded-xl shadow-sm border border-slate-200">
          <summary className="p-3 sm:p-4 cursor-pointer font-semibold text-slate-800 hover:bg-slate-50 text-sm sm:text-base">
            Terminology Reference (tap to expand)
          </summary>
          <div className="p-3 sm:p-4 pt-0 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Police Conduct</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(POLICE_CONDUCT_THREAT).map(([key, val]) => (
                    <li key={key}><span className="font-medium">{val.label}:</span> {val.description}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Apology Types</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(POLICE_APOLOGY).map(([key, val]) => (
                    <li key={key}><span className="font-medium">{val.label}:</span> {val.description}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Accusation Origins</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(ACCUSATION_ORIGIN).map(([key, val]) => (
                    <li key={key}><span className="font-medium">{val.label}:</span> {val.description}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Exposure Channels</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(EXPOSURE_CHANNEL).slice(0, 6).map(([key, val]) => (
                    <li key={key}><span className="font-medium">{val.label}:</span> {val.description}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Severity Levels</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(CONSEQUENCE_SEVERITY).map(([key, val]) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-0.5 sm:mt-1 flex-shrink-0" style={{ backgroundColor: val.color }} />
                      <span><span className="font-medium">{val.label}:</span> {val.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Who Exposed</h4>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(EXPOSURE_WHO_TOLD).map(([key, val]) => (
                    <li key={key}><span className="font-medium">{val.label}:</span> {val.description}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* KEY INSIGHTS SECTION - NEW */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Key Insights
        </h2>

        {/* Severity Trend Over Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <ChartCard
            title="Severity Trend Over Time"
            subtitle="Average consequence severity has increased across 27 seasons"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={severityBySeason} margin={{ left: 0, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="season" tick={{ fontSize: 9 }} />
                <YAxis domain={[1, 4]} tick={{ fontSize: 11 }} tickCount={4} />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), 'Avg Severity']}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="avgSeverity"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Severity by Role in Plot"
            subtitle="Initial suspects face worse outcomes than red herrings"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityByRole} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} avg`, 'Severity']}
                />
                <Bar dataKey="avgSeverity" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Apology Rate by Police Conduct"
            subtitle="Ironically, verbal threats have the LOWEST apology rate"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apologyByThreat} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 20]} tick={{ fontSize: 11 }} unit="%" />
                <YAxis dataKey="threat" type="category" tick={{ fontSize: 11 }} width={115} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Apology Rate']}
                />
                <Bar dataKey="apologyRate" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Severity by Who Exposed"
            subtitle="When victims expose the accused, outcomes are worse"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityByWhoExposed} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="who" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} avg`, 'Severity']}
                />
                <Bar dataKey="avgSeverity" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard
            title="Severity by Accusation Origin"
            subtitle="Fabricated claims and coerced interviews lead to worst outcomes"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityByOrigin} layout="vertical" margin={{ left: 140 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="origin" type="category" tick={{ fontSize: 10 }} width={135} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} avg`, 'Severity']}
                />
                <Bar dataKey="avgSeverity" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Physical Harm Breakdown"
            subtitle="94 cases resulted in physical harm, including 14 murders and 6 suicides"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={physicalHarmData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Most Common Tags"
          subtitle="Patterns identified across 541 cases"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTags} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="tag" type="category" tick={{ fontSize: 10 }} width={135} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Police Conduct Section */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Police Conduct Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <ChartCard title="Threat Types" subtitle="How did police conduct themselves toward the accused?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={115} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Apology Outcomes" subtitle="Did police apologize after clearing the accused?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apologyData} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={75} />
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
              <XAxis dataKey="threat" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="No Apology" stackId="a" fill="#ef4444" />
              <Bar dataKey="Partial Apology" stackId="a" fill="#eab308" />
              <Bar dataKey="Formal Apology" stackId="a" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Accusation Origin Section */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Accusation Origin Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <ChartCard title="How People Became Suspects" subtitle="Source of the initial accusation">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originData} layout="vertical" margin={{ left: 140 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="origin" type="category" tick={{ fontSize: 11 }} width={135} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Who Exposed Them" subtitle="Who made the accusation public?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureWhoData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="who" type="category" tick={{ fontSize: 11 }} width={95} />
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
              <XAxis dataKey="origin" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={formatSeverity('1')} stackId="a" fill={getSeverityColor('1')} />
              <Bar dataKey={formatSeverity('2')} stackId="a" fill={getSeverityColor('2')} />
              <Bar dataKey={formatSeverity('3')} stackId="a" fill={getSeverityColor('3')} />
              <Bar dataKey={formatSeverity('4')} stackId="a" fill={getSeverityColor('4')} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Consequences Section */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Consequences Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ChartCard title="Exposure Channels" subtitle="How were accusations made public?">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureChannelData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} width={95} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Consequence Categories" subtitle="Primary domain of harm experienced">
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
      <section className="mb-8 sm:mb-12" id="correlation-tool">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Interactive Correlation Tool
        </h2>

        {/* Clickable Questions */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
            Tap a question to explore:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {correlationQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestionClick(q)}
                className="text-left p-2.5 sm:p-3 bg-white hover:bg-indigo-50 active:bg-indigo-100 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors group"
              >
                <p className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-indigo-700">
                  {q.question}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 hidden sm:block">
                  {q.insight}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                X-Axis Variable
              </label>
              <select
                value={xVariable}
                onChange={e => setXVariable(e.target.value as CorrelationVariable)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CORRELATION_VARIABLES.map(v => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                Y-Axis Variable (Stacked)
              </label>
              <select
                value={yVariable}
                onChange={e => setYVariable(e.target.value as CorrelationVariable)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CORRELATION_VARIABLES.map(v => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-64 sm:h-80 lg:h-96">
            <CorrelationChart persons={persons} xVariable={xVariable} yVariable={yVariable} />
          </div>
        </div>
      </section>
    </div>
  )
}
