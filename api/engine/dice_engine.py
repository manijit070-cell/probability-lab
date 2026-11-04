"""
Dice Simulation Engine.
Implements exact combinatorial mathematics and stochastic simulation of dice rolls.
"""

import math
from typing import Dict, Any, List, Tuple
import numpy as np

from api.engine.probability import (
    calculate_errors,
    calculate_confidence_interval_95,
    generate_convergence_points,
)

# Precomputed exact number of favorable pairs for sum of two dice (2 to 12)
TWO_DICE_SUM_FAVORABLE: Dict[int, int] = {
    2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6,
    8: 5, 9: 4, 10: 3, 11: 2, 12: 1
}

TWO_DICE_PAIRS: Dict[int, List[Tuple[int, int]]] = {
    2: [(1, 1)],
    3: [(1, 2), (2, 1)],
    4: [(1, 3), (2, 2), (3, 1)],
    5: [(1, 4), (2, 3), (3, 2), (4, 1)],
    6: [(1, 5), (2, 4), (3, 3), (4, 2), (5, 1)],
    7: [(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)],
    8: [(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)],
    9: [(3, 6), (4, 5), (5, 4), (6, 3)],
    10: [(4, 6), (5, 5), (6, 4)],
    11: [(5, 6), (6, 5)],
    12: [(6, 6)],
}


def count_3dice_sum_favorable(s: int) -> int:
    """Exact combinatorial count for sum of three dice (3 to 18)."""
    count = 0
    for d1 in range(1, 7):
        for d2 in range(1, 7):
            for d3 in range(1, 7):
                if d1 + d2 + d3 == s:
                    count += 1
    return count


def get_theoretical_dice(
    experiment_type: str,
    num_dice: int,
    target_number: int,
    target_sum: int
) -> Tuple[float, int, int, Dict[str, Any]]:
    """
    Computes exact theoretical probability and educational math breakdown for dice.
    """
    sample_space_size = 6 ** num_dice

    if experiment_type == "specific_number":
        target = max(1, min(6, target_number))
        if num_dice == 1:
            fav = 1
            total = 6
            theo_p = 1 / 6
            title = f"Roll Single Die: Face {target}"
            formula = rf"P(X = {target}) = \frac{{1}}{{6}}"
            calc_steps = [
                r"\text{Sample space } S = \{1, 2, 3, 4, 5, 6\} \implies |S| = 6",
                rf"\text{{Favorable outcome }} E = \{{{target}\}} \implies |E| = 1",
                r"P(E) = \frac{1}{6} \approx 0.1667"
            ]
            frac_str = "1/6"
        else:
            # At least one die showing target
            total = 6 ** num_dice
            fav = total - (5 ** num_dice)
            theo_p = fav / total
            title = f"At least one {target} across {num_dice} Dice"
            formula = rf"P(E) = 1 - \left(\frac{{5}}{{6}}\right)^{{{num_dice}}}"
            calc_steps = [
                rf"\text{{Total outcomes }} |S| = 6^{{{num_dice}}} = {total}",
                rf"\text{{Outcomes with no {target}s }} = 5^{{{num_dice}}} = {5 ** num_dice}",
                rf"\text{{Favorable outcomes }} = {total} - {5 ** num_dice} = {fav}",
                rf"P(E) = \frac{{{fav}}}{{{total}}} \approx {round(theo_p, 4)}"
            ]
            gcd = math.gcd(fav, total)
            frac_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "even_number":
        # 1 die even {2, 4, 6}
        fav = (3 * (6 ** (num_dice - 1))) if num_dice == 1 else (6 ** num_dice) // 2
        total = 6 ** num_dice
        theo_p = 0.5
        title = f"Even Number Outcome ({num_dice} {'Die' if num_dice==1 else 'Dice'})"
        formula = r"P(\text{Even}) = \frac{|\{2, 4, 6\}|}{|\{1, 2, 3, 4, 5, 6\}|} = \frac{3}{6} = \frac{1}{2}"
        calc_steps = [
            r"\text{Equally likely faces } \{1, 2, 3, 4, 5, 6\}",
            r"\text{Even faces } E = \{2, 4, 6\} \implies |E| = 3",
            r"P(\text{Even}) = \frac{3}{6} = 0.5000"
        ]
        frac_str = "1/2"

    elif experiment_type == "odd_number":
        total = 6 ** num_dice
        theo_p = 0.5
        fav = total // 2
        title = f"Odd Number Outcome ({num_dice} {'Die' if num_dice==1 else 'Dice'})"
        formula = r"P(\text{Odd}) = \frac{|\{1, 3, 5\}|}{|\{1, 2, 3, 4, 5, 6\}|} = \frac{3}{6} = \frac{1}{2}"
        calc_steps = [
            r"\text{Odd faces } E = \{1, 3, 5\} \implies |E| = 3",
            r"P(\text{Odd}) = \frac{3}{6} = 0.5000"
        ]
        frac_str = "1/2"

    elif experiment_type == "prime_number":
        # Prime faces in {1..6} are {2, 3, 5}
        total = 6
        fav = 3
        theo_p = 0.5
        title = "Prime Number on a Standard Die"
        formula = r"P(\text{Prime}) = \frac{|\{2, 3, 5\}|}{6} = \frac{3}{6} = \frac{1}{2}"
        calc_steps = [
            r"\text{Sample space } S = \{1, 2, 3, 4, 5, 6\}",
            r"\text{Prime numbers in range: } \{2, 3, 5\} \implies |E| = 3 \text{ (1 is neither prime nor composite)}",
            r"P(\text{Prime}) = \frac{3}{6} = 0.5000"
        ]
        frac_str = "1/2"

    elif experiment_type in ("sum_target", "sum_7", "sum_2", "sum_12"):
        s = target_sum if experiment_type == "sum_target" else (7 if experiment_type == "sum_7" else (2 if experiment_type == "sum_2" else 12))
        
        if num_dice == 2:
            s_clamped = max(2, min(12, s))
            fav = TWO_DICE_SUM_FAVORABLE.get(s_clamped, 0)
            total = 36
            theo_p = fav / total
            pairs_str = ", ".join(f"({a},{b})" for a, b in TWO_DICE_PAIRS.get(s_clamped, []))
            title = f"Rolling Two Fair Dice: Sum = {s_clamped}"
            formula = rf"P(S = {s_clamped}) = \frac{{\text{{Count of pairs summing to }} {s_clamped}}}{{36}}"
            calc_steps = [
                r"\text{Sample space: } |S| = 6 \times 6 = 36 \text{ ordered pairs } (d_1, d_2)",
                rf"\text{{Favorable pairs: }} \{{{pairs_str}\}} \implies |E| = {fav}",
                rf"P(S = {s_clamped}) = \frac{{{fav}}}{{36}} \approx {round(theo_p, 4)}"
            ]
            gcd = math.gcd(fav, total)
            frac_str = f"{fav // gcd}/{total // gcd}"
        elif num_dice == 3:
            s_clamped = max(3, min(18, s))
            fav = count_3dice_sum_favorable(s_clamped)
            total = 216
            theo_p = fav / total
            title = f"Rolling Three Fair Dice: Sum = {s_clamped}"
            formula = rf"P(S = {s_clamped}) = \frac{{\text{{Count of triplets summing to }} {s_clamped}}}{{216}}"
            calc_steps = [
                r"\text{Sample space: } |S| = 6^3 = 216 \text{ ordered triplets } (d_1, d_2, d_3)",
                rf"\text{{Favorable triplets summing to }} {s_clamped}: |E| = {fav}",
                rf"P(S = {s_clamped}) = \frac{{{fav}}}{{216}} \approx {round(theo_p, 4)}"
            ]
            gcd = math.gcd(fav, total)
            frac_str = f"{fav // gcd}/{total // gcd}"
        else:
            # 1 die sum
            fav = 1 if 1 <= s <= 6 else 0
            total = 6
            theo_p = fav / total
            title = f"Single Die Face = {s}"
            formula = rf"P(X = {s}) = \frac{{{fav}}}{{6}}"
            calc_steps = [rf"P(X = {s}) = \frac{{{fav}}}{{6}}"]
            frac_str = f"{fav}/6"

    elif experiment_type == "doubles":
        # 2 dice doubles: (1,1)..(6,6)
        total = 36
        fav = 6
        theo_p = 6 / 36
        title = "Rolling Doubles with Two Fair Dice"
        formula = r"P(\text{Doubles}) = \frac{|\{(1,1), (2,2), (3,3), (4,4), (5,5), (6,6)\}|}{36} = \frac{6}{36} = \frac{1}{6}"
        calc_steps = [
            r"\text{Sample space: } 6 \times 6 = 36 \text{ possible pairs}",
            r"\text{Doubles: } E = \{(1,1), (2,2), (3,3), (4,4), (5,5), (6,6)\} \implies |E| = 6",
            r"P(\text{Doubles}) = \frac{6}{36} = \frac{1}{6} \approx 0.1667"
        ]
        frac_str = "1/6"

    elif experiment_type == "at_least_one_six":
        total = 6 ** num_dice
        no_six = 5 ** num_dice
        fav = total - no_six
        theo_p = fav / total
        title = f"At Least One Six Across {num_dice} Dice"
        formula = rf"P(\ge 1 \text{{ Six}}) = 1 - P(\text{{No Sixes}}) = 1 - \left(\frac{{5}}{{6}}\right)^{{{num_dice}}}"
        calc_steps = [
            rf"\text{{Total outcomes }} |S| = 6^{{{num_dice}}} = {total}",
            rf"\text{{Outcomes without any 6: }} 5^{{{num_dice}}} = {no_six}",
            rf"\text{{Favorable outcomes: }} {total} - {no_six} = {fav}",
            rf"P(\ge 1 \text{{ Six}}) = \frac{{{fav}}}{{{total}}} \approx {round(theo_p, 4)}"
        ]
        gcd = math.gcd(fav, total)
        frac_str = f"{fav // gcd}/{total // gcd}"

    else:
        fav = 1
        total = 6
        theo_p = 1 / 6
        title = "Standard Die Roll"
        formula = r"P(X) = 1/6"
        calc_steps = [r"P(X) = 1/6 \approx 0.1667"]
        frac_str = "1/6"

    explanation = {
        "title": title,
        "sample_space_description": f"All {total} equally likely ordered tuples when rolling {num_dice} six-sided dice",
        "sample_space_size": total,
        "favorable_outcomes_description": f"Outcomes satisfying '{title}'",
        "favorable_outcomes_count": fav,
        "formula_latex": formula,
        "calculation_steps": calc_steps,
        "theoretical_probability_fraction": frac_str,
        "theoretical_probability_decimal": round(theo_p, 6),
        "notes": (
            "When rolling two dice, the sum distribution forms a triangular probability distribution "
            "peaking at 7 (16.67%) because 7 has the highest number of combinations (6 permutations). "
            "Sums like 2 and 12 are rare (2.78% each) with only 1 combination each."
        )
    }

    return theo_p, total, fav, explanation


def simulate_dice_rolls(
    num_dice: int = 2,
    num_trials: int = 1000,
    experiment_type: str = "sum_7",
    target_number: int = 6,
    target_sum: int = 7,
    seed: int = None
) -> Dict[str, Any]:
    """
    Executes vectorized stochastic dice roll trials using NumPy and Python.
    Calculates sum distributions, face frequencies, errors, and convergence.
    """
    rng = np.random.default_rng(seed)

    # Effective target sum if preset
    eff_sum = target_sum
    if experiment_type == "sum_7":
        eff_sum = 7
    elif experiment_type == "sum_2":
        eff_sum = 2
    elif experiment_type == "sum_12":
        eff_sum = 12

    theo_p, sample_space_size, favorable_count, explanation = get_theoretical_dice(
        experiment_type=experiment_type,
        num_dice=num_dice,
        target_number=target_number,
        target_sum=eff_sum
    )

    # Generate rolls: integers from 1 to 6
    # shape: (num_trials, num_dice)
    rolls = rng.integers(1, 7, size=(num_trials, num_dice), dtype=np.int8)

    # Determine trial success
    if experiment_type == "specific_number":
        target = max(1, min(6, target_number))
        if num_dice == 1:
            success_mask = (rolls[:, 0] == target)
        else:
            success_mask = np.any(rolls == target, axis=1)

    elif experiment_type == "even_number":
        if num_dice == 1:
            success_mask = (rolls[:, 0] % 2 == 0)
        else:
            # sum is even or single die even
            success_mask = (np.sum(rolls, axis=1) % 2 == 0)

    elif experiment_type == "odd_number":
        if num_dice == 1:
            success_mask = (rolls[:, 0] % 2 != 0)
        else:
            success_mask = (np.sum(rolls, axis=1) % 2 != 0)

    elif experiment_type == "prime_number":
        # primes in 1..6 are {2, 3, 5}
        if num_dice == 1:
            success_mask = np.isin(rolls[:, 0], [2, 3, 5])
        else:
            # primes in sums up to 18
            primes = {2, 3, 5, 7, 11, 13, 17}
            sums = np.sum(rolls, axis=1)
            success_mask = np.isin(sums, list(primes))

    elif experiment_type in ("sum_target", "sum_7", "sum_2", "sum_12"):
        sums = np.sum(rolls, axis=1)
        success_mask = (sums == eff_sum)

    elif experiment_type == "doubles":
        if num_dice >= 2:
            success_mask = (rolls[:, 0] == rolls[:, 1])
        else:
            success_mask = np.zeros(num_trials, dtype=bool)

    elif experiment_type == "at_least_one_six":
        success_mask = np.any(rolls == 6, axis=1)

    else:
        success_mask = (rolls[:, 0] == 6)

    successful_outcomes = int(np.sum(success_mask))
    exp_p = successful_outcomes / num_trials

    # Error analysis & CI
    abs_err, pct_err = calculate_errors(exp_p, theo_p)
    se, ci_low, ci_high = calculate_confidence_interval_95(exp_p, num_trials)

    # Face frequencies across all individual dice rolled
    flat_rolls = rolls.flatten()
    unique_faces, face_counts = np.unique(flat_rolls, return_counts=True)
    face_frequencies = {i: 0 for i in range(1, 7)}
    for f, c in zip(unique_faces, face_counts):
        face_frequencies[int(f)] = int(c)

    # Sum distribution across all trials
    trial_sums = np.sum(rolls, axis=1)
    min_sum = num_dice * 1
    max_sum = num_dice * 6
    sum_distribution: Dict[int, Dict[str, Any]] = {}

    for s_val in range(min_sum, max_sum + 1):
        actual_count = int(np.sum(trial_sums == s_val))
        actual_p = round(actual_count / num_trials, 5)

        # Theoretical probability of sum
        if num_dice == 2:
            theo_s_p = TWO_DICE_SUM_FAVORABLE.get(s_val, 0) / 36.0
        elif num_dice == 3:
            theo_s_p = count_3dice_sum_favorable(s_val) / 216.0
        else:
            theo_s_p = 1.0 / 6.0

        sum_distribution[s_val] = {
            "count": actual_count,
            "experimental_p": actual_p,
            "theoretical_p": round(theo_s_p, 5)
        }

    # Sample rolls for UI visualization (first 12)
    sample_size = min(12, num_trials)
    sample_rolls = rolls[:sample_size].tolist()

    # Convergence data
    cumulative_successes = np.cumsum(success_mask).tolist()
    convergence_data = generate_convergence_points(
        cumulative_successes=cumulative_successes,
        total_trials=num_trials,
        theoretical_p=theo_p,
        max_points=50
    )

    return {
        "config": {
            "num_dice": num_dice,
            "num_trials": num_trials,
            "experiment_type": experiment_type,
            "target_number": target_number,
            "target_sum": eff_sum,
            "seed": seed
        },
        "total_trials": num_trials,
        "num_dice": num_dice,
        "successful_outcomes": successful_outcomes,
        "experimental_probability": round(exp_p, 6),
        "theoretical_probability": round(theo_p, 6),
        "absolute_error": abs_err,
        "percentage_error": pct_err,
        "standard_error": se,
        "confidence_interval_95": [ci_low, ci_high],
        "face_frequencies": face_frequencies,
        "sum_distribution": sum_distribution,
        "sample_rolls": sample_rolls,
        "convergence_data": convergence_data,
        "math_explanation": explanation
    }
