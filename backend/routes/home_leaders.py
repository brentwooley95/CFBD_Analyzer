from fastapi import APIRouter, Depends
from backend.database.connection import connect_to_db
import asyncpg

router = APIRouter()

async def get_db():
    pool = await connect_to_db()
    async with pool.acquire() as conn:
        yield conn

# API Endpoint: Fetch top 5 all-time passing teams by season
@router.get("/home/pass_leaders")
async def get_passing_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, total_passing_offense_score 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY total_passing_offense_score DESC
        LIMIT 5
    """
    results = await db.fetch(query)
    return results

# API Endpoint: Fetch top 5 all-time rushing teams by season
@router.get("/home/rush_leaders")
async def get_rushing_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, total_rushing_offense_score 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY total_rushing_offense_score DESC
        LIMIT 5
    """
    results = await db.fetch(query)
    return results

# API Endpoint: Fetch top 5 explosive teams by season
@router.get("/home/explosive_leaders")
async def get_explosive_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, avg_explosiveness 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY avg_explosiveness DESC
        LIMIT 5
    """
    results = await db.fetch(query)
    return results

# API Endpoint: Fetch top 5 all-time passing defense teams by season
@router.get("/home/pass_defense_leaders")
async def get_pass_defense_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, total_passing_defense_score 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY total_passing_defense_score DESC
        LIMIT 5
    """
    results = await db.fetch(query)
    return results

# API Endpoint: Fetch top 5 all-time rushing defense teams by season
@router.get("/home/rush_defense_leaders")
async def get_rush_defense_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, total_rushing_defense_score 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY total_rushing_defense_score DESC
        LIMIT 5
    """
    results = await db.fetch(query)
    return results

# API Endpoint: Fetch top 5 containment leaders by season (best at limiting explosiveness)
@router.get("/home/containment_leaders")
async def get_containment_leaders(db=Depends(get_db)):
    query = """
        SELECT team_name, season, avg_allowed_explosiveness 
        FROM game_stats
        WHERE games_played >= 6
        ORDER BY avg_allowed_explosiveness DESC  
        LIMIT 5
    """
    results = await db.fetch(query)
    return results
