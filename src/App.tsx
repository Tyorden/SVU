/**
 * False Accusation Analysis Dashboard
 *
 * Main application entry point with routing configuration.
 *
 * SVU Routes:
 * - /              Dashboard with key statistics and summary charts
 * - /story         Interactive presentation walking through key findings
 * - /analysis      Interactive correlation analysis and trend exploration
 * - /episodes      Searchable/filterable episode browser
 * - /episodes/:id  Episode detail with all persons harmed
 * - /insights      Data export and insights page
 * - /visualizations Advanced chart visualizations
 *
 * Law & Order Routes:
 * - /lo            L&O Dashboard
 * - /lo/story      L&O interactive presentation
 * - /lo/analysis   L&O analysis and correlations
 * - /lo/episodes   L&O episode browser
 * - /lo/episodes/:id  L&O episode detail
 * - /lo/insights   L&O data export and insights
 * - /lo/visualizations L&O advanced visualizations
 */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// SVU pages (lazy loaded)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Story = lazy(() => import('./pages/Story'))
const Analysis = lazy(() => import('./pages/Analysis'))
const Episodes = lazy(() => import('./pages/Episodes'))
const EpisodeDetail = lazy(() => import('./pages/EpisodeDetail'))
const Insights = lazy(() => import('./pages/Insights'))
const Visualizations = lazy(() => import('./pages/Visualizations'))

// Law & Order pages (lazy loaded)
const LoDashboard = lazy(() => import('./pages/lo/LoDashboard'))
const LoStory = lazy(() => import('./pages/lo/LoStory'))
const LoAnalysis = lazy(() => import('./pages/lo/LoAnalysis'))
const LoEpisodes = lazy(() => import('./pages/lo/LoEpisodes'))
const LoEpisodeDetail = lazy(() => import('./pages/lo/LoEpisodeDetail'))
const LoInsights = lazy(() => import('./pages/lo/LoInsights'))
const LoVisualizations = lazy(() => import('./pages/lo/LoVisualizations'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* SVU Routes */}
          <Route index element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
          <Route path="story" element={<Suspense fallback={<LoadingFallback />}><Story /></Suspense>} />
          <Route path="analysis" element={<Suspense fallback={<LoadingFallback />}><Analysis /></Suspense>} />
          <Route path="episodes" element={<Suspense fallback={<LoadingFallback />}><Episodes /></Suspense>} />
          <Route path="episodes/:id" element={<Suspense fallback={<LoadingFallback />}><EpisodeDetail /></Suspense>} />
          <Route path="insights" element={<Suspense fallback={<LoadingFallback />}><Insights /></Suspense>} />
          <Route path="visualizations" element={<Suspense fallback={<LoadingFallback />}><Visualizations /></Suspense>} />

          {/* Law & Order Routes */}
          <Route path="lo" element={<Suspense fallback={<LoadingFallback />}><LoDashboard /></Suspense>} />
          <Route path="lo/story" element={<Suspense fallback={<LoadingFallback />}><LoStory /></Suspense>} />
          <Route path="lo/analysis" element={<Suspense fallback={<LoadingFallback />}><LoAnalysis /></Suspense>} />
          <Route path="lo/episodes" element={<Suspense fallback={<LoadingFallback />}><LoEpisodes /></Suspense>} />
          <Route path="lo/episodes/:id" element={<Suspense fallback={<LoadingFallback />}><LoEpisodeDetail /></Suspense>} />
          <Route path="lo/insights" element={<Suspense fallback={<LoadingFallback />}><LoInsights /></Suspense>} />
          <Route path="lo/visualizations" element={<Suspense fallback={<LoadingFallback />}><LoVisualizations /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
