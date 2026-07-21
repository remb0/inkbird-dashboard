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

## `input_select.bbq_notificatie_apparaat` — "BBQ Notificatie apparaat"

Icon `mdi:bell-ring`. Options must match real `notify.*` services on your instance, **without** the `notify.` prefix — e.g. a service `notify.mobile_app_pixel_9` becomes the option `mobile_app_pixel_9`.

The package ships with only `persistent_notification`. See [Notification routing](#notification-routing) below for adding your own.

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

---

## Notification routing

The automation always creates a persistent notification, then runs a `choose` block to optionally forward it. Service names are written out **literally** rather than templated: Home Assistant validates a literal `action:` when the config loads, but a templated one only when the automation actually fires — so a typo in a template stays invisible until the moment your brisket is done.

Replace `choose: []` in the package with one branch per device:

```yaml
      - choose:
          - conditions:
              - condition: state
                entity_id: input_select.bbq_notificatie_apparaat
                state: mobile_app_pixel_9
            sequence:
              - action: notify.mobile_app_pixel_9
                data:
                  title: "{{ msg_title }}"
                  message: "{{ msg_body }}"
          - conditions:
              - condition: state
                entity_id: input_select.bbq_notificatie_apparaat
                state: notify_pushover
            sequence:
              - action: notify.notify_pushover
                data:
                  title: "{{ msg_title }}"
                  message: "{{ msg_body }}"
        default: []
```

Then add `mobile_app_pixel_9` and `notify_pushover` to the options of `input_select.bbq_notificatie_apparaat`. The two lists must stay in sync — an option with no matching branch silently does nothing.

---

## Entities that come from the integration

These are **not** helpers; they are provided by [`inkbird_int14`](https://github.com/zampix1/ha-inkbird-int14) and their exact ids depend on the area your device is assigned to:

| Used for | Entity on the source install |
|---|---|
| Probe temperature | `sensor.overig_inkbird_int_14_probe_N_food_1_temperature` |
| Probe battery (bar on each probe card) | `sensor.overig_inkbird_int_14_probe_N_battery` |
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

The INT-14 exposes several channels per probe (`food_1` … `food_4`, `ambient`). This dashboard uses `food_1` for all four cards — swap in `ambient` on a probe you park in the pit for grate temperature.
