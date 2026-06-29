const LEAGUES = [
  { slug: 'mlb', name: 'MLB' },
  { slug: 'nba', name: 'NBA' },
  { slug: 'nfl', name: 'NFL' },
  { slug: 'nhl', name: 'NHL' },
  { slug: 'liga-mx', name: 'Fútbol' },
];

export default function TopNav({ activeLeague, onLeague, search, onSearch }) {
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
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--subtle)', flexShrink: 0 }}>search</span>
          <input
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Buscar partido…"
            aria-label="Buscar partido"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch('')}
              style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--subtle)', padding: 0, lineHeight: 1, flexShrink: 0 }}
              aria-label="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
            </button>
          )}
        </label>

        <button className="icon-button" type="button" title="Notificaciones" aria-label="Notificaciones">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>notifications</span>
          <span style={{
            position: 'absolute', top: 8, right: 8,
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--brand)', border: '1px solid #080C0A',
          }} />
        </button>

        <button className="avatar-button" type="button" title="Perfil" aria-label="Perfil">
          A
        </button>
      </div>
    </header>
  );
}
