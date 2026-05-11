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
import { Markdown } from '@react-email/markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  AuditResult,
  AuditResultItem,
  ApiAuditResult,
  ApiRecommendation,
  SubscriptionRecommendation,
} from '@shared/types/auditResult';

// ─── Utility ─────────────────────────────────────────────────────────────────

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Iconify CDN ──────────────────────────────────────────────────────────────

function iconSrc(name: string, hex: string, size = 14): string {
  return `https://api.iconify.design/${name}.svg?color=${encodeURIComponent(hex)}&width=${size}&height=${size}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isApiResult(r: AuditResultItem): r is ApiAuditResult {
  return 'primaryModel' in r;
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);
}

function capitalize(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Markdown prose styles ────────────────────────────────────────────────────

const proseStyles = {
  p: { margin: '0', fontSize: '12px', lineHeight: '1.65', color: '#71717a' },
  strong: { color: '#3f3f46', fontWeight: '600' },
  em: { color: '#71717a', fontStyle: 'italic' },
  code: {
    backgroundColor: '#f4f4f5',
    borderRadius: '4px',
    padding: '1px 5px',
    fontSize: '11px',
    color: '#3f3f46',
    fontFamily: 'monospace',
  },
} as const;

const mutedProseStyles = {
  p: { margin: '2px 0 0', fontSize: '11px', lineHeight: '1.55', color: '#a1a1aa' },
  strong: { color: '#71717a', fontWeight: '600' },
} as const;

// ─── Primitives ───────────────────────────────────────────────────────────────

function CardDivider({ className }: { className?: string }) {
  return <Hr className={cn('border-zinc-100 my-4 mx-0', className)} />;
}

function SectionLabel({
  icon,
  children,
}: {
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <Row className="mb-3.5">
      {icon && (
        <Column style={{ width: '18px', verticalAlign: 'middle' }}>
          <Img
            src={icon}
            width={13}
            height={13}
            alt=""
            style={{ display: 'block', marginTop: '1px' }}
          />
        </Column>
      )}
      <Column style={{ verticalAlign: 'middle' }}>
        <Text className="m-0 text-[10px] font-semibold tracking-widest uppercase text-zinc-400">
          {children}
        </Text>
      </Column>
    </Row>
  );
}

function SpendRow({ label, amount }: { label: string; amount: string }) {
  return (
    <Section className="bg-zinc-50 border border-solid border-zinc-100 rounded-lg py-2.5 px-4">
      <Row>
        <Column>
          <Text className="m-0 text-[12px] text-zinc-500">{label}</Text>
        </Column>
        <Column align="right">
          <Text className="m-0 text-[13px] font-semibold text-zinc-900">{amount}</Text>
        </Column>
      </Row>
    </Section>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: 'optimal' | 'optimize' }) {
  const isOptimal = status === 'optimal';

  const pillStyle: React.CSSProperties = {
    display: 'inline-block',
    backgroundColor: isOptimal ? '#ecfdf5' : '#fffbeb',
    border: `1px solid ${isOptimal ? '#a7f3d0' : '#fde68a'}`,
    borderRadius: '9999px',
    padding: '3px 10px 3px 7px',
    whiteSpace: 'nowrap',
  };

  return (
    <span style={pillStyle}>
      <Img
        src={iconSrc(
          isOptimal ? 'lucide:check-circle-2' : 'lucide:trending-down',
          isOptimal ? '#059669' : '#b45309',
          11,
        )}
        width={11}
        height={11}
        alt=""
        style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: isOptimal ? '#047857' : '#92400e',
          verticalAlign: 'middle',
        }}
      >
        {isOptimal ? 'Optimal' : 'Can Optimize'}
      </span>
    </span>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Row>
      <Column style={{ width: '28px', verticalAlign: 'middle' }}>
        <Img
          src={iconSrc('lucide:sparkles', '#10b981', 20)}
          width={20}
          height={20}
          alt=""
          style={{ display: 'block' }}
        />
      </Column>
      <Column style={{ verticalAlign: 'middle' }}>
        <Text className="m-0 text-[19px] font-bold leading-none tracking-tight font-geist">
          <span style={{ color: '#09090b' }}>Spend</span>
          <span style={{ color: '#10b981' }}>Smart</span>
        </Text>
      </Column>
    </Row>
  );
}

// ─── Savings hero ─────────────────────────────────────────────────────────────

function SavingsHero({ totalSavings }: { totalSavings: number }) {
  if (totalSavings <= 0) {
    return (
      <Section className="bg-emerald-50 border border-solid border-emerald-200 rounded-xl py-8 px-6 mb-5 text-center">
        <Row className="mb-4">
          <Column align="center">
            <Img
              src={iconSrc('lucide:shield-check', '#059669', 32)}
              width={32}
              height={32}
              alt=""
              style={{ display: 'block', margin: '0 auto' }}
            />
          </Column>
        </Row>
        <Text className="m-0 mb-1.5 text-[20px] font-bold text-zinc-900">
          You're spending well.
        </Text>
        <Text className="m-0 text-[13px] text-zinc-500 leading-relaxed">
          Every tool in your stack is already cost-optimal for your usage.
        </Text>
      </Section>
    );
  }

  return (
    <Section className="bg-emerald-50 border border-solid border-emerald-200 rounded-xl py-6 px-6 mb-5">
      <SectionLabel icon={iconSrc('lucide:trending-down', '#059669', 13)}>
        Savings identified
      </SectionLabel>

      <Row>
        <Column
          className="pr-6"
          style={{ borderRight: '1px solid #a7f3d0', verticalAlign: 'middle' }}
        >
          <Text className="m-0 text-[38px] font-bold leading-none" style={{ color: '#065f46' }}>
            {fmt(totalSavings)}
          </Text>
          <Text className="m-0 mt-1 text-[12px] font-medium text-emerald-600">
            per month
          </Text>
        </Column>
        <Column className="pl-6" style={{ verticalAlign: 'middle' }}>
          <Text className="m-0 text-[26px] font-semibold text-zinc-900 leading-none">
            {fmt(totalSavings * 12)}
          </Text>
          <Text className="m-0 mt-1 text-[12px] text-zinc-500">per year</Text>
        </Column>
      </Row>
    </Section>
  );
}

// ─── Best option card ─────────────────────────────────────────────────────────

interface BestOptionCardProps {
  title: string;
  reason?: string;
  savings: number;
  savingsPercent: number;
  pricingUrl?: string | null;
}

function BestOptionCard({
  title,
  reason,
  savings,
  savingsPercent,
  pricingUrl,
}: BestOptionCardProps) {
  return (
    <Section className="bg-emerald-50 border border-solid border-emerald-200 rounded-xl py-4 px-4">
      {/* Label */}
      <Row className="mb-3">
        <Column style={{ width: '18px', verticalAlign: 'middle' }}>
          <Img
            src={iconSrc('lucide:sparkles', '#059669', 12)}
            width={12}
            height={12}
            alt=""
            style={{ display: 'block', marginTop: '1px' }}
          />
        </Column>
        <Column style={{ verticalAlign: 'middle' }}>
          <Text className="m-0 text-[10px] font-semibold tracking-widest uppercase text-emerald-600">
            Best option
          </Text>
        </Column>
      </Row>

      {/* Title + savings */}
      <Row>
        <Column>
          <Text className="m-0 text-[13px] font-semibold text-zinc-900">{title}</Text>
          {reason && (
            <Markdown markdownCustomStyles={mutedProseStyles}>{reason}</Markdown>
          )}
          {pricingUrl && (
            <Link href={pricingUrl} className="text-[11px] text-emerald-600 mt-1.5 block">
              View pricing →
            </Link>
          )}
        </Column>
        <Column align="right" style={{ verticalAlign: 'top' }}>
          <Text className="m-0 text-[13px] font-bold text-emerald-600 whitespace-nowrap">
            Save {fmt(savings)}/mo
          </Text>
          <Text className="m-0 mt-0.5 text-[11px] text-zinc-400 text-right">
            ({savingsPercent.toFixed(0)}% less)
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

// ─── Other option row ─────────────────────────────────────────────────────────

interface OtherOptionProps {
  title: string;
  reason?: string;
  savings: number;
  isLast: boolean;
}

function OtherOption({ title, reason, savings, isLast }: OtherOptionProps) {
  return (
    <Row className={cn(!isLast && 'mb-2')}>
      <Column>
        <Section className="bg-zinc-50 border border-solid border-zinc-200 rounded-lg py-2.5 px-3.5">
          <Row>
            <Column>
              <Text className="m-0 text-[12px] font-semibold text-zinc-700">{title}</Text>
              {reason && (
                <Markdown markdownCustomStyles={mutedProseStyles}>{reason}</Markdown>
              )}
            </Column>
            <Column align="right" style={{ verticalAlign: 'top' }}>
              <Text className="m-0 text-[12px] font-semibold text-emerald-600 whitespace-nowrap">
                −{fmt(savings)}/mo
              </Text>
            </Column>
          </Row>
        </Section>
      </Column>
    </Row>
  );
}

// ─── Score benchmark ──────────────────────────────────────────────────────────

function ScoreBenchmark({
  item,
  best,
}: {
  item: ApiAuditResult;
  best: ApiRecommendation;
}) {
  return (
    <Section className="bg-white border border-solid border-emerald-100 rounded-lg py-3 px-3.5 mt-3">
      <Text className="m-0 mb-2.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
        {item.benchmarkName} benchmark
      </Text>
      <Row className="mb-1.5">
        <Column>
          <Text className="m-0 text-[12px] text-zinc-600">{capitalize(item.primaryModel)}</Text>
        </Column>
        <Column align="right">
          <Text className="m-0 text-[12px] font-semibold text-zinc-600">
            {item.scoreUnit === 'percentage'
              ? `${item.currentModelScore!.toFixed(1)}%`
              : `${Math.round(item.currentModelScore!)} Elo`}
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text className="m-0 text-[12px] text-emerald-600">{best.modelDisplayName}</Text>
        </Column>
        <Column align="right">
          <Text className="m-0 text-[12px] font-semibold text-emerald-600">
            {best.scoreUnit === 'percentage'
              ? `${best.score.toFixed(1)}%`
              : `${Math.round(best.score)} Elo`}
          </Text>
        </Column>
      </Row>
      <Text className="m-0 mt-2 text-[10px] text-zinc-400">
        {item.higherIsBetter ? 'Higher is better' : 'Lower is better'} · Capacity
        floor: −{item.dropCapacityBy}%
      </Text>
    </Section>
  );
}

// ─── API tool card ────────────────────────────────────────────────────────────

function ApiToolCard({ item }: { item: ApiAuditResult }) {
  const best = item.bestRecommendation as ApiRecommendation | null;
  const hasOthers = item.otherOptions.length > 0;

  return (
    <Section className="bg-white border border-solid border-zinc-200 rounded-xl mb-4 overflow-hidden">
      {/* Card header */}
      <Section className="py-4 px-5 border-b border-solid border-zinc-100">
        <Row>
          <Column>
            <Text className="m-0 text-[14px] font-semibold text-zinc-900">
              {capitalize(item.toolName)}
            </Text>
            <Text className="m-0 mt-0.5 text-[12px] text-zinc-400">
              {capitalize(item.primaryModel)} · {capitalize(item.primaryUseCase)}
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: 'middle' }}>
            <StatusPill status={item.status} />
          </Column>
        </Row>
      </Section>

      {/* Card body */}
      <Section className="py-4 px-5">
        <SpendRow
          label="Current monthly spend"
          amount={fmt(item.currentAverageMonthlySpend)}
        />

        {item.summary && (
          <>
            <CardDivider />
            <Markdown markdownCustomStyles={proseStyles}>{item.summary}</Markdown>
          </>
        )}

        {item.status === 'optimize' && best && (
          <>
            <CardDivider />
            <BestOptionCard
              title={best.modelDisplayName}
              reason={best.reason}
              savings={best.savings}
              savingsPercent={best.savingsPercent}
              pricingUrl={best.pricingUrl}
            />
            {item.currentModelScore !== null && (
              <ScoreBenchmark item={item} best={best} />
            )}
          </>
        )}

        {hasOthers && (
          <>
            <CardDivider />
            <Text className="m-0 mb-2.5 text-[11px] text-zinc-400 font-medium">
              Other options
            </Text>
            {(item.otherOptions as ApiRecommendation[]).map((rec, i) => (
              <OtherOption
                key={i}
                title={rec.modelDisplayName}
                reason={rec.reason}
                savings={rec.savings}
                isLast={i === item.otherOptions.length - 1}
              />
            ))}
          </>
        )}

        {item.status === 'optimal' && (
          <>
            <CardDivider />
            <Text className="m-0 text-[12px] text-zinc-500">
              No cheaper alternative matches your current requirements.
            </Text>
          </>
        )}
      </Section>
    </Section>
  );
}

// ─── Subscription tool card ───────────────────────────────────────────────────

function SubToolCard({ item }: { item: Exclude<AuditResultItem, ApiAuditResult> }) {
  const sub = item as {
    tool: string;
    currentPlan: string;
    currentCost: number;
    status: 'optimal' | 'optimize';
    bestRecommendation: SubscriptionRecommendation | null;
    otherOptions: SubscriptionRecommendation[];
  };
  const best = sub.bestRecommendation;
  const hasOthers = sub.otherOptions.length > 0;

  return (
    <Section className="bg-white border border-solid border-zinc-200 rounded-xl mb-4 overflow-hidden">
      {/* Card header */}
      <Section className="py-4 px-5 border-b border-solid border-zinc-100">
        <Row>
          <Column>
            <Text className="m-0 text-[14px] font-semibold text-zinc-900">
              {capitalize(sub.tool)}
            </Text>
            <Text className="m-0 mt-0.5 text-[12px] text-zinc-400">
              {capitalize(sub.currentPlan)}
            </Text>
          </Column>
          <Column align="right" style={{ verticalAlign: 'middle' }}>
            <StatusPill status={sub.status} />
          </Column>
        </Row>
      </Section>

      {/* Card body */}
      <Section className="py-4 px-5">
        <SpendRow label="Current monthly spend" amount={fmt(sub.currentCost)} />

        {sub.status === 'optimize' && best && (
          <>
            <CardDivider />
            <BestOptionCard
              title={`${best.toolName} · ${best.planName}`}
              reason={best.reason}
              savings={best.savings}
              savingsPercent={best.savingsPercent}
            />
          </>
        )}

        {hasOthers && (
          <>
            <CardDivider />
            <Text className="m-0 mb-2.5 text-[11px] text-zinc-400 font-medium">
              Other options
            </Text>
            {sub.otherOptions.map((rec, i) => (
              <OtherOption
                key={i}
                title={`${rec.toolName} · ${rec.planName}`}
                reason={rec.reason}
                savings={rec.savings}
                isLast={i === sub.otherOptions.length - 1}
              />
            ))}
          </>
        )}

        {sub.status === 'optimal' && (
          <>
            <CardDivider />
            <Text className="m-0 text-[12px] text-zinc-500">
              No cheaper plan matches your current requirements.
            </Text>
          </>
        )}
      </Section>
    </Section>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

interface FullAuditReportProps {
  auditResult: AuditResult;
}

const FullAuditReport: React.FC<FullAuditReportProps> = ({ auditResult }) => {
  const totalSavings = auditResult.tools.reduce(
    (sum, item) => sum + (item.bestRecommendation?.savings ?? 0),
    0,
  );

  const previewText =
    totalSavings > 0
      ? `You can save ${fmt(totalSavings)}/mo on your AI stack — here's your full audit report.`
      : `Your AI stack is fully optimized — here's your SpendSmart audit report.`;

  return (
    <Html lang="en">
      <Head>
        {/* Geist — 400 */}
        <Font
          fontFamily="Geist"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-400-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        {/* Geist — 500 */}
        <Font
          fontFamily="Geist"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-500-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={500}
          fontStyle="normal"
        />
        {/* Geist — 600 */}
        <Font
          fontFamily="Geist"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-600-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
        {/* Geist — 700 */}
        <Font
          fontFamily="Geist"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-700-normal.woff2',
            format: 'woff2',
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>

      <Preview>{previewText}</Preview>

      <Tailwind
        config={{
          theme: {
            extend: {
              fontFamily: {
                geist: ['Geist', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body
          className="bg-zinc-50 m-0 p-0 font-geist"
          style={{ fontFamily: 'Geist, sans-serif' }}
        >
          <Container className="max-w-[640px] mx-auto py-8 px-4">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <Section className="bg-white border border-solid border-zinc-200 rounded-t-xl py-4 px-6 mb-[1px]">
              <Row>
                <Column style={{ verticalAlign: 'middle' }}>
                  <Logo />
                </Column>
                <Column align="right" style={{ verticalAlign: 'middle' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      borderRadius: '9999px',
                      padding: '3px 11px',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#71717a',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    AI Cost Audit
                  </span>
                </Column>
              </Row>
            </Section>

            {/* ── Body card ───────────────────────────────────────────────── */}
            <Section className="bg-white border border-solid border-zinc-200 rounded-b-xl">

              {/* Intro */}
              <Section className="py-7 px-6 border-b border-solid border-zinc-100">
                <Text className="m-0 mb-1.5 text-[22px] font-bold text-zinc-950 tracking-tight">
                  Your Full Audit Report
                </Text>
                <Text className="m-0 text-[14px] text-zinc-500 leading-relaxed">
                  A complete breakdown of your AI tool spending and the best opportunities
                  to optimize it.
                </Text>
              </Section>

              {/* Main content */}
              <Section className="py-6 px-6">

                {/* Savings hero */}
                <SavingsHero totalSavings={totalSavings} />

                {/* Per-tool breakdown */}
                <SectionLabel icon={iconSrc('lucide:layout-list', '#a1a1aa', 13)}>
                  Per-tool breakdown
                </SectionLabel>

                {auditResult.tools.map((item, i) =>
                  isApiResult(item) ? (
                    <ApiToolCard key={i} item={item} />
                  ) : (
                    <SubToolCard key={i} item={item} />
                  ),
                )}

                <Hr className="border-zinc-100 my-6 mx-0" />

                {/* CTA */}
                {totalSavings > 0 ? (
                  <Section className="bg-emerald-50 border border-solid border-emerald-200 rounded-xl py-7 px-6 text-center">
                    <Row className="mb-4">
                      <Column align="center">
                        <Img
                          src={iconSrc('lucide:zap', '#059669', 28)}
                          width={28}
                          height={28}
                          alt=""
                          style={{ display: 'block', margin: '0 auto' }}
                        />
                      </Column>
                    </Row>
                    <Text className="m-0 mb-1.5 text-[16px] font-bold text-emerald-800">
                      Ready to start saving?
                    </Text>
                    <Text className="m-0 mb-5 text-[13px] text-emerald-700 leading-relaxed">
                      Run a new audit anytime as your stack or pricing changes.
                    </Text>
                    <Link
                      href="https://spendsmart.dev"
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        padding: '10px 28px',
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
                ) : (
                  <Section className="border border-solid border-zinc-200 rounded-xl py-7 px-6 text-center">
                    <Text className="m-0 mb-5 text-[13px] text-zinc-500 leading-relaxed">
                      AI prices shift fast. We'll notify you when a better option
                      matches your stack.
                    </Text>
                    <Link
                      href="https://spendsmart.dev"
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#fafafa',
                        color: '#3f3f46',
                        padding: '10px 28px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: '1px solid #e4e4e7',
                        letterSpacing: '0.01em',
                      }}
                    >
                      Run another audit →
                    </Link>
                  </Section>
                )}
              </Section>
            </Section>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <Section className="text-center pt-6 pb-2">
              <Text className="m-0 mb-1 text-[12px] text-zinc-400">
                SpendSmart · AI Cost Intelligence
              </Text>
              <Text className="m-0 text-[11px] text-zinc-300">
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
