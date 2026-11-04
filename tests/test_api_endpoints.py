"""
API Integration Tests for FastAPI endpoints.
Verifies HTTP contract, Pydantic serialization, and live calculation response codes.
"""

from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"


def test_coin_endpoint():
    payload = {
        "num_trials": 5000,
        "num_coins": 1,
        "experiment_type": "single_heads"
    }
    res = client.post("/api/coin/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_trials"] == 5000
    assert data["theoretical_probability"] == 0.5
    assert len(data["convergence_data"]) > 0
    assert "math_explanation" in data


def test_dice_endpoint():
    payload = {
        "num_dice": 2,
        "num_trials": 3600,
        "experiment_type": "sum_7"
    }
    res = client.post("/api/dice/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert abs(data["theoretical_probability"] - (1/6)) < 1e-4
    assert len(data["sum_distribution"]) == 11  # sums 2..12


def test_cards_endpoint():
    payload = {
        "num_trials": 2000,
        "cards_drawn": 2,
        "replacement": False,
        "experiment_type": "two_aces"
    }
    res = client.post("/api/cards/simulate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert abs(data["theoretical_probability"] - (1/221)) < 1e-4
    assert len(data["sample_hands"]) > 0


def test_statistics_endpoint():
    payload = {
        "experiment_domain": "coin",
        "scenario": "fair_coin"
    }
    res = client.post("/api/statistics/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["scales"]) == 5
    assert data["scales"][0]["trials"] == 10
    assert data["scales"][-1]["trials"] == 100000
