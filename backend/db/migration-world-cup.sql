-- ============================================================
-- World Cup 2026 — Full seed
-- Run: PGPASSWORD=Artur47 psql -U postgres -d outlier_mexicano -f migration-world-cup.sql
-- ============================================================

-- League
INSERT INTO leagues (name, slug, country, sport)
VALUES ('FIFA World Cup 2026', 'world-cup', 'Internacional', 'soccer')
ON CONFLICT (slug) DO NOTHING;

-- ── Teams ────────────────────────────────────────────────────
INSERT INTO teams (league_id, name, short_name, city, wins, losses, ties, win_pct, streak) VALUES
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'México',       'MEX', 'Ciudad de México', 1, 1, 1, 0.333, 'W1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Argentina',    'ARG', 'Buenos Aires',     2, 0, 1, 0.833, 'W2'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'España',       'ESP', 'Madrid',           2, 1, 0, 0.667, 'L1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Brasil',       'BRA', 'Río de Janeiro',   2, 0, 1, 0.833, 'W1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Francia',      'FRA', 'París',            3, 0, 0, 1.000, 'W3'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Alemania',     'GER', 'Berlín',           2, 1, 0, 0.667, 'W1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Portugal',     'POR', 'Lisboa',           2, 0, 1, 0.833, 'W1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Inglaterra',   'ENG', 'Londres',          1, 1, 1, 0.333, 'L1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Uruguay',      'URU', 'Montevideo',       2, 1, 0, 0.667, 'W2'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Colombia',     'COL', 'Bogotá',           1, 0, 2, 0.667, 'D1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Estados Unidos','USA','Kansas City',      2, 1, 0, 0.667, 'W1'),
  ((SELECT id FROM leagues WHERE slug='world-cup'), 'Japón',        'JPN', 'Tokio',            2, 0, 1, 0.833, 'W2');

-- ── Matches (4 total — 2 today June 28, 2 tomorrow June 29) ──
INSERT INTO matches (league_id, home_team_id, away_team_id, match_date, status, venue) VALUES
  (
    (SELECT id FROM leagues WHERE slug='world-cup'),
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2026-06-28 21:00:00',
    'scheduled',
    'SoFi Stadium, Los Angeles'
  ),
  (
    (SELECT id FROM leagues WHERE slug='world-cup'),
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2026-06-29 00:00:00',
    'scheduled',
    'MetLife Stadium, Nueva York'
  ),
  (
    (SELECT id FROM leagues WHERE slug='world-cup'),
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2026-06-29 21:00:00',
    'scheduled',
    'AT&T Stadium, Dallas'
  ),
  (
    (SELECT id FROM leagues WHERE slug='world-cup'),
    (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2026-06-30 01:00:00',
    'scheduled',
    'Rose Bowl, Pasadena'
  );

-- ── Players ───────────────────────────────────────────────────

-- México (11 starters + 4 bench)
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Guillermo Ochoa',       'Portero',       13, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jorge Sánchez',         'Defensa',        2, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'César Montes',          'Defensa',        3, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Kevin Álvarez',         'Defensa',        5, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Gerardo Arteaga',       'Defensa',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Edson Álvarez',         'Mediocampista',  4, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Charly Rodríguez',      'Mediocampista', 20, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Roberto Alvarado',      'Mediocampista', 16, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Hirving Lozano',        'Delantero',     22, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Santiago Giménez',      'Delantero',     11, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Raúl Jiménez',          'Delantero',      9, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Luis Ángel Malagón',    'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Orbelín Pineda',        'Mediocampista', 14, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Uriel Antuna',          'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Henry Martín',          'Delantero',     21, 'active');

-- Argentina
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Emiliano Martínez',     'Portero',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Nahuel Molina',         'Defensa',       26, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Cristian Romero',       'Defensa',       13, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Nicolás Otamendi',      'Defensa',       19, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marcos Acuña',          'Defensa',        8, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rodrigo De Paul',       'Mediocampista',  7, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Leandro Paredes',       'Mediocampista',  5, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Enzo Fernández',        'Mediocampista', 24, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Lionel Messi',          'Delantero',     10, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Julián Álvarez',        'Delantero',      9, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Lautaro Martínez',      'Delantero',     22, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Geronimo Rulli',        'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Ángel Di María',        'Delantero',     11, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Paulo Dybala',          'Delantero',     21, 'active'),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Mac Allister',          'Mediocampista', 20, 'active');

-- España
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Unai Simón',            'Portero',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Dani Carvajal',         'Defensa',        2, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Nacho',                 'Defensa',        4, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Aymeric Laporte',       'Defensa',       14, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jordi Alba',            'Defensa',       18, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rodri',                 'Mediocampista', 16, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Pedri',                 'Mediocampista', 26, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Gavi',                  'Mediocampista',  9, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Lamine Yamal',          'Delantero',     19, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Álvaro Morata',         'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Ferran Torres',         'Delantero',     11, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'David Raya',            'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marco Asensio',         'Delantero',     20, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Mikel Oyarzabal',       'Delantero',     17, 'active'),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Fabián Ruiz',           'Mediocampista',  8, 'active');

-- Brasil
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Alisson',               'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Danilo',                'Defensa',        2, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marquinhos',            'Defensa',        4, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Gabriel Magalhães',     'Defensa',        5, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Renan Lodi',            'Defensa',        6, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Casemiro',              'Mediocampista', 18, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Bruno Guimarães',       'Mediocampista', 17, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Lucas Paquetá',         'Mediocampista', 11, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Vinícius Jr',           'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rodrygo',               'Delantero',      9, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Raphinha',              'Delantero',     19, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Ederson',               'Portero',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Endrick',               'Delantero',     16, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Gabriel Martinelli',    'Delantero',     14, 'active'),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Fred',                  'Mediocampista',  8, 'active');

-- Francia
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Mike Maignan',          'Portero',       16, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Benjamin Pavard',       'Defensa',        5, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Raphaël Varane',        'Defensa',        4, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Dayot Upamecano',       'Defensa',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Théo Hernandez',        'Defensa',       22, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'N''Golo Kanté',         'Mediocampista', 13, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Aurélien Tchouaméni',  'Mediocampista',  8, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Antoine Griezmann',     'Mediocampista',  7, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Ousmane Dembélé',       'Delantero',     11, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Kylian Mbappé',         'Delantero',     10, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marcus Thuram',         'Delantero',      9, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Alphonse Areola',       'Portero',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Randal Kolo Muani',     'Delantero',     14, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Eduardo Camavinga',     'Mediocampista', 18, 'active'),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Matteo Guendouzi',      'Mediocampista', 19, 'active');

-- Alemania
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Manuel Neuer',          'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Joshua Kimmich',        'Defensa',        6, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Antonio Rüdiger',       'Defensa',       16, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Niklas Süle',           'Defensa',       15, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'David Raum',            'Defensa',       19, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Toni Kroos',            'Mediocampista',  8, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Florian Wirtz',         'Mediocampista', 10, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jamal Musiala',         'Mediocampista', 14, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Leroy Sané',            'Delantero',     19, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Kai Havertz',           'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Thomas Müller',         'Delantero',     25, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marc-André ter Stegen', 'Portero',       22, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Serge Gnabry',          'Delantero',     10, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Ilkay Gündogan',        'Mediocampista', 21, 'active'),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Christopher Nkunku',    'Delantero',     14, 'active');

-- Portugal
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rui Patrício',          'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'João Cancelo',          'Defensa',        5, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rúben Dias',            'Defensa',        6, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Pepe',                  'Defensa',        3, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Nuno Mendes',           'Defensa',       22, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Bernardo Silva',        'Mediocampista', 10, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Bruno Fernandes',       'Mediocampista',  8, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'William Carvalho',      'Mediocampista', 14, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Rafael Leão',           'Delantero',     17, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Cristiano Ronaldo',     'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'João Félix',            'Delantero',     11, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Diogo Costa',           'Portero',       99, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Diogo Jota',            'Delantero',     20, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'André Silva',           'Delantero',      9, 'active'),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Otávio',                'Mediocampista', 16, 'active');

-- Inglaterra
INSERT INTO players (team_id, name, position, number, status) VALUES
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jordan Pickford',       'Portero',        1, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Kyle Walker',           'Defensa',        2, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Harry Maguire',         'Defensa',        6, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'John Stones',           'Defensa',        5, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Luke Shaw',             'Defensa',       23, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Declan Rice',           'Mediocampista', 41, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jude Bellingham',       'Mediocampista', 22, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Phil Foden',            'Mediocampista', 47, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Bukayo Saka',           'Delantero',     17, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Harry Kane',            'Delantero',      9, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Marcus Rashford',       'Delantero',     10, 'active'),
  -- bench
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Aaron Ramsdale',        'Portero',       13, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Raheem Sterling',       'Delantero',      7, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Jack Grealish',         'Mediocampista', 11, 'active'),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), 'Trent Alexander-Arnold','Defensa',       66, 'active');

-- ── Lineups ───────────────────────────────────────────────────
-- Match 17: México vs Argentina (match_date = '2026-06-28 21:00:00')

-- Mexico starters
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  true,
  ROW_NUMBER() OVER (ORDER BY p.number),
  90.0,
  'confirmed'
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN players p ON p.team_id = ht.id
JOIN leagues l ON ht.league_id = l.id
WHERE l.slug = 'world-cup' AND ht.short_name = 'MEX'
  AND m.match_date = '2026-06-28 21:00:00'
  AND p.number IN (13, 2, 3, 5, 23, 4, 20, 16, 22, 11, 9);

-- Mexico bench
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  false,
  12 + ROW_NUMBER() OVER (ORDER BY p.number),
  0.0,
  'confirmed'
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN players p ON p.team_id = ht.id
JOIN leagues l ON ht.league_id = l.id
WHERE l.slug = 'world-cup' AND ht.short_name = 'MEX'
  AND m.match_date = '2026-06-28 21:00:00'
  AND p.number IN (1, 14, 7, 21);

-- Argentina starters
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  true,
  ROW_NUMBER() OVER (ORDER BY p.number),
  90.0,
  'confirmed'
FROM matches m
JOIN teams at ON m.away_team_id = at.id
JOIN players p ON p.team_id = at.id
JOIN leagues l ON at.league_id = l.id
WHERE l.slug = 'world-cup' AND at.short_name = 'ARG'
  AND m.match_date = '2026-06-28 21:00:00'
  AND p.number IN (23, 26, 13, 19, 8, 7, 5, 24, 10, 9, 22);

-- Argentina bench
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  false,
  12 + ROW_NUMBER() OVER (ORDER BY p.number),
  0.0,
  'confirmed'
FROM matches m
JOIN teams at ON m.away_team_id = at.id
JOIN players p ON p.team_id = at.id
JOIN leagues l ON at.league_id = l.id
WHERE l.slug = 'world-cup' AND at.short_name = 'ARG'
  AND m.match_date = '2026-06-28 21:00:00'
  AND p.number IN (1, 11, 21, 20);

-- Match 18: España vs Brasil
-- España starters
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  true,
  ROW_NUMBER() OVER (ORDER BY p.number),
  90.0,
  'confirmed'
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN players p ON p.team_id = ht.id
JOIN leagues l ON ht.league_id = l.id
WHERE l.slug = 'world-cup' AND ht.short_name = 'ESP'
  AND m.match_date = '2026-06-29 00:00:00'
  AND p.number IN (23, 2, 4, 14, 18, 16, 26, 9, 19, 7, 11);

-- España bench
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  false,
  12 + ROW_NUMBER() OVER (ORDER BY p.number),
  0.0,
  'confirmed'
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN players p ON p.team_id = ht.id
JOIN leagues l ON ht.league_id = l.id
WHERE l.slug = 'world-cup' AND ht.short_name = 'ESP'
  AND m.match_date = '2026-06-29 00:00:00'
  AND p.number IN (1, 20, 17, 8);

-- Brasil starters
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  true,
  ROW_NUMBER() OVER (ORDER BY p.number),
  90.0,
  'confirmed'
FROM matches m
JOIN teams at ON m.away_team_id = at.id
JOIN players p ON p.team_id = at.id
JOIN leagues l ON at.league_id = l.id
WHERE l.slug = 'world-cup' AND at.short_name = 'BRA'
  AND m.match_date = '2026-06-29 00:00:00'
  AND p.number IN (1, 2, 4, 5, 6, 18, 17, 11, 7, 9, 19);

-- Brasil bench
INSERT INTO lineups (match_id, team_id, player_id, is_starter, position_order, minutes_projected, status)
SELECT
  m.id,
  (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
  p.id,
  false,
  12 + ROW_NUMBER() OVER (ORDER BY p.number),
  0.0,
  'confirmed'
FROM matches m
JOIN teams at ON m.away_team_id = at.id
JOIN players p ON p.team_id = at.id
JOIN leagues l ON at.league_id = l.id
WHERE l.slug = 'world-cup' AND at.short_name = 'BRA'
  AND m.match_date = '2026-06-29 00:00:00'
  AND p.number IN (23, 16, 14, 8);

-- ── Injuries ──────────────────────────────────────────────────
INSERT INTO injuries (player_id, team_id, injury_type, status, expected_return) VALUES
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='MEX' AND p.number=22),
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Molestia en muslo derecho', 'questionable', '2026-06-28'
  ),
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='ARG' AND p.number=22),
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Esguince de tobillo', 'probable', '2026-06-28'
  ),
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='ESP' AND p.number=4),
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Fiebre', 'doubtful', '2026-06-28'
  ),
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='BRA' AND p.number=18),
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Tarjeta amarilla acumulada', 'out', '2026-06-29'
  ),
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='FRA' AND p.number=4),
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Sobrecarga muscular', 'questionable', '2026-06-29'
  ),
  (
    (SELECT p.id FROM players p JOIN teams t ON p.team_id = t.id JOIN leagues l ON t.league_id = l.id WHERE l.slug='world-cup' AND t.short_name='ENG' AND p.number=23),
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    'Lesión de rodilla', 'out', '2026-07-05'
  );

-- ── H2H ──────────────────────────────────────────────────────
-- México vs Argentina
INSERT INTO h2h_records (team_a_id, team_b_id, match_date, score_a, score_b, league_id) VALUES
  (
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2022-11-26', 0, 2, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2019-09-10', 4, 0, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2018-09-08', 0, 2, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2010-06-27', 3, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2004-06-06', 1, 0, (SELECT id FROM leagues WHERE slug='world-cup')
  );

-- España vs Brasil
INSERT INTO h2h_records (team_a_id, team_b_id, match_date, score_a, score_b, league_id) VALUES
  (
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2013-06-30', 0, 3, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2010-07-11', 0, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2022-03-26', 1, 3, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2018-03-27', 0, 0, (SELECT id FROM leagues WHERE slug='world-cup')
  );

-- Francia vs Alemania
INSERT INTO h2h_records (team_a_id, team_b_id, match_date, score_a, score_b, league_id) VALUES
  (
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2021-06-15', 1, 0, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2014-07-04', 0, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2022-09-25', 2, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2018-11-14', 2, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  );

-- Portugal vs Inglaterra
INSERT INTO h2h_records (team_a_id, team_b_id, match_date, score_a, score_b, league_id) VALUES
  (
    (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2022-12-10', 1, 0, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2006-07-01', 0, 3, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2024-07-04', 1, 1, (SELECT id FROM leagues WHERE slug='world-cup')
  ),
  (
    (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')),
    '2004-06-24', 1, 2, (SELECT id FROM leagues WHERE slug='world-cup')
  );

-- ── Odds (with draw_odds) ─────────────────────────────────────

-- Match 17: México vs Argentina
INSERT INTO odds (match_id, sportsbook, bet_type, home_odds, away_odds, draw_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'moneyline', 4.20, 1.75, 3.50),
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'moneyline', 4.10, 1.78, 3.55),
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Betcris',  'moneyline', 4.30, 1.72, 3.45);

INSERT INTO odds (match_id, sportsbook, bet_type, total_value, over_odds, under_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'over_under', 2.5, 2.05, 1.80),
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'over_under', 2.5, 2.10, 1.77);

-- Match 18: España vs Brasil
INSERT INTO odds (match_id, sportsbook, bet_type, home_odds, away_odds, draw_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'moneyline', 2.40, 2.70, 3.30),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'moneyline', 2.45, 2.65, 3.35),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Betcris',  'moneyline', 2.35, 2.75, 3.25);

INSERT INTO odds (match_id, sportsbook, bet_type, total_value, over_odds, under_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'over_under', 2.5, 1.95, 1.87),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'over_under', 2.5, 1.91, 1.91);

-- Match 19: Francia vs Alemania
INSERT INTO odds (match_id, sportsbook, bet_type, home_odds, away_odds, draw_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-29 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'moneyline', 1.95, 3.80, 3.50),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'moneyline', 1.97, 3.75, 3.55),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Betcris',  'moneyline', 1.92, 3.85, 3.45);

INSERT INTO odds (match_id, sportsbook, bet_type, total_value, over_odds, under_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-29 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'over_under', 2.5, 1.87, 1.95);

-- Match 20: Portugal vs Inglaterra
INSERT INTO odds (match_id, sportsbook, bet_type, home_odds, away_odds, draw_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-30 01:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'moneyline', 2.20, 3.10, 3.40),
  ((SELECT id FROM matches WHERE match_date='2026-06-30 01:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Bet365',   'moneyline', 2.25, 3.05, 3.45),
  ((SELECT id FROM matches WHERE match_date='2026-06-30 01:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Betcris',  'moneyline', 2.15, 3.15, 3.35);

INSERT INTO odds (match_id, sportsbook, bet_type, total_value, over_odds, under_odds) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-30 01:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'Caliente', 'over_under', 2.5, 1.95, 1.87);

-- ── Public Betting ────────────────────────────────────────────
INSERT INTO public_betting (match_id, bet_type, home_pct_bets, away_pct_bets, draw_pct_bets, home_pct_money, away_pct_money, draw_pct_money) VALUES
  ((SELECT id FROM matches WHERE match_date='2026-06-28 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'moneyline', 38, 42, 20, 28, 57, 15),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 00:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'moneyline', 45, 35, 20, 48, 32, 20),
  ((SELECT id FROM matches WHERE match_date='2026-06-29 21:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'moneyline', 55, 28, 17, 62, 24, 14),
  ((SELECT id FROM matches WHERE match_date='2026-06-30 01:00:00' AND home_team_id=(SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup'))), 'moneyline', 42, 40, 18, 45, 38, 17);

-- ── Team Recent Games ─────────────────────────────────────────
-- México
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', true,  0, 0, 'D', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='COL' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', false, 2, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='URU' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', true,  0, 1, 'L', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Argentina
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='MEX' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', false, 0, 0, 'D', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='URU' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', true,  3, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ARG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='COL' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 2, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup'));

-- España
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', false, 2, 3, 'L', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='JPN' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', true,  1, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='USA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 2, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Brasil
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='ESP' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', true,  3, 2, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='USA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', false, 4, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='BRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='JPN' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', true,  0, 0, 'D', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Francia
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', true,  2, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='COL' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', false, 1, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='URU' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 3, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Alemania
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='USA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', false, 3, 2, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='JPN' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', true,  2, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='GER' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='COL' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 1, 2, 'L', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Portugal
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', false, 1, 1, 'D', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='JPN' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', true,  2, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='USA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 3, 1, 'W', (SELECT id FROM leagues WHERE slug='world-cup'));

-- Inglaterra
INSERT INTO team_games (team_id, opponent_id, game_date, is_home, team_score, opponent_score, result, league_id) VALUES
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='FRA' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-24', false, 0, 2, 'L', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='URU' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-20', true,  2, 0, 'W', (SELECT id FROM leagues WHERE slug='world-cup')),
  ((SELECT id FROM teams WHERE short_name='ENG' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), (SELECT id FROM teams WHERE short_name='POR' AND league_id=(SELECT id FROM leagues WHERE slug='world-cup')), '2026-06-16', false, 1, 1, 'D', (SELECT id FROM leagues WHERE slug='world-cup'));

-- ============================================================
-- World Cup 2026 migration complete.
-- Run then restart backend to see the Mundial tab in action.
-- ============================================================
