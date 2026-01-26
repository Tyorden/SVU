/**
 * Data Hooks for SVU False Accusation Analysis
 *
 * This module provides React hooks for accessing and computing statistics
 * from the SVU episode and persons harmed datasets.
 *
 * Data Sources:
 * - episodes.json: 576 episodes from seasons 1-27
 * - persons.json: 541 individuals falsely accused or harmed
 */

import { useMemo } from 'react'
import episodesData from '../data/episodes.json'
import personsData from '../data/persons.json'

/**
 * Episode data structure from svu_episodes_summary.csv
 * Contains episode-level metadata and analysis flags
 */
export interface Episode {
  /** Unique identifier in format svu_sXX_eXX */
  custom_id: string
  /** Season number (1-27) */
  season: string
  /** Episode number within season */
  episode_number: string
  /** Episode title */
  episode_title: string
  /** Whether episode contains false suspects (Y/N/Maybe) */
  has_false_suspect: string
  /** Whether episode has public exposure of innocent person (Y/N/Maybe) */
  has_public_exposure: string
  /** Flag for episodes needing additional review (Y/N) */
  needs_deep_review: string
  /** Narrative summary of episode's false accusation content */
  summary: string
}

/**
 * Person data structure from svu_persons_harmed.csv
 * Contains detailed information about each falsely accused individual
 */
export interface Person {
  /** Episode identifier (matches Episode.custom_id) */
  custom_id: string
  /** Season number */
  season: string
  /** Episode number */
  episode_number: string
  /** Episode title */
  episode_title: string
  /** Person's index within episode (for multiple persons per episode) */
  person_id_in_episode: string
  /** Character name or description */
  person_label: string
  /** Role in plot: initial_suspect, red_herring, family_member, colleague, etc. */
  role_in_plot: string
  /** Crime type accused of: rape, CSA, assault, murder, etc. */
  accused_of: string
  /** Innocence status: proven_innocent, strongly_implied_innocent, partially_involved */
  innocence_status: string
  /** How accusation originated: victim_ID, witness_misID, squad_inference, tech_db_error, fabrication */
  accusation_origin: string
  /** Whether person had preexisting allegations */
  preexisting_allegation: string
  /** Mode of accusation: public_confrontation, private_interview, etc. */
  accusation_mode: string
  /** Who was present during accusation */
  audience_present: string
  /** Channel of public exposure: media, workplace, family, police_only, multiple */
  exposure_channel: string
  /** Who exposed the person: squad, victim, third_party, media */
  exposure_who_told: string
  /** Category of consequence: legal, work, family, social, physical, multiple */
  consequence_category: string
  /** Detailed description of consequence */
  consequence_detail: string
  /** Severity rating 1-4 (1=low harm, 4=life-altering/death) */
  consequence_severity: string
  /** Police conduct threat type: none, verbal_threat, coercive_tactic, insult_degradation, multiple */
  police_conduct_threat: string
  /** Quote demonstrating police conduct */
  police_conduct_quote: string
  /** Whether police apologized: none, partial, formal */
  police_apology: string
  /** Notable quote or scene from episode */
  quote_or_scene: string
  /** Whether evidence was shown on screen */
  screen_evidence: string
  /** Confidence level in tagging: high, medium, low */
  confidence: string
  /** Semicolon-separated tags for additional categorization */
  tags: string
  /** Additional notes about the case */
  notes: string
}

/**
 * Hook to access all episodes data
 * @returns Array of all 576 episodes
 */
export function useEpisodes(): Episode[] {
  return useMemo(() => episodesData as Episode[], [])
}

/**
 * Hook to access all persons harmed data
 * @returns Array of all 541 persons
 */
export function usePersons(): Person[] {
  return useMemo(() => personsData as Person[], [])
}

/**
 * Hook to find a specific episode by ID
 * @param id - Episode custom_id (e.g., "svu_s01_e01")
 * @returns Episode object or undefined if not found
 */
export function useEpisode(id: string): Episode | undefined {
  const episodes = useEpisodes()
  return useMemo(() => episodes.find(e => e.custom_id === id), [episodes, id])
}

/**
 * Hook to find all persons harmed in a specific episode
 * @param episodeId - Episode custom_id
 * @returns Array of persons from that episode
 */
export function usePersonsByEpisode(episodeId: string): Person[] {
  const persons = usePersons()
  return useMemo(
    () => persons.filter(p => p.custom_id === episodeId),
    [persons, episodeId]
  )
}

/**
 * Hook to compute summary statistics for the dashboard
 * @returns Object containing key metrics about the dataset
 */
export function useStats() {
  const episodes = useEpisodes()
  const persons = usePersons()

  return useMemo(() => {
    const totalEpisodes = episodes.length
    const totalPersons = persons.length

    // Count episodes with confirmed false suspects
    const falseSuspectEpisodes = episodes.filter(e => e.has_false_suspect === 'Y').length
    // Count episodes with public exposure
    const publicExposureEpisodes = episodes.filter(e => e.has_public_exposure === 'Y').length

    // Calculate percentages
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
