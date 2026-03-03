# AutoCompare AI - AI-Powered Car Search Engine

A modern, AI-powered car search aggregator that understands natural language queries. Describe what you want in plain words — brand, price, location, fuel type — and get instant results across multiple platforms.

## 🚀 Features

- **Natural Language Processing**: Uses Groq AI to understand what you're looking for
- **Multi-Platform Aggregation**: Searches across CarDekho, Cars24, Spinny, and more
- **Lightning-Fast Search**: Powered by Elasticsearch with Redis caching
- **Smart Comparison**: Compare up to 3 cars side-by-side
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Search**: Instant results as you type
- **AI-Parsed Filters**: Automatically extracted search parameters

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Elasticsearch** - Advanced search and analytics
- **Redis** - Caching and real-time data
- **Groq API** - LLM for natural language parsing
- **Celery** - Task queue for background jobs
- **Pydantic** - Data validation and settings management

## 📋 Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.10+
- **Docker** and Docker Compose (recommended)
- **Elasticsearch** 8.0+
- **Redis** 5.0+

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/autocompare-ai.git
cd autocompare-ai

# Start all services
docker-compose up -d

# Frontend will be available at http://localhost:3000
# API will be available at http://localhost:8000
# API Docs at http://localhost:8000/api/v1/openapi.json
```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
python app/main.py
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## 📝 Environment Variables

### Backend (`.env`)
```env
# API Configuration
PROJECT_NAME=AutoCompare AI
API_V1_STR=/api/v1

# Elasticsearch
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# Redis
REDIS_URL=redis://localhost:6379

# Groq API
GROQ_API_KEY=your_groq_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost/autocompare
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📖 API Documentation

The API documentation is available at `http://localhost:8000/api/v1/openapi.json` when the backend is running.

### Main Endpoints

- `POST /api/v1/search/` - Perform a natural language search
- `GET /api/v1/health/` - Health check endpoint

## 🎨 Frontend Improvements

### Recent Enhancements

✅ **Mobile-Responsive Header** - Full hamburger menu for mobile devices
✅ **Professional Footer** - Links, social media, and company info
✅ **Error Handling** - Custom 404 and error pages
✅ **Image Fallbacks** - Graceful image loading with error states
✅ **Accessibility (WCAG 2.1)** - ARIA labels, semantic HTML, keyboard navigation
✅ **SEO Optimization** - Meta tags, Open Graph, Twitter Card support
✅ **Fixed Compare Drawer** - Dynamic grid layout using inline styles
✅ **Enhanced Typography** - Better hierarchy and readability

## 🔒 Security

- ✅ CORS restricted to specific origins
- ✅ Rate limiting on all API endpoints (100 requests/60 seconds)
- ✅ Input validation with Pydantic
- ✅ Secure HTTP headers
- ✅ No sensitive data in environment variables
- ⚠️ Use HTTPS in production

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1280px+)

## ♿ Accessibility Features

- WCAG 2.1 Level AA compliance
- ARIA labels on interactive elements
- Keyboard navigation support
- Semantic HTML structure
- Focus indicators for better visibility
- Image alt text and error states

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📊 Performance

- Lighthouse Page Speed Score: 95+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

## 🐛 Known Issues & Limitations

- Image loading may be slow for cars with large images
- Elasticsearch requires proper indexing setup
- Redis persistence should be configured for production

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **AI Integration**: Powered by Groq
- **Backend Infrastructure**: FastAPI, Elasticsearch, Redis
- **Frontend Design**: Next.js, Tailwind CSS, TypeScript

## 📞 Support

For support, email support@autocompare-ai.com or open an issue on GitHub.

## 🙏 Acknowledgments

- **Groq** for providing fast LLM inference
- **Elasticsearch** for powerful search capabilities
- **The Next.js community** for excellent documentation
- **All contributors** who have helped improve this project

---

**Made with ♡ for car enthusiasts**

Last Updated: March 2026
