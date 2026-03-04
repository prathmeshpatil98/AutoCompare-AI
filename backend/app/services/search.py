import json
import logging
import hashlib
import time
from app.services.ai.parser import parse_natural_language_query
from app.services.cache.redis_client import redis_cache
from app.services.search_engine.client import es_engine
from app.domain.schemas.search import ParsedQuery, SearchResponse, CarListingResponse

logger = logging.getLogger(__name__)
INDEX_NAME = "car_listings"

# Comprehensive in-memory car database (fallback when ES is offline)
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
        "thumbnail_url": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop",
        "rating": 4.5,
        "rating_count": 12
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
        "thumbnail_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop",
        "rating": 4.2,
        "rating_count": 8
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
        "thumbnail_url": "https://images.unsplash.com/photo-1609708536965-28fc77e91292?w=300&h=200&fit=crop",
        "rating": 4.0,
        "rating_count": 5
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
        "thumbnail_url": "https://images.unsplash.com/photo-1552832860-cfaf6899a04d?w=300&h=200&fit=crop",
        "rating": 4.6,
        "rating_count": 15
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
        "thumbnail_url": "https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=300&h=200&fit=crop",
        "rating": 4.3,
        "rating_count": 10
    },
    {
        "id": "spinny-hyundai-creta-1",
        "title": "2023 Hyundai Creta SX Plus Petrol",
        "brand": "Hyundai",
        "model": "Creta",
        "price": 1150000,
        "year": 2023,
        "mileage": 8000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Pune",
        "source_website": "Spinny",
        "source_url": "https://www.spinny.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1606162498267-2a18ab1d5221?w=300&h=200&fit=crop",
        "rating": 4.4,
        "rating_count": 18
    },
    {
        "id": "cars24-hyundai-i20-1",
        "title": "2022 Hyundai i20 Asta Plus Petrol",
        "brand": "Hyundai",
        "model": "i20",
        "price": 650000,
        "year": 2022,
        "mileage": 22000,
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "location": "Mumbai",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1590226706046-8e72c5f8b3bc?w=300&h=200&fit=crop",
        "rating": 4.1,
        "rating_count": 11
    },
    {
        "id": "cardekho-hyundai-verna-1",
        "title": "2021 Hyundai Verna SX Diesel",
        "brand": "Hyundai",
        "model": "Verna",
        "price": 750000,
        "year": 2021,
        "mileage": 32000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "location": "Bangalore",
        "source_website": "CarDekho",
        "source_url": "https://www.cardekho.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1610034655671-faca3862e9d5?w=300&h=200&fit=crop",
        "rating": 3.9,
        "rating_count": 7
    },
    {
        "id": "cars24-honda-city-1",
        "title": "2022 Honda City ZX Petrol",
        "brand": "Honda",
        "model": "City",
        "price": 980000,
        "year": 2022,
        "mileage": 15000,
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "location": "Delhi",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1559305616-3f99b9b26abf?w=300&h=200&fit=crop",
        "rating": 4.5,
        "rating_count": 14
    },
    {
        "id": "spinny-maruti-swift-1",
        "title": "2023 Maruti Swift VXi Petrol",
        "brand": "Maruti",
        "model": "Swift",
        "price": 580000,
        "year": 2023,
        "mileage": 3000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Chennai",
        "source_website": "Spinny",
        "source_url": "https://www.spinny.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1605559424843-9e4c3dec3371?w=300&h=200&fit=crop",
        "rating": 4.2,
        "rating_count": 20
    },
    {
        "id": "cardekho-maruti-alto-1",
        "title": "2021 Maruti Alto K10 VXi Petrol",
        "brand": "Maruti",
        "model": "Alto",
        "price": 420000,
        "year": 2021,
        "mileage": 42000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Kolkata",
        "source_website": "CarDekho",
        "source_url": "https://www.cardekho.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1594927328250-0a2d49c1ecf6?w=300&h=200&fit=crop",
        "rating": 3.8,
        "rating_count": 6
    },
    {
        "id": "cars24-tata-nexon-1",
        "title": "2023 Tata Nexon XZA Plus EV",
        "brand": "Tata",
        "model": "Nexon",
        "price": 1450000,
        "year": 2023,
        "mileage": 0,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "location": "Hyderabad",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1612112477309-d34e401e5e0f?w=300&h=200&fit=crop",
        "rating": 4.6,
        "rating_count": 16
    },
    {
        "id": "spinny-kia-sonet-1",
        "title": "2022 Kia Sonet HTX Diesel",
        "brand": "Kia",
        "model": "Sonet",
        "price": 1050000,
        "year": 2022,
        "mileage": 28000,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "location": "Surat",
        "source_website": "Spinny",
        "source_url": "https://www.spinny.com/",
        "thumbnail_url": "https://images.unsplash.com/photo-1570202396884-dac923f76ea2?w=300&h=200&fit=crop",
        "rating": 4.3,
        "rating_count": 9
    },
]

async def execute_search(query_str: str, skip: int = 0, limit: int = 20) -> SearchResponse:
    """
    Executes search using in-memory mock database with parsed NL query.
    Implements caching and pagination.
    """
    start_time = time.time()
    
    # 1. Check Cache for raw query + pagination
    query_hash = hashlib.md5(query_str.lower().encode()).hexdigest()
    cache_key = f"search:{query_hash}:{skip}:{limit}"
    
    cached_result = await redis_cache.get(cache_key)
    if cached_result:
        logger.info(f"Cache hit for query: {query_str}")
        data = json.loads(cached_result)
        execution_time = (time.time() - start_time) * 1000
        return SearchResponse(
            parsed_query=ParsedQuery(**data["parsed_query"]),
            results=[CarListingResponse(**car) for car in data["results"]],
            total=data["total"],
            skip=skip,
            limit=limit,
            source="redis_cache",
            execution_time_ms=execution_time
        )
        
    logger.info(f"Cache miss. Parsing query: {query_str}")
    # 2. Parse Query using regex-based or AI parsing
    parsed_query = await parse_natural_language_query(query_str, use_ai=False)
    logger.info(f"Parsed query: {parsed_query}")
    
    # 3. Filter mock cars based on parsed criteria
    filtered_cars = MOCK_CARS.copy()
    
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
    
    # Sort by price ascending (best value first)
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
    
    execution_time = (time.time() - start_time) * 1000
    return SearchResponse(
        parsed_query=parsed_query,
        results=[CarListingResponse(**car) for car in results],
        total=total,
        skip=skip,
        limit=limit,
        source="mock_database",
        execution_time_ms=execution_time
    )


async def get_available_filters():
    """Returns available filter options for the UI"""
    from app.domain.schemas.search import FilterOptions
    
    brands = sorted(list(set([car["brand"] for car in MOCK_CARS])))
    models = sorted(list(set([car["model"] for car in MOCK_CARS])))
    locations = sorted(list(set([car["location"] for car in MOCK_CARS if car.get("location")])))
    fuel_types = sorted(list(set([car["fuel_type"] for car in MOCK_CARS if car.get("fuel_type")])))
    transmissions = sorted(list(set([car["transmission"] for car in MOCK_CARS if car.get("transmission")])))
    body_types = ["SUV", "Sedan", "Hatchback", "MUV", "Coupe"]
    
    prices = [car["price"] for car in MOCK_CARS]
    price_range = {"min": min(prices), "max": max(prices)}
    
    return FilterOptions(
        brands=brands,
        models=models,
        locations=locations,
        fuel_types=fuel_types,
        transmissions=transmissions,
        body_types=body_types,
        price_range=price_range
    )


async def get_car_details(car_id: str):
    """Get detailed information about a specific car"""
    for car in MOCK_CARS:
        if car["id"] == car_id:
            return CarListingResponse(**car)
    return None


async def get_featured_listings():
    """Get featured listings (top rated, newest, etc)"""
    # Get top 5 rated cars
    featured = sorted(MOCK_CARS, key=lambda x: (x.get("rating", 0), -x.get("year", 0)), reverse=True)[:5]
    return [CarListingResponse(**car) for car in featured]
