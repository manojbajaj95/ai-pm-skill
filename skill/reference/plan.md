# Plan flow (internal — use `next` command)

> **Not user-facing.** The `next` command absorbs this flow. Kept for brief structure and agent reference.

Turn a problem, opportunity, or bigger goal into a scoped **brief** you can build from right away.

## Step 1: Load evidence

- `PRODUCT.md`, `STRATEGY.md`
- Run `node {{scripts_path}}/context.mjs` if not already loaded this session
- Grep `ingestion/` and `hypotheses/` for the target topic (these are Darin's memory — what you've learned and what you're betting on)
- If evidence is thin: ask 2–3 Mom Test-style questions before drafting

## Step 2: Check it fits your goals

- Does this line up with what you're focused on in `STRATEGY.md`?
- Does it clash with something you said you're deliberately not doing?
- If it doesn't fit, say so plainly and ask whether to go ahead anyway.

## Step 3: Write the brief

Use `templates/feature-brief.md`. Save to `hypotheses/<slug>.md` — that's where Darin keeps what you're betting on, so a plan and its evidence live together. (Don't make the user think about that filename; just tell them it's saved.)

Required sections:

- Problem (evidence-backed, with citations)
- Opportunity / outcome
- Build now vs. next vs. out of scope
- What we're betting on, and how we'll know it worked
- Success metrics tied to your north star or input metrics
- Risks and open questions
- **Decision needed**
- **Suggested next step**

## If the input is a broader goal, not a single feature

Same brief, same sections — the format doesn't change. Just add two things to the Risks/Open questions area:

- **Who to talk to next** — specific people or segments worth interviewing, with the questions you'd ask
- **What would unblock the decision** — the smallest experiment or piece of evidence that would move this from guess to confirmed

Don't spin up a separate planning document for this — one scoped brief per goal is enough for a small team to actually use.

## Step 4: Hand off

- If scope is clear and small → hand off to coding agent (see `reference/next.md`)
- If discovery gaps remain → suggest `/darin ingest`
