import React from 'react';
import type {
  AuditResultItem,
  ApiAuditResult,
  ApiRecommendation,
  SubscriptionRecommendation,
} from '@shared/types/auditResult';
import { isApiResult, fmt, cap, stripMdLinks, pad2 } from '../../utils';
import { ioBreakdownChart } from '../../charts';

// ── Sub-components ────────────────────────────────────────────────────────────

function ApiDetails({ item }: { item: ApiAuditResult }) {
  const best             = item.bestRecommendation as ApiRecommendation;
  const currentSpend     = item.currentAverageMonthlySpend;
  const recommendedSpend = currentSpend - best.savings;
  const ioSvg            = ioBreakdownChart(
    currentSpend, recommendedSpend, best.estimatedMonthlyTokens,
    cap(item.primaryModel), best.modelDisplayName,
  );
  const scoreLabel = best.scoreUnit === 'Elo points'
    ? `${Math.round(best.score)} Elo on ${best.benchmarkName}`
    : `${best.score.toFixed(1)}% on ${best.benchmarkName}`;
  const others = item.otherOptions as ApiRecommendation[];

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="chart-box" dangerouslySetInnerHTML={{ __html: ioSvg }} />

      <div className="rec-block">
        <p className="rec-block-label">RECOMMENDATION</p>
        <div className="data-table">
          <div className="data-row">
            <span className="data-label">Switch to</span>
            <span className="data-value">{best.modelDisplayName}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Monthly savings</span>
            <span className="data-value emerald large">
              {fmt(best.savings)} <span className="data-unit">/mo&nbsp;·&nbsp;{best.savingsPercent.toFixed(0)}% reduction</span>
            </span>
          </div>
          <div className="data-row">
            <span className="data-label">Benchmark quality</span>
            <span className="data-value">{scoreLabel}</span>
          </div>
          <div className="data-row-stacked last">
            <span className="data-label">Reasoning</span>
            <p className="data-value-paragraph">{stripMdLinks(best.reason)}</p>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="other-options">
          <p className="sub-label">OTHER OPTIONS</p>
          <div className="data-table">
            {others.map((r, j) => (
              <div key={j} className={`data-row${j === others.length - 1 ? ' last' : ''}`}>
                <span className="data-label">{r.modelDisplayName}</span>
                <span className="data-value emerald">−{fmt(r.savings)} <span className="data-unit">/mo</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SubscriptionDetails({ item }: { item: AuditResultItem }) {
  const best   = item.bestRecommendation as SubscriptionRecommendation;
  const others = item.otherOptions as SubscriptionRecommendation[];

  return (
    <>
      <div className="rec-block">
        <p className="rec-block-label">RECOMMENDATION</p>
        <div className="data-table">
          <div className="data-row">
            <span className="data-label">Switch to</span>
            <span className="data-value">{cap(best.toolName)}&nbsp;·&nbsp;{cap(best.planName)}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Monthly savings</span>
            <span className="data-value emerald large">
              {fmt(best.savings)} <span className="data-unit">/mo&nbsp;·&nbsp;{best.savingsPercent.toFixed(0)}% reduction</span>
            </span>
          </div>
          <div className="data-row-stacked last">
            <span className="data-label">Reasoning</span>
            <p className="data-value-paragraph">{best.reason}</p>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="other-options">
          <p className="sub-label">OTHER OPTIONS</p>
          <div className="data-table">
            {others.map((r, j) => (
              <div key={j} className={`data-row${j === others.length - 1 ? ' last' : ''}`}>
                <span className="data-label">{cap(r.toolName)}&nbsp;·&nbsp;{cap(r.planName)}</span>
                <span className="data-value emerald">−{fmt(r.savings)} <span className="data-unit">/mo</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ToolCard({ item, index }: { item: AuditResultItem; index: number }) {
  const api          = isApiResult(item);
  const toolLabel    = cap(api ? item.toolName : item.tool).toUpperCase();
  const currentSpend = api ? item.currentAverageMonthlySpend : item.currentCost;
  const subtitle     = api
    ? `${cap(item.primaryModel)} · ${cap(item.primaryUseCase)}`
    : cap(item.currentPlan);
  const isOptimal    = item.status === 'optimal';

  return (
    <div className={`tool-card ${isOptimal ? 'tool-card-optimal' : 'tool-card-optimize'}`}>
      <div className="tool-header">
        <div className="tool-number-name">
          <span className="tool-number">{pad2(index + 1)}</span>
          <span className="tool-name">{toolLabel}</span>
        </div>
        {isOptimal
          ? <span className="tag-optimal">✓&nbsp; OPTIMAL</span>
          : <span className="tag-optimize">↓&nbsp; CAN OPTIMIZE</span>}
      </div>

      <div className="tool-divider" />

      <div className="data-table" style={{ marginTop: 12 }}>
        <div className="data-row">
          <span className="data-label">Current monthly spend</span>
          <span className="data-value">{fmt(currentSpend)} <span className="data-unit">/mo</span></span>
        </div>
        <div className="data-row last">
          <span className="data-label">{api ? 'Model · Use case' : 'Current plan'}</span>
          <span className="data-value">{subtitle}</span>
        </div>
      </div>

      {api && item.summary && (
        <p className="tool-summary-text">{stripMdLinks(item.summary)}</p>
      )}

      {!isOptimal && item.bestRecommendation && (
        api
          ? <ApiDetails item={item as ApiAuditResult} />
          : <SubscriptionDetails item={item} />
      )}

      {isOptimal && (
        <p className="body-text" style={{ marginTop: 16, color: 'var(--slate-500)' }}>
          No cheaper alternative meets your quality and use case requirements. You&apos;re already on the optimal plan.
        </p>
      )}
    </div>
  );
}
