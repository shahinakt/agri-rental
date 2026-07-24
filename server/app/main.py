from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.base import Base
from app.database.session import engine
from app.routers import auth, equipment, booking, users
import app.models  # noqa: F401 - ensures models are registered before create_all

app = FastAPI(title="Agri Equipment Rental API", version="1.0.0")

origins = [
    "http://localhost:3000", #local development
    "https://agri-rental-nu.vercel.app", # production frontend
]
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(booking.router)
app.include_router(users.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
