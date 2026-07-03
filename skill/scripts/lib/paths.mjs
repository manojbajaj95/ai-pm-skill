/**
 * Darin home: ~/.darin/workspaces/<product-slug>/
 *
 * Workspaces are product-scoped, not repo-scoped. Same slug in landing repo,
 * backend repo, or monorepo → shared memory.
 *
 * Override: DARIN_HOME, DARIN_SLUG / DARIN_WORKSPACE, --slug
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export function darinHome() {
  const override = process.env.DARIN_HOME?.trim();
  if (override) return path.resolve(override);
  return path.join(os.homedir(), '.darin');
}

export function workspacesDir() {
  return path.join(darinHome(), 'workspaces');
}

export function globalConfigPath() {
  return path.join(darinHome(), 'config.json');
}

export function slugify(input) {
  const s = String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
  if (!s || s.length < 2 || !SLUG_RE.test(s)) {
    throw new Error(
      `Invalid product slug "${input}". Use 2–48 chars: lowercase letters, numbers, hyphens (e.g. acme, my-startup).`,
    );
  }
  return s;
}

export function loadGlobalConfig() {
  const p = globalConfigPath();
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}

export function saveGlobalConfig(patch) {
  fs.mkdirSync(darinHome(), { recursive: true });
  const next = { ...loadGlobalConfig(), ...patch };
  fs.writeFileSync(globalConfigPath(), `${JSON.stringify(next, null, 2)}\n`);
  return next;
}

export function activeWorkspaceFromConfig() {
  const cfg = loadGlobalConfig();
  const raw = cfg.active_workspace || cfg.active_slug;
  return raw ? slugify(raw) : null;
}

export function setActiveWorkspace(slug) {
  const s = slugify(slug);
  saveGlobalConfig({ active_workspace: s });
  return s;
}

export function listWorkspaceSlugs() {
  const dir = workspacesDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(name => {
      if (name.startsWith('.')) return false;
      try {
        return fs.statSync(path.join(dir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

export function workspacePath(slug) {
  return path.join(workspacesDir(), slugify(slug));
}

export function listWorkspaces() {
  const active = activeWorkspaceFromConfig();
  return listWorkspaceSlugs().map(slug => {
    const root = workspacePath(slug);
    let displayName = slug;
    const manifest = path.join(root, 'manifest.json');
    if (fs.existsSync(manifest)) {
      try {
        const m = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        displayName = m.name || m.product_name || slug;
      } catch { /* ignore */ }
    }
    return {
      slug,
      name: displayName,
      root,
      active: slug === active,
      has_product: fs.existsSync(path.join(root, 'PRODUCT.md')),
      has_strategy: fs.existsSync(path.join(root, 'STRATEGY.md')),
    };
  });
}

export function resolveSlug(options = {}) {
  if (options.slug) return slugify(options.slug);
  if (options.workspace) return slugify(options.workspace);

  const env = process.env.DARIN_SLUG?.trim() || process.env.DARIN_WORKSPACE?.trim();
  if (env) return slugify(env);

  const active = activeWorkspaceFromConfig();
  if (active && fs.existsSync(workspacePath(active))) return active;

  const all = listWorkspaceSlugs();
  if (all.length === 1) return all[0];

  return null;
}

export function workspaceRoot(options = {}) {
  const slug = resolveSlug(options);
  if (!slug) return null;
  return workspacePath(slug);
}

export function manifestPath(root) {
  return path.join(root, 'manifest.json');
}

export function ensureWorkspaceScaffold(slug, meta = {}) {
  const s = slugify(slug);
  const root = workspacePath(s);
  const dirs = [
    'source/interviews',
    'source/meetings',
    'source/market',
    'source/adhoc',
    'ingestion/interviews',
    'ingestion/meetings',
    'ingestion/market',
    'ingestion/adhoc',
    'hypotheses',
    'insights',
    'roadmap',
    'maintenance/log',
  ];
  for (const d of dirs) {
    fs.mkdirSync(path.join(root, d), { recursive: true });
  }

  const manifest = manifestPath(root);
  let existing = {};
  if (fs.existsSync(manifest)) {
    try {
      existing = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    } catch { /* ignore corrupt manifest */ }
  }
  fs.writeFileSync(
    manifest,
    `${JSON.stringify(
      {
        ...existing,
        slug: s,
        name: meta.name || existing.name || s,
        description: meta.description || existing.description || null,
        linked_repos: meta.linked_repos || existing.linked_repos || [],
        updated_at: new Date().toISOString(),
        created_at: existing.created_at || new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );

  if (!fs.existsSync(globalConfigPath())) {
    saveGlobalConfig({ version: '0.3.0' });
  }
  setActiveWorkspace(s);
  return root;
}

export function parsePathArgs(argv) {
  const out = { slug: null, workspace: null, json: false, list: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') out.json = true;
    else if (a === '--list') out.list = true;
    else if ((a === '--slug' || a === '--workspace') && argv[i + 1]) {
      out.slug = argv[++i];
    }
  }
  return out;
}

