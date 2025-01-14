from concurrent.futures import ThreadPoolExecutor, as_completed
import cfbd
import json
from retry import retry

CFBD_API_KEY = ''

config = cfbd.Configuration()
config.api_key['Authorization'] = CFBD_API_KEY
config.api_key_prefix['Authorization'] = 'Bearer'
# API Configs. See https://github.com/CFBD/cfbd-python?tab=readme-ov-file for more
stat_api = cfbd.StatsApi(cfbd.ApiClient(config))
team_api = cfbd.TeamsApi(cfbd.ApiClient(config))
game_api = cfbd.GamesApi(cfbd.ApiClient(config))


def extract_fbs_teams(teams_output, year=2024):
    """fetch current FBS team. TODO: get current year"""
    raw_teams = team_api.get_fbs_teams(year=year)

    raw_teams_dict = [team.to_dict() for team in raw_teams]

    with open(teams_output, 'w') as json_file:
        json.dump(raw_teams_dict, json_file)
    print(f"Raw teams data saved to {teams_output}")


def extract_game_results(start_year, end_year, valid_teams, output_file, max_workers=10):
    """fetch raw data for all years in paralell? and save"""
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        teams = {team["id"] for team in raw_teams_dict}
        print(F"team_ids:{teams}teams")
    # threadpool executor for parallel processing?
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(extract_game_results_helper, year, teams): year for year in
                   range(start_year, end_year + 1)}

        with open(output_file, 'w') as json_file:
            json_file.write('[')  # Start of JSON array
            for i, future in enumerate(as_completed(futures)):
                year = futures[future]
                try:
                    print(f"Fetching games & results data for year: {year}")
                    year_data = future.result()  # Already filtered data
                    json.dump(year_data, json_file)
                    if i < len(futures) - 1:  # Add a comma if not the last element
                        json_file.write(',')
                except Exception as e:
                    print(f"Error processing games & results for year {year}: {e}")
            json_file.write(']')  # End of JSON array
    print(f"Filtered games & results data saved to {output_file}")


@retry(tries=3, delay=2, backoff=2) # retry calls on failure/throttle?
def extract_game_results_helper(year, teams):
    """fetch advanced game stats from API by year"""
    try:
        games = game_api.get_games(year=year)
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


def extract_advanced_stats(start_year, end_year, valid_teams, output_file, max_workers=10):
    """fetch raw data for all years in parallell and save to file"""
    # Load valid FBS teams
    with open(valid_teams, 'r') as file:
        raw_teams_dict = json.load(file)
        teams = {team["school"] for team in raw_teams_dict}  # Extract team names

    # threadpool executor for parallel processing or some shit idk(check doc)
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(extract_adv_stats_helper, year, teams): year for year in range(start_year, end_year + 1)}
        # write to json
        with open(output_file, 'w') as json_file:
            json_file.write('[')  # Start of JSON array
            for i, future in enumerate(as_completed(futures)):
                year = futures[future]
                try:
                    print(f"Fetching AGS data for year: {year}")
                    year_data = future.result()  # Already filtered data
                    json.dump(year_data, json_file)
                    if i < len(futures) - 1:  # Add a comma if not the last element
                        json_file.write(',')
                except Exception as e:
                    print(f"Error processing AGS for year {year}: {e}")
            json_file.write(']')  # End of JSON array
    print(f"Filtered AGS data saved to {output_file}")


@retry(tries=3, delay=2, backoff=2) # retry calls on failure/throttle?
def extract_adv_stats_helper(year, teams):
    """fetch advanced game stats from API by year"""
    try:
        ags = stat_api.get_advanced_team_game_stats(year=year)
        filtered_ags = []

        for game in ags:
            game_dict = game.to_dict()
            if game_dict.get("team") in teams:
                filtered_ags.append({
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
                })

        return filtered_ags
    except Exception as e:
        print(f"Error fetching AGS data for year {year}: {e}")
        return [] # error -> returnempty list
