import type { AuditResult } from '@shared/types/auditResult';
import { logger } from '../config/logger';
import { buildEmailHtml } from '../emails/email.templates';
import { sendEmail } from '../emails/mailer';
import { db } from '../db/client';
import { leads } from '../db/schema';
import { sql } from 'drizzle-orm';

export interface CreateLeadInput {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: string;
  tier?: string;
  totalSavingsMonthly: number;
  ipHash: string;
  auditResults: AuditResult;
}

export async function createLead(input: CreateLeadInput): Promise<void> {
  const { email, companyName, role, teamSize, tier, totalSavingsMonthly, ipHash, auditResults } = input;

  await db
    .insert(leads)
    .values({
      email,
      companyName: companyName ?? null,
      role: role ?? null,
      teamSize: teamSize ?? null,
      tier: tier ?? null,
      totalSavingsMonthly: String(totalSavingsMonthly),
      ipHash,
    })
    .onConflictDoUpdate({
      target: leads.email,
      set: {
        companyName: sql`COALESCE(EXCLUDED.company_name, ${leads.companyName})`,
        role: sql`COALESCE(EXCLUDED.role, ${leads.role})`,
        teamSize: sql`COALESCE(EXCLUDED.team_size, ${leads.teamSize})`,
        tier: sql`COALESCE(EXCLUDED.tier, ${leads.tier})`,
        totalSavingsMonthly: String(totalSavingsMonthly),
        updatedAt: new Date(),
      },
    });

  logger.info({ email, totalSavingsMonthly }, 'lead stored');

  try {
    const [html] = await Promise.all([
      buildEmailHtml(auditResults),
    ]);
    await sendEmail({ to: email, subject : "Cost Saving Detected", html });
    logger.info({ email }, 'confirmation email sent');
  } catch (err) {
    logger.warn({ err, email }, 'confirmation email failed — lead stored anyway');
  }
}
