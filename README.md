# Project 02: AeroRun 30-Day Social Media Campaign

A complete Instagram and Facebook campaign for **AeroRun**, the fictional ₹5,999 sneaker from [Project 01](../Project-01-AeroRun/README.md), aimed at fashion-conscious 18–25-year-olds in India's metros. Campaign window: 11 Jan – 9 Feb 2027.

> Independent fictional concept. AeroRun is not a real product, and this is not an official Nike campaign. No Nike branding is used. All performance numbers are targets or clearly labelled dummy data, not results.

## What's in this folder

| File | What it is | Use it for |
|---|---|---|
| [AeroRun-Social-Campaign-Deck.pptx](AeroRun-Social-Campaign-Deck.pptx) | 17-slide agency presentation with speaker notes | Presenting in an interview |
| [AeroRun-Social-Strategy.pdf](AeroRun-Social-Strategy.pdf) | Full strategy document: all 12 required sections, every creative spec, sources | The main portfolio piece |
| [AeroRun-Social-Campaign.xlsx](AeroRun-Social-Campaign.xlsx) | 30-day calendar, creative library, caption library, hashtags, creators, **monthly reporting template** (+ example with dummy data), KPI definitions | Showing you can plan and report |
| [AeroRun-Reel-Scripts.md](AeroRun-Reel-Scripts.md) | Shot-by-shot scripts for all 8 Reels | Production |
| [AeroRun-Caption-Library.md](AeroRun-Caption-Library.md) | All 28 captions + saved replies, ready to copy | Copywriting samples |
| `creatives/` | 50 finished graphics at Instagram sizes: 12 posts (1080×1350), 8 Reel covers and 15 Story frames (1080×1920), 15 carousel slides, plus overview sheets | Portfolio site, Behance, LinkedIn |
| `build/` | Scripts that generate everything from `build/content.js` | Changing content and rebuilding |

**Best single images for a portfolio page:** `creatives/overview-feed-grid.png`, `creatives/overview-stories.png`, `creatives/overview-carousels.png`.

## How it connects to Project 01

Same personas (Aarav, Meera, Kabir), same positioning (style + comfort, never "cheapest"), the same content pillars (Style 40 / Proof 25 / Community 25 / Offer 10), and the same ₹25,000 creator budget. Paid media stays in Project 01's budget and is reported separately.

## Rebuilding

All campaign content lives in `build/content.js`, which checks itself (28 creatives in the right counts, ≤ 5 hashtags, creator fees = ₹25,000).

```powershell
cd build; node content.js; node creatives.js; node export.js; .\.venv\Scripts\python.exe build_xlsx.py; node report.js; node deck.js
```

After rebuilding the spreadsheet, open it once in Excel and save, so the formula results are stored.
