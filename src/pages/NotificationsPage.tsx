import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { notificationAPI } from '../services/api'
import { timeAgo } from '../utils/formatters'

interface Notif {
  id: string
  message: string
  channel: 'sms' | 'email' | 'in_app'
  read: boolean
  sent_at: string
  emergency_title?: string
  emergency_type?: string
}

const CHANNEL_ICONS: Record<string, string> = { sms: '📱', email: '📧', in_app: '🔔' }

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const data = await notificationAPI.list() as Notif[]
      setNotifications(data)
    } catch (err: any) {
      console.error('notifications error:', err)
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await notificationAPI.markRead(id).catch(console.error)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAll = async () => {
    await notificationAPI.markAllRead().catch(console.error)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="p-6 space-y-5" style={{ background: '#f8f9fa', minHeight: '100%' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {user?.role === 'user' ? 'Updates on your emergency reports' :
              user?.role === 'resource_manager' ? 'Emergency alerts for your resources' :
                'System-wide alerts and activity'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg transition-colors">
            Mark all read ({unread})
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <span className="text-4xl block mb-3">🔔</span>
          <p className="text-gray-500 font-semibold">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
            {user?.role === 'user'
              ? 'You will be notified here when your emergency report status changes — when a manager accepts, responds, or resolves it.'
              : user?.role === 'resource_manager'
                ? 'You will receive alerts here when emergencies are reported near your resources.'
                : 'System activity and emergency alerts will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`bg-white border rounded-xl px-5 py-4 flex items-start gap-4 transition-all cursor-pointer
                ${n.read ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:shadow-sm hover:border-gray-300'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${n.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
                {CHANNEL_ICONS[n.channel] || '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span>{timeAgo(n.sent_at)}</span>
                  <span className="capitalize">via {n.channel?.replace('_', ' ') || 'app'}</span>
                  {n.emergency_title && <span>· {n.emergency_title}</span>}
                </div>
              </div>
              {!n.read && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}