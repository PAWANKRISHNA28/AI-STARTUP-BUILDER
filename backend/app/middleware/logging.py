
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
