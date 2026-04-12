import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

const FEED = [
    { type: 'Medical emergency', loc: 'Kimironko', ago: '12s' },
    { type: 'Road accident', loc: 'KN 5 Road', ago: '1m' },
    { type: 'Fire reported', loc: 'Nyamirambo', ago: '3m' },
    { type: 'Medical emergency', loc: 'Kicukiro', ago: '5m' },
    { type: 'Flooding alert', loc: 'Gisozi', ago: '8m' },
    { type: 'Security incident', loc: 'CBD Kigali', ago: '11m' },
]

const STEPS = [
    { n: '1', color: '#e53e3e', title: 'You report', desc: 'Describe the emergency and share your location. Takes about 30 seconds.' },
    { n: '2', color: '#dd6b20', title: 'We find help', desc: 'SafeNet automatically finds the nearest available hospital, police or fire station.' },
    { n: '3', color: '#d69e2e', title: 'They are alerted', desc: 'Resource managers receive instant notifications by SMS, email and in the app.' },
    { n: '4', color: '#38a169', title: 'You track it', desc: 'Follow your report live as it goes from Waiting → Help coming → Resolved.' },
]

const AVATARS = ['M', 'A', 'J', 'F', 'C', 'R', 'E', 'B']

export default function HomePage() {
    const { user } = useAuth()
    const [tick, setTick] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setTick(n => (n + 1) % FEED.length), 3000)
        return () => clearInterval(t)
    }, [])

    return (
        <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: '#fff', color: '#1a1a2e', overflowX: 'hidden', lineHeight: 1.6 }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        a{text-decoration:none;color:inherit}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes floatUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .live-pulse{animation:pulse 1.6s ease-in-out infinite}
        .ticker-track{animation:ticker 20s linear infinite;display:flex;white-space:nowrap;width:max-content}
        .feed-swap{animation:fadeSlide .35s ease both}
        .step-card{transition:box-shadow .2s,transform .2s}
        .step-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.09)}
        .role-card{transition:box-shadow .2s,transform .2s}
        .role-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.1)}
        .quote-card{transition:box-shadow .2s}
        .quote-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .btn-red{background:#e53e3e;color:#fff;border:none;cursor:pointer;font-family:inherit;font-weight:600;transition:background .15s,transform .12s}
        .btn-red:hover{background:#c53030;transform:translateY(-1px)}
        .btn-outline{background:#fff;color:#4a5568;border:1.5px solid #e2e8f0;cursor:pointer;font-family:inherit;font-weight:500;transition:border-color .15s,color .15s}
        .btn-outline:hover{border-color:#a0aec0;color:#1a1a2e}
        .nav-link{color:#718096;font-size:14px;font-weight:500;transition:color .15s;text-decoration:none}
        .nav-link:hover{color:#1a1a2e}
        ::selection{background:#e53e3e;color:#fff}
      `}</style>

            {/* ── NAV ── */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #edf2f7', padding: '0 6%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16 }}>S</div>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', letterSpacing: '-0.03em' }}>SafeNet</span>
                </div>
                <div style={{ display: 'flex', gap: 32 }}>
                    <a href="#how" className="nav-link">How it works</a>
                    <a href="#who" className="nav-link">Who it's for</a>
                    <a href="#stories" className="nav-link">Stories</a>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {user ? (
                        <Link to="/dashboard">
                            <button className="btn-red" style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14 }}>My dashboard →</button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn-outline" style={{ padding: '9px 18px', borderRadius: 9, fontSize: 14 }}>Sign in</button>
                            </Link>
                            <Link to="/register">
                                <button className="btn-red" style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14 }}>Get started free</button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 6% 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1a1a2e', marginBottom: 20 }}>
                        Get emergency help
                        to the right place,{' '}
                        <span style={{ color: '#e53e3e', position: 'relative', display: 'inline-block' }}>
                            faster.
                            <svg style={{ position: 'absolute', bottom: -4, left: 0, width: '100%' }} height="5" viewBox="0 0 160 5" preserveAspectRatio="none">
                                <path d="M2 4 Q40 1 80 4 Q120 7 158 4" stroke="#e53e3e" strokeWidth="2" fill="none" strokeLinecap="round" opacity=".5" />
                            </svg>
                        </span>
                    </h1>

                    <p style={{ fontSize: 17, color: '#4a5568', lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
                        Report any emergency in seconds. SafeNet instantly notifies the nearest available hospital, police station or rescue team — automatically, no phone calls needed.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
                        <Link to={user ? '/emergencies' : '/register'}>
                            <button className="btn-red" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 700 }}>
                                Report an emergency
                            </button>
                        </Link>
                        <a href="#how">
                            <button className="btn-outline" style={{ padding: '14px 24px', borderRadius: 12, fontSize: 15 }}>
                                See how it works ↓
                            </button>
                        </a>
                    </div>

                    {/* Social proof — letters instead of icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ display: 'flex' }}>
                            {AVATARS.slice(0, 5).map((letter, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce'][i],
                                    border: '2px solid #fff', marginLeft: i ? -10 : 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0
                                }}>{letter}</div>
                            ))}
                        </div>
                        <p style={{ fontSize: 13, color: '#718096', lineHeight: 1.5 }}>
                            Trusted by <strong style={{ color: '#4a5568' }}>citizens, hospitals,</strong><br />
                            <strong style={{ color: '#4a5568' }}>police & fire brigades</strong> in Kigali
                        </p>
                    </div>
                </div>

                {/* Hero card — dispatch mock */}
                <div style={{ background: '#1a1a2e', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(26,26,46,.3)' }}>
                    {/* Header */}
                    <div style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['#e53e3e', '#dd6b20', '#38a169'].map(c => (
                                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: .7 }} />
                            ))}
                        </div>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginLeft: 4, letterSpacing: '.04em' }}>SafeNet Dispatch — Live</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span className="live-pulse" style={{ width: 6, height: 6, background: '#38a169', borderRadius: '50%', display: 'block' }} />
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>connected</span>
                        </div>
                    </div>

                    {/* Active alert */}
                    <div style={{ padding: '18px 18px 0' }}>
                        <div style={{ background: 'rgba(229,62,62,.08)', border: '1px solid rgba(229,62,62,.2)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6, letterSpacing: '.04em' }}>MEDICAL</span>
                                    <span className="live-pulse" style={{ width: 6, height: 6, background: '#e53e3e', borderRadius: '50%', display: 'block' }} />
                                    <span style={{ fontSize: 10, color: '#fc8181', fontWeight: 600 }}>LIVE</span>
                                </div>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>just now</span>
                            </div>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, marginBottom: 8 }}>
                                Person collapsed near Kimironko market, needs urgent medical help.
                            </p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>📍 Kimironko, Gasabo · reported by Marie K.</p>
                        </div>
                    </div>

                    {/* Resources */}
                    <div style={{ padding: '0 18px 6px' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>3 nearest resources alerted</p>
                        {[
                            { initials: 'KFH', name: 'King Faisal Hospital', dist: '1.1 km', status: 'Dispatched', color: '#38a169' },
                            { initials: 'CHU', name: 'CHUK Emergency Unit', dist: '2.4 km', status: 'On standby', color: '#d69e2e' },
                            { initials: 'RNP', name: 'Rwanda National Police', dist: '0.9 km', status: 'En route', color: '#3182ce' },
                        ].map(r => (
                            <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${r.color}22`, border: `1px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: r.color, flexShrink: 0 }}>
                                    {r.initials}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)' }}>{r.name}</p>
                                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{r.dist} away</p>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.status}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.1)', borderTopColor: '#e53e3e', borderRadius: '50%', animation: 'ticker 1.5s linear infinite' }} />
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Monitoring 6 active zones</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="live-pulse" style={{ width: 5, height: 5, background: '#e53e3e', borderRadius: '50%', display: 'block' }} />
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}
                                key={tick}
                                className="feed-swap">
                                {FEED[tick].type} · {FEED[tick].loc}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TICKER ── */}
            <div style={{ background: '#fff5f5', borderTop: '1px solid #fed7d7', borderBottom: '1px solid #fed7d7', overflow: 'hidden', padding: '11px 0' }}>
                <div className="ticker-track">
                    {[...Array(4)].flatMap(() =>
                        ['Medical', 'Fire', 'Flood', 'Accident', 'Crime', 'Shelter', 'Police', 'Volunteer'].map((t, i) => (
                            <span key={t + i + Math.random()} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', fontSize: 11, fontWeight: 600, color: '#c53030', letterSpacing: '.07em', textTransform: 'uppercase' }}>
                                <span style={{ width: 4, height: 4, background: '#e53e3e', borderRadius: '50%', display: 'block', opacity: .6 }} />
                                {t} emergency
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ── NUMBERS ── */}
            <section style={{ background: '#e53e3e', padding: '52px 6%' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
                    {[
                        { value: '< 30s', label: 'From report to alert', sub: 'average delivery time' },
                        { value: '20 km', label: 'Auto-match radius', sub: 'finds nearest resources' },
                        { value: '3 ways', label: 'Alert channels', sub: 'SMS, email and app' },
                        { value: '24/7', label: 'Always available', sub: 'no downtime, ever' },
                    ].map(s => (
                        <div key={s.label}>
                            <p style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</p>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{s.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding: '88px 6%', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Simple by design</p>
                    <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em' }}>How SafeNet works</h2>
                    <p style={{ fontSize: 16, color: '#718096', marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>Four steps from report to response — all handled automatically</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
                    {STEPS.map(s => (
                        <div key={s.n} className="step-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '28px 22px', cursor: 'default' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.n}</span>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>{s.title}</h3>
                            <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.65 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHO IT'S FOR ── */}
            <section id="who" style={{ background: '#f7fafc', padding: '88px 6%' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Built for everyone</p>
                        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em' }}>One platform, three roles</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.08fr 1fr', gap: 20 }}>
                        {[
                            {
                                initial: 'C', bg: '#3182ce', lightBg: '#ebf8ff', border: '#bee3f8',
                                title: 'Community member',
                                desc: 'For anyone who needs to report or track an emergency',
                                perks: ['Report any emergency in 30 seconds', 'See nearest available resources', 'Track your report status in real time', 'Get notified when help is coming'],
                            },
                            {
                                initial: 'R', bg: '#e53e3e', lightBg: '#fff5f5', border: '#feb2b2',
                                title: 'Resource manager',
                                featured: true,
                                desc: 'For hospitals, police, fire brigades and rescue teams',
                                perks: ['Receive instant alerts near your location', 'Accept or reject with one tap', 'Toggle your availability live', 'See all incoming emergencies'],
                            },
                            {
                                initial: 'A', bg: '#6b46c1', lightBg: '#faf5ff', border: '#d6bcfa',
                                title: 'Administrator',
                                desc: 'For city officials and platform administrators',
                                perks: ['Full analytics and dashboard', 'Manage all users and resources', 'Complete audit log of all activity', 'Monitor response times'],
                            },
                        ].map(r => (
                            <div key={r.title} className="role-card" style={{ background: r.lightBg, border: `2px solid ${r.featured ? r.bg : r.border}`, borderRadius: 20, padding: 30, position: 'relative', cursor: 'default' }}>
                                {r.featured && (
                                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: r.bg, color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 999, letterSpacing: '.05em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                                        Most active role
                                    </div>
                                )}
                                {/* Letter avatar */}
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 18, boxShadow: `0 4px 14px ${r.bg}40` }}>
                                    {r.initial}
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{r.title}</h3>
                                <p style={{ fontSize: 13, color: '#718096', marginBottom: 20, lineHeight: 1.55 }}>{r.desc}</p>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {r.perks.map(p => (
                                        <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#4a5568', lineHeight: 1.5 }}>
                                            <span style={{ width: 18, height: 18, borderRadius: 5, background: `${r.bg}18`, border: `1px solid ${r.bg}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                                <span style={{ fontSize: 9, color: r.bg, fontWeight: 800 }}>✓</span>
                                            </span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STORIES ── */}
            <section id="stories" style={{ padding: '88px 6%', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 72, alignItems: 'start' }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16 }}>Real impact</p>
                        <h2 style={{ fontSize: 38, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 16 }}>
                            What people are saying
                        </h2>
                        <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.7 }}>Stories from the communities SafeNet serves across Kigali.</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { initial: 'M', bg: '#e53e3e', name: 'Marie K.', role: 'Community member, Kimironko', quote: 'I reported a road accident and within minutes the nearest clinic was already notified. The responder arrived in under 8 minutes. This platform genuinely saves lives.' },
                            { initial: 'J', bg: '#3182ce', name: 'Insp. Jean P.', role: 'Police Resource Manager, Gasabo', quote: 'Before SafeNet, incident reports came by radio or phone — easy to miss. Now I get an instant alert with the exact location. We handled 23 incidents last month through this platform.' },
                            { initial: 'A', bg: '#38a169', name: 'Dr. Amina N.', role: 'Hospital Administrator, CHUK', quote: 'We update our availability and the system routes emergencies to us automatically. Three of our emergency patients last month came directly through SafeNet alerts.' },
                        ].map(t => (
                            <div key={t.name} className="quote-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', cursor: 'default' }}>
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.8, marginBottom: 18, fontStyle: 'italic' }}>"{t.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                        {t.initial}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{t.name}</p>
                                        <p style={{ fontSize: 12, color: '#a0aec0' }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: '#1a1a2e', padding: '88px 6%', textAlign: 'center' }}>
                <div style={{ maxWidth: 580, margin: '0 auto' }}>
                    <div style={{ width: 60, height: 60, background: 'rgba(229,62,62,.15)', border: '1px solid rgba(229,62,62,.25)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 28px', fontWeight: 800, color: '#fc8181' }}>S</div>
                    <h2 style={{ fontSize: 42, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 18 }}>
                        Your community deserves faster emergency response.
                    </h2>
                    <p style={{ fontSize: 17, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 40 }}>
                        Free for citizens. Built for the people who protect communities.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? '/dashboard' : '/register'}>
                            <button className="btn-red" style={{ padding: '15px 38px', borderRadius: 12, fontSize: 16, fontWeight: 700 }}>
                                {user ? 'Open my dashboard →' : 'Get started — it\'s free →'}
                            </button>
                        </Link>
                        <Link to="/login">
                            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 14, color: 'rgba(255,255,255,.35)', cursor: 'pointer', padding: '15px 0' }}>
                                Already have an account?
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,.06)', padding: '28px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 26, height: 26, background: '#e53e3e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 12 }}>S</div>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.5)', fontSize: 14 }}>SafeNet</span>
                    <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 13 }}>·</span>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 13 }}>Smart Emergency Management · Kigali, Rwanda</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 12 }}>Available 24 / 7</span>
            </footer>
        </div>
    )
}