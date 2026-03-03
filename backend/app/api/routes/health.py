from fastapi import APIRouter
from app.services.search_engine.client import es_engine
from app.services.cache.redis_client import redis_cache

router = APIRouter()

@router.get("/")
async def health_check():
    """
    Health check endpoint. Checks status of API, Redis, and Elasticsearch.
    """
    status = {"api": "ok", "redis": "down", "elasticsearch": "down"}
    
    # Check Redis
    try:
        if redis_cache.redis and await redis_cache.redis.ping():
            status["redis"] = "ok"
    except Exception:
        pass
        
    # Check Elasticsearch
    try:
        if es_engine.client and await es_engine.client.ping():
            status["elasticsearch"] = "ok"
    except Exception:
        pass
        
    return status
