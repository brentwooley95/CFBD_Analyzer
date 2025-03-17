from fastapi import APIRouter, Depends
from backend.database.connection import connect_to_db
import asyncpg

router = APIRouter()


async def get_db():
    pool = await connect_to_db()
    async with pool.acquire() as conn:
        yield conn


# API Endpoint: Fetch Game Stats (Supports Two Different Seasons)
@router.get("/game_stats")
async def get_game_stats(season1: int, team1: str, season2: int, team2: str, db=Depends(get_db)):
    query = """
        SELECT * FROM game_stats
        WHERE (season = $1 AND team_name = $2) 
        OR (season = $3 AND team_name = $4)
    """
    results = await db.fetch(query, season1, team1, season2, team2)
    return results


# API Endpoint: Fetch Record Breakdown (Supports Two Different Seasons)
@router.get("/record_breakdown")
async def get_record_breakdown(season1: int, team1: str, season2: int, team2: str, db=Depends(get_db)):
    query = """
        SELECT * FROM record_breakdown
        WHERE (season = $1 AND team_name = $2) 
        OR (season = $3 AND team_name = $4)
    """
    results = await db.fetch(query, season1, team1, season2, team2)
    return results

# API Endpoint: Fetch Recruiting Rankings (Supports Two Different Seasons)
@router.get("/recruiting_rankings")
async def get_recruiting_rankings(season1: int, team1: str, season2: int, team2: str, db=Depends(get_db)):
    query = """
        SELECT r.season, t.team_name, r.recruiting_rank, r.recruiting_points
        FROM recruit_rankings r
        JOIN teams t ON r.team_id = t.team_id
        WHERE (r.season = $1 AND t.team_name = $2)
            OR (r.season = $3 AND t.team_name = $4)
    """
    results = await db.fetch(query, season1, team1, season2, team2)
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


# API Endpoint: Fetch Postseason Results
@router.get("/postseason_results")
async def get_postseason_results(season1: int, team1: str, season2: int, team2: str, db=Depends(get_db)):
    query = """
          SELECT team_name, season, postseason_name,
        CASE WHEN postseason_name != 'No Postseason' THEN opponent_name ELSE NULL END AS opponent_name,
        CASE WHEN postseason_name != 'No Postseason' THEN result ELSE NULL END AS result,
        CASE WHEN postseason_name != 'No Postseason' THEN team_score ELSE NULL END AS team_score,
        CASE WHEN postseason_name != 'No Postseason' THEN opponent_score ELSE NULL END AS opponent_score
    FROM postseason_results
    WHERE (season = $1 AND team_name = $2)
       OR (season = $3 AND team_name = $4)
    """

    results = await db.fetch(query, season1, team1, season2, team2)
    return results
