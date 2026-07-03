/**
 * Shared session setup for roadmap and next route scripts.
 */
import path from 'node:path';
import { listInsightSessions } from './insights-sessions.mjs';
import { ROADMAP_PATH, readRoadmapSummary, roadmapIsStale } from './roadmap.mjs';
import { workspaceRoot } from './paths.mjs';
import { exitNoActiveWorkspace, parsePositionalRouteArgs } from './route-args.mjs';

export function setupPlanRoute(argv, { positionalKey, positionalFlag }) {
  const args = parsePositionalRouteArgs(argv, { positionalKey, positionalFlag });
  const storageRoot = workspaceRoot(args);
  if (!storageRoot) exitNoActiveWorkspace({ json: args.json });

  const sessions = listInsightSessions(storageRoot);
  const latest = sessions[0] || null;
  const roadmapAbs = path.join(storageRoot, ROADMAP_PATH);
  const roadmap = readRoadmapSummary(roadmapAbs);
  const needs_roadmap = roadmapIsStale(roadmap, latest?.mtime ?? 0);

  return {
    args,
    storageRoot,
    sessions,
    latest,
    roadmapAbs,
    roadmap,
    needs_roadmap,
    positional: args[positionalKey]?.trim() || '',
    insightSessionFields: {
      latest_insights_dir: latest?.session_dir || null,
      index_path: latest?.index_path || null,
      insight_files: latest?.insight_files.map(f => `${latest.session_dir}/${f}`) || [],
      sessions_count: sessions.length,
    },
  };
}

export function noInsightsPayload(setup, message) {
  return {
    error: 'NO_INSIGHTS',
    message,
  };
}
