from pydantic import BaseModel


class OrderItem(BaseModel):
    product_id: str
    quantity: int


class OrderRequest(BaseModel):
    user_id: str
    items: list[OrderItem]
    delivery_address: str


class OrderResponse(BaseModel):
    order_id: str
    status: str
    estimated_delivery: str
    eta_minutes: int
    total_amount: float
