# 🔍 AI-Powered Personalized Search Engine

An intelligent, full-stack search engine that leverages machine learning to deliver personalized search results based on user interests, behavior, and persona modes.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login/register with Spring Security
- 🎯 **Personalized Results** — ML-powered re-ranking using sentence embeddings
- 🧠 **Persona Modes** — Student, Work, and Casual modes for contextual results
- 📊 **Interest Tracking** — User interest profiles that improve result relevance
- 💾 **Search History** — Track and review past searches
- ⭐ **Saved Results** — Bookmark and organize favorite results
- 👍👎 **Feedback Loop** — Thumbs up/down to refine personalization
- 🐳 **Dockerized** — One-command deployment with Docker Compose

## 🏗️ Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, JWT    |
| Database   | MySQL 8.0, Spring Data JPA, Hibernate             |
| Frontend   | React.js 18, Tailwind CSS, Axios, React Router v6 |
| ML Service | Python 3.11, Flask, sentence-transformers         |
| Search API | SerpAPI (organic web results)                     |
| Cache      | Redis (optional)                                  |
| DevOps     | Docker, Docker Compose                            |

## 🏛️ Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│   React.js   │────▶│  Spring Boot API │────▶│   SerpAPI    │
│   Frontend   │◀────│  (Port 8080)     │◀────│  (External)  │
│  (Port 3000) │     └────────┬─────────┘     └──────────────┘
└──────────────┘              │
                              │ Re-rank request
                              ▼
                    ┌──────────────────┐
                    │  Python Flask ML │
                    │  (Port 5000)     │
                    │  sentence-transformers
                    └──────────────────┘
                              │
                    ┌──────────────────┐
                    │     MySQL 8.0    │
                    │  (Port 3306)     │
                    └──────────────────┘
```

## 📋 Prerequisites

- Java 17 (JDK)
- Node.js 18+
- Python 3.11+
- MySQL 8.0
- Docker & Docker Compose (optional)
- SerpAPI key ([get one here](https://serpapi.com))

## 🚀 Local Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd ai-search-engine
```

### 2. Database Setup
```sql
CREATE DATABASE ai_search_db;
```

### 3. Backend (Spring Boot)
```bash
cd backend
# Update src/main/resources/application.properties with your MySQL and SerpAPI credentials
mvn clean install
mvn spring-boot:run
```
Backend runs on **http://localhost:8080**

### 4. ML Service (Python Flask)
```bash
cd ml-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
ML Service runs on **http://localhost:5000**

### 5. Frontend (React)
```bash
cd frontend
npm install
npm start
```
Frontend runs on **http://localhost:3000**

## 🐳 Docker Setup

```bash
docker-compose up --build
```

This spins up all 4 services (MySQL, Backend, ML Service, Frontend).

## 📡 API Endpoints

### Authentication
| Method | Endpoint             | Description       | Auth |
|--------|----------------------|--------------------|------|
| POST   | `/api/auth/register` | Register new user  | No   |
| POST   | `/api/auth/login`    | Login              | No   |
| GET    | `/api/auth/me`       | Get current user   | Yes  |

### Search
| Method | Endpoint               | Description              | Auth |
|--------|------------------------|--------------------------|------|
| GET    | `/api/search`          | Personalized search      | Yes  |
| POST   | `/api/search/feedback` | Submit result feedback    | Yes  |
| GET    | `/api/search/history`  | Get search history       | Yes  |

### User Profile
| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| GET    | `/api/user/profile` | Get user profile     | Yes  |
| PUT    | `/api/user/interests`| Update interests     | Yes  |
| PUT    | `/api/user/mode`    | Update persona mode  | Yes  |
| POST   | `/api/user/save`    | Save a search result | Yes  |
| GET    | `/api/user/saved`   | Get saved results    | Yes  |

### ML Service
| Method | Endpoint    | Description            |
|--------|-------------|------------------------|
| POST   | `/rerank`   | Re-rank search results |
| POST   | `/embed`    | Generate embeddings    |
| GET    | `/health`   | Health check           |

## 🧠 How Personalization Works

1. **User searches** a query via the frontend
2. **Backend** fetches organic results from SerpAPI
3. **ML Service** receives results + user interests
4. **Sentence Embeddings** (all-MiniLM-L6-v2) encode both user profile and each result
5. **Cosine Similarity** scores each result against the user's profile
6. **Re-ranked results** are returned, sorted by personalization score
7. **Feedback** (👍/👎) is stored to improve future recommendations

## ⚙️ Environment Variables

| Variable                       | Description                 | Default                  |
|--------------------------------|-----------------------------|--------------------------|
| `SPRING_DATASOURCE_URL`       | MySQL connection URL        | `jdbc:mysql://localhost:3306/ai_search_db` |
| `SPRING_DATASOURCE_USERNAME`  | MySQL username              | `root`                   |
| `SPRING_DATASOURCE_PASSWORD`  | MySQL password              | `root`                   |
| `JWT_SECRET`                   | JWT signing secret          | (see application.properties) |
| `SERPAPI_KEY`                  | SerpAPI API key             | `YOUR_SERPAPI_KEY`       |
| `ML_SERVICE_URL`               | ML service URL              | `http://localhost:5000`  |
| `REACT_APP_API_URL`           | Backend API URL for frontend| `http://localhost:8080`  |

## 🔮 Future Improvements

- Collaborative filtering across users
- Click-through rate tracking and optimization
- Redis caching for frequently searched queries
- Auto-suggest / search autocomplete
- Admin dashboard with analytics
- Multi-language search support
- Voice search integration
- Real-time trending topics
