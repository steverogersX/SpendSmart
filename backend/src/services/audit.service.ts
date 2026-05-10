import {
    AuditRequest,
    ToolInput,
    APIToolInput,
    AnyToolInput,
    UseCase,
} from "@shared/schemas/audit";
import {
    AuditResult,
    ApiAuditResult,
    MonthlySubscriptionAuditResult,
    ApiRecommendation,
    SubscriptionRecommendation,
} from "@/types";
import { pricingData, apiPricingData } from "@/data/pricingData";

// API inputs carry `averageMonthlySpend`, subscription inputs carry
// `monthlySpend` + `seats` + `plan`. no explicit `type` field on the input
// schema because callers (incl. tests) don't pass one
function isAPIInput(input: AnyToolInput): input is APIToolInput {
    return typeof (input as APIToolInput).averageMonthlySpend === 'number';
}

// real usage skews input-heavy (prompts >> completions in most workloads)
// 70/30 is a practical default; no per-request ratio field in the schema
const INPUT_RATIO  = 0.7;
const OUTPUT_RATIO = 0.3;

// minimum % savings to surface a recommendation — candidates that
// cost only marginally less create noise without meaningful ROI
const SAVINGS_THRESHOLD_PCT = 30;


const auditSubscriptionTool = (input: ToolInput): MonthlySubscriptionAuditResult => {
    const currentVendor = pricingData[input.tool];
    const currentPlanData = currentVendor?.plans?.[input.plan];

    const currentTotalCost = currentPlanData?.pricePerSeat != null
        ? currentPlanData.pricePerSeat * input.seats
        : input.monthlySpend;

    const candidates: SubscriptionRecommendation[] = [];

    for (const [toolKey, vendor] of Object.entries(pricingData)) {
        for (const [planName, plan] of Object.entries(vendor.plans)) {
            if (!plan.useCases.includes(input.useCase as UseCase)) continue;
            if (plan.pricePerSeat === null) continue;
            if (toolKey === input.tool && planName === input.plan) continue;

            const alternativeCost = plan.pricePerSeat * input.seats;
            if (alternativeCost >= currentTotalCost) continue;

            const savings = currentTotalCost - alternativeCost;
            candidates.push({
                toolName: toolKey,
                planName,
                savings,
                savingsPercent: (savings / currentTotalCost) * 100,
                reason: `${vendor.name} ${planName} at $${plan.pricePerSeat}/seat`,
            });
        }
    }

    candidates.sort((a, b) => b.savings - a.savings);
    const [bestRecommendation = null, ...otherOptions] = candidates;

    return {
        tool: input.tool,
        usageType: 'subscription',
        currentPlan: input.plan,
        currentCost: currentTotalCost,
        status: candidates.length === 0 ? 'optimal' : 'optimize',
        bestRecommendation,
        otherOptions,
    };
};


const auditApiTool = (input: APIToolInput): ApiAuditResult => {
    const currentVendor = apiPricingData[input.tool];
    const currentModel  = currentVendor.models[input.primaryModel];

    // weighted price per 1M tokens for the current model
    // current_weighted = (0.7 × inputPrice) + (0.3 × outputPrice)
    const currentWeighted =
        INPUT_RATIO  * currentModel.inputPricePer1MTokens +
        OUTPUT_RATIO * currentModel.outputPricePer1MTokens;

    // back-solve monthly token volume from observed spend
    // averageMonthlySpend = (tokens / 1_000_000) × currentWeighted
    // → tokens = (averageMonthlySpend / currentWeighted) × 1_000_000
    const estimatedMonthlyTokens = Math.round(
        (input.averageMonthlySpend / currentWeighted) * 1_000_000,
    );

    // score of the current model for the requested use case (used as quality baseline)
    const currentUseCaseEntry = currentModel.useCases.find(uc => uc.useCase === input.useCase);
    const currentScore        = currentUseCaseEntry?.score ?? null;

    // quality floor: we tolerate up to dropCapacityBy% degradation
    // min_acceptable = currentScore × (1 − dropCapacityBy / 100)
    const minAcceptableScore =
        currentScore !== null
            ? currentScore * (1 - input.dropCapacityBy / 100)
            : null;

    // search every API vendor so a user on anthropic_api can be recommended
    // an openai_api model and vice-versa (API → API only, per product scope)
    const candidates: ApiRecommendation[] = [];

    for (const [vendorKey, vendor] of Object.entries(apiPricingData)) {
        for (const [modelKey, model] of Object.entries(vendor.models)) {

            // Gate 0 — skip self
            if (vendorKey === input.tool && modelKey === input.primaryModel) continue;

            // Gate 1 — use case support
            const candidateUCEntry = model.useCases.find(uc => uc.useCase === input.useCase);
            if (!candidateUCEntry) continue;

            // Gate 2 — quality floor
            // candidate score must be within the user's acceptable tolerance
            if (minAcceptableScore !== null && candidateUCEntry.score < minAcceptableScore) continue;

            // Gate 3 — must be cheaper (weighted price)
            // candidate_weighted = (0.7 × inPrice) + (0.3 × outPrice)
            const candidateWeighted =
                INPUT_RATIO  * model.inputPricePer1MTokens +
                OUTPUT_RATIO * model.outputPricePer1MTokens;
            if (candidateWeighted >= currentWeighted) continue;

            // Gate 4 — minimum savings threshold
            // estimated_new_spend = (tokens / 1_000_000) × candidateWeighted
            // savings_pct         = (monthlySavings / averageMonthlySpend) × 100
            const estimatedNewSpend = (estimatedMonthlyTokens / 1_000_000) * candidateWeighted;
            const monthlySavings    = input.averageMonthlySpend - estimatedNewSpend;
            const savingsPct        = (monthlySavings / input.averageMonthlySpend) * 100;
            if (savingsPct < SAVINGS_THRESHOLD_PCT) continue;

            // Gate 5 — context window (only checked when caller specifies a requirement)
            if (input.contextWindow && model.contextWindow < input.contextWindow) continue;

            candidates.push({
                modelName:            modelKey,
                modelDisplayName:     model.displayName,
                contextWindow:        model.contextWindow,
                verifiedDate:         model.verifiedDate,
                benchmarkName:        candidateUCEntry.benchmarkName,
                benchmarkUrl:         candidateUCEntry.benchmarkUrl,
                savings:              monthlySavings,
                savingsPercent:       savingsPct,
                estimatedMonthlyTokens,
                reason: `${model.displayName} — $${model.inputPricePer1MTokens}/$${model.outputPricePer1MTokens} per 1M tokens (in/out)`,
            });
        }
    }

    // rank by monthly savings (most dollars saved = best)
    candidates.sort((a, b) => b.savings - a.savings);
    const [bestRecommendation = null, ...otherOptions] = candidates;

    return {
        toolName:                   input.tool,
        primaryModel:               input.primaryModel,
        primaryUseCase:             input.useCase,
        currentAverageMonthlySpend: input.averageMonthlySpend,
        status:                     candidates.length === 0 ? 'optimal' : 'optimize',
        bestRecommendation,
        otherOptions,
    };
};


const auditService = (request: AuditRequest): AuditResult => ({
    results: request.tools.map(tool =>
        isAPIInput(tool) ? auditApiTool(tool) : auditSubscriptionTool(tool),
    ),
});

export default auditService;
