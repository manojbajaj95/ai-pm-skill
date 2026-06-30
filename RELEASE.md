# Releasing

Automated with [release-please](https://github.com/googleapis/release-please) via [release-please-action](https://github.com/googleapis/release-please-action).

## How it works

1. Push [Conventional Commits](https://www.conventionalcommits.org/) to `main`
2. Release Please opens/updates a **Release PR** (`autorelease: pending`) with:
   - `packages/cli/CHANGELOG.md` updated
   - `packages/cli/package.json` version bumped
3. **Merge the Release PR** (squash-merge recommended)
4. Release Please tags `vX.Y.Z`, creates a **GitHub Release**, and CI publishes **`darin`** to npm

Release Please does **not** publish to npm itself — see `.github/workflows/release-please.yml` for the npm step.

## Commit prefixes

| Prefix | SemVer | Example |
|--------|--------|---------|
| `fix:` | patch | `fix: parse --target with spaces` |
| `feat:` | minor (patch if &lt;1.0.0) | `feat: add workspace list` |
| `feat!:` / `BREAKING CHANGE:` | major | `feat!: remove legacy installer` |
| `docs:`, `chore:`, `ci:` | hidden from changelog | `chore: update deps` |

## Force a version

```bash
git commit --allow-empty -m "chore: release 0.2.0" -m "Release-As: 0.2.0"
```

## Config files

| File | Purpose |
|------|---------|
| [`release-please-config.json`](release-please-config.json) | Releaser config ([manifest docs](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md)) |
| [`.release-please-manifest.json`](.release-please-manifest.json) | Current released versions |
| [`packages/cli/CHANGELOG.md`](packages/cli/CHANGELOG.md) | Auto-generated changelog |

## Secrets

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | npm publish (automation token, package `darin`) |

## Troubleshooting

See [release-please troubleshooting](https://github.com/googleapis/release-please/blob/main/docs/troubleshooting.md).

- **No Release PR?** Need `feat:` or `fix:` commits since last release; check for stale `autorelease: pending` label on old PRs
- **Re-run:** Add `release-please:force-run` label to a merged PR, or re-run the workflow from Actions
