import { ImageResponse } from "next/og";
import { BRAND_GRADIENT, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0b12",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            left: 260,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND_GRADIENT.to}59, transparent 70%)`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${BRAND_GRADIENT.from}, ${BRAND_GRADIENT.to})`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#ffffff", fontSize: 30, fontWeight: 800 }}>CC</span>
          </div>
          <span style={{ color: "#ffffff", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            {SITE_NAME}
          </span>
        </div>

        <div
          style={{
            marginTop: 40,
            color: "#ffffff",
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          Free Subtitle Tools for Creators &amp; Editors
        </div>

        <div
          style={{
            marginTop: 24,
            color: "#c7c7d6",
            fontSize: 28,
            maxWidth: 860,
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
