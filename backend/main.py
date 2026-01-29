"""
TripIT AI API

AI-powered travel planning platform with proper architecture.
"""

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.config import get_settings
from core.logging_config import get_logger
from core.middleware import RequestContextMiddleware, exception_handler
from core.exceptions import TripITException
from core.rate_limit import rate_limiter

from routers import recommendations, itinerary, chat, suggestions

# Get settings and logger
settings = get_settings()
logger = get_logger("main")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered travel planning platform",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    dependencies=[Depends(rate_limiter)]
)

# Add request context middleware (timing, request IDs)
app.add_middleware(RequestContextMiddleware)

# CORS configuration - use settings for origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if not settings.DEBUG else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handler
app.add_exception_handler(TripITException, exception_handler)

# Include routers with versioned prefix
app.include_router(recommendations.router, prefix="/api/v1", tags=["Recommendations"])
app.include_router(itinerary.router, prefix="/api/v1", tags=["Itinerary"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(suggestions.router, prefix="/api/v1", tags=["Suggestions"])

# Also mount at /api for backwards compatibility
app.include_router(recommendations.router, prefix="/api", tags=["Recommendations"])
app.include_router(itinerary.router, prefix="/api", tags=["Itinerary"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(suggestions.router, prefix="/api", tags=["Suggestions"])


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"CORS origins: {settings.CORS_ORIGINS}")
    
    # Pre-load destination cache
    from services.destination_cache import get_destination_cache
    cache = get_destination_cache()
    logger.info(f"Loaded {len(cache.get_all())} destinations into cache")


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION
    }
