import { useState, useEffect, useMemo, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import SkeletonCard from '../components/SkeletonCard';
import api from '../lib/api';

function getPublicPct(match) {
  const pb = match.public_betting?.find(p => p.bet_type === 'moneyline');
  if (!pb) return 0;
  return Math.max(Number(pb.home_pct_bets || 0), Number(pb.away_pct_bets || 0));
}

function getPublicSide(match) {
  const pb = match.public_betting?.find(p => p.bet_type === 'moneyline');
  if (!pb) return null;
  const home = Number(pb.home_pct_bets || 0);
  const away = Number(pb.away_pct_bets || 0);
  return { side: home >= away ? match.home_short : match.away_short, pct: Math.max(home, away) };
}

const THRESHOLDS = [
  { label: 'Todos', min: 0 },
  { label: '+55%', min: 55 },
  { label: '+65%', min: 65 },
  { label: '+75%', min: 75 },
];

export default function Popular() {
  const { activeLeague } = useOutletContext() || {};
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0);
  const [chipAnim, setChipAnim] = useState(null);

  const selectChip = useCallback(min => {
    setThreshold(min);
    setChipAnim(null);
    requestAnimationFrame(() => requestAnimationFrame(() => setChipAnim(min)));
    setTimeout(() => setChipAnim(null), 300);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/matches', { params: { league: activeLeague } })
      .then(r => setMatches(r.data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [activeLeague]);

  const publicGames = useMemo(() => {
    return matches
      .filter(m => m.public_betting?.length > 0 && getPublicPct(m) >= threshold)
      .sort((a, b) => getPublicPct(b) - getPublicPct(a));
  }, [matches, threshold]);

  const topSignal = publicGames[0] ? getPublicSide(publicGames[0]) : null;

  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Sentimiento del mercado</p>
          <h1 className="page-title">Popular</h1>
          <p className="page-copy">
            Partidos donde el público apuesta con mayor convicción. Alta concentración no siempre es buena señal — revisa si el dinero acompaña.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Con datos</span>
            <strong>{loading ? '…' : matches.filter(m => m.public_betting?.length).length}</strong>
          </div>
          <div className="mini-metric">
            <span>Señal más fuerte</span>
            <strong>{loading ? '…' : topSignal ? `${topSignal.pct}% ${topSignal.side}` : '—'}</strong>
          </div>
          <div className="mini-metric">
            <span>Mostrando</span>
            <strong>{loading ? '…' : publicGames.length}</strong>
          </div>
        </div>
      </section>

      {/* Education bar */}
      <div style={{
        padding: '12px 16px', marginBottom: 20,
        border: '1px solid var(--public-border)',
        borderRadius: 'var(--radius)',
        background: 'var(--public-soft)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--public)', flexShrink: 0 }}>info</span>
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text)' }}>% Tickets</strong> muestra dónde apuesta el público general.
          Cuando tickets y dinero apuntan diferente, puede haber movimiento de línea por jugadores afilados.
        </p>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {THRESHOLDS.map(t => (
          <button
            key={t.min}
            type="button"
            onClick={() => selectChip(t.min)}
            style={{
              padding: '6px 14px',
              border: `1px solid ${threshold === t.min ? 'var(--public-border)' : 'var(--line)'}`,
              borderRadius: 999,
              background: threshold === t.min ? 'var(--public-soft)' : 'transparent',
              color: threshold === t.min ? 'var(--public)' : 'var(--muted)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 130ms ease',
              animation: chipAnim === t.min ? 'chipSelect 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : publicGames.length === 0 ? (
        <div className="empty-state">
          <span className="material-symbols-outlined" style={{ fontSize: 30 }}>bar_chart</span>
          <strong>Sin señal pública fuerte</strong>
          <p>
            No hay partidos con datos de apuestas públicas para este filtro.
            Prueba reducir el umbral o revisa más tarde cuando los mercados abran.
          </p>
        </div>
      ) : (
        <>
          <div className="section-head">
            <div>
              <h2>Más apostados hoy</h2>
              <p>Ordenados de mayor a menor concentración pública (% tickets moneyline).</p>
            </div>
          </div>
          <div className="match-list">
            {publicGames.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
      )}
    </div>
  );
}
