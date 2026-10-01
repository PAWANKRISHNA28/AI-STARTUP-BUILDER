from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LocationSearchRequest(BaseModel):
    query: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class LocationSearchResponse(BaseModel):
    id: str
    address: str
    lat: float
    lng: float
    city: Optional[str] = None
    state: Optional[str] = None

class LocationAnalysisRequest(BaseModel):
    location_id: str
    business_type: str
