const EDU = [
  {
    icon: 'rocket_launch',
    title: '¿Qué es un boost?',
    body: 'Un boost es cuando la casa mejora temporalmente los momios de una apuesta para atraer acción. Ejemplo: +150 en lugar de +120.',
  },
  {
    icon: 'warning',
    title: '¿Por qué tener cuidado?',
    body: 'Las casas agregan restricciones: límites de apuesta bajos, mercados con bajo overround o requisitos de rollover. Un boost con límite de $25 rara vez vale el tiempo.',
  },
  {
    icon: 'calculate',
    title: 'Cómo evaluar uno',
    body: 'Calcula la probabilidad implícita del boost vs el mercado base. Si la diferencia supera el margen de la casa (vigorish), el boost tiene valor real.',
  },
];

const FRAMEWORK = [
  { ok: true,  text: '¿El boost sube más de 15-20 puntos el precio?', hint: 'Menos de 15 puntos rara vez compensa el esfuerzo.' },
  { ok: true,  text: '¿El límite de apuesta es razonable ($50+)?', hint: 'Límites bajos eliminan el valor esperado total.' },
  { ok: true,  text: '¿La selección boosteada tiene valor base?', hint: 'Un mal pick con boost sigue siendo un mal pick.' },
  { ok: false, text: '¿Requiere apostar en múltiples partidos (parlay)?', hint: 'Los boosts de parlay multiplican el riesgo considerablemente.' },
  { ok: false, text: '¿Solo disponible en tu peor mercado?', hint: 'Las casas hacen boosts en mercados donde ya tienen ventaja.' },
];

export default function Boosts() {
  return (
    <div className="page-shell page-in">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Promociones del mercado</p>
          <h1 className="page-title">Boosts</h1>
          <p className="page-copy">
            No todos los boosts tienen valor real. Aprende a evaluarlos antes de actuar.
            Una apuesta boosteada sigue siendo una apuesta — el precio mejora, el riesgo no desaparece.
          </p>
        </div>
        <div className="metric-strip">
          <div className="mini-metric">
            <span>Criterios</span>
            <strong>{FRAMEWORK.length}</strong>
          </div>
          <div className="mini-metric">
            <span>Señales positivas</span>
            <strong style={{ color: 'var(--value)' }}>{FRAMEWORK.filter(f => f.ok).length}</strong>
          </div>
          <div className="mini-metric">
            <span>Señales negativas</span>
            <strong style={{ color: 'var(--risk)' }}>{FRAMEWORK.filter(f => !f.ok).length}</strong>
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

      {/* Framework */}
      <div className="section-head">
        <div>
          <h2>Framework de evaluación</h2>
          <p>Usa estas preguntas antes de aceptar cualquier boost.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {FRAMEWORK.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '13px 16px',
            border: `1px solid ${f.ok ? 'var(--value-border)' : 'var(--risk-border)'}`,
            borderRadius: 10,
            background: f.ok ? 'var(--value-soft)' : 'var(--risk-soft)',
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 18, flexShrink: 0, marginTop: 1,
              color: f.ok ? 'var(--value)' : 'var(--risk)',
            }}>
              {f.ok ? 'check_circle' : 'cancel'}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{f.text}</p>
              <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>{f.hint}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No boosts empty state */}
      <div className="empty-state" style={{ minHeight: 180 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 28 }}>rocket_launch</span>
        <strong>Sin boosts activos</strong>
        <p>
          Cuando la app detecte boosts disponibles en las casas conectadas,
          aparecerán aquí con su análisis de valor.
        </p>
      </div>
    </div>
  );
}
