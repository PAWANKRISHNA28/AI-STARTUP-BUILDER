from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base
from app.models.user import generate_uuid

class Location(Base):
    __tablename__ = "locations"
    id = Column(String, primary_key=True, default=generate_uuid)
    address = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    scores = relationship("LocationScore", back_populates="location", cascade="all, delete-orphan")
    competitors = relationship("Competitor", back_populates="location", cascade="all, delete-orphan")
    analysis = relationship("BusinessAnalysis", back_populates="location", cascade="all, delete-orphan")
    heatmaps = relationship("Heatmap", back_populates="location", cascade="all, delete-orphan")
    traffic = relationship("Traffic", back_populates="location", cascade="all, delete-orphan")
    reports = relationship("LocationReport", back_populates="location", cascade="all, delete-orphan")
    roi_analysis = relationship("ROIAnalysis", back_populates="location", cascade="all, delete-orphan")

class LocationScore(Base):
    __tablename__ = "location_scores"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    foot_traffic_score = Column(Float, default=0.0)
    demographics_score = Column(Float, default=0.0)
    competition_score = Column(Float, default=0.0)
    accessibility_score = Column(Float, default=0.0)
    overall_score = Column(Float, default=0.0)

    location = relationship("Location", back_populates="scores")

class Competitor(Base):
    __tablename__ = "competitors"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    name = Column(String, nullable=False)
    distance_meters = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    place_id = Column(String, nullable=True)

    location = relationship("Location", back_populates="competitors")

class BusinessAnalysis(Base):
    __tablename__ = "business_analysis"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    advantages = Column(JSON, nullable=True)
    challenges = Column(JSON, nullable=True)
    recommendation = Column(Text, nullable=True)

    location = relationship("Location", back_populates="analysis")

class MapsCache(Base):
    __tablename__ = "maps_cache"
    id = Column(String, primary_key=True, default=generate_uuid)
    query = Column(String, index=True)
    response_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

class Heatmap(Base):
    __tablename__ = "heatmaps"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    data_points = Column(JSON, nullable=False)
    type = Column(String, nullable=False)

    location = relationship("Location", back_populates="heatmaps")

class Traffic(Base):
    __tablename__ = "traffic"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    average_daily_vehicles = Column(Integer, nullable=True)
    peak_hours = Column(JSON, nullable=True)
    pedestrian_activity = Column(String, nullable=True)

    location = relationship("Location", back_populates="traffic")

class SavedLocation(Base):
    __tablename__ = "saved_locations"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    notes = Column(Text, nullable=True)

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    item_type = Column(String, nullable=False)
    item_id = Column(String, nullable=False)

class LocationReport(Base):
    __tablename__ = "reports"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    content = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    location = relationship("Location", back_populates="reports")

class ROIAnalysis(Base):
    __tablename__ = "roi_analysis"
    id = Column(String, primary_key=True, default=generate_uuid)
    location_id = Column(String, ForeignKey("locations.id"))
    estimated_rent = Column(Float, nullable=True)
    estimated_revenue = Column(Float, nullable=True)
    break_even_months = Column(Integer, nullable=True)
    roi_percentage = Column(Float, nullable=True)

    location = relationship("Location", back_populates="roi_analysis")
