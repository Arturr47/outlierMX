--
-- PostgreSQL database dump
--

\restrict 7wQbW0Fz5O4vSQRRENW33cUWoMo7eJr2oO3zO47PghrbwPdaQKEvcYdQthDFShn

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: leagues; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.leagues (id, name, slug, country, sport, logo_url, active) VALUES (1, 'Liga MX', 'liga-mx', 'México', 'soccer', NULL, true);
INSERT INTO public.leagues (id, name, slug, country, sport, logo_url, active) VALUES (2, 'NBA', 'nba', 'USA', 'basketball', NULL, true);
INSERT INTO public.leagues (id, name, slug, country, sport, logo_url, active) VALUES (3, 'MLB', 'mlb', 'USA', 'baseball', NULL, true);
INSERT INTO public.leagues (id, name, slug, country, sport, logo_url, active) VALUES (4, 'NHL', 'nhl', 'USA', 'hockey', NULL, true);
INSERT INTO public.leagues (id, name, slug, country, sport, logo_url, active) VALUES (5, 'FIFA World Cup 2026', 'world-cup', 'Internacional', 'soccer', NULL, true);


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (1, 1, 'Club América', 'AME', NULL, 'Ciudad de México', 'Apertura', NULL, 10, 3, 4, 0.588, 'W3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (2, 1, 'Guadalajara (Chivas)', 'GDL', NULL, 'Guadalajara', 'Apertura', NULL, 8, 5, 4, 0.471, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (3, 1, 'Cruz Azul', 'CAZ', NULL, 'Ciudad de México', 'Apertura', NULL, 11, 2, 4, 0.647, 'W5');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (4, 1, 'Monterrey', 'MTY', NULL, 'Monterrey', 'Apertura', NULL, 9, 4, 4, 0.529, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (5, 1, 'Tigres UANL', 'TIG', NULL, 'Monterrey', 'Apertura', NULL, 10, 4, 3, 0.588, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (6, 1, 'Pumas UNAM', 'PUM', NULL, 'Ciudad de México', 'Apertura', NULL, 6, 7, 4, 0.353, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (7, 1, 'Santos Laguna', 'SAN', NULL, 'Torreón', 'Apertura', NULL, 5, 8, 4, 0.294, 'D1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (8, 1, 'León', 'LEO', NULL, 'León', 'Apertura', NULL, 7, 6, 4, 0.412, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (9, 1, 'Toluca', 'TOL', NULL, 'Toluca', 'Apertura', NULL, 9, 5, 3, 0.529, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (10, 1, 'Atlas', 'ATL', NULL, 'Guadalajara', 'Apertura', NULL, 4, 9, 4, 0.235, 'L3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (11, 1, 'Pachuca', 'PAC', NULL, 'Pachuca', 'Apertura', NULL, 8, 4, 5, 0.471, 'D2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (12, 1, 'Puebla', 'PUE', NULL, 'Puebla', 'Apertura', NULL, 3, 10, 4, 0.176, 'L4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (13, 2, 'Los Angeles Lakers', 'LAL', NULL, 'Los Angeles', 'Western', 'Pacific', 43, 33, 0, 0.566, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (14, 2, 'Golden State Warriors', 'GSW', NULL, 'San Francisco', 'Western', 'Pacific', 39, 37, 0, 0.513, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (15, 2, 'Boston Celtics', 'BOS', NULL, 'Boston', 'Eastern', 'Atlantic', 56, 20, 0, 0.737, 'W4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (16, 2, 'Miami Heat', 'MIA', NULL, 'Miami', 'Eastern', 'Southeast', 41, 35, 0, 0.539, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (17, 2, 'Dallas Mavericks', 'DAL', NULL, 'Dallas', 'Western', 'Southwest', 48, 28, 0, 0.632, 'W3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (18, 2, 'Denver Nuggets', 'DEN', NULL, 'Denver', 'Western', 'Northwest', 52, 24, 0, 0.684, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (19, 2, 'Milwaukee Bucks', 'MIL', NULL, 'Milwaukee', 'Eastern', 'Central', 46, 30, 0, 0.605, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (20, 2, 'Phoenix Suns', 'PHX', NULL, 'Phoenix', 'Western', 'Pacific', 44, 32, 0, 0.579, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (27, 4, 'Vegas Golden Knights', 'VGK', NULL, 'Las Vegas', 'Western', 'Pacific', 48, 22, 0, 0.686, 'W3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (28, 4, 'Florida Panthers', 'FLA', NULL, 'Sunrise', 'Eastern', 'Atlantic', 50, 20, 0, 0.714, 'W5');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (29, 4, 'Edmonton Oilers', 'EDM', NULL, 'Edmonton', 'Western', 'Pacific', 45, 25, 0, 0.643, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (30, 4, 'Dallas Stars', 'DAL', NULL, 'Dallas', 'Western', 'Central', 47, 23, 0, 0.671, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (31, 4, 'New York Rangers', 'NYR', NULL, 'New York', 'Eastern', 'Metropolitan', 42, 28, 0, 0.600, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (32, 4, 'Colorado Avalanche', 'COL', NULL, 'Denver', 'Western', 'Central', 49, 21, 0, 0.700, 'W4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (33, 3, 'Baltimore Orioles', 'BAL', NULL, 'Baltimore', NULL, NULL, 39, 46, 0, 0.459, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (48, 3, 'Chicago White Sox', 'CWS', NULL, 'Chicago White', NULL, NULL, 43, 39, 0, 0.524, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (26, 3, 'Philadelphia Phillies', 'PHI', NULL, 'Philadelphia', 'National', 'East', 47, 37, 0, 0.560, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (41, 3, 'Pittsburgh Pirates', 'PIT', NULL, 'Pittsburgh', NULL, NULL, 42, 42, 0, 0.500, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (22, 3, 'New York Yankees', 'NYY', NULL, 'New York', 'American', 'East', 48, 35, 0, 0.578, 'L4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (39, 3, 'Detroit Tigers', 'DET', NULL, 'Detroit', NULL, NULL, 35, 49, 0, 0.417, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (51, 3, 'Toronto Blue Jays', 'TOR', NULL, 'Toronto Blue', NULL, NULL, 39, 45, 0, 0.464, 'L6');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (38, 3, 'Boston Red Sox', 'BOS', NULL, 'Boston Red', NULL, NULL, 36, 46, 0, 0.439, 'W4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (42, 3, 'Washington Nationals', 'WSH', NULL, 'Washington', NULL, NULL, 43, 42, 0, 0.506, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (36, 3, 'Cleveland Guardians', 'CLE', NULL, 'Cleveland', NULL, NULL, 44, 40, 0, 0.524, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (50, 3, 'Milwaukee Brewers', 'MIL', NULL, 'Milwaukee', NULL, NULL, 50, 31, 0, 0.617, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (43, 3, 'Cincinnati Reds', 'CIN', NULL, 'Cincinnati', NULL, NULL, 39, 43, 0, 0.476, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (45, 3, 'Chicago Cubs', 'CHC', NULL, 'Chicago', NULL, NULL, 46, 38, 0, 0.548, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (37, 3, 'Minnesota Twins', 'MIN', NULL, 'Minnesota', NULL, NULL, 40, 45, 0, 0.471, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (57, 5, 'México', 'MEX', NULL, 'Ciudad de México', NULL, NULL, 1, 1, 1, 0.500, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (58, 5, 'Argentina', 'ARG', NULL, 'Buenos Aires', NULL, NULL, 2, 0, 1, 0.833, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (59, 5, 'España', 'ESP', NULL, 'Madrid', NULL, NULL, 2, 1, 0, 0.667, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (60, 5, 'Brasil', 'BRA', NULL, 'Río de Janeiro', NULL, NULL, 2, 0, 1, 0.833, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (61, 5, 'Francia', 'FRA', NULL, 'París', NULL, NULL, 3, 0, 0, 1.000, 'W3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (62, 5, 'Alemania', 'GER', NULL, 'Berlín', NULL, NULL, 2, 1, 0, 0.667, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (63, 5, 'Portugal', 'POR', NULL, 'Lisboa', NULL, NULL, 2, 0, 1, 0.833, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (64, 5, 'Inglaterra', 'ENG', NULL, 'Londres', NULL, NULL, 1, 1, 1, 0.500, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (65, 5, 'Uruguay', 'URU', NULL, 'Montevideo', NULL, NULL, 2, 1, 0, 0.667, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (66, 5, 'Colombia', 'COL', NULL, 'Bogotá', NULL, NULL, 1, 0, 2, 0.667, 'D1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (67, 5, 'Estados Unidos', 'USA', NULL, 'Kansas City', NULL, NULL, 2, 1, 0, 0.667, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (68, 5, 'Japón', 'JPN', NULL, 'Tokio', NULL, NULL, 2, 0, 1, 0.833, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (72, 5, 'South Africa', 'RSA', NULL, 'South Africa', NULL, NULL, 0, 1, 0, 0.000, '');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (73, 5, 'Canada', 'CAN', NULL, 'Canada', NULL, NULL, 1, 0, 0, 1.000, '');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (47, 3, 'Miami Marlins', 'MIA', NULL, 'Miami', NULL, NULL, 44, 40, 0, 0.524, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (46, 3, 'Los Angeles Angels', 'LAA', NULL, 'Los Angeles', NULL, NULL, 36, 49, 0, 0.424, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (69, 5, 'Paraguay', 'PAR', NULL, 'Paraguay', NULL, NULL, 0, 0, 0, 0.500, '');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (70, 5, 'Netherlands', 'NED', NULL, 'Netherlands', NULL, NULL, 0, 0, 0, 0.500, '');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (71, 5, 'Morocco', 'MAR', NULL, 'Morocco', NULL, NULL, 0, 0, 0, 0.500, '');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (56, 3, 'New York Mets', 'NYM', NULL, 'New York', NULL, NULL, 35, 49, 0, 0.417, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (55, 3, 'Texas Rangers', 'TEX', NULL, 'Texas', NULL, NULL, 42, 42, 0, 0.500, 'W4');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (25, 3, 'San Diego Padres', 'SD', NULL, 'San Diego', 'National', 'West', 43, 39, 0, 0.524, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (23, 3, 'Houston Astros', 'HOU', NULL, 'Houston', 'American', 'West', 42, 44, 0, 0.488, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (52, 3, 'Colorado Rockies', 'COL', NULL, 'Colorado', NULL, NULL, 33, 51, 0, 0.393, 'L1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (54, 3, 'Athletics', 'ATH', NULL, '', NULL, NULL, 40, 44, 0, 0.476, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (21, 3, 'Los Angeles Dodgers', 'LAD', NULL, 'Los Angeles', 'National', 'West', 54, 30, 0, 0.643, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (53, 3, 'Seattle Mariners', 'SEA', NULL, 'Seattle', NULL, NULL, 42, 43, 0, 0.494, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (34, 3, 'Arizona Diamondbacks', 'ARI', NULL, 'Arizona', NULL, NULL, 41, 42, 0, 0.494, 'L3');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (44, 3, 'San Francisco Giants', 'SF', NULL, 'San Francisco', NULL, NULL, 35, 48, 0, 0.422, 'W2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (24, 3, 'Atlanta Braves', 'ATL', NULL, 'Atlanta', 'National', 'East', 45, 22, 0, 0.672, 'L2');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (40, 3, 'Kansas City Royals', 'KC', NULL, 'Kansas City', NULL, NULL, 34, 49, 0, 0.410, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (35, 3, 'St. Louis Cardinals', 'STL', NULL, 'St. Louis', NULL, NULL, 36, 28, 0, 0.563, 'W1');
INSERT INTO public.teams (id, league_id, name, short_name, logo_url, city, conference, division, wins, losses, ties, win_pct, streak) VALUES (49, 3, 'Tampa Bay Rays', 'TB', NULL, 'Tampa Bay', NULL, NULL, 38, 25, 0, 0.603, 'W5');


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (1, 1, 'Henry Martín', 'Delantero', 21, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (2, 1, 'Alejandro Zendejas', 'Mediocampista', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (3, 1, 'Luis Fuentes', 'Defensa', 3, NULL, 'injured');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (4, 2, 'Chicharito Hernández', 'Delantero', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (5, 2, 'Fernando Beltrán', 'Mediocampista', 20, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (6, 13, 'LeBron James', 'SF', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (7, 13, 'Anthony Davis', 'PF/C', 3, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (8, 14, 'Stephen Curry', 'PG', 30, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (9, 14, 'Klay Thompson', 'SG', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (10, 3, 'Uriel Antuna', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (11, 3, 'Carlos Rodríguez', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (12, 3, 'Luis Abram', 'Defensa', 2, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (13, 4, 'Germán Berterame', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (14, 4, 'Sergio Canales', 'Mediocampista', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (15, 4, 'Stefan Medina', 'Defensa', 17, NULL, 'injured');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (16, 5, 'André-Pierre Gignac', 'Delantero', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (17, 5, 'Juan Brunetta', 'Mediocampista', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (18, 6, 'Guillermo Martínez', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (19, 6, 'César Huerta', 'Mediocampista', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (20, 15, 'Jayson Tatum', 'SF', 0, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (21, 15, 'Jaylen Brown', 'SG', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (22, 15, 'Derrick White', 'PG', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (23, 16, 'Jimmy Butler', 'SF', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (24, 16, 'Bam Adebayo', 'C', 13, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (25, 16, 'Tyler Herro', 'SG', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (26, 17, 'Luka Doncic', 'PG', 77, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (27, 17, 'Kyrie Irving', 'SG', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (28, 18, 'Nikola Jokic', 'C', 15, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (29, 18, 'Jamal Murray', 'PG', 27, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (30, 21, 'Shohei Ohtani', 'DH', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (31, 21, 'Mookie Betts', 'SS', 50, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (32, 21, 'Freddie Freeman', '1B', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (33, 22, 'Aaron Judge', 'RF', 99, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (34, 22, 'Juan Soto', 'LF', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (35, 27, 'Jack Eichel', 'C', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (36, 27, 'Mark Stone', 'RW', 61, NULL, 'injured');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (37, 28, 'Aleksander Barkov', 'C', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (38, 28, 'Matthew Tkachuk', 'LW', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (39, 57, 'Guillermo Ochoa', 'Portero', 13, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (40, 57, 'Jorge Sánchez', 'Defensa', 2, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (41, 57, 'César Montes', 'Defensa', 3, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (42, 57, 'Kevin Álvarez', 'Defensa', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (43, 57, 'Gerardo Arteaga', 'Defensa', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (44, 57, 'Edson Álvarez', 'Mediocampista', 4, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (45, 57, 'Charly Rodríguez', 'Mediocampista', 20, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (46, 57, 'Roberto Alvarado', 'Mediocampista', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (47, 57, 'Hirving Lozano', 'Delantero', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (48, 57, 'Santiago Giménez', 'Delantero', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (49, 57, 'Raúl Jiménez', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (50, 57, 'Luis Ángel Malagón', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (51, 57, 'Orbelín Pineda', 'Mediocampista', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (52, 57, 'Uriel Antuna', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (53, 57, 'Henry Martín', 'Delantero', 21, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (54, 58, 'Emiliano Martínez', 'Portero', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (55, 58, 'Nahuel Molina', 'Defensa', 26, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (56, 58, 'Cristian Romero', 'Defensa', 13, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (57, 58, 'Nicolás Otamendi', 'Defensa', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (58, 58, 'Marcos Acuña', 'Defensa', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (59, 58, 'Rodrigo De Paul', 'Mediocampista', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (60, 58, 'Leandro Paredes', 'Mediocampista', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (61, 58, 'Enzo Fernández', 'Mediocampista', 24, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (62, 58, 'Lionel Messi', 'Delantero', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (63, 58, 'Julián Álvarez', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (64, 58, 'Lautaro Martínez', 'Delantero', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (65, 58, 'Geronimo Rulli', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (66, 58, 'Ángel Di María', 'Delantero', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (67, 58, 'Paulo Dybala', 'Delantero', 21, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (68, 58, 'Mac Allister', 'Mediocampista', 20, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (69, 59, 'Unai Simón', 'Portero', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (70, 59, 'Dani Carvajal', 'Defensa', 2, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (71, 59, 'Nacho', 'Defensa', 4, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (72, 59, 'Aymeric Laporte', 'Defensa', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (73, 59, 'Jordi Alba', 'Defensa', 18, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (74, 59, 'Rodri', 'Mediocampista', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (75, 59, 'Pedri', 'Mediocampista', 26, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (76, 59, 'Gavi', 'Mediocampista', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (77, 59, 'Lamine Yamal', 'Delantero', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (78, 59, 'Álvaro Morata', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (79, 59, 'Ferran Torres', 'Delantero', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (80, 59, 'David Raya', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (81, 59, 'Marco Asensio', 'Delantero', 20, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (82, 59, 'Mikel Oyarzabal', 'Delantero', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (83, 59, 'Fabián Ruiz', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (84, 60, 'Alisson', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (85, 60, 'Danilo', 'Defensa', 2, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (86, 60, 'Marquinhos', 'Defensa', 4, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (87, 60, 'Gabriel Magalhães', 'Defensa', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (88, 60, 'Renan Lodi', 'Defensa', 6, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (89, 60, 'Casemiro', 'Mediocampista', 18, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (90, 60, 'Bruno Guimarães', 'Mediocampista', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (91, 60, 'Lucas Paquetá', 'Mediocampista', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (92, 60, 'Vinícius Jr', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (93, 60, 'Rodrygo', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (94, 60, 'Raphinha', 'Delantero', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (95, 60, 'Ederson', 'Portero', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (96, 60, 'Endrick', 'Delantero', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (97, 60, 'Gabriel Martinelli', 'Delantero', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (98, 60, 'Fred', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (99, 61, 'Mike Maignan', 'Portero', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (100, 61, 'Benjamin Pavard', 'Defensa', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (101, 61, 'Raphaël Varane', 'Defensa', 4, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (102, 61, 'Dayot Upamecano', 'Defensa', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (103, 61, 'Théo Hernandez', 'Defensa', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (104, 61, 'N''Golo Kanté', 'Mediocampista', 13, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (105, 61, 'Aurélien Tchouaméni', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (106, 61, 'Antoine Griezmann', 'Mediocampista', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (107, 61, 'Ousmane Dembélé', 'Delantero', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (108, 61, 'Kylian Mbappé', 'Delantero', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (109, 61, 'Marcus Thuram', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (110, 61, 'Alphonse Areola', 'Portero', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (111, 61, 'Randal Kolo Muani', 'Delantero', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (112, 61, 'Eduardo Camavinga', 'Mediocampista', 18, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (113, 61, 'Matteo Guendouzi', 'Mediocampista', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (114, 62, 'Manuel Neuer', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (115, 62, 'Joshua Kimmich', 'Defensa', 6, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (116, 62, 'Antonio Rüdiger', 'Defensa', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (117, 62, 'Niklas Süle', 'Defensa', 15, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (118, 62, 'David Raum', 'Defensa', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (119, 62, 'Toni Kroos', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (120, 62, 'Florian Wirtz', 'Mediocampista', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (121, 62, 'Jamal Musiala', 'Mediocampista', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (122, 62, 'Leroy Sané', 'Delantero', 19, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (123, 62, 'Kai Havertz', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (124, 62, 'Thomas Müller', 'Delantero', 25, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (125, 62, 'Marc-André ter Stegen', 'Portero', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (126, 62, 'Serge Gnabry', 'Delantero', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (127, 62, 'Ilkay Gündogan', 'Mediocampista', 21, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (128, 62, 'Christopher Nkunku', 'Delantero', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (129, 63, 'Rui Patrício', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (130, 63, 'João Cancelo', 'Defensa', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (131, 63, 'Rúben Dias', 'Defensa', 6, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (132, 63, 'Pepe', 'Defensa', 3, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (133, 63, 'Nuno Mendes', 'Defensa', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (134, 63, 'Bernardo Silva', 'Mediocampista', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (135, 63, 'Bruno Fernandes', 'Mediocampista', 8, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (136, 63, 'William Carvalho', 'Mediocampista', 14, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (137, 63, 'Rafael Leão', 'Delantero', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (138, 63, 'Cristiano Ronaldo', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (139, 63, 'João Félix', 'Delantero', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (140, 63, 'Diogo Costa', 'Portero', 99, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (141, 63, 'Diogo Jota', 'Delantero', 20, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (142, 63, 'André Silva', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (143, 63, 'Otávio', 'Mediocampista', 16, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (144, 64, 'Jordan Pickford', 'Portero', 1, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (145, 64, 'Kyle Walker', 'Defensa', 2, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (146, 64, 'Harry Maguire', 'Defensa', 6, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (147, 64, 'John Stones', 'Defensa', 5, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (148, 64, 'Luke Shaw', 'Defensa', 23, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (149, 64, 'Declan Rice', 'Mediocampista', 41, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (150, 64, 'Jude Bellingham', 'Mediocampista', 22, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (151, 64, 'Phil Foden', 'Mediocampista', 47, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (152, 64, 'Bukayo Saka', 'Delantero', 17, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (153, 64, 'Harry Kane', 'Delantero', 9, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (154, 64, 'Marcus Rashford', 'Delantero', 10, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (155, 64, 'Aaron Ramsdale', 'Portero', 13, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (156, 64, 'Raheem Sterling', 'Delantero', 7, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (157, 64, 'Jack Grealish', 'Mediocampista', 11, NULL, 'active');
INSERT INTO public.players (id, team_id, name, "position", number, photo_url, status) VALUES (158, 64, 'Trent Alexander-Arnold', 'Defensa', 66, NULL, 'active');


--
-- Name: leagues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leagues_id_seq', 5, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.players_id_seq', 158, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teams_id_seq', 73, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 7wQbW0Fz5O4vSQRRENW33cUWoMo7eJr2oO3zO47PghrbwPdaQKEvcYdQthDFShn

