#!/usr/bin/env python3
"""
Nephalem's Codex — Data Fetcher
================================
Scrapes d4guides.gg for legendary aspects, then writes data/aspects-db.js
and data/aspects-raw.json, consumed by the web app.

Usage:
    python scripts/fetch-data.py                # normal run
    python scripts/fetch-data.py --dry-run      # parse but don't write files

Why d4guides.gg?
    Unlike Maxroll, D4Builds, and Mobalytics (which are React SPAs that
    require JavaScript to render), d4guides.gg appears to be server-side
    rendered — its full content shows up in Google search snippets, which
    means a plain HTTP GET returns readable HTML.

If the scraper starts returning 0 results after a site redesign, inspect
the page HTML and update the CSS selectors in parse_aspects_page() below.
"""

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── Paths ──────────────────────────────────────────────────────────────────────
REPO_ROOT  = Path(__file__).resolve().parent.parent
DATA_DIR   = REPO_ROOT / "data"

# ── Config ─────────────────────────────────────────────────────────────────────
BASE        = "https://d4guides.gg/en/database"
ASPECTS_URL = f"{BASE}/aspects"
REQUEST_DELAY = 1.2   # seconds between pages (be a polite scraper)
MAX_PAGES     = 25    # safety cap

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://d4guides.gg/",
}

# ── Slot normalization ─────────────────────────────────────────────────────────
SLOT_MAP = {
    "helm": "helm", "helmet": "helm", "head": "helm",
    "chest": "chest", "chest armor": "chest", "body": "chest",
    "gloves": "gloves", "hands": "gloves",
    "pants": "pants", "legs": "pants", "trousers": "pants",
    "boots": "boots", "feet": "boots",
    "ring": "ring",
    "amulet": "amulet", "neck": "amulet", "necklace": "amulet",
    "offhand": "offhand", "shield": "offhand", "focus": "offhand", "totem": "offhand",
    "1h weapon": "weapon", "2h weapon": "weapon", "weapon": "weapon",
    "sword": "weapon", "axe": "weapon", "mace": "weapon", "dagger": "weapon",
    "wand": "weapon", "staff": "weapon", "bow": "weapon", "crossbow": "weapon",
    "polearm": "weapon", "glaive": "weapon", "flail": "weapon",
    "scythe": "weapon", "quarterstaff": "weapon",
}

# Default slot sets used when explicit slot list is missing
S_OFF = ["gloves", "offhand", "weapon", "ring", "amulet"]    # offensive
S_DEF = ["helm", "chest", "gloves", "boots", "offhand", "amulet"]  # defensive
S_PRO = ["helm", "chest", "pants", "offhand", "amulet"]       # protective
S_MOB = ["boots", "amulet"]
S_RES = ["ring", "amulet"]

CAT_SLOTS = {
    "offensive": S_OFF,
    "defensive": S_DEF,
    "utility":   S_DEF,
    "mobility":  S_MOB,
    "resource":  S_RES,
}

KNOWN_CLASSES = {
    "Barbarian", "Druid", "Necromancer", "Paladin",
    "Rogue", "Sorcerer", "Spiritborn", "Warlock",
}


def norm_slots(raw: str, category: str = "") -> list[str]:
    """Convert a raw slot string to a normalized list of slot IDs."""
    if not raw:
        return CAT_SLOTS.get(category.lower(), S_OFF)
    cleaned = re.sub(r"\(\+\d+%?\)", "", raw.lower())
    result = []
    for part in re.split(r"[,/]", cleaned):
        part = part.strip()
        for key, val in SLOT_MAP.items():
            if key in part:
                if val not in result:
                    result.append(val)
                break
    return result if result else CAT_SLOTS.get(category.lower(), S_OFF)


def norm_class(raw: str) -> str:
    """Normalize a class string to 'all' or 'ClassName' or 'A,B,C'."""
    if not raw:
        return "all"
    s = raw.strip()
    if s.lower() in ("all", "every class", "all classes", "any class"):
        return "all"
    parts = [p.strip() for p in re.split(r"[,/]", s)]
    known = [p for p in parts if p in KNOWN_CLASSES]
    if len(known) >= 7:
        return "all"
    return ",".join(known) if known else "all"


def make_id(name: str, cls: str) -> str:
    """Generate a stable, JS-safe ID."""
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:46]
    if cls != "all":
        suffix = re.sub(r"[^a-z]", "", cls.lower().split(",")[0])[:3]
        base = f"{base}-{suffix}"
    return base


def js_esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'").replace("\n", " ")


# ── Fetch helpers ──────────────────────────────────────────────────────────────
def fetch_html(url: str, retries: int = 3) -> str | None:
    """GET a URL and return the response body, with retry on failure."""
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200:
                return r.text
            if r.status_code == 429:
                wait = 30 * (attempt + 1)
                print(f"    ⏳ Rate-limited — waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"    ⚠️  HTTP {r.status_code} for {url}")
                return None
        except requests.RequestException as exc:
            print(f"    ❌ Request error (attempt {attempt + 1}/{retries}): {exc}")
            time.sleep(5)
    return None


# ── Parser ─────────────────────────────────────────────────────────────────────
def parse_aspects_page(html: str) -> tuple[list[dict], bool]:
    """
    Parse one page of d4guides.gg/en/database/aspects.

    Returns:
        (entries, has_next_page)

    The site currently renders a table with columns:
        Name | Category | Class | Description

    If the structure changes, update the selectors below.
    The function tries multiple strategies and logs what it finds.
    """
    soup = BeautifulSoup(html, "lxml")
    entries = []

    # ── Strategy A: standard <table> ─────────────────────────────
    table = soup.select_one("table")
    if table:
        rows = table.select("tbody tr")
        print(f"    📊 Table found: {len(rows)} rows")
        for row in rows:
            cells = [td.get_text(" ", strip=True) for td in row.find_all(["td", "th"])]
            if len(cells) < 2:
                continue

            # Flexible column detection — look for the most content-rich cell
            name     = cells[0] if cells else ""
            category = cells[1] if len(cells) > 1 else ""
            cls_raw  = cells[2] if len(cells) > 2 else "all"
            effect   = cells[3] if len(cells) > 3 else (cells[-1] if len(cells) > 1 else "")

            # Skip header rows
            if name.lower() in ("name", "aspect", "#", ""):
                continue
            # Skip non-aspect rows
            if not re.search(r"[Aa]spect|[Aa]ggressive|[Aa]ccelerat|[Aa]rchdruid", name):
                if len(effect) < 20:
                    continue

            # Extract slot info from description if present
            slot_m = re.search(r"[Ss]lots?:\s*([^.|\n]+)", effect)
            if slot_m:
                slots  = norm_slots(slot_m.group(1), category)
                effect = (effect[:slot_m.start()] + effect[slot_m.end():]).strip()
            else:
                slots = CAT_SLOTS.get(category.lower(), S_OFF)

            codex = bool(re.search(r"codex", name + effect, re.IGNORECASE))
            cls   = norm_class(cls_raw)

            entries.append({
                "id":     make_id(name, cls),
                "name":   name,
                "class":  cls,
                "slots":  slots,
                "codex":  codex,
                "effect": re.sub(r"\s+", " ", effect).strip()[:600],
            })

    # ── Strategy B: repeated card/article blocks ──────────────────
    if not entries:
        candidates = (
            soup.select("[class*='aspect']")
            or soup.select("[class*='database'] [class*='row']")
            or soup.select("[class*='item-row']")
            or soup.select("article")
            or soup.select("[class*='card']")
        )
        print(f"    🃏 No table — trying {len(candidates)} card elements")
        for card in candidates:
            text = card.get_text(" ", strip=True)
            if len(text) < 30:
                continue
            header = card.find(re.compile(r"h[1-6]|strong|b"))
            name   = header.get_text(strip=True) if header else text[:80]
            if not re.search(r"[Aa]spect", name):
                continue

            cls = "all"
            for kc in KNOWN_CLASSES:
                if kc in text:
                    cls = kc
                    break

            effect = re.sub(re.escape(name), "", text, count=1).strip()
            effect = re.sub(r"\s+", " ", effect)[:500]

            codex = bool(re.search(r"codex", text, re.IGNORECASE))
            entries.append({
                "id":     make_id(name, cls),
                "name":   name,
                "class":  cls,
                "slots":  S_OFF,
                "codex":  codex,
                "effect": effect,
            })

    # ── Detect next page ──────────────────────────────────────────
    has_next = bool(
        soup.find("a", string=re.compile(r"next", re.IGNORECASE))
        or soup.find("a", attrs={"aria-label": re.compile(r"next", re.IGNORECASE)})
        or soup.select_one("a[rel='next']")
        or soup.select_one("[class*='pagination'] [class*='next']:not([disabled])")
    )

    return entries, has_next


def scrape_all_aspects() -> list[dict]:
    """Scrape all pages of d4guides.gg aspects and return deduplicated entries."""
    print(f"\n📖  Fetching: {ASPECTS_URL}")
    all_entries: list[dict] = []

    for page in range(1, MAX_PAGES + 1):
        url  = f"{ASPECTS_URL}?page={page}" if page > 1 else ASPECTS_URL
        html = fetch_html(url)
        if not html:
            print(f"  ❌  Failed to fetch page {page} — stopping.")
            break

        entries, has_next = parse_aspects_page(html)
        print(f"  Page {page}: {len(entries)} entries parsed | next={has_next}")
        all_entries.extend(entries)

        if not has_next:
            break
        time.sleep(REQUEST_DELAY)

    # Deduplicate by lowercased name
    seen: set[str] = set()
    deduped: list[dict] = []
    for entry in all_entries:
        key = entry["name"].strip().lower()
        if key and key not in seen:
            seen.add(key)
            # Attach source field
            entry["source"] = (
                "Codex of Power — salvage a Legendary with this aspect at the Blacksmith "
                "to unlock it in your Codex, then re-imprint at the Occultist"
                if entry["codex"] else
                "Salvage Legendary drops (drop-driven since Lord of Hatred — no dungeon guarantee)"
            )
            deduped.append(entry)

    print(f"\n  ✅  Total unique aspects: {len(deduped)}")
    return deduped


# ── Writers ────────────────────────────────────────────────────────────────────
def write_js(aspects: list[dict], dry_run: bool) -> None:
    """Write data/aspects-db.js consumed by the web app."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    object_lines = []
    for a in aspects:
        eff = js_esc(a.get("effect", ""))
        src = js_esc(a.get("source", "Salvage Legendary drops"))
        object_lines.append(
            f'  {{id:"{a["id"]}",name:"{js_esc(a["name"])}",'
            f'class:"{a["class"]}",slots:{json.dumps(a["slots"])},'
            f'codex:{"true" if a["codex"] else "false"},'
            f'effect:"{eff}",source:"{src}"}}'
        )

    content = (
        "// ============================================================\n"
        "// NEPHALEM'S CODEX — Legendary Aspects Database\n"
        "// Auto-generated by scripts/fetch-data.py\n"
        f"// Source:    d4guides.gg/en/database/aspects\n"
        f"// Generated: {timestamp}\n"
        f"// Total:     {len(aspects)} aspects\n"
        "// ============================================================\n"
        "// To regenerate: run   python scripts/fetch-data.py\n"
        "// or push to GitHub to trigger the weekly workflow.\n"
        "// ============================================================\n\n"
        "D4DB.aspects = [\n"
        + ",\n".join(object_lines)
        + "\n];\n"
    )

    if dry_run:
        print("\n[dry-run] Would write aspects-db.js:")
        print(content[:500] + "...\n")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / "aspects-db.js"
    out.write_text(content, encoding="utf-8")
    print(f"✅  Written: {out}  ({out.stat().st_size:,} bytes)")


def write_json(aspects: list[dict], dry_run: bool) -> None:
    """Write data/aspects-raw.json for easy inspection."""
    content = json.dumps(aspects, indent=2, ensure_ascii=False)
    if dry_run:
        print("[dry-run] Would write aspects-raw.json")
        return
    out = DATA_DIR / "aspects-raw.json"
    out.write_text(content, encoding="utf-8")
    print(f"✅  Written: {out}  ({out.stat().st_size:,} bytes)")


# ── Main ───────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(description="Fetch D4 aspect data from d4guides.gg")
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse and print results without writing files")
    args = parser.parse_args()

    print("=" * 60)
    print("NEPHALEM'S CODEX — Data Fetcher")
    print(f"Target : d4guides.gg/en/database/aspects")
    print(f"Time   : {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    if args.dry_run:
        print("Mode   : DRY RUN (files will not be written)")
    print("=" * 60)

    aspects = scrape_all_aspects()

    if not aspects:
        print("\n❌  No aspects were scraped.")
        print("   The site structure may have changed.")
        print("   Open scripts/fetch-data.py and update the CSS selectors")
        print("   in parse_aspects_page() to match d4guides.gg's current HTML.")
        sys.exit(1)

    write_js(aspects, args.dry_run)
    write_json(aspects, args.dry_run)

    print("\n" + "=" * 60)
    print(f"Done.  {len(aspects)} aspects written to data/")
    print("Commit and push to update your live site.")
    print("=" * 60)


if __name__ == "__main__":
    main()
