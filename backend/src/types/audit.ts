import { z } from 'zod';
import {
    Tools,
    PlansByTool,
    APIProviders,
    ModelsByProvider,
} from '../config/tools.config';
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
} from '../config/tools.config';

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
} from './tools';

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
    provider:               z.enum(Object.values(APIProviders) as [string, ...string[]]),
    primaryModel:           z.string().min(1),
    monthlySpend:           z.number().min(0),
    useCase:                UseCaseSchema,
    needsBetterToolCalling: z.boolean().optional().default(false),
    needsStructuredOutput:  z.boolean().optional().default(false),
    okayWithChineseHosted:  z.boolean().optional().default(false),
    needsLongContext:       z.boolean().optional().default(false),
    isTimeSensitive:        z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
    const validModels = ModelsByProvider[data.provider as keyof typeof ModelsByProvider];
    if (!validModels.includes(data.primaryModel as never)) {
        ctx.addIssue({
            code:    'custom',
            message: `Invalid model "${data.primaryModel}" for provider "${data.provider}". Valid models are: ${validModels.join(', ')}`,
            path:    ['primaryModel'],
        });
    }
});

export type APIToolInput = z.infer<typeof apiToolSchema>;

// ─── Combined union ───────────────────────────────────────────────────────────

export const anyToolSchema = z.union([toolSchema, apiToolSchema]);
export type AnyToolInput = z.infer<typeof anyToolSchema>;

// ─── Request schemas ──────────────────────────────────────────────────────────

export const auditRequestSchema = z.object({
    tools: z.array(anyToolSchema).min(1).max(8),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
