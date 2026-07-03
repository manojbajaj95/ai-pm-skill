/**
 * Insights session setup — workspace paths + nudge catalog. No file discovery.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { workspaceRoot } from './lib/paths.mjs';
import { exitNoActiveWorkspace, parsePositionalRouteArgs } from './lib/route-args.mjs';
import { today } from './lib/fs-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NUDGES_PATH = path.join(__dirname, '..', 'reference', 'insights-nudges.json');
const { nudges } = JSON.parse(fs.readFileSync(NUDGES_PATH, 'utf8'));

const args = parsePositionalRouteArgs(process.argv, {
  positionalKey: 'target',
  positionalFlag: '--target',
});
const storageRoot = workspaceRoot(args);
const cwd = args.cwd;
const target = args.target.trim();
const date = today();
const session_dir = `insights/${date}`;
const index_path = `insights/${date}/run.md`;

if (!storageRoot) exitNoActiveWorkspace({ json: args.json });

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
