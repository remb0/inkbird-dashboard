<h1 align="center">🔥 Inkbird BBQ Dashboard</h1>

<p align="center">
  A Home Assistant dashboard for the <b>Inkbird INT-14S-BW</b> wireless BBQ thermometer —<br>
  four live probe gauges, recipe presets and a "your meat is ready" notification.
</p>

<p align="center">
  <img alt="Home Assistant" src="https://img.shields.io/badge/Home%20Assistant-2024.10%2B-41BDF5?logo=homeassistant&logoColor=white">
  <img alt="HACS" src="https://img.shields.io/badge/HACS-button--card%20%2B%20card--mod-41BDF5?logo=homeassistantcommunitystore&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-orange">
</p>

![Cook Control view](docs/images/cook-control.png)

> 📸 _Screenshots live in [`docs/images/`](docs/images/). If you are reading this
> straight after cloning, drop your own `cook-control.png` and `settings.png` in
> there — see [`docs/images/README.md`](docs/images/README.md)._

---

## ✨ What you get

| | |
|---|---|
| 🌡️ **Four probe cards** | Live temperature on a 270° arc gauge, colour-coded by state — grey `idle` · amber `heating` · orange `close` · green `ready` |
| 🔋 **Per-probe battery** | A bare colour-coded percentage under each card's P1–P4 badge — red below 20 %, amber below 40 % |
| 📶 **Real connection status** | The header pill reads the actual transport — *Live · Bluetooth*, a pulsing *Connecting*, or red *Offline* — instead of assuming everything is fine |
| 🥩 **Recipe presets** | One tap writes name + target onto the selected probe: Brisket 93 °C, Chicken 74 °C, Medium Steak 57 °C, Pork Ribs 90 °C, Salmon 52 °C |
| 🔔 **Ready notification** | Persistent notification plus an optional phone/watch/TV target, with **Snooze 10 min** and **Dismiss** buttons on the push |
| ⏳ **ETA to target** | "≈ 1 h 40 m" on each probe card, from a rate-of-change sensor rather than a guess |
| 😐 **Stall detection** | Tells you when a probe has been flat for 45 minutes while still climbing — the moment you decide whether to wrap |
| 🪫 **Low battery alerts** | Warns before a probe quits at hour six, with a threshold you set and a toggle to silence it |
| 🎛️ **Base station card** | Battery level and an SVG rendering of the INT-14 base |
| 🚨 **Alerts card** | Rolls every probe that is `close` or `ready` into one summary at the top |
| 🇺🇸 **°C / °F toggle** | Display-only unit switch — no need to reconfigure the device |
| 🔬 **Probes page** | All five channels of every probe — tip, three food points and ambient — laid over probe artwork, plus per-channel tiles and a one-hour history graph |
| ⚙️ **Settings page** | Live device summary plus six sections: base station, connection, probe batteries, preferences, integration health and links |

### Pages

All three are tabs in the dashboard's own menu — there is no hidden subview and no in-card navigation button to hunt for.

| Page | Path | What it's for |
|---|---|---|
| **Cook Control** | `/dashboard-bbq/cook` | The cooking view — four probe gauges, alerts, recipe presets |
| **Probes** | `/dashboard-bbq/probes` | The diagnostic view — every channel of every probe, with history |
| **Settings** | `/dashboard-bbq/settings` | Device health, preferences, integration status and links |

Cook Control answers "is it done yet?" at a glance. Probes answers "what is actually going on inside this piece of meat?" — a brisket with the tip in the flat and the ambient sensor in the pit tells you far more than one number. Settings answers "why is it not working?" before you go digging in the integration's own pages.

<details>
<summary>What's on the Settings page</summary>

A live header line (model · probe count · base battery · connection · whether an integration update is waiting), then:

| Section | Shows |
|---|---|
| **Base station** | Model, base battery with a bar gauge, charging state, base temperature, probes detected |
| **Connection** | Transport mode selector, active transport, Bluetooth and Wi-Fi connectivity, battery-reporting freshness |
| **Probe batteries** | All four probes with bar gauges — the page to check before a long cook |
| **Preferences** | Temperature unit, notification device, active probe |
| **Alerts** | Low-battery toggle + threshold slider, stall-detection toggle |
| **Integration** | Version + update button, model support status, last BLE diagnostic, and buttons to run a diagnostic or request a snapshot |
| **Links** | Integration, dashboard and the community dashboard the Probes page came from |

It is a native `sections` view built from stock tile and heading cards — no `card-mod`, so it survives Home Assistant upgrades better than the Cook Control page does.

</details>

## 📋 Requirements

| Requirement | Where to get it |
|---|---|
| Inkbird **INT-14S-BW** (or a sibling INT-14 model) | [inkbird.com](https://inkbird.com) |
| **Inkbird INT** custom integration (`inkbird_int14`) | [zampix1/ha-inkbird-int14](https://github.com/zampix1/ha-inkbird-int14) — install via HACS as a custom repository |
| **button-card** | [custom-cards/button-card](https://github.com/custom-cards/button-card) — HACS → Frontend |
| **card-mod** | [thomasloven/lovelace-card-mod](https://github.com/thomasloven/lovelace-card-mod) — HACS → Frontend |
| A Bluetooth adapter or ESPHome BT proxy in range of the base station | — |

## 🚀 Install

### 1. Add the backend (helpers, script, automation)

Copy [`packages/inkbird_bbq.yaml`](packages/inkbird_bbq.yaml) to `<config>/packages/inkbird_bbq.yaml`, then make sure your `configuration.yaml` has:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Check the config under **Developer Tools → YAML** and restart Home Assistant. That one file creates every helper, the four status sensors, the recipe script and the notification automation.

<details>
<summary>Prefer clicking things? Create the helpers through the UI instead</summary>

Everything in the package can equally be built under **Settings → Devices & Services → Helpers**. [`docs/HELPERS.md`](docs/HELPERS.md) lists each entity with the exact fields to fill in.

</details>

### 2. Add the dashboard

**Settings → Dashboards → + Add dashboard → New dashboard from scratch.** Name it so the URL becomes `/dashboard-bbq`.

Open it, then **✏️ Edit → ⋮ → Raw configuration editor**, and paste the contents of [`dashboard/bbq-dashboard.yaml`](dashboard/bbq-dashboard.yaml).

The three views appear as tabs. Nothing in the config hardcodes the dashboard URL, so a different name works without edits.

### 3. Point it at your entity ids

The Inkbird integration prefixes entity ids with the **area** the device sits in — `sensor.overig_inkbird_int_14_…` here, almost certainly something else on your install. Find yours under **Developer Tools → States**, filtering on `inkbird`, then run:

```bash
python3 scripts/configure.py --prefix sensor.kitchen_inkbird_int_14
```

That rewrites all three files in one pass (~167 ids) and verifies the YAML and JSON dashboards still match. Add `--dry-run` to see what it would change first.

<details>
<summary>The other two flags, and what each prefix covers</summary>

| Flag | Covers | Default in this repo |
|---|---|---|
| `--prefix` | The area-prefixed sensors: every probe channel, probe batteries, base station | `sensor.overig_inkbird_int_14` |
| `--device` | Entities that are *not* area-prefixed: transport, BLE/Wi-Fi state, diagnostics buttons | `inkbird_int_14` |
| `--update` | The integration's update entity | `update.inkbird_int_update` |

`--device` usually needs no change. The script detects the current values by pattern rather than assuming, so it is safe to re-run and safe after hand edits.

</details>

### 4. Turn on the alerts

`initial:` is deliberately not used anywhere in the package — it would reset your settings on every Home Assistant restart. The cost is that on a fresh install the alert toggles start **off** and the battery threshold sits at its minimum.

Open the dashboard's **Settings → Alerts** section once and set:

- **Low battery alerts** → on, **Battery threshold** → 15 % or so
- **Stall alerts** → on

The "probe reached target" notification needs no toggle; it is always on.

### 5. Add the probe artwork (Probes page)

The Probes page lays temperature readings over a picture of a probe. Home Assistant serves those from `/config/www/`, so download them once:

```bash
cd /config/www
curl -LO https://raw.githubusercontent.com/zampix1/ha-inkbird-int14/main/docs/images/community/int12e-probe-black.png
curl -LO https://raw.githubusercontent.com/zampix1/ha-inkbird-int14/main/docs/images/community/int12e-probe-white.png
```

Odd-numbered probes use the black artwork, even-numbered the white. Everything else on the page — tiles, history graphs, the temperature values themselves — works without the images; you will just get a broken-image box where the probe should be.

> The artwork is INT-12E-BW, drawn by the community contributor credited below. It is close enough to the INT-14 probes to read correctly, but it is not a picture of your exact hardware.

### 6. Point notifications at your phone

Out of the box only a persistent notification is sent. Every alert in this package routes through one script, **`script.bbq_notify`** — add a branch to its `choose:` block and a matching option to `input_select.bbq_notify_target`, and all three alerts use it. You do this once, not once per automation. A worked example is in [`docs/HELPERS.md`](docs/HELPERS.md#notification-routing).

## 📁 Repo layout

```
inkbird-dashboard/
├── packages/
│   └── inkbird_bbq.yaml       # ← drop into <config>/packages/ — helpers, sensors, scripts, automations
├── dashboard/
│   ├── bbq-dashboard.yaml     # ← paste into the raw configuration editor
│   └── bbq-dashboard.json     # same config, exact storage-mode export (for diffing / the HA API)
├── scripts/
│   └── configure.py           # ← rewrite every Inkbird entity id in one command
├── docs/
│   ├── HELPERS.md             # every entity explained, for UI-based setup
│   └── images/                # screenshots
├── CHANGELOG.md               # what changed, and what breaks when you update
├── TODO.md                    # ideas and planned improvements
└── README.md
```

`bbq-dashboard.yaml` and `bbq-dashboard.json` hold **identical** content — pick whichever your workflow needs.

## 🍖 Customising the recipes

Recipes are plain cards in the dashboard file. Copy a block, change the four variables:

```yaml
- type: custom:button-card
  template: inkbird_recipe
  name: Lamb Shoulder
  variables:
    rname: Lamb Shoulder   # written to the probe's name
    temp: 88               # target in °C
    note: Pull temp        # small caption
    color: '#b0442a'       # icon colour
```

Tapping a preset applies it to whichever probe is chosen in the **Active probe** selector, so pick that first.

## 🙏 Credits & sources

This dashboard stands on other people's work:

- **[Home Assistant](https://www.home-assistant.io/)** — the platform everything runs on.
- **[zampix1/ha-inkbird-int14](https://github.com/zampix1/ha-inkbird-int14)** — the `inkbird_int14` custom integration that talks to the thermometer over BLE. Without it there are no probe sensors and this dashboard has nothing to show. All device communication, probe mapping and the update entity come from there.
- **[custom-cards/button-card](https://github.com/custom-cards/button-card)** by RomRider — every probe card, the header, the base-station card and the recipe buttons are `custom:button-card` templates. The gauges and device illustrations are inline SVG rendered through its `custom_fields`.
- **[thomasloven/lovelace-card-mod](https://github.com/thomasloven/lovelace-card-mod)** — restyles the stock markdown and grid cards to match the dark charcoal/ember theme.
- **[@Nexus1212](https://github.com/Nexus1212)** — the **Probes** page is a direct adaptation of their INT-12E-BW community dashboard, shared in [Discussion #3](https://github.com/zampix1/ha-inkbird-int14/discussions/3#discussioncomment-17664834) and documented at [`docs/int12e_dashboard.md`](https://github.com/zampix1/ha-inkbird-int14/blob/main/docs/int12e_dashboard.md). The channel order, the label colours, the percentage positions of each reading and the probe artwork are all theirs; this repo only extends the single-probe card to all four INT-14 probes. It uses stock Home Assistant cards — no custom frontend card needed.
- **[Material Design Icons](https://pictogrammers.com/library/mdi/)** — the `mdi:` icons.
- **Inkbird** — the [INT-14S-BW](https://inkbird.com) hardware and its display, which the base-station SVG is drawn after.
- The settings-page layout (version tile + link card built from Jinja variables) reuses the pattern from the author's Zendure configuration dashboard.

Not affiliated with or endorsed by Inkbird. "Inkbird" and "INT-14S-BW" are trademarks of their respective owner; this is an unofficial community dashboard.

## 📦 Is this installable from HACS?

Not today, and not without a rewrite — HACS has no repository type for a Lovelace dashboard config. Its "Dashboard" category installs **JavaScript** cards into `www/community/`, not view layouts. The two custom cards this dashboard *depends on* (button-card, card-mod) come from HACS; the dashboard itself is copy-paste.

The route to a real one-click install is to ship this as a **dashboard strategy** — a JS module that generates the views at render time, installs through HACS like any other frontend resource, and could discover your Inkbird entities automatically instead of making you search-and-replace entity ids. See [`TODO.md`](TODO.md#hacs-compatibility) for the trade-offs.

## 🗺️ Roadmap

Ideas, known gaps and nice-to-haves live in [`TODO.md`](TODO.md). Suggestions and PRs welcome.

## 📄 License

[MIT](LICENSE) — do what you like with it. Cook something good.
