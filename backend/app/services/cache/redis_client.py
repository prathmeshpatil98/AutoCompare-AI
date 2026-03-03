import logging
import asyncio
from redis.asyncio import Redis, from_url
from app.core.config import settings

logger = logging.getLogger(__name__)

class RedisCache:
    def __init__(self):
        self.redis: Redis | None = None

    async def connect(self):
        try:
            logger.info(f"Connecting to Redis at {settings.REDIS_URL}")
            self.redis = await asyncio.wait_for(
                from_url(settings.REDIS_URL, decode_responses=True),
                timeout=5.0
            )
            logger.info("Redis connected successfully")
        except asyncio.TimeoutError:
            logger.warning("Redis connection timed out - will skip caching")
            self.redis = None
        except Exception as e:
            logger.warning(f"Redis connection failed: {e} - will skip caching")
            self.redis = None

    async def disconnect(self):
        if self.redis:
            await self.redis.close()
            logger.info("Redis disconnected")

    async def get(self, key: str) -> str | None:
        if not self.redis:
            return None
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error(f"Redis GET error: {e}")
            return None
        
    async def set(self, key: str, value: str, expire: int = 3600):
        if self.redis:
            try:
                await self.redis.set(key, value, ex=expire)
            except Exception as e:
                logger.error(f"Redis SET error: {e}")

# Singleton instance
redis_cache = RedisCache()
