# AI Startup Builder - Backend

This is the fully modular, production-ready backend for the AI Startup Builder application. It is built using FastAPI, SQLAlchemy, and PostgreSQL, and features a clean architecture designed for scalability and maintainability.

## Architecture

The backend follows a strict clean architecture pattern:

```text
backend/
├── app/
│   ├── main.py              # Application entrypoint & FastAPI instance
│   ├── core/                # Core configuration, database, and security settings
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── api/                 # FastAPI routes (Controllers)
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── ...
│   ├── services/            # Business logic (Services)
│   │   ├── maps_service.py
│   │   ├── rag_service.py
│   │   ├── ...
│   ├── agents/              # Multi-Agent orchestrator logic (LangChain)
│   │   ├── orchestrator.py
│   │   ├── llm_factory.py
│   │   ├── ...
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic validation schemas
│   └── utils/               # Helper utilities
├── requirements.txt         # Python dependencies
└── .env.example             # Environment variables template
```

## Features

- **JWT Authentication**: Secure authentication with Access & Refresh tokens, Guest Logins, and Phone OTP ready infrastructure (powered by Passlib & bcrypt).
- **Multi-Agent Orchestration**: Specialized LangChain AI agents (Market Agent, Finance Agent, Competitor Agent, etc.) orchestrated to build a complete startup blueprint.
- **Location Intelligence**: Deep integration with Google Maps, Places, and Geocoding APIs.
- **Knowledge Engine (RAG)**: Retrieval-Augmented Generation powered by ChromaDB and Gemini Embeddings for custom document Q&A.
- **Export Engine**: Export startup blueprints into PDF, DOCX, PPTX, JSON, and Markdown formats.

## Setup Instructions

1. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in the required API keys (Database URL, Secret Key, Gemini API Key, Google Maps API Key, etc.).

2. **Install Dependencies**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   ```bash
   python -m app.main
   ```
   The backend will start on `http://0.0.0.0:8000`. You can view the automatically generated Swagger UI at `http://localhost:8000/docs`.

## Future Enhancements
- Deploy Redis and Celery for asynchronous background jobs.
- Setup Alembic for database migrations.
