# Darin · product improvement loop for coding agents

**[GitHub](https://github.com/manojbajaj95/darin-skill)** · **[npm](https://www.npmjs.com/package/@getdarin/cli)**

Coding agents made writing code cheap; **deciding what to build** is the new bottleneck. Darin is a **product improvement loop** inside Cursor, Claude Code, Codex, Gemini CLI, or any Agent Skills harness — not another app to open.

Set goals once, **write suggestions from the codebase**, rank them on a roadmap, hand off the top item to your coding agent, repeat. Everything stays plain markdown in `~/.darin/` on your machine.

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

Then in your harness: **`/darin init`** → set automation → **`/darin insights`** → **`/darin next`** → your coding agent ships

You're set up when you've run **init**, tried **insights** once, and run **next** once.


| Harness                     | Invoke                |
| --------------------------- | --------------------- |
| Cursor, Claude Code, Gemini | `/darin`              |
| Codex CLI                   | `$darin` or `/skills` |


## The product improvement loop

```
init → insights → next → [coding agent] → insights …
```

| Phase | Command | What happens |
| ----- | ------- | ------------ |
| Setup | `/darin init` | Goals, harness automation nudge |
| Observe | `/darin insights` | Compare repo to memory — one file per suggestion |
| Rank | `/darin roadmap` | *Optional* — rank suggestions + brief for #1 |
| Hand off | `/darin next` | Top roadmap item → coding agent prompt |
| Ship | *(your coding agent)* | Implements the brief — not Darin |
| Capture | `/darin ingest` | *Outside loop* — research, metrics, notes |
| Maintain | `/darin review` | *Optional* — stale briefs, drift from goals |

Not sure where to start? Type **`/darin`** alone — it reads project signals and suggests the next step.

### Why loop engineering

Loop engineering is designing systems that run agents on repeat: observe → decide → act → verify → repeat. Darin applies that shape to **product decisions** — the coding agent owns the act phase. Feed `ingest` when you learn something new; it is external stimuli, not a loop step, but it makes the next `insights` run sharper.

## Built by Darin

This repo was built with the [product improvement loop](#the-product-improvement-loop) above.

## How to work with Darin

### The problem

Small teams make product decisions constantly — in a customer call, a Slack thread, or alone at a desk. The reasoning almost never gets written down. Months later nobody remembers why a feature exists, so the same debate happens again.

### Why Darin

Most PM tools fix this with methodology theater — backlogs, frameworks, jargon. Darin keeps the discipline (evidence, clear bets, knowing if something worked) in plain markdown on your machine. One workspace spans every repo for your product. Nothing to sign up for.

### Commands

| Command | Purpose |
| ------- | ------- |
| `/darin init` | Set up workspace — goals, automation nudge |
| `/darin insights` | Compare codebase to memory — one suggestion per finding |
| `/darin roadmap` | Rank suggestions and write brief for the top item |
| `/darin next` | Hand off top roadmap item to coding agent |
| `/darin ingest` | File research and notes (not part of the loop) |
| `/darin review` | Optional maintenance |

## Features

### Works across every repo, not just this one

Darin doesn't care which repo you're in. One workspace slug shares memory across landing, API, mobile, and monorepo checkouts.

| Where you code | Same Darin workspace |
| -------------- | -------------------- |
| `~/acme/landing` | `acme` |
| `~/acme/api` | `acme` |
| `~/acme` (monorepo) | `acme` |

Set `active_workspace` in `~/.darin/config.json`, or `export DARIN_SLUG=acme`.

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
        ├── hypotheses/
        ├── insights/
        └── roadmap/
            └── roadmap.md
```

None of this touches your git repos unless you ask.

## Links

- **Repo:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill)
- **npm:** [npmjs.com/package/@getdarin/cli](https://www.npmjs.com/package/@getdarin/cli)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Agent Skills spec:** [agentskills.io](https://agentskills.io/specification)
- **Changelog:** [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md)

## License

Apache-2.0
