#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getPackageRoot, getSkillRepoRoot, readPackageVersion } from '../lib/root.mjs';

const PKG_ROOT = getPackageRoot();

async function loadInstallCore() {
  const vendorLib = path.join(PKG_ROOT, 'vendor', 'lib', 'install-core.mjs');
  const monorepoLib = path.resolve(PKG_ROOT, '../../scripts/lib/install-core.mjs');
  const { existsSync } = await import('node:fs');
  const libPath = existsSync(vendorLib) ? vendorLib : monorepoLib;
  return import(pathToFileURL(libPath).href);
}

function globalHelp() {
  console.log(`darin — install the Darin product improvement loop into your AI harness

Usage:
  darin install [options]
  darin --version
  darin --help

Install options:
  --providers=LIST   Comma-separated: cursor, claude, codex, gemini, …
  --scope=SCOPE      project (default) or global
  --target=PATH      Install destination (default: cwd)
  --workspace=SLUG   Scaffold ~/.darin workspace if none exists (default: default)
  --no-workspace     Skip workspace scaffold
  -y, --yes          Skip confirmation (default when stdin is not a TTY)

Examples:
  npx @getdarin/cli@latest install
  npx @getdarin/cli install --providers=cursor,claude,codex -y
  darin install --scope=global --providers=claude -y

Install guide: https://github.com/manojbajaj95/darin-skill/blob/main/INSTALL_FOR_AGENTS.md
Repo: https://github.com/manojbajaj95/darin-skill
`);
}

function parseInstallArgs(argv) {
  const out = {
    providers: [],
    scope: 'project',
    target: process.cwd(),
    yes: false,
    workspace: 'default',
    noWorkspace: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-y' || arg === '--yes') out.yes = true;
    else if (arg === '--no-workspace') out.noWorkspace = true;
    else if (arg.startsWith('--providers=')) {
      out.providers = arg.slice('--providers='.length).split(',').map(s => s.trim()).filter(Boolean);
    } else if (arg === '--providers' && argv[i + 1]) {
      out.providers = argv[++i].split(',').map(s => s.trim()).filter(Boolean);
    } else if (arg.startsWith('--scope=')) {
      out.scope = arg.slice('--scope='.length).trim();
    } else if (arg === '--scope' && argv[i + 1]) {
      out.scope = argv[++i].trim();
    } else if (arg.startsWith('--target=')) {
      out.target = path.resolve(arg.slice('--target='.length).trim());
    } else if (arg === '--target' && argv[i + 1]) {
      out.target = path.resolve(argv[++i]);
    } else if (arg.startsWith('--workspace=')) {
      out.workspace = arg.slice('--workspace='.length).trim();
    } else if (arg === '--workspace' && argv[i + 1]) {
      out.workspace = argv[++i].trim();
    } else if (arg === '--help' || arg === '-h') {
      return { ...out, help: true };
    }
  }

  return out;
}

async function cmdInstall(argv) {
  const args = parseInstallArgs(argv);
  if (args.help) {
    globalHelp();
    return;
  }

  const { runInstall, printPostInstall, ensureDefaultWorkspace } = await loadInstallCore();
  const repoRoot = getSkillRepoRoot();

  const result = await runInstall({
    repoRoot,
    providers: args.providers,
    scope: args.scope,
    target: args.target,
    yes: args.yes || !process.stdin.isTTY,
  });

  if (result.aborted) return;

  if (!args.noWorkspace) {
    await ensureDefaultWorkspace({ slug: args.workspace });
  }

  printPostInstall(result);
}

async function main() {
  const argv = process.argv.slice(2);

  if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
    if (argv[0] && argv[0] !== '--help' && argv[0] !== '-h') {
      // subcommand help handled below
    } else {
      globalHelp();
      return;
    }
  }

  if (argv.includes('--version') || argv.includes('-v')) {
    console.log(readPackageVersion());
    return;
  }

  const [cmd, ...rest] = argv;

  switch (cmd) {
    case 'install':
      await cmdInstall(rest);
      break;
    case '--version':
    case '-v':
      console.log(readPackageVersion());
      break;
    default:
      console.error(`Unknown command: ${cmd}\n`);
      globalHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
