from fastapi import FastAPI
from backend.routes import team_comparison, team, games, home_leaders
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000',
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow frontend to connect
    allow_credentials=True,  # Allow sending cookies if needed
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include API routes
app.include_router(team_comparison.router)
app.include_router(team.router)
app.include_router(games.router)
app.include_router(home_leaders.router)


@app.get("/")
def root():
    return {"message": "FastAPI Backend is Running!"}

