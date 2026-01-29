"""
TripIT Logging Configuration

Structured logging setup for production-ready observability.
"""

import logging
import sys
from typing import Any, Dict

from core.config import get_settings


class StructuredFormatter(logging.Formatter):
    """Custom formatter that outputs structured log messages."""
    
    def format(self, record: logging.LogRecord) -> str:
        # Add extra fields if present
        extra = ""
        if hasattr(record, "request_id"):
            extra += f" request_id={record.request_id}"
        if hasattr(record, "duration_ms"):
            extra += f" duration_ms={record.duration_ms:.2f}"
        if hasattr(record, "endpoint"):
            extra += f" endpoint={record.endpoint}"
        if hasattr(record, "model"):
            extra += f" model={record.model}"
        if hasattr(record, "tokens"):
            extra += f" tokens={record.tokens}"
        
        # Format: timestamp [level] logger - message extra_fields
        timestamp = self.formatTime(record, self.datefmt)
        return f"{timestamp} [{record.levelname}] {record.name} - {record.getMessage()}{extra}"


def setup_logging() -> logging.Logger:
    """Configure and return the application logger."""
    settings = get_settings()
    
    # Create logger
    logger = logging.getLogger("tripit")
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler with structured format
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(StructuredFormatter(
        datefmt="%Y-%m-%d %H:%M:%S"
    ))
    logger.addHandler(console_handler)
    
    # Prevent propagation to root logger
    logger.propagate = False
    
    return logger


# Global logger instance
logger = setup_logging()


def get_logger(name: str = None) -> logging.Logger:
    """Get a child logger with optional name."""
    if name:
        return logger.getChild(name)
    return logger


def log_ai_call(
    model: str,
    tokens: int,
    duration_ms: float,
    success: bool,
    error: str = None
):
    """Log an AI API call with structured data."""
    ai_logger = get_logger("ai")
    extra = {
        "model": model,
        "tokens": tokens,
        "duration_ms": duration_ms
    }
    
    if success:
        ai_logger.info("AI call completed", extra=extra)
    else:
        ai_logger.error(f"AI call failed: {error}", extra=extra)
