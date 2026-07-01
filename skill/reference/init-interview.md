# Init interview

Run this conversation during `init` Step 2. Ask in order; skip what the user already answered in chat. One question at a time when live; batch when the user pasted a full brief.

## 1. Product identity

- **Product name** — customer-facing name (for `manifest.json` `name`)
- **One-line description** — what it does in plain language
- **Stage** — `early` | `growth` | `mature` (rough context, not a rulebook — just helps frame later conversations)

## 2. Users and problem

- **Who is the primary user?** — role, context, job to be done
- **What pain exists today?** — specific, not generic "inefficiency"
- **Why now?** — what changed (market, regulation, behavior, tech)

## 3. Strategy

- **North-star metric** — one metric + how it is defined
- **Current bets** — 2–3 things you are deliberately investing in this cycle
- **Non-goals** — explicitly out of scope (protects against scope creep)
- **Constraints** — team size, runway, platform, compliance, dependencies

## 4. Anything else worth capturing?

Optional, one open-ended question: vision, things to avoid becoming, known stakeholders, linked repos. Only write down what the user actually says — don't invent a vision paragraph or a list of principles just to fill a section.

## Write targets

Map answers into:

- `templates/PRODUCT.md` → `PRODUCT.md` (Stage, Users, Problem, Notes)
- `templates/STRATEGY.md` → `STRATEGY.md` (North-star, bets, non-goals, constraints)

Do not invent facts. Mark gaps **Open question** and offer `/darin ingest` as a follow-up.
