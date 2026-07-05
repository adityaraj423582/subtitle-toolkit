import Link from "next/link";
import { buildMetadata, CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms for using ${SITE_NAME}'s free browser-based subtitle tools.`,
  path: "/terms",
});

const LAST_UPDATED = "July 4, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section className="space-y-3">
          <p>
            These terms cover your use of {SITE_NAME} (the &ldquo;Service&rdquo;).
            By using the Service, you&apos;re agreeing to them. They&apos;re
            deliberately short, because the Service itself is simple: free,
            browser-based subtitle tools with no accounts and no uploads.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            The Service
          </h2>
          <p>
            {SITE_NAME} provides free tools for converting, shifting, and
            merging subtitle files (SRT and VTT), all of which run locally
            in your browser. There is no cost to use any tool currently on
            the site, no account is required, and we do not charge for
            access to the free tools described elsewhere on this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Acceptable use
          </h2>
          <p>You agree to use the Service only for lawful purposes. In particular, you agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Use the Service to process, convert, or otherwise handle
              content that is illegal, infringes someone else&apos;s
              intellectual property rights, or that you don&apos;t have the
              right to use;
            </li>
            <li>
              Attempt to disrupt, overload, or gain unauthorized access to
              the Service or the infrastructure it runs on;
            </li>
            <li>
              Use automated means to scrape, batch-process at abusive
              volume, or otherwise misuse the Service in a way that
              degrades it for other users.
            </li>
          </ul>
          <p>
            Because all processing happens in your own browser, we have no
            visibility into the files you process — but you&apos;re still
            responsible for making sure your use of the Service complies
            with applicable law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            No warranty
          </h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as
            available,&rdquo; without warranties of any kind, whether
            express or implied. We don&apos;t guarantee that the tools will
            be error-free, uninterrupted, or that conversion/shifting/merging
            results will be perfectly suited to your specific use case. You
            should always review the output of any tool before relying on
            it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, {SITE_NAME} and its
            operators will not be liable for any indirect, incidental,
            special, or consequential damages, or any loss of data, profits,
            or goodwill, arising from your use of — or inability to use —
            the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Advertising
          </h2>
          <p>
            The Service may display advertising served by third parties
            such as Google AdSense. We don&apos;t control the specific
            content of third-party ads and displaying an ad is not an
            endorsement of the advertiser or its product. See our{" "}
            <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
              Privacy Policy
            </Link>{" "}
            for details on how advertising cookies work.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Changes to the Service or these terms
          </h2>
          <p>
            We&apos;re a small, evolving project. We may add, change, or
            remove features, or discontinue the Service entirely, at any
            time and without notice. We may also update these terms from
            time to time; continuing to use the Service after an update
            means you accept the revised terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
