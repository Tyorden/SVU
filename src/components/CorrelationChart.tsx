/**
 * Correlation Chart Component
 *
 * Dynamic stacked bar chart for the interactive correlation tool.
 * Computes and visualizes the cross-tabulation between any two
 * categorical variables from the persons harmed dataset.
 *
 * Special handling for severity variable to use the standard
 * green/yellow/orange/red color scale.
 *
 * @param persons - Full dataset of persons harmed
 * @param xVariable - Variable for X-axis categories
 * @param yVariable - Variable for stacked bar segments
 */

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Person } from '../hooks/useData'
import {
  computeCorrelation,
  getUniqueYValues,
  type CorrelationVariable,
} from '../utils/correlations'
import { getSeverityColor } from '../utils/formatters'

interface CorrelationChartProps {
  persons: Person[]
  xVariable: CorrelationVariable
  yVariable: CorrelationVariable
}

const COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
]

export default function CorrelationChart({
  persons,
  xVariable,
  yVariable,
}: CorrelationChartProps) {
  const data = useMemo(
    () => computeCorrelation(persons, xVariable, yVariable),
    [persons, xVariable, yVariable]
  )

  const yValues = useMemo(() => getUniqueYValues(data), [data])

  const getBarColor = (yValue: string, index: number): string => {
    // Special handling for severity values
    if (yVariable === 'severity' && ['1', '2', '3', '4'].includes(yValue)) {
      return getSeverityColor(yValue)
    }
    return COLORS[index % COLORS.length]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="xValue"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 11 }}
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        {yValues.map((yValue, index) => (
          <Bar
            key={yValue}
            dataKey={yValue}
            fill={getBarColor(yValue, index)}
            stackId="stack"
            name={yValue}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
