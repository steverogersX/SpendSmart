import { z } from 'zod';
import { Tools, UseCases } from '@shared/config/tools.config';

export const ScoreTypeSchema = z.enum(['absolute', 'relative']);
export const ScoreUnitSchema = z.enum(['percentage', 'Elo points']);
export const UseCaseSchema   = z.enum(Object.values(UseCases) as [string, ...string[]], {
     error: "Please select a use case" ,
});

export const ModelUseCaseSchema = z.object({
    useCase:        UseCaseSchema,
    benchmarkName:  z.string(),
    benchmarkUrl:   z.url(),
    score:          z.number().nonnegative(),
    scoreFormat:    z.string().describe('A human-readable description of the score format, e.g. "higher is better" or "lower is better"'),
    scoreUnit:      ScoreUnitSchema,
    higherIsBetter: z.boolean().default(true),
    scoreType:      ScoreTypeSchema,
    maxScore:       z.number().optional().nullable(),
    notes:          z.string().optional(),
});

export const ModelPricingSchema = z.object({
    displayName:             z.string(),
    sourceUrl:               z.url(),
    inputPricePer1MTokens:   z.number(),
    outputPricePer1MTokens:  z.number(),
    contextWindow:           z.number().int().positive(),
    verifiedDate:            z.string(),
    useCases:                z.array(ModelUseCaseSchema),
});

export const PlanSchema = z.object({
    pricePerSeat: z.number().nullable(),
    verifiedDate: z.string(),
    useCases:     z.array(UseCaseSchema),
});

export const SubscriptionVendorSchema = z.object({
    type:  z.literal('subscription'),
    name:  z.string(),
    sourceUrl:   z.url(),
    plans: z.record(z.string(), PlanSchema),
});

export const APIVendorSchema = z.object({
    type:      z.literal('api'),
    name:      z.string(),
    sourceUrl: z.url().optional(),
    models:    z.record(z.string(), ModelPricingSchema),
    isChineseModel : z.boolean().default(false)
});

export const AnyVendorSchema               = z.discriminatedUnion('type', [SubscriptionVendorSchema, APIVendorSchema]);
export const PricingDataSchema             = z.record(z.enum(Object.values(Tools) as [string, ...string[]]), AnyVendorSchema);
export const SubscriptionPricingDataSchema = z.record(z.string(), SubscriptionVendorSchema);
export const APIPricingDataSchema          = z.record(z.string(), APIVendorSchema);

export type ScoreType               = z.infer<typeof ScoreTypeSchema>;
export type ScoreUnit               = z.infer<typeof ScoreUnitSchema>;
export type UseCase                 = z.infer<typeof UseCaseSchema>;
export type ModelUseCase            = z.infer<typeof ModelUseCaseSchema>;
export type ModelPricing            = z.infer<typeof ModelPricingSchema>;
export type Plan                    = z.infer<typeof PlanSchema>;
export type SubscriptionVendor      = z.infer<typeof SubscriptionVendorSchema>;
export type APIVendor               = z.infer<typeof APIVendorSchema>;
export type AnyVendor               = z.infer<typeof AnyVendorSchema>;
export type PricingData             = z.infer<typeof PricingDataSchema>;
export type SubscriptionPricingData = z.infer<typeof SubscriptionPricingDataSchema>;
export type APIPricingData          = z.infer<typeof APIPricingDataSchema>;

/** @deprecated use SubscriptionVendor */
export type Vendor = SubscriptionVendor;
