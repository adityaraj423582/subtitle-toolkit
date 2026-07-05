// Unified subtitle parsing API. Concrete per-format readers/writers live in
// `./subtitle-formats` (e.g. `srt.ts`, `vtt.ts`); this module re-exports the
// public surface so callers can `import { ... } from "@/lib/subtitle-parser"`
// without reaching into the `subtitle-formats` folder directly.
export * from "./subtitle-formats";
