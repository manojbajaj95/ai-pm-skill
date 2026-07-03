/**
 * Shared helpers for listing insight sessions under a workspace.
 */
import fs from 'node:fs';
import path from 'node:path';
import { exists, mtime } from './fs-utils.mjs';

export const INSIGHT_FILE_RE = /^(opportunity|bloat|improvement)-.+\.md$/i;

export function listInsightSessions(root) {
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
      const insightFiles = fs.readdirSync(sessionAbs).filter(f => INSIGHT_FILE_RE.test(f));
      const indexMtime = mtime(indexAbs);
      return {
        session_dir: `insights/${name}`,
        index_path: `insights/${name}/run.md`,
        index_abs: indexAbs,
        insight_files: insightFiles.sort(),
        mtime: Math.max(indexMtime, ...insightFiles.map(f => mtime(path.join(sessionAbs, f)))),
        has_index: indexMtime > 0,
      };
    })
    .filter(s => s.insight_files.length > 0 || s.has_index)
    .sort((a, b) => b.mtime - a.mtime);
}

export function insightSessionsForSignals(root) {
  return listInsightSessions(root).map(s => ({
    dir: s.session_dir,
    has_run: s.has_index,
    insight_count: s.insight_files.length,
    mtime: s.mtime,
  }));
}
