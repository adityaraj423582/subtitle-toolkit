import { ImageResponse } from "next/og";
import { BRAND_GRADIENT } from "@/lib/site-config";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${BRAND_GRADIENT.from} 0%, ${BRAND_GRADIENT.to} 100%)`,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
            fontFamily: "sans-serif",
          }}
        >
          CC
        </span>
      </div>
    ),
    { ...size },
  );
}
