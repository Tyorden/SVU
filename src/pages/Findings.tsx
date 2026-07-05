/**
 * Findings Page (/findings)
 *
 * Publication-grade verified findings (computed July 2026) surfaced from
 * docs/svu_paper_stats_v2.md and the two academic papers.
 *
 * Analysis set: n = 521 persons — the 541-row dataset minus 5 persons coded
 * `actually_guilty` and minus 15 phantom rows from 9 episodes whose source
 * transcripts were found (July 2026 ground-truth audit, docs/revision_spec.md
 * section 4B) to be duplicates of other episodes' scripts. Episode-level rates
 * use the corrected 567-episode denominator (576 minus the 9 corrupted
 * episodes). The Episodes/Analysis pages display the full raw dataset; this
 * page applies the papers' exclusion rules so every statistic matches the
 * publication numbers.
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
 *   (innocence_status !== 'actually_guilty'; the 9 corrupted episodes'
 *   phantom rows dropped; victim_misID → victim_ID; third_party →
 *   witness_misID), so charts stay live-data-driven.
 * - Only the row-audited death counts and the chi-square test results are
 *   hard-coded: they required manual row-by-row verification (free-text
 *   keyword matching overcounts deaths) and inferential computation that is
 *   not reproducible from the JSON fields alone. Both are labeled as
 *   adjudicated/verified July 2026.
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

// === Paper rules (mirror docs/svu_paper_stats_v2.md) ===

/**
 * Source-corruption exclusion (July 2026 ground-truth audit, revision_spec
 * section 4B): these 9 episodes carry the WRONG transcript in the source
 * Excel — a duplicate of another episode's script — so their coded flags and
 * person rows describe a different episode's content. Their 15 person rows
 * are phantoms and are dropped from the person-level analysis set; the
 * episodes themselves are dropped from the episode-level denominator
 * (576 → 567).
 */
const CORRUPTED_EPISODE_IDS = new Set([
  'svu_s01_e13', // contains S01E15 'Entitled'
  'svu_s02_e11', // contains S02E10
  'svu_s02_e18', // contains S02E19
  'svu_s04_e10', // contains S04E23
  'svu_s05_e04', // contains S06E14
  'svu_s05_e14', // contains S12E10
  'svu_s08_e11', // contains S18E08
  'svu_s09_e19', // contains S26E19
  'svu_s11_e09', // contains S26E08
])

/** Expected corrected analysis-set size (541 − 5 actually_guilty − 15 phantoms). */
const EXPECTED_N = 521

/** Exclusion rule: drop the 5 rows coded actually_guilty (541 → 536 → 521 with phantoms removed). */
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

// === Hard-coded, row-level adjudicated numbers (July 2026) ===
// Final adjudicated death-audit numbers: every row was adjudicated against
// the source transcripts (docs/revision_spec.md section 4B / stats v2 A9)
// because naive keyword matching on the free-text fields overcounts deaths
// (e.g. `arrested_for_wrong_murder`, `suicide_attempt`, `suicide_watch`,
// `family_murdered` all match death keywords without being deaths of the
// accused person). Do not recompute these from tags.
const DEATH_AUDIT = {
  totalDeaths: 32,
  deathEpisodes: 31,
  deathEpisodeRate: '5.4%',
  murdered: 21, // incl. 2 in custody; 1 killed by police (Terrence Reynolds S17E05)
  murderedInCustody: 2, // Russell Ramsay S02E08, Manny Montero S15E13
  suicides: 9,
  otherDeaths: 2, // 1 overdose (Leon Tate S03E04); 1 died of AIDS contracted during wrongful imprisonment (Ricky Torres S21E06)
  suicideAttempts: 8, // survived (all structured)
  nonFatalAttacks: 31, // 28 structured + 3 notes-only; incl. 4 police woundings + 1 fired-upon
  apologiesInDeathCases: 5,
}

const DEATH_BREAKDOWN = [
  { category: 'Murdered', count: DEATH_AUDIT.murdered, fatal: true },
  { category: 'Completed suicide', count: DEATH_AUDIT.suicides, fatal: true },
  { category: 'Other death (overdose / AIDS)', count: DEATH_AUDIT.otherDeaths, fatal: true },
  { category: 'Suicide attempt (survived)', count: DEATH_AUDIT.suicideAttempts, fatal: false },
  { category: 'Non-fatal assault / attack', count: DEATH_AUDIT.nonFatalAttacks, fatal: false },
]

// Hard-coded inferential results (Pearson chi-square, recomputed July 2026 on
// the corrected analysis set: N = 567 episodes / n = 521 persons).
const CHI_SQUARE = {
  falseSuspectByEra: 'chi-square(2) = 20.89, p < .001, N = 567',
  severityByEra: 'chi-square(2) = 8.06, p = .018',
  coercionByEra: 'pooled chi-square(2) = 5.30, p = .071, n.s.',
}

export default function Findings() {
  const persons = usePersons()
  const episodes = useEpisodes()

  // The papers' corrected analysis set: 541 rows minus 5 actually_guilty
  // minus 15 phantom rows from the 9 wrong-transcript episodes = 521.
  const innocent = useMemo(() => {
    const rows = persons.filter(
      p => isInnocent(p.innocence_status) && !CORRUPTED_EPISODE_IDS.has(p.custom_id)
    )
    if (persons.length > 0 && rows.length !== EXPECTED_N) {
      console.warn(
        `Findings: corrected analysis set is n=${rows.length}, expected n=${EXPECTED_N}. ` +
          'Rendered statistics may not match docs/svu_paper_stats_v2.md.'
      )
    }
    return rows
  }, [persons])
  const n = innocent.length

  // Corrected episode-level denominator: 576 minus the 9 corrupted episodes = 567.
  const validEpisodes = useMemo(
    () => episodes.filter(e => !CORRUPTED_EPISODE_IDS.has(e.custom_id)),
    [episodes]
  )

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
    if (!media || !policeOnly || policeOnly.sev4 === 0) return { media, policeOnly, multiplier: '—' }
    // Ratio of the unrounded proportions (39/86 vs 12/142 = 5.4x), not of the
    // display-rounded rates, so the multiplier matches the papers.
    const ratio = (media.sev4 / media.count) / (policeOnly.sev4 / policeOnly.count)
    return { media, policeOnly, multiplier: `${ratio.toFixed(1)}x` }
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
      const eraEpisodes = validEpisodes.filter(e => getEra(parseInt(e.season)) === era)
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
  }, [validEpisodes, innocent])

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
          5 persons coded <span className="font-mono text-[11px] sm:text-xs">actually_guilty</span>{' '}
          and minus 15 rows from 9 episodes whose source transcripts were found (July 2026
          ground-truth audit) to be duplicates of other episodes&apos; scripts — their coded rows
          describe a different episode&apos;s content. Episode-level rates likewise use the
          corrected 567-episode denominator (576 minus the 9 corrupted episodes). A further known
          source limitation: 145 of the 576 transcripts are truncated at Excel&apos;s 32,767-character
          cell limit (mostly Seasons 1-18), which can only undercount early-era harms and
          apologies. The Episodes and Analysis pages on this site still display the full raw
          dataset; this page applies the papers&apos; exclusion rules, so differences from those
          pages are expected and intentional.
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
            keywords without being deaths of the accused person. Every count below is row-level
            adjudicated against the source transcripts (July 2026).
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
            subtitle={`${DEATH_AUDIT.murderedInCustody} killed in custody; 1 killed by police: Terrence Reynolds (S17E05)`}
            color="red"
          />
          <StatCard
            title="Completed Suicides"
            value={DEATH_AUDIT.suicides}
            subtitle={`Plus ${DEATH_AUDIT.otherDeaths} other deaths: 1 overdose (S03E04), 1 died of AIDS contracted during wrongful imprisonment (S21E06)`}
            color="purple"
          />
          <StatCard
            title="Apologies in Death Cases"
            value={DEATH_AUDIT.apologiesInDeathCases}
            subtitle={`Police apologized in ${DEATH_AUDIT.apologiesInDeathCases} of the ${DEATH_AUDIT.totalDeaths} death cases`}
            color="yellow"
          />
        </div>

        <ChartCard
          title="Row-Adjudicated Physical Harm Breakdown"
          subtitle={`${DEATH_AUDIT.totalDeaths} deaths (dark red), plus ${DEATH_AUDIT.suicideAttempts} survived suicide attempts and ${DEATH_AUDIT.nonFatalAttacks} non-fatal attacks (28 structured + 3 notes-only, incl. 4 police woundings + 1 fired-upon) counted separately (orange)`}
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
          subtitle="Who first pointed the finger at each of the 521 innocent persons — the squad's own inference leads at 54.5%"
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
            inference accounts for 54.5% of cases, while genuine victim misidentification is 18.0%.
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
            subtitle="The volume of falsely accused persons roughly halved after #MeToo (1.06 to 0.57 to 0.56 per episode)"
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
            subtitle={`Three-season blocks: coercion bottoms out at 27.7% in S16-18, then rebounds to 56.7% (S22-24) and 60.0% (S25-27) — back at early-era levels (${CHI_SQUARE.coercionByEra}, verified July 2026)`}
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
        using the papers&apos; exclusion and normalization rules (actually_guilty rows and the
        15 phantom rows from the 9 wrong-transcript episodes removed). The death audit counts
        and chi-square results are hard-coded from the row-level adjudicated July 2026 analysis
        (docs/svu_paper_stats_v2.md).
      </p>
    </div>
  )
}
