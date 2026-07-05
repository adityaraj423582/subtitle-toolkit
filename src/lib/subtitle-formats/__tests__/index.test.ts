import { describe, expect, it } from "vitest";
import { convertSubtitle, detectFormat, parseSRT, parseVTT } from "../index";

const SAMPLE_SRT = `1
00:00:20,000 --> 00:00:24,400
Hello there.

2
00:00:24,600 --> 00:00:27,800
General Kenobi.
`;

describe("detectFormat", () => {
  it("detects from the .srt extension", () => {
    expect(detectFormat("movie.srt", "irrelevant")).toBe("srt");
  });

  it("detects from the .vtt extension", () => {
    expect(detectFormat("movie.vtt", "irrelevant")).toBe("vtt");
  });

  it("falls back to content sniffing when the extension is unknown", () => {
    expect(detectFormat("movie.txt", "WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHi")).toBe(
      "vtt",
    );
    expect(detectFormat("movie.txt", SAMPLE_SRT)).toBe("srt");
  });

  it("is case-insensitive on extension", () => {
    expect(detectFormat("movie.SRT", "irrelevant")).toBe("srt");
    expect(detectFormat("movie.VTT", "irrelevant")).toBe("vtt");
  });

  it("handles a WEBVTT header preceded by a BOM", () => {
    expect(detectFormat("movie.txt", "\uFEFFWEBVTT\n\n")).toBe("vtt");
  });
});

describe("convertSubtitle", () => {
  it("converts SRT to VTT", () => {
    const vtt = convertSubtitle(SAMPLE_SRT, "srt", "vtt");
    expect(vtt.startsWith("WEBVTT\n")).toBe(true);
    expect(vtt).toContain("00:00:20.000 --> 00:00:24.400");
    expect(vtt).toContain("Hello there.");
  });

  it("converts VTT to SRT", () => {
    const vtt = convertSubtitle(SAMPLE_SRT, "srt", "vtt");
    const srt = convertSubtitle(vtt, "vtt", "srt");
    expect(srt).toContain("00:00:20,000 --> 00:00:24,400");
    expect(srt).toContain("Hello there.");
  });

  it("throws a helpful error for unparsable, non-empty content", () => {
    expect(() => convertSubtitle("this is just random text\nwith no timestamps", "srt", "vtt")).toThrow(
      /doesn't look like a valid/i,
    );
  });

  it("does not throw for an empty file", () => {
    expect(convertSubtitle("", "srt", "vtt")).toBe("WEBVTT\n\n");
  });
});

describe("SRT -> VTT -> SRT round-trip", () => {
  it("preserves all cue text and timing exactly", () => {
    const originalCues = parseSRT(SAMPLE_SRT);

    const vtt = convertSubtitle(SAMPLE_SRT, "srt", "vtt");
    const backToSrt = convertSubtitle(vtt, "vtt", "srt");
    const finalCues = parseSRT(backToSrt);

    expect(finalCues).toHaveLength(originalCues.length);
    finalCues.forEach((cue, i) => {
      expect(cue.text).toBe(originalCues[i].text);
      expect(cue.startTime).toBe(originalCues[i].startTime);
      expect(cue.endTime).toBe(originalCues[i].endTime);
    });
  });

  it("preserves timing across the hour boundary", () => {
    const hourCrossing = `1
00:59:59,500 --> 01:00:02,250
Crossing the hour mark
`;
    const vtt = convertSubtitle(hourCrossing, "srt", "vtt");
    const cuesFromVtt = parseVTT(vtt);
    expect(cuesFromVtt[0].startTime).toBe(59 * 60_000 + 59_500);
    expect(cuesFromVtt[0].endTime).toBe(60 * 60_000 + 2_250);

    const backToSrt = convertSubtitle(vtt, "vtt", "srt");
    expect(backToSrt).toContain("00:59:59,500 --> 01:00:02,250");
  });

  it("preserves timing at exactly 0ms", () => {
    const zeroStart = `1
00:00:00,000 --> 00:00:01,000
Starts at zero
`;
    const vtt = convertSubtitle(zeroStart, "srt", "vtt");
    expect(vtt).toContain("00:00:00.000 --> 00:00:01.000");
    const backToSrt = convertSubtitle(vtt, "vtt", "srt");
    expect(backToSrt).toContain("00:00:00,000 --> 00:00:01,000");
  });
});
