from __future__ import annotations
"""
Product catalog search service.
Tries DynamoDB first; falls back to in-memory seed data for local dev.
"""
from app.db.seed import PRODUCTS


def _format(p: dict) -> dict:
    return {
        "id":        p.get("id", ""),
        "name":      p.get("name", ""),
        "price":     float(p.get("price", 0)),
        "unit":      p.get("unit", "piece"),
        "image_url": p.get("image_url", ""),
        "eta_min":   int(p.get("eta_min", 30)),
        "category":  p.get("category", ""),
    }


def search_products(
    query: str,
    category: str | None = None,
    limit: int = 5,
) -> list[dict]:
    """
    Search the product catalog.
    Attempts DynamoDB; silently falls back to in-memory data.
    """
    try:
        from app.db.dynamo import search_products_by_query, search_products_by_category
        if category:
            results = search_products_by_category(category, limit)
            if not results and query:
                results = search_products_by_query(query, limit)
        else:
            results = search_products_by_query(query, limit)
        if results:
            return [_format(p) for p in results[:limit]]
    except Exception:
        pass  # DynamoDB unavailable — fall through to in-memory

    return _search_memory(query, category, limit)


def _search_memory(query: str, category: str | None, limit: int) -> list[dict]:
    q = query.lower() if query else ""
    out = []
    for p in PRODUCTS:
        if not p.get("in_stock"):
            continue
        if category and p.get("category") != category:
            continue
        if q and q not in p.get("name", "").lower() \
              and q not in p.get("tags", "").lower() \
              and q not in p.get("category", "").lower():
            if not category:
                continue  # skip non-matching items when no category filter
        out.append(_format(p))

    # If we still have nothing, return top products (safety net)
    if not out:
        out = [_format(p) for p in PRODUCTS if p.get("in_stock")]

    return out[:limit]


def get_products_by_ids(ids: list[str]) -> list[dict]:
    return [_format(p) for p in PRODUCTS if p["id"] in ids]


def get_trending(limit: int = 4) -> list[dict]:
    trending_ids = ["p016", "p006", "p011", "p017"]
    return [_format(p) for p in PRODUCTS if p["id"] in trending_ids][:limit]
