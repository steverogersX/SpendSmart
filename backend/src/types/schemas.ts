import {z} from 'zod';

export const Tools = {
    Cursor: 'cursor',
    GithubCopilot: 'github_copilot',
    Claude: 'claude',
    ChatGPT: 'chatgpt',
    AnthropicAPI: 'anthropic_api',
    OpenAIAPI: 'openai_api',
    Gemini: 'gemini',
    Windsurf: 'windsurf',
} as const;

export const UseCases = {
    Coding: 'coding',
    Writing: 'writing',
    Data: 'data',
    Research: 'research',
    Mixed: 'mixed',
} as const;

export const CursorPlan = {
    Hobby: 'Hobby',
    Pro: 'Pro',
    Business: 'Business',
    Enterprise: 'Enterprise',
} as const;

export const GithubCopilotPlan = {
    Individual: 'Individual',
    Business: 'Business',
    Enterprise: 'Enterprise',
} as const;

export const ClaudePlan = {
    Free: 'Free',
    Pro: 'Pro',
    Max: 'Max',
    Team: 'Team',
    Enterprise: 'Enterprise',
    API: 'API',
} as const;

export const ChatGPTPlan = {
    Plus: 'Plus',
    Team: 'Team',
    Enterprise: 'Enterprise',
    API: 'API',
} as const;

export const GeminiPlan = {
    Pro: 'Pro',
    Ultra: 'Ultra',
    API: 'API',
} as const;

export const WindsurfPlan = {
    Free: 'Free',
    Pro: 'Pro',
    Teams: 'Teams',
} as const;

export type CursorPlanType = typeof CursorPlan[keyof typeof CursorPlan];
export type GithubCopilotPlanType = typeof GithubCopilotPlan[keyof typeof GithubCopilotPlan];
export type ClaudePlanType = typeof ClaudePlan[keyof typeof ClaudePlan];
export type ChatGPTPlanType = typeof ChatGPTPlan[keyof typeof ChatGPTPlan];
export type GeminiPlanType = typeof GeminiPlan[keyof typeof GeminiPlan];
export type WindsurfPlanType = typeof WindsurfPlan[keyof typeof WindsurfPlan];

export const PlansByTool = {
    [Tools.Cursor]: Object.values(CursorPlan),
    [Tools.GithubCopilot]: Object.values(GithubCopilotPlan),
    [Tools.Claude]: Object.values(ClaudePlan),
    [Tools.ChatGPT]: Object.values(ChatGPTPlan),
    [Tools.Gemini]: Object.values(GeminiPlan),
    [Tools.Windsurf]: Object.values(WindsurfPlan),
} as const;

export const toolSchema = z.object({
    tool: z.enum(Object.values(Tools) as [string, ...string[]]),
    plan: z.string().min(1),
    seats: z.number().int().min(1),
    monthlySpend: z.number().min(0),
    useCase: z.enum(Object.values(UseCases) as [string, ...string[]]),
}).superRefine((data, ctx) => {
    const validPlans = PlansByTool[data.tool as keyof typeof PlansByTool];
    if (!validPlans.includes(data.plan as never)) {
        ctx.addIssue({
            code: "custom",
            message: `Invalid plan "${data.plan}" for tool "${data.tool}". Valid plans are: ${validPlans.join(', ')}`,
            path: ['plan'],
        });
    }
});

export const auditRequestSchema = z.object({
    tools: z.array(toolSchema).min(1).max(8),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
export type ToolInput = z.infer<typeof toolSchema>;
export type ToolName = typeof Tools[keyof typeof Tools];
export type UseCase = typeof UseCases[keyof typeof UseCases];