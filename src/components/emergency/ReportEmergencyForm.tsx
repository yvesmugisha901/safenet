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

const PRIORITIES: { value: EmergencyPriority; label: string; desc: string; color: string; activeBg: string; activeBorder: string }[] = [
  { value: 'low', label: 'Low', desc: 'Non-urgent, no immediate danger', color: '#38a169', activeBg: '#f0fff4', activeBorder: '#38a169' },
  { value: 'medium', label: 'Medium', desc: 'Needs attention within minutes', color: '#d69e2e', activeBg: '#fffff0', activeBorder: '#d69e2e' },
  { value: 'high', label: 'High', desc: 'Urgent, life may be at risk', color: '#dd6b20', activeBg: '#fffaf0', activeBorder: '#dd6b20' },
  { value: 'critical', label: 'Critical', desc: 'Extreme danger — ALL resources alerted', color: '#e53e3e', activeBg: '#fff5f5', activeBorder: '#e53e3e' },
]

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#718096',
  textTransform: 'uppercase', letterSpacing: '.06em',
  display: 'block', marginBottom: 8,
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

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0fff4', border: '1.5px solid #9ae6b4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>✅</div>
      <p style={{ fontWeight: 700, fontSize: 17, color: '#1a1a2e', marginBottom: 8 }}>Report submitted!</p>
      <p style={{ fontSize: 14, color: '#718096', marginBottom: 24, lineHeight: 1.6 }}>
        Nearby resource managers have been alerted based on your priority level.
      </p>
      <button type="button"
        onClick={() => { setDone(false); setTitle(''); setDesc(''); setLat(''); setLng(''); setPriority('medium') }}
        style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: '#4a5568' }}>
        Report another
      </button>
    </div>
  )

  const priColor = PRIORITIES.find(p => p.value === priority)?.color || '#e53e3e'
  const canSubmit = title.trim() && lat && !loading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 2px 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#c53030', display: 'flex', gap: 8, alignItems: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Type */}
        <div>
          <span style={label}>Emergency type</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {TYPES.map(t => (
              <button key={t.value} type="button" onClick={() => setType(t.value)} style={{
                border: type === t.value ? '1.5px solid #e53e3e' : '1px solid #e2e8f0',
                background: type === t.value ? '#fff5f5' : '#fff',
                borderRadius: 10, padding: '10px 6px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: type === t.value ? '#c53030' : '#718096' }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <span style={label}>
            Priority level
            {priority === 'critical' && <span style={{ marginLeft: 8, color: '#e53e3e', fontWeight: 700, textTransform: 'none', letterSpacing: 0 }}>— ALL resources will be alerted</span>}
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {PRIORITIES.map(p => (
              <button key={p.value} type="button" onClick={() => setPriority(p.value)} style={{
                border: priority === p.value ? `1.5px solid ${p.activeBorder}` : '1px solid #e2e8f0',
                background: priority === p.value ? p.activeBg : '#fff',
                borderRadius: 10, padding: '10px 12px', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
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
          <label style={label}>What happened? <span style={{ color: '#e53e3e' }}>*</span></label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
            placeholder="e.g. Car accident on KN 5 Road" />
        </div>

        {/* Description */}
        <div>
          <label style={label}>Details <span style={{ fontWeight: 400, textTransform: 'none', color: '#a0aec0' }}>(optional)</span></label>
          <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
            style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', resize: 'none', background: '#fff' }}
            placeholder="Number of people, injuries, any other details..." />
        </div>

        {/* Location */}
        <div>
          <span style={label}>Location <span style={{ color: '#e53e3e' }}>*</span></span>
          <button type="button" onClick={getLocation} disabled={locating} style={{
            width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
            border: lat ? '1.5px solid #38a169' : '1.5px dashed #e2e8f0',
            background: lat ? '#f0fff4' : '#f7fafc',
            color: lat ? '#276749' : '#718096',
          }}>
            {locating ? '📍 Detecting location...'
              : lat ? `📍 ${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)} — tap to update`
                : '📍 Use my current location'}
          </button>
          {!lat && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
                style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
                placeholder="Latitude" />
              <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
                style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#1a1a2e', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
                placeholder="Longitude" />
            </div>
          )}
        </div>

        {/* Critical warning */}
        {priority === 'critical' && (
          <div style={{ background: '#fff5f5', border: '1.5px solid #feb2b2', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🚨</span>
            <p style={{ fontSize: 13, color: '#c53030', lineHeight: 1.5 }}>
              <strong>Critical alert:</strong> This will immediately notify ALL available resource managers, not just those nearby. Use only for life-threatening situations.
            </p>
          </div>
        )}

      </div>

      {/* ── Sticky footer with submit ── */}
      <div style={{ paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <button type="button" onClick={submit} disabled={!canSubmit} style={{
          width: '100%', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700,
          border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
          opacity: canSubmit ? 1 : 0.45, fontFamily: 'inherit', color: '#fff',
          background: priority === 'critical' ? '#c53030' : '#e53e3e',
        }}>
          {loading ? 'Submitting report...' : priority === 'critical' ? '🚨 Submit Critical Emergency' : '🚨 Submit Emergency Report'}
        </button>
      </div>

    </div>
  )
}