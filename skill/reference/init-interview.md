# Init interview

Run this conversation during `init` Step 2. Ask in order; skip what the user already answered in chat. One question at a time when live; batch when the user pasted a full brief.

## 1. Product identity

- **Product name** — customer-facing name (for `manifest.json` `name`)
- **One-line description** — what it does in plain language
- **Stage** — `early` | `growth` | `mature` (rough context, not a rulebook — just helps frame later conversations)

## 2. Users and problem

- **Who is the primary user?** — role, context, job to be done
- **How do they evaluate?** — self-serve try, dev install, demo, security review, etc.
- **What does first value look like?** — path to aha, roughly
- **What pain exists today?** — specific, not generic "inefficiency"
- **Why now?** — what changed (market, regulation, behavior, tech)

## 3. Goals

- **North star** — the one number that tells you the product is working, and how you'd define it
- **What you're focused on** — 2–3 things you're deliberately putting effort into this cycle
- **What you're not doing** — things you're explicitly leaving out (keeps scope from creeping)
- **Constraints** — team size, runway, platform, compliance, dependencies

## 4. Anything else worth capturing?

Optional, one open-ended question: vision, things to avoid becoming, known stakeholders, linked repos. Only write down what the user actually says — don't invent a vision paragraph or a list of principles just to fill a section.

## Write targets

Map answers into:

- `templates/PRODUCT.md` → `PRODUCT.md` (Stage, Users, Problem, Notes)
- `templates/STRATEGY.md` → `STRATEGY.md` (north star, what you're focused on, what you're not doing, constraints)

Do not invent facts. Mark gaps **Open question** and offer `/darin ingest` as a follow-up.
