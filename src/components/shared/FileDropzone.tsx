"use client";

import { useCallback, useId, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  /** File extensions to accept, e.g. [".srt", ".vtt"]. Case-insensitive. */
  accept?: string[];
  /** The currently selected file, if any — shown as a summary instead of the dropzone. */
  selectedFile?: File | null;
  /** Called with a newly chosen file once it passes the `accept` check. */
  onFileSelect: (file: File) => void;
  /** Called when the user clears the current selection. */
  onClear?: () => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unitIndex]}`;
}

function isAcceptedFile(file: File, accept: string[]): boolean {
  if (accept.length === 0) return true;
  const name = file.name.toLowerCase();
  return accept.some((ext) => name.endsWith(ext.toLowerCase()));
}

/**
 * Drag-and-drop (or click-to-browse) file picker. Purely client-side — it
 * never uploads anything, it just hands the selected `File` back to the
 * caller for local processing.
 */
export function FileDropzone({
  accept = [],
  selectedFile,
  onFileSelect,
  onClear,
  className,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;

      if (!isAcceptedFile(file, accept)) {
        toast.error("Unsupported file type", {
          description: `Please choose a file with one of these extensions: ${accept.join(", ")}`,
        });
        return;
      }

      onFileSelect(file);
    },
    [accept, onFileSelect],
  );

  if (selectedFile) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3",
          className,
        )}
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {selectedFile.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
        {onClear ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove file"
            onClick={onClear}
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <label
      htmlFor={inputId}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-muted/50",
        isDragging && "border-primary bg-primary/5",
        className,
      )}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          // Allow re-selecting the same file after clearing.
          event.target.value = "";
        }}
      />
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <UploadCloud className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Drag &amp; drop your file here
        </p>
        <p className="text-xs text-muted-foreground">
          {accept.length
            ? `or click to browse · ${accept.join(", ")}`
            : "or click to browse"}
        </p>
      </div>
    </label>
  );
}
