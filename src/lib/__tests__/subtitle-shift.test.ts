import { describe, expect, it } from "vitest";
import { shiftCues } from "../subtitle-shift";
import type { SubtitleCue } from "../subtitle-formats";

const cues: SubtitleCue[] = [
  { index: 1, startTime: 1000, endTime: 2000, text: "a" },
  { index: 2, startTime: 5000, endTime: 6000, text: "b" },
];

describe("shiftCues", () => {
  it("adds a positive offset to every cue", () => {
    const shifted = shiftCues(cues, 1500);
    expect(shifted[0]).toMatchObject({ startTime: 2500, endTime: 3500 });
    expect(shifted[1]).toMatchObject({ startTime: 6500, endTime: 7500 });
  });

  it("subtracts a negative offset from every cue", () => {
    const shifted = shiftCues(cues, -500);
    expect(shifted[0]).toMatchObject({ startTime: 500, endTime: 1500 });
    expect(shifted[1]).toMatchObject({ startTime: 4500, endTime: 5500 });
  });

  it("clamps negative results to 0 instead of going below zero", () => {
    const shifted = shiftCues(cues, -1500);
    expect(shifted[0].startTime).toBe(0);
    expect(shifted[0].endTime).toBe(500);
  });

  it("preserves cue text and does not mutate the input array", () => {
    const shifted = shiftCues(cues, 100);
    expect(shifted[0].text).toBe("a");
    expect(cues[0].startTime).toBe(1000);
  });

  it("returns an empty array for no cues", () => {
    expect(shiftCues([], 1000)).toEqual([]);
  });

  it("is a no-op with a zero offset", () => {
    const shifted = shiftCues(cues, 0);
    expect(shifted).toEqual(cues);
  });
});
