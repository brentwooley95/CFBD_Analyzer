
import argparse
from src.extract import (
    extract_fbs_teams,
    extract_recruit_rankings,
    extract_returning_ppa,
    extract_sp_ratings,
    extract_betting_lines,
    extract_game_results,
    extract_advanced_stats,
)
from src.transform import (
    transform_fbs_teams,
    transform_recruit_rankings,
    transform_returning_ppa,
    transform_sp_ratings,
    transform_betting_lines,
    transform_game_results,
    transform_advanced_stats,
)
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
    paths = config["paths"]
    settings = config["settings"]

    # CLI Argument Parsing
    parser = argparse.ArgumentParser(description="ETL Pipeline for College Football Data")
    subparsers = parser.add_subparsers(dest="command", help="ETL commands")

    # Run Command
    run_parser = subparsers.add_parser(
        "run", help="Run extraction, transformation, and/or loading tasks"
    )
    run_parser.add_argument(
        "task",
        type=str,
        help=(
            "Specify the task to run: all, fbs_teams, recruits, ppa, ratings, games, advanced, betting"
        ),
    )
    run_parser.add_argument("-e", "--extract", action="store_true", help="Run extraction tasks")
    run_parser.add_argument("-t", "--transform", action="store_true", help="Run transformation tasks")
    run_parser.add_argument("-l", "--load", action="store_true", help="Run load tasks")
    run_parser.add_argument(
        "--years",
        type=parse_years,
        help="Specify the year range in 'YYYY-YYYY' format (e.g., 2010-2015).",
    )

    args = parser.parse_args()

    # Determine start and end year
    if args.years:
        start_year, end_year = args.years
    else:
        start_year, end_year = settings["start_year"], settings["end_year"]

    # File paths from config
    fbs_teams_output = paths["fbs_teams_output"]
    recruit_rankings_output = paths["recruit_rankings_output"]
    returning_ppa_output = paths["returning_ppa_output"]
    sp_ratings_output = paths["sp_ratings_output"]
    game_results_output = paths["game_results_output"]
    advanced_stats_output = paths["advanced_stats_output"]
    betting_lines_output = paths["betting_lines_output"]

    # Load team mapping for transformation tasks
    team_mapping = load_team_mapping("data/teams.csv") if args.transform else None

    # Function Dispatch Dictionary
    extract_dispatch = {
        "teams": lambda: extract_fbs_teams(fbs_teams_output, year=end_year),
        "recruits": lambda: extract_recruit_rankings(recruit_rankings_output, start_year, end_year),
        "ret_ppa": lambda: extract_returning_ppa(returning_ppa_output, start_year, end_year),
        "ratings": lambda: extract_sp_ratings(sp_ratings_output, start_year, end_year),
        "games": lambda: extract_game_results(game_results_output, start_year, end_year, fbs_teams_output),
        "ags": lambda: extract_advanced_stats(advanced_stats_output, start_year, end_year, fbs_teams_output),
        "betting": lambda: extract_betting_lines(betting_lines_output, start_year, end_year, fbs_teams_output),
    }

    transform_dispatch = {
        "teams": lambda: transform_fbs_teams(teams_input=fbs_teams_output, teams_output="data/teams.csv"),
        "recruits": lambda: transform_recruit_rankings(
            input_json=recruit_rankings_output, output_csv="data/recruit_rankings.csv", team_mapping=team_mapping
        ),
        "ret_ppa": lambda: transform_returning_ppa(
            input_json=returning_ppa_output, output_csv="data/returning_ppa.csv", team_mapping=team_mapping
        ),
        "ratings": lambda: transform_sp_ratings(
            input_json=sp_ratings_output, output_csv="data/sp_ratings.csv", team_mapping=team_mapping
        ),
        "games": lambda: transform_game_results(
            games_input=game_results_output, games_output="data/game_results_bulk.csv"
        ),
        "ags": lambda: transform_advanced_stats(
            input_json=advanced_stats_output, output_csv="data/advanced_game_stats_bulk.csv", team_mapping=team_mapping
        ),
        "betting": lambda: transform_betting_lines(
            input_json=betting_lines_output, output_csv="data/betting_lines.csv"
        ),
    }

    # Execute tasks based on user input
    if args.command == "run":
        if args.task == "all":
            if args.extract:
                print(f"Extracting all data for years {start_year}-{end_year}...")
                for task_name, extract_func in extract_dispatch.items():
                    extract_func()

            if args.transform:
                print("Transforming all extracted data...")
                for task_name, transform_func in transform_dispatch.items():
                    transform_func()

            # if args.load:
            #     print("Loading all transformed data...")
            #     load_data()  # Replace with your actual load logic

        elif args.task in extract_dispatch:
            if args.extract:
                print(f"Extracting {args.task} data for years {start_year}-{end_year}...")
                extract_dispatch[args.task]()

            if args.transform:
                print(f"Transforming {args.task} data...")
                transform_dispatch[args.task]()

            # if args.load:
            #     print(f"Loading {args.task} data...")
            #     load_data()  # Replace with actual load logic

        else:
            print("Invalid task specified.")
            parser.print_help()
    else:
        print("Invalid command. Use 'run' to execute the ETL pipeline.")
        parser.print_help()


if __name__ == "__main__":
    main()
