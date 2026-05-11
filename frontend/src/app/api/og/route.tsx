import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgPreview } from "./OgPreview";

const W = 1200;
const H = 630;

export async function GET(req: NextRequest) {
  try {
    return new ImageResponse(<OgPreview req={req} />, { width: W, height: H });
  } catch (err) {
    console.error("[og] ImageResponse failed:", err);
    return new Response(`OG image error: ${String(err)}`, { status: 500 });
  }
}
