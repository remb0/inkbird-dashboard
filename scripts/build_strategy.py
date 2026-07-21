#!/usr/bin/env python3
"""Generate dist/inkbird-bbq-strategy.js from the dashboard config.

The strategy is not a second copy of the dashboard — it is built from
dashboard/bbq-dashboard.json, so the YAML, the JSON and the HACS-installable
strategy can never drift apart. Re-run this whenever the dashboard changes:

    python3 scripts/build_strategy.py

The entity ids that vary per install are swapped for tokens here and resolved
against the live entity registry at render time, which is what lets the
strategy work without anyone editing a file.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "dashboard" / "bbq-dashboard.json"
OUT = ROOT / "dist" / "inkbird-bbq-strategy.js"

AREA_TOKEN = "__INKBIRD_AREA_PREFIX__"
DEVICE_TOKEN = "__INKBIRD_DEVICE__"
UPDATE_TOKEN = "__INKBIRD_UPDATE__"

AREA_RE = re.compile(r"(sensor\.[a-z0-9_]+)_probe_1_food_1_temperature")
DEVICE_RE = re.compile(r"binary_sensor\.([a-z0-9_]+)_ble_connected")
UPDATE_RE = re.compile(r"(update\.[a-z0-9_]+)")
DEVICE_DOMAINS = ("sensor", "binary_sensor", "select", "button")
AREA_DOMAINS = ("sensor", "binary_sensor", "button", "select", "switch")

JS = '''// Inkbird BBQ Dashboard — Lovelace dashboard strategy
//
// GENERATED FILE — do not edit by hand.
// Built from dashboard/bbq-dashboard.json by scripts/build_strategy.py.
//
// Usage, in a dashboard's raw configuration editor:
//
//   strategy:
//     type: custom:inkbird-bbq
//   views: []
//
// Optional overrides, when auto-discovery guesses wrong:
//
//   strategy:
//     type: custom:inkbird-bbq
//     prefix: sensor.kitchen_inkbird_int_14
//     device: inkbird_int_14
//     update_entity: update.inkbird_int_update
//
// Requires the button-card and card-mod frontend cards, and the
// battery-state-card for the Settings page.

const TEMPLATE = __TEMPLATE__;

const AREA_TOKEN = "__AREA_TOKEN__";
const DEVICE_TOKEN = "__DEVICE_TOKEN__";
const UPDATE_TOKEN = "__UPDATE_TOKEN__";

const FALLBACK_AREA = "__FALLBACK_AREA__";
const FALLBACK_DEVICE = "__FALLBACK_DEVICE__";
const FALLBACK_UPDATE = "__FALLBACK_UPDATE__";

// The integration prefixes most entity ids with the area the device sits in,
// so the ids differ per install. Find them by shape instead of guessing.
function discover(hass) {
  const ids = Object.keys(hass && hass.states ? hass.states : {});

  let area = null;
  for (const id of ids) {
    const m = id.match(/^(sensor\\.[a-z0-9_]+)_probe_1_food_1_temperature$/);
    if (m && m[1].includes("inkbird")) {
      area = m[1];
      break;
    }
  }

  let device = null;
  for (const id of ids) {
    const m = id.match(/^binary_sensor\\.([a-z0-9_]+)_ble_connected$/);
    if (m && m[1].includes("inkbird")) {
      device = m[1];
      break;
    }
  }

  const update = ids.find((id) => id.startsWith("update.") && id.includes("inkbird")) || null;

  return { area, device, update };
}

// Walk the config and swap the tokens for the resolved ids. Strings only —
// the tokens never appear in a key.
function substitute(node, map) {
  if (typeof node === "string") {
    let out = node;
    for (const [token, value] of map) {
      if (out.includes(token)) out = out.split(token).join(value);
    }
    return out;
  }
  if (Array.isArray(node)) return node.map((n) => substitute(n, map));
  if (node && typeof node === "object") {
    const out = {};
    for (const k of Object.keys(node)) out[k] = substitute(node[k], map);
    return out;
  }
  return node;
}

class InkbirdBbqDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    const found = discover(hass);

    const area = (config.prefix || found.area || "sensor." + FALLBACK_AREA).replace(/^sensor\\./, "");
    const device = config.device || found.device || FALLBACK_DEVICE;
    const update = config.update_entity || found.update || FALLBACK_UPDATE;

    if (!found.area && !config.prefix) {
      // eslint-disable-next-line no-console
      console.warn(
        "[inkbird-bbq] No Inkbird probe sensor found; falling back to " +
          FALLBACK_AREA +
          ". Set `prefix:` under the strategy if your ids differ."
      );
    }

    return substitute(TEMPLATE, [
      [AREA_TOKEN, area],
      [DEVICE_TOKEN, device],
      [UPDATE_TOKEN, update],
    ]);
  }
}

customElements.define("ll-strategy-dashboard-inkbird-bbq", InkbirdBbqDashboardStrategy);

// eslint-disable-next-line no-console
console.info("%c INKBIRD-BBQ-STRATEGY %c __VERSION__ ",
  "color:#f5ede4;background:#ff6a2c;font-weight:700",
  "color:#ff6a2c;background:#211b16");
'''


def detect(text: str, pattern: re.Pattern, what: str) -> str:
    found = sorted(set(pattern.findall(text)))
    if not found:
        sys.exit(f"error: could not find the {what} in {SOURCE.name}")
    if len(found) > 1:
        sys.exit(f"error: several candidates for the {what}: {', '.join(found)}")
    return found[0]


def read_version() -> str:
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    m = re.search(r"^## \[(\d+\.\d+\.\d+)\]", changelog, re.M)
    return m.group(1) if m else "0.0.0"


def main() -> int:
    if not SOURCE.exists():
        sys.exit(f"error: {SOURCE} not found — run from a checkout")

    raw = SOURCE.read_text(encoding="utf-8")
    area = detect(raw, AREA_RE, "probe sensor prefix")
    device = detect(raw, DEVICE_RE, "device slug")
    update = detect(raw, UPDATE_RE, "update entity")

    # Tokenise on the object id under every domain, not just "sensor." with a
    # trailing underscore — that misses the area-prefixed BLE diagnostic button
    # and the bare `prefix:` card variable.
    area_obj = area.split(".", 1)[1]
    tokenised = raw
    for domain in AREA_DOMAINS:
        tokenised = re.sub(
            re.escape(f"{domain}.{area_obj}"), f"{domain}.{AREA_TOKEN}", tokenised
        )
    for domain in DEVICE_DOMAINS:
        tokenised = re.sub(
            re.escape(f"{domain}.{device}") + r"(?=_)", f"{domain}.{DEVICE_TOKEN}", tokenised
        )
    tokenised = re.sub(re.escape(update) + r"\b", UPDATE_TOKEN, tokenised)

    config = json.loads(tokenised)
    for token in (AREA_TOKEN, DEVICE_TOKEN, UPDATE_TOKEN):
        if token not in json.dumps(config):
            sys.exit(f"error: {token} did not survive tokenisation")

    js = (
        JS.replace("__TEMPLATE__", json.dumps(config, indent=2, ensure_ascii=True))
        .replace("__AREA_TOKEN__", AREA_TOKEN)
        .replace("__DEVICE_TOKEN__", DEVICE_TOKEN)
        .replace("__UPDATE_TOKEN__", UPDATE_TOKEN)
        .replace("__FALLBACK_AREA__", area_obj)
        .replace("__FALLBACK_DEVICE__", device)
        .replace("__FALLBACK_UPDATE__", update)
        .replace("__VERSION__", read_version())
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(js, encoding="utf-8")

    print(f"wrote {OUT.relative_to(ROOT)}  ({len(js):,} bytes)")
    print(f"  probe prefix : {area}  -> discovered at runtime")
    print(f"  device slug  : {device}")
    print(f"  update entity: {update}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
