import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

const HOW_IT_WORKS = [
    { step: '01', icon: '📍', title: 'Report', desc: 'Tap a button, describe what you see, and share your location. Done in under 30 seconds.' },
    { step: '02', icon: '⚡', title: 'Match', desc: 'SafeNet instantly finds the nearest available hospital, fire station, or rescue team.' },
    { step: '03', icon: '📲', title: 'Alert', desc: 'Resource managers receive an SMS, email, and live app notification simultaneously.' },
    { step: '04', icon: '✅', title: 'Respond', desc: 'Help is on the way. Track the response status live from your phone or computer.' },
]

const EMERGENCY_TYPES = [
    { icon: '🏥', label: 'Medical', color: '#ef4444' },
    { icon: '🔥', label: 'Fire', color: '#f97316' },
    { icon: '🌊', label: 'Flood', color: '#3b82f6' },
    { icon: '🚗', label: 'Accident', color: '#eab308' },
    { icon: '🚨', label: 'Crime', color: '#8b5cf6' },
    { icon: '⚠️', label: 'Other', color: '#6b7280' },
]

const TESTIMONIALS = [
    { name: 'Marie K.', role: 'Community Member', quote: 'I reported a road accident and within minutes the nearest clinic was already notified. This platform saves lives.' },
    { name: 'Insp. Jean P.', role: 'Police Resource Manager', quote: 'The real-time alerts mean we know about incidents in our radius the moment they are reported. No more delayed calls.' },
    { name: 'Dr. Amina N.', role: 'Hospital Administrator', quote: 'We can update our availability status and the system routes emergencies to us accordingly. Exactly what we needed.' },
]

const STATS = [
    { value: '< 30s', label: 'From report to alert' },
    { value: '20km', label: 'Auto-match radius' },
    { value: '3 channels', label: 'SMS · Email · App' },
    { value: '24 / 7', label: 'Always on' },
]

function useCountUp(end: number, duration = 1500) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const steps = 40
        const step = end / steps
        const interval = duration / steps
        const t = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(t) }
            else setCount(Math.floor(start))
        }, interval)
        return () => clearInterval(t)
    }, [end, duration])
    return count
}

export default function HomePage() {
    const { user } = useAuth()
    const [activeType, setActiveType] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setActiveType(i => (i + 1) % EMERGENCY_TYPES.length), 2000)
        return () => clearInterval(t)
    }, [])

    return (
        <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-16px) } to { opacity:1; transform:translateX(0) } }
        @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .fade-up { animation: fadeUp 0.6s ease both }
        .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both }
        .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both }
        .fade-up-3 { animation: fadeUp 0.6s 0.35s ease both }
        .step-card:hover .step-icon { animation: float 2s ease-in-out infinite }
        .type-pill { transition: all 0.3s ease }
        .nav-link:hover { color: #dc2626 }
        .cta-btn { transition: all 0.2s ease }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(220,38,38,0.35) }
        .testimonial-card { transition: all 0.2s ease }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08) }
        .feature-row:hover { background: #fef2f2 }
        .feature-row { transition: background 0.2s }
      `}</style>

            {/* ── NAV ── */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-6 lg:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="font-bold text-xl text-gray-900">SafeNet</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                    <a href="#how" className="nav-link transition-colors">How it works</a>
                    <a href="#types" className="nav-link transition-colors">Emergencies</a>
                    <a href="#who" className="nav-link transition-colors">Who it's for</a>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <Link to="/dashboard" className="cta-btn bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-red-100">
                            Open Dashboard →
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link text-sm font-medium text-gray-500 px-4 py-2 transition-colors">Sign in</Link>
                            <Link to="/register" className="cta-btn bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-red-100">
                                Get started free
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative px-6 lg:px-12 pt-20 pb-24 max-w-6xl mx-auto">
                {/* Live badge */}
                <div className="fade-up inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-full mb-8">
                    <span className="w-2 h-2 bg-red-500 rounded-full" style={{ animation: 'pulse-dot 1.5s infinite' }} />
                    Available 24/7 across your community
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h1 className="fade-up-1 text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
                            Get help to the right place,{' '}
                            <span className="text-red-600 relative">
                                faster.
                                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" preserveAspectRatio="none">
                                    <path d="M0 5 Q50 0 100 5 Q150 10 200 5" stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="fade-up-2 text-lg text-gray-500 leading-relaxed mb-10 max-w-lg">
                            SafeNet connects citizens with the nearest hospitals, fire stations, shelters and rescue teams — automatically, the moment an emergency is reported.
                        </p>
                        <div className="fade-up-3 flex items-center gap-4 flex-wrap">
                            <Link to={user ? '/emergencies' : '/register'}
                                className="cta-btn bg-red-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-red-200 text-base flex items-center gap-2">
                                🚨 Report an emergency
                            </Link>
                            <a href="#how"
                                className="text-gray-600 hover:text-gray-900 font-semibold px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all text-sm flex items-center gap-2">
                                See how it works ↓
                            </a>
                        </div>
                        {/* Social proof */}
                        <div className="fade-up-3 flex items-center gap-3 mt-8">
                            <div className="flex -space-x-2">
                                {['🧑🏿', '👩🏾', '👨🏽', '👩🏼'].map((e, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">{e}</div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">Trusted by communities, resource managers & first responders</p>
                        </div>
                    </div>

                    {/* Hero visual — live dispatch card */}
                    <div className="fade-up-2 relative">
                        <div className="bg-gray-950 rounded-3xl p-6 shadow-2xl">
                            {/* Mock phone notification */}
                            <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-sm">🚨</div>
                                    <div>
                                        <p className="text-white text-xs font-semibold">SafeNet Alert</p>
                                        <p className="text-gray-400 text-xs">just now</p>
                                    </div>
                                    <div className="ml-auto w-2 h-2 bg-red-500 rounded-full" style={{ animation: 'pulse-dot 1.5s infinite' }} />
                                </div>
                                <p className="text-gray-300 text-sm">Car accident reported 1.2km from your station. 2 people need medical attention.</p>
                            </div>
                            {/* Nearby resources */}
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-semibold">Nearest resources found</p>
                            {[
                                { icon: '🏥', name: 'King Faisal Hospital', dist: '0.8 km', status: 'Available', color: 'text-green-400' },
                                { icon: '🚒', name: 'Fire Brigade Kigali', dist: '1.4 km', status: 'Available', color: 'text-green-400' },
                                { icon: '👮', name: 'Rwanda National Police', dist: '2.1 km', status: 'Responding', color: 'text-yellow-400' },
                            ].map(r => (
                                <div key={r.name} className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
                                    <span className="text-xl">{r.icon}</span>
                                    <div className="flex-1">
                                        <p className="text-white text-xs font-medium">{r.name}</p>
                                        <p className="text-gray-500 text-xs">{r.dist} away</p>
                                    </div>
                                    <span className={`text-xs font-semibold ${r.color}`}>{r.status}</span>
                                </div>
                            ))}
                            <div className="mt-4 bg-red-600 rounded-xl py-3 text-center text-white text-sm font-bold">
                                ✓ Alerts sent to 3 resources
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className="bg-red-600 py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map(s => (
                        <div key={s.label}>
                            <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
                            <p className="text-red-200 text-sm font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-red-600 text-sm font-bold uppercase tracking-widest mb-3">Simple by design</p>
                    <h2 className="text-4xl font-extrabold text-gray-900">How SafeNet works</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {HOW_IT_WORKS.map((h, i) => (
                        <div key={h.step} className="step-card text-center group">
                            <div className="relative inline-flex items-center justify-center mb-5">
                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl step-icon">
                                    {h.icon}
                                </div>
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {i + 1}
                                </span>
                            </div>
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div className="hidden md:block absolute mt-[-2.5rem] ml-[10rem] text-gray-200 text-2xl">→</div>
                            )}
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{h.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{h.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── EMERGENCY TYPES ── */}
            <section id="types" className="bg-gray-50 py-20 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-red-600 text-sm font-bold uppercase tracking-widest mb-3">Coverage</p>
                        <h2 className="text-4xl font-extrabold text-gray-900">We handle every emergency type</h2>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {EMERGENCY_TYPES.map((t, i) => (
                            <div key={t.label} onClick={() => setActiveType(i)}
                                className="type-pill cursor-pointer rounded-2xl p-5 text-center border-2 transition-all"
                                style={{
                                    borderColor: activeType === i ? t.color : 'transparent',
                                    background: activeType === i ? `${t.color}10` : 'white',
                                    transform: activeType === i ? 'scale(1.05)' : 'scale(1)',
                                }}>
                                <span className="text-3xl block mb-2">{t.icon}</span>
                                <p className="text-gray-700 text-xs font-semibold">{t.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHO IT'S FOR ── */}
            <section id="who" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-red-600 text-sm font-bold uppercase tracking-widest mb-3">Built for everyone</p>
                    <h2 className="text-4xl font-extrabold text-gray-900">One platform, three roles</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '👤', role: 'Community Member', color: 'bg-blue-50 border-blue-100',
                            accent: 'text-blue-600', badge: 'bg-blue-100 text-blue-700',
                            perks: ['Report emergencies in seconds', 'See nearest resources on a map', 'Track response status live', 'Receive in-app notifications'],
                        },
                        {
                            icon: '🏥', role: 'Resource Manager', color: 'bg-red-50 border-red-100',
                            accent: 'text-red-600', badge: 'bg-red-100 text-red-700',
                            perks: ['Receive instant SMS & email alerts', 'Accept or reject emergency requests', 'Update your resource availability', 'View all incidents in your radius'],
                            featured: true,
                        },
                        {
                            icon: '🛡️', role: 'Administrator', color: 'bg-purple-50 border-purple-100',
                            accent: 'text-purple-600', badge: 'bg-purple-100 text-purple-700',
                            perks: ['Full analytics dashboard', 'Manage all users and resources', 'Monitor response times', 'Export incident reports'],
                        },
                    ].map(r => (
                        <div key={r.role}
                            className={`rounded-3xl border-2 p-8 ${r.color} ${r.featured ? 'ring-2 ring-red-400 ring-offset-2 scale-[1.02]' : ''}`}>
                            {r.featured && (
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${r.badge} mb-4 inline-block`}>Most active role</span>
                            )}
                            <div className="text-4xl mb-4">{r.icon}</div>
                            <h3 className={`text-xl font-bold mb-5 ${r.accent}`}>{r.role}</h3>
                            <ul className="space-y-3">
                                {r.perks.map(p => (
                                    <li key={p} className="flex items-start gap-2.5 text-sm text-gray-600">
                                        <span className={`mt-0.5 font-bold ${r.accent}`}>✓</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="bg-gray-950 py-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-red-500 text-sm font-bold uppercase tracking-widest mb-3">Real impact</p>
                        <h2 className="text-4xl font-extrabold text-white">What people are saying</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="testimonial-card bg-gray-900 border border-gray-800 rounded-3xl p-7">
                                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-gray-500 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8">🛡️</div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-5">
                        Your community deserves<br />faster emergency response.
                    </h2>
                    <p className="text-gray-400 text-lg mb-10">
                        Join SafeNet today — free for citizens, built for those who protect communities.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link to={user ? '/emergencies' : '/register'}
                            className="cta-btn bg-red-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-red-200 text-base">
                            {user ? 'Go to dashboard →' : 'Get started — it\'s free →'}
                        </Link>
                        <Link to="/login" className="text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors py-4">
                            Already have an account?
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-gray-100 px-6 lg:px-12 py-8 flex items-center justify-between flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <span className="font-semibold text-gray-700">SafeNet</span>
                    <span>· Smart Emergency Management Platform</span>
                </div>
                <span>Built for communities. Available 24/7.</span>
            </footer>
        </div>
    )
}
