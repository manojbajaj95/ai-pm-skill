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
  assert.ok(ids.includes('insights'));
  assert.ok(ids.includes('roadmap'));
  assert.ok(ids.includes('next'));
  assert.ok(!ids.includes('plan'));
  assert.ok(!ids.includes('prioritize'));
  assert.equal(ids.indexOf('roadmap'), ids.indexOf('insights') + 1);
  assert.equal(ids.indexOf('next'), ids.indexOf('roadmap') + 1);
  const table = renderCommandsTable(meta);
  assert.match(table, /`next`/);
  assert.match(table, /`insights`/);
  assert.match(table, /`roadmap`/);
  assert.match(table, /reference\/next\.md/);
  assert.match(table, /reference\/insights\.md/);
  assert.match(table, /reference\/roadmap\.md/);
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

test('context-signals reports maintenance and loop fields', () => {
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
  assert.ok(signals.loop);
  assert.equal(signals.loop.insights_sessions.length, 0);
  assert.equal(signals.loop.roadmap.exists, false);
  assert.equal(signals.loop.roadmap.needs_roadmap, true);
});

test('workspace scaffold creates roadmap directory', async () => {
  const { ensureWorkspaceScaffold } = await import(
    path.join(REPO_ROOT, 'skill', 'scripts', 'lib', 'paths.mjs')
  );
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const prev = process.env.DARIN_HOME;
  process.env.DARIN_HOME = home;
  try {
    const root = ensureWorkspaceScaffold('acme-test');
    assert.ok(fs.existsSync(path.join(root, 'insights')));
    assert.ok(fs.existsSync(path.join(root, 'roadmap')));
    assert.ok(!fs.existsSync(path.join(root, 'queue')));
  } finally {
    if (prev === undefined) delete process.env.DARIN_HOME;
    else process.env.DARIN_HOME = prev;
  }
});

test('insights-route fails without active workspace', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'insights-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout || result.stderr);
  assert.equal(payload.error, 'NO_ACTIVE_WORKSPACE');
});

test('insights-route returns session paths and nudge catalog', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');

  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-repo-'));
  const result = spawnSync(
    process.execPath,
    [
      path.join(SCRIPTS, 'insights-route.mjs'),
      '--json',
      '--target',
      'pricing',
      '--cwd',
      repo,
    ],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.match(payload.session_dir, /^insights\/\d{4}-\d{2}-\d{2}$/);
  assert.match(payload.index_path, /^insights\/\d{4}-\d{2}-\d{2}\/run\.md$/);
  assert.equal(payload.target, 'pricing');
  assert.equal(payload.cwd, repo);
  assert.ok(Array.isArray(payload.nudges));
  assert.ok(payload.nudges.some(n => n.id === 'positioning'));
  assert.ok(payload.nudges.some(n => n.id === 'trial'));
  assert.equal(payload.source_type, 'codebase');
  assert.ok(!Object.hasOwn(payload, 'discovered_files'));
  assert.ok(!Object.hasOwn(payload, 'recipe'));
});

test('roadmap-route fails without active workspace', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'roadmap-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout || result.stderr);
  assert.equal(payload.error, 'NO_ACTIVE_WORKSPACE');
});

test('roadmap-route fails without insights session', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'roadmap-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.error, 'NO_INSIGHTS');
  assert.equal(payload.roadmap_path, 'roadmap/roadmap.md');
});

test('roadmap-route returns latest insights and needs_roadmap', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  const session = path.join(root, 'insights', '2026-07-02');
  fs.mkdirSync(session, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');
  fs.writeFileSync(path.join(session, 'run.md'), '# Run\n');
  fs.writeFileSync(path.join(session, 'opportunity-trial.md'), '# Trial\n');

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'roadmap-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.latest_insights_dir, 'insights/2026-07-02');
  assert.equal(payload.insight_files.length, 1);
  assert.equal(payload.needs_roadmap, true);
  assert.equal(payload.roadmap.exists, false);
});

test('readRoadmapSummary parses roadmap file', async () => {
  const { readRoadmapSummary } = await import(
    path.join(REPO_ROOT, 'skill', 'scripts', 'lib', 'roadmap.mjs')
  );
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const roadmapAbs = path.join(home, 'roadmap.md');
  fs.writeFileSync(
    roadmapAbs,
    `# Roadmap

Updated: 2026-07-01
From: insights/2026-07-01/run.md

## Now

Status: ready
Item: guest-trial
From suggestion: insights/2026-07-01/opportunity-trial.md
Brief: hypotheses/guest-trial.md

### Hand off

Build guest trial.

## Up next

| # | Item | From suggestion | Brief |
| 1 | pricing | insights/2026-07-01/improvement-pricing.md | — |
`,
  );
  const summary = readRoadmapSummary(roadmapAbs);
  assert.equal(summary.exists, true);
  assert.equal(summary.now.item, 'guest-trial');
  assert.equal(summary.now.status, 'ready');
  assert.equal(summary.up_next_count, 1);
  assert.equal(summary.top_queued.item, 'pricing');
  assert.equal(summary.has_active_handoff, true);
});

test('next-route fails without active workspace', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'next-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout || result.stderr);
  assert.equal(payload.error, 'NO_ACTIVE_WORKSPACE');
});

test('next-route fails without insights session', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'next-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.notEqual(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.error, 'NO_INSIGHTS');
  assert.equal(payload.roadmap_path, 'roadmap/roadmap.md');
});

test('next-route returns latest insights session and roadmap fields', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-test-'));
  const root = path.join(home, 'workspaces', 'acme');
  const session = path.join(root, 'insights', '2026-07-02');
  fs.mkdirSync(session, { recursive: true });
  fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(
    path.join(home, 'config.json'),
    JSON.stringify({ active_workspace: 'acme' }, null, 2),
  );
  fs.writeFileSync(path.join(root, 'PRODUCT.md'), '# Product\n');
  fs.writeFileSync(path.join(session, 'run.md'), '# Run\n');
  fs.writeFileSync(path.join(session, 'opportunity-trial.md'), '# Trial\n');

  const result = spawnSync(
    process.execPath,
    [path.join(SCRIPTS, 'next-route.mjs'), '--json'],
    { env: { ...process.env, DARIN_HOME: home }, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.latest_insights_dir, 'insights/2026-07-02');
  assert.equal(payload.insight_files.length, 1);
  assert.match(payload.insight_files[0], /opportunity-trial\.md$/);
  assert.equal(payload.roadmap_path, 'roadmap/roadmap.md');
  assert.equal(payload.needs_roadmap, true);
});

test('build expands commands table placeholder', async () => {
  const { buildProviderSkill } = await import('../lib/build-skill.mjs');
  const { PROVIDERS } = await import('../lib/providers.mjs');
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'darin-build-'));
  const skillDir = buildProviderSkill({ repoRoot: REPO_ROOT, provider: PROVIDERS.cursor, destRoot: out });
  const skill = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
  assert.match(skill, /`next`/);
  assert.match(skill, /`insights`/);
  assert.match(skill, /`roadmap`/);
  assert.doesNotMatch(skill, /\{\{commands_table\}\}/);
  assert.doesNotMatch(skill, /`plan`/);
  assert.doesNotMatch(skill, /`prioritize`/);
  assert.match(skill, /user-invocable: true/);
  assert.match(skill, /argument-hint:/);
});
