# Development Guide - AutoCompare AI Backend

## 🎯 Project Overview

AutoCompare AI is an advanced backend system for an AI-powered car search and comparison platform. The backend provides:

- **Search**: Natural language query parsing into structured filters
- **Comparison**: Detailed car-to-car comparison with recommendations
- **Analytics**: Market insights and personalized recommendations
- **Caching**: Redis-based performance optimization
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Comprehensive error management

## 🏗️ Architecture

### Request Flow

```
Client Request
    ↓
CORS Middleware
    ↓
Rate Limiting Middleware
    ↓
Logging Middleware
    ↓
Error Handling Middleware
    ↓
Route Handler
    ↓
Service Layer (Business Logic)
    ↓
Cache/Database/External Services
    ↓
Response
```

### Layer Breakdown

**API Layer** (`app/api/`)
- Routes: Define HTTP endpoints
- Middleware: Handle cross-cutting concerns

**Service Layer** (`app/services/`)
- Business logic
- Data filtering and processing
- External service integration

**Domain Layer** (`app/domain/`)
- Models: SQLAlchemy ORM models
- Schemas: Pydantic validation

**Core Layer** (`app/core/`)
- Configuration management
- Security utilities

## 📚 Module Guide

### Search Module (`app/services/search.py`)

Handles car search with intelligent filtering:

```python
# Key functions:
execute_search(query_str, skip, limit)  # Main search
get_available_filters()                  # UI filter options
get_car_details(car_id)                  # Single car details
get_featured_listings()                  # Top listings
```

**Features**:
- Natural language parsing via `ai/parser.py`
- Multi-factor filtering
- Redis caching with MD5 query hashing
- Pagination support

### Comparison Module (`app/services/comparison.py`)

Advanced car comparison Engine:

```python
# Key functions:
compare_cars(car_ids)        # Multi-car comparison
get_similar_cars(car_id)     # Find similar vehicles
```

**Intelligence**:
- Auto-generated pros/cons
- Use-case recommendations (budget, best-value, newest)
- Similarity scoring algorithm

### Analytics Module (`app/services/analytics.py`)

Market insights and personalized recommendations:

```python
# Key functions:
get_market_insights()           # Overall statistics
get_user_recommendations()      # Personalized suggestions
get_price_trends()              # Price analysis
get_trending_search_terms()     # Popular searches
```

**Scoring Algorithm**:
Combines multiple factors:
- Price alignment (20 points)
- Brand matching (25 points)
- Specifications matching (15 points each)
- Location (10 points)
- Rating boost (3-5 extra points)

### AI Parser Module (`app/services/ai/parser.py`)

Dual-strategy natural language parsing:

1. **AI Strategy** (Primary):
   - Uses Groq API for intelligence
   - 5-second timeout with fallback
   - Handles complex queries

2. **Regex Strategy** (Fallback):
   - Rule-based pattern matching
   - Instant results
   - Handles common phrases

**Parsed Fields**:
```
- brand: Car manufacturer
- model: Car model
- price_min/max: Price range
- location: City/Region
- fuel_type: Petrol/Diesel/Electric/CNG
- transmission: Manual/Automatic
- body_type: SUV/Sedan/Hatchback
- condition: New/Used
```

## 🔧 Adding New Features

### Add New Search Filter

1. **Update Schema** (`app/domain/schemas/search.py`):
```python
class ParsedQuery(BaseModel):
    your_new_filter: Optional[str] = None
```

2. **Update Parser** (`app/services/ai/parser.py`):
```python
def _apply_regex_fallback(query, parsed):
    if "your_keyword" in query_lower:
        parsed.your_new_filter = "value"
```

3. **Update Search Logic** (`app/services/search.py`):
```python
if parsed_query.your_new_filter:
    filtered_cars = [
        car for car in filtered_cars
        if car["your_field"] == parsed_query.your_new_filter
    ]
```

### Add New API Endpoint

1. **Create route handler** (`app/api/routes/your_feature.py`):
```python
from fastapi import APIRouter
router = APIRouter()

@router.get("/endpoint")
async def your_endpoint():
    return {"data": "value"}
```

2. **Register in router** (`app/api/router.py`):
```python
api_router.include_router(your_feature.router, 
                          prefix="/your_feature", 
                          tags=["your_feature"])
```

### Add New Service

1. **Create service** (`app/services/your_service.py`):
```python
async def your_function(params):
    # Your logic here
    return result
```

2. **Create routes** (`app/api/routes/your_feature.py`):
```python
from app.services.your_service import your_function

@router.get("/endpoint")
async def handler():
    result = await your_function(params)
    return result
```

## 🗄️ Database Integration (Production)

### Current Implementation
- **Mock Data**: In-memory MOCK_CARS list
- **Caching**: Redis for performance
- **No Persistence**: Data resets on restart

### Production Setup

1. **Install PostgreSQL driver**:
```bash
pip install psycopg2-binary sqlalchemy
```

2. **Configure Database**:
```env
DATABASE_URL=postgresql://user:password@localhost/autocompare_ai
```

3. **Create Models**:
```python
# In app/domain/models/listing.py
from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CarListing(Base):
    __tablename__ = "car_listings"
    id = Column(String, primary_key=True)
    title = Column(String)
    # ... more fields
```

4. **Initialize Database**:
```bash
# Create alembic migration
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

5. **Update Services**:
```python
from sqlalchemy.orm import Session
from app.domain.models import CarListing

def get_cars(db: Session):
    return db.query(CarListing).all()
```

## 📊 Caching Strategy

### Query Caching
```python
query_hash = hashlib.md5(query.encode()).hexdigest()
cache_key = f"search:{query_hash}:{skip}:{limit}"
cached = await redis_cache.get(cache_key)
```

**TTL**: 1 hour

**Invalidation**: On data update (requires implementation)

### Best Practices
- Cache expensive queries
- Set appropriate TTLs
- Include query parameters in key
- Monitor cache hit rate

## 🔒 Security Considerations

### Current Implementation
✅ CORS protection
✅ Input validation (Pydantic)
✅ Request logging
✅ Rate limiting
✅ Error message sanitization

### Production Improvements
- [ ] API key authentication
- [ ] JWT token validation
- [ ] HTTPS/TLS enforcement
- [ ] SQL injection prevention (ORM)
- [ ] CSRF protection
- [ ] Request size limits
- [ ] Comprehensive audit logging

### Implementation Example
```python
from fastapi.security import HTTPBearer

security = HTTPBearer()

@router.post("/secure-endpoint")
async def secure_endpoint(credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials
    # Validate token
    return {"status": "authorized"}
```

## 🧪 Testing Strategy

### Unit Tests (`tests/services/`)
```python
@pytest.mark.asyncio
async def test_execute_search():
    result = await execute_search("mahindra xuv700")
    assert result.total > 0
    assert result.results[0].brand == "Mahindra"
```

### Integration Tests (`tests/api/`)
```python
def test_search_endpoint(client):
    response = client.post("/api/v1/search/", 
                          json={"query": "test"})
    assert response.status_code == 200
    assert "results" in response.json()
```

### Run Tests
```bash
# All tests
pytest

# Specific file
pytest tests/services/test_search.py

# With coverage
pytest --cov=app
```

## 📈 Performance Optimization

### Current Metrics
- Search: <500ms (first call), <100ms (cached)
- Comparison: <200ms
- Analytics: <300ms

### Optimization Techniques

1. **Query Optimization**
```python
# Bad: O(n²) filtering
for car in MOCK_CARS:
    if car in other_list:  # Searches entire list

# Good: O(1) lookup
car_set = set(car_ids)
if car_id in car_set:
```

2. **Pagination**
```python
# Avoid loading all results
results = filtered_cars[skip:skip + limit]
```

3. **Indexing**
```python
# For Elasticsearch
"properties": {
    "brand": {"type": "keyword", "index": True},
    "price": {"type": "integer"}
}
```

4. **Connection Pooling**
```python
# SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=0
)
```

## 🚀 Deployment Options

### Local Development
```bash
python -m uvicorn app.main:app --reload
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### Cloud Platforms
- **Heroku**: Use Procfile and buildpacks
- **AWS**: EC2 + RDS + ElastiCache
- **Google Cloud**: Cloud Run + Firestore
- **Azure**: App Service + Azure Database

## 📚 Code Style & Standards

### Formatting
```bash
# Black code formatting
black app/

# Flake8 linting
flake8 app/
```

### Naming Conventions
- `functions`: snake_case
- `Classes`: PascalCase
- `CONSTANTS`: UPPER_CASE
- `Private`: _leading_underscore

### Docstring Style
```python
async def search(query: str) -> SearchResponse:
    """
    Search for cars using natural language.
    
    Args:
        query: Natural language search query
        
    Returns:
        SearchResponse with results and metadata
        
    Raises:
        HTTPException: If search fails
    """
```

## 🔄 Update & Maintenance

### Regular Tasks
- Monitor error logs
- Review slow queries
- Update dependencies monthly
- Audit security settings
- Clean old cache entries

### Update Dependencies
```bash
pip list --outdated
pip install --upgrade package_name
```

### Backup Strategy
```bash
# Database backup (PostgreSQL)
pg_dump autocompare_ai > backup.sql

# Restore
psql autocompare_ai < backup.sql
```

## 📞 Common Issues & Solutions

### Memory Leaks
```python
# Always close connections
async def connect():
    conn = await pool.acquire()
    try:
        return await conn.fetch("SELECT 1")
    finally:
        await pool.release(conn)
```

### Slow Queries
```python
# Use EXPLAIN to analyze
# Enable query logging
from sqlalchemy import event

@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, params, context, executemany):
    print("Executing:", statement)
```

## 🎓 Learning Resources

- [FastAPI Official Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Async Python](https://docs.python.org/3/library/asyncio.html)
- [Redis Best Practices](https://redis.io/docs/)
- [PostgreSQL Admin Guide](https://www.postgresql.org/docs/)

## 📝 Commit Message Guidelines

```
[FEATURE] Add car comparison feature
[BUGFIX] Fix timeout in search parser
[DOCS] Update API documentation
[REFACTOR] Optimize search filtering
[TEST] Add tests for comparison logic
```

---

**Last Updated**: January 2024
**Maintainers**: Your Team
**License**: MIT
