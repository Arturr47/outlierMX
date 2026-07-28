// Sync World Cup 2026 data from ESPN's public API.
// No API key, no registration, no limits.
//
// Usage:
//   node scripts/sync-world-cup.js [YYYY-MM-DD]   (default = today)
//   npm run sync:wc

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const WC_SLUG = 'world-cup';
const DATE    = process.argv[2] || new Date().toISOString().slice(0, 10);

// ESPN date format is YYYYMMDD (no dashes)
const ESPN_DATE = DATE.replace(/-/g, '');

const ESPN_SCOREBOARD = `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=${ESPN_DATE}`;
const ESPN_SUMMARY    = (id) => `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`;

// ── Status ────────────────────────────────────────────────────
function espnStatus(event) {
  const state = event.status?.type?.state;
  if (state === 'pre')  return 'scheduled';
  if (state === 'in')   return 'live';
  if (state === 'post') return 'finished';
  return 'scheduled';
}

// ── Fetch helper ──────────────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'OutlierMX/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.json();
}

// ── Derive 3-way soccer odds from team records ─────────────────
// Adds ~5% overround (typical sportsbook vig).
function deriveOdds(hWinPct, aWinPct) {
  const hp = Math.max(0.15, Math.min(0.70, hWinPct + 0.03));
  const ap = Math.max(0.15, Math.min(0.70, aWinPct));
  const dp = Math.max(0.18, 1 - hp - ap);
  const total = hp + ap + dp;
  const vig   = 1.05;
  return {
    home: +(vig / (hp / total)).toFixed(2),
    draw: +(vig / (dp / total)).toFixed(2),
    away: +(vig / (ap / total)).toFixed(2),
  };
}

function deriveStreak(recent) {
  if (!recent.length) return '';
  const first = recent[0].result;
  let n = 0;
  for (const g of recent) { if (g.result === first) n++; else break; }
  return `${first}${n}`;
}

// ── Upsert team ────────────────────────────────────────────────
async function upsertTeam(client, leagueDbId, espnTeam) {
  const code = (espnTeam.abbreviation || espnTeam.displayName.slice(0, 3)).toUpperCase();
  const name = espnTeam.displayName;

  const found = await client.query(
    'SELECT id FROM teams WHERE short_name=$1 AND league_id=$2',
    [code, leagueDbId]
  );
  if (found.rows[0]) return { id: found.rows[0].id, code };

  const ins = await client.query(
    `INSERT INTO teams (league_id, name, short_name, city, wins, losses, ties, win_pct, streak)
     VALUES ($1,$2,$3,$4,0,0,0,0.500,'') RETURNING id`,
    [leagueDbId, name, code, name]
  );
  console.log(`  [team] New: ${name} (${code})`);
  return { id: ins.rows[0].id, code };
}

// ── Upsert player ──────────────────────────────────────────────
const POS_MAP_ESPN = {
  GK: 'Portero', G: 'Portero',
  D: 'Defensa', CB: 'Defensa', LB: 'Defensa', RB: 'Defensa',
  M: 'Mediocampista', MF: 'Mediocampista', CM: 'Mediocampista', DM: 'Mediocampista',
  F: 'Delantero', FW: 'Delantero', ST: 'Delantero', LW: 'Delantero', RW: 'Delantero',
};

async function upsertPlayer(client, teamDbId, espnPlayer) {
  const name   = espnPlayer.athlete?.displayName || espnPlayer.displayName || '?';
  const number = parseInt(espnPlayer.jersey || espnPlayer.athlete?.jersey || '0', 10) || 0;
  const rawPos = (espnPlayer.position?.abbreviation || espnPlayer.athlete?.position?.abbreviation || 'F').toUpperCase();
  const pos    = POS_MAP_ESPN[rawPos] || 'Delantero';

  const found = await client.query(
    'SELECT id FROM players WHERE team_id=$1 AND name=$2', [teamDbId, name]
  );
  if (found.rows[0]) {
    await client.query('UPDATE players SET number=$1, position=$2 WHERE id=$3', [number, pos, found.rows[0].id]);
    return found.rows[0].id;
  }
  const ins = await client.query(
    `INSERT INTO players (team_id, name, position, number, status) VALUES ($1,$2,$3,$4,'active') RETURNING id`,
    [teamDbId, name, pos, number]
  );
  return ins.rows[0].id;
}

// ── Main ──────────────────────────────────────────────────────
async function run() {
  const client = await pool.connect();
  try {
    console.log(`\n[sync-world-cup] ${DATE} — source: ESPN public API (no key needed)`);

    // 1. League DB id
    const lRow = await client.query('SELECT id FROM leagues WHERE slug=$1', [WC_SLUG]);
    if (!lRow.rows[0]) throw new Error(`League '${WC_SLUG}' not in DB. Run migration-world-cup.sql first.`);
    const leagueDbId = lRow.rows[0].id;

    // 2. Fetch scoreboard from ESPN
    let scoreboard;
    try {
      scoreboard = await fetchJson(ESPN_SCOREBOARD);
    } catch (e) {
      throw new Error(`ESPN scoreboard fetch failed: ${e.message}`);
    }

    const events = scoreboard.events || [];
    console.log(`[sync-world-cup] ${events.length} match(es) on ESPN for ${DATE}.`);
    if (!events.length) {
      console.log('[sync-world-cup] No matches. Done.');
      return;
    }

    await client.query('BEGIN');

    // 3. Wipe today's existing WC data
    const df = `match_id IN (SELECT id FROM matches WHERE league_id=$1 AND DATE(match_date)=$2)`;
    await client.query(`DELETE FROM public_betting WHERE ${df}`, [leagueDbId, DATE]);
    await client.query(`DELETE FROM lineups        WHERE ${df}`, [leagueDbId, DATE]);
    await client.query(`DELETE FROM odds           WHERE ${df}`, [leagueDbId, DATE]);
    await client.query(`DELETE FROM matches WHERE league_id=$1 AND DATE(match_date)=$2`, [leagueDbId, DATE]);

    // 4. Process each match
    for (const event of events) {
      const comp = event.competitions?.[0];
      if (!comp) continue;

      const homeSide = comp.competitors?.find(c => c.homeAway === 'home');
      const awaySide = comp.competitors?.find(c => c.homeAway === 'away');
      if (!homeSide || !awaySide) continue;

      const homeTeam = await upsertTeam(client, leagueDbId, homeSide.team);
      const awayTeam = await upsertTeam(client, leagueDbId, awaySide.team);

      const status     = espnStatus(event);
      const homeScore  = status !== 'scheduled' ? parseInt(homeSide.score || '0', 10) : null;
      const awayScore  = status !== 'scheduled' ? parseInt(awaySide.score || '0', 10) : null;
      const venueRaw   = comp.venue;
      const venue      = venueRaw?.fullName
        ? `${venueRaw.fullName}${venueRaw.address?.city ? ', ' + venueRaw.address.city : ''}`
        : null;

      const matchRow = await client.query(
        `INSERT INTO matches (league_id, home_team_id, away_team_id, match_date, status, home_score, away_score, venue)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [leagueDbId, homeTeam.id, awayTeam.id, event.date, status, homeScore, awayScore, venue]
      );
      const matchDbId = matchRow.rows[0].id;
      console.log(`  [match] ${homeTeam.code} vs ${awayTeam.code} — ${status} — id=${matchDbId}`);

      // Update finished team_games record
      if (status === 'finished' && homeScore !== null && awayScore !== null) {
        const homeResult = homeScore > awayScore ? 'W' : homeScore < awayScore ? 'L' : 'D';
        const awayResult = homeScore < awayScore ? 'W' : homeScore > awayScore ? 'L' : 'D';
        const gDate = DATE;

        await client.query(
          `INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id)
           VALUES ($1,$2,$3,true,$4,$5,$6,$7)
           ON CONFLICT DO NOTHING`,
          [homeTeam.id, awayTeam.id, gDate, homeScore, awayScore, homeResult, leagueDbId]
        );
        await client.query(
          `INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id)
           VALUES ($1,$2,$3,false,$4,$5,$6,$7)
           ON CONFLICT DO NOTHING`,
          [awayTeam.id, homeTeam.id, gDate, awayScore, homeScore, awayResult, leagueDbId]
        );

        // Update team records
        for (const [teamId, result] of [[homeTeam.id, homeResult], [awayTeam.id, awayResult]]) {
          await client.query(
            `UPDATE teams SET
               wins   = wins   + ($1 = 'W')::int,
               losses = losses + ($1 = 'L')::int,
               ties   = ties   + ($1 = 'D')::int
             WHERE id = $2`,
            [result, teamId]
          );
        }
      }

      // Odds — derived from stored team win%
      const hRow = await client.query('SELECT win_pct FROM teams WHERE id=$1', [homeTeam.id]);
      const aRow = await client.query('SELECT win_pct FROM teams WHERE id=$1', [awayTeam.id]);
      const hw   = parseFloat(hRow.rows[0]?.win_pct) || 0.38;
      const aw   = parseFloat(aRow.rows[0]?.win_pct) || 0.38;
      const o3   = deriveOdds(hw, aw);

      const books = ['Caliente', 'Bet365', 'Betcris'];
      for (const book of books) {
        const j = (Math.random() - 0.5) * 0.07;
        await client.query(
          `INSERT INTO odds (match_id, sportsbook, bet_type, home_odds, away_odds, draw_odds)
           VALUES ($1,$2,'moneyline',$3,$4,$5)`,
          [matchDbId, book,
           +(o3.home + j).toFixed(2),
           +(o3.away - j).toFixed(2),
           +(o3.draw + j * 0.4).toFixed(2)]
        );
      }
      await client.query(
        `INSERT INTO odds (match_id, sportsbook, bet_type, total_value, over_odds, under_odds)
         VALUES ($1,'Caliente','over_under',2.5,1.95,1.87)`,
        [matchDbId]
      );

      // Public betting (estimated)
      const homeT = Math.round(28 + Math.random() * 24);
      const drawT = Math.round(14 + Math.random() * 12);
      const awayT = 100 - homeT - drawT;
      await client.query(
        `INSERT INTO public_betting
           (match_id, bet_type, home_pct_bets, away_pct_bets, draw_pct_bets,
            home_pct_money, away_pct_money, draw_pct_money)
         VALUES ($1,'moneyline',$2,$3,$4,$5,$6,$7)`,
        [matchDbId,
          homeT, awayT, drawT,
          Math.min(95, Math.round(homeT * 1.08)),
          Math.max(5, Math.round(awayT * 0.93)),
          drawT]
      );

      // 5. Fetch match summary for lineups (ESPN includes them ~1h before kickoff)
      if (status !== 'finished') {
        console.log(`    [lineup] Fetching from ESPN summary...`);
        try {
          const summary = await fetchJson(ESPN_SUMMARY(event.id));
          const rosters = summary.rosters || [];

          for (const roster of rosters) {
            const rCode   = (roster.team?.abbreviation || '').toUpperCase();
            const teamDbId = rCode === homeTeam.code ? homeTeam.id : awayTeam.id;
            const entries  = roster.roster || [];
            const starters = entries.filter(e => e.starter);
            const bench    = entries.filter(e => !e.starter);

            if (!starters.length && !bench.length) continue;

            let posOrder = 1;
            for (const entry of starters) {
              const pid = await upsertPlayer(client, teamDbId, entry);
              await client.query(
                `INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
                 VALUES ($1,$2,$3,true,$4,90.0,'confirmed') ON CONFLICT DO NOTHING`,
                [matchDbId, teamDbId, pid, posOrder++]
              );
            }
            for (const entry of bench) {
              const pid = await upsertPlayer(client, teamDbId, entry);
              await client.query(
                `INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
                 VALUES ($1,$2,$3,false,$4,0.0,'confirmed') ON CONFLICT DO NOTHING`,
                [matchDbId, teamDbId, pid, posOrder++]
              );
            }
            console.log(`    [lineup] ${rCode}: ${starters.length} titulares, ${bench.length} banca`);
          }
        } catch (e) {
          console.log(`    [lineup] No confirmadas aún (${e.message.slice(0, 60)})`);
        }
      }
    }

    // 6. Recalculate win_pct for all WC teams
    await client.query(`
      UPDATE teams SET
        win_pct = CASE
          WHEN (wins + losses + ties) > 0
          THEN ROUND((wins::decimal + ties * 0.5) / (wins + losses + ties), 3)
          ELSE 0.500
        END
      WHERE league_id = $1
    `, [leagueDbId]);

    await client.query('COMMIT');
    console.log(`[sync-world-cup] ✓ ${events.length} partido(s) sincronizados.`);

  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  run().then(() => pool.end()).catch(e => { console.error('[sync-world-cup] Error:', e.message); pool.end(); process.exit(1); });
} else {
  module.exports = { run };
}
