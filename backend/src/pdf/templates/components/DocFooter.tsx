import React from 'react';
import type { PdfMeta } from '../../types';
import { fmtDate } from '../../utils';

export function DocFooter({ meta }: { meta: PdfMeta }) {
  const url = meta.shareUrl ?? 'https://spendsmart-mocha.vercel.app';
  return (
    <div className="doc-footer">
      <div className="footer-logo">
        <span className="logo-dollar">$</span>
        <span className="logo-spend">Spend</span>
        <span className="logo-smart">Smart</span>
        <span className="footer-tagline">&nbsp;·&nbsp; AI Cost Intelligence</span>
      </div>
      <div className="footer-meta">{fmtDate(meta.date)}&nbsp;·&nbsp; {url}</div>
    </div>
  );
}
