import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'

const EMERGENCY_FEED = [
    { type: 'Medical', loc: 'Kimironko', ago: '12s', color: '#ef4444' },
    { type: 'Accident', loc: 'KN 5 Road', ago: '1m', color: '#f97316' },
    { type: 'Fire', loc: 'Nyamirambo', ago: '3m', color: '#f97316' },
    { type: 'Medical', loc: 'Kicukiro', ago: '5m', color: '#ef4444' },
    { type: 'Flood', loc: 'Gisozi', ago: '8m', color: '#3b82f6' },
    { type: 'Crime', loc: 'CBD', ago: '11m', color: '#8b5cf6' },
]

const NUMBERS = [
    { n: '847', label: 'Emergencies resolved', sub: 'this month' },
    { n: '< 28s', label: 'Average alert delivery', sub: 'from report to manager' },
    { n: '94%', label: 'Response rate', sub: 'within 10 minutes' },
    { n: '3 min', label: 'Fastest response', sub: 'medical, Kimironko' },
]

export default function HomePage() {
    const { user } = useAuth()
    const [tick, setTick] = useState(0)
    const [mouseX, setMouseX] = useState(0)
    const [mouseY, setMouseY] = useState(0)
    const heroRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const t = setInterval(() => setTick(n => n + 1), 2800)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            setMouseX((e.clientX / window.innerWidth - 0.5) * 18)
            setMouseY((e.clientY / window.innerHeight - 0.5) * 18)
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])

    const activeFeed = EMERGENCY_FEED[tick % EMERGENCY_FEED.length]

    return (
        <div style={{ fontFamily: "'Instrument Sans', 'DM Sans', sans-serif", background: '#09090b', color: '#fff', overflowX: 'hidden' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        .serif{font-family:'Instrument Serif',Georgia,serif}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)}}
        @keyframes slideLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes countUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes borderPulse{0%,100%{border-color:rgba(239,68,68,.3)}50%{border-color:rgba(239,68,68,.8)}}
        .live-dot{animation:pulse 1.4s ease-in-out infinite}
        .ticker{animation:slideLeft 22s linear infinite;display:flex;white-space:nowrap}
        .feed-item{animation:fadeIn .4s ease both}
        .num-card{transition:transform .2s,background .2s}
        .num-card:hover{transform:translateY(-4px);background:rgba(255,255,255,.06)!important}
        .role-card{transition:all .22s ease;cursor:default}
        .role-card:hover{transform:translateY(-6px)}
        .nav-link{color:rgba(255,255,255,.45);font-size:14px;font-weight:500;transition:color .15s}
        .nav-link:hover{color:#fff}
        .btn-primary{background:#ef4444;color:#fff;border:none;cursor:pointer;font-weight:600;transition:all .15s;font-family:inherit}
        .btn-primary:hover{background:#dc2626;transform:translateY(-1px)}
        .btn-ghost{background:transparent;color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.12);cursor:pointer;font-family:inherit;transition:all .15s}
        .btn-ghost:hover{color:#fff;border-color:rgba(255,255,255,.3)}
        .glow-line{background:linear-gradient(90deg,transparent,#ef4444,transparent)}
        ::selection{background:#ef4444;color:#fff}
      `}</style>

            {/* ── NOISE TEXTURE OVERLAY ── */}
            <div style={{ position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`, pointerEvents: 'none', zIndex: 1, opacity: .4 }} />

            {/* ── NAV ── */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 200, padding: '0 48px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(9,9,11,.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L26 8v12L14 26 2 20V8L14 2z" fill="#ef4444" />
                        <path d="M14 8v12M8 11l12 6M20 11L8 17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>SafeNet</span>
                </div>
                <div style={{ display: 'flex', gap: 28 }}>
                    <a href="#mission" className="nav-link">Mission</a>
                    <a href="#how" className="nav-link">How it works</a>
                    <a href="#roles" className="nav-link">Roles</a>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {user ? (
                        <Link to="/dashboard"><button className="btn-primary" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }}>Open dashboard</button></Link>
                    ) : (
                        <>
                            <Link to="/login"><button className="btn-ghost" style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13 }}>Sign in</button></Link>
                            <Link to="/register"><button className="btn-primary" style={{ padding: '8px 20px', borderRadius: 8, fontSize: 13 }}>Get started</button></Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ── HERO ── */}
            <section ref={heroRef} style={{ minHeight: '92vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, maxWidth: 1280, margin: '0 auto', padding: '0 48px', alignItems: 'center', position: 'relative', zIndex: 2 }}>

                {/* BG glow */}
                <div style={{ position: 'absolute', top: '20%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(239,68,68,.12) 0%, transparent 70%)', pointerEvents: 'none', transform: `translate(${mouseX * .6}px,${mouseY * .6}px)`, transition: 'transform .1s ease' }} />

                {/* Left */}
                <div style={{ paddingRight: 48 }}>
                    {/* Live feed pill */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 999, padding: '7px 14px', marginBottom: 36, animation: 'borderPulse 2.5s infinite' }}>
                        <span className="live-dot" style={{ width: 7, height: 7, background: '#ef4444', borderRadius: '50%', display: 'block' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#f87171', letterSpacing: '.04em' }}>LIVE</span>
                        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.1)' }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}
                            key={tick}
                            className="feed-item">
                            {activeFeed.type} · {activeFeed.loc} · {activeFeed.ago} ago
                        </span>
                    </div>

                    <h1 style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.04em', marginBottom: 24 }}>
                        <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.75)', fontWeight: 400 }}>When</span>{' '}
                        <span>seconds</span><br />
                        <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.75)', fontWeight: 400 }}>become</span>{' '}
                        <span style={{ color: '#ef4444' }}>lives.</span>
                    </h1>

                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxWidth: 420, marginBottom: 40, fontWeight: 400 }}>
                        SafeNet routes emergency reports to the nearest available resource the moment they happen — no phone calls, no wait times, no missed alerts.
                    </p>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 48, flexWrap: 'wrap' }}>
                        <Link to={user ? '/emergencies' : '/register'}>
                            <button className="btn-primary" style={{ padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 16 }}>⚡</span>
                                Report an emergency
                            </button>
                        </Link>
                        <a href="#how">
                            <button className="btn-ghost" style={{ padding: '14px 24px', borderRadius: 10, fontSize: 15 }}>
                                See how it works
                            </button>
                        </a>
                    </div>

                    {/* Proof row */}
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                        <div style={{ display: 'flex' }}>
                            {['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#22c55e'].map((c, i) => (
                                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #09090b', marginLeft: i ? -9 : 0 }} />
                            ))}
                        </div>
                        <div>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>
                                Trusted by citizens, clinics,<br />fire brigades & police units
                            </p>
                        </div>
                        <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,.08)' }} />
                        <div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>847</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>incidents resolved</p>
                        </div>
                    </div>
                </div>

                {/* Right — dispatch terminal */}
                <div style={{ transform: `perspective(1200px) rotateY(${mouseX * -.4}deg) rotateX(${mouseY * .3}deg)`, transition: 'transform .08s ease' }}>
                    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,.5), 0 40px 100px rgba(0,0,0,.6)' }}>

                        {/* Terminal header */}
                        <div style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: .7 }} />)}
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', marginLeft: 6, letterSpacing: '.05em' }}>safenet.dispatch — live</span>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>connected</span>
                            </div>
                        </div>

                        {/* Active alert */}
                        <div style={{ padding: '20px 20px 0' }}>
                            <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 14, padding: 18, marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ background: '#ef4444', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '.04em' }}>MEDICAL</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <div className="live-dot" style={{ width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} />
                                            <span style={{ fontSize: 11, color: '#f87171', fontWeight: 600 }}>LIVE</span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>0:12 ago</span>
                                </div>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.8)', lineHeight: 1.55, marginBottom: 8 }}>
                                    Person collapsed near Kimironko market. Needs immediate medical attention.
                                </p>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>📍 Kimironko, Gasabo · -1.9350, 30.0900</p>
                            </div>
                        </div>

                        {/* Resources matched */}
                        <div style={{ padding: '0 20px 4px' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>3 resources matched & alerted</p>
                            {[
                                { icon: '🏥', name: 'King Faisal Hospital', dist: '1.1 km', status: 'Dispatched', sc: '#22c55e', bg: 'rgba(34,197,94,.08)' },
                                { icon: '🚑', name: 'CHUK Emergency Unit', dist: '2.4 km', status: 'On standby', sc: '#f59e0b', bg: 'rgba(245,158,11,.08)' },
                                { icon: '🚔', name: 'Rwanda National Police', dist: '0.9 km', status: 'En route', sc: '#3b82f6', bg: 'rgba(59,130,246,.08)' },
                            ].map(r => (
                                <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: r.bg, border: `1px solid ${r.sc}22`, borderRadius: 12, padding: '11px 14px', marginBottom: 8 }}>
                                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.8)' }}>{r.name}</p>
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>{r.dist} away</p>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: r.sc }}>{r.status}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer bar */}
                        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ animation: 'spin 2.5s linear infinite', width: 14, height: 14, border: '2px solid rgba(255,255,255,.1)', borderTopColor: '#ef4444', borderRadius: '50%' }} />
                                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Monitoring 6 active zones</span>
                            </div>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.2)' }}>alerts sent via SMS · email · app</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TICKER ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', overflow: 'hidden', padding: '14px 0', zIndex: 2, position: 'relative' }}>
                <div className="ticker">
                    {Array(4).fill(null).flatMap(() =>
                        ['Medical emergency', 'Fire response', 'Flood alert', 'Road accident', 'Crime report', 'Shelter request', 'Volunteer dispatch', 'Police alert'].map(t => (
                            <span key={t + Math.random()} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 28px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.2)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                                <span style={{ width: 4, height: 4, background: '#ef4444', borderRadius: '50%', display: 'block', opacity: .6 }} />
                                {t}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ── NUMBERS ── */}
            <section style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', zIndex: 2, position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
                    {NUMBERS.map(n => (
                        <div key={n.n} className="num-card" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: '28px 24px' }}>
                            <p style={{ fontSize: 42, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1 }}>{n.n}</p>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', fontWeight: 500, marginBottom: 4 }}>{n.label}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>{n.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── MISSION STATEMENT ── */}
            <section id="mission" style={{ padding: '80px 48px', maxWidth: 900, margin: '0 auto', textAlign: 'center', zIndex: 2, position: 'relative' }}>
                <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)', marginBottom: 64 }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>Why we built this</p>
                <p className="serif" style={{ fontSize: 38, lineHeight: 1.3, color: 'rgba(255,255,255,.85)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                    "Every minute between an emergency and a response{' '}
                    <em style={{ color: '#ef4444' }}>costs lives.</em>{' '}
                    We built SafeNet so that gap{' '}
                    <em>disappears.</em>"
                </p>
                <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)', marginTop: 64 }} />
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', zIndex: 2, position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>The flow</p>
                        <h2 style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 16 }}>
                            Four steps.<br />
                            <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>Under a minute.</span>
                        </h2>
                        <p style={{ fontSize: 16, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, maxWidth: 380 }}>
                            From the moment you report to the moment help is dispatched — SafeNet does the routing, matching, and alerting automatically.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[
                            { n: '01', title: 'You tap Report', desc: 'Describe the emergency and share your location. 30 seconds max.', color: '#ef4444' },
                            { n: '02', title: 'We find the nearest', desc: 'SafeNet calculates the closest available hospitals, police, clinics.', color: '#f97316' },
                            { n: '03', title: 'They get alerted', desc: 'SMS, email, and in-app notifications sent simultaneously.', color: '#eab308' },
                            { n: '04', title: 'You track it live', desc: 'Watch your report go from Pending → Responding → Resolved.', color: '#22c55e' },
                        ].map((s, i) => (
                            <div key={s.n} style={{ display: 'flex', gap: 20, padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ width: 3, alignSelf: 'stretch', background: s.color, borderRadius: 2, flexShrink: 0 }} />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.08em' }}>{s.n}</span>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{s.title}</h3>
                                    </div>
                                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ROLES ── */}
            <section id="roles" style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', zIndex: 2, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Three roles</p>
                    <h2 style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        One platform,<br />
                        <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.45)', fontWeight: 400 }}>every perspective.</span>
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: 20 }}>
                    {[
                        {
                            label: 'Citizens', icon: '👤',
                            badge: null, accent: '#3b82f6',
                            bg: 'rgba(59,130,246,.05)', border: 'rgba(59,130,246,.15)',
                            desc: 'Anyone can report. Anyone can be helped.',
                            items: ['Report in under 30 seconds', 'Track your report live', 'Get real-time status updates', 'See nearest resources on map'],
                        },
                        {
                            label: 'Resource managers', icon: '🏥',
                            badge: 'Core role', accent: '#ef4444',
                            bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.25)',
                            desc: 'Receive alerts. Accept. Respond. Resolve.',
                            items: ['Instant SMS & email alerts', 'One-tap accept or reject', 'Toggle your availability', 'Manage your resources live'],
                        },
                        {
                            label: 'Administrators', icon: '🛡️',
                            badge: null, accent: '#8b5cf6',
                            bg: 'rgba(139,92,246,.05)', border: 'rgba(139,92,246,.15)',
                            desc: 'Full visibility over the entire system.',
                            items: ['Complete analytics dashboard', 'Manage all users & resources', 'Audit log of all activity', 'Response time monitoring'],
                        },
                    ].map(r => (
                        <div key={r.label} className="role-card" style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 24, padding: 32, position: 'relative' }}>
                            {r.badge && (
                                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: r.accent, color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 999, letterSpacing: '.06em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{r.badge}</div>
                            )}
                            <div style={{ fontSize: 36, marginBottom: 20 }}>{r.icon}</div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>{r.label}</h3>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.35)', marginBottom: 24, lineHeight: 1.5 }}>{r.desc}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {r.items.map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 16, height: 16, borderRadius: 4, background: `${r.accent}22`, border: `1px solid ${r.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span style={{ fontSize: 9, color: r.accent, fontWeight: 700 }}>✓</span>
                                        </div>
                                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.4 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ padding: '80px 48px', zIndex: 2, position: 'relative', borderTop: '1px solid rgba(255,255,255,.06)' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80, alignItems: 'start' }}>
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>Impact</p>
                            <h2 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
                                Real stories.<br />
                                <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.35)', fontWeight: 400 }}>Real outcomes.</span>
                            </h2>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.3)', lineHeight: 1.7 }}>From the communities we serve across Kigali and beyond.</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { name: 'Marie K.', role: 'Community member, Kimironko', quote: 'I reported a road accident and within minutes the nearest clinic was notified. The responder arrived in under 8 minutes. SafeNet is not an app — it\'s a lifeline.' },
                                { name: 'Insp. Jean P.', role: 'Police Resource Manager, Gasabo', quote: 'Before SafeNet, incident reports came through radio or phone — slow and easy to miss. Now I get an instant alert with the exact location. We responded to 23 incidents last month through this platform alone.' },
                                { name: 'Dr. Amina N.', role: 'Hospital Administrator, CHUK', quote: 'We update our availability directly and the routing system finds us automatically. Three of our emergency patients last month came directly through SafeNet alerts.' },
                            ].map(t => (
                                <div key={t.name} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: '24px 28px' }}>
                                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14, flexShrink: 0 }}>{t.name[0]}</div>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{t.name}</p>
                                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section style={{ padding: '100px 48px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(239,68,68,.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
                    <h2 style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 20 }}>
                        <span className="serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.5)', fontWeight: 400 }}>Every second</span><br />
                        <span>already costs someone.</span>
                    </h2>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,.35)', lineHeight: 1.7, marginBottom: 44, maxWidth: 460, margin: '0 auto 44px' }}>
                        Join SafeNet. Report faster. Respond smarter. Save more lives.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? '/dashboard' : '/register'}>
                            <button className="btn-primary" style={{ padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 700, letterSpacing: '-.01em' }}>
                                {user ? 'Go to dashboard' : 'Get started free'}
                            </button>
                        </Link>
                        <Link to="/login">
                            <button className="btn-ghost" style={{ padding: '16px 28px', borderRadius: 12, fontSize: 15 }}>
                                Sign in
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '28px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L26 8v12L14 26 2 20V8L14 2z" fill="#ef4444" />
                        <path d="M14 8v12M8 11l12 6M20 11L8 17" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.6)', fontSize: 14 }}>SafeNet</span>
                    <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 14 }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 13 }}>Smart Emergency Management · Kigali, Rwanda</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 12 }}>Available 24 / 7</span>
            </footer>
        </div>
    )
}