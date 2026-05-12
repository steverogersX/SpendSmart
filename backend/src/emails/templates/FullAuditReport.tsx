import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Section,
  Row,
  Column,
  Text,
  Hr,
  Link,
  Img,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import { Font } from '@react-email/font';
import type {
  AuditResult,
  AuditResultItem,
  ApiAuditResult,
  ApiRecommendation,
  SubscriptionRecommendation,
} from '@shared/types/auditResult';
import { BenchmarkChart } from './BenchmarkChart';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isApiResult(r: AuditResultItem): r is ApiAuditResult {
  return 'primaryModel' in r;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

function capitalize(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function icon(name: string, hex: string, size = 14): string {
  return `https://api.iconify.design/${name}.svg?color=${encodeURIComponent(hex)}&width=${size}&height=${size}`;
}

// ─── Design tokens (matching app exactly) ─────────────────────────────────────
const C = {
  emerald50:  '#ecfdf5',
  emerald100: '#d1fae5',
  emerald200: '#a7f3d0',
  emerald300: '#6ee7b7',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald700: '#047857',
  emerald800: '#065f46',
  teal50:     '#f0fdfa',
  amber100:   '#fef3c7',
  amber200:   '#fde68a',
  amber700:   '#b45309',
  amber800:   '#92400e',
  zinc100:    '#f4f4f5',
  zinc200:    '#e4e4e7',
  zinc400:    '#a1a1aa',
  zinc500:    '#71717a',
  zinc700:    '#3f3f46',
  zinc900:    '#18181b',
  zinc950:    '#09090b',
  white:      '#ffffff',
  bg:         '#f9fafb',
};

// ─── Logo — "$SpendSmart" matching app ────────────────────────────────────────

function Logo() {
  return (
    <Text style={{ margin: 0, lineHeight: 1, fontFamily: 'Geist, sans-serif' }}>
      <span style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: 800, color: C.emerald500 }}>$</span>
      <span style={{ fontSize: '20px', fontWeight: 600, color: C.zinc950, letterSpacing: '-0.02em' }}>Spend</span>
      <span style={{ fontSize: '20px', fontWeight: 600, color: C.emerald500, letterSpacing: '-0.02em' }}>Smart</span>
    </Text>
  );
}

// ─── Status badge — matches app exactly ──────────────────────────────────────

function StatusBadge({ status }: { status: 'optimal' | 'optimize' }) {
  const isOptimal = status === 'optimal';
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: isOptimal ? C.emerald100 : C.amber100,
      borderRadius: '9999px',
      padding: '3px 10px 3px 7px',
      whiteSpace: 'nowrap',
    }}>
      <Img
        src={icon(isOptimal ? 'lucide:check-circle' : 'lucide:trending-down', isOptimal ? C.emerald700 : C.amber700, 11)}
        width={11} height={11} alt=""
        style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}
      />
      <span style={{ fontSize: '11px', fontWeight: 600, color: isOptimal ? C.emerald700 : C.amber700, verticalAlign: 'middle' }}>
        {isOptimal ? 'Optimal' : 'Can Optimize'}
      </span>
    </span>
  );
}

// ─── Savings hero — matches app hero exactly ──────────────────────────────────

function SavingsHero({ auditResult, totalSavings }: { auditResult: AuditResult; totalSavings: number }) {
  const toolCount = auditResult.tools.length;
  const optimizableCount = auditResult.tools.filter(t => t.status === 'optimize').length;
  const optimalCount = toolCount - optimizableCount;

  if (totalSavings <= 0) {
    return (
      <Section style={{
        background: `linear-gradient(135deg, ${C.emerald50} 0%, rgba(240,253,250,0.6) 60%, #ffffff 100%)`,
        border: `1px solid ${C.emerald200}`,
        borderRadius: '16px',
        padding: '32px 24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <Row style={{ marginBottom: '16px' }}>
          <Column align="center">
            <div style={{ display: 'inline-block', backgroundColor: C.emerald100, borderRadius: '9999px', padding: '12px', margin: '0 auto' }}>
              <Img src={icon('lucide:check-circle', C.emerald600, 24)} width={24} height={24} alt="" style={{ display: 'block' }} />
            </div>
          </Column>
        </Row>
        {/* Headline */}
        <Text style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 700, color: C.zinc950, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          You're spending well.
        </Text>
        <Text style={{ margin: '0 0 20px', fontSize: '13px', color: C.zinc500, lineHeight: 1.65 }}>
          Every tool in your stack is already cost-optimal.
        </Text>
        {/* Stats */}
        <Row>
          <Column align="right" style={{ paddingRight: '20px', borderRight: `1px solid ${C.zinc200}` }}>
            <Text style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: C.emerald600 }}>{toolCount}</Text>
            <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>tools audited</Text>
          </Column>
          <Column align="left" style={{ paddingLeft: '20px' }}>
            <Text style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: C.emerald600 }}>{optimalCount}</Text>
            <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>optimal</Text>
          </Column>
        </Row>
      </Section>
    );
  }

  return (
    <Section style={{
      background: `linear-gradient(135deg, ${C.emerald50} 0%, rgba(240,253,250,0.5) 60%, #ffffff 100%)`,
      border: `1px solid ${C.emerald200}`,
      borderRadius: '16px',
      padding: '28px 24px',
      marginBottom: '20px',
    }}>
      {/* Badge — "TOTAL SAVINGS FOUND" matching app */}
      <Row style={{ marginBottom: '20px' }}>
        <Column>
          <span style={{
            display: 'inline-block',
            backgroundColor: 'rgba(209,250,229,0.8)',
            border: `1px solid rgba(110,231,183,0.6)`,
            borderRadius: '9999px',
            padding: '4px 12px',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.emerald700 }}>
              Total Savings Found
            </span>
          </span>
        </Column>
      </Row>

      {/* Big number */}
      <Row style={{ marginBottom: '6px' }}>
        <Column>
          <Text style={{ margin: 0, fontSize: '48px', fontWeight: 700, lineHeight: 1, color: C.emerald700, letterSpacing: '-0.04em' }}>
            {fmt(totalSavings)}
          </Text>
        </Column>
        <Column style={{ verticalAlign: 'bottom', paddingBottom: '4px' }}>
          <Text style={{ margin: 0, fontSize: '18px', fontWeight: 500, color: 'rgba(5,150,105,0.7)' }}>/mo</Text>
        </Column>
      </Row>
      <Text style={{ margin: '0 0 24px', fontSize: '13px', color: C.zinc500 }}>
        in monthly savings identified
      </Text>

      {/* Stats row — TrendingUp (annual) / tools audited / TrendingDown (optimizable) */}
      <Row>
        {/* Annual savings */}
        <Column style={{ verticalAlign: 'middle' }}>
          <Row>
            <Column style={{ width: '28px', verticalAlign: 'middle' }}>
              <div style={{ display: 'inline-block', backgroundColor: C.emerald100, borderRadius: '9999px', padding: '5px' }}>
                <Img src={icon('lucide:trending-up', C.emerald600, 14)} width={14} height={14} alt="" style={{ display: 'block' }} />
              </div>
            </Column>
            <Column style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
              <Text style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: C.zinc950 }}>{fmt(totalSavings * 12)}<span style={{ fontSize: '11px', fontWeight: 400, color: C.zinc500, marginLeft: '3px' }}>/yr</span></Text>
              <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>Annual savings</Text>
            </Column>
          </Row>
        </Column>

        {/* Tools audited */}
        <Column style={{ verticalAlign: 'middle', paddingLeft: '16px', borderLeft: `1px solid ${C.zinc200}` }}>
          <Row>
            <Column style={{ width: '28px', verticalAlign: 'middle' }}>
              <div style={{ display: 'inline-block', backgroundColor: C.zinc100, borderRadius: '9999px', width: '28px', height: '28px', textAlign: 'center', lineHeight: '28px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.zinc500 }}>{toolCount}</span>
              </div>
            </Column>
            <Column style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
              <Text style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: C.zinc950 }}>{toolCount}</Text>
              <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>Tools audited</Text>
            </Column>
          </Row>
        </Column>

        {/* Optimizable */}
        <Column style={{ verticalAlign: 'middle', paddingLeft: '16px', borderLeft: `1px solid ${C.zinc200}` }}>
          <Row>
            <Column style={{ width: '28px', verticalAlign: 'middle' }}>
              <div style={{ display: 'inline-block', backgroundColor: C.amber100, borderRadius: '9999px', padding: '5px' }}>
                <Img src={icon('lucide:trending-down', C.amber700, 14)} width={14} height={14} alt="" style={{ display: 'block' }} />
              </div>
            </Column>
            <Column style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
              <Text style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: C.zinc950 }}>{optimizableCount}</Text>
              <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>Can optimize</Text>
            </Column>
          </Row>
        </Column>
      </Row>
    </Section>
  );
}

// ─── AI Summary section — matches app ────────────────────────────────────────

function AiSummarySection({ summary }: { summary: string }) {
  return (
    <Section style={{
      border: `1px solid ${C.zinc200}`,
      backgroundColor: 'rgba(244,244,245,0.2)',
      borderRadius: '12px',
      padding: '14px 16px',
      marginBottom: '20px',
    }}>
      <Row style={{ marginBottom: '8px' }}>
        <Column style={{ width: '18px', verticalAlign: 'middle' }}>
          <Img src={icon('lucide:sparkles', C.zinc400, 13)} width={13} height={13} alt="" style={{ display: 'block' }} />
        </Column>
        <Column style={{ verticalAlign: 'middle' }}>
          <Text style={{ margin: 0, fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.zinc400 }}>
            AI Summary
          </Text>
        </Column>
      </Row>
      <Text style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: 'rgba(9,9,11,0.8)' }}>
        {summary}
      </Text>
    </Section>
  );
}

// ─── Current spend row — matches "bg-muted/40 px-3 py-2" ─────────────────────

function SpendRow({ amount }: { amount: string }) {
  return (
    <Row style={{ marginBottom: '12px' }}>
      <Column>
        <Section style={{ backgroundColor: 'rgba(244,244,245,0.4)', borderRadius: '8px', padding: '8px 12px' }}>
          <Row>
            <Column>
              <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500 }}>Current monthly spend</Text>
            </Column>
            <Column align="right">
              <Text style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: C.zinc950 }}>{amount}</Text>
            </Column>
          </Row>
        </Section>
      </Column>
    </Row>
  );
}

// ─── Best option box — matches "rounded-lg border p-3 border-emerald-400 bg-emerald-50/70" ──

function BestOptionBox({
  title,
  reason,
  savings,
  savingsPercent,
  pricingUrl,
}: {
  title: string;
  reason?: string;
  savings: number;
  savingsPercent: number;
  pricingUrl?: string | null;
}) {
  return (
    <Section style={{
      border: `1px solid ${C.emerald300}`,
      backgroundColor: 'rgba(236,253,245,0.7)',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
    }}>
      <Row style={{ marginBottom: '8px' }}>
        <Column>
          <Text style={{ margin: 0, fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.emerald700 }}>
            Best option
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: C.zinc950 }}>{title}</Text>
          {reason && (
            <Text style={{ margin: '2px 0 0', fontSize: '11px', color: C.zinc400, lineHeight: 1.55 }}>{reason}</Text>
          )}
          {pricingUrl && (
            <Link href={pricingUrl} style={{ fontSize: '11px', color: C.emerald700, display: 'block', marginTop: '4px' }}>
              pricing →
            </Link>
          )}
        </Column>
        <Column align="right" style={{ verticalAlign: 'top' }}>
          <Text style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: C.emerald600, whiteSpace: 'nowrap' }}>
            Save {fmt(savings)}/mo
          </Text>
          <Text style={{ margin: '2px 0 0', fontSize: '11px', color: C.zinc400, textAlign: 'right' }}>
            ({savingsPercent.toFixed(0)}%)
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

// ─── Other option row — matches "border-border bg-muted/20 px-3 py-2.5" ──────

function OtherOptionRow({ title, reason, savings, isLast }: { title: string; reason?: string; savings: number; isLast: boolean }) {
  return (
    <Section style={{
      border: `1px solid ${C.zinc200}`,
      backgroundColor: 'rgba(244,244,245,0.2)',
      borderRadius: '8px',
      padding: '10px 12px',
      marginBottom: isLast ? 0 : '6px',
    }}>
      <Row>
        <Column>
          <Text style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: C.zinc950 }}>{title}</Text>
          {reason && (
            <Text style={{ margin: '2px 0 0', fontSize: '11px', color: C.zinc400, lineHeight: 1.55 }}>{reason}</Text>
          )}
        </Column>
        <Column align="right" style={{ verticalAlign: 'top' }}>
          <Text style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: C.emerald600, whiteSpace: 'nowrap' }}>
            −{fmt(savings)}/mo
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

// ─── Result card — matches ResultCard exactly ─────────────────────────────────

function ResultCard({ item }: { item: AuditResultItem }) {
  const api = isApiResult(item);
  const toolLabel = api ? item.toolName : item.tool;
  const currentSpend = api ? item.currentAverageMonthlySpend : item.currentCost;
  const subtitle = api ? `${item.primaryModel} · ${item.primaryUseCase}` : item.currentPlan;
  const best = item.bestRecommendation;
  const hasOthers = item.otherOptions.length > 0;

  return (
    <Section style={{
      backgroundColor: C.white,
      border: `1px solid ${C.zinc200}`,
      borderRadius: '16px',
      marginBottom: '12px',
      overflow: 'hidden',
    }}>
      <Section style={{ padding: '20px 20px 16px' }}>
        {/* Header: tool name + status badge */}
        <Row style={{ marginBottom: '12px' }}>
          <Column>
            <Text style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: C.zinc950, textTransform: 'capitalize' }}>
              {toolLabel.replace(/_/g, ' ')}
            </Text>
            <Text style={{ margin: '2px 0 0', fontSize: '11px', color: C.zinc500, textTransform: 'capitalize' }}>
              {subtitle.replace(/_/g, ' ')}
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: 'middle' }}>
            <StatusBadge status={item.status} />
          </Column>
        </Row>

        {/* Current spend — bg-muted/40 */}
        <SpendRow amount={fmt(currentSpend)} />

        {/* Summary */}
        {api && item.summary && (
          <Text style={{ margin: '0 0 12px', fontSize: '11px', lineHeight: 1.65, color: C.zinc500 }}>
            {item.summary}
          </Text>
        )}

        {/* Benchmark chart — shown when score data is available */}
        {api && item.currentModelScore !== null && best && (
          <BenchmarkChart item={item} rec={best as ApiRecommendation} />
        )}

        {/* Best option box */}
        {item.status === 'optimize' && best && (
          <>
            {api ? (
              <BestOptionBox
                title={(best as ApiRecommendation).modelDisplayName}
                reason={(best as ApiRecommendation).reason}
                savings={best.savings}
                savingsPercent={best.savingsPercent}
                pricingUrl={(best as ApiRecommendation).pricingUrl}
              />
            ) : (
              <BestOptionBox
                title={`${(best as SubscriptionRecommendation).toolName} · ${(best as SubscriptionRecommendation).planName}`}
                reason={(best as SubscriptionRecommendation).reason}
                savings={best.savings}
                savingsPercent={best.savingsPercent}
              />
            )}
          </>
        )}

        {/* Other options */}
        {hasOthers && (
          <>
            <Text style={{ margin: '4px 0 8px', fontSize: '11px', color: C.zinc400, fontWeight: 500 }}>
              Other options
            </Text>
            {api
              ? (item.otherOptions as ApiRecommendation[]).map((rec, i) => (
                  <OtherOptionRow
                    key={i}
                    title={rec.modelDisplayName}
                    reason={rec.reason}
                    savings={rec.savings}
                    isLast={i === item.otherOptions.length - 1}
                  />
                ))
              : (item.otherOptions as SubscriptionRecommendation[]).map((rec, i) => (
                  <OtherOptionRow
                    key={i}
                    title={`${rec.toolName} · ${rec.planName}`}
                    reason={rec.reason}
                    savings={rec.savings}
                    isLast={i === item.otherOptions.length - 1}
                  />
                ))}
          </>
        )}

        {/* Optimal message */}
        {item.status === 'optimal' && (
          <Text style={{ margin: '4px 0 0', fontSize: '11px', color: C.zinc500 }}>
            You're spending well here. No cheaper alternative matches your current requirements.
          </Text>
        )}
      </Section>
    </Section>
  );
}

// ─── CTAs — match HighSavingsCTA / MidSavingsCTA / LowSavingsCTA ─────────────

function HighSavingsCTA({ totalSavings }: { totalSavings: number }) {
  return (
    <Section style={{
      background: `linear-gradient(135deg, ${C.emerald50} 0%, ${C.teal50} 100%)`,
      border: `1px solid ${C.emerald200}`,
      borderRadius: '12px',
      padding: '20px',
    }}>
      <Row style={{ marginBottom: '12px' }}>
        <Column style={{ width: '36px', verticalAlign: 'top' }}>
          <div style={{ display: 'inline-block', backgroundColor: C.emerald100, borderRadius: '9999px', padding: '7px' }}>
            <Img src={icon('lucide:sparkles', C.emerald600, 16)} width={16} height={16} alt="" style={{ display: 'block' }} />
          </div>
        </Column>
        <Column style={{ verticalAlign: 'top', paddingLeft: '8px' }}>
          <Text style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#052e16' }}>
            {fmt(totalSavings)}/mo in savings identified
          </Text>
          <Text style={{ margin: 0, fontSize: '12px', color: C.emerald800, lineHeight: 1.65 }}>
            A Credex advisor will follow up with a tailored migration plan — at no cost to you.
          </Text>
        </Column>
      </Row>
      <Row style={{ marginBottom: '12px' }}>
        <Column>
          <Text style={{ margin: 0, fontSize: '11px', color: C.emerald700, lineHeight: 1.6 }}>
            Cursor · Claude · ChatGPT Enterprise — sourced at cost from companies that overforecast.
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Link
            href="https://spendsmart-mocha.vercel.app"
            style={{
              display: 'inline-block',
              backgroundColor: C.emerald500,
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            Get personalized plan →
          </Link>
        </Column>
      </Row>
    </Section>
  );
}

function MidSavingsCTA({ totalSavings }: { totalSavings: number }) {
  return (
    <Section style={{
      border: `1px solid ${C.zinc200}`,
      backgroundColor: 'rgba(244,244,245,0.3)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <Text style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: C.zinc950 }}>
        {fmt(totalSavings)}/mo in savings identified
      </Text>
      <Text style={{ margin: '0 0 16px', fontSize: '13px', color: C.zinc500, lineHeight: 1.65 }}>
        Get the full audit report with step-by-step migration guides sent to your inbox.
      </Text>
      <Link
        href="https://spendsmart-mocha.vercel.app"
        style={{
          display: 'inline-block',
          backgroundColor: C.emerald500,
          color: '#ffffff',
          padding: '10px 24px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.01em',
        }}
      >
        Go to SpendSmart →
      </Link>
    </Section>
  );
}

function LowSavingsCTA() {
  return (
    <Section style={{
      border: `1px solid ${C.zinc200}`,
      backgroundColor: 'rgba(244,244,245,0.2)',
      borderRadius: '12px',
      padding: '20px',
    }}>
      <Row style={{ marginBottom: '12px' }}>
        <Column style={{ width: '36px', verticalAlign: 'top' }}>
          <div style={{ display: 'inline-block', backgroundColor: C.zinc100, borderRadius: '9999px', padding: '7px' }}>
            <Img src={icon('lucide:bell', C.zinc500, 16)} width={16} height={16} alt="" style={{ display: 'block' }} />
          </div>
        </Column>
        <Column style={{ verticalAlign: 'top', paddingLeft: '8px' }}>
          <Text style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 500, color: C.zinc950 }}>
            You're spending well.
          </Text>
          <Text style={{ margin: 0, fontSize: '12px', color: C.zinc500, lineHeight: 1.65 }}>
            AI prices shift fast. We'll notify you when a better option matches your stack.
          </Text>
        </Column>
      </Row>
      <Link
        href="https://spendsmart-mocha.vercel.app"
        style={{
          display: 'inline-block',
          backgroundColor: C.white,
          color: C.zinc700,
          padding: '10px 24px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          border: `1px solid ${C.zinc200}`,
          letterSpacing: '0.01em',
        }}
      >
        Run another audit →
      </Link>
    </Section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface FullAuditReportProps {
  auditResult: AuditResult;
}

const FullAuditReport: React.FC<FullAuditReportProps> = ({ auditResult }) => {
  const totalSavings = auditResult.tools.reduce(
    (sum, item) => sum + (item.bestRecommendation?.savings ?? 0),
    0,
  );

  const previewText = totalSavings > 0
    ? `You can save ${fmt(totalSavings)}/mo on your AI stack — here's your full audit report.`
    : `Your AI stack is fully optimized — here's your SpendSmart audit report.`;

  return (
    <Html lang="en">
      <Head>
        <Font fontFamily="Geist" fallbackFontFamily="sans-serif"
          webFont={{ url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-400-normal.woff2', format: 'woff2' }}
          fontWeight={400} fontStyle="normal" />
        <Font fontFamily="Geist" fallbackFontFamily="sans-serif"
          webFont={{ url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-500-normal.woff2', format: 'woff2' }}
          fontWeight={500} fontStyle="normal" />
        <Font fontFamily="Geist" fallbackFontFamily="sans-serif"
          webFont={{ url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-600-normal.woff2', format: 'woff2' }}
          fontWeight={600} fontStyle="normal" />
        <Font fontFamily="Geist" fallbackFontFamily="sans-serif"
          webFont={{ url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-700-normal.woff2', format: 'woff2' }}
          fontWeight={700} fontStyle="normal" />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body style={{ backgroundColor: C.bg, margin: 0, padding: 0, fontFamily: 'Geist, sans-serif' }}>
          <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 16px 32px' }}>

            {/* ── Header ──────────────────────────────────────────────── */}
            <Section style={{
              backgroundColor: C.white,
              border: `1px solid ${C.zinc200}`,
              borderBottom: 'none',
              borderRadius: '16px 16px 0 0',
              padding: '16px 24px',
            }}>
              <Row>
                <Column style={{ verticalAlign: 'middle' }}>
                  <Logo />
                </Column>
                <Column align="right" style={{ verticalAlign: 'middle' }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: C.emerald50,
                    border: `1px solid ${C.emerald200}`,
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: C.emerald700,
                    whiteSpace: 'nowrap',
                  }}>
                    AI Cost Audit
                  </span>
                </Column>
              </Row>
            </Section>

            {/* ── Body ────────────────────────────────────────────────── */}
            <Section style={{
              backgroundColor: C.white,
              border: `1px solid ${C.zinc200}`,
              borderTop: 'none',
              borderRadius: '0 0 16px 16px',
            }}>
              {/* Intro */}
              <Section style={{ padding: '28px 24px 20px', borderBottom: `1px solid ${C.zinc100}` }}>
                <Text style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700, color: C.zinc950, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                  Your Full Audit Report
                </Text>
                <Text style={{ margin: 0, fontSize: '13px', color: C.zinc500, lineHeight: 1.65 }}>
                  A complete breakdown of your AI tool spending and the best opportunities to optimize it.
                </Text>
              </Section>

              {/* Main content */}
              <Section style={{ padding: '24px' }}>

                {/* Savings hero */}
                <SavingsHero auditResult={auditResult} totalSavings={totalSavings} />

                {/* AI Summary */}
                {auditResult.aiSummary && (
                  <AiSummarySection summary={auditResult.aiSummary} />
                )}

                {/* Per-tool breakdown label */}
                <Text style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 500, color: C.zinc500, letterSpacing: '0.02em' }}>
                  Per-tool breakdown
                </Text>

                {/* Tool cards */}
                {auditResult.tools.map((item, i) => (
                  <ResultCard key={i} item={item} />
                ))}

                <Hr style={{ borderColor: C.zinc100, margin: '20px 0' }} />

                {/* CTA */}
                {totalSavings > 500 ? (
                  <HighSavingsCTA totalSavings={totalSavings} />
                ) : totalSavings >= 100 ? (
                  <MidSavingsCTA totalSavings={totalSavings} />
                ) : (
                  <LowSavingsCTA />
                )}

              </Section>
            </Section>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <Section style={{ textAlign: 'center', paddingTop: '24px', paddingBottom: '8px' }}>
              <Text style={{ margin: '0 0 3px', fontSize: '14px', fontFamily: 'Geist, sans-serif' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: C.emerald500 }}>$</span>
                <span style={{ fontWeight: 600, color: C.zinc950 }}>Spend</span>
                <span style={{ fontWeight: 600, color: C.emerald500 }}>Smart</span>
              </Text>
              <Text style={{ margin: '0 0 3px', fontSize: '11px', color: C.zinc400 }}>AI Cost Intelligence</Text>
              <Text style={{ margin: 0, fontSize: '11px', color: C.zinc200 }}>
                You received this because you requested a full audit report.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default FullAuditReport;
