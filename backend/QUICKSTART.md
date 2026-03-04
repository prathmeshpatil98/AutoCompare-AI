# Quick Start Guide - AutoCompare AI Backend

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Environment (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure .env (1 minute)

```bash
# Copy example config
cp .env.example .env

# Edit .env file and add:
GROQ_API_KEY=your-api-key-from-groq-console
```

Get your Groq API key from: https://console.groq.com

### Step 3: Start the Server (1 minute)

```bash
python -m uvicorn app.main:app --reload
```

✅ API is now running at: **http://localhost:8000**

### Step 4: Test the API (1 minute)

Open in browser or use curl:

```bash
# Test health check
curl http://localhost:8000/api/v1/health/

# Test search
curl -X POST http://localhost:8000/api/v1/search/ \
  -H "Content-Type: application/json" \
  -d '{"query": "mahindra xuv700 diesel"}'

# Get featured listings
curl http://localhost:8000/api/v1/listings/featured

# Get market insights
curl http://localhost:8000/api/v1/analytics/market-insights
```

## 📚 Interactive API Documentation

FastAPI provides automatic documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Click through to explore all endpoints and test them directly!

## 🔥 Common Use Cases

### 1. Search Cars with Natural Language
```bash
curl -X POST http://localhost:8000/api/v1/search/ \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Hyundai i20 under 6 lakh automatic in Pune",
    "limit": 10
  }'
```

### 2. Compare Multiple Cars
```bash
curl -X POST http://localhost:8000/api/v1/compare/compare \
  -H "Content-Type: application/json" \
  -d '{
    "car_ids": ["spinny-hyundai-creta-1", "cars24-hyundai-i20-1"]
  }'
```

### 3. Get Similar Cars
```bash
curl http://localhost:8000/api/v1/compare/similar/spinny-hyundai-creta-1?limit=5
```

### 4. Get Personalized Recommendations
```bash
curl -X POST http://localhost:8000/api/v1/analytics/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "max_price": 1000000,
    "fuel_type": "Petrol"
  }'
```

## 🛠️ Advanced Configuration

### Enable Redis Caching (Optional)
```env
REDIS_URL=redis://127.0.0.1:6379/0
```

Install Redis:
```bash
# macOS
brew install redis

# Ubuntu/Debian
sudo apt-get install redis-server

# Start Redis
redis-server
```

### Enable Elasticsearch (Optional)
```env
ELASTICSEARCH_URL=http://127.0.0.1:9200
```

## 🧪 Run Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/api/test_search.py
```

## 📊 Database Setup (Optional - For Production)

If you want to use a real database:

```bash
# Install PostgreSQL
# macOS:
brew install postgresql

# Create database
createdb autocompare_ai

# Configure in .env
DATABASE_URL=postgresql://user:password@localhost/autocompare_ai

# Run migrations
alembic upgrade head
```

## 🐛 Troubleshooting

### Issue: "Module not found" error
```bash
# Make sure you're in the virtual environment
which python  # Should show venv path

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Address already in use" on port 8000
```bash
# Use a different port
python -m uvicorn app.main:app --port 8001 --reload

# Or kill existing process on 8000
lsof -i :8000
kill -9 <PID>
```

### Issue: API returns error about missing API key
```bash
# Make sure .env file has GROQ_API_KEY
cat .env | grep GROQ_API_KEY

# Get key from https://console.groq.com
```

## 📖 Project Structure Quick Reference

```
app/
├── api/                    # All API routes
│   ├── routes/
│   │   ├── search.py       # Search functionality
│   │   ├── listings.py     # Car listings
│   │   ├── comparison.py   # Car comparisons
│   │   └── analytics.py    # Market analytics
│   └── middleware/         # Request handling
├── core/
│   └── config.py           # Settings & env vars
├── services/               # Business logic
│   ├── search.py           # Search implementation
│   ├── comparison.py       # Comparison logic
│   ├── analytics.py        # Analytics logic
│   ├── cache/              # Caching
│   ├── search_engine/      # Elasticsearch
│   └── ai/                 # AI parsing
└── domain/
    ├── models/             # DB models (SQLAlchemy)
    └── schemas/            # API schemas (Pydantic)
```

## 🚀 Next Steps

1. **Customize Data**: Edit mock data in `app/services/search.py`
2. **Add More Features**: Create new services and routes
3. **Connect Frontend**: Configure CORS and connect Next.js app
4. **Deploy**: Use Docker or cloud platform
5. **Monitor**: Setup logging and monitoring

## 📝 Key Configuration Options

| Setting | Purpose | Default |
|---------|---------|---------|
| `DEBUG` | Enable debug mode | `True` |
| `RATE_LIMIT_REQUESTS` | Max requests per window | `100` |
| `RATE_LIMIT_WINDOW_SECONDS` | Time window for rate limit | `60` |
| `CACHE_TTL_SECONDS` | Cache duration | `3600` |
| `DEFAULT_LIMIT` | Default search results | `20` |

## 💡 Pro Tips

- Use `--reload` flag during development for auto-restart
- Check the logs to understand query parsing
- Use Swagger UI (http://localhost:8000/docs) to test endpoints
- Cache data locally for large datasets
- Enable Redis for production use

## 🎓 Learning Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pydantic Validation](https://docs.pydantic.dev/)
- [PostgreSQL + SQLAlchemy](https://sqlalchemy.org/)
- [Redis Caching](https://redis.io/)

## ❓ Need Help?

Check `BACKEND_README.md` for comprehensive documentation on all APIs and features.

---

**Tip**: Keep this terminal window open while developing. The `--reload` flag watches for code changes and auto-restarts the server!
