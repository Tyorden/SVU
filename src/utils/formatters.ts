/**
 * Formatting Utilities for SVU False Accusation Analysis
 *
 * This module provides human-readable formatting functions for
 * displaying coded values from the dataset in the UI.
 *
 * Severity Color Scale:
 * - 1 (Green): Low harm - private suspicion, quickly cleared
 * - 2 (Yellow): Public exposure - workplace/family learned of accusation
 * - 3 (Orange): Material sanction - arrested, fired, lost custody, etc.
 * - 4 (Red): Life-altering/death - prison, murder, suicide, permanent harm
 */

/**
 * Convert severity code to human-readable label
 * @param severity - Severity code (1-4)
 */
export function formatSeverity(severity: string): string {
  switch (severity) {
    case '1': return 'Low Harm'
    case '2': return 'Public Exposure'
    case '3': return 'Material Sanction'
    case '4': return 'Life-Altering/Death'
    default: return 'Unknown'
  }
}

/**
 * Get the hex color for a severity level
 * Used in Recharts visualizations
 * @param severity - Severity code (1-4)
 */
export function getSeverityColor(severity: string): string {
  switch (severity) {
    case '1': return '#22c55e' // green-500
    case '2': return '#eab308' // yellow-500
    case '3': return '#f97316' // orange-500
    case '4': return '#ef4444' // red-500
    default: return '#9ca3af' // gray-400
  }
}

/**
 * Get Tailwind CSS classes for severity badge styling
 * @param severity - Severity code (1-4)
 */
export function getSeverityBgClass(severity: string): string {
  switch (severity) {
    case '1': return 'bg-green-100 text-green-800'
    case '2': return 'bg-yellow-100 text-yellow-800'
    case '3': return 'bg-orange-100 text-orange-800'
    case '4': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Convert snake_case codes to Title Case for display
 * @param role - Role code (e.g., "initial_suspect")
 */
export function formatRole(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format accused_of field to readable crime type
 * @param accusedOf - Crime code from dataset
 */
export function formatAccusedOf(accusedOf: string): string {
  const map: Record<string, string> = {
    'rape': 'Rape',
    'CSA': 'Child Sexual Abuse',
    'sex_crime_vague': 'Sex Crime (Unspecified)',
    'assault': 'Assault',
    'murder': 'Murder',
    'CP': 'Child Pornography',
    'DV': 'Domestic Violence',
  }
  return map[accusedOf] || formatRole(accusedOf)
}

/**
 * Format accusation_origin field
 * @param origin - Origin code from dataset
 */
export function formatAccusationOrigin(origin: string): string {
  const map: Record<string, string> = {
    'victim_ID': 'Victim Identification',
    'witness_misID': 'Witness Misidentification',
    'squad_inference': 'Squad Inference',
    'tech_db_error': 'Technical/Database Error',
    'fabrication': 'Fabricated Accusation',
  }
  return map[origin] || formatRole(origin)
}

/**
 * Format police_conduct_threat field
 * @param threat - Threat type code from dataset
 */
export function formatThreatType(threat: string): string {
  const map: Record<string, string> = {
    'none': 'None',
    'verbal_threat': 'Verbal Threat',
    'coercive_tactic': 'Coercive Tactic',
    'insult_degradation': 'Insult/Degradation',
    'multiple': 'Multiple Types',
  }
  return map[threat] || formatRole(threat)
}

/**
 * Format police_apology field
 * @param apology - Apology type code from dataset
 */
export function formatApology(apology: string): string {
  const map: Record<string, string> = {
    'none': 'None',
    'partial': 'Partial',
    'formal': 'Formal',
  }
  return map[apology] || formatRole(apology)
}

/**
 * Format exposure_channel field
 * @param channel - Channel code from dataset
 */
export function formatExposureChannel(channel: string): string {
  const map: Record<string, string> = {
    'media': 'Media',
    'workplace': 'Workplace',
    'family': 'Family',
    'police_only': 'Police Only',
    'multiple': 'Multiple Channels',
    'unknown': 'Unknown',
  }
  return map[channel] || formatRole(channel)
}
