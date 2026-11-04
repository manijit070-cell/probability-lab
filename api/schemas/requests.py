"""
Pydantic Schemas for ProbabilityLab request validation and structured responses.
"""

from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Common Base Responses
# ---------------------------------------------------------------------------

class MathExplanation(BaseModel):
    title: str
    sample_space_description: str
    sample_space_size: int
    favorable_outcomes_description: str
    favorable_outcomes_count: int
    formula_latex: str
    calculation_steps: List[str]
    theoretical_probability_fraction: str
    theoretical_probability_decimal: float
    notes: str


class ConvergencePoint(BaseModel):
    trial: int
    experimental: float
    theoretical: float
    absolute_error: float
    successes: int


# ---------------------------------------------------------------------------
# Coin Schemas
# ---------------------------------------------------------------------------

class CoinSimulationRequest(BaseModel):
    num_trials: int = Field(default=1000, ge=1, le=1000000, description="Total number of experiment trials")
    num_coins: int = Field(default=1, ge=1, le=10, description="Number of coins flipped per trial")
    experiment_type: str = Field(
        default="single_heads",
        description="single_heads, single_tails, exact_heads, at_least_one_head, consecutive_heads"
    )
    target_heads: Optional[int] = Field(default=1, ge=0, le=10, description="For exact_heads experiment")
    consecutive_count: Optional[int] = Field(default=2, ge=2, le=10, description="For consecutive_heads experiment")
    seed: Optional[int] = Field(default=None, description="Optional random seed for reproducibility")


class CoinSimulationResponse(BaseModel):
    config: Dict[str, Any]
    total_trials: int
    num_coins: int
    successful_outcomes: int
    total_tosses: int
    heads_count: int
    tails_count: int
    experimental_probability: float
    theoretical_probability: float
    absolute_error: float
    percentage_error: Optional[float]
    standard_error: float
    confidence_interval_95: List[float]
    sample_flips: List[List[str]]  # First few trials (e.g. [['H'], ['T'], ...])
    heads_distribution: Dict[int, int]  # Frequency of 0 heads, 1 head, 2 heads, etc.
    convergence_data: List[ConvergencePoint]
    math_explanation: MathExplanation


# ---------------------------------------------------------------------------
# Dice Schemas
# ---------------------------------------------------------------------------

class DiceSimulationRequest(BaseModel):
    num_dice: int = Field(default=2, ge=1, le=3, description="Number of dice rolled per trial (1, 2, or 3)")
    num_trials: int = Field(default=1000, ge=1, le=1000000, description="Total number of experiment trials")
    experiment_type: str = Field(
        default="sum_7",
        description="specific_number, even_number, odd_number, prime_number, sum_target, doubles, at_least_one_six"
    )
    target_number: Optional[int] = Field(default=6, ge=1, le=6, description="For specific_number experiment")
    target_sum: Optional[int] = Field(default=7, ge=2, le=18, description="Target sum for sum_target experiment")
    seed: Optional[int] = Field(default=None, description="Optional random seed for reproducibility")


class DiceSimulationResponse(BaseModel):
    config: Dict[str, Any]
    total_trials: int
    num_dice: int
    successful_outcomes: int
    experimental_probability: float
    theoretical_probability: float
    absolute_error: float
    percentage_error: Optional[float]
    standard_error: float
    confidence_interval_95: List[float]
    face_frequencies: Dict[int, int]  # 1..6 individual face counts
    sum_distribution: Dict[int, Dict[str, Union[int, float]]]  # sum -> {count, experimental_p, theoretical_p}
    sample_rolls: List[List[int]]  # First few trials (e.g. [[3, 4], [6, 1], ...])
    convergence_data: List[ConvergencePoint]
    math_explanation: MathExplanation


# ---------------------------------------------------------------------------
# Card Schemas
# ---------------------------------------------------------------------------

class CardSimulationRequest(BaseModel):
    num_trials: int = Field(default=1000, ge=1, le=500000, description="Total number of experiment trials")
    cards_drawn: int = Field(default=1, ge=1, le=5, description="Number of cards drawn per trial")
    replacement: bool = Field(default=False, description="True = with replacement, False = without replacement")
    experiment_type: str = Field(
        default="draw_ace",
        description="draw_ace, draw_king, draw_queen, draw_face_card, draw_red, draw_black, draw_suit, two_aces, at_least_one_ace"
    )
    target_suit: Optional[str] = Field(default="hearts", description="hearts, diamonds, spades, clubs")
    seed: Optional[int] = Field(default=None, description="Optional random seed for reproducibility")


class CardItem(BaseModel):
    suit: str       # "hearts", "diamonds", "spades", "clubs"
    symbol: str     # "♥", "♦", "♠", "♣"
    rank: str       # "A", "2".."10", "J", "Q", "K"
    color: str      # "red", "black"
    code: str       # "A♥", "10♠"


class CardSimulationResponse(BaseModel):
    config: Dict[str, Any]
    total_trials: int
    cards_drawn: int
    replacement: bool
    successful_outcomes: int
    experimental_probability: float
    theoretical_probability: float
    absolute_error: float
    percentage_error: Optional[float]
    standard_error: float
    confidence_interval_95: List[float]
    suit_distribution: Dict[str, int]
    rank_distribution: Dict[str, int]
    sample_hands: List[List[CardItem]]  # First few trials of drawn hands
    convergence_data: List[ConvergencePoint]
    math_explanation: MathExplanation


# ---------------------------------------------------------------------------
# Statistics / Law of Large Numbers Schemas
# ---------------------------------------------------------------------------

class LLNScalePoint(BaseModel):
    trials: int
    experimental: float
    theoretical: float
    absolute_error: float
    percentage_error: Optional[float]
    standard_error: float
    margin_of_error: float
    sample_variance: float


class LLNAnalysisRequest(BaseModel):
    experiment_domain: str = Field(default="coin", description="'coin', 'dice', or 'card'")
    scenario: str = Field(default="fair_coin", description="Sub-scenario to test across scales")
    seed: Optional[int] = Field(default=None, description="Optional random seed")


class LLNAnalysisResponse(BaseModel):
    domain: str
    scenario: str
    theoretical_probability: float
    scales: List[LLNScalePoint]
    insight: str
    math_summary: str
