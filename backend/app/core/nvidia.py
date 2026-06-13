from __future__ import annotations
"""
NVIDIA AI Endpoints client (LangChain).
Replaces Amazon Bedrock for all LLM calls in this project.

Model: z-ai/glm-5.1 via NVIDIA NIM
"""
from langchain_nvidia_ai_endpoints import ChatNVIDIA

from app.core.config import settings


def get_llm(
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> ChatNVIDIA:
    """Factory — returns a configured ChatNVIDIA instance."""
    return ChatNVIDIA(
        model=settings.nvidia_model_id,
        api_key=settings.nvidia_api_key,
        temperature=temperature if temperature is not None else settings.nvidia_temperature,
        top_p=settings.nvidia_top_p,
        max_tokens=max_tokens if max_tokens is not None else settings.nvidia_max_tokens,
    )


# Module-level singletons for reuse (constructed lazily on first import)
# intent_engine uses `llm` for streaming; use lower temperature for crisp responses
llm = get_llm(temperature=0.7, max_tokens=512)
