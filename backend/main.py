# backend\main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from backend.core.db import create_db_and_tables
from backend.models import User, Task # Explicitly import models for registration
from fastapi.middleware.cors import CORSMiddleware

from backend.core.security import get_current_user
from backend.api.main import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    create_db_and_tables()
    yield

app = FastAPI(title="Todo Web App API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/test-auth")
def test_auth(current_user: User = Depends(get_current_user)):
    return {"email": current_user.email, "id": str(current_user.id)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)