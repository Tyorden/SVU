/**
 * Navigation Bar Component
 *
 * Top navigation with links to Dashboard, Analysis, and Episodes pages.
 * Uses React Router NavLink for active state styling.
 * Responsive design with hamburger menu on mobile.
 * Includes a series switcher to toggle between SVU and Law & Order.
 */

import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Determine which series we're viewing based on URL
  const isLO = location.pathname.startsWith('/lo')

  // Route prefix for current series
  const prefix = isLO ? '/lo' : ''

  // Series switcher target
  const switchTo = isLO ? '/' : '/lo'
  const otherSeries = isLO ? 'SVU' : 'Law & Order'

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? isLO ? 'bg-violet-600 text-white' : 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? isLO ? 'bg-violet-600 text-white' : 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`

  const accentColor = isLO ? 'text-violet-600' : 'text-indigo-600'
  const switchBg = isLO ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200'

  return (
    <nav className={`bg-white shadow-sm border-b ${isLO ? 'border-violet-200' : 'border-slate-200'} sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-3">
            <NavLink to={prefix || '/'} className={`text-lg sm:text-xl font-bold ${accentColor} truncate`}>
              <span className="hidden sm:inline">
                {isLO ? 'L&O False Accusation Analysis' : 'SVU False Accusation Analysis'}
              </span>
              <span className="sm:hidden">
                {isLO ? 'L&O Analysis' : 'SVU Analysis'}
              </span>
            </NavLink>

            {/* Series Switcher - Desktop */}
            <NavLink
              to={switchTo}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${switchBg}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Switch to {otherSeries}
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <NavLink to={prefix || '/'} className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to={`${prefix}/story`} className={linkClass}>
              Story
            </NavLink>
            <NavLink to={`${prefix}/analysis`} className={linkClass}>
              Analysis
            </NavLink>
            <NavLink to={`${prefix}/episodes`} className={linkClass}>
              Episodes
            </NavLink>
            <NavLink to={`${prefix}/insights`} className={linkClass}>
              Insights
            </NavLink>
            <NavLink to={`${prefix}/visualizations`} className={linkClass}>
              Charts
            </NavLink>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-2">
            <div className="flex flex-col gap-1">
              <NavLink
                to={prefix || '/'}
                className={mobileLinkClass}
                end
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to={`${prefix}/story`}
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Story
              </NavLink>
              <NavLink
                to={`${prefix}/analysis`}
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Analysis
              </NavLink>
              <NavLink
                to={`${prefix}/episodes`}
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Episodes
              </NavLink>
              <NavLink
                to={`${prefix}/insights`}
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Insights
              </NavLink>
              <NavLink
                to={`${prefix}/visualizations`}
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Charts
              </NavLink>

              {/* Series Switcher - Mobile */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <NavLink
                  to={switchTo}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${switchBg} border`}
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Switch to {otherSeries}
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
