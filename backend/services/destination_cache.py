"""
TripIT Destination Cache

Caches destination data in memory instead of reading JSON every request.
"""

import json
import os
from functools import lru_cache
from typing import List, Dict, Any

from core.logging_config import get_logger

logger = get_logger("cache")

# Path to destinations data
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "destinations.json")


class DestinationCache:
    """Singleton cache for destination data."""
    
    _instance = None
    _destinations: List[Dict[str, Any]] = []
    _loaded = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def load(self) -> None:
        """Load destinations from JSON file once."""
        if self._loaded:
            return
            
        try:
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                self._destinations = json.load(f)
            self._loaded = True
            logger.info(f"Loaded {len(self._destinations)} destinations into cache")
        except FileNotFoundError:
            logger.error(f"Destinations file not found: {DATA_PATH}")
            self._destinations = []
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in destinations file: {e}")
            self._destinations = []
    
    def get_all(self) -> List[Dict[str, Any]]:
        """Get all destinations."""
        if not self._loaded:
            self.load()
        return self._destinations
    
    def get_by_id(self, destination_id: str) -> Dict[str, Any] | None:
        """Get destination by ID."""
        destinations = self.get_all()
        for dest in destinations:
            if dest.get("id") == destination_id:
                return dest
        return None
    
    def reload(self) -> None:
        """Force reload of destinations data."""
        self._loaded = False
        self.load()


@lru_cache()
def get_destination_cache() -> DestinationCache:
    """Get the singleton destination cache instance."""
    cache = DestinationCache()
    cache.load()
    return cache
