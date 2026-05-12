import React from 'react';
import { stripMdLinks } from '../../utils';

export function AiSummary({ summary }: { summary: string }) {
  return (
    <div className="section" style={{ marginTop: 24, paddingTop: 0, borderTop: 'none' }}>
      <div className="ai-summary-box">
        <p className="sub-label">AI ARCHITECTURE ANALYSIS</p>
        <p className="body-text">{stripMdLinks(summary)}</p>
      </div>
    </div>
  );
}
