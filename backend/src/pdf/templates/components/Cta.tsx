import React from 'react';
import { fmt } from '../../utils';

export function Cta({ totalSavings }: { totalSavings: number }) {
  if (totalSavings > 500) {
    return (
      <div className="cta-block cta-high">
        <div className="cta-icon">✨</div>
        <div className="cta-content">
          <p className="cta-label">NEXT STEPS</p>
          <p className="cta-title">{fmt(totalSavings)}/mo in savings identified</p>
          <p className="cta-body">
            A Credex advisor will follow up with a tailored migration plan at no cost — Cursor, Claude, ChatGPT
            Enterprise sourced at cost from companies that overforecast.
          </p>
          <p className="cta-url">→&nbsp; spendsmart-mocha.vercel.app</p>
        </div>
      </div>
    );
  }

  if (totalSavings >= 100) {
    return (
      <div className="cta-block cta-mid">
        <div className="cta-content">
          <p className="cta-label">NEXT STEPS</p>
          <p className="cta-title">{fmt(totalSavings)}/mo in savings identified</p>
          <p className="cta-body">Get the full migration guide with step-by-step instructions sent to your inbox.</p>
          <p className="cta-url">→&nbsp; spendsmart-mocha.vercel.app</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cta-block cta-low">
      <div className="cta-content">
        <p className="cta-label">STAY INFORMED</p>
        <p className="cta-title">You&apos;re spending well.</p>
        <p className="cta-body">AI pricing shifts fast. We&apos;ll alert you when a cheaper model matches your quality bar.</p>
        <p className="cta-url">→&nbsp; spendsmart-mocha.vercel.app</p>
      </div>
    </div>
  );
}
