import { useState } from 'react'
import EmergencyList from '../components/emergency/EmergencyList'
import ReportEmergencyForm from '../components/emergency/ReportEmergencyForm'
import Modal from '../components/shared/Modal'
import { useEmergencies } from '../hooks/useEmergencies'
import { useSocket } from '../context/SocketContext'

export default function EmergenciesPage() {
  const { emergencies, loading, refetch } = useEmergencies()
  const { liveEmergencies } = useSocket()
  const [showForm, setShowForm] = useState(false)

  const allEmergencies = [
    ...liveEmergencies.filter(le => !emergencies.find(e => e.id === le.id)),
    ...emergencies,
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Emergencies</h1>
        <button onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
          🚨 Report Emergency
        </button>
      </div>
      {loading ? (
        <div className="text-gray-500 text-center py-16">Loading...</div>
      ) : (
        <EmergencyList emergencies={allEmergencies} onUpdate={refetch} />
      )}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Report Emergency">
        <ReportEmergencyForm onSuccess={() => { setShowForm(false); refetch() }} />
      </Modal>
    </div>
  )
}
