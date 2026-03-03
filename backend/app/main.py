import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router
from app.services.cache.redis_client import redis_cache
from app.services.search_engine.client import es_engine
from app.api.middleware.logging import LoggingMiddleware
from app.api.middleware.errors import ErrorHandlerMiddleware
from app.api.middleware.rate_limit import RateLimitMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for FastAPI to handle startup and shutdown of global dependencies.
    Connections to Redis and Elasticsearch are optional - don't block startup if they fail.
    """
    logger.info("Initializing application services...")
    
    try:
        await redis_cache.connect()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.warning(f"Failed to connect to Redis (optional): {e}")
    
    try:
        await es_engine.connect()
        logger.info("Elasticsearch connected successfully")
    except Exception as e:
        logger.warning(f"Failed to connect to Elasticsearch (optional): {e}")
    
    logger.info("Application startup complete - using mock database")
    yield
    
    logger.info("Shutting down application services...")
    try:
        await redis_cache.disconnect()
    except Exception as e:
        logger.warning(f"Error disconnecting Redis: {e}")
    
    try:
        await es_engine.disconnect()
    except Exception as e:
        logger.warning(f"Error disconnecting Elasticsearch: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configuration - Restrict to specific origins in production
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Local development IP
    "http://localhost:8000",  # Local API
    "http://127.0.0.1:8000",  # Local API IP
    "https://autocompare-ai.com",  # Production domain
    "https://www.autocompare-ai.com",  # Production domain with www
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Custom Middlewares (Applied inside-out)
app.add_middleware(RateLimitMiddleware, rate_limit=100, window_seconds=60)
app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlerMiddleware)

# Register central router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
