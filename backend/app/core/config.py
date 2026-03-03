from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AutoCompare AI"
    API_V1_STR: str = "/api/v1"
    
    GROQ_API_KEY: str
    
    REDIS_URL: str = "redis://127.0.0.1:6379/0"
    ELASTICSEARCH_URL: str = "http://127.0.0.1:9200"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
