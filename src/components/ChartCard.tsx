/**
 * Chart Card Component
 *
 * Container wrapper for Recharts visualizations.
 * Provides consistent styling with title, optional subtitle,
 * and a fixed-height container for the chart.
 *
 * @param title - Chart title
 * @param subtitle - Optional description text
 * @param children - Recharts ResponsiveContainer and chart components
 */

import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className="h-72">{children}</div>
    </div>
  )
}
