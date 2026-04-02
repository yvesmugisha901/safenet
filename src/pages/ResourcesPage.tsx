import { useState } from 'react'
import ResourceList from '../components/resources/ResourceList'
import AddResourceForm from '../components/resources/AddResourceForm'
import Modal from '../components/shared/Modal'
import { useAuth } from '../context/AuthContext'

export default function ResourcesPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Resources</h1>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg">
            + Add Resource
          </button>
        )}
      </div>
      <ResourceList key={refreshKey} />
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Resource">
        <AddResourceForm onSuccess={() => { setShowForm(false); setRefreshKey(k => k + 1) }} />
      </Modal>
    </div>
  )
}
