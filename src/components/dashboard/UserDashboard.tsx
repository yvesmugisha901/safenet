import { useState } from 'react'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { useEmergencies } from '../../hooks/useEmergencies'
import ReportEmergencyForm from '../emergency/ReportEmergencyForm'
import Modal from '../shared/Modal'
import { timeAgo } from '../../utils/formatters'

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-red-900/30 text-red-400',
    responding: 'bg-yellow-900/30 text-yellow-400',
    resolved: 'bg-green-900/30 text-green-400',
    cancelled: 'bg-gray-800 text-gray-500',
}

const TYPE_ICONS: Record<string, string> = {
    medical: '🏥', fire: '🔥', flood: '🌊', accident: '🚗', crime: '🚨', other: '⚠️'
}

export default function UserDashboard() {
    const { user } = useAuth()
    const { liveEmergencies } = useSocket()
    const { emergencies, refetch } = useEmergencies()
    const [showForm, setShowForm] = useState(false)

    // Only show this user's own reports
    const myReports = emergencies.filter(e => e.reported_by === user?.id)

    const pending = myReports.filter(e => e.status === 'pending').length
    const responding = myReports.filter(e => e.status === 'responding').length
    const resolved = myReports.filter(e => e.status === 'resolved').length

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-gray-400 text-sm mt-1">Report emergencies and track your submitted reports</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-red-900/30">
                    🚨 Report Emergency
                </button>
            </div>

            {/* Live alert banner */}
            {liveEmergencies.length > 0 && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl px-5 py-4 flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shrink-0" />
                    <div>
                        <p className="text-red-300 font-semibold text-sm">Live emergency reported nearby</p>
                        <p className="text-red-400 text-xs mt-0.5">{liveEmergencies[0].title} · {liveEmergencies[0].type}</p>
                    </div>
                </div>
            )}

            {/* My report stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pending', value: pending, color: 'border-red-900/40 bg-red-900/20', text: 'text-red-400' },
                    { label: 'Responding', value: responding, color: 'border-yellow-900/40 bg-yellow-900/20', text: 'text-yellow-400' },
                    { label: 'Resolved', value: resolved, color: 'border-green-900/40 bg-green-900/20', text: 'text-green-400' },
                ].map(s => (
                    <div key={s.label} className={`border rounded-xl p-5 text-center ${s.color}`}>
                        <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
                        <p className="text-gray-400 text-sm mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* How to use */}
            {myReports.length === 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-white font-semibold mb-4">How SafeNet works</h3>
                    <div className="space-y-4">
                        {[
                            { icon: '📍', title: 'Report', desc: 'Tap "Report Emergency" and describe what you see. Your location is captured automatically.' },
                            { icon: '⚡', title: 'Auto-match', desc: 'SafeNet finds the nearest hospitals, fire stations and police within 20km.' },
                            { icon: '📲', title: 'Instant alert', desc: 'Resource managers receive SMS and email notifications immediately.' },
                            { icon: '✅', title: 'Track status', desc: 'Follow your report below as it moves from Pending → Responding → Resolved.' },
                        ].map(step => (
                            <div key={step.title} className="flex items-start gap-3">
                                <span className="text-2xl">{step.icon}</span>
                                <div>
                                    <p className="text-white font-medium text-sm">{step.title}</p>
                                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My reports */}
            {myReports.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800">
                        <h3 className="text-white font-semibold">My Reports</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Track the status of emergencies you reported</p>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {myReports.map(e => (
                            <div key={e.id} className="px-5 py-4 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl mt-0.5">{TYPE_ICONS[e.type]}</span>
                                    <div>
                                        <p className="text-white font-medium text-sm">{e.title}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {timeAgo(e.created_at)} · 📍 {Number(e.latitude).toFixed(3)}, {Number(e.longitude).toFixed(3)}
                                        </p>
                                    </div>
                                </div>
                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[e.status]}`}>
                                    {e.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal open={showForm} onClose={() => setShowForm(false)} title="Report Emergency">
                <ReportEmergencyForm onSuccess={() => { setShowForm(false); refetch() }} />
            </Modal>
        </div>
    )
}