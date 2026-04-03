import { useEffect, useState } from 'react'
import { emergencyAPI, resourceAPI, authAPI } from '../../services/api'
import { Emergency, Resource, User } from '../../types'
import { useSocket } from '../../context/SocketContext'
import StatCard from './StatCard'
import StatsChart from './StatsChart'
import EmergencyTable from './EmergencyTable'

export default function AdminDashboard() {
    const [emergencies, setEmergencies] = useState<Emergency[]>([])
    const [resources, setResources] = useState<Resource[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const { liveEmergencies } = useSocket()

    useEffect(() => {
        Promise.all([
            emergencyAPI.list() as Promise<Emergency[]>,
            resourceAPI.list() as Promise<Resource[]>,
            authAPI.getAllUsers() as Promise<User[]>,
        ]).then(([e, r, u]) => {
            setEmergencies(e)
            setResources(r)
            setUsers(u)
        }).finally(() => setLoading(false))
    }, [])

    const all = [
        ...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)),
        ...emergencies,
    ]

    const pending = all.filter(e => e.status === 'pending').length
    const responding = all.filter(e => e.status === 'responding').length
    const resolved = all.filter(e => e.status === 'resolved').length
    const available = resources.filter(r => r.available).length

    if (loading) return <div className="p-6 text-gray-500 text-center py-20">Loading...</div>

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Full system overview — all emergencies, resources and users</p>
            </div>

            {/* Emergency stats */}
            <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-semibold">Emergencies</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total" value={all.length} icon="📋" color="white" />
                    <StatCard label="Pending" value={pending} icon="🔴" color="red" />
                    <StatCard label="Responding" value={responding} icon="🟡" color="yellow" />
                    <StatCard label="Resolved" value={resolved} icon="🟢" color="green" />
                </div>
            </div>

            {/* Resource + user stats */}
            <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-semibold">Platform</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Resources" value={resources.length} icon="🏥" color="blue" />
                    <StatCard label="Available" value={available} icon="✅" color="green" />
                    <StatCard label="Total Users" value={users.length} icon="👥" color="blue" />
                    <StatCard label="Live Alerts" value={liveEmergencies.length} icon="⚡" color="yellow" />
                </div>
            </div>

            {/* Charts */}
            {all.length > 0 && <StatsChart emergencies={all} />}

            {/* User breakdown */}
            <div className="grid grid-cols-3 gap-4">
                {(['user', 'resource_manager', 'admin'] as const).map(role => (
                    <div key={role} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                        <p className="text-3xl font-bold text-white">{users.filter(u => u.role === role).length}</p>
                        <p className="text-gray-400 text-sm mt-1 capitalize">{role.replace('_', ' ')}s</p>
                    </div>
                ))}
            </div>

            {/* Recent emergencies */}
            <EmergencyTable emergencies={all.slice(0, 10)} />
        </div>
    )
}