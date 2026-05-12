import React from 'react';
import type { AuditResult } from '@shared/types/auditResult';
import { isApiResult, fmt } from '../../utils';

interface Props {
  result: AuditResult;
  totalSavings: number;
}

export function ExecutiveSummary({ result, totalSavings }: Props) {
  const toolCount       = result.tools.length;
  const optimizableCount = result.tools.filter((t) => t.status === 'optimize').length;
  const optimalCount    = toolCount - optimizableCount;
  const totalSpend      = result.tools.reduce(
    (s, t) => s + (isApiResult(t) ? t.currentAverageMonthlySpend : t.currentCost), 0,
  );

  return (
    <div className="section">
      <p className="section-label">EXECUTIVE SUMMARY</p>

      {totalSavings > 0 ? (
        <div className="savings-hero">
          <p className="savings-hero-label">TOTAL SAVINGS IDENTIFIED</p>
          <div className="savings-row">
            <span className="savings-amount">{fmt(totalSavings)}</span>
            <span className="savings-unit">/mo</span>
          </div>
          <p className="savings-sub">= {fmt(totalSavings * 12)} per year&nbsp;·&nbsp;identifiable today</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <p className="hero-stat-value">{fmt(totalSpend)}</p>
              <p className="hero-stat-label">Current spend/mo</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value">{toolCount}</p>
              <p className="hero-stat-label">Tools audited</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value hero-stat-amber">{optimizableCount}</p>
              <p className="hero-stat-label">Can optimize</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value hero-stat-emerald">{optimalCount}</p>
              <p className="hero-stat-label">Already optimal</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="optimal-hero">
          <div className="optimal-check">✓</div>
          <div>
            <p className="optimal-title">You&apos;re spending well.</p>
            <p className="optimal-sub">Every tool in your stack is already cost-optimal.</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <p className="hero-stat-value">{toolCount}</p>
              <p className="hero-stat-label">Tools audited</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value hero-stat-emerald">{optimalCount}</p>
              <p className="hero-stat-label">Optimal</p>
            </div>
            <div className="hero-stat">
              <p className="hero-stat-value">{fmt(totalSpend)}</p>
              <p className="hero-stat-label">Monthly spend</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
