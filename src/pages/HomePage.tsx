import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const FEED = [
    { type: 'Medical emergency', loc: 'Kimironko', ago: '12s' },
    { type: 'Road accident', loc: 'KN 5 Road', ago: '1m' },
    { type: 'Fire reported', loc: 'Nyamirambo', ago: '3m' },
    { type: 'Medical emergency', loc: 'Kicukiro', ago: '5m' },
    { type: 'Flooding alert', loc: 'Gisozi', ago: '8m' },
    { type: 'Security incident', loc: 'CBD Kigali', ago: '11m' },
]

const AVATARS = ['M', 'A', 'J', 'F', 'C']

export default function HomePage() {
    const { user } = useAuth()
    const { t, i18n } = useTranslation()
    const [tick, setTick] = useState(0)
    const [navOpen, setNavOpen] = useState(false)
    const isKinyarwanda = i18n.language === 'rw'

    const toggleLanguage = () => {
        i18n.changeLanguage(isKinyarwanda ? 'en' : 'rw')
    }

    useEffect(() => {
        const timer = setInterval(() => setTick(n => (n + 1) % FEED.length), 3000)
        return () => clearInterval(timer)
    }, [])

    const STEPS = [
        { n: '1', color: '#e53e3e', title: t('step1_title'), desc: t('step1_desc') },
        { n: '2', color: '#dd6b20', title: t('step2_title'), desc: t('step2_desc') },
        { n: '3', color: '#d69e2e', title: t('step3_title'), desc: t('step3_desc') },
        { n: '4', color: '#38a169', title: t('step4_title'), desc: t('step4_desc') },
    ]

    return (
        <div style={{ fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif", background: '#fff', color: '#1a1a2e', overflowX: 'hidden', lineHeight: 1.6 }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        a{text-decoration:none;color:inherit}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .live-pulse{animation:pulse 1.6s ease-in-out infinite}
        .ticker-track{animation:ticker 22s linear infinite;display:flex;white-space:nowrap;width:max-content}
        .feed-swap{animation:fadeSlide .35s ease both}
        .step-card{transition:box-shadow .2s,transform .2s;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:28px 22px}
        .step-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.09)}
        .role-card{transition:box-shadow .2s,transform .2s;border-radius:20px;padding:28px;position:relative}
        .role-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.1)}
        .quote-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:22px 24px;transition:box-shadow .2s}
        .quote-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .btn-red{background:#e53e3e;color:#fff;border:none;cursor:pointer;font-family:inherit;font-weight:600;transition:background .15s,transform .12s;display:inline-block}
        .btn-red:hover{background:#c53030;transform:translateY(-1px)}
        .btn-outline{background:#fff;color:#4a5568;border:1.5px solid #e2e8f0;cursor:pointer;font-family:inherit;font-weight:500;transition:border-color .15s}
        .btn-outline:hover{border-color:#a0aec0;color:#1a1a2e}
        .btn-lang{background:transparent;border:1.5px solid #e2e8f0;color:#4a5568;cursor:pointer;font-family:inherit;font-weight:600;font-size:13px;padding:7px 14px;border-radius:8px;transition:all .15s;white-space:nowrap}
        .btn-lang:hover{border-color:#e53e3e;color:#e53e3e;background:#fff5f5}
        .nav-link{color:#718096;font-size:14px;font-weight:500;transition:color .15s}
        .nav-link:hover{color:#1a1a2e}

        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
        .steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .roles-grid{display:grid;grid-template-columns:1fr 1.08fr 1fr;gap:20px}
        .stories-grid{display:grid;grid-template-columns:1fr 2fr;gap:72px;align-items:start}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
        .nav-links{display:flex;gap:32px}
        .nav-actions{display:flex;gap:10px;align-items:center}
        .hero-card{display:block}

        /* ── Hamburger & Mobile menu ── */
        .hamburger-btn{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:18px;color:#4a5568;line-height:1;position:relative;z-index:101}
        .mobile-menu{display:flex;flex-direction:column;gap:2px;padding:16px;background:#fff;border-top:1px solid #edf2f7;position:relative;z-index:100}

        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr;gap:40px}
          .hero-card{display:none}
          .steps-grid{grid-template-columns:repeat(2,1fr)}
          .roles-grid{grid-template-columns:1fr}
          .stories-grid{grid-template-columns:1fr;gap:32px}
          .stats-grid{grid-template-columns:repeat(2,1fr)}
          .nav-links{display:none}
          .nav-actions{display:none}
          .hamburger-btn{display:block}
        }
        @media(max-width:480px){
          .steps-grid{grid-template-columns:1fr}
          .stats-grid{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>

            {/* ── NAV ── */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #edf2f7' }}>
                <div style={{ padding: '0 6%', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: '#e53e3e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 16 }}>S</div>
                        <span style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e', letterSpacing: '-0.03em' }}>SafeNet</span>
                    </div>
                    <div className="nav-links">
                        <a href="#how" className="nav-link">{t('nav_how')}</a>
                        <a href="#who" className="nav-link">{t('nav_who')}</a>
                        <a href="#stories" className="nav-link">{t('nav_stories')}</a>
                    </div>
                    <div className="nav-actions">
                        {/* Language toggle */}
                        <button className="btn-lang" onClick={toggleLanguage}>
                            {isKinyarwanda ? '🇬🇧 English' : '🇷🇼 Kinyarwanda'}
                        </button>
                        {user ? (
                            <Link to="/dashboard"><button className="btn-red" style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14 }}>{t('my_dashboard')} →</button></Link>
                        ) : (
                            <>
                                <Link to="/login"><button className="btn-outline" style={{ padding: '9px 18px', borderRadius: 9, fontSize: 14 }}>{t('sign_in')}</button></Link>
                                <Link to="/register"><button className="btn-red" style={{ padding: '9px 22px', borderRadius: 9, fontSize: 14 }}>{t('get_started')}</button></Link>
                            </>
                        )}
                    </div>
                    <button className="hamburger-btn" onClick={() => setNavOpen(v => !v)} aria-label="Toggle menu">
                        {navOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile menu — React controls visibility, no display:none in CSS */}
                {navOpen && (
                    <div className="mobile-menu">
                        <a href="#how" className="nav-link" onClick={() => setNavOpen(false)} style={{ padding: '10px 0', display: 'block' }}>{t('nav_how')}</a>
                        <a href="#who" className="nav-link" onClick={() => setNavOpen(false)} style={{ padding: '10px 0', display: 'block' }}>{t('nav_who')}</a>
                        <a href="#stories" className="nav-link" onClick={() => setNavOpen(false)} style={{ padding: '10px 0', display: 'block' }}>{t('nav_stories')}</a>
                        {/* Language toggle in mobile */}
                        <button className="btn-lang" onClick={toggleLanguage} style={{ marginTop: 8, width: '100%', padding: '11px', borderRadius: 9, textAlign: 'center' }}>
                            {isKinyarwanda ? '🇬🇧 Switch to English' : '🇷🇼 Hindura ururimi / Kinyarwanda'}
                        </button>
                        <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                            {user ? (
                                <Link to="/dashboard" onClick={() => setNavOpen(false)} style={{ flex: 1 }}>
                                    <button className="btn-red" style={{ width: '100%', padding: '11px', borderRadius: 9, fontSize: 14 }}>{t('my_dashboard')} →</button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setNavOpen(false)} style={{ flex: 1 }}>
                                        <button className="btn-outline" style={{ width: '100%', padding: '11px', borderRadius: 9, fontSize: 14 }}>{t('sign_in')}</button>
                                    </Link>
                                    <Link to="/register" onClick={() => setNavOpen(false)} style={{ flex: 1 }}>
                                        <button className="btn-red" style={{ width: '100%', padding: '11px', borderRadius: 9, fontSize: 14 }}>{t('get_started')}</button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ── HERO ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 6% 72px' }}>
                <div className="hero-grid">
                    <div>
                        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#1a1a2e', marginBottom: 20 }}>
                            {t('hero_title')} <span style={{ color: '#e53e3e' }}>{t('hero_title_accent')}</span>
                        </h1>
                        <p style={{ fontSize: 'clamp(15px,2vw,17px)', color: '#4a5568', lineHeight: 1.75, maxWidth: 440, marginBottom: 32 }}>
                            {t('hero_subtitle')}
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                            <Link to={user ? '/emergencies' : '/register'}>
                                <button className="btn-red" style={{ padding: '13px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700 }}>{t('report_emergency')}</button>
                            </Link>
                            <a href="#how">
                                <button className="btn-outline" style={{ padding: '13px 22px', borderRadius: 12, fontSize: 14 }}>{t('how_it_works')} ↓</button>
                            </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex' }}>
                                {AVATARS.map((letter, i) => (
                                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce'][i], border: '2px solid #fff', marginLeft: i ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>{letter}</div>
                                ))}
                            </div>
                            <p style={{ fontSize: 13, color: '#718096', lineHeight: 1.5 }}>{t('trusted_by')}</p>
                        </div>
                    </div>

                    {/* Hero dispatch card — hidden on mobile */}
                    <div className="hero-card" style={{ background: '#1a1a2e', borderRadius: 20, overflow: 'hidden', boxShadow: '0 32px 80px rgba(26,26,46,.3)' }}>
                        <div style={{ background: 'rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {['#e53e3e', '#dd6b20', '#38a169'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: .7 }} />)}
                            </div>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginLeft: 4 }}>SafeNet Dispatch — Live</span>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span className="live-pulse" style={{ width: 6, height: 6, background: '#38a169', borderRadius: '50%', display: 'block' }} />
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>connected</span>
                            </div>
                        </div>
                        <div style={{ padding: '18px 18px 0' }}>
                            <div style={{ background: 'rgba(229,62,62,.08)', border: '1px solid rgba(229,62,62,.2)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ background: '#e53e3e', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6 }}>MEDICAL</span>
                                        <span className="live-pulse" style={{ width: 6, height: 6, background: '#e53e3e', borderRadius: '50%', display: 'block' }} />
                                        <span style={{ fontSize: 10, color: '#fc8181', fontWeight: 600 }}>LIVE</span>
                                    </div>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,.25)' }}>just now</span>
                                </div>
                                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', lineHeight: 1.55, marginBottom: 6 }}>Person collapsed near Kimironko market, needs urgent medical help.</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>📍 Kimironko, Gasabo · reported by Marie K.</p>
                            </div>
                        </div>
                        <div style={{ padding: '0 18px 6px' }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>3 nearest resources alerted</p>
                            {[
                                { initials: 'KFH', name: 'King Faisal Hospital', dist: '1.1 km', status: 'Dispatched', color: '#38a169' },
                                { initials: 'CHU', name: 'CHUK Emergency Unit', dist: '2.4 km', status: 'On standby', color: '#d69e2e' },
                                { initials: 'RNP', name: 'Rwanda National Police', dist: '0.9 km', status: 'En route', color: '#3182ce' },
                            ].map(r => (
                                <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `${r.color}22`, border: `1px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: r.color, flexShrink: 0 }}>{r.initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.75)' }}>{r.name}</p>
                                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{r.dist} away</p>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.status}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>Monitoring 6 active zones</span>
                            <span className="feed-swap" key={tick} style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>
                                {FEED[tick].type} · {FEED[tick].loc}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TICKER ── */}
            <div style={{ background: '#fff5f5', borderTop: '1px solid #fed7d7', borderBottom: '1px solid #fed7d7', overflow: 'hidden', padding: '11px 0' }}>
                <div className="ticker-track">
                    {[...Array(4)].flatMap((_, gi) =>
                        ['Medical', 'Fire', 'Flood', 'Accident', 'Crime', 'Shelter', 'Police', 'Volunteer'].map((type, i) => (
                            <span key={`${gi}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0 24px', fontSize: 11, fontWeight: 600, color: '#c53030', letterSpacing: '.07em', textTransform: 'uppercase' }}>
                                <span style={{ width: 4, height: 4, background: '#e53e3e', borderRadius: '50%', display: 'block', opacity: .6 }} />
                                {type} emergency
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* ── NUMBERS ── */}
            <section style={{ background: '#e53e3e', padding: '48px 6%' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div className="stats-grid">
                        {[
                            { value: '< 30s', label: t('stat1_label'), sub: t('stat1_sub') },
                            { value: '20 km', label: t('stat2_label'), sub: t('stat2_sub') },
                            { value: '3', label: t('stat3_label'), sub: t('stat3_sub') },
                            { value: '24/7', label: t('stat4_label'), sub: t('stat4_sub') },
                        ].map(s => (
                            <div key={s.label}>
                                <p style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</p>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', fontWeight: 600, marginBottom: 2 }}>{s.label}</p>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>{s.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding: '80px 6%', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>{t('simple_by_design')}</p>
                    <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em' }}>{t('how_safenet_works')}</h2>
                    <p style={{ fontSize: 15, color: '#718096', marginTop: 10, maxWidth: 440, margin: '10px auto 0' }}>{t('how_subtitle')}</p>
                </div>
                <div className="steps-grid">
                    {STEPS.map(s => (
                        <div key={s.n} className="step-card">
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}12`, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.n}</span>
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{s.title}</h3>
                            <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.65 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHO IT'S FOR ── */}
            <section id="who" style={{ background: '#f7fafc', padding: '80px 6%' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>{t('built_for_everyone')}</p>
                        <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em' }}>{t('one_platform')}</h2>
                    </div>
                    <div className="roles-grid">
                        {[
                            {
                                initial: 'C', bg: '#3182ce', lightBg: '#ebf8ff', border: '#bee3f8',
                                title: t('role_community'), desc: t('role_community_desc'),
                                perks: [t('perk_c1'), t('perk_c2'), t('perk_c3'), t('perk_c4')]
                            },
                            {
                                initial: 'R', bg: '#e53e3e', lightBg: '#fff5f5', border: '#feb2b2', featured: true,
                                title: t('role_resource'), desc: t('role_resource_desc'),
                                perks: [t('perk_r1'), t('perk_r2'), t('perk_r3'), t('perk_r4')]
                            },
                            {
                                initial: 'A', bg: '#6b46c1', lightBg: '#faf5ff', border: '#d6bcfa',
                                title: t('role_admin'), desc: t('role_admin_desc'),
                                perks: [t('perk_a1'), t('perk_a2'), t('perk_a3'), t('perk_a4')]
                            },
                        ].map(r => (
                            <div key={r.title} className="role-card" style={{ background: r.lightBg, border: `2px solid ${r.featured ? r.bg : r.border}` }}>
                                {r.featured && (
                                    <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: r.bg, color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 999, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{t('most_active')}</div>
                                )}
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16, boxShadow: `0 4px 14px ${r.bg}40` }}>{r.initial}</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>{r.title}</h3>
                                <p style={{ fontSize: 13, color: '#718096', marginBottom: 16, lineHeight: 1.55 }}>{r.desc}</p>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {r.perks.map(p => (
                                        <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#4a5568', lineHeight: 1.5 }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 4, background: `${r.bg}18`, border: `1px solid ${r.bg}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                                <span style={{ fontSize: 8, color: r.bg, fontWeight: 800 }}>✓</span>
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
            <section id="stories" style={{ padding: '80px 6%', maxWidth: 1200, margin: '0 auto' }}>
                <div className="stories-grid">
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#e53e3e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>{t('real_impact')}</p>
                        <h2 style={{ fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 14 }}>{t('what_people_say')}</h2>
                        <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.7 }}>{t('stories_subtitle')}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { initial: 'M', bg: '#e53e3e', name: 'Marie K.', role: t('testimonial1_role'), quote: t('testimonial1_quote') },
                            { initial: 'J', bg: '#3182ce', name: 'Insp. Jean P.', role: t('testimonial2_role'), quote: t('testimonial2_quote') },
                            { initial: 'A', bg: '#38a169', name: 'Dr. Amina N.', role: t('testimonial3_role'), quote: t('testimonial3_quote') },
                        ].map(testimonial => (
                            <div key={testimonial.name} className="quote-card">
                                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.8, marginBottom: 16, fontStyle: 'italic' }}>"{testimonial.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: testimonial.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{testimonial.initial}</div>
                                    <div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{testimonial.name}</p>
                                        <p style={{ fontSize: 12, color: '#a0aec0' }}>{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: '#1a1a2e', padding: '80px 6%', textAlign: 'center' }}>
                <div style={{ maxWidth: 560, margin: '0 auto' }}>
                    <div style={{ width: 56, height: 56, background: 'rgba(229,62,62,.15)', border: '1px solid rgba(229,62,62,.25)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 24px', fontWeight: 800, color: '#fc8181' }}>S</div>
                    <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
                        {t('cta_title')}
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,.45)', lineHeight: 1.7, marginBottom: 36 }}>
                        {t('cta_subtitle')}
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to={user ? '/dashboard' : '/register'}>
                            <button className="btn-red" style={{ padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700 }}>
                                {user ? `${t('open_dashboard')} →` : `${t('get_started_free')} →`}
                            </button>
                        </Link>
                        <Link to="/login">
                            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 14, color: 'rgba(255,255,255,.35)', cursor: 'pointer', padding: '14px 0' }}>{t('already_account')}</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,.06)', padding: '24px 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 26, height: 26, background: '#e53e3e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 12 }}>S</div>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.5)', fontSize: 14 }}>SafeNet</span>
                    <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 13 }}>· {t('footer_tagline')} · Kigali, Rwanda</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,.15)', fontSize: 12 }}>{t('available_247')}</span>
            </footer>
        </div>
    )
} 