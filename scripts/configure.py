#!/usr/bin/env python3
"""Point this dashboard at your own Inkbird entity ids.

The Inkbird integration prefixes its entity ids with the area the device sits
in, so almost nobody's ids match the ones checked into this repo. Rather than
hand-editing three files, run this once:

    python3 scripts/configure.py --prefix sensor.kitchen_inkbird_int_14

It finds the current ids by pattern rather than assuming what is in the files,
so it is safe to run repeatedly and safe to run after you have already edited
something by hand.

Find your ids under Developer Tools -> States, filtering on "inkbird".
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    ROOT / "dashboard" / "bbq-dashboard.yaml",
    ROOT / "dashboard" / "bbq-dashboard.json",
    ROOT / "packages" / "inkbird_bbq.yaml",
]

# The area-prefixed sensor base, e.g. sensor.overig_inkbird_int_14 — probes,
# batteries, base station.
AREA_RE = re.compile(r"(sensor\.[a-z0-9_]+)_probe_1_food_1_temperature")

# The bare device slug used by entities that are NOT area-prefixed, e.g.
# binary_sensor.inkbird_int_14_ble_connected.
DEVICE_RE = re.compile(r"binary_sensor\.([a-z0-9_]+)_ble_connected")
DEVICE_DOMAINS = ("sensor", "binary_sensor", "select", "button")

UPDATE_RE = re.compile(r"(update\.[a-z0-9_]+)")


def detect(text: str, pattern: re.Pattern, what: str) -> str | None:
    found = sorted(set(pattern.findall(text)))
    if not found:
        return None
    if len(found) > 1:
        sys.exit(f"error: found several candidates for the {what} ({', '.join(found)}); "
                 "the files are inconsistent — fix that before running this.")
    return found[0]


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--prefix", help="area-prefixed sensor base, e.g. sensor.kitchen_inkbird_int_14")
    ap.add_argument("--device", help="bare device slug for non-area-prefixed entities, e.g. inkbird_int_14")
    ap.add_argument("--update", help="the integration's update entity, e.g. update.inkbird_int_update")
    ap.add_argument("--dry-run", action="store_true", help="report what would change and exit")
    args = ap.parse_args()

    if not (args.prefix or args.device or args.update):
        ap.error("give at least one of --prefix, --device or --update")

    missing = [p for p in TARGETS if not p.exists()]
    if missing:
        sys.exit("error: run this from a checkout — missing " +
                 ", ".join(str(p.relative_to(ROOT)) for p in missing))

    sample = TARGETS[0].read_text(encoding="utf-8")
    old_area = detect(sample, AREA_RE, "probe sensor prefix")
    old_device = detect(sample, DEVICE_RE, "device slug")
    old_update = detect(sample, UPDATE_RE, "update entity")

    if args.prefix and not old_area:
        sys.exit("error: could not find the current probe sensor prefix to replace")
    if args.device and not old_device:
        sys.exit("error: could not find the current device slug to replace")

    plan: list[tuple[str, str, str]] = []
    if args.prefix and args.prefix != old_area:
        plan.append(("probe sensors", old_area, args.prefix))
    if args.device and args.device != old_device:
        plan.append(("device entities", old_device, args.device))
    if args.update and old_update and args.update != old_update:
        plan.append(("update entity", old_update, args.update))

    if not plan:
        print("Nothing to do — the files already use those ids.")
        return 0

    for what, old, new in plan:
        print(f"  {what}: {old}  ->  {new}")

    total = 0
    for path in TARGETS:
        text = original = path.read_text(encoding="utf-8")
        count = 0

        if args.prefix and args.prefix != old_area:
            text, n = re.subn(re.escape(old_area) + r"(?=_)", args.prefix, text)
            count += n

            # The package's fallback prefix is deliberately split as
            # 'sensor.' ~ 'object_id' so Spook does not read it as a broken
            # entity reference. That half has no domain, so the substitution
            # above misses it — catch the quoted bare object id separately.
            old_obj = old_area.split(".", 1)[1]
            new_obj = args.prefix.split(".", 1)[1]
            if old_obj != new_obj:
                text, n = re.subn(r"'" + re.escape(old_obj) + r"'", f"'{new_obj}'", text)
                count += n

        if args.device and args.device != old_device:
            # Anchored on the domain so this cannot eat the area-prefixed ids,
            # which contain the device slug as a substring.
            for domain in DEVICE_DOMAINS:
                pat = re.escape(f"{domain}.{old_device}") + r"(?=_)"
                text, n = re.subn(pat, f"{domain}.{args.device}", text)
                count += n

        if args.update and old_update and args.update != old_update:
            text, n = re.subn(re.escape(old_update) + r"\b", args.update, text)
            count += n

        rel = path.relative_to(ROOT)
        if text != original:
            print(f"  {rel}: {count} replacement(s)")
            if not args.dry_run:
                path.write_text(text, encoding="utf-8")
            total += count
        else:
            print(f"  {rel}: unchanged")

    if args.dry_run:
        print(f"\nDry run — {total} replacement(s) would be made, nothing written.")
        return 0

    # The two dashboard files must stay byte-equivalent as data structures.
    try:
        import yaml
    except ImportError:
        print("\nDone. (Install PyYAML to have this script verify the result.)")
        return 0

    y = yaml.safe_load(TARGETS[0].read_text(encoding="utf-8"))
    j = json.loads(TARGETS[1].read_text(encoding="utf-8"))
    yaml.safe_load(TARGETS[2].read_text(encoding="utf-8"))
    if y != j:
        sys.exit("error: the YAML and JSON dashboards no longer match — restore from git.")

    print(f"\nDone. {total} replacement(s). YAML/JSON still in sync.")
    print("Now paste dashboard/bbq-dashboard.yaml into the raw configuration editor,")
    print("and copy packages/inkbird_bbq.yaml to <config>/packages/.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
