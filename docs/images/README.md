# Screenshots

The main README expects these files:

| File | What to capture |
|---|---|
| `cook-control.png` | The full **Cook Control** view, ideally mid-cook so the probes show different states (one `heating`, one `close`, one `ready`) |
| `probes.png` | The **Probes** view, with the probe artwork loaded |
| `settings.png` | The **Settings** subview |

These are screenshots *of* the dashboard. They are unrelated to the probe artwork the Probes page renders — that lives in `/config/www/` on your Home Assistant, not in this repo. See the README install step.

Handy: put a probe in a glass of hot water to get a non-`idle` reading without firing up the grill.

Capture at a desktop width around 1400 px (the layout is capped at 1220 px, so this leaves a little margin) and keep them under ~500 KB.

## Then restore the README image

The README carries a commented-out image line near the top. Once `cook-control.png` exists, uncomment it:

```markdown
![Cook Control view](docs/images/cook-control.png)
```

It is commented rather than left pointing at a missing file so the README never renders a broken image on GitHub.
