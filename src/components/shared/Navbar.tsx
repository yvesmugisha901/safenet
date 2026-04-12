import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { liveEmergencies } = useSocket()
  const [dropOpen, setDropOpen] = useState(false)
  const unread = liveEmergencies.filter(e => e.status === 'pending').length

  const openDrawer = () => {
    const btn = document.getElementById('sn-hamburger-btn')
    if (btn) btn.click()
  }

  return (
    <>
      <style>{`
        .sn-navbar{height:56px;background:#fff;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;padding:0 20px;flex-shrink:0;position:relative;z-index:100}
        .sn-navbar-date{font-size:13px;color:#a0aec0}
        .sn-mobile-logo{display:none;align-items:center;gap:8px}
        @media(max-width:768px){
          .sn-navbar-date{display:none}
          .sn-mobile-logo{display:flex}
        }
      `}</style>

      <header className="sn-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger — only visible on mobile via CSS in Sidebar */}
          <button onClick={openDrawer}
            style={{ display: 'none', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', fontSize: 17, color: '#4a5568', lineHeight: 1, alignItems: 'center', justifyContent: 'center' }}
            id="sn-nav-hamburger">
            ☰
          </button>

          <div className="sn-mobile-logo">
            <div style={{ width: 26, height: 26, background: '#e53e3e', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>S</div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#1a1a2e' }}>SafeNet</span>
          </div>

          <p className="sn-navbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {unread > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
              <span style={{ width: 5, height: 5, background: '#e53e3e', borderRadius: '50%', display: 'block' }} />
              {unread} alert{unread > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={() => setDropOpen(v => !v)}
            style={{ width: 32, height: 32, background: '#e53e3e', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </div>

        {dropOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 190 }} onClick={() => setDropOpen(false)} />
            <div style={{ position: 'absolute', top: 52, right: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.1)', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f7fafc' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#a0aec0' }}>{user?.email}</p>
                <span style={{ fontSize: 10, fontWeight: 600, background: '#fff5f5', color: '#e53e3e', padding: '2px 8px', borderRadius: 999, display: 'inline-block', marginTop: 4, textTransform: 'capitalize' }}>
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
              <div style={{ padding: '6px' }}>
                <Link to="/settings" onClick={() => setDropOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, textDecoration: 'none', color: '#4a5568', fontSize: 13, fontWeight: 500 }}>
                  ⚙️ Settings
                </Link>
                <button onClick={() => { setDropOpen(false); logout() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: 13, fontWeight: 500, width: '100%', fontFamily: 'inherit' }}>
                  → Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Make hamburger visible on mobile */}
      <style>{`@media(max-width:768px){#sn-nav-hamburger{display:flex!important}}`}</style>
    </>
  )
}