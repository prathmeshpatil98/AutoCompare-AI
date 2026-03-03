from pydantic import BaseModel, Field
from typing import Optional, List, Any

class ParsedQuery(BaseModel):
    brand: Optional[str] = Field(None, description="Car brand (e.g., Hyundai, Honda)")
    model: Optional[str] = Field(None, description="Car model (e.g., i20, City)")
    price_min: Optional[int] = Field(None, description="Minimum price in currency units")
    price_max: Optional[int] = Field(None, description="Maximum price in currency units")
    location: Optional[str] = Field(None, description="City or region")
    fuel_type: Optional[str] = Field(None, description="Fuel type (e.g., petrol, diesel, electric)")
    transmission: Optional[str] = Field(None, description="Transmission type (e.g., automatic, manual)")

class SearchRequest(BaseModel):
    query: str = Field(..., example="Hyundai i20 under 6 lakh in Pune automatic")
    skip: int = Field(0, ge=0, description="Pagination offset")
    limit: int = Field(20, ge=1, le=100, description="Number of results per page (Max 100)")

class SearchResponse(BaseModel):
    parsed_query: ParsedQuery
    results: List[Any]
    total: int
    skip: int
    limit: int
    source: str = "elasticsearch"
