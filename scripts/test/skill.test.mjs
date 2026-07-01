import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import {
  commandHint,
  commandIds,
  loadCommandMetadata,
  renderCommandsTable,
} from '../lib/commands.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPTS = path.join(REPO_ROOT, 'skill', 'scripts');

test('command metadata has stable order and table rows', () => {
  const meta = loadCommandMetadata(REPO_ROOT);
  const ids = commandIds(meta);
  assert.equal(ids.length, 6);
  assert.ok(ids.includes('prioritize'));
  const table = renderCommandsTable(meta);
  assert.match(table, /`shape`/);
  assert.match(table, /reference\/shape\.md/);
  assert.equal(commandHint(meta).split(' · ').length, 6);
});

test('ingest-route fails without active workspace', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'ingest-route.mjs'), '--json', 'customer interview'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout || result.stderr);
  assert.equal(payload.error, 'NO_ACTIVE_WORKSPACE');
});

test('ingest-route maps interview shape to interviews directory', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  fs.mkdirSync(path.join(root, 'source', 'interviews'), { recursive: true });
  fs.mkdirSync(path.join(root, 'ingestion', 'interviews'), { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'ingest-route.mjs'), '--json', 'user research interview notes'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.shape, 'interview');
  assert.match(payload.paths.source, /^source\/interviews\//);
  assert.match(payload.paths.ingestion, /^ingestion\/interviews\//);
});

test('context-signals reports maintenance fields', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  fs.mkdirSync(path.join(root, 'hypotheses'), { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, 'config.json'), JSON.stringify({ active_workspace: 'acme' }, null, 2));
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');
  fs.writeFileSync(
    path.join(root, 'STRATEGY.md'),
    '# Strategy\n\n## Open tensions\n\n- Bet A vs capacity\n',
  );
  fs.writeFileSync(path.join(root, 'hypotheses', 'invite.md'), '# Invite\n\n## Problem\n\nx\n');

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'context-signals.mjs')],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  const signals = JSON.parse(result.stdout);
  assert.equal(signals.maintenance.decisionDebt.missingMetrics.length, 1);
  assert.equal(signals.maintenance.openTensions.count, 1);
});

test('workspace scaffold creates features directory', async () => {
  const { ensureWorkspaceScaffold } = await import(
    path.join(REPO_ROOT, 'skill', 'scripts', 'lib', 'paths.mjs')
  );
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const prev = process.env.DARIN_HOME;
  process.env.DARIN_HOME = home;
  try {
    const root = ensureWorkspaceScaffold('acme-test');
    assert.ok(fs.existsSync(path.join(root, 'features')));
  } finally {
    if (prev === undefined) delete process.env.DARIN_HOME;
    else process.env.DARIN_HOME = prev;
  }
});

test('build expands commands table placeholder', async () => {
  const { buildProviderSkill } = await import('../lib/build-skill.mjs');
  const { PROVIDERS } = await import('../lib/providers.mjs');
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-build-'));
  const skillDir = buildProviderSkill({ repoRoot: REPO_ROOT, provider: PROVIDERS.cursor, destRoot: out });
  const skill = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
  assert.match(skill, /`shape`/);
  assert.doesNotMatch(skill, /\{\{commands_table\}\}/);
  assert.match(skill, /user-invocable: true/);
  assert.match(skill, /argument-hint:/);
});
