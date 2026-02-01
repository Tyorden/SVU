/**
 * Law & Order Insights Page (/lo/insights)
 *
 * Comprehensive data export with all statistics, chart data, and correlations
 * for the Law & Order (original series) false accusation dataset.
 * Includes all permutations of the correlation tool variables plus
 * prosecutorial conduct and prosecutorial apology cross-tabulations.
 */

import { useMemo, useState } from 'react'
import { useLoPersons, useLoStats, useLoEpisodes } from '../../hooks/useLoData'
import {
  formatRole,
  formatThreatType,
  formatAccusationOrigin,
  formatAccusedOf,
  formatApology,
  formatExposureChannel,
  formatExposureWho,
  formatInnocenceStatus,
  formatProsecutorialConduct,
  formatProsecutorialApology,
} from '../../utils/formatters'
import {
  CORRELATION_VARIABLES,
  computeCorrelation,
  type CorrelationVariable,
} from '../../utils/correlations'

export default function LoInsights() {
  const persons = useLoPersons()
  const episodes = useLoEpisodes()
  const stats = useLoStats()
  const [copied, setCopied] = useState(false)

  // === OVERVIEW STATS ===
  const overviewStats = useMemo(() => ({
    totalEpisodes: stats.totalEpisodes,
    totalPersonsHarmed: stats.totalPersons,
    episodesWithFalseSuspects: stats.falseSuspectEpisodes,
    falseSuspectRate: `${stats.falseSuspectRate}%`,
    episodesWithPublicExposure: stats.publicExposureEpisodes,
    publicExposureRate: `${stats.publicExposureRate}%`,
  }), [stats])

  // === SEVERITY DISTRIBUTION ===
  const severityDistribution = useMemo(() => {
    const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0 }
    persons.forEach(p => {
      if (['1', '2', '3', '4'].includes(p.consequence_severity)) {
        counts[p.consequence_severity]++
      }
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return {
      level1_low: { count: counts['1'], percentage: ((counts['1'] / total) * 100).toFixed(1) },
      level2_public: { count: counts['2'], percentage: ((counts['2'] / total) * 100).toFixed(1) },
      level3_material: { count: counts['3'], percentage: ((counts['3'] / total) * 100).toFixed(1) },
      level4_lifeAltering: { count: counts['4'], percentage: ((counts['4'] / total) * 100).toFixed(1) },
      highSeverityRate: (((counts['3'] + counts['4']) / total) * 100).toFixed(1),
    }
  }, [persons])

  // === SEVERITY BY SEASON ===
  const severityBySeason = useMemo(() => {
    const seasonData: Record<number, { total: number; sum: number; counts: Record<string, number> }> = {}
    persons.forEach(p => {
      const season = parseInt(p.season)
      const sev = p.consequence_severity
      if (!isNaN(season) && ['1', '2', '3', '4'].includes(sev)) {
        if (!seasonData[season]) {
          seasonData[season] = { total: 0, sum: 0, counts: { '1': 0, '2': 0, '3': 0, '4': 0 } }
        }
        seasonData[season].total++
        seasonData[season].sum += parseInt(sev)
        seasonData[season].counts[sev]++
      }
    })
    return Object.entries(seasonData)
      .map(([season, data]) => ({
        season: parseInt(season),
        totalPersons: data.total,
        averageSeverity: data.total > 0 ? (data.sum / data.total).toFixed(2) : '0',
        level1: data.counts['1'],
        level2: data.counts['2'],
        level3: data.counts['3'],
        level4: data.counts['4'],
      }))
      .sort((a, b) => a.season - b.season)
  }, [persons])

  // === SEVERITY BY ROLE ===
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
        role,
        roleLabel: formatRole(role),
        count: data.total,
        averageSeverity: (data.sum / data.total).toFixed(2),
      }))
      .sort((a, b) => parseFloat(b.averageSeverity) - parseFloat(a.averageSeverity))
  }, [persons])

  // === SEVERITY BY ACCUSATION ORIGIN ===
  const severityByOrigin = useMemo(() => {
    const originData: Record<string, { total: number; sum: number }> = {}
    persons.forEach(p => {
      const origin = p.accusation_origin || 'unknown'
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(sev)) {
        if (!originData[origin]) originData[origin] = { total: 0, sum: 0 }
        originData[origin].total++
        originData[origin].sum += sev
      }
    })
    return Object.entries(originData)
      .map(([origin, data]) => ({
        origin,
        originLabel: formatAccusationOrigin(origin),
        count: data.total,
        averageSeverity: (data.sum / data.total).toFixed(2),
      }))
      .sort((a, b) => parseFloat(b.averageSeverity) - parseFloat(a.averageSeverity))
  }, [persons])

  // === POLICE CONDUCT DISTRIBUTION ===
  const policeConductDistribution = useMemo(() => {
    const threatCounts: Record<string, number> = {}
    const apologyCounts: Record<string, number> = {}
    persons.forEach(p => {
      const threat = p.police_conduct_threat || 'none'
      const apology = p.police_apology || 'none'
      threatCounts[threat] = (threatCounts[threat] || 0) + 1
      apologyCounts[apology] = (apologyCounts[apology] || 0) + 1
    })
    return {
      threatTypes: Object.entries(threatCounts).map(([type, count]) => ({
        type,
        typeLabel: formatThreatType(type),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
      apologyTypes: Object.entries(apologyCounts).map(([type, count]) => ({
        type,
        typeLabel: formatApology(type),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
    }
  }, [persons])

  // === PROSECUTORIAL CONDUCT DISTRIBUTION (L&O specific) ===
  const prosecutorialConductDistribution = useMemo(() => {
    const conductCounts: Record<string, number> = {}
    const apologyCounts: Record<string, number> = {}
    persons.forEach(p => {
      const conduct = p.prosecutorial_conduct || 'none'
      const apology = p.prosecutorial_apology || 'none'
      conductCounts[conduct] = (conductCounts[conduct] || 0) + 1
      apologyCounts[apology] = (apologyCounts[apology] || 0) + 1
    })
    return {
      conductTypes: Object.entries(conductCounts).map(([type, count]) => ({
        type,
        typeLabel: formatProsecutorialConduct(type),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
      apologyTypes: Object.entries(apologyCounts).map(([type, count]) => ({
        type,
        typeLabel: formatProsecutorialApology(type),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
    }
  }, [persons])

  // === APOLOGY RATE BY THREAT TYPE (Police) ===
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
        threatType: threat,
        threatLabel: formatThreatType(threat),
        totalPersons: d.total,
        receivedApology: d.gotApology,
        apologyRate: ((d.gotApology / d.total) * 100).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.apologyRate) - parseFloat(a.apologyRate))
  }, [persons])

  // === PROSECUTORIAL APOLOGY RATE BY CONDUCT TYPE (L&O specific) ===
  const prosecutorialApologyByConduct = useMemo(() => {
    const data: Record<string, { total: number; gotApology: number }> = {}
    persons.forEach(p => {
      const conduct = p.prosecutorial_conduct || 'none'
      const apology = p.prosecutorial_apology || 'none'
      if (!data[conduct]) data[conduct] = { total: 0, gotApology: 0 }
      data[conduct].total++
      if (apology === 'partial' || apology === 'formal') {
        data[conduct].gotApology++
      }
    })
    return Object.entries(data)
      .map(([conduct, d]) => ({
        conductType: conduct,
        conductLabel: formatProsecutorialConduct(conduct),
        totalPersons: d.total,
        receivedApology: d.gotApology,
        apologyRate: ((d.gotApology / d.total) * 100).toFixed(1),
      }))
      .sort((a, b) => parseFloat(b.apologyRate) - parseFloat(a.apologyRate))
  }, [persons])

  // === ACCUSATION TYPES DISTRIBUTION ===
  const accusationTypesDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const type = p.accused_of || 'unknown'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        typeLabel: formatAccusedOf(type),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // === EXPOSURE CHANNELS DISTRIBUTION ===
  const exposureChannelsDistribution = useMemo(() => {
    const channelCounts: Record<string, number> = {}
    const whoCounts: Record<string, number> = {}
    persons.forEach(p => {
      const channel = p.exposure_channel || 'unknown'
      const who = p.exposure_who_told || 'unknown'
      channelCounts[channel] = (channelCounts[channel] || 0) + 1
      whoCounts[who] = (whoCounts[who] || 0) + 1
    })
    return {
      channels: Object.entries(channelCounts).map(([channel, count]) => ({
        channel,
        channelLabel: formatExposureChannel(channel),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
      whoExposed: Object.entries(whoCounts).map(([who, count]) => ({
        who,
        whoLabel: formatExposureWho(who),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      })),
    }
  }, [persons])

  // === INNOCENCE STATUS DISTRIBUTION ===
  const innocenceDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const status = p.innocence_status || 'unknown'
      counts[status] = (counts[status] || 0) + 1
    })
    return Object.entries(counts)
      .map(([status, count]) => ({
        status,
        statusLabel: formatInnocenceStatus(status),
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // === PHYSICAL HARM DATA ===
  const physicalHarmData = useMemo(() => {
    let murdered = 0, suicide = 0, assaulted = 0, vigilante = 0
    persons.forEach(p => {
      const detail = (p.consequence_detail || '').toLowerCase()
      const tags = (p.tags || '').toLowerCase()
      if (detail.includes('murder') || tags.includes('murdered')) murdered++
      else if (detail.includes('suicide') || tags.includes('suicide')) suicide++
      else if (detail.includes('vigilante')) vigilante++
      else if (detail.includes('assault') || tags.includes('assault')) assaulted++
    })
    return { murdered, suicide, assaulted, vigilante, total: murdered + suicide + assaulted + vigilante }
  }, [persons])

  // === PERSONS BY SEASON ===
  const personsBySeason = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const season = p.season || 'unknown'
      counts[season] = (counts[season] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([season, count]) => ({
        season: parseInt(season),
        personsHarmed: count,
      }))
      .sort((a, b) => a.season - b.season)
  }, [persons])

  // === FALSE SUSPECT BY REVIEW STATUS ===
  const falseSuspectByReview = useMemo(() => {
    let needsReview = 0
    let reviewed = 0
    episodes.forEach(e => {
      if (e.has_false_suspect === 'Y') {
        if (e.needs_deep_review === 'Y') needsReview++
        else reviewed++
      }
    })
    return {
      episodesNeedingReview: needsReview,
      episodesReviewed: reviewed,
      totalWithFalseSuspect: needsReview + reviewed
    }
  }, [episodes])

  // === EPISODES NEEDING REVIEW ===
  const episodesNeedingReview = useMemo(() => {
    return episodes
      .filter(e => e.needs_deep_review === 'Y')
      .map(e => ({
        id: e.custom_id,
        season: e.season,
        episode: e.episode_number,
        title: e.episode_title,
        hasFalseSuspect: e.has_false_suspect,
        hasPublicExposure: e.has_public_exposure,
      }))
  }, [episodes])

  // === CONSEQUENCE CATEGORIES ===
  const consequenceCategories = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const cat = p.consequence_category || 'unknown'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return Object.entries(counts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: ((count / persons.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // === ALL CORRELATION PERMUTATIONS (standard 10 variables) ===
  // The computeCorrelation function uses Person type from useData, but LoPerson
  // shares all the same base fields so the cast is safe for these 10 variables.
  const allCorrelations = useMemo(() => {
    const correlations: Record<string, Array<Record<string, string | number>>> = {}
    const variables = CORRELATION_VARIABLES.map(v => v.value)

    for (const xVar of variables) {
      for (const yVar of variables) {
        if (xVar !== yVar) {
          const key = `${xVar}_vs_${yVar}`
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawData = computeCorrelation(persons as any[], xVar as CorrelationVariable, yVar as CorrelationVariable)

          correlations[key] = rawData.map(row => {
            const formatted: Record<string, string | number> = { xValue: row.xValue }
            Object.keys(row).forEach(k => {
              if (k !== 'xValue') {
                formatted[k] = row[k]
              }
            })
            return formatted
          })
        }
      }
    }
    return correlations
  }, [persons])

  // === PROSECUTORIAL CROSS-TABULATIONS (L&O specific, computed manually) ===
  const prosecutorialCorrelations = useMemo(() => {
    const correlations: Record<string, Array<Record<string, string | number>>> = {}

    // Helper to build a cross-tab from LoPerson fields
    const crossTab = (
      xExtract: (p: typeof persons[0]) => string,
      yExtract: (p: typeof persons[0]) => string,
    ): Array<Record<string, string | number>> => {
      const matrix: Record<string, Record<string, number>> = {}
      const yValues = new Set<string>()

      persons.forEach(p => {
        const xVal = xExtract(p)
        const yVal = yExtract(p)
        if (!matrix[xVal]) matrix[xVal] = {}
        matrix[xVal][yVal] = (matrix[xVal][yVal] || 0) + 1
        yValues.add(yVal)
      })

      const sortedY = Array.from(yValues).sort()
      return Object.keys(matrix).sort().map(xVal => {
        const entry: Record<string, string | number> = { xValue: xVal }
        sortedY.forEach(yVal => {
          entry[yVal] = matrix[xVal][yVal] || 0
        })
        return entry
      })
    }

    const getConduct = (p: typeof persons[0]) => p.prosecutorial_conduct || 'none'
    const getProsApology = (p: typeof persons[0]) => p.prosecutorial_apology || 'none'
    const getSeverity = (p: typeof persons[0]) => p.consequence_severity || 'unknown'
    const getOrigin = (p: typeof persons[0]) => p.accusation_origin || 'unknown'
    const getRole = (p: typeof persons[0]) => p.role_in_plot || 'unknown'
    const getAccusedOf = (p: typeof persons[0]) => p.accused_of || 'unknown'
    const getPoliceThreat = (p: typeof persons[0]) => p.police_conduct_threat || 'none'
    const getPoliceApology = (p: typeof persons[0]) => p.police_apology || 'none'
    const getInnocence = (p: typeof persons[0]) => p.innocence_status || 'unknown'
    const getExposureChannel = (p: typeof persons[0]) => p.exposure_channel || 'unknown'
    const getExposureWho = (p: typeof persons[0]) => p.exposure_who_told || 'unknown'
    const getSeason = (p: typeof persons[0]) => p.season || 'unknown'

    // Prosecutorial conduct vs all standard variables
    correlations['prosecutorial_conduct_vs_severity'] = crossTab(getConduct, getSeverity)
    correlations['prosecutorial_conduct_vs_accusation_origin'] = crossTab(getConduct, getOrigin)
    correlations['prosecutorial_conduct_vs_role_in_plot'] = crossTab(getConduct, getRole)
    correlations['prosecutorial_conduct_vs_accused_of'] = crossTab(getConduct, getAccusedOf)
    correlations['prosecutorial_conduct_vs_police_conduct_threat'] = crossTab(getConduct, getPoliceThreat)
    correlations['prosecutorial_conduct_vs_police_apology'] = crossTab(getConduct, getPoliceApology)
    correlations['prosecutorial_conduct_vs_innocence_status'] = crossTab(getConduct, getInnocence)
    correlations['prosecutorial_conduct_vs_exposure_channel'] = crossTab(getConduct, getExposureChannel)
    correlations['prosecutorial_conduct_vs_exposure_who_told'] = crossTab(getConduct, getExposureWho)
    correlations['prosecutorial_conduct_vs_season'] = crossTab(getConduct, getSeason)
    correlations['prosecutorial_conduct_vs_prosecutorial_apology'] = crossTab(getConduct, getProsApology)

    // Reverse: standard variables vs prosecutorial conduct
    correlations['severity_vs_prosecutorial_conduct'] = crossTab(getSeverity, getConduct)
    correlations['accusation_origin_vs_prosecutorial_conduct'] = crossTab(getOrigin, getConduct)
    correlations['role_in_plot_vs_prosecutorial_conduct'] = crossTab(getRole, getConduct)
    correlations['accused_of_vs_prosecutorial_conduct'] = crossTab(getAccusedOf, getConduct)
    correlations['police_conduct_threat_vs_prosecutorial_conduct'] = crossTab(getPoliceThreat, getConduct)
    correlations['police_apology_vs_prosecutorial_conduct'] = crossTab(getPoliceApology, getConduct)
    correlations['innocence_status_vs_prosecutorial_conduct'] = crossTab(getInnocence, getConduct)
    correlations['exposure_channel_vs_prosecutorial_conduct'] = crossTab(getExposureChannel, getConduct)
    correlations['exposure_who_told_vs_prosecutorial_conduct'] = crossTab(getExposureWho, getConduct)
    correlations['season_vs_prosecutorial_conduct'] = crossTab(getSeason, getConduct)

    // Prosecutorial apology vs all standard variables
    correlations['prosecutorial_apology_vs_severity'] = crossTab(getProsApology, getSeverity)
    correlations['prosecutorial_apology_vs_accusation_origin'] = crossTab(getProsApology, getOrigin)
    correlations['prosecutorial_apology_vs_role_in_plot'] = crossTab(getProsApology, getRole)
    correlations['prosecutorial_apology_vs_accused_of'] = crossTab(getProsApology, getAccusedOf)
    correlations['prosecutorial_apology_vs_police_conduct_threat'] = crossTab(getProsApology, getPoliceThreat)
    correlations['prosecutorial_apology_vs_police_apology'] = crossTab(getProsApology, getPoliceApology)
    correlations['prosecutorial_apology_vs_innocence_status'] = crossTab(getProsApology, getInnocence)
    correlations['prosecutorial_apology_vs_exposure_channel'] = crossTab(getProsApology, getExposureChannel)
    correlations['prosecutorial_apology_vs_exposure_who_told'] = crossTab(getProsApology, getExposureWho)
    correlations['prosecutorial_apology_vs_season'] = crossTab(getProsApology, getSeason)
    correlations['prosecutorial_apology_vs_prosecutorial_conduct'] = crossTab(getProsApology, getConduct)

    // Reverse: standard variables vs prosecutorial apology
    correlations['severity_vs_prosecutorial_apology'] = crossTab(getSeverity, getProsApology)
    correlations['accusation_origin_vs_prosecutorial_apology'] = crossTab(getOrigin, getProsApology)
    correlations['role_in_plot_vs_prosecutorial_apology'] = crossTab(getRole, getProsApology)
    correlations['accused_of_vs_prosecutorial_apology'] = crossTab(getAccusedOf, getProsApology)
    correlations['police_conduct_threat_vs_prosecutorial_apology'] = crossTab(getPoliceThreat, getProsApology)
    correlations['police_apology_vs_prosecutorial_apology'] = crossTab(getPoliceApology, getProsApology)
    correlations['innocence_status_vs_prosecutorial_apology'] = crossTab(getInnocence, getProsApology)
    correlations['exposure_channel_vs_prosecutorial_apology'] = crossTab(getExposureChannel, getProsApology)
    correlations['exposure_who_told_vs_prosecutorial_apology'] = crossTab(getExposureWho, getProsApology)
    correlations['season_vs_prosecutorial_apology'] = crossTab(getSeason, getProsApology)

    return correlations
  }, [persons])

  // === KEY INSIGHTS SUMMARY ===
  const keyInsights = useMemo(() => {
    // Early vs late season comparison
    let earlySum = 0, earlyCount = 0, lateSum = 0, lateCount = 0
    persons.forEach(p => {
      const season = parseInt(p.season)
      const sev = parseInt(p.consequence_severity)
      if (!isNaN(season) && !isNaN(sev)) {
        if (season <= 5) { earlySum += sev; earlyCount++ }
        else if (season >= 17) { lateSum += sev; lateCount++ }
      }
    })
    const earlyAvg = earlyCount > 0 ? earlySum / earlyCount : 0
    const lateAvg = lateCount > 0 ? lateSum / lateCount : 0

    return {
      severityTrendIncrease: earlyAvg > 0 ? (((lateAvg - earlyAvg) / earlyAvg) * 100).toFixed(1) : '0',
      earlySeasonsAvgSeverity: earlyAvg.toFixed(2),
      lateSeasonsAvgSeverity: lateAvg.toFixed(2),
      initialSuspectAvgSeverity: severityByRole.find(r => r.role === 'initial_suspect')?.averageSeverity || 'N/A',
      redHerringAvgSeverity: severityByRole.find(r => r.role === 'red_herring')?.averageSeverity || 'N/A',
      fabricationAvgSeverity: severityByOrigin.find(o => o.origin === 'fabrication')?.averageSeverity || 'N/A',
      squadInferenceAvgSeverity: severityByOrigin.find(o => o.origin === 'squad_inference')?.averageSeverity || 'N/A',
      verbalThreatApologyRate: apologyByThreat.find(a => a.threatType === 'verbal_threat')?.apologyRate || 'N/A',
    }
  }, [persons, severityByRole, severityByOrigin, apologyByThreat])

  // === GENERATE COMPLETE EXPORT ===
  const generateCompleteExport = useMemo(() => {
    const allCorrelationsCombined = {
      ...allCorrelations,
      ...prosecutorialCorrelations,
    }

    return {
      metadata: {
        generated: new Date().toISOString(),
        dataSource: 'Law & Order False Accusation Analysis',
        totalEpisodes: stats.totalEpisodes,
        totalPersonsHarmed: stats.totalPersons,
        seasonsAnalyzed: 'Original series (non-contiguous)',
      },
      overview: overviewStats,
      keyInsights,
      // Dashboard data
      dashboardCharts: {
        severityDistribution,
        personsBySeason,
        accusationTypes: accusationTypesDistribution,
        falseSuspectByReviewStatus: falseSuspectByReview,
      },
      // Analysis page data
      severityAnalysis: {
        bySeason: severityBySeason,
        byRole: severityByRole,
        byOrigin: severityByOrigin,
      },
      policeConduct: policeConductDistribution,
      apologyByThreatType: apologyByThreat,
      // L&O specific: Prosecutorial data
      prosecutorialConduct: prosecutorialConductDistribution,
      prosecutorialApologyByConduct: prosecutorialApologyByConduct,
      exposureData: exposureChannelsDistribution,
      innocenceStatus: innocenceDistribution,
      consequenceCategories,
      physicalHarm: physicalHarmData,
      // Data quality
      dataQuality: {
        episodesNeedingReview,
        totalNeedingReview: episodesNeedingReview.length,
      },
      // All correlations (standard + prosecutorial)
      correlations: allCorrelationsCombined,
    }
  }, [
    stats, overviewStats, keyInsights, severityDistribution, severityBySeason,
    severityByRole, severityByOrigin, policeConductDistribution, apologyByThreat,
    prosecutorialConductDistribution, prosecutorialApologyByConduct,
    accusationTypesDistribution, exposureChannelsDistribution, innocenceDistribution,
    physicalHarmData, allCorrelations, prosecutorialCorrelations, personsBySeason,
    falseSuspectByReview, episodesNeedingReview, consequenceCategories
  ])

  // === GENERATE TEXT REPORT ===
  const generateTextReport = useMemo(() => {
    const allCorrelationsCombined = {
      ...allCorrelations,
      ...prosecutorialCorrelations,
    }

    let text = `LAW & ORDER FALSE ACCUSATION ANALYSIS - COMPLETE DATA EXPORT
Generated: ${new Date().toLocaleDateString()}
${'='.repeat(60)}

OVERVIEW
--------
Total Episodes Analyzed: ${stats.totalEpisodes}
Total Persons Harmed: ${stats.totalPersons}
Episodes with False Suspects: ${stats.falseSuspectEpisodes} (${stats.falseSuspectRate}%)
Episodes with Public Exposure: ${stats.publicExposureEpisodes} (${stats.publicExposureRate}%)

KEY INSIGHTS
------------
Severity Trend: ${keyInsights.severityTrendIncrease}% increase from early to late seasons
Early Seasons (1-5) Avg Severity: ${keyInsights.earlySeasonsAvgSeverity}
Late Seasons (17+) Avg Severity: ${keyInsights.lateSeasonsAvgSeverity}
Initial Suspect Avg Severity: ${keyInsights.initialSuspectAvgSeverity}
Red Herring Avg Severity: ${keyInsights.redHerringAvgSeverity}
Fabricated Accusation Avg Severity: ${keyInsights.fabricationAvgSeverity}
Squad Inference Avg Severity: ${keyInsights.squadInferenceAvgSeverity}
Verbal Threat -> Apology Rate: ${keyInsights.verbalThreatApologyRate}%

SEVERITY DISTRIBUTION
--------------------
Level 1 (Low Harm): ${severityDistribution.level1_low.count} (${severityDistribution.level1_low.percentage}%)
Level 2 (Public Exposure): ${severityDistribution.level2_public.count} (${severityDistribution.level2_public.percentage}%)
Level 3 (Material Sanction): ${severityDistribution.level3_material.count} (${severityDistribution.level3_material.percentage}%)
Level 4 (Life-Altering/Death): ${severityDistribution.level4_lifeAltering.count} (${severityDistribution.level4_lifeAltering.percentage}%)
High Severity Rate (3-4): ${severityDistribution.highSeverityRate}%

PHYSICAL HARM
-------------
Murdered: ${physicalHarmData.murdered}
Suicide: ${physicalHarmData.suicide}
Assaulted: ${physicalHarmData.assaulted}
Vigilante Attack: ${physicalHarmData.vigilante}
Total Physical Harm Cases: ${physicalHarmData.total}

SEVERITY BY SEASON
------------------
${severityBySeason.map(s => `Season ${s.season}: ${s.totalPersons} persons, avg severity ${s.averageSeverity}`).join('\n')}

SEVERITY BY ROLE IN PLOT
------------------------
${severityByRole.map(r => `${r.roleLabel}: ${r.count} persons, avg severity ${r.averageSeverity}`).join('\n')}

SEVERITY BY ACCUSATION ORIGIN
-----------------------------
${severityByOrigin.map(o => `${o.originLabel}: ${o.count} persons, avg severity ${o.averageSeverity}`).join('\n')}

POLICE CONDUCT - THREAT TYPES
-----------------------------
${policeConductDistribution.threatTypes.map(t => `${t.typeLabel}: ${t.count} (${t.percentage}%)`).join('\n')}

POLICE CONDUCT - APOLOGY TYPES
------------------------------
${policeConductDistribution.apologyTypes.map(a => `${a.typeLabel}: ${a.count} (${a.percentage}%)`).join('\n')}

APOLOGY RATE BY THREAT TYPE (Police)
-------------------------------------
${apologyByThreat.map(a => `${a.threatLabel}: ${a.apologyRate}% received apology (${a.receivedApology}/${a.totalPersons})`).join('\n')}

PROSECUTORIAL CONDUCT DISTRIBUTION
-----------------------------------
${prosecutorialConductDistribution.conductTypes.map(c => `${c.typeLabel}: ${c.count} (${c.percentage}%)`).join('\n')}

PROSECUTORIAL APOLOGY DISTRIBUTION
-----------------------------------
${prosecutorialConductDistribution.apologyTypes.map(a => `${a.typeLabel}: ${a.count} (${a.percentage}%)`).join('\n')}

PROSECUTORIAL APOLOGY RATE BY CONDUCT TYPE
-------------------------------------------
${prosecutorialApologyByConduct.map(a => `${a.conductLabel}: ${a.apologyRate}% received apology (${a.receivedApology}/${a.totalPersons})`).join('\n')}

ACCUSATION TYPES
----------------
${accusationTypesDistribution.map(a => `${a.typeLabel}: ${a.count} (${a.percentage}%)`).join('\n')}

EXPOSURE CHANNELS
-----------------
${exposureChannelsDistribution.channels.map(c => `${c.channelLabel}: ${c.count} (${c.percentage}%)`).join('\n')}

WHO EXPOSED
-----------
${exposureChannelsDistribution.whoExposed.map(w => `${w.whoLabel}: ${w.count} (${w.percentage}%)`).join('\n')}

INNOCENCE STATUS
----------------
${innocenceDistribution.map(i => `${i.statusLabel}: ${i.count} (${i.percentage}%)`).join('\n')}

CONSEQUENCE CATEGORIES
----------------------
${consequenceCategories.map(c => `${c.category}: ${c.count} (${c.percentage}%)`).join('\n')}

PERSONS HARMED BY SEASON
------------------------
${personsBySeason.map(s => `Season ${s.season}: ${s.personsHarmed} persons`).join('\n')}

DATA QUALITY
------------
Episodes with False Suspects Needing Review: ${falseSuspectByReview.episodesNeedingReview}
Episodes with False Suspects Already Reviewed: ${falseSuspectByReview.episodesReviewed}
Total Episodes Needing Deep Review: ${episodesNeedingReview.length}

EPISODES NEEDING REVIEW
-----------------------
${episodesNeedingReview.map(e => `S${e.season}E${e.episode}: ${e.title}`).join('\n')}

${'='.repeat(60)}
CORRELATION DATA (${Object.keys(allCorrelationsCombined).length} permutations)
${'='.repeat(60)}

${Object.entries(allCorrelationsCombined).map(([key, data]) => {
  const parts = key.split('_vs_')
  return `\n${parts[0].toUpperCase()} vs ${parts[1].toUpperCase()}\n${'-'.repeat(40)}\n${JSON.stringify(data, null, 2)}`
}).join('\n')}

${'='.repeat(60)}
Data Source: 314 Law & Order episodes, 429 persons harmed
Analysis: https://github.com/Tyorden/SVU
`
    return text
  }, [
    stats, keyInsights, severityDistribution, physicalHarmData, severityBySeason,
    severityByRole, severityByOrigin, policeConductDistribution, apologyByThreat,
    prosecutorialConductDistribution, prosecutorialApologyByConduct,
    accusationTypesDistribution, exposureChannelsDistribution, innocenceDistribution,
    allCorrelations, prosecutorialCorrelations, consequenceCategories, personsBySeason,
    falseSuspectByReview, episodesNeedingReview
  ])

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

  const standardCorrelationCount = Object.keys(allCorrelations).length
  const prosecutorialCorrelationCount = Object.keys(prosecutorialCorrelations).length
  const totalCorrelationCount = standardCorrelationCount + prosecutorialCorrelationCount

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Complete Data Export</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          All Law & Order statistics, chart data, and {totalCorrelationCount} correlation permutations in one download.
        </p>
      </div>

      {/* Export buttons */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-2">Download Complete Dataset</h2>
        <p className="text-sm text-slate-600 mb-4">
          Includes all dashboard data, analysis charts, prosecutorial conduct data, and every correlation combination.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => downloadFile(JSON.stringify(generateCompleteExport, null, 2), 'lo-complete-analysis.json', 'application/json')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Download Complete JSON
          </button>
          <button
            onClick={() => downloadFile(generateTextReport, 'lo-complete-analysis.txt', 'text/plain')}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
          >
            Download Text Report
          </button>
          <button
            onClick={() => copyToClipboard(JSON.stringify(generateCompleteExport, null, 2))}
            className="px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            {copied ? 'Copied!' : 'Copy JSON to Clipboard'}
          </button>
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalEpisodes}</div>
          <div className="text-xs text-slate-600">Episodes</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalPersons}</div>
          <div className="text-xs text-slate-600">Persons Harmed</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{totalCorrelationCount}</div>
          <div className="text-xs text-slate-600">Correlations</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{personsBySeason.length}</div>
          <div className="text-xs text-slate-600">Seasons</div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">What's Included in Export</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Overview Stats</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Total episodes & persons</li>
              <li>- False suspect rate</li>
              <li>- Public exposure rate</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Severity Analysis</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Distribution (levels 1-4)</li>
              <li>- By season (trend data)</li>
              <li>- By role in plot</li>
              <li>- By accusation origin</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Police Conduct</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Threat types distribution</li>
              <li>- Apology types distribution</li>
              <li>- Apology rate by threat type</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Prosecutorial Conduct</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Conduct types distribution</li>
              <li>- Prosecutorial apology distribution</li>
              <li>- Apology rate by conduct type</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Accusation Data</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Types (murder, fraud, etc.)</li>
              <li>- Exposure channels</li>
              <li>- Who exposed</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Physical Harm</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Murdered count</li>
              <li>- Suicide count</li>
              <li>- Assault/vigilante counts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Dashboard Charts</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- Persons by season</li>
              <li>- Consequence categories</li>
              <li>- Review status breakdown</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Data Quality</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- {episodesNeedingReview.length} episodes need review</li>
              <li>- Full episode list</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">All Correlations</h3>
            <ul className="text-slate-600 space-y-1">
              <li>- {standardCorrelationCount} standard variable pairs</li>
              <li>- {prosecutorialCorrelationCount} prosecutorial cross-tabs</li>
              <li>- Full cross-tabulation data</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Correlation Variables */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Correlation Variables ({CORRELATION_VARIABLES.length + 2})</h2>
        <p className="text-sm text-slate-600 mb-3">
          All combinations of these variables are included in the export:
        </p>
        <div className="flex flex-wrap gap-2">
          {CORRELATION_VARIABLES.map(v => (
            <span key={v.value} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
              {v.label}
            </span>
          ))}
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            Prosecutorial Conduct
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            Prosecutorial Apology
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Purple tags are Law & Order-specific variables not present in the SVU dataset.
        </p>
      </div>

      {/* Key Insights Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Key Insights Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-600">Severity Trend Increase</div>
            <div className="text-xl font-bold text-indigo-600">{keyInsights.severityTrendIncrease}%</div>
            <div className="text-xs text-slate-500">Early (S1-5) to late (S17+) seasons</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-600">High Severity Rate</div>
            <div className="text-xl font-bold text-red-600">{severityDistribution.highSeverityRate}%</div>
            <div className="text-xs text-slate-500">Level 3-4 outcomes</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-600">Initial Suspect vs Red Herring</div>
            <div className="text-xl font-bold text-purple-600">
              {keyInsights.initialSuspectAvgSeverity} vs {keyInsights.redHerringAvgSeverity}
            </div>
            <div className="text-xs text-slate-500">Average severity comparison</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-slate-600">Verbal Threat &rarr; Apology</div>
            <div className="text-xl font-bold text-amber-600">{keyInsights.verbalThreatApologyRate}%</div>
            <div className="text-xs text-slate-500">Police apology rate for verbal threats</div>
          </div>
        </div>
      </div>

      {/* Prosecutorial Conduct Preview (L&O specific) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
        <h2 className="font-semibold text-slate-800 mb-4">Prosecutorial Conduct Preview</h2>
        <p className="text-xs text-slate-500 mb-3">Law & Order-specific data on ADA/prosecution behavior</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Conduct Types</h3>
            <div className="space-y-1">
              {prosecutorialConductDistribution.conductTypes.map(c => (
                <div key={c.type} className="flex justify-between text-slate-600">
                  <span>{c.typeLabel}</span>
                  <span className="font-medium">{c.count} ({c.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-2">Prosecutorial Apology</h3>
            <div className="space-y-1">
              {prosecutorialConductDistribution.apologyTypes.map(a => (
                <div key={a.type} className="flex justify-between text-slate-600">
                  <span>{a.typeLabel}</span>
                  <span className="font-medium">{a.count} ({a.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Raw JSON Preview */}
      <details className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <summary className="p-4 cursor-pointer font-semibold text-slate-800 hover:bg-slate-50">
          Preview JSON Structure
        </summary>
        <div className="p-4 pt-0 border-t border-slate-100">
          <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 p-4 rounded-lg overflow-x-auto max-h-96">
            {JSON.stringify({
              metadata: generateCompleteExport.metadata,
              overview: generateCompleteExport.overview,
              keyInsights: generateCompleteExport.keyInsights,
              dashboardCharts: '{ severityDistribution, personsBySeason, accusationTypes, falseSuspectByReviewStatus }',
              severityAnalysis: '{ bySeason, byRole, byOrigin }',
              policeConduct: '{ threatTypes, apologyTypes }',
              prosecutorialConduct: '{ conductTypes, apologyTypes }',
              prosecutorialApologyByConduct: '[ { conductType, apologyRate, ... } ]',
              '...': `(${Object.keys(generateCompleteExport).length} total sections)`,
              correlations: `(${totalCorrelationCount} correlation tables: ${standardCorrelationCount} standard + ${prosecutorialCorrelationCount} prosecutorial)`,
            }, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  )
}
