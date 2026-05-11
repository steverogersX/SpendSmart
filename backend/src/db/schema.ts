import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  companyName: text('company_name'),
  role: text('role'),
  teamSize: text('team_size'),
  totalSavingsMonthly: numeric('total_savings_monthly', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),
  tier: text('tier'),
  ipHash: text('ip_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
