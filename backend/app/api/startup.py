from fastapi import APIRouter, BackgroundTasks
from typing import Dict, Any
from pydantic import BaseModel
from datetime import datetime
import asyncio
import logging
from app.ai.orchestrator import AIOrchestrator

router = APIRouter()
logger = logging.getLogger(__name__)

class AnalyzeRequest(BaseModel):
    project_id: str
    startup_idea: str = ""

GENERATION_STATUS = {}
GENERATED_BLUEPRINTS = {}

async def run_generation_task(project_id: str, startup_idea: str):
    logger.info("STARTUP IDEA RECEIVED:\n%s", startup_idea)
    GENERATION_STATUS[project_id] = "running"
    try:
        orchestrator = AIOrchestrator(project_id)
        blueprint = await orchestrator.run_pipeline(startup_idea)
        
        GENERATED_BLUEPRINTS[project_id] = {
            "id": f"bp_{project_id}",
            "project_id": project_id,
            "data": {
                "meta": {
                    "title": "Generated Startup",
                    "idea": startup_idea,
                    "industry": "Tech",
                    "country": "US",
                    "budget": "1000",
                    "business_type": "B2B",
                    "target_users": "Everyone",
                    "tech_preference": "AI",
                    "generated_at": datetime.utcnow().isoformat()
                },
                "idea_analyzer": blueprint.research.model_dump() if blueprint.research else {},
                "market_research": blueprint.market.model_dump() if getattr(blueprint, 'market', None) else {},
                "competitor": blueprint.competitor.model_dump() if getattr(blueprint, 'competitor', None) else {},
                "business_model": blueprint.branding.model_dump() if getattr(blueprint, 'branding', None) else {},
                "revenue": blueprint.finance.model_dump() if getattr(blueprint, 'finance', None) else {},
                "pricing": blueprint.pricing.model_dump() if getattr(blueprint, 'pricing', None) else {},
                "customer_persona": blueprint.market.model_dump() if getattr(blueprint, 'market', None) else {},
                "feature_planning": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "ui_designer": blueprint.ui_ux.model_dump() if getattr(blueprint, 'ui_ux', None) else {},
                "ux_research": blueprint.ui_ux.model_dump() if getattr(blueprint, 'ui_ux', None) else {},
                "database_designer": blueprint.database.model_dump() if getattr(blueprint, 'database', None) else {},
                "api_designer": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "backend_architect": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "frontend_architect": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "security": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "deployment": blueprint.technology.model_dump() if getattr(blueprint, 'technology', None) else {},
                "finance": blueprint.finance.model_dump() if getattr(blueprint, 'finance', None) else {},
                "marketing": blueprint.marketing.model_dump() if getattr(blueprint, 'marketing', None) else {},
                "seo": blueprint.marketing.model_dump() if getattr(blueprint, 'marketing', None) else {},
                "risk_analysis": blueprint.competitor.model_dump() if getattr(blueprint, 'competitor', None) else {},
                "roadmap": blueprint.investor.model_dump() if getattr(blueprint, 'investor', None) else {},
                "investor_pitch": blueprint.investor.model_dump() if getattr(blueprint, 'investor', None) else {},
            },
            "created_at": datetime.utcnow().isoformat()
        }
        GENERATION_STATUS[project_id] = "completed"
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        GENERATION_STATUS[project_id] = "failed"

@router.post("/analyze")
async def analyze_startup(req: AnalyzeRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    from app.core.config import settings
    from fastapi import HTTPException
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key":
        raise HTTPException(
            status_code=500, 
            detail="Gemini AI service is not configured. Please configure the Gemini API key."
        )
        
    background_tasks.add_task(run_generation_task, req.project_id, req.startup_idea)
    return {"status": "success", "message": "Analysis started"}

@router.get("/status/{project_id}")
async def get_generation_status(project_id: str) -> Dict[str, Any]:
    status = GENERATION_STATUS.get(project_id, "completed")
    return {
        "project_id": project_id,
        "status": status,
        "progress": 100 if status == "completed" else 50,
        "current_agent": "Done",
        "logs": []
    }

@router.get("/blueprint/{project_id}")
async def get_blueprint(project_id: str) -> Dict[str, Any]:
    blueprint = GENERATED_BLUEPRINTS.get(project_id)
    if blueprint:
        return blueprint
        
    # Mocking blueprint response
    return {
        "id": "mock_blueprint",
        "project_id": project_id,
        "data": {
            "meta": {
                "title": "Mock Startup",
                "idea": "A great idea",
                "industry": "Tech",
                "country": "US",
                "budget": "1000",
                "business_type": "B2B",
                "target_users": "Everyone",
                "tech_preference": "AI",
                "generated_at": datetime.utcnow().isoformat()
            }
        },
        "created_at": datetime.utcnow().isoformat()
    }
