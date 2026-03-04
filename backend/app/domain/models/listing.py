from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class CarListing(Base):
    """Database model for car listings"""
    __tablename__ = "car_listings"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    model = Column(String, index=True, nullable=False)
    price = Column(Integer, index=True, nullable=False)
    year = Column(Integer, index=True, nullable=False)
    mileage = Column(Integer, nullable=True)
    fuel_type = Column(String, index=True, nullable=True)
    transmission = Column(String, index=True, nullable=True)
    location = Column(String, index=True, nullable=True)
    description = Column(Text, nullable=True)
    source_website = Column(String, nullable=False)
    source_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    images_json = Column(String, nullable=True)  # JSON array of image URLs
    features_json = Column(String, nullable=True)  # JSON of car features
    rating = Column(Float, default=0.0)
    rating_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    scraped_at = Column(DateTime, nullable=True)


class UserComparison(Base):
    """Track user comparisons for analytics"""
    __tablename__ = "user_comparisons"
    
    id = Column(String, primary_key=True, index=True)
    car_ids = Column(String, nullable=False)  # Comma-separated car IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)


class SearchQuery(Base):
    """Log search queries for analytics"""
    __tablename__ = "search_queries"
    
    id = Column(String, primary_key=True, index=True)
    query_text = Column(String, nullable=False, index=True)
    parsed_brand = Column(String, nullable=True)
    parsed_model = Column(String, nullable=True)
    parsed_price_min = Column(Integer, nullable=True)
    parsed_price_max = Column(Integer, nullable=True)
    parsed_location = Column(String, nullable=True)
    results_count = Column(Integer, default=0)
    response_time_ms = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
