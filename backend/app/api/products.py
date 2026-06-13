from typing import Optional

from fastapi import APIRouter, Query

from app.services.catalog import search_products

router = APIRouter()


@router.get("/products", summary="Search the express product catalog")
async def search(
    q: str = Query(default="", description="Search query"),
    category: Optional[str] = Query(default=None, description="Category filter"),
    limit: int = Query(default=10, le=50),
):
    products = search_products(query=q, category=category, limit=limit)
    return {"products": products, "total": len(products)}
