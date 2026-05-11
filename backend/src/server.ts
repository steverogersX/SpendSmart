import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { status } from 'http-status';
import { config } from './config/env';
import { logger, httpLogger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { ApiError, ApiResponse } from './types';
import auditController from './controllers/audit.controller';
import leadController from './controllers/lead.controller';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate limiters ────────────────────────────────────────────────────────────

const rateLimitResponse = (msg: string): ApiResponse => ({
  success: false,
  error: { name: 'TooManyRequests', message: msg },
});

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitResponse('Too many audit requests — please wait 15 minutes.'),
  statusCode: status.TOO_MANY_REQUESTS,
});

const leadsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: rateLimitResponse('Too many submissions — please wait 15 minutes.'),
  statusCode: status.TOO_MANY_REQUESTS,
});

// ─── Routes ───────────────────────────────────────────────────────────────────

const PREFIX = '/api/v1';

app.get(`${PREFIX}/health`, (_req: Request, res: Response) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    data: { status: 'ok' },
  };
  res.status(status.OK).json(response);
});

app.post(`${PREFIX}/audit`, auditController);
app.post(`${PREFIX}/leads`, leadsLimiter, leadController);

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
