"""
TripIT Destination Scoring

Improved scoring algorithm that heavily weights user preferences
to ensure destinations matching user choices rank highest.
"""

from typing import List, Dict, Any
from core.logging_config import get_logger

logger = get_logger("scoring")


def score_destinations(
    destinations: List[Dict[str, Any]],
    budget: int,
    days: int,
    travel_type: str,
    interest: str
) -> List[Dict[str, Any]]:
    """
    Score destinations based on user preferences using weighted scoring.
    Returns sorted list with scores (highest first).
    
    Scoring weights:
    - Interest match: 40 points (highest priority - terrain preference)
    - Travel type match: 35 points
    - Budget fit: 25 points
    """
    scored = []
    daily_budget = budget / days
    travel_type_lower = travel_type.lower()
    interest_lower = interest.lower()
    
    logger.info(f"Scoring with: travel_type={travel_type_lower}, interest={interest_lower}, daily_budget={daily_budget:.0f}")
    
    # Travel type → tags (what type of experience)
    travel_type_tags = {
        "adventure": {"adventure", "mountains", "offbeat", "trekking", "rafting"},
        "relaxation": {"relaxation", "nature", "backwaters", "lakes", "beach", "spa", "scenic"},
        "culture": {"heritage", "culture", "spiritual", "temples", "history", "museums"},
        "party": {"party", "beach", "nightlife", "urban"},
        "romantic": {"romantic", "lakes", "nature", "scenic", "honeymoon", "luxury"},
        "family": {"family", "heritage", "nature", "kid-friendly", "safe"},
        "spiritual": {"spiritual", "temples", "pilgrimage", "yoga", "meditation"},
        "foodie": {"food", "culture", "heritage", "markets", "urban"}
    }
    
    # Interest → tags (what terrain/environment)
    interest_tags = {
        "mountains": {"mountains", "hills", "trekking", "snow", "adventure", "scenic"},
        "beach": {"beach", "coastal", "sea", "island", "water", "relaxation"},
        "heritage": {"heritage", "culture", "history", "monuments", "forts", "museums"},
        "nature": {"nature", "backwaters", "wildlife", "forests", "scenic", "lakes"},
        "spiritual": {"spiritual", "temples", "pilgrimage", "religious", "yoga"},
        "adventure": {"adventure", "offbeat", "trekking", "rafting", "sports"},
        "city": {"city", "urban", "nightlife", "shopping", "food"}
    }
    
    # Get user preference tags
    user_type_tags = travel_type_tags.get(travel_type_lower, set())
    user_interest_tags = interest_tags.get(interest_lower, set())
    
    for dest in destinations:
        score = 0.0
        dest_tags = set(tag.lower() for tag in dest.get("tags", []))
        dest_best_for = set(bf.lower() for bf in dest.get("best_for", []))
        base_cost = dest.get("base_cost_per_day", 3000)
        
        # ========================================
        # INTEREST MATCH (40 points max) - HIGHEST PRIORITY
        # ========================================
        # Direct terrain tag match (e.g., user wants "beach", dest has "beach")
        interest_overlap = len(dest_tags.intersection(user_interest_tags))
        if interest_overlap > 0:
            score += min(40, interest_overlap * 20)  # 20 points per match, max 40
        
        # Direct interest keyword match
        if interest_lower in dest_tags:
            score += 15  # Bonus for exact match
        
        # ========================================  
        # TRAVEL TYPE MATCH (35 points max)
        # ========================================
        type_overlap = len(dest_tags.intersection(user_type_tags))
        if type_overlap > 0:
            score += min(35, type_overlap * 15)  # 15 points per match, max 35
        
        # Best-for match bonus
        if travel_type_lower in dest_best_for:
            score += 10
        
        # ========================================
        # BUDGET FIT (25 points max)
        # ========================================
        if base_cost <= daily_budget:
            # Perfect fit: cost is 50-80% of daily budget
            ratio = base_cost / daily_budget
            if 0.5 <= ratio <= 0.8:
                score += 25  # Sweet spot
            elif ratio < 0.5:
                score += 15  # Under budget (good but might be too cheap)
            else:
                score += 20  # Slightly over 80% but still affordable
        else:
            # Over budget penalty
            over_ratio = base_cost / daily_budget
            if over_ratio <= 1.2:
                score += 5  # Slightly over, might stretch
            # else: no points (too expensive)
        
        # ========================================
        # NORMALIZE & CAP
        # ========================================
        score = max(0, min(100, score))
        
        scored.append({
            **dest,
            "score": round(score, 1)
        })
    
    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)
    
    # Log for debugging
    logger.info(f"Top scores: {[(d['name'], d['score'], d['tags']) for d in scored[:5]]}")
    
    return scored
