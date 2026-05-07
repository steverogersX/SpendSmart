export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError extends Error {
  code?: number;
  details?: unknown;
}