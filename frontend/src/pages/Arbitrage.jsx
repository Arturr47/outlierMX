import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import api from '../lib/api';

function impliedProb(odds) {
  const n = parseFloat(odds);
  if (!n || Number.isNaN(n)) return null;
  if (n > 0) return 100 / (n + 100);
  return Math.abs(n) / (Math.abs(n) + 100);
}

function findArbOpportunities(matches) {
  const opps = [];
  for (const m of matches) {
    const ml = (m.odds || []).filter(o => o.bet_type === 'moneyline');
    if (ml.length < 2) continue;

    const bestHome = ml.reduce((b, o) => parseFloat(o.home_odds) > parseFloat(b.home_odds) ? o : b, ml[0]);
    const bestAway = ml.reduce((b, o) => parseFloat(o.away_odds) > parseFloat(b.away_odds) ? o : b, ml[0]);

    const pH = impliedProb(bestHome.home_odds);
    const pA = impliedProb(bestAway.away_odds);
    if (!pH || !pA) continue;

    const total = pH + pA;
    if (total < 1.0) {
      opps.push({
        match: m,
        total,
        margin: Math.round((1 - total) * 100 * 10) / 10,
        bestHome: { sportsbook: bestHome.sportsbook, odds: bestHome.home_odds },
        bestAway: { sportsbook: bestAway.sportsbook, odds: bestAway.away_odds },
      });
    }
  }
  return opps.sort((a, b) => a.total - b.total);
}

const fmtOdds = v => {
  const n = parseFloat(v);
  if (!n || Number.isNaN(n)) return '—';
  return n > 0 ? `+${n.toFixed(0)}` : n.toFixed(0);
};

const EDU = [
  {
    icon: 'swap_horiz',
    title: '¿Qué es arbitraje?',
    body: 'Apuestas en todos los resultados posibles entre diferentes casas, aprovechando diferencias en los momios para garantizar ganancia sin importar el resultado.',
  },
  {
    icon: 'speed',
    title: 'El factor tiempo',
    body: 'Las líneas cambian rápido. Una oportunidad de arb puede desaparecer en minutos cuando las casas ajustan. Actúa rápido y confirma los momios antes de apostar.',
  },
  {
    icon: 'calculate',
    title: 'Cómo calculamos',
    body: 'Sumamos las probabilidades implícitas del mejor precio de cada lado. Si la suma es menor a 100%, existe una ventana de arbitraje matemáticamente garantizada.',
  },
];

const BOOKS = ['DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet', 'BetRivers'];

export default function Arbitrage() {
  const { activeLeague } = useOutletContext() || {};
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/matches', { params: { league: activeLeague } })
      .then(r => setMatches(r.data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeLeague]);

  const opportunities = useMemo(() => findArbOpportunities(matches), [matches]);

  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Estrategia avanzada</p>
          <h1 className="page-title">Arbitraje</h1>
          <p className="page-copy">
            Cuando la suma de probabilidades implícitas entre casas es menor a 100%,
            existe una ventana para apostar en todos los lados y garantizar ganancia.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Partidos revisados</span>
            <strong>{loading ? '…' : matches.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Ventanas abiertas</span>
            <strong style={{ color: opportunities.length ? 'var(--value)' : 'var(--subtle)' }}>
              {loading ? '…' : opportunities.length}
            </strong>
          </div>
          <div className="mini-metric">
            <span>Casas comparadas</span>
            <strong style={{ fontSize: 12 }}>{BOOKS.length}+</strong>
          </div>
        </div>
      </section>

      {/* Education */}
      <div className="edu-grid">
        {EDU.map(e => (
          <div key={e.title} className="edu-card">
            <div className="edu-card-icon">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{e.icon}</span>
            </div>
            <h3>{e.title}</h3>
            <p>{e.body}</p>
          </div>
        ))}
      </div>

      {/* Books being checked */}
      <div style={{
        padding: '12px 16px', marginBottom: 20,
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Casas en el scanner
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {BOOKS.map(b => (
            <span key={b} style={{
              padding: '3px 9px', border: '1px solid var(--line)',
              borderRadius: 999, fontSize: 11, color: 'var(--muted)', fontWeight: 600,
            }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Scanner */}
      <div className="section-head">
        <div>
          <h2>Scanner de arbitraje</h2>
          <p>Revisa en tiempo real las líneas de las casas disponibles.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`scan-dot${loading ? '' : ' idle'}`} />
          <span style={{ fontSize: 11, color: 'var(--subtle)', fontWeight: 700 }}>
            {loading ? 'Escaneando…' : `${matches.length} partidos revisados`}
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>swap_horiz</span>
          <strong>Sin arbitraje disponible ahora</strong>
          <p>
            Revisamos {matches.length} partido{matches.length !== 1 ? 's' : ''} y no encontramos ventanas de arbitraje.
            Las casas ajustan sus líneas continuamente. Revisa más tarde o activa notificaciones.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opportunities.map((opp, i) => (
            <div
              key={i}
              className="lit-card"
              style={{ padding: '14px 16px', cursor: 'pointer' }}
              onClick={() => navigate(`/dashboard/match/${opp.match.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: 'var(--value)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Arb garantizado · +{opp.margin}% margen
                  </p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                    {opp.match.home_short} vs {opp.match.away_short}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    padding: '8px 12px', border: '1px solid var(--value-border)',
                    borderRadius: 9, background: 'var(--value-soft)', textAlign: 'center',
                  }}>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--subtle)', fontWeight: 700 }}>{opp.match.home_short}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: 'var(--value)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtOdds(opp.bestHome.odds)}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 9, color: 'var(--subtle)' }}>{opp.bestHome.sportsbook || '—'}</p>
                  </div>
                  <div style={{
                    padding: '8px 12px', border: '1px solid var(--value-border)',
                    borderRadius: 9, background: 'var(--value-soft)', textAlign: 'center',
                  }}>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--subtle)', fontWeight: 700 }}>{opp.match.away_short}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: 'var(--value)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtOdds(opp.bestAway.odds)}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 9, color: 'var(--subtle)' }}>{opp.bestAway.sportsbook || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
