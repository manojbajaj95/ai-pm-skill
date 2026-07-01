# Ingest flow

Route a new artifact into product memory. One verb, four shapes.

## Haven't talked to anyone yet?

If the user wants help planning a customer call before they have anything to ingest, do this first:

- Ask: what decision does this interview inform? Who's the ideal participant? What would change your mind?
- Give 5–8 Mom Test-style questions (past behavior, not hypotheticals — "walk me through the last time..." not "would you use...").
- Note what **not** to ask: no solution pitching, no "would you use this."

Then, after the call happens, come back and ingest the transcript. Planning without a follow-up ingest is wasted effort — always point back here.

## Input

Transcript, file path, paste, screenshot description, URL, or chat note. Target comes from the invocation: `/darin ingest path/to/file.md` or pasted content.

## Step 1: Classify shape

Run `node {{scripts_path}}/ingest-route.mjs --json`. Write to **`paths.source_abs`** and **`paths.ingestion_abs`** (under `~/.darin/`), not the code repo.

If the script reports `NO_ACTIVE_WORKSPACE`, stop and run `init` first.

If shape is ambiguous, ask **one** question. Do not guess.

| Shape (classifier) | Storage directory | Examples |
|--------------------|-------------------|----------|
| `interview` | `interviews/` | Customer call, user research, sales discovery |
| `meeting` | `meetings/` | 1:1, roadmap review, kickoff, retro |
| `market` | `market/` | Competitor page, changelog, analyst note |
| `adhoc` | `adhoc/` | Slack insight, founder hunch, quick observation |

Paths use the **directory** column (plural where noted), e.g. `source/interviews/`, `ingestion/meetings/`.

## Step 2: Load before writing

Resolve `workspace_root` via `workspace.mjs --json`, then load from there:

- `STRATEGY.md` at workspace root
- Active `hypotheses/*.md` that the artifact might touch
- Last 2–3 files in matching `ingestion/<directory>/` (see table above)

## Step 3: Write (in order)

1. **`source/<directory>/YYYY-MM-DD-<slug>.md`** — immutable copy of the original (or faithful transcript). Never edit after write.
2. **`ingestion/<directory>/YYYY-MM-DD-<slug>.md`** — plain-language synthesis: what was said, what it might mean, and any testable belief it suggests. Say clearly which parts are your interpretation vs. what was actually said.
3. **Durable updates (propose, always confirm with the user first):**
   - `hypotheses/<slug>.md` — new evidence
   - `STRATEGY.md § Open tensions` — if a strategy conflict surfaced

When you cite this evidence later, just point at the file (e.g. "per `ingestion/interviews/2026-01-01-acme.md`") — no special tag syntax needed.

## Step 4: Surface to user

Short routing summary:

- Where the artifact landed
- 1–3 themes promoted or proposed for promotion
- Contradictions with prior evidence (preserved, not resolved)
- One open question if judgment is needed
- Suggested next: `shape` or `prioritize`

## Anti-patterns

- Do not promote one-off anecdotes to strategy without confirmation.
- Do not flatten dissenting interviews into consensus.
- Do not skip `source/` — audit trail is non-negotiable.
