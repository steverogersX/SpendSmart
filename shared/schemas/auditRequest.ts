import { z } from 'zod';
import {
    Tools,
    PlansByTool,
    ModelsByTool,
} from '@shared/config/tools.config';
import { UseCaseSchema } from '../../backend/src/types/pricing';

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


export {
    UseCaseSchema,
    PricingDataSchema,
    SubscriptionPricingDataSchema,
    APIPricingDataSchema,
} from '../../backend/src/types/pricing';

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
} from '../../backend/src/types/pricing';

// ─── Subscription tool schema ─────────────────────────────────────────────────
export const toolSchema = z.object({
    tool: z.enum(Object.values(Tools) as [string, ...string[]], {
        error: "Please select the use case"
    }),
    plan: z.string().min(1, "Please select a plan"),
    seats: z.number({ error: "Please enter a valid number of seats" }).int("Seats must be a whole number").min(1, "At least 1 seat is required"),
    monthlySpend: z.number({ error: "Please enter a valid monthly spend" }).min(0, "Monthly spend cannot be negative"),
    useCase: UseCaseSchema,
    type: z.literal("subscription"),
}).superRefine((data, ctx) => {
    const validPlans = PlansByTool[data.tool as keyof typeof PlansByTool];
    if (!validPlans.includes(data.plan as never)) {
        ctx.addIssue({
            code: 'custom',
            message: "The selected plan is not available for this tool",
            path: ['plan'],
        });
    }
});

export type ToolInput = z.infer<typeof toolSchema>;

// ─── API tool schema ──────────────────────────────────────────────────────────
export const apiToolSchema = z.object({
    tool: z.enum([Tools.AnthropicAPI, Tools.OpenAIAPI], {
        error: "Please select an API provider",
    }),
    primaryModel: z.string().min(1, "Please select a model"),
    averageMonthlySpend: z.number({ error: "Please enter a valid monthly spend" }).min(0, "Monthly spend cannot be negative"),
    useCase: UseCaseSchema,

    type: z.literal("api"),

    dropCapacityBy: z.number({ error: "Please enter a valid percentage" }).positive("Capacity buffer must be greater than 0").optional().default(5),
    okayWithChineseModals: z.boolean().optional().default(false),
    contextWindow: z.number({ error: "Please enter a valid context window size" }).positive("Context window must be greater than 0").optional(),

}).superRefine((data, ctx) => {
    const validModels = ModelsByTool[data.tool as keyof typeof ModelsByTool];
    if (!validModels.includes(data.primaryModel as never)) {
        ctx.addIssue({
            code: 'custom',
            message: "The selected model is not available for this provider",
            path: ['primaryModel'],
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
