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

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: "#f0fdf8",
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
          background:
            "linear-gradient(145deg, #f0fdf8 0%, #ecfdf5 40%, #f8fafc 100%)",
          padding: "52px 64px 48px",
        }}
      >
        {/* Background decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: 9999,
            background: "rgba(16,185,129,0.10)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: "rgba(16,185,129,0.07)",
            filter: "blur(80px)",
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)",
          }}
        />

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 48,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 26,
              fontWeight: 800,
              color: "#10b981",
              lineHeight: 1,
            }}
          >
            $
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#111827",
              lineHeight: 1,
            }}
          >
            Spend
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#10b981",
              lineHeight: 1,
            }}
          >
            Smart
          </span>

          <div
            style={{
              marginLeft: 14,
              padding: "4px 12px",
              borderRadius: 9999,
              background: "rgba(16,185,129,0.10)",
              border: "1px solid rgba(16,185,129,0.18)",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#059669",
              }}
            >
              AI Spend Audit
            </span>
          </div>
        </div>

        {/* Content */}
        {isOptimal ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              zIndex: 2,
            }}
          >
            {/* Check badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 9999,
                  background: "rgba(16,185,129,0.12)",
                  border: "2px solid rgba(16,185,129,0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>

            <span
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-3.5px",
                color: "#111827",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              Already optimized.
            </span>

            <span
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: "#6b7280",
                lineHeight: 1.4,
              }}
            >
              Every tool in the stack is on the best plan for current usage.
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
            <span
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: "#6b7280",
                marginBottom: 12,
                letterSpacing: "-0.2px",
              }}
            >
              Found potential savings of
            </span>

            {/* Savings hero */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontSize: 124,
                  fontWeight: 800,
                  letterSpacing: "-7px",
                  color: "#047857",
                  lineHeight: 0.92,
                }}
              >
                {fmt(savings)}
              </span>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 600,
                  color: "rgba(4,120,87,0.45)",
                  letterSpacing: "-1px",
                }}
              >
                /mo
              </span>
            </div>

            <span
              style={{
                fontSize: 24,
                color: "#9ca3af",
                fontWeight: 400,
                letterSpacing: "-0.2px",
              }}
            >
              {fmt(savings * 12)} saved annually · audited by SpendSmart
            </span>
          </div>
        )}

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            paddingTop: 28,
            borderTop: "1px solid rgba(16,185,129,0.12)",
            zIndex: 2,
          }}
        >
          {/* Tools audited */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-1px", lineHeight: 1 }}>
                {toolCount}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.2px" }}>
                Tools audited
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 44,
              background: "rgba(0,0,0,0.07)",
              marginRight: 48,
            }}
          />

          {/* Can optimize */}
          {!isOptimal && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(245,158,11,0.10)",
                    border: "1px solid rgba(245,158,11,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-1px", lineHeight: 1 }}>
                    {optimizableCount}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.2px" }}>
                    Can be optimized
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  height: 44,
                  background: "rgba(0,0,0,0.07)",
                  marginRight: 48,
                }}
              />
            </>
          )}

          {/* Annual savings (or optimal stat) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: isOptimal ? "rgba(16,185,129,0.10)" : "rgba(16,185,129,0.10)",
                border: "1px solid rgba(16,185,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isOptimal ? (
                  <>
                    <polyline points="22 7 13.5 15.5 8.5 10.5 1 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </>
                )}
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-1px", lineHeight: 1 }}>
                {isOptimal ? "0 wasted" : fmt(savings * 12)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.2px" }}>
                {isOptimal ? "Zero overspend" : "Potential annual savings"}
              </span>
            </div>
          </div>

          {/* spendsmart.app watermark */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#d1d5db",
                letterSpacing: "0.2px",
              }}
            >
              spendsmart.app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
