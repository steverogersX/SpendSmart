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
    Mixed: 'mixed',
} as const;

export const CursorPlan = {
    Pro: 'Pro',
    ProPlus: 'ProPlus',
    Ultra: 'Ultra',
    Teams: 'Teams',
} as const;

export const GithubCopilotPlan = {
    Pro: 'Pro',
    ProPlus: 'ProPlus',
    Business: 'Business',
    Enterprise: 'Enterprise',
} as const;

export const ClaudePlan = {
    Pro: 'Pro',
    Max5x: 'Max5x',
    Max20x: 'Max20x',
    Team: 'Team',
    Enterprise: 'Enterprise',
} as const;

export const ChatGPTPlan = {
    Go: 'Go',
    Plus: 'Plus',
    Pro100: 'Pro100',
    Pro200: 'Pro200',
    Business: 'Business',
    Enterprise: 'Enterprise',
} as const;

export const GeminiPlan = {
    Plus: 'Plus',
    Pro: 'Pro',
    Ultra: 'Ultra',
} as const;

export const WindsurfPlan = {
    Pro: 'Pro',
    Teams: 'Teams',
    Enterprise: 'Enterprise',
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
    ClaudeOpus47:   'claude-opus-4-7',
} as const;

export const OpenAIModels = {
    GPT54Nano: 'gpt-5-4-nano',
    GPT54Mini: 'gpt-5-4-mini',
    GPT54:     'gpt-5-4',
    O3:        'o3',
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
