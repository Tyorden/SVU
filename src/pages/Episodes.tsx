/**
 * Episodes Browser Page (/episodes)
 *
 * Searchable and filterable table of all 576 SVU episodes.
 * Filter state is persisted in URL query parameters so it survives navigation.
 *
 * Features:
 * - Text search across title and summary
 * - Filter by season (1-27)
 * - Filter by false suspect status (Y/N/Maybe)
 * - Filter by public exposure status (Y/N/Maybe)
 * - Filter by review needed status
 * - Paginated results (25 per page)
 * - Click row to navigate to episode detail
 * - Filters persist in URL (preserved on back navigation)
 */

import { useMemo, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEpisodes, usePersons } from '../hooks/useData'
import FilterPanel from '../components/FilterPanel'
import EpisodeTable from '../components/EpisodeTable'
import {
  ROLE_IN_PLOT,
  ACCUSATION_ORIGIN,
  ACCUSED_OF,
  INNOCENCE_STATUS,
  EXPOSURE_CHANNEL,
} from '../utils/definitions'

const ITEMS_PER_PAGE = 25

export default function Episodes() {
  const episodes = useEpisodes()
  const persons = usePersons()
  const [searchParams, setSearchParams] = useSearchParams()

  // Build lookup of episode IDs to all person-level data for filtering
  const episodePersonsData = useMemo(() => {
    const lookup: Record<string, {
      severities: Set<string>
      threats: Set<string>
      roles: Set<string>
      origins: Set<string>
      accusedOf: Set<string>
      innocence: Set<string>
      channels: Set<string>
    }> = {}
    persons.forEach(p => {
      if (!lookup[p.custom_id]) {
        lookup[p.custom_id] = {
          severities: new Set(),
          threats: new Set(),
          roles: new Set(),
          origins: new Set(),
          accusedOf: new Set(),
          innocence: new Set(),
          channels: new Set(),
        }
      }
      if (p.consequence_severity) lookup[p.custom_id].severities.add(p.consequence_severity)
      if (p.police_conduct_threat) lookup[p.custom_id].threats.add(p.police_conduct_threat)
      if (p.role_in_plot) lookup[p.custom_id].roles.add(p.role_in_plot)
      if (p.accusation_origin) lookup[p.custom_id].origins.add(p.accusation_origin)
      if (p.accused_of) lookup[p.custom_id].accusedOf.add(p.accused_of)
      if (p.innocence_status) lookup[p.custom_id].innocence.add(p.innocence_status)
      if (p.exposure_channel) lookup[p.custom_id].channels.add(p.exposure_channel)
    })
    return lookup
  }, [persons])

  // Advanced filters state
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Read filter state from URL
  const seasonFilter = searchParams.get('season') || ''
  const falseSuspectFilter = searchParams.get('suspect') || ''
  const publicExposureFilter = searchParams.get('exposure') || ''
  const reviewFilter = searchParams.get('review') || ''
  const severityFilter = searchParams.get('severity') || ''
  const threatFilter = searchParams.get('threat') || ''
  const searchTerm = searchParams.get('q') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // Advanced filters from URL
  const roleFilter = searchParams.get('role') || ''
  const originFilter = searchParams.get('origin') || ''
  const accusedOfFilter = searchParams.get('accusedOf') || ''
  const innocenceFilter = searchParams.get('innocence') || ''
  const channelFilter = searchParams.get('channel') || ''
  const filterLogic = (searchParams.get('logic') || 'and') as 'and' | 'or'

  // Update URL params helper
  const updateParams = useCallback((updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    // Reset to page 1 when filters change (unless page is being set directly)
    if (!('page' in updates)) {
      newParams.delete('page')
    }

    setSearchParams(newParams, { replace: true })
  }, [searchParams, setSearchParams])

  // Filter setters that update URL
  const setSeasonFilter = useCallback((value: string) => {
    updateParams({ season: value })
  }, [updateParams])

  const setFalseSuspectFilter = useCallback((value: string) => {
    updateParams({ suspect: value })
  }, [updateParams])

  const setPublicExposureFilter = useCallback((value: string) => {
    updateParams({ exposure: value })
  }, [updateParams])

  const setReviewFilter = useCallback((value: string) => {
    updateParams({ review: value })
  }, [updateParams])

  const setSeverityFilter = useCallback((value: string) => {
    updateParams({ severity: value })
  }, [updateParams])

  const setThreatFilter = useCallback((value: string) => {
    updateParams({ threat: value })
  }, [updateParams])

  const setSearchTerm = useCallback((value: string) => {
    updateParams({ q: value })
  }, [updateParams])

  // Advanced filter setters
  const setRoleFilter = useCallback((value: string) => {
    updateParams({ role: value })
  }, [updateParams])

  const setOriginFilter = useCallback((value: string) => {
    updateParams({ origin: value })
  }, [updateParams])

  const setAccusedOfFilter = useCallback((value: string) => {
    updateParams({ accusedOf: value })
  }, [updateParams])

  const setInnocenceFilter = useCallback((value: string) => {
    updateParams({ innocence: value })
  }, [updateParams])

  const setChannelFilter = useCallback((value: string) => {
    updateParams({ channel: value })
  }, [updateParams])

  const setFilterLogic = useCallback((value: 'and' | 'or') => {
    updateParams({ logic: value })
  }, [updateParams])

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      // Episode-level filters (always AND logic)
      if (seasonFilter && episode.season !== seasonFilter) return false
      if (falseSuspectFilter && episode.has_false_suspect !== falseSuspectFilter) return false
      if (publicExposureFilter && episode.has_public_exposure !== publicExposureFilter) return false
      if (reviewFilter && episode.needs_deep_review !== reviewFilter) return false

      if (
        searchTerm &&
        !episode.episode_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !episode.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false

      // Person-level filters (support AND/OR logic)
      const epData = episodePersonsData[episode.custom_id]
      const personFilters = [
        { active: !!severityFilter, matches: epData?.severities.has(severityFilter) },
        { active: !!threatFilter, matches: epData?.threats.has(threatFilter) },
        { active: !!roleFilter, matches: epData?.roles.has(roleFilter) },
        { active: !!originFilter, matches: epData?.origins.has(originFilter) },
        { active: !!accusedOfFilter, matches: epData?.accusedOf.has(accusedOfFilter) },
        { active: !!innocenceFilter, matches: epData?.innocence.has(innocenceFilter) },
        { active: !!channelFilter, matches: epData?.channels.has(channelFilter) },
      ]

      const activeFilters = personFilters.filter(f => f.active)
      if (activeFilters.length > 0) {
        if (filterLogic === 'or') {
          // OR: at least one must match
          if (!activeFilters.some(f => f.matches)) return false
        } else {
          // AND: all must match
          if (!activeFilters.every(f => f.matches)) return false
        }
      }

      return true
    })
  }, [episodes, seasonFilter, falseSuspectFilter, publicExposureFilter, reviewFilter, severityFilter, threatFilter, roleFilter, originFilter, accusedOfFilter, innocenceFilter, channelFilter, filterLogic, searchTerm, episodePersonsData])

  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE)

  // Ensure current page is valid
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))

  // Update URL if page is out of bounds
  useEffect(() => {
    if (currentPage !== validCurrentPage && totalPages > 0) {
      updateParams({ page: validCurrentPage.toString() })
    }
  }, [currentPage, validCurrentPage, totalPages, updateParams])

  const paginatedEpisodes = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredEpisodes.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredEpisodes, validCurrentPage])

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const hasActiveFilters = seasonFilter || falseSuspectFilter || publicExposureFilter || reviewFilter || severityFilter || threatFilter || roleFilter || originFilter || accusedOfFilter || innocenceFilter || channelFilter || searchTerm
  const hasAdvancedFilters = roleFilter || originFilter || accusedOfFilter || innocenceFilter || channelFilter

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Episodes Browser</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Browse and filter all {episodes.length} SVU episodes analyzed in this study.
        </p>
      </div>

      <FilterPanel
        seasonFilter={seasonFilter}
        setSeasonFilter={setSeasonFilter}
        falseSuspectFilter={falseSuspectFilter}
        setFalseSuspectFilter={setFalseSuspectFilter}
        publicExposureFilter={publicExposureFilter}
        setPublicExposureFilter={setPublicExposureFilter}
        reviewFilter={reviewFilter}
        setReviewFilter={setReviewFilter}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        threatFilter={threatFilter}
        setThreatFilter={setThreatFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-4 sm:mb-6">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        >
          <span className="font-medium text-slate-700 text-sm sm:text-base">
            Advanced Filters
            {hasAdvancedFilters && <span className="ml-2 text-xs text-indigo-600">(active)</span>}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="p-3 sm:p-4 pt-0 border-t border-slate-100">
            {/* Logic Toggle */}
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-medium text-slate-600">Filter logic:</span>
              <div className="flex rounded-lg overflow-hidden border border-slate-300">
                <button
                  onClick={() => setFilterLogic('and')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    filterLogic === 'and'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  AND
                </button>
                <button
                  onClick={() => setFilterLogic('or')}
                  className={`px-3 py-1 text-xs font-medium transition-colors border-l border-slate-300 ${
                    filterLogic === 'or'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  OR
                </button>
              </div>
              <span className="text-xs text-slate-500">
                {filterLogic === 'and' ? 'Episodes must match ALL filters' : 'Episodes match ANY filter'}
              </span>
            </div>

            {/* Advanced filter dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role in Plot</label>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {Object.entries(ROLE_IN_PLOT).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Accusation Origin</label>
                <select
                  value={originFilter}
                  onChange={e => setOriginFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {Object.entries(ACCUSATION_ORIGIN).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Accused Of</label>
                <select
                  value={accusedOfFilter}
                  onChange={e => setAccusedOfFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {Object.entries(ACCUSED_OF).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Innocence Status</label>
                <select
                  value={innocenceFilter}
                  onChange={e => setInnocenceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {Object.entries(INNOCENCE_STATUS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Exposure Channel</label>
                <select
                  value={channelFilter}
                  onChange={e => setChannelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All</option>
                  {Object.entries(EXPOSURE_CHANNEL).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-slate-600">
          Showing {paginatedEpisodes.length} of {filteredEpisodes.length} episodes
          {filteredEpisodes.length !== episodes.length && ` (filtered from ${episodes.length} total)`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <EpisodeTable
        episodes={paginatedEpisodes}
        currentPage={validCurrentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
