"use client";

import { useEffect, useRef, useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  ogParams: URLSearchParams;
  title: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452H17.21v-5.569c0-1.327-.024-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.982V9h3.104v1.561h.044c.432-.82 1.49-1.684 3.066-1.684 3.279 0 3.883 2.157 3.883 4.965v6.61zM5.337 7.433a1.8 1.8 0 1 1 0-3.601 1.8 1.8 0 0 1 0 3.601zm1.554 13.019H3.782V9h3.109v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareModal({ open, onClose, ogParams, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus the close button when opened
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${origin}/share?${ogParams.toString()}`;
  const ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;

  const tweetText = encodeURIComponent(`${title}\n\nAudited with SpendSmart →`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl"
        role="dialog"
        aria-modal
        aria-label="Share audit result"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <p className="font-semibold text-sm">Share audit result</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* OG image preview */}
        <div className="px-5">
          <div className="rounded-xl overflow-hidden border border-border shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogImageUrl}
              alt="Preview"
              className="w-full"
              style={{ aspectRatio: "1200/630", display: "block" }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="px-5 pt-3 pb-1">
          <p className="text-xs text-muted-foreground truncate" title={title}>
            {title}
          </p>
        </div>

        {/* Copy link row */}
        <div className="px-5 pt-2">
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
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Social share buttons */}
        <div className="flex gap-3 px-5 pt-3 pb-5">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 py-2.5 text-sm font-medium transition-colors"
          >
            <XIcon className="size-4" />
            Post on X
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 py-2.5 text-sm font-medium transition-colors"
          >
            <LinkedInIcon className="size-4" />
            Share on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
