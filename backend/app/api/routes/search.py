from fastapi import APIRouter, HTTPException
import logging
from app.domain.schemas.search import SearchRequest, SearchResponse
from app.services.search import execute_search

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=SearchResponse)
async def perform_search(request: SearchRequest):
    """
    Takes a natural language query, parses it via AI, 
    and searches the Elasticsearch backend.
    """
    try:
        return await execute_search(request.query)
    except Exception as e:
        logger.error(f"Search endpoint failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during search.")
