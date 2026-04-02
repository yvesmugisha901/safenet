import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/emergencies', label: 'Report', icon: '🚨' },
  { path: '/resources', label: 'Resources', icon: '🏥' },
  { path: '/alerts', label: 'Alerts', icon: '🔔' },
  { path: '/notifications', label: 'Notifications', icon: '📨' },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()

  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-white font-bold text-lg">SafeNet</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.path
          const badge = item.path === '/alerts' && liveEmergencies.length > 0
            ? liveEmergencies.length : null
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                {item.label}
              </span>
              {badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-400 text-xs transition-colors">
          Sign out →
        </button>
      </div>
    </aside>
  )
}