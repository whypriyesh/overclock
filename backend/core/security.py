"""
TripIT Security Module

Handles authentication verification using Supabase JWTs.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from core.config import get_settings
from core.logging_config import get_logger

settings = get_settings()
logger = get_logger("security")
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validate Supabase JWT and return user ID.
    """
    token = credentials.credentials
    
    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server authentication configuration missing"
            )

        # We verify by calling Supabase Auth API
        # This is safer than local verification as it checks revocation
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        user = supabase.auth.get_user(token)
        
        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user.user.id
        
    except Exception as e:
        logger.warning(f"Auth failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
