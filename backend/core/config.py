"""
TripIT Configuration Management

Centralized configuration using Pydantic Settings with validation.
"""

from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # API Keys
    GROQ_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # App Settings
    DEBUG: bool = False
    APP_NAME: str = "TripIT AI"
    APP_VERSION: str = "1.0.0"
    
    # AI Settings
    AI_MODEL: str = "llama-3.1-8b-instant"
    AI_MAX_RETRIES: int = 3
    AI_TEMPERATURE_STRUCTURED: float = 0.3
    AI_TEMPERATURE_CREATIVE: float = 0.7
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    Uses lru_cache to only load settings once.
    """
    return Settings()
