/**
 * Shared Darin skill install logic (install.mjs + npm CLI).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { buildAllProviders } from './build-skill.mjs';
import {
  DEFAULT_PROVIDER_IDS,
  PROVIDERS,
  detectInstalledProviders,
  resolveProviderId,
  skillRelPath,
} from './providers.mjs';

export function copyDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
}

export function installProvider({ providerId, distSkillDir, targetRoot, scope, homeDir }) {
  const provider = PROVIDERS[providerId];
  const base = scope === 'global' ? homeDir : targetRoot;
  if (scope === 'global' && !provider.globalSkillsDir) {
    throw new Error(`${provider.displayName} has no global skills directory; use --scope=project`);
  }
  const skillDest = path.join(base, provider.configDir, 'skills', 'darin');
  copyDir(distSkillDir, skillDest);
  return skillDest;
}

export async function confirm(message) {
  if (!process.stdin.isTTY) return true;
  process.stdout.write(`${message} [y/N] `);
  return new Promise(resolve => {
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', data => {
      process.stdin.pause();
      resolve(/^y(es)?$/i.test(String(data).trim()));
    });
  });
}

/**
 * @param {{
 *   repoRoot: string,
 *   providers?: string[],
 *   scope?: 'project' | 'global',
 *   target?: string,
 *   yes?: boolean,
 *   onLog?: (msg: string) => void,
 * }} opts
 */
export async function runInstall(opts) {
  const log = opts.onLog || (msg => console.log(msg));
  const scope = opts.scope || 'project';
  const target = opts.target || process.cwd();
  const yes = opts.yes ?? false;
  const homeDir = os.homedir();

  if (scope !== 'project' && scope !== 'global') {
    throw new Error('--scope must be project or global');
  }

  let providerIds = (opts.providers || []).map(resolveProviderId).filter(Boolean);

  if (opts.providers?.length && providerIds.length !== opts.providers.length) {
    const bad = opts.providers.filter(p => !resolveProviderId(p));
    throw new Error(`Unknown provider(s): ${bad.join(', ')}`);
  }

  if (!providerIds.length) {
    const detected = detectInstalledProviders(target, homeDir);
    providerIds = detected.length ? detected : DEFAULT_PROVIDER_IDS;
    log(
      detected.length
        ? `Detected harnesses: ${providerIds.map(id => PROVIDERS[id].displayName).join(', ')}`
        : `No harness folders found; defaulting to ${DEFAULT_PROVIDER_IDS.map(id => PROVIDERS[id].displayName).join(', ')}`,
    );
  }

  if (!yes) {
    const names = providerIds.map(id => PROVIDERS[id].displayName).join(', ');
    const ok = await confirm(
      `Install Darin for ${names} (${scope} scope → ${scope === 'global' ? homeDir : target})?`,
    );
    if (!ok) {
      log('Aborted.');
      return { installed: [], aborted: true };
    }
  }

  const { built } = buildAllProviders({
    repoRoot: opts.repoRoot,
    providerIds,
  });

  const installed = [];
  for (const { id, skillDir } of built) {
    const dest = installProvider({
      providerId: id,
      distSkillDir: skillDir,
      targetRoot: target,
      scope,
      homeDir,
    });
    installed.push({ id, dest });
    log(`Installed ${PROVIDERS[id].displayName} → ${dest}`);
  }

  return { installed, providerIds, scope, target, aborted: false };
}

export function printPostInstall({ installed, providerIds, scope }) {
  if (!installed.length) return;

  console.log('\nDarin skill installed. Next steps:');
  console.log('  1. Reload your AI harness (restart or open a new session)');

  const needsInit = !hasActiveWorkspace();
  if (needsInit) {
    console.log('  2. Set up your product workspace: invoke /darin init in your harness');
  } else if (scope === 'project') {
    console.log(`  2. Active workspace: ${activeWorkspaceSlug()}`);
  }

  console.log('  3. Invoke /darin (or $darin on Codex) to start');
  if (providerIds.includes('codex')) {
    console.log('     Codex: type $darin or open /skills');
  }

  if (scope === 'project' && providerIds.length) {
    const rel = skillRelPath(PROVIDERS[providerIds[0]]);
    console.log(`\nTip: node ${rel}/scripts/workspace.mjs --list`);
  }
}

function darinConfigPath() {
  return path.join(os.homedir(), '.darin', 'config.json');
}

function hasActiveWorkspace() {
  const p = darinConfigPath();
  if (!fs.existsSync(p)) return false;
  try {
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    const slug = cfg.active_workspace || cfg.active_slug;
    return Boolean(slug);
  } catch {
    return false;
  }
}

function activeWorkspaceSlug() {
  try {
    const cfg = JSON.parse(fs.readFileSync(darinConfigPath(), 'utf8'));
    return cfg.active_workspace || cfg.active_slug || '(unknown)';
  } catch {
    return '(unknown)';
  }
}

export async function ensureDefaultWorkspace({ slug = 'default', name = 'My product' } = {}) {
  if (hasActiveWorkspace()) {
    return { created: false, slug: activeWorkspaceSlug() };
  }

  const repoRoot = path.join(os.homedir(), '.darin', 'workspaces', slug);
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
    'maintenance/log',
  ];

  fs.mkdirSync(path.join(os.homedir(), '.darin'), { recursive: true });
  for (const d of dirs) {
    fs.mkdirSync(path.join(repoRoot, d), { recursive: true });
  }

  const manifest = path.join(repoRoot, 'manifest.json');
  if (!fs.existsSync(manifest)) {
    fs.writeFileSync(
      manifest,
      `${JSON.stringify(
        {
          slug,
          name,
          description: null,
          linked_repos: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        null,
        2,
      )}\n`,
    );
  }

  const configPath = darinConfigPath();
  const existing = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};
  fs.writeFileSync(
    configPath,
    `${JSON.stringify(
      {
        version: '0.3.0',
        ...existing,
        active_workspace: slug,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`\nScaffolded workspace: ${slug}`);
  console.log(`Storage: ~/.darin/workspaces/${slug}/`);
  console.log('Run /darin init in your harness to write PRODUCT.md and STRATEGY.md.');

  return { created: true, slug };
}
