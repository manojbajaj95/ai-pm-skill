/**
 * Shared helpers for listing insight sessions under a workspace.
 */
import fs from 'node:fs';
import path from 'node:path';

export const INSIGHT_FILE_RE = /^(opportunity|bloat|improvement)-.+\.md$/i;

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
