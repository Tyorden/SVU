/**
 * Law & Order Visualizations Page (/lo/visualizations)
 *
 * Advanced data visualizations for deeper analysis of L&O false accusation data.
 * Includes cascade charts, heatmaps, and comparison views.
 *
 * Key differences from SVU Visualizations:
 * - 314 episodes, 429 persons harmed
 * - Murder dominates at ~72% of accusations
 * - Partial season coverage (1-9, 11, 16-17, 19-23) - built dynamically from data
 * - 72.3% false suspect rate
 */

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
} from 'recharts'
import { useLoPersons } from '../../hooks/useLoData'
import { getSeverityColor, formatAccusedOf } from '../../utils/formatters'
import ChartCard from '../../components/ChartCard'

export default function LoVisualizations() {
  const persons = useLoPersons()

  // === DYNAMIC SEASON LIST ===
  // L&O has partial season coverage - build from actual data instead of hardcoding
  const seasons = useMemo(() => {
    const seasonSet = new Set<number>()
    persons.forEach(p => {
      const s = parseInt(p.season)
      if (!isNaN(s)) seasonSet.add(s)
    })
    return Array.from(seasonSet).sort((a, b) => a - b)
  }, [persons])

  // === CASCADE CHART DATA ===
  // Cumulative persons harmed by season, stacked by severity
  const cascadeData = useMemo(() => {
    const seasonCounts: Record<number, Record<string, number>> = {}

    // Initialize only seasons present in the data
    seasons.forEach(s => {
      seasonCounts[s] = { '1': 0, '2': 0, '3': 0, '4': 0 }
    })

    // Count by season and severity
    persons.forEach(p => {
      const season = parseInt(p.season)
      const sev = p.consequence_severity
      if (!isNaN(season) && ['1', '2', '3', '4'].includes(sev) && seasonCounts[season]) {
        seasonCounts[season][sev]++
      }
    })

    // Build cumulative data
    let cumulative = { '1': 0, '2': 0, '3': 0, '4': 0 }
    return seasons.map(season => {
      const counts = seasonCounts[season]
      cumulative = {
        '1': cumulative['1'] + counts['1'],
        '2': cumulative['2'] + counts['2'],
        '3': cumulative['3'] + counts['3'],
        '4': cumulative['4'] + counts['4'],
      }
      return {
        season: `S${season}`,
        'Level 1 (Low)': cumulative['1'],
        'Level 2 (Public)': cumulative['2'],
        'Level 3 (Material)': cumulative['3'],
        'Level 4 (Life-Altering)': cumulative['4'],
        total: cumulative['1'] + cumulative['2'] + cumulative['3'] + cumulative['4'],
      }
    })
  }, [persons, seasons])

  // === HEATMAP DATA ===
  // Seasons x Accusation Types - dynamically built from data
  const heatmapData = useMemo(() => {
    const accusationTypes = [
      'murder', 'rape', 'conspiracy', 'kidnapping', 'assault',
      'manslaughter', 'attempted_murder', 'CSA', 'terrorism',
      'harassment', 'drug_trafficking', 'burglary', 'robbery',
      'perjury', 'other',
    ]
    const data: Array<{ season: string; [key: string]: string | number }> = []

    seasons.forEach(s => {
      const row: { season: string; [key: string]: string | number } = { season: `S${s}` }
      accusationTypes.forEach(type => {
        row[type] = persons.filter(p =>
          parseInt(p.season) === s && p.accused_of === type
        ).length
      })
      data.push(row)
    })
    return { data, types: accusationTypes }
  }, [persons, seasons])

  // Get max value for heatmap color scaling
  const heatmapMax = useMemo(() => {
    let max = 0
    heatmapData.data.forEach(row => {
      heatmapData.types.forEach(type => {
        const val = row[type] as number
        if (val > max) max = val
      })
    })
    return max
  }, [heatmapData])

  // === ACCUSATION TYPE TOTALS ===
  const accusationTotals = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const type = p.accused_of || 'unknown'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([key]) => key !== 'unknown')
      .map(([type, count]) => ({
        type: formatAccusedOf(type),
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // === SEVERITY PER SEASON (non-cumulative) ===
  const severityPerSeason = useMemo(() => {
    const seasonCounts: Record<number, Record<string, number>> = {}

    seasons.forEach(s => {
      seasonCounts[s] = { '1': 0, '2': 0, '3': 0, '4': 0 }
    })

    persons.forEach(p => {
      const season = parseInt(p.season)
      const sev = p.consequence_severity
      if (!isNaN(season) && ['1', '2', '3', '4'].includes(sev) && seasonCounts[season]) {
        seasonCounts[season][sev]++
      }
    })

    return seasons.map(season => ({
      season: `S${season}`,
      'Level 1': seasonCounts[season]['1'],
      'Level 2': seasonCounts[season]['2'],
      'Level 3': seasonCounts[season]['3'],
      'Level 4': seasonCounts[season]['4'],
    }))
  }, [persons, seasons])

  // Get heatmap cell color
  const getHeatmapColor = (value: number) => {
    if (value === 0) return '#f1f5f9'
    const intensity = Math.min(value / heatmapMax, 1)
    // Gradient from light red to dark red
    const r = 239
    const g = Math.round(68 + (1 - intensity) * 130)
    const b = Math.round(68 + (1 - intensity) * 130)
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Visualizations</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Advanced charts and visual analysis of the Law & Order false accusation data.
        </p>
      </div>

      {/* Cascade Chart */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          429 Lives: Cumulative False Accusations
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Watch how harm accumulates across {seasons.length} seasons of Law & Order, broken down by severity level.
          Note: coverage includes seasons {seasons.join(', ')} (not all seasons have been catalogued yet).
        </p>
        <ChartCard title="" subtitle="">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cascadeData} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="Level 4 (Life-Altering)"
                stackId="1"
                stroke={getSeverityColor('4')}
                fill={getSeverityColor('4')}
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Level 3 (Material)"
                stackId="1"
                stroke={getSeverityColor('3')}
                fill={getSeverityColor('3')}
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Level 2 (Public)"
                stackId="1"
                stroke={getSeverityColor('2')}
                fill={getSeverityColor('2')}
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="Level 1 (Low)"
                stackId="1"
                stroke={getSeverityColor('1')}
                fill={getSeverityColor('1')}
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Stacked Bar by Season */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          Severity Distribution by Season
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          How many persons were harmed at each severity level, per season.
          Murder-heavy Law & Order tends to produce higher severity outcomes.
        </p>
        <ChartCard title="" subtitle="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityPerSeason} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Level 4" stackId="a" fill={getSeverityColor('4')} />
              <Bar dataKey="Level 3" stackId="a" fill={getSeverityColor('3')} />
              <Bar dataKey="Level 2" stackId="a" fill={getSeverityColor('2')} />
              <Bar dataKey="Level 1" stackId="a" fill={getSeverityColor('1')} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Heatmap */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          Accusation Types by Season
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          What Law & Order characters get falsely accused of, across {seasons.length} catalogued seasons.
          Murder dominates the heatmap (~72% of all accusations). Darker colors indicate more cases.
        </p>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-1 font-medium text-slate-600">Season</th>
                {heatmapData.types.map(type => (
                  <th key={type} className="p-1 font-medium text-slate-600 text-center">
                    {formatAccusedOf(type)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.data.map(row => (
                <tr key={row.season}>
                  <td className="p-1 font-medium text-slate-700">{row.season}</td>
                  {heatmapData.types.map(type => {
                    const value = row[type] as number
                    return (
                      <td
                        key={type}
                        className="p-1 text-center"
                        style={{
                          backgroundColor: getHeatmapColor(value),
                          color: value > heatmapMax * 0.5 ? 'white' : '#1e293b',
                        }}
                      >
                        {value > 0 ? value : ''}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <span>Fewer cases</span>
            <div className="flex">
              {[0, 0.25, 0.5, 0.75, 1].map(i => (
                <div
                  key={i}
                  className="w-6 h-4"
                  style={{ backgroundColor: getHeatmapColor(i * heatmapMax) }}
                />
              ))}
            </div>
            <span>More cases</span>
          </div>
        </div>
      </section>

      {/* Accusation Types Total */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          Total by Accusation Type
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Unlike SVU where sexual crimes dominate, Law & Order is overwhelmingly about murder accusations.
        </p>
        <ChartCard title="" subtitle="" height="lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accusationTotals} layout="vertical" margin={{ left: 100, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={95} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                {accusationTotals.map((_, idx) => (
                  <Cell key={idx} fill={`hsl(${240 - idx * 8}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Fiction vs Reality */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4">
          Fiction vs. Reality
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          How Law & Order's portrayal of false suspicion compares to real-world wrongful conviction data.
        </p>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-4xl font-bold text-red-600 mb-2">72.3%</div>
              <div className="text-sm font-medium text-red-800">L&O Episodes with False Suspects</div>
              <div className="text-xs text-red-600 mt-2">227 of 314 episodes</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">2-5%</div>
              <div className="text-sm font-medium text-blue-800">Estimated Wrongful Conviction Rate (Research)</div>
              <div className="text-xs text-blue-600 mt-2">
                Innocence Project and academic studies estimate 2-5% of felony convictions are wrongful
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-sm text-amber-800">
              <strong>Note:</strong> Law & Order's procedural format means nearly every episode features an initial
              suspect who is cleared before the true perpetrator is found. This structural reliance on
              misdirection makes the false suspect rate even higher than SVU's (59.7%). While effective
              for drama, the repeated pattern of wrongful suspicion -- particularly in murder cases -- may
              normalize the idea that being falsely accused is routine in criminal investigations.
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Sources: Innocence Project (2023); Gross et al. (2014) "Rate of false conviction of criminal
            defendants who are sentenced to death", PNAS; National Registry of Exonerations
          </div>
        </div>
      </section>

      {/* Future Viz Ideas */}
      <section className="mb-8">
        <div className="bg-slate-100 rounded-xl p-4 sm:p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Future Visualization Ideas</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">*</span>
              <span><strong>SVU vs. L&O Comparison:</strong> Side-by-side charts showing how accusation patterns differ between the two shows</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">*</span>
              <span><strong>Prosecutorial Pipeline:</strong> Sankey diagram from Accusation Origin to Police Conduct to Prosecutorial Conduct to Outcome</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">*</span>
              <span><strong>Murder Dominance Map:</strong> Treemap showing the overwhelming proportion of murder accusations vs. all other crime types</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">*</span>
              <span><strong>Season Gap Analysis:</strong> Visualization highlighting the uncatalogued seasons (10, 12-15, 18) and projected data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">*</span>
              <span><strong>Timeline:</strong> Interactive episode timeline with severity markers across 23 seasons of Law & Order</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
