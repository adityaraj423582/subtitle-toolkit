import { buildMetadata, buildWebApplicationJsonLd } from "@/lib/site-config";
import { SubtitleShifterTool } from "./SubtitleShifterTool";

const TITLE = "Free Subtitle Sync Fixer — Shift SRT/VTT Timing Online | SubtitleToolkit";
const DESCRIPTION =
  "Fix out-of-sync subtitles by shifting SRT or VTT timestamps forward or backward, down to the millisecond. Runs entirely in your browser — no uploads, no signup.";
const PATH = "/tools/subtitle-shifter";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const jsonLd = buildWebApplicationJsonLd({
  name: "Subtitle Time Shifter",
  description: DESCRIPTION,
  path: PATH,
});

export default function SubtitleShifterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Subtitle Time Shifter
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Nudge every caption in an SRT or VTT file forward or backward to fix
          out-of-sync subtitles — instantly and privately in your browser.
        </p>
      </div>

      <div className="mt-10">
        <SubtitleShifterTool />
      </div>

      <div className="mt-16 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          Why do subtitles fall out of sync?
        </h2>
        <p>
          Subtitle timing drifts for a handful of common reasons. The most
          frequent culprit is a{" "}
          <strong className="text-foreground">frame rate mismatch</strong> —
          a subtitle file timed against a 23.976fps cut of a video will
          gradually drift when played against a 25fps or 30fps version, since
          every frame is a slightly different fraction of a second.
          Sometimes it&apos;s simpler than that: an editor trims or extends
          the{" "}
          <strong className="text-foreground">intro or outro</strong> of a
          video after the subtitles were already timed, shifting everything
          that follows by a fixed amount. And if you&apos;ve grabbed a
          subtitle file that was{" "}
          <strong className="text-foreground">
            ripped from a different source or release
          </strong>{" "}
          than the video you&apos;re watching, it may simply start a few
          seconds early or late.
        </p>
        <p>
          In almost all of these cases, the fix is the same: every cue is off
          by roughly the same, constant amount. That&apos;s exactly what this
          tool does — it applies one fixed offset to every subtitle&apos;s
          start and end time, in the direction and unit you choose, so the
          whole file moves together and stays in sync with the video. It
          won&apos;t help with subtitles that drift progressively throughout
          a file (that&apos;s a frame-rate conversion problem, not a timing
          offset), but for the common case of a subtitle track that&apos;s
          simply early or late by a constant amount, a single shift is all
          you need.
        </p>
        <p>
          Like the rest of SubtitleToolkit, this tool runs entirely in your
          browser. Your file is read locally, shifted in memory, and handed
          back to you as a download — it&apos;s never uploaded to a server,
          so you can use it just as comfortably on a personal project as on
          something you&apos;d rather keep private.
        </p>
      </div>
    </div>
  );
}
