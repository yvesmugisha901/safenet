// components/shared/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard',  icon: '📊' },
  { path: '/report',    label: 'Report',     icon: '🚨' },
  { path: '/resources', label: 'Resources',  icon: '🏥' },
  { path: '/alerts',    label: 'Alerts',     icon: '🔔' },
];

const ADMIN_NAV = [
  { path: '/admin/users',  label: 'Users',     icon: '👥' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-white font-bold text-lg">SafeNet</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${location.pathname === item.path
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="pt-4 pb-2 px-3 text-xs text-gray-600 uppercase tracking-wider">Admin</div>
            {ADMIN_NAV.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === item.path
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-gray-500 hover:text-red-400 text-xs transition-colors px-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}
