import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useNotifications } from '../../hooks/useNotifications'

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()
  const { unreadCount } = useNotifications()
  const [open, setOpen] = useState(false)

  // Close on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Close on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const NAV = [
    { path: '/dashboard', label: user?.role === 'user' ? 'Dashboard' : 'Dashboard', icon: '📊', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/emergencies', label: user?.role === 'user' ? 'My Reports' : 'Emergencies', icon: '🚨', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/resources', label: 'Resources', icon: '🏥', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/alerts', label: 'Alerts', icon: '🔔', roles: ['resource_manager', 'admin'] },
    { path: '/notifications', label: 'Notifications', icon: '📨', roles: ['user', 'resource_manager', 'admin'] },
    { path: '/settings', label: 'Settings', icon: '⚙️', roles: ['user', 'resource_manager', 'admin'] },
  ].filter(n => n.roles.includes(user?.role || ''))

  const NavLinks = () => (
    <>
      {NAV.map(item => {
        const isActive = location.pathname === item.path
        const badge =
          item.path === '/alerts' && liveEmergencies.length > 0 ? liveEmergencies.length :
            item.path === '/notifications' && unreadCount > 0 ? unreadCount : null
        return (
          <Link key={item.path} to={item.path}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', fontSize: 14, fontWeight: isActive ? 600 : 500,
              background: isActive ? '#e53e3e' : 'transparent',
              color: isActive ? '#fff' : '#718096',
              transition: 'all .15s'
            }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </span>
            {badge && (
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999,
                minWidth: 18, textAlign: 'center',
                background: isActive ? 'rgba(255,255,255,.25)' : '#fee2e2',
                color: isActive ? '#fff' : '#e53e3e'
              }}>{badge}</span>
            )}
          </Link>
        )
      })}
    </>
  )

  const UserFooter = () => (
    <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, background: '#e53e3e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
          <p style={{ fontSize: 11, color: '#a0aec0', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
        </div>
      </div>
      <button onClick={logout} style={{ fontSize: 12, color: '#a0aec0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        Sign out →
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        .sn-sidebar{width:220px;background:#fff;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;flex-shrink:0;height:100vh;overflow:hidden}
        .sn-hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:8px;padding:5px 8px;cursor:pointer;font-size:17px;color:#4a5568;line-height:1;align-items:center;justify-content:center}
        .sn-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:400}
        .sn-drawer{position:fixed;top:0;left:0;bottom:0;width:260px;background:#fff;z-index:500;display:flex;flex-direction:column;box-shadow:8px 0 32px rgba(0,0,0,.18);transition:transform .25s ease;transform:translateX(-100%)}
        .sn-drawer.open{transform:translateX(0)}
        @media(max-width:768px){
          .sn-sidebar{display:none}
          .sn-hamburger{display:flex}
          .sn-overlay.open{display:block}
        }
      `}</style>

      {/* ── DESKTOP sidebar ── */}
      <aside className="sn-sidebar">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: '#e53e3e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e', letterSpacing: '-0.02em' }}>SafeNet</span>
        </div>
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}><NavLinks /></nav>
        <UserFooter />
      </aside>

      {/* ── MOBILE hamburger (rendered inside Navbar via window event) ── */}
      <button id="sn-hamburger-btn" className="sn-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>

      {/* ── MOBILE overlay ── */}
      <div className={`sn-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      {/* ── MOBILE drawer ── */}
      <aside className={`sn-drawer ${open ? 'open' : ''}`}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: '#e53e3e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>SafeNet</span>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#a0aec0', lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}><NavLinks /></nav>
        <UserFooter />
      </aside>
    </>
  )
}