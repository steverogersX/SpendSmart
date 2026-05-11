import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'postgres',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD!,
    ssl: true,
  },
});
