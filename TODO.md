# TODO / ideas

Loosely ordered by "how much better does this make the dashboard per hour of work".

---

## 🐞 Fix first

- [x] ~~**The "Live · via Bluetooth" pill is hardcoded.**~~ Now driven by `sensor.inkbird_int_14_active_transport` + `binary_sensor.inkbird_int_14_ble_connected`: green *Live*, pulsing amber *Connecting* (transport is `ble_waiting`, or claims `ble` while the BLE binary sensor is `off`), red *Offline*.
- [ ] **"BLE 5.4" in the base-station card is still static text.** The header pill now reports the real transport, but the base-station card below it does not. Point its "Connection" field at the same `active_transport` sensor, or drop the field.
- [ ] **`ready` can flicker.** A probe hovering exactly on its target re-triggers the notification every time it crosses back and forth. Add `for: "00:00:30"` to the state triggers, or a small hysteresis in the template sensor.
- [ ] **Recipe buttons always print `°C`.** The recipe card's temperature label ignores `input_select.inkbird_unit`, unlike the probe cards. Reuse the same conversion helper.
- [ ] **The 6-column recipe row does not fold on mobile.** `type: grid, columns: 6` gets unreadable below ~900 px. Swap for a CSS `repeat(auto-fit, minmax(150px, 1fr))` grid via card-mod, or a `custom:layout-card`.

## 📊 Worth adding

- [x] ~~**Probe battery levels.**~~ Each probe card now shows `sensor.overig_inkbird_int_14_probe_N_battery` as a bar + percentage, red under 20 %, amber under 40 %.
- [ ] **Low probe battery warning.** The card shows the number, but nothing shouts. A probe dying at hour six of a brisket cook is exactly the thing you want pushed to your phone — add a "probe battery below 15 %" automation next to the existing one.
- [ ] **Temperature history graph.** An ApexCharts card under the probe grid showing all four probes over the last 12 hours turns this from a status page into a cook log. The classic brisket stall becomes visible instead of worrying.
- [ ] **ETA to target.** A `derivative` helper on each probe sensor gives °C/hour; `(target − current) / rate` gives a rough finish time. Show it as "≈ 1 h 40 m to go" in the probe card's side column, next to the existing "42° to go".
- [ ] **Stall detection.** If a probe sits within ±1 °C for 45 minutes while still below target, notify "Probe 2 has stalled at 68 °C — time to wrap?".
- [ ] **Ambient / grate temperature.** Each probe also reports `_ambient_temperature`. A pit-temperature card with a high/low band ("grate above 150 °C") is arguably more useful than a fourth food probe.
- [ ] **Rest reminder.** After a probe hits `ready`, start a timer and notify again after the resting period. Carryover cooking is where good brisket goes to die.
- [ ] **Actionable notifications.** The mobile app supports action buttons — "Snooze 10 min" and "Done, stop alerting" would stop the persistent notification piling up.
- [ ] **Doneness presets for steak.** Rare / medium-rare / medium / well-done as one recipe with four targets, rather than only "Medium Steak".

## 🧹 Structure & maintainability

- [ ] **Entity ids are repeated ~20 times.** Every probe card, the automation and the template sensors each spell out `sensor.overig_inkbird_int_14_probe_N_food_1_temperature`. Anyone adopting this has to search-and-replace across two files. Consider a `sensor` → `input_text` indirection, or ship a small `setup.sh` that rewrites the prefix in one go.
- [ ] **Turn the notification automation into a Blueprint.** Then adding a phone is a dropdown in the UI instead of hand-editing a `choose:` block, and the °C margin becomes an input. This is the single biggest usability win for other people installing this.
- [ ] **Pick one language.** The Cook Control view is English, the Settings view and helper names are Dutch (`BBQ Notificatie apparaat`, "Beheer notificaties…"). Either commit to English for a public repo, or add a proper `nl`/`en` variant of the dashboard file.
- [ ] **CI check.** A GitHub Action running `yamllint` plus a script asserting `bbq-dashboard.yaml` and `bbq-dashboard.json` parse to the same object would stop the two exports drifting apart.
- [ ] **Version the dashboard.** A `CHANGELOG.md` and git tags, so people can tell whether their copy is current.

## 📸 Presentation

- [ ] **Add the screenshots** `docs/images/cook-control.png` and `settings.png` (see `docs/images/README.md`) — the README links to them already.
- [ ] **A short GIF** of tapping a recipe preset and watching the gauge and status pill change would sell the dashboard in three seconds.
- [ ] **Light theme variant.** Every colour is hardcoded for the dark charcoal/ember look. A light palette (or reading the HA theme variables) would help people who do not run dark mode.
- [ ] **Post it to the community.** The Home Assistant forum "Share your Projects" section and r/homeassistant are where dashboards like this find users — and it repays the integration author with visibility.

## 🤔 Maybe

- [ ] Cook session logging: an `input_boolean` + start timestamp per cook, so you can look back at "the 9 October brisket".
- [ ] TTS announcement to a speaker when a probe is ready.
- [ ] Use all four `food_N` channels per physical probe instead of only `food_1`.
- [ ] Meat-specific safe-temperature warnings (poultry below 74 °C, etc.).
