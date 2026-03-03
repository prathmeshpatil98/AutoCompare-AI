import logging
import asyncio
from elasticsearch import AsyncElasticsearch
from app.core.config import settings

logger = logging.getLogger(__name__)

class ElasticEngine:
    def __init__(self):
        self.client: AsyncElasticsearch | None = None

    async def connect(self):
        try:
            logger.info(f"Connecting to Elasticsearch at {settings.ELASTICSEARCH_URL}")
            self.client = AsyncElasticsearch(settings.ELASTICSEARCH_URL, request_timeout=5)
            # Test the connection
            await asyncio.wait_for(self.client.info(), timeout=5.0)
            logger.info("Elasticsearch connected successfully")
        except asyncio.TimeoutError:
            logger.warning("Elasticsearch connection timed out - will use mock data")
            self.client = None
        except Exception as e:
            logger.warning(f"Elasticsearch connection failed: {e} - will use mock data")
            self.client = None

    async def disconnect(self):
        if self.client:
            await self.client.close()
            logger.info("Elasticsearch disconnected")

    def get_client(self) -> AsyncElasticsearch:
        if not self.client:
            raise RuntimeError("Elasticsearch client is not initialized")
        return self.client

# Singleton instance
es_engine = ElasticEngine()
