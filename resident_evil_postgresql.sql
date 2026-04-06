-- =============================================================================
--  Resident Evil Universe — PostgreSQL Schema & Dashboard Queries
--  Generated from: characters.csv, gameAppearance.csv, games.csv,
--                  interactions.csv, scenes.csv
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. DATABASE SETUP
-- ─────────────────────────────────────────────────────────────────────────────
CREATE DATABASE resident_evil_db
    WITH ENCODING 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE   = 'en_US.UTF-8';

\c resident_evil_db

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CORE TABLES
-- ─────────────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS interactions   CASCADE;
DROP TABLE IF EXISTS game_appearances CASCADE;
DROP TABLE IF EXISTS scenes         CASCADE;
DROP TABLE IF EXISTS characters     CASCADE;
DROP TABLE IF EXISTS games          CASCADE;

-- 1.1  games
CREATE TABLE games (
    id               VARCHAR(20)  PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    year             SMALLINT     NOT NULL CHECK (year BETWEEN 1990 AND 2100),
    type             VARCHAR(20)  NOT NULL CHECK (type IN ('mainline','spinoff')),
    chronology_order SMALLINT     NOT NULL UNIQUE
);

-- 1.2  characters
CREATE TABLE characters (
    id   SERIAL      PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(20)  NOT NULL CHECK (role IN ('hero','villain','support'))
);

-- 1.3  scenes
CREATE TABLE scenes (
    scene_id VARCHAR(30) PRIMARY KEY,
    game_id  VARCHAR(20) NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    title    VARCHAR(300),
    source   TEXT
);
CREATE INDEX idx_scenes_game ON scenes(game_id);

-- 1.4  game_appearances  (character appearances per game)
CREATE TABLE game_appearances (
    id             SERIAL      PRIMARY KEY,
    game_id        VARCHAR(20) NOT NULL REFERENCES games(id)       ON DELETE CASCADE,
    character_id   INT         NOT NULL REFERENCES characters(id)  ON DELETE CASCADE,
    role           VARCHAR(20) NOT NULL CHECK (role IN ('hero','villain','support')),
    UNIQUE(game_id, character_id)
);
CREATE INDEX idx_ga_game      ON game_appearances(game_id);
CREATE INDEX idx_ga_character ON game_appearances(character_id);

-- 1.5  interactions  (character ↔ scene)
CREATE TABLE interactions (
    id           BIGSERIAL   PRIMARY KEY,
    game_id      VARCHAR(20) NOT NULL REFERENCES games(id)      ON DELETE CASCADE,
    scene_id     VARCHAR(30) NOT NULL REFERENCES scenes(scene_id) ON DELETE CASCADE,
    character_id INT         NOT NULL REFERENCES characters(id)  ON DELETE CASCADE,
    UNIQUE(game_id, scene_id, character_id)
);
CREATE INDEX idx_int_game      ON interactions(game_id);
CREATE INDEX idx_int_scene     ON interactions(scene_id);
CREATE INDEX idx_int_character ON interactions(character_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. SEED DATA  (from CSV)
-- ─────────────────────────────────────────────────────────────────────────────

-- games
INSERT INTO games (id, title, year, type, chronology_order) VALUES
('re',    'Resident Evil',                            1996, 'mainline', 2),
('re0',   'Resident Evil 0',                          2002, 'mainline', 1),
('re2',   'Resident Evil 2',                          1998, 'mainline', 4),
('re3',   'Resident Evil 3: Nemesis',                 1999, 'mainline', 3),
('re4',   'Resident Evil 4',                          2005, 'mainline', 6),
('re5',   'Resident Evil 5',                          2009, 'mainline', 7),
('re6',   'Resident Evil 6',                          2012, 'mainline', 8),
('re7',   'Resident Evil 7: Biohazard',               2017, 'mainline', 9),
('re8',   'Resident Evil Village',                    2021, 'mainline', 10),
('re9',   'Resident Evil Requiem',                    2026, 'mainline', 12),
('re_cv', 'Resident Evil: Code – Veronica',           2000, 'mainline', 5),
('re_sr', 'Resident Evil Village – Shadow of Rose',   2022, 'spinoff',  11),
('re_r',  'Resident Evil: Revelations',               2012, 'spinoff',  13),
('re_r2', 'Resident Evil: Revelations 2',             2015, 'spinoff',  14);

-- characters (sample — replace with COPY FROM csv for full load)
INSERT INTO characters (id, name, role) VALUES
(1,  'Leon Scott Kennedy',  'hero'),
(2,  'Ashley Graham',       'hero'),
(3,  'Ada Wong',            'hero'),
(4,  'Jack Krauser',        'villain'),
(5,  'Saddler',             'villain'),
(6,  'Albert Wesker',       'villain'),
(7,  'Luis Serra',          'support'),
(8,  'Salazar',             'villain'),
(9,  'Mike (Helicopter)',   'support'),
(10, 'Bitores Mendez',      'villain'),
(11, 'Ingrid Hunnigan',     'support'),
(12, 'Isabella',            'villain'),
(13, 'Chris Redfield',      'hero'),
(14, 'Claire Redfield',     'hero'),
(15, 'Chris Redfield',      'hero'),
(16, 'Jill Valentine',      'hero'),
(17, 'Rebecca Chambers',    'support'),
(18, 'Ethan Winters',       'hero'),
(19, 'Mia Winters',         'hero'),
(20, 'Grace Ashcroft',      'hero')
ON CONFLICT (name) DO NOTHING;

-- ── For full CSV import use:
-- COPY games        FROM '/absolute/path/games.csv'        CSV HEADER;
-- COPY characters   FROM '/absolute/path/characters.csv'   CSV HEADER;
-- COPY scenes       FROM '/absolute/path/scenes.csv'       CSV HEADER;
-- COPY game_appearances (game_id,character_id,role)
--                   FROM '/absolute/path/gameAppearance.csv' CSV HEADER;
-- COPY interactions (game_id,scene_id,character_id)
--                   FROM '/absolute/path/interactions.csv'  CSV HEADER;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. MATERIALIZED VIEWS (for fast dashboard queries)
-- ─────────────────────────────────────────────────────────────────────────────

-- 3.1  Character stats across the franchise
CREATE MATERIALIZED VIEW mv_character_stats AS
SELECT
    c.id                                           AS character_id,
    c.name                                         AS character_name,
    c.role                                         AS character_role,
    COUNT(DISTINCT i.scene_id)                     AS total_scenes,
    COUNT(DISTINCT i.game_id)                      AS games_count,
    MIN(g.year)                                    AS first_year,
    MAX(g.year)                                    AS last_year,
    MAX(g.year) - MIN(g.year)                      AS career_span_years,
    ROUND(COUNT(DISTINCT i.scene_id)::NUMERIC /
          NULLIF(COUNT(DISTINCT i.game_id),0), 2)  AS avg_scenes_per_game,
    ROUND(AVG(g.chronology_order), 2)              AS avg_chronology
FROM characters c
LEFT JOIN interactions i ON i.character_id = c.id
LEFT JOIN games        g ON g.id = i.game_id
GROUP BY c.id, c.name, c.role
WITH DATA;

CREATE UNIQUE INDEX ON mv_character_stats(character_id);

-- 3.2  Game-level stats
CREATE MATERIALIZED VIEW mv_game_stats AS
SELECT
    g.id                                              AS game_id,
    g.title                                           AS game_title,
    g.year,
    g.type,
    g.chronology_order,
    COUNT(DISTINCT s.scene_id)                        AS total_scenes,
    COUNT(DISTINCT i.character_id)                    AS unique_characters,
    COUNT(i.id)                                       AS total_interactions,
    ROUND(COUNT(i.id)::NUMERIC /
          NULLIF(COUNT(DISTINCT s.scene_id),0), 2)    AS interactions_per_scene
FROM games g
LEFT JOIN scenes       s ON s.game_id = g.id
LEFT JOIN interactions i ON i.game_id = g.id
GROUP BY g.id, g.title, g.year, g.type, g.chronology_order
ORDER BY g.chronology_order
WITH DATA;

CREATE UNIQUE INDEX ON mv_game_stats(game_id);

-- 3.3  Role mix per game
CREATE MATERIALIZED VIEW mv_role_mix AS
SELECT
    g.title                          AS game_title,
    g.chronology_order,
    c.role,
    COUNT(DISTINCT i.character_id)   AS character_count
FROM interactions i
JOIN games       g ON g.id = i.game_id
JOIN characters  c ON c.id = i.character_id
GROUP BY g.title, g.chronology_order, c.role
ORDER BY g.chronology_order, c.role
WITH DATA;

-- 3.4  Character co-appearance pairs (characters who share scenes)
CREATE MATERIALIZED VIEW mv_co_appearances AS
SELECT
    a.character_id   AS char_a_id,
    ca.name          AS char_a_name,
    b.character_id   AS char_b_id,
    cb.name          AS char_b_name,
    COUNT(*)         AS shared_scenes
FROM interactions a
JOIN interactions b ON  a.scene_id = b.scene_id
                    AND a.game_id  = b.game_id
                    AND a.character_id < b.character_id
JOIN characters ca ON ca.id = a.character_id
JOIN characters cb ON cb.id = b.character_id
GROUP BY a.character_id, ca.name, b.character_id, cb.name
HAVING COUNT(*) > 1
ORDER BY shared_scenes DESC
WITH DATA;

CREATE INDEX ON mv_co_appearances(char_a_id);
CREATE INDEX ON mv_co_appearances(char_b_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. DASHBOARD API QUERIES
-- ─────────────────────────────────────────────────────────────────────────────

-- ── KPI Card 1: Total games
SELECT COUNT(*) AS total_games FROM games;

-- ── KPI Card 2: Total unique characters
SELECT COUNT(*) AS total_characters FROM characters;

-- ── KPI Card 3: Total scenes
SELECT COUNT(*) AS total_scenes FROM scenes;

-- ── KPI Card 4: Total interactions
SELECT COUNT(*) AS total_interactions FROM interactions;

-- ── KPI Card 5: Role breakdown
SELECT role, COUNT(*) AS count,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct
FROM characters
GROUP BY role
ORDER BY count DESC;

-- ── Chart: Top 20 characters by scene count
SELECT character_name, character_role, total_scenes, games_count,
       avg_scenes_per_game, career_span_years
FROM mv_character_stats
ORDER BY total_scenes DESC
LIMIT 20;

-- ── Chart: Scene count per game (chronological)
SELECT game_title, year, type, chronology_order,
       total_scenes, unique_characters, interactions_per_scene
FROM mv_game_stats
ORDER BY chronology_order;

-- ── Chart: Cumulative scene growth across franchise
SELECT game_title, year, chronology_order,
       total_scenes,
       SUM(total_scenes) OVER (ORDER BY chronology_order) AS cumulative_scenes
FROM mv_game_stats
ORDER BY chronology_order;

-- ── Chart: Role mix per game
SELECT game_title, chronology_order, role, character_count
FROM mv_role_mix
ORDER BY chronology_order, role;

-- ── Chart: Character career timeline
SELECT character_name, character_role,
       first_year, last_year, career_span_years, games_count, total_scenes
FROM mv_character_stats
WHERE games_count > 1
ORDER BY first_year, career_span_years DESC;

-- ── Table: Most frequent character co-appearances
SELECT char_a_name, char_b_name, shared_scenes
FROM mv_co_appearances
ORDER BY shared_scenes DESC
LIMIT 30;

-- ── Filter: Characters by role
SELECT character_name, total_scenes, games_count, avg_scenes_per_game, career_span_years
FROM mv_character_stats
WHERE character_role = 'hero'     -- change to 'villain' or 'support'
ORDER BY total_scenes DESC;

-- ── Filter: Single game deep-dive (replace 're9' with any game_id)
SELECT c.name, c.role, COUNT(i.scene_id) AS scene_count
FROM interactions i
JOIN characters c ON c.id = i.character_id
WHERE i.game_id = 're9'
GROUP BY c.id, c.name, c.role
ORDER BY scene_count DESC;

-- ── Search: Character profile
SELECT cs.*,
       STRING_AGG(DISTINCT g.title, ', ' ORDER BY g.title) AS games_appeared_in
FROM mv_character_stats cs
JOIN interactions i  ON i.character_id = cs.character_id
JOIN games        g  ON g.id = i.game_id
WHERE cs.character_name ILIKE '%Leon%'   -- parameterise this
GROUP BY cs.character_id, cs.character_name, cs.character_role,
         cs.total_scenes, cs.games_count, cs.first_year, cs.last_year,
         cs.career_span_years, cs.avg_scenes_per_game, cs.avg_chronology;

-- ── Analytics: Interaction density by game type
SELECT g.type,
       ROUND(AVG(gs.total_scenes), 1)           AS avg_scenes,
       ROUND(AVG(gs.unique_characters), 1)      AS avg_characters,
       ROUND(AVG(gs.interactions_per_scene), 2) AS avg_density
FROM mv_game_stats gs
JOIN games g ON g.id = gs.game_id
GROUP BY g.type;

-- ── Analytics: Villain vs Hero scene presence per game
SELECT mv.game_title, mv.chronology_order,
       MAX(CASE WHEN mv.role = 'hero'    THEN mv.character_count ELSE 0 END) AS hero_count,
       MAX(CASE WHEN mv.role = 'villain' THEN mv.character_count ELSE 0 END) AS villain_count,
       MAX(CASE WHEN mv.role = 'support' THEN mv.character_count ELSE 0 END) AS support_count
FROM mv_role_mix mv
GROUP BY mv.game_title, mv.chronology_order
ORDER BY mv.chronology_order;

-- ── Analytics: Characters appearing across most games (franchise veterans)
SELECT character_name, character_role, games_count, total_scenes,
       first_year, last_year, career_span_years
FROM mv_character_stats
WHERE games_count >= 3
ORDER BY games_count DESC, total_scenes DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. FUNCTIONS & STORED PROCEDURES
-- ─────────────────────────────────────────────────────────────────────────────

-- 5.1  Get all scenes for a character across the franchise
CREATE OR REPLACE FUNCTION get_character_scenes(p_character_id INT)
RETURNS TABLE (
    game_title      VARCHAR,
    year            SMALLINT,
    scene_id        VARCHAR,
    scene_title     VARCHAR
) LANGUAGE sql STABLE AS $$
    SELECT g.title, g.year, s.scene_id, s.title
    FROM interactions i
    JOIN scenes s ON s.scene_id = i.scene_id
    JOIN games  g ON g.id = i.game_id
    WHERE i.character_id = p_character_id
    ORDER BY g.chronology_order, s.scene_id;
$$;

-- Usage: SELECT * FROM get_character_scenes(1);

-- 5.2  Characters who appear together most
CREATE OR REPLACE FUNCTION top_co_appearances(p_character_id INT, p_limit INT DEFAULT 10)
RETURNS TABLE (
    partner_name   VARCHAR,
    partner_role   VARCHAR,
    shared_scenes  BIGINT
) LANGUAGE sql STABLE AS $$
    SELECT CASE WHEN char_a_id = p_character_id THEN char_b_name ELSE char_a_name END,
           CASE WHEN char_a_id = p_character_id
                THEN (SELECT role FROM characters WHERE id = char_b_id)
                ELSE (SELECT role FROM characters WHERE id = char_a_id)
           END,
           shared_scenes
    FROM mv_co_appearances
    WHERE char_a_id = p_character_id OR char_b_id = p_character_id
    ORDER BY shared_scenes DESC
    LIMIT p_limit;
$$;

-- Usage: SELECT * FROM top_co_appearances(1);

-- 5.3  Refresh all materialized views
CREATE OR REPLACE PROCEDURE refresh_all_views()
LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_character_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_game_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_role_mix;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_co_appearances;
    RAISE NOTICE 'All materialized views refreshed at %', NOW();
END;
$$;

-- Usage: CALL refresh_all_views();


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. INDEXES FOR WEB DASHBOARD PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_chars_role  ON characters(role);
CREATE INDEX IF NOT EXISTS idx_chars_name  ON characters USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_games_year  ON games(year);
CREATE INDEX IF NOT EXISTS idx_games_type  ON games(type);
CREATE INDEX IF NOT EXISTS idx_scenes_title ON scenes USING gin(to_tsvector('english', title));


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. VIEWS FOR WEB REST API ENDPOINTS
-- ─────────────────────────────────────────────────────────────────────────────

-- GET /api/dashboard/kpis
CREATE OR REPLACE VIEW v_kpis AS
SELECT
    (SELECT COUNT(*) FROM games)                AS total_games,
    (SELECT COUNT(*) FROM characters)           AS total_characters,
    (SELECT COUNT(*) FROM scenes)               AS total_scenes,
    (SELECT COUNT(*) FROM interactions)         AS total_interactions,
    (SELECT COUNT(*) FROM characters WHERE role = 'hero')    AS hero_count,
    (SELECT COUNT(*) FROM characters WHERE role = 'villain') AS villain_count,
    (SELECT COUNT(*) FROM characters WHERE role = 'support') AS support_count;

-- GET /api/dashboard/top_characters
CREATE OR REPLACE VIEW v_top_characters AS
SELECT character_name, character_role, total_scenes, games_count,
       avg_scenes_per_game, career_span_years, first_year, last_year
FROM mv_character_stats
ORDER BY total_scenes DESC;

-- GET /api/dashboard/games
CREATE OR REPLACE VIEW v_games_overview AS
SELECT game_id, game_title, year, type, chronology_order,
       total_scenes, unique_characters, interactions_per_scene
FROM mv_game_stats
ORDER BY chronology_order;

-- GET /api/dashboard/network (co-appearance network for graph viz)
CREATE OR REPLACE VIEW v_character_network AS
SELECT char_a_name AS source, char_b_name AS target, shared_scenes AS weight
FROM mv_co_appearances
WHERE shared_scenes >= 3
ORDER BY shared_scenes DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- END OF SCHEMA
-- ─────────────────────────────────────────────────────────────────────────────
