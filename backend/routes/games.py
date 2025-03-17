from fastapi import APIRouter, Depends
from backend.database.connection import connect_to_db
import asyncpg

router = APIRouter()


async def get_db():
    pool = await connect_to_db()
    async with pool.acquire() as conn:
        yield conn



# API Endpoint: Fetch Game Performances for a Team in a Specific Season
@router.get("/games/game_performance")
async def get_team_game_performance(team_name: str, season: int, db=Depends(get_db)):
    query = """
        SELECT * 
        FROM game_performance
        WHERE team_name = $1 AND season = $2
        ORDER BY game_date ASC;
    """
    results = await db.fetch(query, team_name, season)
    return results
