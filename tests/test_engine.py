"""
Comprehensive Academic Unit Tests for ProbabilityLab Simulation Engines.
Verifies theoretical derivations, stochastic simulation bounds, reproducibility,
combinatorics, and the Law of Large Numbers.
"""

import pytest
import math
from api.engine.probability import combinations, calculate_errors, calculate_confidence_interval_95
from api.engine.coin_engine import simulate_coin_tosses, get_theoretical_coin
from api.engine.dice_engine import simulate_dice_rolls, get_theoretical_dice, TWO_DICE_SUM_FAVORABLE
from api.engine.card_engine import simulate_card_draws, get_theoretical_card


# ---------------------------------------------------------------------------
# Combinatorics & Statistical Helpers Tests
# ---------------------------------------------------------------------------

def test_combinatorics_values():
    assert combinations(52, 1) == 52
    assert combinations(52, 2) == 1326
    assert combinations(4, 2) == 6
    assert combinations(5, 0) == 1
    assert combinations(5, 5) == 1
    assert combinations(10, 3) == 120


def test_confidence_interval():
    se, ci_low, ci_high = calculate_confidence_interval_95(0.5, 10000)
    # SE for p=0.5, n=10000 is sqrt(0.25 / 10000) = 0.005
    assert abs(se - 0.005) < 1e-4
    assert ci_low < 0.5 < ci_high
    assert abs((ci_high - ci_low) - (2 * 1.96 * 0.005)) < 1e-3


# ---------------------------------------------------------------------------
# Coin Engine Tests
# ---------------------------------------------------------------------------

def test_coin_single_fair():
    theo_p, s_size, fav, exp = get_theoretical_coin("single_heads", 1, 1, 2)
    assert theo_p == 0.5
    assert s_size == 2
    assert fav == 1

    sim = simulate_coin_tosses(num_trials=50000, num_coins=1, experiment_type="single_heads", seed=123)
    assert sim["total_trials"] == 50000
    assert sim["heads_count"] + sim["tails_count"] == 50000
    # Experimental probability should be within 3 standard errors of 0.5 (~0.0067)
    assert abs(sim["experimental_probability"] - 0.5) < 0.015


def test_coin_exact_heads_binomial():
    # 3 coins, exactly 2 heads: C(3, 2) / 2^3 = 3 / 8 = 0.375
    theo_p, s_size, fav, _ = get_theoretical_coin("exact_heads", 3, 2, 2)
    assert theo_p == 0.375
    assert fav == 3
    assert s_size == 8

    sim = simulate_coin_tosses(num_trials=40000, num_coins=3, experiment_type="exact_heads", target_heads=2, seed=42)
    assert abs(sim["experimental_probability"] - 0.375) < 0.015


def test_coin_at_least_one_head():
    # 4 coins, at least 1 head: 1 - (1/2)^4 = 15/16 = 0.9375
    theo_p, s_size, fav, _ = get_theoretical_coin("at_least_one_head", 4, 1, 2)
    assert theo_p == 15 / 16
    assert fav == 15
    assert s_size == 16


def test_coin_seed_reproducibility():
    sim1 = simulate_coin_tosses(num_trials=1000, num_coins=2, experiment_type="single_heads", seed=999)
    sim2 = simulate_coin_tosses(num_trials=1000, num_coins=2, experiment_type="single_heads", seed=999)
    assert sim1["experimental_probability"] == sim2["experimental_probability"]
    assert sim1["heads_count"] == sim2["heads_count"]


# ---------------------------------------------------------------------------
# Dice Engine Tests
# ---------------------------------------------------------------------------

def test_dice_single_face():
    theo_p, s_size, fav, _ = get_theoretical_dice("specific_number", 1, 6, 7)
    assert abs(theo_p - (1 / 6)) < 1e-6
    assert s_size == 6
    assert fav == 1


def test_dice_sum_of_two_dice():
    # Sum of 7: 6 pairs out of 36 -> 1/6
    theo_p_7, s_7, fav_7, _ = get_theoretical_dice("sum_7", 2, 6, 7)
    assert abs(theo_p_7 - (6 / 36)) < 1e-6
    assert fav_7 == 6
    assert s_7 == 36

    # Sum of 2: 1 pair (1,1) -> 1/36
    theo_p_2, _, fav_2, _ = get_theoretical_dice("sum_2", 2, 6, 2)
    assert abs(theo_p_2 - (1 / 36)) < 1e-6
    assert fav_2 == 1

    # Sum of 12: 1 pair (6,6) -> 1/36
    theo_p_12, _, fav_12, _ = get_theoretical_dice("sum_12", 2, 6, 12)
    assert abs(theo_p_12 - (1 / 36)) < 1e-6
    assert fav_12 == 1


def test_dice_sum_distribution_sums_to_one():
    # Sum of probabilities across all sums (2..12) must sum to exactly 1.0
    total_fav = sum(TWO_DICE_SUM_FAVORABLE.values())
    assert total_fav == 36
    total_prob = sum(fav / 36.0 for fav in TWO_DICE_SUM_FAVORABLE.values())
    assert abs(total_prob - 1.0) < 1e-9


def test_dice_at_least_one_six_two_dice():
    # 2 dice: 1 - (5/6)^2 = 11/36
    theo_p, s_size, fav, _ = get_theoretical_dice("at_least_one_six", 2, 6, 7)
    assert abs(theo_p - (11 / 36)) < 1e-6
    assert fav == 11
    assert s_size == 36


def test_dice_simulation_frequencies():
    sim = simulate_dice_rolls(num_dice=2, num_trials=36000, experiment_type="sum_7", seed=777)
    # Sum 7 should be around 1/6 (0.1667)
    assert abs(sim["experimental_probability"] - (1 / 6)) < 0.01
    # Check that sum distribution contains all keys 2..12
    for s in range(2, 13):
        assert s in sim["sum_distribution"]
    total_sum_counts = sum(v["count"] for v in sim["sum_distribution"].values())
    assert total_sum_counts == 36000


# ---------------------------------------------------------------------------
# Card Engine Tests
# ---------------------------------------------------------------------------

def test_card_single_draw_ace():
    theo_p, s_size, fav, _ = get_theoretical_card("draw_ace", 1, False)
    assert abs(theo_p - (4 / 52)) < 1e-6
    assert s_size == 52
    assert fav == 4


def test_card_face_card():
    # J, Q, K across 4 suits = 12 cards
    theo_p, _, fav, _ = get_theoretical_card("draw_face_card", 1, False)
    assert abs(theo_p - (12 / 52)) < 1e-6
    assert fav == 12


def test_card_two_aces_replacement_vs_without_replacement():
    # With replacement: (4/52) * (4/52) = 1/169 ~ 0.005917
    theo_with, _, _, _ = get_theoretical_card("two_aces", 2, True)
    assert abs(theo_with - (1 / 169)) < 1e-6

    # Without replacement: (4/52) * (3/51) = 6 / 1326 = 1/221 ~ 0.004525
    theo_without, _, fav_without, _ = get_theoretical_card("two_aces", 2, False)
    assert abs(theo_without - (1 / 221)) < 1e-6
    assert fav_without == 6

    # Crucial mathematical property: Without replacement probability < With replacement probability
    assert theo_without < theo_with


def test_card_simulation_with_vs_without():
    # Run simulation with seed to verify execution without error
    sim_with = simulate_card_draws(num_trials=20000, cards_drawn=2, replacement=True, experiment_type="two_aces", seed=10)
    sim_without = simulate_card_draws(num_trials=20000, cards_drawn=2, replacement=False, experiment_type="two_aces", seed=10)

    assert sim_with["total_trials"] == 20000
    assert sim_without["total_trials"] == 20000
    assert sim_with["replacement"] is True
    assert sim_without["replacement"] is False
    assert len(sim_with["sample_hands"]) > 0


# ---------------------------------------------------------------------------
# Law of Large Numbers Convergence Property
# ---------------------------------------------------------------------------

def test_law_of_large_numbers_standard_error_decay():
    # As N scales 100 -> 10,000 (100x), SE must shrink by ~10x
    se_100, _, _ = calculate_confidence_interval_95(0.5, 100)
    se_10000, _, _ = calculate_confidence_interval_95(0.5, 10000)
    ratio = se_100 / se_10000
    # Ratio should be sqrt(10000 / 100) = sqrt(100) = 10
    assert abs(ratio - 10.0) < 0.1
