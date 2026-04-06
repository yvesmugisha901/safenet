import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ReportEmergencyForm from '../components/emergency/ReportEmergencyForm'
import EmergencyList from '../components/emergency/EmergencyList'
import Modal from '../components/shared/Modal'
import { useEmergencies } from '../hooks/useEmergencies'
import { useSocket } from '../context/SocketContext'

export default function EmergenciesPage() {
  const { user } = useAuth()
  const { emergencies, loading, refetch } = useEmergencies()
  const { liveEmergencies } = useSocket()
  const [showForm, setShowForm] = useState(false)

  // Users only see their own reports
  // Managers and admins see all
  const filtered = user?.role === 'user'
    ? emergencies.filter(e => e.reported_by === user.id)
    : emergencies

  const all = [
    ...liveEmergencies.filter(le => !filtered.find(e => e.id === le.id) && (
      user?.role !== 'user' || le.reported_by === user.id
    )),
    ...filtered,
  ]

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {user?.role === 'user' ? 'My Reports' : 'Emergencies'}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {user?.role === 'user'
              ? 'Track the status of emergencies you reported'
              : user?.role === 'resource_manager'
                ? 'Respond to and manage incoming emergencies'
                : 'View and manage all reported emergencies'}
          </p>
        </div>
        {/* Only users and admins can report — managers respond, not report */}
        {(user?.role === 'user' || user?.role === 'admin') && (
          <button onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-red-900/20">
            🚨 Report Emergency
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-16">Loading...</div>
      ) : (
        <EmergencyList
          emergencies={all}
          onUpdate={refetch}
          showActions={user?.role === 'resource_manager' || user?.role === 'admin'}
        />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Report an Emergency">
        <ReportEmergencyForm onSuccess={() => { setShowForm(false); refetch() }} />
      </Modal>
    </div>
  )
}