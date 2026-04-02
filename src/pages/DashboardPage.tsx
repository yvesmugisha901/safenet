import { useEffect, useState } from 'react'
import { emergencyAPI, resourceAPI } from '../services/api'
import { Emergency, Resource } from '../types'
import { useSocket } from '../context/SocketContext'
import StatCard from '../components/dashboard/StatCard'
import StatsChart from '../components/dashboard/StatsChart'
import EmergencyTable from '../components/dashboard/EmergencyTable'

export default function DashboardPage() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const { liveEmergencies } = useSocket()

  useEffect(() => {
    Promise.all([
      emergencyAPI.list() as Promise<Emergency[]>,
      resourceAPI.list() as Promise<Resource[]>,
    ]).then(([e, r]) => {
      setEmergencies(e)
      setResources(r)
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

  if (loading) return (
    <div className="p-6 text-gray-500 text-center py-20">Loading dashboard...</div>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of all emergencies and resources</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Emergencies" value={all.length} icon="📋" color="white" />
        <StatCard label="Pending" value={pending} icon="🔴" color="red" />
        <StatCard label="Responding" value={responding} icon="🟡" color="yellow" />
        <StatCard label="Resolved" value={resolved} icon="🟢" color="green" />
      </div>

      {/* Resources summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Resources" value={resources.length} icon="🏥" color="blue" />
        <StatCard label="Available" value={available} icon="✅" color="green" />
        <StatCard label="Unavailable" value={resources.length - available} icon="❌" color="red" />
        <StatCard label="Live Alerts" value={liveEmergencies.length} icon="⚡" color="yellow" />
      </div>

      {/* Charts */}
      {all.length > 0 && <StatsChart emergencies={all} />}

      {/* Recent emergencies table */}
      <EmergencyTable emergencies={all.slice(0, 8)} />
    </div>
  )
}