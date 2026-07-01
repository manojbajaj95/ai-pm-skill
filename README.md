# Darin · AI PM skill

**[GitHub](https://github.com/manojbajaj95/darin-skill)** · **[npm](https://www.npmjs.com/package/@getdarin/cli)**

Every team forgets why it built things. Someone decides in a meeting, a Slack thread, or alone at their desk — and months later nobody can explain the reasoning. The debate happens again, or something gets rebuilt for no good reason.

Coding agents made writing code cheap; **planning** is the new bottleneck. Darin is a skill inside Cursor, Claude Code, Codex, Gemini CLI, or any Agent Skills harness — not another app to open. Capture what you learn, **check what you ship against that memory**, then plan what to build next. Feed it interviews, support tickets, or usage numbers — Darin separates what's an observation, what's a guess, and what's an actual decision. Everything stays plain markdown in `~/.darin/` on your machine; one workspace spans every repo for your product. Nothing to sign up for.

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

Then in your harness: `**/darin init**` → `**/darin ingest**` → `**/darin insights**` → `**/darin plan**`

You're set up when you've run **init**, filed at least one **ingest**, and tried `**/darin insights`** once — Darin picks the surface to check from what's in your repo.


| Harness                     | Invoke                |
| --------------------------- | --------------------- |
| Cursor, Claude Code, Gemini | `/darin`              |
| Codex CLI                   | `$darin` or `/skills` |


## How to work with Darin

### The problem

Small teams make product decisions constantly — in a customer call, a Slack thread, or just alone at a desk. The reasoning almost never gets written down. A few months later nobody remembers why a feature exists, so the same debate happens again, or something gets ripped out and rebuilt for no good reason.

### Why Darin

Most PM tools fix this by making you adopt a whole methodology — backlogs, frameworks, jargon. That's overkill for a small team, so the tool gets abandoned. Coding agents shifted the bottleneck from writing code to deciding what to build and why — Darin is **decision memory** for that gap. It keeps the discipline (evidence, clear bets, knowing if something worked) but hides the jargon. You talk to it in plain language, and it quietly keeps the trail of what you learned and why you decided things. Everything is plain markdown on your own machine — nothing to sign up for.

### How you actually work with it

The whole thing is a simple loop: **capture what you learn, check what you ship, then plan what to build.**

1. **Set up once — `/darin init`.** Darin asks a few questions and writes down your north star and goals. This is what keeps later plans honest.
2. **Whenever you learn something — `/darin ingest`.** Stumbled across a customer call, a support ticket, a competitor move, or just a hunch? Hand it to Darin. It files it into memory and tells you what it might mean. If something's worth remembering long-term, it asks you first, in plain words — no "promote a hypothesis" ceremony.
3. **Check what you've built —** `/darin insights`**.** Point it at your landing page, docs, pricing, or onboarding. Darin spot-checks copy and flow against your product memory and flags misalignments.
4. **When you need to decide what to build — `/darin plan`.** Give it a problem or a goal. It pulls from what you've captured — not a blank page — and hands back a scoped brief: what to build now, what's next, what to skip, and how you'll know it worked.

Extras when you need them:

- `**/darin prioritize**` when you have competing work and need to order it.
- `**/darin review**` for a weekly check-in that flags stale evidence and anything drifting from your goals.

Not sure where to start? Just type `**/darin**` on its own and it'll suggest the next step based on what's going on in your project.

## Features

### Works across every repo, not just this one

Darin doesn't care which repo you're in. Give your product one workspace slug, and every repo that touches it (landing page, API, mobile app, monorepo) shares the same memory.


| Where you code      | Same Darin workspace |
| ------------------- | -------------------- |
| `~/acme/landing`    | `acme`               |
| `~/acme/api`        | `acme`               |
| `~/acme` (monorepo) | `acme`               |


Set it with `active_workspace` in `~/.darin/config.json`, or `export DARIN_SLUG=acme` if you'd rather use an environment variable.

### Commands


| Command             | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `/darin init`       | Set up your workspace — north star and goals                                  |
| `/darin ingest`     | File something you learned into memory, or plan a customer call               |
| `/darin plan`       | Turn a problem or goal into a scoped brief: build now / next / skip           |
| `/darin insights`   | Compare codebase surfaces (landing, pricing, onboarding, …) to product memory |
| `/darin prioritize` | Quick way to order competing work (RICE, ICE, value/effort, …)                |
| `/darin review`     | Weekly check-in for stale evidence and drift from your goals                  |


Not sure where to start? Just type `/darin` on its own and it'll suggest what to run next based on what's going on in your project.

### Works the same everywhere

One `/darin` command routes to whichever playbook you need, so you're not memorizing a dozen different commands across a dozen different tools.

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
        ├── hypotheses/
        └── insights/
```

None of this touches your git repos unless you specifically ask it to.

## Links

- **Repo:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill)
- **npm:** [npmjs.com/package/@getdarin/cli](https://www.npmjs.com/package/@getdarin/cli)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Agent Skills spec:** [agentskills.io](https://agentskills.io/specification)
- **Changelog:** [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md)
- **Website:** [getdarin.com](https://getdarin.com)

## License

Apache-2.0