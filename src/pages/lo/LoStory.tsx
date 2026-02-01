/**
 * Law & Order Story Page (/lo/story)
 *
 * Interactive presentation walking through key findings for L&O (original series).
 * Mirror of SVU Story page with L&O-specific data and insights.
 *
 * Key differences from SVU:
 * - 314 episodes, 429 persons harmed (partial seasons: 1-9, 11, 13, 16-17, 19-23)
 * - Murder dominates (72% of accusations) vs SVU's sex crimes
 * - Includes prosecutorial_conduct analysis (unique to L&O)
 * - Higher false accusation rate: 72.3% vs SVU 59.7%
 * - Courtroom exposure is a major channel (21%)
 * - Squad inference accounts for 62% of accusation origins
 *
 * Navigation:
 * - Arrow keys or swipe to navigate
 * - Click dots or buttons for direct navigation
 * - Auto-play option available
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { useLoPersons, useLoStats } from '../../hooks/useLoData'
import {
  getSeverityColor,
  formatSeverity,
  formatRole,
  formatThreatType,
  formatAccusationOrigin,
} from '../../utils/formatters'

interface Slide {
  id: string
  title: string
  subtitle: string
  insight: string
  detail?: string
  chartType: 'bar' | 'pie' | 'line' | 'stat' | 'intro' | 'outro' | 'legend'
  color?: string
}

const SLIDES: Slide[] = [
  {
    id: 'intro',
    title: 'Law & Order False Accusation Analysis',
    subtitle: '314 Episodes. 429 Lives Harmed.',
    insight: 'An exploration of how Law & Order depicts innocent people being accused of crimes — primarily murder — and the consequences they face across partial seasons (1-9, 11, 13, 16-17, 19-23).',
    chartType: 'intro',
  },
  {
    id: 'stats',
    title: 'The Scale of False Accusations',
    subtitle: 'Over 72% of episodes feature someone falsely accused',
    insight: 'Law & Order has a higher false accusation rate than SVU (72.3% vs 59.7%). In a show built around the pursuit of justice, the innocent are caught in the crossfire far more often than you might expect.',
    chartType: 'stat',
  },
  {
    id: 'severity-explain',
    title: 'Understanding the Severity Scale',
    subtitle: 'How we measured harm to the falsely accused',
    insight: 'Each case was rated 1-4 based on the consequences the innocent person faced:',
    detail: 'Level 1 (Low): Private questioning, short-term discomfort. Level 2 (Public): Accused in front of colleagues, family, or media. Level 3 (Material): Fired, arrested, divorced, or custody loss. Level 4 (Life-Altering): Suicide, murder, severe injury, or permanent harm.',
    chartType: 'legend',
  },
  {
    id: 'severity',
    title: 'How Severe Are the Consequences?',
    subtitle: 'Murder accusations carry heavy consequences',
    insight: 'When you are falsely accused of murder rather than a sex crime, the stakes are immediately higher. Law & Order\'s falsely accused face arrest, indictment, and trial more frequently than SVU\'s.',
    chartType: 'pie',
  },
  {
    id: 'trend',
    title: 'Severity Across Seasons',
    subtitle: 'How harm to the falsely accused changed over time',
    insight: 'Law & Order\'s severity patterns reflect the show\'s evolution across its long run, with partial season coverage providing snapshots across different eras of the series.',
    chartType: 'line',
  },
  {
    id: 'role',
    title: 'Initial Suspects vs Red Herrings',
    subtitle: 'Being the first suspect carries higher risk',
    insight: 'Initial suspects — the first person the squad pursues — consistently face worse outcomes than red herrings introduced to mislead the investigation.',
    detail: 'In a murder investigation, being named first often means arrest and arraignment before the real killer is found.',
    chartType: 'bar',
    color: '#8b5cf6',
  },
  {
    id: 'origin',
    title: 'Squad Inference Dominates',
    subtitle: '62% of false accusations originate from detective theories',
    insight: 'Unlike SVU where victim identification plays a larger role, Law & Order\'s false accusations overwhelmingly stem from squad inference — detectives building theories based on proximity, motive, and prior record.',
    detail: 'This reflects the show\'s procedural structure: detectives form a theory, build a case, hand it to the DA — and sometimes they are wrong.',
    chartType: 'bar',
    color: '#ef4444',
  },
  {
    id: 'threats-explain',
    title: 'Understanding Police Conduct',
    subtitle: 'How detectives treat the accused',
    insight: 'We tracked how Law & Order detectives treated the falsely accused during interrogations and interactions:',
    detail: 'Verbal Threats: "We\'ll bury you," "We know you did it," explicit threats of punishment. Coercive Tactics: False evidence claims, promises, deception to get confessions. Insults/Degradation: Name-calling or moral condemnation. None: Professional conduct without threats.',
    chartType: 'legend',
  },
  {
    id: 'prosecutorial-explain',
    title: 'Prosecutorial Conduct',
    subtitle: 'The courtroom side of false accusations',
    insight: 'Unique to Law & Order, we tracked how prosecutors (the DA\'s office) handled cases involving the falsely accused. The show\'s "order" half means many innocent people face the full weight of prosecution.',
    detail: 'Overreach: Pursuing charges beyond what evidence supports. Misconduct: Deliberate ethical violations like withholding evidence. Zealous but Fair: Aggressive prosecution within ethical bounds. Dropped Appropriately: Recognizing error and dismissing charges correctly.',
    chartType: 'legend',
  },
  {
    id: 'apology',
    title: 'Threats, But No Apologies',
    subtitle: 'Verbal threats correlate with lowest apology rates',
    insight: 'When Law & Order detectives use verbal threats against the falsely accused, apology rates are at their lowest. Those who are threatened most aggressively are apologized to least.',
    detail: 'The combination of police threats and prosecutorial pressure means many falsely accused in Law & Order never receive any acknowledgment of their wrongful treatment.',
    chartType: 'bar',
    color: '#22c55e',
  },
  {
    id: 'physical',
    title: 'The Ultimate Price',
    subtitle: 'False accusations can be fatal',
    insight: 'Being falsely accused of murder in Law & Order can itself become a death sentence. Innocent people are murdered, driven to suicide, or physically attacked as a direct result of wrongful accusations.',
    detail: 'These are severity level 4 outcomes — lives destroyed or ended due to wrongful suspicion in a system designed to find truth.',
    chartType: 'bar',
    color: '#dc2626',
  },
  {
    id: 'outro',
    title: 'Explore the Data',
    subtitle: 'Dive deeper into the Law & Order analysis',
    insight: 'Browse episodes, explore correlations, and discover patterns in how Law & Order portrays false accusations across its run.',
    chartType: 'outro',
  },
]

export default function LoStory() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const persons = useLoPersons()
  const stats = useLoStats()

  // Compute chart data
  const severityData = useMemo(() => {
    const counts: Record<string, number> = {}
    persons.forEach(p => {
      const sev = p.consequence_severity || 'unknown'
      counts[sev] = (counts[sev] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([key]) => ['1', '2', '3', '4'].includes(key))
      .map(([severity, count]) => ({
        name: formatSeverity(severity),
        value: count,
        severity,
      }))
      .sort((a, b) => Number(a.severity) - Number(b.severity))
  }, [persons])

  const severityTrend = useMemo(() => {
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
      }))
      .sort((a, b) => parseInt(a.season.slice(1)) - parseInt(b.season.slice(1)))
  }, [persons])

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
      }))
      .sort((a, b) => b.avgSeverity - a.avgSeverity)
  }, [persons])

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
      .filter(([_, data]) => data.total >= 5)
      .map(([origin, data]) => ({
        origin: formatAccusationOrigin(origin),
        avgSeverity: parseFloat((data.sum / data.total).toFixed(2)),
      }))
      .sort((a, b) => b.avgSeverity - a.avgSeverity)
  }, [persons])

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
      }))
      .sort((a, b) => b.apologyRate - a.apologyRate)
  }, [persons])

  const physicalHarmData = useMemo(() => {
    const counts: Record<string, number> = {
      'Murdered': 0,
      'Suicide': 0,
      'Assaulted': 0,
      'Vigilante Attack': 0,
    }
    persons.forEach(p => {
      const detail = (p.consequence_detail || '').toLowerCase()
      const tags = (p.tags || '').toLowerCase()
      if (detail.includes('murder') || tags.includes('murdered')) counts['Murdered']++
      else if (detail.includes('suicide') || tags.includes('suicide')) counts['Suicide']++
      else if (detail.includes('vigilante')) counts['Vigilante Attack']++
      else if (detail.includes('assault') || tags.includes('assault')) counts['Assaulted']++
    })
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }, [persons])

  // Navigation
  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1)
    } else {
      setIsPlaying(false)
    }
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1)
    }
  }, [currentSlide, goToSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'Escape') {
        setIsPlaying(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(timer)
  }, [isPlaying, nextSlide])

  const slide = SLIDES[currentSlide]

  const renderChart = () => {
    switch (slide.chartType) {
      case 'intro':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-6xl sm:text-8xl font-bold text-indigo-600 mb-4">429</div>
            <div className="text-xl sm:text-2xl text-slate-600">Lives Harmed by False Accusations</div>
            <div className="text-sm text-slate-400 mt-2">314 episodes across partial seasons</div>
            <div className="text-sm text-slate-400 mt-4">Press &rarr; or tap to continue</div>
          </div>
        )

      case 'stat':
        return (
          <div className="grid grid-cols-2 gap-4 h-full items-center px-4">
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <div className="text-4xl sm:text-5xl font-bold text-indigo-600">{stats.falseSuspectRate}%</div>
              <div className="text-sm text-slate-600 mt-2">Episodes with False Suspects</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-4xl sm:text-5xl font-bold text-purple-600">{stats.publicExposureRate}%</div>
              <div className="text-sm text-slate-600 mt-2">Episodes with Public Exposure</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-4xl sm:text-5xl font-bold text-red-600">{stats.totalPersons}</div>
              <div className="text-sm text-slate-600 mt-2">Total Persons Harmed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600">{stats.totalEpisodes}</div>
              <div className="text-sm text-slate-600 mt-2">Episodes Analyzed</div>
            </div>
          </div>
        )

      case 'legend':
        if (slide.id === 'severity-explain') {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full items-center px-4">
              <div className="p-4 rounded-xl border-l-4" style={{ borderLeftColor: '#22c55e', backgroundColor: '#22c55e10' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                  <span className="font-bold text-slate-800">Level 1: Low Harm</span>
                </div>
                <p className="text-sm text-slate-600">Private questioning, short-term discomfort, no public exposure</p>
              </div>
              <div className="p-4 rounded-xl border-l-4" style={{ borderLeftColor: '#eab308', backgroundColor: '#eab30810' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }} />
                  <span className="font-bold text-slate-800">Level 2: Public Exposure</span>
                </div>
                <p className="text-sm text-slate-600">Accused in front of colleagues, family, school, or media</p>
              </div>
              <div className="p-4 rounded-xl border-l-4" style={{ borderLeftColor: '#f97316', backgroundColor: '#f9731610' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }} />
                  <span className="font-bold text-slate-800">Level 3: Material Sanction</span>
                </div>
                <p className="text-sm text-slate-600">Fired, suspended, arrested, divorced, custody loss, evicted</p>
              </div>
              <div className="p-4 rounded-xl border-l-4" style={{ borderLeftColor: '#ef4444', backgroundColor: '#ef444410' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }} />
                  <span className="font-bold text-slate-800">Level 4: Life-Altering/Death</span>
                </div>
                <p className="text-sm text-slate-600">Suicide, murder, severe injury, permanent child removal</p>
              </div>
            </div>
          )
        } else if (slide.id === 'threats-explain') {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full items-center px-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="font-bold text-red-900 mb-2">Verbal Threats</div>
                <p className="text-sm text-red-800 mb-2">"We'll bury you," "We know you did it"</p>
                <p className="text-xs text-red-700">Explicit threats of punishment or consequences</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <div className="font-bold text-orange-900 mb-2">Coercive Tactics</div>
                <p className="text-sm text-orange-800 mb-2">"Your DNA was at the scene" (when it wasn't)</p>
                <p className="text-xs text-orange-700">Lies, false evidence claims, manipulation</p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <div className="font-bold text-yellow-900 mb-2">Insults/Degradation</div>
                <p className="text-sm text-yellow-800 mb-2">"You're a killer," "People like you"</p>
                <p className="text-xs text-yellow-700">Name-calling and moral condemnation</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <div className="font-bold text-green-900 mb-2">None</div>
                <p className="text-sm text-green-800 mb-2">Professional questioning</p>
                <p className="text-xs text-green-700">No threatening or coercive behavior</p>
              </div>
            </div>
          )
        } else if (slide.id === 'prosecutorial-explain') {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full items-center px-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="font-bold text-red-900 mb-2">Overreach</div>
                <p className="text-sm text-red-800 mb-2">Pursuing charges beyond what evidence supports</p>
                <p className="text-xs text-red-700">The DA pushes for conviction despite weak or contradictory evidence</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <div className="font-bold text-orange-900 mb-2">Misconduct</div>
                <p className="text-sm text-orange-800 mb-2">Deliberate ethical violations</p>
                <p className="text-xs text-orange-700">Withholding exculpatory evidence, witness tampering, Brady violations</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="font-bold text-blue-900 mb-2">Zealous but Fair</div>
                <p className="text-sm text-blue-800 mb-2">Aggressive prosecution within ethical bounds</p>
                <p className="text-xs text-blue-700">Hard-nosed but plays by the rules — the system working as intended</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <div className="font-bold text-green-900 mb-2">Dropped Appropriately</div>
                <p className="text-sm text-green-800 mb-2">Recognized error and dismissed charges</p>
                <p className="text-xs text-green-700">Prosecution course-corrects when innocence becomes clear</p>
              </div>
            </div>
          )
        }
        return null

      case 'pie':
        return (
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
                animationBegin={0}
                animationDuration={1000}
              >
                {severityData.map((entry) => (
                  <Cell key={entry.severity} fill={getSeverityColor(entry.severity)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={severityTrend} margin={{ left: 0, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="season" tick={{ fontSize: 10 }} />
              <YAxis domain={[1, 4]} tick={{ fontSize: 11 }} tickCount={4} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="avgSeverity"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                animationBegin={0}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar': {
        let data: Array<Record<string, string | number>> = []
        let dataKey = 'value'
        let nameKey = 'name'
        if (slide.id === 'role') {
          data = severityByRole
          dataKey = 'avgSeverity'
          nameKey = 'role'
        } else if (slide.id === 'origin') {
          data = severityByOrigin
          dataKey = 'avgSeverity'
          nameKey = 'origin'
        } else if (slide.id === 'apology') {
          data = apologyByThreat
          dataKey = 'apologyRate'
          nameKey = 'threat'
        } else if (slide.id === 'physical') {
          data = physicalHarmData
          dataKey = 'count'
          nameKey = 'type'
        }
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 100, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey={nameKey} type="category" tick={{ fontSize: 11 }} width={95} />
              <Tooltip />
              <Bar
                dataKey={dataKey}
                fill={slide.color || '#6366f1'}
                radius={[0, 4, 4, 0]}
                animationBegin={0}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      }

      case 'outro':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
            <button
              onClick={() => navigate('/lo/analysis')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Explore Analysis
            </button>
            <button
              onClick={() => navigate('/lo/episodes')}
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-medium"
            >
              Browse Episodes
            </button>
            <button
              onClick={() => navigate('/lo')}
              className="px-6 py-3 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Text panel */}
        <div className="lg:w-1/3 p-6 sm:p-8 flex flex-col justify-center bg-slate-50">
          <div
            key={slide.id}
            className="animate-fade-in"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl text-indigo-600 font-medium mb-4">
              {slide.subtitle}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {slide.insight}
            </p>
            {slide.detail && (
              <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed border-t border-slate-200 pt-3">
                {slide.detail}
              </p>
            )}
          </div>
        </div>

        {/* Chart panel */}
        <div className="lg:w-2/3 p-4 sm:p-8 flex items-center justify-center bg-white min-h-[300px] sm:min-h-[400px]">
          <div className="w-full h-64 sm:h-80 lg:h-96">
            {renderChart()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Prev button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                  i === currentSlide
                    ? 'bg-indigo-600 w-4 sm:w-6'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          {/* Play/Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title={isPlaying ? 'Pause' : 'Auto-play'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === SLIDES.length - 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
