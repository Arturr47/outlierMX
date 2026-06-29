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

function findEVOpportunities(matches) {
  const opps = [];
  for (const m of matches) {
    const ml = (m.odds || []).filter(o => o.bet_type === 'moneyline');
    if (ml.length < 2) continue;

    const homeOdds = ml.map(o => parseFloat(o.home_odds)).filter(n => !Number.isNaN(n));
    const awayOdds = ml.map(o => parseFloat(o.away_odds)).filter(n => !Number.isNaN(n));
    if (!homeOdds.length || !awayOdds.length) continue;

    const avgHomeProb = homeOdds.reduce((s, v) => s + impliedProb(v), 0) / homeOdds.length;
    const avgAwayProb = awayOdds.reduce((s, v) => s + impliedProb(v), 0) / awayOdds.length;
    const bestHome = Math.max(...homeOdds);
    const bestAway = Math.max(...awayOdds);
    const bestHomeProb = impliedProb(bestHome);
    const bestAwayProb = impliedProb(bestAway);

    if (avgHomeProb - bestHomeProb > 0.03) {
      opps.push({
        match: m,
        side: m.home_short,
        team: m.home_team,
        bestOdds: bestHome,
        avgProb: avgHomeProb,
        edgePct: Math.round((avgHomeProb - bestHomeProb) * 100),
      });
    }
    if (avgAwayProb - bestAwayProb > 0.03) {
      opps.push({
        match: m,
        side: m.away_short,
        team: m.away_team,
        bestOdds: bestAway,
        avgProb: avgAwayProb,
        edgePct: Math.round((avgAwayProb - bestAwayProb) * 100),
      });
    }
  }
  return opps.sort((a, b) => b.edgePct - a.edgePct);
}

const EDU = [
  {
    icon: 'help',
    title: '¿Qué es EV positivo?',
    body: 'Una apuesta tiene valor positivo (+EV) cuando el precio que ofrece la casa es mayor al riesgo real del evento. Si el mercado dice 45% pero tú calculas 55%, hay valor.',
  },
  {
    icon: 'compare',
    title: '¿Cómo lo calculamos?',
    body: 'Comparamos los momios de múltiples casas para encontrar dónde una book tiene probabilidad implícita menor al promedio del mercado. Eso indica precio favorable.',
  },
  {
    icon: 'warning',
    title: '¿Cuándo actuar?',
    body: 'Solo cuando la señal es clara y el tamaño de la muestra es suficiente. El +EV no garantiza ganar cada apuesta, sino tener ventaja a largo plazo.',
  },
];

export default function EV() {
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

  const opportunities = useMemo(() => findEVOpportunities(matches), [matches]);

  const fmtOdds = v => {
    const n = parseFloat(v);
    if (!n || Number.isNaN(n)) return '—';
    return n > 0 ? `+${n.toFixed(0)}` : n.toFixed(0);
  };

  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Análisis de mercado</p>
          <h1 className="page-title">Valor Esperado</h1>
          <p className="page-copy">
            Apuestas donde el precio del mercado supera el riesgo real estimado.
            El +EV es la base de toda estrategia rentable a largo plazo.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Partidos analizados</span>
            <strong>{loading ? '…' : matches.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Oportunidades</span>
            <strong style={{ color: opportunities.length ? 'var(--value)' : 'var(--subtle)' }}>
              {loading ? '…' : opportunities.length}
            </strong>
          </div>
          <div className="mini-metric">
            <span>Requiere</span>
            <strong style={{ fontSize: 12 }}>2+ casas</strong>
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

      {/* Scanner */}
      <div className="section-head">
        <div>
          <h2>Scanner EV</h2>
          <p>Líneas donde una casa tiene precio más favorable que el promedio del mercado.</p>
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
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>trending_up</span>
          <strong>Sin oportunidades EV en este momento</strong>
          <p>
            No encontramos líneas con valor positivo claro en {matches.length} partido{matches.length !== 1 ? 's' : ''} revisados.
            Esto es normal — el mercado es eficiente y las oportunidades son temporales.
          </p>
          <p style={{ marginTop: 8, fontSize: 11.5, color: 'var(--subtle)' }}>
            Necesitamos momios de 2 o más casas por partido para calcular EV.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opportunities.map((opp, i) => (
            <div
              key={i}
              className="lit-card"
              style={{ padding: '14px 16px', cursor: 'pointer', transition: 'transform 130ms ease' }}
              onClick={() => navigate(`/dashboard/match/${opp.match.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: 'var(--value)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Posible valor +EV · {opp.edgePct}% diferencial
                  </p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                    {opp.team}
                    <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                      {opp.match.home_short} vs {opp.match.away_short}
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--value)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtOdds(opp.bestOdds)}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: 'var(--subtle)' }}>mejor precio</p>
                </div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 999,
                  background: 'var(--value-soft)', border: '1px solid var(--value-border)',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--value)' }}>
                    ~{Math.round(opp.avgProb * 100)}% prob. mercado
                  </span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--subtle)' }}>Ver análisis completo →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
