import { config } from '@/config/env';
import { AuditResult, AuditResultItem } from '@shared/types/auditResult';

const GEMINI_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Build a cited sentence for a subscription tool, mirroring the style of ApiAuditResult.summary
function subscriptionSentence(t: Extract<AuditResultItem, { usageType: string }>): string {
    const cost = `$${t.currentCost.toFixed(0)}/month`;
    if (t.status === 'optimal' || !t.bestRecommendation) {
        return `Your ${t.tool} ${t.currentPlan} costs ${cost} and is already the most cost-effective option for your use case.`;
    }
    const rec = t.bestRecommendation;
    const savings = `$${rec.savings.toFixed(0)}/month (${rec.savingsPercent.toFixed(0)}% reduction)`;
    return (
        `Your ${t.tool} ${t.currentPlan} costs ${cost}. ` +
        `${rec.toolName} ${rec.planName} delivers the same capability at a lower price — ` +
        `switching saves ${savings}.`
    );
}

// One cited sentence per tool, sourced entirely from engine output (no invented claims)
function perToolSentences(result: AuditResult): string[] {
    return result.tools.map(t => {
        if ('primaryModel' in t) {
            // API tool: the engine already generated a fully-cited summary
            return t.summary;
        }
        return subscriptionSentence(t as Extract<AuditResultItem, { usageType: string }>);
    });
}

function buildFallbackSummary(result: AuditResult): string {
    const totalSavings = result.tools.reduce(
        (sum, t) => sum + (t.bestRecommendation?.savings ?? 0),
        0,
    );
    const sentences = perToolSentences(result);

    if (totalSavings <= 0) {
        return sentences.join(' ') +
            ' No cheaper alternatives meet your quality requirements across any tool in your stack.';
    }

    const monthly = `$${totalSavings.toFixed(0)}/month`;
    const annual = `$${(totalSavings * 12).toFixed(0)}/year`;
    const header = `Across ${result.tools.length} tool${result.tools.length !== 1 ? 's' : ''} audited, you could save ${monthly} (${annual}). `;

    return header + sentences.join(' ');
}

function buildPrompt(result: AuditResult): string {
    const totalSavings = result.tools.reduce(
        (sum, t) => sum + (t.bestRecommendation?.savings ?? 0),
        0,
    );
    const sentences = perToolSentences(result);

    return `You are a financial analyst writing a one-paragraph AI tool spend summary.

Below are the exact per-tool findings. Every number, model name, benchmark name, percentage, and markdown link below is verified — preserve them exactly as written.

Per-tool findings:
${sentences.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Total potential savings: ${totalSavings > 0 ? `$${totalSavings.toFixed(0)}/month` : 'none — stack is already optimal'}.

Rules:
- Use every fact and every markdown link above verbatim — do not reword numbers or URLs.
- Do not invent any claim not present above.
- Do not mention "Credex".
- Output one paragraph only. No bullet points. No headers.
- Target exactly ~100 words.`;
}

export async function generateAiSummary(result: AuditResult): Promise<string> {
    const fallback = buildFallbackSummary(result);

    // No key configured — use the static cited fallback
    if (!config.GEMINI_API_KEY) return fallback;

    let res: Response;
    try {
        res = await fetch(`${GEMINI_URL}?key=${config.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(result) }] }],
                generationConfig: { maxOutputTokens: 300, temperature: 0.2 },
            }),
            // 8s hard timeout — free tier can be slow; don't block the audit response
            signal: AbortSignal.timeout(8000),
        });
    } catch {
        // Network error or timeout — fall back silently
        return fallback;
    }

    // 429 = free-tier rate limit; 4xx/5xx from Gemini — fall back silently
    if (!res.ok) return fallback;

    let json: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    try {
        json = await res.json() as typeof json;
    } catch {
        // Malformed JSON from Gemini — fall back silently
        return fallback;
    }

    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    // Empty or missing candidate — fall back silently
    if (!text) return fallback;

    return text;
}
