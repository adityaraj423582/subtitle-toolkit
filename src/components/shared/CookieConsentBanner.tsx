"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "subtitletoolkit-cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== "accepted") {
        setVisible(true);
      }
    } catch {
      // localStorage can throw in some privacy modes — fail open and just
      // skip showing the banner rather than breaking the page.
    }
  }, []);

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Ignore write failures (e.g. storage disabled); the banner will just
      // reappear next visit, which is an acceptable fallback.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:px-6">
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-start gap-3 rounded-xl border border-border bg-popover/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Cookie className="size-4.5" />
        </span>
        <p className="flex-1 text-sm text-popover-foreground">
          We use cookies for basic analytics and to show relevant ads. Your
          subtitle files are never affected — they&apos;re never uploaded
          anywhere. See our{" "}
          <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <Button onClick={handleAccept} className="w-full shrink-0 sm:w-auto">
          Accept
        </Button>
      </div>
    </div>
  );
}
