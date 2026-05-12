import { C } from './tokens';

// ── Design tokens as CSS custom properties ────────────────────────────────────
// Derived from tokens.ts so there is one source of truth for all colors.
const ROOT_VARS = `
:root {
  /* Emerald */
  --emerald-50:  ${C.emerald50};
  --emerald-100: ${C.emerald100};
  --emerald-200: ${C.emerald200};
  --emerald-400: ${C.emerald400};
  --emerald-500: ${C.emerald500};
  --emerald-600: ${C.emerald600};
  --emerald-700: ${C.emerald700};
  --emerald-800: ${C.emerald800};
  /* Amber */
  --amber-50:    ${C.amber50};
  --amber-100:   ${C.amber100};
  --amber-200:   ${C.amber200};
  --amber-400:   ${C.amber400};
  --amber-600:   ${C.amber600};
  --amber-700:   ${C.amber700};
  /* Slate */
  --slate-50:    ${C.slate50};
  --slate-100:   ${C.slate100};
  --slate-200:   ${C.slate200};
  --slate-300:   ${C.slate300};
  --slate-400:   ${C.slate400};
  --slate-500:   ${C.slate500};
  --slate-600:   ${C.slate600};
  --slate-700:   ${C.slate700};
  --slate-800:   ${C.slate800};
  --slate-900:   ${C.slate900};
  --white:       ${C.white};
}`;

// ── Stylesheet ─────────────────────────────────────────────────────────────────
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

${ROOT_VARS}

@page {
  size: A4;
  margin: 22mm 18mm 18mm 18mm;
}

/* ── Reset ──────────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--white);
  color: var(--slate-900);
  font-size: 13px;
  line-height: 1.6;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── Accent bar ─────────────────────────────────────────────────────────────── */
.accent-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 6px;
  background: var(--emerald-500);
}

/* ── Document header ────────────────────────────────────────────────────────── */
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 0 16px 0;
}
.logo          { line-height: 1; margin-bottom: 4px; }
.logo-dollar   { font-family: monospace; font-size: 22px; font-weight: 800; color: var(--emerald-600); }
.logo-spend    { font-size: 20px; font-weight: 700; color: var(--slate-900);   letter-spacing: -0.02em; }
.logo-smart    { font-size: 20px; font-weight: 700; color: var(--emerald-600); letter-spacing: -0.02em; }
.logo-tagline  { font-size: 11px; color: var(--slate-500); letter-spacing: 0.02em; font-weight: 500; }
.doc-badge {
  display: inline-block;
  background: var(--slate-50);
  border: 1px solid var(--slate-200);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: var(--slate-600);
  letter-spacing: 0.08em;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.doc-date        { font-size: 11px; color: var(--slate-500); text-align: right; }
.doc-header-right { text-align: right; }

/* ── Header rule ────────────────────────────────────────────────────────────── */
.header-rule { height: 1px; background: var(--slate-200); margin: 0; }

/* ── Title block ────────────────────────────────────────────────────────────── */
.doc-title-block { padding: 24px 0 0; }
.doc-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--slate-900);
  line-height: 1.2;
  margin-bottom: 6px;
}
.doc-prepared { font-size: 13px; color: var(--slate-500); }

/* ── Section wrapper ────────────────────────────────────────────────────────── */
.section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--slate-200);
}
.section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--slate-500);
  margin-bottom: 16px;
}
.sub-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--slate-500);
  margin-bottom: 12px;
}
.body-text { font-size: 13px; line-height: 1.6; color: var(--slate-700); }

/* ── AI summary box ─────────────────────────────────────────────────────────── */
.ai-summary-box {
  background: var(--slate-50);
  border: 1px solid var(--slate-200);
  border-radius: 8px;
  padding: 20px;
}

/* ── Savings hero ───────────────────────────────────────────────────────────── */
.savings-hero {
  background: var(--emerald-50);
  border: 1px solid var(--emerald-200);
  border-radius: 8px;
  padding: 28px 32px 24px;
}
.savings-hero-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--emerald-700);
  margin-bottom: 12px;
}
.savings-row    { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
.savings-amount { font-size: 48px; font-weight: 800; letter-spacing: -0.04em; color: var(--emerald-700); line-height: 1; }
.savings-unit   { font-size: 20px; font-weight: 600; color: var(--emerald-600); }
.savings-sub    { font-size: 13px; color: var(--emerald-800); font-weight: 500; }

/* ── Hero stats grid ────────────────────────────────────────────────────────── */
.hero-stats {
  display: flex;
  gap: 0;
  margin-top: 24px;
  border-top: 1px solid var(--emerald-200);
  padding-top: 20px;
}
.hero-stat         { flex: 1; text-align: center; }
.hero-stat + .hero-stat { border-left: 1px solid var(--emerald-200); }
.hero-stat-value   { font-size: 18px; font-weight: 700; color: var(--slate-900); letter-spacing: -0.02em; }
.hero-stat-emerald { color: var(--emerald-600); }
.hero-stat-amber   { color: var(--amber-600); }
.hero-stat-label   { font-size: 11px; color: var(--slate-600); margin-top: 4px; font-weight: 500; }

/* ── Optimal hero ───────────────────────────────────────────────────────────── */
.optimal-hero {
  background: var(--emerald-50);
  border: 1px solid var(--emerald-200);
  border-radius: 8px;
  padding: 28px 32px 24px;
}
.optimal-check {
  display: inline-flex;
  width: 40px; height: 40px;
  align-items: center;
  justify-content: center;
  background: var(--emerald-100);
  border-radius: 50%;
  font-size: 20px;
  color: var(--emerald-600);
  margin-bottom: 16px;
}
.optimal-title { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; color: var(--slate-900); margin-bottom: 6px; }
.optimal-sub   { font-size: 14px; color: var(--slate-600); }
.optimal-hero .hero-stats { margin-top: 20px; padding-top: 16px; }

/* ── Data table (label / value rows) ───────────────────────────────────────── */
.data-table { width: 100%; }
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--slate-200);
}
.data-row.last         { border-bottom: none; padding-bottom: 0; }
.data-row-stacked {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0;
  border-bottom: 1px solid var(--slate-200);
}
.data-row-stacked.last { border-bottom: none; padding-bottom: 0; }
.data-label            { font-size: 12px; color: var(--slate-500); flex-shrink: 0; line-height: 1.4; }
.data-value            { font-size: 13px; font-weight: 600; color: var(--slate-900); text-align: right; line-height: 1.4; }
.data-value.emerald    { color: var(--emerald-600); }
.data-value.large      { font-size: 15px; }
.data-value-paragraph  { font-size: 13px; color: var(--slate-700); line-height: 1.6; text-align: left; }
.data-unit             { font-size: 11px; font-weight: 400; color: var(--slate-500); }

/* ── Charts ─────────────────────────────────────────────────────────────────── */
.chart-wrap { overflow: visible; margin: 0 0 8px; }
.chart-box {
  margin-top: 20px;
  padding: 16px;
  background: var(--slate-50);
  border: 1px solid var(--slate-200);
  border-radius: 6px;
}
.chart-legend { display: flex; gap: 20px; margin-top: 12px; }
.legend-item  { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--slate-500); }
.legend-swatch { width: 12px; height: 12px; border-radius: 2px; display: inline-block; }

/* ── Tool card ──────────────────────────────────────────────────────────────── */
.tool-card {
  margin-top: 24px;
  padding: 24px;
  border: 1px solid var(--slate-200);
  border-radius: 8px;
  background: var(--white);
  page-break-inside: avoid;
}
.tool-card-optimize { border-left: 4px solid var(--amber-400); }
.tool-card-optimal  { border-left: 4px solid var(--emerald-400); }
.tool-header        { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.tool-divider       { height: 1px; background: var(--slate-200); margin: 0 0 16px 0; }
.tool-number-name   { display: flex; align-items: center; gap: 12px; }
.tool-number        { font-size: 12px; font-weight: 700; color: var(--slate-400); font-family: monospace; letter-spacing: 0.06em; }
.tool-name          { font-size: 16px; font-weight: 700; color: var(--slate-900); letter-spacing: -0.01em; }
.tool-summary-text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--slate-600);
  margin-top: 16px;
  background: var(--slate-50);
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid var(--slate-200);
}

/* ── Status tags ────────────────────────────────────────────────────────────── */
.tag-optimal {
  display: inline-flex;
  align-items: center;
  background: var(--emerald-50);
  border: 1px solid var(--emerald-200);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--emerald-700);
}
.tag-optimize {
  display: inline-flex;
  align-items: center;
  background: var(--amber-50);
  border: 1px solid var(--amber-200);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--amber-700);
}

/* ── Recommendation block ───────────────────────────────────────────────────── */
.rec-block {
  background: var(--emerald-50);
  border: 1px solid var(--emerald-200);
  border-radius: 6px;
  padding: 16px 20px;
  margin-top: 20px;
}
.rec-block-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--emerald-700);
  margin-bottom: 12px;
}
.other-options { margin-top: 20px; padding: 0 4px; }

/* ── CTA block ──────────────────────────────────────────────────────────────── */
.cta-block {
  margin-top: 36px;
  border-radius: 8px;
  padding: 0;
  page-break-inside: avoid;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}
.cta-icon    { width: 56px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.cta-content { flex: 1; padding: 24px; }
.cta-high    { background: var(--emerald-50); border: 1px solid var(--emerald-200); }
.cta-high .cta-icon { background: var(--emerald-100); border-right: 1px solid var(--emerald-200); }
.cta-mid     { background: var(--slate-50); border: 1px solid var(--slate-200); }
.cta-low     { background: var(--slate-50); border: 1px solid var(--slate-200); }
.cta-label   { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; color: var(--slate-500); margin-bottom: 8px; }
.cta-high .cta-label { color: var(--emerald-700); }
.cta-title   { font-size: 18px; font-weight: 700; color: var(--slate-900); margin-bottom: 8px; letter-spacing: -0.02em; }
.cta-body    { font-size: 13px; line-height: 1.6; color: var(--slate-700); margin-bottom: 12px; }
.cta-url     { font-size: 12px; font-weight: 600; color: var(--emerald-600); }
.cta-mid .cta-url, .cta-low .cta-url { color: var(--slate-600); }

/* ── Footer ─────────────────────────────────────────────────────────────────── */
.doc-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--slate-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-logo    { line-height: 1; display: flex; align-items: center; gap: 4px; }
.footer-tagline { font-size: 11px; color: var(--slate-500); margin-left: 6px; }
.footer-meta    { font-size: 11px; color: var(--slate-500); text-align: right; }
`;
