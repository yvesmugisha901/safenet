import { useState } from 'react'
import { resourceAPI } from '../../services/api'
import { getCurrentLocation } from '../../utils/geo'

interface Props { onSuccess?: () => void }

export default function AddResourceForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '', type: 'hospital', address: '',
    latitude: '', longitude: '', capacity: '', phone: ''
  })
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getLocation = async () => {
    setLocating(true)
    setError('')
    try {
      const { lat, lng } = await getCurrentLocation()
      setForm(f => ({ ...f, latitude: String(lat), longitude: String(lng) }))
    } catch {
      setError('Could not detect location. Please enter manually.')
    } finally {
      setLocating(false)
    }
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) { setError('Name is required'); return }
    if (!form.address.trim()) { setError('Address is required'); return }
    if (!form.latitude || !form.longitude) { setError('Location is required — use the button or enter manually'); return }

    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (isNaN(lat) || isNaN(lng)) { setError('Invalid latitude or longitude'); return }

    setLoading(true)
    try {
      await resourceAPI.create({
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim(),
        latitude: lat,
        longitude: lng,
        capacity: parseInt(form.capacity) || 0,
        phone: form.phone.trim() || undefined,
      })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create resource')
    } finally {
      setLoading(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm">{error}</div>
      )}

      {/* Name */}
      <div>
        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Resource name *</label>
        <input value={form.name} onChange={set('name')}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
          placeholder="e.g. King Faisal Hospital" />
      </div>

      {/* Type */}
      <div>
        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Type *</label>
        <select value={form.type} onChange={set('type')}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400">
          <option value="hospital">🏥 Hospital</option>
          <option value="fire_station">🚒 Fire Station</option>
          <option value="police">👮 Police</option>
          <option value="shelter">🏠 Shelter</option>
          <option value="volunteer">🤝 Volunteer</option>
        </select>
      </div>

      {/* Address */}
      <div>
        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Address *</label>
        <input value={form.address} onChange={set('address')}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
          placeholder="e.g. KG 544 St, Kigali" />
      </div>

      {/* Location */}
      <div>
        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Location *</label>
        <button type="button" onClick={getLocation} disabled={locating}
          className={`w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all mb-2 ${form.latitude
            ? 'border-green-400 bg-green-50 text-green-700'
            : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400'
            }`}>
          {locating ? '📍 Detecting...' : form.latitude
            ? `📍 ${Number(form.latitude).toFixed(5)}, ${Number(form.longitude).toFixed(5)}`
            : '📍 Use resource current location'}
        </button>
        {!form.latitude && (
          <div className="grid grid-cols-2 gap-2">
            <input type="number" step="any" value={form.latitude} onChange={set('latitude')}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
              placeholder="Latitude" />
            <input type="number" step="any" value={form.longitude} onChange={set('longitude')}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
              placeholder="Longitude" />
          </div>
        )}
      </div>

      {/* Capacity + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Capacity</label>
          <input type="number" value={form.capacity} onChange={set('capacity')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
            placeholder="e.g. 100" />
        </div>
        <div>
          <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Phone</label>
          <input type="tel" value={form.phone} onChange={set('phone')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400"
            placeholder="+250 788 000 000" />
        </div>
      </div>

      <button type="button" onClick={handleSubmit} disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors">
        {loading ? 'Adding resource...' : '+ Add Resource'}
      </button>
    </div>
  )
}