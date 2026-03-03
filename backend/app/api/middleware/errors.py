from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except HTTPException as he:
            return JSONResponse(
                status_code=he.status_code,
                content={"detail": he.detail}
            )
        except BaseException as exc:
            logger.error(f"Unhandled Server Error: {exc}", exc_info=True)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error", "type": str(type(exc).__name__)}
            )
