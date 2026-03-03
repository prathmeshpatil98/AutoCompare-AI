#!/usr/bin/env python
import asyncio
import json
from app.services.search import execute_search

async def test():
    result = await execute_search("mahindra xuv in gujrat")
    print(json.dumps(result.model_dump(), indent=2, default=str))

if __name__ == "__main__":
    asyncio.run(test())
