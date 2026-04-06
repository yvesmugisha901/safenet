import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { emergencyAPI } from '../services/api'
import { Emergency } from '../types'
import { timeAgo } from '../utils/formatters'

const STATUS_STYLES: Record<string, { pill: string; label: string }> = {
    pending: { pill: 'bg-red-100 text-red-700 border-red-200', label: 'Pending' },
    responding: { pill: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Responding' },
    resolved: { pill: 'bg-green-100 text-green-700 border-green-200', label: 'Resolved' },
    cancelled: { pill: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Rejected' },
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function AlertsPage() {
    const { user } = useAuth()
    const { liveEmergencies } = useSocket()
    const [emergencies, setEmergencies] = useState<Emergency[]>([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        emergencyAPI.list().then((data: any) => setEmergencies(data)).finally(() => setLoading(false))
    }, [])

    // Redirect users away — alerts page is only for managers and admins
    if (user?.role === 'user') {
        return (
            <div className="p-6 max-w-md mx-auto text-center py-20">
                <span className="text-4xl block mb-4">🔒</span>
                <h2 className="text-gray-800 font-bold text-lg mb-2">Access Restricted</h2>
                <p className="text-gray-500 text-sm">Alerts are managed by resource managers and administrators. Check your notifications for updates on your reports.</p>
            </div>
        )
    }

    const all = [
        ...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)),
        ...emergencies,
    ]

    const filtered = filter === 'all' ? all : all.filter(e =>
        filter === 'cancelled' ? e.status === 'cancelled' : e.status === filter
    )

    const counts = {
        all: all.length,
        pending: all.filter(e => e.status === 'pending').length,
        responding: all.filter(e => e.status === 'responding').length,
        resolved: all.filter(e => e.status === 'resolved').length,
        cancelled: all.filter(e => e.status === 'cancelled').length,
    }

    return (
        <div className="p-6 space-y-5" style={{ background: '#f8f9fa', minHeight: '100%' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Alert Monitor</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {user?.role === 'admin' ? 'All emergency alerts across the system' : 'Emergency alerts sent to your resources'}
                    </p>
                </div>
                {liveEmergencies.length > 0 && (
                    <span className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        {liveEmergencies.length} live
                    </span>
                )}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { key: 'all', label: 'Total', color: 'bg-white border-gray-200 text-gray-800' },
                    { key: 'pending', label: 'Pending', color: 'bg-red-50 border-red-200 text-red-700' },
                    { key: 'responding', label: 'Responding', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                    { key: 'resolved', label: 'Resolved', color: 'bg-green-50 border-green-200 text-green-700' },
                    { key: 'cancelled', label: 'Rejected', color: 'bg-gray-50 border-gray-200 text-gray-600' },
                ].map(c => (
                    <button key={c.key} onClick={() => setFilter(c.key)}
                        className={`border rounded-xl p-4 text-center transition-all ${c.color} ${filter === c.key ? 'ring-2 ring-offset-1 ring-gray-400' : 'hover:shadow-sm'}`}>
                        <p className="text-2xl font-bold">{counts[c.key as keyof typeof counts]}</p>
                        <p className="text-xs font-medium mt-0.5">{c.label}</p>
                    </button>
                ))}
            </div>

            {/* Alert list */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                    <span className="text-3xl block mb-2">📭</span>
                    <p className="text-gray-400 text-sm">No alerts found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(e => {
                        const isLive = liveEmergencies.some(le => le.id === e.id)
                        const style = STATUS_STYLES[e.status]
                        return (
                            <div key={e.id}
                                className={`bg-white border rounded-xl p-5 transition-all ${isLive ? 'border-red-300 shadow-md shadow-red-50' : 'border-gray-200 hover:shadow-sm'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isLive ? 'bg-red-50' : 'bg-gray-50'}`}>
                                        {TYPE_ICONS[e.type]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-gray-900 font-semibold">{e.title}</h3>
                                                    {isLive && <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full animate-pulse font-semibold">LIVE</span>}
                                                </div>
                                                {e.description && <p className="text-gray-500 text-sm mt-0.5">{e.description}</p>}
                                            </div>
                                            <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${style.pill}`}>
                                                {style.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                                            <span className="capitalize">📂 {e.type}</span>
                                            <span>👤 {e.reported_by_name || 'Anonymous'}</span>
                                            <span>📍 {Number(e.latitude).toFixed(4)}, {Number(e.longitude).toFixed(4)}</span>
                                            <span>🕐 {timeAgo(e.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}