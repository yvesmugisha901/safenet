import { Emergency } from '../../types'
import { emergencyAPI } from '../../services/api'
import { useState } from 'react'

interface Props { emergencies: Emergency[]; onUpdate: () => void }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-red-900/30 text-red-400 border-red-900/40',
  responding: 'bg-yellow-900/30 text-yellow-400 border-yellow-900/40',
  resolved: 'bg-green-900/30 text-green-400 border-green-900/40',
  cancelled: 'bg-gray-800 text-gray-500 border-gray-700',
}

const TYPE_ICONS: Record<string, string> = {
  medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function EmergencyList({ emergencies, onUpdate }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      await emergencyAPI.updateStatus(id, status)
      onUpdate()
    } finally {
      setUpdating(null)
    }
  }

  if (emergencies.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
        No emergencies found
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {emergencies.map(e => (
        <div key={e.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-1">{TYPE_ICONS[e.type]}</span>
              <div>
                <h3 className="text-white font-semibold">{e.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{e.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>📍 {e.latitude}, {e.longitude}</span>
                  <span>👤 {e.reported_by_name || 'Unknown'}</span>
                  <span>🕐 {new Date(e.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${STATUS_COLORS[e.status]}`}>
                {e.status}
              </span>
              {e.status === 'pending' && (
                <button onClick={() => handleStatus(e.id, 'responding')}
                  disabled={updating === e.id}
                  className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg disabled:opacity-50">
                  {updating === e.id ? '...' : 'Respond'}
                </button>
              )}
              {e.status === 'responding' && (
                <button onClick={() => handleStatus(e.id, 'resolved')}
                  disabled={updating === e.id}
                  className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg disabled:opacity-50">
                  {updating === e.id ? '...' : 'Resolve'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
