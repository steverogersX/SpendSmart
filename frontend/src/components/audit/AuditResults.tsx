"use client";

import { useState } from "react";
import { ChevronDown, TrendingDown, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isApiResult } from "@/lib/api";
import {
  ApiRecommendation,
  ApiAuditResult,
  AuditResult,
  AuditResultItem,
  SubscriptionRecommendation,
} from "@shared/types/auditResult";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function StatusBadge({ status }: { status: "optimal" | "optimize" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "optimal"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      )}
    >
      {status === "optimal" ? (
        <CheckCircle className="size-3" />
      ) : (
        <TrendingDown className="size-3" />
      )}
      {status === "optimal" ? "Optimal" : "Can Optimize"}
    </span>
  );
}

// ─── Benchmark chart ──────────────────────────────────────────────────────────

type ChartBar = {
  label: string;
  score: number;
  isCurrent?: boolean;
  isBest?: boolean;
  savings?: number;
};

function BenchmarkChart({
  item,
  comparedRec,
}: {
  item: ApiAuditResult;
  comparedRec: ApiRecommendation;
}) {
  const { currentModelScore, scoreType, scoreUnit, higherIsBetter, benchmarkName, benchmarkUrl, dropCapacityBy } = item;
  const isBest = comparedRec === item.bestRecommendation;

  if (currentModelScore === null) return null;

  const bars: ChartBar[] = [
    { label: item.primaryModel.replace(/_/g, " "), score: currentModelScore, isCurrent: true },
    { label: comparedRec.modelDisplayName, score: comparedRec.score, isBest, savings: comparedRec.savings },
  ];

  // Normalize scores to bar widths (0–100%)
  let toPercent: (score: number) => number;
  let thresholdPct: number;

  if (scoreType === "absolute") {
    toPercent = (s) => s; // already 0–100
    thresholdPct = currentModelScore * (1 - dropCapacityBy / 100);
  } else {
    // Relative (Elo): normalize across the two visible scores with 10% padding
    const scores = bars.map((b) => b.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;
    const pad = range * 0.1;
    const displayMin = min - pad;
    const displayMax = max + pad;
    toPercent = (s) => ((s - displayMin) / (displayMax - displayMin)) * 100;
    thresholdPct = toPercent(currentModelScore * (1 - dropCapacityBy / 100));
  }

  const formatScore = (s: number) =>
    scoreUnit === "percentage" ? `${s.toFixed(1)}%` : `${Math.round(s)} Elo`;

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0 pt-0.5">
          Benchmark comparison
        </span>

        {/* Per-model benchmark links — model name as label, benchmark name as tooltip */}
        <div className="flex flex-col items-end gap-1">
          {benchmarkUrl && (
            <a
              href={benchmarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={benchmarkName}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="w-2 h-2 rounded-sm bg-foreground/30 shrink-0" />
              {item.primaryModel.replace(/_/g, " ")}
              <ExternalLink className="size-3 shrink-0" />
            </a>
          )}
          {comparedRec.benchmarkUrl && (
            <a
              href={comparedRec.benchmarkUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={comparedRec.benchmarkName}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className={cn("w-2 h-2 rounded-sm shrink-0", isBest ? "bg-emerald-500" : "bg-blue-400/70")} />
              {comparedRec.modelDisplayName}
              <ExternalLink className="size-3 shrink-0" />
            </a>
          )}
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-2">
        {bars.map((bar, i) => {
          const widthPct = toPercent(bar.score);
          return (
            <div key={i} className="flex items-center gap-2">
              {/* Label */}
              <span
                className={cn(
                  "w-36 shrink-0 truncate text-xs capitalize",
                  bar.isCurrent ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
                title={bar.label}
              >
                {bar.label}
              </span>

              {/* Bar track */}
              <div className="relative flex-1 h-5 rounded bg-muted overflow-visible">
                {/* Fill */}
                <div
                  className={cn(
                    "h-full rounded transition-[width] duration-500",
                    bar.isCurrent
                      ? "bg-foreground/25"
                      : bar.isBest
                        ? "bg-emerald-500"
                        : "bg-blue-400/70",
                  )}
                  style={{ width: `${Math.min(widthPct, 100)}%` }}
                />

                {/* Capacity floor threshold line — anchored to current model row */}
                {i === 0 && (
                  <div
                    className="absolute top-0 h-full border-l-2 border-dashed border-amber-500"
                    style={{ left: `${Math.min(thresholdPct, 100)}%` }}
                  >
                    <span className="absolute -top-5 left-1 whitespace-nowrap text-[10px] text-amber-600 dark:text-amber-400">
                      −{dropCapacityBy}% floor
                    </span>
                  </div>
                )}
              </div>

              {/* Score + savings */}
              <div className="w-28 shrink-0 flex items-center justify-between gap-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatScore(bar.score)}
                </span>
                {bar.savings !== undefined && (
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    −{formatCurrency(bar.savings)}/mo
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-4 rounded-sm bg-foreground/25" />
          <span className="text-[10px] text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={cn("h-2 w-4 rounded-sm", isBest ? "bg-emerald-500" : "bg-blue-400/70")} />
          <span className="text-[10px] text-muted-foreground">
            {isBest ? "Best option" : "Selected option"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-0 border-l-2 border-dashed border-amber-500" />
          <span className="text-[10px] text-muted-foreground">Capacity floor</span>
        </div>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {higherIsBetter ? "Higher is better" : "Lower is better"}
        </span>
      </div>
    </div>
  );
}

// ─── Recommendation rows ──────────────────────────────────────────────────────

function ApiRecommendationRow({ rec }: { rec: ApiRecommendation }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{rec.modelDisplayName}</span>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Save {formatCurrency(rec.savings)}/mo ({rec.savingsPercent.toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <p className="text-xs text-muted-foreground">{rec.reason}</p>
        {rec.pricingUrl && (
          <a
            href={rec.pricingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-xs text-primary/70 hover:text-primary transition-colors whitespace-nowrap"
          >
            pricing
            <ExternalLink className="size-2.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function SubRecommendationRow({ rec }: { rec: SubscriptionRecommendation }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">
          {rec.toolName} · {rec.planName}
        </span>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Save {formatCurrency(rec.savings)}/mo ({rec.savingsPercent.toFixed(0)}%)
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{rec.reason}</p>
    </div>
  );
}

// ─── Markdown link renderer ───────────────────────────────────────────────────

function renderWithLinks(text: string) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <a
          key={i}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 decoration-muted-foreground/50 hover:decoration-foreground transition-colors"
        >
          {m[1]}
        </a>
      );
    }
    return part;
  });
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ item }: { item: AuditResultItem }) {
  const [showOthers, setShowOthers] = useState(false);
  const api = isApiResult(item);

  // Which recommendation is currently shown in the chart (defaults to best)
  const [selectedRec, setSelectedRec] = useState<ApiRecommendation | null>(
    api ? (item.bestRecommendation ?? null) : null,
  );

  const toolLabel = api ? item.toolName : item.tool;
  const currentSpend = api ? item.currentAverageMonthlySpend : item.currentCost;
  const subtitle = api
    ? `${item.primaryModel} · ${item.primaryUseCase}`
    : `${item.currentPlan}`;

  return (
    <Card>
      <CardContent className="pt-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold capitalize">{toolLabel.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {subtitle.replace(/_/g, " ")}
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Current spend */}
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
          <span className="text-xs text-muted-foreground">Current monthly spend</span>
          <span className="text-sm font-medium">{formatCurrency(currentSpend)}</span>
        </div>

        {/* Benchmark chart — API results only, shown when there's something to compare */}
        {api && selectedRec && (
          <BenchmarkChart item={item} comparedRec={selectedRec} />
        )}

        {/* Summary — API only */}
        {api && item.summary && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {renderWithLinks(item.summary)}
          </p>
        )}

        {/* Best recommendation */}
        {item.status === "optimize" && item.bestRecommendation && (
          <div
            role={api ? "button" : undefined}
            tabIndex={api ? 0 : undefined}
            onClick={api ? () => setSelectedRec(item.bestRecommendation as ApiRecommendation) : undefined}
            onKeyDown={api ? (e) => e.key === "Enter" && setSelectedRec(item.bestRecommendation as ApiRecommendation) : undefined}
            className={cn(
              "rounded-lg border p-3",
              api && "cursor-pointer transition-colors",
              api && selectedRec === item.bestRecommendation
                ? "border-emerald-400 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-900/20"
                : "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10",
              api && selectedRec !== item.bestRecommendation && "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/15",
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Best option
              </p>
              {api && selectedRec !== item.bestRecommendation && (
                <span className="text-[10px] text-emerald-600/70 dark:text-emerald-500">
                  Click to compare
                </span>
              )}
            </div>
            {api ? (
              <ApiRecommendationRow rec={item.bestRecommendation as ApiRecommendation} />
            ) : (
              <SubRecommendationRow rec={item.bestRecommendation as SubscriptionRecommendation} />
            )}
          </div>
        )}

        {/* Other options */}
        {item.otherOptions.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowOthers((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  showOthers && "rotate-180",
                )}
              />
              {showOthers ? "Hide" : "Show"} {item.otherOptions.length} other option
              {item.otherOptions.length > 1 ? "s" : ""}
            </button>

            {showOthers && (
              <div className="mt-2 space-y-1.5">
                {api
                  ? (item.otherOptions as ApiRecommendation[]).map((rec, i) => {
                      const isSelected = selectedRec === rec;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedRec(rec)}
                          className={cn(
                            "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                            isSelected
                              ? "border-blue-400/60 bg-blue-50/60 dark:bg-blue-900/10"
                              : "border-border bg-muted/20 hover:bg-muted/50",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{rec.modelDisplayName}</span>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              −{formatCurrency(rec.savings)}/mo
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{rec.reason}</p>
                          {isSelected && (
                            <p className="mt-1 text-[10px] text-blue-500 dark:text-blue-400">
                              Showing benchmark comparison above
                            </p>
                          )}
                        </button>
                      );
                    })
                  : (item.otherOptions as SubscriptionRecommendation[]).map((rec, i) => (
                      <div key={i} className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                        <SubRecommendationRow rec={rec} />
                      </div>
                    ))}
              </div>
            )}
          </div>
        )}

        {/* Optimal — no savings */}
        {item.status === "optimal" && (
          <p className="text-xs text-muted-foreground">
            No cheaper alternative meets your requirements. You&apos;re on the best plan.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function AuditResults({ result }: { result: AuditResult }) {
  return (
    <div className="space-y-4 pt-2">
      <h2 className="text-lg font-semibold tracking-tight">Audit Results</h2>
      {result.results.map((item, i) => (
        <ResultCard key={i} item={item} />
      ))}
    </div>
  );
}
