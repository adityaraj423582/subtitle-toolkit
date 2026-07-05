"use client";

import { useState } from "react";
import { Coffee, QrCode } from "lucide-react";
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

// TODO: Replace these two placeholders once the real UPI ID and QR code
// image are ready — this is the only place that needs to change. Drop the
// QR image at `public/upi-qr.png` (or wherever) and point QR_IMAGE_SRC at
// it; `SupportModalContent` below will automatically swap the placeholder
// icon for the real image.
const UPI_ID = "your-upi-id@placeholder";
const QR_IMAGE_SRC: string | null = null;

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

      {/*
        TODO: Replace placeholder QR image (public/upi-qr.png) and UPI ID
        string once provided. Add a "Copy UPI ID" button with a toast
        confirmation once the real ID is set.
      */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex size-40 items-center justify-center rounded-xl bg-muted">
          {QR_IMAGE_SRC ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={QR_IMAGE_SRC} alt="UPI QR code" className="size-full rounded-xl object-contain" />
          ) : (
            <QrCode className="size-16 text-muted-foreground" />
          )}
        </div>
        <code className="rounded-md bg-muted px-3 py-1.5 text-sm text-foreground">
          UPI ID: {UPI_ID}
        </code>
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
 * A small "buy me a coffee"-style pill button that opens a modal with
 * (placeholder, for now) UPI donation details. Deliberately styled with a
 * warm amber accent so it doesn't blend into the site's indigo brand color.
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
