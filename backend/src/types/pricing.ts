import { z } from 'zod';
import { UseCases } from '../config/tools.config';

export const ScoreTypeSchema = z.enum(['absolute', 'relative']);
export const ScoreUnitSchema = z.enum(['percentage', 'Elo points']);
export const UseCaseSchema   = z.enum(Object.values(UseCases) as [string, ...string[]]);

export const ModelUseCaseSchema = z.object({
    useCase:        z.array(UseCaseSchema),
    benchmarkName:  z.string(),
    benchmarkUrl:   z.string(),
    score:          z.number().nullable(),
    scoreFormat:    z.string(),
    scoreUnit:      ScoreUnitSchema,
    higherIsBetter: z.boolean(),
    scoreType:      ScoreTypeSchema,
    maxScore:       z.number().optional(),
    notes:          z.string(),
});

export const ModelPricingSchema = z.object({
    displayName:             z.string(),
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
    url:   z.url(),
    plans: z.record(z.string(), PlanSchema),
});

export const APIVendorSchema = z.object({
    type:   z.literal('api'),
    name:   z.string(),
    url:    z.url(),
    models: z.record(z.string(), ModelPricingSchema),
});

export const AnyVendorSchema               = z.discriminatedUnion('type', [SubscriptionVendorSchema, APIVendorSchema]);
export const PricingDataSchema             = z.record(z.string(), AnyVendorSchema);
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
