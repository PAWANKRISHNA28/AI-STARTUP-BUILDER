from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import logging

from database import get_db
from models import User, VisualizationProject, FavoriteDesign
from schemas import (
    VisualizationProjectCreate,
    VisualizationResponse,
    FavoriteDesignCreate
)
from services.visualization_service import VisualizationService
from security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Visualization"])

@router.post("/create", response_model=VisualizationResponse)
async def create_visualization(
    data: VisualizationProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        project = await VisualizationService.create_visualization_project(db, data)
        full_data = await VisualizationService.get_project_full(db, project.id)
        return full_data
    except Exception as e:
        logger.error(f"Error creating visualization: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{project_id}")
async def get_visualization_history(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    projects = db.query(VisualizationProject).filter(VisualizationProject.project_id == project_id).all()
    history = []
    for proj in projects:
        full_data = await VisualizationService.get_project_full(db, proj.id)
        if full_data:
            history.append(full_data)
    return history

@router.post("/save")
async def save_favorite(
    data: FavoriteDesignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await VisualizationService.toggle_favorite(db, current_user.id, data.visualization_image_id, data.notes)
    return result

@router.get("/favorites")
async def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorites = db.query(FavoriteDesign).filter(FavoriteDesign.user_id == current_user.id).all()
    return favorites
