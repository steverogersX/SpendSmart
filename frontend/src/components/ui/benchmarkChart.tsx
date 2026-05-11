import { cn, formatCurrency } from "@/lib/utils";
import { ChartBar } from "@/types/benchmark";
import { ApiAuditResult, ApiRecommendation } from "@shared/types/auditResult";
import { ExternalLink } from "lucide-react";

export function BenchmarkChart({
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

  let toPercent: (score: number) => number;
  let thresholdPct: number;

  if (scoreType === "absolute") {
    toPercent = (s) => s;
    thresholdPct = currentModelScore * (1 - dropCapacityBy / 100);
  } else {
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
      <div className="flex items-start justify-between gap-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0 pt-0.5">
          Benchmark comparison
        </span>
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

      <div className="space-y-2">
        {bars.map((bar, i) => {
          const widthPct = toPercent(bar.score);
          return (
            <div key={i} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-36 shrink-0 truncate text-xs capitalize",
                  bar.isCurrent ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
                title={bar.label}
              >
                {bar.label}
              </span>
              <div className="relative flex-1 h-5 rounded bg-muted overflow-visible">
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
