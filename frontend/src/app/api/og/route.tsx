import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Edge runtime breaks on Windows dev; Node.js is more reliable for ImageResponse
export const runtime = "nodejs";

const W = 1200;
const H = 630;

function fmt(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
}

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export async function GET(req: NextRequest) {
  try {
  const p = req.nextUrl.searchParams;
  const status = p.get("status") ?? "optimize";
  const tool = p.get("tool") ?? "AI Tool";
  const spend = Number(p.get("spend") ?? 0);
  const savings = Number(p.get("savings") ?? 0);
  const pct = Number(p.get("pct") ?? 0);
  const model = p.get("model");
  const rec = p.get("rec");
  const usecase = p.get("usecase");

  const cscore = p.get("cscore") !== null ? Number(p.get("cscore")) : null;
  const rscore = p.get("rscore") !== null ? Number(p.get("rscore")) : null;
  const stype = (p.get("stype") ?? "absolute") as "absolute" | "relative";
  const sunit = p.get("sunit") ?? "percentage";
  const hib = p.get("hib") === "1";

  const isOptimal = status === "optimal";
  const hasBenchmark =
    !isOptimal &&
    cscore !== null &&
    rscore !== null &&
    !!model &&
    !!rec;

  // Compute bar widths (0–100%)
  let currentBarPct = 50;
  let recBarPct = 50;

  if (hasBenchmark && cscore !== null && rscore !== null) {
    if (stype === "absolute") {
      currentBarPct = Math.min(cscore, 100);
      recBarPct = Math.min(rscore, 100);
    } else {
      const min = Math.min(cscore, rscore);
      const max = Math.max(cscore, rscore);
      const range = max - min || 1;
      const pad = range * 0.1;
      const dMin = min - pad;
      const dMax = max + pad;
      const norm = (s: number) =>
        Math.min(98, Math.max(5, ((s - dMin) / (dMax - dMin)) * 100));
      currentBarPct = norm(cscore);
      recBarPct = norm(rscore);
    }
  }

  const fmtScore = (s: number) =>
    sunit === "percentage" ? `${s.toFixed(1)}%` : `${Math.round(s)} Elo`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(145deg, #05111f 0%, #08182e 60%, #040d18 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: isOptimal ? 100 : -60,
            right: isOptimal ? "auto" : 80,
            left: isOptimal ? "50%" : "auto",
            width: isOptimal ? 600 : 520,
            height: isOptimal ? 600 : 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.05) 50%, transparent 70%)",
            ...(isOptimal ? { transform: "translateX(-50%)" } : {}),
          }}
        />

        {/* ── Top bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "40px 56px 0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(16,185,129,0.4)",
              }}
            >
              <span style={{ color: "white", fontSize: 20, fontWeight: 800 }}>
                $
              </span>
            </div>
            <span
              style={{
                color: "white",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              SpendSmart
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 18px",
              borderRadius: 100,
              border: "1px solid rgba(16,185,129,0.35)",
              background: "rgba(16,185,129,0.08)",
            }}
          >
            <span style={{ color: "#10b981", fontSize: 13, fontWeight: 600 }}>
              AI Cost Audit
            </span>
          </div>
        </div>

        {/* ── Main content ── */}
        {isOptimal ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: 24,
              position: "relative",
              padding: "0 56px",
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.12)",
                border: "2px solid rgba(16,185,129,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(16,185,129,0.25)",
              }}
            >
              <span style={{ color: "#10b981", fontSize: 52, lineHeight: 1 }}>
                ✓
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: "-1.5px",
                  lineHeight: 1.1,
                }}
              >
                Already optimal
              </span>
              <span
                style={{ color: "#64748b", fontSize: 22, fontWeight: 400 }}
              >
                {tool} · {fmt(spend)}/mo — no cheaper alternative found
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flex: 1,
              padding: "32px 56px 24px",
              gap: 40,
              position: "relative",
            }}
          >
            {/* Left column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "center",
                gap: 22,
              }}
            >
              {/* Tool label + headline */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <span
                  style={{
                    color: "#64748b",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {tool}
                  {usecase ? ` · ${usecase}` : ""}
                </span>
                <span
                  style={{
                    color: "white",
                    fontSize: 46,
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: "-1.5px",
                  }}
                >
                  {`Cut AI costs\nby ${Math.round(pct)}%`}
                </span>
              </div>

              {hasBenchmark && cscore !== null && rscore !== null ? (
                /* ── Benchmark bar chart ── */
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <span
                    style={{
                      color: "#334155",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Benchmark comparison
                  </span>

                  {/* Current model row */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 160,
                        color: "#94a3b8",
                        fontSize: 14,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {trunc(model!, 20)}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 24,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 6,
                        overflow: "hidden",
                        display: "flex",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: `${currentBarPct}%`,
                          height: "100%",
                          background: "rgba(148,163,184,0.35)",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: 76,
                        color: "#64748b",
                        fontSize: 13,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {fmtScore(cscore)}
                    </span>
                  </div>

                  {/* Recommended model row */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 160,
                        color: "#e2e8f0",
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {trunc(rec!, 20)}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 24,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 6,
                        overflow: "hidden",
                        display: "flex",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <div
                        style={{
                          width: `${recBarPct}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #059669, #10b981)",
                          borderRadius: 6,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: 76,
                        color: "#10b981",
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {fmtScore(rscore)}
                    </span>
                  </div>

                  {/* Legend row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 20,
                      paddingLeft: 172,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 8,
                          borderRadius: 2,
                          background: "rgba(148,163,184,0.35)",
                        }}
                      />
                      <span style={{ color: "#94a3b8", fontSize: 11 }}>
                        Current
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 8,
                          borderRadius: 2,
                          background: "#10b981",
                        }}
                      />
                      <span style={{ color: "#94a3b8", fontSize: 11 }}>
                        Recommended
                      </span>
                    </div>
                    <span style={{ color: "#94a3b8", fontSize: 11 }}>
                      {hib ? "↑ Higher is better" : "↓ Lower is better"}
                    </span>
                  </div>
                </div>
              ) : (
                /* ── Model flow (subscription / no benchmark) ── */
                model &&
                rec && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "14px 20px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        minWidth: 160,
                      }}
                    >
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Current
                      </span>
                      <span
                        style={{
                          color: "#cbd5e1",
                          fontSize: 17,
                          fontWeight: 700,
                          marginTop: 5,
                        }}
                      >
                        {model}
                      </span>
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: 13,
                          marginTop: 3,
                        }}
                      >
                        {fmt(spend)}/mo
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 2,
                          background:
                            "linear-gradient(90deg, rgba(100,116,139,0.2), #10b981)",
                          borderRadius: 2,
                        }}
                      />
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: 20,
                          marginTop: -2,
                        }}
                      >
                        ›
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "14px 20px",
                        borderRadius: 14,
                        background: "rgba(16,185,129,0.07)",
                        border: "1px solid rgba(16,185,129,0.28)",
                        minWidth: 160,
                      }}
                    >
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Recommended
                      </span>
                      <span
                        style={{
                          color: "#e2e8f0",
                          fontSize: 17,
                          fontWeight: 700,
                          marginTop: 5,
                        }}
                      >
                        {rec}
                      </span>
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: 13,
                          marginTop: 3,
                        }}
                      >
                        {fmt(spend - savings)}/mo
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Right column — savings hero */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 268,
                gap: 6,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 240,
                  height: 240,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(16,185,129,0.22) 0%, transparent 65%)",
                }}
              />
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  position: "relative",
                }}
              >
                Save up to
              </span>
              <span
                style={{
                  color: "#10b981",
                  fontSize: 84,
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: "-3px",
                  position: "relative",
                }}
              >
                {fmt(savings)}
              </span>
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: 17,
                  position: "relative",
                  marginTop: 2,
                }}
              >
                per month
              </span>
              <div
                style={{
                  display: "flex",
                  padding: "7px 18px",
                  borderRadius: 100,
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.35)",
                  marginTop: 12,
                  position: "relative",
                }}
              >
                <span
                  style={{ color: "#10b981", fontSize: 15, fontWeight: 800 }}
                >
                  {Math.round(pct)}% reduction
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 56px 36px",
            position: "relative",
          }}
        >
          <span style={{ color: "#94a3b8", fontSize: 13 }}>
            spendsmart.app
          </span>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>
            Powered by real benchmark data
          </span>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
  } catch (err) {
    console.error("[og] ImageResponse failed:", err);
    return new Response(`OG image error: ${String(err)}`, { status: 500 });
  }
}
