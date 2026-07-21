# Helpers used by the BBQ dashboard

These are all **UI-managed helpers** (Settings → Devices & Services → Helpers) in the source instance, not YAML. Recreate them the same way on a new instance — the fields below are exactly what was configured.

## input_select.bbq_thema — "BBQ Thema"

Theme selector for the dashboard. Icon: `mdi:palette`.

Options (the installed theme names at time of creation, plus `default`):
```
default, Frosted Glass, Frosted Glass Dark, Frosted Glass Light, Graphite,
Graphite Auto, Graphite E-ink Dark, Graphite E-ink Light, Graphite Light,
Rounded, clear, neon, summer_breeze
```

Paired with automation **"BBQ Thema wijzigen"** (see `automations.yaml`), which calls `frontend.set_theme` whenever this selector changes.

## input_select.bbq_notificatie_apparaat — "BBQ Notificatie apparaat"

Chooses which device/service receives the "probe reached target" notification, in addition to the always-sent persistent notification. Icon: `mdi:bell-ring`.

Options (must match real `notify.*` services on your instance):
```
persistent_notification, mobile_app_oneplus13, mobile_app_sm_t870,
mobile_app_galaxy_watch7_h2ct, notify_pushover, remcovangeel_gmail_com,
living_room_tv
```

Used by automation **"BBQ probe reached target"** (see `automations.yaml`) — a native `choose` block matches the selected option against a `state` condition and calls the matching `notify.*` service. No templated service names are used, per Home Assistant automation best practices.

## sensor.bbq_probe_1_status … sensor.bbq_probe_4_status

UI **template helpers** (Settings → Helpers → Template → Sensor), not YAML `template:` sensors. Each computes one of `idle` / `heating` / `close` / `ready` by comparing the corresponding probe temperature sensor against its target `input_number`, with a 5°C "close" margin. These replaced an inaccessible YAML-only automation that referenced a now-disabled integration.

## Pre-existing helpers (not created by this project)

- `input_select.inkbird_active_probe` — "Active probe" (drives which probe a recipe preset applies to)
- `input_select.inkbird_unit` — "Temperature unit" (°C/°F display toggle used throughout the dashboard)
- `input_number.inkbird_target_1..4` — per-probe target temperatures
- `input_text.inkbird_name_1..4` — per-probe display names
