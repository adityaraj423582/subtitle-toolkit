import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowLeft, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({
  title,
  description,
  icon: Icon = Hammer,
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-8" />
      </span>
      <span className="mt-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
        Coming soon
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/tools">
          <ArrowLeft className="size-4" />
          Back to all tools
        </Link>
      </Button>
    </div>
  );
}
