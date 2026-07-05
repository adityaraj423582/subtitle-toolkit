<div align="center">

# 🎬 SubtitleToolkit

**Free, private, browser-based subtitle tools for creators, editors, and subtitlers.**

Convert, shift, and merge SRT/VTT subtitle files instantly — no signup, no uploads, no server ever sees your files.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/tests-82_passing-4ade80?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/adityaraj423582/subtitle-toolkit)

<br />

<img src="https://img.shields.io/badge/100%25-Client--Side-6366f1?style=for-the-badge" alt="100% client-side" />
<img src="https://img.shields.io/badge/No-Signup-8b5cf6?style=for-the-badge" alt="No signup" />
<img src="https://img.shields.io/badge/No-Uploads-6366f1?style=for-the-badge" alt="No uploads" />

</div>

<br />

## ✨ What is this?

SubtitleToolkit is a small suite of subtitle-editing tools that run **entirely in your browser**. There's no backend processing a single one of these features — every file is read, transformed, and downloaded using nothing but client-side JavaScript. That means it's fast, it works offline once loaded, and your files never touch a network.

| Tool | What it does |
| --- | --- |
| 🔁 **[SRT ↔ VTT Converter](src/app/tools/srt-to-vtt)** | Convert SubRip (`.srt`) and WebVTT (`.vtt`) files to each other, in either direction. |
| ⏱️ **[Subtitle Time Shifter](src/app/tools/subtitle-shifter)** | Shift every caption forward or backward — with a live before/after preview — to fix out-of-sync subtitles. |
| 🧩 **[Subtitle Merger](src/app/tools/subtitle-merger)** | Stitch multi-part subtitles together sequentially, or combine two language tracks into one bilingual file. |

### Why it's built this way

- 🔒 **100% private** — files are parsed and rewritten in memory in your browser; nothing is ever uploaded.
- 🆓 **No signup, no accounts** — open a tool and use it immediately.
- 📱 **Works everywhere** — fully responsive, no install required.
- 🧪 **Correctness-first parsing engine** — a hand-written SRT/VTT parser with 80+ unit tests covering edge cases (BOMs, CRLF, malformed blocks, hour-boundary timestamps, and more).

<br />

## 🧰 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Icons | [lucide-react](https://lucide.dev) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |
| Testing | [Vitest](https://vitest.dev) |
| Analytics | Google Analytics 4 via `@next/third-parties` *(optional, env-gated)* |
| Ads | Google AdSense *(optional, env-gated)* |
| Hosting | [Vercel](https://vercel.com) |

<br />

## 📂 Project structure

```
subtitle-toolkit/
├─ src/
│  ├─ app/                        # Routes (App Router)
│  │  ├─ tools/
│  │  │  ├─ srt-to-vtt/            # Converter tool + page
│  │  │  ├─ subtitle-shifter/      # Time shifter tool + page
│  │  │  └─ subtitle-merger/       # Merger tool + page
│  │  ├─ privacy/ terms/ contact/  # Policy pages
│  │  ├─ sitemap.ts  robots.ts     # SEO infrastructure
│  │  └─ opengraph-image.tsx       # Dynamic OG image
│  ├─ components/
│  │  ├─ layout/                   # Header, Footer
│  │  ├─ shared/                   # FileDropzone, AdSlot, CookieConsentBanner...
│  │  └─ ui/                       # shadcn/ui primitives
│  └─ lib/
│     ├─ subtitle-formats/         # 🎯 The parsing engine (SRT/VTT, time utils)
│     ├─ subtitle-shift.ts         # Time-shift logic
│     ├─ subtitle-merge.ts         # Sequential + dual-language merge logic
│     └─ site-config.ts            # Site-wide metadata helpers
└─ vitest.config.ts
```

The core parsing logic lives in [`src/lib/subtitle-formats/`](src/lib/subtitle-formats) and is deliberately isolated from the UI — every tool imports from it, but never reimplements parsing/serialization itself.

<br />

## 🚀 Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Clone the repo
git clone https://github.com/adityaraj423582/subtitle-toolkit.git
cd subtitle-toolkit

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it. No environment variables are required to run the app locally.

<br />

## 🔐 Environment variables

Every environment variable is **optional**. The site builds, runs, and looks fully finished with none of them set — each feature simply switches off cleanly rather than showing broken placeholders.

Copy the example file to get started:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose | If unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production URL, used for the sitemap, robots.txt, and OG/canonical tags | Falls back to a placeholder domain |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID | Analytics script never loads |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense publisher ID | `<AdSlot />` renders nothing |

<br />

## 🧪 Testing

The subtitle parsing engine, time-shift logic, and merge logic are covered by an extensive Vitest suite (round-trip parsing, BOM/CRLF handling, malformed input, hour-boundary timestamps, sequential/dual-language merging, and more).

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

<br />

## 📦 Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

<br />

## ☁️ Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this on GitHub 👋).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository — Vercel auto-detects Next.js and needs zero configuration.
3. *(Optional)* Add the environment variables above in **Project Settings → Environment Variables** once you have real GA4/AdSense IDs.
4. Deploy.

Or click the badge:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adityaraj423582/subtitle-toolkit)

<br />

## 🗺️ Roadmap

The core toolkit is, and will stay, free. Under consideration for an optional Pro tier:

- 🌍 AI-powered subtitle translation
- ⚡ Batch processing for multiple files at once

<br />

## 📄 License

No license has been declared for this project yet — all rights reserved by the author until one is added.

<br />

<div align="center">

Made for creators, editors & subtitlers worldwide. 💜

</div>
