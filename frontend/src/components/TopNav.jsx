import { useState } from 'react';

const LEAGUES = [
  { slug: 'mlb', name: 'MLB' },
  { slug: 'nba', name: 'NBA' },
  { slug: 'nfl', name: 'NFL' },
  { slug: 'nhl', name: 'NHL' },
  { slug: 'liga-mx', name: 'Fútbol' },
];

export default function TopNav({ activeLeague, onLeague }) {
  const [search, setSearch] = useState('');

  return (
    <header className="top-nav">
      <nav className="league-tabs hide-scroll" aria-label="Ligas">
        {LEAGUES.map(league => {
          const active = activeLeague === league.slug;
          return (
            <button
              key={league.slug}
              type="button"
              onClick={() => onLeague(league.slug)}
              className={`league-tab${active ? ' is-active' : ''}`}
            >
              {league.name}
            </button>
          );
        })}
      </nav>

      <div className="top-actions">
        <label className="search-box">
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'rgba(218,231,219,0.35)' }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar partido"
            aria-label="Buscar partido"
          />
        </label>

        <button className="icon-button" type="button" title="Notificaciones" aria-label="Notificaciones">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#6bfb9a',
            border: '1px solid #080a09',
          }} />
        </button>

        <button className="icon-button" type="button" title="Wallet" aria-label="Wallet">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_balance_wallet</span>
        </button>

        <button className="avatar-button" type="button" title="Perfil" aria-label="Perfil">
          A
        </button>
      </div>
    </header>
  );
}
