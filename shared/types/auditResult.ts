
import {
  auditResultItemSchema,
  auditResultSchema,
  auditRequestTypeSchema,
  optimizationStatusSchema,
  subscriptionRecommendationSchema,
  apiRecommendationSchema,
  apiAuditResultSchema,
  monthlySubscriptionAuditResultSchema
} from '@shared/schemas/auditResults'
import { z } from 'zod';


export type AuditRequestType = z.infer<typeof auditRequestTypeSchema>;

export type OptimizationStatus = z.infer<
  typeof optimizationStatusSchema
>;

export type SubscriptionRecommendation = z.infer<
  typeof subscriptionRecommendationSchema
>;

export type ApiRecommendation = z.infer<
  typeof apiRecommendationSchema
>;

export type ApiAuditResult = z.infer<
  typeof apiAuditResultSchema
>;

export type MonthlySubscriptionAuditResult = z.infer<
  typeof monthlySubscriptionAuditResultSchema
>;

export type AuditResultItem = z.infer<
  typeof auditResultItemSchema
>;

export type AuditResult = z.infer<
  typeof auditResultSchema
>;