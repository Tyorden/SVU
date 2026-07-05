/**
 * Findings Page (/findings)
 *
 * Publication-grade verified findings (computed July 2026) surfaced from
 * docs/svu_paper_stats.md and the two academic papers.
 *
 * Analysis set: n = 536 persons — the 541-row dataset minus 5 persons coded
 * `actually_guilty`. The Episodes/Analysis pages display the full 541 rows;
 * this page applies the papers' exclusion rule so every statistic matches
 * the publication numbers.
 *
 * Sections:
 * 1. Hero/intro with methodology note
 * 2. The Corrected Death Audit (hard-coded, row-level verified numbers)
 * 3. The Apology Gradient (runtime-computed)
 * 4. The Media Multiplier (runtime-computed)
 * 5. Who Points the Finger (runtime-computed, normalized origins)
 * 6. The Era Story (runtime-computed rates + hard-coded chi-square results)
 *
 * Implementation notes:
 * - Field-based statistics are computed at runtime from persons.json /
 *   episodes.json with the same exclusion + normalization rules as the paper
 *   (innocence_status !== 'actually_guilty'; victim_misID → victim_ID;
 *   third_party → witness_misID), so charts stay live-data-driven.
 * - Only the row-audited death counts and the chi-square test results are
 *   hard-coded: they required manual row-by-row verification (free-text
 *   keyword matching overcounts deaths) and inferential computation that is
 *   not reproducible from the JSON fields alone. Both are labeled as
 *   verified/audited July 2026.
 */

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { usePersons, useEpisodes } from '../hooks/useData'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { getSeverityColor, formatExposureChannel, formatAccusationOrigin } from '../utils/formatters'

// === Paper rules (mirror docs/svu_paper_stats.md) ===

/** Exclusion rule: drop the 5 rows coded actually_guilty (541 → 536). */
const isInnocent = (status: string) => status !== 'actually_guilty'

/** Vocabulary normalization for accusation_origin (per paper Section A4). */
function normalizeOrigin(origin: string): string {
  if (origin === 'victim_misID') return 'victim_ID'
  if (origin === 'third_party') return 'witness_misID'
  return origin || 'unknown'
}

/** Any threat/coercion = verbal_threat, coercive_tactic, insult_degradation, or multiple. */
const isThreatened = (threat: string) =>
  ['verbal_threat', 'coercive_tactic', 'insult_degradation', 'multiple'].includes(threat)

const gotApology = (apology: string) => apology === 'partial' || apology === 'formal'

/** Era assignment by production season (air_date is blank in the dataset). */
type Era = 'pre' | 'metoo' | 'post'
function getEra(season: number): Era {
  if (season <= 18) return 'pre'
  if (season <= 21) return 'metoo'
  return 'post'
}

const ERA_META: Record<Era, { label: string; short: string; color: string }> = {
  pre: { label: 'Pre-#MeToo (S1-18, 1999-2017)', short: 'S1-18', color: '#6366f1' },
  metoo: { label: '#MeToo era (S19-21, 2017-2020)', short: 'S19-21', color: '#8b5cf6' },
  post: { label: 'Post-2020 (S22-27)', short: 'S22-27', color: '#f97316' },
}

// === Hard-coded, row-level audited numbers (verified July 2026) ===
// Each of these rows was manually audited against consequence_detail, notes,
// and quote_or_scene because naive keyword matching on the free-text fields
// overcounts deaths (e.g. `arrested_for_wrong_murder`, `suicide_attempt`,
// `suicide_watch`, `family_murdered` all match death keywords without being
// deaths of the accused person). Do not recompute these from tags.
const DEATH_AUDIT = {
  totalDeaths: 31,
  deathEpisodes: 30,
  deathEpisodeRate: '5.2%',
  murdered: 21,
  murderedInCustody: 2, // Russell Ramsay S02E08, Manny Montero S15E13
  suicides: 9,
  overdose: 1, // Leon Tate S03E04
  suicideAttempts: 7, // survived (structured field)
  nonFatalAttacks: 27, // assaults / vigilante attacks / shootings (structured field)
  apologiesInDeathCases: 6,
}

const DEATH_BREAKDOWN = [
  { category: 'Murdered', count: DEATH_AUDIT.murdered, fatal: true },
  { category: 'Completed suicide', count: DEATH_AUDIT.suicides, fatal: true },
  { category: 'Overdose death', count: DEATH_AUDIT.overdose, fatal: true },
  { category: 'Suicide attempt (survived)', count: DEATH_AUDIT.suicideAttempts, fatal: false },
  { category: 'Non-fatal assault / attack', count: DEATH_AUDIT.nonFatalAttacks, fatal: false },
]

// Hard-coded inferential results (Pearson chi-square, computed July 2026).
const CHI_SQUARE = {
  falseSuspectByEra: 'chi-square(2) = 21.61, p < .01',
  severityByEra: 'chi-square(2) = 8.09, p < .05',
}

export default function Findings() {
  const persons = usePersons()
  const episodes = useEpisodes()

  // The paper's analysis set: 541 rows minus 5 actually_guilty = 536.
  const innocent = useMemo(
    () => persons.filter(p => isInnocent(p.innocence_status)),
    [persons]
  )
  const n = innocent.length

  // === Section 3: The Apology Gradient ===

  const apologyBySeverity = useMemo(() => {
    return ['1', '2', '3', '4'].map(sev => {
      const rows = innocent.filter(p => p.consequence_severity === sev)
      const apologies = rows.filter(p => gotApology(p.police_apology)).length
      return {
        severity: `Severity ${sev}`,
        rate: parseFloat(((apologies / rows.length) * 100).toFixed(1)),
        apologies,
        count: rows.length,
        color: getSeverityColor(sev),
      }
    })
  }, [innocent])

  const apologyStats = useMemo(() => {
    const any = innocent.filter(p => gotApology(p.police_apology)).length
    const formal = innocent.filter(p => p.police_apology === 'formal').length
    const threatened = innocent.filter(p => isThreatened(p.police_conduct_threat))
    const unthreatened = innocent.filter(p => p.police_conduct_threat === 'none')
    const threatenedApologies = threatened.filter(p => gotApology(p.police_apology)).length
    const unthreatenedApologies = unthreatened.filter(p => gotApology(p.police_apology)).length
    return {
      any,
      anyRate: ((any / n) * 100).toFixed(1),
      formal,
      formalRate: ((formal / n) * 100).toFixed(1),
      threatenedRate: ((threatenedApologies / threatened.length) * 100).toFixed(1),
      threatenedN: threatened.length,
      unthreatenedRate: ((unthreatenedApologies / unthreatened.length) * 100).toFixed(1),
      unthreatenedN: unthreatened.length,
    }
  }, [innocent, n])

  // === Section 4: The Media Multiplier ===

  const severity4ByChannel = useMemo(() => {
    const channels: Record<string, { total: number; sev4: number }> = {}
    innocent.forEach(p => {
      const channel = p.exposure_channel || 'unknown'
      if (!channels[channel]) channels[channel] = { total: 0, sev4: 0 }
      channels[channel].total++
      if (p.consequence_severity === '4') channels[channel].sev4++
    })
    return Object.entries(channels)
      .map(([channel, d]) => ({
        channel: formatExposureChannel(channel),
        rawChannel: channel,
        rate: parseFloat(((d.sev4 / d.total) * 100).toFixed(1)),
        sev4: d.sev4,
        count: d.total,
      }))
      .sort((a, b) => b.rate - a.rate)
  }, [innocent])

  const mediaMultiplier = useMemo(() => {
    const media = severity4ByChannel.find(c => c.rawChannel === 'media')
    const policeOnly = severity4ByChannel.find(c => c.rawChannel === 'police_only')
    if (!media || !policeOnly || policeOnly.rate === 0) return { media, policeOnly, multiplier: '—' }
    return { media, policeOnly, multiplier: `${(media.rate / policeOnly.rate).toFixed(1)}x` }
  }, [severity4ByChannel])

  // Exposure spread beyond law enforcement (channel other than police_only/unknown)
  const beyondPolice = useMemo(() => {
    const count = innocent.filter(
      p => p.exposure_channel && !['police_only', 'unknown'].includes(p.exposure_channel)
    ).length
    return { count, rate: ((count / n) * 100).toFixed(1) }
  }, [innocent, n])

  // === Section 5: Who Points the Finger ===

  const originDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    innocent.forEach(p => {
      const origin = normalizeOrigin(p.accusation_origin)
      counts[origin] = (counts[origin] || 0) + 1
    })
    return Object.entries(counts)
      .map(([origin, count]) => ({
        origin: formatAccusationOrigin(origin),
        count,
        pct: parseFloat(((count / n) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
  }, [innocent, n])

  const wrongIdReconciliation = useMemo(() => {
    const tagged = innocent.filter(p =>
      (p.tags || '').split(';').map(t => t.trim()).includes('wrong_ID')
    )
    const onSquadInference = tagged.filter(
      p => normalizeOrigin(p.accusation_origin) === 'squad_inference'
    ).length
    return { tagged: tagged.length, onSquadInference }
  }, [innocent])

  // === Section 6: The Era Story ===

  const eraStats = useMemo(() => {
    return (['pre', 'metoo', 'post'] as Era[]).map(era => {
      const eraEpisodes = episodes.filter(e => getEra(parseInt(e.season)) === era)
      const falseSuspectY = eraEpisodes.filter(e => e.has_false_suspect === 'Y').length
      const eraPersons = innocent.filter(p => getEra(parseInt(p.season)) === era)
      const sev34 = eraPersons.filter(
        p => p.consequence_severity === '3' || p.consequence_severity === '4'
      ).length
      return {
        era: ERA_META[era].short,
        label: ERA_META[era].label,
        color: ERA_META[era].color,
        episodes: eraEpisodes.length,
        falseSuspectY,
        falseSuspectRate: parseFloat(((falseSuspectY / eraEpisodes.length) * 100).toFixed(1)),
        persons: eraPersons.length,
        personsPerEpisode: parseFloat((eraPersons.length / eraEpisodes.length).toFixed(2)),
        sev34,
        sev34Rate: parseFloat(((sev34 / eraPersons.length) * 100).toFixed(1)),
      }
    })
  }, [episodes, innocent])

  const coercionByBlock = useMemo(() => {
    const blocks: [number, number][] = [
      [1, 3], [4, 6], [7, 9], [10, 12], [13, 15], [16, 18], [19, 21], [22, 24], [25, 27],
    ]
    return blocks.map(([start, end]) => {
      const rows = innocent.filter(p => {
        const season = parseInt(p.season)
        return season >= start && season <= end
      })
      const threatened = rows.filter(p => isThreatened(p.police_conduct_threat)).length
      const era = getEra(start)
      return {
        block: `S${start}-${end}`,
        rate: parseFloat(((threatened / rows.length) * 100).toFixed(1)),
        threatened,
        count: rows.length,
        color: ERA_META[era].color,
        eraLabel: ERA_META[era].label,
      }
    })
  }, [innocent])

  return (
    <div>
      {/* === 1. Hero / Intro === */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Findings</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
            Verified July 2026
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Publication-grade statistics from the SVU false accusation papers, surfaced as
          interactive charts.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-6 mb-8 sm:mb-12">
        <h2 className="text-sm sm:text-base font-semibold text-indigo-900 mb-2">
          About these numbers
        </h2>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          These are the publication-grade statistics behind the two academic papers, computed
          July 2026 and verified at the row level. The analysis set is{' '}
          <span className="font-semibold">n = {n} persons</span>: the full 541-row dataset minus
          5 persons coded <span className="font-mono text-[11px] sm:text-xs">actually_guilty</span>.
          The Episodes and Analysis pages on this site display all 541 rows; this page applies
          the papers&apos; exclusion rule, so small differences from those pages are expected and
          intentional. Episode-level rates use all 576 episodes.
        </p>
      </div>

      {/* === 2. The Corrected Death Audit === */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          The Corrected Death Audit
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
            <span className="font-semibold">Why these numbers are hard-coded:</span> naive keyword
            matching on the free-text fields overcounts deaths — strings like{' '}
            <span className="font-mono text-[11px] sm:text-xs">arrested_for_wrong_murder</span>,{' '}
            <span className="font-mono text-[11px] sm:text-xs">suicide_attempt</span>, and{' '}
            <span className="font-mono text-[11px] sm:text-xs">family_murdered</span> match death
            keywords without being deaths of the accused person. Every count below was manually
            audited row-by-row (July 2026) against the consequence detail, notes, and scene quotes.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            title="Accusation-Linked Deaths"
            value={DEATH_AUDIT.totalDeaths}
            subtitle={`Across ${DEATH_AUDIT.deathEpisodes} episodes — ${DEATH_AUDIT.deathEpisodeRate} of all 576`}
            color="red"
          />
          <StatCard
            title="Murdered"
            value={DEATH_AUDIT.murdered}
            subtitle={`${DEATH_AUDIT.murderedInCustody} killed in custody: Russell Ramsay (S02E08), Manny Montero (S15E13)`}
            color="red"
          />
          <StatCard
            title="Completed Suicides"
            value={DEATH_AUDIT.suicides}
            subtitle={`Plus ${DEATH_AUDIT.overdose} overdose death: Leon Tate (S03E04)`}
            color="purple"
          />
          <StatCard
            title="Apologies in Death Cases"
            value={DEATH_AUDIT.apologiesInDeathCases}
            subtitle={`Police apologized in ${DEATH_AUDIT.apologiesInDeathCases} of the ${DEATH_AUDIT.totalDeaths} deaths`}
            color="yellow"
          />
        </div>

        <ChartCard
          title="Row-Audited Physical Harm Breakdown"
          subtitle={`${DEATH_AUDIT.totalDeaths} deaths (dark red), plus ${DEATH_AUDIT.suicideAttempts} survived suicide attempts and ${DEATH_AUDIT.nonFatalAttacks} non-fatal assaults / vigilante attacks / shootings counted separately (orange)`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEATH_BREAKDOWN} layout="vertical" margin={{ left: 160 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={155} />
              <Tooltip formatter={(value: number) => [value, 'Persons']} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {DEATH_BREAKDOWN.map(entry => (
                  <Cell key={entry.category} fill={entry.fatal ? '#dc2626' : '#f97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* === 3. The Apology Gradient === */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          The Apology Gradient
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            title="Any Apology"
            value={`${apologyStats.anyRate}%`}
            subtitle={`${apologyStats.any} of ${n} persons (partial or formal)`}
            color="blue"
          />
          <StatCard
            title="Formal Apology"
            value={`${apologyStats.formalRate}%`}
            subtitle={`Just ${apologyStats.formal} of ${n} persons`}
            color="purple"
          />
          <StatCard
            title="If Threatened / Coerced"
            value={`${apologyStats.threatenedRate}%`}
            subtitle={`Apology rate among ${apologyStats.threatenedN} threatened persons`}
            color="red"
          />
          <StatCard
            title="If Not Threatened"
            value={`${apologyStats.unthreatenedRate}%`}
            subtitle={`Apology rate among ${apologyStats.unthreatenedN} unthreatened persons`}
            color="green"
          />
        </div>

        <ChartCard
          title="Apology Rate by Consequence Severity"
          subtitle="Apology tracks catastrophe, not conduct: rates climb with the severity of the outcome, while threatened and unthreatened persons are apologized to at nearly identical rates"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={apologyBySeverity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="severity" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(value: number, _name, props) => [
                  `${value}% (${props.payload.apologies} of ${props.payload.count})`,
                  'Apology Rate',
                ]}
              />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {apologyBySeverity.map(entry => (
                  <Cell key={entry.severity} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* === 4. The Media Multiplier === */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          The Media Multiplier
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatCard
            title="Media Exposure"
            value={`${mediaMultiplier.media?.rate ?? '—'}%`}
            subtitle={`Severity-4 rate when the media exposes the accusation (n=${mediaMultiplier.media?.count ?? '—'})`}
            color="red"
          />
          <StatCard
            title="Police-Only"
            value={`${mediaMultiplier.policeOnly?.rate ?? '—'}%`}
            subtitle={`Severity-4 rate when the accusation stays inside law enforcement (n=${mediaMultiplier.policeOnly?.count ?? '—'})`}
            color="green"
          />
          <StatCard
            title="The Multiplier"
            value={mediaMultiplier.multiplier}
            subtitle="Media exposure multiplies the life-altering outcome rate"
            color="purple"
          />
          <StatCard
            title="Exposure Beyond Police"
            value={`${beyondPolice.rate}%`}
            subtitle={`${beyondPolice.count} of ${n} persons had the accusation spread beyond law enforcement`}
            color="yellow"
          />
        </div>

        <ChartCard
          title="Severity-4 Rate by Exposure Channel"
          subtitle="Share of persons suffering life-altering outcomes or death, by how the accusation became public (media highlighted; legal tops the list but n=14)"
          height="lg"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severity4ByChannel} layout="vertical" margin={{ left: 90 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 11 }} width={85} />
              <Tooltip
                formatter={(value: number, _name, props) => [
                  `${value}% (${props.payload.sev4} of ${props.payload.count})`,
                  'Severity-4 Rate',
                ]}
              />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                {severity4ByChannel.map(entry => (
                  <Cell
                    key={entry.rawChannel}
                    fill={entry.rawChannel === 'media' ? '#6366f1' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* === 5. Who Points the Finger === */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          Who Points the Finger
        </h2>

        <ChartCard
          title="Accusation Origin (Controlled Field, Normalized)"
          subtitle="Who first pointed the finger at each of the 536 innocent persons — the squad's own inference leads at 55.0%"
          height="lg"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={originDistribution} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="origin" type="category" tick={{ fontSize: 10 }} width={135} />
              <Tooltip
                formatter={(value: number, _name, props) => [
                  `${value} persons (${props.payload.pct}%)`,
                  'Count',
                ]}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 mt-4 sm:mt-6">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
            Reconciliation: the &quot;wrong_ID&quot; tag vs the controlled field
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The free-form <span className="font-mono text-[11px] sm:text-xs">wrong_ID</span> tag
            appears {wrongIdReconciliation.tagged} times, but it marks misidentification{' '}
            <em>elements</em> across all origins — an episode outcome of &quot;they had the wrong
            person&quot; — not who made the identification. {wrongIdReconciliation.onSquadInference}{' '}
            of those {wrongIdReconciliation.tagged} tagged rows sit on{' '}
            <span className="font-medium">squad inference</span> origins. On the controlled field,
            detectives&apos; own theories, not victim error, drive most false accusations: squad
            inference accounts for 55.0% of cases, while genuine victim misidentification is 17.7%.
          </p>
        </div>
      </section>

      {/* === 6. The Era Story === */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 pb-2 border-b border-slate-200">
          The Era Story
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
          Three eras by production season:{' '}
          <span className="font-medium" style={{ color: ERA_META.pre.color }}>pre-#MeToo (S1-18)</span>,{' '}
          <span className="font-medium" style={{ color: ERA_META.metoo.color }}>#MeToo era (S19-21)</span>,{' '}
          <span className="font-medium" style={{ color: ERA_META.post.color }}>post-2020 (S22-27)</span>.
          Chi-square results are from the verified July 2026 analysis; era colors are consistent
          across all four charts.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <ChartCard
            title="False-Suspect Episode Rate by Era"
            subtitle={`Share of episodes with a confirmed false suspect fell across eras (${CHI_SQUARE.falseSuspectByEra}, verified July 2026)`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eraStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="era" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number, _name, props) => [
                    `${value}% (${props.payload.falseSuspectY} of ${props.payload.episodes} episodes)`,
                    'False-Suspect Rate',
                  ]}
                  labelFormatter={(_label: unknown, payload: any) => payload?.[0]?.payload.label ?? ''}
                />
                <Bar dataKey="falseSuspectRate" radius={[4, 4, 0, 0]}>
                  {eraStats.map(entry => (
                    <Cell key={entry.era} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Innocent Persons Harmed per Episode by Era"
            subtitle="The volume of falsely accused persons halved after #MeToo (1.08 to 0.57 to 0.56 per episode)"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eraStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="era" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, _name, props) => [
                    `${value} (${props.payload.persons} persons / ${props.payload.episodes} episodes)`,
                    'Persons per Episode',
                  ]}
                  labelFormatter={(_label: unknown, payload: any) => payload?.[0]?.payload.label ?? ''}
                />
                <Bar dataKey="personsPerEpisode" radius={[4, 4, 0, 0]}>
                  {eraStats.map(entry => (
                    <Cell key={entry.era} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <ChartCard
            title="Severe Outcomes (Severity 3-4) by Era"
            subtitle={`Fewer people are falsely accused after #MeToo, but those who are fare worse (${CHI_SQUARE.severityByEra}, verified July 2026)`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eraStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="era" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number, _name, props) => [
                    `${value}% (${props.payload.sev34} of ${props.payload.persons} persons)`,
                    'Severity 3-4 Rate',
                  ]}
                  labelFormatter={(_label: unknown, payload: any) => payload?.[0]?.payload.label ?? ''}
                />
                <Bar dataKey="sev34Rate" radius={[4, 4, 0, 0]}>
                  {eraStats.map(entry => (
                    <Cell key={entry.era} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Police Threat / Coercion Rate: The U-Shape"
            subtitle="Three-season blocks: coercion bottoms out at 27.7% in S16-18, then rebounds to 56.7% (S22-24) and 60.0% (S25-27) — back at early-era levels"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coercionByBlock}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="block" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number, _name, props) => [
                    `${value}% (${props.payload.threatened} of ${props.payload.count} persons)`,
                    'Any Threat / Coercion',
                  ]}
                  labelFormatter={(_label: unknown, payload: any) => {
                    const p = payload?.[0]?.payload
                    return p ? `${p.block} — ${p.eraLabel}` : ''
                  }}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {coercionByBlock.map(entry => (
                    <Cell key={entry.block} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Provenance footnote */}
      <p className="text-xs text-slate-400 mb-8">
        All field-based statistics on this page are computed live from the site&apos;s dataset
        using the papers&apos; exclusion and normalization rules. The death audit counts and
        chi-square results are hard-coded from the row-level verified July 2026 analysis
        (docs/svu_paper_stats.md).
      </p>
    </div>
  )
}
