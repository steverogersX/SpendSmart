import { Request, Response, NextFunction } from 'express';
import { status } from 'http-status';
import { logger } from '../config/logger';
import { ApiError, ApiResponse } from '../types';

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.code ?? status.INTERNAL_SERVER_ERROR;

  if (statusCode >= 500) {
    logger.error({ err }, err.message);
  } else {
    logger.warn({ err }, err.message);
  }

  const response: ApiResponse<never> = {
    success: false,
    error: err,
  };

  res.status(statusCode).json(response);
}
