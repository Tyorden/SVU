/**
 * Episodes Browser Page (/episodes)
 *
 * Searchable and filterable table of all 576 SVU episodes.
 *
 * Features:
 * - Text search across title and summary
 * - Filter by season (1-27)
 * - Filter by false suspect status (Y/N/Maybe)
 * - Filter by public exposure status (Y/N/Maybe)
 * - Filter by review needed status
 * - Paginated results (25 per page)
 * - Click row to navigate to episode detail
 */

import { useState, useMemo } from 'react'
import { useEpisodes } from '../hooks/useData'
import FilterPanel from '../components/FilterPanel'
import EpisodeTable from '../components/EpisodeTable'

const ITEMS_PER_PAGE = 25

export default function Episodes() {
  const episodes = useEpisodes()

  const [seasonFilter, setSeasonFilter] = useState('')
  const [falseSuspectFilter, setFalseSuspectFilter] = useState('')
  const [publicExposureFilter, setPublicExposureFilter] = useState('')
  const [reviewFilter, setReviewFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
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
      return true
    })
  }, [episodes, seasonFilter, falseSuspectFilter, publicExposureFilter, reviewFilter, searchTerm])

  const totalPages = Math.ceil(filteredEpisodes.length / ITEMS_PER_PAGE)
  const paginatedEpisodes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredEpisodes.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredEpisodes, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [seasonFilter, falseSuspectFilter, publicExposureFilter, reviewFilter, searchTerm])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Episodes Browser</h1>
        <p className="text-slate-600 mt-2">
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="mb-4 text-sm text-slate-600">
        Showing {paginatedEpisodes.length} of {filteredEpisodes.length} episodes
        {filteredEpisodes.length !== episodes.length && ` (filtered from ${episodes.length} total)`}
      </div>

      <EpisodeTable
        episodes={paginatedEpisodes}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
