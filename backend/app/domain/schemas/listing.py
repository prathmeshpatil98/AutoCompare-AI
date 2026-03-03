from pydantic import BaseModel, Field
from typing import Optional

class CarListing(BaseModel):
    id: str = Field(..., description="Unique identifier for the listing")
    title: str
    brand: str
    model: str
    price: int
    year: int
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    location: str
    source_url: str
    source_website: str
    thumbnail_url: Optional[str] = None
