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
