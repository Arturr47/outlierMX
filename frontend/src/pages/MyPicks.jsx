import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import SkeletonCard from '../components/SkeletonCard';
import api from '../lib/api';

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function fmtOdds(v) {
  if (!v) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n > 0 ? `+${n}` : `${n}`;
}

function typeLabel(t) {
  return { moneyline: 'ML', spread: 'Línea', over_under: 'Total', prop: 'Prop' }[t] || t;
}

export default function MyPicks() {
  const navigate = useNavigate();
  const { list: watchlist, toggle, has } = useWatchlist();
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('api');

  useEffect(() => {
    api.get('/picks')
      .then(r => setPicks(r.data.picks || []))
      .catch(() => setPicks([]))
      .finally(() => setLoading(false));
  }, []);

  const deletePick = async id => {
    try {
      await api.delete(`/picks/${id}`);
      setPicks(picks.filter(p => p.id !== id));
    } catch { /* silent */ }
  };

  const totalSaved = picks.length + watchlist.length;

  return (
    <div className="picks-shell page-in">
      {/* Hero */}
      <section className="page-hero">
        <div>
          <p className="eyebrow">Seguimiento personal</p>
          <h1 className="page-title">Mis Picks</h1>
          <p className="page-copy">
            Guarda picks desde cualquier partido con el ícono de marcador.
            Revisa momios, compara y decide con calma antes de apostar.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Picks guardados</span>
            <strong>{loading ? '…' : picks.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Lista de seguimiento</span>
            <strong>{watchlist.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Total</span>
            <strong style={{ color: totalSaved > 0 ? 'var(--brand)' : 'var(--subtle)' }}>{loading ? '…' : totalSaved}</strong>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', gap: 0, marginBottom: 20 }}>
        {[
          { id: 'api', label: `Picks (${loading ? '…' : picks.length})` },
          { id: 'wl', label: `Lista (${watchlist.length})` },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 0', marginRight: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? 'var(--text)' : 'var(--subtle)',
              borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`,
              marginBottom: -1, transition: 'color 130ms',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Picks tab */}
      {tab === 'api' && (
        loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : picks.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>bookmark</span>
            <strong>Sin picks guardados aún</strong>
            <p>
              Abre cualquier partido, elige un mercado y guarda tu selección.
              Aparecerá aquí para que puedas comparar momios antes de apostar.
            </p>
            <button
              className="empty-state-cta"
              onClick={() => navigate('/dashboard')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>sports_baseball</span>
              Explorar partidos
            </button>
          </div>
        ) : (
          <div className="picks-list">
            {picks.map(pick => (
              <div key={pick.id} className="pick-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                  {/* League + date */}
                  <div style={{ minWidth: 60, flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {pick.league_name || 'MLB'}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 10, color: 'var(--subtle)' }}>
                      {fmtDate(pick.match_date)}
                    </p>
                  </div>

                  <div style={{ width: 1, height: 36, background: 'var(--line)', flexShrink: 0 }} />

                  {/* Pick info */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pick.home_team} vs {pick.away_team}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '2px 7px', border: '1px solid var(--line)',
                        borderRadius: 999, fontSize: 10, fontWeight: 700, color: 'var(--muted)',
                      }}>
                        {typeLabel(pick.pick_type)}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)' }}>{pick.pick_value}</span>
                      {fmtOdds(pick.odds) && (
                        <span style={{ fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>
                          {fmtOdds(pick.odds)}
                        </span>
                      )}
                      {pick.sportsbook && (
                        <span style={{ fontSize: 10, color: 'var(--subtle)' }}>{pick.sportsbook}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deletePick(pick.id)}
                  className="icon-button"
                  title="Eliminar pick"
                  aria-label="Eliminar pick"
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                    delete
                  </span>
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* Watchlist tab */}
      {tab === 'wl' && (
        watchlist.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontSize: 30 }}>bookmarks</span>
            <strong>Tu lista está vacía</strong>
            <p>
              Guarda partidos con el ícono{' '}
              <span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>bookmark</span>
              {' '}en cualquier tarjeta para verlos aquí.
            </p>
            <button className="empty-state-cta" onClick={() => navigate('/dashboard')}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>sports_baseball</span>
              Ver partidos
            </button>
          </div>
        ) : (
          <div className="picks-list">
            {watchlist.map(item => (
              <div key={item.id} className="pick-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/dashboard/match/${item.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                  <div style={{ minWidth: 60, flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.league?.toUpperCase() || 'MLB'}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 10, color: 'var(--subtle)' }}>
                      {fmtDate(item.match_date)}
                    </p>
                  </div>

                  <div style={{ width: 1, height: 36, background: 'var(--line)', flexShrink: 0 }} />

                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.home_team} vs {item.away_team}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--subtle)' }}>
                      Guardado · ver análisis →
                    </p>
                  </div>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); toggle(item); }}
                  className={`watchlist-btn saved`}
                  title="Quitar de lista"
                  aria-label="Quitar de lista"
                  type="button"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                    bookmark
                  </span>
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
