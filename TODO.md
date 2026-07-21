# TODO / ideas

Loosely ordered by "how much better does this make the dashboard per hour of work".

---

## 🐞 Fix first

- [x] ~~**The "Live · via Bluetooth" pill is hardcoded.**~~ Now driven by `sensor.inkbird_int_14_active_transport` + `binary_sensor.inkbird_int_14_ble_connected`: green *Live*, pulsing amber *Connecting* (transport is `ble_waiting`, or claims `ble` while the BLE binary sensor is `off`), red *Offline*.
- [ ] **"BLE 5.4" in the base-station card is still static text.** The header pill now reports the real transport, but the base-station card below it does not. Point its "Connection" field at the same `active_transport` sensor, or drop the field.
- [ ] **`ready` can flicker.** A probe hovering exactly on its target re-triggers the notification every time it crosses back and forth. Add `for: "00:00:30"` to the state triggers, or a small hysteresis in the template sensor.
- [x] ~~**Recipe buttons always print `°C`.**~~ They convert with the unit toggle now, like the probe cards.
- [x] ~~**The 6-column recipe row does not fold on mobile.**~~ Both the recipe row and the probe grid use `repeat(auto-fit, minmax(…))` via card-mod, so they reflow instead of squeezing.

## 📊 Worth adding

- [x] ~~**Probe battery levels.**~~ A colour-coded percentage under each card's P1–P4 badge, plus bar gauges for all four on the Settings page.
- [x] ~~**Low probe battery warning.**~~ Automation with a threshold slider and an on/off toggle, both on the Settings page.
- [ ] **Temperature history on Cook Control.** The Probes page now has a one-hour `history-graph` per probe, but Cook Control has none. A single card there showing all four probes over 12 hours turns it from a status page into a cook log — the classic brisket stall becomes visible instead of worrying.
- [x] ~~**ETA to target.**~~ Four `derivative` sensors feed an "≈ 1 h 40 m" line on each probe card. Hidden when the probe is not actually climbing, rather than showing a nonsense number.
- [x] ~~**Stall detection.**~~ Fires on ±1 °C/h for 45 minutes while the probe is still `heating`.
- [x] ~~**Surface the ambient and extra food channels.**~~ The Probes page shows all five channels of all four probes.
- [ ] **Act on the ambient reading, don't just show it.** Displaying pit temperature is not the same as alerting on it — a "grate above 150 °C" or "fire is dying" notification is where the value is.
- [ ] **Verify the physical channel mapping.** Upstream has only confirmed `food_4` as the tip; `food_1`–`food_3` follow the community layout and are unverified. Cook Control targets `food_1`, which may not be the deepest point of the meat. Worth an ice-bath / boiling-water test to pin down, and worth feeding back upstream.
- [ ] **Rest reminder.** After a probe hits `ready`, start a timer and notify again after the resting period. Carryover cooking is where good brisket goes to die.
- [x] ~~**Actionable notifications.**~~ Snooze 10 min / Dismiss buttons, with a handler automation. Snooze re-checks the probe is still `ready` before re-notifying.
- [ ] **Doneness presets for steak.** Rare / medium-rare / medium / well-done as one recipe with four targets, rather than only "Medium Steak".

## 🧹 Structure & maintainability

- [x] ~~**Entity ids are repeated ~20 times.**~~ Probe cards now take only `num` + `prefix` and derive the rest in JS; `scripts/configure.py` rewrites the remaining ~167 ids across all three files in one command. The Probes page still spells them out because native cards cannot derive ids — that is what the script is for.
- [ ] **Turn the notification automation into a Blueprint.** Then adding a phone is a dropdown in the UI instead of hand-editing a `choose:` block, and the °C margin becomes an input. Blueprints import with a single click from a raw GitHub URL via `my.home-assistant.io/redirect/blueprint_import/` — no HACS needed — so this is the cheapest real "one-click install" win available. Cheap to do, high payoff.
- [ ] **Ship the dashboard as a HACS-installable Lovelace *strategy*.** See [HACS compatibility](#hacs-compatibility) below — this is the only route that makes the repo genuinely installable from HACS, and it would fix the entity-id duplication above at the same time.
- [x] ~~**Finish the language cleanup.**~~ Views and dashboard-owned helpers are English; `input_select.bbq_notificatie_apparaat` became `input_select.bbq_notify_target`. Recorded as a breaking change in `CHANGELOG.md`. The integration's own entity ids stay as the integration names them.
- [ ] **CI check.** A GitHub Action running `yamllint` plus a script asserting `bbq-dashboard.yaml` and `bbq-dashboard.json` parse to the same object would stop the two exports drifting apart.
- [x] ~~**Version the dashboard.**~~ `CHANGELOG.md`, a version badge and a `v1.0.0` tag.

## 📸 Presentation

- [ ] **Add the screenshots** `docs/images/cook-control.png` and `settings.png` (see `docs/images/README.md`) — the README links to them already.
- [ ] **A short GIF** of tapping a recipe preset and watching the gauge and status pill change would sell the dashboard in three seconds.
- [ ] **Light theme variant.** Every colour is hardcoded for the dark charcoal/ember look. A light palette (or reading the HA theme variables) would help people who do not run dark mode.
- [ ] **Post it to the community.** The Home Assistant forum "Share your Projects" section and r/homeassistant are where dashboards like this find users — and it repays the integration author with visibility.

## 📦 HACS compatibility

**A Lovelace dashboard config cannot be distributed through HACS as-is.** HACS has exactly six repository types and none of them carries a view/card YAML layout:

| HACS type | What it actually installs | Where it lands |
|---|---|---|
| Integration | Python custom component | `custom_components/` |
| **Dashboard** | **JavaScript** frontend resources (cards, views, strategies) | `www/community/` |
| Theme | Theme YAML (CSS variables) | `themes/` |
| Template | Jinja2 macro files | `custom_templates/` |
| AppDaemon | AppDaemon apps | `appdaemon/apps/` |
| Python Script | `python_script` snippets | `python_scripts/` |

The "Dashboard" type is the confusing one — it means *custom cards you register under Settings → Dashboards → Resources*, i.e. `.js` files. It does not mean "a dashboard someone designed".

So there are three honest paths, in increasing order of effort:

1. **Keep copy-paste (today).** Fine, but the README has to carry the install steps and users must hand-edit entity ids.
2. **Blueprint for the automation.** Native HA feature, one-click import from a raw GitHub URL, no HACS. Covers the notification half of the project. Low effort, real payoff.
3. **Rewrite the probe card as a real custom card, or better, ship a dashboard *strategy*.** A strategy is a JS module that *generates* the whole dashboard at render time — and strategies install through HACS's Dashboard category like any other card. This is the only route to a true one-click install, and it kills two other birds:
   - it can **discover the Inkbird entities at runtime** from the device registry, so nobody has to search-and-replace `overig_` ever again;
   - it removes the **button-card and card-mod dependencies**, since the rendering would be the strategy's own code.

   Cost: a real frontend project (a few hundred lines of TypeScript/JS, a build step, a `hacs.json`, and a release tag). That is the difference between "a config I published" and "an add-on people install".

## 🤔 Maybe

- [ ] Cook session logging: an `input_boolean` + start timestamp per cook, so you can look back at "the 9 October brisket".
- [ ] TTS announcement to a speaker when a probe is ready.
- [ ] Meat-specific safe-temperature warnings (poultry below 74 °C, etc.).
