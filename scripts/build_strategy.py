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

AREA_RE = re.compile(r"(sensor\.[a-z0-9_]+)_probe_1_(?:internal|food_[14])_temperature")
DEVICE_RE = re.compile(r"binary_sensor\.([a-z0-9_]+)_ble_connected")
UPDATE_RE = re.compile(r"(update\.[a-z0-9_]+)")
DEVICE_DOMAINS = ("sensor", "binary_sensor", "select", "button", "switch", "number")
AREA_DOMAINS = ("sensor", "binary_sensor", "button", "select", "switch", "number")

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
//     model: int14_bw        // auto (default), int14_bw or int14s_bw
//
// Requires the button-card, card-mod and mini-graph-card frontend cards.

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
    const m = id.match(/^(sensor\\.[a-z0-9_]+)_probe_1_(?:internal|food_[14])_temperature$/);
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

function state(hass, entityId) {
  const value = hass && hass.states ? hass.states[entityId] : null;
  return value ? value.state : null;
}

function chooseModel(config, hass, found) {
  const explicit = String(config.model || "auto").toLowerCase().replace(/-/g, "_");
  if (explicit === "int14_bw" || explicit === "int14s_bw") return explicit;

  const helper = state(hass, "input_select.inkbird_dashboard_model");
  if (helper === "INT-14-BW") return "int14_bw";
  if (helper === "INT-14S-BW") return "int14s_bw";

  const device = found.device || FALLBACK_DEVICE;
  const profile = state(hass, "sensor." + device + "_configured_model_profile");
  if (profile === "int14_bw" || profile === "int14s_bw") return profile;
  const model = state(hass, "sensor." + device + "_configured_model") || "";
  if (/14S-BW/i.test(model)) return "int14s_bw";
  if (/14-BW/i.test(model)) return "int14_bw";

  const ids = Object.keys(hass && hass.states ? hass.states : {});
  if (ids.some((id) => /_probe_1_internal_temperature$/.test(id))) return "int14_bw";
  if (ids.some((id) => /_probe_1_food_4_temperature$/.test(id))) return "int14s_bw";
  return "int14s_bw";
}

function integrationEntity(entityId) {
  return typeof entityId === "string"
    && /^(sensor|binary_sensor|select|button|number|switch|update)\./.test(entityId)
    && entityId.includes("inkbird")
    && !entityId.startsWith("sensor.bbq_");
}

// The source dashboard contains both channel layouts. At runtime, unwrap the
// selected profile and omit only missing integration entities. Package helpers
// remain visible so a missing package is diagnosed instead of silently hidden.
function adapt(node, model, hass) {
  if (Array.isArray(node)) {
    return node.map((item) => adapt(item, model, hass)).filter((item) => item !== null);
  }
  if (!node || typeof node !== "object") return node;

  if (node.inkbird_model) {
    if (node.inkbird_model === "auto" || node.inkbird_model !== model) return null;
    return adapt(node.card, model, hass);
  }

  // Replaced by the compact model/status/battery header.
  if (node.type === "custom:button-card" && node.custom_fields && node.custom_fields.dev && node.custom_fields.batt) {
    return null;
  }
  if (integrationEntity(node.entity) && !hass.states[node.entity]) return null;

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key === "inkbird_model") continue;
    if (key === "entities" && Array.isArray(value)) {
      out[key] = value
        .filter((row) => {
          const entityId = typeof row === "string" ? row : row && row.entity;
          return !integrationEntity(entityId) || Boolean(hass.states[entityId]);
        })
        .map((row) => adapt(row, model, hass))
        .filter((row) => row !== null);
    } else {
      out[key] = adapt(value, model, hass);
    }
  }

  if ((out.type === "entities" || out.type === "history-graph") && Array.isArray(out.entities) && out.entities.length === 0) {
    return null;
  }
  if ((out.type === "grid" || out.type === "vertical-stack" || out.type === "horizontal-stack") && Array.isArray(out.cards)) {
    out.cards = out.cards.filter(Boolean);
    if (out.cards.length === 0) return null;
  }
  return out;
}

function addWritableSoundControl(config, hass) {
  const soundSwitch = Object.keys(hass.states || {}).find(
    (id) => id.startsWith("switch.") && id.includes("inkbird") && /(?:sound|mute)/.test(id)
  );
  if (!soundSwitch) return config;
  const settings = (config.views || []).find((view) => view.path === "settings");
  if (!settings) return config;
  for (const section of settings.sections || []) {
    const heading = (section.cards || []).find((card) => card && card.type === "heading");
    if (!heading || heading.heading !== "Device controls") continue;
    const entities = (section.cards || []).find((card) => card && card.type === "entities");
    if (entities && !entities.entities.some((row) => (row.entity || row) === soundSwitch)) {
      entities.entities.splice(1, 0, { entity: soundSwitch, name: "Station sound" });
    }
  }
  return config;
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
    const model = chooseModel(config, hass, found);

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

    const resolved = substitute(TEMPLATE, [
      [AREA_TOKEN, area],
      [DEVICE_TOKEN, device],
      [UPDATE_TOKEN, update],
    ]);
    const adapted = adapt(resolved, model, hass);
    adapted.inkbird_model = model;
    return addWritableSoundControl(adapted, hass);
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
