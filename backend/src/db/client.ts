import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, type PoolConfig } from 'pg';
import { config } from '../config/env';
import { logger } from '../config/logger';
import * as schema from './schema';

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  family: 4,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
} as PoolConfig & { family: number });

pool.on('error', (err) => {
  logger.error({ err }, 'pg pool idle error');
});

export const db = drizzle(pool, { schema });
