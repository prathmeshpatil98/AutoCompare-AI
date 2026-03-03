import time
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.services.cache.redis_client import redis_cache

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple Sliding Window Rate Limiter using Redis INCR and EXPIRE.
    Allows 100 requests per 60 seconds per IP.
    """
    def __init__(self, app, rate_limit: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.rate_limit = rate_limit
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next):
        if not redis_cache.redis:
            return await call_next(request) # Bypass if Redis is down

        client_ip = request.client.host if request.client else "unknown"
        # Using a minute-based key for the sliding window
        current_minute = int(time.time() // self.window_seconds)
        cache_key = f"rate_limit:{client_ip}:{current_minute}"

        try:
            current_count = await redis_cache.redis.incr(cache_key)
            if current_count == 1:
                await redis_cache.redis.expire(cache_key, self.window_seconds * 2)

            if current_count > self.rate_limit:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Too many requests. Please try again later."}
                )
        except Exception:
            # Degrade gracefully if Redis errors out mid-check
            pass

        return await call_next(request)
