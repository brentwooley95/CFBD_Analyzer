
import cfbd
import json
import yaml
import time
import gc
import os


# Configuration setup
def load_config(file_path="config.yaml"):
    with open(file_path, 'r') as yaml_file:
        return yaml.safe_load(yaml_file)


config = load_config() # load config
CFBD_API_KEY = config["api"]["cfbd_api_key"]
paths = config["paths"]
settings = config["settings"]

config_api = cfbd.Configuration()
config_api.api_key['Authorization'] = CFBD_API_KEY
config_api.api_key_prefix['Authorization'] = 'Bearer'
stat_api = cfbd.StatsApi(cfbd.ApiClient(config_api))
team_api = cfbd.TeamsApi(cfbd.ApiClient(config_api))
game_api = cfbd.GamesApi(cfbd.ApiClient(config_api))
recruit_api = cfbd.RecruitingApi(cfbd.ApiClient(config_api))
rating_api = cfbd.RatingsApi(cfbd.ApiClient(config_api))
returning_api = cfbd.PlayersApi(cfbd.ApiClient(config_api))
betting_api = cfbd.BettingApi(cfbd.ApiClient(config_api))

def extract_fbs_teams(teams_output, year=2024):
    """fetch current FBS team. TODO: get current year"""
    raw_teams = team_api.get_fbs_teams(year=year)

    raw_teams_dict = [team.to_dict() for team in raw_teams]

    with open(teams_output, 'w') as json_file:
        json.dump(raw_teams_dict, json_file)
    print(f"Raw teams data saved to {teams_output}")


def extract_recruit_rankings(recruiting_output, start_year, end_year):
    """extract recruiting rankings over a range of seasons"""
    all_rankings = []

    for year in range(start_year, end_year + 1):
        try:
            print(f"Fetching recruiting rankings for year: {year}")
            raw_rankings = recruit_api.get_recruiting_teams(year=year)
            rankings_dict = [ranking.to_dict() for ranking in raw_rankings]
            all_rankings.extend(rankings_dict)
        except Exception as e:
            print(f"Error fetching recruiting rankings for year {year}: {e}")

    # Save all rankings to the output file
    with open(recruiting_output, 'w') as json_file:
        json.dump(all_rankings, json_file)
    print(f"Recruiting rankings saved to {recruiting_output}")


def extract_returning_ppa(returning_ppa_output, start_year, end_year):
    """Extract returning production PPA data over a range of seasons."""
    all_returning_ppa = []

    for year in range(start_year, end_year + 1):
        try:
            print(f"Fetching returning production PPA for year: {year}")
            raw_ret_ppa = returning_api.get_returning_production(year=year)
            returning_ppa_dict = [ppa.to_dict() for ppa in raw_ret_ppa]
            all_returning_ppa.extend(returning_ppa_dict)
        except Exception as e:
            print(f"Error fetching returning production PPA for year {year}: {e}")

    # Save all returning production data to the output file
    with open(returning_ppa_output, 'w') as json_file:
        json.dump(all_returning_ppa, json_file)
    print(f"Returning production PPA data saved to {returning_ppa_output}")


def extract_sp_ratings(sp_output, start_year, end_year):
    """Extract SP+ ratings over a range of seasons."""
    all_sp_ratings = []

    for year in range(start_year, end_year + 1):
        try:
            print(f"Fetching SP+ ratings for year: {year}")
            raw_sp_ratings = rating_api.get_sp_ratings(year=year)
            sp_ratings_dict = [rating.to_dict() for rating in raw_sp_ratings]
            all_sp_ratings.extend(sp_ratings_dict)
        except Exception as e:
            print(f"Error fetching SP+ ratings for year {year}: {e}")

    # Save all SP+ ratings to the output file
    with open(sp_output, 'w') as json_file:
        json.dump(all_sp_ratings, json_file)
    print(f"SP+ ratings saved to {sp_output}")


def extract_betting_lines(bl_output, start_year, end_year, valid_teams):
    """
    fetch certain betting line data by game for FBS teams
    """
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        teams = {team["school"] for team in raw_teams_dict}  # Extract team names

    with open(bl_output, 'w') as json_file:
        json_file.write('[')  # Start of JSON array
        all_games = []

        for year in range(start_year, end_year + 1):
            print(f"Fetching betting line data for year: {year}")
            try:
                game_bl = betting_api.get_lines(year=year)

                for game in game_bl:
                    game_bl_dict = game.to_dict()
                    if game_bl_dict.get("home_team") in teams or game_bl_dict.get("away_team") in teams:
                        lines = game_bl_dict.get("lines", [])

                        # Add all providers' lines
                        for line in lines:
                            all_games.append({
                                "Game_id": game_bl_dict.get("id"),
                                "Season": game_bl_dict.get("season"),
                                "Week": game_bl_dict.get("week"),
                                "Type": game_bl_dict.get("season_type"),
                                "Home_team": game_bl_dict.get("home_team"),
                                "Away_team": game_bl_dict.get("away_team"),
                                "Provider": line.get("provider"),
                                "Formatted_spread": line.get("formatted_spread"),
                                "Spread": line.get("spread"),
                                "Opening_spread": line.get("spread_open"),
                                "Over_under": line.get("over_under")
                            })
            except Exception as e:
                print(f"Error fetching betting line data for year {year}: {e}")

        # Write all filtered games to the JSON file
        json.dump(all_games, json_file, indent=4)
        json_file.write(']')  # End of JSON array

    print(f"Filtered betting line data saved to {bl_output}")


def extract_game_results(output_file, start_year, end_year, valid_teams, batch_size=3):
    """Fetch data from API in batches writing json game data to output, logs fetch time for each pull"""
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        teams = {team["id"] for team in raw_teams_dict}  # Extract team IDs

    # Split the years into batches
    years = list(range(start_year, end_year + 1))
    year_batches = [years[i:i + batch_size] for i in range(0, len(years), batch_size)]

    # Open the output file and write the opening JSON array bracket
    with open(output_file, 'w') as json_file:
        json_file.write('[')  # Start of JSON array

        for i, batch in enumerate(year_batches):
            start_time = time.time()
            try:
                print(f"Fetching game results for batch: {batch}")
                batch_data = []
                for year in batch:
                    # Fetch results for each year in the batch
                    year_data = extract_game_results_helper(year, teams)
                    batch_data.extend(year_data)

                # Write batch data to file
                if batch_data:
                    json.dump(batch_data, json_file)

                    # Add a comma if this isn't the last batch
                    if i < len(year_batches) - 1:
                        json_file.write(',')

                fetch_time = time.time() - start_time
                print(f"Batch {batch} fetched in {fetch_time:.2f} seconds")

            except Exception as e:
                print(f"Error processing batch {batch}: {e}")

        json_file.write(']')  # End of JSON array

    print(f"Filtered game results data saved to {output_file}")


def extract_game_results_helper(year, teams):
    """call API and build a list of json game data"""
    try:
        games = game_api.get_games(year=year, season_type="both")
        filtered_games = []
        for game in games:
            game_dict = game.to_dict()
            if game_dict.get("home_id") in teams or game_dict.get("away_id") in teams:
                filtered_games.append({
                    "Game_id": game_dict.get("id"),  # Replace with correct field for Game ID
                    "Season": game_dict.get("season"),
                    "Week": game_dict.get("week"),
                    "Type": game_dict.get("season_type"),
                    "Neutral": game_dict.get("neutral_site"),
                    "Home_id": game_dict.get("home_id"),
                    "Home_team": game_dict.get("home_team"),
                    "Home_points": game_dict.get("home_points"),
                    "Home_pg_elo": game_dict.get("home_pregame_elo"),
                    "Away_id": game_dict.get("away_id"),
                    "Away_team": game_dict.get("away_team"),
                    "Away_points": game_dict.get("away_points"),
                    "Away_pg_elo": game_dict.get("away_pregame_elo"),
                    "Excite": game_dict.get("excitement_index")

                })

        return filtered_games
    except Exception as e:
        print(f"Error fetching games & results data for year {year}: {e}")
        return [] # error -> return empty list


def extract_advanced_stats(output_file, start_year, end_year, valid_teams, batch_size=3):
    """
    Fetch ags data from API in batches writing json game data to output,
    logs fetch time for each pull. This API call is seemingly throttled or reduced? on subsequent calls.
    1st call: 8 seconds, 10th call: ~200-300 seconds and continues to about 20-30 mins on 20
    TODO: find a way to make "meatier" calls
    Calling in 3 year batches is solution at the moment. Can take 1-2 hours to pull ~29000 rows
    Calls to this table require a year or team filter.
    Year filter allows for bigger pulls ( ~3300 rows vs ~500)
    """
    # Load valid FBS teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        teams = {team["school"] for team in raw_teams_dict}  # Extract team names

    years = list(range(start_year, end_year + 1))
    year_batches = [years[i:i + batch_size] for i in range(0, len(years), batch_size)]

    # Open the output file and write the opening JSON array bracket
    with open(output_file, 'w') as json_file:
        json_file.write('[')  # Start of JSON array

        # processing years sequentially & incrementally
        for i, batch in enumerate(year_batches):
            start_time = time.time()
            try:
                print(f"Fetching AGS data for batch: {batch}")
                year_data = extract_adv_stats_helper(batch, teams)  # Call helper for a single year
                fetch_time = time.time() - start_time
                print(f"batch {batch} fecthed in {fetch_time:.2f} seconds")

                if year_data:
                    json.dump(year_data, json_file)  # Save all data at once
                    del year_data
                    gc.collect() # release mem & trigger garbage collection
                    time.sleep(10) # wait a couple second
                    if i < len(year_batches):
                        json_file.write(',')
            except Exception as e:
                print(f"Error prcoessing AGS for years {batch}: {e}")
        json_file.write(']')
    print(f"Filtered AGS data saved to {output_file}")


def extract_adv_stats_helper(year_batch, teams):
    """call API and build a list of json game and stats data"""
    try:
        flattened_ags = []
        for year in year_batch:
            start_api_time = time.time()
            ags = stat_api.get_advanced_team_game_stats(year=year, exclude_garbage_time=True, season_type="both")
            api_fetch_time = time.time() - start_api_time # api fetch time, it seems api calls are throttled
            print(f"API call for year {year} took {api_fetch_time:.2f} seconds") # logging time
            for game in ags:
                game_dict = game.to_dict()
                if game_dict.get("team") in teams and game_dict.get("opponent") in teams:
                    flattened_game = {
                        "Game_id": game_dict.get("game_id"),  # Replace with correct field for Game ID
                        "Team_name": game_dict.get("team"),
                        "Oppt_name": game_dict.get("opponent"),
                        "Week": game_dict.get("week"),
                        "Offense_ppa": game_dict.get("offense", {}).get("ppa"),  # Adjust field name if necessary
                        "Offense_success_rate": game_dict.get("offense", {}).get("success_rate"),
                        "Offense_explosiveness": game_dict.get("offense", {}).get("explosiveness"),
                        "Defense_ppa": game_dict.get("defense", {}).get("ppa"),
                        "Defense_success_rate": game_dict.get("defense", {}).get("success_rate"),
                        "Defense_explosiveness": game_dict.get("defense", {}).get("explosiveness"),
                    }
                    flattened_ags.append(flattened_game)

        return flattened_ags
    except Exception as e:
        print(f"Error fetching AGS data for year {year_batch}: {e}")
        return [] # error -> returnempty list


def combine_json_files(input_folder, output_file):
    """
    Combine multiple JSON files into a single JSON file.
    ***QUICKFIX for bulk extracts requiring multiple years***
    """
    all_data = []

    # Iterate over all JSON files in the input folder
    for file_name in sorted(os.listdir(input_folder)):
        if file_name.startswith("advanced_game_stats_raw") and file_name.endswith(".json"):
            file_path = os.path.join(input_folder, file_name)
            print(f"Processing file: {file_path}")
            try:
                with open(file_path, 'r') as json_file:
                    data = json.load(json_file)  # Load the JSON data
                    # Check if the data is a nested list and flatten it
                    if isinstance(data, list) and isinstance(data[0], list):
                        for sublist in data:
                            all_data.extend(sublist)  # Flatten nested lists
                    else:
                        all_data.extend(data)  # Add directly if not nested
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON in file: {file_path}")
                print(e)
                continue  # Skip this file

    # Save the combined data to the output file
    with open(output_file, 'w') as output_json:
        json.dump(all_data, output_json, indent=4)

    print(f"Combined JSON saved to {output_file}")


def main():
    # Use paths from the config file
    teams_output = paths["teams_output"]
    recruit_rankings_output = paths["recruit_rankings_output"]
    returning_ppa_output = paths["returning_ppa_output"]
    sp_ratings_output = paths["sp_ratings_output"]
    game_results_output = paths["game_results_output"]
    advanced_stats_output = paths["advanced_stats_output"]
    betting_lines_output = paths["betting_lines_output"]

    # Use settings from the config file
    start_year = settings["start_year"]
    end_year = settings["end_year"]

    # Execute extraction tasks
    #extract_recruit_rankings(recruit_rankings_output, start_year, end_year)
    #extract_returning_ppa(returning_ppa_output, start_year, end_year)
    #extract_sp_ratings(sp_ratings_output, start_year, end_year)
    extract_betting_lines(betting_lines_output, start_year, end_year, teams_output)
    #extract_game_results(game_results_output, start_year, end_year, teams_output)
    #extract_advanced_stats(advanced_stats_output, start_year, end_year, teams_output)


if __name__ == "__main__":
    main()







