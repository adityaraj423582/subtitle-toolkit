import { describe, expect, it } from "vitest";
import {
  msToSRTTime,
  msToVTTTime,
  srtTimeToMs,
  vttTimeToMs,
} from "../time-utils";

describe("msToSRTTime", () => {
  it("formats a typical duration", () => {
    expect(msToSRTTime(20_000)).toBe("00:00:20,000");
    expect(msToSRTTime(24_400)).toBe("00:00:24,400");
  });

  it("handles 0ms", () => {
    expect(msToSRTTime(0)).toBe("00:00:00,000");
  });

  it("handles negative/invalid input by clamping to 0", () => {
    expect(msToSRTTime(-500)).toBe("00:00:00,000");
    expect(msToSRTTime(Number.NaN)).toBe("00:00:00,000");
  });

  it("handles durations over 99 hours without breaking padding", () => {
    // 100 hours, 1 minute, 2 seconds, 3 ms.
    const ms = 100 * 3_600_000 + 1 * 60_000 + 2 * 1000 + 3;
    expect(msToSRTTime(ms)).toBe("100:01:02,003");
  });

  it("zero-pads hours, minutes, seconds, and milliseconds", () => {
    const ms = 1 * 3_600_000 + 2 * 60_000 + 3 * 1000 + 4;
    expect(msToSRTTime(ms)).toBe("01:02:03,004");
  });
});

describe("msToVTTTime", () => {
  it("formats a typical duration with a period before milliseconds", () => {
    expect(msToVTTTime(20_000)).toBe("00:00:20.000");
  });

  it("handles 0ms", () => {
    expect(msToVTTTime(0)).toBe("00:00:00.000");
  });

  it("handles durations over 99 hours", () => {
    const ms = 100 * 3_600_000 + 1 * 60_000 + 2 * 1000 + 3;
    expect(msToVTTTime(ms)).toBe("100:01:02.003");
  });
});

describe("srtTimeToMs", () => {
  it("parses a typical timestamp", () => {
    expect(srtTimeToMs("00:00:20,000")).toBe(20_000);
    expect(srtTimeToMs("00:00:24,400")).toBe(24_400);
  });

  it("parses 0ms", () => {
    expect(srtTimeToMs("00:00:00,000")).toBe(0);
  });

  it("parses hours, minutes, seconds, and milliseconds correctly", () => {
    expect(srtTimeToMs("01:02:03,004")).toBe(
      1 * 3_600_000 + 2 * 60_000 + 3 * 1000 + 4,
    );
  });

  it("parses durations over 99 hours", () => {
    expect(srtTimeToMs("100:01:02,003")).toBe(
      100 * 3_600_000 + 1 * 60_000 + 2 * 1000 + 3,
    );
  });

  it("returns 0 for unparsable input instead of throwing", () => {
    expect(srtTimeToMs("not a timestamp")).toBe(0);
  });
});

describe("vttTimeToMs", () => {
  it("parses a full HH:MM:SS.mmm timestamp", () => {
    expect(vttTimeToMs("00:00:20.000")).toBe(20_000);
    expect(vttTimeToMs("00:00:24.400")).toBe(24_400);
  });

  it("parses a timestamp with the hours segment omitted", () => {
    expect(vttTimeToMs("00:20.000")).toBe(20_000);
  });

  it("parses 0ms", () => {
    expect(vttTimeToMs("00:00.000")).toBe(0);
  });

  it("parses durations over 1 hour with the hours segment present", () => {
    expect(vttTimeToMs("01:02:03.004")).toBe(
      1 * 3_600_000 + 2 * 60_000 + 3 * 1000 + 4,
    );
  });

  it("returns 0 for unparsable input instead of throwing", () => {
    expect(vttTimeToMs("nope")).toBe(0);
  });
});

describe("round-trip formatting", () => {
  it("SRT: msToSRTTime -> srtTimeToMs preserves the millisecond value", () => {
    for (const ms of [0, 1, 999, 20_000, 24_400, 3_723_004, 360_062_003]) {
      expect(srtTimeToMs(msToSRTTime(ms))).toBe(ms);
    }
  });

  it("VTT: msToVTTTime -> vttTimeToMs preserves the millisecond value", () => {
    for (const ms of [0, 1, 999, 20_000, 24_400, 3_723_004, 360_062_003]) {
      expect(vttTimeToMs(msToVTTTime(ms))).toBe(ms);
    }
  });
});
