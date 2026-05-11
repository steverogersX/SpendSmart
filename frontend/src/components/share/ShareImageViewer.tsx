"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ShareImageViewer({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 ring-1 ring-inset ring-white/5">
      {/* Skeleton shimmer while loading */}
      <div
        className={cn(
          "absolute inset-0 z-10 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-shimmer bg-[length:400%_100%] transition-opacity duration-500",
          loaded ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        aria-hidden
      />
      {/* Skeleton base */}
      {!loaded && (
        <div className="w-full aspect-[1200/630] bg-white/5 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 opacity-40">
            <div className="size-10 rounded-full border-2 border-emerald-400/60 border-t-transparent animate-spin" />
            <p className="text-xs text-white/60 font-medium">Loading preview…</p>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        className={cn(
          "w-full h-auto transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0 absolute inset-0",
        )}
        onLoad={() => setLoaded(true)}
        unoptimized
        priority
      />
    </div>
  );
}
