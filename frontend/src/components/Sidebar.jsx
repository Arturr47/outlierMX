import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: 'grid_view', label: 'Inicio', end: true },
  { to: '/dashboard/games', icon: 'sports_baseball', label: 'Partidos' },
  { to: '/dashboard/picks', icon: 'bookmark', label: 'Mis Picks' },
  { to: '/dashboard/ev', icon: 'trending_up', label: 'Valor' },
  { to: '/dashboard/arbitrage', icon: 'swap_horiz', label: 'Arbitraje' },
  { to: '/dashboard/middle', icon: 'center_focus_weak', label: 'Middles' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="app-sidebar">
      <div className="brand-mark">
        <p className="brand-title">Outlier MX</p>
        <p className="brand-subtitle">Premium Betting</p>
      </div>

      <div className="sidebar-divider" />

      <nav className="app-nav" aria-label="Principal">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
            title={item.label}
          >
            <span className="material-symbols-outlined app-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="primary-action" type="button">
          <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1, 'wght' 600" }}>bolt</span>
          Apuesta Rápida
        </button>

        <button className="sidebar-ghost" type="button">
          <span className="material-symbols-outlined app-nav-icon">help</span>
          Soporte
        </button>

        <button className="sidebar-ghost" type="button" onClick={logout}>
          <span className="material-symbols-outlined app-nav-icon">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
