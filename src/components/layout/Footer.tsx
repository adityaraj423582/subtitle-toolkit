import Link from "next/link";
import { Subtitles } from "lucide-react";
import { SupportButton } from "@/components/shared/SupportButton";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Subtitles className="size-4" />
              </span>
              <span className="text-base font-bold tracking-tight">
                SubtitleToolkit
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Fast, private subtitle tools that run right in your browser — no
              uploads, no signup.
            </p>
            <SupportButton variant="footer" />
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-center text-sm font-medium text-primary sm:text-left">
            Built by{" "}
            <Link href="/about" className="underline underline-offset-2 hover:text-primary/80">
              Aditya Raj Singh
            </Link>
          </p>

          <div className="mt-3 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <p>&copy; {year} SubtitleToolkit. All rights reserved.</p>
            <p>Made for creators, editors &amp; subtitlers worldwide.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
