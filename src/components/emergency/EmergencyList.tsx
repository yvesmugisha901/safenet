import { useState } from 'react'
import { Emergency, Resource } from '../../types'
import { emergencyAPI } from '../../services/api'
import { timeAgo } from '../../utils/formatters'

interface Props {
  emergencies: Emergency[]
  onUpdate: () => void
  showActions?: boolean
  myResources?: Resource[]  // passed from manager so they can select which resource responds
}

const STATUS_STYLES: Record<string, { pill: string }> = {
  pending: { pill: 'bg-red-100 text-red-700 border-red-200' },
  responding: { pill: 'bg-amber-100 text-amber-700 border-amber-200' },
  resolved: { pill: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { pill: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: '#f0fff4', text: '#276749', label: 'Low' },
  medium: { bg: '#fffff0', text: '#744210', label: 'Medium' },
  high: { bg: '#fffaf0', text: '#7b341e', label: 'High' },
  critical: { bg: '#fff5f5', text: '#c53030', label: 'CRITICAL' },
}

const TYPE_ICONS: Record<string, string> = {
  medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function EmergencyList({ emergencies, onUpdate, showActions = false, myResources = [] }: Props) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedResource, setSelectedResource] = useState<Record<string, string>>({})

  const handleStatus = async (id: string, status: string) => {
    setUpdating(id + status)
    try {
      await emergencyAPI.updateStatus(id, status, selectedResource[id])
      onUpdate()
    } catch (err: any) {
      alert('Failed: ' + (err.message || 'Unknown error'))
    } finally { setUpdating(null) }
  }

  if (emergencies.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
        <p style={{ color: '#718096', fontSize: 14 }}>No emergencies found</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {emergencies.map(e => {
        const pStyle = PRIORITY_STYLES[e.priority || 'medium']
        const sStyle = STATUS_STYLES[e.status]
        return (
          <div key={e.id} style={{ background: '#fff', border: e.priority === 'critical' ? '2px solid #feb2b2' : '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: e.priority === 'critical' ? '0 0 0 3px rgba(229,62,62,.08)' : 'none' }}>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f7fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {TYPE_ICONS[e.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{e.title}</h3>
                      {/* Priority badge */}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: pStyle.bg, color: pStyle.text }}>
                        {pStyle.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, border: '1px solid', flexShrink: 0 }} className={sStyle.pill}>
                      {e.status}
                    </span>
                  </div>
                  {e.description && <p style={{ fontSize: 13, color: '#718096', marginBottom: 6 }}>{e.description}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#a0aec0' }}>
                    <span>📂 {e.type}</span>
                    {e.reported_by_name && <span>👤 {e.reported_by_name}</span>}
                    <span>📍 {Number(e.latitude).toFixed(4)}, {Number(e.longitude).toFixed(4)}</span>
                    <span>🕐 {timeAgo(e.created_at)}</span>
                    {e.assigned_resource_name && (
                      <span style={{ color: '#38a169', fontWeight: 600 }}>✅ {e.assigned_resource_name}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons for managers/admins */}
              {showActions && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f7fafc' }}>
                  {e.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* Resource selector — only if manager has resources */}
                      {myResources.length > 0 && (
                        <div>
                          <label style={{ fontSize: 11, fontWeight: 600, color: '#718096', display: 'block', marginBottom: 4 }}>
                            Responding with:
                          </label>
                          <select
                            value={selectedResource[e.id] || ''}
                            onChange={ev => setSelectedResource(prev => ({ ...prev, [e.id]: ev.target.value }))}
                            style={{ width: '100%', background: '#f7fafc', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#4a5568', fontFamily: 'inherit', outline: 'none' }}>
                            <option value="">— Select your resource (optional)</option>
                            {myResources.filter(r => r.available).map(r => (
                              <option key={r.id} value={r.id}>{r.name} ({r.type.replace('_', ' ')})</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => handleStatus(e.id, 'responding')} disabled={updating === e.id + 'responding'}
                          style={{ flex: 1, background: '#d97706', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: updating === e.id + 'responding' ? .6 : 1 }}>
                          {updating === e.id + 'responding' ? 'Processing...' : '⚡ Accept & Respond'}
                        </button>
                        <button onClick={() => handleStatus(e.id, 'cancelled')} disabled={updating === e.id + 'cancelled'}
                          style={{ flex: 1, background: '#f7fafc', color: '#718096', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: updating === e.id + 'cancelled' ? .6 : 1 }}>
                          {updating === e.id + 'cancelled' ? 'Processing...' : '✕ Reject'}
                        </button>
                      </div>
                    </div>
                  )}
                  {e.status === 'responding' && (
                    <button onClick={() => handleStatus(e.id, 'resolved')} disabled={updating === e.id + 'resolved'}
                      style={{ width: '100%', background: '#38a169', color: '#fff', border: 'none', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: updating === e.id + 'resolved' ? .6 : 1 }}>
                      {updating === e.id + 'resolved' ? 'Processing...' : '✅ Mark as Resolved'}
                    </button>
                  )}
                  {(e.status === 'resolved' || e.status === 'cancelled') && (
                    <p style={{ fontSize: 12, color: '#a0aec0', fontStyle: 'italic' }}>Closed — no further action needed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}