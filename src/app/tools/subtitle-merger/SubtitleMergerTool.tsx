"use client";

import { useState } from "react";
import { Combine, Download, RotateCcw } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { SupportModalContent } from "@/components/shared/SupportButton";
import { markSupportNudgeShown, shouldShowSupportNudge } from "@/lib/support-nudge";
import { mergeDualLanguage, mergeSequential } from "@/lib/subtitle-merge";
import {
  detectFormat,
  parseSRT,
  parseVTT,
  stringifySRT,
  stringifyVTT,
  type SubtitleCue,
  type SubtitleFormat,
} from "@/lib/subtitle-formats";

const TOOL_SLUG = "subtitle-merger";

type MergeMode = "sequential" | "dual";

interface MergeResult {
  content: string;
  filename: string;
}

interface FileSlot {
  file: File | null;
  format: SubtitleFormat | null;
  cues: SubtitleCue[] | null;
}

const EMPTY_SLOT: FileSlot = { file: null, format: null, cues: null };

const FORMAT_LABEL: Record<SubtitleFormat, string> = {
  srt: "SRT",
  vtt: "VTT",
};

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsText(file);
  });
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

export function SubtitleMergerTool() {
  const [slotA, setSlotA] = useState<FileSlot>(EMPTY_SLOT);
  const [slotB, setSlotB] = useState<FileSlot>(EMPTY_SLOT);
  const [mode, setMode] = useState<MergeMode>("sequential");
  const [gapInput, setGapInput] = useState("0");
  const [outputFormat, setOutputFormat] = useState<SubtitleFormat>("srt");
  const [outputFormatTouched, setOutputFormatTouched] = useState(false);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);

  async function loadSlot(file: File): Promise<FileSlot> {
    const content = await readFileAsText(file);
    const detected = detectFormat(file.name, content);
    const cues = detected === "srt" ? parseSRT(content) : parseVTT(content);

    if (cues.length === 0 && content.trim() !== "") {
      throw new Error("No cues found");
    }

    return { file, format: detected, cues };
  }

  async function handleFileASelect(file: File) {
    setResult(null);
    setSlotA({ file, format: null, cues: null });

    try {
      const slot = await loadSlot(file);
      setSlotA(slot);
      if (!outputFormatTouched && slot.format) {
        setOutputFormat(slot.format);
      }
    } catch {
      toast.error("This doesn't look like a valid SRT or VTT file", {
        description: "Double-check File A and try again.",
      });
      setSlotA(EMPTY_SLOT);
    }
  }

  async function handleFileBSelect(file: File) {
    setResult(null);
    setSlotB({ file, format: null, cues: null });

    try {
      const slot = await loadSlot(file);
      setSlotB(slot);
    } catch {
      toast.error("This doesn't look like a valid SRT or VTT file", {
        description: "Double-check File B and try again.",
      });
      setSlotB(EMPTY_SLOT);
    }
  }

  function handleClearA() {
    setSlotA(EMPTY_SLOT);
    setResult(null);
  }

  function handleClearB() {
    setSlotB(EMPTY_SLOT);
    setResult(null);
  }

  function handleMerge() {
    if (!slotA.cues || !slotB.cues) return;

    try {
      let mergedCues: SubtitleCue[];

      if (mode === "sequential") {
        const gapMs = Number.parseFloat(gapInput);
        mergedCues = mergeSequential(slotA.cues, slotB.cues, Number.isFinite(gapMs) ? gapMs : 0);
      } else {
        const { cues, hasCountMismatch } = mergeDualLanguage(slotA.cues, slotB.cues);
        mergedCues = cues;
        if (hasCountMismatch) {
          toast.warning("Cue counts don't match", {
            description:
              "File A and File B have a different number of cues, so the dual-language alignment may be imperfect. Proceeding anyway.",
          });
        }
      }

      const content =
        outputFormat === "srt" ? stringifySRT(mergedCues) : stringifyVTT(mergedCues);
      const filename = `merged-subtitles.${outputFormat}`;
      setResult({ content, filename });
      toast.success("Files merged", {
        description: `${filename} is ready to download.`,
      });
    } catch {
      toast.error("Couldn't merge those files", {
        description: "Please double-check both files and try again.",
      });
    }
  }

  function handleDownload() {
    if (!result) return;
    downloadTextFile(result.content, result.filename);

    if (shouldShowSupportNudge(TOOL_SLUG)) {
      toast("Glad that helped! If SubtitleToolkit saved you time, consider supporting it ☕", {
        action: {
          label: "Support",
          onClick: () => setSupportOpen(true),
        },
      });
      markSupportNudgeShown(TOOL_SLUG);
    }
  }

  function handleStartOver() {
    setSlotA(EMPTY_SLOT);
    setSlotB(EMPTY_SLOT);
    setGapInput("0");
    setOutputFormat("srt");
    setOutputFormatTouched(false);
    setResult(null);
  }

  const canMerge = Boolean(slotA.cues && slotB.cues);
  const slotAHint = mode === "sequential" ? "Plays first" : "Primary language (line 1)";
  const slotBHint = mode === "sequential" ? "Plays second" : "Secondary language (line 2)";

  return (
    <Card className="rounded-xl border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Merge two subtitle files</CardTitle>
        <CardDescription>
          Everything happens locally in your browser — nothing is uploaded.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={mode} onValueChange={(value) => setMode(value as MergeMode)}>
          <TabsList className="w-full">
            <TabsTrigger value="sequential">Sequential (Part 1 + Part 2)</TabsTrigger>
            <TabsTrigger value="dual">Dual Language</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>File A</Label>
              <span className="text-xs text-muted-foreground">{slotAHint}</span>
            </div>
            <FileDropzone
              accept={[".srt", ".vtt"]}
              selectedFile={slotA.file}
              onFileSelect={handleFileASelect}
              onClear={handleClearA}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>File B</Label>
              <span className="text-xs text-muted-foreground">{slotBHint}</span>
            </div>
            <FileDropzone
              accept={[".srt", ".vtt"]}
              selectedFile={slotB.file}
              onFileSelect={handleFileBSelect}
              onClear={handleClearB}
            />
          </div>
        </div>

        {canMerge ? (
          <>
            <Separator />

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {mode === "sequential" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="merge-gap">Gap between parts (ms)</Label>
                  <Input
                    id="merge-gap"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={gapInput}
                    onChange={(event) => setGapInput(event.target.value)}
                    className="w-32"
                  />
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label>Output format</Label>
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                  {(["srt", "vtt"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        setOutputFormat(fmt);
                        setOutputFormatTouched(true);
                      }}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        outputFormat === fmt
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {FORMAT_LABEL[fmt]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button type="button" size="lg" onClick={handleMerge} className="w-full sm:w-auto">
                <Combine className="size-4" />
                Merge Files
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
              <Button type="button" variant="ghost" size="sm" onClick={handleStartOver}>
                <RotateCcw className="size-3.5" />
                Start over
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent>
          <SupportModalContent />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
