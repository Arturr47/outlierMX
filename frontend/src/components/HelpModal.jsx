const SECTIONS = [
  {
    icon: 'attach_money',
    color: '#7EE39A',
    title: 'Moneyline',
    body: '-150 significa que arriesgas $150 para ganar $100. +130 significa que ganas $130 por cada $100 apostados. El equipo favorito tiene línea negativa; el underdog tiene línea positiva.',
  },
  {
    icon: 'swap_horiz',
    color: '#7EE39A',
    title: 'Línea / Spread',
    body: 'El favorito debe ganar por más puntos que el spread para cubrir. Si el spread es -1.5, el equipo debe ganar por 2 o más. El underdog puede ganar o perder por menos del spread.',
  },
  {
    icon: 'add_circle',
    color: '#7EE39A',
    title: 'Totales (O/U)',
    body: 'Apuesta sobre el total de puntos/carreras del partido. "Más 8.5" significa que el partido debe terminar con 9 o más carreras combinadas para ganar la apuesta al Over.',
  },
  {
    icon: 'trending_up',
    color: '#7EE39A',
    title: 'Valor Esperado (EV)',
    body: 'Una apuesta de +EV tiene valor positivo cuando las probabilidades implícitas del mercado son menores al riesgo real. Ejemplo: si crees que un equipo gana el 55% del tiempo pero el mercado da solo 45%, hay valor.',
  },
  {
    icon: 'bar_chart',
    color: '#8AB8FF',
    title: 'Apuestas Públicas',
    body: '% Tickets = cuántas apuestas van hacia cada lado. % Dinero = cuánto dinero está en cada lado. Cuando tickets y dinero apuntan diferente, puede haber movimiento de línea por jugadores afilados (sharps).',
  },
  {
    icon: 'verified',
    color: '#E6C76E',
    title: 'Confianza de datos',
    body: 'Alta: forma reciente, momios de 4+ casas y público disponibles. Media: datos suficientes pero conviene confirmar. Baja: muestra limitada, úsalo solo como punto de partida, no como decisión final.',
  },
  {
    icon: 'swap_horiz',
    color: '#B79CFF',
    title: 'Arbitraje',
    body: 'Cuando los momios de diferentes casas permiten apostar en todos los resultados posibles y garantizar ganancia independientemente del resultado. Requiere actuar rápido; las casas ajustan las líneas.',
  },
];

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--brand)' }}>school</span>
            <h2 id="help-title" style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>
              Glosario de Apuestas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label="Cerrar"
            style={{ border: 'none' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>

        <div className="modal-body">
          {SECTIONS.map(s => (
            <div key={s.title} className="help-section">
              <h3>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: s.color }}>
                  {s.icon}
                </span>
                {s.title}
              </h3>
              <p>{s.body}</p>
            </div>
          ))}

          <div style={{
            marginTop: 20,
            padding: '12px 14px',
            border: '1px solid var(--brand-border)',
            borderRadius: 10,
            background: 'var(--brand-soft)',
          }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>
              <strong style={{ color: 'var(--brand)' }}>Recuerda:</strong> la mejor señal aparece cuando el precio y los datos coinciden.
              Nunca apuestes solo por momentum o emoción.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
