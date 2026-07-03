# Roadmap flow

Rank the latest **suggestions** into a prioritized list and write a build brief for the top item. Updates `roadmap/roadmap.md`.

Run standalone to refresh the list without handing off. `next` runs this inline when the roadmap is missing or older than the latest insights session.

## Step 1: Session setup

```bash
node {{scripts_path}}/roadmap-route.mjs --json
node {{scripts_path}}/roadmap-route.mjs --json --item "pricing-clarity"
```

Optional: `--cwd` if not repo root. `--item` re-briefs one roadmap item without a full re-rank.

If `NO_INSIGHTS`, stop and run `insights` first.

Returns: `workspace_root`, `latest_insights_dir`, `insight_files`, `roadmap_path`, `roadmap`, `needs_roadmap`, `top_item`, `top_has_brief`.

## Step 2: Load context

- `PRODUCT.md`, `STRATEGY.md` (check what you're focused on and what you're not doing)
- Latest insights session (`index_path` + all `insight_files`)
- Existing `roadmap/roadmap.md` if present — merge, don't wipe shipped history blindly
- Grep `ingestion/` and `hypotheses/` for themes tied to suggestions

## Step 3: Rank suggestions

Read every suggestion file in the latest session. Score each against what you're focused on, fit, confidence, and leverage.

**Scoring (pick one, don't ask the user unless context is thin):**

| Framework | Use when |
|-----------|----------|
| ICE | Early stage, no usage data yet |
| RICE | Growth+, real usage data exists |
| Value / effort 2×2 | Need a quick visual for alignment |
| MoSCoW | Hard deadline, need to cut scope fast |

Default ICE for early stage; RICE when usage data exists. PM judgment overrides ties.

Flag suggestions that clash with what you're deliberately not doing — move those to **Not now**, not **Up next**.

## Step 4: Write the brief for #1

Use `templates/feature-brief.md`. Save to `hypotheses/<slug>.md`. Tell the user the brief is saved — don't say "hypothesis."

Required sections:

- Problem (evidence-backed, cite suggestion + memory)
- Outcome
- Build now vs. up next vs. out of scope
- What we're trying, and how we'll know it worked
- Success metrics tied to your goals
- Risks and open questions
- **Your call**
- **Suggested next step**

Link back to the source suggestion path in the brief.

If `--item` was passed, brief that item instead of #1.

## Step 5: Update roadmap

Write `roadmap/roadmap.md` using `templates/roadmap.md`:

- `Updated:` today's date
- `From:` latest insights session path
- **Up next** — ranked table with item slug, source suggestion, brief path (or `—`)
- **Not now** — deferred suggestions with a plain one-line reason
- Leave **Now** empty unless re-briefing an active item — `next` fills **Now** on handoff

## Step 6: Summarize

In chat:

- Top 3 items on the roadmap and why #1 is first
- Path to `roadmap/roadmap.md` and top brief
- **Your call**
- **Suggested next step** → `/darin next` to hand off #1

Do not write product code.
