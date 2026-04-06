import { useState } from 'react'
import { emergencyAPI } from '../../services/api'
import { EmergencyType } from '../../types'
import { getCurrentLocation } from '../../utils/geo'

const TYPES: { value: EmergencyType; label: string; icon: string }[] = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'crime', label: 'Crime', icon: '🚨' },
  { value: 'other', label: 'Other', icon: '⚠️' },
]

interface Props { onSuccess?: () => void }

export default function ReportEmergencyForm({ onSuccess }: Props) {
  const [type, setType] = useState<EmergencyType>('medical')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const getLocation = async () => {
    setLocating(true)
    setError('')
    try {
      const pos = await getCurrentLocation()
      setLat(String(pos.lat))
      setLng(String(pos.lng))
    } catch {
      setError('Could not detect location. Enter manually below.')
    } finally {
      setLocating(false)
    }
  }

  const submit = async () => {
    if (!title.trim()) { setError('Please enter a title.'); return }
    if (!lat || !lng) { setError('Please provide your location.'); return }
    setError('')
    setLoading(true)
    try {
      await emergencyAPI.report({
        title: title.trim(),
        description: desc.trim(),
        type,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      })
      setDone(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">✅</div>
        <p className="text-white font-bold text-lg">Report sent!</p>
        <p className="text-gray-400 text-sm mt-1 mb-5">Nearby resource managers have been alerted.</p>
        <button
          onClick={() => { setDone(false); setTitle(''); setDesc(''); setLat(''); setLng('') }}
          className="text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2 rounded-lg">
          Report another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Error */}
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2.5 text-sm">
          {error}
        </div>
      )}

      {/* Type pills */}
      <div className="grid grid-cols-3 gap-2">
        {TYPES.map(t => (
          <button key={t.value} type="button"
            onClick={() => setType(t.value)}
            className={`py-2.5 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${type === t.value
              ? 'border-red-500 bg-red-900/30 text-white'
              : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
              }`}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="What happened? (required)"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm"
      />

      {/* Description */}
      <textarea
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="More details... (optional)"
        rows={2}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm resize-none"
      />

      {/* Location */}
      <div>
        <button type="button" onClick={getLocation} disabled={locating}
          className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-all ${lat
            ? 'border-green-600 bg-green-900/20 text-green-400'
            : 'border-gray-600 bg-gray-800 text-gray-400 hover:border-gray-400'
            }`}>
          {locating ? '📍 Detecting...' : lat ? `📍 ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : '📍 Use my location'}
        </button>
        {!lat && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input type="number" value={lat} onChange={e => setLat(e.target.value)}
              placeholder="Latitude"
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-red-500" />
            <input type="number" value={lng} onChange={e => setLng(e.target.value)}
              placeholder="Longitude"
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-red-500" />
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <button
        type="button"
        onClick={submit}
        disabled={loading || !title.trim()}
        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-colors">
        {loading ? 'Sending...' : '🚨 Submit Emergency Report'}
      </button>

    </div>
  )
}