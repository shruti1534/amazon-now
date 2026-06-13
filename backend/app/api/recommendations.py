from typing import Optional

from fastapi import APIRouter, Query

from app.services.recommendation import get_recommendations

router = APIRouter()


@router.get("/recommendations", summary="AI-powered contextual product recommendations")
async def recommendations(user_id: Optional[str] = Query(default=None)):
    """
    Returns three recommendation lanes:
    - now_suggestions: time-of-day contextual picks
    - reorder_nudges:  products the user has ordered before
    - trending:        popular products near you
    """
    return get_recommendations(user_id=user_id)
