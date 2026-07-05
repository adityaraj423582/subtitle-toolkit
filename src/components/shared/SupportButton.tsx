"use client";

import { useState } from "react";
import Image from "next/image";
import { Coffee, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// The only two values that need to change if the UPI ID or QR code ever
// need to be updated.
const UPI_ID = "adityaraj423582-1@oksbi";
const QR_IMAGE_SRC = "/upi-qr.png";

async function copyUpiId() {
  try {
    await navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  } catch {
    toast.error("Couldn't copy the UPI ID", {
      description: "Please copy it manually instead.",
    });
  }
}

/**
 * The support modal's body — pulled out on its own so it can be reused by
 * both the standalone `SupportButton` (Header/Footer) and by a tool's own
 * locally-controlled `Dialog` when opened from a toast action.
 */
export function SupportModalContent() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Support SubtitleToolkit</DialogTitle>
        <DialogDescription>
          If SubtitleToolkit saved you time, consider supporting it with any
          amount — even ₹10 helps!
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center gap-4 py-2">
        <Image
          src={QR_IMAGE_SRC}
          alt="UPI QR code"
          width={240}
          height={240}
          className="rounded-xl border border-border object-contain"
        />
        <div className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5">
          <code className="text-sm text-foreground">UPI ID: {UPI_ID}</code>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Copy UPI ID"
            onClick={copyUpiId}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}

interface SupportButtonProps {
  /** "header" is compact/unobtrusive; "footer" is a touch more prominent. */
  variant?: "header" | "footer";
  className?: string;
}

/**
 * A small "buy me a coffee"-style pill button that opens a modal with UPI
 * donation details. Deliberately styled with a warm amber accent so it
 * doesn't blend into the site's indigo brand color.
 */
export function SupportButton({ variant = "header", className }: SupportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={variant === "footer" ? "default" : "sm"}
          className={cn(
            "rounded-full border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60",
            variant === "footer" &&
              "border-amber-400 bg-amber-100 font-medium shadow-sm hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-950/60",
            className,
          )}
        >
          <Coffee className="size-4" />
          Support this tool
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SupportModalContent />
      </DialogContent>
    </Dialog>
  );
}
