import type { SubtitleCue } from "./types";
import { msToSRTTime, srtTimeToMs } from "./time-utils";

const ARROW = "-->";
// A bare SRT timestamp token, e.g. "00:00:20,000". Hours may be any number
// of digits so multi-day durations (100+ hours) still match.
const SRT_TIMESTAMP_TOKEN = /\d+:\d{2}:\d{2},\d{1,3}/;
const INDEX_LINE_RE = /^\d+$/;

function isTimestampLine(line: string): boolean {
  if (!line.includes(ARROW)) return false;
  const [left, right] = line.split(ARROW);
  return (
    SRT_TIMESTAMP_TOKEN.test(left ?? "") && SRT_TIMESTAMP_TOKEN.test(right ?? "")
  );
}

function isIndexLine(line: string): boolean {
  return INDEX_LINE_RE.test(line.trim());
}

function parseTimestampLine(line: string): { start: number; end: number } {
  const [left = "", right = ""] = line.split(ARROW);
  const startMatch = SRT_TIMESTAMP_TOKEN.exec(left);
  const endMatch = SRT_TIMESTAMP_TOKEN.exec(right);

  return {
    start: startMatch ? srtTimeToMs(startMatch[0]) : 0,
    end: endMatch ? srtTimeToMs(endMatch[0]) : 0,
  };
}

/** Strips a leading UTF-8 BOM and normalizes CRLF/CR line endings to LF. */
function normalizeContent(content: string): string {
  return content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

/**
 * Parses SRT (SubRip) subtitle text into cues.
 *
 * Deliberately lenient: missing blank lines between blocks, missing index
 * numbers, and stray whitespace are all tolerated rather than treated as
 * fatal errors.
 */
export function parseSRT(content: string): SubtitleCue[] {
  const lines = normalizeContent(content).split("\n");
  const cues: SubtitleCue[] = [];

  let i = 0;
  let autoIndex = 1;

  while (i < lines.length) {
    while (i < lines.length && lines[i].trim() === "") i++;
    if (i >= lines.length) break;

    // An index line only counts as such when immediately followed by a
    // timestamp line — otherwise it could be subtitle text that happens to
    // be numeric.
    if (isIndexLine(lines[i]) && i + 1 < lines.length && isTimestampLine(lines[i + 1])) {
      i++;
    }

    if (i >= lines.length || !isTimestampLine(lines[i])) {
      // Not a cue we recognize — skip forward to avoid an infinite loop on
      // malformed content.
      i++;
      continue;
    }

    const { start, end } = parseTimestampLine(lines[i]);
    i++;

    const textLines: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      if (line.trim() === "") break;
      // Lenient handling of missing blank-line separators: stop the current
      // block as soon as the next cue clearly begins.
      if (isTimestampLine(line)) break;
      if (isIndexLine(line) && i + 1 < lines.length && isTimestampLine(lines[i + 1])) break;
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

/**
 * Serializes cues back into valid SRT text, renumbering indices sequentially
 * starting at 1.
 */
export function stringifySRT(cues: SubtitleCue[]): string {
  if (cues.length === 0) return "";

  const blocks = cues.map((cue, i) => {
    const timeLine = `${msToSRTTime(cue.startTime)} ${ARROW} ${msToSRTTime(cue.endTime)}`;
    return `${i + 1}\n${timeLine}\n${cue.text}`;
  });

  return `${blocks.join("\n\n")}\n`;
}
