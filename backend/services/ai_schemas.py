"""
TripIT AI Schemas

Pydantic schemas for validating LLM output.
"""

from typing import List, Dict, Optional
from pydantic import BaseModel, Field, field_validator


class DayPlanSchema(BaseModel):
    """Schema for a single day in the itinerary."""
    
    day: int = Field(ge=1, le=30, description="Day number")
    title: str = Field(min_length=3, max_length=200, description="Day title")
    activities: List[str] = Field(min_length=1, max_length=10, description="List of activities")
    meals: List[str] = Field(default_factory=list, description="Meal recommendations")
    accommodation: str = Field(default="", description="Accommodation recommendation")
    estimated_cost: int = Field(ge=0, description="Estimated cost for the day in INR")
    tips: Optional[str] = Field(default=None, description="Tips for the day")
    
    @field_validator("activities", mode="before")
    @classmethod
    def filter_empty_activities(cls, v):
        if isinstance(v, list):
            return [a.strip() for a in v if a and a.strip()]
        return v
    
    @field_validator("meals", mode="before")
    @classmethod
    def filter_empty_meals(cls, v):
        if isinstance(v, list):
            return [m.strip() for m in v if m and m.strip()]
        return v
    
    @field_validator("estimated_cost", mode="before")
    @classmethod
    def ensure_positive_cost(cls, v):
        try:
            cost = int(v)
            return max(0, cost)
        except (ValueError, TypeError):
            return 0


class CostBreakdownSchema(BaseModel):
    """Schema for cost breakdown."""
    
    accommodation: int = Field(default=0, ge=0)
    food: int = Field(default=0, ge=0)
    activities: int = Field(default=0, ge=0)
    transport: int = Field(default=0, ge=0)
    
    @field_validator("*", mode="before")
    @classmethod
    def ensure_positive(cls, v):
        try:
            return max(0, int(v))
        except (ValueError, TypeError):
            return 0


class ItinerarySchema(BaseModel):
    """Schema for complete itinerary from LLM."""
    
    day_plans: List[DayPlanSchema] = Field(min_length=1, description="Day-wise plans")
    travel_tips: List[str] = Field(default_factory=list, description="General travel tips")
    cost_breakdown: CostBreakdownSchema = Field(default_factory=CostBreakdownSchema)
    
    @field_validator("travel_tips", mode="before")
    @classmethod
    def filter_empty_tips(cls, v):
        if isinstance(v, list):
            return [t.strip() for t in v if t and t.strip()]
        return v
    
    @property
    def total_cost(self) -> int:
        """Calculate total cost from breakdown."""
        return (
            self.cost_breakdown.accommodation +
            self.cost_breakdown.food +
            self.cost_breakdown.activities +
            self.cost_breakdown.transport
        )


class SuggestionResponseSchema(BaseModel):
    """Schema for contextual suggestions from LLM."""
    
    suggestions: List[str] = Field(min_length=1, max_length=5)
    
    @field_validator("suggestions", mode="before")
    @classmethod
    def parse_suggestions(cls, v):
        # Handle string response
        if isinstance(v, str):
            try:
                import json
                return json.loads(v)
            except:
                return [v]
        return v
