# Entities & helpers reference

Everything listed here is created for you by [`packages/inkbird_bbq.yaml`](../packages/inkbird_bbq.yaml). This page exists for two reasons: to explain what each entity is *for*, and to let you rebuild them by hand through **Settings → Devices & Services → Helpers** if you would rather not use a package.

---

## Probe targets — `input_number.inkbird_target_1` … `_4`

| Field | Value |
|---|---|
| Type | Number |
| Name | `Probe 1 target` … `Probe 4 target` |
| Icon | `mdi:thermometer-alert` |
| Min / Max / Step | `0` / `300` / `1` |
| Unit | `°C` |
| Display mode | Slider |

The `+` / `−` buttons on each probe card call `input_number.increment` / `decrement` on these. Recipe presets write to them directly.

Targets are always stored in **°C**, regardless of the display unit — the °F conversion happens in the card, not in the data.

## Probe names — `input_text.inkbird_name_1` … `_4`

| Field | Value |
|---|---|
| Type | Text |
| Name | `Probe 1 name` … `Probe 4 name` |
| Max length | `100` |

Shown as the card title and used in the notification body ("🔥 Beef Brisket is ready").

## `input_select.inkbird_active_probe` — "Active probe"

Options `1`, `2`, `3`, `4`. Icon `mdi:target`.

Decides which probe a recipe preset applies to. It is the first tile in the recipe row so the "pick a probe, then tap a recipe" flow reads left to right.

## `input_select.inkbird_unit` — "Temperature unit"

Options `°C`, `°F`. Icon `mdi:thermometer`.

Display-only. The probe cards check this and convert on the fly; nothing is written back to the device, and the stored targets stay metric.

## `input_select.bbq_notify_target` — "BBQ notification target"

Icon `mdi:bell-ring`. Options must match real `notify.*` services on your instance, **without** the `notify.` prefix — e.g. a service `notify.mobile_app_pixel_9` becomes the option `mobile_app_pixel_9`.

The package ships with only `persistent_notification`. See [Notification routing](#notification-routing) below for adding your own.

> Renamed from `input_select.bbq_notificatie_apparaat` in 1.0.0 — see [`CHANGELOG.md`](../CHANGELOG.md).

## `input_text.inkbird_sensor_prefix` — the runtime prefix

The area-prefixed base of your Inkbird entities, **without** a trailing underscore — e.g. `sensor.kitchen_inkbird_int_14`. Set it on the Settings page under **Setup**.

**What follows it, live:**

- the four probe cards on Cook Control (button-card builds the ids in JS at render time)
- `sensor.bbq_probe_1_status` … `_4` (the templates build the ids at render time)
- every automation in the package

**What cannot follow it**, because Home Assistant resolves these when the config *loads* rather than when they render:

| | Why |
|---|---|
| The four `derivative` rate sensors | `source:` must be a literal entity id |
| The Probes page | native `picture-elements` / `tile` / `history-graph` cards take a literal `entity:` |

For those, run `scripts/configure.py`. That is not a limitation of this dashboard — it is where HA draws the line between config-time and render-time resolution.

Everything that reads the helper falls back to the repo default if it is empty or `unknown`, so a missing helper degrades to the old hardcoded behaviour rather than breaking.

## Alert controls

| Entity | Type | What it does |
|---|---|---|
| `input_boolean.bbq_battery_alerts` | Toggle | Silences the low-battery warning without deleting the automation |
| `input_number.bbq_battery_threshold` | Number, 5–50 % | The level the warning fires below. Referenced directly by the automation's `below:`, so changing the slider takes effect immediately — no reload |
| `input_boolean.bbq_stall_alerts` | Toggle | Silences stall detection |
| `input_number.bbq_snooze_minutes` | Number, 5–60 min | How long Snooze waits before re-notifying. Also sets the button's label, so the phone shows "Snooze 20 min" |
| `input_number.bbq_rest_minutes` | Number, 0–120 min | Rest reminder after a probe hits its target. **0 switches it off** — the automation has a `numeric_state above: 0` condition, so it never even starts a delay |
| `input_boolean.bbq_show_help` | Toggle | Reveals the explanatory paragraph under Alerts, Spoken announcements and Setup |

## Spoken announcements

| Entity | What it does |
|---|---|
| `input_boolean.bbq_tts_alerts` | Master on/off for speech |
| `input_text.bbq_tts_speaker` | Target `media_player.*` entity id, e.g. `media_player.kitchen` |
| `input_text.bbq_tts_engine` | TTS entity id, e.g. `tts.home_assistant_cloud` |

Every alert passes a separate `tts_message` to `script.bbq_notify` — "Your Beef Brisket is ready. It has reached 93 degrees." rather than the on-screen "🔥 … 93°C", because emoji and `°C` do not read well out loud. If `tts_message` is omitted the spoken text falls back to `message`.

Speech is skipped entirely when the toggle is off **or** either text field is empty, and the `tts.speak` call carries `continue_on_error: true` — an unplugged speaker can never swallow the notification that already went out.

All of these have no `initial:` value, so they survive restarts — which also means they start off on a fresh install. The README's install step covers turning them on.

## `sensor.bbq_probe_1_rate` … `_4` — rate of change

`derivative` platform sensors, in **°C per hour**, over the corresponding probe's `food_1` channel.

| Setting | Value | Why |
|---|---|---|
| `time_window` | 10 minutes | Smooths probe jitter. Without it the ETA jumps around uselessly |
| `max_sub_interval` | 2 minutes | Forces recalculation even when the source stops updating, so a disconnected or genuinely stalled probe decays toward 0 instead of freezing at its last value. Stall detection depends on this |
| `round` | 1 | One decimal is plenty at this scale |

Two things consume these:

- **The ETA** on each probe card: `(target − current) ÷ rate × 60` minutes, shown only while `rate > 0.5 °C/h` and the probe is below target. A flat or falling probe would otherwise produce a nonsense or negative time, so it shows nothing instead of lying.
- **Stall detection**, below.

## `sensor.bbq_probe_1_status` … `_4` — probe state machine

Template sensors that reduce "temperature vs. target" to one of four words:

| State | Condition | Colour on the card |
|---|---|---|
| `idle` | probe temperature is not a number (no probe inserted / unavailable) | grey `#77695c` |
| `heating` | more than 5 °C below target | amber `#f2b441` |
| `close` | within 5 °C of target | orange `#ff6a2c` |
| `ready` | at or above target | green `#56c271` |

These drive the card border, the arc colour, the status pill, the alerts card and the notification trigger. To widen or narrow the "almost there" window, change the `g - 5` in each template.

## `script.inkbird_apply_recipe`

Fields: `label` (text) and `target` (number). Reads `input_select.inkbird_active_probe`, then writes `target` to that probe's `input_number` and `label` to its `input_text`. Mode `parallel`, max 10, so rapid taps do not queue up.

## Custom recipe

| Entity | What it does |
|---|---|
| `input_boolean.bbq_custom_open` | Whether the form is showing. The Custom button toggles it; Apply and Cancel turn it off |
| `input_text.bbq_custom_name` | Name written to the probe. Falls back to "Custom" if left empty |
| `input_number.bbq_custom_target` | Target in °C |

The form deliberately reuses the *existing* helpers for probe, notify target and announcements rather than duplicating them per recipe — those are instance-wide settings, and a per-recipe copy would quietly diverge from what the alerts actually read.

`script.inkbird_apply_custom_recipe` reads the name and target, hands them to `script.inkbird_apply_recipe` — the same path the presets use — and closes the form.

## `script.bbq_notify`

Fields: `title`, `message`, `tag`, and optional `actions` and `tts_message`. See [Notification routing](#notification-routing).

---

## The automations

| Automation | Fires when | Gated by |
|---|---|---|
| **BBQ probe reached target** | A status sensor goes to `ready` | — always on |
| **BBQ probe battery low** | A probe battery drops below the threshold | `input_boolean.bbq_battery_alerts` |
| **BBQ probe stalled** | A rate sensor sits between −1 and +1 °C/h for 45 minutes *and* the probe is still `heating` | `input_boolean.bbq_stall_alerts` |
| **BBQ notification action** | You tap Snooze or Dismiss on a phone notification | — |

### Why stall detection has that second condition

A flat probe is not necessarily a stalling one. A probe lying on the counter is flat. A probe that already hit its target is flat. Only a probe that is *still climbing toward a target and has stopped* is interesting, so the automation additionally requires `sensor.bbq_probe_N_status` to be `heating`.

That check is a template, because it keys off `trigger.id` and there is no native condition for "the entity matching the trigger that fired". The prefix check in **BBQ notification action** is a template for the same reason — no native condition matches a string prefix, and it also stops the automation reacting to notification actions from other integrations.

> Home Assistant's own best-practice checker flags both as "use a native `state` condition instead". That advice is right in general — native conditions are validated when the config loads, templates only when they run. It does not apply here: expressing these natively means a four-branch `choose` keyed on `condition: trigger`, four times the config for identical behaviour. Both templates render a plain boolean and cannot silently half-work, which is the failure mode the rule exists to prevent.

### Snooze and dismiss

The ready notification carries two action buttons:

| Button | Action id | Effect |
|---|---|---|
| Snooze *N* min | `BBQ_SNOOZE_<probe>` | Clears the notification, waits `input_number.bbq_snooze_minutes`, re-sends **only if the probe is still `ready`** |
| Dismiss | `BBQ_DISMISS_<probe>` | Clears the notification |

The probe number is encoded in the action id so one handler covers all four. Re-using the `tag` means a re-notification replaces the old one rather than stacking up.

---

## Notification routing

Every alert calls **`script.bbq_notify`** with a title, message, tag and optional action buttons. That script creates the persistent notification and then runs one `choose` block to forward it. **Add a phone here once and all three alerts use it** — this is the only place notify services are named.

Service names are written out **literally** rather than templated: Home Assistant validates a literal `action:` when the config loads, but a templated one only when the script actually runs — so a typo in a template stays invisible until the moment your brisket is done.

Replace `choose: []` in the script with one branch per device:

```yaml
      - choose:
          - conditions:
              - condition: state
                entity_id: input_select.bbq_notify_target
                state: mobile_app_pixel_9
            sequence:
              - action: notify.mobile_app_pixel_9
                data:
                  title: "{{ title }}"
                  message: "{{ message }}"
                  data:
                    tag: "{{ tag }}"
                    actions: "{{ actions | default([], true) }}"
          - conditions:
              - condition: state
                entity_id: input_select.bbq_notify_target
                state: notify_pushover
            sequence:
              - action: notify.notify_pushover
                data:
                  title: "{{ title }}"
                  message: "{{ message }}"
        default: []
```

Then add `mobile_app_pixel_9` and `notify_pushover` to the options of `input_select.bbq_notify_target`. The two lists must stay in sync — an option with no matching branch silently does nothing.

The nested `data:` with `tag` and `actions` is companion-app specific; that is what produces the Snooze/Dismiss buttons. Services that are not the mobile app (Pushover, email, TV) just ignore it, or you can leave it off as in the second branch above.

---

## Entities that come from the integration

These are **not** helpers; they are provided by [`inkbird_int14`](https://github.com/zampix1/ha-inkbird-int14) and their exact ids depend on the area your device is assigned to:

| Used for | Entity on the source install |
|---|---|
| Probe temperature | `sensor.overig_inkbird_int_14_probe_N_food_1_temperature` |
| Probe battery (under the P1–P4 badge, and on Settings) | `sensor.overig_inkbird_int_14_probe_N_battery` |
| Base station battery | `sensor.overig_inkbird_int_14_base_battery` |
| Integration version + update button | `update.inkbird_int_update` |
| Connection pill — which link is carrying data | `sensor.inkbird_int_14_active_transport` |
| Connection pill — is BLE actually up | `binary_sensor.inkbird_int_14_ble_connected` |

The last two are not area-prefixed, so they normally need no editing.

### How the connection pill decides what to show

`active_transport` is mapped to a friendly name (`ble` → Bluetooth, `wifi` → Wi-Fi, `local_lan` → LAN, `cloud` → Cloud) and to one of three moods:

| Shown | When |
|---|---|
| 🟢 **Live · Bluetooth** | transport is an active link, and for BLE the `ble_connected` binary sensor is `on` |
| 🟡 **Connecting · Bluetooth** (pulsing) | transport is `ble_waiting`, or it claims `ble` while `ble_connected` is `off` |
| 🔴 **Offline · no link** | transport is `none`, `unknown` or `unavailable` |

An unrecognised transport value is shown verbatim rather than swallowed, so a future integration release adding a new link type degrades to "Live · <whatever it said>". Hover the pill to see the raw sensor value.

### Channels, and which page uses which

Each INT-14 probe reports **five** channels — confirm yours with `sensor.inkbird_int_14_probe_layout`, which on the source install reads `Probe 1: food_1, food_2, food_3, food_4, ambient; …` for all four probes.

**Cook Control** deliberately uses only `food_1` per probe. One number per probe is the point of that page; the target, the status colour and the notification all key off it.

**Probes** shows all five, using the layout and channel order from the [INT-12E-BW community dashboard](https://github.com/zampix1/ha-inkbird-int14/blob/main/docs/int12e_dashboard.md):

| Position on the probe | Integration channel | Label | Colour |
|---|---|---|---|
| Tip | `food_4` | Tip | `#2478c8` |
| Near tip | `food_1` | Food 1 | `#7669bf` |
| Middle | `food_3` | Food 3 | `#bd9411` |
| Near handle | `food_2` | Food 2 | `#49aeba` |
| Handle / ambient | `ambient` | Ambient | `#9344a1` |

> Upstream confirms `food_4` as the tip channel on both physical probes tested. **`food_1`–`food_3` follow the community layout and are not a verified physical mapping** — treat the middle positions as approximate until the integration confirms them.

That caveat matters for Cook Control too: it targets `food_1`, which is *near* the tip rather than at it. For thin cuts the difference is small; for a thick brisket, `food_4` may be the more honest "is it done" channel. Swapping is a one-line change to each probe card's `probe` variable.

### Probe artwork

The Probes page overlays readings on `/local/int12e-probe-black.png` and `-white.png`, which live in `/config/www/`. See the README's install step for the download commands. Without them the readings still work — you get a broken-image box instead of the probe drawing.
