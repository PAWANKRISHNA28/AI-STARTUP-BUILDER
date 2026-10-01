from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from security import get_current_user
from models import User, Location, SavedLocation, Favorite
from schemas import (
    LocationCreate, LocationFullOut, LocationSearchReq, 
    LocationCompareReq, HeatmapReq, ROICalculationReq, LocationSearchResult
)
from services.location_engine import ReportService

router = APIRouter()

@router.post("/search", response_model=List[LocationSearchResult])
async def search_location(
    request: LocationSearchReq,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Search for a location using Google Places/Geocoding logic.
    """
    # MOCK IMPLEMENTATION
    return [
        LocationSearchResult(
            place_id="place_123",
            address=request.query,
            lat=37.7749,
            lng=-122.4194,
            name="Mocked Place"
        )
    ]

@router.post("/analyze", response_model=LocationFullOut)
async def analyze_location(
    request: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyzes a location by geocoding the address, fetching competitors,
    analyzing traffic, and generating an AI recommendation report.
    """
    try:
        report_service = ReportService(db)
        location = await report_service.generate_full_report(request.address)
        return location
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
async def compare_locations(
    request: LocationCompareReq,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Compare multiple locations by their IDs.
    """
    locations = db.query(Location).filter(Location.id.in_(request.location_ids)).all()
    if len(locations) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 valid location IDs")
    
    # MOCK COMPARE
    return {
        "winner_id": locations[0].id,
        "reasoning": "Higher foot traffic and lower competition",
        "comparison_matrix": { loc.id: {"score": 8.5} for loc in locations }
    }

@router.post("/report")
async def generate_report(
    location_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Generates a final downloadable report summary.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return {
        "status": "success",
        "download_url": f"/static/exports/report_{location_id}.pdf"
    }

@router.post("/roi")
async def calculate_custom_roi(
    request: ROICalculationReq,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Recalculates ROI based on custom user inputs.
    """
    net_profit = request.estimated_revenue - request.estimated_rent
    months_to_breakeven = request.setup_costs / net_profit if net_profit > 0 else 999
    roi = (net_profit * 12 / request.setup_costs) * 100 if request.setup_costs > 0 else 0

    return {
        "net_monthly_profit": net_profit,
        "break_even_months": round(months_to_breakeven, 1),
        "roi_percentage": round(roi, 1)
    }

@router.post("/heatmap")
async def generate_heatmap(
    request: HeatmapReq,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns data points for rendering a heatmap on the frontend.
    """
    location = db.query(Location).filter(Location.id == request.location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # MOCK DATA
    return {
        "metric": request.metric,
        "points": [
            {"lat": location.lat + 0.001, "lng": location.lng + 0.001, "weight": 0.8},
            {"lat": location.lat - 0.002, "lng": location.lng - 0.001, "weight": 0.5}
        ]
    }

@router.get("/history", response_model=List[LocationFullOut])
def get_location_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch all past locations analyzed by the user.
    """
    # Assuming user relationship isn't directly on Location, using favorites/saved logic.
    # For now, returning all locations globally as a mock.
    return db.query(Location).order_by(Location.created_at.desc()).limit(10).all()

@router.get("/favorites", response_model=List[LocationFullOut])
def get_favorite_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch favorite locations.
    """
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.item_type == "location").all()
    fav_ids = [f.item_id for f in favs]
    return db.query(Location).filter(Location.id.in_(fav_ids)).all()

@router.get("/{location_id}", response_model=LocationFullOut)
def get_location(
    location_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves a previously analyzed location and its relational data.
    """
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

