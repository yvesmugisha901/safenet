import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { notificationAPI } from '../services/api'
import { Notification } from '../types'
import { timeAgo } from '../utils/formatters'

const CHANNEL_ICONS: Record<string, string> = {
  sms: '📱', email: '📧', in_app: '🔔'
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await notificationAPI.list() as Notification[]
      setNotifications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await notificationAPI.markRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAll = async () => {
    await notificationAPI.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="p-6 space-y-5" style={{ background: '#f8f9fa', minHeight: '100%' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {user?.role === 'user'
              ? 'Updates on your emergency reports'
              : 'Emergency alerts and system updates'}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
            Mark all read ({unread})
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <span className="text-4xl block mb-3">🔔</span>
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {user?.role === 'user'
              ? 'You will be notified when your emergency report status changes'
              : 'You will receive alerts when emergencies are reported near your resources'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id}
              onClick={() => !n.read && markRead(n.id)}
              className={`bg-white border rounded-xl px-5 py-4 flex items-start gap-4 transition-all cursor-pointer
                ${n.read ? 'border-gray-100 opacity-70' : 'border-gray-200 hover:shadow-sm hover:border-gray-300'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${n.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
                {CHANNEL_ICONS[n.channel] || '🔔'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                  {n.message}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span>{timeAgo(n.sent_at)}</span>
                  <span className="capitalize">via {n.channel.replace('_', ' ')}</span>
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