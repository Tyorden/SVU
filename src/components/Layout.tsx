/**
 * Layout Component
 *
 * Root layout wrapper that provides consistent structure across all pages.
 * Includes the navigation bar, a centered content container, and a footer
 * with project accreditation and disclaimer.
 */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-slate-700 font-medium mb-2">
              Created by Tyler Orden
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-3">
              This is a personal project born out of curiosity about how procedural TV dramas
              portray false accusations and their consequences. The data was collected and analyzed
              for fun and is not affiliated with NBC, Dick Wolf, or any official entity.
              All findings are observational and based on episode transcripts.
            </p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
              If you're interested in using the data, collaborating, or just want to chat about
              the project, feel free to reach out.
            </p>
            <a
              href="https://www.linkedin.com/in/tyler-orden/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white text-sm font-medium rounded-lg hover:bg-[#004182] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
            <p className="text-xs text-slate-400 mt-4">
              &copy; {new Date().getFullYear()} Tyler Orden. Data and analysis provided as-is for educational and entertainment purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
