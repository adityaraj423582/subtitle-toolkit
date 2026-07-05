import { describe, expect, it } from "vitest";
import { parseSRT, stringifySRT } from "../srt";

const BASIC_SRT = `1
00:00:20,000 --> 00:00:24,400
Hello there.

2
00:00:24,600 --> 00:00:27,800
General Kenobi.
`;

describe("parseSRT", () => {
  it("parses a well-formed file into cues", () => {
    const cues = parseSRT(BASIC_SRT);
    expect(cues).toHaveLength(2);
    expect(cues[0]).toMatchObject({
      index: 1,
      startTime: 20_000,
      endTime: 24_400,
      text: "Hello there.",
    });
    expect(cues[1]).toMatchObject({
      index: 2,
      startTime: 24_600,
      endTime: 27_800,
      text: "General Kenobi.",
    });
  });

  it("handles multi-line cue text", () => {
    const content = `1
00:00:01,000 --> 00:00:02,000
Line one
Line two
Line three
`;
    const cues = parseSRT(content);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Line one\nLine two\nLine three");
  });

  it("handles Windows (CRLF) line endings", () => {
    const crlf = BASIC_SRT.replace(/\n/g, "\r\n");
    const cues = parseSRT(crlf);
    expect(cues).toHaveLength(2);
    expect(cues[0].text).toBe("Hello there.");
    expect(cues[1].text).toBe("General Kenobi.");
  });

  it("strips a leading UTF-8 BOM", () => {
    const withBom = "\uFEFF" + BASIC_SRT;
    const cues = parseSRT(withBom);
    expect(cues).toHaveLength(2);
    expect(cues[0].startTime).toBe(20_000);
  });

  it("is lenient about missing blank lines between blocks", () => {
    const noBlankLines = `1
00:00:01,000 --> 00:00:02,000
First cue
2
00:00:03,000 --> 00:00:04,000
Second cue`;
    const cues = parseSRT(noBlankLines);
    expect(cues).toHaveLength(2);
    expect(cues[0].text).toBe("First cue");
    expect(cues[1].text).toBe("Second cue");
  });

  it("is lenient about a missing index line", () => {
    const noIndex = `00:00:01,000 --> 00:00:02,000
Only text here
`;
    const cues = parseSRT(noIndex);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Only text here");
  });

  it("returns an empty array for an empty file", () => {
    expect(parseSRT("")).toEqual([]);
  });

  it("returns an empty array for whitespace-only content", () => {
    expect(parseSRT("   \n\n  \n")).toEqual([]);
  });

  it("parses a file with a single cue", () => {
    const cues = parseSRT(`1\n00:00:00,000 --> 00:00:01,000\nOnly one\n`);
    expect(cues).toHaveLength(1);
  });

  it("handles timestamps over 1 hour", () => {
    const cues = parseSRT(`1\n01:02:03,004 --> 01:02:05,004\nLate cue\n`);
    expect(cues[0].startTime).toBe(1 * 3_600_000 + 2 * 60_000 + 3 * 1000 + 4);
  });
});

describe("stringifySRT", () => {
  it("renders valid SRT text from cues", () => {
    const cues = parseSRT(BASIC_SRT);
    const output = stringifySRT(cues);
    expect(output).toBe(BASIC_SRT);
  });

  it("renumbers indices sequentially starting at 1", () => {
    const cues = [
      { index: 9, startTime: 0, endTime: 1000, text: "a" },
      { index: 42, startTime: 1000, endTime: 2000, text: "b" },
    ];
    const output = stringifySRT(cues);
    expect(output.startsWith("1\n")).toBe(true);
    expect(output).toContain("\n2\n");
  });

  it("returns an empty string for no cues", () => {
    expect(stringifySRT([])).toBe("");
  });
});

describe("SRT round-trip", () => {
  it("preserves cue count and text through parse -> stringify", () => {
    const original = parseSRT(BASIC_SRT);
    const roundTripped = parseSRT(stringifySRT(original));

    expect(roundTripped).toHaveLength(original.length);
    roundTripped.forEach((cue, i) => {
      expect(cue.text).toBe(original[i].text);
      expect(cue.startTime).toBe(original[i].startTime);
      expect(cue.endTime).toBe(original[i].endTime);
    });
  });
});
