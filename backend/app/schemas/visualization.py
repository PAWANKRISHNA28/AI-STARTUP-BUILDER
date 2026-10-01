from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class VisualizationRequest(BaseModel):
    project_id: str
    business_type: Optional[str] = None
    business_name: Optional[str] = None
    brand_style: Optional[str] = None
    budget: Optional[str] = None
    target_audience: Optional[str] = None
    store_size: Optional[str] = None
    preferred_theme: Optional[str] = None

class VisualizationProjectResponse(BaseModel):
    id: str
    project_id: str
    business_type: Optional[str]
    brand_style: Optional[str]
    preferred_theme: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class DesignReportResponse(BaseModel):
    id: str
    design_summary: Optional[str]
    business_theme: Optional[str]
    architecture_style: Optional[str]
    color_palette: Optional[List[str]]
    material_suggestions: Optional[List[str]]
    furniture_suggestions: Optional[List[str]]
    lighting_suggestions: Optional[List[str]]
    branding_suggestions: Optional[List[str]]
    
    class Config:
        from_attributes = True

class BrandStyleResponse(BaseModel):
    id: str
    store_logo_placement: Optional[str]
    sign_board: Optional[str]
    menu_board: Optional[str]
    reception_branding: Optional[str]
    employee_uniform_colors: Optional[List[str]]
    packaging_style: Optional[str]
    
    class Config:
        from_attributes = True

class VisualizationImageResponse(BaseModel):
    id: str
    concept_name: str
    view_type: str
    image_url: str  # This will hold the prompt initially
    style: Optional[str]
    
    class Config:
        from_attributes = True
