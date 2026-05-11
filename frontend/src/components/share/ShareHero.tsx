"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// Richer card shell for standalone page — starts at emerald-100 instead of
// emerald-50 so the gradient reads on a white background (not washed out).
const CARD_BASE =
  "relative overflow-hidden rounded-2xl w-full " +
  "border border-emerald-300/70 dark:border-emerald-700/60 " +
  "bg-gradient-to-br from-emerald-100 via-teal-50/80 to-white " +
  "dark:from-emerald-950/90 dark:via-teal-950/50 dark:to-background " +
  "shadow-xl shadow-emerald-200/60 dark:shadow-emerald-950/40 " +
  "px-6 py-8";

export function ShareHero({
  isOptimal,
  tool,
  savings,
  pct,
}: {
  isOptimal: boolean;
  tool: string;
  savings?: string;
  pct?: string;
}) {
  const savingsNum = Number(savings ?? 0);
  const annualSavings = savingsNum * 12;
  const pctNum = Number(pct ?? 0);

  if (isOptimal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={CARD_BASE}
      >
        <GlowOrbs />
        <DottedFade />

        <div className="text-center space-y-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-200/80 dark:bg-emerald-900/60">
              <CheckCircle className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <p className="text-2xl font-bold tracking-tight">You&apos;re spending well.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Every tool in your stack is already cost-optimal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex justify-center gap-4 pt-2"
          >
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{tool}</p>
              <p className="text-xs text-muted-foreground">tool audited</p>
            </div>
            <div className="w-px bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">optimal</p>
              <p className="text-xs text-muted-foreground">cost efficiency</p>
            </div>
          </motion.div>
        </div>

        <Branding />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={CARD_BASE}
    >
      <GlowOrbs />
      <DottedFade />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-100 dark:border-emerald-600/50 dark:bg-emerald-900/60 px-3 py-1 mb-5"
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
          <span className="text-5xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
            {formatCurrency(savingsNum)}
          </span>
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
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-200/80 dark:bg-emerald-900/60">
            <TrendingUp className="size-3.5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">
              {formatCurrency(annualSavings)}
              <span className="text-xs text-muted-foreground ml-1">/yr</span>
            </p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Annual savings</p>
          </div>
        </div>

        <div className="w-px bg-emerald-200/80 dark:bg-emerald-800/60 self-stretch hidden sm:block" />

        {/* Cost reduction */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
            <TrendingDown className="size-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{pctNum}%</p>
            <p className="text-[11px] text-muted-foreground leading-none mt-0.5">Cost reduction</p>
          </div>
        </div>
      </motion.div>

      <Branding />
    </motion.div>
  );
}

function GlowOrbs() {
  return (
    <>
      {/* Top-right orb — larger and stronger than SavingsHero for standalone contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-emerald-400/20 dark:bg-emerald-500/15 blur-3xl"
      />
      {/* Bottom-left fill orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-teal-300/15 dark:bg-teal-600/10 blur-3xl"
      />
    </>
  );
}

function DottedFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 [background-image:radial-gradient(circle,theme(colors.emerald.500/0.3)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
    />
  );
}

function Branding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="relative z-10 mt-8 pt-5 border-t border-emerald-300/40 dark:border-emerald-700/40 flex flex-col items-center gap-3"
    >
      <Link
        href="/"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 text-sm font-medium transition-colors shadow-md shadow-emerald-600/20"
      >
        Audit your AI stack
        <ArrowRight className="size-4" />
      </Link>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Audited by</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-sm font-bold text-emerald-500">$</span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Spend<span className="text-emerald-500">Smart</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
