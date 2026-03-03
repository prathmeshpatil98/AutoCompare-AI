import requests
import json
import uuid

ES_URL = "http://127.0.0.1:9200"
INDEX_NAME = "car_listings"

SAMPLE_CARS = [
    {
        "id": str(uuid.uuid4()),
        "title": "2021 Maruti Swift VXI",
        "price": 550000,
        "year": 2021,
        "mileage": 12000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Delhi",
        "brand": "Maruti",
        "model": "Swift",
        "source_website": "Cardekho",
        "source_url": "https://www.cardekho.com/buy-used-maruti-swift-cars+delhi",
        "thumbnail_url": "https://imgd.aeplcdn.com/664x374/n/cw/ec/26742/swift-exterior-right-front-three-quarter.jpeg"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "2019 Honda City ZX CVT",
        "price": 850000,
        "year": 2019,
        "mileage": 35000,
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "location": "Mumbai",
        "brand": "Honda",
        "model": "City",
        "source_website": "Cars24",
        "source_url": "https://www.cars24.com/buy-used-honda-city-cars-mumbai/",
        "thumbnail_url": "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/8410/1623910547614/front-left-side-47.jpg"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "2022 Tata Nexon EV Max",
        "price": 1450000,
        "year": 2022,
        "mileage": 8000,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "location": "Bangalore",
        "brand": "Tata",
        "model": "Nexon",
        "source_website": "Spinny",
        "source_url": "https://www.spinny.com/buy-used-tata-nexon-ev-cars-bangalore/",
        "thumbnail_url": "https://imgd.aeplcdn.com/664x374/n/cw/ec/121813/nexon-ev-exterior-right-front-three-quarter.jpeg"
    },
    {
        "id": str(uuid.uuid4()),
        "title": "2020 Hyundai i10 Magna",
        "price": 420000,
        "year": 2020,
        "mileage": 22000,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "location": "Pune",
        "brand": "Hyundai",
        "model": "i10",
        "source_website": "Cardekho",
        "source_url": "https://www.cardekho.com",
        "thumbnail_url": ""
    }
]

def seed():
    try:
        # Create index mapping if it doesn't exist
        mapping = {
            "mappings": {
                "properties": {
                    "id": {"type": "keyword"},
                    "title": {"type": "text"},
                    "price": {"type": "integer"},
                    "year": {"type": "integer"},
                    "mileage": {"type": "integer"},
                    "fuel_type": {"type": "keyword"},
                    "transmission": {"type": "keyword"},
                    "location": {"type": "keyword"},
                    "brand": {"type": "keyword"},
                    "model": {"type": "keyword"},
                    "source_website": {"type": "keyword"},
                    "source_url": {"type": "keyword"},
                    "thumbnail_url": {"type": "keyword"}
                }
            }
        }
        requests.put(f"{ES_URL}/{INDEX_NAME}", json=mapping)
        
        # Index data
        for car in SAMPLE_CARS:
            requests.put(f"{ES_URL}/{INDEX_NAME}/_doc/{car['id']}", json=car)
        
        print(f"Successfully seeded {len(SAMPLE_CARS)} cars.")
    except Exception as e:
        print("Seed error:", e)

if __name__ == "__main__":
    seed()
