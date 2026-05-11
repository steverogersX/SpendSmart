"use client";

import { useState } from "react";
import { ChevronDown, TrendingDown, CheckCircle, ExternalLink, Share2, Sparkles, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { isApiResult } from "@/lib/api";
import {
  ApiRecommendation,
  ApiAuditResult,
  AuditResult,
  AuditResultItem,
  SubscriptionRecommendation,
} from "@shared/types/auditResult";
import { ShareModal } from "./ShareModal";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { BenchmarkChart } from "../ui/benchmarkChart";


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

// ─── Share helpers ────────────────────────────────────────────────────────────

function buildOgParams(item: AuditResultItem): URLSearchParams {
  const api = isApiResult(item);
  const p = new URLSearchParams();
  p.set("status", item.status);
  p.set("tool", (api ? item.toolName : item.tool).replace(/_/g, " "));
  p.set("spend", String(Math.round(api ? item.currentAverageMonthlySpend : item.currentCost)));
  if (api) {
    p.set("model", item.primaryModel.replace(/_/g, " "));
    p.set("usecase", item.primaryUseCase);
    if (item.currentModelScore !== null) {
      p.set("cscore", String(item.currentModelScore));
      p.set("stype", item.scoreType);
      p.set("sunit", item.scoreUnit);
      p.set("hib", item.higherIsBetter ? "1" : "0");
    }
  }
  if (item.bestRecommendation) {
    const rec = item.bestRecommendation;
    p.set(
      "rec",
      api
        ? (rec as ApiRecommendation).modelDisplayName
        : `${(rec as SubscriptionRecommendation).toolName} ${(rec as SubscriptionRecommendation).planName}`,
    );
    p.set("savings", String(Math.round(rec.savings)));
    p.set("pct", String(Math.round(rec.savingsPercent)));
    if (api && item.currentModelScore !== null) {
      p.set("rscore", String((rec as ApiRecommendation).score));
    }
  }
  return p;
}

function buildShareTitle(item: AuditResultItem): string {
  const tool = (isApiResult(item) ? item.toolName : item.tool).replace(/_/g, " ");
  if (item.status === "optimal") return `${tool} is already cost-optimal`;
  const savings = item.bestRecommendation?.savings ?? 0;
  return `Save ${formatCurrency(savings)}/mo on ${tool}`;
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ item }: { item: AuditResultItem }) {
  const [showOthers, setShowOthers] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const api = isApiResult(item);

  const [selectedRec, setSelectedRec] = useState<ApiRecommendation | null>(
    api ? (item.bestRecommendation ?? null) : null,
  );

  const toolLabel = api ? item.toolName : item.tool;
  const currentSpend = api ? item.currentAverageMonthlySpend : item.currentCost;
  const subtitle = api
    ? `${item.primaryModel} · ${item.primaryUseCase}`
    : `${item.currentPlan}`;

  return (
    <>
      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold capitalize">{toolLabel.replace(/_/g, " ")}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {subtitle.replace(/_/g, " ")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                title="Share this result"
              >
                <Share2 className="size-4" />
              </button>
              <StatusBadge status={item.status} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
            <span className="text-xs text-muted-foreground">Current monthly spend</span>
            <span className="text-sm font-medium">{formatCurrency(currentSpend)}</span>
          </div>

          {api && selectedRec && (
            <BenchmarkChart item={item} comparedRec={selectedRec} />
          )}

          {api && item.summary && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {renderWithLinks(item.summary)}
            </p>
          )}

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

          {item.status === "optimal" && (
            <p className="text-xs text-muted-foreground">
              You&apos;re spending well here. No cheaper alternative matches your current requirements.
            </p>
          )}
        </CardContent>
      </Card>
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        ogParams={buildOgParams(item)}
        title={buildShareTitle(item)}
      />
    </>
  );
}

// ─── CTAs ─────────────────────────────────────────────────────────────────────

function HighSavingsCTA({ totalSavings, result }: { totalSavings: number; result: AuditResult }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-950/50 dark:to-teal-950/40 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-200">
            {formatCurrency(totalSavings)}/mo in savings identified
          </p>
          <p className="mt-0.5 text-sm text-emerald-700/80 dark:text-emerald-400/80">
            Leave your email and a Credex advisor will follow up with a tailored migration plan — at no cost to you.
          </p>
        </div>
      </div>
      <LeadCaptureForm
        tier="high"
        totalSavings={totalSavings}
        auditResult={result}
        submitLabel="Get personalized plan"
      />
      <p className="text-center text-[10px] text-emerald-600/60 dark:text-emerald-500/60">
        Or{" "}
        <a href="/consult" className="underline underline-offset-2 hover:text-emerald-700 transition-colors">
          book a call directly
        </a>{" "}
        · Free · 30 min · No commitment
      </p>
    </div>
  );
}

function MidSavingsCTA({ totalSavings, result }: { totalSavings: number; result: AuditResult }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
      <div>
        <p className="font-semibold">
          {formatCurrency(totalSavings)}/mo in savings identified
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Get the full audit report with step-by-step migration guides sent to your inbox.
        </p>
      </div>
      <LeadCaptureForm
        tier="mid"
        totalSavings={totalSavings}
        auditResult={result}
        submitLabel="Send report"
      />
    </div>
  );
}

function LowSavingsCTA({ result }: { result: AuditResult }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Bell className="size-4 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-sm">You&apos;re spending well.</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            AI prices shift fast. We&apos;ll notify you when a better option matches your stack.
          </p>
        </div>
      </div>
      <LeadCaptureForm
        tier="low"
        totalSavings={0}
        auditResult={result}
        submitLabel="Notify me"
      />
    </div>
  );
}

// ─── Savings hero ─────────────────────────────────────────────────────────────

function SavingsHero({ totalSavings }: { totalSavings: number }) {
  if (totalSavings <= 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 px-6 py-8 text-center space-y-1">
        <div className="flex justify-center mb-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <CheckCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <p className="text-xl font-semibold tracking-tight">You&apos;re spending well.</p>
        <p className="text-sm text-muted-foreground">
          Every tool in your stack is already cost-optimal for your usage.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-background dark:border-emerald-800 dark:from-emerald-950/60 dark:via-teal-950/30 dark:to-background px-6 py-8">
      <p className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
        Savings identified
      </p>
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <div>
          <p className="text-4xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
            {formatCurrency(totalSavings)}
            <span className="text-lg font-medium text-emerald-600/70 dark:text-emerald-400/70 ml-1">/mo</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Monthly savings</p>
        </div>
        <div className="sm:border-l sm:border-emerald-200 sm:dark:border-emerald-800 sm:pl-6">
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {formatCurrency(totalSavings * 12)}
            <span className="text-base font-medium text-muted-foreground ml-1">/yr</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">Annual savings</p>
        </div>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function AuditResults({ result }: { result: AuditResult }) {
  console.log("result", result);
  const totalSavings = result.tools.reduce(
    (sum, item) => sum + (item.bestRecommendation?.savings ?? 0),
    0,
  );

  return (
    <div className="space-y-4 pt-2">
      <h2>Audit Results</h2>

      <SavingsHero totalSavings={totalSavings} />
      <h2 className="text-sm font-medium text-muted-foreground tracking-wide pt-2">
        Per-tool breakdown
      </h2>
      {result.tools.map((item, i) => (
        <ResultCard key={i} item={item} />
      ))}
      {totalSavings > 500 ? (
        <HighSavingsCTA totalSavings={totalSavings} result={result} />
      ) : totalSavings >= 100 ? (
        <MidSavingsCTA totalSavings={totalSavings} result={result} />
      ) : (
        <LowSavingsCTA result={result} />
      )}
    </div>
  );
}
