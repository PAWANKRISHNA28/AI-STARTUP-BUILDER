
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin

class Competitor(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'competitors'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    name = Column(String, nullable=False)
    website = Column(String, nullable=True)
    strengths = Column(Text, nullable=True)
    weaknesses = Column(Text, nullable=True)
    
    project = relationship("Project", back_populates="competitors")

class MarketResearch(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'market_research'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    query = Column(String, nullable=False)
    insights = Column(JSON, nullable=False)
    
    project = relationship("Project", back_populates="market_research")

class LocationAnalysis(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'location_analysis'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    location_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    demographics = Column(JSON, nullable=True)
    
    project = relationship("Project", back_populates="location_analysis")

class VisualizationHistory(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'visualization_history'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    chart_type = Column(String, nullable=False)
    config = Column(JSON, nullable=False)
    
    project = relationship("Project", back_populates="visualization_history")
