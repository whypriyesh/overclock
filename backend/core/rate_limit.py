"""
TripIT Rate Limiting

Simple in-memory sliding window rate limiter.
For production, use Redis.
"""

import time
from collections import defaultdict, deque
from fastapi import Request, HTTPException
from core.config import get_settings
from core.logging_config import get_logger

logger = get_logger("rate_limit")
settings = get_settings()

# Store request timestamps: ip -> deque([timestamps])
_request_history = defaultdict(deque)


async def rate_limiter(request: Request):
    """
    Rate limiting dependency.
    """
    if not settings.RATE_LIMIT_ENABLED:
        return

    # specific logic for production vs dev
    # In dev, we might want to be lenient or disable it
    
    client_ip = request.client.host
    now = time.time()
    
    # Get history for this IP
    history = _request_history[client_ip]
    
    # Remove timestamps older than window
    window_start = now - settings.RATE_LIMIT_WINDOW_SECONDS
    while history and history[0] < window_start:
        history.popleft()
    
    # Check limit
    if len(history) >= settings.RATE_LIMIT_REQUESTS:
        logger.warning(f"Rate limit exceeded for {client_ip}")
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later."
        )
    
    # Add usage
    history.append(now)
