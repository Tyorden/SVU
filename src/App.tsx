/**
 * SVU False Accusation Analysis Dashboard
 *
 * Main application entry point with routing configuration.
 *
 * Routes:
 * - /           Dashboard with key statistics and summary charts
 * - /story      Interactive presentation walking through key findings
 * - /analysis   Interactive correlation analysis and trend exploration
 * - /episodes   Searchable/filterable episode browser
 * - /episodes/:id  Episode detail with all persons harmed
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Story from './pages/Story'
import Analysis from './pages/Analysis'
import Episodes from './pages/Episodes'
import EpisodeDetail from './pages/EpisodeDetail'
import Insights from './pages/Insights'
import Visualizations from './pages/Visualizations'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="story" element={<Story />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="episodes" element={<Episodes />} />
          <Route path="episodes/:id" element={<EpisodeDetail />} />
          <Route path="insights" element={<Insights />} />
          <Route path="visualizations" element={<Visualizations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
