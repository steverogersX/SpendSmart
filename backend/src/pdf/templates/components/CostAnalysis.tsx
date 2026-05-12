import React from 'react';
import type { AuditResult } from '@shared/types/auditResult';
import { isApiResult, fmt } from '../../utils';
import { spendComparisonChart } from '../../charts';
import { C } from '../../tokens';

interface Props {
  result: AuditResult;
  totalSavings: number;
}

export function CostAnalysis({ result, totalSavings }: Props) {
  const totalCurrent   = result.tools.reduce(
    (s, t) => s + (isApiResult(t) ? t.currentAverageMonthlySpend : t.currentCost), 0,
  );
  const totalProjected = totalCurrent - totalSavings;
  const chartSvg       = spendComparisonChart(result.tools);

  return (
    <div className="section">
      <p className="section-label">COST ANALYSIS</p>

      <div className="data-table" style={{ marginBottom: 28 }}>
        {totalSavings > 0 ? (
          <>
            <div className="data-row">
              <span className="data-label">Current monthly spend</span>
              <span className="data-value">{fmt(totalCurrent)} <span className="data-unit">/mo</span></span>
            </div>
            <div className="data-row">
              <span className="data-label">After optimization</span>
              <span className="data-value emerald">{fmt(totalProjected)} <span className="data-unit">/mo</span></span>
            </div>
            <div className="data-row last">
              <span className="data-label">Net savings</span>
              <span className="data-value emerald large">
                {fmt(totalSavings)} <span className="data-unit">/mo&nbsp;·&nbsp;{fmt(totalSavings * 12)}/yr</span>
              </span>
            </div>
          </>
        ) : (
          <div className="data-row last">
            <span className="data-label">Monthly spend</span>
            <span className="data-value">{fmt(totalCurrent)} <span className="data-unit">/mo</span></span>
          </div>
        )}
      </div>

      <p className="sub-label">PER-TOOL BREAKDOWN</p>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="chart-wrap" dangerouslySetInnerHTML={{ __html: chartSvg }} />

      {totalSavings > 0 && (
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: C.emerald500 }} />
            Projected spend
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: C.emerald100, border: `1px solid ${C.emerald200}` }} />
            Identified savings
          </span>
        </div>
      )}
    </div>
  );
}
