import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()
  const unread = liveEmergencies.filter(e => e.status === 'pending').length

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <span className="text-white font-semibold">SafeNet</span>
      </div>
      <div className="flex items-center gap-4">
        {unread > 0 && (
          <span className="flex items-center gap-1.5 bg-red-900/40 text-red-400 text-xs px-3 py-1 rounded-full border border-red-900/60 animate-pulse">
            🔴 {unread} live alert{unread > 1 ? 's' : ''}
          </span>
        )}
        <span className="text-gray-400 text-sm">{user?.name}</span>
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">{user?.role}</span>
        <button onClick={logout} className="text-gray-500 hover:text-red-400 text-sm transition-colors">
          Sign out
        </button>
      </div>
    </header>
  )
}
