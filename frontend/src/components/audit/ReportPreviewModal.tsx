"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download, Copy, Check, FileText, Loader2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { AuditResult } from "@shared/types/auditResult";
import { exportPdf } from "@/lib/api";

interface ReportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  result: AuditResult;
  totalSavings: number;
  shareUrl: string;
}

const INCLUDES = [
  "Executive summary & AI-generated analysis",
  "Cost analysis with I/O token breakdown",
  "Per-tool recommendations & benchmarks",
  "Alternative options for each tool",
];

export function ReportPreviewModal({
  open,
  onClose,
  result,
  totalSavings,
  shareUrl,
}: ReportPreviewModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const toolCount = result.tools.length;
  const optimizableCount = result.tools.filter((t) => t.status === "optimize").length;

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const blob = await exportPdf(result, {
        date: new Date().toISOString(),
        shareUrl,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "spendsmart-audit.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl"
        role="dialog"
        aria-modal
        aria-label="Export audit report"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <p className="font-semibold text-sm">Export Audit Report</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Report summary card */}
        <div className="px-5 pt-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI Cost Audit Report</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-0 divide-y divide-border/60">
              {totalSavings > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-xs text-muted-foreground">Monthly savings found</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalSavings)} / mo
                  </span>
                </div>
              )}
              {totalSavings > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-xs text-muted-foreground">Annualized</span>
                  <span className="text-xs font-semibold text-foreground">
                    {formatCurrency(totalSavings * 12)} / yr
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-xs text-muted-foreground">Tools audited</span>
                <span className="text-xs font-semibold text-foreground">{toolCount}</span>
              </div>
              {optimizableCount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-xs text-muted-foreground">Tools to optimize</span>
                  <span className="text-xs font-semibold text-foreground">{optimizableCount}</span>
                </div>
              )}
              {optimizableCount === 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    All optimal
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="px-5 pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2.5">What&apos;s included</p>
          <ul className="space-y-1.5">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-foreground/80">
                <Check className="size-3 text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Copy link */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <span className="flex-1 truncate text-xs text-muted-foreground font-mono">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className={cn(
                "shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                copied
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pt-3 pb-5 space-y-2">
          {downloadError && (
            <p className="text-xs text-destructive text-center">{downloadError}</p>
          )}
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {downloading ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
