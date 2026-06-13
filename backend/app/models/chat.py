from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None


class SSEEvent(BaseModel):
    type: str  # "text" | "products" | "error" | "done"
    delta: Optional[str] = None
    products: Optional[list] = None
    error: Optional[str] = None
