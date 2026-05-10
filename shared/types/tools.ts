import {
    Tools,
    UseCases,
    CursorPlan,
    GithubCopilotPlan,
    ClaudePlan,
    ChatGPTPlan,
    GeminiPlan,
    WindsurfPlan,
    APIOnlyPlan,
    APIProviders,
    AnthropicModels,
    OpenAIModels,
    GoogleModels,
} from '@shared/config/tools.config';

export type ToolName              = typeof Tools[keyof typeof Tools];

export type CursorPlanType        = typeof CursorPlan[keyof typeof CursorPlan];
export type GithubCopilotPlanType = typeof GithubCopilotPlan[keyof typeof GithubCopilotPlan];
export type ClaudePlanType        = typeof ClaudePlan[keyof typeof ClaudePlan];
export type ChatGPTPlanType       = typeof ChatGPTPlan[keyof typeof ChatGPTPlan];
export type GeminiPlanType        = typeof GeminiPlan[keyof typeof GeminiPlan];
export type WindsurfPlanType      = typeof WindsurfPlan[keyof typeof WindsurfPlan];
export type APIOnlyPlanType       = typeof APIOnlyPlan[keyof typeof APIOnlyPlan];

export type APIProviderType       = typeof APIProviders[keyof typeof APIProviders];
export type AnthropicModelType    = typeof AnthropicModels[keyof typeof AnthropicModels];
export type OpenAIModelType       = typeof OpenAIModels[keyof typeof OpenAIModels];
export type GoogleModelType       = typeof GoogleModels[keyof typeof GoogleModels];
export type UseCaseType            = typeof UseCases[keyof typeof UseCases];