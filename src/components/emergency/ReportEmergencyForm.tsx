import { useState } from 'react'
import { emergencyAPI } from '../../services/api'
import { EmergencyType, EmergencyPriority } from '../../types'
import { getCurrentLocation } from '../../utils/geo'

const TYPES: { value: EmergencyType; label: string; icon: string }[] = [
  { value: 'medical', label: 'Medical', icon: '🏥' },
  { value: 'fire', label: 'Fire', icon: '🔥' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'crime', label: 'Crime', icon: '🚨' },
  { value: 'other', label: 'Other', icon: '⚠️' },
]

const PRIORITIES: { value: EmergencyPriority; label: string; desc: string; color: string; bg: string; border: string }[] = [
  { value: 'low', label: 'Low', desc: 'Non-urgent, no immediate danger', color: '#38a169', bg: '#f0fff4', border: '#9ae6b4' },
  { value: 'medium', label: 'Medium', desc: 'Needs attention within minutes', color: '#d69e2e', bg: '#fffff0', border: '#faf089' },
  { value: 'high', label: 'High', desc: 'Urgent, life may be at risk', color: '#dd6b20', bg: '#fffaf0', border: '#fbd38d' },
  { value: 'critical', label: 'Critical', desc: 'Extreme danger — ALL resources alerted', color: '#e53e3e', bg: '#fff5f5', border: '#feb2b2' },
]

interface Props { onSuccess?: () => void }

export default function ReportEmergencyForm({ onSuccess }: Props) {
  const [type, setType] = useState<EmergencyType>('medical')
  const [priority, setPriority] = useState<EmergencyPriority>('medium')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const getLocation = async () => {
    setLocating(true); setError('')
    try {
      const pos = await getCurrentLocation()
      setLat(String(pos.lat)); setLng(String(pos.lng))
    } catch { setError('Could not detect location. Enter manually below.') }
    finally { setLocating(false) }
  }

  const submit = async () => {
    if (!title.trim()) { setError('Please enter a title'); return }
    if (!lat || !lng) { setError('Please provide your location'); return }
    setError(''); setLoading(true)
    try {
      await emergencyAPI.report({
        title: title.trim(), description: desc.trim(),
        type, priority,
        latitude: parseFloat(lat), longitude: parseFloat(lng),
      })
      setDone(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to submit')
    } finally { setLoading(false) }
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a2e', marginBottom: 8 }}>Report submitted!</p>
        <p style={{ fontSize: 14, color: '#718096', marginBottom: 20 }}>
          Nearby resource managers have been alerted based on your priority level.
        </p>
        <button type="button"
          onClick={() => { setDone(false); setTitle(''); setDesc(''); setLat(''); setLng(''); setPriority('medium') }}
          style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#4a5568' }}>
          Report another
        </button>
      </div>
    )
  }

  const selStyle = (active: boolean, color: string, bg: string, border: string) => ({
    border: `2px solid ${active ? color : '#e2e8f0'}`,
    background: active ? bg : '#fff',
    borderRadius: 12, padding: '10px 12px', cursor: 'pointer',
    transition: 'all .15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c53030', display: 'flex', gap: 8, alignItems: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Type */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Emergency type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {TYPES.map(t => (
            <button key={t.value} type="button" onClick={() => setType(t.value)}
              style={{ ...selStyle(type === t.value, '#e53e3e', '#fff5f5', '#fed7d7'), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: type === t.value ? '#e53e3e' : '#718096' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Priority level
          {priority === 'critical' && <span style={{ marginLeft: 8, color: '#e53e3e', fontWeight: 700 }}>— ALL resources will be alerted</span>}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {PRIORITIES.map(p => (
            <button key={p.value} type="button" onClick={() => setPriority(p.value)}
              style={{ ...selStyle(priority === p.value, p.color, p.bg, p.border), textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: priority === p.value ? p.color : '#cbd5e0', display: 'block', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: priority === p.value ? p.color : '#4a5568' }}>{p.label}</span>
              </div>
              <p style={{ fontSize: 11, color: '#a0aec0', lineHeight: 1.4, paddingLeft: 14 }}>{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          What happened? <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none' }}
          placeholder="e.g. Car accident on KN 5 Road" />
      </div>

      {/* Description */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Details <span style={{ color: '#a0aec0', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
        </label>
        <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)}
          style={{ width: '100%', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', resize: 'none' }}
          placeholder="Number of people, injuries, any other details..." />
      </div>

      {/* Location */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Location <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <button type="button" onClick={getLocation} disabled={locating}
          style={{ width: '100%', padding: '11px', borderRadius: 10, marginBottom: lat ? 0 : 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', border: `2px dashed ${lat ? '#9ae6b4' : '#e2e8f0'}`, background: lat ? '#f0fff4' : '#f7fafc', color: lat ? '#276749' : '#718096' }}>
          {locating ? '📍 Detecting location...' : lat ? `📍 ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)} — tap to update` : '📍 Use my current location'}
        </button>
        {!lat && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
              style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none' }}
              placeholder="Latitude" />
            <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
              style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none' }}
              placeholder="Longitude" />
          </div>
        )}
      </div>

      {/* Critical warning banner */}
      {priority === 'critical' && (
        <div style={{ background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🚨</span>
          <p style={{ fontSize: 13, color: '#c53030', lineHeight: 1.5 }}>
            <strong>Critical alert:</strong> This will immediately notify ALL available resource managers in the system, not just those nearby. Use only for life-threatening situations.
          </p>
        </div>
      )}

      {/* Submit */}
      <button type="button" onClick={submit} disabled={loading || !title.trim()}
        style={{
          width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700, border: 'none', cursor: loading || !title.trim() ? 'not-allowed' : 'pointer', opacity: loading || !title.trim() ? .55 : 1, fontFamily: 'inherit', color: '#fff',
          background: priority === 'critical' ? '#c53030' : '#e53e3e',
          transition: 'background .15s'
        }}>
        {loading ? 'Submitting report...' : priority === 'critical' ? '🚨 Submit Critical Emergency' : '🚨 Submit Emergency Report'}
      </button>
    </div>
  )
}