from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.base import Base
from app.database.session import engine
from app.routers import auth, equipment, booking, users
import app.models  # noqa: F401 - ensures models are registered before create_all

app = FastAPI(title="Agri Equipment Rental API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "https://agri-rental-nu.vercel.app",
    "https://agri-rental-nandimqen-shahinas-projects-6d2f2e36.vercel.app",
]
    
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
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
