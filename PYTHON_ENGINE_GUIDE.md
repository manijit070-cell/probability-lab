# PYTHON PROBABILITY ENGINE GUIDE
### Academic Evaluation & Viva-Voce Defense Manual
**B.Tech Probability and Statistics Mini-Project • Group 7**
**Topic: Coin, Dice, and Card Probability Simulation**

---

## 1. Executive Summary for Your Professor

During your mini-project presentation or viva, state this opening summary:

> *"Good morning, Professor. Our project is PROBABILITYLAB. The core requirement for Group 7 was to implement genuine stochastic simulations in Python and compare experimental results with theoretical probabilities. 
> 
> We have built a strict separation of concerns: 100% of the mathematical calculations, combinatorics, random experiments, confidence bounds, and error metrics are executed in Python using NumPy and FastAPI. The React frontend never generates random numbers or mocks results; it acts as an interactive visualization and telemetry dashboard for the Python engine."*

---

## 2. Directory Structure & Python Modules Overview

The Python engine is organized into a modular architecture inside the `api/` directory:

```
api/
├── index.py                  # Entry point for local uvicorn and Vercel serverless
├── engine/
│   ├── probability.py        # Core statistical formulas (SE, CI, Combinatorics, Error)
│   ├── coin_engine.py        # Coin simulation engine (Bernoulli & Binomial)
│   ├── dice_engine.py        # Dice simulation engine (Uniform & Sum distributions)
│   ├── card_engine.py        # Card simulation engine (Hypergeometric vs Binomial)
│   └── stats_engine.py       # Multi-scale Law of Large Numbers (LLN) analysis
├── routes/
│   ├── coin.py               # REST API endpoints for coins
│   ├── dice.py               # REST API endpoints for dice
│   ├── cards.py              # REST API endpoints for cards
│   └── statistics.py         # REST API endpoints for LLN
└── schemas/
    └── requests.py           # Pydantic v2 schemas for strict type validation
```

---

## 3. Detailed Explanation of Python Modules

### A. `api/engine/probability.py`
This module contains reusable mathematical functions that do not belong to a single experiment:

1. **`combinations(n: int, k: int) -> int`**:
   - Calculates $\binom{n}{k} = \frac{n!}{k!(n-k)!}$ using Python's native `math.comb`.
   - Used for counting favorable outcomes in card combinations and binomial coin distributions.

2. **`calculate_errors(experimental_p: float, theoretical_p: float) -> (float, float)`**:
   - Absolute Error: $|P_{\text{exp}} - P_{\text{theo}}|$
   - Percentage Error: $\left( \frac{|P_{\text{exp}} - P_{\text{theo}}|}{P_{\text{theo}}} \right) \times 100\%$
   - Properly handles edge cases where $P_{\text{theo}} = 0$.

3. **`calculate_confidence_interval_95(p: float, n: int) -> (float, float, float)`**:
   - Standard Error of a Proportion:
     $$\text{SE} = \sqrt{\frac{p(1 - p)}{n}}$$
   - Wald 95% Confidence Interval:
     $$\text{Margin of Error} = 1.96 \cdot \text{SE}$$
     $$\text{CI}_{95\%} = [\max(0, p - 1.96 \cdot \text{SE}), \; \min(1, p + 1.96 \cdot \text{SE})]$$

4. **`generate_convergence_points(...)`**:
   - Calculates the running cumulative relative frequency over trials.
   - Strategically downsamples the array into at most 50 points to send to Recharts so large experiments ($N = 1,000,000$) don't bottleneck the network.

---

### B. `api/engine/coin_engine.py`

#### 1. Theoretical Calculation (`get_theoretical_coin`):
* **Single Coin:** Sample space $S = \{H, T\}$, $|S| = 2$. Favorable $= 1$. $P(H) = 1/2 = 0.5$.
* **Exact $m$ Heads in $k$ Coins:**
  $$P(X = m) = \binom{k}{m} \left(\frac{1}{2}\right)^k$$
* **At Least One Head in $k$ Coins:**
  Using complement rule:
  $$P(\ge 1 \text{ Head}) = 1 - P(\text{All Tails}) = 1 - \left(\frac{1}{2}\right)^k = \frac{2^k - 1}{2^k}$$
* **Consecutive Heads:**
  Generates binary bitmasks of length $k$ to count microstates with runs of $\ge r$ ones.

#### 2. Stochastic Simulation (`simulate_coin_tosses`):
* Uses NumPy's `Generator`:
  ```python
  rng = np.random.default_rng(seed)
  tosses = rng.integers(0, 2, size=(num_trials, num_coins), dtype=np.int8)
  ```
* Evaluates trial success using vectorized boolean masking:
  - Exact heads: `np.sum(tosses, axis=1) == target_heads`
  - At least one head: `np.sum(tosses, axis=1) >= 1`
* Returns experimental probability, error metrics, heads distribution per coin count, sample flips for the 3D coin animation, and convergence data.

---

### C. `api/engine/dice_engine.py`

#### 1. Theoretical Calculation (`get_theoretical_dice`):
* **Single Die:** $S = \{1, 2, 3, 4, 5, 6\}$, $P(\text{Face } k) = 1/6$.
* **Sum of Two Dice ($S \in [2, 12]$):**
  Sample space $|S| = 6 \times 6 = 36$ ordered pairs.
  The sum forms a symmetric triangular distribution:
  - Sum 2: $(1,1) \implies 1/36 \approx 0.0278$
  - Sum 7: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1) \implies 6/36 = 1/6 \approx 0.1667$
  - Sum 12: $(6,6) \implies 1/36 \approx 0.0278$
* **Doubles with Two Dice:**
  $\{(1,1), (2,2), (3,3), (4,4), (5,5), (6,6)\} \implies 6/36 = 1/6$.
* **At Least One Six:**
  $$P(\ge 1 \text{ Six}) = 1 - \left(\frac{5}{6}\right)^k$$

#### 2. Stochastic Simulation (`simulate_dice_rolls`):
* Vectorized roll matrix of size `(num_trials, num_dice)` with random integers from 1 to 6.
* Calculates individual face frequencies for each die face 1..6.
* Compares empirical sum distribution against theoretical values across all possible sums.

---

### D. `api/engine/card_engine.py`

This is one of the most critical parts to explain to your professor because it demonstrates **Hypergeometric vs. Binomial** sampling:

#### 1. Standard Deck Representation:
* 52 unique cards: 4 suits (Hearts ♥, Diamonds ♦, Spades ♠, Clubs ♣) $\times$ 13 ranks (A, 2..10, J, Q, K).
* 4 Aces, 12 Face cards (J, Q, K), 26 Red cards, 26 Black cards.

#### 2. Sampling WITH Replacement (Independent / Binomial):
* After each card is drawn, it is placed back and reshuffled.
* Probability remains invariant on every draw.
* Probability of drawing Two Aces in 2 draws:
  $$P(A_1 \cap A_2) = P(A_1) \times P(A_2) = \frac{4}{52} \times \frac{4}{52} = \frac{16}{2704} = \frac{1}{169} \approx 0.005917$$

#### 3. Sampling WITHOUT Replacement (Dependent / Hypergeometric):
* After each draw, the card is retained; both the numerator and denominator change for subsequent draws.
* Probability of drawing Two Aces in 2 draws:
  $$P(A_1 \cap A_2) = P(A_1) \times P(A_2 | A_1) = \frac{4}{52} \times \frac{3}{51} = \frac{12}{2652} = \frac{1}{221} \approx 0.004525$$
* Using combinatorial selection:
  $$P = \frac{\binom{4}{2}}{\binom{52}{2}} = \frac{6}{1326} = \frac{1}{221}$$

---

### E. `api/engine/stats_engine.py` (Law of Large Numbers)
* Runs the same scenario simultaneously across 5 logarithmic orders of magnitude:
  $N = [10, 100, 1,000, 10,000, 100,000]$.
* Tracks how the Standard Error decays at the theoretical mathematical rate $O(1 / \sqrt{N})$:
  - When $N = 100$, $\text{SE} \approx 0.05$
  - When $N = 10,000$ (100 times larger), $\text{SE} \approx 0.005$ (10 times smaller!)

---

## 4. How the Frontend Communicates with Python

1. **Local Development:**
   - FastAPI server runs on `http://localhost:8000`.
   - React app runs on `http://localhost:5173`.
   - `vite.config.ts` proxies all `/api/*` HTTP calls directly to `localhost:8000`.
2. **Production on Vercel:**
   - Both frontend and Python backend live in this same repository.
   - `vercel.json` maps incoming requests at `/api/(.*)` to the Python serverless runtime in `api/index.py`.
   - The React app uses relative endpoints (`/api/coin/simulate`, etc.), so zero hardcoding is needed.

---

## 5. Live Viva Demonstration Script for Your Professor

Follow these exact steps during your demonstration:

### Step 1: Prove Mathematical Validity via Pytest
In the terminal, run:
```bash
.\venv\Scripts\pytest -v
```
**Say to your professor:**
> *"Professor, before opening the user interface, we can verify our Python engine through 21 automated unit tests. These test binomial formulas, combinatorial permutations, hypergeometric card dependencies, and error decay laws."*
*(All 21 tests pass with green checks).*

### Step 2: Demonstrate Random Seed Reproducibility
1. Open the **Coin Lab**.
2. Select **Single Coin: Probability of Heads**.
3. Set **Number of Trials** to `1000`.
4. Enter **Random Seed** as `42`.
5. Click **Run Simulation**. Note the result: e.g. `Heads = 492, P_exp = 0.4920`.
6. Click **Run Simulation** again with the same seed.
7. Show that the result is identical down to every single coin flip.
**Say to your professor:**
> *"This confirms that the Python pseudorandom number generator is executing the trials deterministically when seeded, rather than using random mock values."*

### Step 3: Demonstrate Hypergeometric vs. Binomial Sampling
1. Open the **Card Lab**.
2. Select **Draw Two Aces in 2 Cards**.
3. Select **Without Replacement**. Notice the theoretical probability is $P = 1/221 \approx 0.004525$.
4. Run 100,000 trials.
5. Now switch to **With Replacement**. Notice the theoretical probability increases to $P = 1/169 \approx 0.005917$.
**Say to your professor:**
> *"Without replacement, drawing the first ace depletes the deck, leaving only 3 aces out of 51 cards. With replacement, the second draw is independent. Our Python backend calculates both distributions with exact combinatorial accuracy."*

### Step 4: Demonstrate Asymptotic Convergence in the Statistics Studio
1. Open the **Statistics & LLN Studio**.
2. Show the multi-scale progression table ($10 \to 100,000$).
3. Point to the **Standard Error (SE)** column.
**Say to your professor:**
> *"As N scales by a factor of 100 (from 100 to 10,000), the Standard Error shrinks by exactly a factor of 10. This visually proves the central limit theorem rate of $1/\sqrt{N}$ convergence toward the theoretical mean."*

---

**Prepared by Group 7 for College Project Evaluation**
