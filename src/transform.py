import json
import pandas as pd


def clean_and_format(value):
    """
    Cleans and formats a value:
    - Removes leading single quotes (').
    - Converts to float.
    - Rounds to 4 decimal places.
    """
    try:
        # Remove leading single quotes and convert to float
        cleaned_value = float(str(value).lstrip("'"))
        return round(cleaned_value, 4)
    except (ValueError, TypeError):
        # If conversion fails, return None or a default value (e.g., 0.0)
        return None


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
            "Team_name": team_dict.get("school"),
            "Conference": team_dict.get("conference"),
            "Color": team_dict.get("color"),
            "Alt_color": team_dict.get("alt_color"),
            "Logo": team_dict.get("logos")
        })

    teams_df = pd.DataFrame(teams_tran_data)
    print(f"Transformed teams data contains {len(teams_df)} records.")

    teams_df.to_csv(teams_output, index=False)
    print(f"Transformed teams data saved to {teams_output}")


def transform_game_results(games_input, games_output):

    # Load the raw data
    with open(games_input, 'r') as json_file:
        games_raw_data = json.load(json_file)
    print(f"Loaded raw data from {games_output}")

    transformed_games_data = []

    for game in games_raw_data:
        for record in game:
            transformed_games_data.append(record)

    # Create a DataFrame from the transformed data
    transformed_games_df = pd.DataFrame(transformed_games_data)
    print(f"Transformed games & results data contains {len(transformed_games_df)} records.")

    # Save the transformed DataFrame to a CSV file
    transformed_games_df.to_csv(games_output, index=False)
    print(f"Transformed  games data saved to {games_output}")

def transform_advanced_stats(input_json, output_csv):
    """
    Reads raw data from a json file, parses required fields into a structured format,
    and saves the transformed data to another CSV file.
    """
    # Load the raw data
    with open(input_json, 'r') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw data from {input_json}")

    transformed_data = []

    for game in raw_data:
        for record in game:
            # Clean and format specific fields
            record["Offense_ppa"] = clean_and_format(record.get("Offense_ppa"))
            record["Offense_success_rate"] = clean_and_format(record.get("Offense_success_rate"))
            record["Offense_explosiveness"] = clean_and_format(record.get("Offense_explosiveness"))
            record["Defense_ppa"] = clean_and_format(record.get("Defense_ppa"))
            record["Defense_success_rate"] = clean_and_format(record.get("Defense_success_rate"))
            record["Defense_explosiveness"] = clean_and_format(record.get("Defense_explosiveness"))

            transformed_data.append(record)

    # Create a DataFrame from the transformed data
    transformed_df = pd.DataFrame(transformed_data)
    print(f"Transformed data contains {len(transformed_df)} records.")

    # Save the transformed DataFrame to a CSV file
    transformed_df.to_csv(output_csv, index=False)
    print(f"Transformed data saved to {output_csv}")


# AGS TRANSFORM
"""
transform_advanced_stats(
    input_json="data/advanced_game_stats_raw.json",  # Input CSV from the extraction script
    output_csv="data/advanced_game_stats_bulk.csv")
"""
# TEAMS TRANSFORM
#transform_fbs_teams(teams_input="data/teams_raw.json", teams_output="data/teams.csv")
# GAMES TRANSFORM
transform_game_results(
    games_input="data/game_results_raw.json",
    games_output="data/game_results_bulk.csv"
)


