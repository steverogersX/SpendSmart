import * as React from 'react';
import { Section, Row, Column, Text } from '@react-email/components';
import type { ApiAuditResult, ApiRecommendation } from '@shared/types/auditResult';

const C = {
  emerald500: '#10b981',
  emerald600: '#059669',
  zinc100:    '#f4f4f5',
  zinc200:    '#e4e4e7',
  zinc400:    '#a1a1aa',
  zinc500:    '#71717a',
  zinc950:    '#09090b',
  amber500:   '#f59e0b',
};

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}

interface Props {
  item: ApiAuditResult;
  rec: ApiRecommendation;
}

// Total bar width in px — fixed for email layout
const BAR_W = 220;

export function BenchmarkChart({ item, rec }: Props) {
  if (item.currentModelScore === null) return null;

  const {
    currentModelScore,
    scoreType,
    scoreUnit,
    higherIsBetter,
    benchmarkName,
    dropCapacityBy,
  } = item;

  // ── Same percentage calculation as the frontend ──────────────────────────
  let toPercent: (s: number) => number;
  let thresholdPct: number;

  if (scoreType === 'absolute') {
    toPercent = (s) => s;
    thresholdPct = currentModelScore * (1 - dropCapacityBy / 100);
  } else {
    const min = Math.min(currentModelScore, rec.score);
    const max = Math.max(currentModelScore, rec.score);
    const range = max - min || 1;
    const pad = range * 0.1;
    const displayMin = min - pad;
    const displayMax = max + pad;
    toPercent = (s) => ((s - displayMin) / (displayMax - displayMin)) * 100;
    thresholdPct = toPercent(currentModelScore * (1 - dropCapacityBy / 100));
  }

  const formatScore = (s: number) =>
    scoreUnit === 'percentage' ? `${s.toFixed(1)}%` : `${Math.round(s)} Elo`;

  const clamp = (v: number) => Math.min(Math.max(v, 0), 100);

  const currentFillPx   = Math.round(clamp(toPercent(currentModelScore)) / 100 * BAR_W);
  const recFillPx       = Math.round(clamp(toPercent(rec.score))         / 100 * BAR_W);
  const thresholdPx     = Math.round(clamp(thresholdPct)                 / 100 * BAR_W);

  // ── Split current bar into segments for threshold line overlay ────────────
  // [fill_before_threshold][gap_if_fill<threshold][threshold_2px][fill_after_threshold][empty_rest]
  const MARKER = 2;
  const c1 = Math.min(currentFillPx, thresholdPx);           // fill before threshold
  const c2 = Math.max(thresholdPx - currentFillPx, 0);       // empty gap before threshold
  const c3 = MARKER;                                           // amber threshold marker
  const c4 = Math.max(currentFillPx - thresholdPx, 0);       // fill after threshold
  const c5 = Math.max(BAR_W - c1 - c2 - c3 - c4, 0);        // empty rest

  // ── Rec bar ───────────────────────────────────────────────────────────────
  const r1 = recFillPx;
  const r2 = Math.max(BAR_W - recFillPx, 0);

  const BAR_H = 20;
  const LABEL_W = 110;
  const SCORE_W = 80;

  return (
    <Section style={{
      border: `1px solid ${C.zinc200}`,
      backgroundColor: 'rgba(244,244,245,0.2)',
      borderRadius: '8px',
      padding: '14px',
      marginBottom: '12px',
    }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <Row style={{ marginBottom: '12px' }}>
        <Column>
          <Text style={{ margin: 0, fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.zinc500 }}>
            Benchmark comparison
          </Text>
        </Column>
        <Column align="right">
          <Text style={{ margin: 0, fontSize: '10px', color: C.zinc400 }}>{benchmarkName}</Text>
        </Column>
      </Row>

      {/* ── Current model bar ─────────────────────────────────────────── */}
      <Row style={{ marginBottom: '8px' }}>
        {/* Label */}
        <Column style={{ width: `${LABEL_W}px`, verticalAlign: 'middle' }}>
          <Text style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: C.zinc950, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {item.primaryModel.replace(/_/g, ' ')}
          </Text>
        </Column>

        {/* Bar — split into segments so threshold overlays accurately */}
        <Column style={{ verticalAlign: 'middle', paddingLeft: '8px' }}>
          <table style={{ borderCollapse: 'collapse', width: `${BAR_W}px`, height: `${BAR_H}px`, borderRadius: '4px', overflow: 'hidden' }}>
            <tbody>
              <tr>
                {/* fill before threshold */}
                {c1 > 0 && <td style={{ width: `${c1}px`, height: `${BAR_H}px`, backgroundColor: 'rgba(9,9,11,0.22)', padding: 0 }} />}
                {/* empty gap before threshold (when fill < threshold) */}
                {c2 > 0 && <td style={{ width: `${c2}px`, height: `${BAR_H}px`, backgroundColor: C.zinc100, padding: 0 }} />}
                {/* amber threshold marker */}
                <td style={{ width: `${c3}px`, height: `${BAR_H}px`, backgroundColor: C.amber500, padding: 0, opacity: 0.85 }} />
                {/* fill after threshold (when fill > threshold) */}
                {c4 > 0 && <td style={{ width: `${c4}px`, height: `${BAR_H}px`, backgroundColor: 'rgba(9,9,11,0.22)', padding: 0 }} />}
                {/* empty rest */}
                {c5 > 0 && <td style={{ width: `${c5}px`, height: `${BAR_H}px`, backgroundColor: C.zinc100, padding: 0 }} />}
              </tr>
            </tbody>
          </table>
        </Column>

        {/* Score */}
        <Column style={{ width: `${SCORE_W}px`, paddingLeft: '8px', verticalAlign: 'middle' }}>
          <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500, fontVariantNumeric: 'tabular-nums' }}>
            {formatScore(currentModelScore)}
          </Text>
        </Column>
      </Row>

      {/* ── Recommended model bar ─────────────────────────────────────── */}
      <Row style={{ marginBottom: '12px' }}>
        {/* Label */}
        <Column style={{ width: `${LABEL_W}px`, verticalAlign: 'middle' }}>
          <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500, whiteSpace: 'nowrap' }}>
            {rec.modelDisplayName}
          </Text>
        </Column>

        {/* Bar */}
        <Column style={{ verticalAlign: 'middle', paddingLeft: '8px' }}>
          <table style={{ borderCollapse: 'collapse', width: `${BAR_W}px`, height: `${BAR_H}px`, borderRadius: '4px', overflow: 'hidden' }}>
            <tbody>
              <tr>
                {r1 > 0 && <td style={{ width: `${r1}px`, height: `${BAR_H}px`, backgroundColor: C.emerald500, padding: 0 }} />}
                {r2 > 0 && <td style={{ width: `${r2}px`, height: `${BAR_H}px`, backgroundColor: C.zinc100, padding: 0 }} />}
              </tr>
            </tbody>
          </table>
        </Column>

        {/* Score + savings */}
        <Column style={{ width: `${SCORE_W}px`, paddingLeft: '8px', verticalAlign: 'middle' }}>
          <Text style={{ margin: 0, fontSize: '11px', color: C.zinc500, fontVariantNumeric: 'tabular-nums' }}>
            {formatScore(rec.score)}
          </Text>
          {rec.savings > 0 && (
            <Text style={{ margin: '1px 0 0', fontSize: '10px', color: C.emerald600, fontWeight: 500 }}>
              −{fmt(rec.savings)}/mo
            </Text>
          )}
        </Column>
      </Row>

      {/* ── Legend ────────────────────────────────────────────────────── */}
      <Row>
        <Column>
          <table style={{ borderCollapse: 'collapse', borderSpacing: 0 }}>
            <tbody>
              <tr>
                {/* Current swatch */}
                <td style={{ paddingRight: '4px', verticalAlign: 'middle' }}>
                  <div style={{ width: '14px', height: '8px', backgroundColor: 'rgba(9,9,11,0.22)', borderRadius: '2px' }} />
                </td>
                <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}>
                  <Text style={{ margin: 0, fontSize: '10px', color: C.zinc400, whiteSpace: 'nowrap' }}>Current</Text>
                </td>
                {/* Best option swatch */}
                <td style={{ paddingRight: '4px', verticalAlign: 'middle' }}>
                  <div style={{ width: '14px', height: '8px', backgroundColor: C.emerald500, borderRadius: '2px' }} />
                </td>
                <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}>
                  <Text style={{ margin: 0, fontSize: '10px', color: C.zinc400, whiteSpace: 'nowrap' }}>Best option</Text>
                </td>
                {/* Capacity floor swatch */}
                <td style={{ paddingRight: '4px', verticalAlign: 'middle' }}>
                  <div style={{ width: '2px', height: '12px', backgroundColor: C.amber500 }} />
                </td>
                <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}>
                  <Text style={{ margin: 0, fontSize: '10px', color: C.zinc400, whiteSpace: 'nowrap' }}>−{dropCapacityBy}% floor</Text>
                </td>
                {/* Higher/lower */}
                <td style={{ verticalAlign: 'middle' }}>
                  <Text style={{ margin: 0, fontSize: '10px', color: C.zinc400, whiteSpace: 'nowrap' }}>
                    {higherIsBetter ? 'Higher is better' : 'Lower is better'}
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Column>
      </Row>

    </Section>
  );
}
