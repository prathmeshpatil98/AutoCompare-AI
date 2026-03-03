import json
import logging
import hashlib
from app.services.ai.parser import parse_natural_language_query
from app.services.cache.redis_client import redis_cache
from app.services.search_engine.client import es_engine
from app.domain.schemas.search import ParsedQuery, SearchResponse

logger = logging.getLogger(__name__)
INDEX_NAME = "car_listings"

# In-memory car database (fallback when ES is offline)
MOCK_CARS = [
    {
        "id": "cars24-mahindra-xuv-1",
        "title": "2022 Mahindra XUV700 AX7 Diesel",
        "brand": "Mahindra",
        "model": "XUV700",
        "price": 1650000,
        "year": 2022,
        "mileage": 12500,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "location": "Surat",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop"
    },
    {
        "id": "cardekho-mahindra-xuv-2",
        "title": "2021 Mahindra XUV500 W8 Diesel",
        "brand": "Mahindra",
        "model": "XUV500",
        "price": 1350000,
        "year": 2021,
        "mileage": 18000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "location": "Ahmedabad",
        "source_website": "CarDekho",
        "source_url": "https://www.cardekho.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"
    },
    {
        "id": "spinny-mahindra-xuv-3",
        "title": "2020 Mahindra XUV700 AX5 Diesel",
        "brand": "Mahindra",
        "model": "XUV700",
        "price": 1550000,
        "year": 2020,
        "mileage": 25000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "location": "Vadodara",
        "source_website": "Spinny",
        "source_url": "https://www.spinny.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1609708536965-28fc77e91292?w=300&h=200&fit=crop"
    },
    {
        "id": "cars24-mahindra-xuv-4",
        "title": "2023 Mahindra XUV300 W8 Petrol",
        "brand": "Mahindra",
        "model": "XUV300",
        "price": 950000,
        "year": 2023,
        "mileage": 5000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Gujarat",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1552832860-cfaf6899a04d?w=300&h=200&fit=crop"
    },
    {
        "id": "cardekho-mahindra-xuv-5",
        "title": "2021 Mahindra XUV700 W10 Diesel",
        "brand": "Mahindra",
        "model": "XUV700",
        "price": 1750000,
        "year": 2021,
        "mileage": 16000,
        "fuel_type": "Diesel",
        "transmission": "Automatic",
        "location": "Surat",
        "source_website": "CarDekho",
        "source_url": "https://www.cardekho.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=300&h=200&fit=crop"
    }
]

async def execute_search(query_str: str, skip: int = 0, limit: int = 20) -> SearchResponse:
    """
    Executes search using in-memory mock database with parsed NL query.
    """
    # 1. Check Cache for raw query + pagination
    query_hash = hashlib.md5(query_str.lower().encode()).hexdigest()
    cache_key = f"search:{query_hash}:{skip}:{limit}"
    
    cached_result = await redis_cache.get(cache_key)
    if cached_result:
        logger.info(f"Cache hit for query: {query_str}")
        data = json.loads(cached_result)
        return SearchResponse(
            parsed_query=ParsedQuery(**data["parsed_query"]),
            results=data["results"],
            total=data["total"],
            skip=skip,
            limit=limit,
            source="redis_cache"
        )
        
    logger.info(f"Cache miss. Parsing query: {query_str}")
    # 2. Parse Query using regex (no AI timeout issues)
    parsed_query = await parse_natural_language_query(query_str)
    logger.info(f"Parsed query: {parsed_query}")
    
    # 3. Filter mock cars based on parsed criteria
    filtered_cars = MOCK_CARS
    
    # Apply filters
    if parsed_query.brand:
        filtered_cars = [
            car for car in filtered_cars
            if car["brand"].lower() == parsed_query.brand.lower()
        ]
    
    if parsed_query.model:
        filtered_cars = [
            car for car in filtered_cars
            if parsed_query.model.lower() in car["model"].lower()
        ]
    
    if parsed_query.location:
        filtered_cars = [
            car for car in filtered_cars
            if parsed_query.location.lower() in car["location"].lower()
        ]
    
    if parsed_query.fuel_type:
        filtered_cars = [
            car for car in filtered_cars
            if car["fuel_type"].lower() == parsed_query.fuel_type.lower()
        ]
    
    if parsed_query.transmission:
        filtered_cars = [
            car for car in filtered_cars
            if car["transmission"].lower() == parsed_query.transmission.lower()
        ]
    
    # Price filtering
    if parsed_query.price_min is not None:
        filtered_cars = [car for car in filtered_cars if car["price"] >= parsed_query.price_min]
    if parsed_query.price_max is not None:
        filtered_cars = [car for car in filtered_cars if car["price"] <= parsed_query.price_max]
    
    # Sort by price ascending
    filtered_cars = sorted(filtered_cars, key=lambda x: x["price"])
    
    # Apply pagination
    total = len(filtered_cars)
    results = filtered_cars[skip:skip + limit]
    
    logger.info(f"Found {total} cars matching query, returning {len(results)} cars")
    
    # 4. Cache and Return
    response_data = {
        "parsed_query": parsed_query.model_dump(),
        "results": results,
        "total": total
    }
    
    # Cache for 1 hour (3600 seconds)
    await redis_cache.set(cache_key, json.dumps(response_data), expire=3600)
    
    return SearchResponse(
        parsed_query=parsed_query,
        results=results,
        total=total,
        skip=skip,
        limit=limit,
        source="mock_database"
    )
