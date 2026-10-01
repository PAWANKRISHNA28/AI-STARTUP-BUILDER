
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
