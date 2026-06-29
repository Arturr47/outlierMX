const CATEGORIES = [
  { icon: 'sports_baseball', label: 'Home Runs', color: '#7EE39A', stat: 'HR', desc: 'Rendimiento histórico de jonrones vs pitcher y mano.' },
  { icon: 'sports_baseball', label: 'Hits', color: '#8AB8FF', stat: 'H', desc: 'AVG reciente, splits vs RHP/LHP y factor de estadio.' },
  { icon: 'speed', label: 'Strikeouts (pitcher)', color: '#B79CFF', stat: 'K', desc: 'K/9, swinging strike rate y matchup vs equipo.' },
  { icon: 'sports_baseball', label: 'RBI', color: '#E6C76E', stat: 'RBI', desc: 'Producción con corredores en base y tendencia reciente.' },
  { icon: 'trending_up', label: 'Carreras anotadas', color: '#EF8F8F', stat: 'R', desc: 'OBP y posición en la alineación como indicadores clave.' },
  { icon: 'add_circle', label: 'Bases totales', color: '#7EE39A', stat: 'TB', desc: 'SLG reciente y capacidad de extrabases en el parque.' },
];

const SIGNALS = [
  { label: 'AVG reciente', desc: 'Últimos 7-14 juegos vs temporada completa.' },
  { label: 'Splits vs mano', desc: 'Rendimiento vs lanzador derecho o zurdo.' },
  { label: 'vs Pitcher', desc: 'Historial cabeza a cabeza cuando existe.' },
  { label: 'Factor estadio', desc: 'Park factor para jonrones y hits.' },
  { label: 'Precio de mercado', desc: 'Overround de la casa vs tu estimado.' },
];

export default function Props() {
  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Mercados individuales</p>
          <h1 className="page-title">Props de Jugadores</h1>
          <p className="page-copy">
            Analiza props con datos de splits, historial cabeza a cabeza y tendencias recientes.
            Los props tienen mayor margen que moneyline — la información es tu ventaja.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Categorías</span>
            <strong>{CATEGORIES.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Señales clave</span>
            <strong>{SIGNALS.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Fuente</span>
            <strong style={{ fontSize: 11 }}>Batter Stats</strong>
          </div>
        </div>
      </section>

      {/* Info banner */}
      <div style={{
        padding: '12px 16px', marginBottom: 24,
        border: '1px solid var(--warning-border)',
        borderRadius: 'var(--radius)',
        background: 'var(--warning-soft)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--warning)', flexShrink: 0, marginTop: 1 }}>lightbulb</span>
        <div>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text)', fontWeight: 700 }}>Datos disponibles en Detalle de Partido</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Los batter stats con splits vs RHP/LHP y vs pitcher específico ya están disponibles en cada partido.
            Ábrelo y busca la sección "Batter Stats" con las tabs de temporada, splits y enfrentamiento.
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="section-head">
        <div>
          <h2>Categorías de props</h2>
          <p>Mercados individuales disponibles en MLB.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.label} className="edu-card" style={{ cursor: 'default' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: cat.color + '18', border: `1px solid ${cat.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: cat.color }}>{cat.stat}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{cat.label}</p>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.45 }}>{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Signals */}
      <div className="section-head">
        <div>
          <h2>Señales clave para props</h2>
          <p>Qué mirar antes de apostar en un prop de jugador.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SIGNALS.map((s, i) => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px',
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.022)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'var(--brand-soft)', border: '1px solid var(--brand-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 12, fontWeight: 800, color: 'var(--brand)',
            }}>
              {i + 1}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{s.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
