#!/usr/bin/env python3
"""
Nephalem's Codex — Automated Data Fetcher (Option A: GitHub Actions)
=====================================================================
This script runs automatically every Monday via GitHub Actions.
It updates the aspects database from Maxroll.gg (Selenium) or d4guides.gg (fallback).

FRESHNESS CHECK:
  Before scraping anything, this script checks data/last-game-extract.json.
  If Owen ran convert-game-data.py locally within the past 21 days,
  his game-file data is considered authoritative and this script exits early.
  After 21 days, or if no local extract exists, automated scraping takes over.

SOURCES (in priority order):
  1. Local game file extract (if < 21 days old) → skip entirely
  2. Maxroll.gg via Selenium/headless Chrome → handles React rendering
  3. d4guides.gg via requests → server-side rendered fallback

Usage:
    python scripts/fetch-data.py
    python scripts/fetch-data.py --source maxroll
    python scripts/fetch-data.py --source d4guides
    python scripts/fetch-data.py --force   (ignore freshness check)
    python scripts/fetch-data.py --dry-run
"""

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR  = REPO_ROOT / "data"

# How many days the local game extract stays "authoritative" before
# GitHub Actions takes over with automated scraping
FRESHNESS_DAYS = 21

DELAY   = 1.5
TIMEOUT = 25
MAX_PAGES = 30

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

CATEGORY_SLOT_DEFAULTS = {
    "offensive": ["gloves", "offhand", "weapon", "ring", "amulet"],
    "defensive": ["helm", "chest", "pants", "offhand", "amulet"],
    "utility":   ["helm", "chest", "pants", "gloves", "boots", "offhand", "amulet"],
    "mobility":  ["boots", "amulet"],
    "resource":  ["ring", "amulet"],
}

KNOWN_CLASSES = {
    "Barbarian", "Druid", "Necromancer", "Paladin",
    "Rogue", "Sorcerer", "Spiritborn", "Warlock"
}


def norm_class(raw: str) -> str:
    if not raw:
        return "all"
    s = raw.strip()
    if s.lower() in ("all", "every class", "all classes"):
        return "all"
    parts = [p.strip() for p in re.split(r"[,/]", s)]
    known = [p for p in parts if p in KNOWN_CLASSES]
    if len(known) >= 7:
        return "all"
    return ",".join(known) if known else "all"


def make_id(name: str, cls: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")[:46]
    if cls not in ("all",):
        suffix = re.sub(r"[^a-z]", "", cls.lower().split(",")[0])[:3]
        base = f"{base}-{suffix}"
    return base


def js_esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'").replace("\n", " ")


# ── Freshness check ────────────────────────────────────────────

def check_freshness() -> tuple[bool, str]:
    """
    Returns (is_fresh, message).
    is_fresh=True means local game data is recent enough to skip scraping.
    """
    stamp_file = DATA_DIR / "last-game-extract.json"
    if not stamp_file.exists():
        return False, "No local game extract found — scraping needed."

    try:
        with open(stamp_file) as f:
            stamp = json.load(f)
        ts   = datetime.fromisoformat(stamp["timestamp"])
        age  = datetime.now(timezone.utc) - ts
        days = age.days
        if days < FRESHNESS_DAYS:
            count = stamp.get("aspect_count", "?")
            fmt   = stamp.get("format", "unknown")
            return True, (
                f"Local game extract is {days} days old ({count} aspects, {fmt} format). "
                f"Skipping automated scrape — game file data is authoritative for {FRESHNESS_DAYS - days} more days."
            )
        else:
            return False, (
                f"Local game extract is {days} days old (threshold: {FRESHNESS_DAYS}). "
                f"Running automated scrape to stay current."
            )
    except Exception as e:
        return False, f"Could not read freshness stamp ({e}) — proceeding with scrape."


# ── Maxroll scraper (Selenium) ─────────────────────────────────

def scrape_maxroll() -> list[dict]:
    """
    Scrape aspects from maxroll.gg using Selenium/headless Chrome.
    Maxroll is a React SPA — plain HTTP returns an empty shell.
    Selenium renders the JavaScript, then we extract the DOM.
    """
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
    except ImportError:
        print("  ⚠️  selenium not installed. Falling back to d4guides.gg.")
        return []

    print("\n🌐  Trying Maxroll.gg (Selenium/headless Chrome)...")

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    options.add_argument(f"user-agent={HEADERS['User-Agent']}")
    # Reduce bot-detection signals
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    driver = None
    aspects = []
    try:
        driver = webdriver.Chrome(options=options)
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {"source": "Object.defineProperty(navigator,'webdriver',{get:()=>undefined})"}
        )

        url = "https://maxroll.gg/d4/database/aspects"
        print(f"  Loading: {url}")
        driver.get(url)

        wait = WebDriverWait(driver, 20)
        try:
            wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "[class*='aspect'], table tbody tr, [class*='database']")
            ))
            print("  ✅ Page rendered successfully")
        except Exception:
            print("  ⚠️  Render timeout — bot detection may be active")

        time.sleep(3)  # allow lazy-loaded content to settle

        soup = BeautifulSoup(driver.page_source, "lxml")
        aspects = _parse_aspects(soup, "maxroll")
        print(f"  📊 Parsed {len(aspects)} aspects from Maxroll")

    except Exception as e:
        print(f"  ❌ Selenium/Chrome error: {e}")
    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass

    return aspects


# ── d4guides scraper (requests) ────────────────────────────────

def fetch_html(url: str, retries: int = 3) -> str | None:
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
            if r.status_code == 200:
                return r.text
            if r.status_code == 429:
                wait = 30 * (attempt + 1)
                print(f"    ⏳ Rate-limited — waiting {wait}s...")
                time.sleep(wait)
            else:
                print(f"    ⚠️  HTTP {r.status_code}")
                return None
        except requests.RequestException as e:
            print(f"    ❌ Request error ({attempt + 1}): {e}")
            time.sleep(5)
    return None


def scrape_d4guides() -> list[dict]:
    """
    Scrape aspects from d4guides.gg (server-side rendered — no Selenium needed).
    495 aspects for Season 14, updated to patch 3.1.0 on Jul 22, 2026.
    """
    print(f"\n📖  Scraping d4guides.gg (requests)...")
    all_aspects = []

    for page in range(1, MAX_PAGES + 1):
        url  = "https://d4guides.gg/en/database/aspects" + (f"?page={page}" if page > 1 else "")
        html = fetch_html(url)
        if not html:
            print(f"  Stopped at page {page} (no response)")
            break

        soup    = BeautifulSoup(html, "lxml")
        entries = _parse_aspects(soup, "d4guides")

        next_link = (
            soup.find("a", string=re.compile(r"next", re.I)) or
            soup.find("a", attrs={"aria-label": re.compile(r"next", re.I)}) or
            soup.select_one("a[rel='next']")
        )

        print(f"  Page {page}: {len(entries)} entries | has_next={bool(next_link)}")
        all_aspects.extend(entries)

        if not next_link or page >= MAX_PAGES:
            break
        time.sleep(DELAY)

    # Deduplicate
    seen, deduped = set(), []
    for a in all_aspects:
        key = a["name"].lower().strip()
        if key and key not in seen:
            seen.add(key)
            deduped.append(a)

    print(f"  ✅ Total unique aspects: {len(deduped)}")
    return deduped


# ── Shared HTML parser ─────────────────────────────────────────

def _parse_aspects(soup: BeautifulSoup, source: str) -> list[dict]:
    """Parse aspects from HTML. Update CSS selectors here if sites redesign."""
    aspects = []

    # Strategy A: standard table
    table = soup.select_one("table")
    if table:
        for row in table.select("tbody tr"):
            cells = [td.get_text(" ", strip=True) for td in row.find_all(["td", "th"])]
            if len(cells) < 3:
                continue
            name     = cells[0].strip()
            category = cells[1].strip() if len(cells) > 1 else ""
            cls_raw  = cells[2].strip() if len(cells) > 2 else "all"
            effect   = cells[3].strip() if len(cells) > 3 else ""

            if not name or name.lower() in ("name", "aspect", "#"):
                continue
            if not re.search(r"[Aa]spect|[Aa]ccelerating|[Aa]rchdruid", name):
                continue

            cls    = norm_class(cls_raw)
            slots  = CATEGORY_SLOT_DEFAULTS.get(category.lower(), CATEGORY_SLOT_DEFAULTS["offensive"])
            codex  = bool(re.search(r"codex", name + effect, re.I))

            aspects.append({
                "id":     make_id(name, cls),
                "name":   name,
                "class":  cls,
                "slots":  slots,
                "codex":  codex,
                "effect": re.sub(r"\s+", " ", effect).strip()[:600],
                "source": ("Codex of Power or Legendary drops" if codex
                           else "Salvage Legendary drops"),
            })
        return aspects

    # Strategy B: card/article blocks
    for card in (soup.select("[class*='aspect']") or
                 soup.select("[class*='database'] [class*='row']") or
                 soup.select("[class*='entry']") or
                 soup.select("article")):
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

        aspects.append({
            "id":     make_id(name, cls),
            "name":   name,
            "class":  cls,
            "slots":  CATEGORY_SLOT_DEFAULTS["offensive"],
            "codex":  False,
            "effect": effect,
            "source": "Salvage Legendary drops",
        })

    return aspects


# ── Writer ─────────────────────────────────────────────────────

def write_aspects_js(aspects: list[dict], source: str, dry_run: bool) -> None:
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
        f"// Auto-generated by scripts/fetch-data.py (AUTOMATED SCRAPE)\n"
        f"// Source: {source}\n"
        f"// Generated: {timestamp} | Total: {len(aspects)} aspects\n"
        f"// ============================================================\n\n"
        f"D4DB.aspects = [\n"
        + ",\n".join(lines)
        + "\n];\n"
    )

    if dry_run:
        print(f"\n[dry-run] Would write aspects-db.js ({len(aspects)} entries)")
        print(content[:400] + "...\n")
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    out = DATA_DIR / "aspects-db.js"
    out.write_text(content, encoding="utf-8")
    print(f"\n✅ Written: {out}  ({out.stat().st_size:,} bytes)")

    raw_out = DATA_DIR / "aspects-raw.json"
    raw_out.write_text(json.dumps(aspects, indent=2, ensure_ascii=False))
    print(f"✅ Written: {raw_out}")


# ── Main ──────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Auto-fetch D4 data for Nephalem's Codex")
    parser.add_argument("--source", choices=["auto", "maxroll", "d4guides"], default="auto")
    parser.add_argument("--force",   action="store_true", help="Ignore freshness check")
    parser.add_argument("--dry-run", action="store_true", help="Parse but don't write")
    args = parser.parse_args()

    print("=" * 60)
    print("NEPHALEM'S CODEX — Automated Data Fetcher")
    print(f"Source : {args.source}")
    print(f"Time   : {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    if args.dry_run: print("Mode   : DRY RUN")
    print("=" * 60)

    # ── Freshness check ──────────────────────────────────────
    if not args.force:
        is_fresh, msg = check_freshness()
        print(f"\n🔍 Freshness check: {msg}")
        if is_fresh:
            print("\n✅ Local game data is current — no automated scrape needed.")
            print("   To force a scrape anyway: run with --force")
            sys.exit(0)
    else:
        print("\n⚡ --force flag set — skipping freshness check.")

    # ── Scrape ───────────────────────────────────────────────
    aspects = []
    used_source = ""

    if args.source in ("maxroll", "auto"):
        aspects = scrape_maxroll()
        if aspects:
            used_source = "maxroll.gg (Selenium)"
        elif args.source == "auto":
            print("\n→ Maxroll returned 0 results. Trying d4guides.gg fallback...")

    if not aspects and args.source in ("d4guides", "auto"):
        aspects = scrape_d4guides()
        if aspects:
            used_source = "d4guides.gg"

    if not aspects:
        print("\n❌ No aspects scraped from any source.")
        print("   Check network access, Chrome/Selenium availability, and site structures.")
        sys.exit(1)

    write_aspects_js(aspects, used_source, args.dry_run)

    print("\n" + "=" * 60)
    print(f"Done. {len(aspects)} aspects written from {used_source}.")
    print("Commit and push to update your live site.")
    print("=" * 60)


if __name__ == "__main__":
    main()
