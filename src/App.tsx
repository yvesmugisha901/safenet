import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Sidebar from './components/shared/Sidebar'
import Navbar from './components/shared/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import EmergenciesPage from './pages/EmergenciesPage'
import ResourcesPage from './pages/ResourcesPage'
import AlertsPage from './pages/AlertsPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7fafc', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto', background: '#f7fafc' }}>{children}</main>
      </div>

    </div>
  )
}

function AppRoutes() {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 22, height: 22, border: '2.5px solid #e2e8f0', borderTopColor: '#e53e3e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#718096', fontSize: 15 }}>Loading SafeNet...</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPasswordPage />} />
      <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/emergencies" element={<AppLayout><EmergenciesPage /></AppLayout>} />
      <Route path="/resources" element={<AppLayout><ResourcesPage /></AppLayout>} />
      <Route path="/alerts" element={<AppLayout><AlertsPage /></AppLayout>} />
      <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
      <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}