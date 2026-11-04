"""
Card Simulation Engine.
Implements exact hypergeometric and binomial sampling on a standard 52-card deck.
Accurately supports sampling with and without replacement.
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

SUITS = ["hearts", "diamonds", "spades", "clubs"]
SUIT_SYMBOLS = {"hearts": "♥", "diamonds": "♦", "spades": "♠", "clubs": "♣"}
SUIT_COLORS = {"hearts": "red", "diamonds": "red", "spades": "black", "clubs": "black"}
RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
FACE_RANKS = {"J", "Q", "K"}

# Build standard 52 card list: index 0..51
# card_id = suit_idx * 13 + rank_idx
DECK_CARDS = []
for s_idx, s in enumerate(SUITS):
    for r_idx, r in enumerate(RANKS):
        DECK_CARDS.append({
            "id": s_idx * 13 + r_idx,
            "suit": s,
            "symbol": SUIT_SYMBOLS[s],
            "rank": r,
            "color": SUIT_COLORS[s],
            "code": f"{r}{SUIT_SYMBOLS[s]}",
            "is_ace": (r == "A"),
            "is_face": (r in FACE_RANKS)
        })


def get_card_by_id(card_id: int) -> Dict[str, Any]:
    return DECK_CARDS[card_id % 52]


def get_theoretical_card(
    experiment_type: str,
    cards_drawn: int,
    replacement: bool,
    target_suit: str = "hearts"
) -> Tuple[float, int, int, Dict[str, Any]]:
    """
    Calculates exact combinatorial or binomial probability for card draws.
    Distinguishes strictly between replacement (Binomial) and without replacement (Hypergeometric).
    """
    suit_name = target_suit.lower() if target_suit else "hearts"
    suit_sym = SUIT_SYMBOLS.get(suit_name, "♥")

    if experiment_type in ("draw_ace", "draw_king", "draw_queen"):
        target_label = "Ace" if experiment_type == "draw_ace" else ("King" if experiment_type == "draw_king" else "Queen")
        target_rank = "A" if experiment_type == "draw_ace" else ("K" if experiment_type == "draw_king" else "Q")
        
        if cards_drawn == 1:
            fav = 4
            total = 52
            theo_p = 4 / 52  # 1/13
            title = f"Draw a {target_label} (Single Draw)"
            formula = rf"P(\text{{{target_label}}}) = \frac{{4}}{{52}} = \frac{{1}}{{13}}"
            calc_steps = [
                r"\text{Deck size: } |S| = 52 \text{ standard cards}",
                rf"\text{{Number of {target_label}s (one per suit): }} |E| = 4",
                r"P(\text{Draw}) = \frac{4}{52} = \frac{1}{13} \approx 0.0769"
            ]
            frac_str = "1/13"
        else:
            # At least one target in cards_drawn
            if replacement:
                theo_p = 1.0 - ((48 / 52) ** cards_drawn)
                fav = int(round(theo_p * (52 ** cards_drawn)))
                total = 52 ** cards_drawn
                title = f"At Least One {target_label} in {cards_drawn} Draws (With Replacement)"
                formula = rf"P(\ge 1 \text{{ {target_label}}}) = 1 - \left(\frac{{48}}{{52}}\right)^{{{cards_drawn}}}"
                calc_steps = [
                    rf"\text{{Independent draws with replacement: }} P(\text{{No {target_label}}}) = \left(\frac{{48}}{{52}}\right)^{{{cards_drawn}}} \approx {round((48/52)**cards_drawn, 4)}",
                    rf"P(\ge 1 \text{{ {target_label}}}) = 1 - \left(\frac{{48}}{{52}}\right)^{{{cards_drawn}}} \approx {round(theo_p, 4)}"
                ]
                frac_str = f"~{round(theo_p, 4)}"
            else:
                total_combs = combinations(52, cards_drawn)
                non_targets = combinations(48, cards_drawn)
                fav = total_combs - non_targets
                total = total_combs
                theo_p = fav / total
                title = f"At Least One {target_label} in {cards_drawn} Draws (Without Replacement)"
                formula = rf"P(\ge 1 \text{{ {target_label}}}) = 1 - \frac{{\binom{{48}}{{{cards_drawn}}}}}{{\binom{{52}}{{{cards_drawn}}}}}"
                calc_steps = [
                    rf"\text{{Hypergeometric distribution without replacement:}}",
                    rf"\text{{Total card combinations: }} \binom{{52}}{{{cards_drawn}}} = {total_combs}",
                    rf"\text{{Combinations without {target_label}: }} \binom{{48}}{{{cards_drawn}}} = {non_targets}",
                    rf"P(\ge 1 \text{{ {target_label}}}) = 1 - \frac{{{non_targets}}}{{{total_combs}}} = \frac{{{fav}}}{{{total_combs}}} \approx {round(theo_p, 4)}"
                ]
                gcd = math.gcd(fav, total)
                frac_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "draw_face_card":
        # 12 face cards (J, Q, K of 4 suits)
        if cards_drawn == 1:
            fav = 12
            total = 52
            theo_p = 12 / 52  # 3/13
            title = "Draw a Face Card (J, Q, or K)"
            formula = r"P(\text{Face Card}) = \frac{12}{52} = \frac{3}{13}"
            calc_steps = [
                r"\text{Total cards in deck: } 52",
                r"\text{Face cards: } 4 \times 3 (\text{Jack, Queen, King}) = 12",
                r"P(\text{Face Card}) = \frac{12}{52} = \frac{3}{13} \approx 0.2308"
            ]
            frac_str = "3/13"
        else:
            if replacement:
                theo_p = 1.0 - ((40 / 52) ** cards_drawn)
                total = 52 ** cards_drawn
                fav = int(round(theo_p * total))
                title = f"At Least One Face Card in {cards_drawn} Draws (With Replacement)"
                formula = rf"P(\ge 1 \text{{ Face}}) = 1 - \left(\frac{{40}}{{52}}\right)^{{{cards_drawn}}}"
                calc_steps = [
                    rf"P(\ge 1 \text{{ Face}}) = 1 - \left(\frac{{40}}{{52}}\right)^{{{cards_drawn}}} \approx {round(theo_p, 4)}"
                ]
                frac_str = f"~{round(theo_p, 4)}"
            else:
                total_combs = combinations(52, cards_drawn)
                non_face = combinations(40, cards_drawn)
                fav = total_combs - non_face
                total = total_combs
                theo_p = fav / total
                title = f"At Least One Face Card in {cards_drawn} Draws (Without Replacement)"
                formula = rf"P(\ge 1 \text{{ Face}}) = 1 - \frac{{\binom{{40}}{{{cards_drawn}}}}}{{\binom{{52}}{{{cards_drawn}}}}}"
                calc_steps = [
                    rf"\text{{Total combinations: }} \binom{{52}}{{{cards_drawn}}} = {total_combs}",
                    rf"\text{{Non-face card combinations: }} \binom{{40}}{{{cards_drawn}}} = {non_face}",
                    rf"P = \frac{{{fav}}}{{{total_combs}}} \approx {round(theo_p, 4)}"
                ]
                gcd = math.gcd(fav, total)
                frac_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type in ("draw_red", "draw_black"):
        # 26 red, 26 black
        target_name = "Red" if experiment_type == "draw_red" else "Black"
        if cards_drawn == 1:
            fav = 26
            total = 52
            theo_p = 0.5
            title = f"Draw a {target_name} Card"
            formula = rf"P(\text{{{target_name}}}) = \frac{{26}}{{52}} = \frac{{1}}{{2}}"
            calc_steps = [
                rf"\text{{Total {target_name} cards (2 suits }} \times 13\text{{): }} 26",
                r"P = \frac{26}{52} = 0.5000"
            ]
            frac_str = "1/2"
        else:
            if replacement:
                theo_p = 1.0 - ((26 / 52) ** cards_drawn)
                fav = 1
                total = 2
                title = f"At Least One {target_name} in {cards_drawn} Draws (With Replacement)"
                formula = rf"P(\ge 1 \text{{ {target_name}}}) = 1 - (0.5)^{{{cards_drawn}}}"
                calc_steps = [rf"P = 1 - (0.5)^{{{cards_drawn}}} \approx {round(theo_p, 4)}"]
                frac_str = f"~{round(theo_p, 4)}"
            else:
                total_combs = combinations(52, cards_drawn)
                non_fav = combinations(26, cards_drawn)
                fav = total_combs - non_fav
                total = total_combs
                theo_p = fav / total
                title = f"At Least One {target_name} in {cards_drawn} Draws (Without Replacement)"
                formula = rf"P = 1 - \frac{{\binom{{26}}{{{cards_drawn}}}}}{{\binom{{52}}{{{cards_drawn}}}}}"
                calc_steps = [rf"P = 1 - \frac{{{non_fav}}}{{{total_combs}}} \approx {round(theo_p, 4)}"]
                gcd = math.gcd(fav, total)
                frac_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "draw_suit":
        # 13 cards of target suit
        if cards_drawn == 1:
            fav = 13
            total = 52
            theo_p = 13 / 52  # 1/4
            title = f"Draw a {suit_name.capitalize()} {suit_sym} Card"
            formula = rf"P(\text{{{suit_name.capitalize()}}}) = \frac{{13}}{{52}} = \frac{{1}}{{4}}"
            calc_steps = [
                rf"\text{{Cards in suit {suit_name}: }} 13",
                r"P = \frac{13}{52} = \frac{1}{4} = 0.2500"
            ]
            frac_str = "1/4"
        else:
            if replacement:
                theo_p = 1.0 - ((39 / 52) ** cards_drawn)
                total = 52 ** cards_drawn
                fav = int(round(theo_p * total))
                title = f"At Least One {suit_name.capitalize()} in {cards_drawn} Draws (With Replacement)"
                formula = rf"P = 1 - \left(\frac{{39}}{{52}}\right)^{{{cards_drawn}}}"
                calc_steps = [rf"P = 1 - (0.75)^{{{cards_drawn}}} \approx {round(theo_p, 4)}"]
                frac_str = f"~{round(theo_p, 4)}"
            else:
                total_combs = combinations(52, cards_drawn)
                non_suit = combinations(39, cards_drawn)
                fav = total_combs - non_suit
                total = total_combs
                theo_p = fav / total
                title = f"At Least One {suit_name.capitalize()} in {cards_drawn} Draws (Without Replacement)"
                formula = rf"P = 1 - \frac{{\binom{{39}}{{{cards_drawn}}}}}{{\binom{{52}}{{{cards_drawn}}}}}"
                calc_steps = [rf"P = \frac{{{fav}}}{{{total_combs}}} \approx {round(theo_p, 4)}"]
                gcd = math.gcd(fav, total)
                frac_str = f"{fav // gcd}/{total // gcd}"

    elif experiment_type == "two_aces":
        # Drawing 2 cards, BOTH are Aces
        if replacement:
            # Independent: (4/52) * (4/52) = 16 / 2704 = 1/169
            fav = 16
            total = 2704
            theo_p = 1 / 169
            title = "Drawing Two Aces (With Replacement)"
            formula = r"P(A_1 \cap A_2) = P(A_1) \times P(A_2) = \frac{4}{52} \times \frac{4}{52} = \frac{1}{169}"
            calc_steps = [
                r"\text{Independent events since card is replaced before second draw:}",
                r"P(A_1) = \frac{4}{52} = \frac{1}{13}",
                r"P(A_2) = \frac{4}{52} = \frac{1}{13}",
                r"P(A_1 \cap A_2) = \frac{1}{13} \times \frac{1}{13} = \frac{1}{169} \approx 0.005917"
            ]
            frac_str = "1/169"
        else:
            # Dependent: (4/52) * (3/51) = 12 / 2652 = 1/221
            fav = combinations(4, 2)  # 6
            total = combinations(52, 2)  # 1326
            theo_p = 6 / 1326  # 1 / 221
            title = "Drawing Two Aces (Without Replacement)"
            formula = r"P(A_1 \cap A_2) = P(A_1) \times P(A_2 | A_1) = \frac{4}{52} \times \frac{3}{51} = \frac{1}{221}"
            calc_steps = [
                r"\text{Dependent events (Hypergeometric sampling without replacement):}",
                r"P(A_1) = \frac{4}{52}",
                r"P(A_2 | A_1) = \frac{3}{51} \text{ (only 3 Aces remaining out of 51 cards)}",
                r"P(A_1 \cap A_2) = \frac{4}{52} \times \frac{3}{51} = \frac{12}{2652} = \frac{1}{221} \approx 0.004525"
            ]
            frac_str = "1/221"

    elif experiment_type == "at_least_one_ace":
        k = max(1, cards_drawn)
        if replacement:
            theo_p = 1.0 - ((48 / 52) ** k)
            total = 52 ** k
            fav = int(round(theo_p * total))
            title = f"At Least One Ace in {k} Draws (With Replacement)"
            formula = rf"P(\ge 1 \text{{ Ace}}) = 1 - \left(\frac{{48}}{{52}}\right)^{{{k}}}"
            calc_steps = [
                rf"P(\ge 1 \text{{ Ace}}) = 1 - \left(\frac{{12}}{{13}}\right)^{{{k}}} \approx {round(theo_p, 4)}"
            ]
            frac_str = f"~{round(theo_p, 4)}"
        else:
            total_combs = combinations(52, k)
            non_aces = combinations(48, k)
            fav = total_combs - non_aces
            total = total_combs
            theo_p = fav / total
            title = f"At Least One Ace in {k} Draws (Without Replacement)"
            formula = rf"P(\ge 1 \text{{ Ace}}) = 1 - \frac{{\binom{{48}}{{{k}}}}}{{\binom{{52}}{{{k}}}}}"
            calc_steps = [
                rf"\text{{Total card combinations: }} \binom{{52}}{{{k}}} = {total_combs}",
                rf"\text{{Combinations without Ace: }} \binom{{48}}{{{k}}} = {non_aces}",
                rf"P = 1 - \frac{{{non_aces}}}{{{total_combs}}} = \frac{{{fav}}}{{{total_combs}}} \approx {round(theo_p, 4)}"
            ]
            gcd = math.gcd(fav, total)
            frac_str = f"{fav // gcd}/{total // gcd}"

    else:
        # Default Ace draw
        fav = 4
        total = 52
        theo_p = 1 / 13
        title = "Draw an Ace"
        formula = r"P(\text{Ace}) = \frac{4}{52} = \frac{1}{13}"
        calc_steps = [r"P(\text{Ace}) = \frac{4}{52} = \frac{1}{13} \approx 0.0769"]
        frac_str = "1/13"

    explanation = {
        "title": title,
        "sample_space_description": f"All {total} possible outcomes when drawing {cards_drawn} card(s) from a standard 52-card deck ({'with' if replacement else 'without'} replacement)",
        "sample_space_size": total,
        "favorable_outcomes_description": f"Combinations or ordered outcomes satisfying '{title}'",
        "favorable_outcomes_count": fav,
        "formula_latex": formula,
        "calculation_steps": calc_steps,
        "theoretical_probability_fraction": frac_str,
        "theoretical_probability_decimal": round(theo_p, 6),
        "notes": (
            "Notice how sampling WITHOUT replacement reduces the probability of identical ranks "
            "because each drawn card reduces the remaining population pool of that rank in the deck (hypergeometric). "
            "In contrast, sampling WITH replacement preserves constant probabilities across draws (binomial)."
        )
    }

    return theo_p, total, fav, explanation


def simulate_card_draws(
    num_trials: int = 1000,
    cards_drawn: int = 1,
    replacement: bool = False,
    experiment_type: str = "draw_ace",
    target_suit: str = "hearts",
    seed: int = None
) -> Dict[str, Any]:
    """
    Executes stochastic card draw trials using NumPy and Python.
    Calculates exact experimental probability, errors, suit & rank distributions,
    and downsampled convergence series.
    """
    rng = np.random.default_rng(seed)

    effective_drawn = 2 if experiment_type == "two_aces" else cards_drawn

    theo_p, sample_space_size, favorable_count, explanation = get_theoretical_card(
        experiment_type=experiment_type,
        cards_drawn=effective_drawn,
        replacement=replacement,
        target_suit=target_suit
    )

    # Simulate draws
    # shape: (num_trials, effective_drawn)
    if replacement:
        draw_matrix = rng.integers(0, 52, size=(num_trials, effective_drawn), dtype=np.int8)
    else:
        # Without replacement: for each trial, draw distinct cards from 0..51
        # For fast execution, draw using permutation or permutation slice
        # When trials is large (e.g. 100,000), generate permutations in chunks
        draw_matrix = np.empty((num_trials, effective_drawn), dtype=np.int8)
        # Vectorized generation: generate random floats and take argsort
        random_floats = rng.random(size=(num_trials, 52), dtype=np.float32)
        draw_matrix = np.argsort(random_floats, axis=1)[:, :effective_drawn].astype(np.int8)

    # Evaluate criteria per trial
    suit_name = target_suit.lower() if target_suit else "hearts"
    target_suit_idx = SUITS.index(suit_name) if suit_name in SUITS else 0

    # Card properties:
    # rank_idx = card_id % 13  (0 = A, 1..9 = 2..10, 10 = J, 11 = Q, 12 = K)
    # suit_idx = card_id // 13 (0 = hearts, 1 = diamonds, 2 = spades, 3 = clubs)
    # color: 0, 1 = red; 2, 3 = black
    ranks_matrix = draw_matrix % 13
    suits_matrix = draw_matrix // 13

    if experiment_type in ("draw_ace", "at_least_one_ace"):
        # Rank 0 is Ace
        success_mask = np.any(ranks_matrix == 0, axis=1)

    elif experiment_type == "draw_king":
        # Rank 12 is King
        success_mask = np.any(ranks_matrix == 12, axis=1)

    elif experiment_type == "draw_queen":
        # Rank 11 is Queen
        success_mask = np.any(ranks_matrix == 11, axis=1)

    elif experiment_type == "draw_face_card":
        # Ranks 10 (J), 11 (Q), 12 (K)
        success_mask = np.any((ranks_matrix >= 10) & (ranks_matrix <= 12), axis=1)

    elif experiment_type == "draw_red":
        # Suits 0 (hearts), 1 (diamonds)
        success_mask = np.any(suits_matrix <= 1, axis=1)

    elif experiment_type == "draw_black":
        # Suits 2 (spades), 3 (clubs)
        success_mask = np.any(suits_matrix >= 2, axis=1)

    elif experiment_type == "draw_suit":
        success_mask = np.any(suits_matrix == target_suit_idx, axis=1)

    elif experiment_type == "two_aces":
        # Both cards in the draw of 2 are Aces
        if effective_drawn >= 2:
            success_mask = np.all(ranks_matrix[:, :2] == 0, axis=1)
        else:
            success_mask = np.zeros(num_trials, dtype=bool)

    else:
        success_mask = np.any(ranks_matrix == 0, axis=1)

    successful_outcomes = int(np.sum(success_mask))
    exp_p = successful_outcomes / num_trials

    # Error analysis & CI
    abs_err, pct_err = calculate_errors(exp_p, theo_p)
    se, ci_low, ci_high = calculate_confidence_interval_95(exp_p, num_trials)

    # Suit and Rank distributions across all drawn cards
    all_suits_flat = suits_matrix.flatten()
    all_ranks_flat = ranks_matrix.flatten()

    suit_distribution = {s: 0 for s in SUITS}
    u_suits, c_suits = np.unique(all_suits_flat, return_counts=True)
    for s_idx, cnt in zip(u_suits, c_suits):
        suit_distribution[SUITS[int(s_idx)]] = int(cnt)

    rank_distribution = {r: 0 for r in RANKS}
    u_ranks, c_ranks = np.unique(all_ranks_flat, return_counts=True)
    for r_idx, cnt in zip(u_ranks, c_ranks):
        rank_distribution[RANKS[int(r_idx)]] = int(cnt)

    # First few sample hands for visual animation
    sample_size = min(8, num_trials)
    sample_hands = []
    for i in range(sample_size):
        hand = []
        for card_id in draw_matrix[i]:
            card_info = get_card_by_id(int(card_id))
            hand.append({
                "suit": card_info["suit"],
                "symbol": card_info["symbol"],
                "rank": card_info["rank"],
                "color": card_info["color"],
                "code": card_info["code"]
            })
        sample_hands.append(hand)

    # Convergence trajectory
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
            "cards_drawn": effective_drawn,
            "replacement": replacement,
            "experiment_type": experiment_type,
            "target_suit": target_suit,
            "seed": seed
        },
        "total_trials": num_trials,
        "cards_drawn": effective_drawn,
        "replacement": replacement,
        "successful_outcomes": successful_outcomes,
        "experimental_probability": round(exp_p, 6),
        "theoretical_probability": round(theo_p, 6),
        "absolute_error": abs_err,
        "percentage_error": pct_err,
        "standard_error": se,
        "confidence_interval_95": [ci_low, ci_high],
        "suit_distribution": suit_distribution,
        "rank_distribution": rank_distribution,
        "sample_hands": sample_hands,
        "convergence_data": convergence_data,
        "math_explanation": explanation
    }
