import json
import pandas as pd
from src.utils import clean_float, clean_string


def load_fbs_team_mapping(fbs_teams_path):
    """Loads the FBS teams dataset to create a mapping of Team_name to Team_id."""
    fbs_teams_df = pd.read_csv(fbs_teams_path)
    return fbs_teams_df.set_index("Team_name")["Team_id"].to_dict()


def map_team_id(df, team_mapping, team_column):
    """
    Maps Team_name to Team_id using the provided mapping dictionary.
    """
    df["Team_id"] = df[team_column].map(team_mapping)
    if "Opponent_name" in df.columns:
        df["Opponent_id"] = df["Opponent_name"].map(team_mapping)
    df.drop(columns=[team_column, "Opponent_name"], errors="ignore", inplace=True)
    return df


def transform_fbs_teams(teams_input, teams_output):
    """
    Reads raw data from a json file, parses required fields into a structured format,
    and saves the transformed data to another CSV file.
    """

    with open(teams_input, 'r') as teams_json:
        teams_raw_data = json.load(teams_json)
    print(f"Loaded raw teams data from {teams_json}")

    teams_tran_data = []

    for team_dict in teams_raw_data:
        teams_tran_data.append({
            "Team_id": team_dict.get("id"),
            "Team_name": clean_string(team_dict.get("school")),
            "Conference": team_dict.get("conference"),
            "Color": team_dict.get("color"),
            "Alt_color": team_dict.get("alt_color"),
            "Logo": team_dict.get("logos")
        })

    teams_df = pd.DataFrame(teams_tran_data)
    print(f"Transformed teams data contains {len(teams_df)} records.")

    teams_df.to_csv(teams_output, index=False, encoding='utf-8-sig')
    print(f"Transformed teams data saved to {teams_output}")


def transform_recruit_rankings(input_json, output_csv, valid_teams, team_mapping):
    """
    Reads recruit rankings data, transforms it, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw recruit rankings data from {input_json}")

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["school"] for team in raw_teams_dict}

    transformed_data = [
        {
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("year"),
            "Rank": record.get("rank"),
            "Points": clean_float(record.get("points")),
        }
        for record in raw_data
        if record.get("team") in valid_team_set
    ]

    recruit_df = pd.DataFrame(transformed_data)
    print(f"Transformed recruit rankings data contains {len(recruit_df)} records.")
    recruit_df = map_team_id(recruit_df, team_mapping, "Team_name")
    recruit_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed recruit rankings data saved to {output_csv}")


def transform_returning_ppa(input_json, output_csv, valid_teams, team_mapping):
    """
    Reads returning production data, selects and transforms certain fields, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw returning production data from {input_json}")

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["school"] for team in raw_teams_dict}

    transformed_data = [
        {
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("season"),
            "Percent_ppa": clean_float(record.get("percent_ppa")),
            "Total_ppa": clean_float(record.get("total_ppa")),
        }
        for record in raw_data
        if record.get("team") in valid_team_set
    ]

    returning_ppa_df = pd.DataFrame(transformed_data)
    print(f"Transformed returning production data contains {len(returning_ppa_df)} records.")
    returning_ppa_df = map_team_id(returning_ppa_df, team_mapping, "Team_name")
    returning_ppa_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed returning production data saved to {output_csv}")


def transform_sp_ratings(input_json, output_csv, valid_teams, team_mapping):
    """
    Reads SP+ ratings data,  selects and transforms certain fields, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw SP+ ratings data from {input_json}")

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["school"] for team in raw_teams_dict}

    transformed_data = [
        {
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("year"),
            "SP_rating": clean_float(record.get("rating")),
            "Off_Rating": clean_float(record.get("offense", {}).get("rating")),
            "Def_Rating": clean_float(record.get("defense", {}).get("rating")),
            "ST_Rating": clean_float(record.get("special_teams", {}).get("rating")),
        }
        for record in raw_data
        if record.get("team") in valid_team_set
    ]

    sp_ratings_df = pd.DataFrame(transformed_data)
    print(f"Transformed SP+ ratings data contains {len(sp_ratings_df)} records.")
    sp_ratings_df = map_team_id(sp_ratings_df, team_mapping, "Team_name")
    sp_ratings_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed SP+ ratings data saved to {output_csv}")


def transform_coach_ratings(coach_input, coaches_output, valid_teams, team_mapping):
    """
    Reads betting line data, transforms it, and saves it to CSV.
    """
    # Load raw data with error handling
    try:
        with open(coach_input, 'r', encoding='utf-8') as json_file:
            coach_raw_data = json.load(json_file)
    except json.JSONDecodeError as e:
        print(f"Error loading JSON from {coach_input}: {e}")
        return
    print(f"Loaded raw data from {coach_input}")

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["school"] for team in raw_teams_dict}

    # Select and transform data
    transformed_coach_data = []
    for record in coach_raw_data:
        seasons = record.get("seasons", [])  # Get the list of seasons (default to empty list)

        for season in seasons:  # Iterate over each season entry
            if season.get("school") in valid_team_set:  # Only include FBS teams
                transformed_coach_data.append({
                    "First_name": clean_string(record.get("first_name")),
                    "Last_name": clean_string(record.get("last_name")),
                    "Team_name": clean_string(season.get("school")),
                    "Season": season.get("year"),
                    "Games": season.get("games"),
                    "Wins": season.get("wins"),
                    "Losses": clean_float(season.get("losses")),
                    "SP_rating": clean_float(season.get("sp_overall")),
                    "Off_rating": clean_float(season.get("sp_offense")),
                    "Def_rating": clean_float(season.get("sp_defense")),
                })

    # Convert to DataFrame
    transformed_coach_df = pd.DataFrame(transformed_coach_data)
    print(f"Filtered and transformed coach data contains {len(transformed_coach_df)} records.")
    # print(transformed_df.head())
    transformed_coach_df = map_team_id(transformed_coach_df, team_mapping, "Team_name")

    # Handle unmapped teams
    unmapped_teams = transformed_coach_df[transformed_coach_df["Team_id"].isnull()]
    if not unmapped_teams.empty:
        print("Warning: The following teams could not be mapped to Team_id:")
        print(unmapped_teams[["Team_name"]].drop_duplicates())

    # Save the transformed DataFrame to a CSV file
    transformed_coach_df.to_csv(coaches_output, index=False, encoding='utf-8-sig')
    print(f"Transformed data saved to {coaches_output}")


def transform_game_results(games_input, games_output, valid_teams):

    try:
        # Load the raw data
        with open(games_input, 'r', encoding='utf-8') as json_file:
            games_raw_data = json.load(json_file)
    except json.JSONDecodeError as e:
        print(f"Error loading JSON from {games_input}: {e}")
        return
    print(f"Loaded raw data from {games_output}")

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["id"] for team in raw_teams_dict}

    # Select and transform data
    transformed_games_data = [
        {
            "Game_id": record.get("id"),
            "Season": record.get("season"),
            "Week": record.get("week"),
            "Game_type": record.get("season_type"),
            "Neutral": record.get("neutral_site"),
            "Home_id": record.get("home_id"),
            "Home_points": record.get("home_points"),
            "Home_preg_elo": record.get("home_pregame_elo"),
            "Home_postg_elo": record.get("home_postgame_elo"),
            "Away_id": record.get("away_id"),
            "Away_points": record.get("away_points"),
            "Away_preg_elo": record.get("away_pregame_elo"),
            "Away_postg_elo": record.get("away_postgame_elo")
        }
        for record in games_raw_data
        if record.get("home_id") in valid_team_set and record.get("away_id") in valid_team_set # Only FBS teams
    ]

    # Create a DataFrame from the transformed data
    transformed_games_df = pd.DataFrame(transformed_games_data)
    print(f"Transformed games & results data contains {len(transformed_games_df)} records.")

    # Save the transformed DataFrame to a CSV file
    transformed_games_df.to_csv(games_output, index=False, encoding='utf-8-sig')
    print(f"Transformed  games data saved to {games_output}")


def transform_advanced_stats(ags_input, ags_output, valid_teams, team_mapping):
    """
    Reads raw data from a JSON file, parses required fields into a structured format,
    and saves the transformed data to another CSV file.
    """
    # Load raw data with error handling
    try:
        with open(ags_input, 'r', encoding='utf-8') as json_file:
            ags_raw_data = json.load(json_file)
    except json.JSONDecodeError as e:
        print(f"Error loading JSON from {ags_input}: {e}")
        return
    print(f"Loaded raw data from {ags_input}")

    # Check if raw_data is empty
    if not ags_raw_data or not isinstance(ags_raw_data, list):
        print(f"Error: Loaded JSON data from {ags_input} is empty or not in the expected format.")
        return

    # Load valid teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        valid_team_set = {team["school"] for team in raw_teams_dict}

    # Select and transform data
    transformed_ags_data = [
        {
            "Game_id": record.get("game_id"),
            "Team_name": clean_string(record.get("team")),
            "Oppt_name": clean_string(record.get("opponent")),
            "Offense_plays": record.get("offense.plays"),
            "Offense_pass_ppa": clean_float(record.get("offense.passing_plays.total_ppa")),
            "Offense_rush_ppa": clean_float(record.get("offense.rushing_plays.total_ppa")),
            "Offense_success_rate": clean_float(record.get("offense.success_rate")),
            "Offense_explosiveness": clean_float(record.get("offense.explosiveness")),
            "Defense_plays": record.get("defense.plays"),
            "Defense_pass_ppa": clean_float(record.get("defense.passing_plays.total_ppa")),
            "Defense_rush_ppa": clean_float(record.get("defense.rushing_plays.total_ppa")),
            "Defense_success_rate": clean_float(record.get("defense.success_rate")),
            "Defense_explosiveness": clean_float(record.get("defense.explosiveness"))
        }
        for record in ags_raw_data
        if record.get("team") in valid_team_set and record.get("opponent") in valid_team_set  # Only FBS teams
    ]

    # Convert to DataFrame
    transformed_ags_df = pd.DataFrame(transformed_ags_data)
    print(f"Filtered and transformed data contains {len(transformed_ags_df)} records.")
    # print(transformed_df.head())
    transformed_ags_df = map_team_id(transformed_ags_df, team_mapping, "Team_name")

    # Handle unmapped teams
    unmapped_teams = transformed_ags_df[transformed_ags_df["Team_id"].isnull()]
    if not unmapped_teams.empty:
        print("Warning: The following teams could not be mapped to Team_id:")
        print(unmapped_teams[["Team_name"]].drop_duplicates())

    # Save the transformed DataFrame to a CSV file
    transformed_ags_df.to_csv(ags_output, index=False, encoding='utf-8-sig')
    print(f"Transformed data saved to {ags_output}")

