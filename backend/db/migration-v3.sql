-- Migration V3: batter vs specific pitcher career stats
-- Run with: psql -U postgres -d outlier_mexicano -f backend/db/migration-v3.sql

CREATE TABLE IF NOT EXISTS batter_vs_pitcher (
  id              SERIAL PRIMARY KEY,
  match_id        INTEGER REFERENCES matches(id),
  batter_team_id  INTEGER REFERENCES teams(id),
  mlb_batter_id   INTEGER NOT NULL,
  mlb_pitcher_id  INTEGER NOT NULL,
  pitcher_name    VARCHAR(200),
  full_name       VARCHAR(200),
  ab              INTEGER,
  avg             DECIMAL(5,3),
  hr              INTEGER,
  rbi             INTEGER,
  ops             DECIMAL(5,3),
  k_pct           DECIMAL(5,2),
  season_from     INTEGER,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bvp_match ON batter_vs_pitcher(match_id);
