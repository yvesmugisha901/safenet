import { useState } from 'react'
import { Emergency } from '../../types'
import { emergencyAPI } from '../../services/api'
import { timeAgo } from '../../utils/formatters'

interface Props {
  emergencies: Emergency[]
  onUpdate: () => void
  showActions?: boolean  // only managers and admins see action buttons
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-red-900/30 text-red-400 border-red-900/50',
  responding: 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50',
  resolved: 'bg-green-900/30 text-green-400 border-green-900/50',
  cancelled: 'bg-gray-800 text-gray-500 border-gray-700',
}

const TYPE_ICONS: Record<string, string> = {
  medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function EmergencyList({ emergencies, onUpdate, showActions = false }: Props) {
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
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
        <span className="text-4xl block mb-3">📭</span>
        <p className="text-gray-400 font-medium">No emergencies found</p>
        <p className="text-gray-600 text-sm mt-1">Reports will appear here once submitted</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {emergencies.map(e => {
        const isUpdating = updating === e.id
        return (
          <div key={e.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {TYPE_ICONS[e.type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-white font-semibold">{e.title}</h3>
                    {e.description && (
                      <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{e.description}</p>
                    )}
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${STATUS_STYLES[e.status]}`}>
                    {e.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="capitalize">📂 {e.type}</span>
                  {e.reported_by_name && <span>👤 {e.reported_by_name}</span>}
                  <span>📍 {Number(e.latitude).toFixed(4)}, {Number(e.longitude).toFixed(4)}</span>
                  <span>🕐 {timeAgo(e.created_at)}</span>
                </div>

                {/* Action buttons — only for managers and admins */}
                {showActions && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                    {e.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatus(e.id, 'responding')}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                          {isUpdating ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '⚡'}
                          Accept & Respond
                        </button>
                        <button
                          onClick={() => handleStatus(e.id, 'cancelled')}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                          ✕ Reject
                        </button>
                      </>
                    )}
                    {e.status === 'responding' && (
                      <button
                        onClick={() => handleStatus(e.id, 'resolved')}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                        {isUpdating ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '✅'}
                        Mark as Resolved
                      </button>
                    )}
                    {(e.status === 'resolved' || e.status === 'cancelled') && (
                      <span className="text-gray-600 text-xs italic">No further action needed</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}