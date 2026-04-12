import { useState } from 'react'
import { Link } from 'react-router-dom'

type Step = 'email' | 'sent'

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!email.trim()) { setError('Please enter your email address'); return }
        setLoading(true)
        // Simulate — in production this calls a real reset endpoint
        await new Promise(r => setTimeout(r, 1200))
        setLoading(false)
        setStep('sent')
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .45s ease both}
        @keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
        .check-pop{animation:checkPop .5s .1s cubic-bezier(.34,1.56,.64,1) both}
      `}</style>

            {/* ── LEFT ── */}
            <div style={{ background: '#1a1a2e', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 380, height: 380, background: 'radial-gradient(circle, rgba(229,62,62,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 36, height: 36, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 18 }}>S</div>
                    <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>SafeNet</span>
                </Link>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 20 }}>
                        Don't worry,<br />
                        <span style={{ color: '#fc8181' }}>it happens to everyone.</span>
                    </h2>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, maxWidth: 340, marginBottom: 40 }}>
                        Enter your email address and we'll send you a link to reset your password and get back into your account.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { n: '1', color: '#e53e3e', title: 'Enter your email', desc: 'The one you used to register' },
                            { n: '2', color: '#dd6b20', title: 'Check your inbox', desc: 'Reset link arrives in under a minute' },
                            { n: '3', color: '#38a169', title: 'Set a new password', desc: 'Choose something strong and memorable' },
                        ].map(s => (
                            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: s.color, flexShrink: 0 }}>
                                    {s.n}
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.75)' }}>{s.title}</p>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)', position: 'relative', zIndex: 1 }}>
                    Remember your password? <Link to="/login" style={{ color: 'rgba(255,255,255,.4)', textDecoration: 'none' }}>Sign in instead</Link>
                </p>
            </div>

            {/* ── RIGHT ── */}
            <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>

                    {step === 'email' ? (
                        <>
                            <div className="fade-up" style={{ marginBottom: 36 }}>
                                <div style={{ width: 52, height: 52, background: '#fff5f5', border: '1.5px solid #fed7d7', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 22 }}>
                                    🔑
                                </div>
                                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', marginBottom: 8 }}>
                                    Forgot your password?
                                </h1>
                                <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.65 }}>
                                    No problem. Enter the email address linked to your SafeNet account and we'll send you a reset link.
                                </p>
                            </div>

                            {error && (
                                <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span>⚠️</span>
                                    <p style={{ fontSize: 13, color: '#c53030', fontWeight: 500 }}>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 6 }}>
                                        Email address
                                    </label>
                                    <input
                                        type="email" required value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="input-field"
                                        placeholder="you@example.com"
                                        autoFocus
                                    />
                                    <p style={{ fontSize: 11, color: '#a0aec0', marginTop: 5 }}>
                                        We'll only use this to send you a password reset link.
                                    </p>
                                </div>

                                <button type="submit" disabled={loading} className="btn-primary">
                                    {loading ? 'Sending reset link...' : 'Send reset link →'}
                                </button>
                            </form>

                            <div style={{ textAlign: 'center', marginTop: 28 }}>
                                <Link to="/login" style={{ fontSize: 13, color: '#718096', textDecoration: 'none' }}>
                                    ← Back to sign in
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* ── SUCCESS STATE ── */
                        <div className="fade-up" style={{ textAlign: 'center' }}>
                            <div className="check-pop" style={{ width: 72, height: 72, background: '#f0fff4', border: '2px solid #9ae6b4', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 32 }}>
                                ✅
                            </div>
                            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', marginBottom: 12 }}>
                                Check your inbox
                            </h1>
                            <p style={{ fontSize: 15, color: '#718096', lineHeight: 1.7, marginBottom: 8 }}>
                                We've sent a password reset link to
                            </p>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 28, background: '#edf2f7', borderRadius: 8, padding: '8px 16px', display: 'inline-block' }}>
                                {email}
                            </p>
                            <p style={{ fontSize: 13, color: '#a0aec0', lineHeight: 1.65, marginBottom: 36, maxWidth: 320, margin: '0 auto 36px' }}>
                                The link expires in 1 hour. If you don't see the email, check your spam folder or try again.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <button onClick={() => { setStep('email'); setEmail('') }}
                                    style={{ background: '#fff', color: '#4a5568', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'border-color .15s' }}>
                                    Try a different email
                                </button>
                                <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', fontSize: 14, fontWeight: 600, color: '#e53e3e', textDecoration: 'none' }}>
                                    Back to sign in →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 