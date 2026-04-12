import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()
  const [menuOpen, setMenuOpen] = useState(false)
  const unread = liveEmergencies.filter(e => e.status === 'pending').length

  return (
    <>
      <style>{`
        .navbar{height:56px;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;padding:0 20px;flex-shrink:0}
        .hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:8px;padding:6px 8px;cursor:pointer;font-size:16px;color:#4a5568;line-height:1}
        .user-menu-dropdown{position:absolute;top:52px;right:20px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.1);min-width:180px;z-index:200;overflow:hidden}
        @media(max-width:768px){
          .hamburger{display:flex;align-items:center}
          .navbar-date{display:none}
        }
      `}</style>

      <header className="navbar" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger — triggers sidebar drawer via DOM */}
          <button className="hamburger" onClick={() => {
            const trigger = document.getElementById('mobile-menu-trigger')
            if (trigger) trigger.click()
          }}>☰</button>

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#e53e3e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e', letterSpacing: '-0.02em' }} className="mobile-brand">SafeNet</span>
          </div>

          <p className="navbar-date" style={{ fontSize: 13, color: '#a0aec0' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {unread > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, animation: 'pulse 1.5s infinite' }}>
              <span style={{ width: 6, height: 6, background: '#e53e3e', borderRadius: '50%', display: 'block' }} />
              {unread} alert{unread > 1 ? 's' : ''}
            </span>
          )}

          {/* User avatar button */}
          <button onClick={() => setMenuOpen(v => !v)}
            style={{ width: 32, height: 32, background: '#e53e3e', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </div>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 190 }} onClick={() => setMenuOpen(false)} />
            <div className="user-menu-dropdown">
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f7fafc' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#a0aec0' }}>{user?.email}</p>
                <span style={{ fontSize: 10, fontWeight: 600, background: '#fff5f5', color: '#e53e3e', padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 4, textTransform: 'capitalize' }}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              <div style={{ padding: '6px' }}>
                <Link to="/settings" onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, textDecoration: 'none', color: '#4a5568', fontSize: 13, fontWeight: 500 }}>
                  ⚙️ Settings
                </Link>
                <button onClick={() => { setMenuOpen(false); logout() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: 13, fontWeight: 500, width: '100%', fontFamily: 'inherit' }}>
                  → Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}`}</style>
    </>
  )
}