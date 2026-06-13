from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import chat, recommendations, products, orders

app = FastAPI(
    title="Amazon Now API",
    description="NowSpeak — Intent-First Urgent Commerce (Hackon Amazon 2026)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router,            prefix="/api/v1", tags=["NowSpeak"])
app.include_router(recommendations.router, prefix="/api/v1", tags=["Recommendations"])
app.include_router(products.router,        prefix="/api/v1", tags=["Products"])
app.include_router(orders.router,          prefix="/api/v1", tags=["Orders"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "Amazon Now API", "version": "1.0.0"}
