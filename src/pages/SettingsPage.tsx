import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function SettingsPage() {
    const { user, refreshUser } = useAuth()
    const [name, setName] = useState(user?.name || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [curPw, setCurPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confPw, setConfPw] = useState('')
    const [savingInfo, setSavingInfo] = useState(false)
    const [savingPw, setSavingPw] = useState(false)
    const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

    const show = (type: 'ok' | 'err', text: string) => {
        setMsg({ type, text })
        if (type === 'ok') setTimeout(() => setMsg(null), 4000)
    }

    const saveProfile = async () => {
        setMsg(null)
        if (!name.trim()) { show('err', 'Name cannot be empty'); return }
        setSavingInfo(true)
        try {
            await authAPI.updateProfile({ name: name.trim(), phone: phone.trim() })
            await refreshUser()   // ← refresh user in context so navbar/sidebar updates
            show('ok', 'Profile updated successfully ✓')
        } catch (err: any) {
            console.error('saveProfile error:', err)
            show('err', err.message || 'Failed to update profile')
        } finally {
            setSavingInfo(false)
        }
    }

    const changePassword = async () => {
        setMsg(null)
        if (!curPw) { show('err', 'Enter your current password'); return }
        if (newPw.length < 6) { show('err', 'New password must be at least 6 characters'); return }
        if (newPw !== confPw) { show('err', 'Passwords do not match'); return }
        setSavingPw(true)
        try {
            await authAPI.updateProfile({ currentPassword: curPw, newPassword: newPw })
            show('ok', 'Password changed successfully ✓')
            setCurPw(''); setNewPw(''); setConfPw('')
        } catch (err: any) {
            console.error('changePassword error:', err)
            show('err', err.message || 'Failed to change password')
        } finally {
            setSavingPw(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl space-y-6" style={{ background: '#f8f9fa', minHeight: '100%' }}>
            <div>
                <h1 className="text-gray-900 text-2xl font-bold">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Update your account information</p>
            </div>

            {/* Message banner */}
            {msg && (
                <div className={`rounded-xl px-5 py-3 text-sm font-medium border ${msg.type === 'ok'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {msg.text}
                </div>
            )}

            {/* ── Profile card ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-gray-800 font-semibold">Profile information</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Update your display name and phone number</p>
                </div>
                <div className="p-5 space-y-4">
                    {/* Avatar + current info */}
                    <div className="flex items-center gap-4 pb-2">
                        <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm shrink-0">
                            {(name || user?.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold">{user?.name}</p>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                            <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full capitalize font-medium">
                                {user?.role?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">
                                Full name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">
                                Phone number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder="+250 788 000 000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">
                            Email address
                        </label>
                        <input
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed"
                        />
                        <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
                    </div>

                    <button
                        type="button"
                        onClick={saveProfile}
                        disabled={savingInfo}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                        {savingInfo ? 'Saving...' : 'Save profile'}
                    </button>
                </div>
            </div>

            {/* ── Password card ── */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-gray-800 font-semibold">Change password</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Minimum 6 characters required</p>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        { label: 'Current password', val: curPw, set: setCurPw, ph: 'Enter your current password' },
                        { label: 'New password', val: newPw, set: setNewPw, ph: 'At least 6 characters' },
                        { label: 'Confirm new password', val: confPw, set: setConfPw, ph: 'Repeat new password' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">
                                {f.label}
                            </label>
                            <input
                                type="password"
                                value={f.val}
                                onChange={e => f.set(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder={f.ph}
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={changePassword}
                        disabled={savingPw}
                        className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                        {savingPw ? 'Updating...' : 'Change password'}
                    </button>
                </div>
            </div>

            {/* ── Account details ── */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-4">Account details</h3>
                <div className="divide-y divide-gray-100">
                    {[
                        { label: 'Account ID', value: user?.id ? user.id.slice(0, 8).toUpperCase() + '...' : '—' },
                        { label: 'Role', value: user?.role?.replace('_', ' ') || '—' },
                        {
                            label: 'Member since', value: user?.created_at
                                ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                : '—'
                        },
                    ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-3">
                            <span className="text-gray-400 text-sm">{row.label}</span>
                            <span className="text-gray-700 text-sm font-medium capitalize">{row.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}