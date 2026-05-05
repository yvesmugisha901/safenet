import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── Fake verification steps ───────────────────────────────────────────────
const VERIFICATION_STEPS = [
  { label: 'Validating organization credentials', duration: 900 },
  { label: 'Cross-referencing resource manager registry', duration: 1200 },
  { label: 'Verifying authorization level', duration: 800 },
  { label: 'Checking department access rights', duration: 700 },
  { label: 'Finalizing account privileges', duration: 600 },
]

function ResourceManagerVerificationModal({
  onComplete,
  onCancel,
}: {
  onComplete: () => void
  onCancel: () => void
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let stepIndex = 0
    const runStep = () => {
      if (stepIndex >= VERIFICATION_STEPS.length) { setDone(true); return }
      setCurrentStep(stepIndex)
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex])
        stepIndex++
        runStep()
      }, VERIFICATION_STEPS[stepIndex].duration)
      return timer
    }
    const t = runStep()
    return () => clearTimeout(t as any)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#1a1a2e', border: '1px solid #2d3748', borderRadius: 20, padding: '36px', width: '100%', maxWidth: 440, margin: '0 16px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fc8181" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Resource Manager Verification</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Elevated privileges require identity check</p>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {VERIFICATION_STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isActive = currentStep === i && !isCompleted
            const isPending = i > currentStep
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                background: isActive ? 'rgba(229,62,62,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(229,62,62,0.25)' : '1px solid transparent',
                opacity: isPending ? 0.3 : isCompleted ? 0.6 : 1,
                transition: 'all 0.3s ease',
              }}>
                <div style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isCompleted ? (
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#48bb78" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                      <circle cx="12" cy="12" r="10" stroke="#fc8181" strokeWidth="4" strokeOpacity="0.25" />
                      <path fill="#fc8181" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4a5568' }} />
                  )}
                </div>
                <span style={{ fontSize: 13, color: isActive ? '#fff' : isCompleted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)', flex: 1 }}>
                  {step.label}
                </span>
                {isCompleted && <span style={{ fontSize: 11, color: '#48bb78', fontWeight: 600 }}>OK</span>}
              </div>
            )
          })}
        </div>

        {/* Result / footer */}
        {done ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(56,161,105,0.12)', border: '1px solid rgba(56,161,105,0.3)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#48bb78" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#68d391', marginBottom: 2 }}>Verification Passed</p>
                <p style={{ fontSize: 12, color: 'rgba(104,211,145,0.6)' }}>Your identity has been confirmed. Resource Manager access will be granted.</p>
              </div>
            </div>
            <button onClick={onComplete}
              style={{ width: '100%', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Continue Registration →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Step {currentStep + 1} of {VERIFICATION_STEPS.length}</p>
            <button onClick={onCancel}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Register Page ────────────────────────────────────────────────────
export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVerification, setShowVerification] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const doRegister = async () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    // Intercept resource_manager — show fake verification first
    if (form.role === 'resource_manager') {
      setShowVerification(true)
      return
    }

    await doRegister()
  }

  return (
    <>
      {/* Fake verification modal — only shown for resource_manager role */}
      {showVerification && (
        <ResourceManagerVerificationModal
          onComplete={() => { setShowVerification(false); doRegister() }}
          onCancel={() => setShowVerification(false)}
        />
      )}

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
        `}</style>

        {/* ── LEFT — branding panel ── */}
        <div style={{ background: '#1a1a2e', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(229,62,62,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(56,161,105,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 36, height: 36, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>SafeNet</span>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Join SafeNet.<br />
              <span style={{ color: '#fc8181' }}>Protect your community.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, maxWidth: 360, marginBottom: 40 }}>
              Create a free account and start reporting emergencies, tracking responses, or managing resources in your area.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { initial: 'C', bg: '#3182ce', title: 'Citizen', desc: 'Report emergencies & track status' },
                { initial: 'R', bg: '#e53e3e', title: 'Resource Manager', desc: 'Respond to alerts & manage resources' },
                { initial: 'A', bg: '#6b46c1', title: 'Administrator', desc: 'Full system oversight & analytics' },
              ].map(r => (
                <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{r.initial}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', position: 'relative', zIndex: 1 }}>
            Free for all users. No credit card required.
          </p>
        </div>

        {/* ── RIGHT — register form ── */}
        <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <div className="fade-up" style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', marginBottom: 8 }}>Create your account</h1>
              <p style={{ fontSize: 14, color: '#718096' }}>Get started with SafeNet in under a minute</p>
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <p style={{ fontSize: 13, color: '#c53030', fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Full name</label>
                <input type="text" required value={form.name} onChange={set('name')}
                  className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Email address</label>
                <input type="email" required value={form.email} onChange={set('email')}
                  className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Phone number <span style={{ color: '#a0aec0', fontWeight: 400 }}>(optional)</span></label>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  className="input-field" placeholder="+250 788 000 000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                    className="input-field" placeholder="Minimum 6 characters" style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aec0', fontSize: 13, fontWeight: 500, padding: 0 }}>
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>I am a</label>
                <select value={form.role} onChange={set('role')} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="user">Community member — I want to report emergencies</option>
                  <option value="resource_manager">Resource manager — I manage a hospital / police / fire unit</option>
                </select>
                <p style={{ fontSize: 11, color: '#a0aec0', marginTop: 5 }}>Admin accounts are created by existing administrators only.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 6 }}>
                {loading ? 'Creating account...' : 'Create my account →'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <p style={{ fontSize: 13, color: '#718096' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#e53e3e', fontWeight: 600, textDecoration: 'none' }}>Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}