import { UseCase, UseCases } from "./schemas";

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


export type Plan = {
  pricePerSeat: number | null; // null = custom/enterprise pricing
  verifiedDate: string;
};

export type Vendor = {
  name: string;
  url: string;
  plans: Record<string, Plan>;
  useCases : UseCase[];
};

export type PricingData = Record<string, Vendor>;

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