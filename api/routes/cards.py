"""
Card Experiment API Routes.
"""

from fastapi import APIRouter, HTTPException
from api.schemas.requests import CardSimulationRequest, CardSimulationResponse
from api.engine.card_engine import simulate_card_draws

router = APIRouter(prefix="/cards", tags=["Card Experiments"])


@router.post("/simulate", response_model=CardSimulationResponse)
def simulate_cards(request: CardSimulationRequest):
    try:
        result = simulate_card_draws(
            num_trials=request.num_trials,
            cards_drawn=request.cards_drawn,
            replacement=request.replacement,
            experiment_type=request.experiment_type,
            target_suit=request.target_suit or "hearts",
            seed=request.seed
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
