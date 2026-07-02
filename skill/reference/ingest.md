# Ingest flow

**External stimuli** — not part of the product loop. File customer research, metrics, meetings, or notes so future `insights` runs are sharper.

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

1. **`source/<directory>/YYYY-MM-DD-<slug>.md`** — exact copy of the original (or faithful transcript). Never edit after write.
2. **`ingestion/<directory>/YYYY-MM-DD-<slug>.md`** — plain-language write-up: what was said, what it might mean, and anything it suggests you should test. Say clearly which parts are your read vs. what was actually said.
3. **Durable updates (propose, and always ask the user first — in plain language):**
   - `hypotheses/<slug>.md` — add new evidence to an existing brief
   - `STRATEGY.md § Open tensions` — if what you learned clashes with your stated goals

   When you ask, don't use jargon. Say something like: *"Want me to save this as something we're tracking?"*

When you cite this evidence later, just point at the file (e.g. "per `ingestion/interviews/2026-01-01-acme.md`").

## Step 4: Tell the user what happened

Short summary in plain language:

- Where it landed
- 1–3 things worth remembering (ask before saving anything durable)
- Anything that contradicts what you learned before (keep both, don't paper over it)
- One open question if a judgment call is needed
- Suggested next step: `insights` (or `ingest` more if building evidence first)

## Anti-patterns

- Don't save a one-off comment as a lasting belief without asking.
- Don't flatten conflicting interviews into a tidy consensus.
- Don't skip `source/` — the exact record is non-negotiable.
