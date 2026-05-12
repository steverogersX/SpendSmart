import React from 'react';
import type { PdfMeta } from '../../types';
import { fmtDate } from '../../utils';

export function DocHeader({ meta }: { meta: PdfMeta }) {
  return (
    <>
      <div className="doc-header">
        <div>
          <div className="logo">
            <span className="logo-dollar">$</span>
            <span className="logo-spend">Spend</span>
            <span className="logo-smart">Smart</span>
          </div>
          <p className="logo-tagline">AI Cost Intelligence</p>
        </div>
        <div className="doc-header-right">
          <span className="doc-badge">AI Cost Audit</span>
          <p className="doc-date">{fmtDate(meta.date)}</p>
        </div>
      </div>
      <div className="header-rule" />
      <div className="doc-title-block">
        <h1 className="doc-title">AI Cost Audit Report</h1>
        <p className="doc-prepared">Prepared on {fmtDate(meta.date)}</p>
      </div>
    </>
  );
}
