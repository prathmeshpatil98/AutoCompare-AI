# 🔗 Frontend-Backend Integration Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS FRONTEND                         │
│  (localhost:3000)                                               │
│                                                                 │
│  ├─ src/components/search/SearchBar.tsx                        │
│  ├─ src/hooks/queries/useSearchCars.ts      ──────┐           │
│  ├─ src/hooks/useDebounce.ts                      │            │
│  └─ src/store/useCompareStore.ts                  │            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST │ Requests
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│  (localhost:8000)                                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Middleware Stack                                        │   │
│  │ ├─ CORS (Allow localhost:3000)                         │   │
│  │ ├─ Rate Limiting (100 req/min)                        │   │
│  │ ├─ Request Logging                                     │   │
│  │ └─ Error Handling                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│          ┌───────────────────┼───────────────────┐             │
│          │                   │                   │             │
│          ▼                   ▼                   ▼             │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐    │
│  │ /api/v1/search│  │ /api/v1/     │  │ /api/v1/      │    │
│  │               │  │ listings     │  │ compare       │    │
│  ├─Search Logic │  ├─Featured     │  ├─Compare Cars  │    │
│  │   NL Parsing │  │─Get Details  │  │─Similar Cars  │    │
│  │   Filtering  │  │─Get Filters  │  └────────────────┘    │
│  └───────────────┘  └───────────────┘                        │
│          │                                                     │
│          └───────────────────┬─────────────────────┐          │
│                              │                     │          │
│                              ▼                     ▼          │
│                  ┌──────────────────┐  ┌─────────────────┐   │
│                  │ /api/v1/        │  │ /api/v1/health │   │
│                  │ analytics       │  └─────────────────┘   │
│                  ├─Market Insights │                        │
│                  │─Recommendations │                        │
│                  │─Price Trends    │                        │
│                  └──────────────────┘                        │
│                              │                              │
│          ┌───────────────────┼───────────────────┐         │
│          │                   │                   │         │
│          ▼                   ▼                   ▼         │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │ Service      │  │ Cache            │  │ External    │ │
│  │ Logic        │  │ (Redis)          │  │ Services    │ │
│  │              │  │                  │  │             │ │
│  │ • search.py  │  │ • Query Cache    │  │ • Groq API  │ │
│  │ • comparison │  │ • Expiry: 1hr    │  │ • ES        │ │
│  │ • analytics  │  └──────────────────┘  └─────────────┘ │
│  └──────────────┘                                         │
│          │                                                │
│          ▼                                                │
│  ┌──────────────────────────────────┐                   │
│  │ In-Memory Mock Data (13 cars)    │                   │
│  │ • MOCK_CARS list                 │                   │
│  │ • Easily replaceable with DB     │                   │
│  └──────────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                   (Optional) │ Production
                              ▼
                   ┌──────────────────┐
                   │ PostgreSQL/MySQL │
                   │ Redis Cluster    │
                   │ Elasticsearch    │
                   └──────────────────┘
```

## Data Flow Examples

### 1. Search Flow

```
User Types in SearchBar
    ↓
useSearchCars Hook (React Query)
    ↓
POST /api/v1/search/
{
  "query": "mahindra xuv700 diesel under 18 lakh",
  "skip": 0,
  "limit": 20
}
    ↓
Backend Processing:
  1. Check Redis Cache
  2. Parse query → ParsedQuery
  3. Filter MOCK_CARS
  4. Apply pagination
  5. Cache result
    ↓
Response:
{
  "parsed_query": {...},
  "results": [...cars...],
  "total": 5,
  "execution_time_ms": 45
}
    ↓
Frontend renders ResultsGrid.tsx with results
```

### 2. Comparison Flow

```
User selects 2-5 cars
    ↓
useCompareStore stores IDs
    ↓
POST /api/v1/compare/compare
{
  "car_ids": ["id1", "id2", "id3"]
}
    ↓
Backend processes:
  1. Find cars in MOCK_CARS
  2. Generate pros/cons
  3. Calculate recommendations
  4. Score value proposition
    ↓
Response:
{
  "cars": [CarListingResponse...],
  "specifications": {...},
  "pros_cons": {...},
  "best_for": {...}
}
    ↓
CompareDrawer.tsx displays detailed comparison
```

### 3. Analytics Flow

```
Page Load → useEffect
    ↓
GET /api/v1/analytics/market-insights
    ↓
Backend:
  1. Analyze all MOCK_CARS
  2. Calculate statistics
  3. Generate insights
    ↓
Response:
{
  "total_listings": 13,
  "average_price": 1050000,
  "brand_distribution": {...},
  "price_ranges": {...}
}
    ↓
Dashboard displays insights
```

## API Configuration in Frontend

### Current Setup

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
                    'http://localhost:8000';

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Environment Configuration

```env
# In .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### For Production

```env
# In .env.production
NEXT_PUBLIC_API_URL=https://api.autocompare-ai.com
```

## CORS Configuration

Backend is configured to accept requests from:

```python
allowed_origins = [
    "http://localhost:3000",      # Dev frontend
    "http://127.0.0.1:3000",
    "http://localhost:8000",       # Dev API
    "http://127.0.0.1:8000",
    "https://autocompare-ai.com",  # Production
]
```

To add your domain in production:
Edit `app/main.py` and add your URL to `allowed_origins`.

## Frontend API Integration Points

### SearchBar Component
```typescript
// Uses: useSearchCars hook
// Calls: POST /api/v1/search/
// Updates: React Query cache
```

### ResultsGrid Component
```typescript
// Displays: Search results
// Uses: CarCard sub-component
// Stores: Selection in useCompareStore
```

### CompareDrawer Component
```typescript
// Uses: useCompare store
// Calls: POST /api/v1/compare/compare
// Displays: Detailed comparison
```

### FilterSidebar Component
```typescript
// Calls: GET /api/v1/listings/filters
// Updates: Search query
// Triggers: New search
```

## React Query Configuration

```typescript
// In QueryProvider.tsx
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,  // 5 minutes
            gcTime: 1000 * 60 * 10,     // 10 minutes
            retry: 1,
            retryDelay: (attemptIndex) => 
                Math.min(1000 * 2 ** attemptIndex, 30000),
        },
    },
});
```

This matches the backend's 1-hour cache TTL.

## Error Handling

### Frontend
```typescript
try {
    const data = await apiClient.post('/search/', {query});
    // Success
} catch (error) {
    // Backend returns: { detail: "error message" }
    console.error(error.response.data.detail);
}
```

### Backend
```python
raise HTTPException(
    status_code=400,
    detail="Invalid query provided"
)
```

## Testing Integration

### Unit Test Example
```typescript
// frontend/tests/hooks/useSearchCars.test.ts
it('should fetch search results', async () => {
    const { result } = renderHook(() => 
        useSearchCars("mahindra xuv700")
    );
    
    await waitFor(() => {
        expect(result.current.data?.results).toBeDefined();
    });
});
```

### API Test Example
```bash
curl -X POST http://localhost:8000/api/v1/search/ \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

## Debugging Tips

### Frontend

1. **Check API URL**:
```typescript
console.log(API_BASE_URL); // Should show backend URL
```

2. **Monitor Network Requests**:
- Open DevTools → Network tab
- Look for /api/v1 requests
- Check response status and data

3. **React Query Devtools**:
```bash
npm install @tanstack/react-query-devtools
```

### Backend

1. **Enable Debug Logging**:
```
DEBUG=True in .env
python -m uvicorn app.main:app --log-level debug
```

2. **Check Middleware Logs**:
- CORS errors appear in console
- Rate limiting info in logs
- Request timing in logs

3. **Test Endpoint Directly**:
```bash
curl http://localhost:8000/docs
# Use Swagger UI to test endpoints
```

## Performance Optimization

### Caching Strategy

**Frontend (React Query)**:
- Query cache: staleTime = 5 minutes
- Background refetch: gcTime = 10 minutes
- Keeps: 3-5 search queries cached

**Backend (Redis)**:
- Query cache: TTL = 1 hour
- Eviction: LRU (Least Recently Used)
- Size: Limited by Redis memory

### Request Optimization

**Frontend**:
```typescript
// Debounce search input
const debouncedQuery = useDebounce(query, 300);

// Only fetch when query is long enough
if (debouncedQuery.length > 2) {
    fetchSearchResults();
}
```

**Backend**:
```python
# Pagination limits results
limit = min(query.limit, 100)  # Max 100 per request

# Pagination skips processing
results = filtered_cars[skip:skip + limit]
```

## Production Deployment Checklist

### Frontend
- [ ] Set NEXT_PUBLIC_API_URL to production URL
- [ ] Build: `npm run build`
- [ ] Test in production environment
- [ ] Deploy to Vercel/Netlify/AWS

### Backend
- [ ] Set production database URL
- [ ] Set DEBUG=False
- [ ] Update ALLOWED_ORIGINS
- [ ] Setup Redis in production
- [ ] Deploy via Docker/Cloud

### Combined
- [ ] Test frontend ↔ backend integration
- [ ] Monitor error logs
- [ ] Setup monitoring/alerting
- [ ] Load test both
- [ ] HTTPS enabled on both

## Troubleshooting Integration

### "CORS error"
**Solution**: Check ALLOWED_ORIGINS in `app/main.py`

### "Cannot reach API"
**Solution**: Verify API_URL in frontend .env

### "Results not updating"
**Solution**: Check React Query staleTime and gcTime

### "Search returning empty"
**Solution**: Check backend logs if MOCK_CARS is empty

### "Comparison showing errors"
**Solution**: Verify car IDs match those in backend

## Example .env Files

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AutoCompare AI
```

### Backend (.env)
```env
GROQ_API_KEY=your-key
REDIS_URL=redis://127.0.0.1:6379/0
DEBUG=True
```

---

**Your frontend and backend are now fully integrated!** 🎉

The frontend can now:
- ✅ Search cars using natural language
- ✅ Compare multiple cars
- ✅ View market analytics
- ✅ Get personalized recommendations
- ✅ Browse featured listings

All powered by your advanced backend! 🚀
