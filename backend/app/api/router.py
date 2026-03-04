from fastapi import APIRouter
from app.api.routes import search, health, listings, comparison, analytics

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(listings.router, prefix="/listings", tags=["listings"])
api_router.include_router(comparison.router, prefix="/compare", tags=["comparison"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
