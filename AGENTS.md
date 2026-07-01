# AGENTS.md

Quick orientation for AI agents working in this repo.

## What Darin is

Darin is an AI product-manager **skill** you run inside an AI harness (Cursor, Claude Code, Codex, Gemini, …). It helps small teams capture what they learn and decide what to build — without PM jargon. Commands: `init`, `ingest`, `plan`, `insights`, `prioritize`, `review`. User data lives as plain markdown in `~/.darin/` on the user's machine, never in this repo.

## Where things are

```
skill/            source of truth — edit here
  SKILL.src.md      main skill file (uses {{placeholders}}, expanded at build)
  reference/        one .md per command (init, ingest, plan, insights, prioritize, review) + insights recipes
  templates/        PRODUCT.md, STRATEGY.md, feature-brief.md, hypothesis.md scaffolds
  scripts/          runtime .mjs the skill calls + command-metadata.json
scripts/          build + install tooling (build.mjs, install.mjs, lib/)
packages/cli/     the @getdarin/cli npm package (installer)
dist/             generated per-harness builds — do not edit
.cursor/ .claude/ …  generated working copies — do not edit
```

## Golden rule

**Edit `skill/`, never the generated copies.** `.cursor/skills/darin/`, `dist/`, etc. are all built from `skill/`. After editing, rebuild:

```bash
node scripts/build.mjs                # all harnesses → dist/
node scripts/build.mjs --also-cursor  # also refresh local .cursor working copy
```

## Insights and recipes

`insights` compares **product surface in the codebase** to Darin memory (`PRODUCT.md`, `STRATEGY.md`, `hypotheses/`, `ingestion/`). It answers: *does what we ship/say in code match what we believe and what customers told us?*

**Not `review`.** `review` sweeps internal memory for stale evidence and strategy drift. `insights` looks outward at landing pages, docs, onboarding, etc. in the current repo checkout.

**Codebase only.** Insights never fetches live URLs or uses the browser. If the user passes a URL, ask for the repo path instead.

### Recipes

A **recipe** is an audit playbook: how to find relevant files in the repo and what product checks to run. Users invoke with natural phrases (`/darin insights landing page`, `/darin insights pricing`) — the router maps phrase → recipe.

| Recipe | User might say | Reference |
|--------|----------------|-----------|
| `landing` | landing page, homepage | `skill/reference/insights/landing.md` |
| `pricing` | pricing, plans, billing | `skill/reference/insights/pricing.md` |
| `onboarding` | onboarding, signup, first run | `skill/reference/insights/onboarding.md` |
| `docs` | docs, documentation, README | `skill/reference/insights/docs.md` |
| `seo` | seo, meta tags, page titles | `skill/reference/insights/seo.md` |

Registry and file-discovery globs live in `skill/scripts/insights-recipes.json`. Routing script: `skill/scripts/insights-route.mjs` (phrase → recipe + `discovered_files` in cwd).

Reports save to `~/.darin/workspaces/<slug>/insights/YYYY-MM-DD-<recipe>.md` using `skill/templates/insights-report.md`.

**First insights run:** `/darin insights` — Darin discovers landing, docs, pricing, onboarding, or other surfaces in the repo. Works right after `init`, no ingest required.

### Adding a recipe

1. Add entry to `insights-recipes.json` (`keywords`, `globs`, `path_hints`)
2. Add `skill/reference/insights/<recipe>.md` with recipe-specific checks
3. No change to `command-metadata.json` unless renaming the command itself — recipes are sub-targets of `insights`

Run `node skill/scripts/insights-route.mjs --json --target "<phrase>" --cwd <repo>` to smoke-test discovery.

## Good to know

- The commands table in `SKILL.md` **and** the `argument-hint` are generated from `skill/scripts/command-metadata.json` (its `order` array). Add/rename/remove a command there, not by hand.
- Reference files may use `{{scripts_path}}` — keep the placeholder; the build substitutes the right path per harness.
- Keep the tone plain-language for users. The internal folders (`hypotheses/`, `source/`, `ingestion/`) keep the rigor; the user never sees the jargon.
- More detail on contributing/releasing: `CONTRIBUTING.md`, `RELEASE.md`.
