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

const PRIORITIES: { value: EmergencyPriority; label: string; color: string; bg: string }[] = [
  { value: 'low', label: 'Low', color: '#38a169', bg: '#f0fff4' },
  { value: 'medium', label: 'Medium', color: '#d69e2e', bg: '#fffff0' },
  { value: 'high', label: 'High', color: '#dd6b20', bg: '#fffaf0' },
  { value: 'critical', label: 'Critical', color: '#e53e3e', bg: '#fff5f5' },
]

const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#718096',
  textTransform: 'uppercase', letterSpacing: '.06em',
  display: 'block', marginBottom: 6,
}

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
    } catch { setError('Could not detect location. Please enter manually.') }
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
      setDone(true); onSuccess?.()
    } catch (err: any) { setError(err.message || 'Failed to submit') }
    finally { setLoading(false) }
  }

  if (done) return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0fff4', border: '1.5px solid #9ae6b4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 12px' }}>✅</div>
      <p style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 6 }}>Report submitted!</p>
      <p style={{ fontSize: 13, color: '#718096', marginBottom: 20, lineHeight: 1.5 }}>Resource managers have been alerted.</p>
      <button type="button"
        onClick={() => { setDone(false); setTitle(''); setDesc(''); setLat(''); setLng(''); setPriority('medium') }}
        style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 9, padding: '8px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#4a5568' }}>
        Report another
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {error && (
        <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 9, padding: '9px 12px', fontSize: 13, color: '#c53030', display: 'flex', gap: 8, alignItems: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Type — horizontal pills */}
      <div>
        <span style={lbl}>Emergency type</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button key={t.value} type="button" onClick={() => setType(t.value)} style={{
              border: type === t.value ? '1.5px solid #e53e3e' : '1px solid #e2e8f0',
              background: type === t.value ? '#fff5f5' : '#fff',
              borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 600,
              color: type === t.value ? '#c53030' : '#718096',
            }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority — 4-col row */}
      <div>
        <span style={lbl}>Priority</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {PRIORITIES.map(p => (
            <button key={p.value} type="button" onClick={() => setPriority(p.value)} style={{
              border: priority === p.value ? `1.5px solid ${p.color}` : '1px solid #e2e8f0',
              background: priority === p.value ? p.bg : '#fff',
              borderRadius: 8, padding: '8px 4px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: priority === p.value ? p.color : '#cbd5e0', display: 'block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: priority === p.value ? p.color : '#718096' }}>{p.label}</span>
            </button>
          ))}
        </div>
        {priority === 'critical' && (
          <p style={{ fontSize: 11, color: '#c53030', marginTop: 5, fontWeight: 500 }}>
            🚨 ALL available resources will be alerted
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label style={lbl}>What happened? <span style={{ color: '#e53e3e' }}>*</span></label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '10px 13px', fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
          placeholder="e.g. Car accident on KN 5 Road" />
      </div>

      {/* Details — 2 rows */}
      <div>
        <label style={lbl}>Details <span style={{ fontWeight: 400, textTransform: 'none', color: '#a0aec0' }}>(optional)</span></label>
        <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)}
          style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '10px 13px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', resize: 'none', background: '#fff' }}
          placeholder="Number of people, injuries, other details..." />
      </div>

      {/* Location */}
      <div>
        <span style={lbl}>Location <span style={{ color: '#e53e3e' }}>*</span></span>
        <button type="button" onClick={getLocation} disabled={locating} style={{
          width: '100%', padding: '10px 13px', borderRadius: 9, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          border: lat ? '1.5px solid #38a169' : '1.5px dashed #e2e8f0',
          background: lat ? '#f0fff4' : '#f7fafc',
          color: lat ? '#276749' : '#718096',
        }}>
          {locating ? '📍 Detecting...'
            : lat ? `📍 ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
              : '📍 Tap to use my current location'}
        </button>
        {!lat && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
            <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
              style={{ border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '9px 11px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
              placeholder="Latitude" />
            <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
              style={{ border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '9px 11px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
              placeholder="Longitude" />
          </div>
        )}
      </div>

      {/* Submit — always visible */}
      <button type="button" onClick={submit}
        disabled={loading || !title.trim()}
        style={{
          width: '100%', padding: '13px', borderRadius: 11, fontSize: 15, fontWeight: 700,
          border: 'none', cursor: loading || !title.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !title.trim() ? .5 : 1,
          fontFamily: 'inherit', color: '#fff',
          background: priority === 'critical' ? '#c53030' : '#e53e3e',
        }}>
        {loading ? 'Submitting...' : priority === 'critical' ? '🚨 Submit Critical Emergency' : '🚨 Submit Emergency Report'}
      </button>

    </div>
  )
}