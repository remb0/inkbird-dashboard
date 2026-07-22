# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Because this is a dashboard rather than a library, "breaking" means **an entity
id changed, or a step is required on your side after updating** — not an API.

## [Unreleased]

### Fixed

- **The Custom recipe button threw a service error.** It reused the
  `inkbird_recipe` button-card template, and button-card *deep-merges* a
  template into the card. Overriding `tap_action.service` therefore left the
  preset's `tap_action.data` (`label`, `target`) in place, so
  `input_boolean.toggle` was called with keys it does not accept. The template
  is now split: `inkbird_recipe_style` carries the look with no action, and
  `inkbird_recipe` adds the preset action on top. Custom inherits only the
  style, so there is nothing left to merge.
- **The help text under Spoken announcements and Setup was always visible.**
  Those sections each had a permanent markdown card as well as the one behind
  the Show help toggle, so turning help off left the duplicate on screen. The
  permanent ones are gone; only the toggled text remains.

- **The HACS install button returned "Repository not found."** The My Home
  Assistant link used `category=dashboard`, matching what the HACS UI calls
  this repository type. HACS's actual category enum is `appdaemon`,
  `integration`, `plugin`, `python_script`, `template`, `theme` — "Dashboard"
  is only the display label, and the URL parameter is still `plugin`.

### Added

- **Screenshots**, at last — Cook Control, Probes and Settings, in
  `docs/images/`. Downscaled from the ~3200 px retina captures to 1800 px
  (2.6 MB → 1.7 MB), which is still well above what GitHub renders.
- **`scripts/add_screenshots.py`.** Drop PNGs in `docs/images/` and run it; the
  README's screenshot block is rewritten to show exactly the files that exist,
  skipping the ones that do not. CI fails if the block and the directory
  disagree, so the README can never go back to rendering a broken image.
- **Card style picker.** `input_select.bbq_style` on the Settings page
  switches the Cook Control cards between the solid dark look and a
  transparent, blurred one for dashboards with a background image. Read at
  render time, so it applies without a reload.

### Changed

- **The Alerts card hides itself when there is nothing to report**, instead of
  taking up space to say "No alerts". Driven by a new `sensor.bbq_alert_count`
  template sensor and a conditional card — a markdown card cannot hide itself.
- The install section leads with HACS and treats the manual paste as the
  fallback, rather than presenting them as equal options. The two steps HACS
  cannot do — the YAML package and the probe artwork — are now labelled
  "needed either way" instead of being buried in a route.

## [1.1.0] — 2026-07-21

Installable from HACS, and a lot more to cook with.

### Added

- **Installable from HACS**, as a Lovelace **dashboard strategy**. HACS has no
  repository type for a Lovelace config, but it does carry JavaScript, and a
  strategy is JavaScript that generates a dashboard at render time. The whole
  dashboard config becomes four lines, and the strategy **discovers your
  Inkbird entity ids from the entity registry** — no `configure.py` run, no
  prefix to set. `dist/inkbird-bbq-strategy.js` is generated from
  `dashboard/bbq-dashboard.json` by `scripts/build_strategy.py`, so it cannot
  drift from the YAML.
- **Per-recipe icons** — 🐄 brisket, 🍗 chicken, 🥩 steak, 🐖 ribs, 🐟 salmon.
- **Custom recipe** button and form: name, target, probe, rest reminder,
  notification target and announcements, applied through the same script the
  presets use.
- **Rest reminder** (`input_number.bbq_rest_minutes`, 0 = off) — a second
  alert once the meat has rested, because carryover cooking means "ready" is
  not "serve now".
- **Show help** toggle on the Settings page, revealing an explanation under
  Alerts, Spoken announcements and Setup.
- **CI** (`.github/workflows/validate.yml`) asserting the two dashboard files
  stay identical, `dist/` is not stale, the strategy resolves entity ids
  against a simulated install, `configure.py` round-trips, and no markdown
  link is broken.

- **Runtime sensor prefix.** `input_text.inkbird_sensor_prefix`, on the Settings
  page under **Setup**, re-points the four probe cards, the four status sensors
  and every automation without editing a file or restarting.
  The `derivative` sensors and the Probes page still need
  `scripts/configure.py` — Home Assistant resolves a `source:` and a native
  card's `entity:` when the config loads, not when they render.
- **Configurable snooze.** `input_number.bbq_snooze_minutes` (5–60) sets how
  long Snooze waits, and is echoed in the button label, so the phone shows
  "Snooze 20 min" rather than a fixed 10.
- **Spoken announcements.** Optional TTS to any speaker, via
  `input_boolean.bbq_tts_alerts` plus `input_text.bbq_tts_speaker` and
  `input_text.bbq_tts_engine`. Every alert supplies its own `tts_message` —
  "Your Beef Brisket is ready. It has reached 93 degrees." — because emoji and
  `°C` do not read well out loud. Skipped when the toggle is off or either
  field is empty, and `continue_on_error` means a dead speaker cannot swallow
  the notification that already went out.
- **The probe artwork now ships in the repo** under [`www/`](www/), so
  installing is `cp www/*.png /config/www/` instead of two `curl` commands.
  Redistributed under upstream's MIT licence with attribution in
  [`www/README.md`](www/README.md).

### Fixed

- **`configure.py` silently skipped two kinds of entity id.** It anchored on
  `sensor.<prefix>` followed by an underscore, which missed the area-prefixed
  `button.<prefix>_capture_ble_diagnostics` and the bare `prefix:` variable on
  each of the four probe cards — six ids per file, left pointing at the
  original install. It now matches the object id under every domain the
  integration uses. Anyone who ran the old version should re-run it.
- **Three false "unknown entity referenced" repairs.** The fallback prefix was
  written as one literal, `'sensor.overig_inkbird_int_14'`. Spook scans
  automation and template config for entity-id-shaped strings and reports any
  that do not resolve — and a bare prefix is not an entity, so it flagged all
  three automations that carry the fallback. Splitting it as
  `'sensor.' ~ 'overig_inkbird_int_14'` keeps Repairs clean without changing
  behaviour. `scripts/configure.py` now rewrites both halves, so a renamed
  prefix does not leave a stale fallback behind.

### Changed

- Settings gains **Spoken announcements**, **Setup** and **Batteries**
  sections; snooze duration joins **Alerts**.
- The Settings battery section is now one `battery-state-card` covering the
  base station and all four probes, replacing five separate tiles.
- Probe cards read the prefix helper and fall back to their `prefix` variable,
  so a missing helper degrades to the previous hardcoded behaviour.

## [1.0.0] — 2026-07-21

First release intended for anyone other than its author. The repo went from a
raw export of one person's dashboard to something installable.

### Added

- **Probes page** — every channel of every probe (tip, three food points,
  ambient) laid over probe artwork, per-channel tiles and a one-hour history
  graph. Adapted from [@Nexus1212](https://github.com/Nexus1212)'s INT-12E-BW
  community dashboard.
- **Settings page** — a live device header over six sections: base station,
  connection, probe batteries, preferences, alerts, integration health, links.
  Built from stock cards, no `card-mod`.
- **ETA to target** on each probe card, from new `sensor.bbq_probe_N_rate`
  derivative sensors (°C/h, 10-minute smoothing).
- **Stall detection** — notifies when a probe's rate of change sits between
  -1 and +1 °C/h for 45 minutes while still below target. The moment you decide
  whether to wrap. Toggle: `input_boolean.bbq_stall_alerts`.
- **Low probe battery alerts** with an adjustable threshold, both on the
  Settings page. Toggle: `input_boolean.bbq_battery_alerts`,
  threshold: `input_number.bbq_battery_threshold`.
- **Actionable notifications** — Snooze 10 min / Dismiss buttons on the
  "probe is ready" push, handled by a new automation.
- **`script.bbq_notify`** — one notification router shared by all three alerts.
  Add a phone once and every alert uses it.
- **Per-probe battery** shown under each card's P1–P4 badge.
- **`packages/inkbird_bbq.yaml`** — the whole backend in one drop-in file:
  helpers, template sensors, rate sensors, scripts, automations. Previously the
  helpers were documented in prose only and the recipe script was not in the
  repo at all.
- **`scripts/configure.py`** — rewrites every Inkbird entity id across all three
  files in one command, instead of a hand search-and-replace.
- **`CHANGELOG.md`**, **`LICENSE`** (MIT), **`.gitignore`**.

### Changed

- The header connection pill reads
  `sensor.inkbird_int_14_active_transport` and
  `binary_sensor.inkbird_int_14_ble_connected` instead of always claiming
  "Live · via Bluetooth". Shows amber *Connecting* when those two disagree.
- Recipe preset buttons honour the °C/°F toggle. They previously always
  printed °C while the probe cards converted correctly.
- The recipe row and the probe grid fold on narrow screens
  (`repeat(auto-fit, minmax(…))`) instead of staying at a fixed 6 and 2 columns.
- Probe cards take only `num` and `prefix`; every other entity id is derived.
  Entity lookups are guarded, so a wrong id renders as "no probe" instead of
  throwing.
- Settings is a normal view, always visible in the dashboard menu.
- All three views are English. Dashboard-owned helper names followed —
  see Breaking below.
- Repo restructured into `dashboard/`, `packages/`, `docs/`, `scripts/`.
  The YAML and JSON dashboards are generated from one source and verified equal.

### Removed

- **Theme selector** (`input_select.bbq_thema` and its automation). The
  dashboard no longer switches the frontend theme.
- The in-card **Settings** navigation button on Cook Control, replaced by the
  view tab. With it went the last hardcoded `/dashboard-bbq/` path, so the
  dashboard now works under any URL without edits.
- The author's personal notify targets, which had no business in a public repo.

### Fixed

- The `°C`/`°F` toggle no longer leaves recipe temperatures unconverted.

### Breaking

- `input_select.bbq_notificatie_apparaat` → **`input_select.bbq_notify_target`**.
  If you ran an earlier copy: create the new helper (or let the package do it),
  copy your options across, update anything referencing the old id, then delete
  it. The Settings page and every automation in the package use the new id.
- The notification `choose` block moved out of the automation and into
  `script.bbq_notify`. If you had filled in your own notify services, move them
  to the script — you now only need them in one place.

## [0.1.0] — 2026-07-20

- Initial export of the working dashboard: Cook Control view, a Settings
  subview, two automations and a prose description of the helpers.

[Unreleased]: https://github.com/remb0/inkbird-dashboard/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/remb0/inkbird-dashboard/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/remb0/inkbird-dashboard/releases/tag/v1.0.0
[0.1.0]: https://github.com/remb0/inkbird-dashboard/releases/tag/v0.1.0
