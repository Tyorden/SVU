/**
 * SVU False Accusation Analysis Dashboard
 *
 * Main application entry point with routing configuration.
 *
 * Routes:
 * - /           Dashboard with key statistics and summary charts
 * - /analysis   Interactive correlation analysis and trend exploration
 * - /episodes   Searchable/filterable episode browser
 * - /episodes/:id  Episode detail with all persons harmed
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Episodes from './pages/Episodes'
import EpisodeDetail from './pages/EpisodeDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="episodes" element={<Episodes />} />
          <Route path="episodes/:id" element={<EpisodeDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
