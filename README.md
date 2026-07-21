# Inkbird BBQ Dashboard

Home Assistant Lovelace dashboard + supporting automations for the **Inkbird INT-14S-BW** BBQ thermometer, built for the `Inkbird INT` custom integration (domain `inkbird_int14`, [zampix1/ha-inkbird-int14](https://github.com/zampix1/ha-inkbird-int14)).

## Contents

| File | What it is | How to use it |
|---|---|---|
| `dashboard-bbq.json` / `dashboard-bbq.yaml` | Full Lovelace dashboard config (two views: **Cook Control** and **Settings**) | Paste into a YAML-mode dashboard, or use as the source of truth to recreate a storage-mode dashboard via the HA UI/API. Both files hold identical content — JSON is the exact export, YAML is the same data reformatted for easier diffing in git. |
| `automations.yaml` | Two supporting automations: theme switching and probe-ready notification routing | Add to your `automations.yaml` (or paste into Settings → Automations → Edit in YAML → new automation) |
| `helpers.md` | Documentation of the UI-managed helpers this dashboard depends on | Reference only — recreate these as Home Assistant *Helpers* (Settings → Devices & Services → Helpers) if setting this up on a new instance |

## Dashboard structure

**Cook Control** (`/dashboard-bbq/cook`)
- Header with live status + base station battery
- Alerts card (moved to the top, per request)
- Settings navigation button (top right)
- Base station info card
- 2×2 grid of the four probe cards
- Recipe presets row: an **Active probe** selector tile followed by 5 recipe buttons

**Settings** (`/dashboard-bbq/settings`, subview)
- Back button to Cook Control
- Integration version tile (`update.inkbird_int_update` — shows installed vs. latest version, with an update button, same idea as the Zendure config page's version card)
- Temperature unit / Theme / Notification device selectors
- Links section (food.remb0.nl, integration GitHub, dashboard GitHub) built from Jinja variables at the top of the markdown card, so the integration name/domain only needs to be defined once — the same pattern used on the Zendure configuration page

## Helpers this dashboard depends on

All of these already exist as UI helpers in the source Home Assistant instance. See `helpers.md` for full details if you need to recreate them elsewhere:

- `input_select.inkbird_active_probe`, `input_select.inkbird_unit` (pre-existing)
- `input_select.bbq_thema` — theme selector (options = installed theme names)
- `input_select.bbq_notificatie_apparaat` — notification target selector
- `sensor.bbq_probe_1_status` … `sensor.bbq_probe_4_status` — template sensors (idle/heating/close/ready)

## GitHub repo

The Settings page's "Dashboard" link points at `https://github.com/remb0/inkbird-dashboard` — confirmed as the correct repo name.

## Setting up this repo on GitHub

1. Create a new repository named **`inkbird-dashboard`** under `remb0`.
2. Copy these files into it and push:
   ```
   git init
   git add .
   git commit -m "Initial BBQ dashboard export"
   git branch -M main
   git remote add origin https://github.com/remb0/inkbird-dashboard.git
   git push -u origin main
   ```
