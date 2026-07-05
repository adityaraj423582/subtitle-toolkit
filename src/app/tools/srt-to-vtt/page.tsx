import { buildMetadata, buildWebApplicationJsonLd } from "@/lib/site-config";
import { SrtToVttTool } from "./SrtToVttTool";

const TITLE = "Free SRT to VTT Converter Online | SubtitleToolkit";
const DESCRIPTION =
  "Convert SRT subtitle files to WebVTT (and back) instantly in your browser. No signup, no uploads — your files are processed 100% locally and never leave your device.";
const PATH = "/tools/srt-to-vtt";

export const metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

const jsonLd = buildWebApplicationJsonLd({
  name: "SRT to VTT Converter",
  description: DESCRIPTION,
  path: PATH,
});

export default function SrtToVttPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          SRT to VTT Converter
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Convert between SubRip (.srt) and WebVTT (.vtt) subtitle files in
          either direction, instantly and privately in your browser.
        </p>
      </div>

      <div className="mt-10">
        <SrtToVttTool />
      </div>

      <div className="mt-16 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          What&apos;s the difference between SRT and VTT?
        </h2>
        <p>
          <strong className="text-foreground">SRT (SubRip Subtitle)</strong>{" "}
          is one of the oldest and most widely supported subtitle formats.
          It&apos;s a plain text file made up of numbered blocks, each with a
          start and end timestamp and one or more lines of text. Most video
          editors, media players, and streaming tools can read it, which is
          why it&apos;s still the default format many people work with.{" "}
          <strong className="text-foreground">WebVTT (Web Video Text Tracks)</strong>{" "}
          is a newer format built specifically for the web. It&apos;s the
          format HTML5 video players expect for the{" "}
          <code>&lt;track&gt;</code> element, and it supports a few extra
          features SRT doesn&apos;t, like cue positioning and simple styling.
        </p>
        <p>
          You&apos;ll typically need to convert between the two when moving
          subtitles from one context to another — for example, taking an SRT
          file exported from a video editor and turning it into VTT so it
          works with a web-based video player, or going the other way when a
          platform only accepts SRT uploads. The underlying content (the
          timing and the text) is identical between the two formats; only the
          syntax differs, so a good converter should get you a clean,
          lossless result every time.
        </p>
        <p>
          This tool runs entirely in your browser using JavaScript — your
          subtitle file is read locally with the File API, converted in
          memory, and offered back to you as a download. At no point is it
          uploaded to a server or sent anywhere over the network, which
          means it works just as well for personal projects as it does for
          scripts you&apos;d rather keep private.
        </p>
      </div>
    </div>
  );
}
