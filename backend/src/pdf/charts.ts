import type { AuditResultItem, ApiAuditResult } from '@shared/types/auditResult';
import { C } from './tokens';
import { fmt, fmtExact, fmtTokens, cap } from './utils';

function isApi(r: AuditResultItem): r is ApiAuditResult {
  return 'primaryModel' in r;
}

function pct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

export function spendComparisonChart(tools: AuditResultItem[]): string {
  const maxSpend = Math.max(
    ...tools.map((t) => (isApi(t) ? t.currentAverageMonthlySpend : t.currentCost)),
    1,
  );

  const ROW_H   = 16;
  const ROW_GAP = 28;
  const LABEL_W = 120;
  const BAR_W   = 260;
  const AMT_W   = 110;
  const TOTAL_W = LABEL_W + BAR_W + AMT_W;
  const TOTAL_H = tools.length * (ROW_H + ROW_GAP) + 10;

  const rows = tools.map((tool, i) => {
    const api       = isApi(tool);
    const name      = cap(api ? tool.toolName : tool.tool);
    const label     = name.length > 18 ? name.slice(0, 17) + '…' : name;
    const current   = api ? tool.currentAverageMonthlySpend : tool.currentCost;
    const savings   = tool.bestRecommendation?.savings ?? 0;
    const projected = current - savings;
    const y         = i * (ROW_H + ROW_GAP) + 10;

    const currentBarW   = (pct(current, maxSpend) / 100) * BAR_W;
    const projectedBarW = (pct(projected, maxSpend) / 100) * BAR_W;
    const savingsBarW   = Math.max(0, currentBarW - projectedBarW);
    const barColor      = tool.status === 'optimal' ? C.emerald500 : C.emerald600;

    return `
      <text x="${LABEL_W - 12}" y="${y + ROW_H / 2}" dominant-baseline="middle" text-anchor="end"
            font-size="11" fill="${C.slate600}" font-family="Inter, sans-serif" font-weight="500">${label}</text>
      <rect x="${LABEL_W}" y="${y}" width="${Math.max(projectedBarW, 2)}" height="${ROW_H}" fill="${barColor}" rx="2"/>
      ${savings > 0
        ? `<rect x="${LABEL_W + projectedBarW}" y="${y}" width="${savingsBarW}" height="${ROW_H}" fill="${C.emerald100}" rx="0"/>`
        : ''}
      <text x="${LABEL_W + currentBarW + 10}" y="${y + ROW_H / 2}" dominant-baseline="middle"
            font-size="11" fill="${C.slate700}" font-weight="600" font-family="Inter, sans-serif">${fmt(current)}</text>
      ${savings > 0
        ? `<text x="${LABEL_W}" y="${y + ROW_H + 16}" font-size="10" fill="${C.emerald700}"
                 font-weight="500" font-family="Inter, sans-serif">→ ${fmt(projected)}/mo  ·  saves ${fmt(savings)}/mo</text>`
        : `<text x="${LABEL_W}" y="${y + ROW_H + 16}" font-size="10" fill="${C.slate400}"
                 font-family="Inter, sans-serif">Already optimal</text>`}
    `;
  });

  return `<svg width="${TOTAL_W}" height="${TOTAL_H}" xmlns="http://www.w3.org/2000/svg">${rows.join('')}</svg>`;
}

export function ioBreakdownChart(
  currentSpend: number,
  recommendedSpend: number,
  tokens: number,
  currentModelName: string,
  recModelName: string,
): string {
  const INPUT_RATIO  = 0.7;
  const OUTPUT_RATIO = 0.3;

  const currIn  = currentSpend * INPUT_RATIO;
  const currOut = currentSpend * OUTPUT_RATIO;
  const recIn   = recommendedSpend * INPUT_RATIO;
  const recOut  = recommendedSpend * OUTPUT_RATIO;

  const LABEL_W = 90;
  const BAR_W   = 200;
  const AMT_W   = 100;
  const BAR_H   = 14;
  const ROW_GAP = 8;
  const SEC_GAP = 28;
  const W       = LABEL_W + BAR_W + AMT_W;

  const bar = (val: number, color: string, y: number) => {
    const w = Math.max(2, (pct(val, currentSpend) / 100) * BAR_W);
    return `<rect x="${LABEL_W}" y="${y}" width="${w}" height="${BAR_H}" fill="${color}" rx="2"/>`;
  };
  const lbl = (text: string, y: number) =>
    `<text x="${LABEL_W - 10}" y="${y + BAR_H / 2}" dominant-baseline="middle" text-anchor="end"
           font-size="10" fill="${C.slate500}" font-family="Inter, sans-serif">${text}</text>`;
  const amt = (val: number, y: number, color: string = C.slate700) =>
    `<text x="${LABEL_W + BAR_W + 10}" y="${y + BAR_H / 2}" dominant-baseline="middle"
           font-size="10" font-weight="600" fill="${color}" font-family="Inter, sans-serif">${fmtExact(val)}/mo</text>`;
  const hdr = (text: string, y: number, color: string = C.slate400) =>
    `<text x="0" y="${y}" font-size="9" font-weight="700" fill="${color}"
           font-family="Inter, sans-serif" letter-spacing="0.08em">${text}</text>`;

  const y0 = 20;
  const y1 = y0 + BAR_H + ROW_GAP;
  const y2 = y1 + BAR_H + SEC_GAP;
  const y3 = y2 + BAR_H + ROW_GAP;
  const H  = y3 + BAR_H + 10;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${hdr(`CURRENT · ${currentModelName.toUpperCase()}`, 10)}
    ${lbl('Input 70%',  y0)} ${bar(currIn,  C.slate300,   y0)} ${amt(currIn,  y0)}
    ${lbl('Output 30%', y1)} ${bar(currOut, C.slate200,   y1)} ${amt(currOut, y1)}
    ${hdr(`AFTER SWITCH · ${recModelName.toUpperCase()} · ${fmtTokens(tokens)} tokens/mo`, y2 - 10, C.emerald600)}
    ${lbl('Input 70%',  y2)} ${bar(recIn,   C.emerald400, y2)} ${amt(recIn,  y2, C.emerald700)}
    ${lbl('Output 30%', y3)} ${bar(recOut,  C.emerald200, y3)} ${amt(recOut, y3, C.emerald700)}
  </svg>`;
}
