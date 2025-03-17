import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:PASSWORD@localhost:PORT/DATABASE_NAME")

async def connect_to_db():
    return await asyncpg.create_pool(
        DATABASE_URL,
        min_size=1,  # Minimum 1 connection
        max_size=10  # Maximum 10 connections at a time
    )
