from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from datetime import datetime

class Project(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'projects'
    
    # Required base fields
    title = Column(String, nullable=False, index=True)
    idea_description = Column(Text, nullable=False)
    
    # Optional metadata
    industry = Column(String, nullable=True)
    country = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    business_type = Column(String, nullable=True)
    target_users = Column(String, nullable=True)
    tech_preference = Column(String, nullable=True)
    
    # Status & Progress
    status = Column(String, default="Idea Phase", index=True)
    progress = Column(Integer, default=0)
    current_agent = Column(String, default="None")
    
    # UI state
    favorite = Column(Boolean, default=False)
    pinned = Column(Boolean, default=False)
    last_opened = Column(DateTime, default=datetime.utcnow)
    last_active_tab = Column(String, default="overview")
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    owner_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    owner = relationship("User", back_populates="projects")
    
    startup_reports = relationship("StartupReport", back_populates="project", cascade="all, delete-orphan")
    ai_conversations = relationship("AIConversation", back_populates="project", cascade="all, delete-orphan")
    competitors = relationship("Competitor", back_populates="project", cascade="all, delete-orphan")
    market_research = relationship("MarketResearch", back_populates="project", cascade="all, delete-orphan")
    location_analysis = relationship("LocationAnalysis", back_populates="project", cascade="all, delete-orphan")
    shared_projects = relationship("SharedProject", back_populates="project", cascade="all, delete-orphan")
    visualization_history = relationship("VisualizationHistory", back_populates="project", cascade="all, delete-orphan")
    knowledge_documents = relationship("KnowledgeDocument", back_populates="project", cascade="all, delete-orphan")
    
class SharedProject(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'shared_projects'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    user_email = Column(String, nullable=False, index=True)
    role = Column(String, default="viewer") # viewer, editor
    
    project = relationship("Project", back_populates="shared_projects")

class StartupReport(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'startup_reports'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    report_data = Column(JSON, nullable=False)
    version = Column(Integer, default=1)
    
    project = relationship("Project", back_populates="startup_reports")
