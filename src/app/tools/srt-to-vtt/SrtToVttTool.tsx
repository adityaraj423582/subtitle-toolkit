"use client";

import { useState } from "react";
import { ArrowRight, Download, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { convertSubtitle, detectFormat, type SubtitleFormat } from "@/lib/subtitle-formats";

interface ConversionResult {
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

function otherFormat(format: SubtitleFormat): SubtitleFormat {
  return format === "srt" ? "vtt" : "srt";
}

function buildOutputFilename(originalName: string, targetFormat: SubtitleFormat): string {
  const baseName = originalName.replace(/\.(srt|vtt)$/i, "");
  return `${baseName || "subtitles"}.${targetFormat}`;
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

const FORMAT_LABEL: Record<SubtitleFormat, string> = {
  srt: "SRT",
  vtt: "VTT",
};

export function SrtToVttTool() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState<SubtitleFormat | null>(null);
  const [targetFormat, setTargetFormat] = useState<SubtitleFormat>("vtt");
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  async function handleFileSelect(selected: File) {
    setResult(null);
    setFile(selected);

    try {
      const content = await readFileAsText(selected);
      const detected = detectFormat(selected.name, content);
      setSourceFormat(detected);
      setTargetFormat(otherFormat(detected));
    } catch {
      toast.error("Couldn't read that file", {
        description: "Please try again or choose a different file.",
      });
      handleClear();
    }
  }

  function handleClear() {
    setFile(null);
    setSourceFormat(null);
    setTargetFormat("vtt");
    setResult(null);
  }

  async function handleConvert() {
    if (!file || !sourceFormat) return;

    setIsConverting(true);
    setResult(null);

    try {
      const content = await readFileAsText(file);
      const converted = convertSubtitle(content, sourceFormat, targetFormat);
      const filename = buildOutputFilename(file.name, targetFormat);
      setResult({ content: converted, filename });
      toast.success("Conversion complete", {
        description: `${filename} is ready to download.`,
      });
    } catch {
      toast.error("This doesn't look like a valid SRT or VTT file", {
        description: "Double-check the file and try again.",
      });
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    downloadTextFile(result.content, result.filename);
  }

  return (
    <Card className="rounded-xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Convert your subtitle file</CardTitle>
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

        {file && sourceFormat ? (
          <>
            <Separator />

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground">
                {FORMAT_LABEL[sourceFormat]}
              </span>
              <ArrowRight className="size-4 text-muted-foreground" />
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                {(["srt", "vtt"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setTargetFormat(fmt)}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      targetFormat === fmt
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {FORMAT_LABEL[fmt]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                size="lg"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full sm:w-auto"
              >
                {isConverting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                Convert to {FORMAT_LABEL[targetFormat]}
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
