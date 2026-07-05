import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TOOLS_CATALOG } from "@/lib/tools-catalog";
import { buildMetadata } from "@/lib/site-config";
import { AdSlot } from "@/components/shared/AdSlot";

export const metadata = buildMetadata({
  title: "Subtitle Tools",
  description:
    "Browse the full collection of free browser-based subtitle tools — convert, shift, and merge SRT and VTT files with no signup and no uploads.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Subtitle Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every tool here follows the same philosophy:{" "}
          <strong className="text-foreground">free</strong>,{" "}
          <strong className="text-foreground">private</strong>, and{" "}
          <strong className="text-foreground">no signup</strong>. Files are
          read and processed locally in your browser and are never uploaded
          to a server, so you can open a tool and get to work immediately —
          no account, no email, no waiting.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      <AdSlot slot="tools-index-inline" className="mt-12" />
    </div>
  );
}
