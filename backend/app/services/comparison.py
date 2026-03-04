import logging
from typing import List
from app.services.search import MOCK_CARS
from app.domain.schemas.search import CarListingResponse

logger = logging.getLogger(__name__)


async def compare_cars(car_ids: List[str]) -> dict:
    """
    Compare multiple cars and return detailed comparison with pros/cons
    
    Args:
        car_ids: List of car IDs to compare
    
    Returns:
        Comparison data with common features and differences
    """
    if not car_ids:
        return {"error": "No cars selected for comparison"}
    
    if len(car_ids) > 5:
        return {"error": "Cannot compare more than 5 cars"}
    
    # Get the cars
    cars = []
    for car_id in car_ids:
        car = next((c for c in MOCK_CARS if c["id"] == car_id), None)
        if car:
            cars.append(car)
    
    if not cars:
        return {"error": "No valid cars found"}
    
    # Build comparison data
    comparison = {
        "cars": [CarListingResponse(**car) for car in cars],
        "specifications": {
            "prices": [car["price"] for car in cars],
            "years": [car["year"] for car in cars],
            "mileages": [car.get("mileage", 0) for car in cars],
            "fuel_types": [car.get("fuel_type", "N/A") for car in cars],
            "transmissions": [car.get("transmission", "N/A") for car in cars],
        },
        "pros_cons": _generate_pros_cons(cars),
        "best_for": _get_best_recommendation(cars),
    }
    
    return comparison


def _generate_pros_cons(cars: List[dict]) -> dict:
    """Generate pros and cons for each car in comparison"""
    pros_cons = {}
    
    for car in cars:
        car_id = car["id"]
        pros = []
        cons = []
        
        # Price analysis
        avg_price = sum(c["price"] for c in cars) / len(cars)
        if car["price"] < avg_price:
            pros.append("Best price in comparison")
        elif car["price"] > avg_price * 1.2:
            cons.append("Higher price than average")
        
        # Mileage analysis
        mileages = [c.get("mileage", 0) for c in cars]
        if car.get("mileage", 0) < min(mileages):
            pros.append("Lowest mileage")
        elif car.get("mileage", 0) > max(mileages) * 0.8:
            cons.append("Higher mileage")
        
        # Year analysis
        years = [c["year"] for c in cars]
        if car["year"] == max(years):
            pros.append("Newest model")
        elif car["year"] < min(years):
            cons.append("Older model year")
        
        # Rating
        rating = car.get("rating", 0)
        if rating >= 4.5:
            pros.append("Highly rated by users")
        elif rating < 4.0:
            cons.append("Lower rating than others")
        
        # Features
        if car.get("transmission") == "Automatic":
            pros.append("Automatic transmission for easier driving")
        
        if car.get("fuel_type") == "Electric":
            pros.append("Electric - Low running costs")
        elif car.get("fuel_type") == "Diesel":
            pros.append("Diesel - Better fuel efficiency")
        
        if not pros:
            pros.append("Good value proposition")
        if not cons:
            cons.append("No major drawbacks")
        
        pros_cons[car_id] = {
            "pros": pros,
            "cons": cons
        }
    
    return pros_cons


def _get_best_recommendation(cars: List[dict]) -> dict:
    """Recommend which car is best for different use cases"""
    recommendations = {
        "budget": None,
        "best_value": None,
        "newest": None,
        "lowest_mileage": None,
        "highest_rated": None,
    }
    
    # Budget winner
    budget_car = min(cars, key=lambda x: x["price"])
    recommendations["budget"] = budget_car["id"]
    
    # Best value (price vs rating vs year vs mileage)
    def value_score(car):
        price_norm = car["price"] / max(c["price"] for c in cars)
        rating_norm = (car.get("rating", 0) / 5.0) if car.get("rating") else 0
        year_norm = car["year"] / max(c["year"] for c in cars)
        mileage_norm = 1 - (car.get("mileage", 0) / max(c.get("mileage", 1) for c in cars))
        
        return (rating_norm * 0.5) + (year_norm * 0.2) + (mileage_norm * 0.2) - (price_norm * 0.1)
    
    best_value_car = max(cars, key=value_score)
    recommendations["best_value"] = best_value_car["id"]
    
    # Newest
    newest_car = max(cars, key=lambda x: x["year"])
    recommendations["newest"] = newest_car["id"]
    
    # Lowest mileage
    lowest_mileage_car = min(cars, key=lambda x: x.get("mileage", float("inf")))
    recommendations["lowest_mileage"] = lowest_mileage_car["id"]
    
    # Highest rated
    highest_rated_car = max(cars, key=lambda x: x.get("rating", 0))
    recommendations["highest_rated"] = highest_rated_car["id"]
    
    return recommendations


async def get_similar_cars(car_id: str, limit: int = 5) -> List[CarListingResponse]:
    """
    Get similar cars based on brand, price range, and specifications
    """
    # Find the reference car
    ref_car = next((c for c in MOCK_CARS if c["id"] == car_id), None)
    if not ref_car:
        return []
    
    # Filter similar cars
    similar = []
    for car in MOCK_CARS:
        if car["id"] == car_id:
            continue
        
        # Similarity score
        score = 0
        
        # Same brand = high score
        if car["brand"].lower() == ref_car["brand"].lower():
            score += 3
        
        # Similar price (within 20%)
        price_ratio = abs(car["price"] - ref_car["price"]) / ref_car["price"]
        if price_ratio < 0.2:
            score += 2
        elif price_ratio < 0.5:
            score += 1
        
        # Same fuel type
        if car.get("fuel_type") == ref_car.get("fuel_type"):
            score += 1
        
        # Similar year
        year_diff = abs(car["year"] - ref_car["year"])
        if year_diff <= 1:
            score += 1
        
        if score > 0:
            similar.append((car, score))
    
    # Sort by score and get top results
    similar.sort(key=lambda x: x[1], reverse=True)
    return [CarListingResponse(**car[0]) for car in similar[:limit]]
