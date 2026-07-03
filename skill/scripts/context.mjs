/**
 * Load PRODUCT.md and STRATEGY.md from ~/.darin/workspaces/<slug>/
 */
import path from 'node:path';
import {
  activeWorkspaceFromConfig,
  darinHome,
  listWorkspaces,
  parsePathArgs,
  resolveSlug,
  workspaceRoot,
} from './lib/paths.mjs';
import { firstExisting, listMd, safeRead } from './lib/fs-utils.mjs';

const PRODUCT_NAMES = ['PRODUCT.md', 'Product.md'];
const STRATEGY_NAMES = ['STRATEGY.md', 'Strategy.md'];

const opts = parsePathArgs(process.argv);
const slug = resolveSlug(opts);
const root = workspaceRoot(opts);

if (!slug || !root) {
  console.log('NO_ACTIVE_WORKSPACE');
  console.log(`\nDarin home: \`${darinHome()}\``);
  console.log(`Active in config: \`${activeWorkspaceFromConfig() || '(none)'}\``);
  console.log('\nWorkspaces:');
  const workspaces = listWorkspaces();
  if (workspaces.length === 0) {
    console.log('  (none — run `/darin init` and pick a readable slug, e.g. `acme`)');
  } else {
    for (const w of workspaces) {
      const mark = w.active ? ' ← active' : '';
      console.log(`  - \`${w.slug}\`${mark}${w.has_product ? '' : ' (incomplete)'}`);
    }
  }
  console.log('\nUse an existing workspace: `node workspace.mjs --use <slug>`');
  console.log('Or create: `/darin init` with a new slug.');
  process.exit(0);
}

const productPath = firstExisting(root, PRODUCT_NAMES);

if (!productPath) {
  console.log('NO_PRODUCT_MD');
  console.log(`\nDarin home: \`${darinHome()}\``);
  console.log(`Workspace slug: \`${slug}\``);
  console.log(`Storage: \`${root}\``);
  console.log('\nWorkspaces:');
  for (const w of listWorkspaces()) {
    console.log(`  - \`${w.slug}\`${w.slug === slug ? ' ← selected' : ''}`);
  }
  console.log('\nRun `/darin init` to write PRODUCT.md for this workspace.');
  process.exit(0);
}

const strategyPath = firstExisting(root, STRATEGY_NAMES);
const product = safeRead(productPath, { trim: true, fallback: null });
const strategy = strategyPath ? safeRead(strategyPath, { trim: true, fallback: null }) : null;
const hypotheses = listMd(path.join(root, 'hypotheses'));

console.log('# Darin context\n');
console.log(`Darin home: \`${darinHome()}\``);
console.log(`Workspace slug: \`${slug}\``);
console.log(`Storage: \`${root}\``);
console.log('_Shared across repos — set `active_workspace` in ~/.darin/config.json or `--slug`._\n');
console.log('## PRODUCT.md\n');
console.log(product);
console.log('\n---\n');

if (strategy) {
  console.log('## STRATEGY.md\n');
  console.log(strategy);
  console.log('\n---\n');
} else {
  console.log('## STRATEGY.md\n');
  console.log('_Missing. Run `/darin init` or add STRATEGY.md._\n');
}

if (hypotheses.length) {
  console.log('## What you\'re currently betting on\n');
  for (const f of hypotheses) {
    console.log(`- \`${root}/hypotheses/${f}\``);
  }
}
