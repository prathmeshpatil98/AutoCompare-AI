import requests
import json

def check_es():
    try:
        # Check indices
        resp = requests.get("http://localhost:9200/_cat/indices?format=json")
        print("Indices:", resp.text)
        
        # Check car_listings count
        resp = requests.get("http://localhost:9200/car_listings/_count")
        print("Car Listings Count:", resp.text)
        
        # Get sample data
        resp = requests.get("http://localhost:9200/car_listings/_search?size=1")
        print("Sample Listing:", resp.text)
        
    except Exception as e:
        print("Error checking ES:", e)

if __name__ == "__main__":
    check_es()
