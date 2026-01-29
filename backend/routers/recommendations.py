"""
TripIT Recommendations Router

Endpoints for AI-powered destination recommendations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from services.scoring import score_destinations
from services.groq_client import generate_explanations_parallel
from services.destination_cache import get_destination_cache
from core.logging_config import get_logger

router = APIRouter()
logger = get_logger("recommendations")


class RecommendationRequest(BaseModel):
    """Request schema for recommendations with validation."""
    budget: int = Field(gt=0, le=10000000, description="Total budget in INR")
    days: int = Field(ge=1, le=30, description="Number of days (1-30)")
    travel_type: str = Field(min_length=2, max_length=50, description="Type of travel")
    interest: str = Field(min_length=2, max_length=50, description="Primary interest")


class DestinationScore(BaseModel):
    """Response schema for a scored destination."""
    id: str
    name: str
    country: str
    image: str
    score: float
    reason: str
    estimated_cost: int
    tags: List[str]
    description: str


class RecommendationResponse(BaseModel):
    """Response schema for recommendations."""
    destinations: List[DestinationScore]
    query: RecommendationRequest


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get AI-powered destination recommendations based on user preferences.
    Uses rule-based scoring + parallel AI explanations.
    """
    logger.info(f"Recommendations request: travel_type={request.travel_type}, interest={request.interest}, budget={request.budget}, days={request.days}")
    
    # Get destinations from cache (not file read)
    cache = get_destination_cache()
    destinations = cache.get_all()
    
    if not destinations:
        raise HTTPException(status_code=500, detail="No destinations available")
    
    logger.info(f"Scoring {len(destinations)} destinations...")
    
    # Score destinations using rule-based logic
    scored = score_destinations(
        destinations=destinations,
        budget=request.budget,
        days=request.days,
        travel_type=request.travel_type,
        interest=request.interest
    )
    
    # Log top 5 scores for debugging
    for i, dest in enumerate(scored[:5]):
        logger.info(f"  #{i+1} {dest['name']}: score={dest['score']}, tags={dest['tags']}")
    
    # Get top 3 destinations
    top_destinations = scored[:3]
    
    # Generate AI explanations in parallel (not sequential!)
    explanations = await generate_explanations_parallel(
        destinations=top_destinations,
        days=request.days,
        budget=request.budget,
        travel_type=request.travel_type,
        interest=request.interest
    )
    
    # Build response
    results = []
    for dest, explanation in zip(top_destinations, explanations):
        results.append(DestinationScore(
            id=dest["id"],
            name=dest["name"],
            country=dest["country"],
            image=dest["image"],
            score=dest["score"],
            reason=explanation,
            estimated_cost=dest["base_cost_per_day"] * request.days,
            tags=dest["tags"],
            description=dest["description"]
        ))
    
    logger.info(f"Returning {len(results)} recommendations for {request.interest}")
    return RecommendationResponse(destinations=results, query=request)


@router.get("/destinations")
async def list_destinations():
    """Get all available destinations from cache."""
    cache = get_destination_cache()
    return cache.get_all()
