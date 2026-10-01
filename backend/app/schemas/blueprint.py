from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ResearchResult(BaseModel):
    summary: str
    key_findings: List[str]
    industry_overview: str

class MarketResult(BaseModel):
    tam: str = Field(description="Total Addressable Market")
    sam: str = Field(description="Serviceable Available Market")
    som: str = Field(description="Serviceable Obtainable Market")
    target_demographics: List[str]
    growth_trends: List[str]

class FinanceResult(BaseModel):
    year_1_revenue: str
    year_3_revenue: str
    burn_rate: str
    capital_required: str
    key_expenses: List[str]

class CompetitorResult(BaseModel):
    direct_competitors: List[str]
    indirect_competitors: List[str]
    competitive_advantage: str
    weaknesses_to_exploit: List[str]

class BrandingResult(BaseModel):
    brand_voice: str
    core_values: List[str]
    visual_identity_suggestions: str
    slogan: str

class PricingResult(BaseModel):
    pricing_model: str
    tiers: List[Dict[str, Any]]
    cac_limit: str

class MarketingResult(BaseModel):
    go_to_market_strategy: str
    primary_channels: List[str]
    growth_loops: List[str]

class InvestorResult(BaseModel):
    pitch_narrative: str
    vc_concerns: List[str]
    roi_potential: str

class TechnologyResult(BaseModel):
    recommended_stack: str
    cloud_architecture: str
    scaling_strategy: str

class UIUXResult(BaseModel):
    user_journeys: List[str]
    core_features: List[str]
    design_system_notes: str

class DatabaseResult(BaseModel):
    core_entities: List[str]
    relationships_summary: str
    database_type: str

class StartupBlueprint(BaseModel):
    project_id: str
    research: Optional[ResearchResult] = None
    market: Optional[MarketResult] = None
    finance: Optional[FinanceResult] = None
    competitor: Optional[CompetitorResult] = None
    branding: Optional[BrandingResult] = None
    pricing: Optional[PricingResult] = None
    marketing: Optional[MarketingResult] = None
    investor: Optional[InvestorResult] = None
    technology: Optional[TechnologyResult] = None
    ui_ux: Optional[UIUXResult] = None
    database: Optional[DatabaseResult] = None
