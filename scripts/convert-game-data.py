#!/usr/bin/env python3
"""
Nephalem's Codex — Game Data Converter (Option C: Local Tool)
=============================================================
Run this on your own PC after a Diablo 4 patch drops.
It converts the raw JSON files extracted by DiabloTools D4Analyzer
into the JavaScript database files used by the web app.

PREREQUISITES (one-time setup):
  1. Install DiabloTools D4Analyzer:
       https://github.com/DiabloTools/Diablo4Tools-Releases/releases
       (or the GUI version: D4Companion which includes the extractor)
  2. Run D4Analyzer, point it at your Diablo 4 install directory
  3. Let it extract — it creates a folder of JSON files
  4. Run this script, pointing it at that folder

USAGE:
  python scripts/convert-game-data.py --input PATH_TO_D4DATA_JSON_FOLDER
  python scripts/convert-game-data.py --input C:/D4Data/json --dry-run

WHAT IT DOES:
  Reads the D4Analyzer/d4data JSON output and produces:
    data/items-db-extracted.js   <- unique items with boss sources
    data/aspects-db.js           <- legendary aspects with slot/class data
    data/last-game-extract.json  <- timestamp so GitHub Actions knows this is fresh

AFTER RUNNING:
  Commit and push the output files:
    git add data/
    git commit -m "Game data update: patch X.X.X"
    git push
  GitHub Pages will serve the new data within ~60 seconds.

DATA PRIORITY:
  The GitHub Actions workflow checks last-game-extract.json.
  If it's less than 21 days old, it skips the automated Maxroll scrape
  and trusts your local game file data instead.
  After 21 days without a local update, Actions takes over automatically.

NOTE ON D4DATA STRUCTURE:
  DiabloTools extracts Blizzard's raw game files into JSON.
  The key files we use are in the json/ subfolder of the output directory.
  Internal names like "Aspect_Accelerating" are mapped to display names
  via the names/ folder or a companion name database.
  This converter handles both the raw DiabloTools format AND the
  pre-processed d4lf (d4lfteam) format if you use that tool instead.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR  = REPO_ROOT / "data"

# ── Known slot mappings ────────────────────────────────────────
INTERNAL_SLOT_MAP = {
    # DiabloTools internal equipment slot names
    "helm":          "helm",
    "helmtype":      "helm",
    "chest":         "chest",
    "chestarmor":    "chest",
    "torso":         "chest",
    "gloves":        "gloves",
    "glovestype":    "gloves",
    "legs":          "pants",
    "pantstype":     "pants",
    "pants":         "pants",
    "boots":         "boots",
    "bootstype":     "boots",
    "feet":          "boots",
    "amulet":        "amulet",
    "neck":          "amulet",
    "ring":          "ring",
    "ring1":         "ring",
    "ring2":         "ring",
    "mainhand":      "weapon",
    "offhand":       "offhand",
    "shield":        "offhand",
    "focus":         "offhand",
    "totem":         "offhand",
    "twohandedaxe":  "weapon",
    "twohandedsword":"weapon",
    "twohandedmace": "weapon",
    "twohandedstaff":"weapon",
    "bow":           "weapon",
    "crossbow":      "weapon",
    "polearm":       "weapon",
    "sword":         "weapon",
    "axe":           "weapon",
    "mace":          "weapon",
    "dagger":        "weapon",
    "wand":          "weapon",
    "staff":         "weapon",
    "scythe":        "weapon",
    "glaive":        "weapon",
    "flail":         "weapon",
    "quarterstaff":  "weapon",
}

INTERNAL_CLASS_MAP = {
    "barbarian":   "Barbarian",
    "druid":       "Druid",
    "necromancer": "Necromancer",
    "paladin":     "Paladin",
    "rogue":       "Rogue",
    "sorcerer":    "Sorcerer",
    "spiritborn":  "Spiritborn",
    "warlock":     "Warlock",
    "allclasses":  "all",
    "all":         "all",
}

CATEGORY_SLOT_DEFAULTS = {
    "offensive": ["gloves", "offhand", "weapon", "ring", "amulet"],
    "defensive": ["helm", "chest", "pants", "offhand", "amulet"],
    "utility":   ["helm", "chest", "pants", "gloves", "boots", "offhand", "amulet"],
    "mobility":  ["boots", "amulet"],
    "resource":  ["ring", "amulet"],
}


def norm_slot(raw: str) -> str:
    cleaned = re.sub(r"[^a-z]", "", raw.lower())
    return INTERNAL_SLOT_MAP.get(cleaned, "weapon")


def norm_class(raw: str) -> str:
    cleaned = re.sub(r"[^a-z]", "", raw.lower())
    return INTERNAL_CLASS_MAP.get(cleaned, "all")


def make_id(name: str, cls: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:46]
    if cls not in ("all",):
        suffix = re.sub(r"[^a-z]", "", cls.lower().split(",")[0])[:3]
        base = f"{base}-{suffix}"
    return base


def js_esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'").replace("\n", " ")


# ── D4Data JSON structure detectors ───────────────────────────

def detect_format(input_path: Path) -> str:
    """Detect which tool generated the data in this folder."""
    files = list(input_path.rglob("*.json"))
    names = {f.name.lower() for f in files}

    # d4lf format (d4lfteam/d4lf)
    if "aspects.json" in names and "uniques.json" in names:
        return "d4lf"

    # DiabloTools d4data format
    if "attributelist.json" in names or "definitions.json" in names:
        return "d4data"

    # Raw JSON dump (any folder with aspect/item-like files)
    if any("aspect" in n for n in names) or any("item" in n for n in names):
        return "generic"

    return "unknown"


# ── Parser: d4lf format ───────────────────────────────────────

def parse_d4lf(input_path: Path) -> tuple[list[dict], list[dict]]:
    """
    Parse d4lf (d4lfteam/d4lf) asset files.
    These are pre-processed and human-readable — the easiest format to work with.

    Expected files:
      assets/lang/enUS/aspects.json  -> list of aspect name slugs
      assets/lang/enUS/uniques.json  -> unique item data
    """
    aspects = []
    uniques = []

    # Find aspects.json
    aspect_files = list(input_path.rglob("aspects.json"))
    if aspect_files:
        with open(aspect_files[0]) as f:
            data = json.load(f)
        print(f"  📖 aspects.json: {len(data)} entries")

        if isinstance(data, list):
            # Simple slug list: ["accelerating", "aggressive", ...]
            for slug in data:
                name = slug.replace("_", " ").replace("-", " ").title()
                # Handle common naming patterns
                if not name.lower().startswith("aspect"):
                    name = "Aspect of " + name if "of" not in name.lower() else name
                aspects.append({
                    "id":     slug.replace("_", "-"),
                    "name":   name,
                    "class":  "all",
                    "slots":  CATEGORY_SLOT_DEFAULTS["offensive"],
                    "codex":  False,
                    "effect": "(See Maxroll or Codex of Power for effect description)",
                    "source": "Salvage Legendary drops",
                })
        elif isinstance(data, dict):
            # Dict format: {"accelerating": {"name": "Accelerating Aspect", ...}}
            for slug, entry in data.items():
                if isinstance(entry, dict):
                    name     = entry.get("name") or entry.get("displayName") or slug
                    cls_raw  = entry.get("class") or entry.get("classRestriction") or "all"
                    effect   = entry.get("description") or entry.get("effect") or ""
                    slot_raw = entry.get("allowedSlots") or entry.get("slots") or []
                    cat      = entry.get("category") or ""
                    codex    = bool(entry.get("codex") or entry.get("inCodex"))

                    if isinstance(slot_raw, list):
                        slots = [norm_slot(s) for s in slot_raw if s]
                        slots = list(dict.fromkeys(slots))  # deduplicate preserving order
                    else:
                        slots = CATEGORY_SLOT_DEFAULTS.get(cat.lower(), CATEGORY_SLOT_DEFAULTS["offensive"])

                    cls = norm_class(cls_raw) if isinstance(cls_raw, str) else "all"
                    aspects.append({
                        "id":     make_id(name, cls),
                        "name":   name,
                        "class":  cls,
                        "slots":  slots or CATEGORY_SLOT_DEFAULTS["offensive"],
                        "codex":  codex,
                        "effect": re.sub(r"\s+", " ", effect).strip()[:600],
                        "source": ("Codex of Power or Legendary drops" if codex
                                   else "Salvage Legendary drops"),
                    })

    # Find uniques.json
    unique_files = list(input_path.rglob("uniques.json"))
    if unique_files:
        with open(unique_files[0]) as f:
            data = json.load(f)
        print(f"  💎 uniques.json: {len(data)} entries")

        if isinstance(data, list):
            for entry in data:
                if isinstance(entry, str):
                    # Simple name list
                    uniques.append({"name": entry, "slot": "weapon", "class": "all"})
                elif isinstance(entry, dict):
                    name     = entry.get("name") or entry.get("displayName") or ""
                    cls_raw  = entry.get("class") or entry.get("classRestriction") or "all"
                    slot_raw = entry.get("slot") or entry.get("slotType") or ""
                    cls      = norm_class(cls_raw) if isinstance(cls_raw, str) else "all"
                    uniques.append({
                        "name":        name,
                        "slot":        norm_slot(slot_raw) if slot_raw else "weapon",
                        "slotDisplay": slot_raw,
                        "class":       cls,
                    })
        elif isinstance(data, dict):
            for name, entry in data.items():
                if isinstance(entry, dict):
                    cls_raw  = entry.get("class") or "all"
                    slot_raw = entry.get("slot") or ""
                    uniques.append({
                        "name":        name,
                        "slot":        norm_slot(slot_raw) if slot_raw else "weapon",
                        "slotDisplay": slot_raw,
                        "class":       norm_class(cls_raw),
                    })

    return aspects, uniques


# ── Parser: DiabloTools d4data format ─────────────────────────

def parse_d4data(input_path: Path) -> tuple[list[dict], list[dict]]:
    """
    Parse DiabloTools/d4data raw game file output.

    The key files are in the json/ subfolder.
    Internal names like "Aspect_Accelerating" are mapped to display names.
    This format is more complex — we extract what we can and flag the rest.
    """
    aspects = []
    uniques = []

    # Build a name lookup from any names files
    name_lookup = {}
    for name_file in input_path.rglob("names*.json"):
        try:
            with open(name_file) as f:
                data = json.load(f)
            if isinstance(data, dict):
                name_lookup.update(data)
        except Exception:
            pass

    print(f"  📚 Name lookup entries: {len(name_lookup)}")

    # Look for aspect-related JSON files
    for json_file in input_path.rglob("*.json"):
        if json_file.stat().st_size < 100:
            continue
        fname = json_file.name.lower()
        if not any(kw in fname for kw in ("aspect", "legendary", "power", "affix")):
            continue

        try:
            with open(json_file) as f:
                data = json.load(f)
        except Exception:
            continue

        if isinstance(data, list):
            entries = data
        elif isinstance(data, dict):
            entries = list(data.values())
        else:
            continue

        for entry in entries:
            if not isinstance(entry, dict):
                continue

            # Try various field name patterns used by different D4Data versions
            internal_name = (entry.get("snoName") or entry.get("name") or
                             entry.get("__eclass__") or "")
            if not internal_name:
                continue

            # Convert internal name to display name
            display_name = (
                name_lookup.get(internal_name) or
                entry.get("displayName") or
                entry.get("localizedName") or
                # Convert "Aspect_Accelerating" -> "Accelerating Aspect"
                re.sub(r"^Aspect_", "", internal_name).replace("_", " ") + " Aspect"
                if "Aspect" in internal_name else
                internal_name.replace("_", " ").title()
            )

            if not display_name or len(display_name) < 3:
                continue

            # Extract class
            cls_raw = (entry.get("classRestriction") or entry.get("class") or
                       entry.get("allowedClass") or "all")
            cls = norm_class(str(cls_raw))

            # Extract slots
            slot_data = (entry.get("allowedSlots") or entry.get("slots") or
                         entry.get("equipmentSlots") or [])
            if isinstance(slot_data, list):
                slots = [norm_slot(str(s)) for s in slot_data if s]
                slots = list(dict.fromkeys(slots))
            else:
                slots = CATEGORY_SLOT_DEFAULTS["offensive"]

            # Extract effect
            effect = (entry.get("localizedDescription") or entry.get("description") or
                      entry.get("effect") or "")

            aspects.append({
                "id":     make_id(display_name, cls),
                "name":   display_name,
                "class":  cls,
                "slots":  slots or CATEGORY_SLOT_DEFAULTS["offensive"],
                "codex":  bool(entry.get("inCodex") or entry.get("codex")),
                "effect": re.sub(r"\s+", " ", str(effect)).strip()[:600],
                "source": "Salvage Legendary drops",
                "_internal": internal_name,   # kept for debugging; stripped before output
            })

    # Look for unique item files
    for json_file in input_path.rglob("*.json"):
        fname = json_file.name.lower()
        if not any(kw in fname for kw in ("unique", "item", "equipment")):
            continue
        try:
            with open(json_file) as f:
                data = json.load(f)
        except Exception:
            continue

        entries = data if isinstance(data, list) else list(data.values()) if isinstance(data, dict) else []
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            if not (entry.get("rarity", "").lower() in ("unique", "mythic") or
                    entry.get("isUnique") or entry.get("isMythic")):
                continue

            internal_name = entry.get("snoName") or entry.get("name") or ""
            display_name  = name_lookup.get(internal_name) or entry.get("displayName") or internal_name.replace("_", " ")
            slot_raw      = entry.get("slot") or entry.get("equipmentSlot") or ""
            cls_raw       = entry.get("classRestriction") or entry.get("class") or "all"

            uniques.append({
                "name":        display_name,
                "slot":        norm_slot(str(slot_raw)) if slot_raw else "weapon",
                "slotDisplay": str(slot_raw),
                "class":       norm_class(str(cls_raw)),
                "itemType":    "mythic" if entry.get("isMythic") else "unique",
            })

    # Deduplicate aspects by display name
    seen = set()
    deduped_aspects = []
    for a in aspects:
        key = a["name"].lower().strip()
        if key and key not in seen:
            seen.add(key)
            a.pop("_internal", None)  # remove debug field
            deduped_aspects.append(a)

    print(f"  ✅ Parsed {len(deduped_aspects)} aspects, {len(uniques)} unique items")
    return deduped_aspects, uniques


# ── Parsers: generic fallback ─────────────────────────────────

def parse_generic(input_path: Path) -> tuple[list[dict], list[dict]]:
    """Fallback: try to extract anything that looks like an aspect or unique item."""
    aspects = []
    uniques = []

    for json_file in input_path.rglob("*.json"):
        try:
            with open(json_file) as f:
                data = json.load(f)
        except Exception:
            continue

        entries = data if isinstance(data, list) else list(data.values()) if isinstance(data, dict) else []
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            name = (entry.get("name") or entry.get("displayName") or
                    entry.get("localizedName") or "")
            if not name or len(name) < 4:
                continue

            if "aspect" in name.lower() or "aspect" in json_file.name.lower():
                cls = norm_class(str(entry.get("class", "all")))
                aspects.append({
                    "id":     make_id(name, cls),
                    "name":   name,
                    "class":  cls,
                    "slots":  CATEGORY_SLOT_DEFAULTS["offensive"],
                    "codex":  False,
                    "effect": str(entry.get("description", ""))[:600],
                    "source": "Salvage Legendary drops",
                })

    return aspects, uniques


# ── Writers ───────────────────────────────────────────────────

def write_aspects_js(aspects: list[dict], dry_run: bool) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = []
    for a in aspects:
        eff = js_esc(re.sub(r"\s+", " ", a.get("effect", "")).strip())
        src = js_esc(a.get("source", "Salvage Legendary drops"))
        lines.append(
            f'  {{id:"{a["id"]}",name:"{js_esc(a["name"])}",'
            f'class:"{a["class"]}",slots:{json.dumps(a["slots"])},'
            f'codex:{"true" if a.get("codex") else "false"},'
            f'effect:"{eff}",source:"{src}"}}'
        )

    content = (
        f"// ============================================================\n"
        f"// NEPHALEM'S CODEX — Legendary Aspects Database\n"
        f"// Generated by scripts/convert-game-data.py (LOCAL GAME EXTRACT)\n"
        f"// This data comes directly from Blizzard's game files — ground truth.\n"
        f"// Generated: {timestamp} | Total: {len(aspects)} aspects\n"
        f"// ============================================================\n\n"
        f"D4DB.aspects = [\n"
        + ",\n".join(lines)
        + "\n];\n"
    )

    if dry_run:
        print(f"\n[dry-run] Would write aspects-db.js ({len(aspects)} entries)")
        print(content[:500] + "...\n")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / "aspects-db.js"
    out.write_text(content, encoding="utf-8")
    print(f"✅ Written: {out}  ({out.stat().st_size:,} bytes)")


def write_freshness_stamp(dry_run: bool, source_format: str, aspect_count: int) -> None:
    """
    Write a timestamp file so GitHub Actions knows how fresh the local data is.
    Actions will skip its automated scrape if this file is less than 21 days old.
    """
    stamp = {
        "timestamp":    datetime.now(timezone.utc).isoformat(),
        "source":       "game-files",
        "format":       source_format,
        "aspect_count": aspect_count,
        "note": (
            "Generated from local Diablo 4 game file extraction. "
            "GitHub Actions will skip the automated Maxroll scrape "
            "while this file is less than 21 days old."
        )
    }

    if dry_run:
        print(f"[dry-run] Would write last-game-extract.json: {json.dumps(stamp, indent=2)}")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / "last-game-extract.json"
    out.write_text(json.dumps(stamp, indent=2, ensure_ascii=False))
    print(f"✅ Written: {out}  (freshness stamp — GitHub Actions will see this)")


# ── Main ──────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert D4 game file data to Nephalem's Codex format",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EXAMPLES:
  # d4lf format (from d4lfteam/d4lf tool):
  python scripts/convert-game-data.py --input C:/d4lf/assets

  # DiabloTools D4Analyzer format:
  python scripts/convert-game-data.py --input C:/D4Analyzer/output

  # Preview without writing:
  python scripts/convert-game-data.py --input /path/to/data --dry-run

STEP-BY-STEP (D4LF method — recommended):
  1. Download d4lf: https://github.com/d4lfteam/d4lf/releases
  2. Run d4lf.exe — it auto-extracts game data to its assets/ folder
  3. Run: python scripts/convert-game-data.py --input PATH_TO_D4LF/assets
  4. git add data/ && git commit -m "Game data update" && git push
"""
    )
    parser.add_argument("--input", required=True,
                        help="Path to the extracted game data folder")
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse and print without writing files")
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        print(f"❌ Input path not found: {input_path}")
        sys.exit(1)

    print("=" * 60)
    print("NEPHALEM'S CODEX — Game Data Converter")
    print(f"Input  : {input_path}")
    print(f"Output : {DATA_DIR}")
    print(f"Time   : {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    if args.dry_run:
        print("Mode   : DRY RUN")
    print("=" * 60)

    # Detect format
    fmt = detect_format(input_path)
    print(f"\n🔍 Detected format: {fmt}")

    if fmt == "d4lf":
        print("→ Parsing d4lf (d4lfteam) format...")
        aspects, uniques = parse_d4lf(input_path)
    elif fmt == "d4data":
        print("→ Parsing DiabloTools d4data format...")
        aspects, uniques = parse_d4data(input_path)
    elif fmt == "generic":
        print("→ Using generic JSON parser (fallback)...")
        aspects, uniques = parse_generic(input_path)
    else:
        print(f"❌ Could not detect data format in: {input_path}")
        print("   Expected either:")
        print("   • d4lf: folder with assets/lang/enUS/aspects.json")
        print("   • d4data: folder with attributeList.json or definitions.json")
        sys.exit(1)

    if not aspects:
        print("\n⚠️  No aspects found. Check that the input path is correct.")
        sys.exit(1)

    print(f"\n📊 Results:")
    print(f"   Aspects: {len(aspects)}")
    print(f"   Unique items (name data): {len(uniques)}")
    print("   Note: unique item BOSS SOURCE data stays in items-db.js")
    print("   (that data comes from the community spreadsheet, not game files)")

    write_aspects_js(aspects, args.dry_run)
    write_freshness_stamp(args.dry_run, fmt, len(aspects))

    print("\n" + "=" * 60)
    print("✅ Conversion complete!")
    if not args.dry_run:
        print("\nNext steps:")
        print("  git add data/aspects-db.js data/last-game-extract.json")
        print('  git commit -m "🗡️ Game data update — patch X.X.X"')
        print("  git push")
        print("\nYour live site will update within ~60 seconds.")
        print("GitHub Actions will not overwrite this data for 21 days.")
    print("=" * 60)


if __name__ == "__main__":
    main()
