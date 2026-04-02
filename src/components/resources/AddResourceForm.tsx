import { useState } from 'react'
import { resourceAPI } from '../../services/api'

interface Props { onSuccess?: () => void }

export default function AddResourceForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ name: '', type: 'hospital', address: '', latitude: '', longitude: '', capacity: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resourceAPI.create({ ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), capacity: parseInt(form.capacity) || 0 })
      setForm({ name: '', type: 'hospital', address: '', latitude: '', longitude: '', capacity: '', phone: '' })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="text-white font-semibold text-lg">Add New Resource</h3>
      {error && <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-3 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Name', key: 'name', type: 'text', placeholder: 'King Faisal Hospital' },
          { label: 'Address', key: 'address', type: 'text', placeholder: 'KG 544 St, Kigali' },
          { label: 'Latitude', key: 'latitude', type: 'number', placeholder: '-1.9536' },
          { label: 'Longitude', key: 'longitude', type: 'number', placeholder: '30.0912' },
          { label: 'Capacity', key: 'capacity', type: 'number', placeholder: '100' },
          { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+250 788 000 000' },
        ].map(f => (
          <div key={f.key}>
            <label className="text-gray-400 text-sm block mb-1">{f.label}</label>
            <input type={f.type} value={(form as any)[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder={f.placeholder} required={['name', 'address', 'latitude', 'longitude'].includes(f.key)} />
          </div>
        ))}
      </div>
      <div>
        <label className="text-gray-400 text-sm block mb-1">Type</label>
        <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
          {['hospital', 'fire_station', 'shelter', 'police', 'volunteer'].map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Resource'}
      </button>
    </form>
  )
}
