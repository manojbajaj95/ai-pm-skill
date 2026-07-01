# @getdarin/cli

Installer for **Darin** — an AI product manager skill for Cursor, Claude Code, Codex, Gemini CLI, and other Agent Skills harnesses. Darin ingests research, tracks hypotheses with sources cited, and keeps the *why* behind product decisions so it survives past the meeting where it was decided.

**[getdarin.com](https://getdarin.com)** · **[GitHub](https://github.com/manojbajaj95/darin-skill)**

## Quick start

```bash
npx @getdarin/cli@latest install
```

This auto-detects your harness (Cursor, Claude Code, Codex, Gemini, GitHub Copilot, …) in the current project, installs the skill, and scaffolds a product workspace under `~/.darin/` if none exists.

Then in your harness:

```
/darin init
/darin ingest
/darin shape
```

| Harness | Invoke |
|---------|--------|
| Cursor, Claude Code, Gemini | `/darin` |
| Codex CLI | `$darin` or `/skills` |

## Usage

```bash
npx @getdarin/cli@latest install [options]
darin install [options]   # once installed globally: npm i -g @getdarin/cli

Options:
  --providers=LIST   Comma-separated: cursor, claude, codex, gemini, copilot, …
  --scope=SCOPE      project (default) or global
  --target=PATH      Install destination (default: cwd)
  --workspace=SLUG   Scaffold ~/.darin workspace if none exists (default: default)
  --no-workspace     Skip workspace scaffold
  -y, --yes          Skip confirmation (default when stdin is not a TTY)
```

Examples:

```bash
npx @getdarin/cli install --providers=cursor,claude,codex -y
npx @getdarin/cli install --scope=global --providers=claude -y
```

## Where data lives

Product memory lives in `~/.darin/` (markdown, no database) — never in your code repo. One workspace slug is shared across every repo for a product (landing, API, mobile, monorepo).

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

## Links

- **Docs & install guide:** [getdarin.com](https://getdarin.com)
- **Source:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill) (package lives in [`packages/cli`](https://github.com/manojbajaj95/darin-skill/tree/main/packages/cli))
- **Changelog:** [CHANGELOG.md](https://github.com/manojbajaj95/darin-skill/blob/main/packages/cli/CHANGELOG.md)

## License

Apache-2.0
