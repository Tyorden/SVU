/**
 * Insights Page (/insights)
 *
 * Consolidated view of all key data insights and findings.
 * Includes exportable summary of statistics, correlations, and notable patterns.
 */

import { useMemo, useState } from 'react'
import { usePersons, useStats, useEpisodes } from '../hooks/useData'
import { formatSeverity, formatRole, formatThreatType, formatAccusationOrigin, formatAccusedOf } from '../utils/formatters'

interface InsightData {
  category: string
  title: string
  value: string | number
  detail?: string
}

export default function Insights() {
  const persons = usePersons()
  const episodes = useEpisodes()
  const stats = useStats()
  const [copied, setCopied] = useState(false)

  // Calculate all insights
  const insights = useMemo(() => {
    const data: InsightData[] = []

    // === OVERVIEW STATS ===
    data.push({
      category: 'Overview',
      title: 'Total Episodes Analyzed',
      value: stats.totalEpisodes,
    })
    data.push({
      category: 'Overview',
      title: 'Total Persons Harmed',
      value: stats.totalPersons,
    })
    data.push({
      category: 'Overview',
      title: 'Episodes with False Suspects',
      value: `${stats.falseSuspectRate}%`,
      detail: `${stats.falseSuspectEpisodes} of ${stats.totalEpisodes} episodes`,
    })
    data.push({
      category: 'Overview',
      title: 'Episodes with Public Exposure',
      value: `${stats.publicExposureRate}%`,
      detail: `${stats.publicExposureEpisodes} of ${stats.totalEpisodes} episodes`,
    })

    // === SEVERITY DISTRIBUTION ===
    const severityCounts: Record<string, number> = {}
    persons.forEach(p => {
      const sev = p.consequence_severity || 'unknown'
      severityCounts[sev] = (severityCounts[sev] || 0) + 1
    })
    const totalWithSeverity = persons.filter(p => ['1', '2', '3', '4'].includes(p.consequence_severity)).length

    for (const level of ['1', '2', '3', '4']) {
      const count = severityCounts[level] || 0
      const pct = ((count / totalWithSeverity) * 100).toFixed(1)
      data.push({
        category: 'Severity Distribution',
        title: `${formatSeverity(level)} (Level ${level})`,
        value: `${pct}%`,
        detail: `${count} persons`,
      })
    }

    // High severity percentage
    const highSeverity = (severityCounts['3'] || 0) + (severityCounts['4'] || 0)
    data.push({
      category: 'Severity Distribution',
      title: 'High Severity Rate (Levels 3-4)',
      value: `${((highSeverity / totalWithSeverity) * 100).toFixed(1)}%`,
      detail: `${highSeverity} persons faced material sanctions or life-altering harm`,
    })

    // === SEVERITY BY ROLE ===
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
    const roleAvgs = Object.entries(roleData)
      .map(([role, d]) => ({ role, avg: d.sum / d.total, count: d.total }))
      .sort((a, b) => b.avg - a.avg)

    roleAvgs.forEach(r => {
      data.push({
        category: 'Severity by Role',
        title: formatRole(r.role),
        value: r.avg.toFixed(2),
        detail: `${r.count} persons, average severity`,
      })
    })

    // === SEVERITY BY ACCUSATION ORIGIN ===
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
    const originAvgs = Object.entries(originData)
      .filter(([_, d]) => d.total >= 5)
      .map(([origin, d]) => ({ origin, avg: d.sum / d.total, count: d.total }))
      .sort((a, b) => b.avg - a.avg)

    originAvgs.forEach(o => {
      data.push({
        category: 'Severity by Accusation Origin',
        title: formatAccusationOrigin(o.origin),
        value: o.avg.toFixed(2),
        detail: `${o.count} persons, average severity`,
      })
    })

    // === POLICE CONDUCT ===
    const threatCounts: Record<string, number> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      threatCounts[threat] = (threatCounts[threat] || 0) + 1
    })
    const totalPersons = persons.length

    Object.entries(threatCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([threat, count]) => {
        data.push({
          category: 'Police Conduct',
          title: formatThreatType(threat),
          value: `${((count / totalPersons) * 100).toFixed(1)}%`,
          detail: `${count} persons experienced this`,
        })
      })

    // === APOLOGY RATES ===
    const apologyByThreat: Record<string, { total: number; gotApology: number }> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      const apology = p.police_apology || 'none'
      if (!apologyByThreat[threat]) apologyByThreat[threat] = { total: 0, gotApology: 0 }
      apologyByThreat[threat].total++
      if (apology === 'partial' || apology === 'formal') {
        apologyByThreat[threat].gotApology++
      }
    })

    Object.entries(apologyByThreat)
      .map(([threat, d]) => ({ threat, rate: (d.gotApology / d.total) * 100, total: d.total }))
      .sort((a, b) => b.rate - a.rate)
      .forEach(a => {
        data.push({
          category: 'Apology Rates by Conduct',
          title: formatThreatType(a.threat),
          value: `${a.rate.toFixed(1)}%`,
          detail: `${a.total} persons in this category`,
        })
      })

    // === ACCUSATION TYPES ===
    const accusedOfCounts: Record<string, number> = {}
    persons.forEach(p => {
      const accused = p.accused_of || 'unknown'
      accusedOfCounts[accused] = (accusedOfCounts[accused] || 0) + 1
    })

    Object.entries(accusedOfCounts)
      .filter(([key]) => key !== 'unknown')
      .sort((a, b) => b[1] - a[1])
      .forEach(([accused, count]) => {
        data.push({
          category: 'Accusation Types',
          title: formatAccusedOf(accused),
          value: `${((count / totalPersons) * 100).toFixed(1)}%`,
          detail: `${count} persons`,
        })
      })

    // === SEVERITY TREND ===
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

    // Early vs late seasons
    let earlySum = 0, earlyCount = 0, lateSum = 0, lateCount = 0
    Object.entries(seasonData).forEach(([s, d]) => {
      const season = parseInt(s)
      if (season <= 9) {
        earlySum += d.sum
        earlyCount += d.total
      } else if (season >= 19) {
        lateSum += d.sum
        lateCount += d.total
      }
    })

    const earlyAvg = earlyCount > 0 ? earlySum / earlyCount : 0
    const lateAvg = lateCount > 0 ? lateSum / lateCount : 0
    const pctIncrease = ((lateAvg - earlyAvg) / earlyAvg * 100).toFixed(1)

    data.push({
      category: 'Severity Trend',
      title: 'Early Seasons (1-9) Average',
      value: earlyAvg.toFixed(2),
      detail: `${earlyCount} persons`,
    })
    data.push({
      category: 'Severity Trend',
      title: 'Late Seasons (19-27) Average',
      value: lateAvg.toFixed(2),
      detail: `${lateCount} persons`,
    })
    data.push({
      category: 'Severity Trend',
      title: 'Severity Increase Over Time',
      value: `${pctIncrease}%`,
      detail: 'Comparing early to late seasons',
    })

    // === PHYSICAL HARM ===
    let murdered = 0, suicide = 0, assaulted = 0
    persons.forEach(p => {
      const detail = (p.consequence_detail || '').toLowerCase()
      const tags = (p.tags || '').toLowerCase()
      if (detail.includes('murder') || tags.includes('murdered')) murdered++
      else if (detail.includes('suicide') || tags.includes('suicide')) suicide++
      else if (detail.includes('assault') || tags.includes('assault')) assaulted++
    })

    data.push({
      category: 'Physical Harm',
      title: 'Murdered',
      value: murdered,
      detail: 'Killed as result of false accusation',
    })
    data.push({
      category: 'Physical Harm',
      title: 'Suicide',
      value: suicide,
      detail: 'Died by suicide after accusation',
    })
    data.push({
      category: 'Physical Harm',
      title: 'Assaulted',
      value: assaulted,
      detail: 'Physically attacked',
    })

    // === KEY CORRELATIONS ===
    // Initial suspect vs red herring
    const initialSuspectAvg = roleData['initial_suspect']
      ? (roleData['initial_suspect'].sum / roleData['initial_suspect'].total).toFixed(2)
      : 'N/A'
    const redHerringAvg = roleData['red_herring']
      ? (roleData['red_herring'].sum / roleData['red_herring'].total).toFixed(2)
      : 'N/A'

    data.push({
      category: 'Key Correlations',
      title: 'Initial Suspects vs Red Herrings',
      value: `${initialSuspectAvg} vs ${redHerringAvg}`,
      detail: 'Average severity comparison - initial suspects fare worse',
    })

    // Fabrication vs squad inference
    const fabricationAvg = originData['fabrication']
      ? (originData['fabrication'].sum / originData['fabrication'].total).toFixed(2)
      : 'N/A'
    const squadInferenceAvg = originData['squad_inference']
      ? (originData['squad_inference'].sum / originData['squad_inference'].total).toFixed(2)
      : 'N/A'

    data.push({
      category: 'Key Correlations',
      title: 'Fabricated vs Squad Inference',
      value: `${fabricationAvg} vs ${squadInferenceAvg}`,
      detail: 'Deliberate lies cause more harm than detective mistakes',
    })

    // Verbal threats lowest apology rate
    const verbalThreatApology = apologyByThreat['verbal_threat']
    if (verbalThreatApology) {
      data.push({
        category: 'Key Correlations',
        title: 'Verbal Threats → Apologies',
        value: `${((verbalThreatApology.gotApology / verbalThreatApology.total) * 100).toFixed(1)}%`,
        detail: 'Lowest apology rate of all conduct types',
      })
    }

    return data
  }, [persons, episodes, stats])

  // Group by category
  const groupedInsights = useMemo(() => {
    const groups: Record<string, InsightData[]> = {}
    insights.forEach(insight => {
      if (!groups[insight.category]) groups[insight.category] = []
      groups[insight.category].push(insight)
    })
    return groups
  }, [insights])

  // Generate export text
  const exportText = useMemo(() => {
    let text = `SVU FALSE ACCUSATION ANALYSIS - KEY INSIGHTS
Generated: ${new Date().toLocaleDateString()}
${'='.repeat(50)}

`
    Object.entries(groupedInsights).forEach(([category, items]) => {
      text += `\n${category.toUpperCase()}\n${'-'.repeat(category.length)}\n`
      items.forEach(item => {
        text += `${item.title}: ${item.value}`
        if (item.detail) text += ` (${item.detail})`
        text += '\n'
      })
    })

    text += `\n${'='.repeat(50)}
Data Source: 576 SVU episodes (Seasons 1-27), 541 persons harmed
Analysis: https://github.com/Tyorden/SVU
`
    return text
  }, [groupedInsights])

  // Generate JSON export
  const exportJSON = useMemo(() => {
    return JSON.stringify({
      generated: new Date().toISOString(),
      summary: {
        totalEpisodes: stats.totalEpisodes,
        totalPersonsHarmed: stats.totalPersons,
        falseSuspectRate: stats.falseSuspectRate,
        publicExposureRate: stats.publicExposureRate,
      },
      insights: groupedInsights,
    }, null, 2)
  }, [groupedInsights, stats])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Key Insights</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Consolidated findings from the SVU false accusation analysis. Export as text or JSON.
        </p>
      </div>

      {/* Export buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <h2 className="font-semibold text-slate-800 mb-3">Export Data</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => copyToClipboard(exportText)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            {copied ? 'Copied!' : 'Copy as Text'}
          </button>
          <button
            onClick={() => downloadFile(exportText, 'svu-insights.txt', 'text/plain')}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            Download .txt
          </button>
          <button
            onClick={() => downloadFile(exportJSON, 'svu-insights.json', 'application/json')}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            Download .json
          </button>
          <button
            onClick={() => {
              const csvRows = ['Category,Title,Value,Detail']
              insights.forEach(i => {
                csvRows.push(`"${i.category}","${i.title}","${i.value}","${i.detail || ''}"`)
              })
              downloadFile(csvRows.join('\n'), 'svu-insights.csv', 'text/csv')
            }}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            Download .csv
          </button>
        </div>
      </div>

      {/* Insights grid */}
      <div className="space-y-6">
        {Object.entries(groupedInsights).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">{category}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 text-sm">{item.title}</div>
                    {item.detail && (
                      <div className="text-xs text-slate-500 mt-0.5">{item.detail}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Raw text preview */}
      <div className="mt-8">
        <details className="bg-white rounded-xl shadow-sm border border-slate-200">
          <summary className="p-4 cursor-pointer font-semibold text-slate-800 hover:bg-slate-50">
            Preview Export Text
          </summary>
          <div className="p-4 pt-0 border-t border-slate-100">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg overflow-x-auto">
              {exportText}
            </pre>
          </div>
        </details>
      </div>
    </div>
  )
}
