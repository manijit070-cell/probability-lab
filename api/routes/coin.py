"""
Coin Experiment API Routes.
"""

from fastapi import APIRouter, HTTPException
from api.schemas.requests import CoinSimulationRequest, CoinSimulationResponse
from api.engine.coin_engine import simulate_coin_tosses

router = APIRouter(prefix="/coin", tags=["Coin Experiments"])


@router.post("/simulate", response_model=CoinSimulationResponse)
def simulate_coin(request: CoinSimulationRequest):
    try:
        result = simulate_coin_tosses(
            num_trials=request.num_trials,
            num_coins=request.num_coins,
            experiment_type=request.experiment_type,
            target_heads=request.target_heads or 1,
            consecutive_count=request.consecutive_count or 2,
            seed=request.seed
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
