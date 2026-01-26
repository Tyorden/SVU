/**
 * Correlation Analysis Utilities
 *
 * This module provides functions for computing cross-tabulations
 * between different variables in the persons harmed dataset.
 *
 * Used by the Analysis page's interactive correlation tool to
 * dynamically generate stacked bar charts showing relationships
 * between any two categorical variables.
 *
 * Available Variables:
 * - severity: Consequence severity (1-4)
 * - accusation_origin: How the person became a suspect
 * - exposure_channel: How the accusation was made public
 * - police_conduct_threat: Type of threatening behavior by police
 * - police_apology: Whether/how police apologized
 * - accused_of: Crime type the person was accused of
 * - role_in_plot: Character's role (initial_suspect, red_herring, etc.)
 * - innocence_status: Level of proven innocence
 * - season: Show season (for trend analysis)
 * - exposure_who_told: Who exposed the accusation publicly
 */

import type { Person } from '../hooks/useData'
import { formatValue } from './formatters'

/** Valid variable names for correlation analysis */
export type CorrelationVariable =
  | 'severity'
  | 'accusation_origin'
  | 'exposure_channel'
  | 'police_conduct_threat'
  | 'police_apology'
  | 'accused_of'
  | 'role_in_plot'
  | 'innocence_status'
  | 'season'
  | 'exposure_who_told'

/** Dropdown options for the correlation tool UI */
export const CORRELATION_VARIABLES: { value: CorrelationVariable; label: string }[] = [
  { value: 'severity', label: 'Consequence Severity' },
  { value: 'accusation_origin', label: 'Accusation Origin' },
  { value: 'exposure_channel', label: 'Exposure Channel' },
  { value: 'police_conduct_threat', label: 'Police Threat Type' },
  { value: 'police_apology', label: 'Police Apology' },
  { value: 'accused_of', label: 'Accused Of' },
  { value: 'role_in_plot', label: 'Role in Plot' },
  { value: 'innocence_status', label: 'Innocence Status' },
  { value: 'season', label: 'Season' },
  { value: 'exposure_who_told', label: 'Who Exposed' },
]

/**
 * Extract the value for a given variable from a person record
 * @param person - Person record from dataset
 * @param variable - Variable to extract
 * @returns The value for that variable, with fallback for missing data
 */
function getPersonValue(person: Person, variable: CorrelationVariable): string {
  switch (variable) {
    case 'severity':
      return person.consequence_severity || 'unknown'
    case 'accusation_origin':
      return person.accusation_origin || 'unknown'
    case 'exposure_channel':
      return person.exposure_channel || 'unknown'
    case 'police_conduct_threat':
      return person.police_conduct_threat || 'none'
    case 'police_apology':
      return person.police_apology || 'none'
    case 'accused_of':
      return person.accused_of || 'unknown'
    case 'role_in_plot':
      return person.role_in_plot || 'unknown'
    case 'innocence_status':
      return person.innocence_status || 'unknown'
    case 'season':
      return person.season || 'unknown'
    case 'exposure_who_told':
      return person.exposure_who_told || 'unknown'
    default:
      return 'unknown'
  }
}

/**
 * Data structure for correlation chart
 * xValue is the X-axis category, other keys are Y-axis categories with counts
 */
export interface CorrelationData {
  xValue: string
  [key: string]: string | number
}

/**
 * Compute a cross-tabulation between two variables
 *
 * Creates a matrix counting how many persons fall into each
 * combination of X and Y values. Output is formatted for
 * Recharts stacked bar chart.
 *
 * @param persons - Array of person records
 * @param xVariable - Variable for X-axis (categories)
 * @param yVariable - Variable for stacked bars (colors)
 * @returns Array of data points for Recharts
 *
 * @example
 * // Get threat type vs apology outcome
 * const data = computeCorrelation(persons, 'police_conduct_threat', 'police_apology')
 * // Returns: [{ xValue: 'verbal_threat', none: 45, partial: 12, formal: 3 }, ...]
 */
export function computeCorrelation(
  persons: Person[],
  xVariable: CorrelationVariable,
  yVariable: CorrelationVariable
): CorrelationData[] {
  // Build count matrix: matrix[xValue][yValue] = count
  const matrix: Record<string, Record<string, number>> = {}
  const yValues = new Set<string>()

  persons.forEach(person => {
    const xVal = getPersonValue(person, xVariable)
    const yVal = getPersonValue(person, yVariable)

    if (!matrix[xVal]) {
      matrix[xVal] = {}
    }
    matrix[xVal][yVal] = (matrix[xVal][yVal] || 0) + 1
    yValues.add(yVal)
  })

  // Convert matrix to Recharts format
  const result: CorrelationData[] = []
  const sortedYValues = Array.from(yValues).sort()

  Object.keys(matrix).sort().forEach(xVal => {
    const entry: CorrelationData = { xValue: xVal }
    sortedYValues.forEach(yVal => {
      entry[yVal] = matrix[xVal][yVal] || 0
    })
    result.push(entry)
  })

  return result
}

/**
 * Extract unique Y values from correlation data
 * Used to determine which bars to render in the stacked chart
 * @param data - Correlation data from computeCorrelation
 */
export function getUniqueYValues(data: CorrelationData[]): string[] {
  const yValues = new Set<string>()
  data.forEach(entry => {
    Object.keys(entry).forEach(key => {
      if (key !== 'xValue') {
        yValues.add(key)
      }
    })
  })
  return Array.from(yValues).sort()
}

/**
 * Compute a cross-tabulation with formatted labels
 *
 * Same as computeCorrelation but uses human-readable labels
 * for both X and Y values instead of raw codes.
 *
 * @param persons - Array of person records
 * @param xVariable - Variable for X-axis (categories)
 * @param yVariable - Variable for stacked bars (colors)
 * @returns Array of data points for Recharts with formatted labels
 */
export function computeCorrelationFormatted(
  persons: Person[],
  xVariable: CorrelationVariable,
  yVariable: CorrelationVariable
): CorrelationData[] {
  // Build count matrix with formatted labels
  const matrix: Record<string, Record<string, number>> = {}
  const yValues = new Set<string>()

  persons.forEach(person => {
    const xValRaw = getPersonValue(person, xVariable)
    const yValRaw = getPersonValue(person, yVariable)

    // Format the values for display
    const xVal = xVariable === 'season' ? `Season ${xValRaw}` : formatValue(xValRaw)
    const yVal = yVariable === 'season' ? `Season ${yValRaw}` : formatValue(yValRaw)

    if (!matrix[xVal]) {
      matrix[xVal] = {}
    }
    matrix[xVal][yVal] = (matrix[xVal][yVal] || 0) + 1
    yValues.add(yVal)
  })

  // Convert matrix to Recharts format
  const result: CorrelationData[] = []
  const sortedYValues = Array.from(yValues).sort()

  // Sort X values - special handling for seasons
  const sortedXValues = Object.keys(matrix).sort((a, b) => {
    // If both are seasons, sort numerically
    if (a.startsWith('Season ') && b.startsWith('Season ')) {
      return parseInt(a.replace('Season ', '')) - parseInt(b.replace('Season ', ''))
    }
    return a.localeCompare(b)
  })

  sortedXValues.forEach(xVal => {
    const entry: CorrelationData = { xValue: xVal }
    sortedYValues.forEach(yVal => {
      entry[yVal] = matrix[xVal][yVal] || 0
    })
    result.push(entry)
  })

  return result
}
