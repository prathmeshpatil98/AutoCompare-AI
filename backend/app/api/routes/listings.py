from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import logging
from app.services.search import get_available_filters, get_car_details, get_featured_listings
from app.domain.schemas.search import CarListingResponse, FilterOptions

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/featured", response_model=list[CarListingResponse])
async def get_featured():
    """
    Get featured car listings (top rated, newest, etc.)
    """
    try:
        listings = await get_featured_listings()
        return listings
    except Exception as e:
        logger.error(f"Failed to get featured listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured listings")


@router.get("/filters", response_model=FilterOptions)
async def get_filters():
    """
    Get available filter options for the search interface
    """
    try:
        filters = await get_available_filters()
        return filters
    except Exception as e:
        logger.error(f"Failed to get filters: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch filter options")


@router.get("/{listing_id}", response_model=CarListingResponse)
async def get_listing_details(listing_id: str):
    """
    Get detailed information about a specific car listing
    """
    try:
        listing = await get_car_details(listing_id)
        if not listing:
            raise HTTPException(status_code=404, detail="Car listing not found")
        return listing
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get listing details for {listing_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch listing details")
