-- ===========================
-- TEAMS TABLE
-- ===========================
CREATE TABLE teams (
    Team_id SERIAL PRIMARY KEY,
    Team_name VARCHAR(100) UNIQUE NOT NULL,
    Conference VARCHAR(50),
    Color VARCHAR(10),
    Alt_color VARCHAR(10),
    Logo TEXT
);

-- ===========================
-- GAME RESULTS TABLE
-- ===========================
CREATE TABLE game_results (
    Game_id SERIAL PRIMARY KEY,
    Season INT NOT NULL,
    Week INT NOT NULL,
    Game_type VARCHAR(20),
    Neutral_site BOOLEAN,
    Home_team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Home_points INT,
    Home_preg_elo FLOAT,
    Home_postg_elo FLOAT,
    Away_team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Away_points INT,
    Away_preg_elo FLOAT,
    Away_postg_elo FLOAT
);

-- ===========================
-- ADVANCED GAME STATS TABLE
-- ===========================
CREATE TABLE advanced_game_stats (
    Stat_id SERIAL PRIMARY KEY,
    Game_id INT REFERENCES game_results(Game_id) ON DELETE CASCADE,
    Team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    opponent_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Offense_plays INT,
    Offense_pass_ppa FLOAT,
    Offense_rush_ppa FLOAT,
    Offense_success_rate FLOAT,
    Offense_explosiveness FLOAT,
    Defense_plays INT,
    Defense_pass_ppa FLOAT,
    Defense_rush_ppa FLOAT,
    Defense_success_rate FLOAT,
    Defense_explosiveness FLOAT
);

-- ===========================
-- RECRUIT RANKINGS TABLE
-- ===========================
CREATE TABLE recruit_rankings (
    Recruit_rank_id SERIAL PRIMARY KEY,
    Team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Season INT NOT NULL,
    Recruiting_rank INT,
    Recruiting_points FLOAT
);

-- ===========================
-- RETURNING PPA TABLE
-- ===========================
CREATE TABLE returning_ppa (
    Ret_ppa_id SERIAL PRIMARY KEY,
    Team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Season INT NOT NULL,
    Percent_ppa FLOAT,
    Total_ppa FLOAT
);

-- ===========================
-- SP+ RATINGS TABLE
-- ===========================
CREATE TABLE sp_ratings (
    Rating_id SERIAL PRIMARY KEY,
    Team_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Season INT NOT NULL,
    Sp_rating FLOAT,
    Off_rating FLOAT,
    Def_rating FLOAT,
    St_rating FLOAT
);

-- ===========================
-- COACHES TABLE
-- ===========================
CREATE TABLE coaches (
    Coach_id SERIAL PRIMARY KEY,
    First_name VARCHAR(50),
    Last_name VARCHAR(50),
    Seam_id INT REFERENCES teams(Team_id) ON DELETE CASCADE,
    Season INT NOT NULL,
    Games INT,
    Wins INT,
    Losses INT,
    Sp_rating FLOAT,
    Off_rating FLOAT,
    Def_rating FLOAT
);
