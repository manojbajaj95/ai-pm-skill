# @getdarin/cli

Installer for **Darin** — a product improvement loop for Cursor, Claude Code, Codex, Gemini CLI, and other Agent Skills harnesses. Write suggestions (`insights`), rank them (`roadmap`), hand off the top item (`next`) to your coding agent.

**[GitHub](https://github.com/manojbajaj95/darin-skill)** · **[npm](https://www.npmjs.com/package/@getdarin/cli)**

## Quick start

```bash
npx @getdarin/cli@latest install
```

This auto-detects your harness, installs the skill, and scaffolds a product workspace under `~/.darin/` if none exists.

Then in your harness:

```
/darin init
/darin insights
/darin next
```

Your coding agent ships the brief. Run `insights` again to close the loop. Use `ingest` for external stimuli (customer research) — not part of the loop, but sharper insights.

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

Product memory lives in `~/.darin/` (markdown, no database) — never in your code repo.

```
~/.darin/
├── config.json
└── workspaces/
    └── acme/
        ├── PRODUCT.md
        ├── STRATEGY.md
        ├── insights/
        └── roadmap/
            └── roadmap.md
            └── next.md
```

## Links

- **Install guide:** [INSTALL_FOR_AGENTS.md](https://github.com/manojbajaj95/darin-skill/blob/main/INSTALL_FOR_AGENTS.md)
- **Source:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill)
- **Changelog:** [CHANGELOG.md](https://github.com/manojbajaj95/darin-skill/blob/main/packages/cli/CHANGELOG.md)

## License

Apache-2.0
