# Video Editing Project — Folder Guide

## Naming convention
`{YYYY-MM-DD}_{project-name}_{version}_{status}` — e.g. `2026-11-26_launch-teaser_v01_rough`

## Structure
| Folder | Purpose |
|---|---|
| `01_footage/raw` | Untouched camera footage (never overwrite) |
| `01_footage/b-roll` | B-roll & secondary footage |
| `02_audio/music` | Licensed music tracks |
| `02_audio/sfx` | Sound effects |
| `02_audio/voiceover` | VO takes & scratch audio |
| `03_assets/graphics` | Overlays, titles, motion graphics |
| `03_assets/fonts` | Brand fonts used in edits |
| `03_assets/luts` | Color grading LUTs |
| `03_assets/logos` | Brand logos & watermark assets |
| `04_projects` | Editor project files (Premiere/Resolve/FCP) |
| `05_exports/drafts` | Client-review exports |
| `05_exports/final` | Delivery masters (H.264/H.265/ProRes) |
| `06_docs` | Briefs, shot lists, scripts, brand guidelines |

## Rules
1. **Raw footage is read-only** — proxies and copies only.
2. **One project file per edit** lives in `04_projects`, media referenced in-place.
3. **Final exports** include the edit's `06_docs` spec (resolution, fps, bitrate) for repeatability.
