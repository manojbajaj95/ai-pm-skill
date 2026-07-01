# Shape flow

Turn a problem, opportunity, or bigger objective into a scoped **feature brief** ready for `spec` (optional) or straight into building.

## Step 1: Load evidence

- `PRODUCT.md`, `STRATEGY.md`
- Run `node {{scripts_path}}/context.mjs` if not already loaded this session
- Grep `ingestion/` and `hypotheses/` for the target topic
- If evidence is thin: ask 2–3 Mom Test-style questions before drafting

## Step 2: Check strategy fit

- Does this align with active bets in `STRATEGY.md`?
- Does it conflict with non-goals?
- If misaligned, say so and ask whether to proceed anyway (explicit override).

## Step 3: Write feature brief

Use `templates/feature-brief.md`. Save to `hypotheses/<feature-slug>.md` if this is a new bet, or update existing hypothesis file.

Required sections:

- Problem (evidence-backed, with citations)
- Opportunity / outcome
- MVP vs v1 vs out of scope
- Hypotheses to test
- Success metrics tied to north-star or input metrics
- Risks and open questions
- **Decision needed from PM**
- **Suggested next command**

## If the input is a broader objective, not a single feature

Same brief, same sections — the format doesn't change. Just add two things to the Risks/Open questions area:

- **Who to talk to next** — specific people or segments worth interviewing, with the questions you'd ask
- **What would unblock the decision** — the smallest experiment or piece of evidence that would move this from guess to confirmed

Don't spin up a separate planning document for this — one scoped brief per objective is enough for a small team to actually use.

## Step 4: Hand off

- If scope is clear and small → `spec` is optional; many teams go straight to building from this brief
- If discovery gaps remain → suggest `/darin ingest`
- If prioritization against other bets needed → `/darin prioritize`
