import type { Metadata } from "next";
import { headers } from "next/headers";
import { ShareHero } from "@/components/share/ShareHero";

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

export default async function SharePage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status ?? "optimize";
  const tool = sp.tool ?? "AI Tool";
  const savings = sp.savings;
  const pct = sp.pct;

  const isOptimal = status === "optimal";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto px-6 pt-10 pb-16 flex-1">
        <ShareHero
          isOptimal={isOptimal}
          tool={tool}
          savings={savings}
          pct={pct}
        />
      </div>
    </main>
  );
}
