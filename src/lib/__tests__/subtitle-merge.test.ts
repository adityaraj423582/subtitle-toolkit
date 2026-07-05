import { describe, expect, it } from "vitest";
import { mergeDualLanguage, mergeSequential } from "../subtitle-merge";
import type { SubtitleCue } from "../subtitle-formats";

const partOne: SubtitleCue[] = [
  { index: 1, startTime: 0, endTime: 1000, text: "Part one, line one" },
  { index: 2, startTime: 2000, endTime: 3000, text: "Part one, line two" },
];

const partTwo: SubtitleCue[] = [
  { index: 1, startTime: 0, endTime: 1000, text: "Part two, line one" },
  { index: 2, startTime: 1500, endTime: 2500, text: "Part two, line two" },
];

describe("mergeSequential", () => {
  it("shifts the second file to start right after the first ends", () => {
    const merged = mergeSequential(partOne, partTwo);
    expect(merged).toHaveLength(4);
    expect(merged[2].startTime).toBe(3000);
    expect(merged[2].endTime).toBe(4000);
    expect(merged[3].startTime).toBe(4500);
    expect(merged[3].endTime).toBe(5500);
  });

  it("applies an optional gap between the two parts", () => {
    const merged = mergeSequential(partOne, partTwo, 2000);
    expect(merged[2].startTime).toBe(5000);
    expect(merged[2].endTime).toBe(6000);
  });

  it("renumbers indices sequentially across both files", () => {
    const merged = mergeSequential(partOne, partTwo);
    expect(merged.map((c) => c.index)).toEqual([1, 2, 3, 4]);
  });

  it("preserves text from both files", () => {
    const merged = mergeSequential(partOne, partTwo);
    expect(merged[0].text).toBe("Part one, line one");
    expect(merged[3].text).toBe("Part two, line two");
  });

  it("handles an empty first file by not offsetting the second at all", () => {
    const merged = mergeSequential([], partTwo);
    expect(merged[0].startTime).toBe(0);
    expect(merged[0].endTime).toBe(1000);
  });

  it("ignores a negative gap instead of shifting backward", () => {
    const merged = mergeSequential(partOne, partTwo, -5000);
    expect(merged[2].startTime).toBe(3000);
  });
});

describe("mergeDualLanguage", () => {
  const english: SubtitleCue[] = [
    { index: 1, startTime: 0, endTime: 2000, text: "Hello" },
    { index: 2, startTime: 3000, endTime: 5000, text: "How are you?" },
  ];
  const spanish: SubtitleCue[] = [
    { index: 1, startTime: 100, endTime: 2100, text: "Hola" },
    { index: 2, startTime: 3200, endTime: 4800, text: "¿Cómo estás?" },
  ];

  it("merges overlapping cues with a two-line text", () => {
    const { cues } = mergeDualLanguage(english, spanish);
    expect(cues[0].text).toBe("Hello\nHola");
    expect(cues[1].text).toBe("How are you?\n¿Cómo estás?");
  });

  it("uses the wider (more permissive) time range for the merged cue", () => {
    const { cues } = mergeDualLanguage(english, spanish);
    expect(cues[0].startTime).toBe(0);
    expect(cues[0].endTime).toBe(2100);
  });

  it("keeps only file A's text when no overlapping cue exists in file B", () => {
    const noOverlapB: SubtitleCue[] = [{ index: 1, startTime: 10_000, endTime: 11_000, text: "Unrelated" }];
    const { cues } = mergeDualLanguage(english, noOverlapB);
    expect(cues[0].text).toBe("Hello");
    expect(cues[1].text).toBe("How are you?");
  });

  it("flags a cue-count mismatch between the two files", () => {
    const shortSpanish = spanish.slice(0, 1);
    const { hasCountMismatch } = mergeDualLanguage(english, shortSpanish);
    expect(hasCountMismatch).toBe(true);
  });

  it("does not flag a mismatch when cue counts match", () => {
    const { hasCountMismatch } = mergeDualLanguage(english, spanish);
    expect(hasCountMismatch).toBe(false);
  });

  it("renumbers indices sequentially starting at 1", () => {
    const { cues } = mergeDualLanguage(english, spanish);
    expect(cues.map((c) => c.index)).toEqual([1, 2]);
  });

  it("picks the best-overlapping cue when multiple candidates exist", () => {
    const busyB: SubtitleCue[] = [
      { index: 1, startTime: 0, endTime: 200, text: "Tiny sliver" },
      { index: 2, startTime: 0, endTime: 2000, text: "Full overlap" },
    ];
    const { cues } = mergeDualLanguage([english[0]], busyB);
    expect(cues[0].text).toBe("Hello\nFull overlap");
  });
});
