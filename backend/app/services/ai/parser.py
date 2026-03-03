import json
import logging
import re
from openai import AsyncOpenAI
from app.core.config import settings
from app.domain.schemas.search import ParsedQuery

logger = logging.getLogger(__name__)

# Initialize client pointing to Groq's custom OpenAI-compatible endpoint
client = AsyncOpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """You are an expert automotive search assistant. Convert the user's natural language query into a structured JSON filter.
Extract the following fields if present: brand, model, price_min, price_max, location, fuel_type, transmission.
If a price like '6 lakh' is mentioned, convert it to the full integer value (e.g., 600000). Lakh means 100,000.
Respond ONLY with a valid JSON object matching this schema:
{
  "brand": "string|null",
  "model": "string|null",
  "price_min": "integer|null",
  "price_max": "integer|null",
  "location": "string|null",
  "fuel_type": "string|null",
  "transmission": "string|null"
}
"""

def _apply_regex_fallback(query: str, parsed: ParsedQuery) -> ParsedQuery:
    """Rule-based fallback using regex to extract entities if the AI misses them."""
    query_lower = query.lower()

    # Transmission
    if "automatic" in query_lower or "auto" in query_lower:
        parsed.transmission = "automatic"
    elif "manual" in query_lower:
        parsed.transmission = "manual"

    # Fuel Type
    if "petrol" in query_lower:
        parsed.fuel_type = "petrol"
    elif "diesel" in query_lower:
        parsed.fuel_type = "diesel"
    elif "ev" in query_lower or "electric" in query_lower:
        parsed.fuel_type = "electric"
    elif "cng" in query_lower:
        parsed.fuel_type = "cng"

    # Locations (Common Indian Cities example)
    # common Indian cities (include common misspellings)
    cities = [
        "pune", "mumbai", "delhi", "bangalore", "chennai",
        "hyderabad", "kolkata", "ahmedabad", "surat", "vadodara",
        "gujarat", "gujrat"  # allow misspelling
    ]
    for city in cities:
        if city in query_lower and not parsed.location:
            # normalize spelling to full name
            if city in ["gujrat"]:
                parsed.location = "Gujarat"
            else:
                parsed.location = city.title()
            break

    # Price Extraction (Under, Above, Between with Lakhs)
    # Extracts patterns like "under 6 lakh", "< 5 lakh", "above 10 lakhs"
    lakh_multiplier = 100000
    
    under_match = re.search(r"(under|<|less than)\s*([\d\.]+)\s*lakh", query_lower)
    if under_match and not parsed.price_max:
        parsed.price_max = int(float(under_match.group(2)) * lakh_multiplier)
        
    above_match = re.search(r"(above|>|more than)\s*([\d\.]+)\s*lakh", query_lower)
    if above_match and not parsed.price_min:
        parsed.price_min = int(float(above_match.group(2)) * lakh_multiplier)
        
    between_match = re.search(r"(between|from)\s*([\d\.]+)\s*(to|-|and)\s*([\d\.]+)\s*lakh", query_lower)
    if between_match and not parsed.price_min and not parsed.price_max:
        parsed.price_min = int(float(between_match.group(2)) * lakh_multiplier)
        parsed.price_max = int(float(between_match.group(4)) * lakh_multiplier)

    # Brands - Simple dictionary lookup fallback
    brands = ["hyundai", "honda", "maruti", "suzuki", "tata", "mahindra", "toyota", "kia", "vw", "volkswagen"]
    for brand in brands:
        if brand in query_lower and not parsed.brand:
            parsed.brand = brand.title()
            # Try to grab the next word as the model
            words = query_lower.split()
            try:
                idx = words.index(brand)
                if idx + 1 < len(words):
                    potential_model = words[idx + 1]
                    # Exclude common stop words from being a model
                    if potential_model not in ["under", "in", "above", "for", "automatic", "manual"]:
                        parsed.model = potential_model.title()
            except ValueError:
                pass
            break

    return parsed

async def parse_natural_language_query(query: str) -> ParsedQuery:
    """
    Parses a natural language query using ONLY rule-based regex patterns.
    No AI/LLM call to avoid timeouts. Fast and reliable fallback.
    """
    parsed_result = ParsedQuery()
    
    # Apply rule-based fallback immediately (skip AI entirely to avoid hangs)
    parsed_result = _apply_regex_fallback(query, parsed_result)
    
    logger.info(f"Parsed query via regex rules: {parsed_result}")
    return parsed_result
