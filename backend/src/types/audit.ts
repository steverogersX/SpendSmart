import { z } from 'zod';
import {
    Tools,
    PlansByTool,
    ModelsByTool,
} from '@shared/config/tools.config';
import { UseCaseSchema } from './pricing';

// ─── Re-exports: tools config ─────────────────────────────────────────────────

export {
    Tools,
    UseCases,
    CursorPlan,
    GithubCopilotPlan,
    ClaudePlan,
    ChatGPTPlan,
    GeminiPlan,
    WindsurfPlan,
    APIOnlyPlan,
    PlansByTool,
    APIProviders,
    AnthropicModels,
    OpenAIModels,
    GoogleModels,
    ModelsByProvider,
} from '@shared/config/tools.config';

export type {
    ToolName,
    CursorPlanType,
    GithubCopilotPlanType,
    ClaudePlanType,
    ChatGPTPlanType,
    GeminiPlanType,
    WindsurfPlanType,
    APIOnlyPlanType,
    APIProviderType,
    AnthropicModelType,
    OpenAIModelType,
    GoogleModelType,
} from '@shared/types/tools';

// ─── Re-exports: pricing ──────────────────────────────────────────────────────

export {
    UseCaseSchema,
    PricingDataSchema,
    SubscriptionPricingDataSchema,
    APIPricingDataSchema,
} from './pricing';

export type {
    ScoreType,
    ScoreUnit,
    UseCase,
    ModelUseCase,
    ModelPricing,
    Plan,
    SubscriptionVendor,
    APIVendor,
    AnyVendor,
    PricingData,
    SubscriptionPricingData,
    APIPricingData,
    Vendor,
} from './pricing';

// ─── Subscription tool schema ─────────────────────────────────────────────────

export const toolSchema = z.object({
    tool:         z.enum(Object.values(Tools) as [string, ...string[]]),
    plan:         z.string().min(1),
    seats:        z.number().int().min(1),
    monthlySpend: z.number().min(0),
    useCase:      UseCaseSchema,
}).superRefine((data, ctx) => {
    const validPlans = PlansByTool[data.tool as keyof typeof PlansByTool];
    if (!validPlans.includes(data.plan as never)) {
        ctx.addIssue({
            code:    'custom',
            message: `Invalid plan "${data.plan}" for tool "${data.tool}". Valid plans are: ${validPlans.join(', ')}`,
            path:    ['plan'],
        });
    }
});

export type ToolInput = z.infer<typeof toolSchema>;

// ─── API tool schema ──────────────────────────────────────────────────────────

export const apiToolSchema = z.object({
    tool:                   z.enum([Tools.AnthropicAPI, Tools.OpenAIAPI]),
    primaryModel:           z.string().min(1),
    averageMonthlySpend:    z.number().min(0),
    useCase:                UseCaseSchema,

    dropCapacityBy : z.number().positive().optional().default(5), // Percentage buffer to account for variability in API usage and pricing. For example, if the audit identifies a cheaper model that has 5% lower benchmark scores, we can recommend it with confidence that it will still meet the user's needs even if their usage patterns change slightly or if there are minor discrepancies between benchmark performance and real-world performance.
    okayWithChineseModals:  z.boolean().optional().default(false),
    contextWindow:       z.number().positive().optional(),

}).superRefine((data, ctx) => {
    const validModels = ModelsByTool[data.tool as keyof typeof ModelsByTool];
    if (!validModels.includes(data.primaryModel as never)) {
        ctx.addIssue({
            code:    'custom',
            message: `Invalid model "${data.primaryModel}" for tool "${data.tool}". Valid models are: ${validModels.join(', ')}`,
            path:    ['primaryModel'],
        });
    }
});

export type APIToolInput = z.infer<typeof apiToolSchema>;


export const anyToolSchema = z.union([toolSchema, apiToolSchema]);
export type AnyToolInput = z.infer<typeof anyToolSchema>;

export const auditRequestSchema = z.object({
    tools: z.array(anyToolSchema).min(1).max(8),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
