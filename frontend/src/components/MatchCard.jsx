import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const TEAM_COLOR = {
  ATL: '#ce1141', MIA: '#00a3e0', NYY: '#1d2854', BOS: '#bd3039',
  LAD: '#003087', SF: '#fd5a1e', CHC: '#0e3386', STL: '#c41e3a',
  HOU: '#002d62', PHI: '#e81828', WSH: '#ab0003', TOR: '#134a8e',
  KC: '#004687', MIN: '#002b5c', MIL: '#12284b', PIT: '#fdb827',
  TEX: '#003278', COL: '#33006f', ATH: '#003831', LAA: '#ba0021',
  SD: '#2f241d', ARI: '#a71930', SEA: '#0c2c56', CWS: '#27251f',
  CIN: '#c6011f', CLE: '#00385d', BAL: '#df4601', TB: '#092c5c',
  DET: '#0c2340', NYM: '#002d72',
};

const fmtOdds = v => {
  const n = parseFloat(v);
  return (!n || Number.isNaN(n)) ? null : n >= 10 ? n.toFixed(1) : n.toFixed(2);
};

const fmtLine = v => {
  const n = Number(v);
  if (Number.isNaN(n)) return '-';
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}`;
};

const fmtRec = (w, l, t) => (!w && w !== 0) ? '' : t > 0 ? `${w}-${l}-${t}` : `${w}-${l}`;

function fmtTime(dateStr) {
  const d = new Date(dateStr);
  const isToday = new Date().toDateString() === d.toDateString();
  const time = d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
  const day = isToday ? 'Hoy' : d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  return `${day} · ${time}`;
}

function statusText(s) {
  if (s === 'live') return 'En vivo';
  if (s === 'finished') return 'Final';
  return 'Previa';
}

function getPublicSignal(match) {
  const pb = match.public_betting?.find(p => p.bet_type === 'moneyline');
  if (!pb) return null;
  const home = Number(pb.home_pct_bets || 0);
  const away = Number(pb.away_pct_bets || 0);
  return {
    side: home >= away ? match.home_short : match.away_short,
    pct: Math.max(home, away),
    homePct: home,
    awayPct: away,
    money: home >= away ? Number(pb.home_pct_money || 0) : Number(pb.away_pct_money || 0),
  };
}

function recentSummary(match) {
  const homeWins = (match.home_recent || []).filter(g => g.result === 'W').length;
  const awayWins = (match.away_recent || []).filter(g => g.result === 'W').length;
  const homeCount = match.home_recent?.length || 0;
  const awayCount = match.away_recent?.length || 0;
  if (!homeCount || !awayCount) return 'Forma reciente limitada. Revisa el detalle antes de decidir.';
  if (homeWins === awayWins) return `Forma pareja: ambos llegan con ${homeWins} victorias recientes.`;
  const leader = homeWins > awayWins ? match.home_short : match.away_short;
  const leadWins = Math.max(homeWins, awayWins);
  const otherWins = Math.min(homeWins, awayWins);
  return `${leader} llega mejor (${leadWins} vs ${otherWins} victorias recientes).`;
}

function confidenceFor(match) {
  const recentRows = Math.min(match.home_recent?.length || 0, match.away_recent?.length || 0);
  const oddsRows = match.odds?.length || 0;
  if (recentRows >= 7 && oddsRows >= 4 && match.public_betting?.length)
    return { label: 'Alta', tone: 'good', copy: 'Muestra reciente, momios y público disponibles.' };
  if (recentRows >= 5 && oddsRows >= 2)
    return { label: 'Media', tone: 'warn', copy: 'Datos suficientes, conviene confirmar mercado.' };
  return { label: 'Baja', tone: 'warn', copy: 'Muestra limitada; solo como punto de partida.' };
}

function updatedLabel(match) {
  const times = (match.odds || []).map(o => new Date(o.updated_at).getTime()).filter(Boolean);
  if (!times.length) return null;
  const d = new Date(Math.max(...times));
  return d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MatchCard({ match }) {
  const navigate = useNavigate();
  const { toggle, has } = useWatchlist();
  const [pbOpen, setPbOpen] = useState(false);
  const [barReady, setBarReady] = useState(false);

  useEffect(() => { const t = setTimeout(() => setBarReady(true), 60); return () => clearTimeout(t); }, []);

  const saved = has(match.id);

  const ml = match.odds?.filter(o => o.bet_type === 'moneyline') || [];
  const rl = match.odds?.filter(o => o.bet_type === 'spread') || [];
  const ou = match.odds?.filter(o => o.bet_type === 'over_under') || [];

  const bestH = ml.length ? ml.reduce((b, o) => +o.home_odds > +b.home_odds ? o : b, ml[0]) : null;
  const bestA = ml.length ? ml.reduce((b, o) => +o.away_odds > +b.away_odds ? o : b, ml[0]) : null;
  const spread = rl[0];
  const total = ou[0];
  const homeLine = spread ? Number(spread.spread_value) : null;
  const awayLine = homeLine == null || Number.isNaN(homeLine) ? null : -homeLine;

  const pbMl = match.public_betting?.find(p => p.bet_type === 'moneyline');
  const pbRl = match.public_betting?.find(p => p.bet_type === 'spread');
  const pbOu = match.public_betting?.find(p => p.bet_type === 'over_under');
  const publicSignal = getPublicSignal(match);
  const confidence = confidenceFor(match);
  const upd = updatedLabel(match);

  const handleSave = e => {
    e.stopPropagation();
    toggle({
      id: match.id,
      home_team: match.home_team,
      away_team: match.away_team,
      home_short: match.home_short,
      away_short: match.away_short,
      match_date: match.match_date,
      league: match.league || 'mlb',
    });
  };

  return (
    <article className="lit-card match-card-enter" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Topline */}
      <div className="match-card-topline">
        <div className="match-status-group">
          <span>{fmtTime(match.match_date)}</span>
          <span className={`status-chip${match.status === 'live' ? ' live' : ''}`}>
            {match.status === 'live' && (
              <span className="live-dot" style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--value)', marginRight: 5 }} />
            )}
            {statusText(match.status)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {upd && <span style={{ fontSize: '9.5px', color: 'var(--faint)', fontWeight: 600 }}>{upd}</span>}
          <button
            type="button"
            onClick={handleSave}
            className={`watchlist-btn${saved ? ' saved' : ''}`}
            title={saved ? 'Quitar de lista' : 'Guardar en lista'}
            aria-label={saved ? 'Quitar de lista' : 'Guardar en lista'}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 14, fontVariationSettings: saved ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 300" }}
            >
              bookmark
            </span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="match-card-body">
        <div className="match-teams-column">
          <TeamRow
            name={match.home_team}
            short={match.home_short}
            record={fmtRec(match.home_wins, match.home_losses, match.home_ties)}
            streak={match.home_streak}
            recent={match.home_recent}
            score={match.home_score}
            isLive={match.status === 'live'}
          />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
          <TeamRow
            name={match.away_team}
            short={match.away_short}
            record={fmtRec(match.away_wins, match.away_losses, match.away_ties)}
            streak={match.away_streak}
            recent={match.away_recent}
            score={match.away_score}
          />
        </div>

        <div className="match-odds-grid hide-scroll">
          <OddsColumn title="Moneyline" hint="Ganador directo">
            <OddsPill label={match.home_short} value={fmtOdds(bestH?.home_odds)} meta={bestH?.sportsbook} />
            <OddsPill label={match.away_short} value={fmtOdds(bestA?.away_odds)} meta={bestA?.sportsbook} />
          </OddsColumn>

          <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />

          <OddsColumn title="Línea" hint="Margen ajustado">
            {spread ? (
              <>
                <OddsPill label={`${match.home_short} ${fmtLine(homeLine)}`} value={fmtOdds(spread.home_odds)} />
                <OddsPill label={`${match.away_short} ${fmtLine(awayLine)}`} value={fmtOdds(spread.away_odds)} />
              </>
            ) : (
              <>
                <OddsPill label="Sin línea" value={null} />
                <OddsPill label="Sin línea" value={null} />
              </>
            )}
          </OddsColumn>

          <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />

          <OddsColumn title="Totales" hint="Carreras esperadas">
            {total ? (
              <>
                <OddsPill label={`Más ${total.total_value}`} value={fmtOdds(total.over_odds)} />
                <OddsPill label={`Menos ${total.total_value}`} value={fmtOdds(total.under_odds)} />
              </>
            ) : (
              <>
                <OddsPill label="Sin total" value={null} />
                <OddsPill label="Sin total" value={null} />
              </>
            )}
          </OddsColumn>
        </div>
      </div>

      {/* Public mini-bar (always visible when data exists) */}
      {publicSignal && (
        <div className="public-mini-bar-wrap">
          <div className="public-mini-row">
            <span className="public-mini-label">Público</span>
            <span style={{ fontSize: 10, color: 'var(--subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {match.home_short}
            </span>
            <div className="public-mini-track">
              <div
                className="public-mini-fill"
                style={{ width: barReady ? `${publicSignal.homePct}%` : '0%' }}
              />
            </div>
            <span style={{ fontSize: 10, color: 'var(--subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {match.away_short}
            </span>
            <span className="public-mini-pct">{publicSignal.pct}%</span>
            <span style={{ fontSize: 9, color: 'var(--subtle)' }}>tickets → {publicSignal.side}</span>
          </div>
        </div>
      )}

      {/* Context */}
      <div className="match-context">
        <div className="context-block">
          <p className="context-label">Por qué mirar</p>
          <p className="context-copy">{recentSummary(match)}</p>
        </div>
        <div className="context-block">
          <p className="context-label">Confianza</p>
          <p className="context-copy">
            <strong>{confidence.label}</strong> · {confidence.copy}
          </p>
        </div>
      </div>

      {/* Expandable public details */}
      {pbOpen && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.18)', padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <PbCol title="Moneyline" pb={pbMl} left={match.home_short} right={match.away_short} />
            <PbCol title="Línea" pb={pbRl} left={match.home_short} right={match.away_short} />
            <PbCol title="Totales" pb={pbOu} left="Más" right="Menos" />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="match-footer">
        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: pbOpen ? 'var(--muted)' : 'var(--subtle)',
            padding: 0, transition: 'color 120ms',
          }}
          onClick={() => setPbOpen(v => !v)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
            {pbOpen ? 'expand_less' : 'expand_more'}
          </span>
          Apuestas públicas
        </button>

        <button
          type="button"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.07em',
            textTransform: 'uppercase', color: 'var(--brand)', padding: 0,
          }}
          onClick={() => navigate(`/dashboard/match/${match.id}`)}
        >
          Ver análisis
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>chevron_right</span>
        </button>
      </div>
    </article>
  );
}

function OddsColumn({ title, hint, children }) {
  return (
    <div style={{ flex: '1 0 140px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--subtle)', textTransform: 'uppercase', margin: 0 }}>{title}</p>
        <p style={{ fontSize: 10, color: 'var(--faint)', margin: '2px 0 0' }}>{hint}</p>
      </div>
      {children}
    </div>
  );
}

function TeamRow({ name, short, record, streak, recent, score, isLive }) {
  const color = TEAM_COLOR[short] || '#6b7280';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) auto', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        background: color + '1a', border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, color }}>{short?.slice(0, 3)}</span>
        {isLive && (
          <span className="live-dot" style={{
            position: 'absolute', top: -3, right: -3, width: 7, height: 7,
            borderRadius: '50%', background: 'var(--brand)', border: '1.5px solid #080C0A',
          }} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </span>
          {streak && <StreakBadge streak={streak} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {record && <span style={{ fontSize: '10.5px', color: 'var(--subtle)', fontVariantNumeric: 'tabular-nums' }}>{record}</span>}
          <TrendDots games={recent} />
        </div>
      </div>
      {score !== null && score !== undefined && (
        <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
      )}
    </div>
  );
}

function StreakBadge({ streak }) {
  const win = streak.startsWith('W');
  const loss = streak.startsWith('L');
  return (
    <span className={`trust-pill ${win ? 'good' : loss ? 'warn' : ''}`} style={{ minHeight: 18, padding: '1px 6px', fontSize: 8.5 }}>
      {streak}
    </span>
  );
}

function OddsPill({ label, value, meta }) {
  return (
    <div className="odds-pill" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {meta && <span style={{ display: 'block', marginTop: 1, fontSize: 9, color: 'var(--subtle)' }}>{meta}</span>}
      </div>
      <span style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: value ? 'var(--text)' : 'rgba(255,255,255,0.14)', flexShrink: 0 }}>
        {value ?? '-'}
      </span>
    </div>
  );
}

function TrendDots({ games }) {
  const r = (games || []).slice(0, 7).reverse();
  if (!r.length) return null;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {r.map((g, i) => (
        <div key={i} title={g.result} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: g.result === 'W' ? 'var(--brand)' : g.result === 'L' ? 'var(--danger)' : 'rgba(255,255,255,0.16)',
        }} />
      ))}
    </div>
  );
}

function PbCol({ title, pb, left, right }) {
  if (!pb) return (
    <div>
      <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 12 }}>{title}</p>
      <p style={{ fontSize: 11, color: 'var(--subtle)' }}>Sin datos</p>
    </div>
  );
  const lB = parseFloat(pb.home_pct_bets) || 0;
  const rB = parseFloat(pb.away_pct_bets) || 0;
  const lM = parseFloat(pb.home_pct_money) || 0;
  const rM = parseFloat(pb.away_pct_money) || 0;
  return (
    <div>
      <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 14 }}>{title}</p>
      <PbBar lPct={lB} rPct={rB} lLabel={left} rLabel={right} barLabel="% Tickets" color="var(--brand)" />
      <div style={{ marginBottom: 12 }} />
      <PbBar lPct={lM} rPct={rM} lLabel={left} rLabel={right} barLabel="% Dinero" color="var(--public)" />
    </div>
  );
}

function PbBar({ lPct, rPct, lLabel, rLabel, barLabel, color }) {
  const lW = lPct >= rPct;
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 30); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: '12.5px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: lW ? color : 'var(--subtle)' }}>{lPct}%</span>
        <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--subtle)' }}>{barLabel}</span>
        <span style={{ fontSize: '12.5px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: !lW ? color : 'var(--subtle)' }}>{rPct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.09)', display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: `${ready ? lPct : 0}%`, background: lW ? color : 'rgba(255,255,255,0.14)', flexShrink: 0, transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ width: `${ready ? rPct : 0}%`, background: !lW ? color : 'rgba(255,255,255,0.14)', flexShrink: 0, transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 9, color: 'var(--subtle)' }}>{lLabel}</span>
        <span style={{ fontSize: 9, color: 'var(--subtle)' }}>{rLabel}</span>
      </div>
    </div>
  );
}
