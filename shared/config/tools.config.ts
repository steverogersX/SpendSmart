export const Tools = {
    Cursor: 'cursor',
    GithubCopilot: 'github_copilot',
    Claude: 'claude',
    ChatGPT: 'chatgpt',
    Codex: "codex",
    Gemini: 'gemini',
    Windsurf: 'windsurf',
    AnthropicAPI: 'anthropic_api',
    OpenAIAPI: 'openai_api',
    KimiAPI: "kimi_api",
    DeepseekAPI: "deepseek_api"
} as const;

export const UseCases = {
    Coding: 'coding',
    Writing: 'writing',
    Data: 'data',
    Research: 'research',
    Agentic: 'agentic',
    Mixed: 'mixed',
} as const;

export const CursorPlan = {
    Pro: 'pro',
    ProPlus: 'pro_plus',
    Ultra: 'ultra',
    Teams: 'teams',
    Enterprise: 'enterprise',
} as const;

export const GithubCopilotPlan = {
    Pro: 'pro',
    ProPlus: 'pro_plus',
    Business: 'business',
    Enterprise: 'enterprise',
} as const;

export const ClaudePlan = {
    Pro: 'pro',
    Max5x: 'max_5x',
    Max20x: 'max_20x',
    TeamStandard: 'team_standard',
    TeamPremium: 'team_premium',
    Enterprise: 'enterprise',
} as const;

export const ChatGPTPlan = {
    Go: 'go',
} as const;

export const CodexPlan = {
    Plus: 'plus',
    Pro: 'pro',
    Business: 'business',
    Enterprise: 'enterprise',
} as const;

export const GeminiPlan = {
    AIPlus: 'ai_plus',
    AIPro: 'ai_pro',
    AIUltra: 'ai_ultra',
} as const;

export const WindsurfPlan = {
    Pro: 'pro',
    Max: 'max',
    Teams: 'teams',
    Enterprise: 'enterprise',
} as const;

export const APIOnlyPlan = {
    API: 'API',
} as const;

export const PlansByTool = {
    [Tools.Cursor]: Object.values(CursorPlan),
    [Tools.GithubCopilot]: Object.values(GithubCopilotPlan),
    [Tools.Claude]: Object.values(ClaudePlan),
    [Tools.ChatGPT]: Object.values(ChatGPTPlan),
    [Tools.Codex]: Object.values(CodexPlan),
    [Tools.Gemini]: Object.values(GeminiPlan),
    [Tools.Windsurf]: Object.values(WindsurfPlan),
    [Tools.AnthropicAPI]: Object.values(APIOnlyPlan),
    [Tools.OpenAIAPI]: Object.values(APIOnlyPlan),
    [Tools.KimiAPI]: Object.values(APIOnlyPlan),
    [Tools.DeepseekAPI]: Object.values(APIOnlyPlan)
} as const;

// ─── Subscription plan prices ($/seat/month, null = custom/contact sales) ────

export const SubscriptionPlanPrices: Record<string, Record<string, number | null>> = {
    [Tools.Cursor]: {
        [CursorPlan.Pro]:        20,
        [CursorPlan.ProPlus]:    60,
        [CursorPlan.Ultra]:      200,
        [CursorPlan.Teams]:      40,
        [CursorPlan.Enterprise]: null,
    },
    [Tools.GithubCopilot]: {
        [GithubCopilotPlan.Pro]:        10,
        [GithubCopilotPlan.ProPlus]:    39,
        [GithubCopilotPlan.Business]:   19,
        [GithubCopilotPlan.Enterprise]: 39,
    },
    [Tools.Claude]: {
        [ClaudePlan.Pro]:          20,
        [ClaudePlan.Max5x]:        100,
        [ClaudePlan.Max20x]:       200,
        [ClaudePlan.TeamStandard]: 25,
        [ClaudePlan.TeamPremium]:  125,
        [ClaudePlan.Enterprise]:   null,
    },
    [Tools.ChatGPT]: {
        [ChatGPTPlan.Go]: 8,
    },
    [Tools.Codex]: {
        [CodexPlan.Plus]:       60,
        [CodexPlan.Pro]:        200,
        [CodexPlan.Business]:   40,
        [CodexPlan.Enterprise]: null,
    },
    [Tools.Gemini]: {
        [GeminiPlan.AIPlus]:  10.99,
        [GeminiPlan.AIPro]:   26.99,
        [GeminiPlan.AIUltra]: 339.99,
    },
    [Tools.Windsurf]: {
        [WindsurfPlan.Pro]:        20,
        [WindsurfPlan.Max]:        200,
        [WindsurfPlan.Teams]:      40,
        [WindsurfPlan.Enterprise]: null,
    },
};

// ─── API providers ────────────────────────────────────────────────────────────

export const APIProviders = {
    Anthropic: 'anthropic',
    OpenAI: 'openai',
    Google: 'google',
} as const;

// ─── Per-provider model names ─────────────────────────────────────────────────

export const AnthropicModels = {
    ClaudeHaiku45: 'claude-haiku-4-5',
    ClaudeSonnet46: 'claude-sonnet-4-6',
    ClaudeOpus45: 'claude-opus-4-5',
} as const;

export const OpenAIModels = {
    GPT55: 'gpt-5-5',
    GPT54: 'gpt-5-4',
    GPT54Nano: 'gpt-5-4-nano',
} as const;

export const GoogleModels = {
    Gemini25Pro: 'gemini-2.5-pro',
    Gemini25Flash: 'gemini-2.5-flash',
    Gemini25FlashLite: 'gemini-2.5-flash-lite',
} as const;

export const ModelsByProvider = {
    [APIProviders.Anthropic]: Object.values(AnthropicModels),
    [APIProviders.OpenAI]: Object.values(OpenAIModels),
    [APIProviders.Google]: Object.values(GoogleModels),
} as const;

export const KimiModels = {
    KimiK26: 'kimi-k-2-6',
    KimiK25: 'kimi-k-2-5',
} as const;

export const DeepseekModels = {
    DeepseekV4Pro: 'deepseek-v4-pro',
} as const;

export const ModelsByTool = {
    [Tools.AnthropicAPI]: Object.values(AnthropicModels),
    [Tools.OpenAIAPI]: Object.values(OpenAIModels),
    [Tools.KimiAPI]: Object.values(KimiModels),
    [Tools.DeepseekAPI]: Object.values(DeepseekModels),
} as const;
