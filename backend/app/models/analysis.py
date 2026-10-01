from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.user import generate_uuid

class StartupAnalysis(Base):
    __tablename__ = "startup_analysis"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), unique=True, nullable=False)
    executive_summary = Column(Text, nullable=True)
    problem_statement = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    value_proposition = Column(Text, nullable=True)
    business_model_canvas = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MarketResearch(Base):
    __tablename__ = "market_research"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    tam_sam_som = Column(JSON, nullable=True)
    target_demographics = Column(JSON, nullable=True)
    market_trends = Column(JSON, nullable=True)
    swot_analysis = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CompetitorAnalysis(Base):
    __tablename__ = "competitor_analysis"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    direct_competitors = Column(JSON, nullable=True)
    indirect_competitors = Column(JSON, nullable=True)
    competitive_advantage = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class FinancialAnalysis(Base):
    __tablename__ = "financial_analysis"
    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    revenue_streams = Column(JSON, nullable=True)
    cost_structure = Column(JSON, nullable=True)
    pricing_strategy = Column(JSON, nullable=True)
    break_even_point = Column(String, nullable=True)
    funding_requirements = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
