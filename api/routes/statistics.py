"""
Statistics & Law of Large Numbers API Routes.
"""

from fastapi import APIRouter, HTTPException
from api.schemas.requests import LLNAnalysisRequest, LLNAnalysisResponse
from api.engine.stats_engine import run_lln_multi_scale

router = APIRouter(prefix="/statistics", tags=["Statistics & LLN"])


@router.post("/analyze", response_model=LLNAnalysisResponse)
def analyze_statistics(request: LLNAnalysisRequest):
    try:
        result = run_lln_multi_scale(
            domain=request.experiment_domain,
            scenario=request.scenario,
            seed=request.seed
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
