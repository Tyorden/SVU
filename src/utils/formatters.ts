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

import {
  INNOCENCE_STATUS,
  ROLE_IN_PLOT,
  ACCUSED_OF,
  ACCUSATION_ORIGIN,
  EXPOSURE_CHANNEL,
  EXPOSURE_WHO_TOLD,
  CONSEQUENCE_CATEGORY,
  CONSEQUENCE_SEVERITY,
  POLICE_CONDUCT_THREAT,
  POLICE_APOLOGY,
  PROSECUTORIAL_CONDUCT,
  PROSECUTORIAL_APOLOGY,
} from './definitions'

/**
 * Convert severity code to human-readable label
 * @param severity - Severity code (1-4)
 */
export function formatSeverity(severity: string): string {
  return CONSEQUENCE_SEVERITY[severity]?.label || 'Unknown'
}

/**
 * Get the hex color for a severity level
 * Used in Recharts visualizations
 * @param severity - Severity code (1-4)
 */
export function getSeverityColor(severity: string): string {
  return CONSEQUENCE_SEVERITY[severity]?.color || '#9ca3af'
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
 * @param value - Code value (e.g., "initial_suspect")
 */
export function formatSnakeCase(value: string): string {
  if (!value) return 'Unknown'
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format role_in_plot field using definitions
 * @param role - Role code from dataset
 */
export function formatRole(role: string): string {
  if (!role) return 'Unknown'
  return ROLE_IN_PLOT[role]?.label || formatSnakeCase(role)
}

/**
 * Format accused_of field to readable crime type
 * @param accusedOf - Crime code from dataset
 */
export function formatAccusedOf(accusedOf: string): string {
  if (!accusedOf) return 'Unknown'
  return ACCUSED_OF[accusedOf]?.label || formatSnakeCase(accusedOf)
}

/**
 * Format accusation_origin field
 * @param origin - Origin code from dataset
 */
export function formatAccusationOrigin(origin: string): string {
  if (!origin) return 'Unknown'
  return ACCUSATION_ORIGIN[origin]?.label || formatSnakeCase(origin)
}

/**
 * Format police_conduct_threat field
 * @param threat - Threat type code from dataset
 */
export function formatThreatType(threat: string): string {
  if (!threat) return 'None'
  return POLICE_CONDUCT_THREAT[threat]?.label || formatSnakeCase(threat)
}

/**
 * Format police_apology field
 * @param apology - Apology type code from dataset
 */
export function formatApology(apology: string): string {
  if (!apology) return 'None'
  return POLICE_APOLOGY[apology]?.label || formatSnakeCase(apology)
}

/**
 * Format exposure_channel field
 * @param channel - Channel code from dataset
 */
export function formatExposureChannel(channel: string): string {
  if (!channel) return 'Unknown'
  return EXPOSURE_CHANNEL[channel]?.label || formatSnakeCase(channel)
}

/**
 * Format exposure_who_told field
 * @param who - Who told code from dataset
 */
export function formatExposureWho(who: string): string {
  if (!who) return 'Unknown'
  return EXPOSURE_WHO_TOLD[who]?.label || formatSnakeCase(who)
}

/**
 * Format innocence_status field
 * @param status - Innocence status code from dataset
 */
export function formatInnocenceStatus(status: string): string {
  if (!status) return 'Unknown'
  return INNOCENCE_STATUS[status]?.label || formatSnakeCase(status)
}

/**
 * Format consequence_category field
 * @param category - Category code from dataset
 */
export function formatConsequenceCategory(category: string): string {
  if (!category) return 'Unknown'
  return CONSEQUENCE_CATEGORY[category]?.label || formatSnakeCase(category)
}

/**
 * Format prosecutorial_conduct field (Law & Order specific)
 * @param conduct - Prosecutorial conduct code from dataset
 */
export function formatProsecutorialConduct(conduct: string): string {
  if (!conduct) return 'None'
  return PROSECUTORIAL_CONDUCT[conduct]?.label || formatSnakeCase(conduct)
}

/**
 * Format prosecutorial_apology field (Law & Order specific)
 * @param apology - Prosecutorial apology code from dataset
 */
export function formatProsecutorialApology(apology: string): string {
  if (!apology) return 'None'
  return PROSECUTORIAL_APOLOGY[apology]?.label || formatSnakeCase(apology)
}

/**
 * Generic formatter that tries all definition maps
 * Used for dynamic chart labels
 * @param value - Any coded value from the dataset
 */
export function formatValue(value: string): string {
  if (!value) return 'Unknown'

  // Try each definition map
  if (INNOCENCE_STATUS[value]) return INNOCENCE_STATUS[value].label
  if (ROLE_IN_PLOT[value]) return ROLE_IN_PLOT[value].label
  if (ACCUSED_OF[value]) return ACCUSED_OF[value].label
  if (ACCUSATION_ORIGIN[value]) return ACCUSATION_ORIGIN[value].label
  if (EXPOSURE_CHANNEL[value]) return EXPOSURE_CHANNEL[value].label
  if (EXPOSURE_WHO_TOLD[value]) return EXPOSURE_WHO_TOLD[value].label
  if (CONSEQUENCE_CATEGORY[value]) return CONSEQUENCE_CATEGORY[value].label
  if (CONSEQUENCE_SEVERITY[value]) return CONSEQUENCE_SEVERITY[value].label
  if (POLICE_CONDUCT_THREAT[value]) return POLICE_CONDUCT_THREAT[value].label
  if (POLICE_APOLOGY[value]) return POLICE_APOLOGY[value].label

  // Fall back to snake_case formatting
  return formatSnakeCase(value)
}
