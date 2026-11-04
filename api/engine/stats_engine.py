"""
Statistics & Analytics Engine.
Analyzes convergence across scales to demonstrate the Law of Large Numbers (LLN),
variance decay, and empirical error rates.
"""

import math
from typing import Dict, Any, List
import numpy as np

from api.engine.probability import calculate_errors, calculate_confidence_interval_95
from api.engine.coin_engine import simulate_coin_tosses
from api.engine.dice_engine import simulate_dice_rolls
from api.engine.card_engine import simulate_card_draws


def run_lln_multi_scale(
    domain: str = "coin",
    scenario: str = "fair_coin",
    seed: int = None
) -> Dict[str, Any]:
    """
    Executes simulations across 5 logarithmic orders of magnitude:
    10, 100, 1,000, 10,000, 100,000 trials.
    Computes theoretical baseline, experimental error decay,
    and standard error reduction (1 / sqrt(N)).
    """
    scales = [10, 100, 1000, 10000, 100000]
    scale_results = []
    theo_p = 0.5

    if domain == "coin":
        theo_p = 0.5
        for n in scales:
            res = simulate_coin_tosses(
                num_trials=n,
                num_coins=1,
                experiment_type="single_heads",
                seed=(seed + n) if seed is not None else None
            )
            se = res["standard_error"]
            margin = round(1.96 * se, 6)
            # Sample variance of Bernoulli trial: p*(1-p)
            exp_p = res["experimental_probability"]
            sample_var = round(exp_p * (1.0 - exp_p), 6)

            scale_results.append({
                "trials": n,
                "experimental": exp_p,
                "theoretical": theo_p,
                "absolute_error": res["absolute_error"],
                "percentage_error": res["percentage_error"],
                "standard_error": se,
                "margin_of_error": margin,
                "sample_variance": sample_var
            })

    elif domain == "dice":
        theo_p = 6 / 36.0  # Sum of 7 -> 1/6
        for n in scales:
            res = simulate_dice_rolls(
                num_dice=2,
                num_trials=n,
                experiment_type="sum_7",
                seed=(seed + n) if seed is not None else None
            )
            se = res["standard_error"]
            margin = round(1.96 * se, 6)
            exp_p = res["experimental_probability"]
            sample_var = round(exp_p * (1.0 - exp_p), 6)

            scale_results.append({
                "trials": n,
                "experimental": exp_p,
                "theoretical": round(theo_p, 6),
                "absolute_error": res["absolute_error"],
                "percentage_error": res["percentage_error"],
                "standard_error": se,
                "margin_of_error": margin,
                "sample_variance": sample_var
            })

    elif domain == "card":
        theo_p = 4 / 52.0  # Drawing an Ace -> 1/13
        for n in scales:
            res = simulate_card_draws(
                num_trials=n,
                cards_drawn=1,
                replacement=False,
                experiment_type="draw_ace",
                seed=(seed + n) if seed is not None else None
            )
            se = res["standard_error"]
            margin = round(1.96 * se, 6)
            exp_p = res["experimental_probability"]
            sample_var = round(exp_p * (1.0 - exp_p), 6)

            scale_results.append({
                "trials": n,
                "experimental": exp_p,
                "theoretical": round(theo_p, 6),
                "absolute_error": res["absolute_error"],
                "percentage_error": res["percentage_error"],
                "standard_error": se,
                "margin_of_error": margin,
                "sample_variance": sample_var
            })

    insight = (
        f"Notice how the absolute error and standard error shrink systematically as N scales from 10 to 100,000. "
        f"Because the Standard Error of a sample proportion scales as O(1 / sqrt(N)), increasing trials by a factor of 100 "
        f"reduces statistical uncertainty by a factor of 10."
    )

    math_summary = (
        r"\text{Weak Law of Large Numbers (Khinchin's theorem): } "
        r"\lim_{n \to \infty} P(|\bar{X}_n - \mu| \ge \varepsilon) = 0 \quad (\forall \varepsilon > 0)."
    )

    return {
        "domain": domain,
        "scenario": scenario,
        "theoretical_probability": round(theo_p, 6),
        "scales": scale_results,
        "insight": insight,
        "math_summary": math_summary
    }
