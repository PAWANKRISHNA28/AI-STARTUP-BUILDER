from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.auth_router import router as auth_router
from app.api.projects import router as projects_router
from app.api.chat import router as chat_router
from app.api.location import router as location_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.startup import router as startup_router
from app.api.visualization import router as visualization_router
from app.api.ai_routes import router as ai_router

app = FastAPI(
    title="AI Startup Builder API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

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

app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(projects_router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(chat_router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(location_router, prefix="/api/v1/location", tags=["Location"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(notifications_router, prefix="/api/v1/projects/notifications", tags=["Notifications"])
app.include_router(startup_router, prefix="/api/v1/startup", tags=["Startup"])
app.include_router(visualization_router, prefix="/api/v1/visualization", tags=["Visualization"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI"])

@app.get("/")
async def root():
    return {
        "message": "AI Startup Builder Backend Running",
        "status": "success"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
