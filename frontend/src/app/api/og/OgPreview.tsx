import { NextRequest } from "next/server";

export const OgPreview = ({
  req,
}: {
  req: NextRequest;
}): React.ReactElement => {
  const p = req.nextUrl.searchParams;

  const savings = Number(p.get("savings") ?? 0);
  const toolCount = Number(p.get("toolCount") ?? 0);
  const optimizableCount = Number(p.get("optimizableCount") ?? 0);
  const isOptimal = savings <= 0;

  const fmt = (n: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        padding: 32,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          borderRadius: 32,
          border: "1px solid rgba(16,185,129,0.12)",
          background:
            "linear-gradient(135deg, #ecfdf5 0%, rgba(240,253,250,0.7) 35%, #ffffff 100%)",
          padding: "48px 56px",
        }}
      >
        {/* subtle glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: "rgba(16,185,129,0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 42,
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* $ — font-mono bold emerald, matching Navbar */}
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 28,
                fontWeight: 800,
                color: "#10b981",
                lineHeight: 1,
              }}
            >
              $
            </span>
            {/* Spend + Smart — matching Navbar text style */}
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.5px",
                color: "#111827",
                lineHeight: 1,
              }}
            >
              Spend
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: "-0.5px",
                color: "#10b981",
                lineHeight: 1,
              }}
            >
              Smart
            </span>
          </div>
        </div>

        {isOptimal ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 82,
                height: 82,
                borderRadius: 9999,
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <span
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: "-3px",
                color: "#111827",
                lineHeight: 1,
              }}
            >
              You&apos;re spending well.
            </span>

            <span
              style={{
                marginTop: 14,
                fontSize: 28,
                color: "#6b7280",
                lineHeight: 1.4,
              }}
            >
              Every tool in your stack is already cost-optimal.
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              zIndex: 2,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid rgba(16,185,129,0.16)",
                background: "rgba(16,185,129,0.08)",
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#047857",
                }}
              >
                Total Savings Found
              </span>
            </div>

            {/* Main amount */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 118,
                  fontWeight: 800,
                  letterSpacing: "-7px",
                  color: "#047857",
                  lineHeight: 0.95,
                }}
              >
                {fmt(savings)}
              </span>

              <span
                style={{
                  fontSize: 42,
                  fontWeight: 600,
                  color: "rgba(4,120,87,0.55)",
                }}
              >
                /mo
              </span>
            </div>

            <span
              style={{
                marginTop: 12,
                fontSize: 30,
                color: "#6b7280",
              }}
            >
              in monthly savings identified
            </span>
          </div>
        )}

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 56,
            marginTop: "auto",
            paddingTop: 34,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            zIndex: 2,
          }}
        >
          {/* Annual */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "rgba(16,185,129,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {fmt(savings * 12)}
                <span
                  style={{
                    fontSize: 16,
                    color: "#6b7280",
                    marginLeft: 4,
                  }}
                >
                  /yr
                </span>
              </span>

              <span
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Annual savings
              </span>
            </div>
          </div>

          {/* Tools audited */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "rgba(15,23,42,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {toolCount}
              </span>

              <span
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Tools audited
              </span>
            </div>
          </div>

          {/* Can optimize */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 9999,
                background: "rgba(245,158,11,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {optimizableCount}
              </span>

              <span
                style={{
                  marginTop: 2,
                  fontSize: 13,
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                Can optimize
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};