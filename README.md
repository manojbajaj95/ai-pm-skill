# Darin · AI PM skill

**[GitHub](https://github.com/manojbajaj95/darin-skill)** · **[npm](https://www.npmjs.com/package/@getdarin/cli)**

Every team forgets why it built things. Someone makes a call in a meeting, or a Slack thread, or just decides alone at their desk, and a few months later nobody can explain the reasoning. So the debate happens again, or a feature gets ripped out and rebuilt for no good reason.

Darin is meant to fix that. It's a skill you run inside Cursor, Claude Code, Codex, Gemini CLI, or pretty much any AI tool that supports Agent Skills, not a separate app you have to remember to open. Feed it interviews, support tickets, or usage numbers, and it keeps track of what's an observation, what's a guess, and what's an actual decision. When you sit down to write a spec or rank the backlog, that history is already there with the reasoning attached.

There's nothing to sign up for. Everything gets saved as plain markdown files in `~/.darin/` on your own machine, and one workspace covers your whole product no matter how many repos you work across.

## Install for AI agents

Paste this into Cursor, Codex, or Claude Code:

```
Retrieve and follow the instructions at:
https://raw.githubusercontent.com/manojbajaj95/darin-skill/main/INSTALL_FOR_AGENTS.md
```

Full protocol: [INSTALL_FOR_AGENTS.md](INSTALL_FOR_AGENTS.md)

## Quick start

```bash
# Install the skill into your project (auto-detects harness)
npx @getdarin/cli@latest install

# Or from a clone of this repo
git clone https://github.com/manojbajaj95/darin-skill.git
cd darin-skill
node scripts/install.mjs -y
```

Then in your harness: **`/darin init`** → **`/darin ingest`** → **`/darin shape`**

| Harness | Invoke |
|---------|--------|
| Cursor, Claude Code, Gemini | `/darin` |
| Codex CLI | `$darin` or `/skills` |

## Features

### Works across every repo, not just this one

Darin doesn't care which repo you're in. Give your product one workspace slug, and every repo that touches it (landing page, API, mobile app, monorepo) shares the same memory.

| Where you code | Same Darin workspace |
|----------------|----------------------|
| `~/acme/landing` | `acme` |
| `~/acme/api` | `acme` |
| `~/acme` (monorepo) | `acme` |

Set it with `active_workspace` in `~/.darin/config.json`, or `export DARIN_SLUG=acme` if you'd rather use an environment variable.

### Commands

| Command | Purpose |
|---------|---------|
| `/darin init` | Product workspace + PRODUCT.md / STRATEGY.md |
| `/darin ingest` | Route research into memory |
| `/darin discover` | Plan a Mom Test-style discovery interview |
| `/darin shape` | Problem → scoped feature brief |
| `/darin plan` | Objective → six-block plan |
| `/darin prioritize` | Adaptive prioritization (RICE, ICE, value/effort, …) |
| `/darin spec` | PRD-lite / user stories |
| `/darin prep` | Pre-meeting stakeholder brief |
| `/darin critique` | Strategy alignment review |
| `/darin review` | Weekly maintenance sweep |

Not sure where to start? Just type `/darin` on its own and it'll suggest what to run next based on what's going on in your project.

### Works the same everywhere

One `/darin` command routes to whichever playbook you need, so you're not memorizing ten different commands across ten different tools. Tired of typing `/darin plan`? Pin it: `/darin pin plan` turns it into a plain `/plan` shortcut.

## Where data lives

Everything lives under `~/.darin/` on your own machine:

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

None of this touches your git repos unless you specifically ask it to.

## Links

- **Repo:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill)
- **npm:** [npmjs.com/package/@getdarin/cli](https://www.npmjs.com/package/@getdarin/cli)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Agent Skills spec:** [agentskills.io](https://agentskills.io/specification)
- **Changelog:** [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md)
- **Website (in progress):** [getdarin.com](https://getdarin.com), waitlist for Darin remote (shared team context, hosted, coming later)

## License

Apache-2.0
