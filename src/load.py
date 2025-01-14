from sqlalchemy import create_engine
import cfbd
import pandas as pd


engine = create_engine("postgresql+psycopg2://postgres:*****@localhost:*******")


# Insert the DataFrame into the database
##().to_sql('advanced_game_stats', engine, index=False, if_exists='append')



