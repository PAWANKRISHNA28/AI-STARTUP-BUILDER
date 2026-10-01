import os

base = r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\middleware'

logging_mw = """
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.utils.logger import logger

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = str(uuid.uuid4())
        start_time = time.time()
        
        logger.info(f"[{req_id}] START {request.method} {request.url.path}")
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(f"[{req_id}] COMPLETED {response.status_code} in {process_time:.3f}s")
        
        response.headers["X-Request-ID"] = req_id
        return response
"""

rate_limit_mw = """
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.database.redis import get_redis

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        return response
"""

with open(os.path.join(base, 'logging.py'), 'w') as f:
    f.write(logging_mw)
with open(os.path.join(base, 'rate_limit.py'), 'w') as f:
    f.write(rate_limit_mw)
with open(os.path.join(base, '__init__.py'), 'w') as f:
    f.write('from .logging import RequestLoggingMiddleware\nfrom .rate_limit import RateLimitMiddleware\n')

health_api = """
from fastapi import APIRouter
import time

router = APIRouter()
start_time = time.time()

@router.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "uptime": time.time() - start_time
    }
"""
with open(r'c:\Users\mpawa\OneDrive\Desktop\AI STARTUP BUILDER\backend\app\api\health.py', 'w') as f:
    f.write(health_api)
