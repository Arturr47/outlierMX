import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../lib/api';
import { SportsbookBadge } from '../components/SportsbookIcon';

/* ── Color map ───────────────────────────────────────── */
const TEAM_COLOR = {
  ATL:'#ce1141',MIA:'#00a3e0',NYY:'#1d2854',BOS:'#bd3039',LAD:'#003087',
  SF:'#fd5a1e',CHC:'#0e3386',STL:'#c41e3a',HOU:'#002d62',PHI:'#e81828',
  WSH:'#ab0003',TOR:'#134a8e',KC:'#004687',MIN:'#002b5c',MIL:'#12284b',
  PIT:'#fdb827',TEX:'#003278',COL:'#33006f',ATH:'#003831',LAA:'#ba0021',
  SD:'#2f241d',ARI:'#a71930',SEA:'#0c2c56',CWS:'#27251f',CIN:'#c6011f',
  CLE:'#00385d',BAL:'#df4601',TB:'#092c5c',DET:'#0c2340',NYM:'#002d72',
};

function TeamBadge({ short, size = 28, radius = 8 }) {
  const c = TEAM_COLOR[short] || '#444';
  return (
    <div style={{
      width: size, height: size, borderRadius: radius === 'full' ? '50%' : radius,
      background: c + '22', border: `1.5px solid ${c}44`, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 800, color: c, letterSpacing: '-0.02em' }}>{short?.slice(0,3)}</span>
    </div>
  );
}

function marketUpdatedAt(odds) {
  const times = (odds || [])
    .map(o => new Date(o.updated_at).getTime())
    .filter(Boolean);
  if (!times.length) return 'Sin actualización';
  const d = new Date(Math.max(...times));
  return d.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function publicRead(publicBetting, match) {
  const ml = publicBetting?.find(p => p.bet_type === 'moneyline');
  if (!ml) return { title: 'Sin señal pública', copy: 'Todavía no hay suficiente lectura de tickets y dinero.' };
  const home = Number(ml.home_pct_bets || 0);
  const away = Number(ml.away_pct_bets || 0);
  const side = home >= away ? match.home_short : match.away_short;
  const tickets = Math.max(home, away);
  const money = home >= away ? Number(ml.home_pct_money || 0) : Number(ml.away_pct_money || 0);
  return {
    title: `${tickets}% mira a ${side}`,
    copy: `Dinero en ${money}%. Úsalo como contexto, no como garantía.`,
  };
}

function confidenceRead({ odds, homeRecent, awayRecent, publicBetting }) {
  const recentRows = Math.min(homeRecent?.length || 0, awayRecent?.length || 0);
  const oddsRows = odds?.length || 0;
  const hasPublic = publicBetting?.length > 0;
  if (recentRows >= 7 && oddsRows >= 4 && hasPublic) {
    return { label: 'Alta', copy: 'Momios, público y muestra reciente disponibles.' };
  }
  if (recentRows >= 5 && oddsRows >= 2) {
    return { label: 'Media', copy: 'Hay base para comparar, pero confirma mercado.' };
  }
  return { label: 'Baja', copy: 'Datos limitados; evita decidir solo con esta pantalla.' };
}

function formRead(match, homeWinPct, awayWinPct) {
  if (homeWinPct === awayWinPct) {
    return {
      title: 'Forma pareja',
      copy: `${match.home_short} y ${match.away_short} llegan con una muestra reciente similar.`,
    };
  }
  const leader = homeWinPct > awayWinPct ? match.home_short : match.away_short;
  const diff = Math.abs(homeWinPct - awayWinPct);
  return {
    title: `${leader} llega mejor`,
    copy: `${diff} pts de diferencia en forma reciente. Vale la pena comparar calendario y pitcher.`,
  };
}

/* ── Main ────────────────────────────────────────────── */
export default function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsTab, setStatsTab] = useState('L10');
  const [rightTab, setRightTab] = useState('matchup');
  const [gamesFilter, setGamesFilter] = useState('all');
  const [selectedPick, setSelectedPick] = useState(null);   // { label, odds }
  const [, setPickSaved]       = useState(null);

  useEffect(() => {
    api.get(`/matches/${id}`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const savePick = async (pickType, pickValue, odds, sportsbook) => {
    try {
      await api.post('/picks', { matchId: parseInt(id), pickType, pickValue, odds, sportsbook });
      setPickSaved(`${pickType}-${pickValue}`);
      setTimeout(() => setPickSaved(null), 2000);
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ paddingTop: '56px', minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={20} style={{ color: '#6bfb9a', animation: 'spin 1s linear infinite' }} />
    </div>
  );
  if (!data) return (
    <div style={{ paddingTop: '56px', minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'rgba(188,202,187,0.4)', fontSize: '14px' }}>Match not found</span>
    </div>
  );

  const { match, odds, h2h, injuries, props: playerProps, public_betting, home_recent, away_recent, probable_pitchers, team_batters, batter_vs_pitcher } = data;
  const hasPitchers = Array.isArray(probable_pitchers) && probable_pitchers.length > 0;
  const matchDate = new Date(match.match_date);

  const moneyline   = odds.filter(o => o.bet_type === 'moneyline');
  const bestHomeMl  = moneyline[0] || null;
  const bestAwayMl  = moneyline[0] || null;

  const homeRecord = `${match.home_wins}-${match.home_losses}${match.home_ties > 0 ? `-${match.home_ties}` : ''}`;
  const awayRecord = `${match.away_wins}-${match.away_losses}${match.away_ties > 0 ? `-${match.away_ties}` : ''}`;

  const statsTabs = ['L5', 'L10', 'L20', 'H2H', '2026', '2025'];
  const numGames = statsTab === 'L5' ? 5 : statsTab === 'L20' ? 20 : 10;

  const homeWinPct = home_recent?.length ? Math.round(home_recent.filter(g => g.result === 'W').length / home_recent.length * 100) : 0;
  const awayWinPct = away_recent?.length ? Math.round(away_recent.filter(g => g.result === 'W').length / away_recent.length * 100) : 0;

  const dateLabel = (() => {
    const isToday = new Date().toDateString() === matchDate.toDateString();
    const time = matchDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${isToday ? 'Today' : matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${time}`;
  })();

  const publicInsight = publicRead(public_betting, match);
  const confidence = confidenceRead({ odds, homeRecent: home_recent, awayRecent: away_recent, publicBetting: public_betting });
  const formInsight = formRead(match, homeWinPct, awayWinPct);
  const favoriteSide = bestHomeMl && bestAwayMl
    ? (Number(bestHomeMl.home_odds) <= Number(bestAwayMl.away_odds) ? match.home_short : match.away_short)
    : null;

  return (
    <div className="match-detail-page">

      {/* ── Header ────────────────────────────────────── */}
      <div className="match-detail-header">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="back-link">
          <span className="material-symbols-outlined" style={{ fontSize:'15px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>arrow_back</span>
          Volver a Partidos
        </button>

        <div className="match-hero-row">
          <div className="match-title-wrap">
            <div className="match-badge-stack">
              <TeamBadge short={match.home_short} size={48} radius="full" />
              <TeamBadge short={match.away_short} size={48} radius="full" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="match-kicker">
                <span>{match.home_short} @ {match.away_short}</span>
                <span>{dateLabel}</span>
                {match.venue && <span>{match.venue}</span>}
              </div>
              <h1 className="match-title">{match.home_team} vs {match.away_team}</h1>
              <p className="match-subtitle">
                Vista de decisión: entiende forma reciente, mercado y datos de confianza antes de guardar un pick.
              </p>
            </div>
          </div>

          <div className="quick-market" aria-label="Mercado rápido">
            {bestHomeMl && (
              <button
                type="button"
                className={`quick-market-card${selectedPick?.label === match.home_short ? ' selected' : ''}`}
                onClick={() => setSelectedPick(p => p?.label === match.home_short ? null : { label: match.home_short, odds: parseFloat(bestHomeMl.home_odds).toFixed(2) })}
              >
                <span>{match.home_short} moneyline</span>
                <strong>{parseFloat(bestHomeMl.home_odds).toFixed(2)}</strong>
              </button>
            )}
            {bestAwayMl && (
              <button
                type="button"
                className={`quick-market-card${selectedPick?.label === match.away_short ? ' selected' : ''}`}
                onClick={() => setSelectedPick(p => p?.label === match.away_short ? null : { label: match.away_short, odds: parseFloat(bestAwayMl.away_odds).toFixed(2) })}
              >
                <span>{match.away_short} moneyline</span>
                <strong>{parseFloat(bestAwayMl.away_odds).toFixed(2)}</strong>
              </button>
            )}
          </div>
        </div>

        {selectedPick && (
          <div className="saved-pick-bar" style={{ marginBottom: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>bookmark_add</span>
            <span>{selectedPick.label} ML · {selectedPick.odds}</span>
            <button
              type="button"
              onClick={() => {
                savePick('moneyline', `${selectedPick.label} ML`, selectedPick.odds, bestHomeMl?.sportsbook);
                setSelectedPick(null);
              }}
              style={{ marginLeft: 8, background: 'var(--brand)', color: '#0d140f', border: 0, borderRadius: 6, padding: '5px 9px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
            >
              Guardar pick
            </button>
            <button type="button" onClick={() => setSelectedPick(null)} style={{ background: 'transparent', border: 0, color: 'var(--subtle)', cursor: 'pointer', padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>close</span>
            </button>
          </div>
        )}

        <div className="match-insight-row">
          <div className="match-insight-card primary">
            <p className="match-insight-label">Lectura principal</p>
            <p className="match-insight-value">{formInsight.title}</p>
            <p className="match-insight-copy">{formInsight.copy}</p>
          </div>
          <div className="match-insight-card">
            <p className="match-insight-label">Mercado</p>
            <p className="match-insight-value">{favoriteSide ? `${favoriteSide} favorito` : 'Sin favorito claro'}</p>
            <p className="match-insight-copy">Compara este precio contra forma, pitcher y apuestas públicas.</p>
          </div>
          <div className="match-insight-card">
            <p className="match-insight-label">Público</p>
            <p className="match-insight-value">{publicInsight.title}</p>
            <p className="match-insight-copy">{publicInsight.copy}</p>
          </div>
          <div className="match-insight-card">
            <p className="match-insight-label">Confianza</p>
            <p className="match-insight-value">{confidence.label}</p>
            <p className="match-insight-copy">{confidence.copy} Última actualización {marketUpdatedAt(odds)}.</p>
          </div>
        </div>

        {/* Match row */}
        <div style={{ display:'none' }}>
          {/* Overlapping team badges */}
          <div style={{ display:'flex', position:'relative', width:'68px', height:'44px', flexShrink:0 }}>
            <TeamBadge short={match.home_short} size={44} radius="full" />
            <div style={{ position:'absolute', left:'24px' }}>
              <TeamBadge short={match.away_short} size={44} radius="full" />
            </div>
          </div>

          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px', color:'rgba(188,202,187,0.45)', marginBottom:'4px' }}>
              <span style={{ fontWeight:600 }}>{match.home_short} @ {match.away_short}</span>
              <span>·</span>
              <span>{dateLabel}</span>
              {match.venue && <><span>·</span><span>{match.venue}</span></>}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'20px', fontWeight:800, color:'#f0f0f0', letterSpacing:'-0.03em' }}>Dinero</span>
              <span style={{ fontSize:'20px', fontWeight:800, color:'#6bfb9a', letterSpacing:'-0.03em' }}>
                {bestHomeMl ? match.home_short : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick odds + betslip row */}
        <div style={{ display:'none' }}>
          {/* Odds pills */}
          {bestHomeMl && (
            <button onClick={() => setSelectedPick(p => p?.label === match.home_short ? null : { label: match.home_short, odds: parseFloat(bestHomeMl.home_odds).toFixed(2) })}
              style={{
                display:'flex', alignItems:'center', gap:'7px', padding:'7px 12px', borderRadius:'8px', cursor:'pointer', border:'none', transition:'all 120ms',
                background: selectedPick?.label === match.home_short ? 'rgba(107,251,154,0.12)' : 'rgba(255,255,255,0.05)',
                outline: selectedPick?.label === match.home_short ? '1px solid rgba(107,251,154,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize:'13px', color:'rgba(255,255,255,0.25)', fontVariationSettings:"'FILL' 0,'wght' 300" }}>bar_chart</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0' }}>{match.home_short}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', fontVariantNumeric:'tabular-nums' }}>{parseFloat(bestHomeMl.home_odds).toFixed(2)}</span>
            </button>
          )}
          {bestAwayMl && (
            <button onClick={() => setSelectedPick(p => p?.label === match.away_short ? null : { label: match.away_short, odds: parseFloat(bestAwayMl.away_odds).toFixed(2) })}
              style={{
                display:'flex', alignItems:'center', gap:'7px', padding:'7px 12px', borderRadius:'8px', cursor:'pointer', border:'none', transition:'all 120ms',
                background: selectedPick?.label === match.away_short ? 'rgba(107,251,154,0.12)' : 'rgba(255,255,255,0.05)',
                outline: selectedPick?.label === match.away_short ? '1px solid rgba(107,251,154,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize:'13px', color:'rgba(255,255,255,0.25)', fontVariationSettings:"'FILL' 0,'wght' 300" }}>bar_chart</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0' }}>{match.away_short}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', fontVariantNumeric:'tabular-nums' }}>{parseFloat(bestAwayMl.away_odds).toFixed(2)}</span>
            </button>
          )}

          {/* Selected pick betslip pill */}
          {selectedPick && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', borderRadius:'8px', background:'rgba(107,251,154,0.08)', outline:'1px solid rgba(107,251,154,0.2)', marginLeft:'4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'13px', color:'rgba(107,251,154,0.5)', fontVariationSettings:"'FILL' 0,'wght' 300" }}>add_circle</span>
              <span style={{ fontSize:'13px', fontWeight:600, color:'#f0f0f0' }}>{selectedPick.label}</span>
              <span style={{ fontSize:'13px', fontWeight:700, color:'#6bfb9a', fontVariantNumeric:'tabular-nums' }}>{selectedPick.odds}</span>
              <button onClick={() => setSelectedPick(null)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'14px', color:'rgba(188,202,187,0.4)', fontVariationSettings:"'FILL' 0,'wght' 300" }}>close</span>
              </button>
            </div>
          )}

          {/* Save to picks button */}
          {selectedPick && (
            <button
              onClick={() => { savePick('moneyline', `${selectedPick.label} ML`, selectedPick.odds, bestHomeMl?.sportsbook); setSelectedPick(null); }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', borderRadius:'8px', background:'#6bfb9a', border:'none', cursor:'pointer', fontSize:'12.5px', fontWeight:700, color:'#0a1a0e' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'14px', fontVariationSettings:"'FILL' 1,'wght' 600" }}>bookmark_add</span>
              Guardar Pick
            </button>
          )}
        </div>

        {/* Stats tabs */}
        <div className="detail-tabs hide-scroll">
          <button className="detail-tab" type="button" title="Contexto local/visitante">
            <span className="material-symbols-outlined" style={{ fontSize:'15px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>location_on</span>
          </button>
          {statsTabs.map(tab => {
            const active = statsTab === tab;
            return (
              <button key={tab} type="button" onClick={() => setStatsTab(tab)} className={`detail-tab${active ? ' active' : ''}`}>
                {tab}
              </button>
            );
          })}
          <button className="detail-tab" type="button" style={{ marginLeft:'auto' }} title="Filtros">
            <span className="material-symbols-outlined" style={{ fontSize:'14px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>tune</span>
          </button>
        </div>
      </div>

      {/* ── Two columns ───────────────────────────────── */}
      <div className="match-detail-grid">

        {/* Left */}
        <div className="match-detail-main">

          {/* Stats header */}
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
            <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'var(--brand)', fontVariationSettings:"'FILL' 0,'wght' 300" }}>percent</span>
            <h2 style={{ fontSize:'15px', fontWeight:800, color:'var(--text)', margin:0 }}>Estadísticas</h2>
          </div>

          {/* Win/Loss card */}
          <div className="lit-card" style={{ padding:'18px', marginBottom:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:'16px', alignItems:'center', marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <TeamBadge short={match.home_short} size={30} radius="full" />
                <div>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#f0f0f0' }}>{match.home_team}</span>
                  <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.2)', marginLeft:'5px' }}>{homeRecord}</span>
                </div>
              </div>
              <span style={{ fontSize:'11px', color:'rgba(188,202,187,0.25)', whiteSpace:'nowrap' }}>{numGames} partidos</span>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', justifyContent:'flex-end' }}>
                <div style={{ textAlign:'right' }}>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'#f0f0f0' }}>{match.away_team}</span>
                  <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.2)', marginLeft:'5px' }}>{awayRecord}</span>
                </div>
                <TeamBadge short={match.away_short} size={30} radius="full" />
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
              {[
                { pct: homeWinPct, recent: home_recent },
                { pct: awayWinPct, recent: away_recent },
              ].map(({ pct, recent }, idx) => (
                <div key={idx}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', marginBottom:'5px' }}>
                    <span style={{ color:'#6bfb9a', fontWeight:600 }}>Gana {pct}%</span>
                    <span style={{ color:'#f87171', fontWeight:600 }}>Pierde {100-pct}%</span>
                  </div>
                  <div style={{ height:'5px', borderRadius:'99px', background:'rgba(255,255,255,0.06)', overflow:'hidden', display:'flex' }}>
                    <div style={{ width:`${pct}%`, background:'#6bfb9a' }} />
                    <div style={{ width:`${100-pct}%`, background:'#f87171' }} />
                  </div>
                  <div style={{ display:'flex', gap:'3px', marginTop:'7px' }}>
                    {(recent||[]).slice(0,numGames).reverse().map((g,i) => (
                      <div key={i} style={{ flex:1, height:'4px', borderRadius:'2px', background: g.result==='W'?'#6bfb9a':g.result==='L'?'#f87171':'#facc15' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games section */}
          {statsTab === 'H2H'
            ? <H2HSection h2h={h2h} match={match} />
            : <RecentGamesSection homeGames={home_recent} awayGames={away_recent} match={match} numGames={numGames} gamesFilter={gamesFilter} setGamesFilter={setGamesFilter} />
          }

          {/* Public Betting */}
          {public_betting?.length > 0 && (
            <div style={{ marginTop:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'#6bfb9a', fontVariationSettings:"'FILL' 0,'wght' 300" }}>bar_chart</span>
                <h3 style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', margin:0 }}>Apuestas Públicas</h3>
              </div>
              <div className="lit-card" style={{ padding:'18px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {public_betting.map((pb,i) => {
                    const lB = parseFloat(pb.home_pct_bets)||0, rB = parseFloat(pb.away_pct_bets)||0;
                    const lM = parseFloat(pb.home_pct_money)||0, rM = parseFloat(pb.away_pct_money)||0;
                    const label = pb.bet_type==='moneyline'?'Dinero':pb.bet_type==='spread'?'Línea':'Totales';
                    const lL = pb.bet_type==='over_under'?'Over':match.home_short;
                    const rL = pb.bet_type==='over_under'?'Under':match.away_short;
                    return (
                      <div key={i}>
                        <p style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(188,202,187,0.35)', marginBottom:'10px' }}>{label}</p>
                        <AnimBar lPct={lB} rPct={rB} lLabel={lL} rLabel={rL} barLabel="% Apuestas" color="#00ff66" />
                        <div style={{ marginBottom:'10px' }} />
                        <AnimBar lPct={lM} rPct={rM} lLabel={lL} rLabel={rL} barLabel="% Dinero"   color="#60a5fa" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Player Props */}
          {playerProps?.length > 0 && (
            <div style={{ marginTop:'24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'#facc15', fontVariationSettings:"'FILL' 1,'wght' 500" }}>bolt</span>
                <h3 style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', margin:0 }}>Props de Jugadores</h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                {playerProps.map((prop,i) => (
                  <div key={i} className="lit-card" style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <span style={{ fontSize:'9px', fontWeight:700, color:'rgba(188,202,187,0.4)', background:'rgba(255,255,255,0.05)', padding:'2px 6px', borderRadius:'4px' }}>{prop.team_short}</span>
                        <span style={{ fontSize:'13px', color:'#f0f0f0', fontWeight:500 }}>{prop.player_name}</span>
                        <span style={{ fontSize:'11px', color:'rgba(188,202,187,0.4)', textTransform:'capitalize' }}>{prop.prop_type?.replace('_',' ')} {prop.line_value}</span>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        {prop.hit_rate && (
                          <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 6px', borderRadius:'4px', color: parseFloat(prop.hit_rate)>=60?'#6bfb9a':parseFloat(prop.hit_rate)>=50?'#facc15':'#f87171', background: parseFloat(prop.hit_rate)>=60?'rgba(107,251,154,0.1)':parseFloat(prop.hit_rate)>=50?'rgba(250,204,21,0.1)':'rgba(248,113,113,0.1)' }}>{prop.hit_rate}%</span>
                        )}
                        <span style={{ fontSize:'12px', color:'#6bfb9a', fontWeight:700, fontVariantNumeric:'tabular-nums' }}>O {parseFloat(prop.over_odds).toFixed(2)}</span>
                        <span style={{ color:'rgba(255,255,255,0.1)' }}>|</span>
                        <span style={{ fontSize:'12px', color:'#f87171', fontWeight:700, fontVariantNumeric:'tabular-nums' }}>U {parseFloat(prop.under_odds).toFixed(2)}</span>
                        <button onClick={() => savePick('prop',`${prop.player_name} O${prop.line_value}`,prop.over_odds,prop.sportsbook)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(188,202,187,0.3)', padding:0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize:'15px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>add_circle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ──────────────────────────────── */}
        <div className="match-detail-side">

          {/* Odds Timeline */}
          <div style={{ marginBottom:'24px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:700, color:'#f0f0f0', margin:'0 0 14px' }}>Historial de Momios</h3>
            <div className="lit-card" style={{ overflow:'hidden' }}>
              {/* Header row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'8px', padding:'8px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(188,202,187,0.3)' }}>Actualizado</span>
                <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(188,202,187,0.3)', minWidth:'80px', textAlign:'right' }}>Momios</span>
                <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(188,202,187,0.3)', minWidth:'50px', textAlign:'right' }}></span>
              </div>
              {moneyline.map((odd, i) => {
                const hoOdds = parseFloat(odd.home_odds);
                const awOdds = parseFloat(odd.away_odds);
                return (
                  <div key={i} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ padding:'4px 14px 2px', background:'rgba(0,0,0,0.15)' }}>
                      <span style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(188,202,187,0.3)' }}>{odd.sportsbook}</span>
                    </div>
                    {[
                      { label: match.home_short, val: hoOdds },
                      { label: match.away_short, val: awOdds },
                    ].map((row, j) => (
                      <div key={j} style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:'8px', padding:'9px 14px', borderTop:'1px solid rgba(255,255,255,0.03)', alignItems:'center' }}>
                        <span style={{ fontSize:'12px', color:'#bccabb' }}>
                          {matchDate.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true})}
                          {' '}
                          <span style={{ color:'rgba(188,202,187,0.4)' }}>
                            {new Date().toDateString()===matchDate.toDateString()?'Today':matchDate.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                          </span>
                        </span>
                        <div style={{ minWidth:'80px', textAlign:'right' }}>
                          <span style={{ fontSize:'13px', fontWeight:700, fontVariantNumeric:'tabular-nums', color:'#f0f0f0' }}>{row.val.toFixed(2)}</span>
                          <span style={{ fontSize:'10px', color:'rgba(188,202,187,0.4)', marginLeft:'5px' }}>{row.label}</span>
                        </div>
                        <div style={{ minWidth:'50px', textAlign:'right' }}>
                          <span style={{ fontSize:'11px', fontWeight:600, color:'rgba(188,202,187,0.3)', fontVariantNumeric:'tabular-nums' }}>Apertura</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
              <button style={{ width:'100%', padding:'10px', background:'none', border:'none', borderTop:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', fontSize:'11px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(188,202,187,0.35)' }}
                onMouseEnter={e=>e.currentTarget.style.color='#bccabb'} onMouseLeave={e=>e.currentTarget.style.color='rgba(188,202,187,0.35)'}>
                Ver más
              </button>
            </div>
          </div>

          {/* Right tabs: Matchup | Injuries | Insights */}
          <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.05)', marginBottom:'16px' }}>
            {['matchup','injuries','insights'].map(tab => {
              const active = rightTab === tab;
              return (
                <button key={tab} onClick={() => setRightTab(tab)} style={{
                  flex:1, padding:'9px 0', fontSize:'12px', fontWeight: active?600:500,
                  background:'none', border:'none', cursor:'pointer',
                  borderBottom: active?'2px solid #f0f0f0':'2px solid transparent',
                  color: active?'#f0f0f0':'rgba(188,202,187,0.3)',
                  textTransform:'capitalize', transition:'color 120ms', marginBottom:'-1px',
                }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.color='#bccabb'; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.color='rgba(188,202,187,0.3)'; }}>
                  {tab === 'matchup' ? 'Enfrentamiento' : tab === 'injuries' ? 'Lesionados' : 'Análisis'}
                </button>
              );
            })}
          </div>

          {rightTab === 'matchup' && (
            <MatchupTab match={match} pitchers={probable_pitchers} batters={team_batters||[]} hasPitchers={hasPitchers} batterVsPitcher={batter_vs_pitcher||[]} />
          )}
          {rightTab === 'injuries' && (
            <InjuriesTab injuries={injuries} />
          )}
          {rightTab === 'insights' && (
            <InsightsTab match={match} homeWinPct={homeWinPct} awayWinPct={awayWinPct} h2h={h2h} homeRecord={homeRecord} awayRecord={awayRecord} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── AnimBar ─────────────────────────────────────────── */
function AnimBar({ lPct, rPct, lLabel, rLabel, barLabel, color }) {
  const lW = lPct >= rPct;
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 30); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'5px' }}>
        <span style={{ fontSize:'12px', fontWeight:700, fontVariantNumeric:'tabular-nums', color: lW?color:'rgba(255,255,255,0.25)' }}>{lPct}%</span>
        <span style={{ fontSize:'8.5px', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(188,202,187,0.3)' }}>{barLabel}</span>
        <span style={{ fontSize:'12px', fontWeight:700, fontVariantNumeric:'tabular-nums', color: !lW?color:'rgba(255,255,255,0.25)' }}>{rPct}%</span>
      </div>
      <div style={{ height:'4px', borderRadius:'99px', background:'#404040', display:'flex', overflow:'hidden' }}>
        <div style={{ width:`${ready?lPct:0}%`, background:lW?color:'rgba(255,255,255,0.12)', flexShrink:0, transition:'width 0.7s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ width:`${ready?rPct:0}%`, background:!lW?color:'rgba(255,255,255,0.12)', flexShrink:0, transition:'width 0.7s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'4px' }}>
        <span style={{ fontSize:'9px', color:'rgba(188,202,187,0.25)' }}>{lLabel}</span>
        <span style={{ fontSize:'9px', color:'rgba(188,202,187,0.25)' }}>{rLabel}</span>
      </div>
    </div>
  );
}

/* ── RecentGamesSection ──────────────────────────────── */
function RecentGamesSection({ homeGames, awayGames, match, numGames, gamesFilter, setGamesFilter }) {
  const home = (homeGames||[]).slice(0,numGames);
  const away = (awayGames||[]).slice(0,numGames);
  if (!home.length && !away.length) return (
    <div className="lit-card" style={{ padding:'24px', textAlign:'center', fontSize:'12px', color:'rgba(188,202,187,0.3)' }}>Sin partidos recientes</div>
  );

  const filterTabs = [
    { id:'all', label:'Todos' },
    { id:'matchup', label:`${match.home_short} away / ${match.away_short} home` },
  ];

  return (
    <div className="lit-card" style={{ overflow:'hidden' }}>
      {/* Filter tabs */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display:'flex', gap:'4px' }}>
          {filterTabs.map(f => {
            const active = gamesFilter === f.id;
            return (
              <button key={f.id} onClick={() => setGamesFilter(f.id)} style={{
                padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight: active?600:500,
                background: active?'rgba(255,255,255,0.08)':'transparent',
                color: active?'#f0f0f0':'rgba(188,202,187,0.4)',
                transition:'all 120ms',
              }}>{f.label}</button>
            );
          })}
        </div>
        {/* Starting pitcher toggle - visual only */}
        <button style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 9px', borderRadius:'6px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)', cursor:'pointer', fontSize:'11px', color:'rgba(188,202,187,0.4)' }}>
          Pitcher abridor
          <span className="material-symbols-outlined" style={{ fontSize:'13px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>expand_more</span>
        </button>
      </div>

      {/* Column headers */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        {[match.home_short, match.away_short].map((short,col) => (
          <div key={col} style={{ padding:'8px 14px', background:'rgba(0,0,0,0.2)', borderLeft: col>0?'1px solid rgba(255,255,255,0.04)':'none' }}>
            <span style={{ fontSize:'10px', fontWeight:700, color:'#bccabb' }}>{short}</span>
          </div>
        ))}
      </div>

      {/* Game rows */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
        {[
          { games: home, short: match.home_short },
          { games: away, short: match.away_short },
        ].map(({ games }, col) => (
          <div key={col} style={{ borderLeft: col>0?'1px solid rgba(255,255,255,0.04)':'none' }}>
            {games.map((game, i) => {
              const dateStr = new Date(game.game_date).toLocaleDateString('en-US',{month:'numeric',day:'numeric'});
              const resColor = game.result==='W'?'#6bfb9a':game.result==='L'?'#f87171':'#facc15';
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px', borderTop: i>0?'1px solid rgba(255,255,255,0.04)':'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {/* Team badge circle */}
                    <TeamBadge short={game.opponent_short} size={22} radius="full" />
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                        <span style={{ fontSize:'9.5px', color:'rgba(188,202,187,0.35)' }}>{game.is_home?'vs':'@'}</span>
                        <span style={{ fontSize:'11px', color:'#bccabb', fontWeight:600 }}>{game.opponent_short}</span>
                      </div>
                      <span style={{ fontSize:'9px', color:'rgba(188,202,187,0.25)' }}>{dateStr}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <span style={{ fontSize:'12px', fontWeight:700, color:'#f0f0f0', fontVariantNumeric:'tabular-nums' }}>{game.team_score}:{game.opponent_score}</span>
                    <span style={{ fontSize:'11px', fontWeight:700, color:resColor, width:'10px', textAlign:'center' }}>{game.result}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── H2HSection ──────────────────────────────────────── */
function H2HSection({ h2h, match }) {
  if (!h2h?.length) return (
    <div className="lit-card" style={{ padding:'24px', textAlign:'center', fontSize:'12px', color:'rgba(188,202,187,0.3)' }}>Sin historial H2H</div>
  );
  return (
    <div className="lit-card" style={{ overflow:'hidden' }}>
      <div style={{ padding:'11px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize:'11px', color:'#bccabb', fontWeight:500 }}>Cabeza a Cabeza</span>
        <span style={{ fontSize:'11px', color:'rgba(188,202,187,0.3)', marginLeft:'6px' }}>· Últimos {h2h.length} encuentros</span>
      </div>
      {h2h.map((record,i) => {
        const isTeamA = record.team_a_id === match.home_team_id;
        const homeScore = isTeamA?record.score_a:record.score_b;
        const awayScore = isTeamA?record.score_b:record.score_a;
        const homeWin = homeScore > awayScore;
        const dateStr = new Date(record.match_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
        return (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', padding:'9px 14px', borderTop: i>0?'1px solid rgba(255,255,255,0.04)':'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, color: homeWin?'#6bfb9a':'#f87171' }}>{homeWin?'W':homeScore===awayScore?'D':'L'}</span>
              <span style={{ fontSize:'10px', color:'rgba(188,202,187,0.3)' }}>{match.home_short}</span>
            </div>
            <div style={{ textAlign:'center' }}>
              <span style={{ fontSize:'13px', color:'#f0f0f0', fontWeight:700, fontVariantNumeric:'tabular-nums' }}>{homeScore} : {awayScore}</span>
              <p style={{ fontSize:'9px', color:'rgba(188,202,187,0.3)', margin:'1px 0 0' }}>{dateStr}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', justifyContent:'flex-end' }}>
              <span style={{ fontSize:'10px', color:'rgba(188,202,187,0.3)' }}>{match.away_short}</span>
              <span style={{ fontSize:'11px', fontWeight:700, color: !homeWin?'#6bfb9a':'#f87171' }}>{!homeWin?'W':homeScore===awayScore?'D':'L'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MatchupTab (Starting Pitcher + Team Rankings) ───── */
function MatchupTab({ match, pitchers, batters, hasPitchers, batterVsPitcher }) {
  const [selectedTeam, setSelectedTeam] = useState(match?.away_team_id);
  const homePitcher = pitchers?.find(p => p.team_id === match.home_team_id);
  const awayPitcher = pitchers?.find(p => p.team_id === match.away_team_id);
  const isSelectedHome = selectedTeam === match.home_team_id;
  const selectedPitcher = isSelectedHome ? homePitcher : awayPitcher;
  const opposingPitcher = isSelectedHome ? awayPitcher : homePitcher;
  const selectedBatters = batters.filter(b => b.team_id === selectedTeam);

  const stats = [
    { stat:'Points',   home:'118.2',hRank:'6th', away:'115.1',aRank:'14th' },
    { stat:'FG %',     home:'47.3', hRank:'13th',away:'47.7', aRank:'22nd' },
    { stat:'3-Point %',home:'36.9', hRank:'6th', away:'35.3', aRank:'18th' },
    { stat:'Rebounds', home:'44.8', hRank:'10th',away:'43.2', aRank:'18th' },
    { stat:'Assists',  home:'28.4', hRank:'5th', away:'25.1', aRank:'20th' },
    { stat:'Turnovers',home:'13.5', hRank:'7th', away:'14.3', aRank:'15th' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Starting Pitcher */}
      {hasPitchers && (
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <h4 style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', margin:0 }}>Pitcher Abridor</h4>
            <div style={{ display:'flex', gap:'5px' }}>
              {[match.away_team_id, match.home_team_id].map((tid,i) => {
                const short = i===0?match.away_short:match.home_short;
                const active = selectedTeam===tid;
                return (
                  <button key={tid} onClick={() => setSelectedTeam(tid)} style={{
                    display:'flex', alignItems:'center', gap:'5px', padding:'3px 9px', borderRadius:'99px', border:'1px solid', cursor:'pointer', transition:'all 120ms', fontSize:'11px', fontWeight:700,
                    background: active?'rgba(255,255,255,0.07)':'transparent',
                    borderColor: active?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.07)',
                    color: active?'#f0f0f0':'rgba(188,202,187,0.4)',
                  }}>
                    <TeamBadge short={short} size={16} radius="full" />
                    {short}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPitcher ? (
            <div className="lit-card" style={{ padding:'14px 16px' }}>
              {/* Pitcher name row */}
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:'10px', fontWeight:700, color:'#bccabb' }}>{selectedPitcher.full_name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={{ fontSize:'13px', color:'#f0f0f0', fontWeight:600 }}>{abbrevFirst(selectedPitcher.full_name)}</span>
                    {selectedPitcher.throws && <span style={{ fontSize:'10px', color:'rgba(188,202,187,0.4)', background:'rgba(255,255,255,0.05)', padding:'1px 5px', borderRadius:'4px' }}>{selectedPitcher.throws}HP</span>}
                    <span style={{ fontSize:'9px', color:'rgba(188,202,187,0.35)', background:'rgba(255,255,255,0.04)', padding:'1px 6px', borderRadius:'4px' }}>↗ 2026</span>
                  </div>
                </div>
              </div>

              {/* Column headers */}
              <div style={{ display:'flex', alignItems:'center', padding:'5px 0', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:'2px' }}>
                <div style={{ flex:1 }} />
                <div style={{ width:'56px', textAlign:'right', fontSize:'9px', fontWeight:700, color:'rgba(188,202,187,0.5)', textTransform:'uppercase', letterSpacing:'0.07em' }}>{selectedPitcher.season_year || '2026'}</div>
                <div style={{ width:'64px', textAlign:'right', fontSize:'9px', fontWeight:700, color:'rgba(188,202,187,0.5)', textTransform:'uppercase', letterSpacing:'0.07em' }}>vs. {isSelectedHome ? match.away_short : match.home_short}</div>
              </div>

              {[
                { label:'Record',            s:`${selectedPitcher.season_wins}-${selectedPitcher.season_losses}`, v:`${selectedPitcher.vs_wins??0}-${selectedPitcher.vs_losses??0}`, better:'neutral' },
                { label:'Earned runs per 9', s:fmt(selectedPitcher.season_era),           v:fmt(selectedPitcher.vs_era),           better:'lower'   },
                { label:'Innings pitched',   s:fmt(selectedPitcher.season_ip,1),          v:fmt(selectedPitcher.vs_ip,1),          better:'neutral' },
                { label:'Hits per 9',        s:fmt(selectedPitcher.season_hits_per9),     v:fmt(selectedPitcher.vs_hits_per9),     better:'lower'   },
                { label:'Strikeouts per 9',  s:fmt(selectedPitcher.season_k_per9),        v:fmt(selectedPitcher.vs_k_per9),        better:'higher'  },
                { label:'Walks plus hits per inning pitched', s:fmt(selectedPitcher.season_whip), v:fmt(selectedPitcher.vs_whip), better:'lower' },
              ].map((r,i) => {
                const tone = compareTone(r.s, r.v, r.better);
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', padding:'7px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ flex:1, fontSize:'11.5px', color:'#bccabb' }}>{r.label}</div>
                    <div style={{ width:'56px', textAlign:'right', fontSize:'12px', color:'#f0f0f0', fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{r.s}</div>
                    <div style={{ width:'64px', textAlign:'right', fontSize:'12px', fontWeight:600, fontVariantNumeric:'tabular-nums', color: tone==='good'?'#6bfb9a':tone==='bad'?'#f87171':'rgba(188,202,187,0.35)' }}>{r.v === '0.00' ? '-' : r.v}</div>
                  </div>
                );
              })}
              <div style={{ marginTop:'10px', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'2px', background:'#6bfb9a' }} />
                <span style={{ fontSize:'10px', color:'rgba(188,202,187,0.35)' }}>— comparado con stats de temporada</span>
              </div>
            </div>
          ) : (
            <div className="lit-card" style={{ padding:'16px', textAlign:'center', fontSize:'12px', color:'rgba(188,202,187,0.3)' }}>Pitcher aún no anunciado</div>
          )}

          {/* Batter stats vs opposing pitcher */}
          {selectedBatters.length > 0 && (
            <BatterBlock
              batters={selectedBatters}
              pitcherThrows={opposingPitcher?.throws}
              pitcherName={opposingPitcher?.full_name}
              pitcherMlbId={opposingPitcher?.mlb_player_id}
              vsPitcherRows={(batterVsPitcher||[]).filter(r => r.batter_team_id === selectedTeam)}
              teamShort={isSelectedHome ? match.home_short : match.away_short}
              season={opposingPitcher?.season_year}
            />
          )}
        </div>
      )}

      {/* Team Rankings */}
      <div>
        <h4 style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', margin:'0 0 10px' }}>Ranking de Equipos ({new Date().getFullYear()})</h4>
        <div className="lit-card" style={{ overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ fontSize:'9px', color:'rgba(188,202,187,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
                <th style={{ textAlign:'left',   padding:'8px 12px' }}>Avg.</th>
                <th style={{ textAlign:'left',   padding:'8px 8px'  }}>Rank</th>
                <th style={{ textAlign:'center', padding:'8px 8px'  }}>Stat</th>
                <th style={{ textAlign:'right',  padding:'8px 8px'  }}>Rank</th>
                <th style={{ textAlign:'right',  padding:'8px 12px' }}>Avg.</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row,i) => {
                const hV = parseFloat(row.home), aV = parseFloat(row.away);
                const inv = row.stat==='Turnovers';
                const hB = inv?hV<aV:hV>aV;
                return (
                  <tr key={i} style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'9px 12px', fontSize:'12px', fontWeight:700, fontVariantNumeric:'tabular-nums', color: hB?'#6bfb9a':'#f0f0f0' }}>{row.home}</td>
                    <td style={{ padding:'9px 8px',  fontSize:'10px', color:'rgba(188,202,187,0.3)' }}>{row.hRank}</td>
                    <td style={{ padding:'9px 8px',  fontSize:'11px', color:'#bccabb', textAlign:'center', fontWeight:500 }}>{row.stat}</td>
                    <td style={{ padding:'9px 8px',  fontSize:'10px', color:'rgba(188,202,187,0.3)', textAlign:'right' }}>{row.aRank}</td>
                    <td style={{ padding:'9px 12px', fontSize:'12px', fontWeight:700, fontVariantNumeric:'tabular-nums', textAlign:'right', color: !hB?'#6bfb9a':'#f0f0f0' }}>{row.away}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── BatterBlock ─────────────────────────────────────── */

// Colores por umbrales absolutos MLB
function avgColor(v) {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return 'rgba(188,202,187,0.35)';
  if (n >= 0.275) return '#4ade80';
  if (n <= 0.230) return '#f87171';
  return '#e2e8f0';
}
function opsColor(v) {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return 'rgba(188,202,187,0.35)';
  if (n >= 0.800) return '#4ade80';
  if (n <= 0.680) return '#f87171';
  return '#e2e8f0';
}

// MLB headshot CDN (works for most active players)
function mlbHeadshot(mlbId) {
  if (!mlbId) return null;
  return `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_60,q_auto:best/v1/people/${mlbId}/headshot/67/current`;
}

function BatterRow({ name, mlbId, ab, avg, hr, rbi, ops, kpct, avgClr, opsClr }) {
  const cAvg = avgClr || '#e2e8f0';
  const cOps = opsClr || '#e2e8f0';
  const initials = (name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const photo = mlbHeadshot(mlbId);

  const tdBase = { padding:'0 6px', textAlign:'right', fontVariantNumeric:'tabular-nums', fontSize:'12px', whiteSpace:'nowrap' };

  return (
    <tr style={{ borderTop:'1px solid rgba(255,255,255,0.045)' }}>
      {/* Player */}
      <td style={{ padding:'7px 8px 7px 14px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {/* Avatar */}
          <div style={{ width:'28px', height:'28px', borderRadius:'50%', overflow:'hidden', background:'rgba(255,255,255,0.07)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.08)' }}>
            {photo
              ? <img src={photo} alt={initials} style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display='none'; }} />
              : <span style={{ fontSize:'8px', fontWeight:700, color:'rgba(188,202,187,0.5)' }}>{initials}</span>
            }
          </div>
          {/* Name + arrow */}
          <span style={{ color:'#e2e8f0', fontSize:'12px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1.2 }}>
            {shortName(name)}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink:0, opacity:0.4 }}>
            <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#6bfb9a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </td>
      <td style={{ ...tdBase, color:'rgba(188,202,187,0.4)', paddingRight:'10px' }}>{ab ?? '-'}</td>
      <td style={{ ...tdBase, fontWeight:700, color: cAvg }}>{fmtAvg(avg)}</td>
      <td style={{ ...tdBase, color:'#e2e8f0' }}>{hr ?? '-'}</td>
      <td style={{ ...tdBase, color:'#e2e8f0' }}>{rbi ?? '-'}</td>
      <td style={{ ...tdBase, fontWeight:700, color: cOps }}>{fmtAvg(ops)}</td>
      <td style={{ ...tdBase, color:'rgba(188,202,187,0.5)', paddingRight:'14px' }}>
        {kpct != null ? `${parseFloat(kpct).toFixed(1)}%` : '-'}
      </td>
    </tr>
  );
}

const TH_STYLE = { padding:'5px 6px', fontSize:'9.5px', fontWeight:700, color:'rgba(188,202,187,0.3)', textTransform:'uppercase', letterSpacing:'0.07em', textAlign:'right', whiteSpace:'nowrap' };

function BatterBlock({ batters, pitcherThrows, pitcherName, vsPitcherRows, teamShort, season }) {
  const [tab, setTab] = useState('season');
  const isRhp = pitcherThrows === 'R';
  const splitLabel = isRhp ? `vs. RHP (${season || '2026'})` : `vs. LHP (${season || '2026'})`;

  const seasonFrom = vsPitcherRows?.length
    ? Math.min(...vsPitcherRows.map(r => r.season_from).filter(Boolean))
    : null;
  const pitcherTabLabel = pitcherName
    ? `vs. ${abbrevFirst(pitcherName)}${seasonFrom ? ` (${seasonFrom})` : ''}`
    : null;

  const sortedBatters = batters.slice().sort((a,b)=>(b.season_ab||0)-(a.season_ab||0)).slice(0,9);
  const vspMap = new Map((vsPitcherRows||[]).map(r => [r.mlb_batter_id, r]));

  const tabs = [
    { id:'season', label: season || '2026' },
    { id:'split',  label: splitLabel },
    ...(pitcherTabLabel ? [{ id:'vspitcher', label: pitcherTabLabel }] : []),
  ];

  let rows = null;
  if (tab === 'season') {
    rows = sortedBatters.map((b,i) => (
      <BatterRow key={i} name={b.full_name} mlbId={b.mlb_player_id}
        ab={b.season_ab} avg={b.season_avg} hr={b.season_hr} rbi={b.season_rbi} ops={b.season_ops} kpct={b.season_k_pct}
        avgClr={avgColor(b.season_avg)} opsClr={opsColor(b.season_ops)} />
    ));
  } else if (tab === 'split') {
    rows = sortedBatters.map((b,i) => {
      const s = isRhp
        ? { ab:b.vr_ab, avg:b.vr_avg, hr:b.vr_hr, rbi:b.vr_rbi, ops:b.vr_ops, kpct:b.vr_k_pct }
        : { ab:b.vl_ab, avg:b.vl_avg, hr:b.vl_hr, rbi:b.vl_rbi, ops:b.vl_ops, kpct:b.vl_k_pct };
      return <BatterRow key={i} name={b.full_name} mlbId={b.mlb_player_id} {...s}
        avgClr={avgColor(s.avg)} opsClr={opsColor(s.ops)} />;
    });
  } else {
    rows = sortedBatters.map((b,i) => {
      const vsp = vspMap.get(b.mlb_player_id);
      return <BatterRow key={i} name={b.full_name} mlbId={b.mlb_player_id}
        ab={vsp?.ab ?? null} avg={vsp?.avg ?? null} hr={vsp?.hr ?? null}
        rbi={vsp?.rbi ?? null} ops={vsp?.ops ?? null} kpct={vsp?.k_pct ?? null}
        avgClr={avgColor(vsp?.avg)} opsClr={opsColor(vsp?.ops)} />;
    });
  }

  return (
    <div className="lit-card" style={{ overflow:'hidden', marginTop:'12px' }}>
      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px 0' }}>
        <span style={{ fontSize:'12px', fontWeight:700, color:'#f0f0f0', letterSpacing:'0.01em' }}>Batter Stats</span>
        <span style={{ fontSize:'9px', fontWeight:700, color:'rgba(188,202,187,0.6)', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'99px', padding:'2px 8px', letterSpacing:'0.05em' }}>{teamShort}</span>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 14px', gap:0, overflowX:'auto' }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'8px 0', marginRight:'16px', fontSize:'10.5px', fontWeight: active ? 600 : 400,
              background:'none', border:'none', cursor:'pointer',
              borderBottom: active ? '2px solid #e2e8f0' : '2px solid transparent',
              color: active ? '#e2e8f0' : 'rgba(188,202,187,0.35)',
              marginBottom:'-1px', whiteSpace:'nowrap', flexShrink:0,
              transition:'color 100ms',
            }}>{t.label}</button>
          );
        })}
      </div>

      {/* Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
        <colgroup>
          <col style={{ width:'auto' }} />
          <col style={{ width:'32px' }} />
          <col style={{ width:'42px' }} />
          <col style={{ width:'28px' }} />
          <col style={{ width:'30px' }} />
          <col style={{ width:'44px' }} />
          <col style={{ width:'36px' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...TH_STYLE, textAlign:'left', paddingLeft:'14px' }}>Batter</th>
            <th style={TH_STYLE}>AB</th>
            <th style={{ ...TH_STYLE, color:'rgba(107,251,154,0.5)' }}>AVG</th>
            <th style={TH_STYLE}>HR</th>
            <th style={TH_STYLE}>RBI</th>
            <th style={{ ...TH_STYLE, color:'rgba(107,251,154,0.5)' }}>OPS</th>
            <th style={{ ...TH_STYLE, paddingRight:'14px' }}>K%</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {!sortedBatters.length && (
            <tr><td colSpan={7} style={{ padding:'16px', textAlign:'center', fontSize:'12px', color:'rgba(188,202,187,0.3)' }}>Sin datos de bateadores</td></tr>
          )}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ padding:'6px 14px 9px', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'2px', background:'#4ade80' }} />
          <span style={{ fontSize:'9.5px', color:'rgba(188,202,187,0.35)' }}>≥.275 AVG / ≥.800 OPS</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'2px', background:'#f87171' }} />
          <span style={{ fontSize:'9.5px', color:'rgba(188,202,187,0.35)' }}>≤.230 AVG / ≤.680 OPS</span>
        </div>
      </div>
    </div>
  );
}

/* ── InjuriesTab ─────────────────────────────────────── */
function InjuriesTab({ injuries }) {
  if (!injuries?.length) return (
    <div style={{ padding:'24px', textAlign:'center', fontSize:'12px', color:'rgba(188,202,187,0.3)' }}>Sin reportes de lesiones</div>
  );
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div className="lit-card" style={{ overflow:'hidden' }}>
            {injuries.map((inj,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderTop: i>0?'1px solid rgba(255,255,255,0.04)':'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <TeamBadge short={inj.team_short} size={24} radius="full" />
                  <div>
                    <p style={{ fontSize:'13px', color:'#f0f0f0', fontWeight:500, margin:0 }}>{inj.player_name}</p>
                    <p style={{ fontSize:'10px', color:'rgba(188,202,187,0.35)', margin:'1px 0 0' }}>{inj.position} · {inj.injury_type}</p>
                  </div>
                </div>
                <StatusBadge status={inj.status} />
              </div>
            ))}
      </div>
    </div>
  );
}

/* ── InsightsTab ─────────────────────────────────────── */
function InsightsTab({ match, homeWinPct, awayWinPct, h2h, homeRecord, awayRecord }) {
  const h2hHomeWins = (h2h||[]).filter(g => { const a = g.team_a_id===match.home_team_id; return a?g.score_a>g.score_b:g.score_b>g.score_a; }).length;
  const h2hTotal = h2h?.length||0;
  const insights = [
    { type: homeWinPct>awayWinPct?'positive':'neutral', text:`${match.home_team} ha ganado el ${homeWinPct}% de sus últimos 10 partidos (${homeRecord} en temporada).` },
    { type: awayWinPct>homeWinPct?'positive':'neutral', text:`${match.away_team} ha ganado el ${awayWinPct}% de sus últimos 10 partidos (${awayRecord} en temporada).` },
    h2hTotal>0&&{ type: h2hHomeWins>h2hTotal/2?'positive':'warning', text:`${match.home_team} ha ganado ${h2hHomeWins} de los últimos ${h2hTotal} enfrentamientos directos.` },
    homeWinPct>=60&&{ type:'positive', text:`${match.home_short} viene en racha con un ${homeWinPct}% de victorias recientes.` },
    awayWinPct<=40&&{ type:'warning',  text:`${match.away_short} ha tenido dificultades — solo ${awayWinPct}% de victorias en los últimos 10.` },
    { type:'neutral', text:`Este partido se juega en ${match.venue}. Los equipos locales ganan ~55% de los juegos.` },
  ].filter(Boolean);
  const iconMap = { positive:'trending_up', warning:'trending_down', neutral:'bar_chart' };
  const colMap  = { positive:'#6bfb9a', warning:'#f87171', neutral:'rgba(188,202,187,0.3)' };
  const bgMap   = { positive:'rgba(107,251,154,0.05)', warning:'rgba(248,113,113,0.05)', neutral:'rgba(255,255,255,0.02)' };
  const bdrMap  = { positive:'rgba(107,251,154,0.12)', warning:'rgba(248,113,113,0.12)', neutral:'rgba(255,255,255,0.05)' };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      <h3 style={{ fontSize:'13px', fontWeight:700, color:'#f0f0f0', margin:'0 0 4px' }}>Puntos Clave</h3>
      {insights.map((ins,i) => (
        <div key={i} style={{ padding:'11px 13px', borderRadius:'10px', background:bgMap[ins.type], border:`1px solid ${bdrMap[ins.type]}`, fontSize:'12px', color:'#bccabb', lineHeight:1.5, display:'flex', gap:'8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize:'14px', color:colMap[ins.type], flexShrink:0, marginTop:'1px', fontVariationSettings:"'FILL' 0,'wght' 300" }}>{iconMap[ins.type]}</span>
          {ins.text}
        </div>
      ))}
    </div>
  );
}

/* ── StatusBadge ─────────────────────────────────────── */
function StatusBadge({ status }) {
  const m = { out:{c:'#f87171',bg:'rgba(248,113,113,0.1)',l:'OUT'}, doubtful:{c:'#facc15',bg:'rgba(250,204,21,0.1)',l:'DTD'}, questionable:{c:'#fb923c',bg:'rgba(251,146,60,0.1)',l:'GTD'}, probable:{c:'#6bfb9a',bg:'rgba(107,251,154,0.1)',l:'PROB'} };
  const s = m[status]||{c:'rgba(188,202,187,0.3)',bg:'rgba(255,255,255,0.05)',l:status};
  return <span style={{ fontSize:'9px', fontWeight:700, color:s.c, background:s.bg, padding:'3px 7px', borderRadius:'5px' }}>{s.l}</span>;
}

/* ── Helpers ─────────────────────────────────────────── */
function fmtAvg(v) { if(!v&&v!==0) return '-'; const n=parseFloat(v); return isNaN(n)?'-':n.toFixed(3).replace(/^0\./,'.'); }
function shortName(f) { const p=(f||'').split(' '); return p.length<2?f:`${p[0][0]}. ${p.slice(1).join(' ')}`; }
function fmt(v,d=2) { if(v==null||v===''||isNaN(parseFloat(v))) return '0.00'; return parseFloat(v).toFixed(d); }
function abbrevFirst(f) { const p=f.split(' '); return p.length<2?f:`${p[0][0]}. ${p.slice(1).join(' ')}`; }
function compareTone(s,v,b) { if(b==='neutral') return 'neutral'; const sv=parseFloat(s),vv=parseFloat(v); if(isNaN(sv)||isNaN(vv)||sv===vv) return 'neutral'; return b==='lower'?(vv<sv?'good':'bad'):(vv>sv?'good':'bad'); }
