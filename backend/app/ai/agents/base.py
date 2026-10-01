import json
import hashlib
from typing import Type, TypeVar, Any
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.core.config import settings
from app.database.redis import get_redis
import logging

logger = logging.getLogger(__name__)
T = TypeVar("T", bound=BaseModel)

class BaseAgent:
    def __init__(self, name: str, model_name: str = "gemini-2.5-flash"):
        self.name = name
        self.model_name = model_name
        
        # Initialize Gemini Client
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            logger.warning("GEMINI_API_KEY not set. Agents will fail on execute.")
            self.client = None

    def _hash_prompt(self, system_instruction: str, prompt: str) -> str:
        combined = f"{self.name}:{system_instruction}:{prompt}"
        return hashlib.sha256(combined.encode()).hexdigest()

    async def execute(self, system_instruction: str, prompt: str, response_schema: Type[T]) -> T:
        if not self.client:
            raise RuntimeError("Gemini Client not initialized")
            
        redis = await get_redis()
        cache_key = f"agent_cache:{self._hash_prompt(system_instruction, prompt)}"
        
        # Check cache
        try:
            cached = await redis.get(cache_key)
            if cached:
                logger.info(f"[{self.name}] Cache HIT")
                return response_schema.model_validate_json(cached)
        except Exception as e:
            logger.warning(f"Redis cache check failed: {e}")
            
        logger.info(f"[{self.name}] Executing Gemini Call")
        # Execute LLM Call
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=response_schema,
                temperature=0.7
            )
        )
        
        result_str = response.text
        
        # Cache for 24 hours
        try:
            await redis.setex(cache_key, 86400, result_str)
        except Exception as e:
            logger.warning(f"Redis cache set failed: {e}")
            
        return response_schema.model_validate_json(result_str)
