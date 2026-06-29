import { useCallback, useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MatchCard from '../components/MatchCard';
import api from '../lib/api';

const LEAGUE_LABEL = {
  mlb: 'MLB',
  nba: 'NBA',
  nfl: 'NFL',
  nhl: 'NHL',
  'liga-mx': 'Fútbol',
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

function getLastUpdated(matches) {
  const times = matches
    .flatMap(m => m.odds || [])
    .map(o => new Date(o.updated_at).getTime())
    .filter(Boolean);
  return times.length ? new Date(Math.max(...times)) : null;
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
  const moneyline = match.public_betting?.find(p => p.bet_type === 'moneyline');
  if (!moneyline) return null;
  const home = Number(moneyline.home_pct_bets || 0);
  const away = Number(moneyline.away_pct_bets || 0);
  return {
    side: home >= away ? match.home_short : match.away_short,
    pct: Math.max(home, away),
  };
}

function buildInsights(matches) {
  if (!matches.length) return null;

  const liveCount = matches.filter(m => m.status === 'live').length;
  const keyGame = matches
    .slice()
    .sort((a, b) => Math.abs(winPct(b, 'home') - winPct(b, 'away')) - Math.abs(winPct(a, 'home') - winPct(a, 'away')))[0];
  const publicGame = matches
    .map(m => ({ match: m, signal: getPublicSignal(m) }))
    .filter(x => x.signal)
    .sort((a, b) => b.signal.pct - a.signal.pct)[0];
  const strongData = matches.filter(m =>
    (m.odds?.length || 0) >= 4 &&
    (m.home_recent?.length || 0) >= 7 &&
    (m.away_recent?.length || 0) >= 7
  ).length;

  return {
    liveCount,
    keyGame,
    publicGame,
    confidence: Math.round((strongData / matches.length) * 100),
  };
}

export default function Dashboard() {
  const ctx = useOutletContext() || {};
  const activeLeague = ctx.activeLeague || 'mlb';

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  const dates = useMemo(buildDates, []);
  const lastUpdated = useMemo(() => getLastUpdated(matches), [matches]);
  const insights = useMemo(() => buildInsights(matches), [matches]);

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

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Centro de análisis</p>
          <h1 className="page-title">Partidos</h1>
          <p className="page-copy">
            Empieza por los juegos con mejor contexto: forma reciente, movimiento público y datos suficientes para comparar con confianza.
          </p>
        </div>

        <div className="metric-strip" aria-label="Resumen">
          <div className="mini-metric">
            <span>Liga</span>
            <strong>{LEAGUE_LABEL[activeLeague] || activeLeague.toUpperCase()}</strong>
          </div>
          <div className="mini-metric">
            <span>Partidos</span>
            <strong>{loading ? '...' : matches.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Actualizado</span>
            <strong>{loading ? '...' : formatUpdated(lastUpdated)}</strong>
          </div>
        </div>
      </section>

      {!loading && insights && (
        <section className="decision-panel" aria-label="Top insights de hoy">
          <div className="decision-card primary">
            <p className="decision-label">Top insight hoy</p>
            <h2 className="decision-title">
              {insights.keyGame.home_short} vs {insights.keyGame.away_short} tiene la comparación más marcada.
            </h2>
            <p className="decision-copy">
              Revisa primero forma reciente y moneyline. Una diferencia grande de récord no es una predicción, pero sí una buena señal para investigar.
            </p>
            <div className="trust-row">
              <span className="trust-pill good">{insights.confidence}% confianza de datos</span>
              <span className="trust-pill">Muestra reciente incluida</span>
            </div>
          </div>

          <div className="decision-card">
            <p className="decision-label">Juegos en vivo</p>
            <h2 className="decision-title">{insights.liveCount || 'Sin'} en progreso</h2>
            <p className="decision-copy">
              Si un juego está en vivo, valida score y mercado antes de guardar un pick.
            </p>
          </div>

          <div className="decision-card">
            <p className="decision-label">Señal pública</p>
            <h2 className="decision-title">
              {insights.publicGame
                ? `${insights.publicGame.signal.pct}% mira a ${insights.publicGame.signal.side}`
                : 'Sin señal fuerte'}
            </h2>
            <p className="decision-copy">
              Úsalo como contexto, no como recomendación automática. Compara si el dinero acompaña al volumen.
            </p>
          </div>

          <div className="decision-card">
            <p className="decision-label">Siguiente paso</p>
            <h2 className="decision-title">Abre un detalle</h2>
            <p className="decision-copy">
              Entra al partido que te interesa y confirma pitchers, tendencias y apuestas públicas antes de decidir.
            </p>
          </div>
        </section>
      )}

      <div className="date-rail hide-scroll" aria-label="Fechas">
        {dates.map(d => {
          const active = date === d.iso;
          return (
            <button
              key={d.iso}
              type="button"
              onClick={() => setDate(d.iso)}
              className={`date-tab${active ? ' is-active' : ''}`}
            >
              <strong>{d.label}</strong>
              <span>{d.weekday}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
          <Loader2 size={18} style={{ color: 'rgba(255,255,255,0.2)', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>event_busy</span>
          <strong>Sin partidos programados</strong>
          <p>Prueba otra fecha o cambia de liga para seguir explorando oportunidades.</p>
        </div>
      ) : (
        <>
          <div className="section-head">
            <div>
              <h2>Juegos de hoy</h2>
              <p>Ordenados para escanear rápido: equipos, forma, mercado y contexto accionable.</p>
            </div>
            <span className="data-freshness">Datos: {formatUpdated(lastUpdated)}</span>
          </div>
          <div className="match-list">
            {matches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
