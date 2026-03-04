from fastapi import APIRouter, HTTPException
from typing import List
import logging
from pydantic import BaseModel
from app.services.comparison import compare_cars, get_similar_cars
from app.domain.schemas.search import CarListingResponse

logger = logging.getLogger(__name__)
router = APIRouter()


class ComparisonRequest(BaseModel):
    car_ids: List[str]


@router.post("/compare")
async def compare(request: ComparisonRequest):
    """
    Compare multiple cars and return detailed comparison
    
    Request body:
    {
        "car_ids": ["car-id-1", "car-id-2", "car-id-3"]
    }
    """
    if not request.car_ids:
        raise HTTPException(status_code=400, detail="At least one car ID is required")
    
    try:
        comparison = await compare_cars(request.car_ids)
        if "error" in comparison:
            raise HTTPException(status_code=400, detail=comparison["error"])
        return comparison
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Comparison failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to compare cars")


@router.get("/similar/{car_id}", response_model=List[CarListingResponse])
async def get_similar(car_id: str, limit: int = 5):
    """
    Get similar cars based on specifications and price
    """
    try:
        similar = await get_similar_cars(car_id, limit)
        if not similar:
            raise HTTPException(status_code=404, detail="Car not found or no similar cars available")
        return similar
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get similar cars: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch similar cars")
