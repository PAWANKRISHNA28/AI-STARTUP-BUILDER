import os

# --- user.py ---
user_code = """
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from datetime import datetime

class Role(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'roles'
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(String, nullable=True)

class Permission(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'permissions'
    name = Column(String, unique=True, nullable=False, index=True)

class UserRole(Base):
    __tablename__ = 'user_roles'
    user_id = Column(String, ForeignKey('users.id'), primary_key=True, index=True)
    role_id = Column(String, ForeignKey('roles.id'), primary_key=True, index=True)

class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'users'
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
"""

# --- project.py ---
project_code = """
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from datetime import datetime

class Project(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'projects'
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft", index=True)
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
"""

# --- intelligence.py ---
intelligence_code = """
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin

class AIConversation(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'ai_conversations'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    title = Column(String, nullable=True)
    
    project = relationship("Project", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'ai_messages'
    conversation_id = Column(String, ForeignKey('ai_conversations.id'), nullable=False, index=True)
    role = Column(String, nullable=False) # user, assistant, system
    content = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0)
    
    conversation = relationship("AIConversation", back_populates="messages")

class KnowledgeDocument(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = 'knowledge_documents'
    project_id = Column(String, ForeignKey('projects.id'), nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    s3_url = Column(String, nullable=True)
    
    project = relationship("Project", back_populates="knowledge_documents")
    chunks = relationship("KnowledgeChunk", back_populates="document", cascade="all, delete-orphan")

class KnowledgeChunk(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'knowledge_chunks'
    document_id = Column(String, ForeignKey('knowledge_documents.id'), nullable=False, index=True)
    chroma_id = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)
    
    document = relationship("KnowledgeDocument", back_populates="chunks")
"""

# --- research.py ---
research_code = """
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
"""

# --- telemetry.py ---
telemetry_code = """
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSON, Text, Float
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin

class ActivityLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'activity_logs'
    user_id = Column(String, ForeignKey('users.id'), nullable=True, index=True)
    action = Column(String, nullable=False, index=True)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    user = relationship("User", back_populates="activity_logs")

class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'notifications'
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, index=True)
    
    user = relationship("User", back_populates="notifications")

class Analytics(Base, UUIDMixin, TimestampMixin):
    __tablename__ = 'analytics'
    metric_name = Column(String, nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    dimension = Column(String, nullable=True)
"""

# Write all to disk
import os

with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\user.py', 'w') as f:
    f.write(user_code)
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\project.py', 'w') as f:
    f.write(project_code)
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\intelligence.py', 'w') as f:
    f.write(intelligence_code)
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\research.py', 'w') as f:
    f.write(research_code)
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\telemetry.py', 'w') as f:
    f.write(telemetry_code)

init_code = """
from .mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from .user import User, Role, Permission, UserRole
from .project import Project, SharedProject, StartupReport
from .intelligence import AIConversation, AIMessage, KnowledgeDocument, KnowledgeChunk
from .research import Competitor, MarketResearch, LocationAnalysis, VisualizationHistory
from .telemetry import ActivityLog, Notification, Analytics
"""
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\models\__init__.py', 'w') as f:
    f.write(init_code)
