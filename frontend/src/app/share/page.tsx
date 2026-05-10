import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

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
  const params = new URLSearchParams(sp);

  const isOptimal = status === "optimal";
  const ogImageUrl = `/api/og?${params.toString()}`;

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* OG image preview */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImageUrl}
            alt="Audit result"
            className="w-full"
            style={{ aspectRatio: "1200/630" }}
          />
        </div>

        {/* Summary */}
        <div className="text-center space-y-3">
          {isOptimal ? (
            <>
              <p className="text-2xl font-bold tracking-tight">
                {tool} is already optimal
              </p>
              <p className="text-muted-foreground text-sm">
                No cheaper alternative meets your quality requirements.
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold tracking-tight">
                Save ${savings}/mo on {tool}
              </p>
              <p className="text-muted-foreground text-sm">
                That&apos;s a {pct}% cost reduction — discovered by SpendSmart.
              </p>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            Audit your AI spend →
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          SpendSmart · AI cost optimizer powered by real benchmark data
        </p>
      </div>
    </main>
  );
}
