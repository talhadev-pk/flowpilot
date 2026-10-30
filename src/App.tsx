import { Suspense, lazy, useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import MarketingLayout from './components/layout/MarketingLayout'
import AppLayout from './components/layout/AppLayout'
import { ToastProvider } from './components/common/Toast'
import { KEYS, load, save } from './utils/store'
import Home from './pages/marketing/Home'
import { Features, TemplatesPage, Pricing, About, Contact } from './pages/marketing/Misc'

const Dashboard = lazy(() => import('./pages/app/Dashboard'))
const Builder = lazy(() => import('./pages/app/Builder'))
const Workflows = lazy(() => import('./pages/app/WorkflowsAnalytics').then(m => ({ default: m.Workflows })))
const Analytics = lazy(() => import('./pages/app/WorkflowsAnalytics').then(m => ({ default: m.Analytics })))
const AppTemplates = lazy(() => import('./pages/app/MiscApp').then(m => ({ default: m.AppTemplates })))
const History = lazy(() => import('./pages/app/MiscApp').then(m => ({ default: m.History })))
const Integrations = lazy(() => import('./pages/app/MiscApp').then(m => ({ default: m.Integrations })))
const Settings = lazy(() => import('./pages/app/MiscApp').then(m => ({ default: m.Settings })))
const Loading = () => <div className="grid min-h-[40vh] place-items-center" role="status"><span className="h-9 w-9 animate-spin rounded-full border-[3px] border-violet-500 border-t-transparent" aria-label="Loading" /></div>

export default function App() {
  const [theme, setTheme] = useState(() => load(KEYS.theme, 'dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); save(KEYS.theme, theme) }, [theme])
  const toggleTheme = () => setTheme((t: string) => t === 'dark' ? 'light' : 'dark')
  return <ToastProvider><HashRouter>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MarketingLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Home />} /><Route path="features" element={<Features />} /><Route path="templates" element={<TemplatesPage />} />
          <Route path="pricing" element={<Pricing />} /><Route path="about" element={<About />} /><Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/app" element={<AppLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route index element={<Dashboard />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="builder" element={<Builder />} />
          <Route path="templates" element={<AppTemplates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="history" element={<History />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </HashRouter></ToastProvider>
}
