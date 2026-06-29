import { useCallback, useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import SkeletonCard from '../components/SkeletonCard';
import { useWatchlist } from '../context/WatchlistContext';
import api from '../lib/api';

const LEAGUE_LABEL = {
  mlb: 'MLB', nba: 'NBA', nfl: 'NFL', nhl: 'NHL', 'liga-mx': 'Fútbol',
};

function buildDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: i === 0 ? '' : d.toISOString().split('T')[0],
      label: i === 0 ? 'Hoy' : d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      weekday: d.toLocaleDateString('es-MX', { weekday: 'short' }),
    };
  });
}

function formatUpdated(date) {
  if (!date) return 'Sin actualización';
  return date.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function winPct(match, side) {
  const n = parseFloat(match[`${side}_win_pct`]);
  if (!Number.isNaN(n)) return n;
  const wins = Number(match[`${side}_wins`] || 0);
  const losses = Number(match[`${side}_losses`] || 0);
  return wins + losses ? wins / (wins + losses) : 0;
}

function getPublicSignal(match) {
  const pb = match.public_betting?.find(p => p.bet_type === 'moneyline');
  if (!pb) return null;
  const home = Number(pb.home_pct_bets || 0);
  const away = Number(pb.away_pct_bets || 0);
  return { side: home >= away ? match.home_short : match.away_short, pct: Math.max(home, away) };
}

function buildInsights(matches) {
  if (!matches.length) return null;
  const liveCount = matches.filter(m => m.status === 'live').length;
  const keyGame = matches.slice().sort(
    (a, b) => Math.abs(winPct(b, 'home') - winPct(b, 'away')) - Math.abs(winPct(a, 'home') - winPct(a, 'away'))
  )[0];
  const publicGame = matches
    .map(m => ({ match: m, signal: getPublicSignal(m) }))
    .filter(x => x.signal)
    .sort((a, b) => b.signal.pct - a.signal.pct)[0];
  const strongData = matches.filter(m =>
    (m.odds?.length || 0) >= 4 &&
    (m.home_recent?.length || 0) >= 7 &&
    (m.away_recent?.length || 0) >= 7
  ).length;
  return { liveCount, keyGame, publicGame, confidence: Math.round((strongData / matches.length) * 100) };
}

function filterMatches(matches, query) {
  const active = matches.filter(m => m.status !== 'finished');
  if (!query.trim()) return active;
  const q = query.toLowerCase();
  return active.filter(m =>
    m.home_team?.toLowerCase().includes(q) ||
    m.away_team?.toLowerCase().includes(q) ||
    m.home_short?.toLowerCase().includes(q) ||
    m.away_short?.toLowerCase().includes(q) ||
    m.league?.toLowerCase().includes(q)
  );
}

export default function Dashboard() {
  const { activeLeague, search } = useOutletContext() || {};
  const navigate = useNavigate();
  const { list: watchlist } = useWatchlist();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  const dates = useMemo(buildDates, []);
  const [dateAnim, setDateAnim] = useState(null);
  const lastUpdated = useMemo(() => {
    const times = matches.flatMap(m => m.odds || []).map(o => new Date(o.updated_at).getTime()).filter(Boolean);
    return times.length ? new Date(Math.max(...times)) : null;
  }, [matches]);
  const insights = useMemo(() => buildInsights(matches), [matches]);
  const filtered = useMemo(() => filterMatches(matches, search || ''), [matches, search]);
  const finishedCount = useMemo(() => matches.filter(m => m.status === 'finished').length, [matches]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { league: activeLeague };
      if (date) params.date = date;
      const res = await api.get('/matches', { params });
      setMatches(res.data.matches || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [activeLeague, date]);

  useEffect(() => { load(); }, [load]);

  const isSearching = (search || '').trim().length > 0;

  return (
    <div className="page-shell page-in">
      {/* Hero */}
      <section className="page-hero">
        <div>
          <p className="eyebrow">Centro de análisis</p>
          <h1 className="page-title">
            {isSearching ? `Resultados para "${search}"` : 'Partidos de hoy'}
          </h1>
          <p className="page-copy">
            Juegos con mejor contexto: forma reciente, movimiento público y datos suficientes para decidir con confianza.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Liga</span>
            <strong>{LEAGUE_LABEL[activeLeague] || activeLeague.toUpperCase()}</strong>
          </div>
          <div className="mini-metric">
            <span>Partidos</span>
            <strong>{loading ? '…' : filtered.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Actualizado</span>
            <strong>{loading ? '…' : formatUpdated(lastUpdated)}</strong>
          </div>
        </div>
      </section>

      {/* Insight panel */}
      {!loading && !isSearching && insights && (
        <section className="decision-panel" aria-label="Insights del día">
          <div className="decision-card primary">
            <p className="decision-label">Top insight hoy</p>
            <h2 className="decision-title">
              {insights.keyGame.home_short} vs {insights.keyGame.away_short} tiene la diferencia más marcada.
            </h2>
            <p className="decision-copy">
              Revisa primero forma reciente y moneyline. Una diferencia grande de récord es una señal, no una predicción.
            </p>
            <div className="trust-row">
              <span className="trust-pill good">{insights.confidence}% confianza</span>
              <span className="trust-pill">Forma reciente incluida</span>
            </div>
          </div>
          <div className="decision-card">
            <p className="decision-label">En vivo</p>
            <h2 className="decision-title">{insights.liveCount || 'Sin'} juegos en progreso</h2>
            <p className="decision-copy">Si hay juego en vivo, valida el score antes de guardar un pick.</p>
          </div>
          <div className="decision-card">
            <p className="decision-label">Señal pública</p>
            <h2 className="decision-title">
              {insights.publicGame
                ? `${insights.publicGame.signal.pct}% hacia ${insights.publicGame.signal.side}`
                : 'Sin señal fuerte'}
            </h2>
            <p className="decision-copy">Contexto, no recomendación. Compara si el dinero acompaña al volumen.</p>
          </div>
          <div className="decision-card">
            <p className="decision-label">Siguiente paso</p>
            <h2 className="decision-title">Abre un partido</h2>
            <p className="decision-copy">Entra al partido que te interesa y confirma pitchers, tendencias y público.</p>
          </div>
        </section>
      )}

      {/* Watchlist preview */}
      {!isSearching && watchlist.length > 0 && (
        <section style={{ marginBottom: 24 }}>
          <div className="section-head">
            <div>
              <h2>En tu lista</h2>
              <p>Partidos que guardaste para revisar.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/picks')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, color: 'var(--brand)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              Ver todos
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }} className="hide-scroll">
            {watchlist.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => navigate(`/dashboard/match/${item.id}`)}
                style={{
                  flexShrink: 0,
                  minWidth: 160,
                  padding: '10px 14px',
                  border: '1px solid var(--brand-border)',
                  borderRadius: 10,
                  background: 'var(--brand-soft)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 130ms',
                }}
              >
                <p style={{ margin: 0, fontSize: 11, color: 'var(--brand)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Guardado
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>
                  {item.home_short} vs {item.away_short}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Date rail */}
      {!isSearching && (
        <div className="date-rail hide-scroll">
          {dates.map(d => (
            <button
              key={d.iso}
              type="button"
              onClick={() => {
                setDate(d.iso);
                setDateAnim(null);
                requestAnimationFrame(() => requestAnimationFrame(() => setDateAnim(d.iso)));
                setTimeout(() => setDateAnim(null), 250);
              }}
              className={`date-tab${date === d.iso ? ' is-active' : ''}${dateAnim === d.iso ? ' anim-chip-select' : ''}`}
            >
              <strong>{d.label}</strong>
              <span>{d.weekday}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>
            {isSearching ? 'search_off' : finishedCount > 0 ? 'check_circle' : 'event_busy'}
          </span>
          <strong>
            {isSearching
              ? `Sin resultados para "${search}"`
              : finishedCount > 0
              ? 'Todos los partidos de hoy terminaron'
              : 'Sin partidos programados'}
          </strong>
          <p>
            {isSearching
              ? 'Intenta con el nombre completo del equipo o su abreviatura.'
              : finishedCount > 0
              ? `${finishedCount} partido${finishedCount !== 1 ? 's' : ''} finalizado${finishedCount !== 1 ? 's' : ''} hoy. Cambia la fecha para ver los de mañana.`
              : 'Prueba otra fecha o cambia de liga para seguir explorando.'}
          </p>
        </div>
      ) : (
        <>
          <div className="section-head">
            <div>
              <h2>{isSearching ? `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}` : 'En juego o por comenzar'}</h2>
              {!isSearching && <p>Solo partidos activos. Los finalizados se ocultan automáticamente.</p>}
            </div>
            {!isSearching && (
              <span className="data-freshness">
                Datos: {formatUpdated(lastUpdated)}
              </span>
            )}
          </div>
          <div className="match-list">
            {filtered.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
          {!isSearching && finishedCount > 0 && (
            <p style={{
              marginTop: 16, textAlign: 'center',
              fontSize: 11.5, color: 'var(--faint)', fontWeight: 600,
            }}>
              {finishedCount} partido{finishedCount !== 1 ? 's' : ''} finalizado{finishedCount !== 1 ? 's' : ''} hoy · oculto{finishedCount !== 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  );
}
