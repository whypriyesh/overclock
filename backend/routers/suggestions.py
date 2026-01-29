"""
TripIT Suggestions Router

Endpoints for contextual travel suggestions.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional

from services.groq_client import generate_contextual_suggestions
from core.logging_config import get_logger

router = APIRouter()
logger = get_logger("suggestions")


class SuggestionRequest(BaseModel):
    """Request schema for suggestions."""
    tripType: Optional[str] = Field(default=None, max_length=50)
    terrain: Optional[str] = Field(default=None, max_length=50)
    budget: Optional[str] = Field(default=None, max_length=50)
    duration: Optional[str] = Field(default=None, max_length=50)
    locationPref: Optional[str] = Field(default=None, max_length=50)
    specificLocation: Optional[str] = Field(default=None, max_length=100)


class SuggestionResponse(BaseModel):
    """Response schema for suggestions."""
    suggestions: List[str]
    tip: Optional[str] = None


@router.post("/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    """
    Get AI-powered contextual suggestions based on current user selections.
    Returns 2-3 helpful tips relevant to the selected preferences.
    """
    logger.info(f"Getting suggestions for: {request.model_dump(exclude_none=True)}")
    
    try:
        suggestions = await generate_contextual_suggestions(
            trip_type=request.tripType,
            terrain=request.terrain,
            budget=request.budget,
            duration=request.duration,
            location_pref=request.locationPref,
            specific_location=request.specificLocation
        )
        return SuggestionResponse(suggestions=suggestions)
    except Exception as e:
        logger.error(f"Suggestions error: {e}")
        return SuggestionResponse(
            suggestions=["✨ Tell me more about your preferences for personalized recommendations!"]
        )
