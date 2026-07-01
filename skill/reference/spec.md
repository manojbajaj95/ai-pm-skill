# Spec flow (optional)

Feature brief → shippable spec (PRD-lite). Most small teams can build straight from the `shape` brief and skip this — use `spec` when you actually need a written handoff for someone else (an engineer, a contractor, a future you).

## Prerequisite

Load `hypotheses/<slug>.md` or output from a prior `shape`. If missing, run `shape` first or ask user to confirm scope inline.

## Output structure

```markdown
# [Feature name]

## Context & problem
## Goals & non-goals
## User stories (Mike Cohn + Gherkin acceptance criteria)
## Success metrics
## Risks & edge cases
## Open questions
## Out of scope
```

## Rules

- Every story ties to a hypothesis or metric in STRATEGY.md
- Call out at least one anti-pattern risk in Risks section
- Flag anything unconfirmed as an open question rather than stating it as fact
- Do not invent metrics user hasn't defined; flag as open question

Save to `<workspace_root>/features/<slug>.md` if user wants persistence.
