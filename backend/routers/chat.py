"""
TripIT Chat Router

Endpoints for AI chat assistant.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

from services.groq_client import generate_chat_response
from core.logging_config import get_logger

router = APIRouter()
logger = get_logger("chat")


class ChatRequest(BaseModel):
    """Request schema for chat."""
    message: str = Field(min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    """Response schema for chat."""
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with TripIT AI assistant about travel.
    """
    logger.info(f"Chat message received: {request.message[:50]}...")
    
    try:
        response = await generate_chat_response(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return ChatResponse(
            response="I'd love to help you plan your trip! Try our Trip Planner for personalized recommendations."
        )
