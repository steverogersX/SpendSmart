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
};

export type PricingData = Record<string, Vendor>;