# Darin · AI PM skill

**[getdarin.com](https://getdarin.com)** · **[GitHub](https://github.com/manojbajaj95/ai-pm-skill)**

Darin is your **AI product manager** — an agent skill for **Cursor, Claude Code, Codex, Gemini CLI**, and other harnesses. Ingest research, track hypotheses, shape features, and plan with evidence-backed judgment.

Product memory lives in **`~/.darin/`** on your machine (markdown, no database). Your code repos stay clean.

## Quick start

```bash
# Install the skill into your project (auto-detects harness)
npx darin@latest install

# Or from a clone of this repo
git clone https://github.com/manojbajaj95/ai-pm-skill.git
cd ai-pm-skill
node scripts/install.mjs -y
```

Then in your harness: **`/darin init`** → **`/darin ingest`** → **`/darin shape`**

| Harness | Invoke |
|---------|--------|
| Cursor, Claude Code, Gemini | `/darin` |
| Codex CLI | `$darin` or `/skills` |

**Website:** [getdarin.com](https://getdarin.com) — install instructions, early access for Darin remote (multiplayer, coming later)

## Features

### Shared product insights across repos

One **workspace slug** = one product’s brain. Darin does **not** tie memory to a git repo.

| Where you code | Same Darin workspace |
|----------------|----------------------|
| `~/acme/landing` | `acme` |
| `~/acme/api` | `acme` |
| `~/acme` (monorepo) | `acme` |

Set `active_workspace` in `~/.darin/config.json` or `export DARIN_SLUG=acme`.

### Commands

| Command | Purpose |
|---------|---------|
| `/darin init` | Product workspace + PRODUCT.md / STRATEGY.md |
| `/darin ingest` | Route research into memory |
| `/darin shape` | Problem → scoped feature brief |
| `/darin plan` | Objective → six-block plan |
| `/darin spec` | PRD-lite / user stories |
| `/darin critique` | Strategy alignment review |
| `/darin review` | Weekly maintenance sweep |

Bare `/darin` recommends next steps from project signals.

### Agent-native (multi-harness)

- Single **`/darin`** router with lazy-loaded playbooks
- Installs via **`npx darin install`** or `scripts/install.mjs`
- Pin shortcuts: `/darin pin plan` → `/plan`

## Where data lives

```
~/.darin/
├── config.json
└── workspaces/
    └── acme/
        ├── PRODUCT.md
        ├── STRATEGY.md
        ├── source/
        ├── ingestion/
        └── hypotheses/
```

Nothing product-related is written into your git repos unless you ask.

## Install

### npm CLI (recommended)

```bash
npx darin@latest install
npx darin install --providers=cursor,claude,codex -y
npx darin install --scope=global --providers=claude -y
```

Published as [`darin`](https://www.npmjs.com/package/darin) on npm. Source in [`packages/cli`](packages/cli).

### From this repo

```bash
node scripts/install.mjs --target /path/to/your-repo --providers=cursor,claude,codex -y
```

| Provider | Path | Invoke |
|----------|------|--------|
| Cursor | `.cursor/skills/darin/` | `/darin` |
| Claude Code | `.claude/skills/darin/` | `/darin` |
| Codex | `.agents/skills/darin/` | `$darin` |
| Gemini | `.gemini/skills/darin/` | `/darin` |
| GitHub Copilot | `.github/skills/darin/` | `/darin` |

**Aliases:** `claude`, `codex`, `copilot`, `rovodev`

### Install for AI agents

Paste into Cursor, Codex, or Claude Code:

```
Retrieve and follow the instructions at:
https://raw.githubusercontent.com/manojbajaj95/ai-pm-skill/main/INSTALL_FOR_AGENTS.md
```

Full protocol: [INSTALL_FOR_AGENTS.md](INSTALL_FOR_AGENTS.md)

## Development

Edit `skill/`, then sync harness builds:

```bash
node scripts/build.mjs
node scripts/install.mjs --providers=cursor,claude -y
cd packages/cli && npm pack   # CLI tarball
```

## Release (automated)

Uses [release-please](https://github.com/googleapis/release-please) (Google) — changelog and version bumps are automatic.

1. Push **conventional commits** to `main`:
   - `feat: add workspace list command`
   - `fix: install target path parsing`
   - `docs: update README`
2. Release Please opens a PR with **CHANGELOG.md** + version bump
3. **Merge the PR** → GitHub Release + npm publish (`darin@x.y.z`)

**One-time setup:** `NPM_TOKEN` secret (npm automation token with publish access to `darin`).

Changelog lives at [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md).

## Links

- **Product:** [getdarin.com](https://getdarin.com)
- **Repo:** [github.com/manojbajaj95/ai-pm-skill](https://github.com/manojbajaj95/ai-pm-skill)
- **npm:** [npmjs.com/package/darin](https://www.npmjs.com/package/darin)
- **Agent Skills spec:** [agentskills.io](https://agentskills.io/specification)

## License

Apache-2.0
