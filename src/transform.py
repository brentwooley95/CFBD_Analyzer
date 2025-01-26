import json
import pandas as pd


def clean_float(value):
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


def clean_string(value):
    """
    Cleans and formats a string:
    - Decodes Unicode escape sequences.
    - Strips unwanted leading/trailing whitespace or special characters.
    """

    if not isinstance(value, str):
        return None

        # Step 1: Decode Unicode escape sequences (e.g., \u00e9 -> é)
    try:
        value = value.encode('utf-8').decode('unicode_escape').encode('latin1').decode('utf-8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass  # If decoding fails, leave the string as-is

        # Step 2: Strip unwanted whitespace
    cleaned_value = value.strip()

    return cleaned_value


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


def transform_recruit_rankings(input_json, output_csv):
    """
    Reads recruit rankings data, transforms it, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw recruit rankings data from {input_json}")

    transformed_data = []

    for record in raw_data:
        transformed_data.append({
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("year"),
            "Rank": record.get("rank"),
            "Points": clean_float(record.get("points"))
        })

    recruit_df = pd.DataFrame(transformed_data)
    print(f"Transformed recruit rankings data contains {len(recruit_df)} records.")

    recruit_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed recruit rankings data saved to {output_csv}")


def transform_returning_ppa(input_json, output_csv):
    """
    Reads returning production data, transforms it, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw returning production data from {input_json}")

    transformed_data = []

    for record in raw_data:
        transformed_data.append({
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("season"),
            "Percent_ppa": clean_float(record.get("percent_ppa"))
        })

    returning_ppa_df = pd.DataFrame(transformed_data)
    print(f"Transformed returning production data contains {len(returning_ppa_df)} records.")

    returning_ppa_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed returning production data saved to {output_csv}")


def transform_sp_ratings(input_json, output_csv):
    """
    Reads SP+ ratings data, transforms it, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)
    print(f"Loaded raw SP+ ratings data from {input_json}")

    transformed_data = []

    for record in raw_data:
        transformed_data.append({
            "Team_name": clean_string(record.get("team")),
            "Season": record.get("year"),
            "Rating": clean_float(record.get("rating")),
            "Off_Rating": clean_float(record.get("offense", {}).get("rating")),
            "Def_Rating": clean_float(record.get("defense", {}).get("rating")),
            "ST_Rating": clean_float(record.get("special_teams", {}).get("rating"))
        })

    sp_ratings_df = pd.DataFrame(transformed_data)
    print(f"Transformed SP+ ratings data contains {len(sp_ratings_df)} records.")

    sp_ratings_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed SP+ ratings data saved to {output_csv}")


def transform_betting_lines(input_json, output_csv):
    """
    Reads betting line data, transforms it, and saves it to CSV.
    """
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)

    flattened_data = [item for sublist in raw_data for item in sublist]
    transformed_data = []
    for record in flattened_data:
        transformed_data.append({
            "Game_id": record.get("Game_id"),
            "Season": record.get("Season"),
            "Week": record.get("Week"),
            "Type": record.get("Type"),
            "Home_team": clean_string(record.get("Home_team")),
            "Away_team": clean_string(record.get("Away_team")),
            "Provider": clean_string(record.get("Provider")),
            "Formatted_spread": clean_string(record.get("Formatted_spread")),
            "Spread": clean_float(record.get("Spread")),
            "Opening_spread": clean_float(record.get("Opening_spread")),
            "Over_under": clean_float(record.get("Over_under")),
        })

    betting_lines_df = pd.DataFrame(transformed_data)
    betting_lines_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed betting line data saved to {output_csv}")


def transform_game_results(games_input, games_output):

    # Load the raw data
    with open(games_input, 'r', encoding='utf-8') as json_file:
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
    transformed_games_df.to_csv(games_output, index=False, encoding='utf-8-sig')
    print(f"Transformed  games data saved to {games_output}")


def transform_advanced_stats(input_json, output_csv):
    """
    Reads raw data from a JSON file, parses required fields into a structured format,
    and saves the transformed data to another CSV file.
    """
    # Load the raw data
    with open(input_json, 'r', encoding='utf-8') as json_file:
        raw_data = json.load(json_file)  # raw_data is a list of dictionaries
    print(f"Loaded raw data from {input_json}")

    transformed_data = []

    for record in raw_data:  # Iterate directly over raw_data (no nested loop needed)
        # Clean float fields
        record["Offense_ppa"] = clean_float(record.get("Offense_ppa"))
        record["Offense_success_rate"] = clean_float(record.get("Offense_success_rate"))
        record["Offense_explosiveness"] = clean_float(record.get("Offense_explosiveness"))
        record["Defense_ppa"] = clean_float(record.get("Defense_ppa"))
        record["Defense_success_rate"] = clean_float(record.get("Defense_success_rate"))
        record["Defense_explosiveness"] = clean_float(record.get("Defense_explosiveness"))

        # Clean string fields
        record["Team_name"] = clean_string(record.get("Team_name"))
        record["Oppt_name"] = clean_string(record.get("Oppt_name"))

        transformed_data.append(record)

    # Create a DataFrame from the transformed data
    transformed_df = pd.DataFrame(transformed_data)
    print(f"Transformed data contains {len(transformed_df)} records.")

    # Save the transformed DataFrame to a CSV file
    transformed_df.to_csv(output_csv, index=False, encoding='utf-8-sig')
    print(f"Transformed data saved to {output_csv}")


def main():
    #transform_fbs_teams(teams_input="data/teams_raw.json", teams_output="data/teams.csv")
    #transform_game_results(games_input="data/game_results_raw.json", games_output="data/game_results_bulk.csv")
    #transform_recruit_rankings(input_json="data/recruit_rankings.json", output_csv="data/recruit_rankings.csv")
    #transform_returning_ppa(input_json="data/returning_ppa.json", output_csv="data/returning_ppa.csv")
    #transform_sp_ratings(input_json="data/sp_ratings.json", output_csv="data/sp_ratings.csv")
    #transform_advanced_stats(input_json="data/combined_advanced_game_stats.json", output_csv="data/advanced_game_stats_bulk.csv")
    transform_betting_lines(input_json="data/betting_lines.json", output_csv="data/betting_lines.csv")


if __name__ == "__main__":
    main()

