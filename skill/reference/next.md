# Next flow

Hand off the **top roadmap item** to your coding agent. If the roadmap is missing or stale, run the `roadmap` flow inline first.

Darin prepares; your coding agent ships.

## Step 1: Session setup

```bash
node {{scripts_path}}/next-route.mjs --json
node {{scripts_path}}/next-route.mjs --json --override "guest-trial"
```

Optional: `--cwd` if not repo root. `--override` uses a specific item slug instead of the top queued item.

If `NO_INSIGHTS`, stop and run `insights` first.

Returns: `workspace_root`, `roadmap_path`, `roadmap`, `needs_roadmap`, `needs_plan`, `active_item`, `top_queued`, `has_active_handoff`, `legacy_queue`, insight session paths.

## Step 2: Legacy queue migration

If `legacy_queue` is set and no roadmap exists, migrate `queue/next.md` fields into `roadmap/roadmap.md` format (**Now** section + handoff). Then continue.

## Step 3: Refresh roadmap if needed

If `needs_roadmap` is true, follow [`reference/roadmap.md`](roadmap.md) Steps 2–5 inline (rank suggestions + brief for #1).

If `needs_plan` is true for the active item, write the brief following roadmap Step 4.

## Step 4: Pick the item to hand off

Unless `--override` was passed:

1. Use the top **Up next** item, or the current **Now** item if already active
2. Say why in plain language

Override → match by slug in the roadmap table or suggestion filename.

## Step 5: Update roadmap Now

Update `roadmap/roadmap.md` **Now** section:

- `Status: ready`
- `Item:`, `From suggestion:`, `Brief:` paths
- **Why first** — one sentence
- **Hand off** — paste-ready prompt block (see Step 6)

Remove the handed-off item from **Up next** (or mark if keeping history).

## Step 6: Hand off to coding agent

Give the user a **copy-paste prompt block**:

- One-paragraph goal from the brief
- Build now scope (bullet list)
- Explicit out of scope
- Path to full brief in `~/.darin/workspaces/<slug>/`
- Success check: how they'll know it worked

Do not write product code. Darin's job ends at the handoff.

End with **Your call** and **Suggested next step**.

## If user confirms a different pick

Re-run from Step 4 with their choice. Update brief + roadmap.

## After shipping

Mark **Now** `Status: shipped`, clear **Now**, then run `insights` again to close the loop.
