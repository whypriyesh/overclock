"""
TripIT Groq Client

AI integration layer with proper logging, validation, and error handling.
"""

import json
import time
import re
import asyncio
from typing import Dict, Any, List, Optional
from functools import lru_cache

from core.config import get_settings
from core.logging_config import get_logger, log_ai_call
from core.exceptions import AIGenerationError, AIValidationError
from services.ai_schemas import ItinerarySchema, DayPlanSchema, CostBreakdownSchema

# Import curated data
try:
    from data.curated_destinations import get_filtered_destinations
except ImportError:
    def get_filtered_destinations(*args, **kwargs):
        return []

logger = get_logger("groq")
settings = get_settings()

# Try to import groq
try:
    from groq import AsyncGroq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False
    logger.warning("Groq library not installed - using fallback responses")


# Cached Groq client
_groq_client: Optional[AsyncGroq] = None


def get_groq_client() -> Optional[AsyncGroq]:
    """Get or create cached Groq client."""
    global _groq_client
    if not HAS_GROQ or not settings.GROQ_API_KEY:
        return None
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


def clean_json_response(content: str) -> str:
    """Extract and clean JSON from LLM response."""
    content = content.strip()
    
    # Remove markdown code blocks
    if content.startswith("```"):
        lines = content.split("\n")
        # Remove first line (```json or ```)
        lines = lines[1:]
        # Remove last line if it's just ```)
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        content = "\n".join(lines)
    
    # Try to find JSON object or array
    json_match = re.search(r'(\{.*\}|\[.*\])', content, re.DOTALL)
    if json_match:
        content = json_match.group(1)
    
    return content.strip()


async def generate_explanation(
    destination: str,
    days: int,
    budget: int,
    travel_type: str,
    interest: str
) -> str:
    """Generate AI explanation for why a destination is recommended."""
    client = get_groq_client()
    
    if not client:
        return f"{destination} is perfect for your {days}-day {travel_type} trip with a focus on {interest}. Great value within your ₹{budget:,} budget."
    
    start_time = time.time()
    try:
        prompt = f"""Explain why {destination} is suitable for a {days}-day {travel_type} trip 
with a budget of ₹{budget:,} and interest in {interest}.
Keep it concise (2-3 sentences max) and practical. Focus on unique experiences."""

        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {"role": "system", "content": "You are a friendly travel expert. Give concise, practical recommendations."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=settings.AI_TEMPERATURE_CREATIVE
        )
        
        duration_ms = (time.time() - start_time) * 1000
        tokens = response.usage.total_tokens if response.usage else 0
        log_ai_call(settings.AI_MODEL, tokens, duration_ms, success=True)
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        log_ai_call(settings.AI_MODEL, 0, duration_ms, success=False, error=str(e))
        logger.error(f"Failed to generate explanation: {e}")
        return f"{destination} is perfect for your {days}-day {travel_type} trip with a focus on {interest}."


async def generate_explanations_parallel(
    destinations: List[Dict[str, Any]],
    days: int,
    budget: int,
    travel_type: str,
    interest: str
) -> List[str]:
    """Generate explanations for multiple destinations in parallel."""
    tasks = [
        generate_explanation(
            destination=dest["name"],
            days=days,
            budget=budget,
            travel_type=travel_type,
            interest=interest
        )
        for dest in destinations
    ]
    return await asyncio.gather(*tasks)


async def generate_itinerary(
    destination: str,
    days: int,
    budget: int,
    travel_type: str,
    interest: str,
    travelers: int
) -> Dict[str, Any]:
    """Generate a complete day-wise itinerary using Groq LLM with validation."""
    import uuid
    
    client = get_groq_client()
    
    if not client:
        logger.info("No Groq client available, using fallback itinerary")
        return _generate_fallback_itinerary(destination, days, budget, travel_type, interest)
    
    # Retry loop for LLM output validation
    last_error = None
    for attempt in range(settings.AI_MAX_RETRIES):
        start_time = time.time()
        try:
            prompt = f"""Create a realistic {days}-day travel itinerary for {destination}.
Budget: ₹{budget:,} total for {travelers} travelers
Travel style: {travel_type}
Main interest: {interest}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{{
  "day_plans": [
    {{
      "day": 1,
      "title": "Day title",
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "meals": ["Breakfast suggestion", "Lunch suggestion", "Dinner suggestion"],
      "accommodation": "Hotel recommendation",
      "estimated_cost": 5000,
      "tips": "Helpful tip for this day"
    }}
  ],
  "travel_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "cost_breakdown": {{
    "accommodation": 10000,
    "food": 8000,
    "activities": 5000,
    "transport": 3000
  }}
}}"""

            response = await client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a professional travel planner. Generate realistic, budget-aware itineraries. Return ONLY valid JSON, no markdown."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=settings.AI_TEMPERATURE_STRUCTURED  # Lower temp for structured output
            )
            
            duration_ms = (time.time() - start_time) * 1000
            tokens = response.usage.total_tokens if response.usage else 0
            
            content = response.choices[0].message.content.strip()
            content = clean_json_response(content)
            
            # Parse and validate with Pydantic
            raw_data = json.loads(content)
            validated = ItinerarySchema.model_validate(raw_data)
            
            log_ai_call(settings.AI_MODEL, tokens, duration_ms, success=True)
            logger.info(f"Generated itinerary for {destination} on attempt {attempt + 1}")
            
            return {
                "id": str(uuid.uuid4()),
                "destination": destination,
                "days": days,
                "total_cost": validated.total_cost,
                "day_plans": [plan.model_dump() for plan in validated.day_plans],
                "travel_tips": validated.travel_tips,
                "cost_breakdown": validated.cost_breakdown.model_dump()
            }
            
        except json.JSONDecodeError as e:
            duration_ms = (time.time() - start_time) * 1000
            log_ai_call(settings.AI_MODEL, 0, duration_ms, success=False, error=f"JSON parse error: {e}")
            logger.warning(f"Invalid JSON from LLM (attempt {attempt + 1}): {e}")
            last_error = e
            continue
            
        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            log_ai_call(settings.AI_MODEL, 0, duration_ms, success=False, error=str(e))
            logger.warning(f"Error generating itinerary (attempt {attempt + 1}): {e}")
            last_error = e
            continue
    
    # All retries failed
    logger.error(f"Failed to generate itinerary after {settings.AI_MAX_RETRIES} attempts: {last_error}")
    return _generate_fallback_itinerary(destination, days, budget, travel_type, interest)


def _generate_fallback_itinerary(destination: str, days: int, budget: int, travel_type: str, interest: str) -> Dict[str, Any]:
    """Generate fallback itinerary when AI is unavailable."""
    import uuid
    
    daily_budget = budget // days
    day_plans = []
    
    activities_map = {
        "mountains": ["Trekking", "Scenic viewpoints", "Local village visit"],
        "beach": ["Beach activities", "Water sports", "Sunset cruise"],
        "heritage": ["Monument tours", "Museum visit", "Heritage walk"],
        "nature": ["Nature trails", "Wildlife spotting", "Photography"],
        "spiritual": ["Temple visits", "Meditation session", "Evening prayers"],
        "adventure": ["Adventure sports", "Outdoor activities", "Local exploration"]
    }
    
    activities = activities_map.get(interest.lower(), ["Local sightseeing", "Cultural experiences", "Food tour"])
    
    for i in range(1, days + 1):
        day_plans.append({
            "day": i,
            "title": f"Day {i} - {'Arrival & Exploration' if i == 1 else 'Departure' if i == days else f'{interest.title()} Adventure'}",
            "activities": [f"Morning: {activities[0]}", f"Afternoon: {activities[1]}", f"Evening: {activities[2]}"],
            "meals": ["Breakfast at hotel", "Authentic local lunch", "Dinner at popular restaurant"],
            "accommodation": "Well-rated hotel in convenient location",
            "estimated_cost": daily_budget,
            "tips": f"Start early to make the most of your day in {destination}"
        })
    
    return {
        "id": str(uuid.uuid4()),
        "destination": destination,
        "days": days,
        "total_cost": budget,
        "day_plans": day_plans,
        "travel_tips": [
            f"Best time to visit {destination} varies by season",
            "Keep some cash handy for local purchases",
            "Respect local customs and dress codes",
            "Stay hydrated and carry sunscreen"
        ],
        "cost_breakdown": {
            "accommodation": int(budget * 0.4),
            "food": int(budget * 0.25),
            "activities": int(budget * 0.2),
            "transport": int(budget * 0.15)
        }
    }


async def generate_chat_response(message: str) -> str:
    """Generate a chat response for the travel assistant."""
    client = get_groq_client()
    
    if not client:
        return _get_fallback_chat_response(message)
    
    start_time = time.time()
    try:
        system_prompt = """You are TripIT, a friendly and knowledgeable AI travel assistant for Indian destinations.

Your role:
- Help users discover destinations in India
- Provide practical travel tips and recommendations
- Suggest budget estimates in Indian Rupees (₹)
- Be concise but helpful (2-3 sentences max per response)
- Be enthusiastic about travel!

Popular destinations you know well:
- Goa (beaches, nightlife)
- Manali (mountains, adventure)
- Jaipur (heritage, culture)
- Kerala (backwaters, nature)
- Rishikesh (adventure, spiritual)
- Ladakh (mountains, offbeat)
- Udaipur (romantic, lakes)
- Varanasi (spiritual, heritage)

Always encourage users to try the Trip Planner feature for personalized itineraries!"""

        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=200,
            temperature=settings.AI_TEMPERATURE_CREATIVE
        )
        
        duration_ms = (time.time() - start_time) * 1000
        tokens = response.usage.total_tokens if response.usage else 0
        log_ai_call(settings.AI_MODEL, tokens, duration_ms, success=True)
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        log_ai_call(settings.AI_MODEL, 0, duration_ms, success=False, error=str(e))
        logger.error(f"Chat error: {e}")
        return "I'd love to help you plan your trip! Try our Trip Planner above for personalized AI recommendations based on your budget and interests."


def _get_fallback_chat_response(message: str) -> str:
    """Fallback responses based on keywords."""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['beach', 'goa', 'sea', 'ocean']):
        return "For beach destinations, I highly recommend Goa! It's perfect for a relaxing vacation with beautiful beaches, water sports, and vibrant nightlife. Best time to visit is October to March. Budget around ₹3,000-5,000 per day."
    elif any(word in message_lower for word in ['mountain', 'manali', 'hill', 'trek', 'himalaya']):
        return "Mountain lovers should definitely check out Manali or Ladakh! Perfect for trekking, paragliding, and stunning views. Best time is March to June. Budget around ₹2,500-4,000 per day."
    elif any(word in message_lower for word in ['heritage', 'jaipur', 'culture', 'history', 'palace']):
        return "For heritage and culture, Jaipur is amazing! The Pink City offers magnificent forts, palaces, and rich Rajasthani culture. Best time is October to March. Budget around ₹2,800-4,500 per day."
    elif any(word in message_lower for word in ['budget', 'cheap', 'affordable']):
        return "For budget-friendly trips, consider Rishikesh (₹1,800/day) or Varanasi (₹2,000/day). Both offer incredible experiences without breaking the bank!"
    elif any(word in message_lower for word in ['romantic', 'honeymoon', 'couple']):
        return "For romantic getaways, Udaipur is magical! Known as the City of Lakes, it's perfect for couples. Kerala's backwaters are also incredibly romantic. Budget around ₹4,000-6,000 per day."
    else:
        return "I'd love to help you plan your perfect trip! Tell me what kind of experience you're looking for - beaches, mountains, heritage, adventure, or something else? Also let me know your approximate budget and duration!"


async def generate_contextual_suggestions(
    trip_type: str = None,
    terrain: str = None,
    budget: str = None,
    duration: str = None,
    location_pref: str = None,
    specific_location: str = None
) -> list:
    """Generate contextual suggestions based on user's current selections."""
    
    # Get relevant allowed destinations
    allowed_list = get_filtered_destinations(
        location_pref=location_pref,
        interest_pref=terrain or trip_type,
        budget_pref=budget
    )
    allowed_str = ", ".join(allowed_list[:15]) if allowed_list else "Any popular destination"

    # Build context from selections
    context_parts = []
    if trip_type:
        context_parts.append(f"trip type: {trip_type}")
    if terrain:
        context_parts.append(f"terrain: {terrain}")
    if budget:
        context_parts.append(f"budget: {budget}")
    if duration:
        context_parts.append(f"duration: {duration}")
    if location_pref:
        context_parts.append(f"location preference: {location_pref}")
    if specific_location:
        context_parts.append(f"specific destination: {specific_location}")
    
    if not context_parts:
        return ["✨ Select your preferences and I'll give you personalized tips!"]
    
    context = ", ".join(context_parts)
    client = get_groq_client()
    
    if not client:
        return _get_rule_based_suggestions(trip_type, terrain, budget, duration)
    
    start_time = time.time()
    try:
        prompt = f"""User's travel preferences: {context}
ALLOWED DESTINATIONS: {allowed_str}

Generate exactly 2-3 PRACTICAL travel suggestions. Follow these rules strictly:

1. RECOMMEND ONLY DESTINATIONS FROM THE ALLOWED LIST ABOVE. Do not hallucinate.
2. Include SPECIFIC actionable advice like:
   - Best time to visit (months)
   - Estimated daily budget in INR (₹2000-5000/day for budget, ₹5000-10000 for moderate, ₹10000+ for luxury)
   - Must-do activities at that destination
   - Booking tips (book X days in advance, etc.)
3. Keep each tip under 20 words
4. Start each with a relevant emoji
5. Be REALISTIC about costs and timing

Return ONLY a JSON array of strings. Example:
["🏔️ Manali in May-June: Perfect for paragliding, budget ₹3000/day", "💡 Book hotels 2 weeks ahead for 30% savings"]"""

        response = await client.chat.completions.create(
            model=settings.AI_MODEL,
            messages=[
                {"role": "system", "content": """You are an experienced Indian travel planner with 10+ years of expertise. 
You give ONLY realistic, practical advice based on actual destinations, real costs, and genuine travel insights.
Never make up destinations or unrealistic prices. Return ONLY a valid JSON array of strings."""},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=settings.AI_TEMPERATURE_STRUCTURED  # Lower temperature for grounded responses
        )
        
        duration_ms = (time.time() - start_time) * 1000
        tokens = response.usage.total_tokens if response.usage else 0
        log_ai_call(settings.AI_MODEL, tokens, duration_ms, success=True)
        
        content = response.choices[0].message.content.strip()
        content = clean_json_response(content)
        
        # Parse JSON array
        if content.startswith("["):
            suggestions = json.loads(content)
            return suggestions[:3]
        else:
            return _get_rule_based_suggestions(trip_type, terrain, budget, duration)
            
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        log_ai_call(settings.AI_MODEL, 0, duration_ms, success=False, error=str(e))
        logger.error(f"Suggestions error: {e}")
        return _get_rule_based_suggestions(trip_type, terrain, budget, duration)


def _get_rule_based_suggestions(trip_type=None, terrain=None, budget=None, duration=None) -> list:
    """Fallback rule-based suggestions using curated data."""
    import random
    
    suggestions = []
    
    def format_tip(dest, trip_type):
        name = dest
        if trip_type == "adventure":
            return f"🏔️ {name}: Great for trekking & outdoor activities"
        elif trip_type == "relaxation":
            return f"🌴 {name}: Perfect for unwinding and peace"
        elif trip_type == "cultural":
            return f"🏛️ {name}: Rich in history and local culture"
        elif trip_type == "spiritual":
            return f"🕉️ {name}: Ideal for spiritual rejuvenation"
        elif trip_type == "romantic":
            return f"💑 {name}: Romantic getaway with scenic views"
        elif trip_type == "nightlife":
            return f"🎉 {name}: Vibrant nightlife and entertainment"
        else:
            return f"✨ {name}: A top recommendation for your trip"

    # Get destinations matching criteria
    candidates = get_filtered_destinations(
        location_pref=None,
        interest_pref=terrain or trip_type
    )
    
    if candidates:
        picks = random.sample(candidates, min(2, len(candidates)))
        for p in picks:
            suggestions.append(format_tip(p, trip_type))
    
    # Add a budget/practical tip
    if budget == "budget":
        suggestions.append("💡 Travel tip: Local homestays significantly reduce costs")
    elif budget == "luxury":
        suggestions.append("✨ Luxury tip: Book private transfers for comfort")
    elif duration == "weekend":
        suggestions.append("⏰ Weekend tip: Start early to maximize your short trip")
    else:
        suggestions.append("📅 Plan ahead: Book 2 months in advance for best deals")
        
    return suggestions[:3]
