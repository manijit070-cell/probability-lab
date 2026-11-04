/**
 * API client communicating with the Python FastAPI Backend.
 * Uses relative `/api` paths so it functions seamlessly both on localhost
 * (via Vite proxy) and in production on Vercel.
 */

import {
  CoinSimulationRequest,
  CoinSimulationResponse,
  DiceSimulationRequest,
  DiceSimulationResponse,
  CardSimulationRequest,
  CardSimulationResponse,
  LLNAnalysisRequest,
  LLNAnalysisResponse
} from '../types';

const API_BASE = '/api';

async function postJSON<TReq, TRes>(url: string, data: TReq): Promise<TRes> {
  const response = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    let errorDetail = 'API Request Failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const probabilityApi = {
  async simulateCoin(params: CoinSimulationRequest): Promise<CoinSimulationResponse> {
    return postJSON<CoinSimulationRequest, CoinSimulationResponse>('/coin/simulate', params);
  },

  async simulateDice(params: DiceSimulationRequest): Promise<DiceSimulationResponse> {
    return postJSON<DiceSimulationRequest, DiceSimulationResponse>('/dice/simulate', params);
  },

  async simulateCards(params: CardSimulationRequest): Promise<CardSimulationResponse> {
    return postJSON<CardSimulationRequest, CardSimulationResponse>('/cards/simulate', params);
  },

  async analyzeLLN(params: LLNAnalysisRequest): Promise<LLNAnalysisResponse> {
    return postJSON<LLNAnalysisRequest, LLNAnalysisResponse>('/statistics/analyze', params);
  },

  async checkHealth(): Promise<{ status: string; service: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  }
};
