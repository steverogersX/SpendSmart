import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { CheckCircle, TrendingDown, ArrowRight, Sparkles } from "lucide-react";
import { ShareImageViewer } from "@/components/share/ShareImageViewer";

type Props = {
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const status = sp.status ?? "optimize";
  const tool = sp.tool ?? "AI Tool";
  const savings = sp.savings;
  const pct = sp.pct;

  const ogTitle =
    status === "optimal"
      ? `${tool} is already cost-optimal`
      : `Save $${savings}/mo on ${tool} — ${pct}% reduction`;

  const description =
    status === "optimal"
      ? `${tool} is already the most cost-effective option for your workload. Audited by SpendSmart.`
      : `SpendSmart found a ${pct}% cost reduction on ${tool} API usage — saving $${savings}/month with no quality loss.`;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3001";
  const proto = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${proto}://${host}`;

  const params = new URLSearchParams(sp);
  const ogImageUrl = `${baseUrl}/api/og?${params.toString()}`;

  return {
    title: `${ogTitle} · SpendSmart`,
    description,
    openGraph: {
      title: ogTitle,
      description,
      siteName: "SpendSmart",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

function AppLogo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-1">
      <span className="font-mono text-2xl font-bold text-emerald-500 transition-colors group-hover:text-emerald-400">
        $
      </span>
      <span className="text-[20px] font-semibold tracking-tight text-foreground">
        Spend
        <span className="text-emerald-500 transition-colors group-hover:text-emerald-400">
          Smart
        </span>
      </span>
    </Link>
  );
}

export default async function SharePage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status ?? "optimize";
  const tool = sp.tool ?? "AI Tool";
  const savings = sp.savings;
  const pct = sp.pct;
  const params = new URLSearchParams(sp);

  const isOptimal = status === "optimal";
  const ogImageUrl = `/api/og?${params.toString()}`;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto px-6 pt-10 pb-16 flex-1">
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-background dark:from-emerald-950/70 dark:via-teal-950/30 dark:to-background px-6 py-8 w-full">
          {/* Glow orb inside card */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-3xl"
          />

          {/* Logo */}
          <div className="mb-6">
            <AppLogo />
          </div>

        

     

          {/* OG image preview */}
          <div className="w-full mb-6">
            <ShareImageViewer
              src={ogImageUrl}
              alt={isOptimal ? `${tool} is cost-optimal` : `Save $${savings}/mo on ${tool}`}
            />
          </div>

      

        
        </div>

     
      </div>
    </main>
  );
}
