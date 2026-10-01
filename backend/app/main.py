from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base

from app.api.health import router as health_router
from app.auth.auth_router import router as auth_router
from app.api.projects import router as projects_router
from app.api.chat import router as chat_router
from app.api.location import router as location_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.reports import router as reports_router
from app.api.startup import router as startup_router
from app.api.uploads import router as uploads_router
from app.api.visualization import router as visualization_router
from app.api.payments import router as payments_router
from app.api.ai_routes import router as ai_router
from app.api.knowledge import router as knowledge_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup database
    async with engine.begin() as conn:
        # Note: In production you would use Alembic migrations instead of create_all
        # await conn.run_sync(Base.metadata.create_all) # Disabled for Alembic migrations
        pass
    yield
    await engine.dispose()

from fastapi.middleware.gzip import GZipMiddleware

from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Backend API for AI Startup Builder",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "System", "description": "Core system operations and health checks"}
    ],
    lifespan=lifespan
)

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core APIs
app.include_router(health_router, prefix=f"{settings.API_V1_STR}", tags=["System"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(projects_router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])

# AI & Specialized APIs
app.include_router(chat_router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])
app.include_router(location_router, prefix=f"{settings.API_V1_STR}/location", tags=["Location Intelligence"])
app.include_router(analytics_router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
app.include_router(notifications_router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])
app.include_router(reports_router, prefix=f"{settings.API_V1_STR}/reports", tags=["Reports"])
app.include_router(startup_router, prefix=f"{settings.API_V1_STR}/startup", tags=["Startup Generation"])
app.include_router(uploads_router, prefix=f"{settings.API_V1_STR}/uploads", tags=["Uploads"])
app.include_router(visualization_router, prefix=f"{settings.API_V1_STR}/visualization", tags=["Visualization"])
app.include_router(payments_router, prefix=f"{settings.API_V1_STR}/payments", tags=["Payments"])
app.include_router(ai_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Agents"])
app.include_router(knowledge_router, prefix=f"{settings.API_V1_STR}/knowledge", tags=["Knowledge Engine (RAG)"])

@app.get("/")
async def root():
    return {
        "message": f"{settings.PROJECT_NAME} Backend Running",
        "status": "success",
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)