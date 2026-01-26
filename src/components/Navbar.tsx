/**
 * Navigation Bar Component
 *
 * Top navigation with links to Dashboard, Analysis, and Episodes pages.
 * Uses React Router NavLink for active state styling.
 */

import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="text-xl font-bold text-indigo-600">
            SVU False Accusation Analysis
          </NavLink>
          <div className="flex gap-2">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/analysis" className={linkClass}>
              Analysis
            </NavLink>
            <NavLink to="/episodes" className={linkClass}>
              Episodes
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
