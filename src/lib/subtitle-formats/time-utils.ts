/**
 * Timestamp conversion helpers shared by the SRT and VTT readers/writers.
 *
 * SRT timestamps always look like `HH:MM:SS,mmm` (comma before milliseconds).
 * VTT timestamps look like `HH:MM:SS.mmm` (period before milliseconds), and
 * the hours segment is optional (`MM:SS.mmm`).
 */

const HOURS_MS = 60 * 60 * 1000;
const MINUTES_MS = 60 * 1000;
const SECONDS_MS = 1000;

function padStart(value: number, length: number): string {
  return String(Math.max(0, Math.trunc(value))).padStart(length, "0");
}

/** Splits a non-negative millisecond duration into h/m/s/ms components. */
function splitMs(ms: number): {
  hours: number;
  minutes: number;
  seconds: number;
  millis: number;
} {
  // Guard against negative/NaN input so formatting never throws — clamp to 0.
  const safeMs = Number.isFinite(ms) && ms > 0 ? Math.round(ms) : 0;

  const hours = Math.floor(safeMs / HOURS_MS);
  const remAfterHours = safeMs - hours * HOURS_MS;
  const minutes = Math.floor(remAfterHours / MINUTES_MS);
  const remAfterMinutes = remAfterHours - minutes * MINUTES_MS;
  const seconds = Math.floor(remAfterMinutes / SECONDS_MS);
  const millis = remAfterMinutes - seconds * SECONDS_MS;

  return { hours, minutes, seconds, millis };
}

/** Formats milliseconds as an SRT timestamp, e.g. `00:00:20,000`. */
export function msToSRTTime(ms: number): string {
  const { hours, minutes, seconds, millis } = splitMs(ms);
  return `${padStart(hours, 2)}:${padStart(minutes, 2)}:${padStart(seconds, 2)},${padStart(millis, 3)}`;
}

/** Formats milliseconds as a VTT timestamp, e.g. `00:00:20.000`. */
export function msToVTTTime(ms: number): string {
  const { hours, minutes, seconds, millis } = splitMs(ms);
  return `${padStart(hours, 2)}:${padStart(minutes, 2)}:${padStart(seconds, 2)}.${padStart(millis, 3)}`;
}

// Matches HH:MM:SS,mmm or H:MM:SS,mmm (hours may be any number of digits).
const SRT_TIME_RE = /^(\d+):(\d{2}):(\d{2}),(\d{1,3})$/;

// Matches HH:MM:SS.mmm (hours optional) — VTT allows both MM:SS.mmm and
// HH:MM:SS.mmm, with hours being any number of digits when present.
const VTT_TIME_RE = /^(?:(\d+):)?(\d{2}):(\d{2})\.(\d{1,3})$/;

function millisFromFraction(fraction: string): number {
  // Right-pad so "5" -> 500ms and "05" -> 50ms, matching fixed-width millis.
  return Number(fraction.padEnd(3, "0").slice(0, 3));
}

/** Parses an SRT timestamp (`HH:MM:SS,mmm`) into milliseconds. */
export function srtTimeToMs(timeStr: string): number {
  const match = SRT_TIME_RE.exec(timeStr.trim());
  if (!match) return 0;

  const [, hours, minutes, seconds, millis] = match;
  return (
    Number(hours) * HOURS_MS +
    Number(minutes) * MINUTES_MS +
    Number(seconds) * SECONDS_MS +
    millisFromFraction(millis)
  );
}

/** Parses a VTT timestamp (`[HH:]MM:SS.mmm`) into milliseconds. */
export function vttTimeToMs(timeStr: string): number {
  const match = VTT_TIME_RE.exec(timeStr.trim());
  if (!match) return 0;

  const [, hours, minutes, seconds, millis] = match;
  return (
    Number(hours ?? 0) * HOURS_MS +
    Number(minutes) * MINUTES_MS +
    Number(seconds) * SECONDS_MS +
    millisFromFraction(millis)
  );
}
