from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routers import complaints, ai

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Customer Complaint Management System",
    description="AI-powered Customer Complaint Management for pharmaceutical (API/FDF) manufacturing.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router)
app.include_router(ai.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
