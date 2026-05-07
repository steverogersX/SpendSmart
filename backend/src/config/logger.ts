import type { IncomingMessage, ServerResponse } from 'http';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from './env';

const isDev = config.NODE_ENV !== 'production';

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
    },
  }),
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel(_req: IncomingMessage, res: ServerResponse, err?: Error) {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(req: IncomingMessage, res: ServerResponse, responseTime: number) {
    return `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`;
  },
  customErrorMessage(req: IncomingMessage, res: ServerResponse, err: Error) {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },
  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
});
