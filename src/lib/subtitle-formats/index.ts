import type { SubtitleFormat } from "./types";
import { parseSRT, stringifySRT } from "./srt";
import { parseVTT, stringifyVTT } from "./vtt";

export type { SubtitleCue, SubtitleFormat, ParsedSubtitle } from "./types";
export { parseSRT, stringifySRT } from "./srt";
export { parseVTT, stringifyVTT } from "./vtt";
export { msToSRTTime, msToVTTTime, srtTimeToMs, vttTimeToMs } from "./time-utils";

/**
 * Detects a subtitle file's format, preferring the filename extension and
 * falling back to sniffing the content (a WebVTT file must begin with a
 * `WEBVTT` header; anything else is assumed to be SRT).
 */
export function detectFormat(filename: string, content: string): SubtitleFormat {
  const extMatch = /\.([a-z0-9]+)$/i.exec(filename.trim());
  const ext = extMatch?.[1]?.toLowerCase();
  if (ext === "srt") return "srt";
  if (ext === "vtt") return "vtt";

  const sniffed = content.replace(/^\uFEFF/, "").trimStart();
  if (sniffed.toUpperCase().startsWith("WEBVTT")) return "vtt";

  return "srt";
}

/**
 * Converts subtitle text from one format to another. Throws if the content
 * doesn't parse into any cues (and wasn't simply empty), so callers can
 * surface a clear "invalid file" error to the user.
 */
export function convertSubtitle(
  content: string,
  from: SubtitleFormat,
  to: SubtitleFormat,
): string {
  const cues = from === "srt" ? parseSRT(content) : parseVTT(content);

  if (cues.length === 0 && content.trim() !== "") {
    throw new Error("This doesn't look like a valid SRT or VTT file.");
  }

  return to === "srt" ? stringifySRT(cues) : stringifyVTT(cues);
}
