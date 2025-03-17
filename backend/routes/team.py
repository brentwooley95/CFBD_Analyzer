from fastapi import APIRouter, Depends
from backend.database.connection import connect_to_db
import asyncpg

router = APIRouter()


async def get_db():
    pool = await connect_to_db()
    async with pool.acquire() as conn:
        yield conn


@router.get("/team/game_stats")
async def get_team_game_stats(team: str, db=Depends(get_db)):
    # Fetch available seasons dynamically
    seasons_query = "SELECT DISTINCT season FROM game_results ORDER BY season ASC"
    available_seasons = await db.fetch(seasons_query)
    seasons = [record["season"] for record in available_seasons]

    # Fetch game stats for the given team in all available seasons
    query = """
        SELECT * FROM game_stats
        WHERE team_name = $1 AND season = ANY($2)
        ORDER BY season
    """
    results = await db.fetch(query, team, seasons)
    return results


@router.get("/team/record_breakdown")
async def get_team_record_breakdown(team: str, db=Depends(get_db)):
    query = """
        SELECT team_name,
               SUM(wins_vs_tier1) AS wins_vs_tier1, SUM(losses_vs_tier1) AS losses_vs_tier1,
               SUM(wins_vs_tier2) AS wins_vs_tier2, SUM(losses_vs_tier2) AS losses_vs_tier2,
               SUM(wins_vs_tier3) AS wins_vs_tier3, SUM(losses_vs_tier3) AS losses_vs_tier3,
               SUM(wins_vs_tier4) AS wins_vs_tier4, SUM(losses_vs_tier4) AS losses_vs_tier4,
               SUM(wins_vs_tier5) AS wins_vs_tier5, SUM(losses_vs_tier5) AS losses_vs_tier5,
               SUM(wins_vs_tier6) AS wins_vs_tier6, SUM(losses_vs_tier6) AS losses_vs_tier6,
               SUM(total_wins) AS total_wins, SUM(total_losses) AS total_losses
        FROM record_breakdown
        WHERE team_name = $1
        GROUP BY team_name
    """
    results = await db.fetch(query, team)
    return results


@router.get("/team/postseason_results")
async def get_team_postseason_results(team: str, db=Depends(get_db)):
    # Fetch available seasons dynamically
    seasons_query = "SELECT DISTINCT season FROM game_results ORDER BY season ASC"
    available_seasons = await db.fetch(seasons_query)
    seasons = [record["season"] for record in available_seasons]

    # Fetch postseason results for the given team in all available seasons
    query = """
        SELECT team_name, season, postseason_name,
        CASE WHEN postseason_name != 'No Postseason' THEN opponent_name ELSE NULL END AS opponent_name,
        CASE WHEN postseason_name != 'No Postseason' THEN result ELSE NULL END AS result,
        CASE WHEN postseason_name != 'No Postseason' THEN team_score ELSE NULL END AS team_score,
        CASE WHEN postseason_name != 'No Postseason' THEN opponent_score ELSE NULL END AS opponent_score
        FROM postseason_results
        WHERE team_name = $1 AND season = ANY($2)
        ORDER BY season
    """
    results = await db.fetch(query, team, seasons)
    return results


@router.get("/team/recruiting_rankings")
async def get_team_recruiting_rankings(team: str, db=Depends(get_db)):
    # Fetch available seasons dynamically
    seasons_query = "SELECT DISTINCT season FROM game_results ORDER BY season ASC"
    available_seasons = await db.fetch(seasons_query)
    seasons = [record["season"] for record in available_seasons]

    # Fetch recruiting rankings for the given team in all available seasons
    query = """
        SELECT r.season, t.team_name, r.recruiting_rank, r.recruiting_points
        FROM recruit_rankings r
        JOIN teams t ON r.team_id = t.team_id
        WHERE t.team_name = $1 AND r.season = ANY($2)
        ORDER BY r.season
    """
    results = await db.fetch(query, team, seasons)
    return results





