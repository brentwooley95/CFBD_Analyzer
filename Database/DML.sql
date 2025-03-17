/* Creates view that applies weights to:
-- Offense/Defense_pass_ppa per game
-- Offense/Defense_rush_ppa per game
-- Allowed Explosiveness & Explosiveness
Weights applied based on opponent tier which is a categorization of opponent_pregame_elo
*/
 CREATE OR REPLACE VIEW weighted_stats AS
 WITH weight_assignments AS (
         SELECT ags.game_id,
            ags.team_id,
            ags.oppt_tier,
                CASE
                    WHEN ags.oppt_tier::text = 'Tier 1'::text THEN 1.25
                    WHEN ags.oppt_tier::text = 'Tier 2'::text THEN 1.10
                    WHEN ags.oppt_tier::text = 'Tier 3'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 4'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 5'::text THEN 0.85
                    WHEN ags.oppt_tier::text = 'Tier 6'::text THEN 0.70
                    ELSE 1.00
                END AS offense_weight,
                CASE
                    WHEN ags.oppt_tier::text = 'Tier 1'::text THEN 0.70
                    WHEN ags.oppt_tier::text = 'Tier 2'::text THEN 0.85
                    WHEN ags.oppt_tier::text = 'Tier 3'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 4'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 5'::text THEN 1.10
                    WHEN ags.oppt_tier::text = 'Tier 6'::text THEN 1.25
                    ELSE 1.00
                END AS defense_weight
           FROM advanced_game_stats ags
        ), weighted_values AS (
         SELECT ags.game_id,
            ags.team_id,
            ags.oppt_tier,
            wa.offense_weight,
            wa.defense_weight,
                CASE
                    WHEN ags.offense_pass_ppa >= 0::double precision THEN ags.offense_pass_ppa * wa.offense_weight::double precision
                    ELSE ags.offense_pass_ppa / wa.offense_weight::double precision
                END AS "Passing offense score",
                CASE
                    WHEN ags.offense_rush_ppa >= 0::double precision THEN ags.offense_rush_ppa * wa.offense_weight::double precision
                    ELSE ags.offense_rush_ppa / wa.offense_weight::double precision
                END AS "Rushing offense score",
            ags.offense_success_rate AS "Success rate",
                CASE
                    WHEN ags.offense_explosiveness >= 0::double precision THEN ags.offense_explosiveness * wa.offense_weight::double precision
                    ELSE ags.offense_explosiveness / wa.offense_weight::double precision
                END AS "Explosiveness",
                CASE
                    WHEN ags.defense_pass_ppa >= 0::double precision THEN ags.defense_pass_ppa * wa.defense_weight::double precision
                    ELSE ags.defense_pass_ppa / wa.defense_weight::double precision
                END AS "Passing defense score",
                CASE
                    WHEN ags.defense_rush_ppa >= 0::double precision THEN ags.defense_rush_ppa * wa.defense_weight::double precision
                    ELSE ags.defense_rush_ppa / wa.defense_weight::double precision
                END AS "Rushing defense score",
            ags.defense_success_rate AS "Allowed success",
                CASE
                    WHEN ags.defense_explosiveness >= 0::double precision THEN ags.defense_explosiveness * wa.defense_weight::double precision
                    ELSE ags.defense_explosiveness / wa.defense_weight::double precision
                END AS "Allowed explosiveness"
           FROM advanced_game_stats ags
             JOIN weight_assignments wa ON ags.game_id = wa.game_id AND ags.team_id = wa.team_id
        )
 SELECT game_id,
    team_id,
    oppt_tier,
    offense_weight,
    defense_weight,
    "Passing offense score",
    "Rushing offense score",
    "Success rate",
    "Explosiveness",
    "Passing defense score",
    "Rushing defense score",
    "Allowed success",
    "Allowed explosiveness"
   FROM weighted_values;
 

/* 

Creates view that assigns game wins/losses to categories based on opponent tier

*/
 CREATE OR REPLACE VIEW record_breakdown AS WITH team_wins_losses AS (
         SELECT t.team_name,
            gr.season,
            sum(
                CASE
                    WHEN t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points THEN 1
                    ELSE 0
                END) AS total_wins,
            sum(
                CASE
                    WHEN t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points THEN 1
                    ELSE 0
                END) AS total_losses
           FROM game_results gr
             JOIN teams t ON t.team_id = gr.home_team_id OR t.team_id = gr.away_team_id
          GROUP BY t.team_name, gr.season
        ), win_loss_by_tier AS (
         SELECT t.team_name,
            gr.season,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 1'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier1,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 2'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier2,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 3'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier3,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 4'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier4,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 5'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier5,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 6'::text AND (t.team_id = gr.home_team_id AND gr.home_points > gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points > gr.home_points) THEN 1
                    ELSE 0
                END) AS wins_vs_tier6,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 1'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier1,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 2'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier2,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 3'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier3,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 4'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier4,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 5'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier5,
            sum(
                CASE
                    WHEN wags.oppt_tier::text = 'Tier 6'::text AND (t.team_id = gr.home_team_id AND gr.home_points < gr.away_points OR t.team_id = gr.away_team_id AND gr.away_points < gr.home_points) THEN 1
                    ELSE 0
                END) AS losses_vs_tier6
           FROM weighted_advanced_game_stats wags
             JOIN game_results gr ON wags.game_id = gr.game_id
             JOIN teams t ON wags.team_id = t.team_id
          GROUP BY t.team_name, gr.season
        )
 SELECT twl.team_name,
    twl.season,
    twl.total_wins,
    twl.total_losses,
    wlt.wins_vs_tier1,
    wlt.wins_vs_tier2,
    wlt.wins_vs_tier3,
    wlt.wins_vs_tier4,
    wlt.wins_vs_tier5,
    wlt.wins_vs_tier6,
    wlt.losses_vs_tier1,
    wlt.losses_vs_tier2,
    wlt.losses_vs_tier3,
    wlt.losses_vs_tier4,
    wlt.losses_vs_tier5,
    wlt.losses_vs_tier6
   FROM team_wins_losses twl
     LEFT JOIN win_loss_by_tier wlt ON twl.team_name::text = wlt.team_name::text AND twl.season = wlt.season
  ORDER BY twl.team_name;


  /* 

Creates view that takes the weighted values from weighted_stats (& success rate)
and normalizes thhe scores based on the average score for a given season among all games.

Creating new metrics:
-Passing offense score (normalized pass_ppa sum per game per season)
-Rushing offense score
-Explosiveness score
- Passing defense score
- Rushing defense score
- Containment score (allowed explosiveness)

*/
CREATE OR REPLACE VIEW game_stats AS
 WITH team_season_totals AS (
         SELECT ws.team_id,
            gr.season,
            count(ws.game_id) AS games_played,
            avg(ws."Passing offense score") AS team_sum_pass_off,
            avg(ws."Rushing offense score") AS team_sum_rush_off,
            avg(ws."Explosiveness") AS team_avg_explosiveness,
            avg(ws."Passing defense score") AS team_sum_pass_def,
            avg(ws."Rushing defense score") AS team_sum_rush_def,
            avg(ws."Allowed explosiveness") AS team_avg_allowed_explosiveness,
            avg(ws."Success rate") AS team_avg_success_rate,
            avg(ws."Allowed success") AS team_avg_allowed_success
           FROM weighted_stats ws
             JOIN game_results gr ON ws.game_id = gr.game_id
          GROUP BY ws.team_id, gr.season
        ), season_stats AS (
         SELECT team_season_totals.season,
            avg(team_season_totals.team_sum_pass_off) AS season_avg_pass_off,
            stddev(team_season_totals.team_sum_pass_off) AS season_stddev_pass_off,
            avg(team_season_totals.team_sum_rush_off) AS season_avg_rush_off,
            stddev(team_season_totals.team_sum_rush_off) AS season_stddev_rush_off,
            avg(team_season_totals.team_avg_explosiveness) AS season_avg_explosiveness,
            stddev(team_season_totals.team_avg_explosiveness) AS season_stddev_explosiveness,
            avg(team_season_totals.team_sum_pass_def) AS season_avg_pass_def,
            stddev(team_season_totals.team_sum_pass_def) AS season_stddev_pass_def,
            avg(team_season_totals.team_sum_rush_def) AS season_avg_rush_def,
            stddev(team_season_totals.team_sum_rush_def) AS season_stddev_rush_def,
            avg(team_season_totals.team_avg_allowed_explosiveness) AS season_avg_allowed_explosiveness,
            stddev(team_season_totals.team_avg_allowed_explosiveness) AS season_stddev_allowed_explosiveness
           FROM team_season_totals
          GROUP BY team_season_totals.season
        ), normalized_team_stats AS (
         SELECT t.team_name,
            tst.season,
            tst.games_played,
            round(50::double precision + (tst.team_sum_pass_off - ss.season_avg_pass_off) / NULLIF(ss.season_stddev_pass_off, 0::double precision) * 15::double precision) AS total_passing_offense_score,
            round(50::double precision + (tst.team_sum_rush_off - ss.season_avg_rush_off) / NULLIF(ss.season_stddev_rush_off, 0::double precision) * 15::double precision) AS total_rushing_offense_score,
            round(50::double precision + (tst.team_avg_explosiveness - ss.season_avg_explosiveness) / NULLIF(ss.season_stddev_explosiveness, 0::double precision) * 15::double precision) AS avg_explosiveness,
            tst.team_avg_success_rate AS avg_success_rate,
            round(50::double precision - (tst.team_sum_pass_def - ss.season_avg_pass_def) / NULLIF(ss.season_stddev_pass_def, 0::double precision) * 15::double precision) AS total_passing_defense_score,
            round(50::double precision - (tst.team_sum_rush_def - ss.season_avg_rush_def) / NULLIF(ss.season_stddev_rush_def, 0::double precision) * 15::double precision) AS total_rushing_defense_score,
            round(50::double precision - (tst.team_avg_allowed_explosiveness - ss.season_avg_allowed_explosiveness) / NULLIF(ss.season_stddev_allowed_explosiveness, 0::double precision) * 15::double precision) AS avg_allowed_explosiveness,
            tst.team_avg_allowed_success AS avg_allowed_success
           FROM team_season_totals tst
             JOIN teams t ON tst.team_id = t.team_id
             JOIN season_stats ss ON tst.season = ss.season
             JOIN weighted_stats ws ON tst.team_id = ws.team_id
          GROUP BY t.team_name, tst.season, tst.games_played, tst.team_sum_pass_off, tst.team_sum_rush_off, tst.team_avg_explosiveness, tst.team_sum_pass_def, tst.team_sum_rush_def, tst.team_avg_allowed_explosiveness, tst.team_avg_success_rate, tst.team_avg_allowed_success, ss.season_avg_pass_off, ss.season_stddev_pass_off, ss.season_avg_rush_off, ss.season_stddev_rush_off, ss.season_avg_explosiveness, ss.season_stddev_explosiveness, ss.season_avg_pass_def, ss.season_stddev_pass_def, ss.season_avg_rush_def, ss.season_stddev_rush_def, ss.season_avg_allowed_explosiveness, ss.season_stddev_allowed_explosiveness
        )
 SELECT team_name,
    season,
    games_played,
    total_passing_offense_score,
    total_rushing_offense_score,
    avg_success_rate,
    avg_explosiveness,
    total_passing_defense_score,
    total_rushing_defense_score,
    avg_allowed_success,
    avg_allowed_explosiveness
   FROM normalized_team_stats
  WHERE games_played >= 3;


/*

Creates view that finds the last "postseason" game type for each team, each season. Defined as "postseason results"

*/

 WITH last_game AS (
         SELECT DISTINCT ON (g.season, t.team_id) t.team_id,
            t.team_name,
            g.season,
            g.game_id,
            g.game_type,
            g.postseason,
            g.home_team_id,
            g.away_team_id,
            g.home_points,
            g.away_points,
            g.game_date
           FROM game_results g
             JOIN teams t ON t.team_id = g.home_team_id OR t.team_id = g.away_team_id
          ORDER BY g.season, t.team_id, g.game_date DESC
        )
 SELECT lg.team_name,
    lg.season,
        CASE
            WHEN lg.postseason IS NOT NULL THEN lg.postseason
            WHEN lg.game_type::text = 'postseason'::text THEN 'No name provided'::character varying
            ELSE 'No Postseason'::character varying
        END AS postseason_name,
        CASE
            WHEN lg.team_id = lg.home_team_id THEN away_t.team_name
            ELSE home_t.team_name
        END AS opponent_name,
        CASE
            WHEN lg.team_id = lg.home_team_id AND lg.home_points > lg.away_points THEN 'Win'::text
            WHEN lg.team_id = lg.away_team_id AND lg.away_points > lg.home_points THEN 'Win'::text
            ELSE 'Loss'::text
        END AS result,
        CASE
            WHEN lg.team_id = lg.home_team_id THEN lg.home_points
            ELSE lg.away_points
        END AS team_score,
        CASE
            WHEN lg.team_id = lg.home_team_id THEN lg.away_points
            ELSE lg.home_points
        END AS opponent_score
   FROM last_game lg
     JOIN teams home_t ON home_t.team_id = lg.home_team_id
     JOIN teams away_t ON away_t.team_id = lg.away_team_id;


/* 

Creates view "game performance" that shows all season games for a specific team.

*/

 WITH weight_assignments AS (
         SELECT ags.game_id,
            ags.team_id,
            ags.oppt_tier,
                CASE
                    WHEN ags.oppt_tier::text = 'Tier 1'::text THEN 1.25
                    WHEN ags.oppt_tier::text = 'Tier 2'::text THEN 1.10
                    WHEN ags.oppt_tier::text = 'Tier 3'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 4'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 5'::text THEN 0.85
                    WHEN ags.oppt_tier::text = 'Tier 6'::text THEN 0.70
                    ELSE 1.00
                END AS offense_weight,
                CASE
                    WHEN ags.oppt_tier::text = 'Tier 1'::text THEN 0.70
                    WHEN ags.oppt_tier::text = 'Tier 2'::text THEN 0.85
                    WHEN ags.oppt_tier::text = 'Tier 3'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 4'::text THEN 1.00
                    WHEN ags.oppt_tier::text = 'Tier 5'::text THEN 1.10
                    WHEN ags.oppt_tier::text = 'Tier 6'::text THEN 1.25
                    ELSE 1.00
                END AS defense_weight
           FROM advanced_game_stats ags
        ), weighted_values AS (
         SELECT ags.game_id,
            ags.team_id,
            ags.oppt_tier,
            wa.offense_weight,
            wa.defense_weight,
                CASE
                    WHEN ags.offense_pass_ppa >= 0::double precision THEN ags.offense_pass_ppa * wa.offense_weight::double precision
                    ELSE ags.offense_pass_ppa / wa.offense_weight::double precision
                END AS weighted_offense_pass_ppa,
                CASE
                    WHEN ags.offense_rush_ppa >= 0::double precision THEN ags.offense_rush_ppa * wa.offense_weight::double precision
                    ELSE ags.offense_rush_ppa / wa.offense_weight::double precision
                END AS weighted_offense_rush_ppa,
                CASE
                    WHEN ags.offense_explosiveness >= 0::double precision THEN ags.offense_explosiveness * wa.offense_weight::double precision
                    ELSE ags.offense_explosiveness / wa.offense_weight::double precision
                END AS weighted_offense_explosiveness,
            ags.offense_success_rate,
                CASE
                    WHEN ags.defense_pass_ppa >= 0::double precision THEN ags.defense_pass_ppa * wa.defense_weight::double precision
                    ELSE ags.defense_pass_ppa / wa.defense_weight::double precision
                END AS weighted_defense_pass_ppa,
                CASE
                    WHEN ags.defense_rush_ppa >= 0::double precision THEN ags.defense_rush_ppa * wa.defense_weight::double precision
                    ELSE ags.defense_rush_ppa / wa.defense_weight::double precision
                END AS weighted_defense_rush_ppa,
                CASE
                    WHEN ags.defense_explosiveness >= 0::double precision THEN ags.defense_explosiveness * wa.defense_weight::double precision
                    ELSE ags.defense_explosiveness / wa.defense_weight::double precision
                END AS weighted_defense_explosiveness,
            ags.defense_success_rate
           FROM advanced_game_stats ags
             JOIN weight_assignments wa ON ags.game_id = wa.game_id AND ags.team_id = wa.team_id
        )
 SELECT t.team_name,
    opp.team_name AS opponent_name,
    wv.oppt_tier,
    gr.season,
    gr.week,
    gr.game_type,
    gr.game_date,
        CASE
            WHEN gr.home_team_id = wv.team_id AND gr.home_points > gr.away_points THEN 'Win'::text
            WHEN gr.away_team_id = wv.team_id AND gr.away_points > gr.home_points THEN 'Win'::text
            ELSE 'Loss'::text
        END AS result,
        CASE
            WHEN gr.home_team_id = wv.team_id THEN gr.home_points
            ELSE gr.away_points
        END AS team_score,
        CASE
            WHEN gr.home_team_id = wv.team_id THEN gr.away_points
            ELSE gr.home_points
        END AS opponent_score,
    wv.weighted_offense_pass_ppa,
    wv.weighted_offense_rush_ppa,
    wv.weighted_offense_explosiveness,
    wv.offense_success_rate,
    wv.weighted_defense_pass_ppa,
    wv.weighted_defense_rush_ppa,
    wv.weighted_defense_explosiveness,
    wv.defense_success_rate
   FROM weighted_values wv
     JOIN game_results gr ON wv.game_id = gr.game_id
     JOIN teams t ON wv.team_id = t.team_id
     JOIN teams opp ON gr.home_team_id = opp.team_id AND gr.away_team_id = wv.team_id OR gr.away_team_id = opp.team_id AND gr.home_team_id = wv.team_id;



