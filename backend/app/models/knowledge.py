from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from datetime import datetime
from app.core.database import Base
from app.models.user import generate_uuid

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    category = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    author = Column(String, nullable=True)
    source = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("knowledge_documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    text = Column(String, nullable=False)
    chroma_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SearchLog(Base):
    __tablename__ = "search_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    query = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    results_found = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
