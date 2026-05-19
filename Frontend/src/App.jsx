import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreatePollPage from './pages/CreatePollPage'
import PollFormPage from './pages/PollFormPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PollThankYouPage from './pages/PollThankYouPage'
import PollResultsPage from './pages/PollResultsPage'
import RequireAuth from './components/RequireAuth'

function App() {
  const [cursor, setCursor] = useState({ x: '50%', y: '50%' })

  return (
    <div
      className="relative"
      onMouseMove={(event) => {
        const x = `${event.clientX}px`
        const y = `${event.clientY}px`
        setCursor({ x, y })
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(520px circle at ${cursor.x} ${cursor.y}, rgba(255,255,255,0.15), transparent 45%)`,
        }}
      ></div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <CreatePollPage />
            </RequireAuth>
          }
        />
        <Route
          path="/poll/:slug"
          element={
            <RequireAuth>
              <PollFormPage />
            </RequireAuth>
          }
        />
        <Route
          path="/poll/:slug/thanks"
          element={
            <RequireAuth>
              <PollThankYouPage />
            </RequireAuth>
          }
        />
        <Route
          path="/poll/:slug/results"
          element={
            <RequireAuth>
              <PollResultsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/analytics/:id"
          element={
            <RequireAuth>
              <AnalyticsPage />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  )
}

export default App
