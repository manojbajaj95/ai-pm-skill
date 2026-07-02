# Product insights (method)

Always read this before exploring the codebase. Nudges in the registry supplement angles — auto-pick after memory synthesis.

Find gaps between **what Darin knows** and **what the codebase ships**. No industry checklists. Every insight chains from **this team's memory** to **this repo**.

---

## Flow

1. Run `insights-route.mjs --json` → `session_dir`, `index_path`, `nudges`, optional `target`
2. Load memory (`context.mjs`, all `hypotheses/`, all `ingestion/`)
3. Synthesize buyer/evaluator model (see step 1 below)
4. **Auto-pick nudges** from registry — read matching `reference/insights/<id>.md` files
5. Explore codebase freely (agent decides where to look)
6. **One insight at a time** — save each finding separately (see Output)

---

## 1. Synthesize from memory first

Before opening product files:

- **Who buys** — role, context, how they evaluate
- **What blocks or slows them** — recurring themes, open tensions
- **What you're betting on** — hypotheses, strategy focus
- **What's explicitly out** — `What you're not doing`, constraints
- **Path to aha** — what first value looks like, if captured

Thin memory → say so; suggest `ingest`. No generic SaaS assumptions.

---

## 2. Auto-pick nudges

From script `nudges` list, pick zero or more where `helps_with` aligns with memory, evidence themes, strategy, and optional user `target`. User never required to name a nudge.

Read picked nudge files before exploring. Report which nudges applied and why in the session index.

---

## 3. Explore codebase

Agent searches and reads based on memory + nudges — repo structure, grep, judgment. No pre-discovered file list.

Cite `path:line` for observations. For absences, cite what was searched.

---

## 4. Gap moves

Each finding must chain: **[memory cite] → [code cite or searched absence] → [so what]**

| Move | Question |
|------|----------|
| **Evidence → codebase** | Recurring ingestion/hypothesis theme — expressed in shipped product? |
| **Strategy → codebase** | Current focus and north star — do surfaces lead with this? |
| **Bet → codebase** | Active hypothesis — footprint in UI/copy? Contradicted? |
| **Buyer walk** | Simulate evaluation path for this buyer; each step met, missing, or contradicted? |
| **Evaluator walk** | For try/install motion: simulate try-before-commit; friction or blockers? |
| **Scope → codebase** | Shipped emphasis vs strategy focus and exclusions — sprawl or jargon? |

Apply **non-obvious test**: does this connect memory the user has to codebase they didn't audit? If no, drop it.

---

## 5. Classify each finding

- **Type:** `Opportunity` (missing) | `Bloat` (overbuilt vs strategy) | `Improvement` (present but weak)
- **Confidence:** `Confirmed` (direct evidence) | `Inferred` (from buyer model; say what would confirm)

**One finding = one insight file.** Never batch unrelated findings. Develop each fully or drop it.

---

## 6. Output (one insight at a time)

For each finding:

1. Apply non-obvious test and classification
2. Save to `<workspace_root>/<session_dir>/<type>-<slug>.md` using `templates/insight.md`
3. Naming: `opportunity-guest-sign-in.md`, `bloat-jargon-heavy-copy.md`, etc.

After all insights, save session index to `<index_path>` using `templates/insights-run.md`.

In chat: summarize run; highlight **top 2–3 insights** with paths — offer to walk through others.

---

## Quality bar

**Good:** connects two things the user captured but didn't reconcile.

**Bad:** industry best practice with no memory anchor → suggest `ingest` instead.
