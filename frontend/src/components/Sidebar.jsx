import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HelpModal from './HelpModal';

const NAV_PRIMARY = [
  { to: '/dashboard', icon: 'grid_view', label: 'Inicio', end: true },
  { to: '/dashboard/games', icon: 'sports_baseball', label: 'Partidos' },
  { to: '/dashboard/popular', icon: 'bar_chart', label: 'Popular' },
  { to: '/dashboard/picks', icon: 'bookmark', label: 'Mis Picks' },
];

const NAV_TOOLS = [
  { to: '/dashboard/ev', icon: 'trending_up', label: 'Valor (EV)' },
  { to: '/dashboard/props', icon: 'person_search', label: 'Props' },
  { to: '/dashboard/arbitrage', icon: 'swap_horiz', label: 'Arbitraje' },
  { to: '/dashboard/middle', icon: 'center_focus_weak', label: 'Middles' },
  { to: '/dashboard/boosts', icon: 'rocket_launch', label: 'Boosts' },
];

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
      title={item.label}
    >
      <span className="material-symbols-outlined app-nav-icon">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <aside className="app-sidebar">
        <div className="brand-mark">
          <p className="brand-title">Outlier MX</p>
          <p className="brand-subtitle">Análisis de picks</p>
        </div>

        <div className="sidebar-divider" />

        <nav className="app-nav" aria-label="Principal">
          {NAV_PRIMARY.map(item => <NavItem key={item.to} item={item} />)}

          <div className="sidebar-section-label">Herramientas</div>

          {NAV_TOOLS.map(item => <NavItem key={item.to} item={item} />)}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="primary-action"
            type="button"
            onClick={() => navigate('/dashboard/picks')}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, fontVariationSettings: "'FILL' 1, 'wght' 600" }}
            >
              add
            </span>
            Nuevo Pick
          </button>

          <button className="sidebar-ghost" type="button" onClick={() => setHelpOpen(true)}>
            <span className="material-symbols-outlined app-nav-icon">school</span>
            Glosario
          </button>

          <button className="sidebar-ghost" type="button" onClick={logout}>
            <span className="material-symbols-outlined app-nav-icon">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}
