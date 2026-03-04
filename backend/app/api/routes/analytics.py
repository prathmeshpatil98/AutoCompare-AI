from fastapi import APIRouter, HTTPException
import logging
from typing import Optional, Dict, Any
from app.services.analytics import (
    get_trending_search_terms,
    get_price_trends,
    get_user_recommendations,
    get_market_insights
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/trending")
async def trending():
    """
    Get trending search queries and topics
    """
    try:
        trends = await get_trending_search_terms()
        return {
            "trending_searches": trends,
            "last_updated": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Failed to get trending searches: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending data")


@router.get("/price-trends")
async def price_trends():
    """
    Get price trends across different brands and categories
    """
    try:
        trends = await get_price_trends()
        return {
            "price_trends": trends,
            "last_updated": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Failed to get price trends: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch price trends")


@router.post("/recommendations")
async def recommendations(filters: Optional[Dict[str, Any]] = None):
    """
    Get personalized car recommendations based on filters
    
    Example request:
    {
        "max_price": 1000000,
        "brand": "Hyundai",
        "fuel_type": "Petrol",
        "transmission": "Automatic"
    }
    """
    try:
        recs = await get_user_recommendations(filters or {})
        return {
            "recommendations": recs,
            "count": len(recs)
        }
    except Exception as e:
        logger.error(f"Failed to get recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch recommendations")


@router.get("/market-insights")
async def market_insights():
    """
    Get comprehensive market insights and statistics
    """
    try:
        insights = await get_market_insights()
        return insights
    except Exception as e:
        logger.error(f"Failed to get market insights: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch market insights")
