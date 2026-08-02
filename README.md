# 📜 Nephalem's Codex
### Diablo 4 — Item Location & Crafting Planner

🔗 **Live Site:** [https://alltrueist.github.io/nephalimscodex](https://alltrueist.github.io/nephalimscodex)

---

## What Is This?

Build guides tell you *what* gear to use. Nephalem's Codex tells you:
1. **Where is this item?** — Which boss, what key material, where to farm it
2. **How do I craft these stats?** — Horadric Cube rolling order, when to lock with the Enchanter

**This app does NOT cover** skill trees, paragon boards, charms, mercenaries, or rotations — every build guide on Maxroll, Mobalytics, and D4Builds already covers those. Use them for that. Use this for gear acquisition and crafting.

---

## Features

### 📋 Acquisition Guide
- Boss Farm Targets — exact boss, key material, and how to farm the key
- Mythic Unique targets — Belial farm chain explained
- General Pool items — routed to Horadric Cube 3-to-1
- Aspects to Collect — drop-driven since Lord of Hatred

### 🟫 Crafting Simulator
- Select gear slot + up to 4 desired affixes
- Optimal Tuning Prism rolling order
- **Single lock rule enforced** — correctly models that only ONE affix can be locked at a time via the Enchanter
- Conflict difficulty ratings (Easy / Moderate / Hard / Extreme)
- Tuning Prism pool preview per slot and class

### 📱 Mobile-First Design
- 3-tab bottom nav: Gear | Guide | Craft
- Class selection gates all filtering — no confusion about what's available

---

## Current Season

**Season 14 — Death Awakening** | Lord of Hatred Expansion

---

## Data Pipeline — Two-Source Architecture

The app uses a two-source system that automatically prioritizes the most accurate data available.

```
Data Priority:
  🏆 1. Your local game file extract  (Option C — runs on your PC)
  ✅ 2. Automated weekly scrape        (Option A — GitHub Actions)
```

### Option C — Local Game File Extract (Highest Quality)

Run this **on your own PC** after a Diablo 4 patch drops. It reads Blizzard's own game files — the ground truth source.

**Tools you can use (pick one):**
- **d4lf** (recommended): https://github.com/d4lfteam/d4lf/releases — active community tool, extracts all aspects/items automatically when you run it
- **DiabloTools D4Analyzer**: https://github.com/DiabloTools/Diablo4Tools-Releases/releases — raw game file extractor

**Steps (using d4lf):**
```
1. Download and run d4lf.exe — it extracts game data to its assets/ folder automatically
2. Run: python scripts/convert-game-data.py --input PATH_TO_D4LF_ASSETS
3. It produces data/aspects-db.js and data/last-game-extract.json
4. git add data/
5. git commit -m "Game data update — patch X.X.X"
6. git push
```

**What the freshness stamp does:**
When you push `last-game-extract.json`, GitHub Actions sees it and **skips its automated scrape** for 21 days. Your game file data is considered authoritative. After 21 days without a local update, Option A takes over automatically.

---

### Option A — Automated Weekly Scrape (GitHub Actions)

Runs every Monday at 6 AM UTC. Only activates when local game data is stale (>21 days old) or missing.

**Source priority:**
1. **Maxroll.gg** via Selenium/headless Chrome (handles React rendering)
2. **d4guides.gg** via requests (server-side rendered fallback — 495 aspects, S14)

**To trigger manually:**
> GitHub repo → **Actions** tab → **Fetch D4 Game Data** → **Run workflow**

You can choose the source in the dropdown:
- `auto` (default) — tries Maxroll first, falls back to d4guides
- `maxroll` — force Maxroll only
- `d4guides` — force d4guides only

---

## File Structure

```
nephalimscodex/
├── index.html                          ← App shell, 3-tab layout
├── style.css                           ← Mobile-first Diablo dark theme
├── app.js                              ← Gear planner + acquisition guide
├── crafting.js                         ← Horadric Cube crafting simulator
├── requirements.txt                    ← Python deps for data scripts
├── README.md                           ← This file
│
├── data/
│   ├── items-db.js                     ← Unique/Mythic items (boss sources)
│   ├── aspects-db.js                   ← Legendary aspects (auto-generated)
│   ├── crafting-db.js                  ← Affix → Tuning Prism mappings
│   ├── aspects-raw.json                ← Raw scraped JSON (for inspection)
│   └── last-game-extract.json          ← Freshness stamp (written by Option C)
│
├── scripts/
│   ├── convert-game-data.py            ← Option C: local game file converter
│   └── fetch-data.py                   ← Option A: automated scraper
│
└── .github/
    └── workflows/
        └── fetch-data.yml              ← GitHub Actions workflow
```

---

## Updating items-db.js (Boss Sources)

The boss source data (`data/items-db.js`) is maintained manually — it's verified against Owen's community loot table spreadsheet. The automated pipeline doesn't touch it.

To add a new unique item:
```javascript
u("id", "Item Name", "slot", "Slot Display", "Class", "unique", [b(BOSS_ID)]),
```
Boss IDs: `AN` `AS` `BA` `BI` `BL` `BU` `DU` `GR` `HA` `LZ` `UR` `VA`

---

*Created by alltrueist — Not affiliated with Blizzard Entertainment.*
*Game data sourced from community game file extraction tools (d4lf, DiabloTools) and d4guides.gg.*
