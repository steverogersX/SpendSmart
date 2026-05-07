import { AuditRequest, ToolInput, UseCase } from "@/types/schemas";
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
        if (!vendor.useCases.includes(input.useCase as UseCase)) continue;

        for (const [planName, plan] of Object.entries(vendor.plans)) {
            // TODO: This is wrong. Enterprise plans doesn't have pricePerSeat in priceData
            if (plan.pricePerSeat === null) continue; 
            // If we're in same plan as current input plan, we have to skip it.
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

const auditService =  (auditRequest: AuditRequest): AuditResult[] => {
    try {
        return auditRequest.tools.map(auditTool);
    } catch (err: unknown) {
        throw err;
    }
};

export default auditService;
