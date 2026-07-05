/**
 * Shared internal representation used by every subtitle format reader/writer.
 * Parsers convert format-specific text into `SubtitleCue[]`; stringifiers
 * convert cues back into format-specific text.
 */
export interface SubtitleCue {
  index: number;
  /** Cue start time, in milliseconds. */
  startTime: number;
  /** Cue end time, in milliseconds. */
  endTime: number;
  /** Cue text. May contain `\n` for multi-line captions. */
  text: string;
}

export type SubtitleFormat = "srt" | "vtt";

export interface ParsedSubtitle {
  cues: SubtitleCue[];
  format: SubtitleFormat;
}
