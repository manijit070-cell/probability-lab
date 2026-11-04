# PROBABILITYLAB
### Coin, Dice, and Card Probability Simulation Studio
*Explore Probability. Run Experiments. Discover Mathematics.*

**B.Tech Probability and Statistics Mini-Project — Group 7**

---

## 1. Project Title & Abstract

**PROBABILITYLAB** is a full-stack educational web application designed to simulate classical stochastic experiments using a verified **Python stochastic simulation engine** and compare experimental empirical observations with exact theoretical combinatorial probabilities. 

Built with a high-performance **FastAPI (Python 3.12)** backend and a **React 19 + TypeScript + Tailwind CSS** frontend, the platform provides interactive laboratories for **Coins**, **Dice**, and **Playing Cards**, complemented by a comprehensive **Statistics & Law of Large Numbers (LLN) Studio**.

---

## 2. Problem Statement

In conventional engineering education, probability theory is almost exclusively taught through deductive combinatorics and symbolic equations. Concepts such as the **Law of Large Numbers**, **binomial distributions**, and the critical divergence between **independent sampling with replacement** and **hypergeometric sampling without replacement** often remain abstract formulas. Students rarely observe how stochastic variance behaves as sample sizes increase from $N = 10$ to $N = 1,000,000$.

PROBABILITYLAB resolves this gap by bridging deterministic theory with live empirical Monte Carlo trials, running real-time statistical calculations in Python and rendering interactive visualizations, 3D physics animations, and KaTeX mathematical derivations.

---

## 3. Academic Objectives

1. **Verify Classical Probability Formulations:** Demonstrate $P(E) = \frac{|E|}{|S|}$ across discrete sample spaces.
2. **Empirical Asymptotic Convergence:** Validate Khinchin’s Weak Law of Large Numbers ($\lim_{n \to \infty} P(|\bar{X}_n - \mu| \ge \varepsilon) = 0$).
3. **Compare Sampling Regimes:** Dissect why drawing cards *without replacement* strictly lowers the probability of identical ranks ($P = 1/221$) compared to *with replacement* ($P = 1/169$).
4. **Quantify Uncertainty:** Track Absolute Error, Percentage Error, Standard Error ($SE = \sqrt{\frac{p(1-p)}{n}}$), and Wald 95% Confidence Intervals.
5. **Separation of Concerns:** Keep 100% of the mathematical calculations in Python, reserving JavaScript exclusively for presentation and rendering.

---

## 4. Technology Stack

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **Backend** | Python 3.12+, FastAPI, NumPy, Pydantic v2 | Stochastic experiment execution, combinatorial math, statistical confidence bounds, and REST APIs. |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | UI components, reactive state management, design system, and API orchestration. |
| **Visuals & Motion**| Framer Motion, CSS 3D Transforms, Canvas | 3D coin flips, rolling dice pips, authentic playing card deal animations. |
| **Data Viz** | Recharts | Distribution histograms, convergence curves, and error decay trajectory plots. |
| **Math Engine** | KaTeX | High-precision LaTeX mathematical typography and step-by-step derivations. |
| **Deployment** | Vercel (Python Serverless Runtime + Static SPA) | Serverless monorepo deployment with zero-cost hosting. |

---

## 5. System Architecture

PROBABILITYLAB employs a decoupled monorepo architecture:

```
probability-lab/
├── api/                        # PYTHON BACKEND (FastAPI + NumPy)
│   ├── index.py                # Main application & Vercel serverless entrypoint
│   ├── routes/
│   │   ├── coin.py             # Coin endpoints (/api/coin/simulate)
│   │   ├── dice.py             # Dice endpoints (/api/dice/simulate)
│   │   ├── cards.py            # Card endpoints (/api/cards/simulate)
│   │   └── statistics.py       # LLN multi-scale endpoints (/api/statistics/analyze)
│   ├── engine/
│   │   ├── probability.py      # Statistical formulas, errors, CI, combinatorics
│   │   ├── coin_engine.py      # Coin stochastic simulation & binomial math
│   │   ├── dice_engine.py      # Dice roll vectors, sum distributions
│   │   ├── card_engine.py      # 52-card sampling (hypergeometric vs binomial)
│   │   └── stats_engine.py     # Multi-scale LLN asymptotic analysis
│   └── schemas/
│       └── requests.py         # Strict Pydantic models for request & response validation
│
├── src/                        # REACT FRONTEND (TypeScript + Vite)
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar with real-time backend health monitor
│   │   ├── Footer.tsx          # Project details and academic citations
│   │   ├── MathExplainer.tsx   # KaTeX collapsible derivation breakdown
│   │   ├── StatCard.tsx        # Scientific metric cards with glowing indicators
│   │   ├── CoinVisual.tsx      # Realistic 3D coin flipping physics
│   │   ├── DiceVisual.tsx      # Realistic 3D rolling dice with pip arrangements
│   │   ├── CardVisual.tsx      # Standard 52-card faces and deal animations
│   │   └── ConvergenceChart.tsx# Recharts stochastic convergence trajectory
│   ├── pages/
│   │   ├── Home.tsx            # Landing page with interactive hero showcase
│   │   ├── CoinLab.tsx         # Dedicated Coin experiment lab
│   │   ├── DiceLab.tsx         # Dedicated Dice experiment lab
│   │   ├── CardLab.tsx         # Dedicated Card experiment lab
│   │   ├── StatisticsLab.tsx   # Law of Large Numbers multi-scale studio
│   │   └── About.tsx           # Academic mini-project specifications
│   ├── services/
│   │   └── api.ts              # Fetch client communicating with /api
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root layout & active laboratory router
│   └── index.css               # Midnight dark scientific styling & 3D CSS
│
├── tests/                      # ACADEMIC UNIT & INTEGRATION TESTS
│   ├── test_engine.py          # Mathematical formula & stochastic tests (21 tests)
│   └── test_api_endpoints.py   # FastAPI HTTP endpoint tests
│
├── requirements.txt            # Python dependencies
├── package.json                # Node dependencies
├── vite.config.ts              # Vite configuration with local proxy to Python
├── vercel.json                 # Vercel serverless routing configuration
└── PYTHON_ENGINE_GUIDE.md      # Professor demonstration guide
```

---

## 6. Mathematical Formulas Implemented

### 1. Theoretical Probability
$$P(E) = \frac{|E|}{|S|} = \frac{\text{Number of favorable microstates}}{\text{Total equally likely outcomes}}$$

### 2. Experimental Probability
$$P_{\text{exp}}(E) = \frac{\text{Number of successful trials}}{\text{Total trials } (N)}$$

### 3. Absolute and Percentage Errors
$$\text{Absolute Error} = |P_{\text{exp}}(E) - P_{\text{theo}}(E)|$$
$$\text{Percentage Error} = \left(\frac{|P_{\text{exp}}(E) - P_{\text{theo}}(E)|}{P_{\text{theo}}(E)}\right) \times 100\% \quad (P_{\text{theo}} > 0)$$

### 4. Standard Error of Proportion & 95% Confidence Interval
$$\text{SE} = \sqrt{\frac{P_{\text{exp}}(1 - P_{\text{exp}})}{N}}$$
$$\text{CI}_{95\%} = \left[ P_{\text{exp}} - 1.96 \cdot \text{SE}, \; P_{\text{exp}} + 1.96 \cdot \text{SE} \right]$$

### 5. Binomial Distribution (Multiple Coins)
$$P(X = m) = \binom{k}{m} p^m (1-p)^{k-m} = \binom{k}{m} \left(\frac{1}{2}\right)^k$$

### 6. Card Sampling: With vs. Without Replacement
* **With Replacement (Binomial / Independent):**
  $$P(\text{Two Aces}) = \left(\frac{4}{52}\right) \times \left(\frac{4}{52}\right) = \frac{16}{2704} = \frac{1}{169} \approx 0.005917$$
* **Without Replacement (Hypergeometric / Dependent):**
  $$P(\text{Two Aces}) = \frac{\binom{4}{2}}{\binom{52}{2}} = \frac{6}{1326} = \frac{1}{221} \approx 0.004525$$

---

## 7. Experimental Methodology

1. **Trial Generation:** User selects parameter configurations ($N \in [10, 10^6]$). For high trial counts, NumPy vectorization evaluates trials simultaneously in C-speed arrays.
2. **Reproducibility:** An optional integer seed initializes `numpy.random.default_rng(seed)` or Python's `random.Random(seed)` for identical re-runs.
3. **Downsampled Convergence Logging:** Cumulative sums across trials are downsampled into at most 50 evenly spaced milestones to plot smooth convergence curves without overwhelming browser memory.
4. **No Client-Side Calculation:** Random numbers are never generated in JavaScript.

---

## 8. API Documentation

| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Checks Python serverless engine status. |
| `POST` | `/api/coin/simulate` | `{ num_trials, num_coins, experiment_type, target_heads, seed }` | Simulates coin flips and returns binomial stats. |
| `POST` | `/api/dice/simulate` | `{ num_dice, num_trials, experiment_type, target_sum, seed }` | Simulates dice rolls and computes sum distributions. |
| `POST` | `/api/cards/simulate` | `{ num_trials, cards_drawn, replacement, experiment_type, seed }` | Simulates card draws with hypergeometric/binomial rules. |
| `POST` | `/api/statistics/analyze`| `{ experiment_domain, scenario, seed }` | Runs multi-scale LLN analysis across $10 \to 100,000$ trials. |

---

## 9. Local Development Instructions

### Prerequisites
* Python 3.11+
* Node.js v18+ and npm

### 1. Clone & Setup Python Backend
```bash
git clone <repository-url>
cd probability-lab

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Run Python Unit Tests
```bash
pytest -v
```
All 21 academic tests will execute and verify mathematical correctness.

### 3. Start Python API Server (Port 8000)
```bash
python api/index.py
```
Backend will be live at `http://localhost:8000/api`.

### 4. Start React Frontend (In a separate terminal)
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. All API calls to `/api` proxy automatically to port 8000.

---

## 10. Vercel Deployment Instructions

PROBABILITYLAB is pre-configured for Vercel deployment:
1. Push the code to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Leave settings as default:
   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Click **Deploy**.
Vercel reads `vercel.json` and automatically sets up the Python runtime for `/api/index.py` while serving the built React app from `dist/`.

---

## 11. Screenshots Section

*(Insert screenshots of the Landing Page, 3D Coin Lab, Dice Sum Histogram, 52-Card Deal Visualizer, and LLN Convergence Curves during final report submission).*

---

## 12. Future Scope

* **Continuous Probability Distributions:** Add normal, exponential, and Poisson distribution simulators.
* **Bayesian Probability Studio:** Add interactive Bayes' Theorem calculators with prior/posterior belief updating.
* **Central Limit Theorem (CLT) Visualizer:** Add interactive dice sum animations showing convergence from discrete uniform to continuous Gaussian curves.

---

**Academic Project by Group 7**  
*B.Tech Engineering • Probability and Statistics Mini-Project*
