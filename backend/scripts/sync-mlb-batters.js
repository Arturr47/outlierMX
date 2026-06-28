// Sync hitting stats (season + vs RHP + vs LHP + vs opposing pitcher) for all teams playing today.
// Usage: node scripts/sync-mlb-batters.js [YYYY-MM-DD] [SEASON]

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const SEASON = parseInt(process.argv[3] || new Date(DATE).getUTCFullYear());

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
}

function parseNum(v) {
  if (v == null || v === '-.--' || v === '') return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function kPct(stat) {
  const pa = stat.plateAppearances || 0;
  const k = stat.strikeOuts || 0;
  return pa > 0 ? +(k * 100 / pa).toFixed(2) : null;
}

async function fetchTeamHitters(mlbTeamId) {
  // 1. Roster to get player names + positions + bats hand
  const roster = await fetchJson(`https://statsapi.mlb.com/api/v1/teams/${mlbTeamId}/roster?rosterType=active&season=${SEASON}`);
  const byId = new Map();
  for (const r of roster.roster || []) {
    if (r.position.abbreviation === 'P' || r.position.abbreviation === 'TWP') continue;
    byId.set(r.person.id, { fullName: r.person.fullName, position: r.position.abbreviation, bats: null });
  }

  // 2. Season hitting stats by player
  const season = await fetchJson(`https://statsapi.mlb.com/api/v1/stats?stats=season&group=hitting&teamId=${mlbTeamId}&season=${SEASON}&sportId=1&limit=200&playerPool=All`);
  for (const sp of season.stats?.[0]?.splits || []) {
    const pid = sp.player?.id;
    if (!byId.has(pid)) continue;
    const e = byId.get(pid);
    e.season = {
      ab: sp.stat.atBats || 0,
      avg: parseNum(sp.stat.avg),
      hr: sp.stat.homeRuns || 0,
      rbi: sp.stat.rbi || 0,
      ops: parseNum(sp.stat.ops),
      kpct: kPct(sp.stat),
    };
  }

  // 3. Splits vs RHP/LHP
  const splits = await fetchJson(`https://statsapi.mlb.com/api/v1/stats?stats=statSplits&group=hitting&teamId=${mlbTeamId}&season=${SEASON}&sitCodes=vr,vl&sportId=1&limit=400&playerPool=All`);
  for (const sp of splits.stats?.[0]?.splits || []) {
    const pid = sp.player?.id;
    if (!byId.has(pid)) continue;
    const code = sp.split?.code; // vr or vl
    const payload = {
      ab: sp.stat.atBats || 0,
      avg: parseNum(sp.stat.avg),
      hr: sp.stat.homeRuns || 0,
      rbi: sp.stat.rbi || 0,
      ops: parseNum(sp.stat.ops),
      kpct: kPct(sp.stat),
    };
    const e = byId.get(pid);
    if (code === 'vr') e.vr = payload;
    else if (code === 'vl') e.vl = payload;
  }

  // 4. Bats hand via roster (needs hydrate) — fetch people in one call
  const ids = [...byId.keys()];
  if (ids.length) {
    const people = await fetchJson(`https://statsapi.mlb.com/api/v1/people?personIds=${ids.join(',')}`);
    for (const p of people.people || []) {
      if (byId.has(p.id)) byId.get(p.id).bats = p.batSide?.code || null;
    }
  }

  // Keep only players with at-bats this season
  return [...byId.entries()]
    .filter(([, e]) => e.season && e.season.ab > 0)
    .map(([mlbId, e]) => ({ mlbId, ...e }));
}

// Fetch career stats for each batter against a specific pitcher
async function fetchBatterVsPitcher(batters, mlbPitcherId, pitcherName, matchId, dbTeamId, client) {
  await client.query(
    `DELETE FROM batter_vs_pitcher WHERE match_id=$1 AND batter_team_id=$2 AND mlb_pitcher_id=$3`,
    [matchId, dbTeamId, mlbPitcherId]
  );

  let seasonFrom = null;

  for (const batter of batters) {
    let data;
    try {
      data = await fetchJson(
        `https://statsapi.mlb.com/api/v1/people/${batter.mlbId}/stats?stats=vsPlayer&group=hitting&opposingPlayerId=${mlbPitcherId}`
      );
    } catch { continue; }

    const splits = data.stats?.[0]?.splits || [];
    if (!splits.length) {
      // Insert a null row so we know we checked
      await client.query(
        `INSERT INTO batter_vs_pitcher
          (match_id, batter_team_id, mlb_batter_id, mlb_pitcher_id, pitcher_name, full_name,
           ab, avg, hr, rbi, ops, k_pct, season_from)
         VALUES ($1,$2,$3,$4,$5,$6,0,null,0,0,null,null,null)`,
        [matchId, dbTeamId, batter.mlbId, mlbPitcherId, pitcherName, batter.fullName]
      );
      continue;
    }

    // Aggregate career totals across all splits
    let totalAb = 0, totalHits = 0, totalHr = 0, totalRbi = 0, totalK = 0, totalPa = 0, totalTb = 0;
    let minSeason = null;

    for (const sp of splits) {
      const s = sp.stat;
      totalAb   += s.atBats       || 0;
      totalHits += s.hits         || 0;
      totalHr   += s.homeRuns     || 0;
      totalRbi  += s.rbi          || 0;
      totalK    += s.strikeOuts   || 0;
      totalPa   += s.plateAppearances || 0;
      totalTb   += s.totalBases   || 0;
      const yr = sp.season ? parseInt(sp.season) : null;
      if (yr && (!minSeason || yr < minSeason)) minSeason = yr;
    }

    const avg = totalAb > 0 ? +(totalHits / totalAb).toFixed(3) : null;
    const obp = totalPa > 0 ? +((totalHits + (splits[0]?.stat?.baseOnBalls || 0) + (splits[0]?.stat?.hitByPitch || 0)) / totalPa).toFixed(3) : null;
    const slg = totalAb > 0 ? +(totalTb / totalAb).toFixed(3) : null;
    const ops = (obp != null && slg != null) ? +(obp + slg).toFixed(3) : null;
    const kpct = totalPa > 0 ? +(totalK * 100 / totalPa).toFixed(2) : null;

    if (!seasonFrom || (minSeason && minSeason < seasonFrom)) seasonFrom = minSeason;

    await client.query(
      `INSERT INTO batter_vs_pitcher
        (match_id, batter_team_id, mlb_batter_id, mlb_pitcher_id, pitcher_name, full_name,
         ab, avg, hr, rbi, ops, k_pct, season_from)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [matchId, dbTeamId, batter.mlbId, mlbPitcherId, pitcherName, batter.fullName,
       totalAb, avg, totalHr, totalRbi, ops, kpct, minSeason]
    );
  }
}

async function run() {
  const client = await pool.connect();
  try {
    // Find all teams playing on DATE (in MX TZ) with their match and opposing probable pitcher
    const res = await client.query(
      `SELECT DISTINCT t.id AS db_id, t.name FROM matches m
         JOIN teams t ON t.id IN (m.home_team_id, m.away_team_id)
        WHERE m.league_id=3
          AND DATE(m.match_date AT TIME ZONE 'America/Mexico_City')=$1`,
      [DATE]
    );
    if (!res.rows.length) {
      console.log('No MLB teams play on', DATE);
      return;
    }
    console.log(`Syncing batters for ${res.rows.length} teams (${SEASON})...`);
    const teamsList = await fetchJson(`https://statsapi.mlb.com/api/v1/teams?sportId=1&season=${SEASON}`);

    // Load matches + probable pitchers for this date so we can do batter vs pitcher
    const matchesRes = await client.query(
      `SELECT m.id as match_id, m.home_team_id, m.away_team_id,
              pp.mlb_player_id as pitcher_mlb_id, pp.full_name as pitcher_name,
              pp.team_id as pitcher_team_id
         FROM matches m
         LEFT JOIN probable_pitchers pp ON pp.match_id = m.id
        WHERE m.league_id=3
          AND DATE(m.match_date AT TIME ZONE 'America/Mexico_City')=$1`,
      [DATE]
    );

    // Build map: battingTeamId -> { matchId, opposingPitcherMlbId, pitcherName }
    const pitcherForTeam = new Map();
    for (const row of matchesRes.rows) {
      if (!row.pitcher_mlb_id) continue;
      // The pitcher belongs to pitcher_team_id; the batting team is the other one
      const battingTeamId = row.pitcher_team_id === row.home_team_id ? row.away_team_id : row.home_team_id;
      pitcherForTeam.set(battingTeamId, {
        matchId: row.match_id,
        pitcherMlbId: row.pitcher_mlb_id,
        pitcherName: row.pitcher_name,
      });
    }

    for (const { db_id, name } of res.rows) {
      const mlbTeam = teamsList.teams.find(t => t.name === name);
      if (!mlbTeam) { console.warn(`  skip (no mlb team match): ${name}`); continue; }

      const hitters = await fetchTeamHitters(mlbTeam.id);
      await client.query(`DELETE FROM team_batters_splits WHERE team_id=$1 AND season_year=$2`, [db_id, SEASON]);
      for (const h of hitters) {
        await client.query(
          `INSERT INTO team_batters_splits
            (team_id, mlb_player_id, full_name, position, bats, season_year,
             season_ab, season_avg, season_hr, season_rbi, season_ops, season_k_pct,
             vr_ab, vr_avg, vr_hr, vr_rbi, vr_ops, vr_k_pct,
             vl_ab, vl_avg, vl_hr, vl_rbi, vl_ops, vl_k_pct)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)`,
          [
            db_id, h.mlbId, h.fullName, h.position, h.bats, SEASON,
            h.season?.ab, h.season?.avg, h.season?.hr, h.season?.rbi, h.season?.ops, h.season?.kpct,
            h.vr?.ab ?? null, h.vr?.avg ?? null, h.vr?.hr ?? null, h.vr?.rbi ?? null, h.vr?.ops ?? null, h.vr?.kpct ?? null,
            h.vl?.ab ?? null, h.vl?.avg ?? null, h.vl?.hr ?? null, h.vl?.rbi ?? null, h.vl?.ops ?? null, h.vl?.kpct ?? null,
          ]
        );
      }
      console.log(`  ✓ ${name}: ${hitters.length} batters`);

      // Sync batter vs opposing pitcher career stats
      const pitcherInfo = pitcherForTeam.get(db_id);
      if (pitcherInfo) {
        console.log(`  → fetching vs ${pitcherInfo.pitcherName} (id ${pitcherInfo.pitcherMlbId}) for ${name}...`);
        try {
          await fetchBatterVsPitcher(hitters, pitcherInfo.pitcherMlbId, pitcherInfo.pitcherName, pitcherInfo.matchId, db_id, client);
          console.log(`    ✓ batter vs pitcher done`);
        } catch (e) {
          console.warn(`    ✗ batter vs pitcher failed: ${e.message}`);
        }
      }
    }
  } catch (err) {
    console.error('ERROR:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
