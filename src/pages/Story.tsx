/**
 * Story Page (/story)
 *
 * Interactive presentation walking through key findings.
 * Features animated slides with charts and insights.
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
import { usePersons, useStats } from '../hooks/useData'
import { getSeverityColor, formatSeverity, formatRole, formatThreatType, formatAccusationOrigin } from '../utils/formatters'

interface Slide {
  id: string
  title: string
  subtitle: string
  insight: string
  chartType: 'bar' | 'pie' | 'line' | 'stat' | 'intro' | 'outro'
  color?: string
}

const SLIDES: Slide[] = [
  {
    id: 'intro',
    title: 'SVU False Accusation Analysis',
    subtitle: '576 Episodes. 27 Seasons. 541 Lives Harmed.',
    insight: 'An exploration of how Law & Order: SVU depicts innocent people being accused and the consequences they face.',
    chartType: 'intro',
  },
  {
    id: 'stats',
    title: 'The Scale of False Accusations',
    subtitle: 'Nearly 60% of episodes feature someone falsely accused',
    insight: '344 out of 576 episodes contain at least one person who is suspected or accused and later shown to be innocent.',
    chartType: 'stat',
  },
  {
    id: 'severity',
    title: 'How Severe Are the Consequences?',
    subtitle: 'Most falsely accused suffer serious harm',
    insight: '62% of cases result in material sanctions (firing, arrest, divorce) or life-altering outcomes (suicide, murder, permanent harm).',
    chartType: 'pie',
  },
  {
    id: 'trend',
    title: 'Getting Worse Over Time',
    subtitle: 'Severity has increased across 27 seasons',
    insight: 'Average severity rose from 2.61 in early seasons (1-9) to 2.93 in later seasons (19-27) — a 12% increase.',
    chartType: 'line',
  },
  {
    id: 'role',
    title: 'Initial Suspects Fare Worst',
    subtitle: 'Being the first suspect carries higher risk',
    insight: 'Initial suspects average 2.98 severity vs 2.44 for red herrings — 22% worse outcomes for those first accused.',
    chartType: 'bar',
    color: '#8b5cf6',
  },
  {
    id: 'origin',
    title: 'Fabricated Claims Are Most Damaging',
    subtitle: 'Knowingly false accusations lead to worst outcomes',
    insight: 'Fabricated accusations average 3.24 severity vs 2.51 for squad inference — deliberately false claims cause 29% more harm.',
    chartType: 'bar',
    color: '#ef4444',
  },
  {
    id: 'apology',
    title: 'Threats, But No Apologies',
    subtitle: 'Verbal threats correlate with lowest apology rates',
    insight: 'When police use verbal threats, only 2.7% of falsely accused receive any apology — the lowest rate of all conduct types.',
    chartType: 'bar',
    color: '#22c55e',
  },
  {
    id: 'physical',
    title: 'The Ultimate Price',
    subtitle: 'False accusations can be fatal',
    insight: '94 cases resulted in physical harm. 14 people were murdered. 6 died by suicide. All because of accusations they didn\'t deserve.',
    chartType: 'bar',
    color: '#dc2626',
  },
  {
    id: 'outro',
    title: 'Explore the Data',
    subtitle: 'Dive deeper into the analysis',
    insight: 'Browse episodes, explore correlations, and discover patterns in how SVU portrays false accusations.',
    chartType: 'outro',
  },
]

export default function Story() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const navigate = useNavigate()
  const persons = usePersons()
  const stats = useStats()

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
            <div className="text-6xl sm:text-8xl font-bold text-indigo-600 mb-4">541</div>
            <div className="text-xl sm:text-2xl text-slate-600">Lives Harmed by False Accusations</div>
            <div className="text-sm text-slate-400 mt-4">Press → or tap to continue</div>
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
              onClick={() => navigate('/analysis')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Explore Analysis
            </button>
            <button
              onClick={() => navigate('/episodes')}
              className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-medium"
            >
              Browse Episodes
            </button>
            <button
              onClick={() => navigate('/')}
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
