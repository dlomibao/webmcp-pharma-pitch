# CLAUDE.md

> Handoff document for a new Claude Code session picking up this project. Read this first before touching files.

---

## What this project is

A demo-driven pitch package for selling **WebMCP adoption** to pharma brands through ad-agency account teams. Two artifacts make up the deliverable:

1. **`webmcp-veritrax-demo.html`** — A single-file interactive demo. Three-pane layout. The central pitch device. Hosted live at:
   https://claude.ai/public/artifacts/b5f575d2-4891-4bb9-97f0-cdf307609f20

2. **`webmcp-pharma-deck-content.md`** — A 12-slide content document for a ~30-minute exec pitch. The demo is the gravitational center of the deck; the slides exist to set up the demo and convert the "aha" into a pilot scope.

The user is a software engineer at NYSE doing internal agentic-AI advocacy. This project is for an agency/pharma exec audience — neither the speaker nor the listener is technical. Every design decision is in service of that.

---

## The audience model

Both artifacts are built for two layers of non-technical reader:

- **Agency account leads** (delivering the pitch) — want to sound AI-forward and differentiated, can't be trusted to improvise technical explanations
- **Pharma execs** (receiving the pitch) — care about brand safety, MLR compliance, FDA enforcement, and competitive positioning; do NOT care about protocol internals

**Practical implication:** if a change makes the artifact more technically correct but harder for either layer to grok, the change is wrong. Metaphors over mechanisms. Plain English over protocol jargon.

---

## The fictional drug

The demo uses a **completely fictional** molecule:

- **VERITRAX®** (veritraxib)
- Hypothetical CDK4/6 inhibitor for HR+/HER2− metastatic breast cancer
- 200mg once-daily film-coated tablet
- Fictional FDA approval date: 2024

**Why fictional, not real:** a real drug would create legal, regulatory, and competitive complications. The goal is to show the *mechanism* (how WebMCP changes the brand/AI relationship) without clients getting distracted by "is that claim on-label for our product."

**The canonical scenario** (this is the climax of the demo — don't change without reason):
- Patient on Veritrax is prescribed **ketoconazole** by their GP for a fungal infection
- Patient asks an AI whether it's safe
- The `check_drug_interactions` tool returns **SEVERE / CONTRAINDICATED**
- Mechanism: strong CYP3A4 inhibition → ↑ veritraxib AUC up to 5.4×
- Risk: Grade 3/4 neutropenia, hepatotoxicity
- Safer alternatives suggested: fluconazole, terbinafine

Pharmacologically this is accurate (real CDK4/6 inhibitors have the same CYP3A4 sensitivity). The molecule is the only thing that's made up.

**Never ship the demo with real drug names. Never replace Veritrax with a client's product without a formal pilot scope and MLR signoff.**

---

## Demo architecture (`webmcp-veritrax-demo.html`)

### Structural constraints

- **Single file, no build step.** Must continue to work as a Claude.ai artifact. No bundler, no npm, no React.
- **External deps minimized.** Only Google Fonts (Fraunces, Inter Tight, JetBrains Mono). No CDN libraries.
- **No storage APIs.** `localStorage` and `sessionStorage` are not supported in the artifact environment. Any stateful behavior must live in JS variables and reset on page reload.
- **Pure HTML/CSS/vanilla JS.** Explicitly NOT React — this was a deliberate choice to maximize control over animation timing and avoid component boilerplate for what is ultimately a linear scripted demo.

### Layout

Three columns (stacks on mobile below 1000px):

```
┌──────────────┬──────────────┬──────────────┐
│   LEFT       │   MIDDLE     │   RIGHT      │
│              │              │              │
│ Console /    │ MCP Tool     │ veritrax.com │
│ AI Search    │ Registry     │ (branded     │
│ (toggleable) │ (5 tools)    │  pharma      │
│              │              │  site)       │
└──────────────┴──────────────┴──────────────┘
```

### Core interactions

- **View toggle** (Console ↔ AI Search): tabs in the left pane header. Switching cancels the in-flight demo via an incrementing `runId` and starts the other demo.
- **Playback speed** (1× / 2× / 4×): top-bar segmented control. Works by wrapping `sleep(ms)` with `ms / playbackSpeed`. All timed steps scale proportionally.
- **Replay**: top-bar button. Restarts whichever view is active.
- **MLR overlay**: appears ONLY when `check_drug_interactions` runs (not on other tools). Positioned dynamically below the active tool card via `getBoundingClientRect()`, straddles across pane boundaries, has a coral accent + heavy drop shadow. Dismissable via `×` button; dismissal persists for the remainder of that run but resets on Replay or view switch.

### The cancellation pattern

```js
let runId = 0;
const aborted = (myId) => myId !== runId;

async function runConsoleDemo() {
  const myId = runId;
  // ... between every async step:
  if (aborted(myId)) return;
}
```

Every `await sleep()` is followed by an `aborted(myId)` check. This is how the demo can be interrupted mid-flight without stale state bleeding between runs. Maintain this pattern in any new demo flows.

### Design system

**Fonts (from Google Fonts):**
- `Fraunces` — serif display. Used for brand headlines, AI Overview titles, hero headings.
- `Inter Tight` — sans body. Used for prose, UI copy.
- `JetBrains Mono` — monospace. Used for terminal, MCP tool schemas, eyebrows, metadata.

**Color palette** (already declared as CSS variables in `:root`):

```
VERITRAX brand         Terminal               MCP panel              Search view
--brand: #0F3D3E       --term-bg: #0A0E14     --mcp-bg: #14171C      --srch-bg: #FDFCF8
--brand-mid: #1F5556   --term-elev: #131820   --mcp-elev: #1D2128    --srch-bg-2: #F5F3EC
--cream: #FAF6ED       --term-text: #C9CDD2   --mcp-text: #D4D8DE    --srch-ink: #1A1F1F
--cream-dark: #F2ECDD  --term-green: #B5E8A1  --mcp-accent: #7FDBFF  --srch-accent: #4A5FD1
--coral: #E27B58       --term-cyan: #7FDBFF   --mcp-ok: #95E08E      --srch-ai: #6E4AD1
--coral-dark: #C5624A  --term-red: #FF6B6B    --mcp-warn: #FFD580
--warn: #B53227        --term-yellow: #FFD580 --mcp-err: #FF6B6B
--warn-bg: #FBE4DF     --term-magenta: #D5A3F5
```

**Use CSS vars, never hardcode colors.** If you add a new color, add it to `:root`.

### The fictional search engine

The AI Search view uses a made-up search brand:

- **Name:** `signal.` (lowercase, italic Fraunces, accent period in `--srch-accent` blue)
- **Logo:** concentric circles (outer stroke in blue, inner fill in purple AI accent)
- **Tagline/voice:** Google-AI-Overview-style but not Google

Don't rename it, don't Google-ify it. The fictional search engine avoids trademark complications the same way the fictional drug does.

### The five MCP tools

These are fixed. Don't rename without reason. Each tool card has a schema display, a status indicator (idle / running / ok / warning), a call counter, and a client attribution dot (magenta = console, purple = search).

```
get_drug_overview()              — product name, class, indication
get_dosing_info()                — dose, frequency, administration
check_drug_interactions(...)     — scan meds against Veritrax (THE CLIMAX TOOL)
get_side_effects({ frequency })  — list AEs by frequency band
get_prescribing_info()           — link to full FDA PI
```

Only `check_drug_interactions` triggers the MLR overlay. Only that tool returns a `severity: "severe"` warning. If you add new tools, don't make them also trigger the overlay — it's an intentionally singular moment.

### Animation timing

All animations are tuned for the 1× playback speed. If something feels too fast at 2× or 4×, that's expected — those modes are for rehearsal/quick runthroughs, not final delivery. Don't over-optimize for faster speeds.

Typical sleep values:
- Short pause between sys lines: `120–180ms`
- Between user-facing statements: `350–700ms`
- During tool execution (fake latency): `900–1200ms`
- Character typing: `14ms` per char + occasional `+40ms` jitter on non-space

---

## Deck content (`webmcp-pharma-deck-content.md`)

### Structure

12 slides, ~30 minutes + 15 min discussion. Abbreviated formats documented in the file (20-min cut, 10-min cut).

**Narrative arc:**
1. Hook: 40M daily AI health queries
2. What they're asking about: your drug
3. Traffic collapse from AI Overviews
4. Misinformation risk
5. FDA enforcement spike
6. Old playbook doesn't solve this
7. Introducing WebMCP
8. MLR inversion (deterministic, pre-approved, auditable)
9. **Demo tee-up — the most important slide**
10. Now swap Veritrax for [Client Brand]
11. 60-day pilot scope
12. Close

### Rules

- **The demo is slide 9.** Everything before is setup; everything after is conversion. Never cut the demo, even in the 10-minute format.
- **Every stat is paraphrased.** No >15-word quotes from any single source. One quote maximum per source. This is both a legal/copyright posture and a style choice — the deck should read in the agency's voice.
- **Sources are cited at the end.** Account leads are expected to pull originals before going on stage.
- **Fictional-drug briefing is an appendix.** Four pre-written answers to likely client questions about Veritrax. Keep these updated if the demo changes.

### If asked to generate an actual `.pptx`

The deck content is deliberately shipped as markdown, not PowerPoint. This is because:
- Agency creative teams have their own templates and want to re-skin everything
- The file is a content source, not a final deliverable
- Rendering Fraunces/Inter Tight properly in PPTX requires font embedding that's brittle

If the user explicitly asks for a PPTX version, read `/mnt/skills/public/pptx/SKILL.md` first and follow its guidance. Do not guess at PPTX generation.

---

## Likely next asks (prioritized by probability)

Based on the conversation pattern, these are the directions this project may go:

**Highly likely:**
- Add a third user-surface view (voice assistant, IDE/coding agent, mobile app chat)
- Add more drug-interaction scenarios (different combos, different severities)
- Generate a PPTX from the deck content (see caveats above)
- Create variants for different therapy areas (cardiology, immunology, etc.)
- Mobile-specific polish on the demo

**Moderately likely:**
- Port to React for embedding elsewhere (note: this loses the "single-file artifact" property — get explicit confirmation before doing this)
- Build a real WebMCP prototype (actually registering tools via `navigator.modelContext.registerTool`, not just mocking the UX)
- Export the demo as a video or animated GIF for deck embedding
- Build an agency-specific landing page wrapping the demo

**Less likely but worth watching:**
- Accessibility pass (the demo is visual-heavy and timed — screen-reader support would require substantial rework)
- i18n for non-English markets
- Analytics instrumentation for tracking which demo views leadership engages with

---

## Conventions to preserve

**Code style:**
- 2-space indentation
- Single quotes in JS, double in HTML attributes
- CSS custom properties (`--var`) over hardcoded values
- No CSS preprocessor, no PostCSS, no build tools
- Comments are allowed but sparse — the code is meant to be readable as-is

**UX writing:**
- Eyebrows are uppercase JetBrains Mono, wide tracking (`letter-spacing: 0.14–0.2em`)
- Body copy is Inter Tight, never Mono
- Serif (Fraunces) is reserved for display moments — headlines, AI Overview titles, drug dose numbers, brand marks
- `DEMO · NOT A REAL DRUG` disclaimer stays visible in the website footer — do not remove
- No emojis in the demo UI except the single `⚠️` on the agent warning box (already present)

**Tone in the deck content:**
- Agency voice: confident, forward-looking, never salesy
- No buzzwords ("leverage," "synergies," "transform" — all banned)
- Every stat must have a source
- Every claim about WebMCP should be defensible against a CTO who reads the W3C spec

---

## Things NOT to do

- **Don't add real drug names.** Not even as examples. Not even in code comments.
- **Don't add real brand logos.** (Client-facing pharma brands, competitor brands, AI company logos beyond what's already present.)
- **Don't break the artifact into multiple files** without explicit user confirmation. The single-file constraint exists for a reason.
- **Don't replace the pure-HTML demo with a React port** without explicit confirmation.
- **Don't make the MLR overlay trigger on every tool call.** It only fires on `check_drug_interactions`, intentionally, because that's the MLR payoff moment.
- **Don't rename `signal.`** (the fictional search engine) to match a real one.
- **Don't use `localStorage` / `sessionStorage`** — artifacts don't support them.
- **Don't touch the cancellation pattern** (`runId` / `aborted`) without replacing it with something equivalent. Race conditions on view-switch are the #1 bug vector.

---

## File locations

```
webmcp-veritrax-demo.html         # The demo artifact (single file, ~1700 lines)
webmcp-pharma-deck-content.md     # 12-slide deck content for the pitch
CLAUDE.md                         # This file
```

---

## Final note

This project's value is in the combined punch of *(demo artifact)* × *(deck narrative)* × *(fictional-drug framing that defuses legal concerns)*. Changes that strengthen one at the expense of the others usually aren't worth it. When in doubt, optimize for the moment a pharma CMO watches the demo on their phone after the meeting — that is the single interaction this whole project is designed to produce.
