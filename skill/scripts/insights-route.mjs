/**
 * Insights session setup — workspace paths + nudge catalog. No file discovery.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePathArgs, workspaceRoot } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NUDGES_PATH = path.join(__dirname, '..', 'reference', 'insights-nudges.json');
const { nudges } = JSON.parse(fs.readFileSync(NUDGES_PATH, 'utf8'));

function today() {
  return new Date().toISOString().slice(0, 10);
}

function parseInsightsArgs(argv) {
  const base = parsePathArgs(argv);
  const out = { ...base, target: '', cwd: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target' && argv[i + 1]) out.target = argv[++i];
    else if (a === '--cwd' && argv[i + 1]) out.cwd = path.resolve(argv[++i]);
    else if (!a.startsWith('--')) out.target += `${out.target ? ' ' : ''}${a}`;
  }
  return out;
}

function sessionPaths() {
  const date = today();
  return {
    session_dir: `insights/${date}`,
    index_path: `insights/${date}/run.md`,
  };
}

const args = parseInsightsArgs(process.argv);
const storageRoot = workspaceRoot(args);
const cwd = args.cwd;
const target = args.target.trim();
const { session_dir, index_path } = sessionPaths();

if (!storageRoot) {
  const err = {
    error: 'NO_ACTIVE_WORKSPACE',
    message: 'Run `/darin init` or set active_workspace in ~/.darin/config.json',
  };
  if (args.json) console.log(JSON.stringify(err, null, 2));
  else console.error(err.message);
  process.exit(1);
}

const result = {
  workspace_root: storageRoot,
  session_dir,
  index_path,
  cwd,
  target: target || null,
  source_type: 'codebase',
  nudges,
};

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Session: ${path.join(storageRoot, session_dir)}`);
  console.log(`Index: ${path.join(storageRoot, index_path)}`);
  console.log(`Cwd: ${cwd}`);
  if (target) console.log(`Target: ${target}`);
  console.log(`Nudges available: ${nudges.map(n => n.id).join(', ')}`);
}
