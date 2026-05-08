import { AuditRequest, ToolInput, UseCase } from "@/types/audit";
import { AuditResult, Recommendation } from "@/types";
import { pricingData } from "@/data/pricingData";

const auditTool = (input: ToolInput): AuditResult => {
    const currentVendor = pricingData[input.tool];
    const currentPlanData = currentVendor.plans[input.plan];

    const currentTotalCost = currentPlanData?.pricePerSeat != null
        ? currentPlanData.pricePerSeat * input.seats
        : input.monthlySpend;

    const candidates: Recommendation[] = [];

    for (const [toolKey, vendor] of Object.entries(pricingData)) {
        for (const [planName, plan] of Object.entries(vendor.plans)) {
            if (!plan.useCases.includes(input.useCase as UseCase)) continue;
            // TODO: Enterprise plans don't have pricePerSeat in pricingData
            if (plan.pricePerSeat === null) continue;
            if (toolKey === input.tool && planName === input.plan) continue;

            const alternativeCost = plan.pricePerSeat * input.seats;
            if (alternativeCost >= currentTotalCost) continue;

            candidates.push({
                tool: toolKey,
                plan: planName,
                cost: alternativeCost,
                savings: currentTotalCost - alternativeCost,
                reason: `${vendor.name} ${planName} at $${plan.pricePerSeat}/seat`,
            });
        }
    }

    candidates.sort((a, b) => b.savings - a.savings);

    const [bestRecommendation = null, ...otherOptions] = candidates;

    return {
        tool: input.tool,
        currentPlan: input.plan,
        currentCost: currentTotalCost,
        status: candidates.length === 0 ? 'optimal' : 'optimize',
        bestRecommendation,
        otherOptions,
    };
};

const auditService = (auditRequest: AuditRequest): AuditResult[] =>
    auditRequest.tools.map(tool => auditTool(tool as ToolInput));

export default auditService;
