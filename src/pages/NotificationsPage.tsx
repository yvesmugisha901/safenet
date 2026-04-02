import { useNotifications } from '../hooks/useNotifications'
import { timeAgo } from '../utils/formatters'

export default function NotificationsPage() {
  const { notifications, markRead } = useNotifications()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-white text-2xl font-bold">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-gray-500 text-center py-16">No notifications yet</div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div key={n.id} onClick={() => !n.read && markRead(n.id)}
              className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-colors
                ${n.read ? 'border-gray-800 opacity-60' : 'border-gray-700 hover:border-gray-600'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{timeAgo(n.sent_at)} · {n.channel}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
