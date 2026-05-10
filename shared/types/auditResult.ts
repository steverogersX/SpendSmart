
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
  pricingUrl: string;
  savings: number;
  savingsPercent: number;
  reason: string;
  estimatedMonthlyTokens: number;
  score: number;
  scoreType: 'absolute' | 'relative';
  scoreUnit: 'percentage' | 'Elo points';
  higherIsBetter: boolean;
  maxScore: number | null;
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
  currentModelScore: number | null;
  scoreType: 'absolute' | 'relative';
  scoreUnit: 'percentage' | 'Elo points';
  higherIsBetter: boolean;
  maxScore: number | null;
  benchmarkName: string;
  benchmarkUrl: string;
  dropCapacityBy: number;
  summary: string;
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

export type AuditResultItem = ApiAuditResult | MonthlySubscriptionAuditResult;


export type AuditResult = {
  results: (ApiAuditResult | MonthlySubscriptionAuditResult)[];
}