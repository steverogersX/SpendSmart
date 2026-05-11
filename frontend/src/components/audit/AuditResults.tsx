"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  ChevronDown,
  TrendingDown,
  CheckCircle,
  ExternalLink,
  Share2,
  Sparkles,
  Bell,
  TrendingUp,
} from "lucide-react";
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

// ─── Animated number ──────────────────────────────────────────────────────────

function AnimatedCurrency({ value, className }: { value: number; className?: string }) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => formatCurrency(Math.round(v)));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value]);

  return <motion.span className={className}>{display}</motion.span>;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

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

function buildSummaryOgParams(result: AuditResult, totalSavings: number): URLSearchParams {
  const totalSpend = result.tools.reduce(
    (s, t) => s + (isApiResult(t) ? t.currentAverageMonthlySpend : t.currentCost),
    0,
  );
  const optimizable = result.tools.filter((t) => t.status === "optimize").length;
  const p = new URLSearchParams();
  p.set("status", totalSavings > 0 ? "optimize" : "optimal");
  p.set("tool", `${result.tools.length} AI tool${result.tools.length !== 1 ? "s" : ""} audited`);
  p.set("spend", String(Math.round(totalSpend)));
  if (totalSavings > 0) {
    p.set("savings", String(Math.round(totalSavings)));
    const pct = totalSpend > 0 ? Math.round((totalSavings / totalSpend) * 100) : 0;
    p.set("pct", String(pct));
    p.set("rec", `${optimizable} tool${optimizable !== 1 ? "s" : ""} to optimize`);
  }
  return p;
}

function buildSummaryShareTitle(totalSavings: number, toolCount: number): string {
  if (totalSavings <= 0) return `${toolCount} AI tool${toolCount !== 1 ? "s" : ""} — already cost-optimal`;
  return `Save ${formatCurrency(totalSavings)}/mo across ${toolCount} AI tool${toolCount !== 1 ? "s" : ""}`;
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ item, index }: { item: AuditResultItem; index: number }) {
  const [showOthers, setShowOthers] = useState(false);
  const api = isApiResult(item);

  const [selectedRec, setSelectedRec] = useState<ApiRecommendation | null>(
    api ? (item.bestRecommendation ?? null) : null,
  );

  const toolLabel = api ? item.toolName : item.tool;
  const currentSpend = api ? item.currentAverageMonthlySpend : item.currentCost;
  const subtitle = api ? `${item.primaryModel} · ${item.primaryUseCase}` : `${item.currentPlan}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="overflow-hidden">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold capitalize">{toolLabel.replace(/_/g, " ")}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {subtitle.replace(/_/g, " ")}
              </p>
            </div>
            <StatusBadge status={item.status} />
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
              onKeyDown={
                api
                  ? (e) =>
                      e.key === "Enter" &&
                      setSelectedRec(item.bestRecommendation as ApiRecommendation)
                  : undefined
              }
              className={cn(
                "rounded-lg border p-3",
                api && "cursor-pointer transition-colors",
                api && selectedRec === item.bestRecommendation
                  ? "border-emerald-400 bg-emerald-50/70 dark:border-emerald-700 dark:bg-emerald-900/20"
                  : "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10",
                api &&
                  selectedRec !== item.bestRecommendation &&
                  "hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/15",
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
                        <div
                          key={i}
                          className="rounded-lg border border-border bg-muted/20 px-3 py-2.5"
                        >
                          <SubRecommendationRow rec={rec} />
                        </div>
                      ))}
                </div>
              )}
            </div>
          )}

          {item.status === "optimal" && (
            <p className="text-xs text-muted-foreground">
              You&apos;re spending well here. No cheaper alternative matches your current
              requirements.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
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
            Leave your email and a Credex advisor will follow up with a tailored migration plan —
            at no cost to you.
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
        <a
          href="/consult"
          className="underline underline-offset-2 hover:text-emerald-700 transition-colors"
        >
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
        <p className="font-semibold">{formatCurrency(totalSavings)}/mo in savings identified</p>
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

function SavingsHero({
  totalSavings,
  result,
  onShare,
}: {
  totalSavings: number;
  result: AuditResult;
  onShare: () => void;
}) {
  const toolCount = result.tools.length;
  const optimizableCount = result.tools.filter((t) => t.status === "optimize").length;
  const optimalCount = toolCount - optimizableCount;

  if (totalSavings <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-background dark:border-emerald-800/50 dark:from-emerald-950/50 dark:via-teal-950/20 dark:to-background px-6 py-8"
      >
        {/* Share button */}
        <button
          type="button"
          onClick={onShare}
          className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors shadow-sm"
        >
          <Share2 className="size-3.5" />
          Share
        </button>

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">You&apos;re spending well.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Every tool in your stack is already cost-optimal.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{toolCount}</p>
              <p className="text-xs text-muted-foreground">tools audited</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{optimalCount}</p>
              <p className="text-xs text-muted-foreground">optimal</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-background dark:border-emerald-800/60 dark:from-emerald-950/70 dark:via-teal-950/30 dark:to-background px-6 py-8"
    >
      {/* Subtle glow orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-3xl"
      />

      {/* Share button */}
      <button
        type="button"
        onClick={onShare}
        className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg border border-border bg-background/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors shadow-sm z-10"
      >
        <Share2 className="size-3.5" />
        Share
      </button>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/60 bg-emerald-100/80 dark:border-emerald-700/60 dark:bg-emerald-900/40 px-3 py-1 mb-5"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          Total Savings Found
        </span>
      </motion.div>

      {/* Main savings number */}
      <div className="space-y-1 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-baseline gap-1.5"
        >
          <AnimatedCurrency
            value={totalSavings}
            className="text-5xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300"
          />
          <span className="text-xl font-medium text-emerald-600/70 dark:text-emerald-400/70">/mo</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          in monthly savings identified
        </motion.p>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        className="flex flex-wrap gap-x-6 gap-y-3"
      >
        {/* Annual savings */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <AnimatedCurrency
              value={totalSavings * 12}
              className="text-base font-semibold text-foreground"
            />
            <span className="text-xs text-muted-foreground ml-1">/yr</span>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Annual savings</p>
          </div>
        </div>

        <div className="w-px bg-border/60 self-stretch hidden sm:block" />

        {/* Tools audited */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-muted">
            <span className="text-xs font-bold text-muted-foreground">{toolCount}</span>
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{toolCount}</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Tools audited</p>
          </div>
        </div>

        <div className="w-px bg-border/60 self-stretch hidden sm:block" />

        {/* Optimizable */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <TrendingDown className="size-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{optimizableCount}</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Can optimize</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function AuditResults({ result }: { result: AuditResult }) {
  const [shareOpen, setShareOpen] = useState(false);

  const totalSavings = result.tools.reduce(
    (sum, item) => sum + (item.bestRecommendation?.savings ?? 0),
    0,
  );

  return (
    <div className="space-y-4 pt-2">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-lg font-semibold tracking-tight"
      >
        Audit Results
      </motion.h2>

      <SavingsHero totalSavings={totalSavings} result={result} onShare={() => setShareOpen(true)} />

      {result.aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border bg-muted/20 px-4 py-3.5"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="size-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI Summary
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {renderWithLinks(result.aiSummary)}
          </p>
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-sm font-medium text-muted-foreground tracking-wide pt-2"
      >
        Per-tool breakdown
      </motion.h3>

      {result.tools.map((item, i) => (
        <ResultCard key={i} item={item} index={i} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + result.tools.length * 0.07, duration: 0.4 }}
      >
        {totalSavings > 500 ? (
          <HighSavingsCTA totalSavings={totalSavings} result={result} />
        ) : totalSavings >= 100 ? (
          <MidSavingsCTA totalSavings={totalSavings} result={result} />
        ) : (
          <LowSavingsCTA result={result} />
        )}
      </motion.div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        ogParams={buildSummaryOgParams(result, totalSavings)}
        title={buildSummaryShareTitle(totalSavings, result.tools.length)}
      />
   
    </div>
  );
}
