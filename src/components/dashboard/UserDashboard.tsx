import { useState } from 'react'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { useEmergencies } from '../../hooks/useEmergencies'
import { useNotifications } from '../../hooks/useNotifications'
import ReportEmergencyForm from '../emergency/ReportEmergencyForm'
import Modal from '../shared/Modal'
import { timeAgo } from '../../utils/formatters'
import { Notification } from '../../types'

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string; desc: string }> = {
    pending: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Waiting', desc: 'Your report is being reviewed by resource managers' },
    responding: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Help coming', desc: 'A resource manager has accepted and is responding' },
    resolved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Resolved', desc: 'This emergency has been resolved' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', label: 'Cancelled', desc: 'This report was cancelled or rejected' },
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

const CHANNEL_ICONS: Record<string, string> = { sms: '📱', email: '📧', in_app: '🔔' }

export default function UserDashboard() {
    const { user } = useAuth()
    const { liveEmergencies } = useSocket()
    const { emergencies, refetch } = useEmergencies()
    const { notifications, markRead } = useNotifications()
    const [showForm, setShowForm] = useState(false)

    const myReports = emergencies.filter(e => e.reported_by === user?.id)
    const myLive = liveEmergencies.filter(e => e.reported_by === user?.id && !myReports.find(r => r.id === e.id))
    const all = [...myLive, ...myReports]
    const unread = notifications.filter(n => !n.read)
    const hasActive = all.some(e => e.status === 'pending' || e.status === 'responding')

    return (
        <div className="p-6 space-y-5 max-w-2xl" style={{ background: '#f8f9fa', minHeight: '100%' }}>

            {/* Header */}
            <div>
                <h1 className="text-gray-900 text-2xl font-bold">Hello, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-gray-500 text-sm mt-0.5">Report emergencies and track how they're handled</p>
            </div>

            {/* Unread notifications */}
            {unread.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                    <p className="text-blue-700 font-semibold text-sm flex items-center gap-2">
                        🔔 {unread.length} new update{unread.length > 1 ? 's' : ''} on your reports
                    </p>
                    {unread.slice(0, 3).map((n: Notification) => (
                        <div key={n.id} onClick={() => markRead(n.id)}
                            className="bg-white border border-blue-100 rounded-lg px-4 py-2.5 flex items-start gap-3 cursor-pointer hover:shadow-sm transition-all">
                            <span className="text-lg">{CHANNEL_ICONS[n.channel]}</span>
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm">{n.message}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{timeAgo(n.sent_at)}</p>
                            </div>
                            <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                        </div>
                    ))}
                </div>
            )}

            {/* Active alert */}
            {hasActive && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
                    <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shrink-0" />
                    <div>
                        <p className="text-amber-800 font-semibold text-sm">You have an active emergency report</p>
                        <p className="text-amber-600 text-xs mt-0.5">Resource managers have been notified and are reviewing your report</p>
                    </div>
                </div>
            )}

            {/* Big CTA */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🚨</div>
                <h2 className="text-gray-900 font-bold text-lg mb-1.5">Need emergency help?</h2>
                <p className="text-gray-400 text-sm mb-5 max-w-sm mx-auto">
                    Tap below to report — we'll instantly notify the nearest hospitals, police and rescue teams.
                </p>
                <button onClick={() => setShowForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-100 text-base w-full max-w-xs">
                    🚨 Report an Emergency
                </button>
                <p className="text-gray-400 text-xs mt-3">Your location will be shared with responders</p>
            </div>

            {/* My reports */}
            {all.length > 0 && (
                <div>
                    <h2 className="text-gray-700 font-semibold text-sm uppercase tracking-widest mb-3">My Reports ({all.length})</h2>
                    <div className="space-y-3">
                        {all.map(e => {
                            const style = STATUS_STYLES[e.status]
                            const isLive = myLive.some(l => l.id === e.id)
                            return (
                                <div key={e.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                                            {TYPE_ICONS[e.type]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-gray-800 font-semibold text-sm">{e.title}</h3>
                                                {isLive && <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full animate-pulse font-semibold">LIVE</span>}
                                            </div>
                                            {e.description && <p className="text-gray-400 text-xs mt-0.5">{e.description}</p>}
                                            <p className="text-gray-300 text-xs mt-1">{timeAgo(e.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-3 ${style.bg} border-t ${style.border} flex items-center justify-between`}>
                                        <div>
                                            <p className={`text-xs font-bold ${style.text}`}>{style.label}</p>
                                            <p className={`text-xs mt-0.5 ${style.text} opacity-75`}>{style.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* How it works — shown when no reports yet */}
            {all.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-gray-500 font-semibold text-xs uppercase tracking-widest mb-4">How it works</h3>
                    <div className="space-y-4">
                        {[
                            { icon: '📍', title: 'You report', desc: 'Describe what you see and share your location in under 30 seconds.' },
                            { icon: '⚡', title: 'We match', desc: 'SafeNet finds the nearest available hospital, police or fire station.' },
                            { icon: '📲', title: 'They respond', desc: 'Resource managers receive instant notifications and accept your report.' },
                            { icon: '🔔', title: 'You get notified', desc: 'You receive updates here as your report moves from Waiting → Help coming → Resolved.' },
                        ].map(step => (
                            <div key={step.title} className="flex items-start gap-3">
                                <span className="text-xl">{step.icon}</span>
                                <div>
                                    <p className="text-gray-700 text-sm font-semibold">{step.title}</p>
                                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal open={showForm} onClose={() => setShowForm(false)} title="Report an Emergency">
                <ReportEmergencyForm onSuccess={() => { setShowForm(false); refetch() }} />
            </Modal>
        </div>
    )
}