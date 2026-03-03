from fastapi import APIRouter
from app.api.routes import search, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
