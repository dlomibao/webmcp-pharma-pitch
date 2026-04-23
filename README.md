# WebMCP for Pharma — Pitch Package

A demo-driven pitch package for selling **WebMCP adoption** to pharma brands through ad-agency account teams.

## Live deck

**👉 [View the 10-minute deck](https://dlomibao.github.io/webmcp-pharma-pitch/)**

Controls: `←` / `→` to navigate · `S` for speaker notes · `F` for fullscreen · `#N` to deep-link to slide N.

## Files

| File | Purpose |
|---|---|
| `index.html` | The 10-min deck, bundled with the demo embedded — what GH Pages serves |
| `webmcp-pharma-10min.html` | The deck source (uses an iframe to load the demo from a sibling file) |
| `webmcp-pharma-10min-bundled.html` | Same as `index.html` — the distributable single-file build |
| `webmcp-veritrax-demo.html` | The standalone interactive demo (3-pane Veritrax scenario) |
| `webmcp-pharma-deck-content.md` | The 12-slide content document for the longer ~30-min pitch |
| `bundle.mjs` | Build script — merges the demo into the deck via `srcdoc` |
| `CLAUDE.md` | Project handoff document (read this first if extending) |

## Rebuild

```bash
node bundle.mjs
cp webmcp-pharma-10min-bundled.html index.html
```

## About the fictional drug

The demo uses **VERITRAX®** (veritraxib) — a completely fictional CDK4/6 inhibitor. Pharmacology mirrors real drugs in its class so the interactions are plausible; the molecule itself is made up. This is deliberate: a real drug would create legal, regulatory, and competitive complications that distract from showing the WebMCP mechanism. See `CLAUDE.md` for the full rationale.

**Never replace VERITRAX with a real product without formal MLR sign-off.**
