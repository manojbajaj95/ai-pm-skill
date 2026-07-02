# Insights flow

Compare product **in the codebase** to Darin memory. Produce **one file per suggestion** — not one monolithic report. Codebase only — never fetch live URLs or use the browser.

Suggestions only. Does not rank, plan, or write the roadmap. Not for memory hygiene — use `review` for that.

## Step 1: Session setup

```bash
node {{scripts_path}}/insights-route.mjs --json
node {{scripts_path}}/insights-route.mjs --json --target "optional focus phrase"
```

Optional: `--cwd` if not repo root.

Returns: `workspace_root`, `session_dir`, `index_path`, `cwd`, `target`, `nudges` (catalog of available angle prompts).

No file discovery — agent explores the repo.

## Step 2: Memory before code

1. `context.mjs` → `PRODUCT.md`, `STRATEGY.md`
2. Read all of `hypotheses/` and `ingestion/`
3. Read `reference/insights/product.md`

Thin memory → say so; suggest `ingest`.

## Step 3: Auto-pick nudges

From `nudges` in script output, auto-pick what aligns with memory, evidence, and optional `target`. Read each picked file under `reference/insights/<id>.md`.

| id | helps_with |
|----|------------|
| positioning | Marketing & positioning — ICP, problem, promise, trust proof |
| pricing | Pricing & packaging — tiers, value metric, segment fit |
| activation | Onboarding & activation — signup, first run, path to aha |
| trial | Trial & evaluation — try-before-commit, guest access, gating |
| documentation | Documentation & enablement — docs vs promise, getting started |
| scope | Product scope & focus — sprawl, jargon vs goals |

User does not need to name a nudge.

## Step 4: Explore and produce suggestions

Follow `product.md`:

1. Explore codebase (agent chooses files)
2. Identify candidates via gap moves
3. **For each candidate:** classify, write full suggestion, save to `<session_dir>/<type>-<slug>.md` using `templates/insight.md`
4. Save session index to `<index_path>` using `templates/insights-run.md`
5. Chat summary — top 2–3 suggestions with paths; **Suggested next step** → `/darin next`

## Guardrails

- Memory-grounded only — no industry checklists
- One finding = one file
- Not a design review — product story and motion, not pixels
- Not `review` — no stale brief maintenance
- Do not write or update `roadmap/roadmap.md`

Propose updates to `hypotheses/` or `STRATEGY.md` only after asking the user.
