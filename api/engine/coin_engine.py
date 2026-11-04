"""
Coin Simulation Engine.
Implements exact combinatorial mathematics and stochastic simulation of coin tosses.
"""

import math
import random
from typing import Dict, Any, List, Tuple
import numpy as np

from api.engine.probability import (
    combinations,
    calculate_errors,
    calculate_confidence_interval_95,
    generate_convergence_points,
)


def has_consecutive_heads(tosses: List[int], r: int) -> bool:
    """Check if binary sequence of tosses (1=H, 0=T) has at least r consecutive heads."""
    current_run = 0
    for t in tosses:
        if t == 1:
            current_run += 1
            if current_run >= r:
                return True
        else:
            current_run = 0
    return False


def get_theoretical_coin(experiment_type: str, num_coins: int, target_heads: int, consecutive_count: int) -> Tuple[float, int, int, Dict[str, Any]]:
    """
    Computes exact theoretical probability, sample space size, and favorable outcome count.
    Returns: (theoretical_p, sample_space_size, favorable_count, explanation_dict)
    """
    total_outcomes = 2 ** num_coins

    if experiment_type in ("single_heads", "single_tails"):
        theo_p = 0.5
        fav = 1
        total = 2
        title = "Fair Coin Toss"
        event_name = "Heads (H)" if experiment_type == "single_heads" else "Tails (T)"
        formula = r"P(E) = \frac{|E|}{|S|} = \frac{1}{2} = 0.5"
        calc_steps = [
            r"\text{Sample space } S = \{H, T\} \implies |S| = 2",
            rf"\text{{Favorable outcome }} E = \{{{event_name[0]}\}} \implies |E| = 1",
            r"P(E) = \frac{1}{2} = 0.5000"
        ]
        fraction_str = "1/2"

    elif experiment_type == "exact_heads":
        m = max(0, min(num_coins, target_heads))
        fav = combinations(num_coins, m)
        total = total_outcomes
        theo_p = fav / total
        title = f"Exactly {m} Heads in {num_coins} Coin Tosses"
        formula = rf"P(X = {m}) = \binom{{{num_coins}}}{{{m}}} \left(\frac{{1}}{{2}}\right)^{{{num_coins}}}"
        calc_steps = [
            rf"\text{{Total microstates: }} |S| = 2^{{{num_coins}}} = {total}",
            rf"\text{{Number of permutations with {m} Heads: }} \binom{{{num_coins}}}{{{m}}} = \frac{{{num_coins}!}}{{{m}!({num_coins}-{m})!}} = {fav}",
            rf"P(X = {m}) = \frac{{{fav}}}{{{total}}} \approx {round(theo_p, 4)}"
        ]
        gcd = math.gcd(fav, total)
        fraction_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "at_least_one_head":
        # Complement rule: P(at least 1 H) = 1 - P(all T) = 1 - (1/2^k)
        total = total_outcomes
        fav = total - 1  # only all tails is excluded
        theo_p = fav / total
        title = f"At Least One Head in {num_coins} Coin Tosses"
        formula = rf"P(\ge 1 \text{{ Head}}) = 1 - P(\text{{Zero Heads}}) = 1 - \left(\frac{{1}}{{2}}\right)^{{{num_coins}}}"
        all_tails_sample = ", ".join(["T"] * num_coins)
        calc_steps = [
            rf"\text{{Total possible outcomes: }} |S| = 2^{{{num_coins}}} = {total}",
            rf"\text{{Complement event (All Tails): }} \{{({all_tails_sample})\}} \implies 1 \text{{ outcome}}",
            rf"\text{{Favorable outcomes: }} |E| = 2^{{{num_coins}}} - 1 = {fav}",
            rf"P(E) = \frac{{{fav}}}{{{total}}} = 1 - \frac{{1}}{{{total}}} \approx {round(theo_p, 4)}"
        ]
        gcd = math.gcd(fav, total)
        fraction_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "consecutive_heads":
        r = min(num_coins, max(2, consecutive_count))
        # Exact combinatorial enumeration for k <= 10
        fav = 0
        for i in range(total_outcomes):
            # Convert integer to binary string with num_coins bits
            bits = [(i >> bit) & 1 for bit in range(num_coins)]
            if has_consecutive_heads(bits, r):
                fav += 1
        total = total_outcomes
        theo_p = fav / total
        title = f"At Least {r} Consecutive Heads in {num_coins} Tosses"
        formula = rf"P(\text{{Run of }} \ge {r} \text{{ Heads}})"
        calc_steps = [
            rf"\text{{Total binary sequences of length }} {num_coins}: 2^{{{num_coins}}} = {total}",
            rf"\text{{Sequences containing consecutive '1's of run length }} \ge {r}: {fav}",
            rf"P(E) = \frac{{{fav}}}{{{total}}} \approx {round(theo_p, 4)}"
        ]
        gcd = math.gcd(fav, total)
        fraction_str = f"{fav // gcd}/{total // gcd}"

    else:
        # Default fair coin
        theo_p = 0.5
        fav = 1
        total = 2
        title = "Fair Coin Toss"
        formula = r"P(H) = \frac{1}{2} = 0.5"
        calc_steps = [r"P(H) = \frac{1}{2} = 0.5"]
        fraction_str = "1/2"

    explanation = {
        "title": title,
        "sample_space_description": f"All {total} equally likely ordered outcomes from flipping {num_coins} fair coin(s)",
        "sample_space_size": total,
        "favorable_outcomes_description": f"Outcomes satisfying experiment criteria '{title}'",
        "favorable_outcomes_count": fav,
        "formula_latex": formula,
        "calculation_steps": calc_steps,
        "theoretical_probability_fraction": fraction_str,
        "theoretical_probability_decimal": round(theo_p, 6),
        "notes": (
            "According to the Law of Large Numbers, as the number of independent trials increases, "
            "the experimental relative frequency converges stochastically towards this theoretical value."
        )
    }

    return theo_p, total, fav, explanation


def simulate_coin_tosses(
    num_trials: int,
    num_coins: int = 1,
    experiment_type: str = "single_heads",
    target_heads: int = 1,
    consecutive_count: int = 2,
    seed: int = None
) -> Dict[str, Any]:
    """
    Executes vectorized stochastic coin toss trials using NumPy and Python.
    Calculates exact experimental probability, theoretical baseline, errors,
    confidence intervals, and downsampled convergence trajectory.
    """
    rng = np.random.default_rng(seed)

    theo_p, sample_space_size, favorable_count, explanation = get_theoretical_coin(
        experiment_type=experiment_type,
        num_coins=num_coins,
        target_heads=target_heads,
        consecutive_count=consecutive_count
    )

    # Generate binary outcomes: 1 = Head, 0 = Tail
    # shape: (num_trials, num_coins)
    tosses = rng.integers(0, 2, size=(num_trials, num_coins), dtype=np.int8)

    # Trial success evaluation
    if experiment_type in ("single_heads", "single_tails"):
        target_val = 1 if experiment_type == "single_heads" else 0
        success_mask = (tosses[:, 0] == target_val)
    elif experiment_type == "exact_heads":
        m = max(0, min(num_coins, target_heads))
        heads_per_trial = np.sum(tosses, axis=1)
        success_mask = (heads_per_trial == m)
    elif experiment_type == "at_least_one_head":
        heads_per_trial = np.sum(tosses, axis=1)
        success_mask = (heads_per_trial >= 1)
    elif experiment_type == "consecutive_heads":
        r = min(num_coins, max(2, consecutive_count))
        # Vectorized check for small num_coins
        # For each trial, check if any sub-window of size r has all 1s
        if num_coins < r:
            success_mask = np.zeros(num_trials, dtype=bool)
        else:
            # Check sliding window
            windows = np.lib.stride_tricks.sliding_window_view(tosses, window_shape=r, axis=1)
            # sum across the window: if sum == r, it's consecutive heads
            consecutive_found = (windows.sum(axis=-1) == r).any(axis=1)
            success_mask = consecutive_found
    else:
        success_mask = (tosses[:, 0] == 1)

    successful_outcomes = int(np.sum(success_mask))
    exp_p = successful_outcomes / num_trials

    # Heads / tails counts across all individual tosses
    total_tosses = num_trials * num_coins
    heads_count = int(np.sum(tosses))
    tails_count = total_tosses - heads_count

    # Heads distribution per trial (for 0..num_coins heads)
    heads_per_trial_all = np.sum(tosses, axis=1)
    unique_counts, counts_freq = np.unique(heads_per_trial_all, return_counts=True)
    heads_distribution = {int(k): int(v) for k, v in zip(unique_counts, counts_freq)}
    for k in range(num_coins + 1):
        if k not in heads_distribution:
            heads_distribution[k] = 0

    # Error analysis & Confidence Intervals
    abs_err, pct_err = calculate_errors(exp_p, theo_p)
    se, ci_low, ci_high = calculate_confidence_interval_95(exp_p, num_trials)

    # First few sample trials for visual animation on frontend
    sample_size = min(15, num_trials)
    sample_flips = []
    for i in range(sample_size):
        row = ["H" if b == 1 else "T" for b in tosses[i]]
        sample_flips.append(row)

    # Generate cumulative convergence series
    cumulative_successes = np.cumsum(success_mask).tolist()
    convergence_data = generate_convergence_points(
        cumulative_successes=cumulative_successes,
        total_trials=num_trials,
        theoretical_p=theo_p,
        max_points=50
    )

    return {
        "config": {
            "num_trials": num_trials,
            "num_coins": num_coins,
            "experiment_type": experiment_type,
            "target_heads": target_heads,
            "consecutive_count": consecutive_count,
            "seed": seed
        },
        "total_trials": num_trials,
        "num_coins": num_coins,
        "successful_outcomes": successful_outcomes,
        "total_tosses": total_tosses,
        "heads_count": heads_count,
        "tails_count": tails_count,
        "experimental_probability": round(exp_p, 6),
        "theoretical_probability": round(theo_p, 6),
        "absolute_error": abs_err,
        "percentage_error": pct_err,
        "standard_error": se,
        "confidence_interval_95": [ci_low, ci_high],
        "sample_flips": sample_flips,
        "heads_distribution": heads_distribution,
        "convergence_data": convergence_data,
        "math_explanation": explanation
    }
