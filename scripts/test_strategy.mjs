// Exercise both supported dashboard profiles against fake Home Assistant
// installs. Run: node scripts/test_strategy.mjs
import { readFileSync } from 'fs';

globalThis.HTMLElement = class {};
const registry = {};
globalThis.customElements = { define: (name, klass) => { registry[name] = klass; } };
new Function(readFileSync('dist/inkbird-bbq-strategy.js', 'utf8') + '\nreturn null;')();

const Strategy = registry['ll-strategy-dashboard-inkbird-bbq'];
if (!Strategy) throw new Error('strategy not registered');

let failed = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
}

function baseHass(profile, model) {
  const states = {
    'input_select.inkbird_dashboard_model': { state: 'Auto' },
    'binary_sensor.inkbird_int_14_ble_connected': { state: 'on' },
    'sensor.inkbird_int_14_configured_model_profile': { state: profile },
    'sensor.inkbird_int_14_configured_model': { state: model },
    'sensor.inkbird_int_14_active_transport': { state: 'ble' },
    'sensor.inkbird_int_14_physical_probe_count': { state: '4' },
    'sensor.inkbird_int_14_mapped_live_temperature_channel_count': { state: profile === 'int14_bw' ? '8' : '20' },
    'sensor.inkbird_int_14_model_support_status': { state: 'tested' },
    'sensor.inkbird_int_14_battery_report_quality': { state: 'good' },
    'select.inkbird_int_14_transport_mode': { state: 'Auto' },
    'button.inkbird_int_14_request_snapshot': { state: 'unknown' },
    'update.inkbird_int_update': { state: 'off' },
  };
  for (let n = 1; n <= 4; n++) {
    states[`sensor.kitchen_inkbird_int_14_probe_${n}_battery`] = { state: '82' };
    states[`sensor.bbq_probe_${n}_rate`] = { state: '2.4' };
    states[`sensor.bbq_probe_${n}_control_temperature`] = { state: '54' };
    states[`input_number.inkbird_target_${n}`] = { state: '74' };
  }
  states['sensor.kitchen_inkbird_int_14_base_battery'] = { state: '78' };
  states['sensor.kitchen_inkbird_int_14_base_temperature'] = { state: '24' };
  return { states };
}

function bwHass() {
  const hass = baseHass('int14_bw', 'Inkbird INT-14-BW');
  for (let n = 1; n <= 4; n++) {
    hass.states[`sensor.kitchen_inkbird_int_14_probe_${n}_internal_temperature`] = { state: '54' };
    hass.states[`sensor.kitchen_inkbird_int_14_probe_${n}_ambient_temperature`] = { state: '120' };
  }
  hass.states['number.kitchen_inkbird_int_14_display_light_command'] = { state: '85' };
  hass.states['binary_sensor.inkbird_int_14_sound_enabled'] = { state: 'on' };
  return hass;
}

function sHass() {
  const hass = baseHass('int14s_bw', 'Inkbird INT-14S-BW');
  for (let n = 1; n <= 4; n++) {
    hass.states[`sensor.patio_inkbird_int_14_probe_${n}_battery`] = { state: '82' };
    for (const channel of ['food_1', 'food_2', 'food_3', 'food_4', 'ambient']) {
      hass.states[`sensor.patio_inkbird_int_14_probe_${n}_${channel}_temperature`] = { state: '54' };
    }
  }
  hass.states['sensor.inkbird_int_14_display_light'] = { state: '85' };
  return hass;
}

function probeSections(config) {
  return config.views.find((view) => view.path === 'probes').sections.filter((section) =>
    section.cards.some((card) => card.type === 'heading' && /^Probe /.test(card.heading))
  );
}

for (const [label, hass, model, channelRows] of [
  ['BW', bwHass(), 'int14_bw', 5],
  ['S', sHass(), 'int14s_bw', 8],
]) {
  const cfg = await Strategy.generate({}, hass);
  const json = JSON.stringify(cfg);
  check(`${label} views`, cfg.views.map((view) => view.path).join(','), 'cook,probes,settings');
  const cook = cfg.views.find((view) => view.path === 'cook');
  check(`${label} Cook Control layout`, cook.type, 'sections');
  check(`${label} Cook Control history`, cook.sections.flatMap((section) => section.cards).some(
    (card) => card.type === 'history-graph' && card.hours_to_show === 12
  ), true);
  check(`${label} selected model`, cfg.inkbird_model, model);
  check(`${label} probe sections`, probeSections(cfg).length, 4);
  check(`${label} rows per probe`, probeSections(cfg)[0].cards.find((card) => card.type === 'entities').entities.length, channelRows);
  check(`${label} unresolved tokens`, (json.match(/__INKBIRD_[A-Z_]+__/g) || []).length, 0);
  check(`${label} stale source ids`, (json.match(/overig/g) || []).length, 0);
  check(`${label} wrong channel layout`, model === 'int14_bw' ? json.includes('_food_') : json.includes('_internal_temperature'), false);
}

const overridden = await Strategy.generate({ model: 'int14_bw' }, sHass());
check('explicit model override', overridden.inkbird_model, 'int14_bw');

const inferred = bwHass();
delete inferred.states['sensor.inkbird_int_14_configured_model_profile'];
delete inferred.states['sensor.inkbird_int_14_configured_model'];
check('entity-shape model inference', (await Strategy.generate({}, inferred)).inkbird_model, 'int14_bw');

const bwConfig = await Strategy.generate({}, bwHass());
check('BW brightness control retained', JSON.stringify(bwConfig).includes('number.kitchen_inkbird_int_14_display_light_command'), true);
check('missing Wi-Fi entity pruned', JSON.stringify(bwConfig).includes('binary_sensor.inkbird_int_14_wi_fi_connected'), false);
check('S read-only brightness retained', JSON.stringify(await Strategy.generate({}, sHass())).includes('sensor.inkbird_int_14_display_light'), true);

const writable = bwHass();
writable.states['switch.inkbird_int_14_sound'] = { state: 'on' };
const writableCfg = await Strategy.generate({}, writable);
check('writable sound injected', JSON.stringify(writableCfg).includes('switch.inkbird_int_14_sound'), true);

process.exit(failed ? 1 : 0);
