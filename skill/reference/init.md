# Init flow

Setup a **product workspace** under `~/.darin/workspaces/<slug>/`. Workspaces are **not tied to a git repo** — use one slug for landing page, backend, mobile, monorepo, or multiple checkouts.

## Storage layout

```
~/.darin/
├── config.json                    # active_workspace
└── workspaces/
    └── acme/                      # readable slug YOU choose
        ├── manifest.json
        ├── PRODUCT.md
        ├── STRATEGY.md
        ├── source/
        │   ├── interviews/
        │   ├── meetings/
        │   ├── market/
        │   └── adhoc/
        ├── ingestion/
        │   ├── interviews/
        │   ├── meetings/
        │   ├── market/
        │   └── adhoc/
        ├── hypotheses/
        ├── features/
        └── maintenance/log/
```

Good slugs: `acme`, `mosaic`, `my-startup`. Bad: auto-hashes, repo folder names unless that's your product name.

## Step 0: List or pick workspace (required)

```bash
node {{scripts_path}}/workspace.mjs --list --json
```

**If workspaces exist:** show the user the list. Ask:

- Use an existing slug (`node workspace.mjs --use <slug>`), or
- Create a new one (`node workspace.mjs --scaffold --slug <new-slug>`)

**If none exist:** ask for a readable product slug before scaffolding.

Do not derive slug from git root or cwd.

## Step 1: Activate or create

```bash
# existing
node {{scripts_path}}/workspace.mjs --use acme

# new
node {{scripts_path}}/workspace.mjs --scaffold --slug acme --name "Acme Corp"
```

Then `workspace.mjs --json` — confirm `workspace_root`.

## Step 2: Interview

Read and follow [reference/init-interview.md](init-interview.md). Cover users, problem, and strategy basics before writing files.

## Step 3: Write files

All writes go to `workspace_root` from `--json`. Never write PRODUCT.md into the code repo.

Use `templates/PRODUCT.md` and `templates/STRATEGY.md` as scaffolds.

## Step 4: Close

Tell the user:

```
Active workspace: acme
Storage: ~/.darin/workspaces/acme/
```

Same slug works from any repo: set `active_workspace` once in `~/.darin/config.json`, or `export DARIN_SLUG=acme`, or pass `--slug acme` to scripts.

Resume blocked commands after init.
