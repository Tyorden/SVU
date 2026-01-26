/**
 * Layout Component
 *
 * Root layout wrapper that provides consistent structure across all pages.
 * Includes the navigation bar and a centered content container.
 */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
