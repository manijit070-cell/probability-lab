"""
Mathematical probability and statistical utility functions.
Handles theoretical/experimental probability calculations, errors,
confidence intervals, combinatorics, and convergence generation.
"""

import math
from typing import List, Dict, Any, Optional, Tuple


def combinations(n: int, k: int) -> int:
    """Calculate n choose k: C(n, k) = n! / (k! * (n - k)!)."""
    if k < 0 or k > n:
        return 0
    return math.comb(n, k)


def calculate_errors(experimental_p: float, theoretical_p: float) -> Tuple[float, Optional[float]]:
    """
    Calculate Absolute Error and Percentage Error.
    Absolute Error = |Experimental - Theoretical|
    Percentage Error = (|Experimental - Theoretical| / Theoretical) * 100
    Returns: (absolute_error, percentage_error)
    """
    abs_err = abs(experimental_p - theoretical_p)
    if theoretical_p > 0:
        pct_err = (abs_err / theoretical_p) * 100.0
    else:
        pct_err = None  # Undefined when theoretical is 0
    return round(abs_err, 6), (round(pct_err, 4) if pct_err is not None else None)


def calculate_confidence_interval_95(p: float, n: int) -> Tuple[float, float, float]:
    """
    Calculate the standard error of a proportion and the Wald 95% confidence interval:
    SE = sqrt( p * (1 - p) / n )
    Margin of Error = 1.96 * SE
    CI = [p - ME, p + ME] (clamped to [0, 1])
    Returns: (standard_error, ci_lower, ci_upper)
    """
    if n <= 0:
        return 0.0, 0.0, 0.0
    
    # Use proportion clamped between 0 and 1
    p_clamped = max(0.0, min(1.0, p))
    variance_prop = (p_clamped * (1.0 - p_clamped)) / n
    se = math.sqrt(variance_prop)
    margin = 1.96 * se
    
    ci_lower = max(0.0, p - margin)
    ci_upper = min(1.0, p + margin)
    
    return round(se, 6), round(ci_lower, 6), round(ci_upper, 6)


def generate_convergence_points(
    cumulative_successes: List[int],
    total_trials: int,
    theoretical_p: float,
    max_points: int = 50
) -> List[Dict[str, Any]]:
    """
    Downsamples cumulative trial data into at most `max_points` evenly spaced
    or strategically spaced checkpoints for smooth rendering in frontend charts.
    """
    if total_trials <= 0 or not cumulative_successes:
        return []
    
    if total_trials <= max_points:
        step = 1
        indices = list(range(len(cumulative_successes)))
    else:
        step = max(1, total_trials // max_points)
        indices = list(range(0, total_trials, step))
        if indices[-1] != total_trials - 1:
            indices.append(total_trials - 1)

    points = []
    for idx in indices:
        trial_num = idx + 1
        success_count = cumulative_successes[idx]
        exp_p = success_count / trial_num
        abs_err = abs(exp_p - theoretical_p)
        points.append({
            "trial": trial_num,
            "experimental": round(exp_p, 5),
            "theoretical": round(theoretical_p, 5),
            "absolute_error": round(abs_err, 5),
            "successes": success_count
        })

    return points
