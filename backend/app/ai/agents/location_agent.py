from typing import Dict, Any, List
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
from app.services.maps_service import MapsService
from app.core.database import AsyncSessionLocal
from app.models.location import Location, LocationScore, Competitor
from sqlalchemy import select
from app.agents.llm_factory import get_llm

class LocationScoreOutput(BaseModel):
    competition_score: float = Field(description="Score out of 100 representing market saturation (lower is better for new entrants)")
    foot_traffic_score: float = Field(description="Score out of 100 estimating foot traffic based on nearby anchor businesses")
    accessibility_score: float = Field(description="Score out of 100 based on general accessibility")
    demographics_score: float = Field(description="Score out of 100 based on assumed demographics")
    overall_score: float = Field(description="Weighted overall score for this location out of 100")
    recommendation: str = Field(description="A brief paragraph summarizing the viability of the location")

class LocationAgent:
    def __init__(self):
        self.llm = get_llm(
            temperature=0.2, 
            require_structured_output=True, 
            structured_schema=LocationScoreOutput
        )

    async def analyze_location(self, location_id: str, business_type: str):
        print(f"[LocationAgent] Starting analysis for location {location_id} with type {business_type}")
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Location).where(Location.id == location_id))
            location = result.scalars().first()
            if not location:
                print(f"[LocationAgent] Location {location_id} not found.")
                return

            # 1. Gather nearby competitors using Google Places API
            places = await MapsService.get_nearby_places(
                lat=location.lat, 
                lng=location.lng, 
                keyword=business_type, 
                radius=2000, 
                db=db
            )
            
            # Save competitors to DB
            for p in places:
                comp = Competitor(
                    location_id=location_id,
                    name=p.get("name"),
                    rating=p.get("rating"),
                    place_id=p.get("place_id")
                )
                db.add(comp)

            # 2. Score the location using the LLM
            if not self.llm:
                print(f"[LocationAgent] No OPENAI_API_KEY. Using mock scoring.")
                score_data = LocationScoreOutput(
                    competition_score=65.0,
                    foot_traffic_score=80.0,
                    accessibility_score=90.0,
                    demographics_score=75.0,
                    overall_score=78.5,
                    recommendation="This is a strong mock recommendation due to high estimated foot traffic."
                )
            else:
                messages = [
                    SystemMessage(content="You are an expert Commercial Real Estate Location Analyst. Score this location from 0-100 based on the provided competitor data."),
                    HumanMessage(content=f"Business Type: {business_type}\nLocation: {location.address}\nCompetitors Nearby ({len(places)}): {places}")
                ]
                try:
                    score_data = await self.llm.ainvoke(messages)
                except Exception as e:
                    print(f"[LocationAgent] LLM Error: {e}")
                    return

            # Save Score to DB
            new_score = LocationScore(
                location_id=location_id,
                competition_score=score_data.competition_score,
                foot_traffic_score=score_data.foot_traffic_score,
                accessibility_score=score_data.accessibility_score,
                demographics_score=score_data.demographics_score,
                overall_score=score_data.overall_score
            )
            db.add(new_score)
            
            await db.commit()
            print(f"[LocationAgent] Analysis complete for location {location_id}")

