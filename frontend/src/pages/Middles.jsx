import { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';
import api from '../lib/api';

function findMiddles(matches) {
  const opps = [];
  for (const m of matches) {
    const spreads = (m.odds || []).filter(o => o.bet_type === 'spread');
    if (spreads.length < 2) continue;

    const homeLines = spreads.map(s => parseFloat(s.spread_value)).filter(n => !Number.isNaN(n));
    const min = Math.min(...homeLines);
    const max = Math.max(...homeLines);
    const gap = Math.abs(max - min);

    if (gap >= 1.5) {
      opps.push({ match: m, min, max, gap: Math.round(gap * 10) / 10 });
    }
  }
  return opps.sort((a, b) => b.gap - a.gap);
}

const EDU = [
  {
    icon: 'center_focus_weak',
    title: '¿Qué es un middle?',
    body: 'Apuesta en ambos lados de un spread cuando hay diferencia entre dos casas. Si el partido cae dentro del rango, ambas apuestas ganan.',
  },
  {
    icon: 'compare_arrows',
    title: 'Ejemplo práctico',
    body: 'Casa A: equipo A -2.5. Casa B: equipo A -4.5. Si el equipo A gana por 3 o 4 exacto, ambas apuestas ganan. El "middle" es ese rango ganador.',
  },
  {
    icon: 'timeline',
    title: 'Cuándo buscarlos',
    body: 'Los middles aparecen cuando las casas tienen líneas que divergen, frecuentemente por movimiento de apuestas en una y no en la otra. Actúa antes del ajuste.',
  },
];

export default function Middles() {
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

  const opportunities = useMemo(() => findMiddles(matches), [matches]);

  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Estrategia avanzada</p>
          <h1 className="page-title">Middles</h1>
          <p className="page-copy">
            Cuando dos casas ofrecen spreads distintos, puedes apostar en ambos lados y ganar las dos si el resultado cae en el rango intermedio.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Partidos revisados</span>
            <strong>{loading ? '…' : matches.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Middles detectados</span>
            <strong style={{ color: opportunities.length ? 'var(--value)' : 'var(--subtle)' }}>
              {loading ? '…' : opportunities.length}
            </strong>
          </div>
          <div className="mini-metric">
            <span>Gap mínimo</span>
            <strong>1.5 pts</strong>
          </div>
        </div>
      </section>

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

      {/* Visual diagram */}
      <div style={{
        padding: '16px 20px', marginBottom: 24,
        border: '1px solid var(--movement-soft)',
        borderRadius: 'var(--radius)',
        background: 'var(--movement-soft)',
      }}>
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, color: 'var(--movement)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Diagrama visual
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, position: 'relative', height: 40 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--risk-soft)', borderRadius: '4px 0 0 4px', border: '1px solid var(--risk-border)' }} />
          <div style={{ position: 'relative', flex: 0.6, height: 4, background: 'var(--value-soft)', border: '1px solid var(--value-border)' }}>
            <span style={{
              position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
              fontSize: 9, fontWeight: 800, color: 'var(--value)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
            }}>
              Zona middle
            </span>
          </div>
          <div style={{ flex: 1, height: 4, background: 'var(--risk-soft)', borderRadius: '0 4px 4px 0', border: '1px solid var(--risk-border)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--subtle)' }}>Casa A: -2.5</span>
          <span style={{ fontSize: 10, color: 'var(--value)' }}>Ambas ganan aquí</span>
          <span style={{ fontSize: 10, color: 'var(--subtle)' }}>Casa B: -4.5</span>
        </div>
      </div>

      <div className="section-head">
        <div>
          <h2>Middles detectados</h2>
          <p>Spread lines con mayor diferencia entre casas disponibles.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>center_focus_weak</span>
          <strong>Sin middles en este momento</strong>
          <p>
            No encontramos spreads con diferencia de 1.5+ entre casas en los {matches.length} partidos analizados.
            Los middles aparecen cuando las líneas divergen por movimiento de mercado.
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: 'var(--movement)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Middle · {opp.gap} pts de gap
                  </p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
                    {opp.match.home_short} vs {opp.match.away_short}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                      {opp.min > 0 ? '+' : ''}{opp.min}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 9, color: 'var(--subtle)' }}>línea A</p>
                  </div>
                  <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--movement)', opacity: 0.5 }} />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                      {opp.max > 0 ? '+' : ''}{opp.max}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 9, color: 'var(--subtle)' }}>línea B</p>
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
