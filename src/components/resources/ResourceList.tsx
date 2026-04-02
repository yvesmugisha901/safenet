import { useEffect, useState } from 'react'
import { Resource } from '../../types'
import { resourceAPI } from '../../services/api'
import ResourceCard from './ResourceCard'

export default function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    try {
      const data = await resourceAPI.list() as Resource[]
      setResources(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleToggle = async (id: string, available: boolean) => {
    await resourceAPI.update(id, { available })
    load()
  }

  const filtered = filter === 'all' ? resources : resources.filter(r =>
    filter === 'available' ? r.available : !r.available
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'available', 'unavailable'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter === f ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}>
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-gray-500 text-center py-10">Loading resources...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No resources found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => <ResourceCard key={r.id} resource={r} onToggle={handleToggle} />)}
        </div>
      )}
    </div>
  )
}
