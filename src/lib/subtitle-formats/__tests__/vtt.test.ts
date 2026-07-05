import { describe, expect, it } from "vitest";
import { parseVTT, stringifyVTT } from "../vtt";

const BASIC_VTT = `WEBVTT

00:00:20.000 --> 00:00:24.400
Hello there.

00:00:24.600 --> 00:00:27.800
General Kenobi.
`;

describe("parseVTT", () => {
  it("parses a well-formed file into cues", () => {
    const cues = parseVTT(BASIC_VTT);
    expect(cues).toHaveLength(2);
    expect(cues[0]).toMatchObject({
      startTime: 20_000,
      endTime: 24_400,
      text: "Hello there.",
    });
    expect(cues[1]).toMatchObject({
      startTime: 24_600,
      endTime: 27_800,
      text: "General Kenobi.",
    });
  });

  it("requires the WEBVTT header to be present but tolerates extra header text", () => {
    const withKind = `WEBVTT - Some Title
Kind: captions
Language: en

00:00:01.000 --> 00:00:02.000
Captioned line
`;
    const cues = parseVTT(withKind);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Captioned line");
  });

  it("handles cue identifiers before the timing line", () => {
    const withIdentifier = `WEBVTT

intro-1
00:00:01.000 --> 00:00:02.000
Identified cue
`;
    const cues = parseVTT(withIdentifier);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Identified cue");
  });

  it("handles cue settings after the timestamp", () => {
    const withSettings = `WEBVTT

00:00:01.000 --> 00:00:02.000 align:start position:10%
Positioned cue
`;
    const cues = parseVTT(withSettings);
    expect(cues).toHaveLength(1);
    expect(cues[0].startTime).toBe(1000);
    expect(cues[0].endTime).toBe(2000);
    expect(cues[0].text).toBe("Positioned cue");
  });

  it("allows the hours segment to be omitted from timestamps", () => {
    const cues = parseVTT(`WEBVTT\n\n00:20.000 --> 00:24.400\nNo hours\n`);
    expect(cues[0].startTime).toBe(20_000);
    expect(cues[0].endTime).toBe(24_400);
  });

  it("skips single-line NOTE comments", () => {
    const withNote = `WEBVTT

NOTE this is just a comment

00:00:01.000 --> 00:00:02.000
Real cue
`;
    const cues = parseVTT(withNote);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Real cue");
  });

  it("skips multi-line NOTE blocks", () => {
    const withNoteBlock = `WEBVTT

NOTE
This is a longer comment
spanning multiple lines

00:00:01.000 --> 00:00:02.000
Real cue
`;
    const cues = parseVTT(withNoteBlock);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Real cue");
  });

  it("skips STYLE blocks", () => {
    const withStyle = `WEBVTT

STYLE
::cue {
  color: yellow;
}

00:00:01.000 --> 00:00:02.000
Styled-but-plain cue
`;
    const cues = parseVTT(withStyle);
    expect(cues).toHaveLength(1);
    expect(cues[0].text).toBe("Styled-but-plain cue");
  });

  it("handles multi-line cue text", () => {
    const content = `WEBVTT

00:00:01.000 --> 00:00:02.000
Line one
Line two
`;
    const cues = parseVTT(content);
    expect(cues[0].text).toBe("Line one\nLine two");
  });

  it("handles Windows (CRLF) line endings", () => {
    const crlf = BASIC_VTT.replace(/\n/g, "\r\n");
    const cues = parseVTT(crlf);
    expect(cues).toHaveLength(2);
  });

  it("strips a leading UTF-8 BOM", () => {
    const withBom = "\uFEFF" + BASIC_VTT;
    const cues = parseVTT(withBom);
    expect(cues).toHaveLength(2);
  });

  it("returns an empty array for an empty file", () => {
    expect(parseVTT("")).toEqual([]);
  });

  it("parses a file with a single cue", () => {
    const cues = parseVTT(`WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nOnly one\n`);
    expect(cues).toHaveLength(1);
  });

  it("handles timestamps over 1 hour", () => {
    const cues = parseVTT(
      `WEBVTT\n\n01:02:03.004 --> 01:02:05.004\nLate cue\n`,
    );
    expect(cues[0].startTime).toBe(1 * 3_600_000 + 2 * 60_000 + 3 * 1000 + 4);
  });
});

describe("stringifyVTT", () => {
  it("always starts with the WEBVTT header", () => {
    const output = stringifyVTT([]);
    expect(output.startsWith("WEBVTT\n")).toBe(true);
  });

  it("renders valid VTT text from cues", () => {
    const cues = parseVTT(BASIC_VTT);
    const output = stringifyVTT(cues);
    expect(output).toBe(BASIC_VTT);
  });
});

describe("VTT round-trip", () => {
  it("preserves cue count and text through parse -> stringify", () => {
    const original = parseVTT(BASIC_VTT);
    const roundTripped = parseVTT(stringifyVTT(original));

    expect(roundTripped).toHaveLength(original.length);
    roundTripped.forEach((cue, i) => {
      expect(cue.text).toBe(original[i].text);
      expect(cue.startTime).toBe(original[i].startTime);
      expect(cue.endTime).toBe(original[i].endTime);
    });
  });
});
