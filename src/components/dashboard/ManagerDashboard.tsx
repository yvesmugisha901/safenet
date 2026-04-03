import { useEffect, useState } from 'react'
import { emergencyAPI, resourceAPI } from '../../services/api'
import { Emergency, Resource } from '../../types'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { timeAgo } from '../../utils/formatters'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-red-900/30 text-red-400 border-red-900/50',
    responding: 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50',
    resolved: 'bg-green-900/30 text-green-400 border-green-900/50',
    cancelled: 'bg-gray-800 text-gray-500 border-gray-700',
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function ManagerDashboard() {
    const { user } = useAuth()
    const { liveEmergencies } = useSocket()
    const [emergencies, setEmergencies] = useState<Emergency[]>([])
    const [myResources, setMyResources] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    const load = async () => {
        const [e, r] = await Promise.all([
            emergencyAPI.list() as Promise<Emergency[]>,
            resourceAPI.list() as Promise<Resource[]>,
        ])
        setEmergencies(e)
        setMyResources(r.filter(res => res.manager_id === user?.id))
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleStatus = async (id: string, status: string) => {
        setUpdating(id)
        try {
            await emergencyAPI.updateStatus(id, status)
            await load()
        } finally { setUpdating(null) }
    }

    const handleToggle = async (id: string, available: boolean) => {
        await resourceAPI.update(id, { available })
        await load()
    }

    const all = [
        ...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)),
        ...emergencies,
    ]

    const myPending = all.filter(e => e.status === 'pending').length
    const myResponding = all.filter(e => e.status === 'responding').length

    if (loading) return <div className="p-6 text-gray-500 text-center py-20">Loading...</div>

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Resource Manager Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Manage your resources and respond to incoming emergencies</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Alerts', value: myPending, icon: '🔴', color: 'red' as const },
                    { label: 'Responding', value: myResponding, icon: '🟡', color: 'yellow' as const },
                    { label: 'My Resources', value: myResources.length, icon: '🏥', color: 'blue' as const },
                    { label: 'Available', value: myResources.filter(r => r.available).length, icon: '✅', color: 'green' as const },
                ].map(s => (
                    <div key={s.label} className={`border rounded-xl p-5 ${s.color === 'red' ? 'bg-red-900/20 border-red-900/40' :
                        s.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-900/40' :
                            s.color === 'green' ? 'bg-green-900/20 border-green-900/40' :
                                'bg-blue-900/20 border-blue-900/40'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-400 text-sm">{s.label}</p>
                            <span className="text-2xl">{s.icon}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* My Resources */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                    <h3 className="text-white font-semibold">My Resources</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Toggle availability as your capacity changes</p>
                </div>
                {myResources.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 text-sm">No resources assigned to you yet</p>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {myResources.map(r => (
                            <div key={r.id} className="flex items-center justify-between px-5 py-4">
                                <div>
                                    <p className="text-white font-medium">{r.name}</p>
                                    <p className="text-gray-500 text-xs capitalize mt-0.5">{r.type.replace('_', ' ')} · {r.address}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                        }`}>
                                        {r.available ? 'Available' : 'Unavailable'}
                                    </span>
                                    <button onClick={() => handleToggle(r.id, !r.available)}
                                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                                        Toggle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Incoming Emergencies */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-semibold">Incoming Emergencies</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Accept and respond to emergencies in your area</p>
                    </div>
                    {liveEmergencies.length > 0 && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-900/20 px-3 py-1 rounded-full border border-red-900/40 animate-pulse">
                            🔴 {liveEmergencies.length} live
                        </span>
                    )}
                </div>
                <div className="divide-y divide-gray-800">
                    {all.slice(0, 8).map(e => {
                        const isLive = liveEmergencies.some(le => le.id === e.id)
                        return (
                            <div key={e.id} className={`px-5 py-4 ${isLive ? 'bg-red-900/10' : ''}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl mt-0.5">{TYPE_ICONS[e.type]}</span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-white font-medium text-sm">{e.title}</p>
                                                {isLive && <span className="text-xs bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded animate-pulse">LIVE</span>}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-0.5">{timeAgo(e.created_at)} · {e.reported_by_name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_COLORS[e.status]}`}>
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
                        )
                    })}
                </div>
            </div>
        </div>
    )
}