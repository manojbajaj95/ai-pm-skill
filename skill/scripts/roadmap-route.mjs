/**
 * Roadmap session setup — latest insights + roadmap path for rank-and-brief flow.
 */
import path from 'node:path';
import { listInsightSessions } from './lib/insights-sessions.mjs';
import {
  ROADMAP_PATH,
  readRoadmapSummary,
  roadmapIsStale,
} from './lib/roadmap.mjs';
import { parsePathArgs, workspaceRoot } from './lib/paths.mjs';

function parseRoadmapArgs(argv) {
  const base = parsePathArgs(argv);
  const out = { ...base, item: '', cwd: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--item' && argv[i + 1]) out.item = argv[++i];
    else if (a === '--cwd' && argv[i + 1]) out.cwd = path.resolve(argv[++i]);
    else if (!a.startsWith('--')) out.item += `${out.item ? ' ' : ''}${a}`;
  }
  return out;
}

const args = parseRoadmapArgs(process.argv);
const storageRoot = workspaceRoot(args);
const item = args.item.trim();

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
const roadmapAbs = path.join(storageRoot, ROADMAP_PATH);
const roadmap = readRoadmapSummary(roadmapAbs);
const needs_refresh = roadmapIsStale(roadmap, latest?.mtime ?? 0);
const topItem = roadmap.top_queued?.item || roadmap.now?.item || null;
const topBrief = roadmap.top_queued?.brief || roadmap.now?.brief || null;

const result = {
  workspace_root: storageRoot,
  cwd: args.cwd,
  item: item || null,
  roadmap_path: ROADMAP_PATH,
  roadmap,
  needs_refresh,
  top_item: topItem,
  top_has_brief: !!(topBrief && topBrief !== '—'),
  latest_insights_dir: latest?.session_dir || null,
  index_path: latest?.index_path || null,
  insight_files: latest?.insight_files.map(f => `${latest.session_dir}/${f}`) || [],
  sessions_count: sessions.length,
};

if (!latest) {
  result.error = 'NO_INSIGHTS';
  result.message = 'Run `/darin insights` first — roadmap ranks the latest suggestions.';
}

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Roadmap: ${roadmapAbs}`);
  if (latest) {
    console.log(`Latest insights: ${path.join(storageRoot, latest.session_dir)}`);
    console.log(`Suggestions: ${latest.insight_files.length}`);
    console.log(`Needs refresh: ${needs_refresh}`);
  } else {
    console.log(result.message);
  }
  if (item) console.log(`Item: ${item}`);
}

if (!latest) process.exit(1);
