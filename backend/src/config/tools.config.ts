export const Tools = {
    Cursor: 'cursor',
    GithubCopilot: 'github_copilot',
    Claude: 'claude',
    ChatGPT: 'chatgpt',
    Gemini: 'gemini',
    Windsurf: 'windsurf',
    AnthropicAPI: 'anthropic_api',
    OpenAIAPI: 'openai_api',
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
} as const;

export const ChatGPTPlan = {
    Go: 'go',
    Plus: 'plus',
    Pro100: 'pro_100',
    Pro200: 'pro_200',
    Business: 'business',
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
} as const;

export const APIOnlyPlan = {
    API: 'API',
} as const;

export const PlansByTool = {
    [Tools.Cursor]: Object.values(CursorPlan),
    [Tools.GithubCopilot]: Object.values(GithubCopilotPlan),
    [Tools.Claude]: Object.values(ClaudePlan),
    [Tools.ChatGPT]: Object.values(ChatGPTPlan),
    [Tools.Gemini]: Object.values(GeminiPlan),
    [Tools.Windsurf]: Object.values(WindsurfPlan),
    [Tools.AnthropicAPI]: Object.values(APIOnlyPlan),
    [Tools.OpenAIAPI]: Object.values(APIOnlyPlan),
} as const;

// ─── API providers ────────────────────────────────────────────────────────────

export const APIProviders = {
    Anthropic: 'anthropic',
    OpenAI: 'openai',
    Google: 'google',
} as const;

// ─── Per-provider model names ─────────────────────────────────────────────────

export const AnthropicModels = {
    ClaudeHaiku45:  'claude-haiku-4-5',
    ClaudeSonnet46: 'claude-sonnet-4-6',
    ClaudeOpus45:   'claude-opus-4-5',
} as const;

export const OpenAIModels = {
    GPT55:     'gpt-5-5',
    GPT54:     'gpt-5-4',
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

export const ModelsByTool = {
    [Tools.AnthropicAPI]: Object.values(AnthropicModels),
    [Tools.OpenAIAPI]: Object.values(OpenAIModels),
} as const;
