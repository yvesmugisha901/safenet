import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useNotifications } from '../../hooks/useNotifications'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()
  const { unreadCount } = useNotifications()

  const NAV = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/emergencies', label: user?.role === 'user' ? 'My Reports' : 'Emergencies', icon: '🚨', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/resources', label: 'Resources', icon: '🏥', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/alerts', label: 'Alerts', icon: '🔔', roles: ['resource_manager', 'admin'] },
    { path: '/notifications', label: 'Notifications', icon: '📨', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['user', 'resource_manager', 'admin'] },
  ].filter(n => n.roles.includes(user?.role || ''))

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="text-gray-900 font-bold text-lg">SafeNet</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const isActive = location.pathname === item.path
          const badge =
            item.path === '/alerts' && liveEmergencies.length > 0 ? liveEmergencies.length :
              item.path === '/notifications' && unreadCount > 0 ? unreadCount : null
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
              <span className="flex items-center gap-3">
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </span>
              {badge && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'}`}>
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-red-500 text-xs transition-colors font-medium">
          Sign out →
        </button>
      </div>
    </aside>
  )
}