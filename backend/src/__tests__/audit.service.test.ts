import auditService from '@/services/audit.service';
import { pricingData } from '@/data/pricingData';
import { AuditResult, Recommendation } from '@/types';

function allCandidates(result: AuditResult): Recommendation[] {
  return [...result.otherOptions, result.bestRecommendation].filter(Boolean) as Recommendation[];
}

// ─── Cases 1–6, 9, 10 — single tool inputs via it.each ───────────────────────

type CaseEntry = {
  description: string;
  input: { tool: string; plan: string; seats: number; monthlySpend: number; useCase: string };
  expected: {
    currentCost: number;
    status: 'optimal' | 'optimize';
    best?: { tool: string; plan: string };
  };
  verify?: (result: AuditResult) => void;
};

const cases: CaseEntry[] = [
  {
    // Case 1 — Cross-vendor optimization.
    // cursor Teams: $40/seat × 2 = $80. Best coding alt: github_copilot Pro ($10 × 2 = $20, savings $60).
    // chatgpt Go and gemini Plus no longer support coding, so github_copilot Pro is the cheapest coding plan.
    description: 'case 1: recommends cheaper cross-vendor plan for cursor Teams 2 seats coding',
    input: { tool: 'cursor', plan: 'Teams', seats: 2, monthlySpend: 80, useCase: 'coding' },
    expected: { currentCost: 80, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      expect(result.bestRecommendation!.savings).toBeGreaterThan(0);
    },
  },
  {
    // Case 2 — Same-vendor cheaper plan.
    // claude Max20x: $200 × 1 = $200. claude Pro ($20) must appear in candidates.
    description: 'case 2: same-vendor cheaper plan appears in candidates for claude Max20x 1 seat writing',
    input: { tool: 'claude', plan: 'Max20x', seats: 1, monthlySpend: 200, useCase: 'writing' },
    expected: { currentCost: 200, status: 'optimize', best: { tool: 'gemini', plan: 'Plus' } },
    verify: (result) => {
      const sameVendorPlan = allCandidates(result).find(
        (c) => c.tool === 'claude' && c.plan === 'Pro',
      );
      expect(sameVendorPlan).toBeDefined();
      expect(sameVendorPlan!.cost).toBe(20);
      expect(sameVendorPlan!.savings).toBe(180);
    },
  },
  {
    // Case 3 — Already optimal.
    // gemini Plus ($7.99) no longer supports coding; github_copilot Pro ($10) is now the cheapest coding plan.
    // $10 > $7.99, so no coding alternative is cheaper — status is optimal.
    description: 'case 3: gemini Plus 1 seat coding is already optimal — no cheaper plan exists',
    input: { tool: 'gemini', plan: 'Plus', seats: 1, monthlySpend: 7.99, useCase: 'coding' },
    expected: { currentCost: 7.99, status: 'optimal' },
    verify: (result) => {
      expect(result.bestRecommendation).toBeNull();
      expect(result.otherOptions).toHaveLength(0);
    },
  },
  {
    // Case 4 — Free / null-price plans never appear as candidates.
    // cursor Ultra ($200): all candidates must have pricePerSeat > 0 (no Enterprise/free plans).
    description: 'case 4: enterprise (null pricePerSeat) plans never appear as recommendations',
    input: { tool: 'cursor', plan: 'Ultra', seats: 1, monthlySpend: 200, useCase: 'coding' },
    expected: { currentCost: 200, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      for (const candidate of allCandidates(result)) {
        const planData = pricingData[candidate.tool]?.plans[candidate.plan];
        expect(planData?.pricePerSeat).not.toBeNull();
        expect(planData?.pricePerSeat).toBeGreaterThan(0);
      }
    },
  },
  {
    // Case 5 — Use case filtering.
    // claude Pro ($20, coding): github_copilot Pro ($10) is best; chatgpt Go/gemini Plus excluded (no coding).
    // All candidates must support the coding use case.
    description: 'case 5: coding use case surfaces coding-specific tools, all candidates support coding',
    input: { tool: 'claude', plan: 'Pro', seats: 1, monthlySpend: 20, useCase: 'coding' },
    expected: { currentCost: 20, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      const candidateTools = allCandidates(result).map((c) => c.tool);
      expect(candidateTools).toContain('github_copilot');
      for (const candidate of allCandidates(result)) {
        expect(pricingData[candidate.tool].plans[candidate.plan].useCases).toContain('coding');
      }
    },
  },
  {
    // Case 6 — Enterprise null-price fallback.
    // claude Enterprise has null pricePerSeat → currentCost falls back to monthlySpend ($500).
    description: 'case 6: claude Enterprise falls back to monthlySpend ($500) and finds cheaper alternatives',
    input: { tool: 'claude', plan: 'Enterprise', seats: 2, monthlySpend: 500, useCase: 'mixed' },
    expected: { currentCost: 500, status: 'optimize', best: { tool: 'gemini', plan: 'Plus' } },
    verify: (result) => {
      expect(result.bestRecommendation!.savings).toBeGreaterThan(0);
    },
  },
  {
    // Case 9 — otherOptions sorted by savings descending.
    // cursor Ultra ($200): many cheaper coding alternatives → verify ordering invariant.
    description: 'case 9: otherOptions are sorted descending by savings and bestRecommendation leads',
    input: { tool: 'cursor', plan: 'Ultra', seats: 1, monthlySpend: 200, useCase: 'coding' },
    expected: { currentCost: 200, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      const { bestRecommendation, otherOptions } = result;
      for (let i = 0; i < otherOptions.length - 1; i++) {
        expect(otherOptions[i].savings).toBeGreaterThanOrEqual(otherOptions[i + 1].savings);
      }
      if (bestRecommendation && otherOptions.length > 0) {
        expect(bestRecommendation.savings).toBeGreaterThanOrEqual(otherOptions[0].savings);
      }
    },
  },
  {
    // Case 10a — Seat count scaling: 1 seat.
    // cursor Teams: $40/seat × 1 = $40.
    description: 'case 10 (1 seat): cursor Teams currentCost equals 1× pricePerSeat',
    input: { tool: 'cursor', plan: 'Teams', seats: 1, monthlySpend: 40, useCase: 'coding' },
    expected: { currentCost: 40, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      expect(result.bestRecommendation!.savings).toBeGreaterThan(0);
    },
  },
  {
    // Case 10b — Seat count scaling: 5 seats.
    // cursor Teams: $40/seat × 5 = $200.
    description: 'case 10 (5 seats): cursor Teams currentCost equals 5× pricePerSeat',
    input: { tool: 'cursor', plan: 'Teams', seats: 5, monthlySpend: 200, useCase: 'coding' },
    expected: { currentCost: 200, status: 'optimize', best: { tool: 'github_copilot', plan: 'Pro' } },
    verify: (result) => {
      expect(result.bestRecommendation!.savings).toBeGreaterThan(0);
    },
  },
];

describe('single-tool audit cases (1–6, 9, 10)', () => {
  it.each(cases)('$description', ({ input, expected, verify }) => {
    const [result] = auditService({ tools: [input] });
    expect(result.currentCost).toBeCloseTo(expected.currentCost, 2);
    expect(result.status).toBe(expected.status);
    if (expected.best) {
      expect(result.bestRecommendation).not.toBeNull();
      expect(result.bestRecommendation!.tool).toBe(expected.best.tool);
      expect(result.bestRecommendation!.plan).toBe(expected.best.plan);
    }
    verify?.(result);
  });

  it('case 10: savings scale proportionally between 1 seat and 5 seats', () => {
    const [single] = auditService({
      tools: [{ tool: 'cursor', plan: 'Teams', seats: 1, monthlySpend: 40, useCase: 'coding' }],
    });
    const [five] = auditService({
      tools: [{ tool: 'cursor', plan: 'Teams', seats: 5, monthlySpend: 200, useCase: 'coding' }],
    });

    expect(single.currentCost).toBe(40);
    expect(five.currentCost).toBe(200);

    if (
      single.bestRecommendation &&
      five.bestRecommendation &&
      single.bestRecommendation.tool === five.bestRecommendation.tool &&
      single.bestRecommendation.plan === five.bestRecommendation.plan
    ) {
      expect(five.bestRecommendation.cost).toBeCloseTo(single.bestRecommendation.cost * 5, 10);
      expect(five.bestRecommendation.savings).toBeCloseTo(single.bestRecommendation.savings * 5, 10);
    }
  });
});

// ─── Case 7 — Multiple tools: aggregate savings ───────────────────────────────

describe('case 7: multiple tools — aggregate savings', () => {
  // cursor Teams 2 seats coding ($80) + chatgpt Pro200 1 seat writing ($200).
  // Coding best: github_copilot Pro ($10/seat). Writing best: gemini Plus ($7.99/seat).
  // Derive expected savings from pricingData to stay in sync.
  it('total monthly savings aggregates across tools; annual savings equals 12× monthly', () => {
    const results = auditService({
      tools: [
        { tool: 'cursor', plan: 'Teams', seats: 2, monthlySpend: 80, useCase: 'coding' },
        { tool: 'chatgpt', plan: 'Pro200', seats: 1, monthlySpend: 200, useCase: 'writing' },
      ],
    });

    expect(results).toHaveLength(2);
    results.forEach((r) => expect(r.bestRecommendation).not.toBeNull());

    const totalMonthlySavings = results.reduce(
      (sum, r) => sum + r.bestRecommendation!.savings,
      0,
    );

    const githubCopilotProPerSeat = pricingData['github_copilot'].plans['Pro'].pricePerSeat!;
    const geminiPlusPerSeat       = pricingData['gemini'].plans['Plus'].pricePerSeat!;
    const expectedMonthly = (80 - githubCopilotProPerSeat * 2) + (200 - geminiPlusPerSeat);

    expect(totalMonthlySavings).toBeCloseTo(expectedMonthly, 2);
    expect(totalMonthlySavings * 12).toBeCloseTo(expectedMonthly * 12, 1);
  });
});

// ─── Case 8 — Credex CTA trigger: total monthly savings > $500 ───────────────

describe('case 8: Credex CTA trigger — total monthly savings exceeds $500', () => {
  // cursor Ultra 2 seats coding ($400) + chatgpt Pro200 2 seats writing ($400).
  // Coding best: github_copilot Pro ($10 × 2 = $20, savings $380). Writing best: gemini Plus ($7.99 × 2 ≈ $16, savings ~$384).
  it('total monthly savings exceeds $500 when auditing high-spend subscriptions', () => {
    const results = auditService({
      tools: [
        { tool: 'cursor', plan: 'Ultra', seats: 2, monthlySpend: 400, useCase: 'coding' },
        { tool: 'chatgpt', plan: 'Pro200', seats: 2, monthlySpend: 400, useCase: 'writing' },
      ],
    });

    const totalMonthlySavings = results.reduce(
      (sum, r) => sum + (r.bestRecommendation?.savings ?? 0),
      0,
    );

    expect(totalMonthlySavings).toBeGreaterThan(500);
  });
});
