"""
Central app configuration, loaded from environment variables / .env.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    groq_api_key: str = ""
    groq_model: str = "gemma2-9b-it"
    groq_model_fallback: str = "llama-3.3-70b-versatile"

    # Defaults to a local SQLite file so the app runs out of the box for the
    # demo. Point DATABASE_URL at Postgres/MySQL for a "real" deployment -
    # SQLAlchemy handles both without any code changes.
    database_url: str = "sqlite:///./aivoa.db"

    frontend_origin: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
