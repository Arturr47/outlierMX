import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function MyPicks() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPicks();
  }, []);

  const fetchPicks = async () => {
    try {
      const res = await api.get('/picks');
      setPicks(res.data.picks);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePick = async (id) => {
    try {
      await api.delete(`/picks/${id}`);
      setPicks(picks.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error eliminando pick:', err);
    }
  };

  if (loading) {
    return (
      <div className="app-loader">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="picks-shell">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Seguimiento</p>
          <h1 className="page-title">Mis Picks</h1>
          <p className="page-copy">
            Guarda selecciones, revisa momios y mantén tu shortlist listo para decidir con calma.
          </p>
        </div>

        <div className="metric-strip" aria-label="Resumen de picks">
          <div className="mini-metric">
            <span>Guardados</span>
            <strong>{picks.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Estado</span>
            <strong>{picks.length ? 'Activo' : 'Vacío'}</strong>
          </div>
          <div className="mini-metric">
            <span>Modo</span>
            <strong>Lista</strong>
          </div>
        </div>
      </section>

      {picks.length === 0 ? (
        <div className="empty-state">
          <Bookmark className="w-8 h-8 text-emerald-400 mb-3" />
          <strong>No tienes picks guardados</strong>
          <p>
            Entra a un partido y guarda picks desde los momios o props
          </p>
        </div>
      ) : (
        <div className="picks-list">
          {picks.map((pick) => {
            const matchDate = new Date(pick.match_date);
            return (
              <div
                key={pick.id}
                className="pick-card"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-emerald-400 font-medium">{pick.league_name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {matchDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="h-10 w-px bg-[#1e293b]" />

                  <div>
                    <p className="text-sm text-white font-medium">
                      {pick.home_team} vs {pick.away_team}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 capitalize">
                        {pick.pick_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-emerald-400 font-medium">{pick.pick_value}</span>
                      {pick.odds && (
                        <span className="text-xs text-white font-mono">
                          {pick.odds > 0 ? '+' : ''}{pick.odds}
                        </span>
                      )}
                      {pick.sportsbook && (
                        <span className="text-xs text-slate-500">{pick.sportsbook}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deletePick(pick.id)}
                  className="icon-button"
                  title="Eliminar pick"
                  aria-label="Eliminar pick"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
