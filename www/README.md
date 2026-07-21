# Probe artwork

The **Probes** page overlays live temperature readings on a picture of a probe. Home Assistant serves anything in `<config>/www/` at the `/local/` URL, so copy both files across:

```bash
cp www/*.png /config/www/
```

Then the dashboard's `/local/int12e-probe-black.png` and `/local/int12e-probe-white.png` resolve. Odd-numbered probes use the black artwork, even-numbered the white.

If they do not appear straight away, it is almost always a cached 404 from before the files existed — hard-reload the page (`Cmd/Ctrl+Shift+R`), or in the companion app use **Settings → Companion app → Debugging → Reset frontend cache**.

## Credit

| | |
|---|---|
| **Author** | [@Nexus1212](https://github.com/Nexus1212) |
| **Source** | [zampix1/ha-inkbird-int14](https://github.com/zampix1/ha-inkbird-int14) — `docs/images/community/` |
| **Shared in** | [Discussion #3](https://github.com/zampix1/ha-inkbird-int14/discussions/3#discussioncomment-17664834) |
| **Licence** | MIT, per the upstream repository |

Redistributed here under those MIT terms so this repo installs without a separate download. The drawing depicts an **INT-12E-BW** probe — close enough to an INT-14 probe to read correctly, but not a picture of that exact hardware.
