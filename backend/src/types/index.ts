export type { Plan, Vendor, PricingData } from './pricing';

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



export type AuditRequestType = "subscription" | "api";
export type OptimizationStatus = 'optimal' | 'optimize';

export type SubscriptionRecommendation = {
  toolName: string;
  planName: string;
  savings: number;
  savingsPercent: number;
  reason: string;
}

export type ApiRecommendation = {
  modelName: string;
  modelDisplayName: string;
  contextWindow: number;
  verifiedDate: string;
  benchmarkName: string;
  benchmarkUrl: string;
  savings: number;
  savingsPercent: number;
  reason: string;
  estimatedMonthlyTokens: number;
}

export type Recommendation<T extends AuditRequestType> =
  T extends "subscription"
  ? SubscriptionRecommendation
  : ApiRecommendation;


export type ApiAuditResult = {
  toolName: string;
  primaryModel: string;
  primaryUseCase: string;
  currentAverageMonthlySpend: number;

  status: OptimizationStatus;
  bestRecommendation: ApiRecommendation | null;
  otherOptions: ApiRecommendation[]; // Top 3
}

export type MonthlySubscriptionAuditResult = {
  tool: string;
  usageType: AuditRequestType;
  currentPlan: string;
  currentCost: number;
  status: OptimizationStatus;
  bestRecommendation: SubscriptionRecommendation | null;
  otherOptions: SubscriptionRecommendation[]; // Top 3
};

export type AuditResult = {
  results: (ApiAuditResult | MonthlySubscriptionAuditResult)[];
}