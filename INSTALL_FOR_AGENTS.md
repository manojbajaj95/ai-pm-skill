# Darin Installation Guide for AI Agents

Read this entire file, then follow the steps in order. Ask the user questions when a step requires judgment.

**Target:** ~10 minutes to a working product workspace. No API keys. No database. Product memory lives in `~/.darin/` as markdown.

## What you are installing

**Darin** is a **product improvement loop** for teams using coding agents. Write suggestions from the codebase, rank them on a roadmap, hand off the top item to your coding agent.

The core loop: **`init` → `insights` → `next` → [coding agent] → `insights`**. Set harness automation after init so it runs on repeat. **`/darin ingest`** is external stimuli (customer research, metrics) — not part of the loop, but sharper insights when you file what you learn.

It is **not** tied to a git repo — one workspace slug (e.g. `acme`) is shared across landing, API, mobile, and monorepo checkouts. Everything stays plain markdown in `~/.darin/`. Nothing to sign up for.

**Repo:** [github.com/manojbajaj95/darin-skill](https://github.com/manojbajaj95/darin-skill) · **npm:** [npmjs.com/package/@getdarin/cli](https://www.npmjs.com/package/@getdarin/cli)

If you fetched this file by URL without cloning yet, companion files live in the **darin-skill** repo:

- `INSTALL_FOR_AGENTS.md` — this file (start here)
- `README.md` — user overview
- `packages/cli/` — `npx @getdarin/cli install` npm CLI
- `scripts/install.mjs` — install from clone
- `.cursor/skills/darin/` — Cursor deploy (or build from `skill/` via `scripts/build.mjs`)

## Prerequisites

- **Node.js 18+** (for workspace scripts and install/build tooling; no npm install in this repo)
- **An Agent Skills harness** — Cursor, Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, or another [supported target](#other-install-methods)

Verify Node:

```bash
node --version
```

## Step 1: Install the skill into the user's project

From the **user's project root**:

```bash
npx @getdarin/cli@latest install -y
# or: npx @getdarin/cli install --providers=cursor,claude,codex -y
```

This installs the skill into detected harness folders and scaffolds `~/.darin/` if needed. Darin supports Cursor, Claude Code, Codex CLI, Gemini CLI, GitHub Copilot, and other Agent Skills harnesses. Product memory still lives in `~/.darin/` regardless of harness.

**Do not** write product files (`PRODUCT.md`, `STRATEGY.md`, hypotheses) into the code repo. They belong under `~/.darin/workspaces/<slug>/`.

### Other install methods

<details>
<summary>Install from repo clone, global scope, legacy Cursor copy, existing skill folder, or build from dist</summary>

**Option B — Install from repo clone**

```bash
git clone https://github.com/manojbajaj95/darin-skill.git /tmp/darin-skill
cd /tmp/darin-skill
node scripts/install.mjs --target /path/to/user-repo --providers=cursor,claude,codex,gemini -y
```

**Provider aliases:** `claude` → Claude Code, `codex` → Codex (`.agents/skills/`), `copilot` → GitHub Copilot.

Omit `--providers` to auto-detect harness folders in the target project (falls back to cursor, claude-code, codex).

**Global install** (user-wide skills, e.g. `~/.claude/skills/darin/`):

```bash
node scripts/install.mjs --scope=global --providers=claude,codex -y
```

**Codex note:** invoke with `$darin` or open `/skills`. Skills live in `.agents/skills/darin/`.

**Option C — Cursor only (legacy)**

From the darin-skill repo root:

```bash
./scripts/install-cursor.sh
```

Then copy into the user's product repo (if different):

```bash
mkdir -p /path/to/user-repo/.cursor/skills
cp -R .cursor/skills/darin /path/to/user-repo/.cursor/skills/
```

**Option D — User's repo already contains a Darin skill folder**

Skip copy. Confirm these paths exist for at least one harness:

```
.cursor/skills/darin/SKILL.md          # Cursor
.claude/skills/darin/SKILL.md          # Claude Code
.agents/skills/darin/SKILL.md          # Codex CLI
.gemini/skills/darin/SKILL.md          # Gemini CLI
```

Each harness uses the same scripts under its own `skills/darin/scripts/` path.

**Option E — Install from a git URL (build only)**

```bash
git clone https://github.com/manojbajaj95/darin-skill.git /tmp/darin-skill
cd /tmp/darin-skill
node scripts/build.mjs --providers=cursor,claude-code,codex
# Copy from dist/<provider>/ into the user's project harness folders
```

</details>

## Step 2: List or create a product workspace

All commands below run from the **user's project root** (where `.cursor/skills/darin/` lives). Adjust the script path if needed.

```bash
node .cursor/skills/darin/scripts/workspace.mjs --list --json
```

**If workspaces exist:** show the list to the user. Ask whether to:

- **Use existing:** `node .cursor/skills/darin/scripts/workspace.mjs --use <slug>`
- **Create new:** continue to Step 3 with a new slug

**If none exist:** ask the user for a readable product slug before scaffolding.

Good slugs: `acme`, `mosaic`, `my-startup` (lowercase, 2–48 chars, letters/numbers/hyphens).

**Bad slugs:** auto-hashes, random UUIDs, repo folder names unless that *is* the product name.

Do **not** derive the slug from `git root` or `cwd`.

## Step 3: Scaffold and activate workspace

Replace `acme` and `"Acme Corp"` with the user's choices.

```bash
node .cursor/skills/darin/scripts/workspace.mjs --scaffold --slug acme --name "Acme Corp"
```

This creates `~/.darin/workspaces/acme/`, sets `active_workspace` in `~/.darin/config.json`, and scaffolds:

```
~/.darin/
├── config.json
└── workspaces/acme/
    ├── manifest.json
    ├── source/{interviews,meetings,market,adhoc}/
    ├── ingestion/{interviews,meetings,market,adhoc}/
    ├── hypotheses/
    ├── insights/
    └── maintenance/log/
```

Verify:

```bash
node .cursor/skills/darin/scripts/workspace.mjs --json
```

Expect `workspace_root` pointing at `~/.darin/workspaces/<slug>/` and no `error` field.

## Step 4: Run the init interview (PRODUCT + STRATEGY)

Read `.cursor/skills/darin/reference/init.md` and follow it.

Interview the user (conversationally — do not dump a form). Cover at minimum:

| Topic | Goes into |
|-------|-----------|
| Stage (early / growth / mature) | `PRODUCT.md` |
| Users and job-to-be-done | `PRODUCT.md` |
| Core problem and why now | `PRODUCT.md` |
| North-star metric | `STRATEGY.md` |
| Current bets (1–3 sharp bets) | `STRATEGY.md` |
| Non-goals this quarter | `STRATEGY.md` |
| Constraints (team, runway, platform) | `STRATEGY.md` |
| Anything else worth capturing (optional) | `PRODUCT.md § Notes` |

**Optional:** ask which repos touch this product (landing, api, admin) and append paths to `manifest.json` → `linked_repos` (reference only — not used for routing).

Write files to `workspace_root` from Step 3. Use templates as starting points:

- `.cursor/skills/darin/templates/PRODUCT.md`
- `.cursor/skills/darin/templates/STRATEGY.md`

Ensure `~/.darin/config.json` includes:

```json
{
  "active_workspace": "acme",
  "version": "0.3.0"
}
```

Darin always proposes updates to `hypotheses/` or `STRATEGY.md` and waits for user confirmation before writing — there's no config toggle for this, it's the default.

## Step 5: Verify the install

Run all three. Fix any failure before declaring success.

```bash
node .cursor/skills/darin/scripts/workspace.mjs --json
node .cursor/skills/darin/scripts/context.mjs
node .cursor/skills/darin/scripts/context-signals.mjs
```

**Pass criteria:**

| Check | Expected |
|-------|----------|
| `workspace.mjs --json` | `slug` set, `workspace_root` exists, no `NO_ACTIVE_WORKSPACE` |
| `context.mjs` | Prints `# Darin context` with PRODUCT.md body; not `NO_PRODUCT_MD` |
| `context-signals.mjs` | `setup.hasProduct: true`, `setup.hasStrategy: true` |

If `context.mjs` prints `NO_PRODUCT_MD`, return to Step 4.

If `workspace.mjs` prints `NO_ACTIVE_WORKSPACE`, run `--use <slug>` or re-run scaffold.

## Step 6: Smoke test in chat

Invoke Darin once to confirm the skill loads:

```
/darin
```

Bare `/darin` should recommend 2–3 next commands based on project signals (e.g. run insights, run next, ingest research).

**Install is complete when:** skill installed, init interview done (Steps 3–4), automation nudged, and `/darin` smoke test passes.

**User is set up when:** they've run **`/darin insights`** once and **`/darin next`** once. Optional: **`/darin ingest`** when they have customer notes to file.

**Product loop** (run in order when guiding the user):

```
/darin init                    # goals + automation nudge
/darin insights                # write suggestions from codebase
/darin next                    # hand off top roadmap item to coding agent
# [coding agent ships the brief]
/darin insights                # close the loop
```

**External stimuli** (any time, not part of the loop):

```
/darin ingest [customer note or file path]
```

## Step 7: Close — tell the user

Report clearly:

```
Darin is ready.

Active workspace: <slug>
Storage: ~/.darin/workspaces/<slug>/

Same workspace works from every repo for this product:
  export DARIN_SLUG=<slug>   # optional, in shell profile
  or set active_workspace in ~/.darin/config.json

Commands: /darin init | insights | roadmap | next | ingest | review

Product loop: init → insights → next → [coding agent] → insights

You're set up when you've run init, insights once, and next once.
```

## Multi-repo setup (if user has multiple code repos)

One slug, many repos. Set once:

```bash
echo '{ "active_workspace": "acme", "version": "0.3.0" }' > ~/.darin/config.json
```

Or in `~/.zshrc` / `~/.bashrc`:

```bash
export DARIN_SLUG=acme
```

Copy `.cursor/skills/darin/` into each repo, or keep it in a shared dotfiles repo. Product memory stays in `~/.darin/` regardless.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `NO_ACTIVE_WORKSPACE` | `node .cursor/skills/darin/scripts/workspace.mjs --list` then `--use <slug>` |
| `NO_PRODUCT_MD` | Complete Step 4 init interview |
| Skill not found in Cursor | Confirm `.cursor/skills/darin/SKILL.md` exists; enable Agent Skills in Cursor settings |
| Skill not found in Codex | Confirm `.agents/skills/darin/SKILL.md` exists; invoke `$darin` or `/skills` |
| Skill not found in Claude | Confirm `.claude/skills/darin/SKILL.md` exists; restart Claude Code |
| Wrong product loaded | Pass `--slug <slug>` to scripts or set `DARIN_SLUG` |
| Wrote PRODUCT.md into code repo | Move content to `~/.darin/workspaces/<slug>/PRODUCT.md`; delete from repo |

## Agent operating notes

After install, before any Darin command:

1. Run `node .cursor/skills/darin/scripts/workspace.mjs --json` to resolve `workspace_root`
2. Run `node .cursor/skills/darin/scripts/context.mjs` to load PRODUCT + STRATEGY

When the user invokes a sub-command (`/darin ingest`, `/darin next`, `/darin insights`, etc.), read `.cursor/skills/darin/reference/<command>.md` next.

**Never** infer workspace from git root. **Never** promote one-off anecdotes to strategy without user confirmation — durable writes to `hypotheses/` or `STRATEGY.md` always get a confirm step.
