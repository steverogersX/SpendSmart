"use client";

import { useState } from "react";
import { ChevronDown, TrendingDown, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { isApiResult } from "@/lib/api";
import {
  ApiRecommendation,
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

function ApiRecommendationRow({ rec }: { rec: ApiRecommendation }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{rec.modelDisplayName}</span>
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Save {formatCurrency(rec.savings)}/mo ({rec.savingsPercent.toFixed(0)}
          %)
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{rec.reason}</p>
      {rec.benchmarkUrl && (
        <a
          href={rec.benchmarkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          {rec.benchmarkName} benchmark
        </a>
      )}
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
          Save {formatCurrency(rec.savings)}/mo ({rec.savingsPercent.toFixed(0)}
          %)
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{rec.reason}</p>
    </div>
  );
}

function ResultCard({ item }: { item: AuditResultItem }) {
  const [showOthers, setShowOthers] = useState(false);
  const api = isApiResult(item);

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
            <p className="font-semibold capitalize">
              {toolLabel.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {subtitle.replace(/_/g, " ")}
            </p>
          </div>
          <StatusBadge status={item.status} />
        </div>

        {/* Current spend */}
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Current monthly spend
          </span>
          <span className="text-sm font-medium">
            {formatCurrency(currentSpend)}
          </span>
        </div>

        {/* Best recommendation */}
        {item.status === "optimize" && item.bestRecommendation && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/10">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Best option
            </p>
            {api ? (
              <ApiRecommendationRow
                rec={item.bestRecommendation as ApiRecommendation}
              />
            ) : (
              <SubRecommendationRow
                rec={item.bestRecommendation as SubscriptionRecommendation}
              />
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
              {showOthers ? "Hide" : "Show"} {item.otherOptions.length} other
              option
              {item.otherOptions.length > 1 ? "s" : ""}
            </button>

            {showOthers && (
              <div className="mt-3 space-y-3 border-t pt-3">
                {api
                  ? (item.otherOptions as ApiRecommendation[]).map((rec, i) => (
                      <ApiRecommendationRow key={i} rec={rec} />
                    ))
                  : (item.otherOptions as SubscriptionRecommendation[]).map(
                      (rec, i) => <SubRecommendationRow key={i} rec={rec} />,
                    )}
              </div>
            )}
          </div>
        )}

        {/* Optimal — no savings */}
        {item.status === "optimal" && (
          <p className="text-xs text-muted-foreground">
            No cheaper alternative meets your requirements. You&apos;re on the
            best plan.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

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
