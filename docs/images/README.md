# Screenshots

The main README expects these files:

| File | What to capture |
|---|---|
| `cook-control.png` | The full **Cook Control** view, ideally mid-cook so the probes show different states (one `heating`, one `close`, one `ready`) |
| `probes.png` | The **Probes** view, with the probe artwork loaded |
| `settings.png` | The **Settings** page |

These are screenshots *of* the dashboard. They are unrelated to the probe artwork the Probes page renders — that lives in `/config/www/` on your Home Assistant, not in this repo. See the README install step.

Handy: put a probe in a glass of hot water to get a non-`idle` reading without firing up the grill.

Capture at a desktop width around 1400 px — the layout is capped at 1220 px, so this leaves a little margin.

Retina captures come out around 3200 px wide, which is roughly 3.5× what GitHub actually renders. Downscale before committing:

```bash
sips --resampleWidth 1800 docs/images/*.png
```

That cut the current set from 2.6 MB to 1.7 MB with no visible loss.

## Then wire them into the README

Drop the files here and run:

```bash
python3 scripts/add_screenshots.py
```

That rewrites the block between the `SCREENSHOTS` markers in `README.md` to show exactly the files that exist — the first one full width, the rest behind a *More screenshots* fold. Files you have not captured yet are skipped rather than left as a broken image, so the README never renders a broken-image icon on GitHub. Re-run it after adding another one.

## Enabling automated capture (optional, and fiddly)

The ha-mcp add-on can render dashboard views itself, but it is a beta feature that needs a second add-on and an access token:

1. **Settings → Add-ons → Add-on Store → ⋮ → Repositories**, add `https://github.com/balloob/home-assistant-addons`
2. Install the **Puppet** add-on
3. Create a long-lived access token under **Profile → Security**
4. Put that token in Puppet's `access_token` option and start it
5. In ha-mcp's web Settings UI: enable beta features, then **Enable dashboard screenshot (beta)**
6. Restart ha-mcp

Puppet listens on port 10000 with **no authentication** — keep it on a trusted network. For three screenshots, taking them by hand is usually the better trade.
