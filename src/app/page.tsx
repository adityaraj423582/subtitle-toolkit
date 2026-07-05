import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Languages,
  Lock,
  Smartphone,
  Sparkles,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TOOLS_CATALOG } from "@/lib/tools-catalog";

const features = [
  {
    title: "100% Free & Private",
    description:
      "Everything runs in your browser — your files never leave your device or touch a server.",
    icon: Lock,
  },
  {
    title: "No Signup Required",
    description:
      "No accounts, no email, no paywalls. Open a tool and get to work immediately.",
    icon: UserX,
  },
  {
    title: "Works on Any Device",
    description:
      "A fast, responsive interface that works just as well on mobile, tablet, and desktop.",
    icon: Smartphone,
  },
] as const;

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
        >
          <div className="h-72 w-[42rem] rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-8 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Free browser-based subtitle tools
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Free Subtitle Tools for Creators &amp; Editors
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Convert, shift, and merge subtitle files instantly — right in your
              browser. No uploads, no signup, no waiting. Just fast, private
              tools that respect your workflow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/tools">
                  Explore Tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tools/srt-to-vtt">Try SRT to VTT</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS_CATALOG.map((tool) => (
              <Card
                key={tool.slug}
                className="group rounded-xl border-border/70 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <CardHeader>
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <tool.icon className="size-5" />
                  </span>
                  <CardTitle className="mt-4 text-lg">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    asChild
                    variant="ghost"
                    className="px-0 text-primary hover:bg-transparent hover:text-primary"
                  >
                    <Link href={`/tools/${tool.slug}`}>
                      Use Tool
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why SubtitleToolkit
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for people who work with subtitles every day — and value speed,
            privacy, and simplicity.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="text-center sm:text-left">
              <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary sm:mx-0">
                <feature.icon className="size-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/30 px-6 py-12 sm:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              Pro features on the way
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              More power is coming — at your own pace
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re quietly working on optional Pro tools like AI-powered
              translation and batch processing for larger projects. The core
              toolkit will always stay free.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Languages className="size-4 text-primary" />
                AI-powered translation
              </span>
              <span className="inline-flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                Batch processing
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
