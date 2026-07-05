import type { Metadata } from "next";

export const SITE_NAME = "SubtitleToolkit";

/**
 * Resolves the canonical site URL with a single, predictable fallback chain:
 *
 * 1. `NEXT_PUBLIC_SITE_URL` — set this once a real production domain is
 *    purchased and configured.
 * 2. `VERCEL_URL` — automatically provided by Vercel for every deployment
 *    (production and preview) when the explicit var isn't set. It's just a
 *    bare hostname, so "https://" is prepended.
 * 3. `http://localhost:3000` — local development fallback.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");

export const SITE_DESCRIPTION =
  "Convert, shift, and merge subtitle files instantly in your browser. 100% free, private, and no signup required.";

// Placeholder contact address — update once a real inbox is set up.
export const CONTACT_EMAIL = "hello@subtitletoolkit.com";

/** Brand accent colors, kept in sync with the `--primary` CSS variable in globals.css. */
export const BRAND_GRADIENT = { from: "#6366f1", to: "#8b5cf6" };

/** Google Analytics 4 measurement ID. Analytics is skipped entirely when unset. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined;

/** Google AdSense publisher/client ID. Ad slots render nothing when unset. */
export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || undefined;

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/tools/srt-to-vtt". Defaults to the homepage. */
  path?: string;
}

/**
 * Builds a full per-page `Metadata` object (including Open Graph and Twitter
 * card fields, plus the canonical URL) from just a title and description, so
 * every route's social preview reflects its own content instead of the site
 * defaults set in the root layout.
 */
export function buildMetadata({ title, description, path = "/" }: PageMetadataInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  // Nested route metadata replaces (rather than merges with) the root
  // layout's `openGraph`/`twitter` objects, so the shared OG image has to be
  // repeated here explicitly for every page to keep a social preview image.
  const image = { url: "/opengraph-image", width: 1200, height: 630, type: "image/png" };

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

interface WebApplicationJsonLdInput {
  name: string;
  description: string;
  path: string;
}

/** Builds a `WebApplication` JSON-LD object for a tool page's structured data. */
export function buildWebApplicationJsonLd({ name, description, path }: WebApplicationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: new URL(path, SITE_URL).toString(),
    applicationCategory: "Utility",
    operatingSystem: "Any (runs in any modern browser)",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
