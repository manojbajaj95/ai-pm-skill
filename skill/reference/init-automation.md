# Init automation nudge

Run during `init` Step 4 close. Loops differ per harness — detect or ask which one the user is on, then nudge the right setup.

Store confirmed harness in `manifest.json` as `"harness": "cursor" | "codex" | "claude-code" | "other"`.

## Detect harness

Check install context when possible:

- `.cursor/skills/darin/` → Cursor
- `.agents/skills/darin/` or `~/.codex` → Codex
- `.claude/skills/darin/` → Claude Code

If unclear, ask once: *"Which harness are you using — Cursor, Codex, Claude Code, or something else?"*

## Per-harness recipes

### Cursor

**Mechanism:** Cursor Automations — scheduled agent runs.

**Nudge:**

1. Open Automations in Cursor (or ask the agent to help set one up via the automate skill).
2. Suggested cadence: weekly, or after merge to main.
3. Prompt sequence:
   - `/darin insights`
   - `/darin next`
4. Human gate: triage the handoff before the coding agent ships.

Until automation is set: run `/darin insights` then `/darin next` manually.

### Codex

**Mechanism:** Codex Automations tab — cron + skill invocation.

**Nudge:**

1. Open Codex app → Automations → New automation.
2. Pick project, cadence (e.g. weekly), and checkout (local or worktree).
3. Prompt: `$darin insights` then `$darin next` (or combine in one automation with two steps).
4. Runs that find work go to Triage; empty runs archive.

Until automation is set: `$darin insights` then `$darin next` manually.

### Claude Code

**Mechanism:** Hooks, recurring prompts, or `/loop` for self-paced runs.

**Nudge:**

1. Option A — recurring: `/loop 1w /darin insights` (then `/darin next` after insights completes).
2. Option B — hook: run `/darin insights` on a schedule or after significant commits (user configures in Claude Code hooks).
3. Keep a human gate before coding agent implements the brief.

Until automation is set: `/darin insights` then `/darin next` manually.

### Other harnesses

Document the manual two-step loop:

```
/darin insights
/darin next
```

Paste the coding-agent handoff from `next` into whatever agent builds the product.

## Close copy (template)

```
Goals are set.

Active workspace: <slug>
Storage: ~/.darin/workspaces/<slug>/

Product loop: insights → next → [your coding agent] → insights

Set up automation for <harness> so this runs on repeat — <harness-specific steps above>.
Until then: /darin insights, then /darin next.
```

Optional: `ingest` when you learn something new (customer calls, metrics) — external stimuli, not part of the loop, but sharper insights next time.
