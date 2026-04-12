import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="auth-split"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .input-field{width:100%;background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;padding:12px 16px;font-size:14px;color:#1a1a2e;font-family:inherit;transition:border-color .15s,box-shadow .15s;outline:none}
        .input-field:focus{border-color:#e53e3e;box-shadow:0 0 0 3px rgba(229,62,62,.1)}
        .input-field::placeholder{color:#a0aec0}
        .btn-primary{width:100%;background:#e53e3e;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s,transform .1s}
        .btn-primary:hover:not(:disabled){background:#c53030;transform:translateY(-1px)}
        .btn-primary:disabled{opacity:.55;cursor:not-allowed}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .5s ease both}
        .fade-up-1{animation:fadeUp .5s .08s ease both}
        .fade-up-2{animation:fadeUp .5s .16s ease both}
        .fade-up-3{animation:fadeUp .5s .24s ease both}
      `}</style>

      {/* LEFT */}
      <div style={{ background: '#1a1a2e', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>SafeNet</span>
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginTop: 40 }}>
            Welcome back<br />
            <span style={{ color: '#fc8181' }}>Stay connected.</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,.5)', marginTop: 20 }}>
            Access your SafeNet dashboard and manage alerts efficiently.
          </p>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
          Secure • Fast • Reliable
        </p>
      </div>

      {/* RIGHT */}
      <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Login</h1>
          <p style={{ marginBottom: 30, color: '#718096' }}>Enter your credentials</p>

          {error && (
            <div style={{ background: '#fff5f5', padding: 10, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
            />

            <div style={{ marginTop: 15 }}>
              <label htmlFor="password">Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 20 }}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: 20 }}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <div style={{ marginTop: 10 }}>
            <Link to="/register">Create account</Link>
          </div>

        </div>
      </div>
    </div>
  )
}