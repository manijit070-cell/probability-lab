/**
 * Core TypeScript definitions for ProbabilityLab.
 */

export interface MathExplanation {
  title: string;
  sample_space_description: string;
  sample_space_size: number;
  favorable_outcomes_description: string;
  favorable_outcomes_count: number;
  formula_latex: string;
  calculation_steps: string[];
  theoretical_probability_fraction: string;
  theoretical_probability_decimal: number;
  notes: string;
}

export interface ConvergencePoint {
  trial: number;
  experimental: number;
  theoretical: number;
  absolute_error: number;
  successes: number;
}

// ---------------- Coin Types ----------------
export interface CoinSimulationRequest {
  num_trials: number;
  num_coins: number;
  experiment_type: string;
  target_heads?: number;
  consecutive_count?: number;
  seed?: number | null;
}

export interface CoinSimulationResponse {
  config: Record<string, any>;
  total_trials: number;
  num_coins: number;
  successful_outcomes: number;
  total_tosses: number;
  heads_count: number;
  tails_count: number;
  experimental_probability: number;
  theoretical_probability: number;
  absolute_error: number;
  percentage_error: number | null;
  standard_error: number;
  confidence_interval_95: [number, number];
  sample_flips: string[][];
  heads_distribution: Record<number, number>;
  convergence_data: ConvergencePoint[];
  math_explanation: MathExplanation;
}

// ---------------- Dice Types ----------------
export interface DiceSimulationRequest {
  num_dice: number;
  num_trials: number;
  experiment_type: string;
  target_number?: number;
  target_sum?: number;
  seed?: number | null;
}

export interface DiceSumInfo {
  count: number;
  experimental_p: number;
  theoretical_p: number;
}

export interface DiceSimulationResponse {
  config: Record<string, any>;
  total_trials: number;
  num_dice: number;
  successful_outcomes: number;
  experimental_probability: number;
  theoretical_probability: number;
  absolute_error: number;
  percentage_error: number | null;
  standard_error: number;
  confidence_interval_95: [number, number];
  face_frequencies: Record<number, number>;
  sum_distribution: Record<number, DiceSumInfo>;
  sample_rolls: number[][];
  convergence_data: ConvergencePoint[];
  math_explanation: MathExplanation;
}

// ---------------- Card Types ----------------
export interface CardItem {
  suit: string;
  symbol: string;
  rank: string;
  color: string;
  code: string;
}

export interface CardSimulationRequest {
  num_trials: number;
  cards_drawn: number;
  replacement: boolean;
  experiment_type: string;
  target_suit?: string;
  seed?: number | null;
}

export interface CardSimulationResponse {
  config: Record<string, any>;
  total_trials: number;
  cards_drawn: number;
  replacement: boolean;
  successful_outcomes: number;
  experimental_probability: number;
  theoretical_probability: number;
  absolute_error: number;
  percentage_error: number | null;
  standard_error: number;
  confidence_interval_95: [number, number];
  suit_distribution: Record<string, number>;
  rank_distribution: Record<string, number>;
  sample_hands: CardItem[][];
  convergence_data: ConvergencePoint[];
  math_explanation: MathExplanation;
}

// ---------------- Statistics / LLN Types ----------------
export interface LLNScalePoint {
  trials: number;
  experimental: number;
  theoretical: number;
  absolute_error: number;
  percentage_error: number | null;
  standard_error: number;
  margin_of_error: number;
  sample_variance: number;
}

export interface LLNAnalysisRequest {
  experiment_domain: string;
  scenario: string;
  seed?: number | null;
}

export interface LLNAnalysisResponse {
  domain: string;
  scenario: string;
  theoretical_probability: number;
  scales: LLNScalePoint[];
  insight: string;
  math_summary: string;
}

// ---------------- Navigation ----------------
export type TabType = 'home' | 'coin' | 'dice' | 'cards' | 'statistics' | 'about';
