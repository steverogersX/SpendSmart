import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import status from 'http-status';
import crypto from 'crypto';
import type { AuditResult } from '@shared/types/auditResult';
import { createLead } from '../services/lead.service';
import { ApiError, ApiResponse } from '../types';
import { fromZodError } from 'zod-validation-error';
import { auditResultSchema } from '@shared/schemas/auditResults';

const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'] as const;
const TIERS = ['high', 'mid', 'low'] as const;

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.enum(TEAM_SIZES).optional(),
  tier: z.enum(TIERS).optional(),
  totalSavingsMonthly: z.number().min(0),
  auditResults: auditResultSchema,
  website: z.string().max(0, 'Unexpected field').optional(), // honeypot
});

export default async function leadController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(fromZodError(parsed.error).message, status.UNPROCESSABLE_ENTITY);
    }

    const { website, auditResults, tier, ...data } = parsed.data;

    if (website) {
      res.status(status.OK).json({ success: true } satisfies ApiResponse);
      return;
    }

    const rawIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex').slice(0, 16);

    await createLead({
      ...data,
      tier,
      ipHash,
      auditResults: auditResults as AuditResult,
    });

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Lead captured' },
    };
    res.status(status.CREATED).json(response);
  } catch (err) {
    next(err);
  }
}
