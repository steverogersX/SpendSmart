// Helper: runs the audit service against each candidate input and emits the
// expectedOutput JSON. Used during fixture construction; deleted afterwards.
import auditService from '../../services/audit.service';

const apiInputs = [
    {
        label: 'TC1_passes_all_gates',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-opus-4-5',
            averageMonthlySpend: 1000,
            useCase: 'research',
            dropCapacityBy: 5,
            okayWithChineseModals: false,
        },
    },
    {
        label: 'TC2_fails_quality',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-opus-4-5',
            averageMonthlySpend: 1000,
            useCase: 'agentic',
            dropCapacityBy: 5,
            okayWithChineseModals: false,
        },
    },
    {
        label: 'TC3_savings_below_threshold',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-sonnet-4-6',
            averageMonthlySpend: 1000,
            useCase: 'coding',
            dropCapacityBy: 20,
            okayWithChineseModals: false,
        },
    },
    {
        label: 'TC4_no_model_supports_use_case',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-sonnet-4-6',
            averageMonthlySpend: 1000,
            useCase: 'data',
            dropCapacityBy: 5,
            okayWithChineseModals: false,
        },
    },
    {
        label: 'TC5_context_window_too_small',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-opus-4-5',
            averageMonthlySpend: 1000,
            useCase: 'coding',
            dropCapacityBy: 20,
            okayWithChineseModals: false,
            contextWindow: 500000,
        },
    },
    {
        label: 'TC6_current_is_cheapest',
        input: {
            tool: 'anthropic_api',
            primaryModel: 'claude-haiku-4-5',
            averageMonthlySpend: 1000,
            useCase: 'coding',
            dropCapacityBy: 5,
            okayWithChineseModals: false,
        },
    },
];

const subInputs = [
    {
        label: 'SUB_TC1_cheaper_plan_exists',
        input: {
            tool: 'cursor',
            plan: 'ultra',
            seats: 1,
            monthlySpend: 200,
            useCase: 'agentic',
        },
    },
    {
        label: 'SUB_TC2_already_optimal',
        input: {
            tool: 'github_copilot',
            plan: 'pro',
            seats: 1,
            monthlySpend: 10,
            useCase: 'coding',
        },
    },
];

const out: Record<string, unknown> = {};
for (const { label, input } of apiInputs) {
    const result = auditService({ tools: [input as never] });
    out[label] = result[0];
}
for (const { label, input } of subInputs) {
    const result = auditService({ tools: [input as never] });
    out[label] = result[0];
}
console.log(JSON.stringify(out, null, 2));
