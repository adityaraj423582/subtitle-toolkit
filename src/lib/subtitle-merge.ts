import type { SubtitleCue } from "@/lib/subtitle-formats";
import { shiftCues } from "@/lib/subtitle-shift";

function renumber(cues: SubtitleCue[]): SubtitleCue[] {
  return cues.map((cue, i) => ({ ...cue, index: i + 1 }));
}

/**
 * Concatenates two cue lists sequentially — every cue in `cuesB` is shifted
 * to start right after the last cue in `cuesA` ends (plus an optional gap),
 * then both lists are combined and renumbered from 1.
 */
export function mergeSequential(
  cuesA: SubtitleCue[],
  cuesB: SubtitleCue[],
  gapMs = 0,
): SubtitleCue[] {
  const lastEndA = cuesA.reduce((max, cue) => Math.max(max, cue.endTime), 0);
  const offset = lastEndA + Math.max(0, gapMs);
  const shiftedB = shiftCues(cuesB, offset);

  return renumber([...cuesA, ...shiftedB]);
}

function overlapMs(a: SubtitleCue, b: SubtitleCue): number {
  return Math.max(0, Math.min(a.endTime, b.endTime) - Math.max(a.startTime, b.startTime));
}

export interface DualLanguageMergeResult {
  cues: SubtitleCue[];
  /** True when the two files have a different cue count, a sign that timing may not line up well. */
  hasCountMismatch: boolean;
}

/**
 * Combines two cue lists into a single bilingual track: for each cue in
 * `cuesA`, the best-overlapping cue in `cuesB` (by shared time range) is
 * found and its text appended on a second line. The merged cue spans the
 * more permissive (wider) of the two time ranges. Cues in `cuesA` with no
 * overlapping match in `cuesB` keep only their own text.
 */
export function mergeDualLanguage(
  cuesA: SubtitleCue[],
  cuesB: SubtitleCue[],
): DualLanguageMergeResult {
  const merged = cuesA.map((cueA) => {
    let bestMatch: SubtitleCue | null = null;
    let bestOverlap = 0;

    for (const cueB of cuesB) {
      const overlap = overlapMs(cueA, cueB);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestMatch = cueB;
      }
    }

    if (!bestMatch) {
      return { ...cueA };
    }

    return {
      ...cueA,
      startTime: Math.min(cueA.startTime, bestMatch.startTime),
      endTime: Math.max(cueA.endTime, bestMatch.endTime),
      text: `${cueA.text}\n${bestMatch.text}`,
    };
  });

  return {
    cues: renumber(merged),
    hasCountMismatch: cuesA.length !== cuesB.length,
  };
}
