import React from 'react';
import type { AuditResult } from '@shared/types/auditResult';
import type { PdfMeta } from '../types';
import { CSS } from '../styles';
import { DocHeader } from './components/DocHeader';
import { DocFooter } from './components/DocFooter';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { AiSummary } from './components/AiSummary';
import { CostAnalysis } from './components/CostAnalysis';
import { ToolCard } from './components/ToolCard';
import { Cta } from './components/Cta';

interface Props {
  result: AuditResult;
  meta: PdfMeta;
}

export function AuditReport({ result, meta }: Props) {
  const totalSavings = result.tools.reduce(
    (sum, item) => sum + (item.bestRecommendation?.savings ?? 0), 0,
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>SpendSmart Audit Report</title>
        {/* eslint-disable-next-line react/no-danger */}
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <div className="accent-bar" />
        <DocHeader meta={meta} />
        <ExecutiveSummary result={result} totalSavings={totalSavings} />
        {result.aiSummary && <AiSummary summary={result.aiSummary} />}
        {totalSavings > 0 && <CostAnalysis result={result} totalSavings={totalSavings} />}
        {result.tools.map((item, i) => (
          <ToolCard key={i} item={item} index={i} />
        ))}
        <Cta totalSavings={totalSavings} />
        <DocFooter meta={meta} />
      </body>
    </html>
  );
}
