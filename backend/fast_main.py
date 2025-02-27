from fastapi import FastAPI
from backend.routes import stats
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
app.include_router(stats.router)


@app.get("/")
def root():
    return {"message": "FastAPI Backend is Running!"}
