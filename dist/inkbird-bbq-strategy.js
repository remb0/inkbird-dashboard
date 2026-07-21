// Inkbird BBQ Dashboard — Lovelace dashboard strategy
//
// GENERATED FILE — do not edit by hand.
// Built from dashboard/bbq-dashboard.json by scripts/build_strategy.py.
//
// Usage, in a dashboard's raw configuration editor:
//
//   strategy:
//     type: custom:inkbird-bbq
//   views: []
//
// Optional overrides, when auto-discovery guesses wrong:
//
//   strategy:
//     type: custom:inkbird-bbq
//     prefix: sensor.kitchen_inkbird_int_14
//     device: inkbird_int_14
//     update_entity: update.inkbird_int_update
//
// Requires the button-card and card-mod frontend cards, and the
// battery-state-card for the Settings page.

const TEMPLATE = {
  "button_card_templates": {
    "inkbird_probe": {
      "show_name": false,
      "show_icon": false,
      "show_label": false,
      "tap_action": {
        "action": "none"
      },
      "styles": {
        "card": [
          {
            "padding": "18px"
          },
          {
            "border-radius": "18px"
          },
          {
            "border": "1px solid \"#3a2f27\""
          },
          {
            "border-top": "[[[\n  var n = variables.num, ch = variables.chan || 'food_1';\n  var _p = states['input_text.inkbird_sensor_prefix'];\n  _p = _p ? _p.state : '';\n  var pfx = (_p && _p !== 'unknown' && _p !== 'unavailable') ? _p : variables.prefix;\n  var eProbe  = pfx + '_probe_' + n + '_' + ch + '_temperature';\n  var eBatt   = pfx + '_probe_' + n + '_battery';\n  var eTarget = 'input_number.inkbird_target_' + n;\n  var eName   = 'input_text.inkbird_name_' + n;\n  var eState  = 'sensor.bbq_probe_' + n + '_status';\n  var eRate   = 'sensor.bbq_probe_' + n + '_rate';\n  var _g = function(e){ var o = states[e]; return o ? o.state : undefined; };\n  var s = _g(eState) || 'idle';\n  var col = s==='ready' ? '#56c271' : s==='close' ? '#ff6a2c' : s==='heating' ? '#f2b441' : '#77695c';\n  return '3px solid ' + col;\n]]]\n"
          },
          {
            "background": "linear-gradient(180deg,#211b16,#2b231d)"
          },
          {
            "box-shadow": "0 18px 40px -18px rgba(0,0,0,.7)"
          }
        ],
        "grid": [
          {
            "grid-template-areas": "\"header header header header\" \"fig gauge side side\" \"fig gauge minus plus\""
          },
          {
            "grid-template-columns": "34px 128px 1fr 1fr"
          },
          {
            "grid-template-rows": "auto 1fr auto"
          },
          {
            "gap": "10px 12px"
          },
          {
            "align-items": "center"
          }
        ],
        "custom_fields": {
          "header": [
            {
              "justify-self": "stretch"
            }
          ],
          "fig": [
            {
              "align-self": "stretch"
            }
          ],
          "side": [
            {
              "justify-self": "stretch"
            }
          ],
          "minus": [
            {
              "justify-self": "stretch"
            }
          ],
          "plus": [
            {
              "justify-self": "stretch"
            }
          ]
        }
      },
      "custom_fields": {
        "header": "[[[\n  var n = variables.num, ch = variables.chan || 'food_1';\n  var _p = states['input_text.inkbird_sensor_prefix'];\n  _p = _p ? _p.state : '';\n  var pfx = (_p && _p !== 'unknown' && _p !== 'unavailable') ? _p : variables.prefix;\n  var eProbe  = pfx + '_probe_' + n + '_' + ch + '_temperature';\n  var eBatt   = pfx + '_probe_' + n + '_battery';\n  var eTarget = 'input_number.inkbird_target_' + n;\n  var eName   = 'input_text.inkbird_name_' + n;\n  var eState  = 'sensor.bbq_probe_' + n + '_status';\n  var eRate   = 'sensor.bbq_probe_' + n + '_rate';\n  var _g = function(e){ var o = states[e]; return o ? o.state : undefined; };\n  var s = _g(eState) || 'idle';\n  var col = s==='ready' ? '#56c271' : s==='close' ? '#ff6a2c' : s==='heating' ? '#f2b441' : '#77695c';\n  var name = _g(eName);\n  var label = s==='ready' ? 'Ready' : s==='close' ? 'Almost there' : s==='heating' ? 'Heating' : 'Not connected';\n  var bv = parseInt(_g(eBatt));\n  var bok = !isNaN(bv);\n  var bcol = !bok ? '#77695c' : bv < 20 ? '#e8503a' : bv < 40 ? '#f2b441' : '#56c271';\n  return `<div style=\"display:flex;align-items:center;gap:11px;font-family:system-ui\">\n    <div style=\"display:flex;flex-direction:column;align-items:center;gap:3px\"\n         title=\"probe ${n} battery\">\n      <div style=\"width:30px;height:30px;border-radius:9px;display:grid;place-items:center;\n           font-family:ui-monospace,monospace;font-weight:700;background:#33291f;\n           border:1px solid #4d3f33;color:#f5ede4\">P${n}</div>\n      <div style=\"font-family:ui-monospace,monospace;font-size:.62rem;font-weight:700;\n           line-height:1;color:${bcol}\">${bok?bv+'%':'\\u2014'}</div>\n    </div>\n    <div style=\"flex:1;font-weight:620;font-size:1rem;color:#f5ede4\">${name}\n      <div style=\"font-size:.74rem;color:#a89a8c;font-weight:500\">Probe ${n}</div></div>\n    <div style=\"font-size:.72rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;\n         padding:5px 11px;border-radius:999px;color:${col};\n         background:${col}26;border:1px solid ${col}66\">${label}</div>\n  </div>`;\n]]]\n",
        "fig": "[[[\n  var n = variables.num, ch = variables.chan || 'food_1';\n  var _p = states['input_text.inkbird_sensor_prefix'];\n  _p = _p ? _p.state : '';\n  var pfx = (_p && _p !== 'unknown' && _p !== 'unavailable') ? _p : variables.prefix;\n  var eProbe  = pfx + '_probe_' + n + '_' + ch + '_temperature';\n  var eBatt   = pfx + '_probe_' + n + '_battery';\n  var eTarget = 'input_number.inkbird_target_' + n;\n  var eName   = 'input_text.inkbird_name_' + n;\n  var eState  = 'sensor.bbq_probe_' + n + '_status';\n  var eRate   = 'sensor.bbq_probe_' + n + '_rate';\n  var _g = function(e){ var o = states[e]; return o ? o.state : undefined; };\n  var s = _g(eState) || 'idle';\n  var col = s==='ready' ? '#56c271' : s==='close' ? '#ff6a2c' : s==='heating' ? '#f2b441' : '#77695c';\n  var connected = s !== 'idle';\n  var tip = connected ? col : '#77695c';\n  var glow = connected ? `filter:drop-shadow(0 0 4px ${col})` : '';\n  return `<svg viewBox=\"0 0 26 150\" style=\"height:148px;width:auto;display:block;margin:auto\">\n    <defs>\n      <linearGradient id=\"st${n}\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"0\">\n        <stop offset=\"0\" stop-color=\"#6c7075\"/><stop offset=\".28\" stop-color=\"#eef1f3\"/>\n        <stop offset=\".5\" stop-color=\"#c4c9ce\"/><stop offset=\".72\" stop-color=\"#eef1f3\"/>\n        <stop offset=\"1\" stop-color=\"#5c6065\"/></linearGradient>\n      <linearGradient id=\"gl${n}\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"0\">\n        <stop offset=\"0\" stop-color=\"#0c0c0e\"/><stop offset=\".3\" stop-color=\"#3a3a40\"/>\n        <stop offset=\".5\" stop-color=\"#141418\"/><stop offset=\".75\" stop-color=\"#2a2a30\"/>\n        <stop offset=\"1\" stop-color=\"#050506\"/></linearGradient>\n      <linearGradient id=\"rg${n}\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"0\">\n        <stop offset=\"0\" stop-color=\"#8a8e93\"/><stop offset=\".5\" stop-color=\"#f2f4f6\"/>\n        <stop offset=\"1\" stop-color=\"#7a7e83\"/></linearGradient>\n    </defs>\n    <ellipse cx=\"13\" cy=\"6\" rx=\"7.5\" ry=\"2.6\" fill=\"url(#rg${n})\"/>\n    <path d=\"M5.5 6 L20.5 6 L17 52 L9 52 Z\" fill=\"url(#gl${n})\" stroke=\"#000\" stroke-width=\".6\"/>\n    <text x=\"13\" y=\"30\" text-anchor=\"middle\" font-family=\"ui-monospace,monospace\"\n          font-weight=\"700\" font-size=\"10\" fill=\"${connected?'#f0f0f2':'#8a8a8c'}\">${n}</text>\n    <rect x=\"8.5\" y=\"52\" width=\"9\" height=\"4\" rx=\"1\" fill=\"url(#rg${n})\"/>\n    <rect x=\"10\" y=\"56\" width=\"6\" height=\"82\" fill=\"url(#st${n})\"/>\n    <path d=\"M10 138 L16 138 L13 150 Z\" fill=\"${tip}\" style=\"${glow}\"/>\n  </svg>`;\n]]]\n",
        "gauge": "[[[\n  var n = variables.num, ch = variables.chan || 'food_1';\n  var _p = states['input_text.inkbird_sensor_prefix'];\n  _p = _p ? _p.state : '';\n  var pfx = (_p && _p !== 'unknown' && _p !== 'unavailable') ? _p : variables.prefix;\n  var eProbe  = pfx + '_probe_' + n + '_' + ch + '_temperature';\n  var eBatt   = pfx + '_probe_' + n + '_battery';\n  var eTarget = 'input_number.inkbird_target_' + n;\n  var eName   = 'input_text.inkbird_name_' + n;\n  var eState  = 'sensor.bbq_probe_' + n + '_status';\n  var eRate   = 'sensor.bbq_probe_' + n + '_rate';\n  var _g = function(e){ var o = states[e]; return o ? o.state : undefined; };\n  var s = _g(eState) || 'idle';\n  var col = s==='ready' ? '#56c271' : s==='close' ? '#ff6a2c' : s==='heating' ? '#f2b441' : '#77695c';\n  var t = parseFloat(_g(eProbe));\n  var g = parseFloat(_g(eTarget));\n  var amb = 22, connected = !isNaN(t);\n  var pct = connected ? Math.max(0, Math.min(1,(t-amb)/(g-amb))) : 0;\n  var R=52, C=2*Math.PI*R, ARC=0.75;\n  var dash=(C*ARC*pct).toFixed(1)+' '+C;\n  var uf = (_g('input_select.inkbird_unit')||'').indexOf('F') >= 0;\n  var us = uf ? '\\u00b0F' : '\\u00b0C';\n  var cv = function(c){ return uf ? Math.round(c*9/5+32) : Math.round(c*10)/10; };\n  var temp = connected ? cv(t) : '\\u2014';\n  return `<div style=\"position:relative;width:128px;height:128px;margin:auto\">\n    <svg width=\"128\" height=\"128\" viewBox=\"0 0 128 128\" style=\"transform:rotate(135deg)\">\n      <circle cx=\"64\" cy=\"64\" r=\"${R}\" fill=\"none\" stroke=\"#33291f\" stroke-width=\"9\"\n        stroke-linecap=\"round\" stroke-dasharray=\"${(C*ARC).toFixed(1)} ${C}\"/>\n      <circle cx=\"64\" cy=\"64\" r=\"${R}\" fill=\"none\" stroke=\"${col}\" stroke-width=\"9\"\n        stroke-linecap=\"round\" stroke-dasharray=\"${dash}\"\n        style=\"transition:stroke-dasharray .6s ease,stroke .4s\"/>\n    </svg>\n    <div style=\"position:absolute;inset:0;display:flex;flex-direction:column;\n         align-items:center;justify-content:center;font-family:ui-monospace,monospace\">\n      <div style=\"font-size:1.7rem;font-weight:650;color:#f5ede4;line-height:1\">${temp}<span style=\"font-size:.9rem;color:#a89a8c\">${us}</span></div>\n      <div style=\"font-size:.72rem;color:#77695c;margin-top:2px\">${connected?'target '+cv(g)+'\\u00b0':'no probe'}</div>\n    </div>\n  </div>`;\n]]]\n",
        "side": "[[[\n  var n = variables.num, ch = variables.chan || 'food_1';\n  var _p = states['input_text.inkbird_sensor_prefix'];\n  _p = _p ? _p.state : '';\n  var pfx = (_p && _p !== 'unknown' && _p !== 'unavailable') ? _p : variables.prefix;\n  var eProbe  = pfx + '_probe_' + n + '_' + ch + '_temperature';\n  var eBatt   = pfx + '_probe_' + n + '_battery';\n  var eTarget = 'input_number.inkbird_target_' + n;\n  var eName   = 'input_text.inkbird_name_' + n;\n  var eState  = 'sensor.bbq_probe_' + n + '_status';\n  var eRate   = 'sensor.bbq_probe_' + n + '_rate';\n  var _g = function(e){ var o = states[e]; return o ? o.state : undefined; };\n  var s = _g(eState) || 'idle';\n  var col = s==='ready' ? '#56c271' : s==='close' ? '#ff6a2c' : s==='heating' ? '#f2b441' : '#77695c';\n  var t = parseFloat(_g(eProbe));\n  var g = parseFloat(_g(eTarget));\n  var connected = !isNaN(t);\n  var uf = (_g('input_select.inkbird_unit')||'').indexOf('F') >= 0;\n  var us = uf ? '\\u00b0F' : '\\u00b0C';\n  var cv = function(c){ return uf ? Math.round(c*9/5+32) : Math.round(c*10)/10; };\n  var togo = uf ? Math.round((g-t)*9/5) : Math.round((g-t)*10)/10;\n  var footer = !connected ? 'Insert a probe to begin'\n    : (s==='ready' ? 'Reached target \\u2014 resting'\n    : Math.max(0, togo) + '\\u00b0 to go');\n  // ETA from the derivative sensor (\\u00b0C/h). Only meaningful while actually\n  // climbing \u2014 a flat or falling probe would give a nonsense or negative time.\n  var rate = parseFloat(_g(eRate));\n  var eta = '';\n  if (connected && s !== 'ready' && !isNaN(rate) && rate > 0.5 && g > t) {\n    var mins = Math.round((g - t) / rate * 60);\n    if (mins > 0 && mins <= 1440) {\n      var hh = Math.floor(mins/60), mm = mins % 60;\n      eta = hh ? ('\\u2248 ' + hh + ' h ' + mm + ' m') : ('\\u2248 ' + mm + ' m');\n    }\n  }\n  return `<div style=\"display:flex;flex-direction:column;gap:9px;font-family:system-ui\">\n    <div style=\"display:flex;align-items:center;gap:10px\">\n      <span style=\"flex:1;font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:#77695c\">Target</span>\n      <span style=\"font-family:ui-monospace,monospace;font-weight:600;font-size:1.05rem;color:#f5ede4\">${cv(g)}${us}</span>\n    </div>\n    <div style=\"font-size:.78rem;color:#a89a8c\">${footer}</div>\n    ${eta ? `<div style=\"font-family:ui-monospace,monospace;font-size:.74rem;color:${col}\">${eta}</div>` : ''}\n  </div>`;\n]]]\n",
        "minus": {
          "card": {
            "type": "custom:button-card",
            "name": "\u2212",
            "tap_action": {
              "action": "call-service",
              "service": "input_number.decrement",
              "target": {
                "entity_id": "[[[ return \"input_number.inkbird_target_\" + variables.num ]]]"
              }
            },
            "styles": {
              "card": [
                {
                  "height": "40px"
                },
                {
                  "border-radius": "10px"
                },
                {
                  "border": "1px solid \"#4d3f33\""
                },
                {
                  "background": "#33291f"
                },
                {
                  "color": "#f5ede4"
                },
                {
                  "font-size": "1.3rem"
                }
              ]
            }
          }
        },
        "plus": {
          "card": {
            "type": "custom:button-card",
            "name": "+",
            "tap_action": {
              "action": "call-service",
              "service": "input_number.increment",
              "target": {
                "entity_id": "[[[ return \"input_number.inkbird_target_\" + variables.num ]]]"
              }
            },
            "styles": {
              "card": [
                {
                  "height": "40px"
                },
                {
                  "border-radius": "10px"
                },
                {
                  "border": "1px solid \"#4d3f33\""
                },
                {
                  "background": "#33291f"
                },
                {
                  "color": "#ff6a2c"
                },
                {
                  "font-size": "1.3rem"
                }
              ]
            }
          }
        }
      }
    },
    "inkbird_recipe": {
      "show_icon": true,
      "styles": {
        "card": [
          {
            "padding": "14px"
          },
          {
            "border-radius": "14px"
          },
          {
            "border": "1px solid \"#3a2f27\""
          },
          {
            "background": "#211b16"
          }
        ],
        "grid": [
          {
            "grid-template-areas": "\"i\" \"n\" \"t\" \"s\""
          },
          {
            "grid-template-rows": "auto auto auto auto"
          },
          {
            "gap": "6px"
          },
          {
            "justify-items": "start"
          }
        ],
        "icon": [
          {
            "color": "[[[ return variables.color ]]]"
          },
          {
            "width": "30px"
          }
        ],
        "name": [
          {
            "color": "#f5ede4"
          },
          {
            "font-weight": 620
          },
          {
            "font-size": ".92rem"
          },
          {
            "justify-self": "start"
          }
        ],
        "custom_fields": {
          "t": [
            {
              "justify-self": "start"
            }
          ],
          "s": [
            {
              "justify-self": "start"
            }
          ]
        }
      },
      "custom_fields": {
        "t": "[[[\n  var u = states['input_select.inkbird_unit'];\n  var uf = u ? u.state.indexOf('F') >= 0 : false;\n  var us = uf ? '\\u00b0F' : '\\u00b0C';\n  var c = variables.temp;\n  if (variables.rname === 'Custom') {\n    var o = states['input_number.bbq_custom_target'];\n    c = o ? parseFloat(o.state) : NaN;\n    if (isNaN(c) || c <= 0) {\n      return `<div style=\"font-family:ui-monospace,monospace;font-weight:650;font-size:1.15rem;color:#77695c\">\\u2014</div>`;\n    }\n  }\n  var v = uf ? Math.round(c * 9/5 + 32) : Math.round(c);\n  return `<div style=\"font-family:ui-monospace,monospace;font-weight:650;font-size:1.15rem;color:#ff6a2c\">${v}<span style=\"font-size:.74rem;color:#a89a8c\">${us}</span></div>`;\n]]]\n",
        "s": "[[[ return `<div style=\"font-size:.74rem;color:#a89a8c\">${variables.note}</div>`; ]]]\n"
      },
      "tap_action": {
        "action": "call-service",
        "service": "script.inkbird_apply_recipe",
        "data": {
          "label": "[[[ return variables.rname ]]]",
          "target": "[[[ return variables.temp ]]]"
        }
      }
    }
  },
  "title": "Cook Control",
  "views": [
    {
      "title": "Cook Control",
      "path": "cook",
      "icon": "mdi:grill",
      "background": "#16120f",
      "cards": [
        {
          "type": "vertical-stack",
          "card_mod": {
            "style": ":host { max-width: 1220px; margin: 0 auto; display:block; }\n"
          },
          "cards": [
            {
              "type": "custom:button-card",
              "tap_action": {
                "action": "none"
              },
              "styles": {
                "card": [
                  {
                    "background": "none"
                  },
                  {
                    "border": "none"
                  },
                  {
                    "box-shadow": "none"
                  },
                  {
                    "padding": "6px 6px 0"
                  }
                ],
                "grid": [
                  {
                    "grid-template-areas": "\"mark title status\""
                  },
                  {
                    "grid-template-columns": "auto 1fr auto"
                  },
                  {
                    "align-items": "center"
                  },
                  {
                    "gap": "14px"
                  }
                ],
                "custom_fields": {
                  "title": [
                    {
                      "justify-self": "start"
                    }
                  ],
                  "status": [
                    {
                      "justify-self": "end"
                    }
                  ]
                }
              },
              "custom_fields": {
                "mark": "[[[ return `<div style=\"width:46px;height:46px;border-radius:13px;\n  display:grid;place-items:center;\n  background:linear-gradient(150deg,#ff8a3d,#ff6a2c);\n  box-shadow:0 6px 18px -6px #ff6a2c,inset 0 1px 0 rgba(255,255,255,.35)\">\n  <svg width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\"\n    stroke-width=\"2.1\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n    <path d=\"M12 3c1.5 2.5.5 4-.7 5.4C10 10 9 11.4 9 13.2A3 3 0 0 0 15 13.2c0-1.2-.5-2-1-2.8\"/>\n    <path d=\"M12 21a5 5 0 0 0 5-5c0-1.6-.7-2.7-1.5-3.7\"/></svg></div>`; ]]]\n",
                "title": "[[[ return `<div style=\"font-family:system-ui;text-align:left\">\n  <div style=\"font-size:1.16rem;font-weight:650;color:#f5ede4;letter-spacing:-.01em\">Cook Control</div>\n  <div style=\"font-size:.74rem;color:#a89a8c;letter-spacing:.14em;text-transform:uppercase\">Inkbird INT-14 (INT-14S-BW)</div>\n</div>`; ]]]\n",
                "status": "[[[\n  var tr = states['sensor.__INKBIRD_DEVICE___active_transport'];\n  var bc = states['binary_sensor.__INKBIRD_DEVICE___ble_connected'];\n  var t  = tr ? tr.state : 'unknown';\n  var map = {\n    ble:        ['Bluetooth', 'live'],\n    ble_waiting:['Bluetooth', 'wait'],\n    wifi:       ['Wi-Fi',     'live'],\n    wi_fi:      ['Wi-Fi',     'live'],\n    local_lan:  ['LAN',       'live'],\n    lan:        ['LAN',       'live'],\n    cloud:      ['Cloud',     'live'],\n    none:       ['no link',   'down'],\n    unknown:    ['no link',   'down'],\n    unavailable:['no link',   'down']\n  };\n  var m = map[t] || [t.replace(/_/g,' '), 'live'];\n  var how = m[0], mode = m[1];\n  if (mode === 'live' && t.indexOf('ble') === 0 && !(bc && bc.state === 'on')) mode = 'wait';\n  var col  = mode === 'live' ? '#56c271' : mode === 'wait' ? '#f2b441' : '#e8503a';\n  var word = mode === 'live' ? 'Live'    : mode === 'wait' ? 'Connecting' : 'Offline';\n  var pulse = mode === 'wait' ? 'animation:inkbird-pulse 1.4s ease-in-out infinite' : '';\n  var b = states['sensor.__INKBIRD_AREA_PREFIX___base_battery'].state;\n  b = (b === undefined || b === 'unknown' || b === 'unavailable') ? '\\u2014' : b + '%';\n  return `<style>@keyframes inkbird-pulse{0%,100%{opacity:1}50%{opacity:.25}}</style>\n  <div style=\"display:flex;gap:10px;align-items:center;font-family:system-ui\">\n    <span title=\"active transport: ${t}\"\n      style=\"display:inline-flex;align-items:center;gap:8px;background:#211b16;\n      border:1px solid #3a2f27;padding:8px 13px;border-radius:999px;font-size:.82rem;color:#a89a8c\">\n      <span style=\"width:8px;height:8px;border-radius:50%;background:${col};${pulse}\"></span>\n      ${word} \\u00b7 <b style=\"color:#f5ede4\">${how}</b></span>\n    <span style=\"background:#211b16;border:1px solid #3a2f27;padding:8px 13px;\n      border-radius:999px;font-size:.82rem;color:#a89a8c\">Base battery\n      <b style=\"color:#f5ede4\">${b}</b></span>\n  </div>`;\n]]]\n"
              }
            },
            {
              "type": "markdown",
              "content": "{% set ns = namespace(rows=[]) %}\n{% for i in range(1,5) %}\n  {% set s = states('sensor.bbq_probe_' ~ i ~ '_status') %}\n  {% set n = states('input_text.inkbird_name_' ~ i) %}\n  {% set g = states('input_number.inkbird_target_' ~ i) | int %}\n  {% if s == 'ready' %}\n    {% set ns.rows = ns.rows + ['\ud83d\udfe2 **' ~ n ~ '** reached ' ~ g ~ '\u00b0C \u2014 ready'] %}\n  {% elif s == 'close' %}\n    {% set ns.rows = ns.rows + ['\ud83d\udfe1 **' ~ n ~ '** almost there (target ' ~ g ~ '\u00b0C)'] %}\n  {% endif %}\n{% endfor %}\n### Alerts\n{% if ns.rows | length == 0 %}\n_No alerts. Everything's on track._\n{% else %}\n{% for r in ns.rows %}- {{ r }}\n{% endfor %}\n{% endif %}\n",
              "card_mod": {
                "style": "ha-card {\n  background: linear-gradient(180deg,#211b16,#2b231d);\n  border:1px solid #3a2f27; border-radius:18px; color:#f5ede4;\n}\n"
              }
            },
            {
              "type": "custom:button-card",
              "tap_action": {
                "action": "none"
              },
              "styles": {
                "card": [
                  {
                    "background": "linear-gradient(180deg,#211b16,#2b231d)"
                  },
                  {
                    "border": "1px solid \"#3a2f27\""
                  },
                  {
                    "border-radius": "18px"
                  },
                  {
                    "padding": "20px 24px"
                  },
                  {
                    "box-shadow": "0 18px 40px -18px rgba(0,0,0,.7)"
                  }
                ],
                "grid": [
                  {
                    "grid-template-areas": "\"dev meta batt\""
                  },
                  {
                    "grid-template-columns": "auto 1fr auto"
                  },
                  {
                    "align-items": "center"
                  },
                  {
                    "gap": "26px"
                  }
                ],
                "custom_fields": {
                  "meta": [
                    {
                      "justify-self": "start"
                    }
                  ]
                }
              },
              "custom_fields": {
                "dev": "[[[ return `<svg width=\"172\" height=\"158\" viewBox=\"0 0 172 158\" fill=\"none\">\n  <rect x=\"3\" y=\"3\" width=\"166\" height=\"152\" rx=\"24\" fill=\"#0b0b0d\" stroke=\"#c9cdd2\" stroke-width=\"3\"/>\n  <rect x=\"9\" y=\"9\" width=\"154\" height=\"140\" rx=\"19\" fill=\"#141416\" stroke=\"#2a2a2e\"/>\n  <rect x=\"18\" y=\"20\" width=\"66\" height=\"104\" rx=\"11\" fill=\"#0a0a0c\" stroke=\"#242428\"/>\n  <g stroke=\"#c4c9ce\" stroke-width=\"3\">\n    <line x1=\"30\" y1=\"30\" x2=\"30\" y2=\"118\"/><line x1=\"44\" y1=\"30\" x2=\"44\" y2=\"118\"/>\n    <line x1=\"58\" y1=\"30\" x2=\"58\" y2=\"118\"/><line x1=\"72\" y1=\"30\" x2=\"72\" y2=\"118\"/></g>\n  <g font-family=\"ui-monospace,monospace\" font-size=\"7\" fill=\"#e8e8ea\" text-anchor=\"middle\">\n    <text x=\"30\" y=\"40\">1</text><text x=\"44\" y=\"40\">2</text><text x=\"58\" y=\"40\">3</text><text x=\"72\" y=\"40\">4</text></g>\n  <rect x=\"92\" y=\"20\" width=\"62\" height=\"94\" rx=\"10\" fill=\"#050506\" stroke=\"#242428\"/>\n  <g font-family=\"ui-monospace,monospace\" font-weight=\"700\" fill=\"#f4f4f6\">\n    <text x=\"98\" y=\"46\" font-size=\"12\">63</text><text x=\"98\" y=\"63\" font-size=\"12\">57</text>\n    <text x=\"98\" y=\"80\" font-size=\"12\">41</text><text x=\"98\" y=\"97\" font-size=\"11\" fill=\"#55555a\">---</text></g>\n  <text x=\"123\" y=\"128\" font-family=\"system-ui\" font-weight=\"700\" font-size=\"9\" fill=\"#c9cdd2\" text-anchor=\"middle\" letter-spacing=\"1.5\">INKBIRD</text>\n  <circle cx=\"63\" cy=\"136\" r=\"10\" fill=\"#0a0a0c\" stroke=\"#c9cdd2\" stroke-width=\"1.5\"/>\n  <circle cx=\"63\" cy=\"136\" r=\"6\" fill=\"#1a1a1e\"/></svg>`; ]]]\n",
                "meta": "[[[\n  var b = states['sensor.__INKBIRD_AREA_PREFIX___base_battery'].state;\n  b = (b === undefined || b === 'unknown' || b === 'unavailable') ? '\u2014' : b + '%';\n  return `<div style=\"font-family:system-ui\">\n    <div style=\"font-size:.72rem;text-transform:uppercase;letter-spacing:.16em;color:#77695c\">Base station</div>\n    <div style=\"font-size:1.28rem;font-weight:650;color:#f5ede4;margin:2px 0 10px\">INT-14S-BW</div>\n    <div style=\"display:flex;gap:26px\">\n      <div><div style=\"font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:#77695c\">Connection</div>\n        <div style=\"font-family:ui-monospace,monospace;font-size:1.05rem;font-weight:600;color:#f5ede4\">BLE 5.4</div></div>\n      <div><div style=\"font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:#77695c\">Battery</div>\n        <div style=\"font-family:ui-monospace,monospace;font-size:1.05rem;font-weight:600;color:#f5ede4\">${b}</div></div>\n    </div></div>`;\n]]]\n",
                "batt": "[[[\n  var raw = parseInt(states['sensor.__INKBIRD_AREA_PREFIX___base_battery'].state);\n  var pct = isNaN(raw) ? 0 : raw;\n  var col = pct < 20 ? '#e8503a' : '#56c271';\n  return `<div style=\"display:flex;align-items:center;gap:9px\">\n    <div style=\"width:40px;height:18px;border:2px solid #a89a8c;border-radius:4px;padding:2px;position:relative\">\n      <div style=\"height:100%;width:${pct}%;background:${col};border-radius:1px\"></div></div>\n    <span style=\"font-family:ui-monospace,monospace;font-weight:600;color:#f5ede4\">${isNaN(raw)?'\u2014':pct+'%'}</span>\n  </div>`;\n]]]\n"
              }
            },
            {
              "type": "grid",
              "columns": 2,
              "square": false,
              "cards": [
                {
                  "type": "custom:button-card",
                  "template": "inkbird_probe",
                  "variables": {
                    "num": 1,
                    "prefix": "sensor.__INKBIRD_AREA_PREFIX__"
                  }
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_probe",
                  "variables": {
                    "num": 2,
                    "prefix": "sensor.__INKBIRD_AREA_PREFIX__"
                  }
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_probe",
                  "variables": {
                    "num": 3,
                    "prefix": "sensor.__INKBIRD_AREA_PREFIX__"
                  }
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_probe",
                  "variables": {
                    "num": 4,
                    "prefix": "sensor.__INKBIRD_AREA_PREFIX__"
                  }
                }
              ],
              "card_mod": {
                "style": "#root {\n  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)) !important;\n}\n"
              }
            },
            {
              "type": "markdown",
              "content": "#### Recipe presets \u2014 first pick the **Active probe** above, then tap a recipe\n",
              "card_mod": {
                "style": "ha-card { background:none;border:none;box-shadow:none;color:#a89a8c; }\n"
              }
            },
            {
              "type": "grid",
              "columns": 6,
              "square": false,
              "cards": [
                {
                  "type": "tile",
                  "entity": "input_select.inkbird_active_probe",
                  "name": "Active probe",
                  "icon": "mdi:thermometer-lines",
                  "features": [
                    {
                      "type": "select-options"
                    }
                  ]
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Beef Brisket",
                  "variables": {
                    "rname": "Beef Brisket",
                    "temp": 93,
                    "note": "Low & slow",
                    "color": "#b0442a"
                  },
                  "icon": "mdi:cow"
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Chicken",
                  "variables": {
                    "rname": "Chicken",
                    "temp": 74,
                    "note": "Food-safe",
                    "color": "#e0a23a"
                  },
                  "icon": "mdi:food-drumstick"
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Medium Steak",
                  "variables": {
                    "rname": "Medium Steak",
                    "temp": 57,
                    "note": "Pull temp",
                    "color": "#c25a3c"
                  },
                  "icon": "mdi:food-steak"
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Pork Ribs",
                  "variables": {
                    "rname": "Pork Ribs",
                    "temp": 90,
                    "note": "Fall-off",
                    "color": "#a9563b"
                  },
                  "icon": "mdi:pig"
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Salmon",
                  "variables": {
                    "rname": "Salmon",
                    "temp": 52,
                    "note": "Just flaky",
                    "color": "#e07a52"
                  },
                  "icon": "mdi:fish"
                },
                {
                  "type": "custom:button-card",
                  "template": "inkbird_recipe",
                  "name": "Custom",
                  "icon": "mdi:tune-variant",
                  "variables": {
                    "rname": "Custom",
                    "temp": 0,
                    "note": "Set it yourself",
                    "color": "#8a8f98"
                  },
                  "tap_action": {
                    "action": "call-service",
                    "service": "input_boolean.toggle",
                    "target": {
                      "entity_id": "input_boolean.bbq_custom_open"
                    }
                  }
                }
              ],
              "card_mod": {
                "style": "#root {\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) !important;\n}\n"
              }
            },
            {
              "type": "conditional",
              "conditions": [
                {
                  "condition": "state",
                  "entity": "input_boolean.bbq_custom_open",
                  "state": "on"
                }
              ],
              "card": {
                "type": "vertical-stack",
                "cards": [
                  {
                    "type": "markdown",
                    "content": "#### \ud83e\uddea Custom recipe\nSet it up, then **Apply to probe**. Everything below is a normal helper \u2014 the recipe presets write to the same places.\n",
                    "card_mod": {
                      "style": "ha-card { background:none;border:none;box-shadow:none;color:#a89a8c; }\n"
                    }
                  },
                  {
                    "type": "grid",
                    "columns": 2,
                    "square": false,
                    "card_mod": {
                      "style": "#root {\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)) !important;\n}\n"
                    },
                    "cards": [
                      {
                        "type": "tile",
                        "entity": "input_text.bbq_custom_name",
                        "name": "Name",
                        "icon": "mdi:pencil"
                      },
                      {
                        "type": "tile",
                        "entity": "input_number.bbq_custom_target",
                        "name": "Target",
                        "icon": "mdi:thermometer-alert",
                        "features": [
                          {
                            "type": "numeric-input",
                            "style": "slider"
                          }
                        ],
                        "features_position": "bottom"
                      },
                      {
                        "type": "tile",
                        "entity": "input_select.inkbird_active_probe",
                        "name": "Probe",
                        "icon": "mdi:target",
                        "features": [
                          {
                            "type": "select-options"
                          }
                        ],
                        "features_position": "bottom"
                      },
                      {
                        "type": "tile",
                        "entity": "input_number.bbq_rest_minutes",
                        "name": "Rest reminder",
                        "icon": "mdi:timer-sand",
                        "features": [
                          {
                            "type": "numeric-input",
                            "style": "slider"
                          }
                        ],
                        "features_position": "bottom"
                      },
                      {
                        "type": "tile",
                        "entity": "input_select.bbq_notify_target",
                        "name": "Notify",
                        "icon": "mdi:bell-ring",
                        "features": [
                          {
                            "type": "select-options"
                          }
                        ],
                        "features_position": "bottom"
                      },
                      {
                        "type": "tile",
                        "entity": "input_boolean.bbq_tts_alerts",
                        "name": "Announce out loud",
                        "icon": "mdi:bullhorn",
                        "features": [
                          {
                            "type": "toggle"
                          }
                        ],
                        "features_position": "bottom"
                      }
                    ]
                  },
                  {
                    "type": "grid",
                    "columns": 2,
                    "square": false,
                    "cards": [
                      {
                        "type": "custom:button-card",
                        "icon": "mdi:check",
                        "name": "Apply to probe",
                        "show_name": true,
                        "show_icon": true,
                        "styles": {
                          "card": [
                            {
                              "background": "#ff6a2c"
                            },
                            {
                              "border-radius": "14px"
                            },
                            {
                              "padding": "12px"
                            },
                            {
                              "color": "#1a1207"
                            }
                          ],
                          "name": [
                            {
                              "font-weight": 650
                            },
                            {
                              "font-size": ".9rem"
                            }
                          ]
                        },
                        "tap_action": {
                          "action": "call-service",
                          "service": "script.inkbird_apply_custom_recipe"
                        }
                      },
                      {
                        "type": "custom:button-card",
                        "icon": "mdi:close",
                        "name": "Cancel",
                        "show_name": true,
                        "show_icon": true,
                        "styles": {
                          "card": [
                            {
                              "background": "#211b16"
                            },
                            {
                              "border": "1px solid #3a2f27"
                            },
                            {
                              "border-radius": "14px"
                            },
                            {
                              "padding": "12px"
                            },
                            {
                              "color": "#a89a8c"
                            }
                          ],
                          "name": [
                            {
                              "font-size": ".9rem"
                            }
                          ]
                        },
                        "tap_action": {
                          "action": "call-service",
                          "service": "input_boolean.turn_off",
                          "target": {
                            "entity_id": "input_boolean.bbq_custom_open"
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ],
      "panel": true
    },
    {
      "title": "Probes",
      "path": "probes",
      "icon": "mdi:thermometer-lines",
      "type": "sections",
      "max_columns": 2,
      "background": "#16120f",
      "sections": [
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Probe 1",
              "heading_style": "title",
              "icon": "mdi:thermometer"
            },
            {
              "type": "picture-elements",
              "image": "/local/int12e-probe-black.png",
              "grid_options": {
                "columns": "full"
              },
              "elements": [
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_4_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "11.7%",
                    "top": "29.5%",
                    "color": "#2478c8",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_1_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "27.1%",
                    "top": "74%",
                    "color": "#7669bf",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_3_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "37.7%",
                    "top": "29.5%",
                    "color": "#bd9411",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_2_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "46.6%",
                    "top": "74%",
                    "color": "#49aeba",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_ambient_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "87.4%",
                    "top": "29.5%",
                    "color": "#9344a1",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                }
              ]
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_4_temperature",
              "name": "Tip",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_1_temperature",
              "name": "Food 1",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_3_temperature",
              "name": "Food 3",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_2_temperature",
              "name": "Food 2",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_ambient_temperature",
              "name": "Ambient",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_battery",
              "name": "Probe battery",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "heading",
              "icon": "mdi:chart-timeline-variant",
              "heading": "Last hour",
              "heading_style": "title"
            },
            {
              "type": "history-graph",
              "hours_to_show": 1,
              "entities": [
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_4_temperature",
                  "name": "Tip"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_1_temperature",
                  "name": "Food 1"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_3_temperature",
                  "name": "Food 3"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_food_2_temperature",
                  "name": "Food 2"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_ambient_temperature",
                  "name": "Ambient"
                }
              ]
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Probe 2",
              "heading_style": "title",
              "icon": "mdi:thermometer"
            },
            {
              "type": "picture-elements",
              "image": "/local/int12e-probe-white.png",
              "grid_options": {
                "columns": "full"
              },
              "elements": [
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_4_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "11.7%",
                    "top": "29.5%",
                    "color": "#2478c8",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_1_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "27.1%",
                    "top": "74%",
                    "color": "#7669bf",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_3_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "37.7%",
                    "top": "29.5%",
                    "color": "#bd9411",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_2_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "46.6%",
                    "top": "74%",
                    "color": "#49aeba",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_ambient_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "87.4%",
                    "top": "29.5%",
                    "color": "#9344a1",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                }
              ]
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_4_temperature",
              "name": "Tip",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_1_temperature",
              "name": "Food 1",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_3_temperature",
              "name": "Food 3",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_2_temperature",
              "name": "Food 2",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_ambient_temperature",
              "name": "Ambient",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_battery",
              "name": "Probe battery",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "heading",
              "icon": "mdi:chart-timeline-variant",
              "heading": "Last hour",
              "heading_style": "title"
            },
            {
              "type": "history-graph",
              "hours_to_show": 1,
              "entities": [
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_4_temperature",
                  "name": "Tip"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_1_temperature",
                  "name": "Food 1"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_3_temperature",
                  "name": "Food 3"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_food_2_temperature",
                  "name": "Food 2"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_ambient_temperature",
                  "name": "Ambient"
                }
              ]
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Probe 3",
              "heading_style": "title",
              "icon": "mdi:thermometer"
            },
            {
              "type": "picture-elements",
              "image": "/local/int12e-probe-black.png",
              "grid_options": {
                "columns": "full"
              },
              "elements": [
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_4_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "11.7%",
                    "top": "29.5%",
                    "color": "#2478c8",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_1_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "27.1%",
                    "top": "74%",
                    "color": "#7669bf",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_3_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "37.7%",
                    "top": "29.5%",
                    "color": "#bd9411",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_2_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "46.6%",
                    "top": "74%",
                    "color": "#49aeba",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_ambient_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "87.4%",
                    "top": "29.5%",
                    "color": "#9344a1",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                }
              ]
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_4_temperature",
              "name": "Tip",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_1_temperature",
              "name": "Food 1",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_3_temperature",
              "name": "Food 3",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_2_temperature",
              "name": "Food 2",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_ambient_temperature",
              "name": "Ambient",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_battery",
              "name": "Probe battery",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "heading",
              "icon": "mdi:chart-timeline-variant",
              "heading": "Last hour",
              "heading_style": "title"
            },
            {
              "type": "history-graph",
              "hours_to_show": 1,
              "entities": [
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_4_temperature",
                  "name": "Tip"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_1_temperature",
                  "name": "Food 1"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_3_temperature",
                  "name": "Food 3"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_food_2_temperature",
                  "name": "Food 2"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_ambient_temperature",
                  "name": "Ambient"
                }
              ]
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Probe 4",
              "heading_style": "title",
              "icon": "mdi:thermometer"
            },
            {
              "type": "picture-elements",
              "image": "/local/int12e-probe-white.png",
              "grid_options": {
                "columns": "full"
              },
              "elements": [
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_4_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "11.7%",
                    "top": "29.5%",
                    "color": "#2478c8",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_1_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "27.1%",
                    "top": "74%",
                    "color": "#7669bf",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_3_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "37.7%",
                    "top": "29.5%",
                    "color": "#bd9411",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_2_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "46.6%",
                    "top": "74%",
                    "color": "#49aeba",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                },
                {
                  "type": "state-label",
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_ambient_temperature",
                  "tap_action": {
                    "action": "more-info"
                  },
                  "style": {
                    "left": "87.4%",
                    "top": "29.5%",
                    "color": "#9344a1",
                    "font-size": "14px",
                    "font-weight": "700",
                    "line-height": "1",
                    "white-space": "nowrap"
                  }
                }
              ]
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_4_temperature",
              "name": "Tip",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_1_temperature",
              "name": "Food 1",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_3_temperature",
              "name": "Food 3",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_2_temperature",
              "name": "Food 2",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_ambient_temperature",
              "name": "Ambient",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_battery",
              "name": "Probe battery",
              "grid_options": {
                "columns": "full"
              },
              "features_position": "bottom"
            },
            {
              "type": "heading",
              "icon": "mdi:chart-timeline-variant",
              "heading": "Last hour",
              "heading_style": "title"
            },
            {
              "type": "history-graph",
              "hours_to_show": 1,
              "entities": [
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_4_temperature",
                  "name": "Tip"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_1_temperature",
                  "name": "Food 1"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_3_temperature",
                  "name": "Food 3"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_food_2_temperature",
                  "name": "Food 2"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_ambient_temperature",
                  "name": "Ambient"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "Settings",
      "path": "settings",
      "icon": "mdi:cog",
      "type": "sections",
      "max_columns": 3,
      "background": "#16120f",
      "header": {
        "layout": "responsive",
        "card": {
          "type": "markdown",
          "text_only": true,
          "content": "{% set model = states('sensor.__INKBIRD_DEVICE___configured_model') %}{% set probes = states('sensor.__INKBIRD_DEVICE___physical_probe_count') %}{% set tr = states('sensor.__INKBIRD_DEVICE___active_transport') %}{% set ble = is_state('binary_sensor.__INKBIRD_DEVICE___ble_connected','on') %}{% set bb = states('sensor.__INKBIRD_AREA_PREFIX___base_battery') %}{% set upd = states('__INKBIRD_UPDATE__') %}\n## \u2699\ufe0f Settings\n**{{ model }}** \u00b7 {{ probes }} probes \u00b7 base battery **{{ bb }}%**\n\n{{ '\ud83d\udfe2 Connected' if ble else '\ud83d\udfe0 ' ~ tr }} \u00b7 {{ '\ud83d\udd37 Integration update available' if upd == 'on' else '\u2705 Integration up to date' }}\n"
        }
      },
      "sections": [
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Base station",
              "heading_style": "title",
              "icon": "mdi:grill"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_DEVICE___configured_model",
              "name": "Model",
              "icon": "mdi:tag-outline"
            },
            {
              "type": "tile",
              "entity": "binary_sensor.__INKBIRD_DEVICE___base_charging",
              "name": "Charging",
              "icon": "mdi:power-plug"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___base_temperature",
              "name": "Base temperature",
              "icon": "mdi:thermometer"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_DEVICE___physical_probe_count",
              "name": "Probes detected",
              "icon": "mdi:counter"
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Connection",
              "heading_style": "title",
              "icon": "mdi:bluetooth"
            },
            {
              "type": "tile",
              "entity": "select.__INKBIRD_DEVICE___transport_mode",
              "name": "Transport mode",
              "icon": "mdi:swap-horizontal",
              "features": [
                {
                  "type": "select-options"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_DEVICE___active_transport",
              "name": "Active transport",
              "icon": "mdi:transit-connection-variant"
            },
            {
              "type": "tile",
              "entity": "binary_sensor.__INKBIRD_DEVICE___ble_connected",
              "name": "Bluetooth",
              "icon": "mdi:bluetooth-connect"
            },
            {
              "type": "tile",
              "entity": "binary_sensor.__INKBIRD_DEVICE___wi_fi_connected",
              "name": "Wi-Fi",
              "icon": "mdi:wifi"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_DEVICE___battery_report_quality",
              "name": "Battery reporting",
              "icon": "mdi:signal-cellular-3"
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Batteries",
              "heading_style": "title",
              "icon": "mdi:battery-heart-variant"
            },
            {
              "type": "custom:battery-state-card",
              "title": null,
              "sort": {
                "by": "state",
                "desc": false
              },
              "collapse": 0,
              "secondary_info": "{last_changed}",
              "colors": {
                "steps": [
                  {
                    "value": 20,
                    "color": "#e8503a"
                  },
                  {
                    "value": 40,
                    "color": "#f2b441"
                  },
                  {
                    "value": 100,
                    "color": "#56c271"
                  }
                ],
                "gradient": true
              },
              "entities": [
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___base_battery",
                  "name": "Base station"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_1_battery",
                  "name": "Probe 1"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_2_battery",
                  "name": "Probe 2"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_3_battery",
                  "name": "Probe 3"
                },
                {
                  "entity": "sensor.__INKBIRD_AREA_PREFIX___probe_4_battery",
                  "name": "Probe 4"
                }
              ]
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Preferences",
              "heading_style": "title",
              "icon": "mdi:tune"
            },
            {
              "type": "tile",
              "entity": "input_select.inkbird_unit",
              "name": "Temperature unit",
              "icon": "mdi:thermometer",
              "features": [
                {
                  "type": "select-options"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_select.bbq_notify_target",
              "name": "Notification device",
              "icon": "mdi:bell-ring",
              "features": [
                {
                  "type": "select-options"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_select.inkbird_active_probe",
              "name": "Active probe",
              "icon": "mdi:target",
              "features": [
                {
                  "type": "select-options"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_boolean.bbq_show_help",
              "name": "Show help",
              "icon": "mdi:help-circle-outline",
              "features": [
                {
                  "type": "toggle"
                }
              ],
              "features_position": "bottom"
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Alerts",
              "heading_style": "title",
              "icon": "mdi:bell-alert-outline"
            },
            {
              "type": "tile",
              "entity": "input_boolean.bbq_battery_alerts",
              "name": "Low battery alerts",
              "icon": "mdi:battery-alert",
              "features": [
                {
                  "type": "toggle"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_number.bbq_battery_threshold",
              "name": "Battery threshold",
              "icon": "mdi:battery-alert-variant-outline",
              "features": [
                {
                  "type": "numeric-input",
                  "style": "slider"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_boolean.bbq_stall_alerts",
              "name": "Stall alerts",
              "icon": "mdi:trending-neutral",
              "features": [
                {
                  "type": "toggle"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_number.bbq_snooze_minutes",
              "name": "Snooze duration",
              "icon": "mdi:alarm-snooze",
              "features": [
                {
                  "type": "numeric-input",
                  "style": "slider"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "conditional",
              "conditions": [
                {
                  "condition": "state",
                  "entity": "input_boolean.bbq_show_help",
                  "state": "on"
                }
              ],
              "card": {
                "type": "markdown",
                "content": "**Low battery alerts** watch every probe and fire once a battery drops below the threshold. **Stall alerts** fire when a probe stops climbing for 45 minutes while still below target \u2014 the classic brisket stall, and the moment you decide whether to wrap. **Snooze duration** is how long the Snooze button on a push notification waits before reminding you; it also sets the button's label.\n"
              }
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Spoken announcements",
              "heading_style": "title",
              "icon": "mdi:bullhorn"
            },
            {
              "type": "tile",
              "entity": "input_boolean.bbq_tts_alerts",
              "name": "Announce out loud",
              "icon": "mdi:bullhorn",
              "features": [
                {
                  "type": "toggle"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "input_text.bbq_tts_speaker",
              "name": "Speaker",
              "icon": "mdi:speaker"
            },
            {
              "type": "tile",
              "entity": "input_text.bbq_tts_engine",
              "name": "TTS engine",
              "icon": "mdi:text-to-speech"
            },
            {
              "type": "markdown",
              "content": "Paste entity ids, e.g. `media_player.kitchen` and `tts.home_assistant_cloud`. Leave either empty to disable speech.\n"
            },
            {
              "type": "conditional",
              "conditions": [
                {
                  "condition": "state",
                  "entity": "input_boolean.bbq_show_help",
                  "state": "on"
                }
              ],
              "card": {
                "type": "markdown",
                "content": "Announcements are spoken through any media player. Paste the entity ids, e.g. `media_player.kitchen` and `tts.home_assistant_cloud`. Each alert has its own spoken wording \u2014 emoji and `\u00b0C` read badly out loud, so the speaker says \"has reached 93 degrees\" rather than the on-screen text. Leave either field empty, or the toggle off, and nothing is spoken.\n"
              }
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Integration",
              "heading_style": "title",
              "icon": "mdi:puzzle-outline"
            },
            {
              "type": "tile",
              "entity": "__INKBIRD_UPDATE__",
              "name": "Inkbird INT version",
              "icon": "mdi:update",
              "features": [
                {
                  "type": "update-actions"
                }
              ],
              "features_position": "bottom"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_DEVICE___model_support_status",
              "name": "Model support",
              "icon": "mdi:shield-check-outline"
            },
            {
              "type": "tile",
              "entity": "sensor.__INKBIRD_AREA_PREFIX___ble_diagnostic_status",
              "name": "Last BLE diagnostic",
              "icon": "mdi:stethoscope"
            },
            {
              "type": "tile",
              "entity": "button.__INKBIRD_AREA_PREFIX___capture_ble_diagnostics",
              "name": "Run BLE diagnostic",
              "icon": "mdi:play-circle-outline"
            },
            {
              "type": "tile",
              "entity": "button.__INKBIRD_DEVICE___request_snapshot",
              "name": "Request snapshot",
              "icon": "mdi:camera-outline"
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Links",
              "heading_style": "title",
              "icon": "mdi:link-variant"
            },
            {
              "type": "markdown",
              "content": "{% set integration_name = 'Inkbird INT' %}\n{% set integration_domain = 'inkbird_int14' %}\n{% set gh_integration = 'https://github.com/zampix1/ha-inkbird-int14' %}\n{% set gh_dashboard = 'https://github.com/remb0/inkbird-dashboard' %}\n- \ud83c\udf56 [food.remb0.nl](http://food.remb0.nl)\n- \ud83e\udde9 Integration: **{{ integration_name }}** (`{{ integration_domain }}`) \u2014 [GitHub]({{ gh_integration }})\n- \ud83d\udcca Dashboard: [GitHub]({{ gh_dashboard }})\n- \ud83d\udd2c Probes page adapted from the [INT-12E-BW community dashboard]({{ gh_integration }}/blob/main/docs/int12e_dashboard.md)\n"
            }
          ]
        },
        {
          "type": "grid",
          "cards": [
            {
              "type": "heading",
              "heading": "Setup",
              "heading_style": "title",
              "icon": "mdi:wrench-outline"
            },
            {
              "type": "tile",
              "entity": "input_text.inkbird_sensor_prefix",
              "name": "Sensor prefix",
              "icon": "mdi:identifier"
            },
            {
              "type": "markdown",
              "content": "The area-prefixed base of your Inkbird entities, **without** a trailing underscore \u2014 e.g. `sensor.__INKBIRD_AREA_PREFIX__`. Find it under **Developer Tools \u2192 States**, filtering on `inkbird`.\n\nChanging this re-points the four probe cards, the status sensors and every automation immediately.\n\nIt does **not** reach the rate sensors or the Probes page \u2014 Home Assistant resolves those entity ids when the config loads, not when they render. Run `scripts/configure.py` once for those.\n"
            },
            {
              "type": "conditional",
              "conditions": [
                {
                  "condition": "state",
                  "entity": "input_boolean.bbq_show_help",
                  "state": "on"
                }
              ],
              "card": {
                "type": "markdown",
                "content": "The **sensor prefix** is the shared start of your Inkbird entity ids, without a trailing underscore. Changing it immediately re-points the four probe cards, the status sensors and every automation. It cannot reach the rate sensors or the Probes page \u2014 Home Assistant fixes those entity ids when the config loads, not when they render \u2014 so run `scripts/configure.py` once for those.\n"
              }
            }
          ]
        }
      ]
    }
  ]
};

const AREA_TOKEN = "__INKBIRD_AREA_PREFIX__";
const DEVICE_TOKEN = "__INKBIRD_DEVICE__";
const UPDATE_TOKEN = "__INKBIRD_UPDATE__";

const FALLBACK_AREA = "overig_inkbird_int_14";
const FALLBACK_DEVICE = "inkbird_int_14";
const FALLBACK_UPDATE = "update.inkbird_int_update";

// The integration prefixes most entity ids with the area the device sits in,
// so the ids differ per install. Find them by shape instead of guessing.
function discover(hass) {
  const ids = Object.keys(hass && hass.states ? hass.states : {});

  let area = null;
  for (const id of ids) {
    const m = id.match(/^(sensor\.[a-z0-9_]+)_probe_1_food_1_temperature$/);
    if (m && m[1].includes("inkbird")) {
      area = m[1];
      break;
    }
  }

  let device = null;
  for (const id of ids) {
    const m = id.match(/^binary_sensor\.([a-z0-9_]+)_ble_connected$/);
    if (m && m[1].includes("inkbird")) {
      device = m[1];
      break;
    }
  }

  const update = ids.find((id) => id.startsWith("update.") && id.includes("inkbird")) || null;

  return { area, device, update };
}

// Walk the config and swap the tokens for the resolved ids. Strings only —
// the tokens never appear in a key.
function substitute(node, map) {
  if (typeof node === "string") {
    let out = node;
    for (const [token, value] of map) {
      if (out.includes(token)) out = out.split(token).join(value);
    }
    return out;
  }
  if (Array.isArray(node)) return node.map((n) => substitute(n, map));
  if (node && typeof node === "object") {
    const out = {};
    for (const k of Object.keys(node)) out[k] = substitute(node[k], map);
    return out;
  }
  return node;
}

class InkbirdBbqDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    const found = discover(hass);

    const area = (config.prefix || found.area || "sensor." + FALLBACK_AREA).replace(/^sensor\./, "");
    const device = config.device || found.device || FALLBACK_DEVICE;
    const update = config.update_entity || found.update || FALLBACK_UPDATE;

    if (!found.area && !config.prefix) {
      // eslint-disable-next-line no-console
      console.warn(
        "[inkbird-bbq] No Inkbird probe sensor found; falling back to " +
          FALLBACK_AREA +
          ". Set `prefix:` under the strategy if your ids differ."
      );
    }

    return substitute(TEMPLATE, [
      [AREA_TOKEN, area],
      [DEVICE_TOKEN, device],
      [UPDATE_TOKEN, update],
    ]);
  }
}

customElements.define("ll-strategy-dashboard-inkbird-bbq", InkbirdBbqDashboardStrategy);

// eslint-disable-next-line no-console
console.info("%c INKBIRD-BBQ-STRATEGY %c 1.0.0 ",
  "color:#f5ede4;background:#ff6a2c;font-weight:700",
  "color:#ff6a2c;background:#211b16");
