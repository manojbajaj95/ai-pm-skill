/**
 * Next session setup — latest insights session + queue path for needle-move handoff.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parsePathArgs, workspaceRoot } from './lib/paths.mjs';

const INSIGHT_FILE_RE = /^(opportunity|bloat|improvement)-.+\.md$/i;

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function mtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function parseNextArgs(argv) {
  const base = parsePathArgs(argv);
  const out = { ...base, override: '', cwd: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--override' && argv[i + 1]) out.override = argv[++i];
    else if (a === '--cwd' && argv[i + 1]) out.cwd = path.resolve(argv[++i]);
    else if (!a.startsWith('--')) out.override += `${out.override ? ' ' : ''}${a}`;
  }
  return out;
}

function listInsightSessions(root) {
  const insightsDir = path.join(root, 'insights');
  if (!exists(insightsDir)) return [];

  return fs
    .readdirSync(insightsDir)
    .filter(name => {
      const sessionPath = path.join(insightsDir, name);
      try {
        return fs.statSync(sessionPath).isDirectory();
      } catch {
        return false;
      }
    })
    .map(name => {
      const sessionAbs = path.join(insightsDir, name);
      const indexAbs = path.join(sessionAbs, 'run.md');
      const insightFiles = exists(sessionAbs)
        ? fs.readdirSync(sessionAbs).filter(f => INSIGHT_FILE_RE.test(f))
        : [];
      return {
        session_dir: `insights/${name}`,
        index_path: `insights/${name}/run.md`,
        index_abs: indexAbs,
        insight_files: insightFiles.sort(),
        mtime: Math.max(mtime(indexAbs), ...insightFiles.map(f => mtime(path.join(sessionAbs, f)))),
        has_index: exists(indexAbs),
      };
    })
    .filter(s => s.insight_files.length > 0 || s.has_index)
    .sort((a, b) => b.mtime - a.mtime);
}

function readQueueStatus(queueAbs) {
  if (!exists(queueAbs)) return null;
  const content = fs.readFileSync(queueAbs, 'utf8');
  const statusMatch = content.match(/^Status:\s*(.+)$/m);
  const briefMatch = content.match(/^Brief:\s*(.+)$/m);
  const insightMatch = content.match(/^Source insight:\s*(.+)$/m);
  return {
    status: statusMatch?.[1]?.trim() || 'unknown',
    brief_path: briefMatch?.[1]?.trim() || null,
    source_insight: insightMatch?.[1]?.trim() || null,
  };
}

const args = parseNextArgs(process.argv);
const storageRoot = workspaceRoot(args);
const override = args.override.trim();

if (!storageRoot) {
  const err = {
    error: 'NO_ACTIVE_WORKSPACE',
    message: 'Run `/darin init` or set active_workspace in ~/.darin/config.json',
  };
  if (args.json) console.log(JSON.stringify(err, null, 2));
  else console.error(err.message);
  process.exit(1);
}

const sessions = listInsightSessions(storageRoot);
const latest = sessions[0] || null;
const queuePath = 'queue/next.md';
const queueAbs = path.join(storageRoot, queuePath);
const queue = readQueueStatus(queueAbs);

const result = {
  workspace_root: storageRoot,
  cwd: args.cwd,
  override: override || null,
  queue_path: queuePath,
  queue,
  has_active_brief: queue?.status === 'ready' || queue?.status === 'in_progress',
  latest_insights_dir: latest?.session_dir || null,
  index_path: latest?.index_path || null,
  insight_files: latest?.insight_files.map(f => `${latest.session_dir}/${f}`) || [],
  sessions_count: sessions.length,
};

if (!latest) {
  result.error = 'NO_INSIGHTS';
  result.message = 'Run `/darin insights` first — next picks from the latest insight session.';
}

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Queue: ${queueAbs}`);
  if (latest) {
    console.log(`Latest insights: ${path.join(storageRoot, latest.session_dir)}`);
    console.log(`Insight files: ${latest.insight_files.length}`);
  } else {
    console.log(result.message);
  }
  if (override) console.log(`Override: ${override}`);
}

if (!latest) process.exit(1);
