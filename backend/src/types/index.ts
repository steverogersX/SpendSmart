export type { Plan, Vendor, PricingData } from './audit';

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

/**
 * A single recommendation returned by the audit service.
 *
 * Two flavors share the same shape so the controller and frontend can
 * iterate uniformly:
 *   - `subscription` — switch to a cheaper subscription plan
 *   - `api`          — switch to a cheaper API model
 *
 * `type` is the discriminator. `plan` doubles as the recommendation key
 * (subscription plan name OR API model id) so callers can render a single
 * "you should switch to X" line without branching on type.
 */
export type Recommendation = {
  type: 'subscription' | 'api';
  tool: string;
  /** Subscription: plan name (e.g. "Pro"). API: model id (e.g. "claude-haiku-4-5"). */
  plan: string;
  cost: number;
  savings: number;
  reason: string;
  // ─── API-only metadata (undefined for subscription recommendations) ──────
  modelDisplayName?: string;
  /** Percentage savings vs. current spend, in [0, 100]. */
  savingsPercent?: number;
  /** Min-max-normalized quality score in [0, 1] across the candidate set. */
  qualityScore?: number;
};

export type AuditResult = {
  tool: string;
  flow: 'subscription' | 'api';
  /** Subscription: current plan name. API: current model id. */
  currentPlan: string;
  currentCost: number;
  status: 'optimal' | 'optimize';
  bestRecommendation: Recommendation | null;
  otherOptions: Recommendation[];
  /** Human-readable narrative — currently set for the API "already optimal" case. */
  message?: string;
  /** API only — back-solved monthly token volume from spend (rounded). */
  estimatedMonthlyTokens?: number;
};
