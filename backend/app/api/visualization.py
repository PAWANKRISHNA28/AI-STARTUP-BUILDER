from fastapi import APIRouter
from typing import Dict, Any, List
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

class VizCreateRequest(BaseModel):
    project_id: str
    business_type: str = ""
    business_name: str = ""
    brand_style: str = ""
    budget: str = ""
    target_audience: str = ""
    store_size: str = ""
    number_of_floors: int = 1
    preferred_theme: str = ""
    furniture_style: str = ""
    lighting_style: str = ""
    outdoor_seating: bool = False
    parking_requirement: bool = False
    garden: bool = False
    drive_through: bool = False
    accessibility_features: bool = True

@router.post("/create")
async def create_visualization(req: VizCreateRequest) -> Dict[str, Any]:
    pid = str(uuid.uuid4())
    return {
        "project": {
            "id": pid,
            "project_id": req.project_id,
            "business_name": req.business_name or "Generated Business",
            "business_type": req.business_type,
            "brand_style": req.brand_style,
            "budget": req.budget,
            "created_at": datetime.utcnow().isoformat()
        },
        "images": [
            {
                "id": str(uuid.uuid4()),
                "visualization_project_id": pid,
                "concept_name": "Concept A",
                "view_type": "Exterior",
                "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop",
                "style": req.brand_style or "Modern",
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "visualization_project_id": pid,
                "concept_name": "Concept A",
                "view_type": "Interior",
                "image_url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop",
                "style": req.brand_style or "Modern",
                "created_at": datetime.utcnow().isoformat()
            }
        ],
        "report": {
            "id": str(uuid.uuid4()),
            "visualization_project_id": pid,
            "design_summary": f"This is a {req.brand_style} design generated for {req.business_name}.",
            "created_at": datetime.utcnow().isoformat()
        },
        "brand_style": {
            "id": str(uuid.uuid4()),
            "visualization_project_id": pid,
            "store_logo_placement": "Front Facade",
            "created_at": datetime.utcnow().isoformat()
        }
    }

@router.post("/3d")
async def create_3d_visualization(req: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(uuid.uuid4()),
        "model_url": "https://example.com/model.glb",
        "status": "success"
    }

@router.get("/history/{project_id}")
async def get_visualization_history(project_id: str) -> List[Dict[str, Any]]:
    return []

class SaveVizRequest(BaseModel):
    visualization_image_id: str
    notes: str = None

@router.post("/save")
async def save_favorite_visualization(req: SaveVizRequest) -> Dict[str, Any]:
    return {"status": "success", "id": req.visualization_image_id}

@router.get("/favorites")
async def get_favorite_visualizations() -> List[Dict[str, Any]]:
    return []
