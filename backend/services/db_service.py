"""
TripIT Database Service

Handles interactions with Supabase database for permanent storage.
Replaces legacy file-based persistence.
"""

from typing import Dict, Any, List, Optional
from supabase import create_client, Client
from core.config import get_settings
from core.logging_config import get_logger

logger = get_logger("db_service")
settings = get_settings()

class SupabaseService:
    """Service for interacting with Supabase."""
    
    _client: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get or create Supabase client."""
        if not cls._client:
            if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
                logger.error("Supabase credentials not configured")
                raise ValueError("Supabase URL and Key are required")
            
            cls._client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return cls._client

    @classmethod
    def save_itinerary(cls, itinerary_id: str, data: Dict[str, Any], user_id: str) -> bool:
        """Save itinerary to Supabase."""
        try:
            client = cls.get_client()
            
            # Prepare record
            record = {
                "id": itinerary_id,
                "user_id": user_id,
                "destination": data.get("destination"),
                "content": data, # Store full JSON in content column
                "is_public": False
            }
            
            # Upsert
            response = client.table("itineraries").upsert(record).execute()
            logger.info(f"Saved itinerary {itinerary_id} to Supabase")
            return True
            
        except Exception as e:
            logger.error(f"Failed to save to Supabase: {e}")
            raise e

    @classmethod
    def get_itinerary(cls, itinerary_id: str) -> Optional[Dict[str, Any]]:
        """Get itinerary by ID."""
        try:
            client = cls.get_client()
            response = client.table("itineraries").select("*").eq("id", itinerary_id).execute()
            
            if response.data and len(response.data) > 0:
                # Return the full content blob
                return response.data[0]["content"]
            return None
            
        except Exception as e:
            logger.error(f"Failed to fetch from Supabase: {e}")
            return None

    @classmethod
    def get_user_itineraries(cls, user_id: str) -> List[Dict[str, Any]]:
        """Get all itineraries for a user."""
        try:
            client = cls.get_client()
            response = client.table("itineraries").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            
            itineraries = []
            if response.data:
                for row in response.data:
                    # Merge ID back if needed or just return content
                    itinerary = row["content"]
                    itinerary["id"] = row["id"] # Ensure ID matches
                    itineraries.append(itinerary)
            
            return itineraries
            
        except Exception as e:
            logger.error(f"Failed to fetch user itineraries: {e}")
            return []

    @classmethod
    def delete_itinerary(cls, itinerary_id: str, user_id: str) -> bool:
        """Delete itinerary (with ownership check)."""
        try:
            client = cls.get_client()
            # Delete where ID matches AND user_id matches (security)
            response = client.table("itineraries").delete().eq("id", itinerary_id).eq("user_id", user_id).execute()
            
            if response.data:
                logger.info(f"Deleted itinerary {itinerary_id}")
                return True
            return False
            
        except Exception as e:
            logger.error(f"Failed to delete from Supabase: {e}")
            return False

# Global instance not needed as methods are classmethods, but for consistency:
db = SupabaseService
