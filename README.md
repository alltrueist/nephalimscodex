# 📜 Nephalem's Codex
### Diablo 4 Build Gear Acquisition Planner

🔗 **Live Site:** [https://alltrueist.github.io/nephalimscodex](https://alltrueist.github.io/nephalimscodex)

---

## What Is This?

Build guides are great at telling you *what* gear to use — but they rarely tell you *how to get it*. This tool fills that gap.

Paste your gear list from Maxroll, Mobalytics, or D4Builds into **Nephalem's Codex** and get an instant, consolidated acquisition plan covering:

- 💀 **Boss Farm Targets** — Which Lair Boss to run, what key material you need, and how to get it
- 🟫 **Horadric Cube Crafting** — Which recipes to use for each piece (3-to-1, Add Affix, Focus Reroll, Transfigure, etc.)
- 📖 **Aspects to Collect** — Where to get each Legendary Aspect (salvage-driven since Lord of Hatred)
- 🔨 **Gear Building Steps** — Step-by-step: Base → Cube → Aspect → Temper → Masterwork
- 📚 **Cube Quick Reference** — All recipes and Tuning Prisms explained at the bottom

---

## Current Season

**Season 14 — Death Awakening** | Lord of Hatred Expansion  
Last database update: July 2026

---

## File Structure

```
nephalimscodex/
├── index.html          ← Main app shell + layout
├── style.css           ← Diablo-themed dark UI
├── app.js              ← All app logic (state, rendering, localStorage)
└── data/
    └── items-db.js     ← D4 item database (uniques, bosses, aspects, Cube recipes)
```

---

## How to Use

1. Open a build guide (Maxroll, Mobalytics, D4Builds, etc.)
2. Enter your **Build Name** and **Class** in the top bar
3. Click each **gear slot** on the left and fill in what the guide shows:
   - **Uniques/Mythics** → just enter the item name (boss source auto-populates)
   - **Legendaries** → enter Aspect + Affixes + Tempers + Masterwork priority
4. The **Acquisition Guide** on the right updates live
5. Hit **📋 Copy** to export a plain-text checklist

Your build auto-saves in your browser between sessions.

---

## How to Expand the Database

Open `data/items-db.js` and add entries to the relevant arrays. Each array is heavily commented.

### Add a Unique item:
```js
{
  id: "my-item-id",
  name: "Item Name",          // Must match exactly what user types
  slot: "helm",               // From gearSlots id list
  class: "Barbarian",         // Or "all"
  sources: [
    { label: "Duriel", detail: "Dedicated drop", type: "boss", boss: "duriel" },
    { label: "Horadric Cube – 3-to-1", detail: "3× Helms → chance", type: "cube" }
  ],
  uniquePower: "Description of the unique power...",
  notes: "Any extra context for the player."
}
```

### Add a Legendary Aspect:
```js
{
  id: "my-aspect-id",
  name: "Aspect Name",
  class: "all",              // Or specific class
  category: "Offensive",    // Offensive | Defensive | Utility | Mobility | Resource
  slots: ["Gloves", "Ring", "Amulet", "Weapon"],
  effect: "The aspect's effect description...",
  source: "Salvage Legendary drops"
}
```

---

## Roadmap

- [x] Phase 1 — Gear: Boss targets, Cube crafting, Aspects, Legendary build steps
- [ ] Phase 2 — Skill Tree summary
- [ ] Phase 3 — Paragon Board (260 points!)
- [ ] Phase 4 — Charm Set
- [ ] Phase 5 — Mercenary
- [ ] Phase 6 — Rotation Guide
- [ ] Phase 7 — URL import from Maxroll/Mobalytics (requires proxy)

---

## Tech Stack

Vanilla HTML, CSS, and JavaScript — no build tools, no dependencies, no backend.  
Works entirely in the browser. Hosted on GitHub Pages.

---

*Created by alltrueist — Not affiliated with Blizzard Entertainment.*
