import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { status } from 'http-status';
import { config } from './config/env';
import { logger, httpLogger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { ApiError, ApiResponse } from './types';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: 'ok' },
  };
  res.status(status.OK).json(response);
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: ApiError = {
    name: 'NotFoundError',
    message: 'Route not found',
    code: status.NOT_FOUND,
  };
  next(error);
});

app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
