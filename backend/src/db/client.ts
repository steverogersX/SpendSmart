import { setDefaultResultOrder } from 'dns';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config/env';
import { logger } from '../config/logger';
import * as schema from './schema';

// pg doesn't forward a `family` option to net.connect, so force IPv4 DNS
// resolution here — Render's network can't reach Supabase over IPv6.
setDefaultResultOrder('ipv4first');

const pool = new Pool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'pg pool idle error');
});

export const db = drizzle(pool, { schema });
