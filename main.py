
import argparse
from src.extract import *
from src.transform import *
from src.utils import load_config
import pandas as pd


def load_team_mapping(fbs_teams_path):
    """Loads the FBS teams dataset and creates a mapping of Team_name to Team_id."""
    fbs_teams_df = pd.read_csv(fbs_teams_path)
    return fbs_teams_df.set_index("Team_name")["Team_id"].to_dict()


def parse_years(years):
    """Parses a 'YYYY-YYYY' string into start and end year."""
    try:
        start_year, end_year = map(int, years.split("-"))
        return start_year, end_year
    except ValueError:
        raise argparse.ArgumentTypeError("Invalid format for --years. Use 'YYYY-YYYY'.")


def main():
    # Load configuration
    config = load_config("config.yaml")
    paths, settings = config["paths"], config["settings"]

    # CLI Argument Parsing
    parser = argparse.ArgumentParser(description="ETL workflow runner for CFBD pipeline")
    subparsers = parser.add_subparsers(dest="command")

    # Run Command
    run_parser = subparsers.add_parser("run", help="Run extraction, transformation, and/or loading tasks")
    run_parser.add_argument("task", choices=[
        "all",
        "teams",
        "recruits",
        "ret_ppa",
        "ratings",
        "games",
        "args",
        'coaches'
    ], help="Task to execute")
    run_parser.add_argument("-e", "--extract", action="store_true", help="Run extraction tasks")
    run_parser.add_argument("-t", "--transform", action="store_true", help="Run transformation tasks")
    run_parser.add_argument("-l", "--load", action="store_true", help="Run load tasks")
    run_parser.add_argument("--years", type=parse_years, help="Year range 'YYYY-YYYY'")
    # define agrument input
    args = parser.parse_args()

    # Determine start and end year
    if args.years:
        start_year, end_year = args.years
    else:
        start_year, end_year = settings["start_year"], settings["end_year"]

    # Load team mapping for transformation tasks
    team_mapping = load_team_mapping("data/Transformed_bulk/teams.csv") if args.transform else None

    extract_funcs = {
        "teams": lambda: extract_fbs_teams(paths["fbs_teams_raw"], year=end_year),
        "recruits": lambda: extract_recruit_rankings(paths["recruit_rankings_raw"], start_year, end_year),
        "ret_ppa": lambda: extract_returning_ppa(paths["returning_ppa_raw"], start_year, end_year),
        "ratings": lambda: extract_sp_ratings(paths["sp_ratings_raw"], start_year, end_year),
        "games": lambda: extract_game_results(paths["game_results_raw"], start_year, end_year),
        "ags": lambda: extract_advanced_stats(paths["advanced_stats_raw"], start_year, end_year),
        "coaches": lambda: extract_coach_ratings(paths["coaches_raw"], start_year, end_year)
    }

    transform_funcs = {
        "teams": lambda: transform_fbs_teams(
            paths["fbs_teams_raw"],
            paths["fbs_teams_tran"]
        ),
        "recruits": lambda: transform_recruit_rankings(
            paths["recruit_rankings_raw"],
            paths["recruit_rankings_tran"],
            team_mapping
        ),
        "ret_ppa": lambda: transform_returning_ppa(
            paths["returning_ppa_raw"],
            paths["returning_ppa_tran"],
            team_mapping
        ),
        "ratings": lambda: transform_sp_ratings(
            paths["sp_ratings_raw"],
            paths["sp_ratings_tran"],
            team_mapping
        ),
        "games": lambda: transform_game_results(
            paths["game_results_raw"],
            paths["games_results_tran"],
            paths["fbs_teams_raw"]
        ),
        "ags": lambda: transform_advanced_stats(
            paths["advanced_stats_raw"],
            paths["advanced_stats_tran"],
            paths["fbs_teams_raw"],
            team_mapping
        ),
        "coaches": lambda: transform_coach_ratings(
            paths["coaches_raw"],
            paths["coaches_tran"],
            paths["fbs_teams_raw"],
            team_mapping
        )
    }

    if args.command == "run":
        tasks = extract_funcs.keys() if args.task == "all" else [args.task]

        if args.extract:
            print(f"Extracting: {', '.join(tasks)} for years {start_year}-{end_year}")
            for task in tasks:
                extract_funcs[task]()

        if args.transform:
            print(f"Transforming: {', '.join(tasks)}")
            for task in tasks:
                transform_funcs[task]()

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
