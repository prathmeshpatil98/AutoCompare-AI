from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

class ParsedQuery(BaseModel):
    brand: Optional[str] = Field(None, description="Car brand (e.g., Hyundai, Honda)")
    model: Optional[str] = Field(None, description="Car model (e.g., i20, City)")
    price_min: Optional[int] = Field(None, description="Minimum price in currency units")
    price_max: Optional[int] = Field(None, description="Maximum price in currency units")
    location: Optional[str] = Field(None, description="City or region")
    fuel_type: Optional[str] = Field(None, description="Fuel type (e.g., petrol, diesel, electric)")
    transmission: Optional[str] = Field(None, description="Transmission type (e.g., automatic, manual)")
    body_type: Optional[str] = Field(None, description="Body type (e.g., SUV, sedan, hatchback)")
    condition: Optional[str] = Field(None, description="Condition (e.g., new, used)")

class SearchRequest(BaseModel):
    query: str = Field(..., example="Hyundai i20 under 6 lakh in Pune automatic", min_length=2, max_length=500)
    skip: int = Field(0, ge=0, description="Pagination offset")
    limit: int = Field(20, ge=1, le=100, description="Number of results per page (Max 100)")

class CarListingResponse(BaseModel):
    id: str
    title: str
    brand: str
    model: str
    price: int
    year: int
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    location: Optional[str] = None
    source_website: str
    thumbnail_url: Optional[str] = None
    rating: float = 0.0
    rating_count: int = 0

    class Config:
        from_attributes = True

class SearchResponse(BaseModel):
    parsed_query: ParsedQuery
    results: List[CarListingResponse]
    total: int
    skip: int
    limit: int
    source: str = "elasticsearch"
    execution_time_ms: float = 0.0
    
class FilterOptions(BaseModel):
    brands: List[str]
    models: List[str]
    locations: List[str]
    fuel_types: List[str]
    transmissions: List[str]
    price_range: Dict[str, int]  # {"min": x, "max": y}
    body_types: List[str]
