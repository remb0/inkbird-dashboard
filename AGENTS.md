# Inkbird BBQ Dashboard — AGENTS.md

Dit is het centrale instructiebestand voor alle AI-assistenten (Claude Code, ChatGPT/Codex, Gemini/Antigravity, Cursor, etc.) die werken aan deze repository.

---

## 📌 Projectoverzicht

Een modern Home Assistant (HACS) dashboard voor de **Inkbird INT-14S-BW** draadloze BBQ-thermometer.
Bestaat uit 3 pagina's:
1. **Cook Control** (`/dashboard-bbq/cook`): 4 live probe meters, alert banner, recept-presets.
2. **Probes** (`/dashboard-bbq/probes`): Alle 5 kanalen per probe (tip, 3 food points, ambient) + historie.
3. **Settings** (`/dashboard-bbq/settings`): Apparaatstatus, verbindingen, batterijen, meldingen, TTS.

---

## 🛠️ Tech Stack & Conventies

- **Home Assistant Version**: 2024.10+
- **Architectuur**: Package YAML (`packages/inkbird_bbq.yaml`) + Lovelace dashboard YAML (`www/` / `dashboard/`).
- **Vereiste Custom Cards**: `button-card`, `battery-state-card`, `card-mod` (optioneel voor styling).
- **HACS Distribution**: HACS Custom Repository (category `plugin` / `dashboard`).
- **Units**: Alle interne temperaturen en targets worden opgeslagen in **°C**. Weergave in °F gebeurt dynamically in de UI.

---

## 📂 Belangrijke Bestanden

| Bestand / Map | Omschrijving |
|---|---|
| [`README.md`](README.md) | Volledige documentatie, functionaliteiten en schermafbeeldingen |
| [`docs/HELPERS.md`](docs/HELPERS.md) | Referentie van alle Home Assistant helpers (`input_number`, `input_text`, `input_select`) |
| [`packages/inkbird_bbq.yaml`](packages/inkbird_bbq.yaml) | Package bestand met alle automations, templates, helpers en TTS logica |
| [`hacs.json`](hacs.json) | HACS repository configuratie |

---

## 🚨 Niet Doen

- Geen hardcoded entity IDs gebruiken waar de `input_text.inkbird_sensor_prefix` dynamic template gebruikt moet worden.
- Geen brekende wijzigingen aanbrengen in helper-namen zonder dit te documenteren in [`CHANGELOG.md`](CHANGELOG.md).
- Targets in helpers nooit omrekenen naar Fahrenheit in backend code; conversie hoort uitsluitend in de UI laag.

---

## 🧪 Verificatie & Testen

- Controleer YAML syntaxis na aanpassingen.
- Zorg dat dashboard YAML compatibel blijft met native HA `sections` views.
- Test automations tegen `persistent_notification` en mobiele notification targets.
