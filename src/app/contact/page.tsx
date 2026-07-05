import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildMetadata, CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${SITE_NAME} team.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Mail className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Get in touch
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Found a bug, have a feature idea, or just want to say hi? We&apos;d
        genuinely like to hear from you — {SITE_NAME} is a small project,
        and real feedback shapes what we build next.
      </p>
      <Button asChild size="lg" className="mt-8">
        <a href={`mailto:${CONTACT_EMAIL}`}>
          <Mail className="size-4" />
          {CONTACT_EMAIL}
        </a>
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        We read every message, though as a small team it might take us a
        little while to reply.
      </p>
    </div>
  );
}
