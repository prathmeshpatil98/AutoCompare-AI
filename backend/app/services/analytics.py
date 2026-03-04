"""
Analytics and recommendation service for the AutoCompare AI backend
Provides insights on car trends, recommendations, and user analytics
"""
import logging
from datetime import datetime
from typing import List, Dict, Any
from app.services.search import MOCK_CARS
from app.domain.schemas.search import CarListingResponse

logger = logging.getLogger(__name__)


async def get_trending_search_terms() -> List[Dict[str, Any]]:
    """Get trending search queries (simulated)"""
    return [
        {
            "term": "automatic transmission under 10 lakh",
            "count": 542,
            "trend": "up"
        },
        {
            "term": "best mileage cars",
            "count": 438,
            "trend": "up"
        },
        {
            "term": "electric vehicles 2024",
            "count": 312,
            "trend": "up"
        },
        {
            "term": "family cars under 8 lakh",
            "count": 289,
            "trend": "stable"
        },
        {
            "term": "budget compact SUV",
            "count": 267,
            "trend": "down"
        }
    ]


async def get_price_trends() -> Dict[str, Any]:
    """Get price trends for different car categories"""
    brands = {}
    for car in MOCK_CARS:
        brand = car["brand"]
        if brand not in brands:
            brands[brand] = []
        brands[brand].append(car["price"])
    
    trends = {}
    for brand, prices in brands.items():
        avg_price = sum(prices) / len(prices)
        trends[brand] = {
            "avg_price": int(avg_price),
            "min_price": min(prices),
            "max_price": max(prices),
            "car_count": len(prices),
            "trend": "stable"  # In real implementation, calculate from historical data
        }
    
    return trends


async def get_user_recommendations(filters: Dict[str, Any]) -> List[CarListingResponse]:
    """
    Get personalized recommendations based on user filters
    Uses a scoring algorithm to find the best matches
    """
    if not filters:
        # If no filters, return top-rated cars
        top_cars = sorted(MOCK_CARS, key=lambda x: x.get("rating", 0), reverse=True)[:5]
        return [CarListingResponse(**car) for car in top_cars]
    
    # Score each car based on filters
    scored_cars = []
    
    for car in MOCK_CARS:
        score = 100  # Start with base score
        matches = 0
        
        # Budget filter
        if "max_price" in filters and car["price"] <= filters["max_price"]:
            score += 20
            matches += 1
        elif "max_price" in filters:
            score -= 30
        
        if "min_price" in filters and car["price"] >= filters["min_price"]:
            score += 20
            matches += 1
        elif "min_price" in filters:
            score -= 30
        
        # Brand filter
        if "brand" in filters and car["brand"].lower() == filters["brand"].lower():
            score += 25
            matches += 1
        elif "brand" in filters:
            score -= 10
        
        # Fuel type filter
        if "fuel_type" in filters and car.get("fuel_type", "").lower() == filters["fuel_type"].lower():
            score += 15
            matches += 1
        
        # Transmission filter
        if "transmission" in filters and car.get("transmission", "").lower() == filters["transmission"].lower():
            score += 15
            matches += 1
        
        # Location filter
        if "location" in filters and filters["location"].lower() in car.get("location", "").lower():
            score += 10
            matches += 1
        
        # Rating boost
        rating = car.get("rating", 0)
        if rating >= 4.5:
            score += 5
        elif rating >= 4.0:
            score += 3
        
        # Only include cars that match at least one filter or have high ratings
        if matches > 0 or rating >= 4.0:
            scored_cars.append((car, score))
    
    # Sort by score and return top results
    scored_cars.sort(key=lambda x: x[1], reverse=True)
    
    recommendations = [CarListingResponse(**car[0]) for car in scored_cars[:10]]
    return recommendations


async def get_market_insights() -> Dict[str, Any]:
    """Get comprehensive market insights"""
    
    # Calculate statistics
    total_cars = len(MOCK_CARS)
    avg_price = sum(car["price"] for car in MOCK_CARS) / total_cars
    avg_rating = sum(car.get("rating", 0) for car in MOCK_CARS) / total_cars
    
    # Distribution by brand
    brand_dist = {}
    for car in MOCK_CARS:
        brand = car["brand"]
        brand_dist[brand] = brand_dist.get(brand, 0) + 1
    
    # Distribution by fuel type
    fuel_dist = {}
    for car in MOCK_CARS:
        fuel = car.get("fuel_type", "Unknown")
        fuel_dist[fuel] = fuel_dist.get(fuel, 0) + 1
    
    # Price ranges
    price_ranges = {
        "under_5lakh": len([c for c in MOCK_CARS if c["price"] < 500000]),
        "5_8lakh": len([c for c in MOCK_CARS if 500000 <= c["price"] < 800000]),
        "8_12lakh": len([c for c in MOCK_CARS if 800000 <= c["price"] < 1200000]),
        "above_12lakh": len([c for c in MOCK_CARS if c["price"] >= 1200000]),
    }
    
    # Year distribution
    year_dist = {}
    for car in MOCK_CARS:
        year = car["year"]
        year_dist[year] = year_dist.get(year, 0) + 1
    
    return {
        "total_listings": total_cars,
        "average_price": int(avg_price),
        "average_rating": round(avg_rating, 2),
        "price_range": {
            "min": min(car["price"] for car in MOCK_CARS),
            "max": max(car["price"] for car in MOCK_CARS),
        },
        "brand_distribution": brand_dist,
        "fuel_type_distribution": fuel_dist,
        "price_ranges": price_ranges,
        "year_distribution": year_dist,
        "generated_at": datetime.utcnow().isoformat(),
    }
