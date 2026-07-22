#!/usr/bin/env python3
"""Wire whatever screenshots exist in docs/images/ into the README.

Drop your PNGs in docs/images/ and run:

    python3 scripts/add_screenshots.py

It rewrites the block between the SCREENSHOTS markers in README.md to show
exactly the files that are present. Missing ones are skipped rather than left
as a broken image — a README that opens with a broken-image icon is worse than
one with no image at all, and CI fails on broken links.

Re-runnable: run it again after adding another screenshot.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
IMAGES = ROOT / "docs" / "images"

START = "<!-- SCREENSHOTS:START -->"
END = "<!-- SCREENSHOTS:END -->"

# filename -> caption, in the order they should appear
WANTED = [
    ("cook-control.png", "Cook Control — live probe gauges, alerts and recipe presets"),
    ("probes.png", "Probes — every channel of every probe, over the probe artwork"),
    ("settings.png", "Settings — device health, alerts, announcements and setup"),
]

PLACEHOLDER = (
    "<!-- No screenshots yet. Drop cook-control.png / probes.png / settings.png\n"
    "     in docs/images/ and run: python3 scripts/add_screenshots.py\n"
    "     See docs/images/README.md for what to capture. -->"
)


def main() -> int:
    if not README.exists():
        sys.exit("error: run this from a checkout — README.md not found")

    text = README.read_text(encoding="utf-8")
    if START not in text or END not in text:
        sys.exit(f"error: markers {START} / {END} not found in README.md")

    found = [(n, c) for n, c in WANTED if (IMAGES / n).exists()]
    missing = [n for n, _ in WANTED if not (IMAGES / n).exists()]

    if not found:
        body = PLACEHOLDER
    elif len(found) == 1:
        name, caption = found[0]
        body = f'<p align="center">\n  <img alt="{caption}" src="docs/images/{name}">\n</p>'
    else:
        # first one full width, the rest as a details block so the top of the
        # README stays one screen tall
        name, caption = found[0]
        rest = "\n".join(
            f'<p align="center">\n  <img alt="{c}" src="docs/images/{n}">\n</p>\n'
            for n, c in found[1:]
        )
        body = (
            f'<p align="center">\n  <img alt="{caption}" src="docs/images/{name}">\n</p>\n\n'
            "<details>\n<summary align=\"center\">More screenshots</summary>\n\n"
            f"{rest}\n</details>"
        )

    new = re.sub(
        re.escape(START) + r".*?" + re.escape(END),
        START + "\n" + body + "\n" + END,
        text,
        flags=re.S,
    )
    README.write_text(new, encoding="utf-8")

    if found:
        for n, _ in found:
            size = (IMAGES / n).stat().st_size
            print(f"  added   docs/images/{n}  ({size / 1024:.0f} KB)")
    else:
        print("  no screenshots found — README left with the placeholder comment")
    for n in missing:
        print(f"  missing docs/images/{n}")

    # the invariant this script exists to protect
    for n, _ in found:
        if f"docs/images/{n}" not in new:
            sys.exit(f"error: {n} exists but did not make it into the README")
    print("\nREADME.md updated. No image is referenced unless the file exists.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
