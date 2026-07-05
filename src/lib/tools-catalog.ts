import { Clock, Combine, Repeat, type LucideIcon } from "lucide-react";

export interface ToolCatalogEntry {
  slug: string;
  name: string;
  /** One-line description of what the tool actually does today, used on the homepage and /tools index. */
  description: string;
  icon: LucideIcon;
}

export const TOOLS_CATALOG: ToolCatalogEntry[] = [
  {
    slug: "srt-to-vtt",
    name: "SRT to VTT Converter",
    description: "Convert SRT and VTT subtitle files to each other, in either direction, right in your browser.",
    icon: Repeat,
  },
  {
    slug: "subtitle-shifter",
    name: "Subtitle Time Shifter",
    description: "Shift every caption forward or backward with a live before/after preview to fix out-of-sync subtitles.",
    icon: Clock,
  },
  {
    slug: "subtitle-merger",
    name: "Subtitle Merger",
    description: "Stitch multi-part subtitles together sequentially, or combine two languages into one bilingual track.",
    icon: Combine,
  },
];
