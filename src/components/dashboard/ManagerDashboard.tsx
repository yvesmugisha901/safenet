import { useEffect, useState, useCallback } from 'react'
import { emergencyAPI, resourceAPI } from '../../services/api'
import { Emergency, Resource } from '../../types'
import { useSocket } from '../../context/SocketContext'
import { useNotifications } from '../../hooks/useNotifications'
import { timeAgo } from '../../utils/formatters'
import Modal from '../shared/Modal'
import AddResourceForm from '../resources/AddResourceForm'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-red-100 text-red-700 border-red-200',
    responding: 'bg-amber-100 text-amber-700 border-amber-200',
    resolved: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function ManagerDashboard() {
    const { liveEmergencies } = useSocket()
    const { unreadCount } = useNotifications()
    const [emergencies, setEmergencies] = useState<Emergency[]>([])
    const [myResources, setMyResources] = useState<Resource[]>([])
    const [allAvailable, setAllAvailable] = useState<Resource[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [showAddResource, setShowAddResource] = useState(false)

    const load = useCallback(async () => {
        try {
            const [e, mine, all] = await Promise.all([
                emergencyAPI.list() as Promise<Emergency[]>,
                resourceAPI.mine() as Promise<Resource[]>,
                resourceAPI.list() as Promise<Resource[]>,
            ])
            setEmergencies(e)
            setMyResources(mine)
            setAllAvailable(all.filter(r => r.available))
        } catch (err) {
            console.error('Load error:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const changeStatus = async (id: string, status: string) => {
        if (updating) return
        setUpdating(id + status)
        try {
            await emergencyAPI.updateStatus(id, status)
            setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status: status as any } : e))
        } catch (err: any) {
            alert('Failed: ' + (err.message || 'Unknown error'))
        } finally {
            setUpdating(null)
        }
    }

    const toggleResource = async (id: string, available: boolean) => {
        try {
            await resourceAPI.update(id, { available })
            setMyResources(prev => prev.map(r => r.id === id ? { ...r, available } : r))
            // Also update the available list
            const all = await resourceAPI.list() as Resource[]
            setAllAvailable(all.filter(r => r.available))
        } catch (err: any) {
            alert('Failed: ' + (err.message || 'Unknown error'))
        }
    }

    const all = [...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)), ...emergencies]

    if (loading) return <div className="p-6 text-center py-20 text-gray-400">Loading...</div>

    return (
        <div className="p-6 space-y-6" style={{ background: '#f8f9fa', minHeight: '100%' }}>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Resource Manager</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Manage your resources and respond to emergencies</p>
                </div>
                {unreadCount > 0 && (
                    <span className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full">
                        🔔 {unreadCount} new alert{unreadCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Need response', value: all.filter(e => e.status === 'pending').length, bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
                    { label: 'Responding', value: all.filter(e => e.status === 'responding').length, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
                    { label: 'My resources', value: myResources.length, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
                    { label: 'Available now', value: myResources.filter(r => r.available).length, bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
                ].map(s => (
                    <div key={s.label} className={`border rounded-xl p-4 text-center ${s.bg}`}>
                        <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                        <p className="text-gray-500 text-xs mt-1 font-medium">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* My Resources */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-800 font-semibold">My Resources</h3>
                            <p className="text-gray-400 text-xs mt-0.5">Toggle availability as capacity changes</p>
                        </div>
                        <button onClick={() => setShowAddResource(true)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                            + Add Resource
                        </button>
                    </div>
                    {myResources.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm mb-3">No resources assigned to you yet</p>
                            <button onClick={() => setShowAddResource(true)}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                                + Add your first resource
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {myResources.map(r => (
                                <div key={r.id} className="flex items-center justify-between px-5 py-3.5">
                                    <div>
                                        <p className="text-gray-800 text-sm font-medium">{r.name}</p>
                                        <p className="text-gray-400 text-xs capitalize">{r.type.replace('_', ' ')} · Cap: {r.capacity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {r.available ? 'Available' : 'Busy'}
                                        </span>
                                        <button onClick={() => toggleResource(r.id, !r.available)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg transition-colors">
                                            Toggle
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Available Resources */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold">All Available Resources</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{allAvailable.length} resource{allAvailable.length !== 1 ? 's' : ''} currently available system-wide</p>
                    </div>
                    {allAvailable.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No resources available right now</p>
                    ) : (
                        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                            {allAvailable.map(r => (
                                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-gray-800 text-sm font-medium">{r.name}</p>
                                        <p className="text-gray-400 text-xs capitalize">{r.type.replace('_', ' ')} {r.manager_name ? `· ${r.manager_name}` : ''}</p>
                                    </div>
                                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">Available</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Incoming Emergencies */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-gray-800 font-semibold">Incoming Emergencies</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Accept to respond · Reject if outside your scope</p>
                    </div>
                    {liveEmergencies.length > 0 && (
                        <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full animate-pulse font-semibold">
                            🔴 {liveEmergencies.length} live
                        </span>
                    )}
                </div>
                {all.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No emergencies at this time</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {all.map(e => {
                            const isLive = liveEmergencies.some(le => le.id === e.id)
                            return (
                                <div key={e.id} className={`p-5 ${isLive ? 'bg-red-50/40' : ''}`}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isLive ? 'bg-red-100' : 'bg-gray-50'}`}>
                                            {TYPE_ICONS[e.type]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-800 font-semibold text-sm">{e.title}</p>
                                                    {isLive && <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full animate-pulse font-semibold">LIVE</span>}
                                                </div>
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[e.status]}`}>{e.status}</span>
                                            </div>
                                            {e.description && <p className="text-gray-500 text-sm mt-0.5">{e.description}</p>}
                                            <p className="text-gray-400 text-xs mt-1">{e.reported_by_name || 'Anonymous'} · {timeAgo(e.created_at)}</p>
                                        </div>
                                    </div>
                                    {e.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <button onClick={() => changeStatus(e.id, 'responding')} disabled={updating === e.id + 'responding'}
                                                className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                                                {updating === e.id + 'responding' ? 'Processing...' : '⚡ Accept & Respond'}
                                            </button>
                                            <button onClick={() => changeStatus(e.id, 'cancelled')} disabled={updating === e.id + 'cancelled'}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-bold py-3 rounded-xl text-sm transition-colors">
                                                {updating === e.id + 'cancelled' ? 'Processing...' : '✕ Reject'}
                                            </button>
                                        </div>
                                    )}
                                    {e.status === 'responding' && (
                                        <button onClick={() => changeStatus(e.id, 'resolved')} disabled={updating === e.id + 'resolved'}
                                            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                                            {updating === e.id + 'resolved' ? 'Processing...' : '✅ Mark as Resolved'}
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <Modal open={showAddResource} onClose={() => setShowAddResource(false)} title="Add New Resource">
                <AddResourceForm onSuccess={() => { setShowAddResource(false); load() }} />
            </Modal>
        </div>
    )
}