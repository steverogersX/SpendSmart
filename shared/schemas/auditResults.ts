import { z } from "zod";

export const auditRequestTypeSchema = z.enum(["subscription", "api"]);

export const optimizationStatusSchema = z.enum([
    "optimal",
    "optimize",
]);

export const scoreTypeSchema = z.enum([
    "absolute",
    "relative",
]);

export const scoreUnitSchema = z.enum([
    "percentage",
    "Elo points",
]);


export const subscriptionRecommendationSchema = z.object({
    toolName: z.string(),
    planName: z.string(),
    savings: z.number(),
    savingsPercent: z.number(),
    reason: z.string(),
});


export const apiRecommendationSchema = z.object({
    modelName: z.string(),
    modelDisplayName: z.string(),
    contextWindow: z.number(),
    verifiedDate: z.string(),
    benchmarkName: z.string(),
    benchmarkUrl: z.string().url(),
    pricingUrl: z.string().url(),
    savings: z.number(),
    savingsPercent: z.number(),
    reason: z.string(),
    estimatedMonthlyTokens: z.number(),
    score: z.number(),
    scoreType: scoreTypeSchema,
    scoreUnit: scoreUnitSchema,
    higherIsBetter: z.boolean(),
    maxScore: z.number().nullable(),
});


export const apiAuditResultSchema = z.object({
    toolName: z.string(),
    primaryModel: z.string(),
    primaryUseCase: z.string(),
    currentAverageMonthlySpend: z.number(),
    currentModelScore: z.number().nullable(),
    scoreType: scoreTypeSchema,
    scoreUnit: scoreUnitSchema,
    higherIsBetter: z.boolean(),
    maxScore: z.number().nullable(),
    benchmarkName: z.string(),
    benchmarkUrl: z.string().url(),
    dropCapacityBy: z.number(),
    summary: z.string(),
    status: optimizationStatusSchema,
    bestRecommendation: apiRecommendationSchema.nullable(),
    otherOptions: z.array(apiRecommendationSchema),
});


export const monthlySubscriptionAuditResultSchema = z.object({
    tool: z.string(),
    usageType: auditRequestTypeSchema,
    currentPlan: z.string(),
    currentCost: z.number(),
    status: optimizationStatusSchema,
    bestRecommendation: subscriptionRecommendationSchema.nullable(),
    otherOptions: z.array(subscriptionRecommendationSchema),
});


export const auditResultItemSchema = z.union([
    apiAuditResultSchema,
    monthlySubscriptionAuditResultSchema,
]);


export const auditResultSchema = z.object({
    tools: z.array(auditResultItemSchema),
    aiSummary: z.string().optional(),
});

