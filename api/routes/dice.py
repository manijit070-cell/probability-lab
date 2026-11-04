"""
Dice Experiment API Routes.
"""

from fastapi import APIRouter, HTTPException
from api.schemas.requests import DiceSimulationRequest, DiceSimulationResponse
from api.engine.dice_engine import simulate_dice_rolls

router = APIRouter(prefix="/dice", tags=["Dice Experiments"])


@router.post("/simulate", response_model=DiceSimulationResponse)
def simulate_dice(request: DiceSimulationRequest):
    try:
        result = simulate_dice_rolls(
            num_dice=request.num_dice,
            num_trials=request.num_trials,
            experiment_type=request.experiment_type,
            target_number=request.target_number or 6,
            target_sum=request.target_sum or 7,
            seed=request.seed
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
