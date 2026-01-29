"""
TripIT Custom Exceptions

Structured exception classes for consistent error handling.
"""

from typing import Any, Dict, Optional


class TripITException(Exception):
    """Base exception for all TripIT errors."""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "details": self.details
        }


class AIGenerationError(TripITException):
    """Raised when AI fails to generate valid output."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=502, details=details)


class AIValidationError(TripITException):
    """Raised when AI output fails validation."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=422, details=details)


class RateLimitError(TripITException):
    """Raised when rate limit is exceeded."""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, status_code=429)


class ValidationError(TripITException):
    """Raised for input validation errors."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, status_code=400, details=details)


class NotFoundError(TripITException):
    """Raised when resource is not found."""
    
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            f"{resource} not found: {identifier}",
            status_code=404,
            details={"resource": resource, "identifier": identifier}
        )
