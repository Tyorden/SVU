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

import { useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEpisodes, usePersons } from '../hooks/useData'
import FilterPanel from '../components/FilterPanel'
import EpisodeTable from '../components/EpisodeTable'

const ITEMS_PER_PAGE = 25

export default function Episodes() {
  const episodes = useEpisodes()
  const persons = usePersons()
  const [searchParams, setSearchParams] = useSearchParams()

  // Build lookup of episode IDs to severity levels and threat types
  const episodePersonsData = useMemo(() => {
    const lookup: Record<string, { severities: Set<string>; threats: Set<string> }> = {}
    persons.forEach(p => {
      if (!lookup[p.custom_id]) {
        lookup[p.custom_id] = { severities: new Set(), threats: new Set() }
      }
      if (p.consequence_severity) {
        lookup[p.custom_id].severities.add(p.consequence_severity)
      }
      if (p.police_conduct_threat) {
        lookup[p.custom_id].threats.add(p.police_conduct_threat)
      }
    })
    return lookup
  }, [persons])

  // Read filter state from URL
  const seasonFilter = searchParams.get('season') || ''
  const falseSuspectFilter = searchParams.get('suspect') || ''
  const publicExposureFilter = searchParams.get('exposure') || ''
  const reviewFilter = searchParams.get('review') || ''
  const severityFilter = searchParams.get('severity') || ''
  const threatFilter = searchParams.get('threat') || ''
  const searchTerm = searchParams.get('q') || ''
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

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

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      if (seasonFilter && episode.season !== seasonFilter) return false
      if (falseSuspectFilter && episode.has_false_suspect !== falseSuspectFilter) return false
      if (publicExposureFilter && episode.has_public_exposure !== publicExposureFilter) return false
      if (reviewFilter && episode.needs_deep_review !== reviewFilter) return false

      // Severity filter: check if episode has any person with this severity
      if (severityFilter) {
        const epData = episodePersonsData[episode.custom_id]
        if (!epData || !epData.severities.has(severityFilter)) return false
      }

      // Threat filter: check if episode has any person with this threat type
      if (threatFilter) {
        const epData = episodePersonsData[episode.custom_id]
        if (!epData || !epData.threats.has(threatFilter)) return false
      }

      if (
        searchTerm &&
        !episode.episode_title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !episode.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false
      return true
    })
  }, [episodes, seasonFilter, falseSuspectFilter, publicExposureFilter, reviewFilter, severityFilter, threatFilter, searchTerm, episodePersonsData])

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

  const hasActiveFilters = seasonFilter || falseSuspectFilter || publicExposureFilter || reviewFilter || severityFilter || threatFilter || searchTerm

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
