import logging
from app.services.search_engine.client import es_engine

logger = logging.getLogger(__name__)

INDEX_NAME = "car_listings"

CAR_LISTING_MAPPING = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0,
        "analysis": {
            "analyzer": {
                "custom_edge_ngram": {
                    "tokenizer": "edge_ngram_tokenizer",
                    "filter": ["lowercase"]
                }
            },
            "tokenizer": {
                "edge_ngram_tokenizer": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 10,
                    "token_chars": ["letter", "digit"]
                }
            }
        }
    },
    "mappings": {
        "properties": {
            "id": {"type": "keyword"},
            "title": {
                "type": "text",
                "analyzer": "custom_edge_ngram",
                "search_analyzer": "standard"
            },
            "brand": {"type": "keyword"},
            "model": {"type": "keyword"},
            "price": {"type": "integer"},
            "year": {"type": "integer"},
            "mileage": {"type": "integer"},
            "fuel_type": {"type": "keyword"},
            "transmission": {"type": "keyword"},
            "location": {"type": "keyword"},
            "source_url": {"type": "keyword", "index": False},
            "source_website": {"type": "keyword"},
            "thumbnail_url": {"type": "keyword", "index": False}
        }
    }
}

async def setup_elasticsearch_index():
    """
    Ensures the Elasticsearch index exists and has the strictly typed mapping applied.
    Optimizes search performance by typing fields correctly preventing dynamic mapping bloat.
    """
    try:
        es = es_engine.get_client()
        exists = await es.indices.exists(index=INDEX_NAME)
        if not exists:
            await es.indices.create(index=INDEX_NAME, body=CAR_LISTING_MAPPING)
            logger.info(f"Successfully created optimized index mapping for '{INDEX_NAME}'")
        else:
            logger.info(f"Index '{INDEX_NAME}' already exists.")
    except Exception as e:
        logger.error(f"Failed to setup Elasticsearch mapping: {e}")
