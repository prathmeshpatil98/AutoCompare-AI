from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Project
    PROJECT_NAME: str = "AutoCompare AI"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # API Keys
    GROQ_API_KEY: str = "your-groq-api-key"
    OPENAI_API_KEY: Optional[str] = None
    
    # External Services
    REDIS_URL: str = "redis://127.0.0.1:6379/0"
    ELASTICSEARCH_URL: str = "http://127.0.0.1:9200"
    
    # Database
    DATABASE_URL: Optional[str] = None  # Optional for PostgreSQL
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Cache
    CACHE_TTL_SECONDS: int = 3600  # 1 hour
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]
    
    # Search
    SEARCH_RESULTS_LIMIT: int = 100
    DEFAULT_SKIP: int = 0
    DEFAULT_LIMIT: int = 20

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
