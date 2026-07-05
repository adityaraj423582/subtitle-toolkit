import { buildMetadata, buildWebApplicationJsonLd } from "@/lib/site-config";
import { AdSlot } from "@/components/shared/AdSlot";
import { SubtitleMergerTool } from "./SubtitleMergerTool";

const TITLE = "Free Subtitle Merger — Combine SRT/VTT Files Online | SubtitleToolkit";
const DESCRIPTION =
  "Combine two SRT or VTT subtitle files into one — stitch multi-part video subtitles together or build a dual-language bilingual track. 100% free and private.";
const PATH = "/tools/subtitle-merger";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const jsonLd = buildWebApplicationJsonLd({
  name: "Subtitle Merger",
  description: DESCRIPTION,
  path: PATH,
});

export default function SubtitleMergerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Subtitle Merger
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Combine two SRT or VTT files into one — either back-to-back or as a
          single bilingual track — instantly and privately in your browser.
        </p>
      </div>

      <div className="mt-10">
        <SubtitleMergerTool />
      </div>

      <AdSlot slot="tools-subtitle-merger-inline" className="mt-10" />

      <div className="mt-16 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          When would I need to merge subtitle files?
        </h2>
        <p>
          The most common case is a{" "}
          <strong className="text-foreground">multi-part video</strong> —
          a long lecture, movie, or stream that was split into Part 1 and
          Part 2 files, each with its own subtitle track starting back at
          zero. If you later join the video clips into a single file,{" "}
          <strong className="text-foreground">Sequential mode</strong> takes
          care of the subtitles too: it shifts every cue in the second file
          to start right where the first one ends (plus an optional gap for
          any transition you added), then combines both into one correctly
          numbered file.
        </p>
        <p>
          The other common case is building a{" "}
          <strong className="text-foreground">bilingual subtitle track</strong>{" "}
          for language learners — showing the original language and a
          translation together, one line above the other, for the same
          moment in the video.{" "}
          <strong className="text-foreground">Dual Language mode</strong>{" "}
          handles this by matching up cues from both files based on which
          ones overlap in time, then merging their text into a single
          two-line cue. It works best when both files were timed against the
          same video, so their cues line up closely.
        </p>
        <p>
          As with every tool here, merging happens entirely in your browser.
          Both files are read locally, combined in memory, and handed back to
          you as a single download — neither file is ever uploaded to a
          server, so this works just as well for a class project as it does
          for content you&apos;d rather keep private.
        </p>
      </div>
    </div>
  );
}
