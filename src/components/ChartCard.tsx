/**
 * Chart Card Component
 *
 * Container wrapper for Recharts visualizations.
 * Provides consistent styling with title, optional subtitle,
 * and a responsive-height container for the chart.
 *
 * @param title - Chart title
 * @param subtitle - Optional description text
 * @param children - Recharts ResponsiveContainer and chart components
 * @param height - Optional custom height (default: responsive)
 */

import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  height?: 'sm' | 'md' | 'lg'
}

export default function ChartCard({ title, subtitle, children, height = 'md' }: ChartCardProps) {
  const heightClass = {
    sm: 'h-48 sm:h-56',
    md: 'h-56 sm:h-72',
    lg: 'h-64 sm:h-80 lg:h-96',
  }[height]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={heightClass}>{children}</div>
    </div>
  )
}
