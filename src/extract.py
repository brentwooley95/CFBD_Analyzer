
import cfbd
import json
import yaml
import time
import flatdict
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

# API Endpoints:
stat_api = cfbd.StatsApi(cfbd.ApiClient(config_api))
team_api = cfbd.TeamsApi(cfbd.ApiClient(config_api))
game_api = cfbd.GamesApi(cfbd.ApiClient(config_api))
recruit_api = cfbd.RecruitingApi(cfbd.ApiClient(config_api))
rating_api = cfbd.RatingsApi(cfbd.ApiClient(config_api))
returning_api = cfbd.PlayersApi(cfbd.ApiClient(config_api))
coaches_api = cfbd.CoachesApi(cfbd.ApiClient(config_api))


def extract_fbs_teams(teams_output, year=2024):
    """fetch current FBS team. TODO: get current year"""

    try:
        print(f"Fetching FBS teams for year: {year}")
        raw_teams = team_api.get_fbs_teams(year=year)
        raw_teams_dict = [team.to_dict() for team in raw_teams]
        with open(teams_output, 'w') as json_file:
            json.dump(raw_teams_dict, json_file)
        print(f"Raw teams data saved to {teams_output}")
    except Exception as e:
        print(f"Error fetching FBS teams for year {year}: {e}")


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


def extract_coach_ratings(coach_output, start_year, end_year):
    """
    fetch certain betting line data by game for FBS teams
    """

    all_coach_ratings = []

    for year in range(start_year, end_year + 1):
        try:
            print(f"Fetching coach ratings for year: {year}")
            raw_coach_ratings = coaches_api.get_coaches(year=year)
            coach_ratings_dict = [rating.to_dict() for rating in raw_coach_ratings]
            all_coach_ratings.extend(coach_ratings_dict)
        except Exception as e:
            print(f"Error fetching coach ratings for year {year}: {e}")

    with open(coach_output, 'w') as json_file:
        json.dump(all_coach_ratings, json_file)
    print(f"Coach ratings saved to {coach_output}")


def extract_game_results(games_output, start_year, end_year, batch_size=3):
    """Fetch data from API in batches writing json game data to output, logs fetch time for each pull"""
    # Split the years into batches
    years = list(range(start_year, end_year + 1))
    year_batches = [years[i:i + batch_size] for i in range(0, len(years), batch_size)]

    games_data = []

    for batch in year_batches:
        start_time = time.time()
        try:
            print(f"Fetching games & results data for batch: {batch}")
            year_data = extract_game_results_helper(batch)  # Get data for the batch
            fetch_time = time.time() - start_time
            print(f"Batch {batch} fetched in {fetch_time:.2f} seconds")

            if year_data:
                games_data.extend(year_data)  # Append batch data to the collection
            else:
                print(f"No data found for batch {batch}")

        except Exception as e:
            print(f"Error processing batch {batch}: {e}")

    # Write all collected data to the output file as a JSON array
    try:
        with open(games_output, 'w') as json_file:
            json.dump(games_data, json_file, indent=4)
        print(f"Filtered games & results data saved to {games_output}")
    except Exception as e:
        print(f"Error writing to {games_output}: {e}")


def extract_game_results_helper(year_batch):
    """call API and build a list of json game data"""
    try:
        flat_games_data = []
        for year in year_batch:
            games = game_api.get_games(year=year, season_type="both")
            for game in games:
                # flatten game data
                flat_game = dict(flatdict.FlatDict(game.to_dict(), delimiter='.'))
                flat_games_data.append(flat_game)

        return flat_games_data
    except Exception as e:
        print(f"Error fetching games & results data for year {year_batch}: {e}")
        return [] # error -> return empty list


def extract_advanced_stats(ags_output, start_year, end_year, batch_size=3):
    """
    Fetch ags data from API in batches writing json game data to output,
    logs fetch time for each pull. This API call is seemingly throttled or reduced? on subsequent calls.
    1st call: 8 seconds, 10th call: ~200-300 seconds and continues to about 20-30 mins on 20
    TODO: find a way to make "meatier" calls
    Calling in 3 year batches is solution at the moment. Can take 1-2 hours to pull ~29000 rows
    Calls to this table require a year or team filter.
    Year filter allows for bigger pulls ( ~3300 rows vs ~500)
    """
    # Split the years into batches
    years = list(range(start_year, end_year + 1))
    year_batches = [years[i:i + batch_size] for i in range(0, len(years), batch_size)]

    ags_data = []  # Collect all data before writing to the file

    for batch in year_batches:
        start_time = time.time()
        try:
            print(f"Fetching AGS data for batch: {batch}")
            year_data = extract_adv_stats_helper(batch)  # Get data for the batch
            fetch_time = time.time() - start_time
            print(f"Batch {batch} fetched in {fetch_time:.2f} seconds")

            if year_data:
                ags_data.extend(year_data)  # Append batch data to the collection
            else:
                print(f"No data found for batch {batch}")

        except Exception as e:
            print(f"Error processing batch {batch}: {e}")

    # Write all collected data to the output file as a JSON array
    try:
        with open(ags_output, 'w') as json_file:
            json.dump(ags_data, json_file, indent=4)
        print(f"Filtered AGS data saved to {ags_output}")
    except Exception as e:
        print(f"Error writing to {ags_output}: {e}")


def extract_adv_stats_helper(year_batch):
    """call API and build a list of json game and stats data"""
    try:
        flat_ags_data = []
        for year in year_batch:
            start_api_time = time.time()
            # API CALL: Exclude "garbage time" data, include both regular & postseason games
            ags = stat_api.get_advanced_team_game_stats(year=year, exclude_garbage_time=True, season_type="both")
            api_fetch_time = time.time() - start_api_time # api fetch time, it seems api calls are throttled
            print(f"API call for year {year} took {api_fetch_time:.2f} seconds") # logging time
            for game in ags:
                # Flatten all data dynamically
                flat_game = dict(flatdict.FlatDict(game.to_dict(), delimiter='.'))
                flat_ags_data.append(flat_game)

        return flat_ags_data
    except Exception as e:
        print(f"Error fetching AGS data for year {year_batch}: {e}")
        return []  # error -> return empty list


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

