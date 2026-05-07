export type { Plan, Vendor, PricingData } from './schemas';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export class ApiError extends Error {
  code?: number;
  constructor(message: string, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export type Recommendation = {
  tool: string;
  plan: string;
  cost: number;
  savings: number;
  reason: string;
};

export type AuditResult = {
  tool: string;
  currentPlan: string;
  currentCost: number;
  status: 'optimal' | 'optimize';
  bestRecommendation: Recommendation | null;
  otherOptions: Recommendation[];
};
