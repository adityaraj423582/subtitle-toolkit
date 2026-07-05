"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { shiftCues } from "@/lib/subtitle-shift";
import {
  detectFormat,
  msToSRTTime,
  msToVTTTime,
  parseSRT,
  parseVTT,
  stringifySRT,
  stringifyVTT,
  type SubtitleCue,
  type SubtitleFormat,
} from "@/lib/subtitle-formats";

type TimeUnit = "seconds" | "milliseconds";
type ShiftDirection = "forward" | "backward";

interface ShiftResult {
  content: string;
  filename: string;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

function formatTime(ms: number, format: SubtitleFormat): string {
  return format === "srt" ? msToSRTTime(ms) : msToVTTTime(ms);
}

function computeOffsetMs(rawValue: string, unit: TimeUnit, direction: ShiftDirection): number {
  const parsed = Number.parseFloat(rawValue);
  const magnitude = Number.isFinite(parsed) ? Math.abs(parsed) : 0;
  const ms = unit === "seconds" ? magnitude * 1000 : magnitude;
  return direction === "forward" ? ms : -ms;
}

function buildShiftedFilename(originalName: string, format: SubtitleFormat): string {
  const baseName = originalName.replace(/\.(srt|vtt)$/i, "");
  return `${baseName || "subtitles"}-shifted.${format}`;
}

function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function SubtitleShifterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<SubtitleFormat | null>(null);
  const [cues, setCues] = useState<SubtitleCue[] | null>(null);
  const [offsetInput, setOffsetInput] = useState("1");
  const [unit, setUnit] = useState<TimeUnit>("seconds");
  const [direction, setDirection] = useState<ShiftDirection>("forward");
  const [result, setResult] = useState<ShiftResult | null>(null);

  const offsetMs = useMemo(
    () => computeOffsetMs(offsetInput, unit, direction),
    [offsetInput, unit, direction],
  );

  const shiftedCues = useMemo(
    () => (cues ? shiftCues(cues, offsetMs) : []),
    [cues, offsetMs],
  );

  async function handleFileSelect(selected: File) {
    setResult(null);
    setFile(selected);
    setCues(null);
    setFormat(null);

    try {
      const content = await readFileAsText(selected);
      const detected = detectFormat(selected.name, content);
      const parsedCues = detected === "srt" ? parseSRT(content) : parseVTT(content);

      if (parsedCues.length === 0 && content.trim() !== "") {
        throw new Error("No cues found");
      }

      setFormat(detected);
      setCues(parsedCues);
    } catch {
      toast.error("This doesn't look like a valid SRT or VTT file", {
        description: "Double-check the file and try again.",
      });
      handleClear();
    }
  }

  function handleClear() {
    setFile(null);
    setFormat(null);
    setCues(null);
    setResult(null);
  }

  function handleApply() {
    if (!file || !format || !cues) return;

    try {
      const content = format === "srt" ? stringifySRT(shiftedCues) : stringifyVTT(shiftedCues);
      const filename = buildShiftedFilename(file.name, format);
      setResult({ content, filename });
      toast.success("Timing shifted", {
        description: `${filename} is ready to download.`,
      });
    } catch {
      toast.error("Couldn't shift that file", {
        description: "Please try again or choose a different file.",
      });
    }
  }

  function handleDownload() {
    if (!result) return;
    downloadTextFile(result.content, result.filename);
  }

  const previewCues = cues?.slice(0, 3) ?? [];
  const previewShifted = shiftedCues.slice(0, 3);

  return (
    <Card className="rounded-xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Shift your subtitle timing</CardTitle>
        <CardDescription>
          Everything happens locally in your browser — nothing is uploaded.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileDropzone
          accept={[".srt", ".vtt"]}
          selectedFile={file}
          onFileSelect={handleFileSelect}
          onClear={handleClear}
        />

        {file && format && cues ? (
          <>
            <Separator />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-center">
              <div className="space-y-1.5">
                <Label htmlFor="shift-offset">Shift by</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="shift-offset"
                    type="number"
                    inputMode="decimal"
                    step={unit === "seconds" ? "0.1" : "1"}
                    min="0"
                    value={offsetInput}
                    onChange={(event) => setOffsetInput(event.target.value)}
                    className="w-24"
                  />
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                    {(["seconds", "milliseconds"] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnit(u)}
                        className={`rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                          unit === u
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {u === "seconds" ? "sec" : "ms"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Direction</Label>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                  <button
                    type="button"
                    onClick={() => setDirection("backward")}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                      direction === "backward"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ChevronLeft className="size-3.5" />
                    Backward
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("forward")}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                      direction === "forward"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Forward
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Live preview (first {previewCues.length} cue
                {previewCues.length === 1 ? "" : "s"})
              </p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 text-xs font-medium text-muted-foreground">
                  <span>Original</span>
                  <span>Shifted</span>
                </div>
                {previewCues.map((cue, i) => (
                  <div key={cue.index} className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <span className="truncate text-muted-foreground">
                      {formatTime(cue.startTime, format)} → {formatTime(cue.endTime, format)}
                    </span>
                    <span className="truncate text-foreground">
                      {formatTime(previewShifted[i].startTime, format)} →{" "}
                      {formatTime(previewShifted[i].endTime, format)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button type="button" size="lg" onClick={handleApply} className="w-full sm:w-auto">
                <Zap className="size-4" />
                Apply Shift
              </Button>

              {result ? (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handleDownload}
                  className="w-full sm:w-auto"
                >
                  <Download className="size-4" />
                  Download {result.filename}
                </Button>
              ) : null}
            </div>

            <div className="flex justify-center">
              <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
                <RotateCcw className="size-3.5" />
                Start over
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
