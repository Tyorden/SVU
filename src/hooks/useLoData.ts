/**
 * Data Hooks for Law & Order False Accusation Analysis
 *
 * Mirror of useData.ts but for Law & Order (original series) data.
 * 314 episodes, 429 persons harmed.
 */

import { useMemo } from 'react'
import episodesData from '../data/lo_episodes.json'
import personsData from '../data/lo_persons.json'

export interface LoEpisode {
  custom_id: string
  season: string
  episode_number: string
  episode_title: string
  air_date: string
  source_notes: string
  has_false_suspect: string
  has_public_exposure: string
  needs_deep_review: string
  summary: string
}

export interface LoPerson {
  custom_id: string
  season: string
  episode_number: string
  episode_title: string
  person_id_in_episode: string
  person_label: string
  role_in_plot: string
  accused_of: string
  innocence_status: string
  accusation_origin: string
  exposure_channel: string
  exposure_who_told: string
  consequence_category: string
  consequence_detail: string
  consequence_severity: string
  police_conduct_threat: string
  police_conduct_quote: string
  prosecutorial_conduct: string
  police_apology: string
  prosecutorial_apology: string
  quote_or_scene: string
  screen_evidence: string
  confidence: string
  tags: string
  notes: string
}

export function useLoEpisodes(): LoEpisode[] {
  return useMemo(() => episodesData as LoEpisode[], [])
}

export function useLoPersons(): LoPerson[] {
  return useMemo(() => personsData as LoPerson[], [])
}

export function useLoEpisode(id: string): LoEpisode | undefined {
  const episodes = useLoEpisodes()
  return useMemo(() => episodes.find(e => e.custom_id === id), [episodes, id])
}

export function useLoPersonsByEpisode(episodeId: string): LoPerson[] {
  const persons = useLoPersons()
  return useMemo(
    () => persons.filter(p => p.custom_id === episodeId),
    [persons, episodeId]
  )
}

export function useLoStats() {
  const episodes = useLoEpisodes()
  const persons = useLoPersons()

  return useMemo(() => {
    const totalEpisodes = episodes.length
    const totalPersons = persons.length
    const falseSuspectEpisodes = episodes.filter(e => e.has_false_suspect === 'Y').length
    const publicExposureEpisodes = episodes.filter(e => e.has_public_exposure === 'Y').length
    const falseSuspectRate = (falseSuspectEpisodes / totalEpisodes * 100).toFixed(1)
    const publicExposureRate = (publicExposureEpisodes / totalEpisodes * 100).toFixed(1)

    return {
      totalEpisodes,
      totalPersons,
      falseSuspectEpisodes,
      publicExposureEpisodes,
      falseSuspectRate,
      publicExposureRate,
    }
  }, [episodes, persons])
}
