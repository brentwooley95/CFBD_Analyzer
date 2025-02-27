from sqlalchemy import create_engine
import pandas as pd
import os


engine = create_engine("postgresql+psycopg2://postgres:5262ghiq@localhost:5262/cfbd_stats")

DATA_DIR = "/Users/brentwooley/PycharmProjects/CFdatapipeline/data/transformed_new"


# Table-to-CSV mapping (ordered for dependencies)
TABLES = {
    "teams": "teams.csv",
    "game_results": "game_results_bulk.csv",
    "advanced_game_stats": "advanced_game_stats_bulk.csv",
    "recruit_rankings": "recruit_rankings.csv",
    "returning_ppa": "returning_ppa.csv",
    "sp_ratings": "sp_ratings.csv",
    "coaches": "coach_bulk.csv"
}

# Auto-incremented primary keys to exclude from inserts
AUTO_INCREMENT_COLUMNS = {
    "advanced_game_stats": "stat_id",
    "coaches": "coach_id",
    "recruit_rankings": "recruit_rank_id",
    "returning_ppa": "ret_ppa_id",
    "sp_ratings": "rating_id"
}

# Column renaming (if CSV headers don't match database schema)
COLUMN_MAPPINGS = {
    "recruit_rankings": {
        "Rank": "recruiting_rank",
        "Points": "recruiting_points",
    }
}


def load_data():
    for table, file in TABLES.items():
        file_path = os.path.join(DATA_DIR, file)

        if os.path.exists(file_path):
            print(f"Loading {file} into {table}...")

            # Read CSV file into pandas DataFrame
            df = pd.read_csv(file_path)

            # Rename columns if needed (fix schema mismatches)
            if table in COLUMN_MAPPINGS:
                df.rename(columns=COLUMN_MAPPINGS[table], inplace=True)

            # Convert all column names to lowercase (PostgreSQL is case-sensitive)
            df.columns = df.columns.str.lower()

            # Convert boolean fields (ensure True/False values insert correctly)
            if "neutral_site" in df.columns:
                df["neutral_site"] = df["neutral_site"].astype(bool)

            # Drop auto-increment columns (PostgreSQL generates them automatically)
            if table in AUTO_INCREMENT_COLUMNS and AUTO_INCREMENT_COLUMNS[table].lower() in df.columns:
                df.drop(columns=[AUTO_INCREMENT_COLUMNS[table].lower()], inplace=True)

            # Handle missing values (replace NaN with None for PostgreSQL compatibility)
            df = df.where(pd.notnull(df), None)

            # Insert data into PostgreSQL
            df.to_sql(table, con=engine, if_exists="append", index=False)
            print(f"Successfully loaded {file} into {table}.")

        else:
            print(f"Warning: {file} not found. Skipping {table}.")


if __name__ == "__main__":
    load_data()
    print("Data loading complete!")




