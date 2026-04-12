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
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" }}>
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

      {/* ── LEFT — branding panel ── */}
      <div style={{ background: '#1a1a2e', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(229,62,62,.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(49,130,206,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 36, height: 36, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>SafeNet</span>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 1 }}>

          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>
            Helping communities<br />respond faster<br />
            <span style={{ color: '#fc8181' }}>since day one.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', lineHeight: 1.75, maxWidth: 360 }}>
            SafeNet connects citizens with the nearest hospitals, police and rescue teams the moment an emergency is reported.
          </p>

          {/* Mini stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 40 }}>
            {[
              { value: '< 30s', label: 'Alert delivery' },
              { value: '20 km', label: 'Match radius' },
              { value: '24/7', label: 'Always on' },
              { value: '3 ways', label: 'SMS · Email · App' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '14px 16px' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 2 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', position: 'relative', zIndex: 1 }}>
          "Every second between an emergency and a response costs lives."
        </p>
      </div>

      {/* ── RIGHT — login form ── */}
      <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div className="fade-up" style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: '#718096' }}>Sign in to your SafeNet account to continue</p>
          </div>

          {error && (
            <div className="fade-up" style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <p style={{ fontSize: 13, color: '#c53030', fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="fade-up-1" style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6, letterSpacing: '.01em' }}>
                Email address
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="fade-up-1" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4a5568', letterSpacing: '.01em' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#e53e3e', fontWeight: 500, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: 13, fontWeight: 500, padding: 0 }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="fade-up-2" style={{ marginTop: 26, marginBottom: 20 }}>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Signing in...' : 'Sign in to SafeNet'}
              </button>
            </div>
          </form>

          <div className="fade-up-3" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#718096' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#e53e3e', fontWeight: 600, textDecoration: 'none' }}>
                Create one free →
              </Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="fade-up-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 40, paddingTop: 32, borderTop: '1px solid #e2e8f0' }}>
            {['Secure login', 'Free to use', 'Available 24/7'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, background: '#38a169', borderRadius: '50%', display: 'block' }} />
                <span style={{ fontSize: 11, color: '#a0aec0', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}