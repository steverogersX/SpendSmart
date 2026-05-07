import { z } from 'zod';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Tools = {
    Cursor:       'cursor',
    GithubCopilot:'github_copilot',
    Claude:       'claude',
    ChatGPT:      'chatgpt',
    Gemini:       'gemini',
    Windsurf:     'windsurf',
    AnthropicAPI: 'anthropic_api',
    OpenAIAPI:    'openai_api',
} as const;

export const UseCases = {
    Coding:   'coding',
    Writing:  'writing',
    Data:     'data',
    Research: 'research',
    Mixed:    'mixed',
} as const;

// ─── Pricing data Zod schemas (for pricingData.json) ─────────────────────────

export const UseCaseSchema = z.enum(
    Object.values(UseCases) as [string, ...string[]],
);

export const PlanSchema = z.object({
    pricePerSeat: z.number().nullable(),
    verifiedDate: z.string(),
    useCases: z.array(UseCaseSchema),
});

export const VendorSchema = z.object({
    name:  z.string(),
    url:   z.url(),
    plans: z.record(z.string(), PlanSchema),
});

export const PricingDataSchema = z.record(z.string(), VendorSchema);

export type Plan        = z.infer<typeof PlanSchema>;
export type Vendor      = z.infer<typeof VendorSchema>;
export type PricingData = z.infer<typeof PricingDataSchema>;

// ─── Per-tool plan names (must match pricingData.json keys) ──────────────────

export const CursorPlan = {
    Pro:     'Pro',
    ProPlus: 'ProPlus',
    Ultra:   'Ultra',
    Teams:   'Teams',
} as const;

export const GithubCopilotPlan = {
    Pro:        'Pro',
    ProPlus:    'ProPlus',
    Business:   'Business',
    Enterprise: 'Enterprise',
} as const;

export const ClaudePlan = {
    Pro:        'Pro',
    Max5x:      'Max5x',
    Max20x:     'Max20x',
    Team:       'Team',
    Enterprise: 'Enterprise',
} as const;

export const ChatGPTPlan = {
    Go:         'Go',
    Plus:       'Plus',
    Pro100:     'Pro100',
    Pro200:     'Pro200',
    Business:   'Business',
    Enterprise: 'Enterprise',
} as const;

export const GeminiPlan = {
    Plus:  'Plus',
    Pro:   'Pro',
    Ultra: 'Ultra',
} as const;

export const WindsurfPlan = {
    Pro:        'Pro',
    Teams:      'Teams',
    Enterprise: 'Enterprise',
} as const;

export const APIOnlyPlan = {
    API: 'API',
} as const;

export type CursorPlanType       = typeof CursorPlan[keyof typeof CursorPlan];
export type GithubCopilotPlanType= typeof GithubCopilotPlan[keyof typeof GithubCopilotPlan];
export type ClaudePlanType       = typeof ClaudePlan[keyof typeof ClaudePlan];
export type ChatGPTPlanType      = typeof ChatGPTPlan[keyof typeof ChatGPTPlan];
export type GeminiPlanType       = typeof GeminiPlan[keyof typeof GeminiPlan];
export type WindsurfPlanType     = typeof WindsurfPlan[keyof typeof WindsurfPlan];

export const PlansByTool = {
    [Tools.Cursor]:        Object.values(CursorPlan),
    [Tools.GithubCopilot]: Object.values(GithubCopilotPlan),
    [Tools.Claude]:        Object.values(ClaudePlan),
    [Tools.ChatGPT]:       Object.values(ChatGPTPlan),
    [Tools.Gemini]:        Object.values(GeminiPlan),
    [Tools.Windsurf]:      Object.values(WindsurfPlan),
    [Tools.AnthropicAPI]:  Object.values(APIOnlyPlan),
    [Tools.OpenAIAPI]:     Object.values(APIOnlyPlan),
} as const;

// ─── Request validation schemas ───────────────────────────────────────────────

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
            code: 'custom',
            message: `Invalid plan "${data.plan}" for tool "${data.tool}". Valid plans are: ${validPlans.join(', ')}`,
            path: ['plan'],
        });
    }
});

export const auditRequestSchema = z.object({
    tools: z.array(toolSchema).min(1).max(8),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
export type ToolInput    = z.infer<typeof toolSchema>;
export type ToolName     = typeof Tools[keyof typeof Tools];
export type UseCase      = typeof UseCases[keyof typeof UseCases];
