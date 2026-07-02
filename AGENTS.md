# AGENTS.md

Quick orientation for AI agents working in this repo.

## What Darin is

Darin is a **loop engineering skill** for product decisions — RSI-adjacent, human-gated. Run inside Cursor, Claude Code, Codex, Gemini, … Commands: `init`, `insights`, `next`, `ingest` (external stimuli), `review` (optional). User data lives as plain markdown in `~/.darin/`.

### Product improvement loop

| Phase | Command | Persists |
| ----- | ------- | -------- |
| Setup | `init` | `PRODUCT.md`, `STRATEGY.md`, automation nudge per harness |
| Observe | `insights` | `insights/YYYY-MM-DD/*.md` + `run.md` |
| Decide + hand off | `next` | `hypotheses/<slug>.md`, `queue/next.md` |
| Ship | *(coding agent)* | Code in user's repo |
| Stimuli | `ingest` | `source/`, `ingestion/` — not a loop phase |
| Maintain | `review` | `maintenance/log/` — optional |

`plan` and `prioritize` are internal references absorbed by `next`.

## Where things are

```
skill/            source of truth — edit here
  SKILL.src.md      main skill file (uses {{placeholders}}, expanded at build)
  reference/        init, ingest, insights, next, review + insights nudges + init-automation
  templates/        PRODUCT.md, STRATEGY.md, insight.md, insights-run.md, queue-next.md, feature-brief.md
  scripts/          runtime .mjs + command-metadata.json
scripts/          build + install tooling (build.mjs, install.mjs, lib/)
packages/cli/     the @getdarin/cli npm package (installer)
dist/             generated per-harness builds — do not edit
.cursor/ .claude/ …  generated working copies — do not edit
```

## Golden rule

**Edit `skill/`, never the generated copies.** After editing, rebuild:

```bash
node scripts/build.mjs                # all harnesses → dist/
node scripts/build.mjs --also-cursor  # also refresh local .cursor working copy
```

## Insights

`insights` compares **product in the codebase** to Darin memory. Produces **one file per insight** under `insights/YYYY-MM-DD/`, plus session `run.md`. Observe only — does not plan. Next step: `next`.

**Not `review`.** Codebase only — no live URLs or browser.

### How it works

1. **Method** — [`skill/reference/insights/product.md`](skill/reference/insights/product.md)
2. **Nudge registry** — [`skill/reference/insights-nudges.json`](skill/reference/insights-nudges.json)
3. **Session script** — [`skill/scripts/insights-route.mjs`](skill/scripts/insights-route.mjs)
4. **Next handoff** — [`skill/scripts/next-route.mjs`](skill/scripts/next-route.mjs)

| Nudge id | PM angle |
|----------|----------|
| `positioning` | Marketing & positioning — ICP, promise, trust |
| `pricing` | Pricing & packaging |
| `activation` | Onboarding & path to aha |
| `trial` | Try-before-commit motion |
| `documentation` | Docs & enablement |
| `scope` | Surface area & focus vs strategy |

### Adding a nudge

1. Add entry to `insights-nudges.json` (`id`, `path`, `helps_with`)
2. Add `skill/reference/insights/<id>.md`
3. Rebuild skill

## Good to know

- Commands table in `SKILL.md` is generated from `skill/scripts/command-metadata.json` (`order` array).
- Reference files use `{{scripts_path}}` — keep the placeholder.
- More detail: `CONTRIBUTING.md`, `RELEASE.md`.
