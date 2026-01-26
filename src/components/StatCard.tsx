/**
 * Stat Card Component
 *
 * Displays a single key metric in a colored card format.
 * Used on the Dashboard to show high-level statistics like
 * total episodes, persons harmed, and percentage rates.
 *
 * @param title - Metric label (e.g., "Episodes Analyzed")
 * @param value - Main metric value (number or formatted string)
 * @param subtitle - Optional additional context
 * @param color - Card color theme (blue, green, yellow, red, purple)
 */

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export default function StatCard({ title, value, subtitle, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  }

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-sm mt-2 opacity-70">{subtitle}</p>}
    </div>
  )
}
