import redis.asyncio as redis
from typing import Optional
from app.core.config import settings

class RedisClient:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def connect(self):
        if not self.redis:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )

    async def disconnect(self):
        if self.redis:
            await self.redis.close()

    def get_client(self) -> redis.Redis:
        if not self.redis:
            raise RuntimeError("Redis client is not initialized")
        return self.redis

redis_client = RedisClient()

async def get_redis():
    return redis_client.get_client()
