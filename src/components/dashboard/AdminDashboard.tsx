import { useEffect, useState } from 'react'
import { emergencyAPI, resourceAPI, authAPI, notificationAPI } from '../../services/api'
import { Emergency, Resource, User, Notification } from '../../types'
import { useSocket } from '../../context/SocketContext'
import { timeAgo } from '../../utils/formatters'
import StatsChart from './StatsChart'

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
    pending: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Pending' },
    responding: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Responding' },
    resolved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Resolved' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', label: 'Rejected' },
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

const ROLE_COLORS: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    resource_manager: 'bg-amber-100 text-amber-700',
    user: 'bg-blue-100 text-blue-700',
}

export default function AdminDashboard() {
    const [emergencies, setEmergencies] = useState<Emergency[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [auditLogs, setAuditLogs] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'resources' | 'audit'>('overview')
    const { liveEmergencies } = useSocket()

    const load = async () => {
        try {
            const [e, r, u, n] = await Promise.all([
                emergencyAPI.list() as Promise<Emergency[]>,
                resourceAPI.list() as Promise<Resource[]>,
                authAPI.getAllUsers() as Promise<User[]>,
                notificationAPI.list() as Promise<Notification[]>,
            ])
            setEmergencies(e)
            setResources(r)
            setUsers(u)
            setAuditLogs(n)
        } catch (err) {
            console.error('AdminDashboard load error:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const changeRole = async (id: string, role: string) => {
        try {
            await authAPI.updateUserRole(id, role)
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role: role as any } : u))
        } catch (err: any) {
            alert('Failed to change role: ' + err.message)
        }
    }

    const all = [...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)), ...emergencies]
    const pending = all.filter(e => e.status === 'pending').length
    const responding = all.filter(e => e.status === 'responding').length
    const resolved = all.filter(e => e.status === 'resolved').length
    const cancelled = all.filter(e => e.status === 'cancelled').length
    const available = resources.filter(r => r.available).length

    if (loading) return <div className="p-6 text-center py-20 text-gray-400">Loading...</div>

    const TABS = [
        { key: 'overview', label: 'Overview', count: null },
        { key: 'users', label: 'Users', count: users.length },
        { key: 'resources', label: 'Resources', count: resources.length },
        { key: 'audit', label: 'Audit Log', count: auditLogs.length },
    ] as const

    return (
        <div className="p-6 space-y-5" style={{ background: '#f8f9fa', minHeight: '100%' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Full system control and monitoring</p>
                </div>
                {liveEmergencies.length > 0 && (
                    <span className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 text-sm font-semibold px-4 py-2 rounded-full animate-pulse">
                        🔴 {liveEmergencies.length} live
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${activeTab === t.key ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                            }`}>
                        {t.label}
                        {t.count !== null && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === t.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                                }`}>{t.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
                <div className="space-y-5">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Emergencies</p>
                        <div className="grid grid-cols-5 gap-3">
                            {[
                                { label: 'Total', value: all.length, bg: 'bg-white', text: 'text-gray-800', border: 'border-gray-200' },
                                { label: 'Pending', value: pending, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                                { label: 'Responding', value: responding, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                                { label: 'Resolved', value: resolved, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                                { label: 'Rejected', value: cancelled, bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
                            ].map(s => (
                                <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center shadow-sm`}>
                                    <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                                    <p className="text-gray-500 text-xs mt-1 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">Platform</p>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'Resources', value: resources.length, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                                { label: 'Available', value: available, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                                { label: 'Users', value: users.length, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                                { label: 'Live now', value: liveEmergencies.length, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
                            ].map(s => (
                                <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center shadow-sm`}>
                                    <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                                    <p className="text-gray-500 text-xs mt-1 font-medium">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {all.length > 0 && <StatsChart emergencies={all} />}
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-3">User roles</p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { role: 'user', label: 'Citizens', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                                { role: 'resource_manager', label: 'Managers', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                                { role: 'admin', label: 'Admins', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                            ].map(r => (
                                <div key={r.role} className={`${r.bg} border ${r.border} rounded-xl p-5 text-center shadow-sm`}>
                                    <p className={`text-3xl font-bold ${r.text}`}>{users.filter(u => u.role === r.role).length}</p>
                                    <p className="text-gray-500 text-xs mt-1 font-medium">{r.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── USERS ── */}
            {activeTab === 'users' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold">All users</h3>
                        <p className="text-gray-400 text-xs mt-0.5">Change roles using the dropdown on each row</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {['User', 'Email', 'Phone', 'Role', 'Joined', 'Change role'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-700 text-sm font-bold shrink-0">
                                                    {u.name[0].toUpperCase()}
                                                </div>
                                                <span className="text-gray-800 font-medium">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{u.phone || '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${ROLE_COLORS[u.role]}`}>
                                                {u.role.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-400 text-xs">{timeAgo(u.created_at)}</td>
                                        <td className="px-5 py-3.5">
                                            <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                                                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:border-red-400 cursor-pointer">
                                                <option value="user">User</option>
                                                <option value="resource_manager">Resource Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── RESOURCES ── */}
            {activeTab === 'resources' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold">All resources</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {['Name', 'Type', 'Address', 'Cap', 'Manager', 'Status'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-gray-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {resources.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-gray-800 font-medium">{r.name}</td>
                                        <td className="px-5 py-3.5 text-gray-500 capitalize text-xs">{r.type.replace('_', ' ')}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs truncate">{r.address}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{r.capacity}</td>
                                        <td className="px-5 py-3.5 text-gray-500 text-xs">{(r as any).manager_name || '—'}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {r.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── AUDIT LOG ── */}
            {activeTab === 'audit' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Total events', value: auditLogs.length, bg: 'bg-white border-gray-200', text: 'text-gray-800' },
                            { label: 'Unread', value: auditLogs.filter(n => !n.read).length, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
                            { label: 'Emergency events', value: all.length, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
                        ].map(s => (
                            <div key={s.label} className={`border rounded-xl p-4 text-center shadow-sm ${s.bg}`}>
                                <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                                <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-gray-800 font-semibold">Activity log</h3>
                            <p className="text-gray-400 text-xs mt-0.5">System-wide actions — who did what, when, on which emergency</p>
                        </div>
                        {auditLogs.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                <p className="text-2xl mb-2">📋</p>
                                <p>No activity yet. Audit events appear here as managers accept, reject and resolve emergencies.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {auditLogs.map((n, idx) => (
                                    <div key={n.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                        <span className="text-gray-300 text-xs font-mono w-6 text-right shrink-0 mt-0.5">{idx + 1}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${!n.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            {n.message.startsWith('📋') ? '📋' :
                                                n.message.startsWith('⚡') ? '⚡' :
                                                    n.message.startsWith('✅') ? '✅' :
                                                        n.message.startsWith('✕') ? '✕' : '🔔'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-relaxed ${!n.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                <span>{timeAgo(n.sent_at)}</span>
                                                <span>{new Date(n.sent_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                        </div>
                                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}