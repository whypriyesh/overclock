"""
TripIT Itinerary Router

Endpoints for itinerary generation and management.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

from services.groq_client import generate_itinerary
from services.db_service import db
from core.logging_config import get_logger
from core.exceptions import NotFoundError
from core.security import get_current_user

router = APIRouter()
logger = get_logger("itinerary")


class ItineraryRequest(BaseModel):
    """Request schema for itinerary generation with validation."""
    destination: str = Field(min_length=2, max_length=100)
    days: int = Field(ge=1, le=30, description="Number of days (1-30)")
    budget: int = Field(gt=0, le=10000000, description="Budget in INR")
    travel_type: str = Field(min_length=2, max_length=50)
    interest: str = Field(min_length=2, max_length=50)
    travelers: int = Field(ge=1, le=20, default=2)


class DayPlan(BaseModel):
    """Schema for a single day plan."""
    day: int
    title: str
    activities: List[str]
    meals: List[str]
    accommodation: str
    estimated_cost: int
    tips: Optional[str] = None


class ItineraryResponse(BaseModel):
    """Response schema for itinerary."""
    id: str
    destination: str
    days: int
    total_cost: int
    day_plans: List[DayPlan]
    travel_tips: List[str]
    cost_breakdown: Dict[str, int]


class SaveItineraryRequest(BaseModel):
    """Request schema for saving itinerary."""
    itinerary: ItineraryResponse


@router.post("/itinerary/generate", response_model=ItineraryResponse)
async def create_itinerary(
    request: ItineraryRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Generate a day-wise itinerary using Groq LLM.
    Requires authentication to prevent abuse.
    """
    logger.info(f"Generating itinerary for {request.destination}, {request.days} days")
    
    try:
        itinerary = await generate_itinerary(
            destination=request.destination,
            days=request.days,
            budget=request.budget,
            travel_type=request.travel_type,
            interest=request.interest,
            travelers=request.travelers
        )
        
        logger.info(f"Itinerary generated: {itinerary['id']}")
        return itinerary
        
    except Exception as e:
        logger.error(f"Itinerary generation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate itinerary")


@router.post("/itinerary/save")
async def save_itinerary(
    request: SaveItineraryRequest,
    user_id: str = Depends(get_current_user)
):
    """
    Save an itinerary to Supabase.
    Requires valid Bearer token.
    """
    itinerary_id = request.itinerary.id
    
    # Save using db service
    db.save_itinerary(itinerary_id, request.itinerary.model_dump(), user_id)
    
    return {"success": True, "id": itinerary_id}


@router.get("/itinerary/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(itinerary_id: str):
    """Fetch a saved itinerary by ID."""
    itinerary = db.get_itinerary(itinerary_id)
    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itinerary


@router.get("/itinerary/user/all")
async def get_user_trips(user_id: str = Depends(get_current_user)):
    """Fetch all itineraries for the authenticated user."""
    return db.get_user_itineraries(user_id)


@router.delete("/itinerary/{itinerary_id}")
async def delete_itinerary(
    itinerary_id: str,
    user_id: str = Depends(get_current_user)
):
    """
    Delete an itinerary.
    Ensures user owns the itinerary.
    """
    if db.delete_itinerary(itinerary_id, user_id):
        return {"success": True}
    raise HTTPException(status_code=404, detail="Itinerary not found or unauthorized")
