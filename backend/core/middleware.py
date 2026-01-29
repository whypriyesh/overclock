"""
TripIT Middleware

Request timing, ID tracking, and error handling middleware.
"""

import time
import uuid
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from core.logging_config import get_logger
from core.exceptions import TripITException


logger = get_logger("middleware")


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Middleware to add request ID and timing to all requests."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        
        # Track timing
        start_time = time.time()
        
        # Log request start
        logger.info(
            f"→ {request.method} {request.url.path}",
            extra={"request_id": request_id, "endpoint": request.url.path}
        )
        
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration_ms = (time.time() - start_time) * 1000
            
            # Log request completion
            logger.info(
                f"← {response.status_code} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "duration_ms": duration_ms,
                    "endpoint": request.url.path
                }
            )
            
            # Add headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"
            
            return response
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                f"✗ Error: {str(e)}",
                extra={"request_id": request_id, "duration_ms": duration_ms}
            )
            raise


async def exception_handler(request: Request, exc: TripITException) -> JSONResponse:
    """Handle TripIT exceptions with consistent format."""
    logger.error(
        f"TripITException: {exc.message}",
        extra={"request_id": getattr(request.state, "request_id", "unknown")}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.to_dict()
        }
    )
