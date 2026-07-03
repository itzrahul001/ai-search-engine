# 🔍 AI-Powered Personalized Search Engine

A full-stack, AI-powered search engine that delivers personalized results using **local embeddings via Ollama** and semantic re-ranking — all without any paid AI API. Results are sourced from Google via SerpAPI and re-ranked in-process using Spring AI + the `nomic-embed-text` model.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based register/login with Spring Security
- 🎯 **Personalized Results** — Semantic re-ranking using cosine similarity on Ollama embeddings
- 🧠 **Persona Modes** — Student, Work, and Casual modes for contextual search
- 📊 **Interest Tracking** — User interest profiles that improve result relevance over time
- 💾 **Search History** — Track and review past searches (last 20 shown)
- ⭐ **Saved Results** — Bookmark results with optional topic tags
- 👍👎 **Feedback Loop** — Thumbs up/down to refine personalization
- 🏠 **Protected Routes** — Authenticated-only search and profile pages
- 🐳 **Dockerized** — One-command deployment with Docker Compose

---

## 🏗️ Tech Stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, JWT (jjwt 0.11.5)    |
| AI / ML    | Spring AI 1.0.0-M6, Ollama (`nomic-embed-text`), Cosine Similarity |
| Database   | MySQL 8.0, Spring Data JPA / Hibernate                           |
| Frontend   | React 18, React Router v6, Tailwind CSS v3, Axios               |
| Search API | SerpAPI (Google organic results)                                 |
| DevOps     | Docker, Docker Compose, multi-stage Dockerfiles                  |

> **No external ML service or paid AI API is required.** Embeddings run fully locally via Ollama inside Docker.

---

## 🏛️ Architecture

```
┌──────────────────┐       ┌────────────────────────┐       ┌──────────────┐
│  React Frontend  │──────▶│  Spring Boot Backend   │──────▶│   SerpAPI    │
│  (Port 3000)     │◀──────│  (Port 8080)           │◀──────│  (External)  │
└──────────────────┘       └───────────┬────────────┘       └──────────────┘
                                       │ Spring AI EmbeddingModel
                                       ▼
                           ┌────────────────────────┐
                           │  Ollama (Local LLM)    │
                           │  nomic-embed-text      │
                           │  (Port 11434)          │
                           └────────────────────────┘
                                       │
                           ┌────────────────────────┐
                           │     MySQL 8.0          │
                           │  (Port 3306)           │
                           └────────────────────────┘
```

### How Re-Ranking Works

1. User submits a search query via the React frontend
2. Backend calls **SerpAPI** to fetch Google organic results
3. **RankingService** builds a "profile text" from `query + user interests`
4. **Spring AI** calls Ollama's `nomic-embed-text` to embed the profile text and each result (`title + snippet`)
5. **Cosine Similarity** scores each result against the user profile embedding
6. Results are sorted descending by personalization score and returned
7. User feedback (👍/👎) is stored in MySQL for future tuning

---

## 📁 Project Structure

```
ai-search-engine/
├── docker-compose.yml          # Orchestrates MySQL, Ollama, Backend, Frontend
├── backend/
│   ├── Dockerfile
│   ├── .env                    # Local env vars (do NOT commit)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/aisearch/
│       │   ├── AiSearchEngineApplication.java
│       │   ├── config/
│       │   │   └── WebClientConfig.java      # WebClient bean for SerpAPI
│       │   ├── controller/
│       │   │   ├── AuthController.java        # /api/auth/**
│       │   │   ├── SearchController.java      # /api/search/**
│       │   │   └── UserController.java        # /api/user/**
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── UserProfile.java
│       │   │   ├── SearchHistory.java
│       │   │   └── SavedResult.java
│       │   ├── payload/                       # DTOs (request/response)
│       │   ├── repository/                    # Spring Data JPA repos
│       │   ├── security/
│       │   │   ├── SecurityConfig.java
│       │   │   ├── JwtUtil.java
│       │   │   ├── JwtFilter.java
│       │   │   └── CustomUserDetailsService.java
│       │   └── service/
│       │       ├── SearchService.java         # SerpAPI fetch + history saving
│       │       ├── RankingService.java        # Ollama embed + cosine re-rank
│       │       └── UserProfileService.java
│       └── resources/
│           └── application.properties
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── App.js                             # Routes + PrivateRoute guard
        ├── context/
        │   └── AuthContext.jsx                # JWT token state (React Context)
        ├── services/
        │   ├── api.js                         # Axios instance with auth header
        │   └── authService.js
        ├── components/
        │   ├── Navbar.jsx
        │   ├── SearchBar.jsx
        │   ├── ResultCard.jsx
        │   ├── InterestPicker.jsx
        │   └── PersonaSelector.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Search.jsx                     # Protected
            └── Profile.jsx                    # Protected
```

---

## 📋 Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0 |
| Ollama | Latest (for local setup) |
| Docker & Docker Compose | Latest (for Docker setup) |
| SerpAPI Key | [Get one here](https://serpapi.com) |

---

## 🚀 Local Setup (Without Docker)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd ai-search-engine
```

### 2. Database Setup
```sql
CREATE DATABASE ai_search_db;
```

### 3. Install & Start Ollama
```bash
# Install Ollama from https://ollama.com
ollama pull nomic-embed-text
ollama serve   # Runs on http://localhost:11434
```

### 4. Configure Backend Environment
Create `backend/.env` (or export these as shell variables):

```env
# Database
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# SerpAPI
SERPAPI_KEY=your_serpapi_key

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
```

### 5. Run the Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend starts on **http://localhost:8080**

### 6. Run the Frontend
```bash
cd frontend
npm install
npm start
```
Frontend starts on **http://localhost:3000**

---

## 🐳 Docker Setup (Recommended)

Create a `.env` file in the project root:

```env
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_key_min_32_chars
SERPAPI_KEY=your_serpapi_key
MYSQL_ROOT_PASSWORD=your_mysql_password
```

Then run:

```bash
docker-compose up --build
```

This spins up **4 services**:

| Service | Container | Port |
|---------|-----------|------|
| MySQL 8.0 | `ai-search-mysql` | 3306 |
| Ollama (nomic-embed-text) | `ai-search-ollama` | 11434 |
| Spring Boot Backend | `ai-search-backend` | 8080 |
| React Frontend | `ai-search-frontend` | 3000 |

> On first start, Ollama automatically pulls `nomic-embed-text`. This may take a minute.

---

## 📡 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/register` | Register new user (auto-creates profile) | ❌ |
| `POST` | `/api/auth/login` | Login and get JWT token | ❌ |
| `GET`  | `/api/auth/me` | Get current authenticated user | ✅ |

### Search — `/api/search`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET`  | `/api/search?query=&mode=` | Personalized search (mode: `student`/`work`/`casual`) | ✅ |
| `POST` | `/api/search/feedback` | Submit 👍/👎 feedback for a search result | ✅ |
| `GET`  | `/api/search/history` | Get last 20 search history entries | ✅ |

### User Profile — `/api/user`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET`  | `/api/user/profile` | Get interests, active mode, taste vector | ✅ |
| `PUT`  | `/api/user/interests` | Update interest list (JSON array string) | ✅ |
| `PUT`  | `/api/user/mode` | Update persona mode | ✅ |
| `POST` | `/api/user/save` | Save a search result with optional topic tag | ✅ |
| `GET`  | `/api/user/saved` | Get all saved results | ✅ |

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | _(required)_ |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | _(required)_ |
| `JWT_EXPIRATION` | Access token TTL in ms | `86400000` (24h) |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL in ms | `604800000` (7d) |
| `SERPAPI_KEY` | SerpAPI key for Google results | _(required)_ |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `REACT_APP_API_URL` | Backend URL for frontend | `http://localhost:8080` |
| `MYSQL_ROOT_PASSWORD` | MySQL root password (Docker only) | _(required)_ |

---

## 🗄️ Data Models

| Entity | Key Fields |
|--------|-----------|
| `User` | `id`, `email`, `passwordHash`, `fullName` |
| `UserProfile` | `userId`, `interests` (JSON array string), `activeMode`, `tasteVector` |
| `SearchHistory` | `userId`, `query`, `personaMode`, `searchedAt`, `feedback` (THUMBS_UP/THUMBS_DOWN) |
| `SavedResult` | `userId`, `title`, `url`, `snippet`, `topicTag`, `savedAt` |

---

## 🔐 Security

- Passwords hashed with **BCrypt** via Spring Security
- **JWT** tokens signed with HMAC-SHA256, stored in `localStorage` on the client
- All `/api/search/**` and `/api/user/**` routes require a valid `Bearer` token
- CORS is configured to allow requests from `http://localhost:3000`

---

## 🔮 Future Improvements

- [ ] Redis caching for frequent queries
- [ ] Collaborative filtering across users
- [ ] Click-through rate tracking
- [ ] Auto-suggest / search autocomplete
- [ ] Admin dashboard with analytics
- [ ] Multi-language search support
- [ ] Voice search integration
- [ ] Real-time trending topics
