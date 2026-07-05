import Link from "next/link";
import { buildMetadata, CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your data, cookies, and files.`,
  path: "/privacy",
});

const LAST_UPDATED = "July 4, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="prose-legal mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section className="space-y-3">
          <p>
            {SITE_NAME} is built around one simple idea: your subtitle files
            are yours, and they should never have to leave your device to be
            edited. This policy explains, in plain language, exactly what
            does and doesn&apos;t happen with your data when you use this
            site — including the parts that are less obvious, like cookies
            and advertising.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Your subtitle files never leave your browser
          </h2>
          <p>
            Every tool on {SITE_NAME} — the SRT/VTT converter, the time
            shifter, and the merger — runs entirely as JavaScript inside your
            own browser. When you select or drop a file, it is read locally
            using your browser&apos;s File API, processed in memory, and
            handed back to you as a download. At no point is the content of
            your subtitle file sent to our servers, to any third party, or
            stored anywhere outside your device. We don&apos;t have file
            storage or a backend for this to happen even if we wanted to —
            there simply isn&apos;t a server-side component to these tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            No accounts, no sign-up
          </h2>
          <p>
            {SITE_NAME} doesn&apos;t have user accounts, logins, or
            registration of any kind. We don&apos;t collect your name, email
            address, or any other personal identifiers just to let you use a
            tool. The only way we&apos;d have your email is if you chose to
            write to us (see &ldquo;Contact Us&rdquo; below).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Cookies</h2>
          <p>
            This site uses cookies — small text files stored in your browser
            — for two purposes: measuring site usage and serving
            advertising. When you first visit, you&apos;ll see a short
            banner letting you know this before any non-essential cookies
            are relevant to you. Specifically:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Google AdSense.</strong>{" "}
              We use, or intend to use, Google AdSense to display
              advertising on this site. Google and its partners use cookies
              to serve ads based on your prior visits to this website and
              other websites on the internet. This is sometimes called
              &ldquo;interest-based&rdquo; or &ldquo;personalized&rdquo;
              advertising.
            </li>
            <li>
              <strong className="text-foreground">Google Analytics.</strong>{" "}
              We use Google Analytics to understand, in aggregate, how many
              people visit the site, which tools are used most, and where
              visitors are roughly located (at a country/city level, not a
              precise address). Analytics uses cookies to distinguish
              returning visitors from new ones.
            </li>
          </ul>
          <p>
            You can control or delete cookies through your browser
            settings at any time, and you can opt out of personalized
            advertising from Google specifically by visiting{" "}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Google Ads Settings
            </a>
            . You can also opt out of some third-party vendors&apos; use of
            cookies for personalized advertising by visiting{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Information collected automatically
          </h2>
          <p>
            Like virtually every website, {SITE_NAME} is hosted by a
            third-party provider (currently Vercel), which automatically
            logs standard technical information for every request — things
            like your IP address, browser type and version, operating
            system, referring page, and timestamps. This is standard web
            server log data used for security, abuse prevention, and keeping
            the site running, and it is not something we actively query or
            build profiles from.
          </p>
          <p>
            Separately, if Google Analytics is enabled, it collects
            aggregated, largely anonymized usage data (pages visited, time
            on page, approximate device/browser/location) through its own
            cookies and scripts, governed by Google&apos;s own privacy
            practices.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Third-party services
          </h2>
          <p>
            We rely on a small number of third-party services to run this
            site, each with their own privacy practices:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Vercel</strong> — hosting
              and content delivery.
            </li>
            <li>
              <strong className="text-foreground">Google AdSense</strong> —
              advertising.
            </li>
            <li>
              <strong className="text-foreground">Google Analytics</strong>{" "}
              — usage analytics.
            </li>
          </ul>
          <p>
            You can read more about how Google uses data across its
            advertising and analytics products at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              How Google uses information from sites that use our services
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Children&apos;s privacy
          </h2>
          <p>
            {SITE_NAME} is not directed at children under 13, and we do not
            knowingly collect personal information from children. Advertising
            served on this site is not intended to be targeted at children.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time as the site evolves
            — for example, if we add new features or advertising
            partners. We&apos;ll update the &ldquo;Last updated&rdquo; date
            above whenever we do. Continuing to use the site after a change
            means you&apos;re okay with the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
          <p>
            Questions about this policy or how the site handles data? Contact
            us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            . You can also visit our{" "}
            <Link href="/contact" className="font-medium text-primary underline underline-offset-2">
              Contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
