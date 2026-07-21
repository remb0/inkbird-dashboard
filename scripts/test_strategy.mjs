// Loads the built strategy, feeds it a fake Home Assistant from a
// different area, and asserts every entity id was re-pointed.
// Run: node scripts/test_strategy.mjs
import { readFileSync } from 'fs';
// minimal custom-element shims so the module can load under node
globalThis.HTMLElement = class {};
const registry = {};
globalThis.customElements = { define: (n, c) => { registry[n] = c; } };
const src = readFileSync('dist/inkbird-bbq-strategy.js', 'utf8');
const mod = new Function(src + '\nreturn null;');
mod();

const Strategy = registry['ll-strategy-dashboard-inkbird-bbq'];
if (!Strategy) throw new Error('strategy not registered');

// pretend to be someone whose device lives in the "kitchen" area
const hass = { states: {} };
for (const n of [1,2,3,4]) {
  hass.states[`sensor.kitchen_inkbird_int_14_probe_${n}_food_1_temperature`] = {};
  hass.states[`sensor.kitchen_inkbird_int_14_probe_${n}_battery`] = {};
}
hass.states['binary_sensor.inkbird_int_14_ble_connected'] = {};
hass.states['update.inkbird_int_update'] = {};

const cfg = await Strategy.generate({}, hass);
const json = JSON.stringify(cfg);

let failed = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
}

check('views', cfg.views.map(v => v.path).join(','), 'cook,probes,settings');
check('unresolved tokens', (json.match(/__INKBIRD_[A-Z_]+__/g) || []).length, 0);
check('stale source ids', (json.match(/overig/g) || []).length, 0);
if ((json.match(/sensor\.kitchen_inkbird_int_14/g) || []).length < 50) {
  console.log('FAIL  discovered prefix was not applied broadly'); failed++;
} else { console.log('ok    discovered prefix applied throughout'); }
const probe1 = cfg.views[0].cards[0].cards.find(c => c.type === 'grid' && c.columns === 2).cards[0];
check('probe card prefix', probe1.variables.prefix, 'sensor.kitchen_inkbird_int_14');

process.exit(failed ? 1 : 0);
