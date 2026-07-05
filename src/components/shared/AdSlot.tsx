"use client";

import { useEffect } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";
import { ADSENSE_CLIENT_ID } from "@/lib/site-config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** Human-readable slot identifier, used as the AdSense ad-slot ID unless `adSlotId` is set. */
  slot?: string;
  /** Specific AdSense ad unit ID, if you've created one in the AdSense dashboard. */
  adSlotId?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

/**
 * Renders a real Google AdSense unit once `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is
 * configured. Until then it renders nothing at all — no placeholder box, no
 * scripts, no console errors — so pages stay clean while ads aren't set up.
 */
export function AdSlot({ slot = "placeholder", adSlotId, format = "auto", className }: AdSlotProps) {
  useEffect(() => {
    if (!ADSENSE_CLIENT_ID) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Safe to ignore — can happen if this effect runs before the AdSense
      // loader script below has finished loading.
    }
  }, []);

  if (!ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="adsbygoogle-loader"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      />
      <ins
        className={cn("adsbygoogle block", className)}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlotId ?? slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </>
  );
}
