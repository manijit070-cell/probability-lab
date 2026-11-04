"""
ProbabilityLab - Main FastAPI Application
Handles API routing for Coin, Dice, Card, and Statistics simulation engines.
Compatible with Vercel Python Serverless Runtime and Local Development.
"""

import sys
import os

# Add root directory to sys.path so relative imports work in both local and Vercel environments
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.coin import router as coin_router
from api.routes.dice import router as dice_router
from api.routes.cards import router as cards_router
from api.routes.statistics import router as stats_router

app = FastAPI(
    title="ProbabilityLab API",
    description="Mathematical Probability & Stochastic Simulation Engine for Academic Study",
    version="1.0.0"
)

# Enable CORS for local Vite development and production Vercel domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with /api prefix
app.include_router(coin_router, prefix="/api")
app.include_router(dice_router, prefix="/api")
app.include_router(cards_router, prefix="/api")
app.include_router(stats_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ProbabilityLab Python Stochastic Engine",
        "version": "1.0.0",
        "python_version": sys.version
    }


@app.get("/api")
def root_info():
    return {
        "project": "ProbabilityLab - Academic Probability & Statistics Simulator",
        "group": "Group 7",
        "supported_engines": ["coin", "dice", "cards", "statistics"],
        "endpoints": {
            "coin_simulation": "POST /api/coin/simulate",
            "dice_simulation": "POST /api/dice/simulate",
            "card_simulation": "POST /api/cards/simulate",
            "statistics_analyze": "POST /api/statistics/analyze",
            "health": "GET /api/health"
        }
    }


# For direct execution: python api/index.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.index:app", host="0.0.0.0", port=8000, reload=True)
