from fastapi import APIRouter, Depends
from backend.database.connection import connect_to_db
import asyncpg

router = APIRouter()

async def get_db():
    pool = await connect_to_db()
    async with pool.acquire() as conn:
        yield conn

# API Endpoint: Fetch Game Stats
@router.get("/game_stats")
async def get_game_stats(season: int, team1: str, team2: str, db=Depends(get_db)):
    query = """
        SELECT * FROM game_stats
        WHERE season = $1 AND team_name IN ($2, $3)
    """
    results = await db.fetch(query, season, team1, team2)
    return results

# API Endpoint: Fetch Record Breakdown
@router.get("/record_breakdown")
async def get_record_breakdown(season: int, team1: str, team2: str, db=Depends(get_db)):
    query = """
        SELECT * FROM record_breakdown
        WHERE season = $1 AND team_name IN ($2, $3)
    """
    results = await db.fetch(query, season, team1, team2)
    return results

# API Endpoint: Fetch List of Teams from `teams` Table
@router.get("/teams")
async def get_teams(db: asyncpg.Connection = Depends(get_db)):
    query = "SELECT DISTINCT team_name FROM teams ORDER BY team_name"
    results = await db.fetch(query)
    return [record["team_name"] for record in results]  # Return list of team names

# API Endpoint: Fetch Available Seasons
@router.get("/seasons")
async def get_seasons(db: asyncpg.Connection = Depends(get_db)):
    query = "SELECT DISTINCT season FROM game_results ORDER BY season DESC"
    results = await db.fetch(query)
    return [record["season"] for record in results]  # Return list of seasons
