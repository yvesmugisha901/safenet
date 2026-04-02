import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-3 text-sm">{error}</div>
      )}
      {[
        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
        { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
        { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
        { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+250 788 000 000' },
      ].map(field => (
        <div key={field.key}>
          <label className="text-gray-400 text-sm block mb-1">{field.label}</label>
          <input type={field.type} required={field.key !== 'phone'}
            value={(form as any)[field.key]}
            onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
            placeholder={field.placeholder} />
        </div>
      ))}
      <div>
        <label className="text-gray-400 text-sm block mb-1">Role</label>
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500">
          <option value="user">User</option>
          <option value="resource_manager">Resource Manager</option>
        </select>
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
      <p className="text-gray-500 text-sm text-center">
        Already have an account? <Link to="/login" className="text-red-400 hover:text-red-300">Sign in</Link>
      </p>
    </form>
  )
}
