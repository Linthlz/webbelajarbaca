import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { TabLayout } from './components/common/AppShell.jsx'
import AudioNotice from './components/common/AudioNotice.jsx'
import LandingPage from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LearningPage, { LearningHome } from './pages/LearningPage.jsx'
import GamePage, { GameList } from './pages/GamePage.jsx'
import AchievementPage from './pages/AchievementPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ParentPage from './pages/ParentPage.jsx'
import { initSpeech, stopSpeech } from './utils/speechEngine.js'

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    initSpeech()
  }, [])

  // Hentikan suara halaman sebelumnya setiap kali berpindah halaman.
  useEffect(() => {
    stopSpeech()
    window.scrollTo?.(0, 0)
    return () => stopSpeech()
  }, [pathname])

  return (
    <>
      <AudioNotice />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<TabLayout />}>
          <Route path="/beranda" element={<DashboardPage />} />
          <Route path="/belajar" element={<LearningHome />} />
          <Route path="/belajar/:levelId" element={<LearningHome />} />
          <Route path="/bermain" element={<GameList />} />
          <Route path="/bintang" element={<AchievementPage />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Route>
        <Route path="/belajar/:levelId/:stageIdx" element={<LearningPage />} />
        <Route path="/bermain/:gameId" element={<GamePage />} />
        <Route path="/pendamping" element={<ParentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
