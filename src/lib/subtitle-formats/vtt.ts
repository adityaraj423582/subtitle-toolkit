import type { SubtitleCue } from "./types";
import { msToVTTTime, vttTimeToMs } from "./time-utils";

const ARROW = "-->";
// A bare VTT timestamp token, e.g. "00:20.000" or "00:00:20.000". The hours
// segment is optional and, when present, may be any number of digits.
const VTT_TIMESTAMP_TOKEN = /(?:\d+:)?\d{2}:\d{2}\.\d{1,3}/;

function isTimestampLine(line: string): boolean {
  if (!line.includes(ARROW)) return false;
  const [left, right] = line.split(ARROW);
  return (
    VTT_TIMESTAMP_TOKEN.test((left ?? "").trim()) &&
    VTT_TIMESTAMP_TOKEN.test((right ?? "").trim())
  );
}

function parseTimestampLine(line: string): { start: number; end: number } {
  const [left = "", right = ""] = line.split(ARROW);
  const startMatch = VTT_TIMESTAMP_TOKEN.exec(left.trim());
  // The right side may carry cue settings after the end time, e.g.
  // "00:00:24.400 align:start position:10%" — only the first token matters.
  const endMatch = VTT_TIMESTAMP_TOKEN.exec(right.trim());

  return {
    start: startMatch ? vttTimeToMs(startMatch[0]) : 0,
    end: endMatch ? vttTimeToMs(endMatch[0]) : 0,
  };
}

/** Strips a leading UTF-8 BOM and normalizes CRLF/CR line endings to LF. */
function normalizeContent(content: string): string {
  return content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

/**
 * Parses WebVTT subtitle text into cues. Skips the `WEBVTT` header block,
 * `NOTE` comments, and `STYLE` blocks. Optional cue identifiers and cue
 * settings (e.g. `align:start position:10%`) are recognized but discarded,
 * since they have no equivalent in the shared `SubtitleCue` shape.
 */
export function parseVTT(content: string): SubtitleCue[] {
  const lines = normalizeContent(content).split("\n");
  const cues: SubtitleCue[] = [];

  let i = 0;
  let autoIndex = 1;

  if (i < lines.length && lines[i].trim().startsWith("WEBVTT")) {
    i++;
    // Header metadata lines (Kind:, Language:, ...) continue until a blank
    // line — bail out early if we unexpectedly hit a timestamp line instead,
    // so a missing blank separator doesn't swallow the first cue.
    while (i < lines.length && lines[i].trim() !== "" && !isTimestampLine(lines[i])) {
      i++;
    }
  }

  while (i < lines.length) {
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    const trimmed = lines[i].trim();

    if (trimmed.startsWith("NOTE")) {
      i++;
      while (i < lines.length && lines[i].trim() !== "") i++;
      continue;
    }

    if (trimmed === "STYLE") {
      i++;
      while (i < lines.length && lines[i].trim() !== "") i++;
      continue;
    }

    // Optional cue identifier line immediately preceding the timing line.
    if (!isTimestampLine(lines[i]) && i + 1 < lines.length && isTimestampLine(lines[i + 1])) {
      i++;
    }

    if (i >= lines.length || !isTimestampLine(lines[i])) {
      // Unrecognized line — skip forward to avoid an infinite loop.
      i++;
      continue;
    }

    const { start, end } = parseTimestampLine(lines[i]);
    i++;

    const textLines: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === "") break;
      if (isTimestampLine(line)) break;
      textLines.push(line);
      i++;
    }

    cues.push({
      index: autoIndex++,
      startTime: start,
      endTime: end,
      text: textLines.join("\n").trim(),
    });
  }

  return cues;
}

/** Serializes cues back into valid WebVTT text with the required header. */
export function stringifyVTT(cues: SubtitleCue[]): string {
  const header = "WEBVTT\n";
  if (cues.length === 0) return `${header}\n`;

  const blocks = cues.map((cue) => {
    const timeLine = `${msToVTTTime(cue.startTime)} ${ARROW} ${msToVTTTime(cue.endTime)}`;
    return `${timeLine}\n${cue.text}`;
  });

  return `${header}\n${blocks.join("\n\n")}\n`;
}
