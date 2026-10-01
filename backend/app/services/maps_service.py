import httpx
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.models.location import MapsCache

class MapsService:
    BASE_URL_GEOCODE = "https://maps.googleapis.com/maps/api/geocode/json"
    BASE_URL_PLACES = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    @classmethod
    async def _get_cached_query(cls, db: AsyncSession, query_key: str) -> Optional[Dict[Any, Any]]:
        result = await db.execute(
            select(MapsCache)
            .where(MapsCache.query == query_key)
            .where(MapsCache.expires_at > datetime.utcnow())
        )
        cache_entry = result.scalars().first()
        if cache_entry:
            return cache_entry.response_data
        return None

    @classmethod
    async def _set_cached_query(cls, db: AsyncSession, query_key: str, data: Dict[Any, Any], expires_days: int = 30):
        # Optional: delete old cache entry if exists
        result = await db.execute(select(MapsCache).where(MapsCache.query == query_key))
        cache_entry = result.scalars().first()
        
        expires = datetime.utcnow() + timedelta(days=expires_days)
        
        if cache_entry:
            cache_entry.response_data = data
            cache_entry.expires_at = expires
        else:
            cache_entry = MapsCache(
                query=query_key,
                response_data=data,
                expires_at=expires
            )
            db.add(cache_entry)
            
        await db.commit()

    @classmethod
    async def geocode_address(cls, address: str, db: AsyncSession) -> Dict[str, Any]:
        """Convert a string address into structured location data (lat/lng, city, state, etc)."""
        cache_key = f"geocode:{address.lower().strip()}"
        cached = await cls._get_cached_query(db, cache_key)
        if cached:
            return cached

        if not settings.GOOGLE_MAPS_API_KEY:
            # Return Mock Data
            mock_data = {
                "lat": 37.7749,
                "lng": -122.4194,
                "city": "San Francisco",
                "state": "CA",
                "country": "USA",
                "formatted_address": f"{address} (Mocked)"
            }
            await cls._set_cached_query(db, cache_key, mock_data)
            return mock_data

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                cls.BASE_URL_GEOCODE,
                params={"address": address, "key": settings.GOOGLE_MAPS_API_KEY}
            )
            data = resp.json()
            
            if data.get("status") == "OK" and len(data.get("results", [])) > 0:
                result = data["results"][0]
                geometry = result["geometry"]["location"]
                
                # Extract city, state, country from address_components
                city, state, country = None, None, None
                for component in result.get("address_components", []):
                    types = component.get("types", [])
                    if "locality" in types:
                        city = component["long_name"]
                    if "administrative_area_level_1" in types:
                        state = component["short_name"]
                    if "country" in types:
                        country = component["short_name"]

                parsed_data = {
                    "lat": geometry["lat"],
                    "lng": geometry["lng"],
                    "city": city,
                    "state": state,
                    "country": country,
                    "formatted_address": result.get("formatted_address")
                }
                await cls._set_cached_query(db, cache_key, parsed_data)
                return parsed_data
            else:
                return {}

    @classmethod
    async def get_nearby_places(cls, lat: float, lng: float, keyword: str, radius: int, db: AsyncSession) -> List[Dict[str, Any]]:
        """Find nearby places based on a keyword and radius (in meters)."""
        cache_key = f"places:{lat},{lng}:{keyword}:{radius}"
        cached = await cls._get_cached_query(db, cache_key)
        if cached:
            return cached.get("results", [])

        if not settings.GOOGLE_MAPS_API_KEY:
            # Return Mock Data
            mock_results = [
                {"name": f"Mock Competitor 1 ({keyword})", "vicinity": "123 Main St", "rating": 4.5},
                {"name": f"Mock Competitor 2 ({keyword})", "vicinity": "456 Oak St", "rating": 3.8}
            ]
            await cls._set_cached_query(db, cache_key, {"results": mock_results})
            return mock_results

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                cls.BASE_URL_PLACES,
                params={
                    "location": f"{lat},{lng}",
                    "radius": radius,
                    "keyword": keyword,
                    "key": settings.GOOGLE_MAPS_API_KEY
                }
            )
            data = resp.json()
            
            if data.get("status") in ["OK", "ZERO_RESULTS"]:
                results = []
                for place in data.get("results", [])[:10]: # Limit to top 10 to save processing
                    results.append({
                        "name": place.get("name"),
                        "vicinity": place.get("vicinity"),
                        "rating": place.get("rating", 0),
                        "place_id": place.get("place_id"),
                        "lat": place.get("geometry", {}).get("location", {}).get("lat"),
                        "lng": place.get("geometry", {}).get("location", {}).get("lng"),
                    })
                await cls._set_cached_query(db, cache_key, {"results": results})
                return results
            else:
                return []
