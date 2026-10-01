import os
import json
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import Location, LocationScore, Competitor, BusinessAnalysis, MapsCache, ROIAnalysis
import httpx

class GoogleMapsService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY", "mock_key")
        self.base_url = "https://maps.googleapis.com/maps/api"

    async def _fetch(self, url: str, params: dict):
        params["key"] = self.api_key
        # In a real app we'd use httpx to fetch the data
        # async with httpx.AsyncClient() as client:
        #     resp = await client.get(url, params=params)
        #     return resp.json()
        
        # MOCK IMPLEMENTATION
        return {"status": "OK", "results": [{"geometry": {"location": {"lat": 37.7749, "lng": -122.4194}}}]}

class GeocodingService(GoogleMapsService):
    async def geocode(self, address: str):
        url = f"{self.base_url}/geocode/json"
        data = await self._fetch(url, {"address": address})
        if data.get("status") == "OK" and data["results"]:
            loc = data["results"][0]["geometry"]["location"]
            return {"lat": loc["lat"], "lng": loc["lng"], "city": "San Francisco", "state": "CA", "country": "USA"}
        return None

class PlacesService(GoogleMapsService):
    async def get_competitors(self, lat: float, lng: float, radius: int = 1500, type_filter: str = "store"):
        # MOCK COMPETITORS
        return [
            {"name": "Competitor A", "distance_meters": 500, "rating": 4.5, "place_id": "p1"},
            {"name": "Competitor B", "distance_meters": 800, "rating": 3.8, "place_id": "p2"},
            {"name": "Competitor C", "distance_meters": 1200, "rating": 4.2, "place_id": "p3"}
        ]

class TrafficService(GoogleMapsService):
    async def get_traffic_data(self, lat: float, lng: float):
        # MOCK TRAFFIC
        return {
            "average_daily_vehicles": 15000,
            "peak_hours": ["08:00", "17:00"],
            "pedestrian_activity": "high"
        }

class AIAnalysisService:
    async def analyze_location(self, address: str, competitors: list, traffic: dict):
        # MOCK AI ANALYSIS
        return {
            "advantages": ["High student population", "Office employees", "Metro connectivity", "Good foot traffic"],
            "challenges": ["Higher rental cost", "Moderate competition"],
            "recommendation": "Strong candidate if your budget supports the estimated rent."
        }

class RecommendationService:
    def calculate_roi(self, traffic: dict, competitors: list):
        # MOCK ROI MATH
        return {
            "estimated_rent": 5000.0,
            "estimated_revenue": 15000.0,
            "break_even_months": 8,
            "roi_percentage": 200.0
        }

class LocationCacheService:
    def __init__(self, db: Session):
        self.db = db

    def get_cache(self, query: str):
        cache = self.db.execute(select(MapsCache).where(MapsCache.query == query)).scalar_one_or_none()
        if cache:
            return cache.response_data
        return None

    def set_cache(self, query: str, data: dict):
        cache = MapsCache(query=query, response_data=data)
        self.db.add(cache)
        self.db.commit()

class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.geocoder = GeocodingService()
        self.places = PlacesService()
        self.traffic = TrafficService()
        self.ai = AIAnalysisService()
        self.recommendation = RecommendationService()

    async def generate_full_report(self, address: str):
        # 1. Geocode
        geo = await self.geocoder.geocode(address)
        if not geo:
            raise Exception("Address not found")
        
        # 2. Fetch Places & Traffic
        competitors = await self.places.get_competitors(geo["lat"], geo["lng"])
        traffic_data = await self.traffic.get_traffic_data(geo["lat"], geo["lng"])
        
        # 3. AI Analysis & ROI
        analysis = await self.ai.analyze_location(address, competitors, traffic_data)
        roi = self.recommendation.calculate_roi(traffic_data, competitors)

        # 4. Save to Database
        location = Location(
            address=address,
            lat=geo["lat"],
            lng=geo["lng"],
            city=geo["city"],
            state=geo["state"],
            country=geo["country"]
        )
        self.db.add(location)
        self.db.commit()
        self.db.refresh(location)

        # Save Scores
        score = LocationScore(
            location_id=location.id,
            foot_traffic_score=8.5,
            demographics_score=7.0,
            competition_score=6.0,
            accessibility_score=9.0,
            overall_score=7.6
        )
        self.db.add(score)

        # Save Competitors
        for c in competitors:
            comp = Competitor(
                location_id=location.id,
                name=c["name"],
                distance_meters=c["distance_meters"],
                rating=c["rating"],
                place_id=c["place_id"]
            )
            self.db.add(comp)

        # Save Analysis
        bus_analysis = BusinessAnalysis(
            location_id=location.id,
            advantages=analysis["advantages"],
            challenges=analysis["challenges"],
            recommendation=analysis["recommendation"]
        )
        self.db.add(bus_analysis)

        # Save ROI
        roi_analysis = ROIAnalysis(
            location_id=location.id,
            estimated_rent=roi["estimated_rent"],
            estimated_revenue=roi["estimated_revenue"],
            break_even_months=roi["break_even_months"],
            roi_percentage=roi["roi_percentage"]
        )
        self.db.add(roi_analysis)
        self.db.commit()

        # Refresh and return location
        self.db.refresh(location)
        return location
