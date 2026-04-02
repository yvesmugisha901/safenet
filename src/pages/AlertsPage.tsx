import { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { emergencyAPI } from '../services/api'
import { Emergency } from '../types'
import { timeAgo } from '../utils/formatters'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-red-900/30 text-red-400 border-red-900/50',
    responding: 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50',
    resolved: 'bg-green-900/30 text-green-400 border-green-900/50',
    cancelled: 'bg-gray-800 text-gray-500 border-gray-700',
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function AlertsPage() {
    const { liveEmergencies } = useSocket()
    const [history, setHistory] = useState<Emergency[]>([])
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        emergencyAPI.list().then((data: any) => setHistory(data))
    }, [])

    // Merge live + history, deduplicated
    const all = [
        ...liveEmergencies.filter(le => !history.find(h => h.id === le.id)),
        ...history,
    ]

    const filtered = filter === 'all' ? all : all.filter(e => e.status === filter)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Alerts</h1>
                    <p className="text-gray-400 text-sm mt-1">All emergency alerts sent to resources</p>
                </div>
                {liveEmergencies.length > 0 && (
                    <span className="flex items-center gap-2 bg-red-900/30 border border-red-900/50 text-red-400 px-4 py-2 rounded-full text-sm animate-pulse">
                        🔴 {liveEmergencies.length} live right now
                    </span>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {['all', 'pending', 'responding', 'resolved', 'cancelled'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}>
                        {f}
                        <span className="ml-1.5 text-xs opacity-70">
                            ({f === 'all' ? all.length : all.filter(e => e.status === f).length})
                        </span>
                    </button>
                ))}
            </div>

            {/* Alert cards */}
            {filtered.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center text-gray-500">
                    No alerts found
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(e => {
                        const isLive = liveEmergencies.some(le => le.id === e.id)
                        return (
                            <div key={e.id}
                                className={`bg-gray-900 border rounded-xl p-5 transition-colors ${isLive ? 'border-red-800 shadow-lg shadow-red-900/20' : 'border-gray-800'
                                    }`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl mt-0.5">{TYPE_ICONS[e.type]}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-semibold">{e.title}</h3>
                                                {isLive && (
                                                    <span className="text-xs bg-red-900/50 text-red-400 border border-red-800 px-2 py-0.5 rounded-full animate-pulse">
                                                        LIVE
                                                    </span>
                                                )}
                                            </div>
                                            {e.description && (
                                                <p className="text-gray-400 text-sm mt-1">{e.description}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                <span className="capitalize">📂 {e.type}</span>
                                                <span>👤 {e.reported_by_name || 'Unknown'}</span>
                                                <span>📍 {Number(e.latitude).toFixed(4)}, {Number(e.longitude).toFixed(4)}</span>
                                                <span>🕐 {timeAgo(e.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium capitalize border ${STATUS_STYLES[e.status]}`}>
                                        {e.status}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}