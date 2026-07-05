const STORAGE_PREFIX = "subtitletoolkit-support-nudge-";

/**
 * Whether the post-conversion "support this tool" nudge should be shown for
 * a given tool in the current browser session. Each tool gets its own flag
 * so converting a file in one tool doesn't suppress the nudge in another.
 */
export function shouldShowSupportNudge(toolSlug: string): boolean {
  try {
    return window.sessionStorage.getItem(`${STORAGE_PREFIX}${toolSlug}`) !== "shown";
  } catch {
    // Storage can throw in some private-browsing modes — fail open so the
    // nudge just shows every time rather than crashing the download flow.
    return true;
  }
}

/** Marks the nudge as shown for this tool so it won't reappear this session. */
export function markSupportNudgeShown(toolSlug: string): void {
  try {
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${toolSlug}`, "shown");
  } catch {
    // Ignore write failures (disabled storage, quota, etc.) — worst case the
    // nudge shows again, which is harmless.
  }
}
