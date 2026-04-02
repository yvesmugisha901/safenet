import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg p-3 text-sm">{error}</div>
      )}
      <div>
        <label className="text-gray-400 text-sm block mb-1">Email</label>
        <input type="email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
          placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-gray-400 text-sm block mb-1">Password</label>
        <input type="password" required value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500"
          placeholder="••••••••" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      <p className="text-gray-500 text-sm text-center">
        Don't have an account? <Link to="/register" className="text-red-400 hover:text-red-300">Register</Link>
      </p>
    </form>
  )
}
