# Next flow

Pick the **biggest needle move** from the latest insights session, write a scoped brief, and hand off to your coding agent. This merges what used to be separate prioritize + plan steps.

Darin prepares; your coding agent ships.

## Step 1: Session setup

```bash
node {{scripts_path}}/next-route.mjs --json
node {{scripts_path}}/next-route.mjs --json --override "opportunity-guest-sign-in"
```

Optional: `--cwd` if not repo root. `--override` skips auto-pick and uses a specific insight slug or filename.

If `NO_INSIGHTS`, stop and run `insights` first.

Returns: `workspace_root`, `latest_insights_dir`, `index_path`, `insight_files`, `queue_path`, `queue`, `has_active_brief`.

## Step 2: Load context

- `PRODUCT.md`, `STRATEGY.md`
- Latest insights session (`index_path` + all `insight_files`)
- `queue/next.md` if it exists — note active brief status
- Grep `ingestion/` and `hypotheses/` for themes tied to top insights

## Step 3: Pick one needle move

Unless `--override` was passed:

1. Read every insight file in the latest session
2. Score against `STRATEGY.md` focus, north star fit, confidence, and leverage (default ICE for early stage; RICE when usage data exists — see internal scoring in `reference/prioritize.md`)
3. Flag insights that clash with **What you're not doing**
4. Pick **one** — biggest needle move. Say why in plain language; mention runners-up briefly

PM judgment overrides ties. If evidence is thin on the pick, say what would confirm it.

## Step 4: Write the brief

Use `templates/feature-brief.md`. Save to `hypotheses/<slug>.md`.

Required sections:

- Problem (evidence-backed, cite insight + memory)
- Opportunity / outcome
- Build now vs. next vs. out of scope
- What we're betting on, and how we'll know it worked
- Success metrics tied to north star
- Risks and open questions
- **Decision needed**
- **Suggested next step**

Link back to the source insight path in the brief.

## Step 5: Update queue

Write `queue/next.md` using `templates/queue-next.md`:

- `Status: ready`
- `Source insight:` path to the insight file
- `Brief:` path to `hypotheses/<slug>.md`
- Increment `Iteration` if replacing a shipped brief

## Step 6: Hand off to coding agent

Give the user a **copy-paste prompt block** for their coding agent:

- One-paragraph goal from the brief
- Build now scope (bullet list)
- Explicit out of scope
- Path to full brief in `~/.darin/workspaces/<slug>/`
- Success check: how they'll know it worked

Do not write product code. Darin's job ends at the handoff.

## If user confirms a different pick

Re-run from Step 3 with their choice. Update brief + queue.

## After shipping

User or coding agent marks `queue/next.md` status `shipped` when done, then run `insights` again to close the loop.
