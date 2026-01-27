/**
 * Navigation Bar Component
 *
 * Top navigation with links to Dashboard, Analysis, and Episodes pages.
 * Uses React Router NavLink for active state styling.
 * Responsive design with hamburger menu on mobile.
 */

import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-200'
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <NavLink to="/" className="text-lg sm:text-xl font-bold text-indigo-600 truncate">
            <span className="hidden sm:inline">SVU False Accusation Analysis</span>
            <span className="sm:hidden">SVU Analysis</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/story" className={linkClass}>
              Story
            </NavLink>
            <NavLink to="/analysis" className={linkClass}>
              Analysis
            </NavLink>
            <NavLink to="/episodes" className={linkClass}>
              Episodes
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
                to="/"
                className={mobileLinkClass}
                end
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/story"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Story
              </NavLink>
              <NavLink
                to="/analysis"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Analysis
              </NavLink>
              <NavLink
                to="/episodes"
                className={mobileLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Episodes
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
