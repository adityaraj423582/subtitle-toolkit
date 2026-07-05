import type { SubtitleCue } from "@/lib/subtitle-formats";

/**
 * Shifts every cue's start/end time by `offsetMs` (positive = later,
 * negative = earlier). Resulting negative timestamps are clamped to 0 rather
 * than allowed to go below zero. Does not mutate the input cues.
 */
export function shiftCues(cues: SubtitleCue[], offsetMs: number): SubtitleCue[] {
  return cues.map((cue) => ({
    ...cue,
    startTime: Math.max(0, cue.startTime + offsetMs),
    endTime: Math.max(0, cue.endTime + offsetMs),
  }));
}
