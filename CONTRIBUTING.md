# Contributing

Thanks for wanting to help build Darin. Here's how the repo is put together and how to make changes.

## Repo layout

```
skill/          source of truth for the skill (commands, reference docs, scripts)
scripts/        build + install tooling
packages/cli/   the @getdarin/cli npm package
```

`skill/` is what you edit. Everything else (`.cursor/skills/darin/`, `.claude/skills/darin/`, etc.) is generated from it.

## Making changes

Edit files under `skill/`, then sync the change out to each harness's build:

```bash
node scripts/build.mjs
node scripts/build.mjs --also-cursor   # local Cursor copy only, not committed to git
node scripts/install.mjs --providers=cursor,claude -y
```

If you're working on the CLI package specifically:

```bash
cd packages/cli && npm pack
```

## Before opening a PR

- Run the build/install commands above so generated harness copies stay in sync with `skill/`
- Use a [Conventional Commit](https://www.conventionalcommits.org/) message (`feat:`, `fix:`, `docs:`, …). Release Please reads these to version and changelog automatically
- Keep the change focused. Smaller PRs are easier to review and ship faster

## Releasing

Releases are automated. See [RELEASE.md](RELEASE.md) for the full process and npm trusted-publishing setup.
