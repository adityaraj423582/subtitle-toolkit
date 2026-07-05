import { UserRound } from "lucide-react";
import { buildMetadata, SITE_NAME } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About",
  description: `Who builds ${SITE_NAME}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <UserRound className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        About
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Hi, I&apos;m Aditya — I build small, useful tools on the side. More
        about me coming soon.
      </p>
    </div>
  );
}
