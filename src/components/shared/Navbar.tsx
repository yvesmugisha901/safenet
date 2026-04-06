import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

export default function Navbar() {
  const { user } = useAuth()
  const { liveEmergencies } = useSocket()
  const unread = liveEmergencies.filter(e => e.status === 'pending').length

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <p className="text-gray-500 text-sm">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>
      <div className="flex items-center gap-4">
        {unread > 0 && (
          <span className="flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 animate-pulse">
            🔴 {unread} pending alert{unread > 1 ? 's' : ''}
          </span>
        )}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-gray-600 text-sm font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}