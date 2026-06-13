from __future__ import annotations
from pydantic import BaseModel


class Product(BaseModel):
    id: str
    name: str
    category: str
    price: float
    unit: str
    image_url: str
    eta_min: int = 28
    in_stock: bool = True
    tags: str = ""
    reason: str | None = None


class ProductCard(BaseModel):
    id: str
    name: str
    price: float
    unit: str
    image_url: str
    eta_min: int
    category: str
    reason: str | None = None
