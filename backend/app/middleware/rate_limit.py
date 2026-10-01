
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.database.redis import get_redis

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        return response
