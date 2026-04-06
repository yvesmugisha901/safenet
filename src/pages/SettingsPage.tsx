import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function SettingsPage() {
    const { user } = useAuth()
    const [name, setName] = useState(user?.name || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const saveProfile = async () => {
        setError(''); setSuccess('')
        if (!name.trim()) { setError('Name cannot be empty'); return }
        setLoading(true)
        try {
            await authAPI.updateProfile({ name: name.trim(), phone: phone.trim() })
            setSuccess('Profile updated successfully')
        } catch (err: any) {
            setError(err.message)
        } finally { setLoading(false) }
    }

    const changePassword = async () => {
        setError(''); setSuccess('')
        if (!currentPw) { setError('Enter your current password'); return }
        if (newPw.length < 6) { setError('New password must be at least 6 characters'); return }
        if (newPw !== confirmPw) { setError('New passwords do not match'); return }
        setLoading(true)
        try {
            await authAPI.updateProfile({ currentPassword: currentPw, newPassword: newPw })
            setSuccess('Password changed successfully')
            setCurrentPw(''); setNewPw(''); setConfirmPw('')
        } catch (err: any) {
            setError(err.message)
        } finally { setLoading(false) }
    }

    return (
        <div className="p-6 max-w-2xl space-y-6" style={{ background: '#f8f9fa', minHeight: '100%' }}>
            <div>
                <h1 className="text-gray-900 text-2xl font-bold">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 text-sm">{success}</div>}

            {/* Profile info */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-gray-800 font-semibold">Profile Information</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Update your name and phone number</p>
                </div>
                <div className="p-5 space-y-4">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                            {name?.[0]?.toUpperCase() || '?'}
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
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Full name</label>
                            <input value={name} onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder="Your full name" />
                        </div>
                        <div>
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Phone number</label>
                            <input value={phone} onChange={e => setPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder="+250 788 000 000" />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">Email address</label>
                        <input value={user?.email} disabled
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed" />
                        <p className="text-gray-400 text-xs mt-1">Email cannot be changed</p>
                    </div>
                    <div className="pt-2">
                        <button onClick={saveProfile} disabled={loading}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                            {loading ? 'Saving...' : 'Save changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Change password */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-gray-800 font-semibold">Change Password</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Use a strong password of at least 6 characters</p>
                </div>
                <div className="p-5 space-y-4">
                    {[
                        { label: 'Current password', value: currentPw, set: setCurrentPw, ph: 'Enter current password' },
                        { label: 'New password', value: newPw, set: setNewPw, ph: 'At least 6 characters' },
                        { label: 'Confirm new password', value: confirmPw, set: setConfirmPw, ph: 'Repeat new password' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="text-gray-500 text-xs font-semibold block mb-1.5 uppercase tracking-wider">{f.label}</label>
                            <input type="password" value={f.value} onChange={e => f.set(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-red-400 transition-colors"
                                placeholder={f.ph} />
                        </div>
                    ))}
                    <div className="pt-2">
                        <button onClick={changePassword} disabled={loading}
                            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
                            {loading ? 'Updating...' : 'Change password'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Account info */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-gray-800 font-semibold mb-4">Account Details</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Account ID', value: user?.id?.slice(0, 18) + '...' },
                        { label: 'Member since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                        { label: 'Role', value: user?.role?.replace('_', ' ') },
                    ].map(row => (
                        <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                            <span className="text-gray-400 text-sm">{row.label}</span>
                            <span className="text-gray-700 text-sm font-medium capitalize">{row.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}