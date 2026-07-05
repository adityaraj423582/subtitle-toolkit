import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";
import { GA_MEASUREMENT_ID, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_TITLE = `${SITE_NAME} — Free Subtitle Tools for Creators & Editors`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Google AdSense site-verification / ad-serving script. Loaded
          unconditionally (not gated by NEXT_PUBLIC_ADSENSE_CLIENT_ID) so
          Google's verification crawler can always find it — this is
          separate from the per-unit <AdSlot /> component.

          strategy="beforeInteractive" is required here (not
          afterInteractive) because it's the only next/script strategy Next.js
          actually injects into the server-rendered <head> — afterInteractive
          scripts are always appended to <body> client-side after hydration,
          regardless of where the <Script> component is placed in the tree.
        */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2056654017002912"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <CookieConsentBanner />
      </body>
      {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
    </html>
  );
}
